/* PL – strony: start (legenda), zaliczenie, wstęp do zadań */
SBD.addPages('pl', {

home: {
  news: `
<div data-note="info" data-label="Aktualności · 29.09.2026">
  <p>Odbył się pierwszy wykład semestru (powtórka z RBD). Za tydzień — druga powtórka, potem języki proceduralne T-SQL i PL/SQL. Materiały (slajdy + plik o normalizacji) prowadzący zapowiedział w EDUX. <a href="#/course">Wszystkie zasady i terminy →</a></p>
</div>`,
  legend: `
<div data-note="lecture"><p>Coś, co padło na wykładzie albo jest w slajdach prowadzącego (np. uwaga, przykład z nagrania).</p></div>
<div data-note="exam"><p>Rzecz, o którą łatwo zapytać na egzaminie lub która jest potrzebna na ćwiczeniach.</p></div>
<div data-note="warn"><p>Typowy błąd — lepiej go zapamiętać, zanim go popełnisz.</p></div>
<div data-note="tip"><p>Praktyczna wskazówka lub proste wyjaśnienie „na przykładzie”.</p></div>
<div data-note="own"><p>Materiał dopisany przez autora strony — <strong>nie ma go w wykładach</strong> (rekomendacje, dodatkowe przykłady, test, kalkulator).</p></div>`
},

course: {
  title: 'Zaliczenie przedmiotu, egzamin i terminy',
  lead: 'Wszystko, co wiadomo o zasadach zaliczenia Systemów Baz Danych w semestrze zimowym 2026/27 — z opisem, skąd pochodzi każda informacja.',
  body: `
<p><span class="status status--confirmed">EDUX — potwierdzone</span> <span class="status status--lecture">z nagrania wykładu 29.09.2026</span> <span class="status status--estimated">przewidywane</span> <span class="status status--unknown">brak danych</span></p>
<p>Przy każdej informacji jest etykieta, żebyś wiedział(a), na ile jest pewna. Stan na <strong>29.09.2026</strong>.</p>

<h2>Podstawowe informacje</h2>
<table>
  <tbody>
    <tr><th>Przedmiot</th><td>Systemy baz danych (SBD) — wykład, studia dzienne, grupa 1w</td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Semestr</th><td>zimowy 2026/2027</td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Forma wykładu</th><td><strong>zdalnie, przez aplikację MS Teams</strong></td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Kurs w EDUX</th><td>Paweł Lenkiewicz (pawell@pjwstk.edu.pl)</td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Wykłady</th><td>powtórka + T-SQL + PL/SQL (prowadzący pierwszego wykładu); administrowanie bazami — 5 wykładów (Paweł Lenkiewicz, na MS SQL Server); hurtownie danych — 1 wykład (Agnieszka Chądzyńska-Krasowska)</td><td><span class="status status--lecture">nagranie</span></td></tr>
    <tr><th>Związek z RBD</th><td>SBD to kontynuacja Relacyjnych Baz Danych; zasady zaliczenia SBD i RBD są <strong>identyczne</strong></td><td><span class="status status--lecture">nagranie</span></td></tr>
  </tbody>
</table>
<div data-note="lecture"><p>W EDUX w nagłówku zasad jest literówka „Systemy Bazy Danych (RBD)” — prowadzący powiedział, że to błąd i poprawi na SBD. Zasady są te same co na RBD.</p></div>

<h2>Warunki zaliczenia przedmiotu</h2>
<p>Żeby zaliczyć przedmiot, potrzebujesz <strong>obu</strong> rzeczy:</p>
<ol class="steps">
  <li><strong>Zaliczone ćwiczenia</strong> — ocena min. <strong>3.0</strong>. Zasady zaliczenia ćwiczeń ustala <strong>każdy prowadzący ćwiczenia</strong> dla swoich grup. <span class="status status--confirmed">EDUX</span></li>
  <li><strong>Zdany egzamin</strong> — min. <strong>10 punktów</strong> z testu. <span class="status status--confirmed">EDUX</span></li>
</ol>

<h2>Egzamin — jak wygląda</h2>
<ul>
  <li>Test <strong>wielokrotnego wyboru</strong> na komputerach, w systemie <strong>EDUX</strong> — tak jak egzamin z RBD. <span class="status status--confirmed">EDUX</span></li>
  <li>Każde pytanie ma <strong>4 odpowiedzi</strong>, poprawnych może być <strong>jedna, dwie, trzy lub wszystkie cztery</strong>.</li>
  <li>Punktacja „duże punkty”: <strong>1 punkt</strong> dostajesz tylko wtedy, gdy zaznaczysz <strong>wszystkie poprawne</strong> odpowiedzi i <strong>żadnej błędnej</strong>. Inaczej — 0.</li>
  <li><strong>20 pytań</strong>, egzamin zdany od <strong>10 punktów</strong> (10 z 20 pytań w pełni poprawnie).</li>
  <li>Przewidywany czas: <strong>30 minut</strong>.</li>
  <li>Jeśli pytanie jest niejednoznaczne, zgłoś to <strong>w trakcie egzaminu</strong> osobie prowadzącej. Tylko zgłoszone pytania mogą być potem reklamowane.</li>
</ul>
<div data-note="own"><p><strong>Rady do egzaminu:</strong> skoro liczy się komplet, przy każdej odpowiedzi zadaj sobie pytanie „czy to jest <em>zawsze</em> prawda?”. Uważaj na słowa „tylko”, „zawsze”, „nigdy”, „oba serwery”. Najczęstsze pułapki: NULL (np. <code>NOT IN</code>, <code>COUNT(kolumna)</code>), WHERE vs HAVING, różnice MS SQL / Oracle, wyzwalacze T-SQL (raz na instrukcję) vs PL/SQL (<code>FOR EACH ROW</code>), 2NF/3NF/BCNF. Przećwicz <a href="#/quiz">test próbny</a> w trybie symulacji (20 pytań / 30 min).</p></div>

<h2>Ocena końcowa</h2>
<p>Ocena z ćwiczeń jest zamieniana na punkty i dodawana do punktów z egzaminu. <span class="status status--confirmed">EDUX</span></p>
<table>
  <thead><tr><th>Ocena z ćwiczeń</th><th>Punkty</th></tr></thead>
  <tbody>
    <tr><td>3.0</td><td>15</td></tr>
    <tr><td>3.5</td><td>19</td></tr>
    <tr><td>4.0</td><td>23</td></tr>
    <tr><td>4.5</td><td>27</td></tr>
    <tr><td>5.0</td><td>30</td></tr>
  </tbody>
</table>
<table>
  <thead><tr><th>Suma punktów (ćwiczenia + egzamin, max 50)</th><th>Ocena końcowa</th></tr></thead>
  <tbody>
    <tr><td>&lt; 25</td><td>2.0</td></tr>
    <tr><td>25 – 29</td><td>3.0</td></tr>
    <tr><td>30 – 34</td><td>3.5</td></tr>
    <tr><td>35 – 39</td><td>4.0</td></tr>
    <tr><td>40 – 44</td><td>4.5</td></tr>
    <tr><td>45 – 50</td><td>5.0</td></tr>
  </tbody>
</table>
<div data-note="tip"><p>W EDUX tabela ma postać „&lt; 30 pkt – 3.0, &lt; 35 – 3.5, … &lt; 45 – 4.5, &gt; 44 – 5.0”; powyżej zapisano ją jako przedziały. Minimalny zaliczający wynik to 15 (za 3.0 z ćwiczeń) + 10 (egzamin) = 25 pkt → 3.0.</p></div>
<div data-widget="calc"></div>

<h2>Plan semestru</h2>
<ol class="timeline">
  <li class="timeline__item timeline__item--done">
    <p class="timeline__date">29.09.2026 · Wykład 1 <span class="status status--lecture">odbył się</span></p>
    <p class="timeline__text">Powtórka z RBD: model relacyjny, postulaty Codda, więzy, ERD, normalizacja. Zobacz tematy 1–3.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">~06.10.2026 · Wykład 2 <span class="status status--lecture">zapowiedziany</span></p>
    <p class="timeline__text">Druga powtórka (język SQL). Data wyliczona jako „za tydzień” — sprawdź w planie zajęć.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">kolejne tygodnie · T-SQL i PL/SQL <span class="status status--lecture">zapowiedziane</span></p>
    <p class="timeline__text">Języki proceduralne MS SQL Server i Oracle: zmienne, kursory, procedury, wyzwalacze.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">5 wykładów · administrowanie (P. Lenkiewicz) <span class="status status--lecture">zapowiedziane</span></p>
    <p class="timeline__text">Na przykładzie MS SQL Server: pliki, indeksy, transakcje, backup/restore, uprawnienia, wydajność, bazy rozproszone. Dwa tematy (backup i indeksy) będą też na ćwiczeniach.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">1 wykład · hurtownie danych (A. Chądzyńska-Krasowska) <span class="status status--lecture">zapowiedziany</span></p>
    <p class="timeline__text">Wprowadzenie do tematu, bez ćwiczeń.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">sesja zimowa · egzamin <span class="status status--unknown">data nieznana</span></p>
    <p class="timeline__text">Termin egzaminu nie został jeszcze podany. Zwykle to sesja styczeń–luty 2027 — <strong>sprawdzaj EDUX</strong>.</p>
  </li>
</ol>

<h2>Ćwiczenia — czego się spodziewać</h2>
<p><span class="status status--estimated">wg materiałów z poprzedniego roku</span> Kolejność tematów może się zmienić — decyduje prowadzący ćwiczenia.</p>
<table>
  <thead><tr><th>Temat</th><th>Zawartość</th><th>Trening na tej stronie</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Powtórka ERD (projektowanie baz)</td><td><a href="#/tasks/t01-erd">Zadania 1</a></td></tr>
    <tr><td>2–3</td><td>Powtórka SQL: SELECT, złączenia, grupowanie, podzapytania, DML</td><td><a href="#/tasks/t02-sql">2</a>, <a href="#/tasks/t03-sql">3</a></td></tr>
    <tr><td>4–6</td><td>T-SQL: podstawy, procedury, kursory, wyzwalacze</td><td><a href="#/tasks/t04-tsql">4</a>, <a href="#/tasks/t05-tsql-cursors">5</a>, <a href="#/tasks/t06-tsql-triggers">6</a></td></tr>
    <tr><td>7</td><td>Indeksy i transakcje (plany wykonania, poziomy izolacji)</td><td><a href="#/tasks/t07-indexes-transactions">7</a></td></tr>
    <tr><td>8</td><td>Pliki bazy, backup/restore, uprawnienia</td><td><a href="#/tasks/t08-backup-security">8</a></td></tr>
    <tr><td>9–11</td><td>PL/SQL: podstawy, kursory, wyzwalacze</td><td><a href="#/tasks/t09-plsql">9</a>, <a href="#/tasks/t10-plsql-cursors">10</a>, <a href="#/tasks/t11-plsql-triggers">11</a></td></tr>
    <tr><td>Kolokwia</td><td>W zeszłym roku kolokwium 2 = procedura + wyzwalacz w PL/SQL</td><td><a href="#/tasks/k1-tsql">K1</a>, <a href="#/tasks/k2-plsql">K2</a></td></tr>
    <tr><td>Projekt</td><td>Własna baza (ERD → skrypty) + procedury i wyzwalacze w Oracle i MS SQL</td><td><a href="#/tasks/project">Projekt</a></td></tr>
  </tbody>
</table>

<h2>Ważne z pierwszego wykładu</h2>
<ul>
  <li>Prowadzący <strong>sprawdza obecność</strong> — zapowiedział listę obecności na kolejnych wykładach. <span class="status status--lecture">nagranie</span></li>
  <li>Pytania można zadawać w każdej chwili, przerywając wykład. <span class="status status--lecture">nagranie</span></li>
  <li>Slajdy z wykładu i plik tekstowy ze szczegółowym omówieniem normalizacji mają pojawić się w EDUX. <span class="status status--lecture">nagranie</span></li>
  <li>Powtórka jest robiona celowo: na obronach prac dyplomowych studenci często nie potrafią odpowiedzieć na podstawowe pytania z teorii baz. <span class="status status--lecture">nagranie</span></li>
</ul>

<h2>Rekomendacje</h2>
<div data-note="own">
<ul>
  <li><strong>Zainstaluj narzędzia na początku semestru:</strong> SQL Server (Express albo LocalDB — na ćwiczeniach używany jest <code>(localdb)\\MSSQLLocalDB</code>) + SQL Server Management Studio; dla Oracle — SQL Developer (uczelnia daje dostęp do serwera) albo darmowy Oracle Database Free. Uniwersalnie: DBeaver lub DataGrip.</li>
  <li><strong>Co tydzień:</strong> przeczytaj wykład na tej stronie → otwórz ściągę → zrób zadania z danego tematu. Nie odkładaj T-SQL i PL/SQL na koniec — to najwięcej pracy.</li>
  <li><strong>Pisz kod dwa razy:</strong> to samo zadanie w T-SQL i w PL/SQL. Najwięcej punktów traci się na myleniu składni (np. <code>@zmienna</code> vs <code>zmienna</code>, <code>PRINT</code> vs <code>DBMS_OUTPUT.PUT_LINE</code>).</li>
  <li><strong>Projekt zacznij wcześnie</strong> — ERD i skrypty zajmują więcej czasu, niż się wydaje.</li>
  <li><strong>Przed egzaminem:</strong> przejrzyj wszystkie ściągi (<a href="#/cheatsheets">strona ze ściągami</a>) i zrób kilka razy symulację testu.</li>
</ul>
</div>
`
},

tasksIntro: `
<div data-note="warn" data-label="Ważne">
  <p>Te zadania są <strong>przerobione</strong>: mają tę samą logikę co zadania z ćwiczeń, ale inne bazy (wypożyczalnia samochodów, firma kurierska), inne dane i inne treści. Służą do nauki — nie oddawaj ich jako własnych rozwiązań zadań z ćwiczeń.</p>
</div>
<ol class="steps">
  <li>Najpierw uruchom skrypty z <a href="#/tasks/databases">Baz do ćwiczeń</a> (MS SQL i/lub Oracle).</li>
  <li>Spróbuj rozwiązać zadanie sam(a). Jeśli utkniesz — otwórz podpowiedź.</li>
  <li>Dopiero potem porównaj z rozwiązaniem. Często jest kilka poprawnych wersji.</li>
</ol>`
});
