# Email-katalógus

Minden email a GAS-ból megy `GmailApp.sendEmail()`-lel, a Wanderdogs Gmail fiókjából (a Script tulajdonos fiókja). A törzsszöveg sima szöveg, amit az `emailToHtml()` alakít HTML-lé (`htmlBody`). Timi értesítései a `CONFIG.TIMI_EMAIL` címre mennek.

> A tárgyak a kód állapotát tükrözik (2026-10-22). Ha egy tárgyat átírsz, nézd meg, hogy nem függ-e tőle valami: **az oltási emlékeztető dedupja a tárgy szövegére keres a Gmailben** (lásd lent).

## Szabályok az emaileknél

1. Minden foglalásnál **két levél** megy: ügyfélnek visszaigazolás + Timinek értesítés. Új szolgáltatásnál mindkettőt meg kell írni.
2. Ami az emailben szerepel (időpont, cím, ár), egyezzen a CRM megjegyzéssel és a naptár leírásával.
3. Az emailküldés a foglalási handlerben **a CRM-írás UTÁN, saját `try/catch`-ben** legyen: egy Gmail hiba (kvóta) ne vigye el a foglalást. Lásd CSAPDAK.md A6.
4. Gmail napi küldési korlát van (ingyenes fiók: ~100 címzett/nap, Workspace: ~1500). Sok emailt generáló új funkciónál (tömeges emlékeztető, hírlevél) ezt számold ki.
5. Naptárcsatolmány (`.ics`): `METHOD:PUBLISH` + sima Google Naptár link (lásd ARCHITEKTURA.md).
6. Magyar szöveg, tegező hang, sima `-` kötőjel.

## Ügyfélnek menő levelek

| Esemény | Függvény | Tárgy |
|---|---|---|
| Regisztráció | `_regisztracioHandler` | Üdvözlünk a Wander Dogs World-ben! |
| Onboarding 1. levél (regisztráció után ≥1 nap) | `_onboardingSorozatEllenorzes` | Ki vagyok én? Mi a Wander Dogs filozófiája? |
| Onboarding 2. levél (≥3 nap) | ugyanaz | Miért nem működnek a gyors megoldások? - a Wander Dogs Módszer alapelvei |
| Onboarding 3. levél (≥7 nap) | ugyanaz | Hogyan lesz valódi eredmény? |
| Jelszó-visszaállítás | `_jelszoResetKeresHandler` | [Wanderdogs] Jelszó visszaállítás |
| Panzió foglalás | `_panzioEmailKuldes` | Wander Dogs - Panzió foglalás megerősítve |
| Panzió kiegészítő taxi | `_panzioTaxiEmailGazdi` | Wander Dogs - Panzió kiegészítő taxi megrendelve |
| Napközi bérlet, online fizetés | `_napkoziBerletConfirmHandler` | [Wanderdogs] Napközi bérlet aktiválva - {bérlet neve} |
| Napközi bérlet, készpénzes | `_napkoziCheckoutHandler` | [Wanderdogs] Napközi bérlet - készpénzes |
| Napközi egyszeri, online | `_napkoziEgyszeriConfirmHandler` | [Wanderdogs] Napközi egyszeri alkalom - fizetve (taxi esetén: Kiegészítő taxi - fizetve) |
| Napközi egyszeri, készpénzes | `_napkoziCheckoutHandler` | [Wanderdogs] Napközi egyszeri - készpénzes |
| Napközi foglalás bérletből | `_berletFoglalasHandler` | [Wanderdogs] Napközi foglalás visszaigazolva |
| Bérlet kitolódott panzió miatt | `_berletKitolodas` | [Wanderdogs] Napközi bérlet kitolódott {n} nappal |
| Napközi időpont beérkezett, fizetés kell | `_napkoziFoglalasPendingHandler` | [Wanderdogs] Napközi időpontod beérkezett - fizetés szükséges |
| Napközi függő foglalás 24 óra után még nem fizetett | `checkNapkoziPending` | [Wanderdogs] Napközi időpontod még nincs aktiválva |
| Napközi emlékeztető (előző nap) | `sendNapkoziEmlekeztetok` | [Wanderdogs] Holnap várjuk {kutya}-t! (törzs 3 változat: sima / reggeli taxival / hazahozás) |
| Egyéni óra | `_egyeniEmailek` | [Wanderdogs] Foglalás visszaigazolva - {esemény} |
| Cal.com foglalás (felmérő, stb.) | `_calBookingHandler` | [Wanderdogs] Foglalás visszaigazolva - {esemény} (terápiánál: ... - Viselkedésterápia) |
| Csoportos | `_csoportosEmailGazdi` | Wander Dogs - Csoportos foglalás megerősítve |
| Kutyatúra | `_kutyaturaEmailGazdi` | Wander Dogs - Kutyatúra foglalás megerősítve |
| Tanfolyam / workshop / túra (Sheets-vezérelt) | `_esemenyEmailGazdi`, tanfolyamnál `_tanfolyamEmailGazdi` | Wander Dogs - {típus} visszaigazolás: {esemény}; tanfolyamnál: Wander Dogs - visszaigazolás: {cím} |
| Esemény emlékeztető (2 nappal előtte) | `_esemenyEmlekeztetok` | Wander Dogs - Emlékeztető: {esemény} holnapután |
| Őrző-védő jelentkezés rögzítve | `_orzoVedoBookingHandler` | [Wanderdogs] Őrző-védő foglalás rögzítve - {szombat} |
| Őrző-védő alkalom megerősítve (≥2 jelentkező) | ugyanaz | [Wanderdogs] Őrző-védő oktatás megerősítve - {szombat} |
| Őrző-védő előző napi: megtartjuk | `orzoVedoEloreEmlekezteto` | [Wanderdogs] Holnap MEGTARTJUK az őrző-védő oktatást! |
| Őrző-védő előző napi: elmarad (<2 jelentkező) | ugyanaz | [Wanderdogs] Holnapi őrző-védő oktatás elmarad |
| Oltás lejárt | `_oltasiEmlekeztetoEllenorzes` | [Wanderdogs] Lejárt oltási könyv - {kutya} |
| Oltás 30 napon belül lejár | ugyanaz | [Wanderdogs] Oltási könyv hamarosan lejár - {kutya} |
| Régi webes érdeklődő űrlap | `emailKuldes`, `websiteEmailKuldes` | Wander Dogs - Köszönjük az érdeklődést! / Wander Dogs - {szolgáltatás} - Köszönjük! |

## Timinek menő értesítések

| Esemény | Függvény | Tárgy |
|---|---|---|
| Új regisztráció (régi ügyfélnél 🔄 jelzéssel) | `_regisztracioHandler` | Új regisztráció: {név} - {kutyák} / 🔄 RÉGI ügyfél: ... |
| Panzió foglalás | `_panzioTimiErtesites` | [Panzió] Új foglalás: {név} - {érkezés} → {távozás} |
| Panzió taxi | `_panzioTaxiEmailTimi` | [Panzió taxi] {név} - Fizetve |
| Napközi bérlet online | `_napkoziBerletConfirmHandler` | [ÚJ BÉRLET] {név} - {bérlet} |
| Napközi bérlet KP | `_napkoziCheckoutHandler` | [ÚJ BÉRLET KP] {név} - {bérlet} |
| Napközi egyszeri online | `_napkoziEgyszeriConfirmHandler` | [Napközi egyszeri] {név} - Fizetve; taxinál [Kiegészítő taxi] ...; hiányzó időpontnál **[HIBA] Kiegészítő taxi - hiányzó időpont** |
| Napközi egyszeri KP | `_napkoziCheckoutHandler` | [ÚJ NAPKÖZI KP] {név} - egyszeri |
| Napközi foglalás bérletből | `_berletFoglalasHandler` | [Napközi foglalás] {név} - bérletből levonva |
| Bérlet kitolódás | `_berletKitolodas` | [WD Admin] Bérlet kitolódott: {név} +{n} nap |
| Fizetetlen függő foglalás | `checkNapkoziPending` | [Wanderdogs] (!) Nem fizetett napközi foglalás - {név} |
| Egyéni óra | `_egyeniEmailek` | [Wanderdogs] Új egyéni foglalás: {név} - {esemény} |
| Cal.com foglalás | `_calBookingHandler` | [Cal.com] Új foglalás: {név} - {esemény} |
| Csoportos / kutyatúra | `_csoportosEmailTimi`, `_kutyaturaEmailTimi` | [Csoportos] {név} - {n} kutya, {dátum} / [Kutyatúra] ... |
| Tanfolyam / workshop / túra | `_esemenyEmailTimi` | [{típus}] {név} - {esemény}, {dátum} |
| Őrző-védő | `_orzoVedoBookingHandler`, `orzoVedoEloreEmlekezteto` | [Őrző-védő] Új foglalás / Alkalom megerősítve / Holnap MEGTARTJUK / Holnap NEM TARTJUK |
| Oltás lejárt / hamarosan lejár | `_oltasiEmlekeztetoEllenorzes` | [WD Admin] Lejárt oltás: ... / [WD Admin] Oltás hamarosan lejár: ... |
| Régi weboldal űrlap | `timiErtesites`, `websiteTimiErtesites` | [Wander Dogs] Új érdeklődő: ... / [Website] Új érdeklődő: ... |

## Riasztó emailek Timinek (hibák és kivételek - ezekre figyelj)

| Tárgy | Mikor |
|---|---|
| [HIBA] Taxi naptár bejegyzés nem jött létre - {név} | a taxi naptáresemény létrehozása elbukott (pl. hiányzó/hibás nap) - kézzel pótolandó |
| [Wanderdogs] Automatikus számla SIKERTELEN - kézi számla kell | a Számlázz.hu számlakiállítás elbukott (leggyakrabban hiányzó számlázási cím a Felhasználók fülön) |
| [Figyelmeztetés] Panzió kapacitás tele! | valaki foglalni próbált, de nincs szabad hely |
| [WD FIGYELEM] Egyéni óra ÜTKÖZÉS: {név} | ütköző időpont az egyéni naptárban |
| [WD FIGYELEM] Őrző-védő foglalás ZÁRT napon: {név} | zárt napra érkezett foglalás |
| [WD Admin] Tiltott ügyfél foglalása: {név} | tiltólistás email próbált foglalni (Cal.com ág) |
| [WD Admin] Lejárt oltással foglalás: {név} | lejárt/hiányzó oltással érkezett foglalás (Cal.com ág) |
| [Wanderdogs] Hiba a website form feldolgozásánál / HIBA a bejelentkezés feldolgozásánál | régi űrlap-feldolgozó hibája |

## Időzített levelek és a triggerek

A kódban csak ezek a triggerek vannak beállítva programból: `onboardingAutomatizacio` (naponta ~9:00; `_onboardingTriggerBeallitas()`), `onFormSubmit`, `onWebsiteFormSubmit`. A többit **kézzel, az Apps Script Triggers menüben** kell felvenni - ha valaki újra létrehozza a projektet vagy véletlenül törli a triggert, a levelek **csendben leállnak**:

| Függvény | Javasolt beállítás (a kód kommentje szerint) | Mit küld |
|---|---|---|
| `napiKarbantartas` | napi, reggel 6-7 | CRM színezés + oltási emlékeztetők + esemény-emlékeztetők (2 nappal előtte) |
| `sendNapkoziEmlekeztetok` | napi, 20-21 óra között | holnapi napközi emlékeztető |
| `checkNapkoziPending` | 2 óránként | 24 órája fizetésre váró napközi foglalások |
| `orzoVedoEloreEmlekezteto` | napi (péntek este / szombat reggel) | őrző-védő megtartjuk / elmarad |
| `onboardingAutomatizacio` | napi ~9:00 | onboarding sorozat |

**Ellenőrzendő:** az Apps Script → Triggers (óra ikon) listája, hogy ezek tényleg fent vannak-e (a kód nem bizonyítja).

## Deduplikáció (hogy ne menjen ki kétszer ugyanaz)

- **Oltási emlékeztetők:** `GmailApp.search('to:... subject:"..."')` - ha a fiókban már van ilyen tárgyú küldött levél, nem megy újra. Következmények: (1) ehhez kell a teljes Gmail scope (`mail.google.com`), ezért nem szabad `gmail.send`-re csökkenteni; (2) a tárgy **nem tartalmaz dátumot**, ezért ha ugyanannak a kutyának jövőre újra lejár az oltása, a régi levél miatt **nem megy új emlékeztető**, amíg a régi levelet nem törlik a Gmailből - ismert korlát, javításra érdemes (pl. a lejárat dátumát tedd a tárgyba, vagy Script Properties-ben tárold a lejárat dátumát); (3) a tárgy átírása újra kiküldeti az összes meglévő emlékeztetőt.
- **Onboarding:** a Felhasználók fülön a "Welcome lépés" (1-4) és az "Onboarding leiratkozott" oszlop vezeti. A levelek tartalmazzák a leiratkozási linket (`doGet` `marketing_leiratkozas`, `MARKETING_TOKEN_SECRET`-tel aláírt token). A foglalási levelek ettől függetlenül mennek.
- **Foglalás-visszaigazolások:** a confirm handlerek `session_id` deduppal futnak, így a böngésző + webhook kettős hívás nem küld két levelet (a dedup a CRM-írás körül van, `LockService` alatt).

## Új email hozzáadása - ellenőrző lista

1. Ügyfél-levél ÉS Timi-levél is megvan?
2. Online ÉS KP ág is küldi?
3. A webhook útvonalon is megvan minden adat (Stripe metadata), vagy csak a böngészőből jövő paraméter?
4. A dedup kulcs az esemény azonosítója, nem a mai dátum?
5. `try/catch` mögött van, és a CRM-írás előtte történt?
6. Be kell-e kötni időzített triggerre - és felvetted-e kézzel a Triggers menüben?
7. A tárgy egyedi és keresésre alkalmas, de nem ütközik meglévő levél dedup-keresésével?
8. Szerepel az új info a CRM megjegyzésben és a naptár leírásban is?
