# Architektúra - a rendszer 5 rétege

Wanderdogs World (wanderdogsworld.hu) - kutyaiskola, napközi, panzió, kutyataxi, tanfolyamok. Tulajdonos: Kucsera Tímea (Timi).

```
Ügyfél böngészője
   │  (statikus HTML/JS, GitHub Pages)
   ▼
Google Apps Script web app  ──►  Stripe (fizetés)  ──► Stripe webhook ─┐
   │  doPost(action=...)                                              │
   │◄─────────────────────────────────────────────────────────────────┘
   ├──► Google Sheet "Wanderdogs CRM"   (adatbázis ÉS a CRM)
   ├──► Gmail (GmailApp)                (ügyfél + Timi értesítés)
   ├──► Google Naptár (CalendarApp)     (napközi/panzió, egyéni, taxi)
   └──► Google Drive                    (oltási fotók)
```

## 1. Weboldal (frontend)

- Sima statikus HTML + inline `<style>` + inline `<script>`, framework nélkül. Közös részek: `css/styles.css`, `js/main.js`.
- Hosting: **GitHub Pages**, a `main` branch. Push után 1-3 percen belül élesedik. A domain a `CNAME` fájlból jön.
- Minden oldal egyetlen Apps Script web appot hív, JSON `POST`-tal, `{ "action": "...", ... }` formában. Az `/exec` URL kézzel be van égetve az oldalakba (kb. 22 helyen), ezért **ha új GAS telepítés URL-t változtat, minden fájlban cserélni kell**. (Új *verzió* telepítése ugyanarra az URL-re nem változtat URL-t.)
- Oldalak: `index`, `napkozi`, `panzio`, `kutyataxi`, `csoportos`, `egyeni-ora`, `kutyatura`, `tanfolyamok`, `workshopok`, `viselkedesterapia`, `orzo-vedo`, `vip`, `gyik`, `rolunk`, valamint `regisztracio`, `bejelentkezes`, `profil`, `jelszo-reset`, és `*-koszonjuk.html` (fizetés utáni visszaigazoló oldalak).
- Bejelentkezés: a böngésző `localStorage`-ában van a `wd_user` (név, email, kutyák, `auth_token`, `token_created`). A `js/main.js` `wdGetUser()` / `wdRefreshToken()` kezeli. Más `localStorage` kulcsok: `wd_napkozi_prefs`, `wd_pending_booking`, `wd_pending_tipus`, `wd_pot_elerhetoseg`, `wd_taxi_kieg_*`.
- Külső szolgáltatás a frontendben: **Cal.com** a napközi ingyenes felmérőhöz (`napkozi-ingyenes-felmeres`), ennek webhookja a GAS-ba érkezik (az ingyenes felmérő a Napközi fülre ír).

## 2. Backend: Google Apps Script (GAS)

Egyetlen nagy projekt (~11 000 sor, ~210 függvény). **A forráskód nincs a repóban** (a `scripts/` mappa szándékosan `.gitignore`-ban van, mert a repó publikus). Lásd: [MUNKAMENET.md](MUNKAMENET.md).

### Belépési pontok

- `doPost(e)` - a dispatcher. Először a Stripe webhookot ellenőrzi (`?wh_secret=` query paraméter → `_stripeWebhookHandler`), utána JSON-t parse-ol, sanitizálja a szöveges mezőket, rate limitet alkalmaz (30 kérés/perc/email), és az `action` alapján továbbad.
- `doGet(e)` - csak a marketing leiratkozási link (`action=marketing_leiratkozas`).
- Időzített triggerek: `napiKarbantartas()` (naponta reggel 6-7: CRM színezés, oltási emlékeztetők, esemény-emlékeztetők), `onboardingAutomatizacio()` (naponta ~9:00, onboarding emailsorozat). Régebbi form-triggerek: `onFormSubmit`, `onWebsiteFormSubmit`.

### Az `action` értékek (doPost)

| Terület | Action-ök |
|---------|-----------|
| Fiók | `regisztracio`, `bejelentkezes`, `token_refresh`, `jelszo_reset_keres`, `jelszo_reset_vegrehajt`, `kutya_hozzaad`, `kutya_torol`, `kutya_adatok_frissites`, `oltas_frissites`, `gazdi_frissites`, `fiok_torles` |
| Panzió | `panzio_checkout`, `panzio_confirm`, `panzio_taxi_check`, `panzio_taxi_checkout`, `panzio_taxi_confirm` |
| Napközi | `napkozi_idopontok`, `napkozi_checkout`, `napkozi_berlet_confirm`, `napkozi_egyszeri_confirm`, `berlet_check`, `berlet_foglalas`, `napkozi_pending_email` |
| Egyéni óra | `egyeni_idopontok`, `egyeni_checkout`, `egyeni_confirm` |
| Csoportos / túra | `csoportos_check/checkout/confirm`, `kutyatura_check/checkout/confirm` |
| Események (Sheets-vezérelt) | `tanfolyam_*`, `workshop_*`, `tura_*` (mindegyikből `_check`, `_checkout`, `_confirm`) |
| Őrző-védő | `orzovedo_jelentkezes` |
| Ellenőrzések | `zarva_check`, `tiltolista_check`, `foglalas_check`, `kedvezmeny_check`, `tanfolyam_kedvezmeny_check`, `napkozi_kedvezmeny_check` |
| Diagnosztika | `kliens_hiba` (kliens-oldali hibák a `⚠️ Hibák` fülre) |

**Névkonvenció:** `_` előtag a privát helperekhez (pl. `_panzioCrmBeIras`). A mintázat szolgáltatásonként: `*_checkout` (Stripe session létrehozás) → fizetés → `*_confirm` (CRM + email + naptár rögzítés). A confirm **idempotens** (session_id dedup), mert két forrás is hívja: a böngésző a köszönjük oldalról, és a Stripe webhook.

### Script Properties (a titkok helye - az értékek NEM kerülnek ide)

`SHEET_ID`, `SITE_URL`, `TIMI_EMAIL`, `AUTH_SECRET` (a bejelentkezési token aláírása), `STRIPE_WH_SECRET` (a webhook közös titka), Stripe kulcsok személyenként (`STRIPE_KEY_DAVID` / `STRIPE_SECRET_KEY`, `STRIPE_KEY_TIMI`, `STRIPE_KEY_VIKI`), `MARKETING_TOKEN_SECRET`, `EGYENI_CALENDAR_ID`, `TAXI_CALENDAR_ID`, `NAPKOZI_PANZIO_CALENDAR_ID`, `NAPKOZI_CALENDAR_ID`, `OLTASI_FOLDER_ID` (Drive mappa az oltási fotóknak), `FORM_ID`, `KUTYATURA_DATUM`, `KUTYATURA_HELYSZIN`. A Számlázz.hu kulcsok is Script Properties-ben vannak (a nevek a kód `SZAMLAZO_PROP` táblájában).

> A Gmail OAuth scope `mail.google.com` - **ne csökkentsd `gmail.send`-re** (egy korábbi session-ben derült ki, hogy a szűkebb scope-pal a rendszer nem működik jól).

## 3. CRM = a Google Sheet "Wanderdogs CRM"

Amikor Timi vagy Viki azt mondja "a CRM", **magát a Google Sheetet** értik. Ez egyben az adatbázis is. (Létezik egy régi, saját webapp-os "CRM dashboard" a fejlesztő gépén, ami **nincs publikálva és nem használják** - arra hivatkozó panaszt ne diagnosztizálj.)

A fülek nevei a GAS `LAPOK` konstansában vannak (emoji + név):

| Fül | Mi |
|-----|----|
| 📋 Összes érdeklődő | minden foglalás összesítve (közös "bejövő" lista) |
| 🏨 Panzió, 🏫 Napközi, 🎯 Egyéni óra, 🐶 Csoportos tanfolyam, 🚐 Kutyataxi, 👑 VIP, 🧠 Viselkedésterápia, 🥾 Wander kutyás túra, 🛡️ Őrző-védő | szolgáltatásonkénti foglalások |
| 📅 Napközi Bérletek | bérletek, felhasznált/maradék alkalom, lejárat |
| 🔐 Felhasználók | regisztrált ügyfelek: jelszó-hash, kutyák, oltások, számlázási cím (**személyes adat!**) |
| 🚐 Taxi Menetrend | az összes taxis nap központi listája |
| ⏸️ Zárt Napok | szolgáltatásonként max 3 zárt időszak (`2026.06.16` formában, teljes évvel!) |
| 🚫 Tiltólista | blokkolt email+kutya párosítások |
| 👥 Régi ügyfelek | a régi rendszerből átvett ügyfelek ("visszatérő" felismeréshez) |
| 📚 Tanfolyamok / 🎪 Workshopok / 🥾 Túrák + a hozzájuk tartozó "Foglalások" fülek | **Timi szerkeszti**; a weboldali kártyák, árak, emailek innen jönnek |
| 🏷️ Kedvezmények | email → kedvezmény % |
| ⏳ Napközi Függő | fizetésre váró foglalások (24 órás) |
| ⚠️ Hibák | kliens-oldali hibák naplója |

Fontos tudnivalók:

- A szolgáltatás-fülek **beszúrási sorrendben** állnak, nem dátum szerint (`_insertAtTop` mindig a 2. sorba ír). Egy adott nap foglalásai ezért szét vannak szórva - attól még megvannak.
- Új oszlopnál **az írás ÉS az olvasás helyét is** át kell nézni (az olvasás `getValues` indexekkel megy, ezek elcsúsznak).
- Az oszlopok pontos sorrendje a GAS-ban az `*_CrmBeIras` / `_insertAtTop` hívásokban és a `tabKonfigok`-ban van. Ha dokumentációra támaszkodsz, ellenőrizd az élő Sheet fejlécével - egy-egy oszlopot kézzel adtak hozzá a Sheethez a kódtól függetlenül.
- Az "📋 Összes érdeklődő" oszlopai: A dátum, B név, C telefon, D email, E-G kutya 1-3, H szolgáltatás(ok), I megjegyzés, J taxi cím (**csak cím, nem fizetési mód**), K szolgáltatás dátuma.

## 4. Emailek

`GmailApp.sendEmail()` hívások a GAS-ban. Minden foglalásnál két email:
1. **Ügyfélnek** visszaigazolás,
2. **Timinek** értesítés (a `TIMI_EMAIL` címre).

Plusz: oltási emlékeztetők (30 nappal lejárat előtt és lejárat után; deduplikálva a lejárat dátumával), esemény-emlékeztetők, onboarding-sorozat, jelszó-reset.

Naptárfájl (`.ics`) a levelekben: a Gmail elnyeli a `METHOD:REQUEST` fájlt - `METHOD:PUBLISH` kell, `ATTENDEE` nélkül, a blob contentType legyen simán `text/calendar`, és mellé mindig tegyél egy sima Google Naptár linket is. (A csoportos, kutyatúra és őrző-védő levelek még a régi módszert használják - javításra vár.)

## 5. Naptár

`CalendarApp`, három naptár: **Napközi & Panzió**, **Egyéni** (az ütközés-ellenőrzés csak ezzel megy), **Taxi**. Esemény-elnevezések: `[kutya neve] panzió`, `[kutya neve] - panzió elhozás - [cím]`, `[kutya neve] - panzió hazavivés - [cím]`.

## Pénz: Stripe és számlázás

- A bevétel **szolgáltatásonként más emberhez megy**. A GAS `STRIPE_FIOK` táblája: panzió → Timi, napközi és panzió-taxi → Viki, egyéni óra / csoportos / kutyatúra / tanfolyam / workshop → Dávid. A `SZAMLAZO_FIOK` tábla (Számlázz.hu) ugyanígy szétválik - **a két táblát mindig együtt írd át**.
- Nincs néma fallback a "default" kulcsra: hiányzó kulcsnál inkább hibázzon a checkout, mint hogy a pénz a rossz emberhez menjen.
- **A Stripe session abban a fiókban létezik, amelyikben létrejött.** A checkoutnak és a confirmnak UGYANAZT a szolgáltatás-nevet kell átadnia a kulcs-lekérdezésnek, különben a confirm "No such checkout.session" hibát kap, miközben a pénz lement.
- Stripe webhook: `<GAS /exec URL>?wh_secret=<STRIPE_WH_SECRET>`. A GAS `doPost` nem lát HTTP headert, ezért nincs `Stripe-Signature` ellenőrzés; a bizalmi horgony a `wh_secret` + az, hogy a confirm újra lekéri a sessiont a Stripe API-tól és `payment_status === 'paid'`-et vár. Átmeneti hibánál a webhook handler szándékosan dob kivételt (GAS 500), hogy a Stripe újrapróbálja.
- Számla csak akkor áll ki automatikusan, ha a 🔐 Felhasználók fülön megvan a vevő neve és teljes címe. Egyébként Timi hibaértesítőt kap és kézzel számláz.

## Szolgáltatások rövid térképe

| Szolgáltatás | Fizetés | Főbb sajátosság |
|---|---|---|
| Panzió | Stripe (előleg) vagy KP | Új ügyfélnek kötelező ingyenes felmérő előbb (backend is kikényszeríti); taxi opció; több kutya; oltás-ellenőrzés |
| Napközi | Bérlet (Stripe/KP) vagy egyszeri | Bérlet kitolódik, ha a kutya panzióban volt; kedvezmény; sávos nyitvatartás (pl. szombat 11:00 és 17:00); taxi (km-sávos ár) |
| Kutyataxi | a panzióval/napközivel együtt, vagy kiegészítő | `TAXI_MENETREND` fül + taxi naptár; MINDKÉT ágban (online + KP) rögzíteni kell |
| Tanfolyam / workshop / túra | Stripe | Teljesen Sheets-vezérelt (lásd lent) |
| Egyéni óra, VIP, terápia, őrző-védő | Stripe / jelentkezés | Egyéni naptár ütközés-ellenőrzés |

### Tanfolyamok Sheets-vezérelt rendszere

Dátum, ár, időpont **csak a Sheet "📚 Tanfolyamok" fülén** él, a kódban nincs. Oszlopok: ID, Cím, Kezdés dátuma, Alkalmak, Nap, Időpont, Ár (Ft), Max férőhely, Leírás, Aktív, Kép.

- Az **ID kötelező**, és `wp-` (Puppy) vagy `wa-` (Alapozó) kezdetű - ebből dönti el a rendszer, melyik emailt küldje. Üres ID-nál a kártya látszik, de a foglalás elhasal.
- A férőhely **kutyában** értendő (két kutya = két hely, és az ár is kutyánként megy).
- Az `Aktív` = `IGEN` teszi láthatóvá.
- A `TANFOLYAM_SETUP()` függvény **kitörli a fül összes sorát** és újraírja a kódban lévő listát. Csak akkor futtasd, ha nincs élő foglalás.
- Tesztelni ne a valódi tanfolyam árának átírásával tedd (bárki megvehetné): vegyél fel `wp-teszt-1` ID-jű sort, 500 Ft-tal (a Stripe forintos minimuma miatt 100 Ft kevés). Utána a teszt foglalást a "Foglalások" fülről is töröld, különben az az email-cím ki lesz zárva (egy cím nem foglalhat kétszer ugyanarra).

## Minden változtatásnál ellenőrző lista

1. **CRM** - melyik fülre kerül sor? Az új mező szerepel a fejlécben, az írásban ÉS az olvasásban?
2. **Email az ügyfélnek** - szerepel az új info?
3. **Email Timinek** - szerepel az új info?
4. **Naptár** - kell esemény? Az új adat bekerül a leírásba/címbe?
5. **Taxi Menetrend** - ha taxi érintett, MINDKÉT ágban (online + KP) megvan?
6. **📋 Összes érdeklődő** - ide is bejön az adat?
7. **Online ÉS KP ág**, **böngészős confirm ÉS webhook útvonal**.
8. **Több kutya** - `.map(k => k.nev).join(', ')`, sose `[0]`.
