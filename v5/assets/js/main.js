/**
 * Automarketing Digital v5 — main.js
 * Vanilla JS. Sin frameworks. Sin librerías externas.
 * Mobile-first, accesible, progresivo (.no-js → .js).
 */

/* ─────────────────────────────────────────────
   1. AÑO DINÁMICO EN FOOTER
   ───────────────────────────────────────────── */
(function setYear() {
  var els = document.querySelectorAll('#year');
  var year = new Date().getFullYear();
  for (var i = 0; i < els.length; i++) {
    els[i].textContent = year;
  }
})();


/* ─────────────────────────────────────────────
   2. NAV SCROLL — clase is-scrolled + backdrop
   ───────────────────────────────────────────── */
(function initNavScroll() {
  var nav = document.getElementById('main-nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
})();


/* ─────────────────────────────────────────────
   3. DRAWER MÓVIL
   Toggle .is-open en #mobile-menu.
   aria-expanded en burger.
   Cerrar con ESC y al click en cualquier link.
   ───────────────────────────────────────────── */
(function initMobileDrawer() {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (menu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  burger.addEventListener('click', toggleMenu);

  // Cerrar con ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      burger.focus();
    }
  });

  // Cerrar al hacer click en cualquier link del menú
  var links = menu.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', closeMenu);
  }
})();


/* ─────────────────────────────────────────────
   4. SMOOTH SCROLL CON OFFSET POR NAV STICKY
   Intercepta todos los links a anclas internas.
   ───────────────────────────────────────────── */
(function initSmoothScroll() {
  function getNavHeight() {
    var nav = document.getElementById('main-nav');
    // sub-nav de servicios si existe
    var subnav = document.getElementById('service-subnav');
    var h = nav ? nav.offsetHeight : 56;
    if (subnav) h += subnav.offsetHeight;
    return h + 16; // margen extra de respiro
  }

  document.addEventListener('click', function(e) {
    var target = e.target;
    // Sube por el DOM hasta encontrar un <a>
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }
    if (!target) return;

    var href = target.getAttribute('href');
    if (!href || href.charAt(0) !== '#' || href.length < 2) return;

    var anchor = document.querySelector(href);
    if (!anchor) return;

    e.preventDefault();

    var offset = getNavHeight();
    var top = anchor.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: top, behavior: 'smooth' });

    // Actualizar URL sin recargar
    history.pushState(null, '', href);
  });
})();


/* ─────────────────────────────────────────────
   5. REVEAL ON SCROLL (IntersectionObserver)
   Añade .is-visible a elementos .reveal
   cuando entran en el viewport.
   ───────────────────────────────────────────── */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar todo si no hay soporte
    var els = document.querySelectorAll('.reveal');
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add('is-visible');
    }
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // una sola vez
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  var reveals = document.querySelectorAll('.reveal');
  for (var i = 0; i < reveals.length; i++) {
    observer.observe(reveals[i]);
  }
})();


/* ─────────────────────────────────────────────
   6. SUB-NAV STICKY EN /SERVICIOS
   Destaca el tab activo según sección visible.
   Actualiza aria-current y .is-active.
   ───────────────────────────────────────────── */
(function initServiceSubnav() {
  var subnav = document.getElementById('service-subnav');
  if (!subnav) return;

  var tabs = subnav.querySelectorAll('.service-subnav__link[data-section]');
  if (!tabs.length) return;

  // Recoger las secciones objetivo
  var sections = [];
  for (var i = 0; i < tabs.length; i++) {
    var sectionId = tabs[i].getAttribute('data-section');
    var el = document.getElementById(sectionId);
    if (el) {
      sections.push({ el: el, tab: tabs[i] });
    }
  }

  if (!sections.length) return;

  // Observer con threshold bajo para detectar la sección más visible
  var activeSection = null;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Buscar qué sección corresponde
        for (var j = 0; j < sections.length; j++) {
          if (sections[j].el === entry.target) {
            activeSection = sections[j];
          }
        }
      }
    });

    // Actualizar tabs
    if (activeSection) {
      for (var k = 0; k < sections.length; k++) {
        var isActive = sections[k] === activeSection;
        sections[k].tab.classList.toggle('is-active', isActive);
        sections[k].tab.setAttribute('aria-current', isActive ? 'true' : 'false');
      }
    }
  }, {
    threshold: 0.35,
    rootMargin: '-80px 0px -30% 0px'
  });

  for (var m = 0; m < sections.length; m++) {
    observer.observe(sections[m].el);
  }
})();


/* ─────────────────────────────────────────────
   7. COOKIES BANNER
   Aparece 1500ms tras carga si no hay ack.
   Se oculta al aceptar y guarda en localStorage.
   ───────────────────────────────────────────── */
(function initCookiesBanner() {
  var COOKIE_KEY = 'amk_cookies_ack_v1';
  var banner = document.getElementById('cookies-banner');
  var acceptBtn = document.getElementById('cookies-accept');
  var rejectBtn = document.getElementById('cookies-reject');
  if (!banner) return;

  // Si ya respondió (aceptado o rechazado), no mostrar nunca
  if (localStorage.getItem(COOKIE_KEY)) return;

  setTimeout(function() {
    banner.style.display = 'block';
  }, 1500);

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      banner.style.display = 'none';
    });
  }
  if (rejectBtn) {
    rejectBtn.addEventListener('click', function() {
      // Solo necesarias: persistimos preferencia, NO cargamos analytics ni nada
      localStorage.setItem(COOKIE_KEY, 'essential-only');
      banner.style.display = 'none';
    });
  }
})();


/* ─────────────────────────────────────────────
   8. ACCORDION CUSTOM (para .accordion__item)
   Toggle .is-open en el item al click en trigger.
   Solo uno abierto a la vez (opcional — activado).
   ───────────────────────────────────────────── */
(function initAccordion() {
  var accordions = document.querySelectorAll('.accordion');
  for (var i = 0; i < accordions.length; i++) {
    (function(acc) {
      var triggers = acc.querySelectorAll('.accordion__trigger');
      for (var j = 0; j < triggers.length; j++) {
        triggers[j].addEventListener('click', function() {
          var item = this.closest('.accordion__item');
          var isOpen = item.classList.contains('is-open');

          // Cerrar todos en este accordion
          var items = acc.querySelectorAll('.accordion__item');
          for (var k = 0; k < items.length; k++) {
            items[k].classList.remove('is-open');
            var trigger = items[k].querySelector('.accordion__trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
          }

          // Si no estaba abierto, abrir este
          if (!isOpen) {
            item.classList.add('is-open');
            this.setAttribute('aria-expanded', 'true');
          }
        });
      }
    })(accordions[i]);
  }
})();


/* ─────────────────────────────────────────────
   9. CAROUSEL DOTS (para .carousel)
   Dots sincronizados con scroll del track.
   ───────────────────────────────────────────── */
(function initCarouselDots() {
  var carousels = document.querySelectorAll('.carousel');
  for (var i = 0; i < carousels.length; i++) {
    (function(carousel) {
      var track = carousel.querySelector('.carousel__track');
      var dots = carousel.querySelectorAll('.carousel__dot');
      if (!track || !dots.length) return;

      function updateDots() {
        var scrollLeft = track.scrollLeft;
        var itemWidth = track.scrollWidth / dots.length;
        var activeIndex = Math.round(scrollLeft / itemWidth);
        for (var d = 0; d < dots.length; d++) {
          dots[d].classList.toggle('is-active', d === activeIndex);
        }
      }

      track.addEventListener('scroll', updateDots, { passive: true });

      // Click en dot: scroll al item correspondiente
      for (var d = 0; d < dots.length; d++) {
        (function(index) {
          dots[index].addEventListener('click', function() {
            var itemWidth = track.scrollWidth / dots.length;
            track.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
          });
        })(d);
      }

      updateDots(); // estado inicial
    })(carousels[i]);
  }
})();
