# Wanderdogs -- Teljes Hasznalati Utmutato

**Wanderdogs World** | Kucsera Timea | Solymár, Rozália sor 2085
Tel: 0670/5626926 | Email: info.wanderdogs@gmail.com | Web: wanderdogsworld.hu

---

## Tartalomjegyzek

1. [Napi rutin](#1-napi-rutin)
2. [Foglalasi rendszer -- ugyfél oldal](#2-foglalasi-rendszer----ugyfél-oldal)
3. [Szolgaltatasok reszletesen](#3-szolgaltatasok-reszletesen)
4. [CRM tabok es szinkodolas](#4-crm-tabok-es-szinkodolas)
5. [Zart napok](#5-zart-napok)
6. [Regi ugyfelek](#6-regi-ugyfelek)
7. [Oltasi konyv rendszer](#7-oltasi-konyv-rendszer)
8. [Google Naptar](#8-google-naptar)
9. [Automatikus emailek](#9-automatikus-emailek)
10. [napiKarbantartas() trigger](#10-napikarbantartas-trigger)
11. [Stripe fizetesi rendszer](#11-stripe-fizetesi-rendszer)
12. [Biztonsag](#12-biztonsag)
13. [Hibaelharitas](#13-hibaelharitas)
14. [Cal.com alnaptar beallitas](#14-calcom-alnaptar-beallitas)

---

## 1. Napi rutin

Minden reggel egy gyors ellenorzest kell vegezni a Google Sheets CRM-ben. A szinkodolas segit, hogy azonnal lasd, mi a teendo:

| Szin | Jelentes |
|------|----------|
| **Zold hatter** | Az adott foglalas **MA** van -- ezekkel kell ma foglalkozni |
| **Sarga hatter** | A **legkozelebb kovetkezo** foglalas -- ezekre kell keszulni |
| **Feher hatter** | Tavoli vagy lezart foglalasok |

**Reggeli rutinod (5 perc):**

1. Nyisd meg a CRM-et (Google Sheets)
2. Nezd at a **zold** sorokat -- ezek a mai foglalasok
3. Nezd at a **sarga** sorokat -- ezekre keszulj
4. Ellenorizd a **Taxi Menetrend** tabot -- kik jonnek taxival, milyen cimet kell felvenni
5. Pald at az info.wanderdogs@gmail.com email fiokot -- uj foglalasok, erdeklodok
6. Ha Cal.com foglalasod is van (egyeni ora, viselkedesterapia): nezd meg a Cal.com dashboard-ot

A szinezest a rendszer automatikusan frissiti minden uj foglalas utan. Ha valami nem stimmel, kézzel futtathatod: Apps Script editor > `crmSzinezesfrissites()`.

---

## 2. Foglalasi rendszer -- ugyfél oldal

### Regisztracio

Az ugyfél a **regisztracio.html** oldalon tud fiokot letrehozni. Kötelezo megadni:

- **Teljes nev**
- **Telefonszam**
- **Email cim** (ez lesz a felhasznalonev)
- **Jelszo** (min. 6 karakter)
- **Kutya adatok**: nev, fajta, kor (max 4 kutya)
- **Oltasi konyv**: lejarat datuma + foto feltoltese (JPG/PNG, max 5 MB)
- **Problema/cel leiras** (szoveges mezo)

Regisztracio utan:
- Az ugyfél automatikusan bejelentkezve marad
- Az adatok a **Felhasznalok** Google Sheets tabra kerulnek
- Az oltasi konyv fotoja a **Google Drive** "Wanderdogs_Oltasi_Konyvek" mappaba kerul
- Visszairanyitas arra az oldalra, ahonnan jott (pl. csoportos.html)

### Bejelentkezes

A **bejelentkezes.html** oldalon email + jelszo kell. Sikeres bejelentkezes utan az ugyfél adatai a böngészo memóriajaba (localStorage) kerulnek, es **23 oraig ervenyesek**. Utana automatikusan kijelentkezteti a rendszer.

### Profil kezelés

A **profil.html** oldalon az ugyfél:

- Latja a sajat nevet es email cimet
- Latja a regisztralt kutyait, mindegyiknel:
  - **Zold badge** = ervenyes oltas (datummal)
  - **Piros badge** = lejart oltas (datummal)
  - **Szurke badge** = hianyzo oltasi adat
- **Frissitheti** az oltasi konyvet (uj foto + datum)
- **Hozzaadhat** uj kutyat (max 4 osszesen)
- **Torolhet** kutyat
- **Torolheti a teljes fiokjat** (visszavonhatatlan!)
- Kijelentkezhet

---

## 3. Szolgaltatasok reszletesen

### 3.1 Csoportos oktatas (csoportos.html)

- **Mikor**: minden szombat, 9:00--10:00
- **Hol**: Solymár, Rozália sor
- **Max letszam**: 20 kutya / szombat
- **Ar**: 7 000 Ft / kutya / alkalom

**Foglalas menete:**
1. Ugyfél bejelentkezik (ha nincs, "Bejelentkezes" gomb jelenik meg)
2. Kivalaszt egy szombatot a legordulo listabol (csak szabad helyesek jelennek meg)
3. Kivalasztja, melyik kutyajat hozza (max 3)
4. Valaszt fizetesi modot: **online (Stripe)** vagy **keszpenz a helyszinen**
5. Kattint a "Foglalok" gombra
6. Online fizetesnel: atiranyitas a Stripe fizetesi oldalra, majd koszonjuk oldal
7. Keszpenznel: foglalas azonnal rogzitve, koszonjuk oldal

**Stripe fiok**: David fiokja kezeli a csoportos fizeteseket.

**Keszpenz**: A rendszer CRM bejegyzest keszit "KP" megjegyzessel. A helyszinen kell beszedni.

### 3.2 Napkozi (napkozi.html)

- **Mikor**: kedd--pentek, 8:00--17:00
- **Max letszam**: 50 kutya / nap
- **Berlet ervenyesseg**: 5 het a vasarlastol

**Berlet tipusok:**

| Tipus | 1 kutya | 2 kutya |
|-------|---------|---------|
| 4 alkalom, taxi nelkul | 26 500 Ft | 42 500 Ft |
| 8 alkalom, taxi nelkul | 44 000 Ft | 70 500 Ft |
| 4 alkalom, taxi <=10km | 39 500 Ft | 63 000 Ft |
| 8 alkalom, taxi <=10km | 70 500 Ft | 112 000 Ft |
| 4 alkalom, taxi >10km | 48 500 Ft | 77 500 Ft |
| 8 alkalom, taxi >10km | 88 000 Ft | 140 000 Ft |

**Egyszeri alkalom** is elerheto (berlet nelkul, magasabb egysegar).

**Foglalas menete:**
1. Ugyfél bejelentkezik
2. Kivalasztja a kutya szamot es taxi opciot
3. Kivalasztja a berlet tipust
4. Stripe fizetes (Viki fiokjan keresztul)
5. Fizetes utan: a sajat havi naptarbol valaszt napot (Ke-Pe, zold=szabad, piros=tele, arany=kivalasztott)
6. Idopont-valaszto: ora (8-16) + perc (00/15/30/45) -- taxinal rejtve (fix idoablak)
7. A rendszer automatikusan levonja az alkalmat a berletbol

**Taxi**: reggel 7:30--9:00 felvetel, delutan 17:00--18:00 hazavives. A taxi foglalasok automatikusan megjelennek a Taxi Menetrend tabban.

**Berlet kitolodas**: Ha a kutya panzioba kerul, a berlet lejárata automatikusan kitolodik annyi nappal, ahany ejszakat a panzioba tolt -- DE csak ha a berlet OSSZES kutyaja panzioba van.

**Fuggo foglalasok**: Ha az ugyfélnek nincs berlete es foglalni probal:
- A foglalas a **Napkozi Fuggo** tabra kerul
- Az ugyfél emailben kap Stripe fizetesi linket
- 24 ora mulva automatikus emlekeztetoget kap, ha nem fizetett

### 3.3 Panzio (panzio.html)

- **Max letszam**: 25 kutya / nap
- **Ar**: dinamikus kalkulator az oldalon (ejszakak x kutyaszam x opciok)

**Foglalas menete:**
1. Ugyfél kitolti: kutya szam (1--2), erkezes es tavozas datum, opciok
2. Az arkalkulator valos idoben mutatja a vegosszeget
3. Stripe fizetes (Timi fiokjan keresztul)
4. Sikeres fizetes utan: CRM bejegyzes + naptar event + visszaigazolo email

**Extra**: Panzio taxi add-on kulon rendelheto (panzio_taxi_checkout, Viki fiokjan keresztul).

### 3.4 Egyeni ora (egyeni-ora.html)

- **Foglalás**: Cal.com feluleten keresztul
- **Ket tipus**: palyanal / haznal
- Az ugyfél kivalasztja az idopontot a Cal.com naptarbol
- **Kutya valaszto**: az ugyfél kivalasztja melyik kutyajaval jon
- A rendszer automatikusan beirja a CRM EGYENI tabra
- A Cal.com event a Google Naptarba is bekerül (busy, blokkol mas egyeni orat)

### 3.5 Viselkedesterapia (viselkedesterapia.html)

- **Foglalás**: Cal.com feluleten keresztul (viselkedesterapia + viselkedesterapia-felmero slug)
- Az ugyfél kivalasztja az idopontot a Cal.com naptarbol
- CRM bejegyzes automatikus a TERAPIA tabra
- 24 oras lemondasi policy

### 3.6 Ingyenes felmero

- **MARAD Cal.com-on** (nem a sajat rendszeren!)
- Az ugyfél a viselkedesterapia oldalon talal ra
- Cal.com event: busy, Timi tartja szemelyesen
- Automatikus CRM bejegyzes

### 3.7 Kutyatura (kutyatura.html)

- **Mikor**: havonta, valtozo helyszinen
- **Max letszam**: 20 kutya / tura
- **Max kutya/fo**: 2

| | Online | Keszpenz |
|---|--------|----------|
| 1 kutya | 5 000 Ft | 6 000 Ft |
| 2 kutya | 8 000 Ft | 9 000 Ft |

A rendszer mutatja a kovetkezo tura datumat es szabad helyeket. Foglalás: kutya kiválasztás, fizetési mód választás (online/készpénz), majd foglalás. Stripe fiok: Dávid.

### 3.8 Orzo-vedo (orzo-vedo.html)

- **Foglalás**: Cal.com-on keresztul (orzo-vedo-szombat slug)
- **Fizetes**: **helyszinen**, 3 500 Ft / kutya (NEM Stripe!)
- Ha 2+ foglalas van adott szombatra: mindenkinek megerosito email megy
- CRM bejegyzes: ORZO_FOGLALAS tab

---

## 4. CRM tabok es szinkodolas

A teljes ugyfélkezeles egy **Google Sheets** tablazatban tortenik. A tabla automatikusan frissul minden foglalaskor.

### Fo tabok:

| Tab neve | Tartalom |
|----------|----------|
| **Osszes erdeklodo** | Minden weboldalrol erkezo erdeklodes (contact form) |
| **Egyeni ora** | Egyeni oktatas foglalasok (Cal.com-bol) |
| **Csoportos tanfolyam** | Szombati csoportos foglalasok |
| **Napkozi** | Napkozi bejegyzesek (napi szinten) |
| **Panzio** | Panzio foglalasok |
| **Kutyatura** | Tura foglalasok |
| **Viselkedesterapia** | Terapias foglalasok (Cal.com-bol) |
| **Kutyataxi** | Taxi bejegyzesek |
| **Orzo-vedo** | Orzo-vedo foglalasok (Cal.com-bol) |
| **Napkozi Berletek** | Aktiv/lejart berletek nyilvantartasa |
| **Felhasznalok** | Regisztralt felhasznalok + oltasi adatok (16 oszlop) |
| **Napkozi Fuggo** | Berlet nelkuli foglalasok (fizetesre varnak) |
| **Taxi Menetrend** | Kozponti taxi menetrend napi bontasban |
| **Pause Zart Napok** | Szolgaltatasokenti szunetek |

### Szinkodolas (automatikus):

- **Zold hatter** = az adott foglalas **MA** van
- **Sarga hatter** = a **legkozelebb jovoben** foglalas
- **Feher hatter** = tobbi

Ez automatikusan frissul foglalaskor. Ha valami elromlik: Apps Script editor > `crmSzinezesfrissites()` futtatas.

### Taxi Menetrend tab reszletesen

Ez a tab napi bontasban mutatja a taxi menetrendet:

| Oszlop | Tartalom |
|--------|----------|
| Taxi napja | A nap datuma |
| Idoablak | "Reggel (7:30-9:00)" = **hozas** / "Delutan (17:00-18:00)" = **hazavives** |
| Nev | Gazdi neve |
| Kutyak | Kutya neve(k) |
| Felveteli cim | Az ugyfél cime (hozasnal: az ugyfél cime; hazavivesnel: a palya cime) |
| Tavolsag | <=10km vagy >10km |
| Forras | Honnan jott a foglalas (Website / Cal.com) |
| Megjegyzes | Extra info |

**Fontos**: A hozas es hazavives KET KULON sor a tabban -- igy latod, hogy reggel kit kell felvenni es delutan kit kell hazavinni. A reggeli sorok "Reggel (7:30-9:00)" idoablakkal, a delutani sorok "Delutan (17:00-18:00)" idoablakkal jelennek meg.

### Napkozi Berletek tab oszlopai:

| Oszlop | Tartalom |
|--------|----------|
| Datum | Vasarlas datuma |
| Gazdi neve | Ugyfél neve |
| Kutya | Kutya neve |
| Email | Ugyfél emailje |
| Tipus | Berlet tipus (pl. "4 alk, 1 kutya, taxi nelkul") |
| Osszes | Osszes alkalom (4 vagy 8) |
| Felhasznalt | Eddig levont alkalmak |
| Maradek | Hatralevo alkalmak |
| Lejarat | Berlet lejarati datuma (vasarlas + 5 het) |
| Panzio kitolodas | Hany nappal tolodott ki panzioba miatt |
| Tenyleges lejar | Vegso lejarati datum kitolodas utan |
| Statusz | Aktiv / Kimerult / Lejart |
| Stripe session | Fizetes azonosito |
| Helyszin | Taxi cim |

---

## 5. Zart napok

Ha szabadsagra mesz vagy egy szolgaltatas szunetel, a **"Pause Zart Napok"** tabban kell beallitani.

### Hogyan:

1. Nyisd meg a Google Sheets CRM-et
2. Menj a **Pause Zart Napok** tabra
3. A tablazat igy nez ki:

| Szolgaltatas | Zarva 1 -tol | Zarva 1 -ig | Zarva 2 -tol | Zarva 2 -ig | Zarva 3 -tol | Zarva 3 -ig |
|--------------|-------------|-------------|-------------|-------------|-------------|-------------|
| Napkozi | 2026-05-01 | 2026-05-05 | | | | |
| Panzio | | | | | | |
| Csoportos | 2026-04-20 | 2026-04-20 | | | | |
| Kutyatura | | | | | | |
| Orzo-vedo | | | | | | |
| Egyeni ora | | | | | | |
| Viselkedesterapia | | | | | | |

4. Ird be a **kezdo es zaro datumot** `yyyy-mm-dd` formatumban (pl. 2026-05-01)
5. Max **3 zart intervallum** allithato be szolgaltatasonkent
6. A rendszer **5 percenkent** frissiti a cache-t, tehat kis kesessel ervenyes

**Mit csinal a zart nap:**
- A weboldalon az adott napokat **nem lehet foglalni** (naptarban piros/kiszurkitett)
- Ha valaki megis megprobalja: "Ez a nap nem foglalhato (zarva)" hibauzenet
- Csoportos: az adott szombat eltunik a valaszthato listabol
- Napkozi: a naptarban nem kattinthato

**Tipp**: Ha egy napra zarod be (pl. csoportos 1 szombat), a -tol es -ig datum legyen UGYANAZ.

---

## 6. Regi ugyfelek

A CRM-ben van egy **Regi ugyfelek** (👥) tab, amely lehetove teszi, hogy korabban regisztralt ugyfeleket gyorsan visszahozzunk a rendszerbe anelkul, hogy ujra vegig kellene menniuk a teljes konzultacios folyamaton.

### Hogyan mukodik:

1. Menj a 👥 tabra a Google Sheets CRM-ben
2. Add meg az ugyfél adatait:
   - **Email cim** (kotelezo -- ez azonositja az ugyfelet)
   - **Kutya 1 neve** (kotelezo)
   - **Kutya 2 neve** (opcionalis)
3. Az igy hozzaadott ugyfelek **atugorjak a konzultacios/felmeroi lepest** -- azonnal foglalhatnak szolgaltatast

Ez hasznos peldaul korabbi ugyfeleknek, akik mar jartaik nalad es ismerod a kutyajukat. Nem kell ujra ingyenes felmerore jonniuk.

---

## 7. Oltasi konyv rendszer

Ez az egyik legfontosabb biztonsagi funkcio -- **ervenyes oltas nelkul nem lehet foglalni egyetlen szolgaltatast sem**.

### Hogyan mukodik:

1. **Regisztraciokkor** az ugyfél feltolti az oltasi konyv fotojat + lejarat datumat
2. A foto a **Google Drive** "Wanderdogs_Oltasi_Konyvek" mappaba kerul
3. A lejarat datum a **Felhasznalok** tabra (kutyankent: oltas lejarat + kep URL -- osszesen 16 oszlop)
4. Minden foglalaskor a rendszer ellenorzi mind a frontend-en, mind a backend-en

### Emlekeztetok:

| Ido | Mi tortenik |
|-----|-------------|
| **30 nappal lejarat elott** | Automatikus emlekeztet email az ugyfélnek: "Frissitsd az oltasi konyvet!" |
| **Lejaratkor** | Timi is kap ertesitest + ugyfél figyelmeztetest |
| **Lejart utan** | Piros figyelmeztes a weboldalon foglalas helyett: "Foglalas nem lehetes: lejart oltasi konyv" + link a profilhoz |

### Blokkolas:

- **Weboldalon**: 6 szolgaltatas oldalon `wdOltasBlokk()` blokkolja a foglalast
- **Backend-en**: minden booking handler ellenorzi -- ha valahogy megis eljut a keres, a szerver is elutasitja

### Frissites:

Az ugyfél a **profil.html** oldalon barmikor frissitheti: uj datum + opcionálisan uj foto. Amint frissiti, azonnal tud ujra foglalni.

### Napi trigger:

Minden nap automatikusan lefut az `_oltasiEmlekeztetoEllenorzes()` -- megnezi az osszes regisztralt felhasznalot, es szukseg eseten emailt kuld.

---

## 8. Google Naptar

A foglalasok automatikusan bekerulnek a Wanderdogs Google Naptarba.

### Naptar bejegyzesek formatuma:

| Szolgaltatas | Naptar bejegyzes | Tipus |
|--------------|-----------------|-------|
| Panzio | "Panzio: [Nev] ([Kutyak])" | Normal (busy) |
| Csoportos | "Csoportos: [Nev]" | Normal (busy) |
| Napkozi | "Napkozi: [Kutya] - [Nev]" | **Atlatszo (transparent)** |
| Egyeni ora (Cal.com) | Cal.com event | Normal (busy) |
| Taxi | Sarga szinu bejegyzes | Megkulonbozteto |

### Fontos: Transparent vs Busy

A napkozi bejegyzesek **transparent** modban vannak, tehat **NEM blokkolják** az egyeni ora idopontokat a Cal.com-ban. Ez szandekos!

| Foglalas | Blokkol egyeni-t? | Blokkol napkozit? |
|---|---|---|
| Egyeni ora (Cal.com) | IGEN (busy) | NEM |
| Napkozi | NEM (transparent) | NEM |
| Panzio | NEM (transparent) | NEM |
| Ingyenes felmero | IGEN (busy, Timi tartja) | NEM |
| Manualis egyeni (Timi kezzel) | IGEN (busy) | NEM |

### Szabalyok:

- **Ne modositsd kezzel** a rendszer altal letrehozott naptarbejegyzeseket -- a CRM adatok nem a naptarbol jonnek
- **A kezi bejegyzeseidet** (pl. "social media marketing") a rendszer nem bantja -- csak a foglalasbol erkezo eventeket kezeli
- A rendszer NEM ir bele a te kezi bejegyzeseidbe (korabban volt ilyen bug, javitva lett)

---

## 9. Automatikus emailek

A rendszer automatikusan kuld emaileket -- neked semmit nem kell csinalnia. Minden email az **info.wanderdogs@gmail.com** fiokbol megy ki.

### Ugyfélnek kuldott emailek:

| Esemeny | Email tartalma |
|---------|----------------|
| **Regisztracio** | Udvozlo email, fiok letrehozva |
| **Csoportos foglalas** (online fizetes utan) | Visszaigazolas: datum, helyszin, kutyak, osszeg |
| **Csoportos foglalas** (keszpenz) | Foglalas rogzitve, helyszini fizetes emlekeztet |
| **Panzio foglalas** (fizetes utan) | Visszaigazolas: datumok, osszeg, reszletek |
| **Napkozi berlet vasarlas** | Berlet tipus, alkalmak szama, ervenyesseg |
| **Napkozi foglalas** (alkalomlenovas) | Foglalt nap + maradek alkalmak |
| **Kutyatura foglalas** | Tura datum, helyszin, kutyak |
| **Oltas lejarat elott 30 nappal** | Emlekeztet: "Frissitsd az oltasi konyvet!" |
| **Oltas lejart** | Figyelmeztetes: foglalas blokkolva amig nem frissit |

### Timinek kuldott emailek:

| Esemeny | Email tartalma |
|---------|----------------|
| **Uj erdeklodo** (contact form) | Nev, email, telefon, szolgaltatas, kutya adatok |
| **Minden foglalas** | Reszletes foglalas adatok (ki, mit, mikor, mennyiert) |
| **Kapacitas betelt** | "BETELT: [szolgaltatas] [datum]" figyelmeztetes |
| **Oltas lejart** | Melyik ugyfél melyik kutyajanal |
| **Zart napon foglalas** (pl. orzo-vedo Cal.com) | Figyelmeztetes: kezzel kell kezelni |
| **Orzo-vedo 2+ foglalas** | Megerosito email mindenkinek adott szombatra |

---

## 10. napiKarbantartas() trigger

A rendszerben van egy automatikus napi trigger ami minden nap lefut es elvegzi a karbantartasi feladatokat:

### Mit csinal:

1. **Oltasi emlekeztet ellenorzes** (`_oltasiEmlekeztetoEllenorzes()`):
   - Vegignezi az osszes regisztralt felhasznalot
   - 30 nappal lejarat elott: emlekeztet emailt kuld az ugyfélnek
   - Lejaratkor: ertesiti Timit is

2. **Berlet statusz frissites**:
   - Kimerult berletek (0 maradek alkalom) statuszt frissiti
   - Lejart berletek (5 het letelt) statuszt frissiti
   - Panzio kitolodas szamitas

3. **CRM szinezesfrissites**:
   - Frissiti a zold/sarga/feher szinkodolast az osszes tabban
   - Hogy reggel mindig aktualis legyen a kep

Ezt a triggert NEM kell kezzel futtatni -- automatikusan megy. Ha megis szukseges, az Apps Script editorban futtathato: `napiKarbantartas()`.

---

## 11. Stripe fizetesi rendszer

A rendszer **Stripe** fizetesi kaput hasznal. Jelenleg **sandbox (teszt) modban** van.

### Harom Stripe fiok:

| Fiok | Szolgaltatasok |
|------|---------------|
| **David fiokja** (STRIPE_SECRET_KEY) | Csoportos + Kutyatura fizetesek |
| **Timi fiokja** (STRIPE_KEY_PANZIO) | Panzio fizetesek |
| **Viki fiokja** (STRIPE_KEY_NAPKOZI) | Napkozi berletek + Panzio taxi |

### Hogyan mukodik:

1. Ugyfél kattint a "Foglalok" gombra
2. A szerver letrehoz egy Stripe checkout session-t (ar, ugyfél adatok, szolgaltatas alapjan)
3. Az ugyfél atiranyitodik a Stripe fizetesi oldalra
4. Sikeres fizetes utan: visszairanyitas a "koszonjuk" oldalra
5. A koszonjuk oldal meghivja a backend-et, ami: CRM bejegyzes + naptar + email

### Elesites elotti tennivalok:

1. Stripe Dashboard-on: **Test mode > Live mode** atkapcsolas (mind 3 fioknal)
2. GAS Script Properties-ben: csereld ki a test kulcsokat live kulcsokra
3. Success URL-ekben: GitHub Pages URL > **wanderdogsworld.hu**
4. **Stripe Dashboard "Kucsera David" > "Wanderdogs" nevet kell atirni** (David es Viki fiokoknal)

### Napkozi berlet Stripe linkek:

Minden Stripe link `?client_reference_id=TIPUS` parametert tartalmaz, ami azonositja a berlet tipusat. A linkek a `stripe linkek.txt` fajlban vannak osszegyujtve.

---

## 12. Biztonsag

### Auth token (munkamenet)

- Bejelentkezeskor a rendszer egy **24 oras auth token**-t general (SHA-256 hash / HMAC)
- Minden foglalasi keresnel a szerver ellenorzi a token ervenyesseget
- Ha a token lejart: *"Ervenytelen vagy lejart munkamenet. Kerlek jelentkezz be ujra."*
- A `berlet_check` es `berlet_foglalas` NEM hasznal auth-ot (kulon kezeles)
- Vedett muveletek: kutya_hozzaad, kutya_torol, es minden foglalasi handler

### Auto-logout (23 ora)

- A frontend **23 ora** utan automatikusan kijelentkezteti az ugyfelet (1 ora puffer a 24 oras token-hez kepest)
- Az ugyfél egyszeruen azt latja, hogy kijelentkeztettek -- ujra be kell lepnie
- Ez megakadalyozza, hogy valaki lejart token-nel probaljon foglalni

### Rate limiting

- Emailenkent **max 10 keres / perc** a szerver fele
- Ha valaki tul sokat probalkozik: *"Tul sok keres. Kerlek varj egy percet."*
- Ez megakadalyozza a spammelest es a visszaeleseket

### Race condition vedelem (LockService)

- Ha ket ugyfél **egyszerre** probal foglalni az utolso szabad helyre, a rendszer **sorba allitja** a kereseket
- Csak az elso foglalas sikerul, a masodik hibauzenet kap
- Ez megakadalyozza a tulfoglalast
- Erintett szolgaltatasok: csoportos, panzio, napkozi, kutyatura

---

## 13. Hibaelharitas

### "Az ugyfél nem tud foglalni, azt mondja nincs bejelentkezve"

Az ugyfél token-je valoszinuleg lejart (24 ora). Kerd meg, hogy **jelentkezzen ki, majd vissza**. Ezzel uj token-t kap.

### "A CRM szinei nem frissulnek"

Menj az Apps Script editorba es futtasd kezzel a `crmSzinezesfrissites()` fuggvenyt.

### "Egy ugyfél nem tud foglalni, azt irja 'lejart oltasi konyv'"

Az ugyfélnek frissitenie kell az oltasi konyvet a **profil.html** oldalon (uj datum + foto). Amint frissiti, azonnal tud foglalni.

### "Zart napot allitottam be, de az ugyfél meg foglalni tud"

A zart napok **5 perc cache**-sel mukodnek. Varj 5 percet es probald ujra. Ha tovabbra sem mukodik, ellenorizd:
- A datum formatuma helyes-e (`yyyy-mm-dd`)
- A szolgaltatas neve pontosan egyezik-e a tabban

### "A Stripe fizetes nem mukodik"

Jelenleg **sandbox modban** van. Eles fizeteshez:
1. Stripe Dashboard-on: Test mode > Live mode (mind 3 fiok!)
2. GAS Script Properties-ben: csereld ki a test kulcsokat live kulcsokra
3. Success URL-ekben: GitHub Pages URL > wanderdogsworld.hu

### "Egy ugyfél ketszer foglalt ugyanarra az idopontra"

A rendszer ellenorzi a dupla foglalasokat. A csoportosnal kulon dupla-check van beepitve. Ha megis megtortent, az valoszinuleg a regi rendszerben tortent (a LockService most mar megakadalyozza).

### "Berlet nem vonodik le"

Ellenorizd a **Napkozi Berletek** tabban:
- A berlet statusza "Aktiv"?
- Van maradek alkalom?
- Nem jart-e le az 5 het?
- A kutya neve pontosan egyezik-e?

### "Emailt szeretnek atirni / ugyfelet atregisztralni"

Ezt kezzel kell a **Felhasznalok** tabban. A weboldalon nincs email modositasi lehetoseg.

### "A naptar nem frissul / nem jelenik meg a foglalas"

Ellenorizd az Apps Script Executions logot (Script editor > Executions). Ha hibat latsz, a legtobb esetben ujrainditas (deploy) segit.

### "Timi kezi naptarbejegyzeseibe idegen adatok kerulnek"

Ez egy korabban javitott bug. A rendszer NEM modositja Timi kezi bejegyzeseit -- csak a foglalasbol erkezo eventeket kezeli. Ha megis elofordul, jelezd a fejlesztonek.

---

## 14. Cal.com alnaptar beallitas

Az egyeni orak es viselkedesterapia foglalasok Cal.com-on keresztul tortennek. A helyes mukodejshez fontos a naptar beallitas.

### Alapbeallitas:

1. Cal.com dashboard > **Availability** > ellenorizd, hogy a megfelelo idopontok vannak beallitva
2. Cal.com dashboard > **Event Types**:
   - `egyeni-oktatas-palyanal` -- egyeni ora a palyanal
   - `egyeni-oktatas-haznal` -- egyeni ora a haznal
   - `viselkedesterapia` -- viselkedesterapia
   - `viselkedesterapia-felmero` -- ingyenes felmero
   - `orzo-vedo-szombat` -- orzo-vedo foglalasok

### Alnaptar (Destination Calendar):

- Az egyeni oraknak kulon **alnaptar** van beallitva: **"Egyeni orak"**
- Cal.com > Settings > **Calendars** > az "Egyeni orak" naptart valaszd ki mint **Destination Calendar**
- Ez biztositja, hogy az egyeni ora foglalasok kulon naptarba keruljenek es ne keveredjenek a tobbievel
- A fo Wanderdogs naptar tovabbra is latja ezeket (ha be van kapcsolva az alnaptar megjelenitese a Google Calendar-ban)

### Fontos:

- A Cal.com **conflict check**-je a fo naptaron fut -- ha valami busy event van (egyeni ora, ingyenes felmero, kezi bejegyzes), az uj egyeni ora nem foglalhato arra az idopontra
- A napkozi es panzio bejegyzesek **transparent** modban vannak, tehat NEM blokkolnak egyeni ora idopontokat

---

## Osszefoglalo: Napi es heti teendok

| Feladat | Gyakorisag | Hol |
|---------|-----------|-----|
| Foglalasok ellenorzese (zold/sarga sorok) | **Naponta reggel** | Google Sheets CRM |
| Taxi menetrend atnezese | **Naponta reggel** | CRM > Taxi Menetrend tab |
| Email ertesitesek olvasasa | **Folyamatosan** | info.wanderdogs@gmail.com |
| Cal.com foglalasok kezelese | **Igeny szerint** | Cal.com dashboard |
| Zart napok beallitasa | **Szabadsag/szunet elott** | CRM > Pause Zart Napok tab |
| Fuggo foglalasok ellenorzese | **Hetente** | CRM > Napkozi Fuggo tab |
| Berletek allapota | **Hetente** | CRM > Napkozi Berletek tab |

**Ami automatikusan megy (NEM kell csinalnia semmit):**
- CRM bejegyzes minden foglalaskor
- Google Naptar event letrehozas
- Visszaigazolo emailek kuldese
- Oltasi emlekeztetok
- Berlet levonas
- Kapacitas ellenorzes
- Szinkodolas a CRM-ben
- napiKarbantartas() trigger (napi)
- Zart napok ervenyre juttatasa (5 perc cache)
