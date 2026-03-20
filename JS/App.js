/* =====================================================
   MARIAMA DIONE — Portfolio  |  script.js
   ===================================================== */

/* ── Attendre que tout le contenu HTML soit chargé avant d'exécuter le script ── */
document.addEventListener('DOMContentLoaded', () => {
  // On attend que la page soit entièrement construite avant de lancer le code


  /* ================================================
     1. TOGGLE THÈME SOMBRE / CLAIR
  ================================================ */

  const html        = document.documentElement;          // Sélectionne la balise <html> (racine du document)
  const themeToggle = document.getElementById('themeToggle'); // Sélectionne le bouton de changement de thème
  const savedTheme  = localStorage.getItem('md-theme') || 'dark'; // Récupère le thème sauvegardé (ou 'dark' par défaut)
  html.setAttribute('data-theme', savedTheme);           // Applique le thème sauvegardé au chargement de la page

  themeToggle.addEventListener('click', () => {          // Écoute un clic sur le bouton de thème
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; // Si le thème actuel est 'dark', passe à 'light', sinon passe à 'dark'
    html.setAttribute('data-theme', next);               // Applique le nouveau thème sur la balise <html>
    localStorage.setItem('md-theme', next);              // Sauvegarde le nouveau thème dans le navigateur (persistant)
  });


  /* ================================================
     2. CURSEUR PERSONNALISÉ
  ================================================ */

  const cursor = document.getElementById('cursor');      // Sélectionne le point central du curseur personnalisé
  const ring   = document.getElementById('cursor-ring'); // Sélectionne l'anneau qui suit le curseur avec un léger retard

  document.addEventListener('mousemove', e => {          // Écoute chaque mouvement de la souris sur toute la page
    cursor.style.left = e.clientX + 'px';                // Déplace le point du curseur à la position X de la souris
    cursor.style.top  = e.clientY + 'px';                // Déplace le point du curseur à la position Y de la souris
    setTimeout(() => {                                   // Crée un léger retard (80ms) pour l'anneau afin de simuler un suivi fluide
      ring.style.left = e.clientX + 'px';               // Déplace l'anneau à la position X de la souris (avec retard)
      ring.style.top  = e.clientY + 'px';               // Déplace l'anneau à la position Y de la souris (avec retard)
    }, 80);                                              // Délai de 80 millisecondes pour l'effet de traîne
  });

  document.querySelectorAll('a, button, .projet-card').forEach(el => { // Sélectionne tous les liens, boutons et cartes de projets
    el.addEventListener('mouseenter', () => {            // Quand la souris entre sur un élément interactif
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; // Agrandit le point du curseur (effet de zoom)
      ring.style.width  = '56px';                        // Augmente la largeur de l'anneau
      ring.style.height = '56px';                        // Augmente la hauteur de l'anneau
    });
    el.addEventListener('mouseleave', () => {            // Quand la souris quitte l'élément interactif
      cursor.style.transform = 'translate(-50%,-50%) scale(1)'; // Remet le curseur à sa taille normale
      ring.style.width  = '38px';                        // Remet l'anneau à sa largeur d'origine
      ring.style.height = '38px';                        // Remet l'anneau à sa hauteur d'origine
    });
  });


  /* ================================================
     3. NAV — scroll shadow + lien actif
  ================================================ */

  const nav      = document.querySelector('nav');        // Sélectionne la barre de navigation
  const sections = document.querySelectorAll('section[id]'); // Sélectionne toutes les sections qui ont un attribut id
  const navLinks = document.querySelectorAll('.nav-links a'); // Sélectionne tous les liens dans le menu de navigation

  window.addEventListener('scroll', () => {              // Écoute le défilement de la page
    nav.classList.toggle('scrolled', window.scrollY > 20); // Ajoute la classe 'scrolled' sur la nav si on a scrollé de plus de 20px

    let current = '';                                    // Variable qui va stocker l'id de la section visible
    sections.forEach(sec => {                            // Parcourt toutes les sections de la page
      if (window.scrollY >= sec.offsetTop - 80) current = sec.id; // Si on a scrollé jusqu'à cette section (moins 80px de marge), elle devient la section courante
    });
    navLinks.forEach(a => {                              // Parcourt tous les liens du menu
      a.classList.toggle('active', a.getAttribute('href') === '#' + current); // Ajoute 'active' sur le lien qui correspond à la section courante
    });
  }, { passive: true });                                 // { passive: true } améliore les performances du scroll


  /* ================================================
     4. BURGER MENU MOBILE
  ================================================ */

  const burger   = document.getElementById('navBurger'); // Sélectionne le bouton hamburger (menu mobile)
  const navMenu  = document.querySelector('.nav-links'); // Sélectionne le menu de navigation (liste des liens)

  if (burger) {                                          // Vérifie que le bouton burger existe dans le DOM
    burger.addEventListener('click', () => {             // Écoute le clic sur le bouton hamburger
      burger.classList.toggle('open');                   // Ajoute ou retire la classe 'open' sur le burger (animation des barres)
      navMenu.classList.toggle('open');                  // Ajoute ou retire la classe 'open' sur le menu (affiche/cache le menu)
    });
    navLinks.forEach(a => a.addEventListener('click', () => { // Pour chaque lien du menu
      burger.classList.remove('open');                   // Referme l'animation du burger au clic sur un lien
      navMenu.classList.remove('open');                  // Ferme le menu mobile au clic sur un lien
    }));
  }


  /* ================================================
     5. EFFET TYPING DANS LE HERO ROLE
  ================================================ */

  const roleEl = document.getElementById('heroRole');    // Sélectionne le paragraphe où s'affiche l'effet de frappe

  if (roleEl) {                                          // Vérifie que l'élément existe dans la page
    const phrases = [                                    // Tableau contenant les textes qui seront tapés un à un
      'Géomaticienne',                                   // Seul texte actuellement dans le tableau
    ];
    let pi = 0, ci = 0, deleting = false;                // pi = index de la phrase, ci = index du caractère, deleting = si on efface ou non
    const cursor2 = document.createElement('span');      // Crée un élément <span> pour simuler le curseur clignotant
    cursor2.className = 'typed-cursor';                  // Lui attribue la classe CSS 'typed-cursor' pour l'animation de clignotement
    roleEl.appendChild(cursor2);                         // Ajoute le curseur clignotant dans le DOM

    function type() {                                    // Fonction récursive qui gère l'animation de frappe/effacement
      const phrase = phrases[pi];                        // Récupère la phrase en cours selon l'index pi
      if (!deleting) {                                   // Si on est en mode "frappe" (pas effacement)
        roleEl.firstChild.textContent = phrase.slice(0, ++ci); // Affiche les caractères un par un (incrémente ci)
        if (ci === phrase.length) {                      // Si tous les caractères de la phrase sont affichés
          deleting = true;                               // Passe en mode effacement
          setTimeout(type, 1800);                        // Attend 1,8 secondes avant de commencer à effacer
          return;                                        // Sort de la fonction pour éviter de rappeler type() tout de suite
        }
      } else {                                           // Sinon on est en mode "effacement"
        roleEl.firstChild.textContent = phrase.slice(0, --ci); // Efface les caractères un par un (décrémente ci)
        if (ci === 0) {                                  // Si tous les caractères sont effacés
          deleting = false;                              // Repasse en mode frappe
          pi = (pi + 1) % phrases.length;               // Passe à la phrase suivante (revient à 0 si on est à la fin)
        }
      }
      setTimeout(type, deleting ? 45 : 80);             // Rappelle la fonction : 45ms pour effacer (plus rapide), 80ms pour écrire
    }

    roleEl.insertBefore(document.createTextNode(''), cursor2); // Ajoute un nœud texte vide avant le curseur (pour stocker le texte tapé)
    setTimeout(type, 1200);                              // Lance l'animation de frappe après 1,2 secondes
  }


  /* ================================================
     6. COMPTEUR ANIMÉ (STATS HÉRO)
  ================================================ */

  function animateCounter(el) {                          // Fonction qui anime un compteur de 0 jusqu'au nombre cible
    const target = parseInt(el.dataset.target, 10);      // Récupère le nombre cible depuis l'attribut data-target (converti en entier)
    const suffix = el.dataset.suffix || '';              // Récupère le suffixe (ex: "+") depuis data-suffix, ou chaîne vide si absent
    let count = 0;                                       // Initialise le compteur à 0
    const step = Math.ceil(target / 60);                 // Calcule le pas d'incrémentation pour atteindre la cible en ~60 étapes
    const interval = setInterval(() => {                 // Lance une répétition régulière (toutes les 20ms)
      count = Math.min(count + step, target);            // Ajoute le pas au compteur sans dépasser la cible
      el.textContent = count + suffix;                   // Affiche la valeur actuelle avec le suffixe dans l'élément
      if (count >= target) clearInterval(interval);      // Arrête l'intervalle quand la cible est atteinte
    }, 20);                                              // Intervalle de 20 millisecondes entre chaque étape
  }

  const statsCounters = document.querySelectorAll('.stat-num'); // Sélectionne tous les éléments avec la classe 'stat-num'
  let statsAnimated = false;                             // Variable pour s'assurer que l'animation ne se déclenche qu'une seule fois

  const statsObserver = new IntersectionObserver(entries => { // Crée un observateur qui surveille la visibilité d'un élément
    if (entries[0].isIntersecting && !statsAnimated) {   // Si l'élément est visible dans l'écran ET que l'animation n'a pas encore été jouée
      statsAnimated = true;                              // Marque l'animation comme jouée pour éviter de la relancer
      statsCounters.forEach(el => animateCounter(el));   // Lance l'animation pour chaque compteur
    }
  }, { threshold: 0.5 });                               // Se déclenche quand au moins 50% de l'élément est visible

  const heroSec = document.getElementById('accueil');   // Sélectionne la section héro
  if (heroSec) statsObserver.observe(heroSec);          // Commence à observer la section héro pour déclencher les compteurs


  /* ================================================
     7. SCROLL REVEAL (sections / cards)
  ================================================ */

  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right'); // Sélectionne tous les éléments à faire apparaître au scroll

  const revealObserver = new IntersectionObserver(entries => { // Crée un observateur pour détecter quand les éléments entrent dans l'écran
    entries.forEach(entry => {                           // Parcourt chaque élément observé
      if (entry.isIntersecting) {                        // Si l'élément est visible dans la fenêtre du navigateur
        const siblings = [...entry.target.parentElement.children] // Récupère tous les enfants du parent de l'élément
          .filter(c => c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right')); // Garde uniquement ceux qui ont une classe reveal
        const idx = siblings.indexOf(entry.target);      // Trouve la position (index) de l'élément dans sa fratrie
        entry.target.style.transitionDelay = (idx * 0.1) + 's'; // Applique un délai progressif (0.1s entre chaque élément) pour un effet en cascade
        entry.target.classList.add('visible');           // Ajoute la classe 'visible' pour déclencher l'animation CSS d'apparition
        revealObserver.unobserve(entry.target);          // Arrête d'observer cet élément (l'animation ne se joue qu'une fois)
      }
    });
  }, { threshold: 0.15 });                              // Se déclenche quand au moins 15% de l'élément est visible

  revealEls.forEach(el => revealObserver.observe(el));  // Lance l'observation sur chaque élément à révéler


  /* ================================================
     8. BARRES DE COMPÉTENCES ANIMÉES AU SCROLL
  ================================================ */

  const barFills = document.querySelectorAll('.bar-fill'); // Sélectionne toutes les barres de progression des compétences

  const barObserver = new IntersectionObserver(entries => { // Crée un observateur pour les barres de compétences
    entries.forEach(entry => {                           // Parcourt chaque barre observée
      if (entry.isIntersecting) {                        // Si la barre est visible dans l'écran
        const target = entry.target.dataset.width;       // Récupère la largeur cible depuis l'attribut data-width (ex: "85%")
        entry.target.style.width = target;               // Applique la largeur cible → déclenche l'animation CSS de remplissage
        barObserver.unobserve(entry.target);             // Arrête d'observer cette barre (l'animation ne se joue qu'une fois)
      }
    });
  }, { threshold: 0.3 });                               // Se déclenche quand au moins 30% de la barre est visible

  barFills.forEach(bar => barObserver.observe(bar));    // Lance l'observation sur chaque barre de compétence


  /* ================================================
     9. PARTICULES FLOTTANTES EN ARRIÈRE-PLAN
  ================================================ */

  const canvas = document.getElementById('particles-canvas'); // Sélectionne l'élément <canvas> pour dessiner les particules

  if (canvas) {                                          // Vérifie que le canvas existe dans le DOM
    const ctx = canvas.getContext('2d');                 // Récupère le contexte 2D du canvas pour pouvoir dessiner dessus
    let W, H, particles;                                 // Déclare les variables : largeur, hauteur, et tableau de particules

    function resize() {                                  // Fonction qui adapte le canvas à la taille de la fenêtre
      W = canvas.width  = window.innerWidth;             // Définit la largeur du canvas = largeur de la fenêtre
      H = canvas.height = window.innerHeight;            // Définit la hauteur du canvas = hauteur de la fenêtre
    }
    resize();                                            // Appelle resize() immédiatement au chargement
    window.addEventListener('resize', () => { resize(); init(); }); // Quand la fenêtre est redimensionnée, recalcule le canvas et recrée les particules

    function rand(min, max) { return Math.random() * (max - min) + min; } // Fonction utilitaire : retourne un nombre aléatoire entre min et max

    function getAccentColor() {                          // Fonction qui récupère la couleur d'accent définie dans le CSS
      return getComputedStyle(document.documentElement)  // Lit les propriétés CSS calculées de la balise <html>
        .getPropertyValue('--accent-rgb').trim() || '124,92,252'; // Retourne la variable CSS --accent-rgb, ou une valeur violette par défaut
    }

    function init() {                                    // Fonction qui crée le tableau de particules
      const count = Math.min(60, Math.floor(W * H / 18000)); // Calcule le nombre de particules selon la taille de l'écran (max 60)
      particles = Array.from({ length: count }, () => ({ // Crée un tableau avec 'count' particules, chacune avec des propriétés aléatoires
        x: rand(0, W),                                   // Position horizontale aléatoire dans le canvas
        y: rand(0, H),                                   // Position verticale aléatoire dans le canvas
        r: rand(1, 2.5),                                 // Rayon aléatoire entre 1 et 2.5 pixels
        vx: rand(-0.3, 0.3),                             // Vitesse horizontale aléatoire (peut aller à gauche ou à droite)
        vy: rand(-0.4, -0.1),                            // Vitesse verticale négative (les particules montent vers le haut)
        alpha: rand(0.1, 0.5),                           // Opacité aléatoire entre 0.1 (quasi invisible) et 0.5 (semi-transparent)
      }));
    }
    init();                                              // Crée les particules au chargement

    function draw() {                                    // Fonction d'animation principale (appelée en boucle)
      ctx.clearRect(0, 0, W, H);                         // Efface tout le canvas à chaque frame pour redessiner proprement
      const rgb = getAccentColor();                      // Récupère la couleur d'accent actuelle (change selon le thème)
      particles.forEach(p => {                           // Parcourt chaque particule
        ctx.beginPath();                                 // Commence un nouveau tracé
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);         // Dessine un cercle à la position (x, y) avec le rayon r
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;      // Définit la couleur de remplissage avec l'opacité alpha
        ctx.fill();                                      // Remplit le cercle avec la couleur définie

        p.x += p.vx;                                     // Déplace la particule horizontalement selon sa vitesse vx
        p.y += p.vy;                                     // Déplace la particule verticalement selon sa vitesse vy (vers le haut)
        if (p.y < -10) { p.y = H + 5; p.x = rand(0, W); } // Si la particule sort par le haut, la replace en bas à une position x aléatoire
        if (p.x < -10) p.x = W + 5;                     // Si la particule sort par la gauche, la replace à droite
        if (p.x > W + 10) p.x = -5;                     // Si la particule sort par la droite, la replace à gauche
      });
      requestAnimationFrame(draw);                       // Demande au navigateur d'appeler draw() à la prochaine frame (60fps environ)
    }
    draw();                                              // Lance la boucle d'animation
  }


  /* ================================================
     10. FORMULAIRE DE CONTACT — validation + toast
  ================================================ */
  // Bouton réinitialiser le formulaire
document.getElementById('btnReset')?.addEventListener('click', () => {
  document.getElementById('nom').value = '';
  document.getElementById('email').value = '';
  document.getElementById('message').value = '';
  const toast = document.getElementById('formToast');
  toast.style.display = 'none';
  toast.className = 'form-toast';
});
  const form    = document.getElementById('contactForm'); // Sélectionne le formulaire de contact
  const toast   = document.getElementById('formToast');   // Sélectionne la zone d'affichage des messages (toast)
  const btnSend = document.getElementById('btnSend');     // Sélectionne le bouton d'envoi du formulaire

  if (form && toast && btnSend) {                        // Vérifie que les trois éléments existent dans le DOM
    btnSend.addEventListener('click', () => {            // Écoute le clic sur le bouton "Envoyer"
      const nom     = document.getElementById('nom').value.trim();     // Récupère la valeur du champ nom (sans espaces en début/fin)
      const email   = document.getElementById('email').value.trim();   // Récupère la valeur du champ email (sans espaces)
      const message = document.getElementById('message').value.trim(); // Récupère la valeur du champ message (sans espaces)
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;     // Expression régulière pour valider le format de l'email (ex: a@b.com)

      if (!nom || !email || !message) {                  // Si un ou plusieurs champs sont vides
        showToast('Veuillez remplir tous les champs.', 'error'); // Affiche un message d'erreur
        return;                                          // Arrête l'exécution de la fonction
      }
      if (!emailRe.test(email)) {                        // Si l'email ne correspond pas au format attendu
        showToast('Adresse email invalide.', 'error');   // Affiche un message d'erreur spécifique à l'email
        return;                                          // Arrête l'exécution de la fonction
      }

      /* Simulation d'envoi */
      btnSend.disabled = true;                           // Désactive le bouton pour éviter les doubles envois
      btnSend.textContent = 'Envoi en cours…';           // Change le texte du bouton pour indiquer le chargement
      setTimeout(() => {                                 // Simule un délai d'envoi de 1,5 secondes
        showToast('✓ Message envoyé avec succès !', 'success'); // Affiche un message de succès après le délai
        form.reset();                                    // Remet tous les champs du formulaire à vide
        btnSend.disabled = false;                        // Réactive le bouton d'envoi
        btnSend.innerHTML = 'ENVOYER <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>'; // Restaure le texte et l'icône du bouton
      }, 1500);                                          // Délai de 1500 millisecondes (1,5 secondes)
    });
  }

  function showToast(msg, type) {                        // Fonction utilitaire pour afficher un message toast
    toast.textContent = msg;                             // Définit le texte du message à afficher
    toast.className   = 'form-toast ' + type;            // Applique la classe CSS (success ou error) pour la couleur
    toast.style.display = 'block';                       // Rend le toast visible
    setTimeout(() => { toast.style.display = 'none'; }, 4000); // Cache automatiquement le toast après 4 secondes
  }

}); // Fin du DOMContentLoaded — tout le code s'exécute après le chargement complet de la page