# Csapdák - amiken már elhasaltunk

Valós, éles hibákból gyűjtött szabályok (2026 tavasz-nyár). Mindegyiknél ott a **tünet**, az **ok** és a **szabály**. Ügyfélneveket szándékosan nem tartalmaz (publikus repó).

Ha új hibát javítasz, ide írd fel ugyanebben a formában - ez a rendszer "emlékezete".

---

## A. Pénz és fizetés

### A1. A fizetés rögzítése nem függhet a böngészőtől
- **Tünet:** az ügyfél fizetett, a pénz lement, de se CRM sor, se naptár, se email nem lett.
- **Ok:** a rögzítés csak akkor futott, ha a böngésző visszaért a `*-koszonjuk.html` oldalra és meghívta a `*_confirm` actiont. Mobil Safari kilövi a fület, FB/IG in-app böngésző, megszakadt net, bezárt oldal → a confirm sosem fut.
- **Szabály:** kell szerveroldali **Stripe webhook** backstop. A böngészős confirm marad a gyors UX-hez, de csak a webhookkal együtt megbízható. A confirm legyen idempotens (session_id dedup), és **minden adatot a Stripe session metadatájából** olvasson, ne a kliens `localStorage`-éből.

### A2. Webhook bevezetése után minden `params.X` gyanús
- **Tünet:** bérletvásárlásnál az alkalom levonódott, de a lefoglalt nap nem került se a CRM-be, se a naptárba (később ugyanez a kiegészítő taxinál).
- **Ok:** a webhook hamarabb fut, mint a böngésző, és neki csak a Stripe metadata van. Ami korábban a böngészőtől jött (pl. `pending_booking_time`), az hiányzott. Utána a böngészős hívás a dedup miatt korán visszatért, a jó adat soha nem íródott ki.
- **Szabály:** minden confirm handlerben **minden kliens-paraméter vagy a Stripe session metadatájából jöjjön, vagy legyen metadata-fallbackje.** Ha egy hibaosztályt megtalálsz, keresd meg az ÖSSZES előfordulását, ne csak a bejelentettet.

### A3. A dinamikus ár validációja ugyanazt a számítást használja, mint a checkout
- **Tünet:** kedvezményes bérletnél a Stripe levonta a pénzt, de a visszaigazolás "Fizetési összeg nem egyezik" hibával elutasította a foglalást.
- **Ok:** a checkout a kedvezményes árat vonta le, a confirm az alapárhoz hasonlított.
- **Szabály:** az elvárt árat a checkoutnál **mentsd a Stripe metadatába**, és onnan validálj - ne számold újra két helyen. **Sikeres terhelés UTÁN soha ne dobd el a foglalást validáció miatt**: vagy előbb validálj, vagy fogadd el és jelezd manuális ellenőrzésre.

### A4. A checkout és a confirm UGYANAZT a Stripe kulcsot használja
- **Ok/kockázat:** a Stripe session abban a fiókban létezik, amelyikben létrejött (a bevétel szolgáltatásonként más emberhez megy). Ha a confirm a default kulccsal kérdez, "No such checkout.session" jön, és nincs CRM/email/számla, miközben a pénz lement.
- **Szabály:** mindkét oldalon add át a szolgáltatás nevét a `_getStripeKey()` / `_stripeSessionLekerdezes()` hívásnak. Új szolgáltatásnál a `STRIPE_FIOK` és a `SZAMLAZO_FIOK` táblát együtt írd át.

### A5. Dedup + beszúrás mindig `LockService` alatt; a dedup-jelölőt oda írd, ahol keresed
- **Tünet (potenciális):** amint két forrás hívja ugyanazt a handlert (böngésző + webhook), a "megnézem, van-e már; ha nincs, beszúrom" lock nélkül duplázik. Egy esetben a dedup az "Összes" fül egyik oszlopában keresett session_id-t, de az insert oda csak a `Fizetve` szót írta → a dedup **sosem talált egyezést**.
- **Szabály:** a dedup és az insert egy `LockService` blokkban fusson. Dedup-jelölőnél ellenőrizd, hogy amit KERESEL, azt tényleg oda is ÍRod.

### A6. A CRM sor a legfontosabb - az menjen ELSŐNEK
- **Szabály:** sorrend = állapotmódosítás → CRM írás → naptár → emailek. A naptár és az emailek MINDIG saját `try/catch`-ben, hogy egy `GmailApp` hiba (kvóta, átmeneti hiba) ne vigye el az előttük lévő lépéseket. Átmeneti hibánál a webhook dobjon kivételt (Stripe újrapróbálja).

---

## B. Dátumok

### B1. Mindig `yyyy-MM-dd`, mindig teljes év, szigorú normalizálás
- **Tünet 1:** Timi `6.16.` formában írta a zárt napot → a parse `6-16`-ot csinált → az `_isZarva` összehasonlítás némán sosem működött. Kötelező formátum a Sheetben: `2026.06.16` (vagy valódi Date cella).
- **Tünet 2:** a `toLocaleDateString('hu-HU')` `"2026. 08. 12."`-t ad; a `slice(0, 10)` ebből `"2026. 08. "`-t vág → `new Date('2026. 08. T17:00:00')` = **Invalid Date** → a naptár `createEvent` dob → egy néma `catch` elnyeli → nincs naptáresemény.
- **Szabály:** a normalizáló függvény adjon `null`-t, ha nem `yyyy-MM-dd` (a repóban: `_napkoziTaxiNapNormalizal()`, `_nkNapStr()`). **Soha ne essen vissza a kód a mai dátumra** - inkább ne legyen sor, mint rossz nap. Hiányzó adatnál: `⚠️ IDŐPONT HIÁNYZIK` jelölés a CRM sorban + riasztó email Timinek (`[HIBA]` tárgyú).
- A naptár/menetrend író helperek adjanak vissza `true`/`false`-t, és `false` esetén a hívó küldjön riasztást. Egy `Logger.log('... nem kritikus')` mögé elrejtett hiba addig nem derül ki, amíg az ügyfél nem szól.

### B2. Deduplikációs kulcs = az esemény azonosítója, NEM a mai dátum
- **Tünet:** az oltási emlékeztető minden nap újra kiment, mert a "már küldtük" jelölő a mai dátumot tárolta.
- **Szabály:** a Script Propertiesben a **lejárat dátumát** (vagy foglalás ID-t) tárold. Így csak akkor megy új email, ha az adat tényleg megváltozott.

---

## C. Frontend: néma zsákutcák (a leggyakoribb panaszforrás)

> A felhasználó nem fejlesztő. Ha nem látja, miért nem megy tovább, azt hiszi, elromlott az oldal, és Timi kapja a panaszt.

### C1. Összevont `disabled` feltétel tilos
- **Tünet:** "nem visz el fizetni" - a Fizetek gomb némán le volt tiltva. A leggyakoribb ok egy feltételesen megjelenő kötelező mező (pót elérhetőség) volt, amit a felhasználó átsiklott.
- **Szabály:** a gomb maradjon kattintható; kattintásra **konkrét hiánylista** + `scrollIntoView` + kiemelés az első hiányzó mezőn (a panzió oldal `panzioHianyzoMezok()` a minta). Ha egy mező feltételesen kötelezővé válik, legyen vizuálisan feltűnő.

### C2. Rejtett elemre tett hibajelzés = néma hiba
- **Tünet:** napközi taxis bérletnél "nem történik semmi" a megerősítésre kattintva. A kötelező cím-mező egy elrejtett konténerben volt, a hibajelzés (`focus()`, inline szöveg) is a rejtett elemre ment.
- **Szabály:** a validációs üzenet legyen a gomb fölötti, LÁTHATÓ hibasorban. Egy kötelező mező abban az állapotban is elérhető legyen, amikor kötelezővé válik. Állapot-felülírásnál (backend adat > mentett beállítás) legyen fallback a mentett értékre.

### C3. Néma szűkítés tilos
- **Tünet:** "az időpontot nem engedi választani, csak `00`" - valójában a sávos nyitvatartás utolsó órájánál (11 vagy 17) csak `:00` érvényes, ezt semmi nem magyarázta.
- **Szabály:** ha egy select/naptár dinamikusan kevesebb opciót kínál, **írd mellé, miért**. Összefüggő mezőknél (óra → perc) kell `change` listener a függő mezőre. Egy nem reprodukálható "nem működik" panasz gyakran néma üzleti szabály, nem hiba.

### C4. Üzleti szabályt a backend kényszerít ki, nem a frontend
- **Tünet:** új ügyfél felmérő nélkül fizetett panziót (a frontend csak ajánlásként mutatta a felmérőt, lescrollozva a Fizetek gomb elérhető volt).
- **Szabály:** "X csak Y után" típusú szabályt a **backend checkout handler** kényszerítse ki (direkt POST megkerüli a frontendet). Ha a döntő logika már létezik egy másik handlerben, szervezd helperbe (itt: `_visszateroUgyfelE()`), és használd mindkét helyen. Frontenden tiltott akciónál rejtsd a gombot ÉS tegyél oda hangsúlyos magyarázatot ("nem hiba, ez a következő lépés"), különben "elromlott" lesz belőle.

### C5. Rejtett elemre mutató anchor nem görget
- Ha egy CTA `href="#szekcio"` célja `display:none`, a böngésző nem görget → "a gomb nem működik". Megoldás: JS `onclick`, ami a ténylegesen látható szekcióhoz `scrollIntoView`-ol (`getComputedStyle(el).display !== 'none'` ellenőrzéssel), a `href` marad no-JS fallbacknak. Fix navigációnál kell a `scroll-margin-top`.

### C6. Mobil modal: scroll + sticky action bar kötelező
- **Tünet:** telefonon az oltás-frissítő modalban a Mentés gomb a képernyőn kívülre került, amint a felhasználó fotót választott.
- **Ok:** `position: fixed` overlay + `align-items: center` + hiányzó `overflow-y` → a tartalom KÉT irányba vágódik le, elérhetetlenül. Üres űrlappal a hiba nem jön elő.
- **Recept:** overlay `align-items: flex-start; overflow-y: auto` + padding; panel `margin: auto 0`; gombsor `position: sticky; bottom: 0` teljes szélességű háttérrel. **Tesztelj 320-375 px-en és a mezők kitöltése UTÁNI állapotban.**

### C7. Mobil naptár-grid kilóg
- Grid itemeknek mobilon adj `min-width: 0`-t. `aspect-ratio` + `min-height` egy grid cellán implicit min-width-et okoz. A body `overflow-x: hidden` csak eltakarja a túllógást, a layout-csúszást nem oldja meg.

---

## D. Fájlfeltöltés (oltási fotók)

- **Fájlt kiválasztáskor olvass be és cache-eld base64-ként**, ne submit-kor: mobilon a `File` handle elavulhat, felhős (nem letöltött) fotónál és FB/Messenger/Instagram in-app böngészőben submit-kor már olvashatatlan (`FileReader.onerror`).
- **In-app böngésző:** detektáld a userAgentet (`FBAN|FBAV|Instagram|Messenger`) és jelezz: "nyisd meg Chrome-ban/Safariban".
- **Kép-feldolgozás fallback lánc:** `createImageBitmap` (Safari a HEIC-et is dekódolja) → `Image` + canvas → **nyers pass-through**. A GAS a `data:<mime>` prefixből olvassa a típust (HEIC/PDF is megy). Sose dobj hibát a felhasználóra HEIC vagy nagy kép miatt.
- **Hiba esetén SOHA ne ürítsd ki a fájl inputot.** Egyszer ez végtelen hurkot okozott: a hiba kiürítette az inputot → a submit újra fotót kért → ugyanaz.
- **Kötelező feltöltésnek pótlási út is kell:** ha a fotó kötelező, legyen látható "hiányzik → Fotó feltöltése" gomb a profilban. Különben a felhasználó törli és újra felveszi a kutyát, hogy kikerülje a falat.
- **Android 13+:** `accept="image/*"` a rendszer Photo Pickerét nyitja, ami csak galéria. Közvetlen fotózáshoz két explicit gomb kell ("📷 Fotózás" `capture="environment"`-tel és "🖼 Galériából"), egy rejtett inputon a `capture` attribútum dinamikus állításával.
- **Timeout ≠ siker.** Egyszer a 30 mp utáni abort "sikernek" lett könyvelve → a felhasználó token nélkül "bejelentkezve" maradt. Most 120 mp a timeout és nincs hamis siker. A kliens-oldali hibákat logold (`kliens_hiba` action → ⚠️ Hibák fül: fájltípus, méret, userAgent) - reprodukció nélkül csak tippelsz.

---

## E. Session / bejelentkezés

- **Csúszó (sliding) session kell, nem fix lejárat.** Egy fix 30 napos token a visszatérő ügyfelet foglalás közben dobta ki. Most: `token_refresh` action, 90 napos ablak, a `main.js` oldalbetöltéskor (max 12 óránként) csendben megújít.
- A frontend lejárat-ellenőrzés **ne függjön egy opcionális mező létezésétől** (pl. `token_created`): hiányzó mezőnél is újítson, ne tartsa örökké bejelentkezve a felhasználót.
- A kijelentkeztetés oldalbetöltéskor (művelet ELŐTT) történjen, ne submit közben.

---

## F. Hibakeresés

1. **Először az élő adat, aztán a kód.** Nézd meg a Google Sheetet (a CRM), a böngészőt (JS console, hálózati hívások), az Apps Script **Executions** naplót. Kódolvasásból bármihez lehet hihető okot gyártani - egy "pénteki napközi nincs a CRM-ben" panasznál a sor végig ott volt, csak lejjebb (a fülek beszúrási sorrendben állnak).
2. **Tisztázd, melyik felületet nézi a bejelentő.** A "CRM" = a Google Sheet.
3. **Egy nem reprodukálható panasz gyakran nem bug, hanem néma üzleti szabály** (lásd C3). Kérj képernyőképet.
4. **Push után ellenőrizd élőben.** Egyszer a GitHubon a régi verzió futott, mert a helyi módosítás nem volt pusholva ("de nálam működik").
5. **Egy hibaosztályt keress végig az egész kódban**, ne csak a bejelentett példányt.

---

## G. Kis szabályok, amik mégis sokat számítanak

- Több kutya: mindig `.map(k => k.nev).join(', ')`, soha `[0].nev`.
- Online és KP ág: minden új logika MINDKETTŐBE. A `*-koszonjuk.html` oldalak KP esetben nem kapnak Stripe `session_id`-t - kezelni kell (`?kp=1`).
- Taxi menetrend: MINDEN panzió/napközi ágban (online + KP) rögzíteni kell.
- Új sheet oszlop: írás ÉS olvasás (`getValues` index) is.
- Az email szöveg, a CRM megjegyzés és a naptár leírás ugyanazt az időpontot/címet mondja.
- A `TANFOLYAM_SETUP()` kitörli a Tanfolyamok fül összes sorát.
- Gmail naptárcsatolmány: `METHOD:PUBLISH` + sima Google Naptár link (lásd ARCHITEKTURA.md).
- Marketing szövegben **ne találj ki adatokat** (számok, statisztikák, ügyfél-referenciák). Magyar szövegben sima `-` kötőjel, nem em-dash.
