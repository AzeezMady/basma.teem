/**
 * فريق بسمة — JavaScript
 * للتمكين والدعم النفسي والاجتماعي
 */

/* ══════════════════════════════════════════
   PRELOADER
══════════════════════════════════════════ */
document.body.style.overflow = 'hidden';

window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 2000);
});

/* ══════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════ */
const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.transform = `scaleX(${scrollTop / docH})`;
}

/* ══════════════════════════════════════════
   NAVBAR — STICKY + BLUR ON SCROLL
══════════════════════════════════════════ */
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('back-top');

function onScroll() {
  updateProgress();
  const scrolled = window.scrollY > 60;
  if (navbar)  navbar.classList.toggle('scrolled', scrolled);
  if (backTop) backTop.classList.toggle('visible', scrolled);
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ══════════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════════ */
if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('active', menuOpen);
    hamburger.setAttribute('aria-expanded', menuOpen);

    if (menuOpen) {
      mobileMenu.style.display = 'flex';
      requestAnimationFrame(() => mobileMenu.classList.add('open'));
    } else {
      mobileMenu.classList.remove('open');
      setTimeout(() => { mobileMenu.style.display = 'none'; }, 400);
    }
  });
}

function closeMobileMenu() {
  if (!hamburger || !mobileMenu) return;
  menuOpen = false;
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  setTimeout(() => { mobileMenu.style.display = 'none'; }, 400);
}
window.closeMobileMenu = closeMobileMenu;

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════
   RIPPLE EFFECT
══════════════════════════════════════════ */
function createRipple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;

  circle.className = 'ripple';
  circle.style.cssText = `
    width:${size}px; height:${size}px;
    top:${e.clientY - rect.top - size / 2}px;
    left:${e.clientX - rect.left - size / 2}px;
  `;
  btn.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
}
window.createRipple = createRipple;

/* ══════════════════════════════════════════
   PARALLAX — HERO BLOBS (light)
══════════════════════════════════════════ */
const blobs     = document.querySelectorAll('.blob');
const heroLogoWrap = document.querySelector('.hero-logo-wrap');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    const p = y / window.innerHeight;
    blobs.forEach((b, i) => {
      b.style.transform = `translateY(${p * (i % 2 === 0 ? 40 : -30)}px)`;
    });
    if (heroLogoWrap) heroLogoWrap.style.transform = `translateY(${p * -20}px)`;
  }
}, { passive: true });

/* ══════════════════════════════════════════
   CARD HOVER TILT (subtle 3D)
══════════════════════════════════════════ */
document.querySelectorAll('.value-card, .vm-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    card.style.transform = `translateY(-6px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ══════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#navbar .nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--gold-dark)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));

/* ══════════════════════════════════════════
   GALLERY LIGHTBOX
══════════════════════════════════════════ */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-caption');

function openLightbox(card) {
  if (!lightbox || !lightboxImg) return;
  const img = card.querySelector('img');
  if (!img) return; // placeholder — no real image yet
  lightboxImg.src = img.src;
  lightboxImg.alt = card.dataset.caption || '';
  if (lightboxCap) lightboxCap.textContent = card.dataset.caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (!lightbox) return;
  if (e && e.target !== lightbox && e.target.id !== 'lightbox-close') return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 350);
}

if (lightbox) {
  lightbox.addEventListener('click', closeLightbox);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
});

window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;
