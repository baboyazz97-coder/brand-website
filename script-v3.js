// ============================================================
// 포우즈 v3 — script-v3.js
// 페스룸 레퍼런스 기반 | 타겟: 한국 20-30대
// ============================================================

// ── 이벤트 탑바 날짜 분기 ────────────────────────────────────

const EVENT_CONFIG = {
  PRE_START:  '2026-04-10',
  PRE_END:    '2026-04-19',
  MAIN_START: '2026-04-20',
  MAIN_END:   '2026-04-28',
  LAST_DAY:   '2026-04-29',
  messages: {
    pre: {
      icon: '⏳',
      text: '봄맞이 특가 D-{days} · 사전 예약하면 5% 추가 쿠폰 바로 지급',
      cta: '사전 예약',
      href: '#vip'
    },
    main: {
      icon: '⚡',
      text: '봄맞이 특가 진행 중 · 전 상품 최대 30% + VIP 추가 35% 할인',
      cta: '지금 쇼핑',
      href: '#products'
    },
    lastday: {
      icon: '🚨',
      text: '오늘 자정 이벤트 종료! 마지막 기회를 놓치지 마세요',
      cta: '지금 바로',
      href: '#products'
    },
    normal: {
      icon: '🐾',
      text: '신규 회원 10% 쿠폰 · 3만원 이상 무료배송 · VIP 정기배송 최대 35% 추가 할인',
      cta: '회원가입',
      href: '#'
    }
  }
};

function toMidnight(str) {
  const [y, m, d] = str.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function getEventState() {
  const today = new Date(); today.setHours(0,0,0,0);
  const preStart  = toMidnight(EVENT_CONFIG.PRE_START);
  const preEnd    = toMidnight(EVENT_CONFIG.PRE_END);
  const mainStart = toMidnight(EVENT_CONFIG.MAIN_START);
  const mainEnd   = toMidnight(EVENT_CONFIG.MAIN_END);
  const lastDay   = toMidnight(EVENT_CONFIG.LAST_DAY);

  if (today >= preStart && today <= preEnd) {
    const days = Math.ceil((mainStart - today) / 86400000);
    return { state: 'pre', days };
  }
  if (today.getTime() === lastDay.getTime()) return { state: 'lastday', days: 0 };
  if (today >= mainStart && today <= mainEnd) return { state: 'main', days: 0 };
  return { state: 'normal', days: 0 };
}

function initEventTopbar() {
  const bar = document.getElementById('eventTopbar');
  if (!bar) return;

  if (sessionStorage.getItem('v3-topbar-closed')) {
    bar.style.display = 'none';
    return;
  }

  const { state, days } = getEventState();
  const cfg = EVENT_CONFIG.messages[state];

  bar.dataset.state = state;
  bar.querySelector('.event-topbar-icon').textContent = cfg.icon;
  bar.querySelector('.event-topbar-text').textContent = cfg.text.replace('{days}', days);
  const cta = bar.querySelector('.event-topbar-cta');
  cta.textContent = cfg.cta;
  cta.href = cfg.href;

  bar.querySelector('.event-topbar-close').addEventListener('click', () => {
    bar.style.transition = 'height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
    bar.style.height = bar.offsetHeight + 'px';
    bar.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      bar.style.height = '0';
      bar.style.opacity = '0';
      bar.style.paddingTop = '0';
      bar.style.paddingBottom = '0';
    });
    setTimeout(() => { bar.style.display = 'none'; }, 350);
    sessionStorage.setItem('v3-topbar-closed', '1');
  });
}

// ── 스크롤 시 헤더 변화 ───────────────────────────────────────

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.35)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });
}

// ── 모바일 메뉴 ──────────────────────────────────────────────

function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', String(open));
    const [s1, , s3] = btn.querySelectorAll('span');
    const s2 = btn.querySelectorAll('span')[1];
    if (open) {
      s1.style.transform = 'translateY(7px) rotate(45deg)';
      s2.style.opacity = '0';
      s3.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      [s1, s2, s3].forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
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

// ── 탭 필터 ─────────────────────────────────────────────────

function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// ── 찜 버튼 ──────────────────────────────────────────────────

function initWishBtns() {
  document.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const svg = btn.querySelector('svg');
      const on = btn.classList.toggle('wished');
      svg.setAttribute('fill', on ? '#E53935' : 'none');
      svg.setAttribute('stroke', on ? '#E53935' : 'currentColor');
    });
  });
}

// ── 장바구니 ─────────────────────────────────────────────────

function initCartBtns() {
  document.querySelectorAll('.btn-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const badge = document.querySelector('.cart-badge');
      if (badge) badge.textContent = parseInt(badge.textContent) + 1;

      const orig = btn.textContent;
      btn.textContent = '✓ 담겼어요!';
      btn.style.background = '#E8F5E9';
      btn.style.color = '#065F46';

      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    });
  });
}

// ── 뉴스레터 폼 ──────────────────────────────────────────────

function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input.value.includes('@')) {
      input.style.borderColor = '#DC2626';
      input.focus();
      return;
    }
    input.style.borderColor = '#065F46';
    input.value = '';
    input.placeholder = '구독해주셔서 감사합니다! 🎉';
    setTimeout(() => { input.style.borderColor = ''; }, 3000);
  });
}

// ── IntersectionObserver: 카드 등장 애니메이션 ───────────────

function initCardAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  const targets = document.querySelectorAll(
    '.product-card, .review-card, .category-card, .vip-card, .award-item, .channel-card, .promo-card'
  );
  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.45s ease ${i * 0.05}s, transform 0.45s ease ${i * 0.05}s`;
    observer.observe(el);
  });
}

// ── 신뢰 수치 카운트업 ───────────────────────────────────────

function countUp(el, target, duration) {
  const isFloat = !Number.isInteger(target);
  const spanEl = el.querySelector('em');
  const spanHTML = spanEl ? spanEl.outerHTML : '';
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = isFloat
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target).toLocaleString('ko-KR');
    el.innerHTML = val + spanHTML;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initStatCountUp() {
  const statEls = document.querySelectorAll('.stat-num[data-target]');
  if (!statEls.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        entry.target.dataset.done = '1';
        countUp(entry.target, parseFloat(entry.target.dataset.target), 1800);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => obs.observe(el));
}

// ── CSR 프로그레스바 ─────────────────────────────────────────

function initCsrBar() {
  const fill = document.querySelector('.csr-bar-fill');
  if (!fill) return;
  const target = fill.dataset.width || '73%';

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = target;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(fill);
}

// ── DOMContentLoaded ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initEventTopbar();
  initHeaderScroll();
  initMobileMenu();
  initTabs();
  initWishBtns();
  initCartBtns();
  initNewsletter();
  initCardAnimations();
  initStatCountUp();
  initCsrBar();
});
