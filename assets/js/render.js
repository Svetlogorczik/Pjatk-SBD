/* SBD – zamiana prostych znaczników z treści na komponenty BEM:
   [data-code]      → blok kodu z kolorowaniem i przyciskiem „Kopiuj”
   [data-note]      → ramka (own | tip | warn | exam | lecture | info | analogy)
   details[data-reveal] → rozwijana podpowiedź / rozwiązanie
   table            → tabela z przewijaniem na telefonie
   h2               → kotwice do spisu treści */
(function (SBD, d) {
  'use strict';

  var R = SBD.render = {};

  /* Warianty językowe w kodzie: @{polski|english|русский} */
  R.variant = function (text, lang) {
    var idx = Math.max(0, SBD.LANGS.indexOf(lang));
    return String(text).replace(/@\{([^{}]*)\}/g, function (match, inner) {
      var parts = inner.split('|');
      return parts.length === SBD.LANGS.length ? parts[idx] : match;
    });
  };

  R.codeBlock = function (snippet, lang, titleOverride) {
    var dialect = snippet.lang || 'sql';
    var code = R.variant(snippet.code, lang).replace(/^\s*\n/, '').replace(/\s+$/, '');
    var title = titleOverride || (snippet.title ? R.variant(SBD.pick(snippet.title, lang), lang) : '');
    return '<figure class="code">' +
      '<figcaption class="code__header">' +
        '<span class="code__lang code__lang--' + dialect + '">' + SBD.esc(SBD.t('code_' + dialect)) + '</span>' +
        (title ? '<span class="code__title">' + SBD.esc(title) + '</span>' : '') +
        '<button class="code__copy" type="button" data-action="copy">' + SBD.esc(SBD.t('copy')) + '</button>' +
      '</figcaption>' +
      '<pre class="code__pre"><code class="code__body">' + SBD.highlight(code, dialect) + '</code></pre>' +
    '</figure>';
  };

  function replaceWithHTML(el, html) {
    var tpl = d.createElement('template');
    tpl.innerHTML = html;
    el.replaceWith(tpl.content);
  }

  function slug(text, i) {
    var s = String(text).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/ł/g, 'l')
      .replace(/[^a-z0-9а-яё]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
    return 's' + (i + 1) + (s ? '-' + s : '');
  }

  R.enhance = function (root, lang) {
    if (!root) return;

    root.querySelectorAll('[data-code]').forEach(function (el) {
      var id = el.getAttribute('data-code');
      var sn = SBD.snippets[id];
      if (!sn) {
        replaceWithHTML(el, '<p class="note note--warn">Missing code: ' + SBD.esc(id) + '</p>');
        return;
      }
      replaceWithHTML(el, R.codeBlock(sn, lang, el.getAttribute('data-title')));
    });

    /* Krótki kod lub schemat wpisany wprost w treść: <pre data-lang="text">…</pre> */
    root.querySelectorAll('pre[data-lang]').forEach(function (el) {
      var sn = { lang: el.getAttribute('data-lang'), code: el.textContent };
      replaceWithHTML(el, R.codeBlock(sn, lang, el.getAttribute('data-title')));
    });

    root.querySelectorAll('[data-note]').forEach(function (el) {
      var type = el.getAttribute('data-note') || 'info';
      var label = el.getAttribute('data-label') || SBD.t('note_' + type);
      var aside = d.createElement('aside');
      aside.className = 'note note--' + (type === 'analogy' ? 'tip' : type);
      var lab = d.createElement('p');
      lab.className = 'note__label';
      lab.textContent = label;
      var body = d.createElement('div');
      body.className = 'note__body';
      while (el.firstChild) body.appendChild(el.firstChild);
      aside.appendChild(lab);
      aside.appendChild(body);
      el.replaceWith(aside);
    });

    root.querySelectorAll('details[data-reveal]').forEach(function (el) {
      var type = el.getAttribute('data-reveal') || 'more';
      var label = el.getAttribute('data-label') || SBD.t('reveal_' + type);
      el.classList.add('reveal', 'reveal--' + type);
      var body = d.createElement('div');
      body.className = 'reveal__body';
      while (el.firstChild) body.appendChild(el.firstChild);
      var summary = d.createElement('summary');
      summary.className = 'reveal__summary';
      summary.textContent = label;
      el.appendChild(summary);
      el.appendChild(body);
    });

    root.querySelectorAll('table').forEach(function (t) {
      if (t.closest('.code')) return;
      t.classList.add('table');
      if (!t.parentElement.classList.contains('table-wrap')) {
        var wrap = d.createElement('div');
        wrap.className = 'table-wrap';
        t.parentNode.insertBefore(wrap, t);
        wrap.appendChild(t);
      }
      t.querySelectorAll('td').forEach(function (td) {
        if (td.textContent === 'NULL') td.classList.add('table__null');
      });
    });

    root.querySelectorAll('a[href^="http"]').forEach(function (a) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });

    var headings = [];
    root.querySelectorAll('h2').forEach(function (h, i) {
      if (!h.id) h.id = slug(h.textContent, i);
      headings.push({ id: h.id, text: h.textContent });
    });
    return headings;
  };

  /* Kopiowanie: Clipboard API, a gdy niedostępne (np. file://) – stary sposób przez textarea. */
  R.copy = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  };

  function fallbackCopy(text) {
    var ta = d.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    d.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = d.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  R.badges = function (dialects) {
    return (dialects || []).map(function (dl) {
      return '<span class="badge badge--' + dl + '">' + SBD.esc(SBD.t('dialect_' + dl)) + '</span>';
    }).join('');
  };
})(window.SBD, document);
