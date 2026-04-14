// 탭 필터
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// 찜 버튼 토글
document.querySelectorAll('.wish-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const svg = btn.querySelector('svg');
    const isWished = btn.classList.toggle('wished');
    svg.setAttribute('fill', isWished ? '#E53935' : 'none');
    svg.setAttribute('stroke', isWished ? '#E53935' : 'currentColor');
  });
});

// 장바구니 버튼
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

// 뉴스레터 구독
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

// 스크롤 시 헤더 그림자
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// 카드 등장 애니메이션
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .review-card, .category-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});
