# Wanderdogs - Claude működési szabályok

Ez a Wanderdogs kutyaiskola weboldal + Google Apps Script (GAS) backend repo. Tulajdonos: Timi (Kucsera Tímea). Ez a fájl minden új sessionben betöltődik - tudd a szabályokat, ne kelljen elismételni.

## A projekt 5 rétege - MINDEN változtatásnál nézd át az össze

A rendszer szorosan összefonódott. Soha ne csinálj változtatást anélkül hogy végiggondolnád, mely rétegekre van hatással:

1. **Frontend (HTML/JS)** - `*.html`, `css/`, `js/` (pl. `napkozi.html`, `panzio.html`, `profil.html`, `regisztracio.html`)
2. **GAS backend** - `scripts/wdogs kiamsol backup.txt` (a tényleges GAS kód backup-ja, a user deployolja)
3. **CRM / Google Sheets** - "Wanderdogs CRM" (ID: `1vrPjCGQJmQZ0R3jIG7dh4jb1NtymxpKSUHM6ElANNIY`). Tab-ok: Összes érdeklődő, Panzió, Napközi, Felhasználók, Bérletek
4. **Email-ek** - `GmailApp.sendEmail()` hívások a GAS-ban (ügyfél visszaigazolás + Timi értesítés a `TIMI_EMAIL`-re)
5. **Naptári bejegyzések** - Google Calendar események (taxi hozás/vivés, panzió, napközi, oltás emlékeztető)

### Kereszthatás példák

- Frontend módosítás (új mező a foglalási űrlapon) → GAS `doPost` handler bővítés → CRM sheet oszlop → email szöveg → naptár leírás
- GAS handler módosítás → ellenőrizd hogy a frontend a megfelelő paramétereket küldi
- Új sheet oszlop → írás (insertAtTop/appendRow) ÉS olvasás (getValues indexek) helyén át kell nézni
- Email szöveg változás → CRM megjegyzés és naptár leírás illeszkedjen
- Naptár event változás → email-ben szereplő időpont/cím is stimmeljen

**Minden change előtt** kötelező olvasmány: `C:\Users\forgo\claude workspace\wiki\projects\wanderdogs-system-architecture.md` (CRM/email/naptár térkép)

## Google Sheet közvetlen olvasás (Drive MCP)

Be vagyok jelentkezve a Drive MCP-be. A CRM-et közvetlenül tudom olvasni:

- **Sheet ID**: `1vrPjCGQJmQZ0R3jIG7dh4jb1NtymxpKSUHM6ElANNIY`
- **Tool**: `mcp__claude_ai_Google_Drive__read_file_content` `fileId=<sheet ID>`
- **Keresés más fájlokra**: `mcp__claude_ai_Google_Drive__search_files` query=`title contains 'X' and mimeType = 'application/vnd.google-apps.spreadsheet'`

**Mikor használjam**: bug investigation előtt, oszlopstruktúra ellenőrzés, élő adat vizsgálat (pl. mit ír be a GAS valójában a sheet-be), edge case keresés a CRM-ben.

**Megj**: a teljes sheet content sokszor 25k token feletti - célzott `Grep` a tool-result fájlon segít.

## Workflow szabályok

### Auto-commit + push GitHub-ra
Ha problémát megoldottam vagy kódot írtam (frontend változás), **automatikusan**:
1. `git add <konkrét fájl>` (NE `git add -A`, NE `git add .`, mert van `node_modules`, `test-*.js`, `auth-state.json`, stb.)
2. `git commit -m "..."` magyar, leíró üzenettel (sima `-` kötőjel, NE em-dash)
3. `git push`

A usernek NE kelljen mondania hogy "pushold" vagy "commitold". Magamtól csinálom.

### GitHub Pages a hosting (NEM Netlify)
Push után GitHub Pages automatikusan deployolja a `main` branch-et 1-3 percen belül.

### GAS deploy a user dolga
A `scripts/wdogs kiamsol backup.txt` változásokat a user manuálisan deployolja a GAS editor-ban. Én csak a backup fájlt írom át és jelzem: "GAS deploy szükséges".

### Commit higiéne - SOHA ne commitold
- `node_modules/`
- `auth-state.json` (Playwright login state)
- `test-*.js`, `test-*.png`, `test-*.json` (lokális tesztek)
- `shots/` (screenshot-ok)
- `*.pdf`, `package-lock.json` (kivéve ha kifejezetten kéri)
- Bármi ami secret / API kulcs

## Kódolási konvenciók

- **Magyar szövegben sima `-` kötőjel**, NE em-dash (`—`)
- **NE találj ki adatokat** (számok, statisztikák, ügyfél referenciák) marketing szövegben
- Frontend HTML/JS magyar UI szöveg, GAS belső változók vegyesen (követve a meglévő stílust)
- HTML fájlok inline `<style>` és `<script>` blokkokkal (single-page jelleg)
- GAS: `_` prefix a privát helper-eknek (pl. `_panzioCrmBeIras`)
- Stílus a userrel: tegezés, haveri, direkt, rövid válaszok, magyarul

## OSSZES sheet (Összes érdeklődő) oszlopok

| Col | Mező |
|-----|------|
| A | Dátum, időpont |
| B | Név |
| C | Telefon |
| D | Email |
| E-G | Kutya 1, 2, 3 |
| H | Szolgáltatás(ok) |
| I | Megjegyzés |
| J | Taxi cím (ha kell) - **csak taxi cím, NEM fizetési mód** |
| K | Szolgáltatás dátuma |

PANZIO sheet oszlopok: lásd `_panzioCrmBeIras()` ~line 2741+ a GAS backup-ban.

## ScriptProperties (GAS)

- `SHEET_ID` - a Wanderdogs CRM sheet ID
- `SITE_URL` - prod URL (`https://wanderdogsworld.hu`)
- `TIMI_EMAIL` - értesítések cél email
- `STRIPE_SECRET_KEY` - default Stripe (David, csoportos, kutyatúra)
- `STRIPE_SECRET_KEY_PANZIO` - külön Stripe a panzióhoz
- Gmail OAuth scope: `mail.google.com` (session23-ban derült ki, ne csökkentsd `gmail.send`-re)

## Fontos referenciák

- **Rendszer architektúra** (KÖTELEZŐ feature előtt): `wiki/projects/wanderdogs-system-architecture.md`
- **Bug log** (elkerülendő minták): `wiki/projects/wanderdogs-bug-log.md`
- **Tennivaló lista** (auto-update): `wiki/projects/wanderdogs-tennivalok.md`
- **Legfrissebb session**: `wiki/projects/wanderdogs-session{N}-progress.md`
- **LinkedIn feature-bank** (deploy után auto-update): `wiki/linkedin/feature-bank.md`

## Auto-update szabályok

- Új feature deploy után → `wiki/linkedin/feature-bank.md` mini-blokk
- Új Wanderdogs ötlet/bug a beszélgetésben → `wiki/projects/wanderdogs-tennivalok.md` hozzáfűzés
- Session végén → progress fájl frissítés vagy új `wiki/projects/wanderdogs-session{N+1}-progress.md`

## Tesztelés

- Manual user tesztelés `forgoandris05@gmail.com` user-rel a prod URL-en
- A `test-*.js` Playwright tesztek lokálisak, NE commitold
- Bug esetén SLA: gyors, lehetőleg még aznap fix
