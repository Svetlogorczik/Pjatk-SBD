/* SBD – aplikacja: routing (#/...), język, motyw, menu mobilne, panel ściągi, kopiowanie kodu. */
(function (SBD, w, d) {
  'use strict';

  var main = d.querySelector('[data-slot="main"]');
  var sidebarNav = d.querySelector('[data-slot="sidebar"]');
  var sidebar = d.getElementById('sidebar');
  var backdrop = d.querySelector('.sidebar__backdrop');
  var menuBtn = d.querySelector('[data-action="menu"]');

  /* ---------- Język ---------- */
  function detectLang() {
    var saved = SBD.store.get('lang');
    if (SBD.LANGS.indexOf(saved) !== -1) return saved;
    var list = (navigator.languages || [navigator.language || 'pl']).map(function (l) { return String(l).slice(0, 2).toLowerCase(); });
    for (var i = 0; i < list.length; i += 1) {
      if (SBD.LANGS.indexOf(list[i]) !== -1) return list[i];
      if (list[i] === 'uk' || list[i] === 'be') return 'ru';
    }
    return 'pl';
  }

  function applyStaticI18n() {
    d.documentElement.lang = SBD.lang;
    d.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = SBD.t(el.getAttribute('data-i18n')); });
    d.querySelectorAll('[data-i18n-html]').forEach(function (el) { el.innerHTML = SBD.t(el.getAttribute('data-i18n-html')); });
    d.querySelectorAll('[data-i18n-title]').forEach(function (el) { el.title = SBD.t(el.getAttribute('data-i18n-title')); });
    d.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', SBD.t(el.getAttribute('data-i18n-aria'))); });
    d.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === SBD.lang;
      b.classList.toggle('switcher__btn--active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function setLang(lang) {
    SBD.lang = lang;
    SBD.store.set('lang', lang);
    applyStaticI18n();
    main.innerHTML = '<p class="main__loading">' + SBD.esc(SBD.t('loading')) + '</p>';
    return SBD.loadLang(lang).then(route);
  }

  /* ---------- Motyw ---------- */
  function toggleTheme() {
    var next = d.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    d.documentElement.setAttribute('data-theme', next);
    SBD.store.set('theme', next);
  }

  /* ---------- Menu mobilne ---------- */
  function setMenu(open) {
    sidebar.classList.toggle('sidebar--open', open);
    backdrop.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  /* ---------- Routing ---------- */
  function parse() {
    var parts = (w.location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    return { name: parts[0] || 'home', id: parts[1] || null };
  }

  function route() {
    var r = parse();
    var view;
    var active;
    SBD.view.cleanup();
    SBD.view.closeCheat();

    switch (r.name) {
      case 'home': view = SBD.view.home(); active = 'home'; break;
      case 'lectures': view = SBD.view.lectures(); active = 'lectures'; break;
      case 'lecture': view = SBD.view.lecture(r.id); active = 'lecture:' + r.id; break;
      case 'tasks':
        view = r.id ? SBD.view.task(r.id) : SBD.view.tasks();
        active = r.id ? 'task:' + r.id : 'tasks';
        break;
      case 'cheatsheets': view = SBD.view.cheatsheets(); active = 'cheatsheets'; break;
      case 'quiz': view = SBD.view.quiz(); active = 'quiz'; break;
      case 'course': view = SBD.view.course(); active = 'course'; break;
      default: view = SBD.view.notFound(); active = '';
    }

    main.innerHTML = view.html;
    if (view.after) view.after(main);
    d.title = (view.title ? view.title + ' · ' : '') + 'SBD';

    sidebarNav.innerHTML = SBD.view.sidebar(active);
    var act = sidebarNav.querySelector('.sidebar__link--active');
    if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest' });

    var top = r.name === 'lecture' ? 'lectures' : r.name;
    d.querySelectorAll('.header__link').forEach(function (a) {
      a.classList.toggle('header__link--active', a.getAttribute('data-route') === top);
    });

    setMenu(false);
    w.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  /* ---------- Delegacja zdarzeń ---------- */
  d.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action], [data-lang], [data-scroll]');
    if (!el) return;

    if (el.hasAttribute('data-lang')) {
      var lang = el.getAttribute('data-lang');
      if (lang !== SBD.lang) setLang(lang);
      return;
    }

    if (el.hasAttribute('data-scroll')) {
      e.preventDefault();
      var target = d.getElementById(el.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    switch (el.getAttribute('data-action')) {
      case 'theme': toggleTheme(); break;
      case 'menu': setMenu(!sidebar.classList.contains('sidebar--open')); break;
      case 'menu-close': setMenu(false); break;
      case 'cheat': SBD.view.openCheat(el.getAttribute('data-topic')); break;
      case 'drawer-close': SBD.view.closeCheat(); break;
      case 'print':
        d.body.classList.add('page--print-drawer');
        w.print();
        d.body.classList.remove('page--print-drawer');
        break;
      case 'print-page': w.print(); break;
      case 'copy': {
        var block = el.closest('.code');
        var text = block ? block.querySelector('.code__body').textContent : '';
        SBD.render.copy(text).then(function (ok) {
          el.textContent = ok ? SBD.t('copied') : SBD.t('copyFail');
          el.classList.toggle('code__copy--done', ok);
          setTimeout(function () {
            el.textContent = SBD.t('copy');
            el.classList.remove('code__copy--done');
          }, 1800);
        });
        break;
      }
      default: break;
    }
  });

  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      SBD.view.closeCheat();
      setMenu(false);
    }
  });

  w.addEventListener('hashchange', route);

  setLang(detectLang());
})(window.SBD, window, document);
