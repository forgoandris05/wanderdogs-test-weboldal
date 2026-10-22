# Munkamenet - hogyan dolgozunk és hogyan megy ki egy változtatás

## Két külön világ, két külön élesítés

| | Weboldal (frontend) | Backend (Google Apps Script) |
|---|---|---|
| Hol van a kód | **Ebben a GitHub repóban** | **Az Apps Script projektben** (script.google.com). A repóban NINCS benne |
| Hogyan élesedik | `git push` a `main`-re → GitHub Pages 1-3 percen belül | A kódot be kell másolni az Apps Script szerkesztőbe, **Telepítés → Telepítések kezelése → ceruza → Új verzió** |
| Mikor kell | HTML/CSS/JS változásnál | Bármilyen GAS-logika, email, naptár, CRM-írás változásnál |

**Fontos:** a "mentés" az Apps Script szerkesztőben még NEM élesít. Amíg nem készül új telepítési verzió, az éles web app a régi kódot futtatja. Ha egy frontend változás új backend paramétert vár, **a backendet előbb vagy egyszerre kell élesíteni**, különben az új oldal egy régi backendet hív.

### Hol a GAS forrása, és ki a "forrás"?

- A fejlesztő (Andris) gépén a `scripts/wdogs kiamsol backup.txt` fájl a kód másolata - de ez **csak másolat**, és szándékosan `.gitignore`-ban van (a repó publikus).
- Mivel a kód nincs verziókezelve, **két ember könnyen felülírja egymás munkáját**. Ezért, ha többen dolgoztok rajta:
  1. A **forrás az éles Apps Script projekt**. Szerkesztés előtt mindig abból indulj (másold ki a friss kódot), ne egy régi mentett fájlból.
  2. Szerkesztés előtt **mentsd el az eredetit** időbélyeges másolatként (pl. `wdogs_ELOTTE_2026-10-22_tema.txt`).
  3. Beszéljétek meg, ki szerkeszti éppen (egyszerre egy ember).
  4. Az Apps Script **Verziók** (Fájl → Verziótörténet / Telepítés → verziók) visszaállíthatóvá teszi a régit - telepítés előtt nevezd el értelmesen az új verziót.
- **Javaslat (döntés kell):** hozzatok létre egy **privát** GitHub repót csak a GAS kódnak (vagy használjátok a `clasp` eszközt), hogy legyen előzmény és merge. Publikus repóba nem mehet, mert a kód üzleti logikát és belső szerkezetet tartalmaz.
- Szintaxis-ellenőrzés még a beillesztés előtt: másold a kódot egy `.js` fájlba és futtasd `node --check fajl.js`. Az Apps Script csak mentéskor/telepítéskor jelez szintaxishibát.

## Frontend munkafolyamat

1. Készíts külön branchet (`git checkout -b valami-leiro-nev`), ne közvetlenül a `main`-en dolgozz.
2. Módosíts. Helyi kipróbáláshoz elég megnyitni a HTML-t böngészőben (vagy `python -m http.server`), de a GAS hívások az **éles** backendet érik el - ne teszteld éles foglalással.
3. `git add <konkrét fájlok>` - **ne `git add -A` / `git add .`**. Soha ne commitold: `node_modules/`, `auth-state.json`, `test-*.js|png|json`, `shots/`, `*.pdf`, `package-lock.json`, és semmilyen titkot/kulcsot.
4. Commit üzenet magyarul, leíróan, sima `-` kötőjellel.
5. Pull request → átnézés → merge a `main`-be → 1-3 perc múlva élesben van.
6. **Élesben ellenőrizd** (egy ritka, de volt eset: a régi verzió futott, mert elmaradt a push). Kemény frissítés (Ctrl+F5); a CSS-nél cache-buster van (`styles.css?v=...`), CSS módosításkor emeld.

## Backend (GAS) munkafolyamat

1. Olvasd el: [ARCHITEKTURA.md](ARCHITEKTURA.md) és [CSAPDAK.md](CSAPDAK.md).
2. Mentsd az eredetit (lásd fent).
3. Módosíts. Közben végigmész az 5 rétegen: CRM / ügyfél-email / Timi-email / naptár / Taxi Menetrend / Összes fül - online ÉS KP ág - böngészős confirm ÉS webhook útvonal.
4. `node --check` a másolaton.
5. Illeszd be az Apps Script szerkesztőbe, mentsd, **ne telepíts még**. Futtass egy kézi tesztfüggvényt, ha van (a **Végrehajtások / Executions** menüben látod a naplót és a hibákat).
6. Telepítés új verzióként. Frontend változás, ami ezt várja, csak ezután menjen ki.
7. Próbáld ki élesben egy **teszt foglalással** (lásd lent), nézd meg a Sheetet, az emailt, a naptárat.

## Tesztelés

- Az éles rendszerre nincs külön "staging". Teszt foglalásnál **kis összeget** használj (Stripe forintos minimum: 500 Ft ajánlott), és **utána takarítsd ki**: töröld a teszt sorokat a CRM-ből (a szolgáltatás füléről, az Összes érdeklődő fülről, a Felhasználók/Bérletek fülről ha kell), a naptáresemény(eke)t, és Stripe-on a tesztet **térítsd vissza**. Éles próbafoglalásnál a számla is valódi → sztornó kell.
- Egy email-cím nem foglalhat kétszer ugyanarra a tanfolyamra - a teszt sort a Foglalások fülről is töröld, különben az az email ki van zárva.
- Kézi tesztlista: [../TESZTELESI-TERV.md](../TESZTELESI-TERV.md).
- Mobil: mindig próbáld **320-375 px szélességen**, és a mezők kitöltése UTÁN (fotó kiválasztva, hibaüzenet megjelenve). Ha tudsz, nézd meg valódi iPhone-on és Androidon is.
- Playwright (`webapp-testing`) lokális tesztek maradjanak lokálisak (nem commitolandó).

## Ha valami elromlik élesben

1. **Foglalás/fizetés panasz:** először a Stripe (megvan-e a fizetés?), aztán a Sheet (megvan-e a sor?), aztán az Apps Script **Executions** napló (hiba?). A webhook újrapróbálja a hibás kéréseket ~3 napig, tehát ha a confirm idempotens, egy javítás után a Stripe-ból **újraküldhető** az esemény.
2. **Gyors visszaállítás:** az Apps Scriptben telepítsd újra a **korábbi verziót** (Telepítések kezelése → ceruza → korábbi verzió). Frontendnél `git revert` a hibás commitra, push.
3. Írd fel a tanulságot a [CSAPDAK.md](CSAPDAK.md)-be.

## Prompt-sablon AI-asszisztenshez (ChatGPT, Claude, stb.)

Másold be az új beszélgetés elejére:

```
Egy meglévő, éles kutyaiskola-rendszeren dolgozunk (Wanderdogs): statikus HTML weboldal
(GitHub Pages) + Google Apps Script backend + Google Sheet mint CRM/adatbázis + Gmail + Google Naptár + Stripe.
A repó docs/ mappájában van a tudástár (ARCHITEKTURA.md, CSAPDAK.md, MUNKAMENET.md) - ezeket
olvasd el, mielőtt javaslatot teszel. [Csatold/másold be őket, ha nem éred el a repót.]

Szabályok:
1. Minden javaslatnál sorold fel, melyik rétegre van hatása: weboldal / GAS / CRM-Sheet / email (ügyfél + Timi) / naptár.
2. Minden foglalási logika online (Stripe) ÉS készpénzes (KP) ágba is kell, és a böngészős confirm ÉS a Stripe webhook útvonalra is.
3. Ne találj ki függvényneveket, oszlopindexeket vagy Sheet-fülneveket - kérd el a releváns kódrészt, vagy jelezd, hogy nem látod.
4. Dátum mindig yyyy-MM-dd, soha ne essen vissza a mai napra; hiányzó adatnál látható hiba, ne néma catch.
5. Nincs néma disabled gomb, nincs rejtett elemre tett hibajelzés.
6. A kis változtatást diff-ként, minimálisan add; ne írd újra a teljes fájlt.

A feladat: [ide jön a feladat]
A releváns kód: [ide másold be az érintett függvényeket / HTML részt]
```

Tippek ChatGPT-hez: a GAS kód nagy (~550 KB), nem fér be egyben. **Mindig csak az érintett függvényeket másold be**, plusz a hívó helyüket (`doPost` dispatcher sor) és a kapcsolódó konstansot (`LAPOK`, `STRIPE_FIOK`). Kérd meg, hogy a módosított függvényt **teljes egészében** adja vissza, hogy egyszerű legyen kicserélni.
