# Wanderdogs Website - Tesztelesi Terv

## Hogyan tesztelj
- Nyisd meg a weboldalt (GitHub Pages vagy lokalis)
- Menj vegig minden ponton sorban
- Jelold be amit leteszteltel [x]
- Ha hibat talalsz, ird melle mit csinal rosszul

---

## 1. NAVIGACIO (minden oldalon)

- [ ] Logo kattintas → fooldal
- [ ] Szolgaltatasok dropdown megnyilik (mobil: kattintasra, desktop: hoverrel)
- [ ] Minden nav link jo helyre visz
- [ ] **Kurzusok link → wanderdogsworld.com/courses/ (uj tabban nyilik)**
- [ ] Footer linkek mukodnek (szolgaltatasok, kontakt, Facebook)
- [ ] Footer "Online kurzusok" → wanderdogsworld.com/courses/
- [ ] Telefon link hivast indit mobilon
- [ ] Email link email klienst nyit
- [ ] Scroll hatasra navbar arnyekot kap
- [ ] Aktiv oldal alahuzva a navban

### Mobil navigacio
- [ ] Burger menu megnyilik/bezarul
- [ ] Menu linkek mukodnek
- [ ] Menu bezarul link kattintas utan
- [ ] "Foglalj idopontot" gomb lathato

---

## 2. FOOLDAL (index.html)

- [ ] Hero szekciok valtakoznak (cycling hero)
- [ ] "Kepzest kezdek" gomb → #szolgaltatasok
- [ ] "Megnenem a kurzusokat" → wanderdogsworld.com/courses/ (uj tab)
- [ ] Szolgaltatas kartyak megjelennek, linkek mukodnek
- [ ] Scroll animaciok (reveal) mukodnek
- [ ] Szamlalo animacio (statisztikak)
- [ ] Belepett user: "Szia, [Nev]!" + Kilepes gomb a navban
- [ ] Nem belepett: Belepes + Regisztracio gombok a navban

---

## 3. REGISZTRACIO (regisztracio.html)

### Sikeres regisztracio
- [ ] Kitoltod: nev, telefon, email, jelszo (6+ karakter), jelszo megegyszer
- [ ] 1 kutya: nev + fajta + kor + oltas lejarat + oltas foto
- [ ] Submit → "Feltoltes..." felirat → siker → 4mp visszaszamlalas → atiranyitas
- [ ] localStorage-ban megjelenik a user (`wd_user`)
- [ ] CRM-be bekerul (Google Sheet ellenorzes)
- [ ] Email ertesites erkezik (admin email)

### Tobb kutya
- [ ] "+ Meg egy kutyat is hozok" gomb → uj kutya blokk jelenik meg (max 4)
- [ ] 2-3-4 kutyaval is sikeres regisztracio
- [ ] Kutya blokk torlese mukodik

### Kep feltoltes
- [ ] Kep kivalasztasa → elonezet megjelenik
- [ ] 5 MB feletti kep → hibauzenet
- [ ] Nem kep fajl → elutasitva

### Validaciok
- [ ] Ures mezok → hibauzenet
- [ ] Jelszo < 6 karakter → "A jelszo legalabb 6 karakter legyen"
- [ ] Jelszavak nem egyeznek → "A ket jelszo nem egyezik"
- [ ] Mar regisztralt email → "Ez az email cim mar regisztralva van!"

### ?return parameter
- [ ] `/regisztracio.html?return=csoportos.html` → sikeres reg utan csoportos.html-re iranyit

---

## 4. BEJELENTKEZES (bejelentkezes.html)

- [ ] Helyes email + jelszo → sikeres belepes → atiranyitas
- [ ] Hibas email → "Hibas email vagy jelszo"
- [ ] Hibas jelszo → "Hibas email vagy jelszo"
- [ ] Ures mezok → hibauzenet
- [ ] ?return parameter mukodik (belepes utan visszavisz az eredeti oldalra)
- [ ] "Regisztralok" link → regisztracio.html

---

## 5. PROFIL (profil.html)

### Alapmukodesek
- [ ] Nem belepett user → atiranyitas bejelentkezes.html-re
- [ ] Belepett user → megjelenik: nev, email, kutyak listaja
- [ ] "Vissza a fooldalra" gomb mukodik
- [ ] "Kilepes" gomb → localStorage torlodik, atiranyitas fooldal

### Kutya kezeles
- [ ] Kutyak listaja megjelenik nevvel, fajtaval, korral
- [ ] Oltas statusz badge: zold (ervenyes) / piros (lejart) / szurke (nincs megadva)
- [ ] "+ Hozzaadas" → uj kutya form
- [ ] Uj kutya: nev + fajta + oltas lejarat + kep → mentve
- [ ] Kutya torles → megerosites dialog → torolve
- [ ] Oltas frissites: uj datum + opcionalis uj kep → mentve

### Fiok torles
- [ ] "Fiok torlese" → megerosites → fiok torolve, kilepes

---

## 6. EGYENI ORA (egyeni-ora.html)

- [ ] 3 arkartyak megjelennek (Palyan / Kulso / Haznal)
- [ ] "Foglalj" gomb → smooth scroll a foglalasi szekciohoz
- [ ] Cal.com embed betoltodik
- [ ] FAQ kerdesek kattintasra kinyilnak/bezarulnak
- [ ] Kep karuszell (marquee) fut

---

## 7. CSOPORTOS OKTATAS (csoportos.html)

### Nem belepett
- [ ] "Bejelentkezes a foglalashoz" + "Regisztracio" gombok lathatoak
- [ ] Gombok ?return=csoportos.html parameterrel iranyitanak

### Belepett
- [ ] Szombat valaszto dropdown betoltodik (elerheto datumok)
- [ ] Kutya checkboxok megjelennek (localStorage-bol)
- [ ] Max 3 kutya jelolheto
- [ ] Fizetesi mod: Online / Kesz penz valasztas
- [ ] Ar szamitas: 7000 Ft x kutya szam
- [ ] **Online fizetes**: Stripe checkout → csoportos-koszonjuk.html
- [ ] **Keszpenz**: redirect → csoportos-koszonjuk.html?tipus=csoportos_kp

### Facebook
- [ ] Facebook csoport gomb → https://www.facebook.com/groups/1290882328127343

---

## 8. NAPKOZI (napkozi.html)

### Berletek
- [ ] Filter tabok mukodnek (Berletek / Taxi nelkul / 10km / 25km+)
- [ ] Berlet kartyak megjelennek a kivalasztott szurovel
- [ ] "Foglalj" gomb → konfigurator szekcio

### Konfigurator
- [ ] Berlet valasztas: 4 / 8 alkalmas
- [ ] Kutyak szama: 1-3
- [ ] Taxi opció ki/be
- [ ] **Ar szamitas helyessege** (berlet x kutyak + taxi felár)
- [ ] Elerheto datumok betoltodnek

### Foglalas
- [ ] Belepett user adatai kitoltodnek automatikusan
- [ ] Hozas napja + idopontja kivalaszthato
- [ ] Csere lehetoseg dropdown
- [ ] "Berlet rendelem" → Stripe checkout → napkozi-koszonjuk.html
- [ ] Oltas ellenorzes: lejart oltas blokkolja a foglalast

### Facebook
- [ ] Facebook csoport gomb → https://www.facebook.com/groups/359455115438693

---

## 9. PANZIO (panzio.html)

### Kalkulator
- [ ] Bekoltozes datum + ora (8-18) valasztas
- [ ] Kikoltozes datum + ora valasztas
- [ ] Ejszakak szama helyesen szamolodik
- [ ] Kutya neve elore kitoltve (belepett user)
- [ ] Kutya neme (Him/Nosteny) valasztas
- [ ] Etel biztositas checkbox
- [ ] Egyeb specialis igeny textarea
- [ ] Tobb kutya kozti valtas gombokkal

### Ar szamitas
- [ ] Alapar x ejszakak x kutyak
- [ ] Etel felar hozzaadodik
- [ ] Taxi felar (zona valasztas: ≤10km / 10-25km / 25km+)
- [ ] Osszeg helyesen jelenik meg

### Fizetes
- [ ] "Nem visszateritendo" checkbox kotelezo
- [ ] "Fizess az internetrol" → Stripe checkout → panzio-koszonjuk.html
- [ ] Oltas ellenorzes blokkolja ha lejart

---

## 10. KUTYATURA (kutyatura.html)

- [ ] Kovetkezo tura datum/helyszin betoltodik (ha van meghirdetve)
- [ ] Ha nincs tura: "Jelenleg nincs meghirdetett tura" uzenet
- [ ] Reszveteli dij tablazat megjelenik (1-2 kutya, online/kp)
- [ ] **"Jelentkezes Facebookon" hero gomb → FB csoport** (https://www.facebook.com/groups/956709845427195)
- [ ] **"Facebook kozosseg" gomb → FB csoport**
- [ ] Oltas ellenorzes mukodik

---

## 11. TANFOLYAMOK (tanfolyamok.html)

- [ ] "Tanfolyamok hamarosan" felirat megjelenik
- [ ] 3 info kartya (Alapozo, Lepesrol lepesre, Kis csoport)
- [ ] **"Jelentkezes es informaciok Facebookon" gomb → https://www.facebook.com/wanderdogskutyakikepzes**
- [ ] Masodik szekcioba is FB gomb mukodik

---

## 12. WORKSHOPOK (workshopok.html)

- [ ] Szimatkaland Workshop reszletek: apr. 12, Solymar
- [ ] Mikor / Hol / Ar informaciok megjelennek
- [ ] **"Jelentkezes es tobb informacio Facebookon" gomb → https://www.facebook.com/wanderdogskutyakikepzes**
- [ ] "Miert workshop?" szekció 3 kartya megjelenik

---

## 13. EGYEB OLDALAK

### Viselkedesterapia
- [ ] Oldal betolt, informaciok megjelennek
- [ ] Kapcsolat gomb/link mukodik

### Orzo-vedo
- [ ] Oldal betolt, informaciok megjelennek
- [ ] Ar: 3500 Ft
- [ ] Kapcsolat/foglalas mukodik

### Kutyataxi
- [ ] 3 zona kartya megjelenik arakkal
- [ ] "Arajanlatot kerek" email link mukodik
- [ ] Linkek napkozi + panzio taxi szekciohoz

### Rolunk
- [ ] Oldal betolt (tartalom Timitol fuggo)
- [ ] Linkek mukodnek

### VIP
- [ ] Oldal betolt
- [ ] Tartalom megjelenik

---

## 14. KOSZONJUK OLDALAK (fizetes utan)

### csoportos-koszonjuk.html
- [ ] Stripe fizetes utan: session_id ellenorzese → adatok megjelennek (nev, datum, kutyak, osszeg)
- [ ] Keszpenz fizetes utan: tipus=csoportos_kp → siker uzenet + datum

### napkozi-koszonjuk.html
- [ ] Stripe session ellenorzese → berlet reszletek megjelennek

### panzio-koszonjuk.html
- [ ] Stripe session ellenorzese → foglalas reszletek (datumok, ejszakak, osszeg)

### panzio-taxi-koszonjuk.html
- [ ] Taxi foglalas megerositese

### kutyatura-koszonjuk.html
- [ ] Tura foglalas megerositese

---

## 15. OLTAS RENDSZER (cross-cutting)

- [ ] Ervenyes oltas → foglalasi formok engedelyezve
- [ ] Lejart oltas → figyelmeztetes + foglalasi form blokkolva
- [ ] Hianyzó oltas → figyelmeztetes + link a profilhoz
- [ ] Oltas lejarat frissites profilbol → ujra engedelyezve
- [ ] Ellenorizd ezeken az oldalakon: csoportos, napkozi, panzio, kutyatura

---

## 16. MOBIL TESZTELES

Teszteld telefonon (vagy Chrome DevTools mobil nezet):

### 320px (kis telefon)
- [ ] Minden oldal hasznalhato, semmi nem log ki
- [ ] Szovegek olvashatoak
- [ ] Gombok kattinthatoak (min 44px)

### 375px (iPhone SE/mini)
- [ ] Formok jol neznek ki
- [ ] Kartyak egymás ala kerulnek
- [ ] Kepek nem lognak ki

### 768px (tablet)
- [ ] 2 oszlopos elrendezes ahol releváns
- [ ] Nav meg burger vagy mar desktop?

### Mobil-specifikus
- [ ] Datum valaszto mukodik mobilon
- [ ] Fajl feltoltes mukodik mobilon (kamera + galeria)
- [ ] Stripe checkout mobilon
- [ ] Gorgetés sima, nincs ragadas

---

## 17. STRIPE TESZTELES (sandbox mod)

Tesztkartyak:
- **Sikeres fizetes**: 4242 4242 4242 4242 (barmilyen datum/CVC)
- **Elutasitott**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Minden Stripe-os szolgaltatasnal:
- [ ] Csoportos online fizetes → Stripe → koszonjuk oldal
- [ ] Napkozi berlet fizetes → Stripe → koszonjuk oldal
- [ ] Panzio fizetes → Stripe → koszonjuk oldal
- [ ] Elutasitott kartya → Stripe hibauzenet
- [ ] Stripe ablak bezarasa → vissza az oldalra (nem ragad be)

---

## 18. CRM ELLENORZES (Google Sheets)

Minden sikeres muvelet utan ellenorizd a CRM-ben:
- [ ] Regisztracio → Felhasznalok sheet: uj sor email + nev + kutyak
- [ ] Csoportos foglalas → Csoportos sheet: uj sor
- [ ] Napkozi berlet → Berletek sheet: uj sor
- [ ] Panzio foglalas → Panzio sheet: uj sor
- [ ] Kutya hozzaadas/torles → Felhasznalok sheet frissul
- [ ] Oltas frissites → Felhasznalok sheet frissul

---

## 19. EMAIL ERTESITESEK

- [ ] Regisztracio → admin email erkezik
- [ ] Csoportos foglalas → megerosito email a felhasznalonak (ha van)
- [ ] Panzio foglalas → megerosito email
- [ ] Oltas lejarat kozeledo → figyelmezteto email (automata, naponta)

---

## OSSZEFOGLALAS

| Terulet | Oldalak szama | Prioritas |
|---------|--------------|-----------|
| Regisztracio + Belepes | 2 | KRITIKUS |
| Profil kezeles | 1 | KRITIKUS |
| Stripe fizetesek | 3 (csoportos, napkozi, panzio) | KRITIKUS |
| Koszonjuk oldalak | 5 | MAGAS |
| Oltas rendszer | cross-cutting | MAGAS |
| Szolgaltatas oldalak | 8 | KOZEPES |
| Navigacio + Footer | minden oldal | KOZEPES |
| Mobil responsive | minden oldal | KOZEPES |
| CRM + Email | backend | MAGAS |
