/* ============================================
   Lotas株式会社 - Main JavaScript
============================================ */

'use strict';

// ---- Header scroll effect ----
const header = document.querySelector('.header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Active nav link ----
(function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ---- Mobile hamburger ----
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ---- Scroll Reveal ----
(function initReveal() {
  const selectors = '.reveal, .reveal-left, .reveal-right';
  const elements = document.querySelectorAll(selectors);
  if (!elements.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => io.observe(el));
})();

// ---- Counter Animation ----
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = String(target).includes('.');
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        const value = target * eased;
        el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (elapsed < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target + suffix;
      };

      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
})();

// ---- Contact Form Validation ----
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const showError = (input, msg) => {
    input.classList.add('error');
    const err = input.parentElement.querySelector('.form-error');
    if (err) { err.textContent = msg; err.classList.add('show'); }
  };

  const clearError = (input) => {
    input.classList.remove('error');
    const err = input.parentElement.querySelector('.form-error');
    if (err) err.classList.remove('show');
  };

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone = (v) => !v || /^[\d\-+() ]{10,}$/.test(v.trim());

  const validators = {
    name:    v => v.trim().length >= 1  ? null : 'お名前を入力してください',
    company: v => v.trim().length >= 1  ? null : '会社名を入力してください',
    email:   v => validateEmail(v)      ? null : '有効なメールアドレスを入力してください',
    phone:   v => validatePhone(v)      ? null : '正しい電話番号を入力してください',
    type:    v => v !== ''              ? null : 'お問い合わせ種別を選択してください',
    message: v => v.trim().length >= 10 ? null : '10文字以上入力してください',
    privacy: (_, el) => el.checked     ? null : 'プライバシーポリシーへの同意が必要です',
  };

  form.querySelectorAll('[data-validate]').forEach(input => {
    input.addEventListener('blur', () => {
      const key = input.dataset.validate;
      const fn = validators[key];
      if (!fn) return;
      const err = fn(input.value, input);
      err ? showError(input, err) : clearError(input);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        const key = input.dataset.validate;
        const fn = validators[key];
        if (fn) {
          const err = fn(input.value, input);
          if (!err) clearError(input);
        }
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[data-validate]').forEach(input => {
      const key = input.dataset.validate;
      const fn = validators[key];
      if (!fn) return;
      const err = fn(input.value, input);
      if (err) { showError(input, err); valid = false; }
      else clearError(input);
    });

    if (!valid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    setTimeout(() => {
      form.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) { success.classList.add('show'); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }, 1200);
  });
})();
