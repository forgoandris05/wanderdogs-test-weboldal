/* ============================================================
   WANDERDOGS – Közös JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV AUTH STATE ───────────────────────────────────────
  wdNavAuth();

  // ── BURGER MENU ──────────────────────────────────────────
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── NAVBAR SCROLL SHADOW ─────────────────────────────────
  const nav = document.querySelector('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── ACTIVE NAV LINK ──────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href === './' + currentPath)) {
      link.classList.add('active');
    }
  });

  // ── SCROLL REVEAL ────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ── SMOOTH ANCHOR SCROLL ─────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── COUNTER ANIMATION ────────────────────────────────────
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.textContent);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(target * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }


});


// ============================================================
// WANDERDOGS – Regisztráció / Foglalás közös logika
// ============================================================

function wdGetUser() {
  try { return JSON.parse(localStorage.getItem('wd_user') || 'null'); }
  catch { return null; }
}

// ── SHA-256 jelszó hash (Web Crypto API) ─────────────────
async function hashJelszo(jelszo) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(jelszo));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Nav auth state injektálás ─────────────────────────────
function wdNavAuth() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const user = wdGetUser();

  const el = document.createElement('div');
  el.className = 'nav-auth';

  if (user && user.registered) {
    const nev = (user.nev || '').split(' ').pop() || 'Szia!'; // keresztnév (utolsó szó)
    el.innerHTML =
      '<a href="profil.html" class="nav-auth-name">Szia, ' + nev + '! →</a>' +
      '<button class="nav-auth-kilepes" onclick="wdKilepes()">Kilépés</button>';
  } else {
    el.innerHTML =
      '<a href="bejelentkezes.html?return=' + encodeURIComponent(currentPage) + '" class="nav-auth-belepes">Belépés</a>' +
      '<a href="regisztracio.html?return=' + encodeURIComponent(currentPage) + '" class="nav-auth-reg">Regisztráció</a>';
  }

  // Burger gomb elé szúrjuk be
  const burger = navRight.querySelector('.nav-burger');
  navRight.insertBefore(el, burger || null);
}

// ── "Hamarosan" toast ────────────────────────────────────
function wdHamarosan(e) {
  if (e) e.preventDefault();
  var existing = document.getElementById('wd-toast');
  if (existing) existing.remove();
  var t = document.createElement('div');
  t.id = 'wd-toast';
  t.textContent = 'Hamarosan! 🐾';
  t.style.cssText = 'position:fixed;top:90px;left:50%;transform:translateX(-50%);background:var(--black-3);color:var(--gold);border:1px solid var(--border);padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;z-index:9999;animation:toastIn .3s ease;';
  document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity .3s'; }, 1800);
  setTimeout(function(){ t.remove(); }, 2200);
}

// ── Kilépés ───────────────────────────────────────────────
function wdKilepes() {
  localStorage.removeItem('wd_user');
  window.location.reload();
}

// ── Kutyák listája (tömbként) ─────────────────────────────
function wdKutyak() {
  const u = wdGetUser();
  if (!u) return [];
  if (u.kutyak && u.kutyak.length) return u.kutyak;
  if (u.kutyaNev) return [{ nev: u.kutyaNev, fajta: '', kor: '' }];
  return [];
}

// ── Oltási könyv frontend ellenőrzés ──────────────────────
// Return: { valid: true/false, lejartKutyak: ["Pici (2026-01-15)"], hianyzik: ["Acai"] }
function wdOltasCheck() {
  const result = { valid: true, lejartKutyak: [], hianyzik: [] };
  const user = wdGetUser();
  if (!user || !user.registered) return result;
  const kutyak = wdKutyak();
  if (!kutyak.length) return result;

  const ma = new Date();
  ma.setHours(0, 0, 0, 0);
  kutyak.forEach(function(k) {
    if (!k.oltasLejar) {
      result.valid = false;
      result.hianyzik.push(k.nev);
      return;
    }
    var lejar = new Date(k.oltasLejar);
    if (isNaN(lejar.getTime()) || lejar < ma) {
      result.valid = false;
      result.lejartKutyak.push(k.nev + ' (' + (isNaN(lejar.getTime()) ? '?' : lejar.toLocaleDateString('hu-HU')) + ')');
    }
  });
  return result;
}

// ── Oltási blokkoló UI megjelenítés ──────────────────────────
// Meghívás: wdOltasBlokk('booking-wrapper-id') – elrejti a booking UI-t és mutatja a hibát
function wdOltasBlokk(wrapperId) {
  var user = wdGetUser();
  if (!user || !user.registered) return false; // nem bejelentkezett, nem blokkolunk
  var check = wdOltasCheck();
  if (check.valid) return false; // minden rendben

  var wrapper = wrapperId ? document.getElementById(wrapperId) : null;
  if (wrapper) wrapper.style.display = 'none';

  var msgs = [];
  if (check.hianyzik.length) msgs.push('Hiányzó oltási könyv: ' + check.hianyzik.join(', '));
  if (check.lejartKutyak.length) msgs.push('Lejárt oltás: ' + check.lejartKutyak.join(', '));

  var alertDiv = document.createElement('div');
  alertDiv.style.cssText = 'background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:24px;text-align:center;max-width:500px;margin:24px auto;';
  alertDiv.innerHTML =
    '<div style="font-size:24px;margin-bottom:8px;">&#9888;&#65039;</div>' +
    '<h3 style="font-size:16px;font-weight:700;margin-bottom:8px;color:#fca5a5;">Nincs érvényes oltási könyved!</h3>' +
    '<p style="font-size:13px;color:var(--text-dim);line-height:1.6;margin-bottom:16px;">' + msgs.join('<br>') + '</p>' +
    '<a href="profil.html" class="btn btn-gold" style="display:inline-block;padding:10px 24px;font-size:14px;text-decoration:none;">Oltási könyv frissítése a Profilban</a>';

  if (wrapper && wrapper.parentNode) {
    wrapper.parentNode.insertBefore(alertDiv, wrapper);
  } else {
    var section = document.querySelector('.section-full') || document.querySelector('.section') || document.body;
    section.insertBefore(alertDiv, section.firstChild);
  }
  return true; // blokkolva
}
