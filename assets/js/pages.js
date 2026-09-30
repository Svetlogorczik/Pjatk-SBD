/* SBD – widoki stron. Każdy widok zwraca { title, html, after(root) }. */
(function (SBD, w, d) {
  'use strict';

  var V = SBD.view = {};
  var esc = SBD.esc;
  var t = function (key) { return SBD.t(key); };
  var cleanups = [];

  function L() { return SBD.lang; }
  function topic(id) { return SBD.content[L()][id]; }
  function topicTitle(id) { var c = topic(id); return c ? c.title : id; }
  function taskSet(id) { return SBD.taskSets.filter(function (s) { return s.id === id; })[0]; }
  function taskData(id) { return SBD.tasks[L()][id]; }
  function taskTitle(id) { var x = taskData(id); return x ? x.title : id; }
  function num(id) { return SBD.topicMeta[id].no; }
  function lec(id) {
    var m = SBD.topicMeta[id];
    return m.lec + (m.of > 1 ? ' · ' + t('part') + ' ' + m.part + '/' + m.of : '');
  }
  function modTitle(m) { return t('lecture_word') + ' ' + m.n + ' · ' + t('mod_' + m.id); }
  function moduleOf(id) { return SBD.modules.filter(function (m) { return m.id === id; })[0]; }

  V.onCleanup = function (fn) { cleanups.push(fn); };
  V.cleanup = function () {
    while (cleanups.length) {
      try { cleanups.pop()(); } catch (e) { /* ignore */ }
    }
  };

  /* ---------- Sidebar ---------- */
  V.sidebar = function (active) {
    function link(href, label, key, numLabel) {
      var cls = 'sidebar__link' + (key === active ? ' sidebar__link--active' : '');
      return '<li><a class="' + cls + '" href="' + href + '">' +
        (numLabel ? '<span class="sidebar__num">' + esc(numLabel) + '</span>' : '') +
        '<span>' + esc(label) + '</span></a></li>';
    }

    var html = '<div class="sidebar__group"><ul class="sidebar__list">' +
      link('#/', t('navHome'), 'home') +
      link('#/course', t('navCourse'), 'course') +
      link('#/cheatsheets', t('navCheats'), 'cheatsheets') +
      link('#/quiz', t('navQuiz'), 'quiz') +
      '</ul></div>';

    SBD.modules.forEach(function (m) {
      html += '<div class="sidebar__group"><p class="sidebar__title">' + esc(modTitle(m)) + '</p><ul class="sidebar__list">';
      m.topics.forEach(function (id) {
        html += link('#/lecture/' + id, topicTitle(id), 'lecture:' + id, num(id));
      });
      m.tasks.forEach(function (id) {
        html += link('#/tasks/' + id, taskTitle(id), 'task:' + id, '✎');
      });
      m.marks.forEach(function (k) {
        html += '<li><a class="sidebar__link sidebar__link--exam" href="' + k.href + '"><span class="sidebar__num">★</span><span>' + esc(t('mark_' + k.key)) + '</span></a></li>';
      });
      html += '</ul></div>';
    });

    html += '<div class="sidebar__group"><p class="sidebar__title">✎ ' + esc(t('navTasks')) + '</p><ul class="sidebar__list">';
    html += link('#/tasks', t('tasks_title'), 'tasks');
    SBD.taskSets.forEach(function (s) {
      if (!s.lec) html += link('#/tasks/' + s.id, taskTitle(s.id), 'task:' + s.id, s.icon.length <= 2 ? s.icon : '');
    });
    html += '</ul></div>';
    return html;
  };

  /* ---------- Start ---------- */
  V.home = function () {
    var page = SBD.pages[L()].home || {};
    var first = SBD.topicOrder[0];
    var mods = SBD.modules.map(function (m) {
      return '<a class="card" href="#/lecture/' + m.topics[0] + '">' +
        '<span class="card__icon">' + esc(m.icon) + '</span>' +
        '<span class="card__title">' + esc(modTitle(m)) + '</span>' +
        '<span class="card__text">' + esc(m.topics.map(topicTitle).join(' · ')) + '</span>' +
        '<span class="card__meta"><span class="badge">' + m.topics.length + ' ' + esc(t('topics')) + '</span></span>' +
      '</a>';
    }).join('');

    var quick = [
      ['#/course', '✓', t('navCourse'), t('home_course')],
      ['#/tasks', '✎', t('navTasks'), t('tasks_title')],
      ['#/cheatsheets', '≡', t('navCheats'), t('cheats_title')],
      ['#/quiz', '?', t('navQuiz'), t('quiz_title')]
    ].map(function (q) {
      return '<a class="card" href="' + q[0] + '"><span class="card__icon">' + q[1] + '</span>' +
        '<span class="card__title">' + esc(q[2]) + '</span><span class="card__text">' + esc(q[3]) + '</span></a>';
    }).join('');

    var html = '<div class="main__inner main__inner--wide">' +
      '<section class="hero">' +
        '<p class="hero__kicker">' + esc(t('home_kicker')) + '</p>' +
        '<h1 class="hero__title">' + esc(t('home_title')) + '</h1>' +
        '<p class="hero__text">' + esc(t('home_text')) + '</p>' +
        '<div class="hero__actions">' +
          '<a class="btn btn--primary" href="#/lecture/' + first + '">' + esc(t('home_start')) + ' →</a>' +
          '<a class="btn btn--ghost" href="#/course">' + esc(t('home_course')) + '</a>' +
        '</div>' +
      '</section>' +
      (page.news ? '<section class="main__section prose">' + page.news + '</section>' : '') +
      '<section class="main__section"><h2 class="main__section-title">' + esc(t('home_modules')) + '</h2><div class="cards">' + mods + '</div></section>' +
      '<section class="main__section"><h2 class="main__section-title">' + esc(t('home_quick')) + '</h2><div class="cards">' + quick + '</div></section>' +
      '<section class="main__section prose"><h2 class="main__section-title">' + esc(t('home_how')) + '</h2><ol class="steps">' +
        '<li>' + esc(t('home_how1')) + '</li><li>' + esc(t('home_how2')) + '</li><li>' + esc(t('home_how3')) + '</li><li>' + esc(t('home_how4')) + '</li>' +
      '</ol></section>' +
      (page.legend ? '<section class="main__section prose"><h2 class="main__section-title">' + esc(t('home_legend')) + '</h2>' + page.legend + '</section>' : '') +
      '<p class="main__section"><span class="status status--confirmed">' + esc(t('home_status')) + '</span></p>' +
    '</div>';

    return {
      title: t('siteTitle'),
      html: html,
      after: function (root) { SBD.render.enhance(root, L()); }
    };
  };

  /* ---------- Lista wykładów ---------- */
  V.lectures = function () {
    var html = '<div class="main__inner main__inner--wide">' +
      '<h1 class="main__title">' + esc(t('lectures_title')) + '</h1>' +
      '<p class="main__lead">' + esc(t('lectures_lead')) + '</p>';
    SBD.modules.forEach(function (m) {
      html += '<section class="main__section"><h2 class="main__section-title">' + esc(modTitle(m)) + '</h2><div class="cards">';
      m.topics.forEach(function (id) {
        var c = topic(id) || {};
        html += '<a class="card" href="#/lecture/' + id + '">' +
          '<span class="card__icon">' + num(id) + '</span>' +
          '<span class="card__title">' + esc(c.title || id) + '</span>' +
          '<span class="card__meta">' + esc(t('lecture_word') + ' ' + lec(id)) + '</span>' +
          (c.lead ? '<span class="card__text">' + esc(c.lead) + '</span>' : '') +
          '<span class="card__meta">' + SBD.render.badges(SBD.topicMeta[id].dialects) + '</span>' +
        '</a>';
      });
      m.tasks.forEach(function (id) {
        var s = taskSet(id);
        var x = taskData(id) || {};
        html += '<a class="card" href="#/tasks/' + id + '">' +
          '<span class="card__icon">✎</span>' +
          '<span class="card__title">' + esc(x.title || id) + '</span>' +
          '<span class="card__meta">' + esc(t('afterLecture') + ' ' + m.n) + '</span>' +
          (x.lead ? '<span class="card__text">' + esc(x.lead) + '</span>' : '') +
          '<span class="card__meta">' + SBD.render.badges(s.dialects) + '</span>' +
        '</a>';
      });
      m.marks.forEach(function (k) {
        html += '<a class="card card--exam" href="' + k.href + '">' +
          '<span class="card__icon">★</span>' +
          '<span class="card__title">' + esc(t('mark_' + k.key)) + '</span>' +
          '<span class="card__text">' + esc(t('mark_' + k.key + '_info')) + '</span>' +
        '</a>';
      });
      html += '</div></section>';
    });
    html += '</div>';
    return { title: t('lectures_title'), html: html };
  };

  /* ---------- Wykład ---------- */
  V.lecture = function (id) {
    var meta = SBD.topicMeta[id];
    if (!meta) return V.notFound();
    var c = topic(id);
    if (!c) return V.notFound(t('missing'));

    var i = SBD.topicOrder.indexOf(id);
    var prev = SBD.topicOrder[i - 1];
    var next = SBD.topicOrder[i + 1];

    var related = (meta.tasks || []).map(function (tid) {
      return '<a class="btn btn--ghost btn--small" href="#/tasks/' + tid + '">' + esc(taskTitle(tid)) + '</a>';
    }).join('');

    var html = '<div class="lesson">' +
      '<article class="lesson__main">' +
        '<header class="lesson__header">' +
          '<p class="lesson__kicker">' + esc(modTitle(moduleOf(meta.module))) + (meta.of > 1 ? ' · ' + esc(t('part') + ' ' + meta.part + '/' + meta.of) : '') + '</p>' +
          '<h1 class="lesson__title">' + esc(c.title) + '</h1>' +
          (c.lead ? '<p class="lesson__lead">' + esc(c.lead) + '</p>' : '') +
          '<div class="lesson__meta">' + SBD.render.badges(meta.dialects) +
            '<span>' + esc(t('source')) + ': ' + esc(meta.src.join(' · ')) + '</span></div>' +
          '<div class="lesson__actions">' +
            (c.cheat ? '<button class="btn btn--primary" type="button" data-action="cheat" data-topic="' + id + '">≡ ' + esc(t('cheat')) + '</button>' : '') +
            (meta.tasks && meta.tasks[0] ? '<a class="btn btn--ghost" href="#/tasks/' + meta.tasks[0] + '">✎ ' + esc(t('openTasks')) + '</a>' : '') +
          '</div>' +
        '</header>' +
        '<details class="lesson__toc-mobile toc toc--collapsible"><summary class="toc__title">' + esc(t('toc')) + '</summary><ol class="toc__list" data-slot="toc-mobile"></ol></details>' +
        '<div class="lesson__body prose" data-slot="lesson-body">' + c.body + '</div>' +
        (related ? '<section class="lesson__related"><h2 class="lesson__related-title">' + esc(t('relatedTasks')) + '</h2><div class="lesson__related-list">' + related + '</div></section>' : '') +
        '<nav class="pager">' +
          (prev ? '<a class="pager__link pager__link--prev" href="#/lecture/' + prev + '"><span class="pager__dir">← ' + esc(t('prev')) + '</span><span class="pager__title">' + esc(topicTitle(prev)) + '</span></a>' : '') +
          (next ? '<a class="pager__link pager__link--next" href="#/lecture/' + next + '"><span class="pager__dir">' + esc(t('next')) + ' →</span><span class="pager__title">' + esc(topicTitle(next)) + '</span></a>' : '') +
        '</nav>' +
      '</article>' +
      '<aside class="lesson__aside"><nav class="toc"><p class="toc__title">' + esc(t('toc')) + '</p><ol class="toc__list" data-slot="toc"></ol></nav></aside>' +
    '</div>';

    return {
      title: c.title,
      html: html,
      after: function (root) {
        var body = root.querySelector('[data-slot="lesson-body"]');
        var heads = SBD.render.enhance(body, L());
        var items = heads.map(function (h) {
          return '<li class="toc__item"><a class="toc__link" href="#/lecture/' + id + '" data-scroll="' + h.id + '">' + esc(h.text) + '</a></li>';
        }).join('');
        root.querySelectorAll('[data-slot="toc"], [data-slot="toc-mobile"]').forEach(function (el) { el.innerHTML = items; });
        spy(root, body);
      }
    };
  };

  /* Podświetlanie bieżącej sekcji w spisie treści. */
  function spy(root, body) {
    if (!('IntersectionObserver' in w)) return;
    var links = root.querySelectorAll('.lesson__aside .toc__link');
    if (!links.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('toc__link--active', a.getAttribute('data-scroll') === e.target.id);
        });
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    body.querySelectorAll('h2').forEach(function (h) { obs.observe(h); });
    V.onCleanup(function () { obs.disconnect(); });
  }

  /* ---------- Ściąga w panelu ---------- */
  V.openCheat = function (id) {
    var c = topic(id);
    if (!c || !c.cheat) return;
    var drawer = d.querySelector('[data-slot="drawer"]');
    drawer.querySelector('.drawer__title').textContent = t('cheatFor') + ': ' + c.title;
    var body = drawer.querySelector('[data-slot="drawer-body"]');
    body.innerHTML = c.cheat;
    SBD.render.enhance(body, L());
    drawer.hidden = false;
    d.body.classList.add('page--locked');
    body.scrollTop = 0;
    drawer.querySelector('[data-action="drawer-close"].icon-btn').focus();
  };

  V.closeCheat = function () {
    var drawer = d.querySelector('[data-slot="drawer"]');
    if (drawer.hidden) return;
    drawer.hidden = true;
    d.body.classList.remove('page--locked');
  };

  /* ---------- Wszystkie ściągi ---------- */
  V.cheatsheets = function () {
    var html = '<div class="main__inner">' +
      '<h1 class="main__title">' + esc(t('cheats_title')) + '</h1>' +
      '<p class="main__lead">' + esc(t('cheats_lead')) + '</p>' +
      '<p><button class="btn btn--ghost btn--small" type="button" data-action="print-page">⎙ ' + esc(t('cheats_print')) + '</button></p>' +
      '<div class="prose" data-slot="cheats">';
    SBD.modules.forEach(function (m) {
      html += '<h2>' + esc(modTitle(m)) + '</h2>';
      m.topics.forEach(function (id) {
        var c = topic(id);
        if (!c || !c.cheat) return;
        html += '<h3>' + esc(num(id)) + ' — <a href="#/lecture/' + id + '">' + esc(c.title) + '</a></h3>' + c.cheat;
      });
    });
    html += '</div></div>';
    return {
      title: t('cheats_title'),
      html: html,
      after: function (root) { SBD.render.enhance(root.querySelector('[data-slot="cheats"]'), L()); }
    };
  };

  /* ---------- Lista zadań ---------- */
  V.tasks = function () {
    var html = '<div class="main__inner main__inner--wide">' +
      '<h1 class="main__title">' + esc(t('tasks_title')) + '</h1>' +
      '<p class="main__lead">' + esc(t('tasks_lead')) + '</p>' +
      ((SBD.pages[L()].tasksIntro) ? '<div class="prose main__section" data-slot="tasks-intro">' + SBD.pages[L()].tasksIntro + '</div>' : '') +
      '<div class="cards main__section">';
    SBD.taskSets.forEach(function (s) {
      var x = taskData(s.id) || {};
      var count = (x.items || []).filter(function (it) { return !it.h; }).length;
      html += '<a class="card" href="#/tasks/' + s.id + '">' +
        '<span class="card__icon">' + esc(s.icon) + '</span>' +
        '<span class="card__title">' + esc(x.title || s.id) + '</span>' +
        '<span class="card__meta">' + esc(s.lec ? t('afterLecture') + ' ' + s.lec : t('tasks_other')) + '</span>' +
        (x.lead ? '<span class="card__text">' + esc(x.lead) + '</span>' : '') +
        '<span class="card__meta">' + SBD.render.badges(s.dialects) +
          (s.own ? '<span class="badge badge--own">' + esc(t('dialect_own')) + '</span>' : '') +
          (count ? '<span class="badge">' + count + ' ' + esc(t('tasksCount')) + '</span>' : '') +
        '</span></a>';
    });
    html += '</div></div>';
    return {
      title: t('tasks_title'),
      html: html,
      after: function (root) { SBD.render.enhance(root.querySelector('[data-slot="tasks-intro"]'), L()); }
    };
  };

  /* ---------- Zestaw zadań ---------- */
  V.task = function (id) {
    var s = taskSet(id);
    if (!s) return V.notFound();
    var x = taskData(id);
    if (!x) return V.notFound(t('missing'));

    var lectures = (s.topics || []).map(function (tid) {
      return '<a class="btn btn--ghost btn--small" href="#/lecture/' + tid + '">' + esc(num(tid)) + ' · ' + esc(topicTitle(tid)) + '</a>';
    }).join('');

    var body = x.intro || '';
    var open = false;
    var counter = 0;
    (x.items || []).forEach(function (it) {
      if (it.h) {
        if (open) body += '</ol>';
        open = false;
        body += '<h2>' + it.h + '</h2>' + (it.text || '');
        return;
      }
      if (!open) {
        body += '<ol class="task" style="counter-reset: task ' + counter + '">';
        open = true;
      }
      counter += 1;
      body += '<li class="task__item"><div class="task__body">' + it.q +
        (it.hint ? '<details data-reveal="hint">' + it.hint + '</details>' : '') +
        (it.sol ? '<details data-reveal="solution">' + it.sol + '</details>' : '') +
        '</div></li>';
    });
    if (open) body += '</ol>';
    body += x.outro || '';

    var idx = SBD.taskSets.indexOf(s);
    var prev = SBD.taskSets[idx - 1];
    var next = SBD.taskSets[idx + 1];

    var html = '<div class="main__inner">' +
      '<header class="lesson__header">' +
        '<p class="lesson__kicker">' + esc(s.lec ? t('afterLecture') + ' ' + s.lec : t('navTasks') + ' · ' + s.icon) + '</p>' +
        '<h1 class="lesson__title">' + esc(x.title) + '</h1>' +
        (x.lead ? '<p class="lesson__lead">' + esc(x.lead) + '</p>' : '') +
        '<div class="lesson__meta">' + SBD.render.badges(s.dialects) +
          (s.own ? '<span class="badge badge--own">' + esc(t('dialect_own')) + '</span>' : '') + '</div>' +
        (lectures ? '<div class="lesson__actions">' + lectures + '</div>' : '') +
      '</header>' +
      '<div class="prose" data-slot="task-body">' + body + '</div>' +
      '<nav class="pager">' +
        (prev ? '<a class="pager__link pager__link--prev" href="#/tasks/' + prev.id + '"><span class="pager__dir">←</span><span class="pager__title">' + esc(taskTitle(prev.id)) + '</span></a>' : '') +
        (next ? '<a class="pager__link pager__link--next" href="#/tasks/' + next.id + '"><span class="pager__dir">→</span><span class="pager__title">' + esc(taskTitle(next.id)) + '</span></a>' : '') +
      '</nav>' +
    '</div>';

    return {
      title: x.title,
      html: html,
      after: function (root) { SBD.render.enhance(root.querySelector('[data-slot="task-body"]'), L()); }
    };
  };

  /* ---------- Zaliczenie (strona z EDUX + nagrania) ---------- */
  V.course = function () {
    var p = SBD.pages[L()].course;
    if (!p) return V.notFound(t('missing'));
    var html = '<div class="main__inner">' +
      '<h1 class="main__title">' + esc(p.title) + '</h1>' +
      (p.lead ? '<p class="main__lead">' + esc(p.lead) + '</p>' : '') +
      '<div class="prose" data-slot="course-body">' + p.body + '</div></div>';
    return {
      title: p.title,
      html: html,
      after: function (root) {
        var body = root.querySelector('[data-slot="course-body"]');
        SBD.render.enhance(body, L());
        var slot = body.querySelector('[data-widget="calc"]');
        if (slot) SBD.calc.mount(slot);
      }
    };
  };

  /* ---------- Test ---------- */
  V.quiz = function () {
    var html = '<div class="main__inner">' +
      '<h1 class="main__title">' + esc(t('quiz_title')) + '</h1>' +
      '<p class="main__lead">' + esc(t('quiz_lead')) + '</p>' +
      '<div data-slot="quiz"></div></div>';
    return {
      title: t('quiz_title'),
      html: html,
      after: function (root) { SBD.quizApp.menu(root.querySelector('[data-slot="quiz"]')); }
    };
  };

  V.notFound = function (text) {
    return {
      title: t('notFound'),
      html: '<div class="main__inner"><h1 class="main__title">' + esc(t('notFound')) + '</h1>' +
        '<p class="main__lead">' + esc(text || t('notFoundText')) + '</p>' +
        '<a class="btn btn--primary" href="#/">' + esc(t('backHome')) + '</a></div>'
    };
  };

  /* ---------- Kalkulator oceny (dodatek autora) ---------- */
  var CW = [['2.0', 0], ['3.0', 15], ['3.5', 19], ['4.0', 23], ['4.5', 27], ['5.0', 30]];

  SBD.calc = {
    grade: function (cw, exam) {
      var cwPts = 0;
      CW.forEach(function (row) { if (row[0] === cw) cwPts = row[1]; });
      var total = cwPts + exam;
      var fin;
      if (cw === '2.0' || exam < 10) fin = '2.0';
      else if (total < 25) fin = '2.0';
      else if (total < 30) fin = '3.0';
      else if (total < 35) fin = '3.5';
      else if (total < 40) fin = '4.0';
      else if (total < 45) fin = '4.5';
      else fin = '5.0';
      return { cwPts: cwPts, total: total, final: fin };
    },
    mount: function (slot) {
      var saved = SBD.store.get('calc') || '4.0|14';
      var parts = saved.split('|');
      slot.innerHTML = '<div class="calc">' +
        '<p class="note__label">' + esc(t('calc_title')) + '</p>' +
        '<div class="calc__row">' +
          '<label class="calc__field">' + esc(t('calc_cw')) +
            '<select class="calc__input" data-calc="cw">' + CW.map(function (r) {
              return '<option value="' + r[0] + '"' + (r[0] === parts[0] ? ' selected' : '') + '>' + r[0] + (r[1] ? ' → ' + r[1] + ' ' + esc(t('quiz_points')) : '') + '</option>';
            }).join('') + '</select></label>' +
          '<label class="calc__field">' + esc(t('calc_exam')) + ': <output data-calc="examOut"></output>' +
            '<input class="calc__range" type="range" min="0" max="20" step="1" value="' + (parseInt(parts[1], 10) || 0) + '" data-calc="exam"></label>' +
        '</div>' +
        '<div class="calc__out"><span class="calc__grade" data-calc="final"></span><span class="calc__detail" data-calc="detail"></span></div>' +
        '<p class="calc__detail">' + esc(t('calc_own')) + '</p>' +
      '</div>';

      var cwEl = slot.querySelector('[data-calc="cw"]');
      var exEl = slot.querySelector('[data-calc="exam"]');
      function update() {
        var ex = parseInt(exEl.value, 10);
        var r = SBD.calc.grade(cwEl.value, ex);
        slot.querySelector('[data-calc="examOut"]').textContent = ex;
        slot.querySelector('[data-calc="final"]').textContent = r.final;
        var msg = t('calc_cwPts') + ': ' + r.cwPts + ' · ' + t('calc_total') + ': ' + r.total + ' / 50';
        if (cwEl.value === '2.0') msg += ' — ' + t('calc_noCw');
        else if (ex < 10) msg += ' — ' + t('calc_noExam');
        slot.querySelector('[data-calc="detail"]').textContent = msg;
        SBD.store.set('calc', cwEl.value + '|' + ex);
      }
      cwEl.addEventListener('change', update);
      exEl.addEventListener('input', update);
      update();
    }
  };
})(window.SBD, window, document);
