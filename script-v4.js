// ============================================================
// 한입 (HANIP) v4 — script-v4.js
// ============================================================

// ── 탑바 닫기 ────────────────────────────────────────────────
function initTopbar() {
  const bar   = document.getElementById('launchTopbar');
  const btn   = document.getElementById('topbarClose');
  if (!bar || !btn) return;

  if (sessionStorage.getItem('hanip-topbar-closed')) {
    bar.style.display = 'none';
    return;
  }

  btn.addEventListener('click', () => {
    bar.style.transition = 'height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
    bar.style.height  = bar.offsetHeight + 'px';
    bar.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      bar.style.height  = '0';
      bar.style.opacity = '0';
      bar.style.paddingTop = '0';
      bar.style.paddingBottom = '0';
    });
    setTimeout(() => { bar.style.display = 'none'; }, 320);
    sessionStorage.setItem('hanip-topbar-closed', '1');
  });
}

// ── 헤더 스크롤 ──────────────────────────────────────────────
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 16);
  }, { passive: true });
}

// ── 모바일 메뉴 ──────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', String(open));
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ── 성분 순차 등장 ───────────────────────────────────────────
function initIngredientAnim() {
  const wrap = document.getElementById('ingredientItems');
  if (!wrap) return;

  const steps = wrap.querySelectorAll('.ingredient-step');
  let triggered = false;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        steps.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 160);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  obs.observe(wrap);
}

// ── 구독 카드 토글 ───────────────────────────────────────────
function initSubscribeToggle() {
  const single    = document.getElementById('subSingle');
  const subscribe = document.getElementById('subSubscribe');
  if (!single || !subscribe) return;

  [single, subscribe].forEach(card => {
    card.addEventListener('click', () => {
      single.classList.remove('selected');
      subscribe.classList.remove('selected');
      card.classList.add('selected');
    });
  });
}

// ── 스크롤 카드 등장 (fade-up) ───────────────────────────────
function initCardAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

// ── 뉴스레터 폼 ──────────────────────────────────────────────
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input.value.includes('@')) {
      input.style.borderColor = '#B91C1C';
      input.focus();
      setTimeout(() => { input.style.borderColor = ''; }, 2500);
      return;
    }
    input.style.borderColor = '#3B6CB5';
    input.value = '';
    input.placeholder = '신청해주셔서 감사합니다! 🐾';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = '이메일 주소를 입력해주세요';
    }, 4000);
  });
}

// ── DOMContentLoaded ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTopbar();
  initHeaderScroll();
  initMobileMenu();
  initIngredientAnim();
  initSubscribeToggle();
  initCardAnimations();
  initNewsletter();
  initContactModal();
  initTestimonialColumns();
});

/* ── 후기 컬럼 무한 스크롤 ── */
function initTestimonialColumns() {
  document.querySelectorAll('.tcol').forEach(col => {
    col.innerHTML += col.innerHTML; // 카드 복제 → 끊김 없는 루프
  });
}

/* ── 문의 모달 ── */
function initContactModal() {
  const fabContact = document.getElementById('fabContact');
  const contactOverlay = document.getElementById('contactOverlay');
  const contactClose = document.getElementById('contactClose');
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const contactSuccessClose = document.getElementById('contactSuccessClose');

  function openModal() {
    contactOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const first = contactForm.querySelector('input, select, textarea');
    if (first) first.focus();
  }

  function closeModal() {
    contactOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      contactForm.reset();
      contactForm.hidden = false;
      contactSuccess.hidden = true;
    }, 300);
  }

  fabContact.addEventListener('click', openModal);
  contactClose.addEventListener('click', closeModal);
  contactSuccessClose.addEventListener('click', closeModal);
  contactOverlay.addEventListener('click', (e) => {
    if (e.target === contactOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactOverlay.classList.contains('is-open')) closeModal();
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const type = document.getElementById('contactType');
    const message = document.getElementById('contactMessage');
    let valid = true;

    [name, email, type, message].forEach(el => (el.style.borderColor = ''));

    if (!name.value.trim()) { name.style.borderColor = 'var(--danger)'; valid = false; }
    if (!email.value || !email.value.includes('@')) { email.style.borderColor = 'var(--danger)'; valid = false; }
    if (!type.value) { type.style.borderColor = 'var(--danger)'; valid = false; }
    if (!message.value.trim()) { message.style.borderColor = 'var(--danger)'; valid = false; }

    if (!valid) return;

    contactForm.hidden = true;
    contactSuccess.hidden = false;
  });
}
