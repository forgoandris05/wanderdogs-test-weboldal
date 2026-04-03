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
- [ ] **Napkozi taxi kiegeszito:** irany valasztas → gomb → Stripe → koszonjuk
- [ ] **Regisztracio:** sikeres reg → siker uzenet → atiranyitas (nem "Feltoltes...")

### CRM tesztek
- [ ] **Napkozi berlet:** BERLETEK tabban uj sor megjelenik
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

### Tesztelesi checklist (session #16)
- [ ] **napkozi_idopontok:** helyes Ke-Pe napok + kapacitas visszajon
- [ ] **Naptar UI:** Ke-Pe zold, He/hetvege szurke, 2 napon beluli disabled
- [ ] **Nem-taxi flow:** nap + orapont valasztas → berlet levon → Calendar event
- [ ] **Taxi flow:** nap valasztas (nincs idopont) → berlet levon → Calendar event + Taxi Menetrend
- [ ] **Nincs-berlet flow:** nap valasztas → fizetes opciok megjelennek
- [ ] **Kapacitas:** 50 kutya utan "Betelt" jelzes
- [ ] **Egyeni orak NEM utkoznek** napkozivel (Calendar transparent)
- [ ] **Ingyenes felmero Cal.com** link meg mukodik

---

## MEG NEM KESZULT / KOVETKEZO TEENDOK

- [ ] **HTTPS aktivalas** — wanderdogsworld.hu SSL certificate
- [ ] **Cal.com admin:** napkozi-foglalas + napkozi-foglalas-taxi event type-ok torlese/inaktivalasa
- [ ] **Stripe LIVE atkapesolás** — UTOLSO lepes, minden teszteles utan:
  - GAS Script Properties: sk_test → sk_live (3 key: David, Timi, Viki)
  - SITE_URL: wanderdogsworld.hu (mar be van allitva)
