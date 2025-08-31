// Desktop inline nav + Mobile floating popup menu (responsive + a11y)
(function () {
  // -------- Inline (desktop/tablet) nav (kept for future use) --------
  function initInlineNav(){
    var toggle = document.getElementById('spNavToggle');
    var links  = document.getElementById('spNavLinks');
    if (!toggle || !links) return;

    var open = false;
    function set(state){
      open = state;
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }
    toggle.addEventListener('click', function(){ set(!open); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') set(false); });
  }

  // -------- Mobile popup (FAB) --------
  function initPopupMenuResponsive(){
    var fab   = document.getElementById('spMenuFab');
    var menu  = document.getElementById('spMenu');
    var close = document.getElementById('spMenuClose');
    var panel = menu ? menu.querySelector('.sp-menu__panel') : null;

    if (!fab || !menu || !panel || !close) return;

    var mq = window.matchMedia('(max-width: 786px)');
    var open = false;
    var prevFocus = null;

    function onFabClick(){ set(!open); }
    function onCloseClick(){ set(false); }
    function onMenuClick(e){ if (e.target && e.target.getAttribute('data-close')) set(false); }
    function onEsc(e){ if (e.key === 'Escape' && open) set(false); }
    function onNavClick(){ set(false); }

    function lockScroll(lock){
      document.documentElement.classList.toggle('sp-no-scroll', lock);
    }

    function set(state){
      open = state;
      menu.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', String(open));
      lockScroll(open);
      if (open){
        prevFocus = document.activeElement;
        panel.focus();
      } else {
        if (prevFocus && prevFocus.focus) prevFocus.focus();
      }
    }

    // track listeners so we can remove on desktop
    var enabled = false;
    function enable(){
      if (enabled) return;
      enabled = true;
      fab.addEventListener('click', onFabClick);
      close.addEventListener('click', onCloseClick);
      menu.addEventListener('click', onMenuClick);
      document.addEventListener('keydown', onEsc);
      menu.querySelectorAll('.sp-menu__links a').forEach(function(a){
        a.addEventListener('click', onNavClick);
      });
      set(false); // ensure closed entering mobile
    }

    function disable(){
      if (!enabled) return;
      enabled = false;
      set(false); // close and unlock scroll
      fab.removeEventListener('click', onFabClick);
      close.removeEventListener('click', onCloseClick);
      menu.removeEventListener('click', onMenuClick);
      document.removeEventListener('keydown', onEsc);
      menu.querySelectorAll('.sp-menu__links a').forEach(function(a){
        a.removeEventListener('click', onNavClick);
      });
    }

    function apply(e){
      if (e.matches) enable();  // mobile
      else disable();           // desktop
    }

    mq.addEventListener('change', apply);
    apply(mq);
  }

  // -------- Language toggle relocation (desktop ↔ mobile menu) --------
  function initLangRelocation(){
    var MOBILE_MAX = 786; // keep in sync with CSS
    var header = document.querySelector('.sp-header');
    var langBtn = document.getElementById('langToggle');
    var extraHost = document.getElementById('spMenuExtra'); // add this div in the mobile panel
    if (!header || !langBtn || !extraHost) return;

    // anchor to restore in header (right after it)
    var restoreAnchor = document.createComment('lang-restore-anchor');
    if (!header.firstChild || header.firstChild !== restoreAnchor) {
      header.insertBefore(restoreAnchor, header.firstChild);
    }

    function isMobile(){ return window.innerWidth <= MOBILE_MAX; }

    function relocate(){
      if (isMobile()) {
        // into menu panel
        if (langBtn.parentElement !== extraHost) {
          extraHost.appendChild(langBtn);
          langBtn.setAttribute('aria-label', 'Toggle language (menu)');
          // ensure it's visible when inside the panel
          langBtn.style.display = 'block';
        }
      } else {
        // back to header floating position
        if (langBtn.parentNode !== header) {
          header.insertBefore(langBtn, restoreAnchor.nextSibling);
          langBtn.setAttribute('aria-label', 'Toggle language');
          langBtn.style.display = ''; // revert to CSS control
        }
      }
    }

    // initial + debounced resize
    relocate();
    var t;
    window.addEventListener('resize', function(){
      clearTimeout(t);
      t = setTimeout(relocate, 120);
    });
  }

  // -------- Expose init to run after header include finishes --------
  window.spNavInit = function(){
    initInlineNav();
    initPopupMenuResponsive();
    initLangRelocation();
  };
})();
