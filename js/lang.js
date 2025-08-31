let STRINGS = {};  // loaded from JSON
let currentLang = 'kn'; // default Kannada

function applyLang(lang) {
  const map = STRINGS[lang] || STRINGS.kn;
  document.documentElement.lang = (lang === 'kn' ? 'kn' : 'en');

  for (const key in map) {
    document.querySelectorAll(`[data-i18n="${key}"]`)
      .forEach(el => { el.textContent = map[key]; });
  }

  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = map.lang_btn;

  currentLang = lang;
  localStorage.setItem('lang', lang);
}

// Load JSON once, then init
fetch('/lang/lang.json')
  .then(r => r.json())
  .then(data => {
    STRINGS = data;
    applyLang(localStorage.getItem('lang') || 'kn');
  });

// Toggle on click
document.addEventListener('click', e => {
  if (e.target && e.target.id === 'langToggle') {
    applyLang(currentLang === 'en' ? 'kn' : 'en');
  }
});

// Year helper
document.addEventListener('DOMContentLoaded', () => {
  const y1 = document.getElementById('year');
  const y2 = document.getElementById('spYear');
  const year = new Date().getFullYear();
  if (y1) y1.textContent = year;
  if (y2) y2.textContent = year;
});
