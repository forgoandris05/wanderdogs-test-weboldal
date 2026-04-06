# Wanderdogs Website -- Használati útmutató

Ez az útmutató a **wanderdogsworld.hu** weboldal teljes működését írja le: mit lát az ügyfél, mi történik a háttérben, és mit kell Timinek kezelnie.

---

## Tartalomjegyzék

1. [Ügyfél oldal -- Regisztráció és bejelentkezés](#1-ugyfél-oldal----regisztráció-és-bejelentkezés)
2. [Ügyfél oldal -- Profil és kutya kezelés](#2-ügyfél-oldal----profil-és-kutya-kezelés)
3. [Szolgáltatások és foglalás](#3-szolgáltatások-és-foglalás)
4. [Fizetés (Stripe)](#4-fizetés-stripe)
5. [Admin oldal -- Google Sheets CRM](#5-admin-oldal----google-sheets-crm)
6. [Admin oldal -- Zárt napok kezelése](#6-admin-oldal----zárt-napok-kezelése)
7. [Automatikus emailek](#7-automatikus-emailek)
8. [Oltási könyv rendszer](#8-oltási-könyv-rendszer)
9. [Google Naptár integráció](#9-google-naptár-integráció)
10. [Bérletek (napközi)](#10-bérletek-napközi)
11. [Biztonsági rendszer](#11-biztonsági-rendszer)
12. [Gyakori kérdések és hibaelhár��tás](#12-gyakori-kérdések-és-hibaelhárítás)

---

## 1. Ügyfél oldal -- Regisztráció és bejelentkezés

### Regisztráció

Az ügyfél a **regisztracio.html** oldalon tud fiókot létrehozni. Kötelező megadni:

- **Teljes név**
- **Telefonszám**
- **Email cím** (ez lesz a felhasználónév)
- **Jelszó** (min. 6 karakter)
- **Kutya adatok**: név, fajta, kor (max 4 kutya)
- **Oltási könyv**: lejárat dátuma + fotó feltöltése (JPG/PNG, max 5 MB)
- **Probléma/cél leírás** (szöveges mező)

Regisztráció után az ügyfél automatikusan be van jelentkezve, és a rendszer:
- elmenti az adatokat a **Felhasználók** Google Sheets tabra
- feltölti az oltási könyv fotóját a **Google Drive**-ra
- visszairányítja az ügyfelet arra az oldalra, ahonnan jött (pl. csoportos.html)

### Bejelentkezés

A **bejelentkezes.html** oldalon email + jelszó kell. Sikeres bejelentkezés után az ügyfél adatai a böngésző memóriájába (localStorage) kerülnek, és **23 óráig érvényesek**. Utána automatikusan kijelentkezteti a rendszer (lásd: Biztonsági rendszer).

---

## 2. Ügyfél oldal -- Profil és kutya kezelés

A **profil.html** oldalon az ügyfél:

- Látja a saját nevét és email címét
- Látja a regisztrált kutyáit, mindegyiknél:
  - **Zöld badge** = érvényes oltás (dátummal)
  - **Piros badge** = lejárt oltás (dátummal)
  - **Szürke badge** = hiányzó oltási adat
- **Frissítheti** az oltási könyvet (új fotó + dátum)
- **Hozzáadhat** új kutyát (max 4 összesen)
- **Törölhet** kutyát
- **Törölheti a teljes fiókját** (visszavonhatatlan!)
- Kijelentkezhet

---

## 3. Szolgáltatások és foglalás

### Csoportos oktatás (csoportos.html)

- **Mikor**: minden szombat, 9:00--10:00
- **Hol**: Solymár, Rozália sor
- **Max létszám**: 20 kutya / szombat
- **Ár**: 7 000 Ft / kutya / alkalom

**Foglalás menete:**
1. Ügyfél bejelentkezik (ha nincs, "Bejelentkezés" gomb jelenik meg)
2. Kiválaszt egy szombatot a legördülő listából (csak szabad helyesek jelennek meg)
3. Kiválasztja, melyik kutyáját hozza (max 3)
4. Választ fizetési módot: **online (Stripe)** vagy **készpénz a helyszínen**
5. Kattint a "Foglalok" gombra
6. Online fizetésnél: átirányítás a Stripe fizetési oldalra
7. Készpénznél: foglalás azonnal rögzítve, köszönjük oldal

### Napközi (napkozi.html)

- **Mikor**: kedd--péntek, 8:00--17:00
- **Max létszám**: 50 kutya / nap
- **Érvényesség**: 5 hét a vásárlástól

**Bérlet típusok (ár kutya szám és taxi szerint változik):**

| Típus | 1 kutya | 2 kutya |
|-------|---------|---------|
| 4 alkalom, taxi nélkül | 26 500 Ft | 42 500 Ft |
| 8 alkalom, taxi nélkül | 44 000 Ft | 70 500 Ft |
| 4 alkalom, taxi ≤10km | 39 500 Ft | 63 000 Ft |
| 8 alkalom, taxi ≤10km | 70 500 Ft | 112 000 Ft |
| 4 alkalom, taxi >10km | 48 500 Ft | 77 500 Ft |
| 8 alkalom, taxi >10km | 88 000 Ft | 140 000 Ft |

**Egyszeri alkalom is elérhető** (bérlet nélkül, magasabb egységár).

**Foglalás menete:**
1. Ügyfél bejelentkezik
2. Kiválasztja a kutya számot és taxi opciót
3. Kiválasztja a bérlet típust
4. Stripe fizetés
5. Fizetés után: naptárból választ napot a bérleten belül
6. A rendszer automatikusan levonja az alkalmat a bérletből

**Taxi**: reggel 7:30--9:00 felvétel, délután 17:00--18:00 hazavivés.

### Panzió (panzio.html)

- **Max létszám**: 25 kutya / nap
- **Ár**: dinamikus kalkulátor az oldalon (éjszakák × kutyaszám × opciók)

**Foglalás menete:**
1. Ügyfél kitölti: kutya szám (1--2), érkezés és távozás dátum, opciók
2. Az árkalkulátor valós időben mutatja a végösszeget
3. Stripe fizetés
4. Sikeres fizetés után: CRM bejegyzés + naptár event + visszaigazoló email

**Extra**: Panzió taxi add-on külön rendelhető (panzio_taxi_checkout).

### Kutyatúra (kutyatura.html)

- **Mikor**: havonta, változó helyszínen
- **Max létszám**: 20 kutya / túra
- **Max kutya/fő**: 2

| | Online | Készpénz |
|---|--------|----------|
| 1 kutya | 5 000 Ft | 6 000 Ft |
| 2 kutya | 8 000 Ft | 9 000 Ft |

**Foglalás menete:**
1. A rendszer mutatja a következő túra dátumát és szabad helyeket
2. Ügyfél kiválasztja a kutyáit
3. Választ fizetési módot (online / készpénz)
4. Foglalás

### Egyéni oktatás, Viselkedésterápia, Őrző-védő

Ezek **Cal.com**-on keresztül foglalhatók (nem a saját foglalási rendszeren). Az ügyfél kiválasztja az időpontot a Cal.com naptárból, és a rendszer automatikusan beírja a CRM-be.

---

## 4. Fizetés (Stripe)

A rendszer **Stripe** fizetési kaput használ. Jelenleg **sandbox (teszt) módban** van -- élesítés előtt át kell kapcsolni live módra.

**Hogyan működik:**
1. Ügyfél kattint a "Foglalok" gombra
2. A szerver létrehoz egy Stripe checkout session-t (az ár, ügyfél adatok, szolgáltatás alapján)
3. Az ügyfél átirányítódik a Stripe fizetési oldalra
4. Sikeres fizetés után: visszairányítás a "köszönjük" oldalra
5. A köszönjük oldal meghívja a backend-et, ami: CRM bejegyzés + naptár + email

**Stripe fiókok:**
- Dávid fiókja: csoportos + kutyatúra fizetések
- Timi fiókja: panzió fizetések
- Viki fiókja: napközi + panzió taxi fizetések

> **Fontos**: Élesítés előtt a Stripe Dashboard-on "Kucsera Dávid" → "Wanderdogs" nevet kell átírni (Dávid és Viki fiókoknál).

---

## 5. Admin oldal -- Google Sheets CRM

A teljes ügyfélkezelés egy **Google Sheets** táblázatban történik. A tábla automatikusan frissül minden foglaláskor.

### Fő tabok:

| Tab neve | Tartalom |
|----------|----------|
| **Összes érdeklődő** | Minden weboldalról érkező érdeklődés |
| **Egyéni óra** | Egyéni oktatás foglalások |
| **Csoportos tanfolyam** | Szombati csoportos foglalások |
| **Napközi** | Napközi bejegyzések (napi szinten) |
| **Panzió** | Panzió foglalások |
| **Kutyatúra** | Túra foglalások |
| **Viselkedésterápia** | Terápiás foglalások |
| **Kutyataxi** | Taxi menetrendek |
| **Őrző-védő** | Őrző-védő foglalások |
| **Napközi Bérletek** | Aktív/lejárt bérletek nyilvántartása |
| **Felhasználók** | Regisztrált felhasználók + oltási adatok |
| **Napközi Függő** | Bérlet nélküli foglalások (fizetésre várnak) |
| **Taxi Menetrend** | Központi taxi menetrend napi bontásban |
| **⏸️ Zárt Napok** | Szolgáltatásonkénti szünetek |

### Színkódolás (automatikus):

- **Zöld háttér** = az adott foglalás **ma** van
- **Sárga háttér** = a **legközelebbi jövőbeli** foglalás
- **Fehér háttér** = többi

Ez automatikusan frissül foglaláskor. Ha valami elromlik, kézzel futtatható: Apps Script editor → `crmSzinezesfrissites()` futtatás.

---

## 6. Admin oldal -- Zárt napok kezelése

Ha Timi szabadságra megy vagy egy szolgáltatás szünetel, a **"⏸️ Zárt Napok"** tabban kell beállítani.

### Hogyan:

1. Nyisd meg a Google Sheets CRM-et
2. Menj a **⏸️ Zárt Napok** tabra
3. A táblázat így néz ki:

| Szolgáltatás | Zárva 1 -tól | Zárva 1 -ig | Zárva 2 -tól | Zárva 2 -ig | Zárva 3 -tól | Zárva 3 -ig |
|--------------|-------------|-------------|-------------|-------------|-------------|-------------|
| Napközi | 2026-05-01 | 2026-05-05 | | | | |
| Panzió | | | | | | |
| Csoportos | 2026-04-20 | 2026-04-20 | | | | |
| Kutyatúra | | | | | | |
| Őrző-védő | | | | | | |
| Egyéni óra | | | | | | |
| Viselkedésterápia | | | | | | |

4. Írd be a **kezdő és záró dátumot** `yyyy-mm-dd` formátumban
5. Max **3 zárt intervallum** állítható be szolgáltatásonként
6. A rendszer **5 percenként** frissíti a cache-t, tehát kis késéssel érvényesül

**Mit csinál a zárt nap:**
- A weboldalon az adott napokat **nem lehet foglalni** (a naptárban pirosak/kiszürkítettek)
- Ha valaki mégis megpróbálja: "Ez a nap nem foglalható (zárva)" hibaüzenet
- Csoportos: az adott szombat eltűnik a választható listából
- Napközi: a naptárban nem kattintható

> **Tipp**: Ha egy napra zárod be (pl. csoportos 1 szombat), a -tól és -ig dátum legyen ugyanaz.

---

## 7. Automatikus emailek

A rendszer automatikusan küld emaileket -- Timinek semmit nem kell csinálnia.

### Ügyfélnek küldött emailek:

| Esemény | Email tartalma |
|---------|----------------|
| **Regisztráció** | Üdvözlő email, fiók létrehozva |
| **Csoportos foglalás** (online fizetés után) | Visszaigazolás: dátum, helyszín, kutyák, összeg |
| **Csoportos foglalás** (készpénz) | Foglalás rögzítve, helyszíni fizetés emlékeztető |
| **Panzió foglalás** (fizetés után) | Visszaigazolás: dátumok, összeg, részletek |
| **Napközi bérlet vásárlás** | Bérlet típus, alkalmak száma, érvényesség |
| **Napközi foglalás** (alkalomlevonás) | Foglalt nap + maradék alkalmak |
| **Kutyatúra foglalás** | Túra dátum, helyszín, kutyák |
| **Oltás lejárat előtt 30 nappal** | Emlékeztető: "Frissítsd az oltási könyvet!" |
| **Oltás lejárt** | Figyelmeztetés: foglalás blokkolva amíg nem frissít |

### Timinek küldött emailek:

| Esemény | Email tartalma |
|---------|----------------|
| **Új érdeklődő** (contact form) | Név, email, telefon, szolgáltatás, kutya adatok |
| **Minden foglalás** | Részletes foglalás adatok (ki, mit, mikor, mennyiért) |
| **Kapacitás betelt** | "BETELT: [szolgáltatás] [dátum]" figyelmeztetés |
| **Oltás lejárt** | Melyik ügyfél melyik kutyájánál |
| **Zárt napon foglalás** (pl. őrző-védő Cal.com) | Figyelmeztetés: kézzel kell kezelni |

Minden email az **info.wanderdogs@gmail.com** fiókból megy ki.

---

## 8. Oltási könyv rendszer

Ez az egyik legfontosabb biztonsági funkció -- **érvényes oltás nélkül nem lehet foglalni egyetlen szolgáltatást sem**.

### Hogyan működik:

1. **Regisztrációkor** az ügyfél feltölti az oltási könyv fotóját + lejárat dátumát
2. A fotó a **Google Drive** "Wanderdogs_Oltasi_Konyvek" mappába kerül
3. A lejárat dátum a **Felhasználók** tabra
4. Minden foglaláskor a rendszer ellenőrzi, hogy érvényes-e

### Mi történik ha lejárt:

- **Weboldalon**: piros figyelmeztetés jelenik meg a foglalási űrlap helyett: *"Foglalás nem lehetséges: lejárt oltási könyv"* + link a profilhoz
- **Backend-en**: ha valahogy mégis eljut a kérés, a szerver is elutasítja
- **30 nappal lejárat előtt**: automatikus emlékeztető email az ügyfélnek
- **Lejáratkor**: Timi is kap értesítést

### Frissítés:

Az ügyfél a **profil.html** oldalon bármikor frissítheti: új dátum + opcionálisan új fotó. Amint frissíti, azonnal tud újra foglalni.

### Napi trigger:

Minden nap automatikusan lefut az `_oltasiEmlekeztetoEllenorzes()` -- megnézi az összes regisztrált felhasználót, és szükség esetén emailt küld.

---

## 9. Google Naptár integráció

A foglalások automatikusan bekerülnek a Wanderdogs Google Naptárba.

| Szolgáltatás | Naptár bejegyzés | Típus |
|--------------|-----------------|-------|
| Panzió | "🏨 Panzió: [Név] ([Kutyák])" | Normál (busy) |
| Csoportos | "🐶 Csoportos: [Név]" | Normál (busy) |
| Napközi | "Napközi: [Kutya] - [Név]" | **Átlátszó (transparent)** |
| Egyéni óra (Cal.com) | Cal.com event | Normál (busy) |

> **Fontos**: A napközi bejegyzések **transparent** módban vannak, tehát nem blokkolják az egyéni óra időpontokat a Cal.com-ban. Ez szándékos!

### Mit NEM szabad csinálni:

- **Ne módosítsd kézzel** a rendszer által létrehozott naptárbejegyzéseket -- a CRM adatok nem a naptárból jönnek
- **A kézi bejegyzéseidet** (pl. "social media marketing") a rendszer nem bántja (csak a foglalásból érkező eventeket kezeli)

---

## 10. Bérletek (napközi)

### Bérlet nyilvántartás:

A **Napközi Bérletek** tabban látható minden aktív és lejárt bérlet:

| Oszlop | Tartalom |
|--------|----------|
| Dátum | Vásárlás dátuma |
| Gazdi neve | Ügyfél neve |
| Kutya | Kutya neve |
| Email | Ügyfél emailje |
| Típus | Bérlet típus (pl. "4 alk, 1 kutya, taxi nélkül") |
| Összes | Összes alkalom (4 vagy 8) |
| Felhasznált | Eddig levont alkalmak |
| Maradék | Hátralévő alkalmak |
| Lejárat | Bérlet lejárati dátuma (vásárlás + 5 hét) |
| Státusz | Aktív / Kimerült / Lejárt |
| Stripe session | Fizetés azonosító |

### Automatikus működés:

- Foglaláskor a rendszer automatikusan **levonja** az alkalmat
- Ha az összes alkalom elfogyott: státusz → **"Kimerült"**
- Ha lejárt a 5 hét: státusz → **"Lejárt"**
- **Bérlet kitolódás**: ha a kutya panzióban van, a bérlet lejárata automatikusan kitolódik annyi nappal, ahány éjszakát a panzióban tölt (de CSAK ha a bérlet ÖSSZES kutyája panzióban van)

### Függő foglalások:

Ha az ügyfélnek **nincs bérletre** és foglalni próbál:
- A foglalás a **Napközi Függő** tabra kerül
- Az ügyfél emailben kap Stripe fizetési linket
- 24 óra múlva automatikus emlékeztető, ha nem fizetett

---

## 11. Biztonsági rendszer

### Auth token (munkamenet)

- Bejelentkezéskor a rendszer egy **24 órás auth token**-t generál (SHA-256 hash)
- Minden foglalási kérésnél a szerver ellenőrzi a token érvényességét
- Ha a token lejárt: *"Érvénytelen vagy lejárt munkamenet. Kérlek jelentkezz be újra."*

### Auto-logout (23 óra)

- A frontend **23 óra** után automatikusan kijelentkezteti az ügyfelet (1 óra puffer a 24 órás token-hez képest)
- Az ügyfél egyszerűen azt látja, hogy kijelentkeztették -- újra be kell lépnie
- Ez megakadályozza, hogy valaki lejárt token-nel próbáljon foglalni

### Rate limiting

- Emailenként **max 10 kérés / perc** a szerver felé
- Ha valaki túl sokat próbálkozik: *"Túl sok kérés. Kérlek várj egy percet."*
- Ez megakadályozza a spammelést és a visszaéléseket

### Race condition védelem (LockService)

- Ha két ügyfél **egyszerre** próbál foglalni az utolsó szabad helyre, a rendszer **sorba állítja** a kéréseket
- Csak az első foglalás sikerül, a második hibaüzenetet kap
- Ez megakadályozza a túlfoglalást
- Érintett szolgáltatások: csoportos, panzió, napközi, kutyatúra

---

## 12. Gyakori kérdések és hibaelhárítás

### "Az ügyfél nem tud foglalni, azt mondja nincs bejelentkezve"

Az ügyfél token-je valószínűleg lejárt (24 óra). Kérje meg, hogy **jelentkezzen ki, majd vissza**. Ezzel új token-t kap.

### "A CRM színei nem frissülnek"

Menj az Apps Script editorba és futtasd kézzel a `crmSzinezesfrissites()` függvényt.

### "Egy ügyfél nem tud foglalni, azt írja 'lejárt oltási könyv'"

Az ügyfélnek frissítenie kell az oltási könyvét a **profil.html** oldalon (új dátum + fotó). Amint frissíti, azonnal tud foglalni.

### "Zárt napot állítottam be, de az ügyfél még foglalni tud"

A zárt napok **5 perc cache**-sel működnek. Várj 5 percet és próbáld újra. Ha továbbra sem működik, ellenőrizd, hogy a dátum formátuma helyes-e (`yyyy-mm-dd`).

### "A Stripe fizetés nem működik"

Jelenleg **sandbox módban** van. Éles fizetéshez:
1. Stripe Dashboard-on: Test mode → Live mode
2. GAS Script Properties-ben: cseréld ki a test kulcsokat live kulcsokra
3. Success URL-ekben: github pages URL → wanderdogsworld.hu

### "Egy ügyfél kétszer foglalt ugyanarra az időpontra"

A rendszer ellenőrzi a dupla foglalásokat a csoportos és napközi foglalasoknál. Ha mégis megtörtént, az valószínűleg a régi rendszerben történt (a LockService most már megakadályozza).

### "Bérlet nem vonódik le"

Ellenőrizd a **Napközi Bérletek** tabban:
- A bérlet státusza "Aktív"?
- Van maradék alkalom?
- Nem járt-e le a 5 hét?
- A kutya neve pontosan egyezik-e?

### "Emailt szeretnék átírni / ügyfelet átregisztrálni"

Ezt kézzel kell a **Felhasználók** tabban. A weboldalon nincs email módosítási lehetőség.

---

## Összefoglaló: Mit kell Timinek napi szinten csinálnia?

| Feladat | Gyakoriság | Hol |
|---------|-----------|-----|
| Foglalások ellenőrzése | Naponta reggel | Google Sheets CRM (zöld = ma) |
| Email értesítések olvasása | Folyamatosan | info.wanderdogs@gmail.com |
| Cal.com foglalások kezelése | Igény szerint | Cal.com dashboard |
| Zárt napok beállítása | Szabadság/szünet előtt | CRM → ⏸️ Zárt Napok tab |
| Függő foglalások ellenőrzése | Hetente | CRM → Napközi Függő tab |

**Ami automatikusan megy (nem kell csinálni semmit):**
- CRM bejegyzés minden foglaláskor
- Google Naptár event létrehozás
- Visszaigazoló emailek küldése
- Oltási emlékeztetők
- Bérlet levonás
- Kapacitás ellenőrzés
- Színkódolás a CRM-ben
