/* PL – Moduł 1: powtórka z Relacyjnych Baz Danych */
SBD.addContent('pl', {

'relational-model': {
  title: 'Model relacyjny, postulaty Codda i więzy spójności',
  lead: 'Czym jest baza danych, skąd nazwa „relacyjna”, co to jest NULL i jak baza sama pilnuje poprawności danych.',
  body: `
<h2>Czym jest baza danych</h2>
<p>Dane to jeden z najcenniejszych zasobów każdej firmy — obok pieniędzy, ludzi i budynków. Trzeba nimi <strong>zarządzać</strong>: przechowywać, chronić, udostępniać. Tym zajmuje się baza danych.</p>
<p>Słowo „baza danych” ma dwa znaczenia:</p>
<ul>
  <li><strong>System Zarządzania Bazą Danych (SZBD, ang. DBMS)</strong> — program, który pilnuje struktury danych, bezpieczeństwa i zasad dostępu (np. MS SQL Server, Oracle);</li>
  <li><strong>kolekcja danych</strong> — same dane zapisane w tym systemie.</li>
</ul>
<p>Laik myśli zwykle o drugim znaczeniu („mam w zeszycie bazę kontaktów”). My, informatycy, rozumiemy bazę danych jako <strong>oba naraz</strong>: system + dane, którymi on zarządza.</p>
<div data-note="analogy"><p>Biblioteka: książki na półkach to <em>dane</em>, a bibliotekarz z regulaminem (kto może wypożyczyć, gdzie co stoi, czego nie wolno) to <em>SZBD</em>.</p></div>
<div data-note="lecture"><p>Na wykładzie padło przypomnienie, że dane są dziś bardzo cenne (wycieki danych medycznych milionów osób), a bazy danych mamy dosłownie wszędzie — nawet w telefonie.</p></div>

<h2>Skąd nazwa „relacyjna”</h2>
<p>Model relacyjny zaproponował <strong>Edgar Codd w 1970 r.</strong> — i działa do dziś (ponad pół wieku!). Nazwa pochodzi z matematyki:</p>
<ul>
  <li><strong>Iloczyn kartezjański</strong> A × B to zbiór <em>wszystkich</em> par (x, y), gdzie x ∈ A, y ∈ B. Nie jest przemienny: A × B ≠ B × A.</li>
  <li>Pojedyncza para (x, y) to <strong>krotka</strong>. Dla n zbiorów krotka ma n elementów.</li>
  <li><strong>Relacja</strong> to <em>podzbiór</em> iloczynu kartezjańskiego.</li>
  <li><strong>Tabela</strong> to fizyczna postać relacji: n zbiorów → n kolumn, każda krotka → jeden wiersz.</li>
</ul>
<p>Przykład: A = {Ala, Ola}, B = {SQL, Java}. A × B = {(Ala,SQL), (Ala,Java), (Ola,SQL), (Ola,Java)}. Relacja „kto zna jaki język” to np. {(Ala,SQL), (Ola,Java)} — czyli tabela z dwoma wierszami.</p>
<div data-note="warn"><p>Baza <strong>nie</strong> nazywa się relacyjna dlatego, że „tabele są połączone relacjami”. Połączenia między tabelami to <strong>związki</strong>. Nazwa pochodzi od <strong>relacji = tabeli</strong> (podzbioru iloczynu kartezjańskiego). Prowadzący podkreślał, że ten błąd zdarza się nawet na obronach prac inżynierskich.</p></div>
<p>Co ważne: relacją jest nie tylko tabela, ale też <strong>wynik każdego SELECT</strong> i <strong>widok</strong>. W bazie relacyjnej wszystko, na czym operujemy, to relacje — dlatego możemy je ze sobą porównywać i łączyć.</p>

<h2>Trzy poziomy patrzenia na bazę</h2>
<dl>
  <dt>Logiczny</dt><dd>projekt: tabele, kolumny, typy danych, związki.</dd>
  <dt>Fizyczny</dt><dd>pliki na dysku, w których serwer naprawdę trzyma dane (poznamy je na wykładach z administracji).</dd>
  <dt>Użytkownika</dt><dd>interfejsy (aplikacje), przez które zwykły człowiek ogląda i zmienia dane, nie znając SQL.</dd>
</dl>

<h2>Postulaty Codda</h2>
<p>Codd opisał bazę relacyjną 13 regułami (0–12). Nie trzeba znać wszystkich na pamięć, ale te wyróżnione na wykładzie warto rozumieć:</p>
<table>
  <thead><tr><th>Nr</th><th>Postulat</th><th>Po ludzku</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>Postulat zerowy</td><td>System relacyjny zarządza danymi <strong>wyłącznie</strong> środkami modelu relacyjnego — bez mieszania z innymi rozwiązaniami.</td></tr>
    <tr><td>1</td><td>Informacyjny</td><td>Na poziomie logicznym wszystko (także nazwy tabel i kolumn) to wartości w tabelach.</td></tr>
    <tr><td>2</td><td>Gwarancji dostępu</td><td>Do każdej pojedynczej danej dojdziesz znając 3 rzeczy: <strong>nazwę tabeli + nazwę kolumny + wartość klucza głównego</strong>. (W MS SQL dochodzi czwarta: nazwa bazy.)</td></tr>
    <tr><td>3</td><td>Obiektu NULL</td><td>Istnieje specjalny znacznik <code>NULL</code> = „brak wartości / nie wiem”. To <strong>nie</strong> jest 0 ani pusty napis i działa dla każdego typu.</td></tr>
    <tr><td>4</td><td>Struktury metadanych</td><td>Opis bazy (jakie są tabele, kolumny…) też jest trzymany w tabelach i czytamy go SQL-em.</td></tr>
    <tr><td>5</td><td>Pełnego języka</td><td>Jeden język (SQL) do wszystkiego: definicji tabel, widoków, więzów, danych, uprawnień, transakcji.</td></tr>
    <tr><td>6</td><td>Modyfikowania przez perspektywy</td><td>Dane można zmieniać przez widoki, jeśli ma to sens.</td></tr>
    <tr><td>7</td><td>Operacji na wysokim poziomie</td><td>Operujemy na całych zbiorach (tabelach), a nie tylko wiersz po wierszu.</td></tr>
    <tr><td>8</td><td>Fizycznej niezależności</td><td>Zmiana sposobu zapisu na dysku nie psuje aplikacji.</td></tr>
    <tr><td>9</td><td>Logicznej niezależności</td><td>Poprawne zmiany w tabelach nie psują aplikacji.</td></tr>
    <tr><td>10</td><td>Niezależności więzów spójności</td><td>Reguły poprawności definiujemy w bazie, a nie w aplikacji.</td></tr>
    <tr><td>11</td><td>Niezależności dystrybucyjnej</td><td>Dane mogą leżeć w różnych miejscach sieci (bazy rozproszone) — już prawie 60 lat temu!</td></tr>
    <tr><td>12</td><td>Zabezpieczenia przed operacjami niskiego poziomu</td><td>Nawet „od spodu” nie da się ominąć więzów spójności.</td></tr>
  </tbody>
</table>

<h2>NULL i logika trójwartościowa</h2>
<p><code>NULL</code> znaczy „nie wiem”. Dlatego:</p>
<ul>
  <li>każde działanie arytmetyczne lub tekstowe z <code>NULL</code> daje <code>NULL</code> (np. <code>5 * NULL = NULL</code>);</li>
  <li>nawet <code>NULL = NULL</code> nie daje TRUE, tylko <code>NULL</code> („nie wiem, czy dwie nieznane rzeczy są równe”);</li>
  <li>w logice są dwa wyjątki: <code>NULL OR TRUE = TRUE</code> i <code>NULL AND FALSE = FALSE</code>.</li>
</ul>
<table>
  <thead><tr><th>A</th><th>B</th><th>A AND B</th><th>A OR B</th><th>NOT A</th></tr></thead>
  <tbody>
    <tr><td>TRUE</td><td>NULL</td><td>NULL</td><td>TRUE</td><td>FALSE</td></tr>
    <tr><td>FALSE</td><td>NULL</td><td>FALSE</td><td>NULL</td><td>TRUE</td></tr>
    <tr><td>NULL</td><td>NULL</td><td>NULL</td><td>NULL</td><td>NULL</td></tr>
  </tbody>
</table>
<div data-note="exam"><p>Klauzula <code>WHERE</code> przepuszcza tylko wiersze, dla których warunek jest <strong>TRUE</strong>. Wiersze z wynikiem FALSE <em>albo NULL</em> odpadają. Stąd biorą się „znikające” wiersze z NULL-ami.</p></div>

<h2>Więzy spójności (constraints)</h2>
<p><strong>Więzy spójności</strong> to reguły, które gwarantują, że dane w bazie są logicznie poprawne. Najważniejsza zasada:</p>
<p><strong>My definiujemy reguły przy projektowaniu bazy — a SZBD pilnuje ich przestrzegania</strong>, zawsze i dla każdego (każdej aplikacji, każdego użytkownika).</p>
<p>Więzy można zdefiniować: deklaracjami w SQL (najprościej), wyzwalaczami, procedurami lub indeksami. Te bardziej skomplikowane reguły często wymagają wyzwalaczy i procedur — czyli programowania, które poznamy w tym semestrze.</p>

<h3>Klucz główny — PRIMARY KEY</h3>
<p>Jednoznacznie identyfikuje wiersz. Z teorii wynika, że każdy wiersz tabeli musi być inny, ale SQL sam tego nie pilnuje — dlatego potrzebujemy klucza. Wymagania:</p>
<ul>
  <li><strong>unikalność</strong> — w każdym wierszu inna wartość (dla klucza złożonego: inna kombinacja wartości);</li>
  <li><strong>brak NULL</strong> — NULL na każde pytanie odpowiada „nie wiem”, więc nie może być identyfikatorem.</li>
</ul>
<p>Klucz główny jest <strong>jeden</strong> na tabelę (kluczy kandydujących może być kilka — jeden wybieramy na główny). Jeśli żadna naturalna kolumna nie jest unikalna, dodajemy <strong>sztuczny klucz</strong> (np. kolejny numer).</p>

<h3>UNIQUE, NOT NULL, CHECK</h3>
<ul>
  <li><strong>UNIQUE</strong> — wartości znaczące nie mogą się powtarzać, ale NULL jest dozwolony. Oracle robi to zgodnie z teorią (wiele NULL-i), a MS SQL Server traktuje NULL jak zwykłą wartość — w kolumnie UNIQUE może być <em>tylko jeden</em> NULL.</li>
  <li><strong>NOT NULL</strong> — w kolumnie musi być wartość.</li>
  <li><strong>CHECK</strong> — warunek dla wartości, np. przedział ocen 2–5 albo porównanie dwóch kolumn (data końca ≥ data początku).</li>
</ul>

<h3>Więzy referencyjne — FOREIGN KEY</h3>
<p>Powstają, gdy łączymy tabele układem <strong>klucz główny ↔ klucz obcy</strong>. Reguła: wartość klucza obcego w tabeli podrzędnej (strona „wiele”) musi istnieć jako klucz główny w tabeli nadrzędnej (strona „jeden”) — albo być NULL, jeśli związek jest opcjonalny. SZBD pilnuje tego automatycznie.</p>
<div data-code="rm-constraints"></div>

<h2>Indeks — zapowiedź</h2>
<p><strong>Indeks</strong> to dodatkowa struktura, która pozwala szybko znaleźć wiersze po wartości w kolumnie — jak skorowidz na końcu książki: zamiast czytać całą książkę, patrzysz w skorowidz i od razu wiesz, na której stronie jest hasło. Na tabeli może być <strong>jeden indeks pogrupowany (posortowany)</strong> i <strong>kilka niepogrupowanych</strong>. Szczegóły: wykład o indeksach.</p>
`,
  cheat: `
<ul>
  <li><strong>Baza danych</strong> = SZBD (system zarządzania) + kolekcja danych.</li>
  <li><strong>Relacja</strong> = podzbiór iloczynu kartezjańskiego = <strong>tabela</strong> (a także wynik SELECT i widok). Połączenia tabel to <strong>związki</strong>, nie relacje!</li>
  <li>A × B — wszystkie pary, nieprzemienny. Para = <strong>krotka</strong>.</li>
  <li>Poziomy: logiczny, fizyczny (pliki), użytkownika (interfejsy).</li>
  <li>Codd 1970, 13 postulatów (0–12). Kluczowe: 0 (tylko model relacyjny), 2 (tabela + kolumna + klucz), 3 (NULL), 4 (metadane w tabelach), 10 (więzy w bazie), 11 (rozproszenie).</li>
  <li><code>NULL</code> ≠ 0 ≠ ''. Działanie z NULL → NULL. <code>NULL = NULL</code> → NULL. Wyjątki: <code>NULL OR TRUE = TRUE</code>, <code>NULL AND FALSE = FALSE</code>.</li>
  <li>WHERE przepuszcza tylko TRUE.</li>
  <li>Więzy: <strong>my definiujemy, SZBD pilnuje</strong>.
    <ul>
      <li>PK: unikalny + NOT NULL, jeden na tabelę, może być złożony.</li>
      <li>UNIQUE: bez powtórzeń, NULL dozwolony (MS SQL: tylko jeden NULL).</li>
      <li>NOT NULL, CHECK (warunek), FK (wartość z PK tabeli nadrzędnej albo NULL).</li>
    </ul>
  </li>
  <li>Indeks = skorowidz; 1 pogrupowany + wiele niepogrupowanych.</li>
</ul>
`
},

'erd': {
  title: 'Projektowanie: diagramy związków encji (ERD)',
  lead: 'Jak z opisu rzeczywistości zrobić projekt tabel: encje, atrybuty, związki 1:N, M:N, rekurencyjne i 1:1.',
  body: `
<h2>Po co rysujemy diagram</h2>
<p>Baza danych opisuje fragment rzeczywistości. Zanim napiszemy dziesiątki <code>CREATE TABLE</code>, rysujemy <strong>model pośredni</strong> — diagram związków encji (ERD). Z jednej strony pokazuje obiekty świata i zależności między nimi, z drugiej jest wzorem przyszłych tabel. Obrazek jest dużo łatwiejszy do zrozumienia niż kod, dlatego używamy narzędzi CASE (na zajęciach: Vertabelo), które potem same generują skrypt SQL.</p>

<h2>Encja, atrybut, instancja</h2>
<ul>
  <li><strong>Encja</strong> — model <em>klasy obiektów</em>, które da się opisać tymi samymi cechami: Student, Samochód, Sala wykładowa. Z encji powstaje tabela.</li>
  <li><strong>Atrybut</strong> — nazwana cecha encji z typem danych (Nazwisko VARCHAR(40)). Z atrybutu powstaje kolumna.</li>
  <li><strong>Instancja encji</strong> — pojedynczy egzemplarz (konkretny student Kowalski). W tabeli — jeden wiersz.</li>
</ul>
<div data-note="analogy"><p>Encja to pusty formularz „Karta studenta”, atrybuty to pola formularza, a instancje to wypełnione karty konkretnych osób.</p></div>
<div data-note="lecture"><p>Dobra praktyka: <strong>najpierw</strong> zaprojektuj encje dla rzeczy, które naprawdę istnieją, <strong>potem</strong> zastanów się nad związkami. Pamiętaj, że między dwiema encjami może być <strong>więcej niż jeden</strong> związek (np. Osoba–Miasto: „mieszka w” i „urodziła się w”).</p></div>

<h2>Związek</h2>
<p><strong>Związek</strong> to uporządkowana lista encji (encja może się na niej powtarzać), zapis formalny: Z(E1, …, En). Najczęściej mamy <strong>związki binarne</strong> — między dwiema encjami, np. Student i Miasto urodzenia. Instancja związku to zbiór par, np. (Kowalski, Warszawa), (Zieliński, Kraków).</p>

<h2>Związek jednoznaczny (jeden-do-wielu, 1:N)</h2>
<p>Związek jest <strong>jednoznaczny</strong>, gdy da się go opisać funkcją: każdemu studentowi przypisujemy <em>co najwyżej jedno</em> miasto urodzenia. Jedno miasto może mieć wielu studentów.</p>
<ul>
  <li><strong>Strona „wiele”</strong> (encja podrzędna) — dziedzina funkcji: Student.</li>
  <li><strong>Strona „jeden”</strong> (encja nadrzędna) — przeciwdziedzina: Miasto.</li>
  <li>Jeśli nie znamy miasta dla każdego studenta — funkcja <em>częściowa</em>, jeśli znamy dla wszystkich — <em>zupełna</em>.</li>
</ul>
<p><strong>Implementacja:</strong> dwie tabele. Do tabeli po stronie „wiele” dodajemy kolumnę <strong>klucza obcego</strong>, która wskazuje wartość klucza głównego tabeli po stronie „jeden” (Student.IdMiasto → Miasto.IdMiasto). Narzędzie CASE robi to samo, gdy przeciągasz linię związku.</p>

<h2>Właściwości związku</h2>
<dl>
  <dt>Nazwa</dt><dd>Każdy związek ma unikalną nazwę. Narzędzia CASE sklejają ją z nazw tabel. <strong>Uwaga w Oracle:</strong> każda nazwa ma max. 30 znaków — przy długich nazwach tabel trzeba nazwę związku skrócić ręcznie.</dd>
  <dt>Liczność (cardinality)</dt><dd>Ile razy po stronie „wiele” może pojawić się ta sama wartość klucza ze strony „jeden” (zwykle 0..wiele, ale bywa inaczej).</dd>
  <dt>Identyfikujący / nieidentyfikujący</dt><dd>Identyfikujący — klucz obcy <strong>wchodzi w skład klucza głównego</strong> tabeli podrzędnej. Nieidentyfikujący — nie wchodzi.</dd>
  <dt>Opcjonalność</dt><dd>Związek jest opcjonalny, gdy kolumna klucza obcego dopuszcza NULL.</dd>
  <dt>Akcje referencyjne</dt><dd>Co serwer robi, gdy usuwamy wiersz nadrzędny, do którego odwołują się wiersze podrzędne: <code>NO ACTION</code> (domyślnie — blokada), <code>SET NULL</code>, <code>SET DEFAULT</code>, <code>CASCADE</code> (usuń też podrzędne).</dd>
</dl>
<div data-code="erd-actions"></div>

<h2>Związek niejednoznaczny (wiele-do-wielu, M:N)</h2>
<p>Student zapisuje się na wiele przedmiotów, a na przedmiot zapisuje się wielu studentów. Takiego związku nie da się opisać funkcją — nie ma „poprzednika” i „następnika”. <strong>Model relacyjny nie potrafi go zapisać bezpośrednio</strong>, więc rozkładamy go na związki jednoznaczne:</p>
<ol class="steps">
  <li>Dla związku Z(E1, E2) tworzymy nową encję E0 — <strong>encję asocjacyjną</strong> (np. Zapis).</li>
  <li>Tworzymy dwa związki 1:N: E0–E1 i E0–E2.</li>
  <li>Klucz E0 = suma kluczy E1 i E2. Związki są <strong>identyfikujące</strong>, więc E0 jest zawsze encją zależną (słabą).</li>
  <li>Dla związku n-arnego (n &gt; 2) — jedna encja E0 i n związków binarnych.</li>
</ol>
<div data-code="erd-mn"></div>

<h2>Szczególne przypadki</h2>
<h3>Związek rekurencyjny</h3>
<p>Ta sama encja występuje w związku dwa razy — np. pracownik i jego szef (znana tabela EMP: kolumna MGR wskazuje EMPNO innego pracownika). Taki związek:</p>
<ul>
  <li><strong>nie może</strong> być identyfikujący;</li>
  <li><strong>musi</strong> być opcjonalny (FK dopuszcza NULL) — inaczej nie wstawilibyśmy pierwszego wiersza (prezes nie ma szefa).</li>
</ul>
<div data-code="erd-recursive"></div>
<h3>Związek jeden-do-jednego (1:1)</h3>
<p>Szczególny przypadek 1:N: każdemu wierszowi po stronie „jeden” odpowiada co najwyżej jeden wiersz po stronie „wiele” (funkcja różnowartościowa). Można go zrealizować jedną, dwiema lub trzema tabelami.</p>

<h2>Jak projektować — krok po kroku</h2>
<div data-note="own">
<ol>
  <li>Przeczytaj opis i podkreśl <strong>rzeczowniki</strong> — to kandydaci na encje (klient, zwierzę, wizyta…).</li>
  <li>Dla każdej encji wypisz atrybuty i wybierz <strong>identyfikator</strong> (lub dodaj sztuczny Id).</li>
  <li>Podkreśl <strong>czasowniki</strong> („klient <em>ma</em> zwierzęta”, „wizyta <em>dotyczy</em> zwierzęcia”) — to związki.</li>
  <li>Dla każdego związku zapytaj w obie strony: „ile X może mieć jeden Y?”. Wyjdzie 1:N albo M:N.</li>
  <li>Każde M:N zamień na encję asocjacyjną. Często dostaje ona własne atrybuty (np. Zapis.DataZapisu, Pozycja.Ilosc).</li>
  <li>Sprawdź, czy żadna informacja nie jest zapisana dwa razy (normalizacja — następny temat).</li>
  <li>Wygeneruj skrypt SQL i przetestuj go na serwerze.</li>
</ol>
</div>
<div data-note="own" data-label="Od autora strony — przykład (Biblioteka)">
<p>„Czytelnik wypożycza egzemplarze książek. Książka może mieć wielu autorów, autor napisał wiele książek. Biblioteka ma kilka egzemplarzy tej samej książki.”</p>
<pre data-lang="text">Autor (IdAutor PK, Imie, Nazwisko)
Ksiazka (IdKsiazka PK, Tytul, RokWydania)
KsiazkaAutor (IdKsiazka PK/FK, IdAutor PK/FK)        ← M:N Ksiazka–Autor
Egzemplarz (IdEgzemplarz PK, IdKsiazka FK, Sygnatura) ← 1:N
Czytelnik (IdCzytelnik PK, Imie, Nazwisko, Email)
Wypozyczenie (IdWypozyczenie PK, IdEgzemplarz FK, IdCzytelnik FK,
              DataOd, DataDo NULL)                    ← DataDo NULL = jeszcze nie oddana</pre>
</div>
`,
  cheat: `
<ul>
  <li><strong>ERD</strong> = model pośredni: rzeczywistość → diagram → tabele (narzędzie CASE, np. Vertabelo, generuje SQL).</li>
  <li>Encja → tabela, atrybut → kolumna, instancja → wiersz.</li>
  <li>Najpierw encje (realne rzeczy), potem związki. Między dwiema encjami może być kilka związków.</li>
  <li><strong>1:N (jednoznaczny)</strong> = funkcja. FK dodajemy po stronie <strong>„wiele”</strong> (podrzędnej).</li>
  <li>Właściwości związku: nazwa (Oracle ≤ 30 znaków!), liczność, identyfikujący (FK ∈ PK) / nieidentyfikujący, opcjonalność (FK NULL), akcje referencyjne.</li>
  <li>Akcje: <code>NO ACTION</code> (domyślna, blokuje), <code>CASCADE</code>, <code>SET NULL</code>, <code>SET DEFAULT</code>.</li>
  <li><strong>M:N</strong> → encja asocjacyjna E0; klucz = suma kluczy; związki identyfikujące; E0 zależna. N-arny: E0 + n związków.</li>
  <li><strong>Rekurencyjny</strong>: nieidentyfikujący i opcjonalny (FK NULL), np. EMP.MGR → EMP.EMPNO.</li>
  <li><strong>1:1</strong>: szczególny 1:N, 1–3 tabele.</li>
  <li>Metoda: rzeczowniki → encje, czasowniki → związki, pytaj „ile?” w obie strony.</li>
</ul>
`
},

'normalization': {
  title: 'Normalizacja: od 1NF do BCNF (i 4NF)',
  lead: 'Jak rozpoznać złą tabelę po powtarzających się danych i jak ją rozłożyć — na prostych przykładach.',
  body: `
<h2>Po co normalizacja</h2>
<p><strong>Postulat normalizacji:</strong> każdy fakt powinien być zapisany w bazie <strong>tylko w jednym miejscu</strong>. Gdy ten sam fakt zapisujemy kilka razy, mamy <strong>redundancję</strong>, a ona prowadzi do błędów i sprzeczności — tzw. <strong>anomalii</strong>:</p>
<ul>
  <li><strong>anomalia wstawiania</strong> — nie da się zapisać faktu A bez faktu B (np. przedmiotu bez studenta);</li>
  <li><strong>anomalia modyfikacji</strong> — zmianę trzeba zrobić w wielu wierszach, a jak o jednym zapomnisz, dane są sprzeczne;</li>
  <li><strong>anomalia usuwania</strong> — usuwając jedną rzecz, tracisz przy okazji inną informację.</li>
</ul>
<div data-note="lecture"><p>Redundancja nie zawsze jest zła. Przykład z uczelnianej bazy: zapisujemy PESEL, datę urodzenia i płeć, choć PESEL zawiera już datę i płeć. Robimy to dla wygody i szybkości — ale taką <strong>świadomą</strong> redundancję trzeba <strong>kontrolować</strong>, zwykle programowo (wyzwalacze, procedury), bo sam SQL nie wystarczy.</p></div>

<h2>Pojęcia, bez których ani rusz</h2>
<h3>Zależność funkcyjna X → Y</h3>
<p>Mówimy, że <strong>X determinuje Y</strong>, jeśli dla każdych dwóch wierszy: gdy mają równe X, to mają też równe Y. Po ludzku: <em>znając X, potrafisz przewidzieć Y</em>, i to w każdym wierszu tabeli.</p>
<p>Przykład: PESEL → DataUrodzenia. Dwa wiersze z tym samym PESEL-em muszą mieć tę samą datę urodzenia.</p>
<p class="formula">Relacja r o schemacie R spełnia X → Y, jeśli dla każdych krotek t, u: t|X = u|X ⇒ t|Y = u|Y</p>
<h3>Nadklucz i klucz</h3>
<ul>
  <li><strong>Nadklucz</strong> — każdy zbiór kolumn X, który determinuje cały wiersz (X → R). Zbiór wszystkich kolumn to zawsze nadklucz.</li>
  <li><strong>Klucz</strong> — <strong>minimalny</strong> nadklucz: jeśli usuniesz z niego dowolną kolumnę, przestaje identyfikować wiersz. Kluczy może być kilka — jeden wybieramy na klucz główny.</li>
  <li><strong>Atrybut kluczowy</strong> — kolumna wchodząca w skład <em>któregokolwiek</em> klucza.</li>
</ul>
<h3>Zależności „złe”</h3>
<ul>
  <li><strong>od klucza</strong> — X jest nadkluczem: to jest dobre;</li>
  <li><strong>częściowa</strong> — od <em>części</em> klucza złożonego: źle (brak 2NF);</li>
  <li><strong>przechodnia</strong> — od kolumny, która nie jest kluczem ani jego częścią: źle (brak 3NF).</li>
</ul>

<h2>Pierwsza postać normalna (1NF)</h2>
<p>W każdej komórce (przecięcie wiersza i kolumny) jest <strong>jedna, niepodzielna (atomowa) wartość</strong> — nie lista, nie zbiór. Dodatkowo: wartości w kolumnie są jednego typu, nazwy kolumn są unikalne, a kolejność wierszy i kolumn nie niesie żadnej informacji.</p>
<p>Źle (lista w komórce):</p>
<table class="table--data">
  <thead><tr><th>NrIndeksu</th><th>Nazwisko</th><th>KodPrzedmiotu</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>Kowalski</td><td>AM, HKJ, WSI</td></tr>
    <tr><td>102</td><td>Malinowski</td><td>AM, PPJ</td></tr>
    <tr><td>105</td><td>Kwiatkowski</td><td>SBD</td></tr>
  </tbody>
</table>
<p>Poprawiamy — jeden przedmiot w wierszu. Teraz tabela jest w 1NF, kluczem jest para (NrIndeksu, KodPrzedmiotu), ale nazwisko powtarza się w wielu wierszach:</p>
<table class="table--data">
  <thead><tr><th>NrIndeksu</th><th>Nazwisko</th><th>KodPrzedmiotu</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>Kowalski</td><td>AM</td></tr>
    <tr><td>101</td><td>Kowalski</td><td>HKJ</td></tr>
    <tr><td>101</td><td>Kowalski</td><td>WSI</td></tr>
    <tr><td>102</td><td>Malinowski</td><td>AM</td></tr>
    <tr><td>…</td><td>…</td><td>…</td></tr>
  </tbody>
</table>
<p>Anomalie: nie dopiszesz przedmiotu, którego nikt nie ma; zmiana numeru indeksu wymaga poprawek w wielu wierszach; usunięcie Kwiatkowskiego usuwa informację, że istnieje przedmiot SBD. Rozwiązanie: <strong>rozłożyć</strong> na STUDENT {NrIndeksu, Nazwisko}, PRZEDMIOT {KodPrzedmiotu, Przedmiot} i — bo związek jest M:N — tabelę asocjacyjną PROGRAM {NrIndeksu, KodPrzedmiotu}.</p>

<h2>Druga postać normalna (2NF)</h2>
<p>Tabela jest w <strong>2NF</strong>, gdy jest w 1NF i <strong>nie ma zależności częściowych</strong> (od części klucza).</p>
<p>Przykład: OCENA {NrIndeksu, KodPrzedmiotu, Ocena, Wykladowca}. Klucz: (NrIndeksu, KodPrzedmiotu). Ale żeby wiedzieć, <em>kto</em> wystawił ocenę, wystarczy KodPrzedmiotu (każdy przedmiot ma jednego wykładowcę): <strong>KodPrzedmiotu → Wykladowca</strong> — zależność od części klucza.</p>
<div data-note="warn"><p><strong>Błędna „naprawa”</strong>: dodanie sztucznej kolumny IdOcena jako klucza głównego. Problem nie znika! Zależność częściowa dotyczy <strong>każdego</strong> klucza, nie tylko głównego — a (NrIndeksu, KodPrzedmiotu) nadal jest kluczem, więc zależność od jego części dalej istnieje. Tabelę i tak trzeba rozłożyć.</p></div>
<p>Poprawnie: kolumnę Wykladowca przenosimy do tabeli PRZEDMIOT {KodPrzedmiotu, Przedmiot, Wykladowca}, a w OCENA zostaje {NrIndeksu, KodPrzedmiotu, Ocena}.</p>
<div data-note="lecture"><p>Drugi przykład z wykładu: DOSTAWCY {NazwaDostawcy, NazwaTowaru, AdresDostawcy, Cena}. Cena zależy od pary (dostawca, towar) — tę samą doniczkę w różnych sklepach kupujemy za różne kwoty. Ale adres zależy tylko od dostawcy. Gdy dostawca przestanie sprzedawać towar, znika też jego adres. Zależności częściowe zdarzają się rzadko i łatwo je naprawić.</p></div>

<h2>Trzecia postać normalna (3NF)</h2>
<p>Tabela jest w <strong>3NF</strong>, gdy jest w 2NF i <strong>żaden atrybut niekluczowy nie zależy od innego atrybutu niekluczowego</strong> (brak zależności przechodnich).</p>
<p>Przykład: PRZEDMIOT {KodPrzedmiotu, Przedmiot, Wykladowca, NrTelefonu, Stopien}. Kluczem jest KodPrzedmiotu, ale telefon i stopień zależą od <strong>wykładowcy</strong>, nie od przedmiotu: KodPrzedmiotu → Wykladowca → NrTelefonu. Gdy wykładowca prowadzi dwa przedmioty, jego telefon zapisujemy dwa razy.</p>
<p>Poprawnie: WYKLADOWCA {Wykladowca, NrTelefonu, Stopien} oraz PRZEDMIOT {KodPrzedmiotu, Przedmiot, Wykladowca}, gdzie Wykladowca jest kluczem obcym.</p>
<div data-note="lecture"><p>Przykład z nagrania: PRACOWNIK {Id, Nazwisko, NazwaUczelni, AdresUczelni}. NazwaUczelni → AdresUczelni, a NazwaUczelni nie jest kluczem. Usuwając wszystkich pracowników uczelni, tracimy jej adres. Z zależnościami przechodnimi studenci mają zwykle więcej kłopotu niż z częściowymi.</p></div>

<h2>Algorytm usuwania złych zależności</h2>
<ol class="steps">
  <li>Kolumny ze „złej” zależności X → Y <strong>przenieś do nowej tabeli</strong>. Lewa strona (X) jest kluczem nowej tabeli.</li>
  <li>Z tabeli wyjściowej <strong>usuń prawą stronę</strong> (Y). Lewa strona (X) zostaje i pełni rolę <strong>klucza obcego</strong>.</li>
</ol>
<p>Zasada praktyczna: <strong>każdy rodzaj obiektów — osobna tabela.</strong></p>
<div data-code="norm-final"></div>

<h2>Postać normalna Boyce’a–Codda (BCNF) a 3NF</h2>
<p><strong>BCNF:</strong> dla każdej zależności X → A albo A ∈ X (zależność trywialna), albo X jest nadkluczem. Czyli wolno tylko zależności od (nad)klucza.</p>
<p><strong>3NF (pełna definicja):</strong> dla każdej X → A: A ∈ X, <em>albo</em> X jest nadkluczem, <em>albo</em> <strong>A jest atrybutem kluczowym</strong>. Ten trzeci przypadek to jedyna różnica.</p>
<p>Po co ten wyjątek? Są tabele, których nie da się doprowadzić do BCNF bez utraty informacji. Przykład: egzaminy {NrIndeksu, KodPrzedmiotu, Termin, Wykladowca, Ocena}; w danym terminie zdajesz u jednego wykładowcy, ale przedmiot ma kilku wykładowców. Klucz: (NrIndeksu, KodPrzedmiotu, Termin). Istnieje zależność <strong>Wykladowca → KodPrzedmiotu</strong>. Wykladowca nie jest kluczem, więc to nie BCNF — ale KodPrzedmiotu jest atrybutem kluczowym, więc to jest 3NF.</p>
<div data-note="exam"><p>W praktyce doprowadzamy bazę <strong>do 3NF</strong> (często wychodzi przy okazji BCNF). Różnica 3NF/BCNF = dopuszczenie zależności, której prawa strona jest atrybutem kluczowym.</p></div>

<h2>4NF i 5NF</h2>
<p>Brak złych zależności funkcyjnych nie gwarantuje jeszcze braku redundancji. Są jeszcze:</p>
<ul>
  <li><strong>zależności wielowartościowe</strong> → brak <strong>4NF</strong>;</li>
  <li><strong>zależności złączeniowe</strong> → brak <strong>5NF</strong>.</li>
</ul>
<p>4NF: tabela jest w BCNF i nie ma zależności wielowartościowych. Przykład: {NrIndeksu, KodPrzedmiotu, Dyscyplina} — przedmioty studenta i uprawiane sporty są od siebie <strong>niezależne</strong>, więc trzeba zapisać każdą kombinację (2 przedmioty × 2 sporty = 4 wiersze). Rozwiązanie: dwie tabele {NrIndeksu, KodPrzedmiotu} i {NrIndeksu, Dyscyplina}.</p>
<div data-note="lecture"><p>Brak 4NF prowadzący często widuje w projektach studenckich, z uzasadnieniem „będzie mniej tabel”. Mniej tabel = więcej wierszy i anomalie.</p></div>
<div data-note="own"><p>Szybki test na 4NF: jeśli w tabeli są dwie kolumny „wielokrotne”, które nic o sobie nie wiedzą (np. hobby i języki obce osoby), to znak, że powinny trafić do dwóch osobnych tabel.</p></div>
`,
  cheat: `
<ul>
  <li>Cel: <strong>każdy fakt w jednym miejscu</strong>. Redundancja → anomalie wstawiania, modyfikacji, usuwania. Świadomą redundancję trzeba kontrolować (np. PESEL + data urodzenia).</li>
  <li><strong>X → Y</strong>: znając X, znam Y (w każdym wierszu).</li>
  <li><strong>Nadklucz</strong>: X → cały wiersz. <strong>Klucz</strong>: minimalny nadklucz. <strong>Atrybut kluczowy</strong>: należy do jakiegoś klucza.</li>
  <li><strong>1NF</strong>: wartości atomowe (bez list w komórce).</li>
  <li><strong>2NF</strong>: 1NF + brak zależności <strong>częściowych</strong> (od części klucza złożonego). Sztuczny klucz Id NIE naprawia 2NF!</li>
  <li><strong>3NF</strong>: 2NF + brak zależności <strong>przechodnich</strong> (niekluczowy → niekluczowy).</li>
  <li>Naprawa: X i Y do nowej tabeli (X = PK), z oryginału usuń Y, X zostaje jako FK.</li>
  <li><strong>BCNF</strong>: każda X → A ma X nadkluczem. <strong>3NF</strong> dodatkowo dopuszcza A = atrybut kluczowy. Praktyka: dochodzimy do 3NF.</li>
  <li><strong>4NF</strong>: BCNF + brak zależności wielowartościowych (niezależne listy → osobne tabele). <strong>5NF</strong>: brak zależności złączeniowych.</li>
</ul>
`
}

});
