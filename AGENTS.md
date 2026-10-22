# Wanderdogs - útmutató AI-asszisztenseknek (ChatGPT / Codex / Claude / bármi)

Ez egy **éles** kutyaiskola-rendszer (wanderdogsworld.hu): statikus HTML weboldal (GitHub Pages) + Google Apps Script (GAS) backend + Google Sheet mint CRM/adatbázis + Gmail + Google Naptár + Stripe. Tulajdonos: Kucsera Tímea (Timi).

**Mielőtt bármit módosítasz, olvasd el a `docs/` mappát** (`docs/README.md` az index): `ARCHITEKTURA.md`, `CSAPDAK.md`, `MUNKAMENET.md`.

## Alapszabályok

1. **5 réteg:** weboldal, GAS backend, CRM (Google Sheet), emailek (ügyfél + Timi), naptár. Minden változtatásnál mondd meg, melyikre van hatása, és vizsgáld meg mindet.
2. **Online (Stripe) ÉS készpénzes (KP) ág** - mindkettőbe kell az új logika. Böngészős confirm ÉS Stripe webhook útvonal is.
3. **A GAS kód nincs a repóban** (`scripts/` szándékosan gitignore-olt, a repó publikus). Ne találj ki függvényneveket, oszlopindexeket, fülneveket: kérd el a releváns kódrészt.
4. **Titok/ügyféladat soha nem kerül a repóba** (kulcs, jelszó, ügyfélnév, email, telefon).
5. Dátum mindig `yyyy-MM-dd`; soha ne essen vissza a kód a mai dátumra; hiányzó adatnál látható hiba (CRM jelölés + email Timinek), nem néma `catch`.
6. Nincs néma `disabled` gomb, nincs rejtett elemre tett hibajelzés; ha egy UI szűkít vagy tilt, írd ki, miért.
7. Dedup + beszúrás `LockService` alatt; a dedup-jelölőt oda írd, ahol keresed.
8. Bejelentett hibánál előbb az élő adat (Sheet, böngésző, Executions napló), utána a kód.

## Konvenciók

- Magyar UI szöveg; **sima `-` kötőjel, nem em-dash**. Marketing szövegben ne találj ki számokat, statisztikákat, ügyfél-referenciákat.
- Inline `<style>` és `<script>` a HTML-ekben (egyoldalas jelleg); közös: `css/styles.css`, `js/main.js`.
- GAS: `_` előtag a privát helperekhez.
- Git: külön branch, `git add <konkrét fájl>` (nem `-A`), magyar leíró commit üzenet. Soha ne commitold: `node_modules/`, `auth-state.json`, `test-*`, `shots/`, `*.pdf`, `package-lock.json`.
- GAS változtatás **kézzel élesedik** (Apps Script szerkesztő → Telepítés → Új verzió); jelezd a felhasználónak: "GAS deploy szükséges".
- Kis, minimális diff-eket adj; a módosított függvényt teljes egészében add vissza, hogy könnyű legyen kicserélni.

További: `CLAUDE.md` (Claude-specifikus működési szabályok), `HASZNALATI-UTMUTATO.md` (Timi napi használata).
