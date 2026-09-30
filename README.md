# SBD — Systemy baz danych (PL / EN / RU)

Statyczna strona z wykładami, ściągami, zadaniami i quizem do przedmiotu SBD. Bez builda i bez zależności — czysty HTML/CSS/JS.

## Podgląd lokalny

Otwórz `index.html` w przeglądarce (działa też z `file://`) albo uruchom dowolny serwer statyczny:

```bash
npx serve .
```

## GitHub Pages

1. Utwórz repozytorium i wgraj **zawartość** folderu `sbd-site` (plik `index.html` w katalogu głównym).
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Strona pojawi się pod `https://<user>.github.io/<repo>/`. Plik `.nojekyll` jest już dodany.

## Struktura

```
index.html                 szkielet strony
assets/css/base/           tokeny (motyw jasny/ciemny), reset, typografia
assets/css/blocks/         bloki BEM (jeden plik = jeden blok)
assets/js/                 core, i18n, highlight, render, pages, quiz, app
content/topics.js          moduły, wykłady (SBD.lectures – numeracja jak w plikach wykładów), zestawy zadań
content/quiz.js            pytania quizu (3 języki)
content/code/              wspólne fragmenty kodu SQL (komentarze w 3 językach: @{pl|en|ru})
content/<pl|en|ru>/        treść wykładów, stron i zadań w danym języku
```

## Numeracja wykładów

Tematy są ułożone po kolei według wykładów 1–14 (`SBD.modules` w `content/topics.js`): każdy wykład ma części (np. 4.1, 4.2) i ćwiczenia (`tasks`), które odbywają się po nim.

## Dodawanie treści

- Nowy temat: wpis w `SBD.modules`, `SBD.topicMeta` i `SBD.lectures` (`content/topics.js`) + treść `{title, lead, body, cheat}` w `content/<lang>/*.js`.
- Kod: `SBD.addCode({id: {lang, title, code}})` i `<div data-code="id"></div>` w treści.
- Ramki: `<div data-note="own|tip|warn|exam|lecture|info|analogy">`. `own` = materiał spoza wykładów.
