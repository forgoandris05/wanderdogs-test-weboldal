# Wanderdogs v2: átadó (állapot 2026-11-25)

Ezt olvasd el először, ha új session vagy. Titok nincs benne.

## Cél és határidő
Január 1-től sok minden változik a Wanderdogsnál (pl. a csapat tagjai jóváhagyják a
jelentkezéseket és kijelölik, melyik kutyát viszik), és ezt a csapattal együtt építjük.
A régi rendszer addig marad, a váltás egy kapcsolóval történjen, visszaúttal.
**Cél: mindent január 1-ig, ha lehet előbb**, modulonként élesítve (ami kész és a
csapattal letesztelt, mehet korábban, a többi a régi backenden marad).

## Döntések (Andris)
- A fejlesztői oldal az éles **1:1 másolata**, teljesen működik, de csak teszt erőforrásokkal.
  Az éles oldalnak semmi baja nem lehet.
- Az új backend **Supabase** (adatbázis, belépés, Edge Functions, időzítők), **helyben építve**
  (mint a TurboÉrettségi), automatikus deploy mergelt `main`-ből. Éles migrációhoz staging
  projekt és jóváhagyó kattintás kell.
- A **Google Sheets marad**, de csak olvasható tükörként (Supabase-ből másolva). Kétirányú
  szinkron nincs.
- Az átállás **modulonként** kapcsolható. Elsőként a felhasználói fiókok (belépés, kutyák)
  kerüljenek át, mert minden más ezt használja.
- A régi Apps Script az átállás után néhány hétig visszaútként marad, utána archiválás.
- Új funkciót az Apps Scriptbe már nem építünk. A régi teszt példány a régi viselkedés
  referenciája.

## Kész (a `worktree-v2-dev` ágon)
- `js/config.js`: környezet-kapcsoló. Csak a wanderdogsworld.hu domain használja az éles
  backendet, minden más a tesztet. Teszt URL nélkül nem esik vissza élesre.
- `v2/make-test-backend.js`: az éles Apps Script kódból teszt másolatot generál (teszt email,
  teszt visszatérési cím, Számlázz.hu letiltva) és beépít egy **teszt őrt**, ami leállítja a
  kódot, ha éles tábla, éles oldal, `sk_live_` vagy Számlázz.hu kulcs van beállítva.
- `v2/make-test-setup.js`: beállító függvény, csak `sk_test_` kulcsokat vesz át.
- `v2/README.md`: a teszt backend felállítása lépésről lépésre.
- Teszt CRM másolat Drive-ban: `Wanderdogs CRM TESZT (masolat, csak teszt adat)`. Az ügyféladatok
  törlése még hátra van (`TESZT_ADATTISZTITAS`).
- Generált, gitignore-olt fájlok (nem a repóban): `scripts/teszt-clasp/` a worktree-ben.

## Függőben (Andrisra vár)
1. Apps Script API bekapcsolása: script.google.com/home/usersettings (a clasp bejelentkezés kész).
2. Utána: `clasp create` / `push` / `deploy` a `scripts/teszt-clasp/` mappából, a két függvény
   lefuttatása a szerkesztőben (`TESZT_BEALLITAS`, `TESZT_ADATTISZTITAS`), az URL beírása a
   `js/config.js` `WD_TEST_API` sorába, teszt módú Stripe webhook.
3. Két Supabase projekt (teszt, éles) az Andris fiókjában.
4. A csapat folyamat-leírása (ki mit lát, ki mit hagy jóvá, kutyajelölés) és fontossági
   sorrend: mi kell feltétlenül jan. 1-re. Megbeszélés dec. 1-től, előrehozható.

## Következő munka (nem vár emberre)
- Az üzleti szabályok kigyűjtése a 11 676 soros kódból (pl. egy email nem foglalhat kétszer
  ugyanarra a tanfolyamra, a férőhely kutyákban számít, az ár kutyánként megy).
- Adatmodell terv jogosultságokkal (Supabase), a Sheets-fülek alapján
  (`wiki/projects/wanderdogs-system-architecture.md`).
- Helyi Supabase fejlesztői környezet.

## Ismert csapdák
- A napközi felmérő gombja még az éles Cal.com-ra mutat (`napkozi.html`), teszt közben ne használd.
  Az egyéni óra foglalója már saját. A napközi felmérőnek saját foglaló kell.
- A teszt tábla-másolatban kezdetben valódi ügyfélcímek vannak: a napi időzítőt a teszt
  projektben ne kapcsold be, amíg a tisztítás nem futott le.
- A kulcsfájlok (Stripe teszt és éles, Számlázz.hu) a fő mappában vannak, `stripe links/` és
  `szamla kulcsok/`. Soha ne írd ki az értéküket, és ne commitold. Teszthez csak `sk_test_`.
- Éles deploy csak mergelt `main`-ből (lásd a globális szabályokat).
- Az ágon a `main`-be még NEM mergeltünk semmit.

## A csapat saját Claude fiókja
Timiék külön Claude fiókot kapnának, hogy ők is részt vegyenek az átállásban. A kulcsok és a
beállítások Andris gépén vannak, ezért a csapat külön gépen vagy külön Windows felhasználóval
dolgozzon, és csak a teszt kulcsokat kapja meg. Részletek a beszélgetésben: a közös
`~/.claude` mappa, a MCP kapcsolatok (Drive, Gmail) és a titkok mind az Andris profilján élnek.

## Követelmények a megbeszélésből (Downloads/Wdogs megbeszeles.docx, "jövőre")
Rendszerezve, a dokumentum sorrendjében (a "Dávid:" rész a dokumentumban üres).

**Jóváhagyás és kutyák**
- Elfogadó rendszer: adott időszakra kit fogadnak el. Ideiglenesen foglalási email, a csapat
  emailt kap, hogy visszaigazolja (pipa/iksz).
- Nem kell minden gazdit jóváhagyni, csak párat: külön fül a szürke listás kutyáknak.
- Regisztrációnál kötelező részletes kutyaadat (fiú/lány, viszony, járt-e máshol napközibe/panzióba),
  ebből automatikusan szürke lista.
- Kutya kártya a fiókban, vizuálisabb, designosabb.
- Jövőre nem fogadnak ivaros kutyákat (nagy szöveg).

**Foglalás és ár**
- Csak készpénz (KP) is marad. "Nem lehet lemondani" ÉS "lemondó rendszer is kéne, az ügyfelek
  le tudják mondani": ELLENTMONDÁS, tisztázni kell (határidő, visszatérítés).
- Kiemelt időszakok és limitált helyek, időszakos felár (hétvége, nyár, ünnepnapok).
- Extra szolgáltatások (karomvágás, 2000 Ft/kutya), napközi foglalásnál felkínálva, mint a
  gyorsétteremben. Taxinál az időpont megadása kötelező. A megjegyzés doboz foglalás előtt
  ugorjon fel.
- Stripe: fizetések lebontása névvel.

**Felmérő**
- Új fül: felmérések, pipa/nem pipa, a jóváhagyáshoz hasonló logika. Felmérő csak napközi
  közben, kedd-péntek. Cal.com-ról saját foglalásra.

**Egyéb**
- Telefonos optimalizálás (valami nem látszik).
- Angol oldal átirányításának kivétele.
- Email leiratkozás.
