/* PL – Moduł 2: język SQL */
SBD.addContent('pl', {

'sql-basics': {
  title: 'Język SQL — podstawy, dialekty i typy danych',
  lead: 'Skąd się wziął SQL, czym różnią się MS SQL Server i Oracle, jak dzielimy polecenia i jakie są typy danych.',
  body: `
<h2>Skąd się wziął SQL</h2>
<p>Wcześniejsze modele danych (sieciowy, hierarchiczny) opierały się na plikach z rekordami — wystarczały zwykłe języki programowania (COBOL, C). Po publikacji modelu relacyjnego (Codd, 1970) potrzebny był nowy <strong>język relacyjny</strong>:</p>
<ul>
  <li>1974 — w IBM zespół Donalda Chamberlaina pokazuje język <strong>SEQUEL</strong>;</li>
  <li>1977 — SYSTEM R z językiem SEQUEL/2; nazwę zmieniono na <strong>SQL</strong> (z powodów prawnych — nazwa SEQUEL była zastrzeżona);</li>
  <li>1986 — standard ANSI, 1987 — standard ISO.</li>
</ul>
<p>Każdy serwer implementuje standard trochę inaczej — mówimy o <strong>dialektach</strong>. Znane systemy: Oracle Database, IBM DB2, PostgreSQL, MS SQL Server (pierwotnie kupiony od firmy Sybase), MySQL, MariaDB. Żaden dialekt nie realizuje całego standardu i żadne dwa nie są identyczne.</p>
<p>Na przedmiocie używamy dwóch dialektów: <strong>MS SQL Server</strong> (skrót: MS SQL) i <strong>Oracle</strong>. Jeśli nie zaznaczono różnicy — polecenie działa tak samo w obu.</p>
<div data-note="lecture"><p>Prowadzący przestrzega przed „gotowcami” z internetu: bywają błędne albo dotyczą innego dialektu, czego początkujący nie odróżnia. Ostateczną wyrocznią jest <strong>dokumentacja producenta</strong>.</p></div>

<h2>Czym SQL jest, a czym nie</h2>
<ul>
  <li>SQL to <strong>język danych</strong> — służy tylko do operacji na bazie.</li>
  <li>To <strong>nie</strong> jest język programowania: nie ma zmiennych, IF-ów, pętli. (Dlatego w tym semestrze poznamy rozszerzenia: T-SQL i PL/SQL.)</li>
  <li>To język <strong>deklaratywny</strong>: mówisz <em>co</em> chcesz dostać, a <em>jak</em> to zrobić, decyduje serwer.</li>
  <li>Mówi się „zapytanie” (query), choć tak naprawdę wydajemy <strong>polecenia</strong> — nie każde coś zwraca.</li>
</ul>

<h2>Zasady zapisu</h2>
<ul>
  <li>Słowa kluczowe i nazwy obiektów można pisać małymi lub wielkimi literami.</li>
  <li>Ale <strong>dane</strong> mogą rozróżniać wielkość liter: Oracle domyślnie rozróżnia (<code>'Kowalski' ≠ 'KOWALSKI'</code>), MS SQL domyślnie nie.</li>
  <li>Polecenie kończymy średnikiem <code>;</code> — Oracle tego wymaga, MS SQL nie, ale warto zawsze go stawiać.</li>
  <li><strong>Tekst i daty</strong> zawsze w pojedynczych apostrofach: <code>'Ala'</code>, <code>'2021-11-21'</code>.</li>
  <li>Polecenie można łamać na wiele linii w dowolnym miejscu.</li>
</ul>
<div data-code="sql-comments"></div>
<div data-note="tip"><p>Skróty: w SSMS komentarz <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd> / odkomentowanie <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>U</kbd>; w SQL Developer <kbd>Ctrl</kbd>+<kbd>/</kbd> działa w obie strony.</p></div>
<p>W opisach składni używamy notacji BNF: <code>[ ]</code> — element opcjonalny, <code>|</code> — wybór, <code>{ }</code> — element wymagany, <code>(…)</code> — możliwe powtórzenie.</p>

<h2>Cztery grupy poleceń</h2>
<table>
  <thead><tr><th>Grupa</th><th>Rozwinięcie</th><th>Polecenia</th><th>Do czego</th></tr></thead>
  <tbody>
    <tr><td><strong>DQL</strong></td><td>Data Query Language</td><td><code>SELECT</code></td><td>odczyt danych (nic nie zmienia)</td></tr>
    <tr><td><strong>DML</strong></td><td>Data Manipulation Language</td><td><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code></td><td>zmiany danych</td></tr>
    <tr><td><strong>DDL</strong></td><td>Data Definition Language</td><td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code></td><td>tworzenie i zmiana obiektów (tabel, widoków…)</td></tr>
    <tr><td><strong>DCL</strong></td><td>Data Control Language</td><td><code>GRANT</code>, <code>REVOKE</code>, <code>DENY</code>*</td><td>uprawnienia (* DENY — tylko MS SQL)</td></tr>
  </tbody>
</table>
<p>Na RBD poznaliście DQL, DML i DDL. DCL to część programu SBD.</p>
<div data-code="sql-groups"></div>

<h2>Typy danych</h2>
<p>Standard przewiduje m.in. <code>CHARACTER(n)</code> (stała długość, dopełniana spacjami), <code>CHARACTER VARYING(n)</code> = <code>VARCHAR(n)</code> (zmienna długość), <code>NUMERIC(p, q)</code> (p cyfr, q po przecinku), <code>INTEGER</code>. W praktyce liczą się typy konkretnego serwera:</p>
<table>
  <thead><tr><th>Rodzaj</th><th>MS SQL Server</th><th>Oracle</th></tr></thead>
  <tbody>
    <tr><td>Tekst stały / zmienny</td><td><code>CHAR(n)</code>, <code>VARCHAR(n)</code> do 8000, <code>VARCHAR(MAX)</code></td><td><code>CHAR(n)</code>, <code>VARCHAR2(n)</code></td></tr>
    <tr><td>Tekst Unicode</td><td><code>NCHAR</code>, <code>NVARCHAR</code> (2 bajty/znak)</td><td><code>NCHAR</code>, <code>NVARCHAR2</code></td></tr>
    <tr><td>Całkowite</td><td><code>TINYINT</code> (0–255), <code>SMALLINT</code>, <code>INT</code>, <code>BIGINT</code>, <code>BIT</code> (0/1/NULL)</td><td><code>INTEGER</code> = <code>NUMBER(38)</code></td></tr>
    <tr><td>Dziesiętne</td><td><code>DECIMAL(p,s)</code> = <code>NUMERIC(p,s)</code>, <code>MONEY</code>, <code>SMALLMONEY</code></td><td><code>NUMBER(p,s)</code> (s może być ujemne — zaokrąglenie przed przecinkiem)</td></tr>
    <tr><td>Data i czas</td><td><code>DATE</code>, <code>TIME</code>, <code>DATETIME2</code> (<code>DATETIME</code> — przestarzały)</td><td><code>DATE</code> (z godziną!), <code>TIMESTAMP(s)</code></td></tr>
    <tr><td>Binarne</td><td><code>BINARY(n)</code>, <code>VARBINARY(n)</code></td><td><code>BLOB</code>, <code>RAW</code></td></tr>
  </tbody>
</table>
<div data-code="sql-types-ms"></div>
<div data-code="sql-types-ora"></div>

<h2>Narzędzia</h2>
<ul>
  <li><strong>MS SQL Server:</strong> SQL Server Management Studio (SSMS) — pełne narzędzie z GUI do administracji; Azure Data Studio — tryb tekstowy.</li>
  <li><strong>Oracle:</strong> SQL Developer; najstarszy klient: SQL*Plus (linia poleceń).</li>
  <li><strong>Uniwersalne:</strong> DataGrip, DBeaver — łączą się z wieloma serwerami.</li>
</ul>
<p>Studenci PJATK dostają dostęp do serwerów Oracle i MS SQL Server w domenie uczelni.</p>
`,
  cheat: `
<ul>
  <li>SQL: IBM, SEQUEL (1974) → SQL; standard ANSI 1986, ISO 1987. Dialekty różnią się szczegółami.</li>
  <li>SQL = język <strong>danych</strong>, <strong>deklaratywny</strong>, bez zmiennych/pętli (to dają T-SQL i PL/SQL).</li>
  <li>Tekst i daty w <code>'apostrofach'</code>. Średnik: Oracle — wymagany, MS SQL — zalecany.</li>
  <li>Oracle domyślnie rozróżnia wielkość liter w danych, MS SQL — nie.</li>
  <li>Komentarze: <code>-- linia</code>, <code>/* blok */</code>.</li>
  <li><strong>DQL</strong> SELECT · <strong>DML</strong> INSERT/UPDATE/DELETE · <strong>DDL</strong> CREATE/ALTER/DROP · <strong>DCL</strong> GRANT/REVOKE/DENY (DENY tylko MS SQL).</li>
  <li>Typy MS SQL: INT, BIT, DECIMAL(p,s), MONEY, VARCHAR(n), NVARCHAR, DATE, DATETIME2.</li>
  <li>Typy Oracle: NUMBER(p,s), INTEGER, VARCHAR2(n), DATE (z czasem), TIMESTAMP.</li>
  <li>Narzędzia: SSMS (MS SQL), SQL Developer (Oracle), DBeaver/DataGrip (oba).</li>
</ul>
`
},

'select-basics': {
  title: 'SELECT — odczyt danych z jednej tabeli',
  lead: 'Baza EMP/DEPT/SALGRADE, lista SELECT, wyrażenia, aliasy, NULL, DISTINCT i sortowanie.',
  body: `
<h2>Przykładowa baza: EMP, DEPT, SALGRADE</h2>
<p>Większość przykładów z wykładów działa na trzech tabelach pewnej firmy (tzw. schemat EDS):</p>
<table>
  <thead><tr><th>Tabela</th><th>Kolumny</th><th>Co zawiera</th></tr></thead>
  <tbody>
    <tr><td><strong>EMP</strong></td><td><code>EMPNO</code> (PK), <code>ENAME</code>, <code>JOB</code>, <code>MGR</code> (FK → EMPNO szefa), <code>HIREDATE</code>, <code>SAL</code> (płaca miesięczna), <code>COMM</code> (prowizja), <code>DEPTNO</code> (FK → DEPT)</td><td>14 pracowników</td></tr>
    <tr><td><strong>DEPT</strong></td><td><code>DEPTNO</code> (PK), <code>DNAME</code>, <code>LOC</code></td><td>4 działy</td></tr>
    <tr><td><strong>SALGRADE</strong></td><td><code>GRADE</code>, <code>LOSAL</code>, <code>HISAL</code></td><td>5 grup zarobkowych</td></tr>
  </tbody>
</table>
<p>Na co zwrócić uwagę w danych:</p>
<ul>
  <li><strong>KING</strong> (PRESIDENT) ma <code>MGR = NULL</code> — nie ma szefa.</li>
  <li>Tylko 4 osoby mają wpisaną prowizję; reszta ma <code>COMM = NULL</code> („może dostanie, może nie”), a TURNER ma <code>COMM = 0</code> („na pewno nie dostanie”).</li>
  <li>Dział <strong>40 (OPERATIONS, BOSTON)</strong> nie ma żadnego pracownika.</li>
</ul>
<div data-code="eds-mssql"></div>
<div data-code="eds-oracle"></div>

<h2>Budowa polecenia SELECT</h2>
<p>SELECT składa się z <strong>klauzul w ściśle określonej kolejności</strong>. Obowiązkowe są SELECT i FROM:</p>
<p class="formula">SELECT [DISTINCT] wyrażenia
FROM     źródła
[WHERE   warunek]
[GROUP BY wyrażenia]
[HAVING  warunek]
[ORDER BY wyrażenia];</p>
<p>SELECT nigdy nie zmienia danych. Określa: <em>skąd</em> czytamy (FROM), <em>które</em> wiersze (WHERE), <em>w jakiej postaci</em> je zwracamy (SELECT, ORDER BY).</p>
<div data-code="sel-basic"></div>
<div data-note="tip"><p>Jeśli nazwa kolumny występuje w kilku tabelach, poprzedź ją nazwą tabeli: <code>Emp.deptno</code>. Przy jednej tabeli nie jest to potrzebne.</p></div>

<h2>Wyrażenia w liście SELECT</h2>
<p>Na liście SELECT mogą być nie tylko kolumny, ale też <strong>literały</strong> (stałe: <code>1</code>, <code>'tekst'</code>), działania <code>+ - * /</code>, funkcje i nawiasy. Łączenie tekstów (konkatenacja): Oracle <code>||</code>, MS SQL <code>+</code>.</p>
<div data-code="sel-concat"></div>
<div data-note="warn"><p>W MS SQL <code>+</code> znaczy i „dodaj”, i „sklej”. Dlatego <code>'ma ' + sal</code> (tekst + liczba) wymaga <code>CAST(sal AS VARCHAR)</code>. Oracle zamienia liczbę na tekst sam.</p></div>
<p>Konwersje typów: <code>CAST(wyrażenie AS typ)</code> — w obu serwerach; MS SQL ma też <code>CONVERT(typ, wyrażenie, styl)</code>, Oracle — funkcje <code>TO_CHAR</code>, <code>TO_DATE</code>, <code>TO_NUMBER</code>.</p>
<div data-code="sel-noFrom"></div>

<h2>Aliasy</h2>
<p>Kolumnom wynikowym możemy nadać nazwy (aliasy). Prosty alias to słowo bez spacji; alias ze spacjami bierzemy w <code>"cudzysłów"</code>. Słowo <code>AS</code> jest opcjonalne. Alias nie zmienia nazwy kolumny w tabeli — działa tylko w tym zapytaniu.</p>
<div data-code="sel-alias"></div>

<h2>NULL w wyrażeniach</h2>
<p>Każde działanie z NULL daje NULL. Jeśli pracownik ma <code>comm = NULL</code>, to <code>12*sal + comm</code> też jest NULL — choć biznesowo powinniśmy dostać roczną płacę. Rozwiązanie: zamienić NULL na wartość funkcją <code>NVL</code> (Oracle) / <code>ISNULL</code> (MS SQL) / <code>COALESCE</code> (oba).</p>
<div data-code="sel-null"></div>
<div data-note="exam"><p><code>NVL(x, y)</code> i <code>ISNULL(x, y)</code>: jeśli <code>x</code> nie jest NULL, zwracają <code>x</code>, w przeciwnym razie <code>y</code>. Oba argumenty powinny być tego samego typu. W Oracle konkatenacja z NULL <em>nie</em> daje NULL (NULL traktowany jak pusty tekst), w MS SQL — daje.</p></div>

<h2>DISTINCT</h2>
<p>Powtarzające się wiersze wyniku nie są usuwane automatycznie. <code>DISTINCT</code> usuwa duplikaty — ale wymaga sortowania, więc jest „kosztowny” dla serwera. <code>SELECT DISTINCT *</code> nie ma sensu (wiersze tabeli i tak są unikalne dzięki kluczowi).</p>
<div data-code="sel-distinct"></div>

<h2>ORDER BY</h2>
<p>Bez ORDER BY serwer zwraca wiersze w dowolnej kolejności (zwykle kolejności wpisania). <code>ORDER BY</code> występuje <strong>raz, zawsze na końcu</strong>. Można sortować po kolumnach, wyrażeniach, aliasach, a nawet numerach pozycji z listy SELECT; <code>ASC</code> (rosnąco, domyślnie) lub <code>DESC</code> (malejąco).</p>
<div data-code="sel-order"></div>
<div data-note="tip"><p><code>TOP n</code> w MS SQL bez <code>ORDER BY</code> zwraca „jakieś” n wierszy — wynik zależy od kolejności. Sortowanie dużych zbiorów obciąża serwer; pomagają w tym indeksy.</p></div>
`,
  cheat: `
<ul>
  <li>Kolejność klauzul: <code>SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY</code>. Obowiązkowe: SELECT, FROM (MS SQL pozwala bez FROM, Oracle — <code>FROM dual</code>).</li>
  <li>EMP: KING ma MGR NULL, większość COMM NULL, TURNER COMM 0, dział 40 pusty.</li>
  <li><code>SELECT *</code> — wszystkie kolumny; <code>TOP n [PERCENT]</code> — tylko MS SQL.</li>
  <li>Konkatenacja: Oracle <code>||</code>, MS SQL <code>+</code> + <code>CAST(x AS VARCHAR)</code>; <code>CONCAT()</code> w obu.</li>
  <li>Alias: <code>kolumna AS alias</code>, ze spacją <code>"Moj alias"</code>.</li>
  <li>NULL w działaniu → NULL. Zamiana: <code>NVL</code> (Oracle), <code>ISNULL</code> (MS SQL), <code>COALESCE</code> (oba).</li>
  <li><code>DISTINCT</code> usuwa duplikaty (kosztowne).</li>
  <li><code>ORDER BY kol1, 2 DESC</code> — raz, na końcu; po nazwie, aliasie lub numerze.</li>
  <li>Daty bieżące: <code>GETDATE()</code> (MS SQL), <code>SYSDATE</code> (Oracle).</li>
</ul>
`
},

'where-joins': {
  title: 'WHERE i złączenia tabel (JOIN)',
  lead: 'Jak wybierać wiersze warunkiem i jak czytać dane z wielu tabel naraz: INNER, OUTER, CROSS, samozłączenie i operatory na zbiorach.',
  body: `
<h2>Klauzula WHERE</h2>
<p><code>WHERE</code> to filtr wierszy. Do wyniku trafiają tylko te wiersze, dla których warunek jest <strong>TRUE</strong>. Gdy warunek daje FALSE albo NULL — wiersz odpada.</p>
<div data-code="wh-basic"></div>

<h3>Operatory</h3>
<table>
  <thead><tr><th>Operator</th><th>Znaczenie</th><th>Przykład</th></tr></thead>
  <tbody>
    <tr><td><code>= &lt;&gt; != &lt; &lt;= &gt; &gt;=</code></td><td>porównania</td><td><code>sal &gt;= 1100</code></td></tr>
    <tr><td><code>IS [NOT] NULL</code></td><td>test na NULL (jedyny poprawny!)</td><td><code>comm IS NULL</code></td></tr>
    <tr><td><code>[NOT] IN (…)</code></td><td>należy do listy</td><td><code>deptno IN (10, 30)</code></td></tr>
    <tr><td><code>[NOT] BETWEEN a AND b</code></td><td>w przedziale <strong>domkniętym</strong> (a ≤ x ≤ b)</td><td><code>sal BETWEEN 1000 AND 2000</code></td></tr>
    <tr><td><code>[NOT] LIKE</code></td><td>wzorzec: <code>%</code> dowolny ciąg, <code>_</code> jeden znak</td><td><code>ename LIKE 'Kowal%'</code></td></tr>
    <tr><td><code>NOT, AND, OR</code></td><td>logika (w tej kolejności ważności)</td><td><code>NOT (a AND b)</code></td></tr>
  </tbody>
</table>
<div data-code="wh-ops"></div>
<div data-note="lecture"><p><code>LIKE</code> zadziała też na liczbach i datach (serwer sam zamieni je na tekst, np. <code>hiredate LIKE '%81%'</code>), ale jest to wolne — dla liczb używaj porównań i BETWEEN, dla dat funkcji daty.</p></div>

<h3>Kolejność operatorów logicznych</h3>
<p><code>AND</code> ma wyższy priorytet niż <code>OR</code>. Bez nawiasów łatwo o błędny wynik:</p>
<div data-code="wh-precedence"></div>
<div data-code="wh-tuple"></div>
<div data-note="exam"><p><code>WHERE comm = comm</code> zwróci tylko 4 wiersze (tam, gdzie comm nie jest NULL), bo <code>NULL = NULL</code> to NULL. Natomiast <code>WHERE empno = empno</code> zwróci wszystkie wiersze — klucz główny nigdy nie jest NULL. A <code>WHERE 1 = 1</code> zawsze jest TRUE.</p></div>

<h2>Dane z wielu tabel</h2>
<p>Dane są rozłożone w wielu tabelach połączonych parami <strong>klucz główny – klucz obcy</strong>. Żeby je połączyć, szukamy wierszy, w których te wartości są równe.</p>
<p>Eksperyment: <code>SELECT … FROM Emp, Dept</code> bez warunku zwraca <strong>56 wierszy</strong> (14 × 4) — każdy pracownik z każdym działem. To <strong>iloczyn kartezjański</strong>. Są w nim „prawdziwe” wiersze (pracownik + jego dział) i mnóstwo fałszywych. Warunek złączenia wybiera tylko prawdziwe.</p>
<div data-code="j-cartesian"></div>
<div data-code="j-where"></div>
<div data-note="analogy"><p>Wyobraź sobie, że układasz każdą kartę pracownika obok każdej karty działu (56 par), a potem zostawiasz tylko pary, w których numer działu na obu kartach jest ten sam.</p></div>

<h2>INNER JOIN</h2>
<p>Ten sam wynik, ale warunek złączenia zapisujemy w <code>FROM</code>: <code>T1 JOIN T2 ON warunek</code>. Serwer wykonuje oba zapisy tak samo, ale JOIN jest czytelniejszy: <strong>złączenia w FROM, filtry w WHERE</strong>.</p>
<div data-code="j-inner"></div>
<p>INNER JOIN zwraca tylko wiersze, dla których warunek ON jest TRUE. Pracownik z <code>deptno = NULL</code> i dział bez pracowników <strong>nie pojawią się</strong> w wyniku. Klucz złożony łączymy przez <code>ON t1.k1 = t2.k1 AND t1.k2 = t2.k2</code>.</p>

<h2>OUTER JOIN — złączenia zewnętrzne</h2>
<table>
  <thead><tr><th>Złączenie</th><th>Co dodatkowo trafia do wyniku</th></tr></thead>
  <tbody>
    <tr><td><code>LEFT [OUTER] JOIN</code></td><td>wszystkie wiersze tabeli z <strong>lewej</strong> strony, nawet bez pary (brakujące kolumny = NULL)</td></tr>
    <tr><td><code>RIGHT [OUTER] JOIN</code></td><td>wszystkie wiersze tabeli z <strong>prawej</strong> strony</td></tr>
    <tr><td><code>FULL [OUTER] JOIN</code></td><td>wszystkie wiersze z obu stron (suma LEFT i RIGHT)</td></tr>
  </tbody>
</table>
<div data-code="j-outer"></div>

<h2>CROSS JOIN, złączenie nierównościowe i samozłączenie</h2>
<ul>
  <li><code>CROSS JOIN</code> — jawnie zapisany iloczyn kartezjański.</li>
  <li>Warunek złączenia nie musi być równością kluczy — liczy się, czy ON daje TRUE. Emp i Salgrade łączymy warunkiem <code>sal BETWEEN losal AND hisal</code>.</li>
  <li><strong>Samozłączenie</strong> (związek rekurencyjny): ta sama tabela występuje dwa razy, więc <strong>musi</strong> mieć dwa różne aliasy (np. K = szef, P = podwładny).</li>
</ul>
<div data-code="j-other"></div>

<h2>Operatory na zbiorach</h2>
<p>Wyniki SELECT to relacje, więc można je łączyć jak zbiory. Warunek: te same liczby kolumn, w tej samej kolejności i o zgodnych typach.</p>
<ul>
  <li><code>UNION</code> — suma bez powtórzeń; <code>UNION ALL</code> — z powtórzeniami (szybsze);</li>
  <li><code>INTERSECT</code> — część wspólna;</li>
  <li><code>EXCEPT</code> (standard, MS SQL) / <code>MINUS</code> (Oracle) — różnica.</li>
</ul>
<div data-code="set-ops"></div>
<div data-note="tip"><p>Aliasy tabel (<code>Emp e</code>) skracają zapis i są niezbędne przy samozłączeniu. W MS SQL identyfikator ze spacją można też ująć w <code>[nawiasy]</code>.</p></div>
`,
  cheat: `
<ul>
  <li>WHERE przepuszcza tylko <strong>TRUE</strong> (FALSE i NULL odpadają).</li>
  <li>NULL sprawdzamy <code>IS NULL</code> / <code>IS NOT NULL</code>, nigdy <code>= NULL</code>.</li>
  <li><code>BETWEEN a AND b</code> — przedział domknięty. <code>LIKE</code>: <code>%</code> ciąg, <code>_</code> znak.</li>
  <li>Priorytet: <code>NOT &gt; AND &gt; OR</code> → używaj nawiasów.</li>
  <li><code>(a, b) IN ((…), (…))</code> — tylko Oracle.</li>
  <li><code>FROM A, B</code> bez warunku = iloczyn kartezjański (14×4 = 56).</li>
  <li><code>A JOIN B ON A.fk = B.pk</code> — tylko pary. <code>LEFT</code>/<code>RIGHT</code>/<code>FULL</code> — plus wiersze bez pary (NULL-e).</li>
  <li>Oracle: <code>A.x (+) = B.x</code> — stary zapis złączenia zewnętrznego.</li>
  <li>Nierównościowe: <code>JOIN Salgrade ON sal BETWEEN losal AND hisal</code>.</li>
  <li>Samozłączenie: <code>FROM Emp k JOIN Emp p ON k.empno = p.mgr</code>.</li>
  <li><code>UNION</code> (bez duplikatów), <code>UNION ALL</code>, <code>INTERSECT</code>, <code>EXCEPT</code> (MS) / <code>MINUS</code> (Oracle).</li>
</ul>
`
},

'group-by': {
  title: 'Funkcje agregujące, GROUP BY i HAVING',
  lead: 'Liczenie, sumy i średnie — dla całej tabeli i dla grup wierszy. Najważniejsza reguła grupowania i różnica WHERE / HAVING.',
  body: `
<h2>Funkcje agregujące</h2>
<p>Do tej pory SELECT zwracał dane wiersz po wierszu. Zapytania <strong>agregujące</strong> zwracają informację o zbiorze wierszy: ile ich jest, ile wynosi suma, średnia…</p>
<table>
  <thead><tr><th>Funkcja</th><th>Zwraca</th></tr></thead>
  <tbody>
    <tr><td><code>COUNT</code></td><td>liczbę wierszy / wartości</td></tr>
    <tr><td><code>SUM</code></td><td>sumę</td></tr>
    <tr><td><code>AVG</code></td><td>średnią</td></tr>
    <tr><td><code>MIN</code>, <code>MAX</code></td><td>najmniejszą / największą wartość</td></tr>
  </tbody>
</table>
<p>Argumentem może być wyrażenie albo <code>DISTINCT wyrażenie</code>. <strong>Wartości NULL są pomijane</strong>.</p>
<div data-code="g-agg"></div>

<h3>COUNT — na co uważać</h3>
<p><code>COUNT</code> liczy <strong>znaczące (nie-NULL) wystąpienia argumentu</strong>. Dla stałej (<code>COUNT(1)</code>, <code>COUNT('Ala')</code>) i gwiazdki (<code>COUNT(*)</code>) wynik to liczba wierszy. Dla kolumny — liczba wartości różnych od NULL.</p>
<div data-code="g-count"></div>
<div data-note="lecture"><p>Liczenie stałej nie zmusza serwera do czytania danych. Ale funkcja jako argument (np. <code>COUNT(GETDATE())</code>) to zły pomysł — liczy się ją osobno dla każdego wiersza.</p></div>

<h2>GROUP BY</h2>
<p><code>GROUP BY wyrażenia</code> dzieli wiersze na grupy o <strong>jednakowych wartościach</strong> tych wyrażeń. Funkcje agregujące liczą się wtedy osobno dla każdej grupy, a każda grupa daje <strong>jeden wiersz</strong> wyniku.</p>
<ul>
  <li><code>GROUP BY job</code> — tyle grup, ile różnych stanowisk;</li>
  <li><code>GROUP BY deptno, job</code> — tyle grup, ile różnych <em>par</em> (dział, stanowisko);</li>
  <li>NULL w wyrażeniu grupującym tworzy <strong>osobną grupę</strong>.</li>
</ul>
<div data-code="g-group"></div>
<div data-note="analogy"><p>Rozsypujesz karty pracowników na kupki według numeru działu. Potem dla każdej kupki liczysz: ile kart, suma płac, średnia. Wynik to jedna linijka na kupkę — szczegółów pojedynczych kart już nie widać.</p></div>

<h2>HAVING</h2>
<p><code>HAVING</code> to filtr dla <strong>grup</strong> — działa po grupowaniu i policzeniu agregatów. Wolno w nim używać funkcji agregujących.</p>
<div data-code="g-having"></div>

<h2>Złota reguła grupowania</h2>
<div data-note="exam"><p>Gdy jest <code>GROUP BY</code>, to na liście <code>SELECT</code>, w <code>HAVING</code> i w <code>ORDER BY</code> mogą być <strong>tylko</strong>:</p>
<ul>
  <li>stałe,</li>
  <li>funkcje agregujące,</li>
  <li>kolumny i wyrażenia, które są w <code>GROUP BY</code>.</li>
</ul>
<p>Powód: po zgrupowaniu nie ma już dostępu do pojedynczych wierszy — jest jeden wiersz na grupę.</p></div>
<div data-code="g-error"></div>
<p>Co, jeśli chcemy znać <em>nazwisko</em> osoby z najniższą płacą w dziale? Dopisanie <code>ename</code> do GROUP BY „działa”, ale daje złą odpowiedź: każda osoba staje się osobną grupą. Poprawnie robi się to <strong>podzapytaniem</strong>, funkcją analityczną albo CTE (następny temat).</p>

<h2>WHERE czy HAVING?</h2>
<ul>
  <li><strong>WHERE</strong> działa <strong>podczas odczytu wierszy</strong> — przed grupowaniem. Nie wolno w nim używać agregatów.</li>
  <li><strong>HAVING</strong> działa <strong>po grupowaniu</strong> — na gotowych grupach.</li>
  <li>Warunków, które da się sprawdzić w WHERE, nie przenoś do HAVING — serwer niepotrzebnie przeczyta i zgrupuje wiersze, które i tak wyrzuci. Ogólna zasada: <strong>eliminuj zbędne wiersze jak najwcześniej</strong>.</li>
</ul>
<div data-code="g-where-having"></div>

<h2>Jak serwer wykonuje zapytanie grupujące (koncepcyjnie)</h2>
<ol class="steps">
  <li>Weź wszystkie kombinacje wierszy tabel z FROM (iloczyn kartezjański).</li>
  <li>Zastosuj WHERE (w tym warunki złączeń) — zostaw tylko TRUE.</li>
  <li>Podziel pozostałe wiersze na grupy wg GROUP BY.</li>
  <li>Dla każdej grupy policz wyrażenia z listy SELECT (agregaty).</li>
  <li>Zastosuj HAVING — zostaw tylko grupy z TRUE.</li>
  <li>Jeśli jest DISTINCT — usuń duplikaty.</li>
  <li>Jeśli są operatory zbiorowe (UNION…) — zastosuj je.</li>
  <li>Jeśli jest ORDER BY — posortuj.</li>
</ol>
<p>To model myślowy — prawdziwy serwer optymalizuje to po swojemu. Grupowanie wymaga sortowania, więc jest kosztowne.</p>
<div data-note="tip"><p>Wyjątek w Oracle: <code>GROUP BY</code> i <code>HAVING</code> mogą zamienić się miejscami. W MS SQL — nie.</p></div>
`,
  cheat: `
<ul>
  <li>Agregaty: <code>COUNT, SUM, AVG, MIN, MAX</code>; <strong>NULL pomijany</strong>; można <code>DISTINCT</code>.</li>
  <li><code>COUNT(*)</code> = <code>COUNT(1)</code> = liczba wierszy; <code>COUNT(kol)</code> = liczba nie-NULL.</li>
  <li>Bez GROUP BY agregat → 1 wiersz. <code>GROUP BY a, b</code> → 1 wiersz na każdą kombinację (NULL = osobna grupa).</li>
  <li><strong>Reguła:</strong> w SELECT/HAVING/ORDER BY tylko: stałe, agregaty, wyrażenia z GROUP BY.</li>
  <li>Błąd: MS SQL <em>Msg 8120</em>, Oracle <em>ORA-00979</em> — brakuje kolumny w GROUP BY.</li>
  <li><strong>WHERE</strong> = filtr wierszy (przed grupowaniem, bez agregatów). <strong>HAVING</strong> = filtr grup (po, z agregatami).</li>
  <li>Filtruj jak najwcześniej (WHERE zamiast HAVING, gdy się da).</li>
  <li>Kolejność: FROM → WHERE → GROUP BY → agregaty → HAVING → DISTINCT → UNION → ORDER BY.</li>
</ul>
`
},

'subqueries': {
  title: 'Podzapytania, EXISTS i CTE',
  lead: 'Jak użyć wyniku jednego SELECT wewnątrz drugiego: podzapytania zwykłe i skorelowane, IN, ALL/ANY, EXISTS i WITH.',
  body: `
<h2>Idea podzapytania</h2>
<p>Chcemy znaleźć najlepiej zarabiającego pracownika. Można w dwóch krokach: najpierw <code>SELECT MAX(sal)</code> (wynik 5000), potem <code>WHERE sal = 5000</code>. W czystym SQL nie mamy zmiennych, żeby przenieść wynik — ale możemy wstawić <strong>całe zapytanie</strong> w miejsce wartości. To jest <strong>podzapytanie</strong>.</p>
<ul>
  <li>Podzapytanie to SELECT w <strong>nawiasach</strong>, bez średnika w środku.</li>
  <li>Może wystąpić w <code>WHERE</code>, <code>HAVING</code>, <code>FROM</code> (oraz w INSERT/UPDATE/DELETE).</li>
  <li>W jednej klauzuli może być kilka podzapytań; podzapytania można zagnieżdżać.</li>
  <li>W podzapytaniu <strong>nie używamy ORDER BY</strong>.</li>
</ul>
<div data-code="sq-simple"></div>

<h2>Ile wartości zwraca podzapytanie?</h2>
<ul>
  <li>Przy <code>=, &lt;, &gt;, &lt;=, &gt;=, &lt;&gt;</code> podzapytanie musi zwrócić <strong>dokładnie jedną wartość</strong> — inaczej błąd.</li>
  <li>Gdy zwraca wiele wierszy — używamy <code>IN</code> / <code>NOT IN</code> albo kwantyfikatorów <code>ALL</code> / <code>ANY</code>.</li>
</ul>

<h2>IN, NOT IN i pułapka z NULL</h2>
<div data-code="sq-in"></div>
<div data-note="warn"><p><strong>NOT IN z NULL na liście zawsze daje pusty wynik.</strong> Warunek <code>x NOT IN (a, b, NULL)</code> to <code>x&lt;&gt;a AND x&lt;&gt;b AND x&lt;&gt;NULL</code>, a <code>x&lt;&gt;NULL</code> daje NULL — więc całość nigdy nie jest TRUE. Rozwiązania: <code>WHERE … IS NOT NULL</code> w podzapytaniu (proste i bezpieczne) albo <code>NOT EXISTS</code> (najbardziej eleganckie). <code>NVL(mgr, 0)</code> też „działa”, ale tylko jeśli 0 nigdy nie jest prawdziwą wartością — ryzykowne.</p></div>
<p>Oracle pozwala porównywać listy: <code>WHERE (sal, job) IN (SELECT MAX(sal), job FROM Emp GROUP BY job)</code> — najlepiej zarabiający na każdym stanowisku. MS SQL tego nie ma.</p>

<h2>ALL i SOME (ANY)</h2>
<ul>
  <li><code>&gt;= ALL (…)</code> — większe lub równe <strong>każdej</strong> wartości → czyli maksimum;</li>
  <li><code>&gt;= SOME (…)</code> = <code>&gt;= ANY (…)</code> — większe lub równe <strong>którejkolwiek</strong> → czyli minimum. SOME i ANY to synonimy.</li>
</ul>
<div data-code="sq-all-any"></div>

<h2>Podzapytanie w FROM i CTE</h2>
<p>Podzapytanie w FROM działa jak tabela tworzona „w locie” — musi dostać alias. Przy wielu takich podzapytaniach lepiej użyć widoku albo <strong>CTE (Common Table Expression)</strong>: <code>WITH nazwa (kolumny) AS (SELECT …)</code>, a zaraz po nim zapytanie, które z tej nazwy korzysta.</p>
<div data-code="sq-from-cte"></div>

<h2>Podzapytania skorelowane</h2>
<p>W podzapytaniu <strong>zwykłym</strong> wynik nie zależy od zapytania zewnętrznego — można je uruchomić osobno. W <strong>skorelowanym</strong> podzapytanie odwołuje się do kolumny zapytania zewnętrznego, więc (koncepcyjnie) wykonuje się <strong>osobno dla każdego wiersza</strong> zewnętrznego.</p>
<p>Przykład: „dla każdego działu osoba z najwyższą płacą”. Dla wiersza pracownika <code>a</code> liczymy MAX płac w <em>jego</em> dziale (<code>b.deptno = a.deptno</code>) i porównujemy.</p>

<h2>EXISTS i NOT EXISTS</h2>
<p>Czasem nie interesuje nas wartość, tylko to, <strong>czy podzapytanie coś zwraca</strong>. <code>EXISTS (…)</code> jest TRUE, jeśli istnieje choć jeden wiersz. Na liście SELECT wewnątrz piszemy cokolwiek (<code>1</code> lub <code>'x'</code>) — liczą się wiersze, nie wartości. Serwerowi wystarczy znaleźć pierwszy pasujący wiersz.</p>
<div data-code="sq-corr"></div>
<div data-note="exam"><p>Klasyczne zadania na NOT EXISTS: „działy bez pracowników”, „pracownicy, którzy nie są szefami”, „klienci, którzy nigdy nie kupili X”. NOT EXISTS nie ma problemu z NULL, który psuje NOT IN.</p></div>
<p>Podzapytania można też używać w <code>INSERT</code> (źródło wierszy), <code>DELETE</code> (warunek) i <code>UPDATE</code> (warunek albo nowa wartość) — zobacz temat DML.</p>
`,
  cheat: `
<ul>
  <li>Podzapytanie: <code>(SELECT …)</code> w WHERE, HAVING, FROM; bez ORDER BY; można zagnieżdżać.</li>
  <li>Z <code>= &lt; &gt;</code> — dokładnie 1 wartość. Wiele wartości → <code>IN</code>, <code>ALL</code>, <code>ANY/SOME</code>.</li>
  <li><strong>NOT IN + NULL na liście = pusty wynik!</strong> Dodaj <code>WHERE kol IS NOT NULL</code> albo użyj <code>NOT EXISTS</code>.</li>
  <li><code>&gt;= ALL</code> ≈ maksimum, <code>&gt;= ANY</code> ≈ minimum.</li>
  <li><code>(a, b) IN (SELECT …)</code> i <code>MAX(AVG(…))</code> — tylko Oracle.</li>
  <li>Podzapytanie w FROM musi mieć alias. Alternatywa: widok, <code>WITH x AS (…) SELECT …</code> (CTE).</li>
  <li><strong>Skorelowane</strong>: podzapytanie używa kolumny z zewnątrz (<code>b.deptno = a.deptno</code>).</li>
  <li><code>[NOT] EXISTS (SELECT 1 …)</code> — sprawdza, czy są wiersze; typowe: „bez…”, „nigdy nie…”.</li>
</ul>
`
},

'dml': {
  title: 'DML: INSERT, UPDATE, DELETE, transakcje, TRUNCATE',
  lead: 'Wstawianie, zmiana i usuwanie danych w obu dialektach, zatwierdzanie zmian i różnica DELETE / TRUNCATE.',
  body: `
<h2>Zasada ogólna</h2>
<p>Polecenia DML (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) zawsze działają na <strong>jednej tabeli</strong>. Różnice między dialektami są tu większe niż w SELECT.</p>

<h2>INSERT</h2>
<p><strong>Składnia pełna</strong> — podajemy listę kolumn i listę wartości w tej samej kolejności. Pominąć można kolumny, które dopuszczają NULL, mają DEFAULT, są wyliczane albo generowane automatycznie (IDENTITY).</p>
<p><strong>Składnia skrócona</strong> — bez listy kolumn; trzeba wtedy podać wartości dla <strong>wszystkich</strong> kolumn w kolejności z <code>CREATE TABLE</code>. „Uproszczenie” jest często złudne (np. przy kolumnie IDENTITY w starszych MS SQL).</p>
<div data-code="dml-insert"></div>
<div data-code="dml-insert-many"></div>
<div data-code="dml-insert-select"></div>
<div data-note="warn"><p><code>MAX(id) + 1</code> to szybki sposób na nowy klucz, ale przy wielu użytkownikach naraz dwie osoby mogą dostać ten sam numer. W prawdziwych systemach używa się IDENTITY albo sekwencji (temat DDL).</p></div>

<h3>Nowa tabela z wyniku SELECT</h3>
<div data-code="dml-ctas"></div>
<div data-note="warn"><p>W Oracle podobna składnia <code>SELECT … INTO zmienne</code> służy w PL/SQL do <strong>przypisania wartości do zmiennych</strong>, a nie do tworzenia tabel. Nie myl tych dwóch!</p></div>

<h2>UPDATE</h2>
<p><code>UPDATE tabela SET kolumna = wyrażenie, … [WHERE warunek]</code>. Zmieniane są wiersze, dla których WHERE daje TRUE. <strong>Brak WHERE = zmiana wszystkich wierszy.</strong> W WHERE i w SET mogą być podzapytania (także skorelowane).</p>
<div data-code="dml-update"></div>
<p>MS SQL ma dodatkowo składnię <code>UPDATE … SET … FROM inna_tabela WHERE warunek_złączenia</code> (bez funkcji agregujących w SET) — szczegóły w temacie T-SQL dla zaawansowanych.</p>

<h2>DELETE</h2>
<p><code>DELETE FROM tabela [WHERE warunek]</code> usuwa <strong>całe wiersze</strong>. Nie może złamać więzów referencyjnych: jeśli choć jeden usuwany wiersz jest wskazywany kluczem obcym (a akcja to NO ACTION), cała operacja zostanie zablokowana. Najpierw trzeba „odpiąć” lub usunąć wiersze podrzędne.</p>
<div data-code="dml-delete"></div>

<h2>Transakcje: COMMIT i ROLLBACK</h2>
<p><strong>Transakcja</strong> to zestaw poleceń, które wykonują się <em>wszystkie albo żadne</em>.</p>
<ul>
  <li><code>COMMIT</code> — zatwierdź (utrwal) zmiany od ostatniego COMMIT/ROLLBACK;</li>
  <li><code>ROLLBACK</code> — wycofaj te zmiany.</li>
</ul>
<p>Dwa tryby pracy serwera:</p>
<ul>
  <li><strong>autocommit</strong> (domyślny w MS SQL) — każde poprawne polecenie zatwierdza się samo; żeby objąć transakcją kilka poleceń, piszemy <code>BEGIN TRANSACTION … COMMIT/ROLLBACK</code>;</li>
  <li><strong>bez autocommit</strong> — zmiany są nietrwałe, dopóki nie wykonasz COMMIT (w MS SQL: <code>SET IMPLICIT_TRANSACTIONS ON</code>).</li>
</ul>
<p>Więcej o transakcjach: wykład z administrowania.</p>

<h2>TRUNCATE</h2>
<p><code>TRUNCATE TABLE tabela</code> usuwa <strong>wszystkie</strong> wiersze (nie ma WHERE) i działa dużo szybciej niż DELETE, bo nie blokuje każdego wiersza osobno. TRUNCATE należy do <strong>DDL</strong>! Stąd ważna różnica:</p>
<table>
  <thead><tr><th></th><th>Oracle</th><th>MS SQL Server</th></tr></thead>
  <tbody>
    <tr><td>TRUNCATE + ROLLBACK</td><td>dane <strong>znikają na zawsze</strong> (DDL nie jest transakcyjne)</td><td>dane <strong>wracają</strong> (DDL jest transakcyjne)</td></tr>
    <tr><td>Licznik IDENTITY</td><td>—</td><td>TRUNCATE go <strong>resetuje</strong></td></tr>
  </tbody>
</table>
<div data-code="dml-truncate"></div>

<h2>GRANT i REVOKE</h2>
<p>Dla porządku: <code>GRANT</code> nadaje użytkownikowi prawo do operacji na obiekcie, <code>REVOKE</code> je odbiera. Szczegóły — wykład o uprawnieniach.</p>
`,
  cheat: `
<ul>
  <li>DML działa zawsze na <strong>jednej</strong> tabeli.</li>
  <li><code>INSERT INTO t (k1, k2) VALUES (v1, v2);</code> — zalecana pełna składnia.</li>
  <li>Wiele wierszy: MS SQL <code>VALUES (…), (…)</code>; Oracle <code>INSERT ALL INTO … INTO … SELECT * FROM dual</code>.</li>
  <li><code>INSERT … SELECT …</code> zamiast VALUES. Nowy klucz: <code>SELECT ISNULL/NVL(MAX(id),0)+1</code>.</li>
  <li>Nowa tabela: MS SQL <code>SELECT … INTO nowa FROM …</code>; Oracle <code>CREATE TABLE nowa AS SELECT …</code>.</li>
  <li><code>UPDATE t SET k = w WHERE …</code> — bez WHERE zmienia wszystko!</li>
  <li><code>DELETE FROM t WHERE …</code> — blokowane przez FK (NO ACTION).</li>
  <li><code>COMMIT</code> utrwala, <code>ROLLBACK</code> wycofuje. MS SQL: autocommit; <code>BEGIN TRAN</code> lub <code>SET IMPLICIT_TRANSACTIONS ON</code>.</li>
  <li><code>TRUNCATE</code> = DDL, szybki, bez WHERE. ROLLBACK: Oracle — nie cofnie, MS SQL — cofnie. MS SQL resetuje IDENTITY.</li>
</ul>
`
},

'ddl': {
  title: 'DDL: tabele, więzy, IDENTITY i sekwencje',
  lead: 'CREATE / ALTER / DROP w obu dialektach: deklarowanie więzów, automatyczne numerowanie, akcje referencyjne i zmiany schematu.',
  body: `
<h2>Polecenia DDL</h2>
<p>DDL operuje na <strong>obiektach</strong> bazy: tabelach, widokach, indeksach, procedurach, wyzwalaczach, a w MS SQL także całych bazach (<code>CREATE DATABASE</code>). Schemat zawsze ten sam:</p>
<p class="formula">CREATE | ALTER | DROP  typ_obiektu  nazwa_obiektu  …</p>
<p>Na RBD tabele tworzyło za was narzędzie CASE. Teraz piszemy DDL ręcznie — a składnia obu dialektów trochę się różni, więc skrypty nie zawsze da się po prostu przenieść.</p>

<h2>CREATE TABLE</h2>
<ul>
  <li>Nazwa: max <strong>30 znaków w Oracle</strong> (dotyczy wszystkich nazw, także więzów!), 128 w MS SQL.</li>
  <li>Oracle: max 1000 kolumn; MS SQL: max 8060 bajtów na wiersz.</li>
  <li>Nazwy zaczynaj od łacińskiej litery, używaj liter, cyfr i <code>_</code>. Polskie znaki i spacje formalnie bywają dopuszczalne, ale proszą się o kłopoty.</li>
</ul>

<h2>Więzy spójności — przypomnienie</h2>
<p>Zasada: <strong>my definiujemy reguły, SZBD ich pilnuje</strong> — przy każdej operacji, transakcji, imporcie, bez względu na to, kto ją wykonuje. Kontrola w aplikacji też jest przydatna (mniej ruchu w sieci), ale naturalnym miejscem jest serwer.</p>
<table>
  <thead><tr><th>Więzy</th><th>Znaczenie</th></tr></thead>
  <tbody>
    <tr><td><code>NOT NULL</code></td><td>kolumna musi mieć wartość</td></tr>
    <tr><td><code>PRIMARY KEY</code></td><td>klucz główny (jedna lub kilka kolumn)</td></tr>
    <tr><td><code>FOREIGN KEY … REFERENCES t</code></td><td>klucz obcy do klucza głównego tabeli t</td></tr>
    <tr><td><code>UNIQUE</code></td><td>bez powtórzeń</td></tr>
    <tr><td><code>CHECK (warunek)</code></td><td>warunek dla wstawianych/zmienianych wartości</td></tr>
    <tr><td><code>DEFAULT wartość</code></td><td>wartość domyślna</td></tr>
  </tbody>
</table>
<p>Każde więzy mają nazwę unikalną w bazie. Jeśli jej nie podasz, serwer wymyśli własną (brzydką). Własną nazwę nadajesz słowem <code>CONSTRAINT nazwa</code> — przydaje się, gdy potem chcesz więzy usunąć lub wyłączyć.</p>
<div data-code="ddl-inline"></div>
<div data-note="tip"><p>Więzy dla kilku kolumn (np. złożony klucz główny) muszą być zapisane „poza linią”.</p></div>

<h2>Automatyczne numerowanie</h2>
<h3>IDENTITY (MS SQL)</h3>
<p>Jedna kolumna w tabeli może mieć właściwość <code>IDENTITY(start, krok)</code> (domyślnie 1, 1). Serwer sam wpisuje kolejne liczby — w INSERT tę kolumnę <strong>pomijamy</strong>, a próba wpisania wartości kończy się błędem.</p>
<div data-code="ddl-identity"></div>
<div data-note="lecture"><p>Prowadzący z przekąsem opisuje typową historię: student używa skróconego INSERT bez listy kolumn, dostaje błąd, więc „wygooglowuje” <code>SET IDENTITY_INSERT … ON</code> — i właśnie wyłączył mechanizm, który miał go wyręczać. Wniosek: pisz INSERT z listą kolumn, a IDENTITY_INSERT zostaw administratorom.</p></div>
<p>Ostatnio wygenerowaną wartość odczytasz przez <code>SCOPE_IDENTITY()</code> (w bieżącym zasięgu — lepsze) lub <code>@@IDENTITY</code> (ostatnia w sesji). Oracle od wersji 12c też ma IDENTITY — w trzech wariantach (temat PL/SQL dla zaawansowanych).</p>
<h3>Sekwencje</h3>
<p><strong>Sekwencja</strong> to osobny obiekt generujący liczby, niezależny od tabel (Oracle; MS SQL od 2012). Można jej używać w kilku tabelach i poza nimi.</p>
<div data-code="ddl-sequence"></div>

<h2>ALTER TABLE</h2>
<p>Zmiany kolumn i więzów w istniejącej tabeli. Oracle używa <code>MODIFY</code> i nawiasów, MS SQL — <code>ALTER COLUMN</code>. W MS SQL NOT NULL i DEFAULT to właściwości kolumny/więzy; w Oracle NOT NULL i DEFAULT to właściwości kolumny zmieniane przez MODIFY.</p>
<div data-code="ddl-alter"></div>
<div data-note="warn"><p>CHECK przepuszcza wartości, dla których warunek jest TRUE <strong>albo NULL</strong>; blokuje tylko FALSE. Nowej kolumny NOT NULL nie dodasz do tabeli z wierszami — najpierw dodaj kolumnę, wypełnij ją, potem nałóż NOT NULL (w Oracle pomaga DEFAULT).</p></div>
<div data-note="lecture"><p>W specyfikacji DEFAULT mogą być stałe i funkcje SQL (GETDATE, SYSDATE), ale nie nazwy kolumn ani funkcje T-SQL/PL/SQL. W Oracle w DEFAULT nie wolno użyć sekwencji (w MS SQL wolno — zobacz przykład z tabelą Kontener).</p></div>

<h3>Klucze obce i akcje referencyjne</h3>
<p>Klucz obcy można dodać później przez ALTER TABLE — to jedyne wyjście przy <strong>związkach cyklicznych</strong> (A wskazuje na B, a B na A): najpierw tworzysz obie tabele, potem dodajesz FK.</p>
<table>
  <thead><tr><th>Akcja przy DELETE</th><th>Co się dzieje z wierszami podrzędnymi</th><th>Oracle</th></tr></thead>
  <tbody>
    <tr><td><code>NO ACTION</code> (domyślna)</td><td>błąd, usunięcie zablokowane</td><td>tak</td></tr>
    <tr><td><code>CASCADE</code></td><td>usuwane razem z nadrzędnym (dobre dla tabel asocjacyjnych)</td><td>tak</td></tr>
    <tr><td><code>SET NULL</code></td><td>FK := NULL</td><td>tak</td></tr>
    <tr><td><code>SET DEFAULT</code></td><td>FK := wartość domyślna</td><td><strong>nie</strong></td></tr>
  </tbody>
</table>
<div data-code="ddl-fk"></div>

<h2>Wyłączanie więzów</h2>
<p>Da się wyłączyć więzy i wpisać dane, które je łamią — ale to <strong>operacja specjalna</strong>, tylko dla administratora, nigdy sposób na „obejście zabezpieczeń”. Dopóki złe dane są w tabeli, więzów nie włączysz ponownie.</p>
<div data-code="ddl-disable"></div>

<h2>DROP i przykładowy scenariusz</h2>
<p><code>DROP TABLE t</code> usuwa tabelę razem z danymi. Nie uda się, jeśli inne tabele mają do niej klucze obce (z NO ACTION) — usuwaj od tabel podrzędnych.</p>
<div data-code="ddl-scenario"></div>
`,
  cheat: `
<ul>
  <li><code>CREATE | ALTER | DROP typ nazwa</code>. Oracle: nazwy ≤ 30 znaków.</li>
  <li>Więzy: NOT NULL, PRIMARY KEY, FOREIGN KEY … REFERENCES, UNIQUE, CHECK, DEFAULT. Nazwa: <code>CONSTRAINT nazwa …</code>.</li>
  <li>Więzy wielokolumnowe — „poza linią”: <code>PRIMARY KEY (a, b)</code>.</li>
  <li>MS SQL: <code>INT IDENTITY(start, krok)</code>; w INSERT pomijamy; <code>SCOPE_IDENTITY()</code>; <code>SET IDENTITY_INSERT t ON</code> — tylko admin.</li>
  <li>Sekwencje: MS SQL <code>NEXT VALUE FOR s</code>; Oracle <code>s.NEXTVAL</code>, <code>s.CURRVAL</code>.</li>
  <li>ALTER: MS SQL <code>ADD / ALTER COLUMN / DROP COLUMN</code>; Oracle <code>ADD (…) / MODIFY (…) / DROP COLUMN</code>.</li>
  <li><code>ALTER TABLE t ADD CONSTRAINT c CHECK (…)</code>; <code>DROP CONSTRAINT c</code>.</li>
  <li>CHECK blokuje tylko FALSE (NULL przechodzi).</li>
  <li>ON DELETE: NO ACTION (dom.), CASCADE, SET NULL, SET DEFAULT (brak w Oracle).</li>
  <li>Cykl FK → najpierw tabele, potem <code>ALTER TABLE … ADD FOREIGN KEY</code>.</li>
  <li>Wyłączanie: Oracle <code>DISABLE/ENABLE CONSTRAINT</code>; MS SQL <code>NOCHECK/CHECK CONSTRAINT</code>.</li>
  <li>DROP od tabel podrzędnych.</li>
</ul>
`
},

'views': {
  title: 'Widoki (perspektywy)',
  lead: 'Zapisane zapytania, które wyglądają jak tabele: tworzenie, ograniczenia DML, WITH CHECK OPTION i widoki zmaterializowane.',
  body: `
<h2>Czym jest widok</h2>
<p><strong>Widok</strong> (perspektywa, view) to <strong>nazwana i zapisana w bazie definicja SELECT</strong>, której można używać wiele razy — jak tabeli. Widok <strong>nie przechowuje danych</strong>, tylko przepis na ich odczytanie; wiersze wylicza się przy każdym użyciu.</p>
<div data-note="analogy"><p>Widok to okno z matową szybą w niektórych miejscach: każda grupa użytkowników widzi przez nie tylko te wiersze i kolumny, które powinna — ale dane dalej leżą w tabelach za oknem.</p></div>
<p>Po co widoki:</p>
<ul>
  <li><strong>bezpieczeństwo</strong> — użytkownik widzi tylko swoje dane i nie zna struktury całej bazy;</li>
  <li><strong>wygoda</strong> — złożone zapytanie zapisujesz raz;</li>
  <li>źródło danych dla kontrolek w aplikacjach.</li>
</ul>
<div data-note="lecture"><p>Reguła z wykładu: dane dla użytkowników udostępniaj przez <strong>widoki</strong>, a jeszcze lepiej przez <strong>procedury składowane</strong> — nie bezpośrednio z tabel.</p></div>

<h2>Tworzenie</h2>
<p class="formula">CREATE VIEW nazwa [(kolumna, …)] AS instrukcja_SELECT;</p>
<p>Nazwy kolumn widoku możesz podać w nawiasie, nadać aliasami w SELECT albo zostawić oryginalne. Zmiana definicji: <code>ALTER VIEW</code> (MS SQL) lub <code>CREATE OR REPLACE VIEW</code> (Oracle). Usunięcie: <code>DROP VIEW</code>.</p>
<div data-code="v-create"></div>
<div data-code="v-order"></div>

<h2>DML przez widok</h2>
<p>Postulat Codda mówi, że dane powinno się dać zmieniać przez widoki. Da się — jeśli widok spełnia dość ostre warunki (wtedy jednoznacznie wiadomo, który wiersz tabeli zmienić):</p>
<ul>
  <li>brak <code>DISTINCT</code>;</li>
  <li>w FROM <strong>jedna</strong> tabela (lub jeden modyfikowalny widok);</li>
  <li>na liście SELECT tylko nazwy kolumn (bez wyrażeń);</li>
  <li>w WHERE brak podzapytań;</li>
  <li>brak <code>GROUP BY</code> i <code>HAVING</code>.</li>
</ul>
<p>Widok ze złączeniem Emp i Dept już tych warunków nie spełnia. (Da się to obejść wyzwalaczem <code>INSTEAD OF</code> — temat wyzwalaczy.)</p>

<h2>WITH CHECK OPTION</h2>
<p>Opcja <code>WITH CHECK OPTION</code> sprawdza przy INSERT/UPDATE przez widok, czy nowy/zmieniony wiersz <strong>nadal spełnia WHERE widoku</strong>. Jeśli nie — operacja jest odrzucana. Dzięki temu przez widok nie „wypchniesz” wiersza poza jego zasięg.</p>
<div data-code="v-dml"></div>

<h2>Widoki zmaterializowane (tylko Oracle)</h2>
<p><strong>Perspektywa zmaterializowana</strong> fizycznie <strong>przechowuje</strong> wynik zapytania. Używa się ich do mocno zagregowanych danych, których liczenie trwa długo — głównie w hurtowniach danych. Dane są zawsze <strong>wtórne</strong> (kopia) względem tabel. Typy: read only (domyślny) i updatable (<code>FOR UPDATE</code>). Opcje odświeżania — temat o wydajności.</p>
<div data-code="v-mat"></div>
<div data-note="tip"><p>W MS SQL odpowiednikiem są <strong>widoki indeksowane</strong> (wspomniane na wykładzie o wydajności).</p></div>
`,
  cheat: `
<ul>
  <li>Widok = zapisany SELECT, „wirtualna tabela”, <strong>nie przechowuje danych</strong>.</li>
  <li>Po co: bezpieczeństwo (tylko potrzebne wiersze/kolumny), wygoda. Lepsze od widoków: procedury.</li>
  <li><code>CREATE VIEW v (k1, k2) AS SELECT …;</code> · <code>ALTER VIEW</code> (MS) / <code>CREATE OR REPLACE VIEW</code> (Oracle) · <code>DROP VIEW v</code>.</li>
  <li>MS SQL: ORDER BY w widoku tylko z <code>TOP</code> (np. <code>TOP 99.99 PERCENT</code>).</li>
  <li>DML przez widok: bez DISTINCT, 1 tabela w FROM, same kolumny, bez podzapytań w WHERE, bez GROUP BY/HAVING.</li>
  <li><code>WITH CHECK OPTION</code> — nie pozwala zmienić wiersza tak, by wypadł z widoku.</li>
  <li><code>CREATE MATERIALIZED VIEW</code> (Oracle) — fizyczna kopia wyniku, do hurtowni; <code>FOR UPDATE</code> = modyfikowalna.</li>
</ul>
`
},

'functions': {
  title: 'Przydatne funkcje wbudowane (Suplement)',
  lead: 'Funkcje daty i czasu, konwersji typów i matematyczne w MS SQL Server i Oracle — ściąga z przykładami.',
  body: `
<h2>Po co ten temat</h2>
<p>Suplement do wykładów zbiera najczęściej używane funkcje obu serwerów. Pełna lista jest w dokumentacji — tu masz „przybornik” na ćwiczenia.</p>
<div data-note="warn"><p>W MS SQL po nazwie funkcji <strong>zawsze</strong> są nawiasy, nawet bez argumentów: <code>GETDATE()</code>. W Oracle niektóre funkcje piszemy bez nawiasów: <code>SYSDATE</code>, <code>CURRENT_DATE</code>.</p></div>

<h2>MS SQL Server</h2>
<table>
  <thead><tr><th>Funkcja</th><th>Co robi</th></tr></thead>
  <tbody>
    <tr><td><code>GETDATE()</code>, <code>SYSDATETIME()</code></td><td>bieżąca data i czas (różna precyzja)</td></tr>
    <tr><td><code>DATENAME(część, data)</code></td><td>nazwa części daty jako tekst (np. <code>May</code>)</td></tr>
    <tr><td><code>DATEPART(część, data)</code></td><td>część daty jako liczba (np. 5)</td></tr>
    <tr><td><code>DATEDIFF(część, od, do)</code></td><td>różnica <code>do − od</code> w jednostkach (year, month, day, hour…)</td></tr>
    <tr><td><code>DATEADD(część, n, data)</code></td><td>data przesunięta o n jednostek</td></tr>
    <tr><td><code>DAY()</code>, <code>MONTH()</code>, <code>YEAR()</code></td><td>dzień, miesiąc, rok</td></tr>
    <tr><td><code>CAST(x AS typ)</code>, <code>CONVERT(typ, x, styl)</code></td><td>konwersja; styl = kod formatu daty (np. 107)</td></tr>
    <tr><td><code>ROUND(x, n[, 1])</code></td><td>zaokrąglenie do n miejsc; trzeci argument ≠ 0 = obcięcie</td></tr>
    <tr><td><code>CEILING(x)</code>, <code>FLOOR(x)</code></td><td>w górę / w dół do liczby całkowitej</td></tr>
  </tbody>
</table>
<div data-code="fn-ms"></div>

<h2>Oracle</h2>
<table>
  <thead><tr><th>Funkcja</th><th>Co robi</th></tr></thead>
  <tbody>
    <tr><td><code>SYSDATE</code>, <code>CURRENT_DATE</code></td><td>bieżąca data (systemowa / sesji)</td></tr>
    <tr><td><code>CURRENT_TIMESTAMP</code>, <code>LOCALTIMESTAMP</code></td><td>bieżący czas</td></tr>
    <tr><td><code>EXTRACT(YEAR FROM data)</code></td><td>część daty (YEAR, MONTH, DAY…)</td></tr>
    <tr><td><code>ADD_MONTHS(data, n)</code></td><td>data przesunięta o n miesięcy</td></tr>
    <tr><td><code>MONTHS_BETWEEN(d1, d2)</code></td><td>liczba miesięcy między datami (liczba rzeczywista!)</td></tr>
    <tr><td><code>TO_CHAR</code>, <code>TO_DATE</code>, <code>TO_NUMBER</code></td><td>konwersje z formatem</td></tr>
    <tr><td><code>CAST(x AS typ)</code></td><td>jak w MS SQL, ale dla tekstu podaj długość: <code>VARCHAR2(20)</code></td></tr>
  </tbody>
</table>
<p>Format daty w Oracle zależy od ustawień sesji. Można go zmienić: <code>ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';</code> (działa do końca sesji). Użycie <code>TO_DATE</code> z jawnym formatem uniezależnia kod od tych ustawień.</p>
<div data-code="fn-ora"></div>
<div data-note="own"><p>Do filtrowania po roku w obu serwerach: MS SQL <code>WHERE YEAR(data) = 2025</code>, Oracle <code>WHERE EXTRACT(YEAR FROM data) = 2025</code>. Szybciej działa jednak warunek zakresowy <code>data &gt;= '2025-01-01' AND data &lt; '2026-01-01'</code> — może użyć indeksu (patrz: temat o indeksach).</p></div>
`,
  cheat: `
<ul>
  <li>MS SQL: <code>GETDATE()</code>, <code>DATEPART/DATENAME(part, d)</code>, <code>DATEDIFF(part, od, do)</code>, <code>DATEADD(part, n, d)</code>, <code>YEAR/MONTH/DAY(d)</code>.</li>
  <li>MS SQL: <code>CAST(x AS VARCHAR)</code>, <code>CONVERT(VARCHAR, d, 107)</code>, <code>ROUND(x, n[,1])</code>, <code>CEILING</code>, <code>FLOOR</code>, <code>ISNULL</code>.</li>
  <li>Oracle: <code>SYSDATE</code>, <code>CURRENT_DATE</code>, <code>EXTRACT(YEAR FROM d)</code>, <code>ADD_MONTHS(d, n)</code>, <code>MONTHS_BETWEEN(d1, d2)</code>.</li>
  <li>Oracle: <code>TO_CHAR(d, 'YYYY-MM-DD')</code>, <code>TO_DATE('24-02-2022','DD-MM-YYYY')</code>, <code>CAST(x AS VARCHAR2(20))</code>, <code>NVL</code>.</li>
  <li>Oracle: <code>ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD'</code> — do końca sesji.</li>
  <li>MS SQL zawsze z nawiasami: <code>GETDATE()</code>; Oracle bez: <code>SYSDATE</code>.</li>
</ul>
`
}

});
