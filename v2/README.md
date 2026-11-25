# Wanderdogs v2: fejlesztői környezet

Cél: az éles oldal 1:1 másolata, ami teljesen működik, de csak teszt-erőforrásokkal.
Az éles oldal (`main` ág, wanderdogsworld.hu) ettől semmit nem változik, amíg ez az ág
nincs mergelve.

## Hogyan választ környezetet az oldal

`js/config.js`: csak a `wanderdogsworld.hu` domainről megy az éles backend. Minden más cím
(helyi gép, előnézeti oldal) a **teszt backendet** használja, narancs "TESZT KORNYEZET" sávval.
Ha a teszt backend URL-je még üres, az oldal nem esik vissza élesre, piros sáv jelzi, és a
műveletek elbuknak.

Átállás jan. 1-jén: a `WD_LIVE_API` értékét az új backendre cseréljük. Visszaállás: a régi
érték visszaírása.

## A teszt backend felállítása (egyszeri, kb. 30-45 perc)

A teszt backend ugyanaz a kód, mint az éles, csak teszt beállításokkal.

1. **Kód generálása** (a repó gyökeréből):
   `node v2/make-test-backend.js "<éles .txt>" "<scripts/wdogs_TESZT_backend.txt>" <teszt-email> <teszt-oldal-url>`
   A szkript lecseréli Timi emailjét, a Stripe-ból visszatérő oldal címét és a Számlázz.hu
   címet (teszt rendelésből soha nem lesz valódi számla).
2. **Teszt tábla**: a `Wanderdogs CRM` másolata (Fájl > Másolat készítése), kitalált adatokkal.
3. **Új Apps Script projekt** (nem az éles szerkesztése!): bemásolni a generált kódot.
4. **Script Properties** a teszt projektben:
   - `SHEET_ID` = a teszt tábla azonosítója
   - `SITE_URL` = a teszt oldal címe
   - `TIMI_EMAIL` jellegű értesítések a generált kódban már a teszt emailre mennek
   - naptárak: `EGYENI_CALENDAR_ID`, `TAXI_CALENDAR_ID`, `NAPKOZI_PANZIO_CALENDAR_ID`,
     `NAPKOZI_CALENDAR_ID` = **külön teszt naptárak** (nem Timiék naptárai)
   - Stripe: kizárólag `sk_test_...` kulcsok (`STRIPE_SECRET_KEY`, `STRIPE_KEY_EGYENI`,
     `STRIPE_KEY_NAPKOZI`), és `STRIPE_WH_SECRET` a teszt módú webhookhoz
   - `AUTH_SECRET`, `MARKETING_TOKEN_SECRET`: új, véletlen értékek (az élesét ne használd)
   - `SZAMLAZZ_KULCS_*`: **ne legyen beállítva**
5. **Telepítés** webalkalmazásként (Végrehajtás: én, Hozzáférés: bárki), az URL-t a
   `js/config.js` `WD_TEST_API` sorába beírni.
6. **Stripe teszt módban** egy webhook-végpont a teszt backend URL-jére.
7. Teszt kártya: `4242 4242 4242 4242`.

Az éles kód változása után a 1. lépést újra kell futtatni, és a teszt projektbe újra bemásolni.

## Az előnézeti oldal

A fejlesztői ág NEM megy a GitHub Pages-re (az csak a `main`-t szolgálja ki). Helyben:
`npx serve .` a repó gyökeréből. Megosztható előnézethez az ágat egy külön tárhelyre
(pl. Vercel vagy Cloudflare Pages előnézet) kell kötni, ez Andris fiókjához kötött lépés.

## Következő lépések

- teszt backend felállítása (fenti lista)
- az új logika (jelentkezés jóváhagyása kutyajelöléssel) fejlesztése ezen az ágon
- Supabase-re költözés: adatmodell terv, majd átírás a kapcsolóval együtt
