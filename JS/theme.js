// Script pour les boutons de thème
document.addEventListener('DOMContentLoaded', function() {
  const themeDark = document.getElementById('themeDark');
  const themeLight = document.getElementById('themeLight');
  const body = document.body;

  // Vérifier le thème sauvegardé
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeDark.classList.remove('active');
    themeLight.classList.add('active');
  } else {
    body.classList.remove('light-mode');
    themeDark.classList.add('active');
    themeLight.classList.remove('active');
  }

  // Mode sombre
  themeDark.addEventListener('click', function() {
    body.classList.remove('light-mode');
    themeDark.classList.add('active');
    themeLight.classList.remove('active');
    localStorage.setItem('theme', 'dark');
  });

  // Mode clair
  themeLight.addEventListener('click', function() {
    body.classList.add('light-mode');
    themeLight.classList.add('active');
    themeDark.classList.remove('active');
    localStorage.setItem('theme', 'light');
  });

  // Simulation du loader (disparaît après chargement)
  setTimeout(() => {
    document.getElementById('loader').style.opacity = '0';
    document.getElementById('loader').style.visibility = 'hidden';
  }, 2000);
});