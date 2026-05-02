/* =============================================================
   Automarketing Digital v2 — main.js
   Vanilla JS minimo: drawer movil, cookies, reveal, year, smooth-scroll
   ============================================================= */
(function () {
  'use strict';

  /* --- Hamburger drawer --- */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.getElementById('drawer');

  function setDrawer(open) {
    if (!burger || !drawer) return;
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.contains('is-open');
      setDrawer(!open);
    });

    // Cerrar al pinchar enlace
    var drawerLinks = drawer.querySelectorAll('a');
    for (var i = 0; i < drawerLinks.length; i++) {
      drawerLinks[i].addEventListener('click', function () { setDrawer(false); });
    }

    // Cerrar con ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
    });
  }

  /* --- Smooth scroll con offset por nav sticky --- */
  var navHeight = function () {
    var nav = document.querySelector('.nav');
    return nav ? nav.offsetHeight : 80;
  };

  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var j = 0; j < anchors.length; j++) {
    anchors[j].addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight() - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* --- Reveal on scroll --- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) {
          entries[k].target.classList.add('is-visible');
          io.unobserve(entries[k].target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    for (var l = 0; l < reveals.length; l++) io.observe(reveals[l]);
  } else {
    for (var m = 0; m < reveals.length; m++) reveals[m].classList.add('is-visible');
  }

  /* --- Year footer --- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* --- Cookies banner --- */
  var cookies = document.getElementById('cookies');
  var cookiesBtn = document.getElementById('cookies-accept');
  var KEY = 'amk_cookies_ack_v1';

  if (cookies && cookiesBtn) {
    var acked = false;
    try { acked = window.localStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!acked) {
      // Mostrar tras pequeno delay para no entorpecer LCP
      setTimeout(function () { cookies.classList.add('is-visible'); }, 1500);
    }
    cookiesBtn.addEventListener('click', function () {
      cookies.classList.remove('is-visible');
      try { window.localStorage.setItem(KEY, '1'); } catch (e) {}
    });
  }

})();
