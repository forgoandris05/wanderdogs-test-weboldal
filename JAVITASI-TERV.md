# Javitasi terv - tesztelesbol talalt hibak

## 1. PANZIO: "tizenegy is not defined" hiba (KRITIKUS)

**Fajl:** `AI automation/wanderdogs/scripts/wanderdogs_main.gs` - 1878-1880. sor
**Problema:** A `_stripeSessionLetrehozas()` fuggvenyben a `tizenegy`, `bekoltozesOra`, `kikoltozesOra` valtozok nincsenek definialva - ezek a `_panzioCheckoutHandler()` scope-ban vannak.
**Javitas:** A `params`-bol kell olvasni: `params.tizenegy`, `params.bekoltozesOra`, `params.kikoltozesOra`

```
// 1878. sor - ELOTTE:
'metadata[tizenegy]':       String(tizenegy),
'metadata[bekoltozesOra]':  bekoltozesOra || '09:00',
'metadata[kikoltozesOra]':  kikoltozesOra || '16:00',

// UTANA:
'metadata[tizenegy]':       String(params.tizenegy === true || params.tizenegy === 'true'),
'metadata[bekoltozesOra]':  params.bekoltozesOra || '09:00',
'metadata[kikoltozesOra]':  params.kikoltozesOra || '16:00',
```

---

## 2. NAPKOZI TAXI: regi fiok adatai jelennek meg (torolt fiok helyett uj fiok)

**Problema:** Uj fiokkal belepve a regi (torolt) fiok kutyait mutatja, es ott a kutyanev helyett telefonszam van (mert a Google Sheet-ben el voltak csuszva az oszlopok - azt mar javitottuk).
**Valos ok:** Ket lehetseges ok:
1. A Google Sheet BERLETEK tabban a regi fiok berletei meg ott vannak a regi emaillel, es az uj fiok ugyanazt az emailt hasznalja → a backend a regi sorokat talaja meg
2. A Google Sheet NAPKOZI tabban is maradtak regi sorok amikben az eltolodott oszlopok miatt telefonszam van a kutyanev helyett
**Javitas:**
- A torolt fiok sorait a Google Sheet-ben is torolni kell (BERLETEK + NAPKOZI tab)
- VAGY: a `fiok_torles` GAS handler-ben ellenorizni hogy torol-e BERLETEK/NAPKOZI sorokat is
**Teendo:** Manualis: Google Sheet-ben a regi teszt sorok torlese. A kod rendben van.

---

## 3. EGYENI OKTATAS: hero szelesseg nem egyezik a tartalommal (DESKTOP)

**Fajl:** `egyeni-ora.html`
**Problema:** A hero szekcioval `.page-hero` padding `48px` oldalra, mig a `.section` padding `80px`. A hero szelesebb mint a kartya szekció alatta.
**Javitas:** A hero tartalmat ugyan abba a max-width containerbe kell rakni, vagy a paddinget egysegesiteni.

Opcio: `.egyeni-hero-flex` max-width-et adni, vagy a `.page-hero` paddinget 80px-re novni ezen az oldalon.

---

## 4. MOBIL: Egyeni oktatas kartyak kilognak (320-375px)

**Fajl:** `egyeni-ora.html` - 142-144. sor
**Problema:** Az `.options-grid` 900px-nel valt 1 oszlopra, DE a kartyak `padding: 36px 28px` + belso tartalom tul szeles 320px-es kepernyore. A masodik sor kartyak (Haznal, Kulso) meg is vannak vagva mert oldalt scrollozhato.
**Javitas:**
- `@media (max-width: 768px)` alatt `.option-card` padding csokkentese
- Ellenorizni hogy a kartyak nem lognak ki

---

## 5. MOBIL: "Hogyan mukodik?" es "Mire szamithatsz?" egymas mellett (320-375px)

**Fajl:** `egyeni-ora.html` - 309. sor
**Problema:** Inline style `grid-template-columns: 1fr 1fr` → mobil kepernyon 2 oszlopban marad es kilog.
**Javitas:** Media query hozzaadasa ami mobilon 1 oszlopra valt:

```css
@media (max-width: 768px) {
  /* A 309. sorban levo grid → 1fr */
}
```

Mivel inline style, CSS-bol nem tudjuk felulirni. Atirni kell class-ra vagy `!important`-al.

---

## 6. MOBIL: Index.html "Ne vard meg" szekció gombok

**Fajl:** `index.html`
**Problema:** A CTA gombok (Egyeni oktatas, Csoportos, Napkozi) tuul szelesek mobilon.
**Javitas:** Ellenorizni, max-width adasa a gomboknak mobilon.

---

## Prioritas sorrend

1. **#1 Panzio tizenegy** - KRITIKUS, fizetes nem mukodik
2. **#5 Mobil 2-oszlop** - MAGAS, tartalom kilog
3. **#4 Mobil kartyak** - MAGAS, tartalom kilog
4. **#3 Hero szelesseg** - KOZEPES, vizualis
5. **#6 Mobil gombok** - KOZEPES, vizualis
6. **#2 Napkozi taxi** - ALACSONY, valoszinuleg regi fiok
