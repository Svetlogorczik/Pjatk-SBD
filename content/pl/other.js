/* PL – Moduł 6: tematy dodatkowe */
SBD.addContent('pl', {

'distributed': {
  title: 'Rozproszone bazy danych',
  lead: 'Baza w jednym miejscu czy w wielu? Bazy rezerwowe (log shipping, mirroring), replikacja w MS SQL, połączenia z odległymi bazami i protokół 2PC.',
  body: `
<div data-note="lecture"><p>Ten temat jest tylko na wykładzie — bez ćwiczeń. Warto go znać na egzamin (zalety/wady, rodzaje replikacji, 2PC).</p></div>

<h2>Baza scentralizowana a rozproszona</h2>
<table>
  <thead><tr><th></th><th>Scentralizowana (jeden węzeł)</th><th>Rozproszona (wiele węzłów, część danych replikowana)</th></tr></thead>
  <tbody>
    <tr><td>Zalety</td><td>jeden system kontroli = łatwa spójność; sprawdzone algorytmy transakcji i odtwarzania</td><td>dane bliżej użytkownika (szybsze zapytania); lokalna kontrola nad własnymi danymi; większa dostępność (repliki)</td></tr>
    <tr><td>Wady</td><td>długie oczekiwanie z odległych węzłów; brak lokalnej kontroli; duży ruch w sieci</td><td>trudniej utrzymać spójność; transakcje i odtwarzanie bardziej skomplikowane; aktualizacja replik</td></tr>
  </tbody>
</table>
<p>Przykład z wykładu: kadry firmy — biuro w Gdańsku ma dane Polski Północnej, Kraków — Południowej, Warszawa — Środkowej; struktura firmy jest replikowana w każdym węźle, a raporty dla całego kraju robi się okresowo.</p>
<div data-note="lecture"><p>Postulat Codda nr 11 (niezależność dystrybucyjna) mówił o tym już prawie 60 lat temu.</p></div>

<h2>Bazy rezerwowe (MS SQL)</h2>
<dl>
  <dt>Log Shipping</dt><dd>automatyczne, regularne kopie dziennika transakcji odtwarzane na innym serwerze (lub kilku). Serwer zapasowy może przejąć pracę po awarii albo służyć jako baza tylko do odczytu (raporty, analizy). Opóźnienie = częstotliwość kopii dziennika.</dd>
  <dt>Mirroring</dt><dd>baza lustrzana na innym serwerze, zmiany przesyłane natychmiast (brak lub minimalne opóźnienie), możliwa konfiguracja w pełni transakcyjna; po awarii zapasowy serwer przejmuje rolę głównego (nawet automatycznie).</dd>
</dl>

<h2>Replikacja (MS SQL)</h2>
<p>Pozwala zbudować prawdziwie rozproszoną bazę: replikujemy wybrane tabele, procedury, widoki — a filtrami wybieramy nawet konkretne kolumny i wiersze. Terminy: <strong>publikator</strong> (źródło), <strong>dystrybutor</strong>, <strong>subskrybent</strong> (odbiorca), <strong>publikacja</strong> (zestaw artykułów).</p>
<table>
  <thead><tr><th>Rodzaj</th><th>Jak działa</th><th>Kiedy</th></tr></thead>
  <tbody>
    <tr><td><strong>Migawkowa</strong> (snapshot)</td><td>za każdym razem tworzy pełny obraz danych i wysyła całość, nadpisując dane subskrybenta; nie analizuje zmian</td><td>niezbyt duże tabele, subskrybenci nic nie zmieniają, rzadka synchronizacja; wymaga dużej przepustowości</td></tr>
    <tr><td><strong>Transakcyjna</strong></td><td>na start migawka, potem śledzenie INSERT/UPDATE/DELETE w logu i przesyłanie zmian w kolejności; opóźnienie zwykle &lt; 1 min</td><td>mało przesyłanych danych, prawie na bieżąco</td></tr>
    <tr><td><strong>Scalająca</strong> (merge)</td><td>zmiany można wprowadzać także u subskrybentów; są scalane i rozsyłane do wszystkich; możliwe <strong>konflikty</strong> (domyślnie wygrywa publikator, można ustawić priorytety lub rozstrzygać ręcznie)</td><td>najbardziej zaawansowana</td></tr>
  </tbody>
</table>

<h2>Połączenie z odległą bazą</h2>
<p>Oracle — <strong>Database Link</strong>, MS SQL — <strong>Linked Server</strong>. Na danych zdalnych działają zwykłe polecenia SQL (SELECT, UPDATE, złączenia z tabelami lokalnymi).</p>
<div data-code="dist-link"></div>

<h2>Transakcje rozproszone i protokół 2PC</h2>
<p>W transakcji obejmującej kilka serwerów (MS SQL: <code>BEGIN DISTRIBUTED TRANSACTION</code>) używa się <strong>protokołu dwufazowego zatwierdzania (2PC, two-phase commit)</strong>. Węzeł, który rozpoczął transakcję, to <strong>koordynator</strong>.</p>
<ol class="steps">
  <li><strong>Faza 1 — głosowanie:</strong> koordynator wysyła <code>prepare</code>. Każdy węzeł zapisuje w swoim dzienniku <code>prepare</code> lub <code>abort</code> i odpowiada <code>yes</code> albo <code>no</code>.</li>
  <li><strong>Faza 2 — zakończenie:</strong> jeśli <em>wszyscy</em> odpowiedzieli yes — koordynator zapisuje <code>commit</code> w dzienniku i wysyła commit; w przeciwnym razie zapisuje i wysyła <code>abort</code>.</li>
  <li>Węzły zapisują commit/abort i end, potem odsyłają <code>ack</code>. Po wszystkich ack koordynator zapisuje <code>end</code>.</li>
</ol>
<p>Każdy węzeł może zdecydować o wycofaniu. Każda decyzja jest <strong>najpierw zapisywana w dzienniku</strong>, a dopiero potem wysyłana — to zapewnia odporność na awarie.</p>
<div data-note="analogy"><p>Jak ślub: urzędnik (koordynator) pyta oboje „czy chcesz?” (faza 1). Dopiero gdy oboje powiedzą „tak”, ogłasza małżeństwo (faza 2). Jedno „nie” — i nic z tego.</p></div>
`,
  cheat: `
<ul>
  <li>Scentralizowana: łatwa spójność, ale wolno z daleka i duży ruch. Rozproszona: dane bliżej, lokalna kontrola, dostępność — ale trudna spójność i transakcje.</li>
  <li><strong>Log shipping</strong>: okresowe kopie logu na serwer zapasowy (opóźnienie). <strong>Mirroring</strong>: natychmiastowa synchronizacja, automatyczne przejęcie.</li>
  <li>Replikacja MS SQL: <strong>migawkowa</strong> (całość, nadpisuje), <strong>transakcyjna</strong> (zmiany z logu, &lt; 1 min), <strong>scalająca</strong> (zmiany wszędzie, konflikty, wygrywa publikator).</li>
  <li>Oracle <code>CREATE DATABASE LINK l CONNECT TO u IDENTIFIED BY p USING 'svc';</code> → <code>emp@l</code>. MS SQL: Linked Server, <code>serwer.baza.schemat.tabela</code>.</li>
  <li><code>BEGIN DISTRIBUTED TRANSACTION</code> → <strong>2PC</strong>: prepare/głosowanie → commit/abort → ack/end. Najpierw zapis w logu, potem komunikat.</li>
</ul>
`
},

'warehouses': {
  title: 'Hurtownie danych (wprowadzenie)',
  lead: 'Dlaczego system transakcyjny nie odpowiada na pytania strategiczne, czym jest hurtownia danych, OLTP vs OLAP, model wielowymiarowy, kostka, gwiazda i płatek śniegu.',
  body: `
<div data-note="lecture"><p>Jeden wykład (A. Chądzyńska-Krasowska), tylko zapoznanie z tematem — na SBD nie „roztrząsamy” go głębiej.</p></div>

<h2>Problem: dane są, informacji brak</h2>
<p>Systemy <strong>OLTP</strong> (transakcyjne, operacyjne) świetnie odpowiadają na <strong>pytania operacyjne</strong>: ile jest niezrealizowanych zamówień? jakiego towaru brakuje? jaki jest stan zamówienia? ilu mamy klientów?</p>
<p>Ale nie odpowiadają na <strong>pytania strategiczne</strong>: które produkty zyskują, a które tracą popularność? które kategorie są sezonowe? czy coś sprzedaje się lepiej w pewnych regionach? jacy są nasi najlepsi klienci? którzy klienci pewnie zaraz odejdą?</p>
<p>Rozwiązanie: system, do którego ładujemy wyselekcjonowane, zintegrowane dane z różnych źródeł i przechowujemy je długo — <strong>hurtownia danych (data warehouse)</strong>.</p>

<h2>Definicja (Bill Inmon, 1992)</h2>
<p>Hurtownia danych to baza danych wspomagająca podejmowanie decyzji, która jest:</p>
<dl>
  <dt>zorientowana na temat</dt><dd>dane dotyczą tematu (np. sprzedaży), a nie działań (np. przyjmowania zamówień); organizuje się je pod konkretne analizy.</dd>
  <dt>nieulotna</dt><dd>raz załadowane dane zwykle się nie zmieniają — dochodzą tylko nowe porcje; to samo zapytanie zwraca ten sam wynik.</dd>
  <dt>zintegrowana</dt><dd>dane są jednolite: daty w jednym formacie, jednakowe kodowanie znaków, ta sama informacja w tej samej postaci.</dd>
  <dt>zróżnicowana czasowo</dt><dd>kolejne warstwy danych z wielu lat; przy każdym fakcie jest czas zdarzenia (jeśli go brak w źródle — trzeba go dodać).</dd>
</dl>

<h2>OLTP kontra OLAP</h2>
<p><strong>OLTP</strong> (On-Line Transaction Processing) — niezawodne przetwarzanie dużej liczby transakcji i spójność danych. <strong>OLAP</strong> (On-Line Analytical Processing) — wielowymiarowa analiza ogromnych ilości danych.</p>
<table>
  <thead><tr><th></th><th>OLTP</th><th>OLAP (hurtownia)</th></tr></thead>
  <tbody>
    <tr><td>Użytkownicy</td><td>urzędnicy, personel IT — tysiące</td><td>kierownicy, analitycy — setki</td></tr>
    <tr><td>Cel</td><td>codzienna praca</td><td>wspomaganie decyzji</td></tr>
    <tr><td>Projekt</td><td>zorientowany na działanie</td><td>zorientowany na temat</td></tr>
    <tr><td>Schemat</td><td>znormalizowany, dużo tabel, wiele ścieżek złączeń</td><td>normalizacja niewymagana, mało tabel, jedna ścieżka złączeń</td></tr>
    <tr><td>Dane</td><td>bieżące, szczegółowe; bez historii</td><td>historyczne, zagregowane, zintegrowane; pełna historia</td></tr>
    <tr><td>Aktualność</td><td>natychmiast</td><td>z opóźnieniem (np. dobowym)</td></tr>
    <tr><td>Operacje</td><td>częste INSERT/UPDATE/DELETE pojedynczych wierszy</td><td>praktycznie tylko odczyt; dane ładowane wsadowo</td></tr>
    <tr><td>Zapytania</td><td>dużo prostych, bardzo krótkich</td><td>mało, ale na ogromnych danych (sekundy – godziny)</td></tr>
    <tr><td>Rozmiar</td><td>100 MB – GB</td><td>100 GB – TB</td></tr>
  </tbody>
</table>
<p>Dlatego zaleca się <strong>oddzielać</strong> hurtownię od systemów operacyjnych: ciężkie zapytania OLAP spowalniałyby pracę OLTP, a mechanizmy współbieżności i odtwarzania OLTP nie pasują do analiz.</p>

<h2>Po co firmie hurtownia</h2>
<ul>
  <li>analizy biznesowe (raporty, trendy, finanse) <strong>bez obciążania</strong> systemów transakcyjnych;</li>
  <li>wspomaganie decyzji (DS), symulacje, odkrywanie wiedzy (KDD, data mining);</li>
  <li>całościowy obraz firmy z danych z wielu źródeł;</li>
  <li>dostęp do danych historycznych (także ze względów prawnych);</li>
  <li>ujednolicenie pojęć — koniec „wielu wersji prawdy” (np. churn brutto = liczba dezaktywacji vs churn netto = dezaktywacje − reaktywacje).</li>
</ul>

<h2>Model wielowymiarowy</h2>
<ul>
  <li><strong>Fakt</strong> — pojedyncze zdarzenie (sprzedaż, operacja na koncie), opisane <strong>miarami</strong> — liczbami (liczba sztuk, kwota, zysk).</li>
  <li><strong>Wymiary</strong> — to, wzdłuż czego analizujemy (produkt, klient, obszar, czas). Opisują je atrybuty, które tworzą <strong>hierarchie</strong> (kategoria → produkt; rok → kwartał → miesiąc → data; kraj → województwo → miasto).</li>
  <li><strong>Kostka OLAP</strong> — n-wymiarowa tablica: krawędzie to wymiary, komórki — podsumowania miar. Wybierając dwa wymiary, dostajesz tabelę do raportu.</li>
</ul>

<h2>Projektowanie hurtowni — 4 kroki</h2>
<ol class="steps">
  <li>Wymagania biznesowe i <strong>temat</strong> hurtowni (np. sprzedaż).</li>
  <li><strong>Ziarnistość</strong> — poziom szczegółowości faktu (każda transakcja osobno czy zakupy produktu przez klienta w danym dniu razem?).</li>
  <li><strong>Wymiary</strong>, ich atrybuty i hierarchie.</li>
  <li><strong>Miary</strong> — powinny być sumowalne (przynajmniej częściowo).</li>
</ol>

<h2>Schematy: gwiazda, płatek śniegu, konstelacja</h2>
<ul>
  <li><strong>Gwiazda</strong> — w środku <strong>tabela faktów</strong> (klucze wymiarów + miary; znormalizowana, miary sumowalne), wokół <strong>tabele wymiarów</strong> (nieznormalizowane).</li>
  <li><strong>Płatek śniegu</strong> — krok w stronę normalizacji: hierarchie wydzielone do osobnych tabel (np. Kategoria osobno od Produktu).</li>
  <li><strong>Konstelacja faktów</strong> — kilka tabel faktów (np. Sprzedaż, Zysk) współdzielących wymiary (np. Czas).</li>
</ul>
<div data-code="dw-star"></div>
<div data-code="dw-query"></div>
<p>Kimball polecał czystą gwiazdę (wydajność, prostota dla użytkowników); zwolennicy płatka mówią, że ludzie biznesu myślą hierarchiami. Wybór należy do projektanta. Model wymiarowy jest łatwy do zrozumienia, jednoznaczny, zbliżony do tego, jak biznes postrzega firmę, i zwykle wydajny.</p>

<h2>Agregacje</h2>
<p><strong>Agregacja</strong> = wstępne wyliczenie miar przydatnych w analizach (np. miesięczne kwoty sprzedaży w kategoriach). Podejście transakcyjne mówi „nie trzymaj, skoro da się policzyć”, analityczne — „trzymaj, jeśli znacząco przyspieszy analizy”. Problemy: które agregacje wybrać (wymagania użytkowników, statystyki) i jak użytkownicy mają wiedzieć, że istnieją (nawigator po agregacjach).</p>
`,
  cheat: `
<ul>
  <li>OLTP → pytania operacyjne; hurtownia (OLAP) → pytania strategiczne.</li>
  <li>Inmon 1992: hurtownia = <strong>zorientowana na temat, nieulotna, zintegrowana, zróżnicowana czasowo</strong>.</li>
  <li>OLTP: tysiące użytkowników, znormalizowana, bieżące dane, dużo krótkich DML. OLAP: setki analityków, mało tabel, historia, prawie tylko odczyt, ładowanie wsadowe, TB danych. Oddzielaj je.</li>
  <li><strong>Fakt</strong> + <strong>miary</strong> (liczby, sumowalne) analizowane wzdłuż <strong>wymiarów</strong> (produkt, klient, obszar, czas) z hierarchiami.</li>
  <li>Kostka OLAP: wymiary = krawędzie, komórki = podsumowania.</li>
  <li>Projekt: temat → ziarnistość → wymiary/hierarchie → miary.</li>
  <li><strong>Gwiazda</strong>: tabela faktów + nieznormalizowane wymiary. <strong>Płatek śniegu</strong>: hierarchie w osobnych tabelach. <strong>Konstelacja</strong>: kilka tabel faktów, wspólne wymiary.</li>
  <li>Agregacje = wstępnie policzone miary (szybkość kosztem miejsca).</li>
</ul>
`
},

'object-lob': {
  title: 'Obiektowość w bazach danych i duże obiekty (LOB)',
  lead: 'Model obiektowo-relacyjny w Oracle: typy obiektowe, metody, dziedziczenie, tabele obiektowe, REF i VARRAY oraz przechowywanie dużych danych w CLOB/BLOB.',
  body: `
<div data-note="own"><p>Materiał tego tematu pochodzi ze slajdów „SBD_W13 Obiektowe-LOB” z poprzedniej edycji przedmiotu. W zapowiedzi z pierwszego wykładu 2026/27 go nie wymieniono — traktuj go jako uzupełnienie.</p></div>

<h2>Po co obiekty w bazie</h2>
<p>Standard <strong>SQL:1999</strong> opiera się na modelu <strong>obiektowo-relacyjnym</strong>. Typy obiektowe realizują dwie formy abstrakcji:</p>
<ul>
  <li><strong>abstrakcja proceduralna</strong> — szczegóły algorytmów są schowane w procedurach/funkcjach; zmiana procedury nie wymaga zmiany aplikacji;</li>
  <li><strong>abstrakcja danych</strong> — złożona struktura danych jest ukryta przed użytkownikiem.</li>
</ul>
<p>Korzyści: łatwiejsze modelowanie obiektów biznesowych, podział na moduły, wielokrotne użycie komponentów, kod po stronie serwera zgrupowany wokół danych, a przede wszystkim <strong>mniejsza rozbieżność</strong> między modelem bazy a aplikacją pisaną obiektowo (te same pojęcia: klasa = typ obiektowy, instancja = obiekt).</p>

<h2>Typ obiektowy</h2>
<p>Składa się ze <strong>specyfikacji</strong> (<code>CREATE TYPE … AS OBJECT</code> — atrybuty i nagłówki metod) i <strong>ciała</strong> (<code>CREATE TYPE BODY</code> — implementacja metod). Atrybutem może być inny typ obiektowy.</p>
<p><strong>Metody</strong> to funkcje/procedury w typie:</p>
<ul>
  <li><code>MEMBER</code> — działają na konkretnym obiekcie;</li>
  <li><code>CONSTRUCTOR</code> — tworzą obiekt (domyślny konstruktor ma nazwę typu: <code>name_typ('Jan', 'Kowalski', 'JK')</code>);</li>
  <li><code>STATIC</code> — dotyczą całego typu, nie obiektu.</li>
</ul>
<div data-code="obj-type"></div>
<p><strong>Tabela obiektowa</strong> (<code>CREATE TABLE t OF typ</code>) przechowuje obiekty jako wiersze; na niej działają zwykłe INSERT/UPDATE/DELETE/SELECT, a metody wywołuje się przez alias: <code>nt.full_name()</code>. <code>VALUE(alias)</code> zwraca cały obiekt. Obiekt może też być <strong>kolumną</strong> zwykłej tabeli relacyjnej.</p>

<h2>Dziedziczenie</h2>
<ul>
  <li><code>NOT FINAL</code> — z typu można dziedziczyć; <code>UNDER typ_bazowy</code> — typ pochodny; <code>FINAL</code> — koniec hierarchii.</li>
  <li><code>NOT INSTANTIABLE</code> — typ lub metoda abstrakcyjna (bez obiektów/implementacji); <code>OVERRIDING</code> — nadpisanie metody w typie pochodnym.</li>
</ul>
<div data-code="obj-inherit"></div>

<h2>REF i kolekcje</h2>
<ul>
  <li><code>REF typ</code> — wskaźnik (referencja) do obiektu w tabeli obiektowej; <code>SCOPE IS tabela</code> ogranicza, na jaką tabelę może wskazywać. To obiektowy odpowiednik klucza obcego.</li>
  <li><code>VARRAY(n) OF typ</code> — tablica o maksymalnym rozmiarze n.</li>
</ul>
<div data-code="obj-ref"></div>

<h2>Duże obiekty (LOB)</h2>
<p>Do przechowywania dużych danych służą typy LOB: <strong>CLOB</strong> — duży tekst (CV, opis), <strong>BLOB</strong> — dane binarne (zdjęcia, pliki). W wierszu trzymany jest <strong>lokator</strong> (wskaźnik), a same dane mogą leżeć osobno.</p>
<ul>
  <li><code>EMPTY_CLOB()</code> / <code>EMPTY_BLOB()</code> — inicjalizuje pusty LOB (inaczej niż NULL — do pustego LOB można pisać);</li>
  <li>operacje na zawartości: pakiet <strong><code>DBMS_LOB</code></strong> (np. <code>GETLENGTH</code>, <code>WRITE</code>) — lokator trzeba pobrać <code>SELECT … FOR UPDATE</code>;</li>
  <li>zwykłe DML też działa: UPDATE (np. kopiowanie CLOB z innego wiersza), DELETE, TRUNCATE, DROP.</li>
</ul>
<div data-code="obj-lob"></div>
<p>W MS SQL odpowiednikami są <code>VARCHAR(MAX)</code>, <code>NVARCHAR(MAX)</code> i <code>VARBINARY(MAX)</code>, a plik można wczytać przez <code>OPENROWSET(BULK …, SINGLE_BLOB)</code>.</p>
`,
  cheat: `
<ul>
  <li>SQL:1999 = model obiektowo-relacyjny. Abstrakcja proceduralna + abstrakcja danych; mniejsza rozbieżność baza ↔ aplikacja obiektowa.</li>
  <li><code>CREATE TYPE t AS OBJECT (atrybuty, MEMBER FUNCTION f RETURN …);</code> + <code>CREATE TYPE BODY t AS … END;</code></li>
  <li>Metody: MEMBER (obiekt), CONSTRUCTOR (tworzenie, <code>t(…)</code>), STATIC (typ).</li>
  <li><code>CREATE TABLE x OF t;</code> — tabela obiektowa; <code>alias.metoda()</code>, <code>VALUE(alias)</code>.</li>
  <li>Dziedziczenie: <code>NOT FINAL</code>, <code>UNDER</code>, <code>FINAL</code>, <code>NOT INSTANTIABLE</code>, <code>OVERRIDING</code>.</li>
  <li><code>REF t</code> + <code>SCOPE IS tabela</code> — wskaźnik do obiektu; <code>VARRAY(n) OF t</code>.</li>
  <li>LOB: <code>CLOB</code> (tekst), <code>BLOB</code> (binaria); <code>EMPTY_CLOB()</code>; <code>DBMS_LOB.WRITE/GETLENGTH</code> po <code>SELECT … FOR UPDATE</code>.</li>
  <li>MS SQL: <code>VARCHAR(MAX)</code>, <code>VARBINARY(MAX)</code>, <code>OPENROWSET(BULK …)</code>.</li>
</ul>
`
}

});
