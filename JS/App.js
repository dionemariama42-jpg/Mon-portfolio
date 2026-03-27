/* ============================================================
   App.js — Portfolio Mariama DIONE
   ============================================================ */

// ====== THÈME ======
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ====== NAV BURGER ======
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
navBurger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
// Fermer en cliquant sur un lien mobile
document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ====== NAV SCROLL ======
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? (html.getAttribute('data-theme') === 'light'
        ? 'rgba(240,250,242,0.95)'
        : 'rgba(10,26,15,0.96)')
    : '';
});

// ====== CURSEUR PERSONNALISÉ ======
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
if (cursor && cursorRing) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => {
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top  = e.clientY + 'px';
    }, 60);
  });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

// ====== PARTICULES CANVAS ======
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLES = Array.from({ length: 55 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.4,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    opacity: Math.random() * 0.5 + 0.15,
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    const isDark = html.getAttribute('data-theme') !== 'light';
    const color = isDark ? '52,168,83' : '27,120,54';

    PARTICLES.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.opacity})`;
      ctx.fill();
    });

    // Lignes entre particules proches
    PARTICLES.forEach((a, i) => {
      PARTICLES.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${color},${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ====== TYPAGE HERO ======
const roles = [
  'Géomaticienne',
  'Analyste SIG',
  'Cartographe',
];
let roleIndex = 0, charIndex = 0, typing = true;
const heroRole = document.getElementById('heroRole');

function typeRole() {
  if (!heroRole) return;
  const current = roles[roleIndex];
  if (typing) {
    heroRole.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      typing = false;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    heroRole.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      typing = true;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRole, typing ? 80 : 40);
}
typeRole();

// ====== COMPTEURS ANIMÉS ======
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1500;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ====== REVEAL + BARRES + COMPTEURS ======
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // Compteurs
    entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
    if (entry.target.hasAttribute('data-target')) animateCounter(entry.target);

    // Barres
    entry.target.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') || '0%';
    });
    if (entry.target.classList.contains('bar-fill')) {
      entry.target.style.width = entry.target.getAttribute('data-width') || '0%';
    }

    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .about-stat').forEach(el => {
  revealObs.observe(el);
});

// Compteurs hero (visibles sans scroll)
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-stats .stat-num').forEach(animateCounter);
});

// ====== SCROLL TOP ======
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ====== FORMULAIRE CONTACT ======
const btnSend  = document.getElementById('btnSend');
const btnReset = document.getElementById('btnReset');
const toast    = document.getElementById('formToast');

if (btnSend) {
  btnSend.addEventListener('click', () => {
    const nom     = document.getElementById('nom')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const sujet   = document.getElementById('sujet')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!nom || !email || !message) {
      toast.textContent = '⚠️ Veuillez remplir tous les champs obligatoires.';
      toast.className = 'form-toast error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.textContent = '⚠️ Adresse email invalide.';
      toast.className = 'form-toast error';
      return;
    }

    // Simulation d'envoi
    btnSend.disabled = true;
    btnSend.textContent = 'Envoi…';
    setTimeout(() => {
      toast.textContent = '✅ Message envoyé avec succès ! Je vous répondrai bientôt.';
      toast.className = 'form-toast success';
      btnSend.textContent = 'ENVOYER';
      btnSend.disabled = false;
    }, 1200);
  });
}

if (btnReset) {
  btnReset.addEventListener('click', () => {
    ['nom', 'email', 'sujet', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    if (toast) { toast.textContent = ''; toast.className = 'form-toast'; }
  });
}

// ====== LIENS ACTIFS (highlight nav) ======
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--accent)'
      : '';
  });
});
