/* ============================================================
   Tracker.js — Enregistre les visiteurs et les messages
   dans localStorage pour affichage dans le tableau de bord
   ============================================================ */

(function () {
  'use strict';

  /* ---- Clés localStorage ---- */
  const KEY_VISITORS = 'md_visitors';
  const KEY_MESSAGES = 'md_messages';

  /* ---- Utilitaires ---- */
  function loadJSON(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }
  function saveJSON(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /* ---- Enregistrer la visite ---- */
  function trackVisit() {
    // Géolocalisation via API publique (no-cors friendly, IP-based)
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const visitors = loadJSON(KEY_VISITORS);
        const entry = {
          id: Date.now(),
          ts: new Date().toISOString(),
          ip: data.ip || '—',
          city: data.city || '—',
          country: data.country_name || '—',
          country_code: data.country_code || '',
          lat: data.latitude || null,
          lon: data.longitude || null,
          ua: navigator.userAgent.slice(0, 80),
        };
        visitors.unshift(entry);
        // Garder les 200 derniers visiteurs
        saveJSON(KEY_VISITORS, visitors.slice(0, 200));
      })
      .catch(() => {
        // Si l'API échoue, on enregistre quand même sans géoloc
        const visitors = loadJSON(KEY_VISITORS);
        visitors.unshift({
          id: Date.now(),
          ts: new Date().toISOString(),
          ip: '—',
          city: 'Inconnu',
          country: 'Inconnu',
          country_code: '',
          lat: null,
          lon: null,
          ua: navigator.userAgent.slice(0, 80),
        });
        saveJSON(KEY_VISITORS, visitors.slice(0, 200));
      });
  }

  /* ---- Intercepter l'envoi du formulaire de contact ---- */
  function hookContactForm() {
    const btnSend = document.getElementById('btnSend');
    if (!btnSend) return;

    btnSend.addEventListener('click', function () {
      const nom     = (document.getElementById('nom')?.value || '').trim();
      const email   = (document.getElementById('email')?.value || '').trim();
      const sujet   = (document.getElementById('sujet')?.value || '').trim();
      const message = (document.getElementById('message')?.value || '').trim();

      if (!nom || !email || !message) return; // validation faite par App.js

      // Petit délai pour laisser App.js valider d'abord
      setTimeout(() => {
        const toast = document.getElementById('formToast');
        // On enregistre seulement si App.js a affiché un succès
        if (toast && toast.classList.contains('success')) {
          const messages = loadJSON(KEY_MESSAGES);
          messages.unshift({
            id: Date.now(),
            ts: new Date().toISOString(),
            nom,
            email,
            sujet: sujet || '(sans sujet)',
            message,
            read: false,
          });
          saveJSON(KEY_MESSAGES, messages.slice(0, 500));
        }
      }, 300);
    });
  }

  /* ---- Init ---- */
  trackVisit();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hookContactForm);
  } else {
    hookContactForm();
  }

})();