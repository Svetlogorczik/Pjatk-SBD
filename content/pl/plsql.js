/* PL – Moduł 4: PL/SQL (Oracle) */
SBD.addContent('pl', {

'plsql-basics': {
  title: 'PL/SQL: bloki, zmienne, IF i pętle',
  lead: 'Język proceduralny Oracle: bardziej rygorystyczny niż T-SQL. Budowa bloku, deklaracje, %TYPE, zasięg zmiennych, IF/ELSIF i trzy rodzaje pętli.',
  body: `
<h2>PL/SQL a T-SQL</h2>
<p><strong>PL/SQL</strong> pełni w Oracle tę samą rolę co T-SQL w MS SQL Server: dodaje zmienne, warunki, pętle, obsługę błędów, a kod można zapisać jako <strong>procedury, funkcje, wyzwalacze i pakiety</strong>. Pojawił się w Oracle 7; składnia jest wzorowana na języku <strong>Ada</strong>.</p>
<p>Składnia jest bardziej skomplikowana, ale za to <strong>uporządkowana i ściśle pilnowana</strong>: każda instrukcja kończy się średnikiem, każde IF ma END IF, każda pętla END LOOP.</p>
<div data-note="warn"><p>Częsty błąd: przenoszenie przyzwyczajeń z T-SQL do PL/SQL. Nie ma tu <code>@zmiennych</code>, <code>PRINT</code>, <code>IF EXISTS</code> ani <code>DECLARE @x = (SELECT …)</code>. Traktuj PL/SQL jak osobny język.</p></div>

<h2>Narzędzia</h2>
<ul>
  <li><strong>SQL*Plus</strong> — najstarszy klient, linia poleceń, działa wszędzie; ma własne polecenia (VARIABLE, ACCEPT, PRINT…).</li>
  <li><strong>SQL Developer</strong> — okienkowe narzędzie Oracle (odpowiednik SSMS), podstawowe na ćwiczeniach; rozumie część poleceń SQL*Plus.</li>
  <li><strong>DBeaver, DataGrip</strong> — uniwersalne; polecenia SQL*Plus (np. <code>&amp;zmienne</code>) w nich nie działają.</li>
</ul>
<p>Ważne polecenia SQL*Plus w SQL Developer: <code>SET SERVEROUTPUT ON</code> (pokazuj komunikaty!), <code>SET AUTOCOMMIT ON|OFF</code>, <code>SET VERIFY OFF</code>, <code>EXEC procedura(…)</code>, <code>VARIABLE</code>, <code>ACCEPT … PROMPT</code>.</p>
<div data-code="pl-output"></div>
<div data-note="tip"><p>Nic się nie wypisuje? Najczęstsza przyczyna: nie uruchomiono <code>SET SERVEROUTPUT ON</code> w tej sesji.</p></div>
<p>Znak <code>/</code> w osobnej linii po bloku to w SQL*Plus / SQL Developer polecenie „uruchom blok” (podobnie jak GO w MS SQL).</p>

<h2>Blok anonimowy</h2>
<p>W PL/SQL blok ma <strong>sformalizowaną budowę</strong>. Poza blokiem można uruchamiać tylko zwykłe polecenia SQL — zmienne i instrukcje sterujące muszą być w bloku.</p>
<p class="formula">DECLARE      -- opcjonalnie: zmienne, stałe, kursory, wyjątki
BEGIN        -- obowiązkowo: instrukcje SQL i PL/SQL
EXCEPTION    -- opcjonalnie: obsługa błędów
END;</p>
<p>Bloki można zagnieżdżać — blok wewnętrzny jest dla zewnętrznego jedną instrukcją. W bloku wolno używać SELECT (z INTO), INSERT, UPDATE, DELETE, COMMIT, ROLLBACK.</p>
<div data-code="pl-block"></div>

<h2>Nazwy w Oracle</h2>
<ul>
  <li>zaczynają się od litery łacińskiej; dalej litery, cyfry, <code>$</code>, <code>#</code>, <code>_</code>;</li>
  <li>max <strong>30 znaków</strong>; nie mogą być słowem kluczowym;</li>
  <li>wielkość liter nie ma znaczenia (Oracle zapisuje wszystko WIELKIMI), chyba że nazwę weźmiesz w <code>"cudzysłów"</code>.</li>
</ul>

<h2>Zmienne</h2>
<p class="formula">nazwa [CONSTANT] typ [NOT NULL] [:= | DEFAULT wartość];</p>
<ul>
  <li>Deklarujemy je w sekcji DECLARE, <strong>każdą osobno</strong>, ze średnikiem. Nazwy <strong>bez @</strong> (zwyczajowo z przedrostkiem <code>v_</code>).</li>
  <li>Typy: wszystkie z SQL Oracle + m.in. <code>BOOLEAN</code> oraz <code>BINARY_INTEGER</code>/<code>PLS_INTEGER</code> (szybkie liczby całkowite).</li>
  <li>Przypisanie: operator <code>:=</code> albo <code>SELECT … INTO zmienne FROM …</code>.</li>
  <li>Stała (CONSTANT) i zmienna NOT NULL muszą dostać wartość przy deklaracji.</li>
  <li>Niezainicjowana zmienna = NULL.</li>
</ul>
<div data-code="pl-vars"></div>
<div data-note="exam"><p><code>SELECT … INTO</code> musi zwrócić <strong>dokładnie jeden wiersz</strong>. Zero wierszy → wyjątek <code>NO_DATA_FOUND</code>, więcej → <code>TOO_MANY_ROWS</code>. Dlatego sprawdzanie istnienia rekordu robimy przez <code>SELECT COUNT(*) INTO v_ile …</code> (COUNT zawsze daje jeden wiersz), a nie „wczytaj i sprawdź NULL” jak w T-SQL.</p></div>
<div data-code="pl-no-tsql"></div>
<div data-code="pl-null-var"></div>
<p>Do jednowierszowych zapytań bez tabeli Oracle ma tabele pomocnicze: <code>DUAL</code> (zwraca 'X') i <code>DUMMY</code> (zwraca 0).</p>

<h3>%TYPE, %ROWTYPE i RECORD</h3>
<p>Typ zmiennej można „skopiować”: <code>zmienna%TYPE</code> (jak inna zmienna), <code>tabela.kolumna%TYPE</code> (jak kolumna), <code>tabela%ROWTYPE</code> (cały wiersz — pola odczytujesz jako <code>zmienna.kolumna</code>). Gdy zmieni się typ wzorca, zmieni się też typ zmiennej. Można też zdefiniować własny typ rekordowy <code>TYPE … IS RECORD (…)</code>.</p>
<div data-code="pl-type"></div>
<div data-code="pl-record"></div>
<div data-note="warn"><p>Zmiennej wierszowej (%ROWTYPE) nie wstawisz wprost po <code>VALUES</code> w INSERT.</p></div>

<h3>Zasięg zmiennych</h3>
<p>Zmienna z bloku zewnętrznego jest widoczna w blokach zagnieżdżonych. Zmienna z bloku wewnętrznego <strong>nie</strong> jest widoczna na zewnątrz ani w blokach „sąsiednich”. Ta sama nazwa w bloku wewnętrznym to <strong>inna zmienna</strong>.</p>
<div data-code="pl-scope"></div>

<h3>Zmienne podstawienia i wiązania</h3>
<p>Z SQL*Plus pochodzą: <strong>zmienne podstawienia</strong> <code>&amp;nazwa</code> (wartość wpisana z klawiatury, tylko po prawej stronie przypisania) i <strong>zmienne wiązania</strong> <code>:nazwa</code> (deklarowane poleceniem VARIABLE, żyją poza blokiem, wypisuje je PRINT). Działają w SQL Developer, nie w DBeaver/DataGrip.</p>
<div data-code="pl-bind"></div>

<h3>Zmienne systemowe</h3>
<p><code>SQL%ROWCOUNT</code> (ile wierszy przetworzyła ostatnia instrukcja), <code>SQL%FOUND</code>, <code>SQL%NOTFOUND</code>, a w sekcji EXCEPTION: <code>SQLCODE</code> (numer błędu) i <code>SQLERRM</code> (komunikat).</p>
<div data-code="pl-sqlattr"></div>

<h2>IF … THEN … ELSIF … ELSE … END IF</h2>
<ul>
  <li>Instrukcje po <code>THEN</code> — gdy warunek TRUE; po <code>ELSE</code> — gdy FALSE <strong>lub NULL</strong>.</li>
  <li><code>ELSIF</code> (pisane bez „E”!) pozwala sprawdzić kolejne warunki.</li>
  <li>Całość kończy <code>END IF;</code>.</li>
</ul>
<div data-code="pl-if"></div>

<h2>Pętle</h2>
<p>W PL/SQL to w gruncie rzeczy jedna instrukcja <code>LOOP … END LOOP</code> w trzech wariantach:</p>
<ul>
  <li><strong>LOOP</strong> — bez warunku; wychodzimy <code>EXIT</code>, <code>EXIT WHEN warunek</code> albo błędem;</li>
  <li><strong>FOR i IN a..b LOOP</strong> — licznik od a do b co 1 (sam się deklaruje); <code>REVERSE</code> — od b do a; jeśli a &gt; b, pętla nie wykona się ani razu;</li>
  <li><strong>WHILE warunek LOOP</strong> — dopóki warunek TRUE.</li>
</ul>
<div data-code="pl-loops"></div>
`,
  cheat: `
<ul>
  <li>Blok: <code>DECLARE … BEGIN … EXCEPTION … END;</code> + <code>/</code>. Zawsze <code>SET SERVEROUTPUT ON</code>.</li>
  <li>Wypisywanie: <code>DBMS_OUTPUT.PUT_LINE('tekst' || v_x);</code> — konkatenacja <code>||</code>.</li>
  <li>Zmienne bez @: <code>v_x INTEGER := 0;</code> · <code>c CONSTANT NUMBER := 10;</code> · <code>v NUMBER NOT NULL := 1;</code></li>
  <li>Przypisanie: <code>:=</code> albo <code>SELECT kol INTO v_x FROM …</code> (dokładnie 1 wiersz!).</li>
  <li>0 wierszy → <code>NO_DATA_FOUND</code>; &gt;1 → <code>TOO_MANY_ROWS</code>. Istnienie: <code>SELECT COUNT(*) INTO v_ile …</code>.</li>
  <li>NIE: <code>IF EXISTS</code>, <code>:= (SELECT …)</code>, <code>IF x = (SELECT …)</code>.</li>
  <li><code>emp.sal%TYPE</code>, <code>emp%ROWTYPE</code>, <code>TYPE t IS RECORD (…)</code>.</li>
  <li>Zasięg: zewnętrzne widać w środku, nie odwrotnie.</li>
  <li><code>&amp;x</code> — z klawiatury; <code>:x</code> — zmienna wiązania (SQL Developer).</li>
  <li><code>SQL%ROWCOUNT</code>, <code>SQL%FOUND</code>, <code>SQL%NOTFOUND</code>, <code>SQLCODE</code>, <code>SQLERRM</code>.</li>
  <li><code>IF … THEN … ELSIF … THEN … ELSE … END IF;</code></li>
  <li><code>LOOP … EXIT WHEN …; END LOOP;</code> · <code>FOR i IN 1..n LOOP … END LOOP;</code> · <code>WHILE … LOOP … END LOOP;</code></li>
  <li>Nazwy ≤ 30 znaków; w <code>"…"</code> rozróżniana wielkość liter.</li>
</ul>
`
},

'plsql-cursors': {
  title: 'PL/SQL: kursory i obsługa wyjątków',
  lead: 'Kursory jawne, atrybuty %NOTFOUND i spółka, pętla FOR z kursorem, parametry, FOR UPDATE, wyjątki predefiniowane i własne, RAISE_APPLICATION_ERROR.',
  body: `
<h2>Kursory w PL/SQL</h2>
<p>Idea jest taka sama jak w T-SQL (patrz temat o kursorach T-SQL) — różni się składnia. Kursorów używa się w PL/SQL <strong>częściej</strong>, bo procedura PL/SQL nie może po prostu zwrócić wyniku SELECT jako „result set”.</p>
<table>
  <thead><tr><th>Krok</th><th>PL/SQL</th><th>T-SQL (dla porównania)</th></tr></thead>
  <tbody>
    <tr><td>Deklaracja</td><td><code>CURSOR k IS SELECT …;</code> (w DECLARE)</td><td><code>DECLARE k CURSOR FOR SELECT …</code></td></tr>
    <tr><td>Otwarcie</td><td><code>OPEN k;</code></td><td><code>OPEN k</code></td></tr>
    <tr><td>Pobranie</td><td><code>FETCH k INTO v1, v2;</code></td><td><code>FETCH NEXT FROM k INTO @v1, @v2</code></td></tr>
    <tr><td>Koniec danych</td><td><code>EXIT WHEN k%NOTFOUND;</code></td><td><code>WHILE @@FETCH_STATUS = 0</code></td></tr>
    <tr><td>Zamknięcie</td><td><code>CLOSE k;</code></td><td><code>CLOSE k; DEALLOCATE k;</code></td></tr>
  </tbody>
</table>
<h3>Atrybuty kursora</h3>
<ul>
  <li><code>k%FOUND</code> — TRUE, jeśli ostatni FETCH pobrał wiersz;</li>
  <li><code>k%NOTFOUND</code> — TRUE, jeśli nie pobrał (koniec danych);</li>
  <li><code>k%ROWCOUNT</code> — ile wierszy pobrano do tej pory;</li>
  <li><code>k%ISOPEN</code> — czy kursor jest otwarty.</li>
</ul>
<div data-code="pl-cur-basic"></div>
<div data-note="exam"><p>W PL/SQL wystarczy <strong>jeden</strong> FETCH w pętli <code>LOOP</code>, a zaraz po nim <code>EXIT WHEN k%NOTFOUND;</code>. W T-SQL FETCH jest dwa razy (przed pętlą i na jej końcu).</p></div>
<p>Jeśli na liście SELECT kursora są wyrażenia (np. <code>SUM(sal)</code>), trzeba im nadać <strong>aliasy</strong>. Wygodnie jest pobierać wiersz do rekordu <code>k%ROWTYPE</code>.</p>
<div data-code="pl-cur-alias"></div>

<h2>Pętla FOR z kursorem</h2>
<p>Najwygodniejszy sposób: <code>FOR rekord IN kursor LOOP … END LOOP;</code>. OPEN, FETCH, sprawdzanie końca i CLOSE dzieją się <strong>automatycznie</strong>, a zmiennej rekordowej nie trzeba deklarować. Można nawet wpisać SELECT wprost w nawiasie.</p>
<div data-code="pl-cur-for"></div>

<h2>Kursor z parametrami</h2>
<p>SELECT kursora może używać parametrów; ten sam kursor otwierasz wiele razy z różnymi wartościami.</p>
<div data-code="pl-cur-param"></div>

<h2>Zmiana danych przez kursor</h2>
<p><code>FOR UPDATE [OF kolumna]</code> w deklaracji blokuje wiersze do modyfikacji, a <code>WHERE CURRENT OF kursor</code> w UPDATE/DELETE wskazuje wiersz aktualnie pobrany przez kursor.</p>
<div data-code="pl-cur-update"></div>

<h2>Obsługa wyjątków</h2>
<p>Błąd w sekcji wykonawczej (BEGIN…END) jest obsługiwany w sekcji <code>EXCEPTION</code> <strong>tego samego bloku</strong>. Jeśli jej tam nie ma — błąd „wędruje” do bloku nadrzędnego, a na końcu do aplikacji. Błędy z sekcji DECLARE i EXCEPTION od razu idą do bloku nadrzędnego.</p>
<p class="formula">EXCEPTION
    WHEN nazwa_wyjątku_1 THEN instrukcje;
    WHEN nazwa_wyjątku_2 THEN instrukcje;
    WHEN OTHERS THEN instrukcje;   -- wszystko inne</p>
<h3>Wyjątki predefiniowane</h3>
<table>
  <thead><tr><th>Wyjątek</th><th>Kiedy</th></tr></thead>
  <tbody>
    <tr><td><code>NO_DATA_FOUND</code></td><td>SELECT … INTO nie zwrócił wiersza</td></tr>
    <tr><td><code>TOO_MANY_ROWS</code></td><td>SELECT … INTO zwrócił więcej niż jeden wiersz</td></tr>
    <tr><td><code>DUP_VAL_ON_INDEX</code></td><td>powtórzona wartość w kolumnie UNIQUE / PK</td></tr>
    <tr><td><code>ZERO_DIVIDE</code></td><td>dzielenie przez zero</td></tr>
    <tr><td><code>INVALID_NUMBER</code></td><td>błąd konwersji na liczbę</td></tr>
    <tr><td><code>INVALID_CURSOR</code>, <code>CURSOR_ALREADY_OPEN</code></td><td>zła operacja na kursorze</td></tr>
    <tr><td><code>TIMEOUT_ON_RESOURCE</code></td><td>za długo czekano na zasób</td></tr>
  </tbody>
</table>
<div data-code="pl-exc-named"></div>
<div data-note="tip"><p>Dobra praktyka: każdy błąd powinien być obsłużony — w ostateczności w <code>WHEN OTHERS</code> najbardziej zewnętrznego bloku. Żeby wiedzieć, która instrukcja zawiodła, używaj bloków zagnieżdżonych z własną obsługą albo licznika kroków.</p></div>

<h3>Własne wyjątki</h3>
<p>Deklarujesz <code>nazwa EXCEPTION;</code> w DECLARE, podnosisz <code>RAISE nazwa;</code>, obsługujesz <code>WHEN nazwa THEN …</code>.</p>
<div data-code="pl-exc-own"></div>

<h3>RAISE_APPLICATION_ERROR</h3>
<p><code>RAISE_APPLICATION_ERROR(numer, 'komunikat')</code> podnosi błąd z własnym numerem z zakresu <strong>−20000 … −20999</strong> i komunikatem. Można go obsłużyć w tym samym bloku albo zostawić aplikacji. To podstawowe narzędzie w procedurach i wyzwalaczach („nie wolno…”).</p>
<div data-code="pl-raise-app"></div>
`,
  cheat: `
<ul>
  <li><code>CURSOR k IS SELECT …;</code> → <code>OPEN k;</code> → <code>LOOP FETCH k INTO …; EXIT WHEN k%NOTFOUND; … END LOOP;</code> → <code>CLOSE k;</code></li>
  <li>Atrybuty: <code>%FOUND</code>, <code>%NOTFOUND</code>, <code>%ROWCOUNT</code>, <code>%ISOPEN</code>.</li>
  <li>Wyrażenia w SELECT kursora → aliasy. Rekord: <code>r k%ROWTYPE;</code></li>
  <li><code>FOR r IN k LOOP … r.kolumna … END LOOP;</code> — wszystko automatycznie. Albo <code>FOR r IN (SELECT …) LOOP</code>.</li>
  <li>Parametry: <code>CURSOR k (p INTEGER) IS SELECT … WHERE x = p;</code> → <code>OPEN k(10);</code></li>
  <li><code>… FOR UPDATE OF sal;</code> + <code>UPDATE … WHERE CURRENT OF k;</code></li>
  <li><code>EXCEPTION WHEN NO_DATA_FOUND THEN … WHEN TOO_MANY_ROWS THEN … WHEN OTHERS THEN … SQLCODE, SQLERRM</code></li>
  <li>Inne: <code>DUP_VAL_ON_INDEX</code>, <code>ZERO_DIVIDE</code>, <code>INVALID_NUMBER</code>, <code>CURSOR_ALREADY_OPEN</code>.</li>
  <li>Własny: <code>e EXCEPTION;</code> → <code>RAISE e;</code> → <code>WHEN e THEN</code>.</li>
  <li><code>RAISE_APPLICATION_ERROR(-20001, 'tekst');</code> — numery −20000…−20999.</li>
  <li>Nieobsłużony błąd idzie do bloku nadrzędnego / aplikacji.</li>
</ul>
`
},

'plsql-procedures': {
  title: 'PL/SQL: procedury, funkcje i pakiety',
  lead: 'Obiekty z kodem w Oracle: CREATE OR REPLACE, parametry IN/OUT/IN OUT, wartości domyślne, funkcje w SQL, przeciążanie i pakiety.',
  body: `
<h2>Procedury i funkcje jako obiekty bazy</h2>
<p>Procedury i funkcje zapisujemy w bazie jako obiekty; może z nich korzystać każdy proces, który ma do nich uprawnienia. Można je też definiować wewnątrz bloku (wtedy działają tylko w nim) albo grupować w <strong>pakiety</strong>. Koncepcja jest taka sama jak w T-SQL, ale składnia i ograniczenia są inne.</p>

<h2>Składnia procedury</h2>
<p class="formula">CREATE [OR REPLACE] PROCEDURE nazwa (parametry)
{IS | AS}
    deklaracje zmiennych     -- BEZ słowa DECLARE!
BEGIN
    instrukcje
[EXCEPTION …]
END;</p>
<ul>
  <li><code>OR REPLACE</code> — jeśli procedura istnieje, zostanie zastąpiona bez błędu (w T-SQL trzeba ALTER). Bardzo wygodne przy poprawkach.</li>
  <li><code>IS</code> i <code>AS</code> — zamienne.</li>
  <li>Parametr: <code>nazwa [IN | OUT | IN OUT] typ [DEFAULT wartość]</code>. <strong>Typ bez rozmiaru</strong>: <code>NUMBER</code>, <code>VARCHAR2</code>, albo <code>emp.sal%TYPE</code>.</li>
</ul>
<div data-code="pl-proc-basic"></div>

<h2>Rodzaje parametrów</h2>
<table>
  <thead><tr><th>Tryb</th><th>Kierunek</th><th>Uwagi</th></tr></thead>
  <tbody>
    <tr><td><code>IN</code> (domyślny)</td><td>do procedury</td><td>tylko do odczytu — nie może stać po lewej stronie <code>:=</code></td></tr>
    <tr><td><code>OUT</code></td><td>z procedury</td><td>wartość trafia na zewnątrz po poprawnym zakończeniu</td></tr>
    <tr><td><code>IN OUT</code></td><td>w obie strony</td><td>przekazujesz wartość i dostajesz zmienioną</td></tr>
  </tbody>
</table>
<div data-code="pl-proc-out"></div>

<h2>Wartości domyślne i notacja nazwana</h2>
<p>Parametry z <code>DEFAULT</code> umieszczamy na końcu listy; przy wywołaniu można je pominąć. Gdy chcesz podać tylko niektóre — użyj notacji <code>parametr =&gt; wartość</code>.</p>
<div data-code="pl-proc-default"></div>

<h2>Funkcje</h2>
<p class="formula">CREATE [OR REPLACE] FUNCTION nazwa (parametry)
RETURN typ {IS | AS}
    deklaracje
BEGIN
    …
    RETURN wyrażenie;
END;</p>
<p>Różnica: procedura <em>może</em> zwracać wartości przez parametry OUT, a funkcja <strong>zawsze</strong> zwraca jedną wartość przez <code>RETURN</code> — pod swoją nazwą. Funkcji można używać w SQL (<code>SELECT f(30) FROM dual</code>) i w PL/SQL (<code>v := f(30);</code>).</p>
<div data-code="pl-func"></div>
<div data-note="exam"><p>Funkcja użyta <strong>w poleceniu SQL</strong> nie może: wykonywać DML ani DDL (zmieniać bazy), mieć parametrów OUT, korzystać z nielokalnych zmiennych pakietów; trzeba podać wszystkie parametry i nie wolno używać notacji <code>=&gt;</code>.</p></div>

<h2>Przeciążanie nazw</h2>
<p>W jednym bloku lub pakiecie może być kilka procedur/funkcji o tej samej nazwie, jeśli różnią się liczbą lub typami parametrów (nie wystarczą „podtypy”, np. CHAR vs VARCHAR2). Samodzielnych (standalone) procedur przeciążać nie można.</p>
<div data-code="pl-overload"></div>

<h2>Pakiety</h2>
<p><strong>Pakiet</strong> grupuje powiązane kursory, zmienne, stałe, wyjątki, procedury i funkcje. Składa się z dwóch części:</p>
<ul>
  <li><strong>specyfikacja</strong> (<code>CREATE PACKAGE</code>) — część publiczna: interfejs, nagłówki procedur;</li>
  <li><strong>ciało</strong> (<code>CREATE PACKAGE BODY</code>) — implementacja + elementy prywatne + opcjonalny blok inicjalizujący (wykonywany raz, przy pierwszym użyciu w sesji).</li>
</ul>
<p>Zmienne pakietu żyją do końca sesji. Do elementów odwołujemy się przez kropkę: <code>pakiet.procedura(…)</code>, <code>pakiet.zmienna</code>.</p>
<div data-code="pl-package"></div>
<div data-note="own"><p>Typowy schemat zadań z ćwiczeń („wstaw, jeśli nie istnieje; oblicz nowy numer jako MAX+1; zgłoś błąd, jeśli nie ma działu”): <code>SELECT COUNT(*) INTO v_ile … ;</code> → <code>IF v_ile = 0 THEN RAISE_APPLICATION_ERROR(…)</code> → <code>SELECT NVL(MAX(id), 0) + 1 INTO v_id …</code> → <code>INSERT …</code> → <code>DBMS_OUTPUT.PUT_LINE(…)</code>.</p></div>
`,
  cheat: `
<ul>
  <li><code>CREATE OR REPLACE PROCEDURE p (a NUMBER, b IN VARCHAR2, w OUT NUMBER) IS v_x NUMBER; BEGIN … END; /</code></li>
  <li>Deklaracje po IS/AS <strong>bez DECLARE</strong>. Typy parametrów <strong>bez rozmiaru</strong>.</li>
  <li>IN (domyślny, tylko odczyt) · OUT (wynik) · IN OUT (oba).</li>
  <li>Wywołanie: <code>CALL p(1, 'x');</code> · <code>EXEC p(1, 'x');</code> · <code>BEGIN p(1, 'x', v_w); END;</code></li>
  <li><code>DEFAULT</code> na końcu listy; <code>p(b =&gt; 'MANAGER')</code>.</li>
  <li><code>CREATE OR REPLACE FUNCTION f (x NUMBER) RETURN NUMBER IS … BEGIN … RETURN v; END;</code></li>
  <li>Funkcja w SQL: <code>SELECT f(30) FROM dual;</code> — bez DML/DDL, bez OUT, bez <code>=&gt;</code>.</li>
  <li>Przeciążanie: tylko w bloku/pakiecie, różna liczba/typy parametrów.</li>
  <li>Pakiet: <code>CREATE PACKAGE pk AS … END pk;</code> + <code>CREATE PACKAGE BODY pk AS … [BEGIN init] END pk;</code>; użycie <code>pk.proc()</code>.</li>
</ul>
`
},

'plsql-triggers': {
  title: 'PL/SQL: wyzwalacze',
  lead: 'BEFORE/AFTER, poziom instrukcji i wiersza (FOR EACH ROW), :OLD/:NEW, INSERTING/UPDATING/DELETING, tabela mutująca, INSTEAD OF i wyzwalacze systemowe.',
  body: `
<h2>Wyzwalacze w Oracle</h2>
<p>Wyzwalacz PL/SQL to procedura związana z <strong>tabelą, widokiem, schematem albo całą bazą</strong>, uruchamiana automatycznie przez zdarzenie: INSERT/UPDATE/DELETE albo zdarzenie systemowe. Rola jest taka sama jak w T-SQL, ale <strong>filozofia działania jest inna</strong> — przede wszystkim Oracle ma wyzwalacze wierszowe i wybór momentu BEFORE/AFTER.</p>

<h2>Składnia</h2>
<p class="formula">CREATE [OR REPLACE] TRIGGER nazwa
{BEFORE | AFTER} {INSERT | UPDATE [OF kolumny] | DELETE} [OR …]
ON tabela
[FOR EACH ROW]
blok PL/SQL</p>
<p>Przy definiowaniu decydujesz o trzech rzeczach:</p>
<ol class="steps">
  <li><strong>które operacje</strong> uruchamiają wyzwalacz (łączone przez <code>OR</code>; dla UPDATE można wskazać kolumny: <code>UPDATE OF sal</code>);</li>
  <li><strong>kiedy</strong>: <code>BEFORE</code> (przed instrukcją) czy <code>AFTER</code> (po);</li>
  <li><strong>ile razy</strong>: raz dla całej instrukcji (domyślnie) czy <strong>dla każdego wiersza</strong> (<code>FOR EACH ROW</code>).</li>
</ol>

<h2>Dwa typy wyzwalaczy</h2>
<table>
  <thead><tr><th></th><th>Poziom instrukcji</th><th>Poziom wiersza (<code>FOR EACH ROW</code>)</th></tr></thead>
  <tbody>
    <tr><td>Ile razy</td><td>raz na instrukcję</td><td>raz dla każdego zmienianego wiersza</td></tr>
    <tr><td>Dostęp do wartości</td><td>brak :OLD/:NEW</td><td><code>:OLD.kolumna</code> (przed), <code>:NEW.kolumna</code> (po)</td></tr>
    <tr><td>Czytanie tabeli wyzwalacza</td><td>wolno</td><td><strong>nie wolno</strong> (tabela mutująca)</td></tr>
  </tbody>
</table>
<div data-code="pl-trg-statement"></div>
<div data-code="pl-trg-row"></div>
<div data-note="tip"><p>W wyzwalaczu <code>BEFORE … FOR EACH ROW</code> można <strong>zmienić</strong> wstawianą wartość przez przypisanie do <code>:NEW.kolumna</code> (np. uzupełnić datę, poprawić płacę). Przy INSERT <code>:OLD</code> jest pusty (NULL), przy DELETE — <code>:NEW</code>.</p></div>

<h2>Która operacja uruchomiła wyzwalacz</h2>
<p>Predykaty <code>INSERTING</code>, <code>UPDATING</code>, <code>DELETING</code> używane w IF — przydatne, gdy wyzwalacz reaguje na kilka operacji. Żeby zablokować operację, podnosimy błąd <code>RAISE_APPLICATION_ERROR</code> (cała instrukcja zostanie wycofana).</p>
<div data-code="pl-trg-predicates"></div>

<h2>Ograniczenia</h2>
<div data-note="exam"><ul>
  <li>W wyzwalaczach <strong>nie wolno</strong> używać <code>COMMIT</code> ani <code>ROLLBACK</code> (blokujemy przez RAISE_APPLICATION_ERROR).</li>
  <li>W wyzwalaczu wierszowym <strong>nie wolno czytać ani zmieniać tabeli, na której działa</strong> (poza <code>:OLD</code>/<code>:NEW</code>) — ani tabel z nią związanych kluczami obcymi. Wyjątek: INSERT … VALUES pojedynczego wiersza.</li>
</ul></div>
<p>Naruszenie drugiej zasady daje słynny błąd <strong>ORA-04091: table … is mutating</strong>. Wyzwalacz się kompiluje, ale przy pierwszym UPDATE wszystko się wycofuje:</p>
<div data-code="pl-trg-mutating"></div>
<div data-note="own"><p>Jak ominąć tabelę mutującą? Najprościej: przenieś logikę do wyzwalacza <strong>poziomu instrukcji</strong> (tam wolno czytać tabelę) albo do procedury. Zaawansowane rozwiązanie to wyzwalacz złożony (COMPOUND TRIGGER) — poza zakresem wykładu.</p></div>

<h2>Kilka wyzwalaczy na jednej tabeli</h2>
<p>Można ich mieć wiele, ale nie sterujemy kolejnością w obrębie tego samego typu — nie pisz wyzwalaczy, które zależą od kolejności. Ogólny porządek:</p>
<ol>
  <li>BEFORE instrukcji;</li>
  <li>BEFORE wiersza → AFTER wiersza (dla każdego wiersza po kolei);</li>
  <li>AFTER instrukcji.</li>
</ol>
<p>Wyłączanie i usuwanie: <code>ALTER TRIGGER nazwa DISABLE | ENABLE;</code>, <code>DROP TRIGGER nazwa;</code>. Wadliwy wyzwalacz (np. mutujący) może blokować działanie innych — wyłącz go lub usuń.</p>

<h2>INSTEAD OF</h2>
<p>Pozwala na DML przez widoki zbudowane na kilku tabelach: blok PL/SQL wykonuje osobne operacje na każdej tabeli, a użytkownik widzi tylko widok. W Oracle <strong>tylko na widokach</strong> (w MS SQL także na tabelach).</p>
<div data-code="pl-trg-instead"></div>

<h2>Wyzwalacze systemowe</h2>
<p>Oracle pozwala reagować na zdarzenia <strong>bazy</strong> (SERVERERROR, LOGON, LOGOFF, STARTUP, SHUTDOWN) i <strong>DDL/DCL</strong> (CREATE, ALTER, DROP, GRANT, REVOKE) — dla schematu (<code>ON SCHEMA</code>) albo całej bazy (<code>ON DATABASE</code>).</p>
<div data-code="pl-trg-system"></div>
<div data-note="own"><p><strong>T-SQL vs PL/SQL — najważniejsze różnice w wyzwalaczach:</strong></p>
<table>
  <thead><tr><th></th><th>T-SQL</th><th>PL/SQL</th></tr></thead>
  <tbody>
    <tr><td>Moment</td><td>AFTER (FOR) albo INSTEAD OF</td><td>BEFORE, AFTER, INSTEAD OF</td></tr>
    <tr><td>Wiersze</td><td>zawsze raz na instrukcję</td><td>raz na instrukcję albo FOR EACH ROW</td></tr>
    <tr><td>Stare/nowe dane</td><td>tabele <code>deleted</code>/<code>inserted</code></td><td><code>:OLD</code>/<code>:NEW</code> (tylko wierszowy)</td></tr>
    <tr><td>Blokada operacji</td><td><code>ROLLBACK</code> (+ RAISERROR)</td><td><code>RAISE_APPLICATION_ERROR</code> (COMMIT/ROLLBACK zabronione)</td></tr>
    <tr><td>Rozpoznanie operacji</td><td>czy inserted/deleted są puste</td><td><code>INSERTING/UPDATING/DELETING</code></td></tr>
  </tbody>
</table></div>
`,
  cheat: `
<ul>
  <li><code>CREATE OR REPLACE TRIGGER t BEFORE|AFTER INSERT OR UPDATE [OF kol] OR DELETE ON tab [FOR EACH ROW] DECLARE … BEGIN … END; /</code></li>
  <li>Bez FOR EACH ROW — raz na instrukcję, bez :OLD/:NEW, wolno czytać tabelę.</li>
  <li>FOR EACH ROW — dla każdego wiersza; <code>:OLD.kol</code>, <code>:NEW.kol</code>; w BEFORE można zmienić <code>:NEW.kol := …</code>.</li>
  <li><code>IF INSERTING / UPDATING / DELETING THEN …</code></li>
  <li>Blokada: <code>RAISE_APPLICATION_ERROR(-20001, '…');</code>. <strong>Zakaz COMMIT/ROLLBACK</strong>.</li>
  <li>Wierszowy nie czyta swojej tabeli → <strong>ORA-04091 mutating</strong>.</li>
  <li>Kolejność: BEFORE instr. → (BEFORE wiersz → AFTER wiersz)× → AFTER instr.</li>
  <li><code>ALTER TRIGGER t DISABLE|ENABLE;</code> · <code>DROP TRIGGER t;</code></li>
  <li><code>INSTEAD OF</code> — tylko widoki (w Oracle).</li>
  <li>Systemowe: <code>… ON SCHEMA | ON DATABASE</code> (LOGON, DROP, CREATE…).</li>
</ul>
`
},

'plsql-advanced': {
  title: 'PL/SQL dla zaawansowanych',
  lead: 'Nazwy w cudzysłowie, IDENTITY w trzech wariantach, sekwencje, tabele tymczasowe GTT/PTT, funkcje analityczne, MERGE i EXECUTE IMMEDIATE.',
  body: `
<div data-note="lecture"><p>Te rozwiązania rozszerzają możliwości, ale nie są niezbędne do podstawowych operacji. CTE z rekursją, CASE i skorelowany UPDATE działają w Oracle praktycznie tak samo jak w MS SQL — patrz temat „T-SQL dla zaawansowanych”.</p></div>

<h2>Nazwy w Oracle</h2>
<p>Oracle zapisuje nazwy <strong>WIELKIMI literami</strong>, chyba że użyjesz cudzysłowu — wtedy nazwa jest zapisana dokładnie tak, jak ją napisałeś, i dokładnie tak trzeba się do niej odwoływać. Max 30 znaków (także nazwy więzów generowane przez narzędzia CASE!).</p>
<div data-code="pl-names"></div>

<h2>Autonumerowanie</h2>
<h3>IDENTITY (od Oracle 12c)</h3>
<table>
  <thead><tr><th>Wariant</th><th>Zachowanie</th></tr></thead>
  <tbody>
    <tr><td><code>GENERATED ALWAYS AS IDENTITY</code></td><td>zawsze numer z serwera; podanie własnego = błąd ORA-32795 (jak w MS SQL)</td></tr>
    <tr><td><code>GENERATED BY DEFAULT AS IDENTITY</code></td><td>numer z serwera, chyba że podasz własny — generator go nie kontroluje, więc łatwo o duplikat</td></tr>
    <tr><td><code>GENERATED BY DEFAULT ON NULL AS IDENTITY</code></td><td>numer z serwera, gdy kolumnę pominiesz <strong>lub</strong> podasz NULL</td></tr>
  </tbody>
</table>
<div data-code="pl-identity"></div>
<p>Ograniczenia: jedna kolumna IDENTITY na tabelę, typ liczbowy, bez DEFAULT; tabela utworzona przez <code>CREATE TABLE … AS SELECT</code> nie dziedziczy IDENTITY; Oracle nie ma odpowiednika <code>SCOPE_IDENTITY()</code>.</p>
<h3>Sekwencje</h3>
<p>Starszy, wciąż używany sposób. Zaleta: jedna sekwencja może zasilać kilka kolumn/tabel; <code>CURRVAL</code> łatwo odczytuje ostatnią wartość.</p>
<div data-code="pl-seq"></div>

<h2>Tabele tymczasowe</h2>
<table>
  <thead><tr><th></th><th>GLOBAL TEMPORARY (GTT)</th><th>PRIVATE TEMPORARY (PTT, od 18c)</th></tr></thead>
  <tbody>
    <tr><td>Definicja</td><td><strong>trwały obiekt</strong>, widoczny dla wszystkich sesji</td><td>tymczasowa, tylko w mojej sesji, w RAM</td></tr>
    <tr><td>Dane</td><td>prywatne dla sesji</td><td>prywatne dla sesji</td></tr>
    <tr><td>Czas życia danych</td><td><code>ON COMMIT DELETE ROWS</code> (domyślnie, do końca transakcji) / <code>PRESERVE ROWS</code> (do końca sesji)</td><td><code>ON COMMIT DROP DEFINITION</code> / <code>PRESERVE DEFINITION</code></td></tr>
    <tr><td>Nazwa</td><td>dowolna</td><td>musi zaczynać się od <code>ORA$PTT_</code></td></tr>
    <tr><td>Inne</td><td>można indeksować; nie wchodzi do backupu; DDL tylko gdy nikt nie używa</td><td>bez indeksów, bez DEFAULT, niedostępne z innych baz</td></tr>
  </tbody>
</table>
<div data-code="pl-temp"></div>

<h2>Funkcje analityczne</h2>
<p><code>ROW_NUMBER</code>, <code>RANK</code>, <code>DENSE_RANK</code> z <code>OVER (PARTITION BY … ORDER BY …)</code> działają jak w MS SQL. Oracle ma dodatkowo <code>RANK(wartości) WITHIN GROUP (ORDER BY …)</code> jako <strong>agregat</strong> (jaką pozycję zajęłaby dana wartość) oraz <code>LISTAGG</code> — sklejanie wartości z grupy w jeden tekst (odpowiednik STRING_AGG).</p>
<div data-code="pl-analytic"></div>

<h2>MERGE</h2>
<p>Idea jak w T-SQL (zsynchronizuj tabelę docelową ze źródłem), składnia nieco inna: <code>MERGE INTO … USING … ON (…) WHEN MATCHED THEN UPDATE … [DELETE WHERE …] WHEN NOT MATCHED THEN INSERT … [WHERE …]</code>. W Oracle DELETE jest częścią gałęzi MATCHED — usuwa tylko wiersze, które zostały dopasowane.</p>
<div data-code="pl-merge"></div>
<div data-note="lecture"><p>Na wykładzie pokazano „oscylator”: DELETE usuwa wiersz „działu NULL”, ale przy kolejnym MERGE wiersz ten znowu jest wstawiany. Pomaga dodatkowy warunek <code>WHERE s.deptno IS NOT NULL</code> w gałęzi INSERT.</p></div>

<h2>Funkcje — przypomnienie</h2>
<div data-code="pl-func-avg"></div>

<h2>Dynamiczny SQL</h2>
<p>W bloku PL/SQL <strong>nie wolno</strong> pisać DDL wprost. Rozwiązaniem jest dynamiczny SQL: starszy pakiet <code>DBMS_SQL</code> (skomplikowany) albo „naturalny” <code>EXECUTE IMMEDIATE tekst [INTO zmienne] [USING wartości]</code>. W tekście używamy zmiennych wiązania <code>:1</code>, <code>:nazwa</code>, a wartości przekazujemy przez <code>USING</code> — to chroni przed SQL Injection.</p>
<div data-code="pl-dynamic"></div>
`,
  cheat: `
<ul>
  <li>Nazwy: WIELKIE litery, ≤ 30 znaków; <code>"abc"</code> ≠ <code>abc</code>.</li>
  <li>IDENTITY: <code>GENERATED ALWAYS | BY DEFAULT | BY DEFAULT ON NULL AS IDENTITY [START WITH … INCREMENT BY …]</code>.</li>
  <li>Sekwencja: <code>CREATE SEQUENCE s START WITH 10 INCREMENT BY 10;</code> · <code>s.NEXTVAL</code>, <code>s.CURRVAL</code>.</li>
  <li>GTT: <code>CREATE GLOBAL TEMPORARY TABLE … ON COMMIT DELETE|PRESERVE ROWS;</code> — trwała definicja, dane sesji.</li>
  <li>PTT: <code>CREATE PRIVATE TEMPORARY TABLE ora$ptt_x … ON COMMIT DROP|PRESERVE DEFINITION;</code></li>
  <li><code>ROW_NUMBER/RANK/DENSE_RANK() OVER (PARTITION BY … ORDER BY …)</code>; <code>RANK(x) WITHIN GROUP (ORDER BY …)</code>.</li>
  <li><code>LISTAGG(kol, ', ') WITHIN GROUP (ORDER BY kol)</code>.</li>
  <li><code>MERGE INTO t USING s ON (…) WHEN MATCHED THEN UPDATE SET … DELETE WHERE … WHEN NOT MATCHED THEN INSERT … VALUES … WHERE …;</code></li>
  <li><code>EXECUTE IMMEDIATE 'SQL z :1' [INTO v] USING wart;</code> — jedyny sposób na DDL w bloku.</li>
</ul>
`
}

});
