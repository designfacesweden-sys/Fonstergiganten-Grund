/**
 * Fönstergiganten – One-page Landing
 * Interaktivitet: smooth scroll, mobilmeny, scroll-animationer
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // Header scroll-effekt
  // -------------------------------------------------------------------------
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // -------------------------------------------------------------------------
  // Mobilmeny
  // -------------------------------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Stäng meny' : 'Öppna meny');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Öppna meny');
        document.body.style.overflow = '';
      });
    });
  }

  // -------------------------------------------------------------------------
  // Smooth scroll för anchor-länkar – exponentiell med mjuk landning
  // -------------------------------------------------------------------------
  let activeScroll = null;

  function smoothScrollTo(target, offset) {
    if (activeScroll) {
      cancelAnimationFrame(activeScroll.raf);
    }

    const start = window.pageYOffset;
    const targetPos = target.getBoundingClientRect().top + start - offset;
    const distance = targetPos - start;
    const duration = Math.min(Math.max(Math.abs(distance) * 0.5, 600), 1200);
    const startTime = performance.now();

    // Exponential ease-out: snabb start, mjuk landning
    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step() {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      
      window.scrollTo(0, start + distance * eased);
      
      if (progress < 1) {
        activeScroll = { raf: requestAnimationFrame(step) };
      } else {
        activeScroll = null;
      }
    }

    activeScroll = { raf: requestAnimationFrame(step) };
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#main') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 72;
        smoothScrollTo(target, headerHeight + 20);
      }
    });
  });

  // -------------------------------------------------------------------------
  // Scroll-animationer (Intersection Observer)
  // -------------------------------------------------------------------------
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Process-steg
  document.querySelectorAll('.process__step').forEach((el) => observer.observe(el));

  // Fade-in element med staggered delay
  document.querySelectorAll('.tjanst-item.fade-in').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.05}s`;
    observer.observe(el);
  });
  document.querySelectorAll('.varfor__reason.fade-in').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });

  // -------------------------------------------------------------------------
  // Phone Widget Modal
  // -------------------------------------------------------------------------
  const phoneBtn = document.getElementById('phone-btn');
  const phoneWidget = document.getElementById('phone-widget');
  const phoneWidgetClose = document.getElementById('phone-widget-close');
  const phoneWidgetOverlay = document.getElementById('phone-widget-overlay');

  function openPhoneWidget() {
    if (phoneWidget) {
      phoneWidget.classList.add('active');
      phoneWidget.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closePhoneWidget() {
    if (phoneWidget) {
      phoneWidget.classList.remove('active');
      phoneWidget.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (phoneBtn) {
    phoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPhoneWidget();
    });
  }

  if (phoneWidgetClose) {
    phoneWidgetClose.addEventListener('click', closePhoneWidget);
  }

  if (phoneWidgetOverlay) {
    phoneWidgetOverlay.addEventListener('click', closePhoneWidget);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && phoneWidget && phoneWidget.classList.contains('active')) {
      closePhoneWidget();
    }
  });

  // -------------------------------------------------------------------------
  // Formulär – enkel hantering (placeholder för backend)
  // -------------------------------------------------------------------------
  const form = document.querySelector('.cta__form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Skickar...';
      btn.disabled = true;

      // Simulera skickande – ersätt med riktig fetch/action
      setTimeout(() => {
        btn.textContent = 'Tack! Vi återkommer snart.';
        btn.style.background = 'var(--color-accent)';
        form.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 3000);
      }, 800);
    });
  }
})();
