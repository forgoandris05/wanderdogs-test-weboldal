# Wanderdogs tudástár

Ez a mappa azoknak szól, akik a Wanderdogs weboldalt és a mögötte futó rendszert fejlesztik, akár ChatGPT-vel, Claude-dal vagy bármilyen más AI-asszisztenssel. A cél: egy új ember (vagy egy új AI-session) 20 perc alatt megértse, mire kell figyelni, és ne essen bele azokba a hibákba, amikbe már beleestünk.

> **Ez a repó publikus.** Ide soha ne kerüljön jelszó, API-kulcs, Stripe-kulcs, ügyfélnév, ügyfél-email vagy telefonszám. Az éles adat a Google Sheetben él, a titkok az Apps Script Script Properties-ben.

## Olvasási sorrend

| # | Fájl | Mikor olvasd |
|---|------|--------------|
| 1 | [ARCHITEKTURA.md](ARCHITEKTURA.md) | **Mindig, mielőtt bármit módosítasz.** A rendszer 5 rétege és hogyan függenek össze. |
| 2 | [CSAPDAK.md](CSAPDAK.md) | Mielőtt kódot írsz. 20+ valós hiba tanulsága, szabályokba szedve. |
| 3 | [EMAILEK.md](EMAILEK.md) | Ha emailt, emlékeztetőt vagy időzített triggert érintesz: az összes levél, tárgy, trigger és dedup. |
| 4 | [MUNKAMENET.md](MUNKAMENET.md) | Mielőtt először módosítasz és élesítesz: hogyan dolgozunk, hogyan megy ki egy változtatás. |
| 5 | [HOZZAFERESEK.md](HOZZAFERESEK.md) | Ki mihez fér hozzá, és mit kell beállítani, hogy az `info.wanderdogs@gmail.com` mindenhez hozzáférjen. |

A repó gyökerében lévő régebbi fájlok:

- `HASZNALATI-UTMUTATO.md` - **Timi napi használati útmutatója** (CRM szín-kódok, zárt napok, hibaelhárítás). Nem fejlesztői doksi, de a működést jól leírja.
- `TESZTELESI-TERV.md` - kézi tesztlista az oldalhoz. Nagyobb változtatás után érdemes végigmenni rajta.
- `JAVITASI-TERV.md` - egy régi (2026-04-02) javítási napló, csak történeti érdekesség.
- `AGENTS.md` / `CLAUDE.md` - az AI-asszisztenseknek szóló rövid szabályok.

## A legfontosabb 7 szabály (ha mást nem olvasol el)

1. **Mielőtt hozzányúlsz bármihez, gondold végig mind az 5 réteget:** weboldal, Apps Script (GAS) backend, CRM (Google Sheet), emailek, naptár. Egy új mező általában mind az ötben változást jelent.
2. **Minden foglalási logikát MINDKÉT ágba be kell kötni:** online (Stripe) és készpénzes (KP).
3. **A fizetés rögzítése nem függhet a böngészőtől.** A Stripe webhook a megbízható út, a böngészős visszatérés csak a gyors visszajelzésért van.
4. **Dedup + beszúrás mindig `LockService` alatt**, és a dedup-jelölőt oda írd, ahol keresed.
5. **Soha ne essen vissza a kód "a mai dátumra".** Hiányzó adatnál inkább legyen látható hiba (CRM jelölés + email Timinek), mint rossz nap.
6. **Ami blokkolja a felhasználót, annak mindig legyen látható oka.** Nincs néma `disabled` gomb, nincs néma szűkítés, nincs rejtett elemre tett hibajelzés.
7. **Bejelentett hiba esetén előbb az élő adatot (Sheet, böngésző) nézd meg, aztán a kódot.** Kódolvasásból bármihez lehet hihető okot gyártani.

## Hogyan használd ezt AI-val

Az AI nem látja a Google Sheetet, az Apps Script projektet és a Stripe-ot, hacsak nem adsz neki hozzáférést vagy nem másolod be a releváns részt. Ezért:

- Kezdj minden új beszélgetést ezzel: *"Olvasd el a `docs/` mappát és az `AGENTS.md`-t, mielőtt bármit módosítasz."*
- A backend (GAS) kódot **külön kell odaadni** (a repóban nincs benne, lásd [MUNKAMENET.md](MUNKAMENET.md)).
- Kérd meg, hogy a javaslatában **sorolja fel, melyik rétegre van hatással** (weboldal / GAS / CRM / email / naptár), és ellenőrizd, hogy tényleg mindet végigvette-e.
- Egy jó prompt-sablon a [MUNKAMENET.md](MUNKAMENET.md) végén van.
