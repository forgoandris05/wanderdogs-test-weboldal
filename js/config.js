/*
 * Wanderdogs: környezet-kapcsoló (élés / teszt)
 *
 * Szabály: CSAK a wanderdogsworld.hu domainről megy az éles backend.
 * Bármilyen más cím (helyi gép, előnézeti oldal, fejlesztői ág) a TESZT
 * backendet használja. Ha a teszt backend még nincs beállítva (WD_TEST_API
 * üres), az oldal NEM esik vissza élesre: a hívások elbuknak, és piros
 * sáv jelzi. Így tesztelés közben soha nem kerül valódi adat az éles
 * táblába, és nem indul valódi fizetés / levél / naptár.
 *
 * ÁTÁLLÁS (jan. 1.): a WD_LIVE_API értékét kell az új backendre cserélni.
 * Visszaállás: a régi értéket visszaírni.
 */
(function () {
  // Az éles (régi, Apps Script) backend.
  var WD_LIVE_API = 'https://script.google.com/macros/s/AKfycbw8zaEjbwwIFybTIQBukirAEnVuUKT5KD-xi0Iq1LKw3o8xTs4e_X6MVVN8bPDUUQIf/exec';

  // A teszt backend: külön Apps Script telepítés, teszt-táblával, teszt
  // Stripe-kulcsokkal és teszt naptárral. Telepítés után ide kerül az URL.
  var WD_TEST_API = '';

  var LIVE_HOSTS = ['wanderdogsworld.hu', 'www.wanderdogsworld.hu'];
  var isLive = LIVE_HOSTS.indexOf(location.hostname) !== -1;

  window.WD_ENV = isLive ? 'live' : 'test';
  window.WD_API = isLive ? WD_LIVE_API : (WD_TEST_API || 'https://teszt-backend-nincs-beallitva.invalid/exec');

  if (isLive) return;

  // Látható jelzés, hogy ez a teszt példány.
  function banner() {
    var bar = document.createElement('div');
    var missing = !WD_TEST_API;
    bar.setAttribute('role', 'status');
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;padding:6px 12px;' +
      'font:600 13px/1.3 system-ui,sans-serif;text-align:center;color:#fff;pointer-events:none;' +
      'background:' + (missing ? '#b00020' : '#d97706');
    bar.textContent = missing
      ? 'TESZT KORNYEZET - a teszt backend nincs beallitva, a muveletek nem mukodnek'
      : 'TESZT KORNYEZET - valodi foglalas, fizetes es level nem keletkezik';
    document.body.appendChild(bar);
  }
  if (document.body) banner(); else document.addEventListener('DOMContentLoaded', banner);

  // Az előnézeti oldalt a keresők ne indexeljék.
  var m = document.createElement('meta');
  m.name = 'robots'; m.content = 'noindex,nofollow';
  document.head.appendChild(m);
})();
