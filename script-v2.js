// ============================================================
// 포우즈 v2 — script-v2.js
// v1 기능 전체 포함 + v2 신규 로직
// ============================================================

// ── v1: 탭 필터 ──────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ── v1: 찜 버튼 토글 ─────────────────────────────────────────
document.querySelectorAll('.wish-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const svg = btn.querySelector('svg');
    const isWished = btn.classList.toggle('wished');
    svg.setAttribute('fill', isWished ? '#E53935' : 'none');
    svg.setAttribute('stroke', isWished ? '#E53935' : 'currentColor');
  });
});

// ── v1: 장바구니 버튼 ─────────────────────────────────────────
document.querySelectorAll('.btn-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const badge = document.querySelector('.cart-badge');
    let count = parseInt(badge.textContent);
    badge.textContent = count + 1;

    btn.textContent = '✓ 담겼어요!';
    btn.style.background = '#E8F5E9';
    btn.style.color = '#2E7D32';

    setTimeout(() => {
      btn.textContent = '장바구니 담기';
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  });
});

// ── v1: 뉴스레터 구독 ─────────────────────────────────────────
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (!input.value || !input.value.includes('@')) {
      input.style.borderColor = '#E53935';
      return;
    }
    input.style.borderColor = '#4CAF50';
    input.value = '';
    input.placeholder = '구독해주셔서 감사합니다!';
  });
}

// ── v1: 스크롤 시 헤더 그림자 ────────────────────────────────
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (!header) return;
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// ── v1: 카드 등장 애니메이션 ──────────────────────────────────
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.product-card, .review-card, .category-card, .vip-card, .award-badge, .channel-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  cardObserver.observe(el);
});

// ============================================================
// v2 신규: 이벤트 탑바 날짜 분기
// ============================================================

const EVENT_CONFIG = {
  // 날짜 설정 (YYYY-MM-DD)
  PRE_START:  '2026-04-10',
  PRE_END:    '2026-04-19',
  MAIN_START: '2026-04-20',
  MAIN_END:   '2026-04-28',
  LAST_DAY:   '2026-04-29',

  messages: {
    pre: {
      icon: '⏳',
      text: '봄맞이 특가 이벤트 D-{days} · 사전 예약 시 5% 추가 쿠폰 증정!',
      cta: '사전 예약',
      href: '#vip'
    },
    main: {
      icon: '⚡',
      text: '🔥 봄맞이 특가 진행 중 · 전 상품 최대 30% + VIP 추가 35% 할인',
      cta: '지금 쇼핑',
      href: '#featured'
    },
    lastday: {
      icon: '🚨',
      text: '⏰ 오늘 자정 이벤트 종료! 마지막 기회를 놓치지 마세요',
      cta: '지금 바로',
      href: '#featured'
    },
    normal: {
      icon: '🐾',
      text: '신규 회원 10% 쿠폰 증정 · 3만원 이상 무료 배송',
      cta: '회원가입',
      href: '#'
    }
  }
};

function toMidnight(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function getEventState() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const preStart  = toMidnight(EVENT_CONFIG.PRE_START);
  const preEnd    = toMidnight(EVENT_CONFIG.PRE_END);
  const mainStart = toMidnight(EVENT_CONFIG.MAIN_START);
  const mainEnd   = toMidnight(EVENT_CONFIG.MAIN_END);
  const lastDay   = toMidnight(EVENT_CONFIG.LAST_DAY);

  if (today >= preStart && today <= preEnd) {
    const diffDays = Math.ceil((mainStart - today) / (1000 * 60 * 60 * 24));
    return { state: 'pre', days: diffDays };
  }
  if (today.getTime() === lastDay.getTime()) {
    return { state: 'lastday', days: 0 };
  }
  if (today >= mainStart && today <= mainEnd) {
    return { state: 'main', days: 0 };
  }
  return { state: 'normal', days: 0 };
}

function initEventTopbar() {
  const topbar = document.getElementById('eventTopbar');
  if (!topbar) return;

  // 이전에 닫은 경우 숨김 (세션 유지)
  if (sessionStorage.getItem('topbar-closed')) {
    topbar.style.display = 'none';
    return;
  }

  const { state, days } = getEventState();
  const cfg = EVENT_CONFIG.messages[state];
  const text = cfg.text.replace('{days}', days);

  topbar.setAttribute('data-state', state);
  topbar.querySelector('.event-topbar-icon').textContent = cfg.icon;
  topbar.querySelector('.event-topbar-text').textContent = text;

  const ctaEl = topbar.querySelector('.event-topbar-cta');
  ctaEl.textContent = cfg.cta;
  ctaEl.href = cfg.href;

  topbar.querySelector('.event-topbar-close').addEventListener('click', () => {
    topbar.style.height = topbar.offsetHeight + 'px';
    topbar.style.overflow = 'hidden';
    topbar.style.transition = 'height 0.3s ease, padding 0.3s ease, opacity 0.3s ease';
    requestAnimationFrame(() => {
      topbar.style.height = '0';
      topbar.style.padding = '0';
      topbar.style.opacity = '0';
    });
    setTimeout(() => { topbar.style.display = 'none'; }, 350);
    sessionStorage.setItem('topbar-closed', '1');
  });
}

// ============================================================
// v2 신규: 신뢰 배지 카운트업 애니메이션
// ============================================================

function animateCountUp(el, target, duration) {
  const isFloat = !Number.isInteger(target);
  const startTime = performance.now();
  const spanHTML = el.querySelector('span') ? el.querySelector('span').outerHTML : '';

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isFloat
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target).toLocaleString();
    el.innerHTML = current + spanHTML;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initTrustStats() {
  const trustSection = document.querySelector('.trust-section');
  if (!trustSection) return;

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        const target = parseFloat(entry.target.dataset.target);
        animateCountUp(entry.target, target, 1600);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.trust-number[data-target]').forEach(el => {
    statObserver.observe(el);
  });
}

// ============================================================
// v2 신규: CSR 프로그레스바 애니메이션
// ============================================================

function initCsrProgress() {
  const fill = document.querySelector('.csr-progress-fill');
  if (!fill) return;

  const targetWidth = fill.dataset.width || '73%';

  const progObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = targetWidth;
        progObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  progObserver.observe(fill);
}

// ============================================================
// v2 신규: 모바일 메뉴 토글
// ============================================================

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    // 햄버거 → X 아이콘 변환
    const spans = menuBtn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // 메뉴 바깥 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('nav-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    }
  });
}

// ============================================================
// DOMContentLoaded — 진입점
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initEventTopbar();
  initTrustStats();
  initCsrProgress();
  initMobileMenu();
});
