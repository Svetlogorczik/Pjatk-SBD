/* PL – Moduł 5: administrowanie bazami danych (P. Lenkiewicz) */
SBD.addContent('pl', {

'adm-server': {
  title: 'Budowa serwera i fizyczna organizacja danych',
  lead: 'Co dzieje się „pod maską”: silniki serwera, pliki danych i dziennika, strony, bufory w RAM, zapis wyprzedzający, grupy plików i RAID.',
  body: `
<h2>Z czego składa się serwer bazy danych</h2>
<p>Gdy klient (aplikacja, SSMS) wysyła polecenie SQL przez sterownik, na serwerze pracują trzy „silniki”:</p>
<table>
  <thead><tr><th>Silnik</th><th>Co robi</th></tr></thead>
  <tbody>
    <tr><td><strong>SQL engine</strong></td><td>parsowanie i kompilacja polecenia → optymalizacja (wybór planu) → wykonanie</td></tr>
    <tr><td><strong>Transaction engine</strong></td><td>współbieżność (wielu użytkowników naraz), dzienniki (logi), odtwarzanie po awarii</td></tr>
    <tr><td><strong>Storage engine</strong></td><td>zarządzanie plikami na dysku i buforami w RAM (bufor danych, bufor dziennika)</td></tr>
  </tbody>
</table>

<h2>Pliki bazy danych (MS SQL Server)</h2>
<ul>
  <li>Serwer może mieć wiele baz; każda baza to <strong>pliki z danymi</strong> — pierwszy <code>.mdf</code>, kolejne <code>.ndf</code> — oraz <strong>plik dziennika transakcji</strong> <code>.ldf</code>.</li>
  <li>Plik danych dzieli się na <strong>strony po 8 KB</strong>; 8 kolejnych stron to <strong>extent</strong> (64 KB). Strona to najmniejsza porcja danych, którą serwer czyta z dysku.</li>
</ul>
<div data-note="lecture"><p>Te pliki zobaczycie na ćwiczeniach: tworzenie bazy w Management Studio, grupy plików, przenoszenie tabeli do innej grupy.</p></div>

<h2>Dziennik transakcji i zapis wyprzedzający</h2>
<p>Transakcje są zapisywane <strong>najpierw do dziennika</strong>, a dopiero potem ich wyniki trafiają do plików danych. Dzięki temu można:</p>
<ul>
  <li>wycofywać transakcje (ROLLBACK);</li>
  <li>zachować spójność po awarii (np. zaniku prądu);</li>
  <li>odtworzyć bazę do dowolnego punktu w czasie.</li>
</ul>
<p>Każdy wpis dziennika ma numer <strong>LSN</strong> i zawiera m.in.: typ operacji, identyfikator transakcji, identyfikator strony, obraz danych <em>przed</em> i <em>po</em> zmianie. MS SQL ma jeden Transaction Log; Oracle — dwa dzienniki: <strong>undo</strong> (do wycofywania transakcji) i <strong>redo</strong> (do odtwarzania po awarii).</p>
<p><strong>WAL (Write-Ahead Logging)</strong> — protokół zapisu wyprzedzającego: informacja musi trafić do dziennika <strong>zanim</strong> transakcja zostanie zatwierdzona.</p>
<div data-note="analogy"><p>Jak kasjer, który najpierw zapisuje każdą operację w zeszycie, a dopiero potem przekłada pieniądze. Jeśli coś się pomiesza, z zeszytu da się odtworzyć, co było.</p></div>

<h2>Dysk i RAM — zarządzanie buforami</h2>
<p>Dane leżą na dysku (RAM jest drogi i ulotny), ale <strong>serwer może na nich pracować tylko w RAM</strong> — więc wczytuje strony do <strong>puli buforów</strong>. Algorytm:</p>
<ol class="steps">
  <li>Proces potrzebuje strony. Jeśli jest już w puli — zwiększ jej licznik odwołań i daj procesowi wskaźnik.</li>
  <li>Jeśli jej nie ma — wybierz ramkę z licznikiem odwołań = 0 (wg strategii zastępowania).</li>
  <li>Jeśli ta ramka jest „brudna” (dirty — zmieniona w RAM), najpierw zapisz ją na dysk.</li>
  <li>Wczytaj potrzebną stronę do ramki, ustaw licznik na 1.</li>
</ol>
<p>Zmiana zawartości strony ustawia bit <strong>dirty</strong>. Gdy proces zwalnia stronę, licznik maleje; strona z licznikiem 0 może zostać zastąpiona.</p>

<h2>Grupy plików i przestrzenie tabel</h2>
<p><strong>Grupa plików</strong> (filegroup, MS SQL) / <strong>przestrzeń tabel</strong> (tablespace, Oracle) to warstwa pośrednia między obiektami logicznymi (tabele, indeksy) a plikami fizycznymi. W jednej grupie może być wiele obiektów, a do grupy należy co najmniej jeden plik.</p>
<div data-code="adm-files"></div>

<h2>Zalecenia dotyczące plików i dysków</h2>
<ul>
  <li>Dziennik transakcji trzymaj na <strong>innym dysku</strong> niż dane.</li>
  <li>Nie trzymaj danych ani dzienników na dysku z systemem operacyjnym.</li>
  <li>Tabele często łączone warto rozdzielić na osobne dyski.</li>
  <li><strong>RAID 0</strong> (striping) — szybciej, ale mniej bezpiecznie; <strong>RAID 1</strong> (mirror) — bezpieczniej, połowa pojemności — zalecany w większości przypadków.</li>
</ul>
`,
  cheat: `
<ul>
  <li>Silniki: SQL (parsowanie → optymalizacja → wykonanie), Transaction (współbieżność, logi, odtwarzanie), Storage (pliki, bufory).</li>
  <li>MS SQL: dane <code>.mdf</code> (+ <code>.ndf</code>), dziennik <code>.ldf</code>; strona 8 KB, extent = 8 stron.</li>
  <li>Dziennik: najpierw log, potem dane → ROLLBACK, spójność po awarii, odtwarzanie do punktu w czasie. Wpis ma LSN.</li>
  <li>Oracle: undo log (wycofanie) + redo log (odtwarzanie).</li>
  <li><strong>WAL</strong>: zapis do dziennika przed zatwierdzeniem transakcji.</li>
  <li>Serwer pracuje na stronach w RAM (pula buforów); licznik odwołań; bit dirty → zapis na dysk przed zastąpieniem.</li>
  <li>Filegroup (MS SQL: <code>ON grupa</code>) / tablespace (Oracle: <code>TABLESPACE t</code>).</li>
  <li>Log na innym dysku niż dane; nie na dysku systemowym. RAID 1 zalecany, RAID 0 szybki ale ryzykowny.</li>
</ul>
`
},

'adm-indexes': {
  title: 'Indeksy i plan wykonania zapytania',
  lead: 'Jak serwer szybko znajduje dane: B+drzewo, indeksy pogrupowane i niepogrupowane, złożone, pokrywające, kiedy warto je zakładać i jak czytać plan zapytania.',
  body: `
<h2>Czym jest indeks</h2>
<p>Zapytanie <code>SELECT * FROM emp WHERE ename = 'BLAKE'</code> bez indeksu wymaga przejrzenia <strong>wszystkich</strong> wierszy, czyli wczytania wszystkich stron tabeli — przy dużej tabeli to bardzo kosztowne.</p>
<p><strong>Indeks</strong> to dodatkowa struktura, która wiąże wartości z kolumny z adresami fizycznymi wierszy (miejscem na dysku). Działa jak <strong>skorowidz w książce</strong>: szukasz hasła w alfabetycznej liście i od razu wiesz, na której stronie jest.</p>
<div data-code="adm-idx-create"></div>

<h2>Kiedy warto zakładać indeks</h2>
<table>
  <thead><tr><th>Warto</th><th>Raczej nie warto</th></tr></thead>
  <tbody>
    <tr><td>na <strong>kluczach obcych</strong> (niemal zawsze)</td><td>na tabelach <strong>często aktualizowanych</strong> (każdy INSERT/UPDATE/DELETE musi też poprawić indeks)</td></tr>
    <tr><td>na kluczu głównym (zakładany automatycznie)</td><td>na tabelach rzadko przeszukiwanych warunkiem WHERE</td></tr>
    <tr><td>na kolumnach często w <code>WHERE</code></td><td>na <strong>małych</strong> tabelach</td></tr>
    <tr><td>na kolumnach w <code>ORDER BY</code>, <code>GROUP BY</code>, <code>DISTINCT</code></td><td>na danych <strong>mało selektywnych</strong> (np. płeć)</td></tr>
  </tbody>
</table>

<h2>B+drzewo</h2>
<p>Najczęstsza struktura indeksu. Korzeń i węzły pośrednie zawierają wartości „drogowskazy”, a <strong>liście</strong> — wszystkie wartości klucza (uporządkowane) ze wskaźnikami do danych. Zalety:</p>
<ul>
  <li>duże rozgałęzienie → od korzenia do liścia tylko kilka odczytów;</li>
  <li>wspiera wyszukiwanie <strong>zakresowe</strong> (BETWEEN, &gt;, &lt;);</li>
  <li>wspiera <strong>sortowanie</strong>.</li>
</ul>

<h2>Indeks pogrupowany i niepogrupowany</h2>
<table>
  <thead><tr><th></th><th>Pogrupowany (CLUSTERED)</th><th>Niepogrupowany (NONCLUSTERED)</th></tr></thead>
  <tbody>
    <tr><td>Dane</td><td>wiersze tabeli <strong>fizycznie ułożone</strong> w kolejności indeksu</td><td>wiersze w innej (zwykle przypadkowej) kolejności; indeks trzyma wskaźniki</td></tr>
    <tr><td>Ile na tabelę</td><td><strong>tylko jeden</strong></td><td>wiele</td></tr>
    <tr><td>Najlepszy do</td><td>zakresów, sortowania, danych mało selektywnych; daje większy zysk</td><td>zapytań zwracających pojedyncze wiersze; kluczy obcych</td></tr>
  </tbody>
</table>
<div data-code="adm-idx-types"></div>
<p>Inne struktury: <strong>indeks haszowany</strong> — dobry tylko do wyszukiwania po równości (bez zakresów i sortowania); <strong>indeks bitmapowy</strong> — używany w hurtowniach danych.</p>

<h2>Indeks złożony i strategia „tylko indeks”</h2>
<ul>
  <li><strong>Indeks złożony</strong> — na kilku kolumnach. <strong>Kolejność ma znaczenie:</strong> serwer użyje go, gdy zapytanie odwołuje się co najmniej do <em>pierwszej</em> kolumny indeksu.</li>
  <li><strong>Strategia „tylko indeks” (indeks pokrywający)</strong> — jeśli wszystkie kolumny użyte w zapytaniu są w indeksie, serwer w ogóle nie czyta stron z danymi. Często najszybsza metoda.</li>
  <li><strong>Kolumny dołączone</strong> (<code>INCLUDE</code>, MS SQL) — dodatkowe kolumny przechowywane tylko w liściach indeksu niepogrupowanego; ułatwiają strategię „tylko indeks”.</li>
</ul>

<h2>Kiedy indeks nie zadziała</h2>
<p>Jeśli w WHERE kolumna jest „schowana” w funkcji lub wyrażeniu (<code>sal * 12 = 12000</code>), serwer może nie użyć indeksu. Przepisz warunek (<code>sal = 1000</code>) albo użyj indeksu funkcyjnego (Oracle) / kolumny wyliczanej z indeksem (MS SQL).</p>
<div data-code="adm-idx-where"></div>

<h2>Plan wykonania zapytania</h2>
<p>Plan to graficzna reprezentacja sposobu wykonania zapytania wybranego przez optymalizator, z <strong>szacowanymi kosztami</strong> (CPU, wejście/wyjście, łącznie). Pozwala sprawdzić, czy (i który) indeks został użyty, i porównać koszty przed i po założeniu indeksu. Na ćwiczeniach patrzy się na <em>Estimated Subtree Cost</em> ostatniej (najbardziej lewej) operacji.</p>
<table>
  <thead><tr><th>Operacja</th><th>Znaczenie</th></tr></thead>
  <tbody>
    <tr><td><strong>Table Scan</strong></td><td>przeczytano całą tabelę. Przy zapytaniu z WHERE — sygnał, że może warto założyć indeks.</td></tr>
    <tr><td><strong>Index Seek</strong></td><td>indeks użyty do znalezienia konkretnych wierszy — dobrze.</td></tr>
    <tr><td><strong>Index Scan</strong></td><td>indeks użyty do przeczytania wszystkich wierszy. Przy WHERE — może warto inny indeks.</td></tr>
    <tr><td><strong>Nested Loops</strong></td><td>złączenie pętlami zagnieżdżonymi, zwykle z użyciem indeksów.</td></tr>
    <tr><td><strong>Merge Join</strong></td><td>złączenie przez scalanie posortowanych zbiorów.</td></tr>
  </tbody>
</table>
<div data-code="adm-stats"></div>

<h2>Optymalizator, statystyki i strojenie</h2>
<ul>
  <li>Oracle, MS SQL i większość współczesnych serwerów mają <strong>optymalizator kosztowy</strong>: na podstawie <strong>statystyk</strong> (rozkład danych, liczba wierszy) szacuje, który plan będzie najszybszy. Statystyki muszą być aktualne (automat, ręcznie lub wg harmonogramu).</li>
  <li>Programista może dać <strong>podpowiedź</strong> (hint), jak wykonać zapytanie — tylko w szczególnych przypadkach.</li>
  <li><strong>Pielęgnacja indeksów</strong>: po wielu zmianach indeks się „fragmentuje”; przebudowuje się go ręcznie lub (lepiej) automatycznie wg harmonogramu.</li>
  <li><strong>Strojenie</strong> to proces ciągły i kompromis — poprawa jednego może pogorszyć inne; nie chodzi tylko o indeksy i nie tylko o najwolniejsze zapytania, ale o ogólne obciążenie serwera. Pomagają narzędzia typu <em>Database Engine Tuning Advisor</em>, które na podstawie zarejestrowanej pracy (workload) proponują indeksy.</li>
</ul>
<div data-note="lecture"><p>Na ćwiczeniach: tabela ze 100 tys. losowych wierszy, porównanie planów i kosztów — bez indeksu, z indeksem niepogrupowanym, złożonym, pogrupowanym; wyszukiwanie punktowe, zakresowe i sortowanie. Ogólny wniosek: indeks niepogrupowany świetnie działa dla pojedynczych wartości, słabo dla zakresów; pogrupowany wygrywa przy zakresach i ORDER BY.</p></div>
`,
  cheat: `
<ul>
  <li>Indeks = skorowidz: wartość → adres wiersza. <code>CREATE [UNIQUE] INDEX i ON t (kol);</code> · <code>DROP INDEX i ON t</code> (MS) / <code>DROP INDEX i</code> (Oracle).</li>
  <li>Warto: FK, PK (auto), WHERE, ORDER BY/GROUP BY/DISTINCT. Nie warto: małe tabele, często zmieniane, mało selektywne dane.</li>
  <li>B+drzewo: mało odczytów, zakresy, sortowanie.</li>
  <li><strong>CLUSTERED</strong>: dane fizycznie w kolejności, 1 na tabelę, zakresy i sortowanie. <strong>NONCLUSTERED</strong>: wiele, pojedyncze wiersze, FK.</li>
  <li>Hash — tylko równość. Bitmapowy — hurtownie.</li>
  <li>Złożony <code>(a, b)</code>: działa, gdy WHERE używa <strong>a</strong>. „Tylko indeks” = wszystkie kolumny zapytania w indeksie; <code>INCLUDE (…)</code> w MS SQL.</li>
  <li>Funkcja na kolumnie w WHERE psuje indeks → przepisz warunek / indeks funkcyjny (Oracle) / kolumna wyliczana (MS).</li>
  <li>Plan: Table Scan (źle przy WHERE), Index Seek (dobrze), Index Scan, Nested Loops, Merge Join. Koszt: Estimated Subtree Cost.</li>
  <li><code>SET STATISTICS IO ON</code> / <code>TIME ON</code>.</li>
  <li>Optymalizator kosztowy + aktualne statystyki; hinty rzadko; pielęgnacja indeksów; Tuning Advisor.</li>
</ul>
`
},

'adm-transactions': {
  title: 'Transakcje, izolacja i blokady',
  lead: 'ACID, COMMIT/ROLLBACK/SAVEPOINT, autocommit, anomalie współbieżności, cztery poziomy izolacji, blokady S/X, protokół 2PL, zakleszczenia i wielowersyjność.',
  body: `
<h2>Czym jest transakcja</h2>
<p>Pojedyncze polecenie SQL jednego użytkownika jest proste. Ale z punktu widzenia aplikacji jedna „operacja” to często <strong>ciąg odczytów i zapisów</strong>, a do tego wielu użytkowników pracuje na tych samych danych naraz. Serwer przeplata ich operacje (<strong>współbieżność</strong>), ale efekt ma być taki, jakby każda transakcja działała sama.</p>
<p>Przykład z wykładu — przelew 1000 zł:</p>
<ol class="steps">
  <li><code>SELECT Saldo FROM Konto WHERE IdKonta = 1234</code> — czy są środki?</li>
  <li><code>UPDATE Konto SET Saldo = Saldo − 1000 WHERE IdKonta = 1234</code></li>
  <li><code>UPDATE Konto SET Saldo = Saldo + 1000 WHERE IdKonta = 5678</code></li>
</ol>
<p>Co może pójść źle: awaria między krokiem 2 i 3 (pieniądze znikają!) albo inna transakcja zmniejszy saldo między krokiem 1 i 2.</p>
<div data-code="adm-tx-transfer"></div>

<h2>ACID</h2>
<dl>
  <dt>A — Atomowość</dt><dd>wykonują się wszystkie operacje transakcji albo żadna.</dd>
  <dt>C — Spójność</dt><dd>po transakcji baza jest spójna (jeśli była spójna przed).</dd>
  <dt>I — Izolacja</dt><dd>wynik jest taki, jakby w tym czasie nikt inny nie działał na tych danych.</dd>
  <dt>D — Trwałość</dt><dd>zatwierdzone dane przetrwają awarię sprzętu i oprogramowania.</dd>
</dl>
<p>Mechanizmy, które to zapewniają: <strong>blokady</strong>, <strong>dzienniki</strong> (np. transaction log) i <strong>migawki</strong> (kilka wersji tych samych wierszy).</p>

<h2>Zatwierdzanie i wycofywanie</h2>
<ul>
  <li>Serwer sam zakłada transakcję na każdą instrukcję DML.</li>
  <li>Własna transakcja w MS SQL: <code>BEGIN TRAN[SACTION]</code> … <code>COMMIT</code> / <code>ROLLBACK</code>.</li>
  <li><code>SAVE TRAN nazwa</code> — punkt zapisu; <code>ROLLBACK TRAN nazwa</code> wycofuje tylko do niego.</li>
  <li>Domyślnie działa <strong>autocommit</strong> (COMMIT po każdej instrukcji DML i DDL). Wyłączenie: MS SQL <code>SET IMPLICIT_TRANSACTIONS ON</code>, Oracle <code>SET AUTOCOMMIT OFF</code>.</li>
</ul>
<div data-code="adm-tx-basic"></div>

<h2>Anomalie przy przeplataniu transakcji</h2>
<table>
  <thead><tr><th>Anomalia</th><th>Co się dzieje</th></tr></thead>
  <tbody>
    <tr><td><strong>Brudny odczyt</strong> (dirty read)</td><td>T1 zapisuje A, T2 czyta A, T1 robi ROLLBACK — T2 przeczytała coś, czego „nigdy nie było”.</td></tr>
    <tr><td><strong>Niepowtarzalny odczyt</strong></td><td>T1 czyta A, T2 zmienia A i zatwierdza, T1 czyta A ponownie — dostaje inną wartość.</td></tr>
    <tr><td><strong>Fantomy</strong></td><td>T1 czyta zbiór wierszy spełniających warunek (np. najlepiej zarabiający SALESMAN), T2 dopisuje nowy pasujący wiersz — przy ponownym odczycie pojawia się „fantom”.</td></tr>
  </tbody>
</table>

<h2>Poziomy izolacji (standard ANSI/ISO)</h2>
<table>
  <thead><tr><th>Poziom</th><th>Brudny odczyt</th><th>Niepowtarzalny odczyt</th><th>Fantomy</th></tr></thead>
  <tbody>
    <tr><td>READ UNCOMMITTED</td><td class="table__yes">TAK</td><td class="table__yes">TAK</td><td class="table__yes">TAK</td></tr>
    <tr><td>READ COMMITTED (<strong>domyślny</strong>)</td><td class="table__no">NIE</td><td class="table__yes">TAK</td><td class="table__yes">TAK</td></tr>
    <tr><td>REPEATABLE READ</td><td class="table__no">NIE</td><td class="table__no">NIE</td><td class="table__yes">TAK</td></tr>
    <tr><td>SERIALIZABLE</td><td class="table__no">NIE</td><td class="table__no">NIE</td><td class="table__no">NIE</td></tr>
  </tbody>
</table>
<p>„TAK” = anomalia może wystąpić. Poziom ustawia się poleceniem <code>SET TRANSACTION ISOLATION LEVEL …</code>; działa tylko w bieżącym połączeniu/procedurze i dopiero od następnej transakcji (warto zrobić COMMIT).</p>
<div data-code="adm-autocommit"></div>
<div data-note="exam"><p>Zapamiętaj tabelę „schodkami”: każdy wyższy poziom usuwa o jedną anomalię więcej. Domyślny = READ COMMITTED. SERIALIZABLE usuwa wszystkie, ale najbardziej ogranicza współbieżność.</p></div>

<h2>Blokady</h2>
<ul>
  <li><strong>Współdzielona (S, shared)</strong> — do odczytu; wiele transakcji może mieć S na tym samym obiekcie, ale nikt nie założy wtedy X.</li>
  <li><strong>Wyłączna (X, exclusive)</strong> — do zapisu; tylko jedna transakcja, żadnych innych blokad (nawet S).</li>
  <li><strong>Blokady wielopoziomowe</strong>: baza → tabela → strona → rekord; blokada na obiekcie „w środku” wymusza pewną blokadę na obiekcie nadrzędnym.</li>
</ul>
<h3>Protokół Strict 2PL (ścisłe blokowanie dwufazowe)</h3>
<ol class="steps">
  <li>Przed odczytem obiektu transakcja zakłada S, przed zapisem — X. Kto nie może założyć blokady, czeka w kolejce albo jest wycofywany.</li>
  <li>Wszystkie blokady są zwalniane <strong>naraz</strong> — przy COMMIT lub ROLLBACK.</li>
</ol>
<p>Dwie fazy: zakładanie blokad (i praca) → zwolnienie wszystkiego na końcu.</p>
<h3>Zakleszczenie (deadlock)</h3>
<p>Cykl transakcji czekających nawzajem na swoje blokady (T1 czeka na T2, T2 na T1). Sposoby: <strong>zapobieganie</strong>, <strong>wykrywanie</strong> (serwer wybiera „ofiarę” i ją wycofuje), <strong>timeout</strong>.</p>
<p>SZBD zakłada blokady sam (zależnie od poziomu izolacji), ale można też ręcznie:</p>
<div data-code="adm-locks"></div>

<h2>Wielowersyjność</h2>
<p>Zamiast blokować czytelników: proces zapisujący tworzy <strong>nową wersję</strong> obiektu, a czytający dalej korzystają ze starej (z puli wersji). Odczyty nie zakładają blokad, nie wstrzymują zapisów i nie są przez nie wstrzymywane — mniej zakleszczeń.</p>
<ul>
  <li>MS SQL: poziom <code>SNAPSHOT</code> — blokowanie optymistyczne: odczyty pracują na migawce z początku transakcji; jeśli ktoś inny w tym czasie zmienił te same dane, transakcja SNAPSHOT dostaje błąd.</li>
  <li>Oracle: przy READ COMMITTED zapytania nie zakładają blokad współdzielonych — korzysta z wielowersyjności; także <code>SET TRANSACTION READ ONLY</code>.</li>
  <li><strong>Migawka bazy</strong> (database snapshot, MS SQL) — statyczny obraz bazy z danej chwili, tylko do odczytu: do raportów, analiz, zabezpieczenia przed pomyłką; zajmuje tyle miejsca, ile zmieniło się danych.</li>
</ul>
<div data-note="lecture"><p>Na ćwiczeniach: dwie zakładki SSMS, <code>IMPLICIT_TRANSACTIONS ON</code>, UPDATE w jednym oknie → SELECT w drugim czeka na blokadę do COMMIT; READ UNCOMMITTED → widać niezatwierdzone dane; SERIALIZABLE → już SELECT blokuje INSERT (brak fantomów). Przed każdym ćwiczeniem zrób COMMIT w obu oknach.</p></div>
`,
  cheat: `
<ul>
  <li>Transakcja = ciąg operacji „wszystko albo nic”. <strong>ACID</strong>: atomowość, spójność, izolacja, trwałość.</li>
  <li>MS SQL: <code>BEGIN TRAN … COMMIT / ROLLBACK</code>; <code>SAVE TRAN x</code> + <code>ROLLBACK TRAN x</code>.</li>
  <li>Autocommit domyślnie. Wyłączenie: <code>SET IMPLICIT_TRANSACTIONS ON</code> (MS), <code>SET AUTOCOMMIT OFF</code> (Oracle).</li>
  <li>Anomalie: brudny odczyt, niepowtarzalny odczyt, fantomy.</li>
  <li>READ UNCOMMITTED (wszystkie) → READ COMMITTED (<strong>domyślny</strong>, bez brudnych) → REPEATABLE READ (+ bez niepowtarzalnych) → SERIALIZABLE (bez żadnych).</li>
  <li><code>SET TRANSACTION ISOLATION LEVEL …</code> — od następnej transakcji, w tym połączeniu.</li>
  <li>Blokady: S (odczyt, wiele), X (zapis, jedna, wyklucza S). Wielopoziomowe: baza/tabela/strona/rekord.</li>
  <li><strong>Strict 2PL</strong>: S przed odczytem, X przed zapisem; zwolnienie wszystkiego przy COMMIT/ROLLBACK.</li>
  <li><strong>Deadlock</strong>: cykl oczekiwania → zapobieganie / wykrywanie / timeout.</li>
  <li>Wielowersyjność: MS <code>SNAPSHOT</code> (optymistyczne), Oracle READ COMMITTED bez S, <code>READ ONLY</code>; migawka bazy.</li>
</ul>
`
},

'adm-backup-security': {
  title: 'Kopie zapasowe i uprawnienia',
  lead: 'Po co i jak robić backup: pełny, różnicowy, dziennika; kolejność odtwarzania, NORECOVERY i punkt w czasie. Konta, użytkownicy, role, GRANT/REVOKE/DENY i schematy.',
  body: `
<h2>Po co kopie zapasowe</h2>
<ul>
  <li>żeby zminimalizować straty przy <strong>awarii</strong> (sprzęt, oprogramowanie, wirusy);</li>
  <li>żeby cofnąć skutki <strong>błędu użytkownika</strong> (np. przypadkowe usunięcie wierszy);</li>
  <li>jako <strong>archiwum</strong>.</li>
</ul>
<p>Administrator planuje <strong>strategię</strong> kopii, biorąc pod uwagę: jak często zmieniają się dane, jak są ważne, jaki przestój jest akceptowalny, jak duża jest baza, jaki mamy sprzęt i w jakich godzinach baza jest najmniej obciążona.</p>

<h2>Rodzaje kopii (MS SQL)</h2>
<table>
  <thead><tr><th>Kopia</th><th>Zawiera</th></tr></thead>
  <tbody>
    <tr><td><strong>Pełna</strong> (full)</td><td>całą bazę</td></tr>
    <tr><td><strong>Różnicowa</strong> (differential)</td><td>zmiany od ostatniej kopii <strong>pełnej</strong></td></tr>
    <tr><td><strong>Dziennika transakcji</strong> (log)</td><td>wszystkie wpisy dziennika od poprzedniej kopii dziennika</td></tr>
  </tbody>
</table>
<p>Można kopiować całą bazę albo tylko wybrane pliki / grupy plików.</p>
<h3>Kopia dziennika transakcji</h3>
<ul>
  <li>Przy jej wykonaniu dziennik jest <strong>czyszczony</strong> — bez kopii dziennika rośnie on w nieskończoność.</li>
  <li>Pozwala odtworzyć stan bazy z <strong>dowolnej chwili</strong>.</li>
  <li>Do odtworzenia potrzebna jest wcześniej odtworzona kopia pełna.</li>
  <li>Bywa „ostatnią deską ratunku”: jeśli po awarii da się jeszcze zrobić kopię dziennika, nie tracimy nic.</li>
  <li>Wymaga modelu odtwarzania bazy <strong>Full</strong> (Properties → Options → Recovery model).</li>
</ul>
<h3>Przykładowe strategie</h3>
<ul>
  <li>codziennie o 1:00 pełna + 4× dziennie (w godzinach pracy) dziennik;</li>
  <li>w niedzielę o 1:00 pełna + codziennie o 1:00 różnicowa + 4× dziennie dziennik;</li>
  <li>niedziela pełna plik1, środa pełna plik2, pozostałe dni różnicowa + 4× dziennie dziennik.</li>
</ul>
<div data-code="adm-backup"></div>

<h2>Odtwarzanie</h2>
<p><strong>Kolejność jest bardzo ważna:</strong></p>
<ol class="steps">
  <li>ostatnia dostępna kopia <strong>pełna</strong>;</li>
  <li>ostatnia dostępna kopia <strong>różnicowa</strong> (jeśli jest);</li>
  <li><strong>wszystkie po kolei</strong> kopie dziennika wykonane po ostatniej różnicowej (lub pełnej).</li>
</ol>
<p>Każdą kopię poza ostatnią odtwarzamy z opcją <code>NORECOVERY</code> — baza jest wtedy niedostępna dla użytkowników, ale można odtwarzać kolejne kopie. Ostatnią — z <code>RECOVERY</code> (domyślnie), wtedy baza staje się dostępna. Kopię dziennika można odtworzyć <strong>do punktu w czasie</strong>: <code>WITH STOPAT = 'data'</code>.</p>
<div data-code="adm-restore"></div>
<div data-note="lecture"><p>Na ćwiczeniach robi się to w Management Studio: Tasks → Back Up (typ: Full / Differential / Transaction Log), potem Restore Database → From Device. Punkt w czasie wybiera się w opcji „To a point in time” — tuż przed zmianą, ale nie wcześniej niż kopia pełna.</p></div>

<h2>Uprawnienia</h2>
<table>
  <thead><tr><th>Polecenie</th><th>Znaczenie</th></tr></thead>
  <tbody>
    <tr><td><code>GRANT</code></td><td>nadaje uprawnienie</td></tr>
    <tr><td><code>REVOKE</code></td><td>odbiera (wcześniej nadane) uprawnienie</td></tr>
    <tr><td><code>DENY</code></td><td>jawnie <strong>zabrania</strong> — silniejsze niż GRANT (tylko MS SQL)</td></tr>
  </tbody>
</table>
<h3>Użytkownicy i konta</h3>
<ul>
  <li><strong>MS SQL — dwa poziomy:</strong> <em>login</em> (konto logowania do <strong>serwera</strong>) i <em>user</em> (użytkownik w konkretnej <strong>bazie</strong>, powiązany z loginem). Sam login nie daje dostępu do baz użytkownika.</li>
  <li><strong>Oracle:</strong> <code>CREATE USER … IDENTIFIED BY hasło</code> — użytkownik to jednocześnie konto.</li>
</ul>
<h3>Role i schematy</h3>
<ul>
  <li><strong>Rola</strong> — nazwana grupa uprawnień; ułatwia zarządzanie dużą liczbą użytkowników: nadajesz prawa roli, a użytkowników dodajesz do roli.</li>
  <li><strong>Schemat</strong> — kontener obiektów (tabel, widoków…). Każdy obiekt należy do schematu (domyślnie <code>dbo</code>), każdy użytkownik ma domyślny schemat. Obiekt z innego schematu: <code>schemat.obiekt</code>. Schematy pozwalają nadawać uprawnienia zbiorczo.</li>
</ul>
<div data-code="adm-security"></div>
<div data-note="exam"><p>DENY na poziomie roli + GRANT na poziomie użytkownika → użytkownik <strong>nie</strong> wykona operacji (DENY wygrywa). To jedno z zadań z ćwiczeń.</p></div>
`,
  cheat: `
<ul>
  <li>Backup: pełny (całość), <strong>różnicowy</strong> (od ostatniego pełnego), <strong>dziennika</strong> (od ostatniej kopii dziennika; czyści log; model Full).</li>
  <li><code>BACKUP DATABASE b TO DISK = '…' [WITH DIFFERENTIAL];</code> · <code>BACKUP LOG b TO DISK = '…';</code></li>
  <li>Odtwarzanie: pełny → ostatni różnicowy → wszystkie logi po kolei.</li>
  <li>Wszystko poza ostatnim: <code>WITH NORECOVERY</code>; ostatni: <code>WITH RECOVERY</code>.</li>
  <li>Punkt w czasie: <code>RESTORE LOG … WITH STOPAT = '…'</code>.</li>
  <li>Strategie: np. pełny co noc + log 4× dziennie; lub pełny w niedzielę + różnicowy codziennie + log.</li>
  <li>GRANT / REVOKE / DENY (DENY &gt; GRANT, tylko MS SQL).</li>
  <li>MS SQL: <code>CREATE LOGIN … WITH PASSWORD</code> (serwer) + <code>CREATE USER … FOR LOGIN</code> (baza). Oracle: <code>CREATE USER … IDENTIFIED BY</code>.</li>
  <li>Rola: <code>CREATE ROLE r; GRANT … TO r;</code> + członkowie. Schemat: kontener, domyślnie <code>dbo</code>, <code>schemat.obiekt</code>.</li>
</ul>
`
},

'adm-performance': {
  title: 'Wydajność: materializacja, denormalizacja, partycjonowanie, wskazówki',
  lead: 'Zaawansowane sposoby przyspieszania bazy i praktyczne wskazówki wydajnościowe z wykładu.',
  body: `
<h2>Jak mierzyć wydajność zapytania</h2>
<p>Oprócz kosztu z planu wykonania w MS SQL można użyć:</p>
<ul>
  <li><code>SET STATISTICS IO ON</code> — scan count (liczba operacji scan), <strong>logical reads</strong> (strony przeczytane z bufora i dysku), <strong>physical reads</strong> (strony, które trzeba było pobrać z dysku), read-ahead reads (pobrane do bufora z wyprzedzeniem);</li>
  <li><code>SET STATISTICS TIME ON</code> — czas parsowania, kompilacji i wykonania.</li>
</ul>

<h2>Materializacja</h2>
<p><strong>Materializacja</strong> = trwałe przechowanie (częściowo) przeliczonych wyników, żeby później szybciej z nich korzystać. Można ją zrobić mechanizmami SZBD (perspektywy zmaterializowane w Oracle, widoki indeksowane w MS SQL) albo samodzielnie (dodatkowa tabela aktualizowana wyzwalaczami lub wg harmonogramu).</p>
<ul>
  <li>aktualizacja natychmiastowa — dane aktualne, ale kosztowna;</li>
  <li>aktualizacja okresowa — tańsza, ale wyniki mogą być nieaktualne.</li>
</ul>
<p>To świadoma <strong>redundancja</strong>!</p>
<div data-code="adm-matview"></div>

<h2>Denormalizacja</h2>
<p><strong>Denormalizacja</strong> to świadoma rezygnacja z normalizacji w celu poprawy wydajności (np. w hurtowniach danych): dodatkowe tabele lub kolumny z danymi, które da się wyliczyć z innych. W schemacie nieznormalizowanym to <strong>programista</strong>, a nie SZBD, musi pilnować spójności.</p>

<h2>Indeks funkcyjny i kolumny dołączone</h2>
<p>Przypomnienie: gdy WHERE zawiera funkcję na kolumnie, Oracle pozwala założyć indeks funkcyjny (<code>CREATE INDEX x ON emp (sal * 12)</code>), a MS SQL — kolumnę wyliczaną z indeksem. W MS SQL <code>INCLUDE (…)</code> dodaje kolumny do liści indeksu i ułatwia strategię „tylko indeks”.</p>

<h2>Partycjonowanie</h2>
<p><strong>Partycjonowanie</strong> dzieli tabelę fizycznie na części (np. na osobne dyski) — poziomo, czyli po wierszach. Zbiory są mniejsze, więc zapytania o podzbiory działają szybciej. Zalecane dla <strong>bardzo dużych</strong> tabel.</p>
<p>Przykład: ogromna tabela sprzedaży; użytkownicy zwykle pytają o jeden miesiąc → 12 partycji. Kluczowe pytanie: jak wybrać <strong>klucz partycjonowania</strong>. Partycje wyznacza się przez: zakres wartości (Oracle, MS SQL), listę wartości (Oracle), funkcję haszującą (Oracle).</p>
<div data-code="adm-partition"></div>

<h2>Współczynniki wypełnienia</h2>
<ul>
  <li>Oracle: <code>PCTFREE</code> — ile % miejsca zostawić wolnego w każdym bloku (na przyszłe UPDATE); <code>PCTUSED</code> — kiedy blok znów jest „wolny” dla INSERT. Dla tabel i indeksów.</li>
  <li>MS SQL: <code>FILLFACTOR</code> — w jakim stopniu wypełniać strony indeksu.</li>
</ul>
<div data-code="adm-fill"></div>

<h2>Wskazówki wydajnościowe (z wykładu)</h2>
<h3>1. Indeksy</h3>
<ul>
  <li>zakładaj na kluczach obcych oraz kolumnach w WHERE, ORDER BY, GROUP BY, DISTINCT;</li>
  <li>ogranicz je na małych i często aktualizowanych tabelach;</li>
  <li>pielęgnuj indeksy; rozważ strategię „tylko indeks” dla często powtarzanych zapytań;</li>
  <li>pogrupowane dają największy zysk przy zakresach i sortowaniu.</li>
</ul>
<h3>2. Transakcje</h3>
<ul>
  <li>transakcje mają być <strong>krótkie</strong> (czasem kilka krótkich zamiast jednej długiej);</li>
  <li>nie ustawiaj wysokiego poziomu izolacji „na zapas”;</li>
  <li>transakcje tylko czytające — na kopii lustrzanej lub z migawką.</li>
</ul>
<h3>3. Pliki</h3>
<ul>
  <li>dziennik, dane i system — na oddzielnych dyskach; rozważ osobny plik/dysk na indeksy; często łączone tabele na różne dyski.</li>
</ul>
<h3>4. SQL</h3>
<ul>
  <li>unikaj podzapytań, gdy się da; ogranicz funkcje i złożone wyrażenia w WHERE;</li>
  <li>nie używaj DISTINCT bez potrzeby;</li>
  <li>wyzwalacze — tylko gdy niezbędne i napisane optymalnie;</li>
  <li>unikaj kursorów — rozwiązanie z kursorem jest prawie zawsze wolniejsze niż nawet złożone zapytanie;</li>
  <li>tabele tymczasowe pomagają, gdy wynik pośredni jest używany wiele razy — ale nie, gdy wystarczy jedno polecenie.</li>
</ul>
<h3>5. Materializacja</h3>
<ul>
  <li>przy powtarzanych złożonych zapytaniach rozważ zdenormalizowaną tabelę z przeliczonymi danymi (aktualizowaną wyzwalaczami lub okresowo) albo perspektywy zmaterializowane / widoki indeksowane.</li>
</ul>
<h3>6. Budowa aplikacji</h3>
<ul>
  <li>nie pobieraj danych „na zapas” — filtruj na serwerze;</li>
  <li>sortowanie, złączenia, grupowanie szybciej zrobi serwer niż klient;</li>
  <li>ciąg poleceń SQL → jedna procedura składowana;</li>
  <li>nie otwieraj nowego połączenia dla każdego polecenia.</li>
</ul>
`,
  cheat: `
<ul>
  <li><code>SET STATISTICS IO ON</code> (logical/physical reads), <code>SET STATISTICS TIME ON</code>.</li>
  <li><strong>Materializacja</strong> = przechowywanie przeliczonych wyników (mat. view Oracle, widok indeksowany MS, tabela + wyzwalacz). Natychmiast (drogo) lub okresowo (nieaktualne). Redundancja!</li>
  <li><code>CREATE MATERIALIZED VIEW … BUILD IMMEDIATE|DEFERRED REFRESH FAST|COMPLETE|FORCE ON DEMAND|ON COMMIT AS SELECT …</code></li>
  <li><strong>Denormalizacja</strong>: świadoma, dla wydajności; spójność pilnuje programista.</li>
  <li>Indeks funkcyjny (Oracle) / kolumna wyliczana (MS); <code>INCLUDE</code>.</li>
  <li><strong>Partycjonowanie</strong>: poziomy podział dużych tabel; zakres (oba), lista, hash (Oracle). <code>PARTITION BY RANGE (kol) (PARTITION p1 VALUES LESS THAN (…), …)</code>.</li>
  <li><code>PCTFREE/PCTUSED</code> (Oracle), <code>FILLFACTOR</code> (MS).</li>
  <li>Wskazówki: indeksy na FK i WHERE; krótkie transakcje; log na osobnym dysku; bez kursorów, bez zbędnych DISTINCT i podzapytań; procedury zamiast serii poleceń; filtruj na serwerze.</li>
</ul>
`
}

});
