/* SBD – test próbny w formacie egzaminu EDUX:
   4 odpowiedzi, poprawnych 1–4, punkt tylko za komplet poprawnych i brak błędnych.
   Pytania: content/quiz.js → SBD.quiz = [{ t: topicId, q: {pl,en,ru}, a: [{ok, pl,en,ru}], e: {pl,en,ru} }] */
(function (SBD, d) {
  'use strict';

  var esc = SBD.esc;
  var t = function (key) { return SBD.t(key); };
  var EXAM_SIZE = 20;
  var EXAM_MIN = 30;

  var S = null;   /* stan bieżącego testu */
  var root = null;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function stopTimer() {
    if (S && S.timer) { clearInterval(S.timer); S.timer = null; }
  }

  function build(mode) {
    var all = shuffle(SBD.quiz || []);
    var list = mode === 'exam' ? all.slice(0, EXAM_SIZE) : all;
    return {
      mode: mode,
      list: list.map(function (q) {
        return { q: q, order: shuffle(q.a.map(function (_, i) { return i; })), chosen: null, ok: null };
      }),
      i: 0,
      checked: false,
      deadline: mode === 'exam' ? Date.now() + EXAM_MIN * 60000 : 0,
      timer: null
    };
  }

  function isCorrect(item) {
    return item.q.a.every(function (ans, idx) {
      return !!ans.ok === (item.chosen.indexOf(idx) !== -1);
    });
  }

  function readChosen() {
    var chosen = [];
    root.querySelectorAll('input[data-idx]').forEach(function (inp) {
      if (inp.checked) chosen.push(parseInt(inp.getAttribute('data-idx'), 10));
    });
    return chosen;
  }

  function topicName(id) {
    var c = SBD.content[SBD.lang][id];
    return c ? c.title : '';
  }

  function menu(slot) {
    root = slot || root;
    stopTimer();
    S = null;
    root.innerHTML =
      '<div data-note="own"><p>' + esc(t('quiz_own')) + '</p></div>' +
      '<div class="cards main__section">' +
        '<button class="card" type="button" data-quiz="learn"><span class="card__icon">?</span>' +
          '<span class="card__title">' + esc(t('quiz_learn')) + '</span>' +
          '<span class="card__text">' + esc(t('quiz_learnDesc')) + '</span>' +
          '<span class="card__meta"><span class="badge">' + (SBD.quiz || []).length + '</span></span></button>' +
        '<button class="card" type="button" data-quiz="exam"><span class="card__icon">⏱</span>' +
          '<span class="card__title">' + esc(t('quiz_exam')) + '</span>' +
          '<span class="card__text">' + esc(t('quiz_examDesc')) + '</span>' +
          '<span class="card__meta"><span class="badge">20 / 30 min</span></span></button>' +
      '</div>';
    SBD.render.enhance(root, SBD.lang);
    root.querySelectorAll('[data-quiz]').forEach(function (b) {
      b.style.textAlign = 'left';
      b.addEventListener('click', function () { start(b.getAttribute('data-quiz')); });
    });
  }

  function start(mode) {
    S = build(mode);
    if (mode === 'exam') {
      S.timer = setInterval(tick, 1000);
      SBD.view.onCleanup(stopTimer);
    }
    render();
  }

  function tick() {
    var el = root && root.querySelector('[data-quiz-time]');
    var left = Math.max(0, S.deadline - Date.now());
    if (el) {
      var m = Math.floor(left / 60000);
      var s = Math.floor((left % 60000) / 1000);
      el.textContent = t('quiz_time') + ': ' + m + ':' + (s < 10 ? '0' : '') + s;
    }
    if (left <= 0) finish();
  }

  function render() {
    var item = S.list[S.i];
    var q = item.q;
    var L = SBD.lang;
    var total = S.list.length;
    var pct = Math.round((S.i / total) * 100);

    var options = item.order.map(function (idx) {
      var ans = q.a[idx];
      var cls = 'quiz__option';
      if (S.checked) {
        var picked = item.chosen.indexOf(idx) !== -1;
        if (ans.ok && picked) cls += ' quiz__option--correct';
        else if (!ans.ok && picked) cls += ' quiz__option--wrong';
        else if (ans.ok && !picked) cls += ' quiz__option--missed';
      }
      var checked = item.chosen && item.chosen.indexOf(idx) !== -1 ? ' checked' : '';
      return '<li><label class="' + cls + '"><input type="checkbox" data-idx="' + idx + '"' + checked + (S.checked ? ' disabled' : '') + '>' +
        '<span>' + esc(SBD.pick(ans, L)) + '</span></label></li>';
    }).join('');

    var feedback = '';
    if (S.checked) {
      feedback = '<div class="quiz__feedback quiz__feedback--' + (item.ok ? 'ok' : 'bad') + '">' +
        esc(item.ok ? t('quiz_correct') : t('quiz_wrong')) +
        (q.e ? '<p class="quiz__explain">' + esc(SBD.pick(q.e, L)) + '</p>' : '') + '</div>';
    }

    var last = S.i === total - 1;
    var actions;
    if (S.mode === 'learn' && !S.checked) {
      actions = '<button class="btn btn--primary" type="button" data-q="check">' + esc(t('quiz_check')) + '</button>';
    } else {
      actions = '<button class="btn btn--primary" type="button" data-q="next">' + esc(last ? t('quiz_finish') : t('quiz_next')) + ' →</button>';
    }
    actions += '<button class="btn btn--ghost" type="button" data-q="menu">' + esc(t('quiz_menu')) + '</button>';

    root.innerHTML =
      '<div class="quiz">' +
        '<div class="quiz__bar">' +
          '<span class="quiz__counter">' + esc(t('quiz_question')) + ' ' + (S.i + 1) + ' ' + esc(t('quiz_of')) + ' ' + total + '</span>' +
          '<div class="quiz__progress"><div class="quiz__progress-fill" style="width:' + pct + '%"></div></div>' +
          (S.mode === 'exam' ? '<span class="quiz__counter" data-quiz-time></span>' : '') +
        '</div>' +
        '<div class="quiz__card">' +
          (q.t ? '<p class="quiz__topic">' + esc(topicName(q.t)) + '</p>' : '') +
          '<p class="quiz__question">' + esc(SBD.pick(q.q, L)) + '</p>' +
          '<p class="quiz__counter">' + esc(t('quiz_select')) + '</p>' +
          '<ul class="quiz__options">' + options + '</ul>' +
          feedback +
          '<div class="quiz__actions">' + actions + '</div>' +
        '</div>' +
      '</div>';

    if (S.mode === 'exam') tick();
    root.querySelector('[data-q="menu"]').addEventListener('click', function () { menu(); });
    var check = root.querySelector('[data-q="check"]');
    if (check) check.addEventListener('click', function () {
      item.chosen = readChosen();
      item.ok = isCorrect(item);
      S.checked = true;
      render();
    });
    var next = root.querySelector('[data-q="next"]');
    if (next) next.addEventListener('click', function () {
      if (S.mode === 'exam') {
        item.chosen = readChosen();
        item.ok = isCorrect(item);
      }
      if (last) { finish(); return; }
      S.i += 1;
      S.checked = false;
      render();
      root.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }

  function finish() {
    stopTimer();
    var L = SBD.lang;
    S.list.forEach(function (it) {
      if (it.chosen === null) { it.chosen = []; it.ok = false; }
    });
    var score = S.list.filter(function (it) { return it.ok; }).length;
    var total = S.list.length;
    var scaled = S.mode === 'exam' ? score : Math.round((score / total) * 20);
    var passed = scaled >= 10;

    var review = S.list.filter(function (it) { return !it.ok; }).map(function (it) {
      var good = it.q.a.filter(function (a) { return a.ok; }).map(function (a) { return '<li>' + esc(SBD.pick(a, L)) + '</li>'; }).join('');
      return '<li><p><strong>' + esc(SBD.pick(it.q.q, L)) + '</strong></p><ul>' + good + '</ul>' +
        (it.q.e ? '<p>' + esc(SBD.pick(it.q.e, L)) + '</p>' : '') + '</li>';
    }).join('');

    root.innerHTML =
      '<div class="quiz__card quiz__result">' +
        '<p class="quiz__topic">' + esc(t('quiz_result')) + '</p>' +
        '<p class="quiz__score">' + score + ' / ' + total + '</p>' +
        (S.mode === 'learn' ? '<p class="quiz__counter">≈ ' + scaled + ' / 20</p>' : '') +
        '<div class="quiz__feedback quiz__feedback--' + (passed ? 'ok' : 'bad') + '">' + esc(passed ? t('quiz_pass') : t('quiz_fail')) + '</div>' +
        '<div class="quiz__actions" style="justify-content:center">' +
          '<button class="btn btn--primary" type="button" data-q="again">' + esc(t('quiz_restart')) + '</button>' +
          '<button class="btn btn--ghost" type="button" data-q="menu">' + esc(t('quiz_menu')) + '</button>' +
        '</div>' +
      '</div>' +
      '<section class="main__section prose"><h2>' + esc(t('quiz_review')) + '</h2>' +
        (review ? '<ol>' + review + '</ol>' : '<p>' + esc(t('quiz_perfect')) + '</p>') + '</section>';

    var mode = S.mode;
    root.querySelector('[data-q="again"]').addEventListener('click', function () { start(mode); });
    root.querySelector('[data-q="menu"]').addEventListener('click', function () { menu(); });
  }

  SBD.quizApp = { menu: menu };
})(window.SBD, document);
