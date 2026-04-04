# Wanderdogs - Mai session javitasok es teendok (2026-04-02)

---

## KESZ - Deployolva (website GitHub Pages)

### 1. Regisztracio "Feltoltes..." bug fix
- **Problema:** Sikeres regisztracio utan az oldal "Feltoltes..." allapotban ragadt
- **Ok:** `result` valtozo scope hiba (try blokkon belul deklaralva, kivul hasznalva)
- **Javitas:** `result` kiemelve try elé, optional chaining timeout esetre
- **Fajl:** `regisztracio.html`
- [x] Pusholva

### 2. Kurzusok link → wanderdogsworld.com/courses/
- Minden oldalon (16 HTML + 2 footer) a "Kurzusok" link uj tabban nyitja a dubai oldalt
- **Fajl:** minden .html
- [x] Pusholva

### 3. Facebook jelentkezes gombok
- **Kutyas tura:** foglalasi form → Facebook kozosseg gomb (facebook.com/groups/956709845427195)
- **Tanfolyamok:** email → "Jelentkezes es informaciok Facebookon" (facebook.com/wanderdogskutyakikepzes)
- **Workshopok:** email → "Jelentkezes es tobb informacio Facebookon" (facebook.com/wanderdogskutyakikepzes)
- **Fajl:** kutyatura.html, tanfolyamok.html, workshopok.html
- [x] Pusholva

### 4. Egyeni oktatas mobil layout fix
- Hero szelesseg egyeztetve a tartalommal (padding 48px → 80px)
- "Hogyan mukodik?" + "Mire szamithatsz?" 2 oszlop → 1 oszlop mobilon
- Kartyak padding csokkentve mobilon
- **Fajl:** egyeni-ora.html
- [x] Pusholva

### 5. Rolunk CTA gombok mobil
- Egyforma szeles, kozepre igazitott (align-items: stretch + max-width: 320px)
- **Fajl:** rolunk.html
- [x] Pusholva

### 6. "Wanderdogs pillanatok" szoveg
- "Solymari pillanatok" → "Wanderdogs pillanatok"
- **Fajl:** index.html
- [x] Pusholva

### 7. Napkozi 3 arkartya torolve
- A hero alatti 3 arkartya (Taxi nelkul / 10km / 25km) eltavolitva, eleg az arlista gomb
- **Fajl:** napkozi.html
- [x] Pusholva

### 8. Napkozi: Payment Link → backend checkout session
- 22 Stripe Payment Link (buy.stripe.com) eltavolitva
- Uj `napkoziCheckout()` fuggveny: backend GAS session letrehozas
- Berlet, egyszeri es taxi kiegeszito fizetes mind backenden keresztul
- Elesiteskor csak 1 secret key csere kell, nem 22 link ujragyartas
- **Fajl:** napkozi.html
- [x] Pusholva

### 9. Napkozi taxi kutyanev fix
- Mindig a bejelentkezett user profiljából veszi a kutyaneveket
- Nem a regi foglalasokbol (amikben rossz adatok lehetnek)
- **Fajl:** napkozi.html
- [x] Pusholva

### 10. Napkozi taxi: oda/vissza irany
- Kiegeszito taxi fizetesnel az oda/vissza checkbox ertekek atadjak a backendnek
- **Fajl:** napkozi.html
- [x] Pusholva

---

## KESZ - GAS DEPLOY SZUKSEGES

> **FONTOS: Az alabbiakat a Google Apps Script editorban kell deploylni (New deployment)!**
> **Fajl:** `AI automation/wanderdogs/scripts/wanderdogs_main.gs`

### 11. Panzio "tizenegy is not defined" fix
- **Problema:** Stripe checkout hiba a panzio fizetes gombnal
- **Ok:** `tizenegy`, `bekoltozesOra`, `kikoltozesOra` valtozok nem voltak elerhetek a `_stripeSessionLetrehozas()` fuggvenyben
- **Javitas:** `params.tizenegy`, `params.bekoltozesOra`, `params.kikoltozesOra`

### 12. Email javitasok (minden panzio email)
- Lemondasi szoveg javitva: "24 oran beluli lemondas eseten a befizetett osszeg nem teritendo vissza"
- Panzio Stripe email: "amit hozz magaddal" szekció torolve
- Taxi szoveg: "a weboldalon tudsz igényelni a panzio oldalon alul"
- "Talalkozunk hamarosan!" → "Hamarosan talalkozunk!" (mind a 4 email)

### 13. Taxi email javitasok
- Emojik torolve (nem jelent meg a kliensekben)
- "A pontos idopontot..." → "A pontos menetrendet a Facebook csoportban tesszuk kozze."

### 14. Napkozi checkout handler (uj)
- `_napkoziCheckoutHandler` — Stripe session letrehozas napkozihez
- `EGYSZERI_AR_MAP` — egyszeri + taxi kiegeszito arak
- Viki key-jel (`_getStripeKey('napkozi')`)
- success_url: `napkozi-koszonjuk.html?session_id=...&tipus=...`

### 15. Taxi menetrend: 2 sor (hozas + hazavives)
- Berlet felhasznalasnal (Cal.com): "Reggel hozas" + "Delutan hazavives"
- Berlet 1. alkalom (vasarlaskor): "Reggel hozas" + "Delutan hazavives"
- Egyszeri taxis napkozi: "Reggel hozas" + "Delutan hazavives"
- Kiegeszito taxi: user valasztasa alapjan (oda es/vagy vissza)

### 16. Taxi menetrend szinezes
- Mai nap = **zold** (#C6EFCE) — "ezt MA kell megcsinalni"
- Kovetkezo nap = **arany** (#FFD700) — "ez a kovetkezo teendo"
- Ugyanazon nap osszes sora (hozas + hazavives) egyforma szinu

### 17. Berlet kitolodas forditott iranyba (panzio overlap)
- Ha ELOBB foglalnak panzioba es UTANA vesznek napkozi berletet
- A berlet lejarat kitolodik a panzio napjaival
- Csak CRM frissites, nincs email/weboldalon feltuntetes
- Uj helper: `_berletKitolodasPanzioEllenorzes()`

---

## TESZTELESI CHECKLIST (GAS deploy utan)

### Kritikus tesztek
- [ x] **Panzio fizetes:** gomb → Stripe checkout megnyilik (nem "tizenegy" hiba)
- [ x] **Napkozi berlet fizetes:** gomb → "Csatlakozas Stripe-hoz..." → Stripe → koszonjuk oldal
- [x ] **Napkozi egyszeri fizetes:** gomb → Stripe → koszonjuk oldal
- [x ] **Napkozi taxi kiegeszito:** irany valasztas → gomb → Stripe → koszonjuk
- [ x] **Regisztracio:** sikeres reg → siker uzenet → atiranyitas (nem "Feltoltes...")

### CRM tesztek
- [x ] **Napkozi berlet:** BERLETEK tabban uj sor megjelenik
- [ ] **Taxis berlet 1. alkalom:** TAXI_MENETREND-ben 2 sor (Reggel hozas + Delutan hazavives)
- [ ] **Taxis berlet felhasznalasnal:** TAXI_MENETREND-ben 2 sor
- [ ] **Kiegeszito taxi (oda ut):** TAXI_MENETREND-ben 1 sor (Reggel hozas)
- [ ] **Kiegeszito taxi (oda-vissza):** TAXI_MENETREND-ben 2 sor
- [ ] **Taxi menetrend szinek:** mai nap = zold, kovetkezo = arany
- [ ] **Berlet kitolodas:** panzio foglalas (pl apr 5-12) → berlet vasarlas → BERLETEK lejarat +7 nap

### Email tesztek
- [ ] **Panzio email:** nincs "amit hozz magaddal", taxi → weboldalra iranyit
- [ ] **Taxi email:** nincs emoji (kerdojel), menetrend → Facebook csoport
- [ ] **Minden email:** "Hamarosan talalkozunk!" (nem "Talalkozunk hamarosan!")

### Weboldalon ellenorizni
- [ ] **Kurzusok link:** barmelyik oldalon → wanderdogsworld.com/courses/ (uj tab)
- [ ] **Kutyas tura:** Facebook kozosseg gomb
- [ ] **Tanfolyamok + Workshopok:** Facebook gomb
- [ ] **Egyeni oktatas mobilon:** kartyak nem lognak ki, "Hogyan mukodik" egymas alatt
- [ ] **Rolunk mobilon:** CTA gombok egyforma szeles, kozepen
- [ ] **Napkozi taxi kutyanev:** csak az aktualis fiok kutyai jelennek meg

### Stripe tesztkartya
- **Sikeres:** 4242 4242 4242 4242 (barmilyen datum/CVC)
- **Elutasitott:** 4000 0000 0000 0002

---

### 18. Mai nap zold szinezes minden CRM tabban
- Osszes erdeklodo, Napkozi, Panzio, Egyeni ora, Csoportos, Viselkedesterapia, Orzo-vedo
- Az aktualis nap sorai zold hatterrel (#C6EFCE)
- Tegnapi zold automatikusan visszaall feherre
- `_maiNapSzinezes()` helper, `_insertAtTop()`-bol hivva

---

## KESZ - Session #16 (2026-04-03) - NAPKOZI CAL.COM → BACKEND MIGRACIO

### 19. Napkozi Cal.com → sajat backend foglalasi rendszer
- **Problema:** Cal.com account szinten utkoztette az event type-okat → napkozi blokkolhatta az egyeni orakat
- **Megoldas:** Cal.com embed eltavolitva, sajat naptar UI + backend
- **Backend (GAS):**
  - Uj `napkozi_idopontok` handler: kovetkezo 5 het Kedd-Pentek napjai + kapacitas (max 50 kutya/nap)
  - Uj `NAPKOZI_MAX_KUTYA = 50` konstans
  - Kapacitas ellenorzes a `_berletFoglalasHandler`-ben (NAPKOZI sheet-bol szamol)
  - Google Calendar event letrehozas (transparent!) a berlet_foglalas, berletConfirm, egyszeriConfirm handlerekben
  - Forras oszlop: 'Cal.com' → 'Website'
  - calcomLink → napkoziLink (wanderdogsworld.hu/napkozi.html)
  - EVENT_MAP-bol napkozi-foglalas + napkozi-foglalas-taxi eltavolitva
  - CONFIG.CALCOM_LINKEK-bol NAPKOZI_FOGLALAS + NAPKOZI_TAXI torolve
- **Frontend (napkozi.html):**
  - Cal.com embed loader, initCalEmbed(), postMessage listener, overlay rendszer torolve
  - CALCOM_NAPKOZI_SLUG + CALCOM_NAPKOZI_TAXI_SLUG torolve
  - Uj havi naptar grid (Ke-Pe kattinthato, zold=szabad, piros=tele, arany=kivalasztott)
  - Idopont valaszto: ora (8-16) + perc (00/15/30/45) — taxinal rejtve
  - "Foglalas megerositese" gomb → berlet_foglalas backend hivas
  - Honap navigacio (elore/hatra nyilak)
- **napkozi-koszonjuk.html:** calcomLink → napkoziLink
- **NAPKOZI_ISMERKEDO MARAD Cal.com-on** (ingyenes felmero)
- **Fajlok:** napkozi.html, napkozi-koszonjuk.html, wanderdogs_main.gs

---

### GAS DEPLOY SZUKSEGES (Session #16)
> A fenti 19. pont csak GAS deploy + website push utan mukodik!

### 20. Zart napok kezeles (ZARVA tab)
- ZARVA tab a CRM-ben: szolgaltatasokent max 3 zart intervallum
- `_isZarva()` + `_getZarvaAdatok()` (5 perc cache) + `zarva_check` endpoint
- 7 szolgaltatas: napkozi, panzio, csoportos, kutyatura, orzo, egyeni, terapia
- Backend: minden foglalasi handler ellenorzi (napkozi, panzio, csoportos, kutyatura, orzo-vedo)
- Frontend: napkozi "Zarva" cella, csoportos "ZARVA" dropdown, egyeni+terapia banner
- `zarvaTabLetrehozas()` fuggveny a tab automatikus letrehozasahoz

### 21. Csoportos Calendar event busy
- `_csoportosNaptarBeIras()`: transparent → busy (blokkolja Timi Cal.com foglalasait)

### 22. Panzio idopont valaszto
- Kettos dropdown (ora:perc) mint a napkozinel
- calc-be-ora/calc-ki-ora → calc-be-h + calc-be-m / calc-ki-h + calc-ki-m

### 23. Napkozi UI javitasok
- Naptar + idopont valaszto + gomb kozepre igazitas
- Szabad helyek szam elrejtese
- "Mikor jottok?" szoveg
- Foglalas gomb utan nem ugrik az oldal aljara

---

## ═══════════════════════════════════════════════════
## TESZTELESI TERV (Session #16 — minden valtoztatas)
## ═══════════════════════════════════════════════════

### ELOKESZITES
1. GAS editorba masold be a frissitett kodot
2. Deploy → New deployment
3. Futtasd: `zarvaTabLetrehozas()` (leterehozza a ZARVA tabot)
4. GitHub Pages mar frissult (push megvolt)
5. Stripe tesztkartya: `4242 4242 4242 4242` (barmilyen datum/CVC)

---

### A) NAPKOZI NAPTAR — alapmukodes
- [ ] **A1.** Nyisd meg napkozi.html → bejelentkezve → naptar megjelenik
- [ ] **A2.** Naptar: Kedd-Pentek zold, Hetfo/hetvege szurke, mai+holnapi disabled
- [ ] **A3.** Honap navigacio: elore/hatra nyilak mukodnek
- [ ] **A4.** Kattints egy zold napra → arannyá valik, "Mikor jottok?" megjelenik
- [ ] **A5.** Ora (8-16) + perc (00/15/30/45) valaszthato
- [ ] **A6.** "Foglalas megerositese" gomb megjelenik a kivalasztott datummal

### B) NAPKOZI — berlet foglalas
- [ ] **B1.** Van berleted → kattints napra → ora/perc valasztas → "Foglalas megerositese"
- [ ] **B2.** "Foglalas feldolgozasa..." megjelenik (NEM ugrik az oldal aljara!)
- [ ] **B3.** Berlet levon → siker uzenet (maradek alkalom, lejar)
- [ ] **B4.** Google Calendar-ban uj event: "Napkozi: Kutyanev (Gazdinev)" — **transparent** (free)
- [ ] **B5.** CRM NAPKOZI tabban uj sor, Forras: "Website" (NEM "Cal.com")
- [ ] **B6.** Visszaigazolo email erkezik

### C) NAPKOZI — taxi flow
- [ ] **C1.** Taxi kivalasztva (10km/25km) → cim mezo megjelenik
- [ ] **C2.** Kattints napra → **NINCS** oravalaszto (fix 7:30)
- [ ] **C3.** Foglalas → Calendar event + Taxi Menetrend 2 sor (hozas + hazavives)

### D) NAPKOZI — nincs berlet flow
- [ ] **D1.** Nincs berleted → kattints napra → oravalasztas → Foglalas megerositese
- [ ] **D2.** Fizetes opciok megjelennek (4 alk / 8 alk / Egyszeri)
- [ ] **D3.** Kattints "4 alkalom" → Stripe checkout → tesztkartya → napkozi-koszonjuk.html
- [ ] **D4.** Koszonjuk oldalon: "Kovetkezo napot foglalj: itt kattints" (wanderdogsworld.hu/napkozi.html-re mutat, NEM Cal.com-ra)

### E) NAPKOZI — ingyenes felmero
- [ ] **E1.** Uj vendeg (nincs korabbi foglalas) → "Ingyenes felmero" banner megjelenik
- [ ] **E2.** "Ingyenes felmerot foglalok" gomb → Cal.com link megnyilik (EZ MARAD Cal.com-on!)

---

### F) PANZIO — idopont valaszto
- [ ] **F1.** Nyisd meg panzio.html → kalkulatorban ket kulon dropdown (ora + : + perc)
- [ ] **F2.** Bekoltozes: ora valasztas (7-18) + perc (00/15/30/45)
- [ ] **F3.** Kikoltozes: ora valasztas + 11:00 elott → "utolso nap nem szamit" info megjelenik
- [ ] **F4.** Fizetes gomb CSAK akkor aktiv ha mindket idopont ki van valasztva

---

### G) ZART NAPOK — ZARVA tab
- [ ] **G1.** CRM-ben letrejott a "⏸️ Zart Napok" tab (7 sor, szines)
- [ ] **G2.** Irj be: Napkozi sor → Zarva 1 -tol: 2026-04-08 → Zarva 1 -ig: 2026-04-08

### H) ZART NAPOK — napkozi
- [ ] **H1.** Napkozi naptar: apr 8 szurke + "Zarva" felirat (nem kattinthato)
- [ ] **H2.** Ha megprobalsz berlettel foglalni zart napra → "Ez a nap nem foglalhato (zarva)."
- [ ] **H3.** Torold ki a ZARVA cellakat → apr 8 ujra zold (5 perc cache var!)

### I) ZART NAPOK — csoportos
- [ ] **I1.** Irj be: Csoportos sor → egy kovetkezo szombat datuma
- [ ] **I2.** Csoportos dropdown: az a szombat "ZARVA" felirattal, disabled
- [ ] **I3.** Ha megprobalsz foglalni (API) → "Ez a szombat nem foglalhato (zarva)."

### J) ZART NAPOK — panzio
- [ ] **J1.** Irj be: Panzio sor → egy jovo heti datum
- [ ] **J2.** Panzio foglalasnal ha az idoszak erintett → "A panzio X napon zarva tart."

### K) ZART NAPOK — egyeni ora + viselkedesterapia
- [ ] **K1.** Irj be: Egyeni ora sor → mai datum -tol -ig
- [ ] **K2.** egyeni-ora.html: foglalj gomb eltunik → "Jelenleg nem foglalhato" banner
- [ ] **K3.** Irj be: Viselkedesterapia sor → mai datum
- [ ] **K4.** viselkedesterapia.html: ugyanaz a banner

---

### L) UTKOZES MATRIX — ellenorzes
- [ ] **L1.** Napkozi Calendar event = transparent (free) → Cal.com-ban foglalhato ugyanarra az idopontra egyeni ora
- [ ] **L2.** Csoportos Calendar event = busy → Cal.com-ban NEM foglalhato egyeni ora szombat 9-10-re
- [ ] **L3.** Ket kulonbozo ember foglal napkozit ugyanarra a napra → mindketto sikerrel (kapacitason belul)

---

### TESZT UTAN TAKARITAS
- [ ] Torold a ZARVA tab teszt datumokat (ures cellak = nincs zarolas)
- [ ] Torold a teszt foglalasokat a NAPKOZI tabbol
- [ ] Torold a teszt Calendar eventeket

---

## KESZ - Session #17 (2026-04-04) - ICS/CALENDAR FIX + SCOPE BUG

### 24. Napkozi Calendar event → user naptaraba kerul
- `_napkoziCalendarEvent`: guests + sendInvites:false → csendben bekerül a user naptárába
- `_csoportosNaptarBeIras`: ugyanez csoportosra
- Google Meet link eltávolítás (conferenceData: null patch)
- ICS melléklet eltávolítva (nem kell, mert a guest invite megoldja)
- Google Calendar link az emailben (backup, kattintható)
- emailToHtml: URL auto-linking (https linkek kattinthatóvá válnak)

### 25. kutyakSzama scope bug fix (egyszeriConfirm)
- **Problema:** `kutyakSzama` const az `if (ssId) {}` blokkon belül volt, de az ICS/email kód kívül hivatkozott rá
- **Hatas:** `kutyakSzama is not defined` → ICS generálás crash → try-catch elnyelte → email ment ICS nélkül
- **Ez volt az eredeti ICS bug gyökéroka!**
- **Javitas:** `ecKutyaDb` változó a scope-on kívül számolva

### 26. _napkoziIcsGeneralas robusztusabb date kezelés
- Date instanceof check + regex fallback (YYYY-MM-DDTHH:MM)
- Nem dob silent hibát invalid startTime-ra

---

## MEG NEM KESZULT / KOVETKEZO TEENDOK

- [ ] **HTTPS aktivalas** — wanderdogsworld.hu SSL certificate
- [ ] **Cal.com admin:** napkozi-foglalas + napkozi-foglalas-taxi event type-ok torlese/inaktivalasa
- [ ] **Stripe LIVE atkapesolás** — UTOLSO lepes, minden teszteles utan:
  - GAS Script Properties: sk_test → sk_live (3 key: David, Timi, Viki)
  - SITE_URL: wanderdogsworld.hu (mar be van allitva)
