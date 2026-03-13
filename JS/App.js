/* =====================================================
   MARIAMA DIONE — Portfolio  |  script.js
   ===================================================== */

/* ── Attendre le DOM ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ================================================
     1. TOGGLE THÈME SOMBRE / CLAIR
  ================================================ */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme  = localStorage.getItem('md-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('md-theme', next);
  });


  /* ================================================
     2. CURSEUR PERSONNALISÉ
  ================================================ */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    }, 80);
  });

  document.querySelectorAll('a, button, .projet-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      ring.style.width  = '56px';
      ring.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.width  = '38px';
      ring.style.height = '38px';
    });
  });


  /* ================================================
     3. NAV — scroll shadow + lien actif
  ================================================ */
  const nav      = document.querySelector('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    /* Shadow nav au scroll */
    nav.classList.toggle('scrolled', window.scrollY > 20);

    /* Lien actif */
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });


  /* ================================================
     4. BURGER MENU MOBILE
  ================================================ */
  const burger   = document.getElementById('navBurger');
  const navMenu  = document.querySelector('.nav-links');

  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    /* Fermer au clic sur un lien */
    navLinks.forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      navMenu.classList.remove('open');
    }));
  }


  /* ================================================
     5. EFFET TYPING DANS LE HERO ROLE
  ================================================ */
  const roleEl = document.getElementById('heroRole');
  if (roleEl) {
    const phrases = [
      'Géomatique · Thiès, Sénégal',
      'Analyse de données · RStudio',
      'Collecte terrain · KoBoToolbox',
      'Développeuse Web · HTML / CSS / JS',
    ];
    let pi = 0, ci = 0, deleting = false;
    const cursor2 = document.createElement('span');
    cursor2.className = 'typed-cursor';
    roleEl.appendChild(cursor2);

    function type() {
      const phrase = phrases[pi];
      if (!deleting) {
        roleEl.firstChild.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        roleEl.firstChild.textContent = phrase.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 45 : 80);
    }
    // Préparer le nœud texte
    roleEl.insertBefore(document.createTextNode(''), cursor2);
    setTimeout(type, 1200);
  }


  /* ================================================
     6. COMPTEUR ANIMÉ (STATS HÉRO)
  ================================================ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    let count = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + suffix;
      if (count >= target) clearInterval(interval);
    }, 20);
  }

  /* Déclenché quand la section héro est visible */
  const statsCounters = document.querySelectorAll('.stat-num');
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statsCounters.forEach(el => animateCounter(el));
    }
  }, { threshold: 0.5 });
  const heroSec = document.getElementById('accueil');
  if (heroSec) statsObserver.observe(heroSec);


  /* ================================================
     7. SCROLL REVEAL (sections / cards)
  ================================================ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /* délai échelonné pour les enfants du même parent */
        const siblings = [...entry.target.parentElement.children]
          .filter(c => c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.1) + 's';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ================================================
     8. BARRES DE COMPÉTENCES ANIMÉES AU SCROLL
  ================================================ */
  const barFills = document.querySelectorAll('.bar-fill');

  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.width;
        entry.target.style.width = target;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  barFills.forEach(bar => barObserver.observe(bar));


  /* ================================================
     9. PARTICULES FLOTTANTES EN ARRIÈRE-PLAN
  ================================================ */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); init(); });

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function getAccentColor() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-rgb').trim() || '124,92,252';
    }

    function init() {
      const count = Math.min(60, Math.floor(W * H / 18000));
      particles = Array.from({ length: count }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(1, 2.5),
        vx: rand(-0.3, 0.3), vy: rand(-0.4, -0.1),
        alpha: rand(0.1, 0.5),
      }));
    }
    init();

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const rgb = getAccentColor();
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = H + 5; p.x = rand(0, W); }
        if (p.x < -10) p.x = W + 5;
        if (p.x > W + 10) p.x = -5;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }


  /* ================================================
     10. FORMULAIRE DE CONTACT — validation + toast
  ================================================ */
  const form    = document.getElementById('contactForm');
  const toast   = document.getElementById('formToast');
  const btnSend = document.getElementById('btnSend');

  if (form && toast && btnSend) {
    btnSend.addEventListener('click', () => {
      const nom     = document.getElementById('nom').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nom || !email || !message) {
        showToast('Veuillez remplir tous les champs.', 'error');
        return;
      }
      if (!emailRe.test(email)) {
        showToast('Adresse email invalide.', 'error');
        return;
      }

      /* Simulation d'envoi */
      btnSend.disabled = true;
      btnSend.textContent = 'Envoi en cours…';
      setTimeout(() => {
        showToast('✓ Message envoyé avec succès !', 'success');
        form.reset();
        btnSend.disabled = false;
        btnSend.innerHTML = 'ENVOYER <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
      }, 1500);
    });
  }

  function showToast(msg, type) {
    toast.textContent = msg;
    toast.className   = 'form-toast ' + type;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 4000);
  }

});
