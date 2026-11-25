#!/usr/bin/env node
/*
 * Elkészíti a TESZT Apps Script projekt beállító függvényét.
 *
 *   node v2/make-test-setup.js "<stripe keys.env>" "<kimenet.txt>" <teszt-SHEET_ID> <teszt-oldal-url>
 *
 * A kulcsfájlból KIZÁRÓLAG az sk_test_ kezdetű kulcsokat veszi át. Éles
 * (sk_live_) kulcsot nem olvas ki és nem ír le sehova. A kulcsok soha nem
 * jelennek meg a kimeneten. A kimeneti fájl a scripts/ mappába kerül
 * (gitignore-olt), mert titkokat tartalmaz.
 *
 * A kimenet egy TESZT_BEALLITAS() függvény: beillesztés az Apps Script
 * szerkesztőbe, egyszeri futtatás, utána a függvény törlése.
 */
const fs = require('fs');
const crypto = require('crypto');

const [, , keyFile, outPath, sheetId, siteUrl] = process.argv;
if (!keyFile || !outPath || !sheetId || !siteUrl) {
  console.error('Használat: node v2/make-test-setup.js <kulcsfájl> <kimenet> <teszt-SHEET_ID> <teszt-oldal-url>');
  process.exit(2);
}
if (sheetId === '1vrPjCGQJmQZ0R3jIG7dh4jb1NtymxpKSUHM6ElANNIY' || /wanderdogsworld\.hu/.test(siteUrl)) {
  console.error('Az éles tábla vagy oldal nem adható meg teszt célnak.');
  process.exit(2);
}

const text = fs.readFileSync(keyFile, 'utf8');
const found = {};
text.split(/\r?\n/).forEach(function (line) {
  const m = line.match(/^\s*(Timi|Viki|D[aá]vid)\b[^:]*:\s*(sk_test_[A-Za-z0-9]+)\s*$/i);
  if (m) found[m[1].toLowerCase().replace('á', 'a')] = m[2];
});

const map = { timi: 'STRIPE_KEY_TIMI', viki: 'STRIPE_KEY_VIKI', david: 'STRIPE_KEY_DAVID' };
const props = {
  TESZT_MOD: 'igen',
  SHEET_ID: sheetId,
  SITE_URL: siteUrl.replace(/\/$/, ''),
  AUTH_SECRET: crypto.randomBytes(24).toString('hex'),
  MARKETING_TOKEN_SECRET: crypto.randomBytes(24).toString('hex'),
};
const hianyzik = [];
Object.keys(map).forEach(function (n) {
  if (found[n]) props[map[n]] = found[n]; else hianyzik.push(n);
});
if (hianyzik.length) {
  console.error('Hiányzó teszt kulcs: ' + hianyzik.join(', '));
  process.exit(1);
}

const body =
  '// TESZT beállítás: egyszer futtasd, utána TÖRÖLD ezt a függvényt (titkokat tartalmaz).\n' +
  '// A STRIPE_WH_SECRET-et a teszt módú webhook létrehozása után kézzel add hozzá.\n' +
  'function TESZT_BEALLITAS() {\n' +
  '  PropertiesService.getScriptProperties().setProperties(' + JSON.stringify(props, null, 2) + ');\n' +
  "  Logger.log('Kész. Beállítva: ' + " + JSON.stringify(Object.keys(props)) + ".join(', '));\n" +
  '}\n';

const tisztito =
  '\n// Az ügyféladatok törlése a teszt tábla-másolatból. Egyszer futtasd, még az első teszt előtt.\n' +
  '// Megtartja: a fejléceket, a tanfolyam/workshop/túra leírásokat, a zárt napokat.\n' +
  'function TESZT_ADATTISZTITAS() {\n' +
  "  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');\n" +
  "  if (!id || id === '1vrPjCGQJmQZ0R3jIG7dh4jb1NtymxpKSUHM6ElANNIY') throw new Error('Az éles tábla nem törölhető.');\n" +
  '  var ss = SpreadsheetApp.openById(id);\n' +
  '  var MEGTART = /(tanfolyamok|workshopok|t[uú]r[aá]k|zárva|zarva|zárt|dashboard)\\s*$/i;\n' +
  '  var napló = [];\n' +
  '  ss.getSheets().forEach(function (sh) {\n' +
  '    var nev = sh.getName();\n' +
  '    if (MEGTART.test(nev)) { napló.push(nev + ": megtartva"); return; }\n' +
  '    var sorok = sh.getLastRow() - 1;\n' +
  '    if (sorok > 0) sh.getRange(2, 1, sorok, sh.getMaxColumns()).clearContent();\n' +
  '    napló.push(nev + ": " + Math.max(sorok, 0) + " sor törölve");\n' +
  '  });\n' +
  "  Logger.log(napló.join('\\n'));\n" +
  '}\n';

fs.writeFileSync(outPath, body + tisztito, 'utf8');
console.log('Kész: ' + outPath);
console.log('Beállítások (értékek nélkül): ' + Object.keys(props).join(', '));
