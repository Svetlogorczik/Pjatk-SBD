/* SBD – rdzeń: przestrzeń nazw, rejestry treści, pamięć ustawień, ładowanie skryptów. */
(function (w, d) {
  'use strict';

  var SBD = w.SBD = w.SBD || {};

  SBD.VERSION = '1.0.0';
  SBD.LANGS = ['pl', 'en', 'ru'];
  /* Pliki treści ładowane dla każdego języka: content/<lang>/<plik>.js */
  SBD.LANG_FILES = ['pages', 'repetition', 'sql', 'tsql', 'plsql', 'admin', 'other', 'tasks'];

  SBD.content = {};   /* wykłady:   SBD.content[lang][topicId] = { title, lead, body, cheat } */
  SBD.tasks = {};     /* zadania:   SBD.tasks[lang][taskId]    = { title, lead, intro, items[] } */
  SBD.pages = {};     /* strony:    SBD.pages[lang][pageId]    = { title, lead, body } */
  SBD.LANGS.forEach(function (l) {
    SBD.content[l] = {};
    SBD.tasks[l] = {};
    SBD.pages[l] = {};
  });
  SBD.snippets = {};  /* kod wspólny dla wszystkich języków: SBD.snippets[id] = { lang, title, code } */

  SBD.addContent = function (lang, map) { Object.assign(SBD.content[lang], map); };
  SBD.addTasks = function (lang, map) { Object.assign(SBD.tasks[lang], map); };
  SBD.addPages = function (lang, map) { Object.assign(SBD.pages[lang], map); };
  SBD.addCode = function (map) { Object.assign(SBD.snippets, map); };

  /* localStorage bywa niedostępny (tryb prywatny, blokada) – zawsze w try/catch. */
  SBD.store = {
    get: function (key) {
      try { return w.localStorage.getItem('sbd-' + key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { w.localStorage.setItem('sbd-' + key, value); } catch (e) { /* brak pamięci – ignorujemy */ }
    }
  };

  var loaded = {};
  SBD.loadScript = function (src) {
    if (!loaded[src]) {
      loaded[src] = new Promise(function (resolve) {
        var s = d.createElement('script');
        s.src = src + '?v=' + SBD.VERSION;
        s.async = false;
        s.onload = function () { resolve(true); };
        s.onerror = function () { resolve(false); };
        d.head.appendChild(s);
      });
    }
    return loaded[src];
  };

  SBD.loadLang = function (lang) {
    return Promise.all(SBD.LANG_FILES.map(function (file) {
      return SBD.loadScript('content/' + lang + '/' + file + '.js');
    }));
  };

  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  SBD.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; });
  };

  /* Wybór wariantu językowego z obiektu {pl, en, ru} albo zwykłego tekstu. */
  SBD.pick = function (value, lang) {
    if (value && typeof value === 'object') {
      return value[lang] || value.pl || value.en || '';
    }
    return value == null ? '' : String(value);
  };
})(window, document);
