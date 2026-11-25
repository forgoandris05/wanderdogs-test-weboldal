#!/usr/bin/env node
/*
 * Az ÉLES Apps Script kódból elkészíti a TESZT másolatot.
 *
 *   node v2/make-test-backend.js "<éles .txt>" "<kimenet .txt>" <teszt-email> <teszt-oldal-url>
 *
 * Amit a teszt másolatban lecserél, hogy véletlenül se érjen el élő rendszert:
 *   1. TIMI_EMAIL és a levelekbe írt info.wanderdogs@gmail.com -> teszt email
 *   2. a SITE_URL alapértelmezett visszatérési címe (Stripe sikeres fizetés után
 *      ide irányít) -> a teszt oldal címe
 *   3. a Számlázz.hu hívás címe -> érvénytelen cím, így teszt rendelésből
 *      SOHA nem lesz valódi számla
 *   4. a fájl tetejére TESZT-jelzés kerül
 *
 * A szkript megszámolja a cseréket, és hibával leáll, ha valamelyik minta
 * nem található (azaz az éles kód megváltozott, és a generátort át kell nézni).
 * A kimenet nem kerül gitbe (a scripts/ mappa .gitignore-olt).
 */
const fs = require('fs');

const [, , inPath, outPath, testEmail, testSite] = process.argv;
if (!inPath || !outPath || !testEmail || !testSite) {
  console.error('Használat: node v2/make-test-backend.js <éles.txt> <kimenet.txt> <teszt-email> <teszt-oldal-url>');
  process.exit(2);
}
if (/wanderdogsworld\.hu/.test(testSite) || /wanderdogs@gmail\.com/.test(testEmail)) {
  console.error('A teszt cím nem mutathat az éles oldalra / Timi emailjére.');
  process.exit(2);
}

let src = fs.readFileSync(inPath, 'utf8');
const report = [];

function swap(label, pattern, replacement, min) {
  const matches = src.match(pattern);
  const n = matches ? matches.length : 0;
  if (n < min) {
    console.error('HIBA: "' + label + '" mintából ' + n + ' találat van, legalább ' + min + ' kellene. Az éles kód változott?');
    process.exit(1);
  }
  src = src.replace(pattern, replacement);
  report.push(label + ': ' + n + ' csere');
}

swap('Timi email', /info\.wanderdogs@gmail\.com/g, testEmail, 1);
swap('Oldal-cím alapérték', /https:\/\/wanderdogsworld\.hu/g, testSite.replace(/\/$/, ''), 2);
swap('Számlázz.hu cím', /https:\/\/www\.szamlazz\.hu\/szamla\//g, 'https://teszt-szamla-letiltva.invalid/szamla/', 1);

const header =
  '// ============================================================\n' +
  '// TESZT BACKEND - generálva az éles kódból (v2/make-test-backend.js)\n' +
  '// NE szerkeszd kézzel: az éles kód változása után generáld újra.\n' +
  '// Script Properties: teszt SHEET_ID, teszt naptárak, sk_test_ Stripe\n' +
  '// kulcsok, SITE_URL = a teszt oldal. SZAMLAZZ_KULCS_* NE legyen beállítva.\n' +
  '// ============================================================\n';
src = header + src;

fs.writeFileSync(outPath, src, 'utf8');
console.log(report.join('\n'));
console.log('Kész: ' + outPath);
