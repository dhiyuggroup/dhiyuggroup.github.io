// Desktop inline nav + Mobile floating popup menu (responsive + a11y)
(function () {
  // Optional: keep inline toggle for mid-size tablets if you ever show it
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

  // Mobile popup gated by media query
  function initPopupMenuResponsive(){
    var fab   = document.getElementById('spMenuFab');
    var menu  = document.getElementById('spMenu');
    var close = document.getElementById('spMenuClose');
    var panel = menu ? menu.querySelector('.sp-menu__panel') : null;

    if (!fab || !menu || !panel || !close) return;

    var mq = window.matchMedia('(max-width: 786px)');
    var open = false;
    var prevFocus = null;

    // Handlers we add/remove
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

    function enable(){
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

    // Listen for viewport changes + apply once on load
    mq.addEventListener('change', apply);
    apply(mq);
  }

  // Expose init to run after header include finishes
  window.spNavInit = function(){
    initInlineNav();
    initPopupMenuResponsive();
  };
})();
