/* PL – Moduł 3: T-SQL (MS SQL Server) */
SBD.addContent('pl', {

'tsql-basics': {
  title: 'T-SQL: bloki, zmienne, IF i WHILE',
  lead: 'Pierwszy język proceduralny: jak pisać „programy” w MS SQL Server — zmienne, przypisania, instrukcje warunkowe i pętle.',
  body: `
<h2>Po co język proceduralny</h2>
<p>Czysty SQL nie ma zmiennych, warunków ani pętli. <strong>Transact-SQL (T-SQL)</strong> to rozszerzenie SQL w MS SQL Server (stworzone przez firmę Sybase, rozwijane przez Microsoft), które to dodaje. Kod wykonuje się bezpośrednio na serwerze i można go zapisać jako obiekty bazy: <strong>procedury składowane</strong> i <strong>wyzwalacze</strong>.</p>
<div data-note="analogy"><p>SQL to pojedyncze polecenia („podaj listę”, „dopisz wiersz”). T-SQL pozwala napisać z nich „przepis”: „policz pracowników; jeśli mniej niż 16 — dopisz nowego, w przeciwnym razie wypisz komunikat”.</p></div>

<h2>Blok (skrypt) i GO</h2>
<ul>
  <li><strong>Blok anonimowy</strong> — kod napisany w edytorze (SSMS) i wykonany od razu, ale <em>niezapisany</em> w bazie jako obiekt. Można go trzymać w pliku .sql.</li>
  <li>Składnia T-SQL jest bardzo luźna (średniki opcjonalne, dowolne łamanie linii). Mimo to: pisz każdą instrukcję w nowej linii, stawiaj średniki, rób wcięcia.</li>
  <li><code>GO</code> kończy paczkę (batch). SSMS dodaje je niejawnie; jawnie potrzebne, gdy w jednym oknie uruchamiasz kilka niezależnych części (np. <code>CREATE PROCEDURE</code> musi być pierwszą instrukcją w paczce). <strong>Zmienna żyje do najbliższego GO.</strong></li>
  <li>Wielkość liter w słowach kluczowych i nazwach nie ma znaczenia.</li>
</ul>

<h2>Wypisywanie wyników</h2>
<p><code>PRINT</code> pisze tekst na zakładce <em>Messages</em>, <code>SELECT</code> zwraca zestaw wyników na zakładce <em>Results</em>. Po każdym DML serwer wypisuje „(n rows affected)” — wyłącza to <code>SET NOCOUNT ON</code>.</p>
<div data-code="ts-print"></div>

<h2>Zmienne</h2>
<ul>
  <li>Każdą zmienną trzeba zadeklarować: <code>DECLARE @nazwa TYP</code>. Nazwa <strong>zawsze zaczyna się od @</strong>.</li>
  <li>Typy — takie jak w kolumnach tabel (INT, VARCHAR(n), MONEY, DATE…).</li>
  <li>W jednym DECLARE można zadeklarować kilka zmiennych i od razu nadać im wartości (także wynikiem SELECT w nawiasach).</li>
  <li>DECLARE może być w dowolnym miejscu kodu — byle przed użyciem zmiennej.</li>
  <li>Niezainicjowana zmienna ma wartość <strong>NULL</strong>.</li>
</ul>
<div data-code="ts-vars"></div>
<h3>Zmienne systemowe</h3>
<p>Zaczynają się od <code>@@</code>, nie deklarujemy ich, są tylko do odczytu: <code>@@VERSION</code>, <code>@@ROWCOUNT</code>, <code>@@ERROR</code>, <code>@@IDENTITY</code>, <code>@@FETCH_STATUS</code> i wiele innych.</p>
<div data-code="ts-sysvars"></div>

<h2>Przypisanie: SET i SELECT</h2>
<ul>
  <li><code>SET @x = wyrażenie</code> — przypisuje <strong>jedną</strong> zmienną.</li>
  <li><code>SELECT @x = …, @y = …</code> — może przypisać <strong>kilka</strong> naraz, także wartości z tabeli (<code>SELECT @x = kolumna FROM … WHERE …</code>).</li>
</ul>
<div data-code="ts-assign"></div>
<div data-note="warn"><p>Dwie groźne sytuacje, w których serwer <strong>nie zgłasza błędu</strong>:</p>
<ul>
  <li>SELECT zwraca <strong>wiele wierszy</strong> → zmienna dostaje wartość z <strong>ostatniego</strong>;</li>
  <li>SELECT zwraca <strong>zero wierszy</strong> → zmienna <strong>zachowuje starą wartość</strong> (albo NULL).</li>
</ul>
<p>W PL/SQL (Oracle) obie sytuacje to błędy — to jedna z ważnych różnic.</p></div>
<div data-code="ts-pitfall"></div>
<div data-note="tip"><p>Przy sklejaniu tekstu z liczbą zawsze konwertuj: <code>'Jest ' + CAST(@n AS VARCHAR) + ' osob'</code>. Bez CAST dostaniesz błąd konwersji.</p></div>

<h2>IF … ELSE</h2>
<p class="formula">IF warunek
    instrukcja lub BEGIN … END
[ELSE
    instrukcja lub BEGIN … END]</p>
<ul>
  <li>Gałąź IF wykona się, gdy warunek jest TRUE; ELSE — gdy FALSE <strong>lub NULL</strong>.</li>
  <li>W warunku wolno wszystko, co w WHERE: AND/OR/NOT, LIKE, IN, BETWEEN — a nawet <strong>SELECT w nawiasach</strong>.</li>
  <li>Kilka instrukcji w gałęzi → <code>BEGIN … END</code> (dobry zwyczaj: zawsze).</li>
  <li>Nie ma <code>ELSEIF</code> — zagnieżdżamy <code>ELSE IF …</code>.</li>
</ul>
<div data-code="ts-if"></div>
<div data-code="ts-elseif"></div>

<h2>IF EXISTS</h2>
<p><code>IF [NOT] EXISTS (SELECT …)</code> sprawdza, czy zapytanie zwraca <strong>choć jeden wiersz</strong>. Jest bardzo szybkie — serwer kończy na pierwszym trafieniu. Ta składnia (EXISTS poza SELECT) działa tylko w T-SQL, w Oracle jej nie ma.</p>
<div data-code="ts-ifexists"></div>
<div data-code="ts-ifexists-bad"></div>

<h2>Pętla WHILE</h2>
<p>T-SQL ma tylko jedną pętlę: <code>WHILE warunek</code> — wykonuje się, dopóki warunek jest TRUE. Da się nią zrobić każdy rodzaj powtarzania. Upewnij się, że warunek kiedyś przestanie być prawdziwy, inaczej program „się zapętli”. W bazach pętla najczęściej chodzi razem z kursorem (następny temat).</p>
<div data-code="ts-while"></div>
`,
  cheat: `
<ul>
  <li>T-SQL = SQL + zmienne + IF + WHILE + procedury + wyzwalacze (MS SQL Server).</li>
  <li><code>GO</code> kończy paczkę; zmienne żyją do GO. <code>CREATE PROCEDURE</code> — pierwsza instrukcja paczki.</li>
  <li><code>PRINT 'tekst'</code> → Messages; <code>SELECT</code> → Results. <code>SET NOCOUNT ON</code>.</li>
  <li><code>DECLARE @x INT = 5, @s VARCHAR(20);</code> — nazwa od <strong>@</strong>, domyślnie NULL.</li>
  <li><code>DECLARE @n INT = (SELECT COUNT(1) FROM Emp);</code></li>
  <li><code>SET @x = …</code> (1 zmienna) · <code>SELECT @x = kol, @y = kol2 FROM … WHERE …</code> (kilka).</li>
  <li>Pułapki: wiele wierszy → ostatni; zero wierszy → stara wartość; <strong>bez błędu</strong>!</li>
  <li>Sklejanie: <code>'Jest ' + CAST(@n AS VARCHAR)</code>.</li>
  <li><code>@@ROWCOUNT</code>, <code>@@ERROR</code>, <code>@@IDENTITY</code>, <code>@@FETCH_STATUS</code>.</li>
  <li><code>IF … BEGIN … END ELSE …</code>; brak ELSEIF → <code>ELSE IF</code>. ELSE łapie też NULL.</li>
  <li><code>IF [NOT] EXISTS (SELECT 1 FROM … WHERE …)</code> — tylko T-SQL.</li>
  <li><code>WHILE warunek BEGIN … END</code>; <code>BREAK</code>, <code>CONTINUE</code>.</li>
</ul>
`
},

'tsql-cursors': {
  title: 'T-SQL: kursory',
  lead: 'Jak przejść po wynikach SELECT wiersz po wierszu: DECLARE, OPEN, FETCH, pętla, CLOSE, DEALLOCATE.',
  body: `
<h2>Po co kursor</h2>
<p>Przypisanie <code>SELECT @x = …</code> działa dla jednego wiersza. A co, gdy zapytanie zwraca wiele wierszy i <strong>dla każdego</strong> trzeba zrobić coś innego (np. zależnie od wartości zmienić płacę i wypisać komunikat)? Wtedy używamy <strong>kursora</strong>.</p>
<p>Kursor zapamiętuje wynik SELECT w buforze (w MS SQL — tabela tymczasowa w bazie tempdb) i pozwala pobierać go <strong>wiersz po wierszu</strong> do zmiennych. Można go użyć w bloku, procedurze i wyzwalaczu.</p>
<div data-note="analogy"><p>Kursor to palec, który przesuwasz po liście wydrukowanej przez SELECT: pokazujesz wiersz, przepisujesz jego wartości do zmiennych, robisz swoje — i przesuwasz palec niżej.</p></div>
<div data-note="warn"><p>Kursory są <strong>wolne</strong>. Jeśli zadanie da się zrobić jednym poleceniem SQL (np. UPDATE z WHERE albo skorelowanym UPDATE), rób to bez kursora.</p></div>

<h2>Sześć kroków kursora</h2>
<ol class="steps">
  <li><code>DECLARE nazwa CURSOR FOR SELECT …</code> — definicja (jeszcze nic się nie czyta).</li>
  <li><code>OPEN nazwa</code> — wykonanie SELECT, wiersze trafiają do bufora, dane są blokowane dla innych transakcji. Liczbę wierszy podaje <code>@@CURSOR_ROWS</code>.</li>
  <li><code>FETCH NEXT FROM nazwa INTO @z1, @z2</code> — pobranie wiersza do zmiennych (liczba i typy zmiennych muszą pasować do kolumn).</li>
  <li>Pętla <code>WHILE @@FETCH_STATUS = 0</code> — 0 znaczy „pobrano wiersz”, −1 — „koniec”.</li>
  <li><code>CLOSE nazwa</code> — zwolnienie blokad i bufora (definicja zostaje, można znów OPEN).</li>
  <li><code>DEALLOCATE nazwa</code> — usunięcie definicji kursora.</li>
</ol>
<div data-code="ts-cur-basic"></div>
<div data-note="exam"><p><strong>FETCH występuje dwa razy:</strong> raz <em>przed</em> pętlą (żeby ustawić <code>@@FETCH_STATUS</code> — inaczej pętla w ogóle nie ruszy) i raz <em>na końcu</em> wnętrza pętli, tuż przed END. Brak drugiego FETCH = pętla nieskończona.</p></div>
<p>Błędy: FETCH lub CLOSE na zamkniętym kursorze → <em>Cursor is not open</em>; OPEN otwartego → <em>The cursor is already open</em>.</p>

<h2>Kursor, który zmienia dane</h2>
<p>Kursor dostarcza wartości do zmiennych, ale <code>UPDATE</code> „nie wie”, który to wiersz. Dlatego w UPDATE <strong>musi</strong> być <code>WHERE klucz = @klucz</code> (bez niego zmienisz całą tabelę!) albo <code>WHERE CURRENT OF kursor</code>.</p>
<div data-code="ts-cur-update"></div>
<div data-note="tip"><p>Ogranicz wiersze już w SELECT kursora (<code>WHERE sal NOT BETWEEN 1000 AND 3000</code>) zamiast czytać wszystko i sprawdzać w pętli — mniej pracy dla serwera.</p></div>
<div data-code="ts-cur-setbased"></div>

<h2>Kursor przewijany (SCROLL)</h2>
<p>Domyślnie kursor idzie tylko do przodu (<code>FETCH NEXT</code>). Kursor zadeklarowany jako <code>SCROLL CURSOR</code> pozwala skakać: <code>FETCH PRIOR</code>, <code>FIRST</code>, <code>LAST</code>, <code>ABSOLUTE n</code>, <code>RELATIVE n</code>.</p>
<div data-code="ts-cur-scroll"></div>
`,
  cheat: `
<ol>
  <li><code>DECLARE k CURSOR FOR SELECT a, b FROM … WHERE …;</code></li>
  <li><code>DECLARE @a …, @b …;</code></li>
  <li><code>OPEN k;</code></li>
  <li><code>FETCH NEXT FROM k INTO @a, @b;</code> ← przed pętlą</li>
  <li><code>WHILE @@FETCH_STATUS = 0 BEGIN … FETCH NEXT FROM k INTO @a, @b; END;</code> ← FETCH na końcu</li>
  <li><code>CLOSE k; DEALLOCATE k;</code></li>
</ol>
<ul>
  <li><code>@@FETCH_STATUS</code>: 0 = OK, −1 = koniec.</li>
  <li>UPDATE w kursorze: <code>WHERE id = @id</code> albo <code>WHERE CURRENT OF k</code>.</li>
  <li>Filtruj w SELECT kursora. Kursor = wolny → jeśli się da, jedno UPDATE.</li>
  <li><code>SCROLL CURSOR</code>: FETCH NEXT / PRIOR / FIRST / LAST / ABSOLUTE n / RELATIVE n.</li>
</ul>
`
},

'tsql-procedures': {
  title: 'T-SQL: procedury składowane i funkcje',
  lead: 'Kod zapisany w bazie: parametry, trzy sposoby zwracania wyników, dobre praktyki oraz funkcje skalarne i tabelaryczne.',
  body: `
<h2>Czym jest procedura składowana</h2>
<p><strong>Procedura składowana</strong> (stored procedure) to kod T-SQL zapisany w bazie jako obiekt, z unikalną nazwą. Komunikujemy się z nią przez <strong>parametry</strong>. Przy pierwszym wykonaniu serwer ją kompiluje i układa optymalny plan dostępu do danych.</p>
<p>Zalety:</p>
<ul>
  <li><strong>porządek i kontrola</strong> — operacje na bazie są zebrane w jednym miejscu i zawsze wykonują się tak samo;</li>
  <li><strong>bezpieczeństwo</strong> — aplikacja dostaje prawo uruchomienia procedury, a nie dowolnych poleceń na tabelach;</li>
  <li><strong>mniej ruchu w sieci</strong> — jedno wywołanie zamiast wielu poleceń.</li>
</ul>
<p>W T-SQL procedura może odwoływać się do tabel, które przy kompilacji jeszcze nie istnieją, i może wykonywać DDL.</p>

<h2>Składnia</h2>
<p class="formula">CREATE [OR ALTER] PROCEDURE nazwa
    @param1 TYP [= domyślna] [OUTPUT],
    @param2 TYP …
AS
BEGIN
    instrukcje T-SQL
END;</p>
<ul>
  <li>Poprawka istniejącej procedury: <code>ALTER PROCEDURE</code> (albo <code>CREATE OR ALTER</code> od wersji 2016).</li>
  <li>Parametry deklarujemy jak zmienne, ale <strong>bez DECLARE</strong>. Domyślnie są wejściowe (INPUT); <code>OUTPUT</code> — wyjściowe.</li>
  <li>Uruchomienie: <code>EXEC</code> / <code>EXECUTE nazwa wartości</code>. Pominięte parametry z wartością domyślną można zastąpić słowem <code>DEFAULT</code> albo podać parametry po nazwie.</li>
</ul>
<div data-code="ts-proc-basic"></div>

<h2>Jak procedura zwraca wynik</h2>
<table>
  <thead><tr><th>Sposób</th><th>Co zwraca</th><th>Uwagi</th></tr></thead>
  <tbody>
    <tr><td><strong>Result set</strong></td><td>wynik (ostatniego) SELECT</td><td>w SSMS widać go na Results; aplikacja musi go odebrać</td></tr>
    <tr><td><strong>Parametr OUTPUT</strong></td><td>dowolne wartości</td><td>słowo OUTPUT przy deklaracji <strong>i</strong> przy wywołaniu; potrzebna zmienna do odbioru</td></tr>
    <tr><td><strong>RETURN</strong></td><td>tylko liczba INT</td><td>od razu kończy procedurę; wynik odbiera się przez <code>EXEC @zm = proc</code></td></tr>
  </tbody>
</table>
<div data-code="ts-proc-output"></div>

<h2>Dobre praktyki (z wykładu)</h2>
<ul>
  <li>Pierwsza instrukcja po AS: <code>SET NOCOUNT ON</code>.</li>
  <li>Nie używaj funkcji w SELECT, jeśli nie operują na zwracanych wartościach (liczą się dla każdego wiersza).</li>
  <li>Nie pisz <code>SELECT *</code>.</li>
  <li>Ograniczaj odczytywane dane jak najwcześniej.</li>
  <li>Używaj jawnych transakcji (<code>BEGIN TRANSACTION … COMMIT</code>) i niech będą <strong>krótkie</strong> (mniej blokad i zakleszczeń).</li>
  <li>Obsługuj błędy w <code>TRY … CATCH</code>.</li>
  <li>Procedury można zagnieżdżać — do 32 poziomów.</li>
</ul>
<div data-note="warn"><p>Klasyczny błąd początkujących: po poprawkach procedury dopisujesz na jej końcu <code>EXEC nazwa</code> i kompilujesz całość bez <code>GO</code> przed EXEC. Wywołanie staje się częścią procedury — ona wywołuje samą siebie 32 razy i aplikacja się wiesza. Zawsze oddzielaj definicję od wywołania słowem <code>GO</code>.</p></div>
<div data-code="ts-proc-template"></div>

<h2>Funkcje użytkownika</h2>
<p>Funkcje przypominają procedury z RETURN, ale <strong>można ich używać wprost w poleceniach SQL</strong> (w SELECT, WHERE…), bez EXEC. Zwracają wartość typu podanego po <code>RETURNS</code>.</p>
<ul>
  <li>Przy wywołaniu nazwa musi mieć <strong>schemat</strong> (<code>dbo.nazwa</code>) i <strong>nawiasy</strong>, nawet bez parametrów.</li>
  <li>Nie wywołuj funkcji w SELECT zwracającym wiele wierszy, jeśli w każdym wierszu dałaby ten sam wynik — policz ją raz do zmiennej.</li>
</ul>
<h3>Funkcja skalarna</h3>
<div data-code="ts-fn-scalar"></div>
<p>Dzięki funkcji uniknęliśmy podzapytania i CTE.</p>
<h3>Funkcje tabelaryczne</h3>
<p><strong>Prosta (inline)</strong>: <code>RETURNS TABLE AS RETURN (SELECT …)</code> — to jakby widok z parametrem. <strong>Złożona</strong>: po RETURNS deklarujesz zmienną tabelaryczną z kolumnami, wypełniasz ją dowolną liczbą instrukcji i kończysz <code>RETURN</code>.</p>
<div data-code="ts-fn-table"></div>
<h3>Czego funkcja nie może</h3>
<ul>
  <li>modyfikować bazy (INSERT/UPDATE/DELETE na tabelach) — może tylko na własnych zmiennych tabelarycznych;</li>
  <li>używać <code>OUTPUT INTO</code>, TRY…CATCH, RAISERROR, @@ERROR;</li>
  <li>używać dynamicznego SQL ani tabel tymczasowych (zmienne tabelaryczne — tak).</li>
</ul>
`,
  cheat: `
<ul>
  <li><code>CREATE [OR ALTER] PROCEDURE p @a INT, @b VARCHAR(20) = 'x', @wynik INT OUTPUT AS BEGIN … END; GO</code></li>
  <li>Parametry bez DECLARE; domyślnie wejściowe.</li>
  <li>Wywołanie: <code>EXEC p 1, DEFAULT, @w OUTPUT;</code> lub <code>EXEC p @a = 1;</code></li>
  <li>Zwracanie: result set (SELECT) · <code>OUTPUT</code> (przy deklaracji i wywołaniu) · <code>RETURN int</code> (<code>EXEC @r = p</code>).</li>
  <li><code>RETURN;</code> = natychmiastowe wyjście z procedury.</li>
  <li>Praktyki: <code>SET NOCOUNT ON</code>, bez <code>SELECT *</code>, krótkie transakcje, TRY…CATCH, max 32 zagnieżdżenia.</li>
  <li>Definicję od <code>EXEC</code> oddziel <code>GO</code> (inaczej rekurencja!).</li>
  <li>Funkcja skalarna: <code>CREATE FUNCTION f (@x INT) RETURNS MONEY AS BEGIN … RETURN @w; END</code>; użycie <code>dbo.f(10)</code>.</li>
  <li>Tabelaryczna: <code>RETURNS TABLE AS RETURN (SELECT …)</code>; złożona: <code>RETURNS @t TABLE (…) AS BEGIN … RETURN; END</code>.</li>
  <li>Funkcja nie zmienia bazy, bez TRY/RAISERROR, bez dynamicznego SQL i tabel #.</li>
</ul>
`
},

'tsql-triggers': {
  title: 'T-SQL: wyzwalacze i obsługa błędów',
  lead: 'Procedury uruchamiane automatycznie przez INSERT, UPDATE, DELETE: tabele inserted/deleted, praca na wielu wierszach, INSTEAD OF, RAISERROR, TRY…CATCH, THROW.',
  body: `
<h2>Czym jest wyzwalacz</h2>
<p><strong>Wyzwalacz</strong> (trigger) to szczególna procedura, której <strong>nie wywołujesz sam</strong> — uruchamia ją SZBD, gdy zajdzie określone zdarzenie (operacja DML, DDL albo zdarzenie serwera). Zajmiemy się wyzwalaczami DML. Służą do:</p>
<ul>
  <li>programowania więzów spójności, których nie da się zapisać deklaratywnie;</li>
  <li>stałych czynności, które muszą się wykonać zawsze, dla każdej aplikacji (np. aktualizacja podsumowań, log zmian).</li>
</ul>
<div data-note="warn"><p>Wyzwalacze w MS SQL i Oracle działają według <strong>innej filozofii</strong>, nie tylko innej składni. Nie przenoś rozwiązań „1:1” między środowiskami.</p></div>

<h2>Składnia i moment uruchomienia</h2>
<p class="formula">CREATE [OR ALTER] TRIGGER nazwa
ON tabela
FOR | AFTER  INSERT [, UPDATE] [, DELETE]
AS
    instrukcje T-SQL</p>
<ul>
  <li>Każdy wyzwalacz jest związany z <strong>jedną</strong> tabelą lub widokiem; tabela może mieć kilka wyzwalaczy (kolejność ich uruchamiania <strong>nie jest ustalona</strong>!).</li>
  <li>Wyzwalacz T-SQL uruchamia się <strong>PO</strong> wykonaniu instrukcji DML, ale <strong>w tej samej, niezatwierdzonej transakcji</strong>. Tabela jest już zmieniona — ale <code>ROLLBACK</code> w wyzwalaczu może to wszystko cofnąć.</li>
  <li>Wyzwalacze mogą się zagnieżdżać (wyzwalacz zmienia tabelę z innym wyzwalaczem…) do 32 poziomów.</li>
</ul>
<div data-code="ts-trg-nodelete"></div>

<h2>Tabele inserted i deleted</h2>
<p>W wyzwalaczu mamy dwie wirtualne tabele (tylko do odczytu) z kopiami zmienianych wierszy:</p>
<table>
  <thead><tr><th>Operacja</th><th>inserted</th><th>deleted</th></tr></thead>
  <tbody>
    <tr><td>INSERT</td><td>nowe wiersze</td><td>pusta</td></tr>
    <tr><td>DELETE</td><td>pusta</td><td>usunięte wiersze</td></tr>
    <tr><td>UPDATE</td><td>wiersze <strong>po</strong> zmianie</td><td>wiersze <strong>przed</strong> zmianą</td></tr>
  </tbody>
</table>
<p>Pozostałe tabele bazy (także tę, na której jest wyzwalacz) można w wyzwalaczu czytać i zmieniać.</p>

<h2>Najważniejsze: wyzwalacz działa raz na INSTRUKCJĘ</h2>
<div data-note="exam"><p>Wyzwalacz T-SQL uruchamia się <strong>jeden raz dla całej instrukcji</strong>, a nie dla każdego wiersza. <code>UPDATE Emp SET sal = sal*1.1</code> zmienia 14 wierszy → wyzwalacz uruchamia się raz, a <code>inserted</code> i <code>deleted</code> mają po 14 wierszy. Kod typu <code>SELECT @sal = sal FROM inserted</code> weźmie tylko jedną (ostatnią) wartość!</p></div>
<div data-code="ts-trg-rows"></div>
<p>Wersja z <code>EXISTS</code> działa dla dowolnej liczby wierszy, ale przy złamaniu reguły wycofuje <strong>całą</strong> instrukcję. Jeśli każdy wiersz trzeba potraktować osobno — użyj kursora po <code>inserted</code> (albo sprytnego złączenia).</p>
<div data-code="ts-trg-cursor"></div>
<div data-note="own"><p>Wiele wyzwalaczy da się napisać bez kursora — operując na całych tabelach inserted/deleted (sumy, JOIN). To szybsze i od razu działa dla wielu wierszy:</p></div>
<div data-code="ts-trg-join"></div>
<div data-note="lecture"><p>Reguły typu „płaca &gt; 100” lepiej zapisać jako <code>CHECK</code>, a wartość domyślną jako <code>DEFAULT</code> — wyzwalacz to rozwiązanie dla bardziej złożonych przypadków (na ćwiczeniach robi się je wyzwalaczami treningowo).</p></div>

<h3>Która operacja i które kolumny</h3>
<ul>
  <li>INSERT: jest coś w inserted, nie ma w deleted; DELETE: odwrotnie; UPDATE: oba niepuste.</li>
  <li><code>UPDATE(kolumna)</code> — TRUE, jeśli kolumna była modyfikowana (w SET albo w INSERT).</li>
  <li><code>COLUMNS_UPDATED()</code> — maska bitowa wszystkich zmienianych kolumn.</li>
</ul>
<div data-code="ts-trg-which"></div>
<p>Rekurencja: <strong>pośrednia</strong> (TR1 na T1 zmienia T2, a TR2 na T2 zmienia T1) jest możliwa; <strong>bezpośrednia</strong> (TR1 zmienia swoją T1) — dopiero po zmianie ustawień bazy (niezalecane).</p>

<h2>INSTEAD OF</h2>
<p>Wyzwalacz <code>INSTEAD OF</code> wykonuje się <strong>zamiast</strong> instrukcji DML (sama instrukcja jest pomijana). Na <strong>widokach</strong> pozwala zrealizować INSERT/UPDATE/DELETE przez widok, który normalnie tego nie umożliwia (np. ze złączeniem). MS SQL pozwala tworzyć INSTEAD OF także na tabelach (Oracle — nie).</p>
<div data-code="ts-trg-instead"></div>
<div data-note="lecture"><p>Wyzwalacze to „bardzo silne narzędzie, może za silne”: działają jednakowo dla każdego procesu (to zaleta i wada), a przy powiązanych tabelach łatwo stracić kontrolę nad ich łańcuchem. Używaj ich z umiarem; często lepsze są procedury.</p></div>

<h2>Obsługa błędów</h2>
<p>Serwer sam zgłasza błędy (składnia, nieistniejący obiekt, zły typ) — z numerem (Msg), poziomem (Level), stanem (State) i linią.</p>
<div data-code="ts-err-server"></div>
<h3>RAISERROR</h3>
<p><code>RAISERROR (komunikat, severity, state)</code>, gdzie <strong>severity</strong> (0–25) określa wagę, a <strong>state</strong> (1–127) — dowolny numer „miejsca”.</p>
<table>
  <thead><tr><th>Severity</th><th>Efekt</th></tr></thead>
  <tbody>
    <tr><td>0–9</td><td>ostrzeżenie + informacja „Msg 50000, Level …”</td></tr>
    <tr><td>10</td><td>sam komunikat (ostrzeżenie)</td></tr>
    <tr><td>11–18</td><td>błąd (czerwony); w bloku TRY → skok do CATCH</td></tr>
    <tr><td>19–25</td><td>tylko sysadmin; 20–25 = błąd krytyczny, zerwanie sesji</td></tr>
  </tbody>
</table>
<div data-code="ts-raiserror"></div>
<div data-note="warn"><p>RAISERROR <strong>poza</strong> blokiem TRY <strong>nie przerywa</strong> wykonywania kodu — następne instrukcje dalej się wykonują!</p></div>
<h3>TRY … CATCH</h3>
<p>Instrukcje piszemy w <code>BEGIN TRY … END TRY</code>. Gdy wystąpi błąd (severity ≥ 11 — od serwera, RAISERROR albo THROW), sterowanie przechodzi do <code>BEGIN CATCH … END CATCH</code>, gdzie mamy funkcje <code>ERROR_NUMBER()</code>, <code>ERROR_MESSAGE()</code>, <code>ERROR_SEVERITY()</code>, <code>ERROR_STATE()</code>, <code>ERROR_LINE()</code>, <code>ERROR_PROCEDURE()</code>. Poza CATCH zwracają NULL. Bloki można zagnieżdżać.</p>
<div data-code="ts-try"></div>
<h3>THROW</h3>
<p><code>THROW numer, komunikat, stan</code> (numer ≥ 50000) — działa jak RAISERROR z severity 16, więc w TRY zawsze przenosi do CATCH. <code>THROW</code> bez parametrów w bloku CATCH „przerzuca” złapany błąd dalej.</p>
<div data-code="ts-throw"></div>
<div data-note="tip"><p>Dobry kod przewiduje błędy i zamienia je na zrozumiałe komunikaty — zamiast zostawiać użytkownika z systemowym „Msg 547…” i paniką „system nie działa”.</p></div>
`,
  cheat: `
<ul>
  <li><code>CREATE TRIGGER t ON tabela FOR|AFTER INSERT, UPDATE, DELETE AS …</code></li>
  <li>Uruchamia się <strong>po</strong> DML, w tej samej transakcji; <code>ROLLBACK</code> cofa instrukcję.</li>
  <li><strong>Raz na instrukcję</strong>, nie na wiersz! Nie rób <code>SELECT @x = kol FROM inserted</code> — używaj <code>EXISTS</code>, JOIN, SUM albo kursora.</li>
  <li>INSERT → inserted; DELETE → deleted; UPDATE → deleted (przed) + inserted (po). Tylko do odczytu.</li>
  <li><code>UPDATE(kol)</code> — czy kolumnę zmieniano; <code>COLUMNS_UPDATED()</code> — maska.</li>
  <li>Kilka wyzwalaczy na tabeli — kolejność nieokreślona. Zagnieżdżenia do 32.</li>
  <li><code>INSTEAD OF</code> — zamiast DML; widoki (i tabele w MS SQL).</li>
  <li>Proste reguły → CHECK / DEFAULT zamiast wyzwalacza.</li>
  <li><code>RAISERROR('msg', 16, 1)</code>: &lt;10 ostrzeżenie, 10 komunikat, ≥11 błąd (TRY→CATCH), 20–25 krytyczny. Poza TRY nie przerywa!</li>
  <li><code>BEGIN TRY … END TRY BEGIN CATCH … ERROR_MESSAGE() … END CATCH</code>.</li>
  <li><code>THROW 50001, 'msg', 1;</code> (≥ 50000, jak severity 16); <code>THROW;</code> w CATCH = przerzuć dalej.</li>
</ul>
`
},

'tsql-advanced': {
  title: 'T-SQL dla zaawansowanych',
  lead: 'Funkcje rankingowe i okienkowe, tabele tymczasowe, zmienne tabelaryczne, OUTPUT, CASE, rekurencyjne CTE, MERGE i dynamiczny SQL.',
  body: `
<div data-note="lecture"><p>Te konstrukcje ułatwiają pracę, ale nie są niezbędne — na początku nauki T-SQL można je pominąć. Warto jednak je znać (bywają na egzaminie i przydają się w projekcie).</p></div>

<h2>Skrócone operatory</h2>
<p><code>+=</code>, <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code> (reszta z dzielenia) — jak w C/Javie.</p>
<div data-code="ts-compound"></div>

<h2>Funkcje rankingowe</h2>
<table>
  <thead><tr><th>Funkcja</th><th>Co robi</th><th>Remis (te same wartości)</th></tr></thead>
  <tbody>
    <tr><td><code>ROW_NUMBER()</code></td><td>numeruje wiersze 1, 2, 3…</td><td>różne numery</td></tr>
    <tr><td><code>RANK()</code></td><td>1 + liczba wierszy „przed” w grupie</td><td>ten sam numer, potem <strong>dziura</strong> (1,1,3)</td></tr>
    <tr><td><code>DENSE_RANK()</code></td><td>jak RANK</td><td>ten sam numer, <strong>bez dziur</strong> (1,1,2)</td></tr>
    <tr><td><code>NTILE(n)</code></td><td>dzieli wiersze na n równych grup</td><td>—</td></tr>
  </tbody>
</table>
<p>Składnia: <code>funkcja() OVER ([PARTITION BY …] ORDER BY …)</code>. <code>PARTITION BY</code> tworzy osobną numerację w każdej grupie (np. w każdym stanowisku).</p>
<div data-code="ts-rank"></div>
<p>Z <code>OVER (PARTITION BY …)</code> działają też zwykłe agregaty — wynik grupy pojawia się <strong>w każdym wierszu</strong>, bez GROUP BY, CTE ani widoku.</p>
<div data-code="ts-window"></div>

<h2>Tabele tymczasowe i zmienne tabelaryczne</h2>
<table>
  <thead><tr><th></th><th>Tabela tymczasowa <code>#t</code> / <code>##t</code></th><th>Zmienna tabelaryczna <code>@t</code></th></tr></thead>
  <tbody>
    <tr><td>Gdzie</td><td>na dysku, baza <strong>tempdb</strong></td><td>w pamięci RAM</td></tr>
    <tr><td>Widoczność</td><td><code>#</code> — moja sesja (w procedurze — do jej końca); <code>##</code> — wszystkie sesje</td><td>blok / procedura</td></tr>
    <tr><td>Tworzenie</td><td><code>CREATE TABLE #t (…)</code> albo <code>SELECT … INTO #t</code></td><td><code>DECLARE @t TABLE (…)</code>; <strong>nie</strong> przez SELECT INTO</td></tr>
    <tr><td>Więzy</td><td>tak (także nazwane), indeksy; <strong>bez FK</strong></td><td>PK, UNIQUE, NULL, CHECK (bez nazw); <strong>bez FK</strong></td></tr>
  </tbody>
</table>
<div data-code="ts-temp"></div>
<div data-code="ts-tablevar"></div>
<div data-note="lecture"><p>„Używajmy zmiennych tabelarycznych!” — szczególnie gdy wielokrotnie potrzebujemy tych samych danych: odczyt z dysku jest drogi, a zmienna trzyma dane w RAM.</p></div>

<h2>UPDATE i DELETE ze złączeniem</h2>
<div data-code="ts-upd-join"></div>

<h2>OUTPUT — przechwycenie zmienianych danych</h2>
<p>Poza wyzwalaczami też można odczytać <code>inserted</code>/<code>deleted</code>: klauzula <code>OUTPUT</code> przy INSERT/UPDATE/DELETE zapisuje kopie zmienianych wierszy (całych, nawet jeśli zmieniasz jedną kolumnę) do zmiennej tabelarycznej lub tabeli tymczasowej. Świetne, gdy chcesz poznać numer z IDENTITY nowego wiersza.</p>
<div data-code="ts-output"></div>

<h2>CASE i skorelowany UPDATE</h2>
<p><code>CASE</code> to „IF wewnątrz SELECT”. <strong>Simple CASE</strong> porównuje wyrażenie z wartościami, <strong>searched CASE</strong> sprawdza dowolne warunki. Działa w SELECT, UPDATE i SET.</p>
<div data-code="ts-case"></div>
<div data-code="ts-corr-update"></div>

<h2>Rekurencyjne CTE</h2>
<p>CTE może odwoływać się do samego siebie: <strong>kotwica</strong> (pierwszy SELECT) <code>UNION ALL</code> <strong>krok</strong> (SELECT z CTE) + warunek stopu. Tak generuje się ciągi liczb albo przechodzi po hierarchii (szef → podwładni → ich podwładni).</p>
<div data-code="ts-cte-rec"></div>

<h2>MERGE</h2>
<p>Często trzeba naraz: <strong>zaktualizować</strong> istniejące wiersze, <strong>dopisać</strong> brakujące i <strong>usunąć</strong> zbędne (np. co miesiąc odświeżyć tabelę budżetów działów). Zamiast procedury z IF-ami — jedno polecenie <code>MERGE</code>:</p>
<ul>
  <li><code>MERGE</code> — tabela docelowa; <code>USING</code> — źródło; <code>ON</code> — warunek dopasowania;</li>
  <li><code>WHEN MATCHED THEN</code> UPDATE/DELETE (max 2 klauzule: pierwsza z <code>AND warunek</code>);</li>
  <li><code>WHEN NOT MATCHED [BY TARGET] THEN</code> INSERT — wiersze tylko w źródle (1 raz);</li>
  <li><code>WHEN NOT MATCHED BY SOURCE THEN</code> UPDATE/DELETE — wiersze tylko w tabeli docelowej;</li>
  <li><code>OUTPUT … $action</code> — log wykonanych operacji.</li>
</ul>
<div data-code="ts-merge"></div>
<div data-note="warn"><p>MERGE <strong>musi</strong> kończyć się średnikiem. Uważaj na NULL w warunku ON — wiersz z <code>deptno = NULL</code> nigdy się nie „dopasuje” i przy każdym uruchomieniu będzie traktowany jak nowy.</p></div>

<h2>Dynamiczny SQL</h2>
<p>Zwykłe polecenie jest „sztywne”: parametrami podmienisz wartości w WHERE, ale nie nazwę tabeli czy listę kolumn. <strong>Dynamiczny SQL</strong> buduje polecenie jako tekst i je wykonuje: <code>EXEC (@tekst)</code> albo — wydajniej i bezpieczniej — <code>sp_executesql</code> z parametrami.</p>
<div data-code="ts-dynamic"></div>
<div data-note="warn"><p>Dynamiczny SQL jest tyleż mocny, co niebezpieczny: sklejanie tekstu z danymi od użytkownika otwiera drogę do ataku <strong>SQL Injection</strong>. Wartości przekazuj parametrami <code>sp_executesql</code>, a nie przez sklejanie.</p></div>
`,
  cheat: `
<ul>
  <li><code>SET @x += 5;</code> (+=, -=, *=, /=, %=).</li>
  <li><code>ROW_NUMBER() / RANK() / DENSE_RANK() / NTILE(n) OVER (PARTITION BY a ORDER BY b)</code>. RANK: 1,1,3; DENSE_RANK: 1,1,2.</li>
  <li><code>SUM(sal) OVER (PARTITION BY job)</code> — agregat w każdym wierszu. <code>STRING_AGG(kol, ', ')</code>.</li>
  <li><code>#t</code> lokalna, <code>##t</code> globalna (tempdb, bez FK); <code>SELECT … INTO #t</code>.</li>
  <li><code>DECLARE @t TABLE (…)</code> — RAM, bez FK, bez SELECT INTO.</li>
  <li><code>UPDATE e SET … FROM Emp e JOIN Dept d ON …</code>; <code>DELETE e FROM Emp e JOIN …</code>.</li>
  <li><code>INSERT … OUTPUT inserted.* INTO @t SELECT/VALUES …</code> (bez średnika przed SELECT).</li>
  <li><code>CASE x WHEN … THEN … ELSE … END</code> / <code>CASE WHEN warunek THEN … END</code>.</li>
  <li>CTE rekurencyjne: <code>WITH X AS (kotwica UNION ALL krok z X WHERE stop) SELECT …</code>.</li>
  <li><code>MERGE cel USING źródło ON … WHEN MATCHED … WHEN NOT MATCHED [BY TARGET] … WHEN NOT MATCHED BY SOURCE … ;</code></li>
  <li>Dynamiczny SQL: <code>EXEC (@s)</code>; lepiej <code>sp_executesql @s, N'@p INT', @p = 1</code>. Uwaga: SQL Injection.</li>
</ul>
`
}

});
