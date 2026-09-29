/* PL – zadania treningowe (przerobione: ta sama logika co na ćwiczeniach, inne bazy i treści) */
SBD.addTasks('pl', {

'databases': {
  title: 'Bazy do ćwiczeń (skrypty)',
  lead: 'Dwie własne bazy treningowe: „Wypożyczalnia samochodów” (zadania SQL) i „Kurierzy” (T-SQL i PL/SQL) oraz małe tabele pomocnicze.',
  intro: `
<div data-note="own"><p>Bazy wymyślił autor strony — są podobne w budowie do baz z ćwiczeń (hotel, EMP/DEPT), ale mają inne tabele i dane. Dzięki temu możesz ćwiczyć tę samą logikę bez przepisywania gotowych rozwiązań z zajęć.</p></div>
<h2>Baza „Wypożyczalnia samochodów”</h2>
<table>
  <thead><tr><th>Tabela</th><th>Kolumny</th><th>Uwagi</th></tr></thead>
  <tbody>
    <tr><td><strong>Klasa</strong></td><td>IdKlasa (PK), Nazwa, CenaDoba</td><td>ekonomiczna, kompakt, SUV, premium, van</td></tr>
    <tr><td><strong>Auto</strong></td><td>NrAuta (PK), Marka, IdKlasa (FK), LiczbaMiejsc</td><td>9 aut; Hyundai (13) i Ford (51) nigdy nie wypożyczone</td></tr>
    <tr><td><strong>Klient</strong></td><td>IdKlient (PK), Imie, Nazwisko, Rabat (NULL)</td><td>10 osób; Wrona i Kaczmarek nic nie wypożyczyli</td></tr>
    <tr><td><strong>Wypozyczenie</strong></td><td>IdWyp (PK), DataOd, DataDo, IdKlient (FK), NrAuta (FK), Oplacone (0/1)</td><td>12 wypożyczeń z lat 2024–2025</td></tr>
  </tbody>
</table>
<div data-code="db-wyp-mssql"></div>
<div data-code="db-wyp-oracle"></div>
<h2>Baza „Kurierzy”</h2>
<p>Budową przypomina EMP/DEPT/SALGRADE z wykładów: kurier ma szefa (związek rekurencyjny), oddział i pensję; tabela Stawka to siatka płac.</p>
<table>
  <thead><tr><th>Tabela</th><th>Kolumny</th><th>Uwagi</th></tr></thead>
  <tbody>
    <tr><td><strong>Oddzial</strong></td><td>IdOddzial (PK), Nazwa, Miasto</td><td>oddział 40 (ZACHOD) jest pusty</td></tr>
    <tr><td><strong>Kurier</strong></td><td>IdKurier (PK), Nazwisko, Stanowisko, IdSzef (FK → Kurier), DataZatrudnienia, Pensja, Premia (NULL), IdOddzial (FK)</td><td>14 osób; NOWAK (dyrektor) nie ma szefa, PAWLOWSKI nie ma oddziału</td></tr>
    <tr><td><strong>Stawka</strong></td><td>Poziom (PK), PensjaOd, PensjaDo</td><td>5 poziomów</td></tr>
  </tbody>
</table>
<div data-code="db-kur-mssql"></div>
<div data-code="db-kur-oracle"></div>
<h2>Małe tabele pomocnicze</h2>
<p><strong>Regal</strong> — stan produktów na półkach (zadania 5, 9, 10). <strong>Produkt</strong> — do kolokwiów K1 i K2. <strong>Odczyty</strong> i <strong>Konto</strong> — do zadań o indeksach i transakcjach (zestaw 7).</p>
<div data-code="db-regal-mssql"></div>
<div data-code="db-regal-oracle"></div>
<div data-code="db-produkt-mssql"></div>
<div data-code="db-produkt-oracle"></div>
<div data-code="db-odczyty"></div>
<div data-code="db-konto"></div>
<div data-note="tip"><p>Chcesz zacząć od nowa? W MS SQL skrypty same usuwają stare tabele (<code>IF OBJECT_ID(…) IS NOT NULL DROP TABLE …</code>). W Oracle usuń je ręcznie, od tabel podrzędnych: <code>DROP TABLE Wypozyczenie; DROP TABLE Auto; …</code></p></div>`,
  items: []
},

't01-erd': {
  title: 'Zadania 1: projektowanie ERD',
  lead: 'Zaprojektuj diagramy związków encji dla czterech opisów. Te same wyzwania co na ćwiczeniach: M:N, dwa związki między tymi samymi encjami, „trasy” przez inne punkty, reakcje z wieloma składnikami.',
  intro: `<p>Każdy diagram narysuj w Vertabelo (albo na kartce): encje, atrybuty z typami, klucze główne i obce, liczności. Potem sprawdź rozwiązanie — to jedna z możliwych poprawnych wersji.</p>`,
  items: [
    { q: `<p><strong>Szkoła jazdy.</strong> Szkoła prowadzi kursy różnych kategorii (A, B, C…). Kursant zapisuje się na kurs danej kategorii. Na każdą jazdę kursant jedzie z jednym instruktorem jednym samochodem; samochód ma przypisaną kategorię. Instruktor może mieć uprawnienia do wielu kategorii. Należy też zapisywać wyniki egzaminów wewnętrznych (teoria/praktyka, data, wynik).</p>`,
      hint: `<p>Instruktor–Kategoria to M:N (uprawnienia). Jazda łączy trzy rzeczy: kursanta (a właściwie jego zapis na kurs), instruktora i samochód.</p>`,
      sol: `<pre data-lang="text">Kategoria (IdKategoria PK, Symbol, Opis)
Kurs (IdKurs PK, IdKategoria FK, DataStartu, Cena)
Kursant (IdKursant PK, Imie, Nazwisko, Pesel UNIQUE, Telefon)
Zapis (IdZapis PK, IdKursant FK, IdKurs FK, DataZapisu)
Instruktor (IdInstruktor PK, Imie, Nazwisko)
Uprawnienie (IdInstruktor PK/FK, IdKategoria PK/FK, DataNadania)   ← M:N
Samochod (IdSamochod PK, NrRej UNIQUE, Marka, IdKategoria FK)
Jazda (IdJazda PK, IdZapis FK, IdInstruktor FK, IdSamochod FK, Termin, CzasMin)
Egzamin (IdEgzamin PK, IdZapis FK, Rodzaj CHECK IN ('T','P'), Data, Wynik)</pre>
<p>Uwaga: to, czy instruktor ma uprawnienia do kategorii auta, sprawdzimy później wyzwalaczem — diagram tego nie wymusi.</p>` },

    { q: `<p><strong>Kino.</strong> Kino ma sale z ponumerowanymi miejscami (rząd, numer). Filmy mają gatunki (film może mieć kilka gatunków). Seans to wyświetlenie filmu w sali o danej godzinie. Widz może kupić bilety na seans; bilet dotyczy <em>konkretnego miejsca</em>. Rozróżnij <strong>rezerwację</strong> (na seans, liczba osób, bez miejsc) i <strong>bilet</strong> (konkretne miejsce).</p>`,
      hint: `<p>Tak jak w hotelu „zamówienie na kategorię” vs „przydział konkretnego pokoju”: Rezerwacja → Seans, Bilet → Seans + Miejsce. Unikalność miejsca na seansie: UNIQUE (IdSeans, IdMiejsce).</p>`,
      sol: `<pre data-lang="text">Sala (IdSala PK, Nazwa)
Miejsce (IdMiejsce PK, IdSala FK, Rzad, Numer, UNIQUE(IdSala, Rzad, Numer))
Gatunek (IdGatunek PK, Nazwa)
Film (IdFilm PK, Tytul, CzasMin)
FilmGatunek (IdFilm PK/FK, IdGatunek PK/FK)                  ← M:N
Seans (IdSeans PK, IdFilm FK, IdSala FK, Termin)
Widz (IdWidz PK, Imie, Nazwisko, Email)
Rezerwacja (IdRezerwacja PK, IdWidz FK, IdSeans FK, LiczbaOsob)
Bilet (IdBilet PK, IdSeans FK, IdMiejsce FK, IdWidz FK NULL, Cena,
       UNIQUE(IdSeans, IdMiejsce))                          ← jedno miejsce = jeden bilet</pre>` },

    { q: `<p><strong>Komunikacja miejska.</strong> Mamy przystanki (nazwa, strefa biletowa) i linie (numer, typ: autobus/tramwaj). Linia przejeżdża przez przystanki w określonej kolejności; między kolejnymi przystankami znamy czas przejazdu. Baza musi pozwolić policzyć, ile trwa podróż z przystanku A do B daną linią, także z przesiadką na innym przystanku.</p>`,
      hint: `<p>To odpowiednik „szlaków między schroniskami”: potrzebujesz encji Odcinek/Trasa z kolejnością (NrKolejny) i czasem. Przesiadka = dwa odcinki różnych linii spotykające się na tym samym przystanku.</p>`,
      sol: `<pre data-lang="text">Przystanek (IdPrzystanek PK, Nazwa, Strefa)
Linia (IdLinia PK, Numer, Typ CHECK IN ('A','T'))
Przebieg (IdLinia PK/FK, NrKolejny PK, IdPrzystanek FK,
          CzasOdPoprzedniego)          ← kolejność przystanków linii
-- podróż A→B jedną linią: SUM(CzasOdPoprzedniego) dla NrKolejny między pozycją A i B
-- z przesiadką: łączymy dwa takie odcinki na wspólnym przystanku (samozłączenie Przebieg)</pre>
<p>Związek Linia–Przystanek jest M:N (linia ma wiele przystanków, przez przystanek jeździ wiele linii) — Przebieg to encja asocjacyjna z dodatkowymi atrybutami.</p>` },

    { q: `<p><strong>Przepisy kulinarne.</strong> Mamy składniki (nazwa, jednostka, kaloryczność na jednostkę, ilość w spiżarni) oraz przepisy. Przepis używa wielu składników w określonych ilościach. Przepis może też używać <em>innego przepisu</em> jako składnika (np. „ciasto kruche” w „tarcie”). Zapisujemy też, kiedy przepis przygotowano i ile porcji wyszło.</p>`,
      hint: `<p>Jak w „reakcjach chemicznych”: składnikiem może być rzecz dwóch rodzajów. Jedna z dróg: Pozycja przepisu ma dwa opcjonalne klucze obce (IdSkladnik albo IdPodprzepis) + CHECK, że wypełniony jest dokładnie jeden.</p>`,
      sol: `<pre data-lang="text">Skladnik (IdSkladnik PK, Nazwa, Jednostka, KcalNaJedn, IloscWSpizarni)
Przepis (IdPrzepis PK, Nazwa, Porcje)
PozycjaPrzepisu (IdPozycja PK, IdPrzepis FK,
                 IdSkladnik FK NULL, IdPodprzepis FK NULL → Przepis,
                 Ilosc)                  ← CHECK: wypełnione dokładnie jedno z dwóch FK
Przygotowanie (IdPrzygotowanie PK, IdPrzepis FK, Data, IleWyszloPorcji)</pre>
<p>IdPodprzepis → Przepis to związek <strong>rekurencyjny</strong> (przez tabelę pozycji). W MS SQL warunek „dokładnie jedno” zapiszesz jako <code>CHECK ((IdSkladnik IS NULL AND IdPodprzepis IS NOT NULL) OR (IdSkladnik IS NOT NULL AND IdPodprzepis IS NULL))</code>.</p>` },

    { q: `<p><strong>Normalizacja.</strong> Tabela ZAMOWIENIE {NrZam, DataZam, IdKlienta, NazwiskoKlienta, MiastoKlienta, KodTowaru, NazwaTowaru, Ilosc, CenaTowaru}. Klucz: (NrZam, KodTowaru). Wypisz zależności funkcyjne, określ postać normalną i rozłóż tabelę do 3NF.</p>`,
      hint: `<p>Szukaj zależności od części klucza (NrZam → …, KodTowaru → …) i zależności przechodnich (IdKlienta → …).</p>`,
      sol: `<ul>
<li>NrZam → DataZam, IdKlienta (częściowa) ⇒ brak 2NF;</li>
<li>KodTowaru → NazwaTowaru, CenaTowaru (częściowa);</li>
<li>IdKlienta → NazwiskoKlienta, MiastoKlienta (przechodnia przez NrZam) ⇒ brak 3NF;</li>
<li>(NrZam, KodTowaru) → Ilosc — jedyna „dobra” zależność.</li></ul>
<pre data-lang="text">Klient (IdKlienta PK, Nazwisko, Miasto)
Towar (KodTowaru PK, Nazwa, Cena)
Zamowienie (NrZam PK, DataZam, IdKlienta FK)
PozycjaZam (NrZam PK/FK, KodTowaru PK/FK, Ilosc)</pre>
<p>Tabela wyjściowa była tylko w 1NF.</p>` }
  ]
},

't02-sql': {
  title: 'Zadania 2: SQL — powtórka 1',
  lead: 'SELECT, sortowanie, DISTINCT, złączenia, LIKE, IN, BETWEEN, NULL, proste agregaty i DML na bazie „Wypożyczalnia”.',
  intro: `<p>Baza: <a href="#/tasks/databases">Wypożyczalnia samochodów</a>. Rozwiązania są w dialekcie MS SQL; różnice dla Oracle są w komentarzach.</p>`,
  items: [
    { q: `<p>Wypisz wszystkich klientów posortowanych malejąco po nazwisku, a przy tym samym nazwisku — rosnąco po imieniu.</p>`, sol: `<div data-code="s02-01"></div>` },
    { q: `<p>Podaj bez powtórzeń wszystkie liczby miejsc występujące w autach, od najmniejszej.</p>`, sol: `<div data-code="s02-02"></div>` },
    { q: `<p>Wypisz wszystkie wypożyczenia klientki <strong>Ewy Pawlak</strong> (daty i numer auta).</p>`, sol: `<div data-code="s02-03"></div>` },
    { q: `<p>Wypisz wypożyczenia rozpoczęte w <strong>2024</strong> roku przez klientów, których nazwisko zaczyna się na „K” lub „P”. Podaj imię, nazwisko, markę auta i datę.</p>`,
      hint: `<p>Trzy tabele. Uważaj na kolejność AND/OR — potrzebne nawiasy. Rok: <code>YEAR()</code> w MS SQL, <code>EXTRACT(YEAR FROM …)</code> w Oracle.</p>`, sol: `<div data-code="s02-04"></div>` },
    { q: `<p>Jakimi markami aut jeździł <strong>Jan Kowalczyk</strong>? (bez powtórzeń)</p>`, sol: `<div data-code="s02-05"></div>` },
    { q: `<p>Podaj liczbę aut w każdej klasie (nazwa klasy + liczba).</p>`, sol: `<div data-code="s02-06"></div>` },
    { q: `<p>Podaj dane klientów i ich wypożyczeń tak, żeby w wyniku był <strong>każdy</strong> klient — także ten, który nigdy nic nie wypożyczył.</p>`, hint: `<p>Złączenie zewnętrzne od strony tabeli Klient.</p>`, sol: `<div data-code="s02-07"></div>` },
    { q: `<p>Wypisz klientów, którzy wypożyczyli auto nr <strong>11</strong> i <strong>nie zapłacili</strong>.</p>`, sol: `<div data-code="s02-08"></div>` },
    { q: `<p>Wypisz zestawienie: „Nazwisko Imię” w jednej kolumnie o nazwie <em>Klient</em>, DataOd, DataDo, marka auta, nazwa klasy.</p>`, sol: `<div data-code="s02-09"></div>` },
    { q: `<p>Jednym zapytaniem wypisz: wypożyczenia aut klasy <strong>premium</strong> przez klientów z rabatem <strong>co najmniej 10</strong> <em>oraz</em> wypożyczenia aut klasy <strong>ekonomiczna</strong> przez klientów <strong>bez ustalonego rabatu</strong> (NULL).</p>`,
      hint: `<p>Dwa warunki złożone z AND połączone przez OR — każdy w nawiasie. NULL sprawdzasz przez IS NULL.</p>`, sol: `<div data-code="s02-10"></div>` },
    { q: `<p>Wypisz (bez powtórzeń) klientów, którzy <strong>mają</strong> ustalony rabat (nie NULL) i choć raz coś wypożyczyli.</p>`, sol: `<div data-code="s02-11"></div>` },
    { q: `<p>Wypisz wypożyczenia aut marek <strong>Toyota, Skoda, Kia</strong>: imię, nazwisko, datę i markę.</p>`, sol: `<div data-code="s02-12"></div>` },
    { q: `<p>Podaj klasy, których cena za dobę mieści się w przedziale <strong>&lt;150, 300&gt;</strong>.</p>`, sol: `<div data-code="s02-13"></div>` },
    { q: `<p>Wypisz nazwiska i imiona (w jednej kolumnie o nazwie <em>Dluznik</em>) klientów, którzy mają nieopłacone wypożyczenie. Bez powtórzeń, posortuj po nazwisku, potem imieniu.</p>`, sol: `<div data-code="s02-14"></div>` },
    { q: `<p>Ile jest wypożyczeń opłaconych?</p>`, sol: `<div data-code="s02-15"></div>` },
    { q: `<p>Ile wypożyczeń rozpoczęło się w <strong>2025</strong> roku?</p>`, sol: `<div data-code="s02-16"></div>` },
    { q: `<p>Dodaj nowego klienta (dowolne dane) i jedno wypożyczenie dla niego.</p>`, sol: `<div data-code="s02-17"></div>` },
    { q: `<p>Przedłuż dodane przed chwilą wypożyczenie o <strong>2 dni</strong>.</p>`, sol: `<div data-code="s02-18"></div>` },
    { q: `<p>Usuń to wypożyczenie.</p>`, sol: `<div data-code="s02-19"></div>` },
    { q: `<p><em>(Dodatkowe, od autora)</em> Dla każdego wypożyczenia policz liczbę dni i kwotę do zapłaty: dni × cena za dobę klasy, pomniejszona o rabat klienta (NULL = 0%).</p>`,
      hint: `<p>MS SQL: <code>DATEDIFF(day, DataOd, DataDo)</code>; Oracle: <code>DataDo - DataOd</code>.</p>`, sol: `<div data-code="s02-20"></div>` }
  ]
},

't03-sql': {
  title: 'Zadania 3: SQL — powtórka 2',
  lead: 'Grupowanie z HAVING, podzapytania (zwykłe i skorelowane), NOT EXISTS, UNION, ALL i CTE na bazie „Wypożyczalnia”.',
  intro: `<p>Baza: <a href="#/tasks/databases">Wypożyczalnia samochodów</a>.</p>`,
  items: [
    { q: `<p>Wypisz klientów wraz z liczbą ich wypożyczeń. Pokaż tylko tych, którzy wypożyczali <strong>co najmniej dwa razy</strong>.</p>`, sol: `<div data-code="s03-01"></div>` },
    { q: `<p>Wypisz auta o <strong>najmniejszej</strong> liczbie miejsc.</p>`, hint: `<p>Podzapytanie z MIN w WHERE.</p>`, sol: `<div data-code="s03-02"></div>` },
    { q: `<p>Dla każdego auta podaj datę jego <strong>pierwszego</strong> wypożyczenia. Auta nigdy niewypożyczone też mają się pojawić.</p>`, sol: `<div data-code="s03-03"></div>` },
    { q: `<p>Podaj liczbę wypożyczeń każdego auta. Pomiń auta klasy <strong>van</strong> oraz auta wypożyczone <strong>tylko raz</strong>.</p>`, hint: `<p>Który warunek idzie do WHERE, a który do HAVING?</p>`, sol: `<div data-code="s03-04"></div>` },
    { q: `<p>Podaj dane (imię, nazwisko, numer auta, data) <strong>najstarszego</strong> wypożyczenia.</p>`, sol: `<div data-code="s03-05"></div>` },
    { q: `<p>Wypisz auta, które <strong>nigdy</strong> nie były wypożyczone.</p>`, sol: `<div data-code="s03-06"></div>` },
    { q: `<p>Używając <strong>NOT EXISTS</strong>, wypisz klientów, którzy nigdy nie jeździli autem klasy <strong>premium</strong>.</p>`, sol: `<div data-code="s03-07"></div>` },
    { q: `<p>Jednym zapytaniem wypisz: klientów, którzy wypożyczali auto klasy <strong>SUV</strong> (imię, nazwisko, data), oraz klientów, którzy nigdy nic nie wypożyczyli (imię, nazwisko, tekst „brak”).</p>`,
      hint: `<p>UNION wymaga zgodnych typów kolumn — datę trzeba zamienić na tekst.</p>`, sol: `<div data-code="s03-08"></div>` },
    { q: `<p>Znajdź klasę, w której jest <strong>najwięcej aut</strong>.</p>`, hint: `<p><code>HAVING COUNT(*) &gt;= ALL (…)</code></p>`, sol: `<div data-code="s03-09"></div>` },
    { q: `<p>Dla każdej klasy podaj auto (auta) o <strong>największej</strong> liczbie miejsc.</p>`, hint: `<p>Podzapytanie skorelowane po IdKlasa.</p>`, sol: `<div data-code="s03-10"></div>` },
    { q: `<p><em>(Dodatkowe, od autora)</em> Z użyciem CTE wypisz klientów, których łączna liczba dni wypożyczeń jest większa od średniej wszystkich klientów wypożyczających.</p>`, sol: `<div data-code="s03-11"></div>` }
  ]
},

't04-tsql': {
  title: 'Zadania 4: T-SQL — podstawy',
  lead: 'Zmienne, PRINT, IF, pierwsze procedury z parametrami i kontrolą danych — na bazie „Kurierzy” (MS SQL).',
  intro: `<p>Baza: <a href="#/tasks/databases">Kurierzy (MS SQL)</a>.</p>`,
  items: [
    { q: `<p>Zadeklaruj zmienną, zapisz do niej liczbę pracowników oddziału o nazwie <strong>POLNOC</strong> i wypisz przez PRINT komunikat „Oddział POLNOC zatrudnia N osób”.</p>`, sol: `<div data-code="s04-01"></div>` },
    { q: `<p>Sprawdź, ilu pracowników ma oddział <strong>30</strong>. Jeśli mniej niż 6 — zatrudnij kuriera <strong>NOWICKI</strong> (pensja 2500, szef 102, dzisiejsza data, numer = największy + 1) i wypisz komunikat. W przeciwnym razie wypisz, że nikogo nie zatrudniono.</p>`, sol: `<div data-code="s04-02"></div>` },
    { q: `<p>Napisz procedurę, która zwraca kurierów o pensji z przedziału podanego <strong>dwoma parametrami</strong> (od, do), posortowanych po pensji.</p>`, sol: `<div data-code="s04-03"></div>` },
    { q: `<p>Napisz procedurę dodającą oddział (numer, nazwa, miasto). Jeśli istnieje już oddział o tej nazwie <strong>lub</strong> w tym mieście — nie dodawaj i wypisz komunikat; w przeciwnym razie dodaj i potwierdź.</p>`, sol: `<div data-code="s04-04"></div>` },
    { q: `<p>Napisz procedurę zatrudniającą kuriera. Parametry: nazwisko i numer oddziału. Procedura:</p>
<ul><li>zgłasza błąd, jeśli oddział nie istnieje;</li>
<li>nadaje pensję równą <strong>najniższej pensji na stanowisku KURIER</strong> w tym oddziale (gdy takich nie ma — 2500);</li>
<li>jako szefa ustawia <strong>kierownika</strong> tego oddziału;</li>
<li>numer = największy istniejący + 1.</li></ul>`,
      hint: `<p>RAISERROR poza TRY nie przerywa procedury — po nim potrzebny jest RETURN.</p>`, sol: `<div data-code="s04-05"></div>` }
  ]
},

't05-tsql-cursors': {
  title: 'Zadania 5: T-SQL — kursory',
  lead: 'Kursor z modyfikacją danych, ta sama logika w procedurze z parametrami, premie wg średniej oraz „magazyn” bez kursora.',
  intro: `<p>Bazy: <a href="#/tasks/databases">Kurierzy + Regal (MS SQL)</a>.</p>`,
  items: [
    { q: `<p>Przy pomocy kursora przejrzyj kurierów i zmień pensje: poniżej <strong>2500</strong> — podwyżka o <strong>5%</strong>, powyżej <strong>6000</strong> — obniżka o <strong>5%</strong>. Każdą zmianę wypisz („NAZWISKO: stara -&gt; nowa”).</p>`, sol: `<div data-code="s05-01"></div>` },
    { q: `<p>Przerób zadanie 1 na procedurę: progi (dolny, górny) i procent zmiany mają być parametrami (procent domyślnie 5).</p>`, sol: `<div data-code="s05-02"></div>` },
    { q: `<p>Napisz procedurę, która dla oddziału podanego w parametrze liczy średnią pensję, a kurierom tego oddziału zarabiającym <strong>poniżej średniej</strong> ustawia premię równą <strong>8%</strong> ich pensji. Wypisz, kto dostał premię.</p>`, sol: `<div data-code="s05-03"></div>` },
    { q: `<p><em>(bez kursora)</em> W tabeli Regal znajdź produkt, którego jest <strong>najmniej</strong>, i zwiększ jego stan o <strong>10</strong>. Przy remisie zmień tylko jeden wiersz (o mniejszym numerze półki). Jeśli najmniejszy stan wynosi 50 lub więcej — zgłoś błąd „nic nie zamawiamy”.</p>`,
      hint: `<p><code>SELECT TOP 1 … ORDER BY Sztuk, IdPolki</code> daje dokładnie jeden wiersz.</p>`, sol: `<div data-code="s05-04"></div>` },
    { q: `<p>Przerób zadanie 4 na procedurę, której podajesz <strong>liczbę sztuk</strong> do domówienia.</p>`, sol: `<div data-code="s05-05"></div>` },
    { q: `<p><em>(Dodatkowe, od autora)</em> Zrób zadanie 1 <strong>jednym poleceniem UPDATE</strong>, a zmiany pokaż klauzulą OUTPUT.</p>`, sol: `<div data-code="s05-06"></div>` }
  ]
},

't06-tsql-triggers': {
  title: 'Zadania 6: T-SQL — wyzwalacze',
  lead: 'Blokowanie operacji, uzupełnianie danych, kontrola wartości, tabela podsumowań i złożone reguły — działające także dla wielu wierszy.',
  intro: `<p>Baza: <a href="#/tasks/databases">Kurierzy (MS SQL)</a>. Po każdym zadaniu usuń wyzwalacz (<code>DROP TRIGGER nazwa</code>), żeby nie przeszkadzał w kolejnych.</p>
<div data-note="warn"><p>Pamiętaj: wyzwalacz T-SQL uruchamia się <strong>raz na instrukcję</strong>. Każde rozwiązanie sprawdź też poleceniem, które zmienia kilka wierszy naraz.</p></div>`,
  items: [
    { q: `<p>Utwórz wyzwalacz, który nie pozwoli usunąć żadnego <strong>oddziału</strong>.</p>`, sol: `<div data-code="s06-01"></div>` },
    { q: `<p>Utwórz wyzwalacz, który przy dodawaniu kuriera bez podanej <strong>daty zatrudnienia</strong> wpisze datę dzisiejszą. <em>(Można to zrobić przez DEFAULT — tu ćwiczymy wyzwalacz.)</em></p>`, sol: `<div data-code="s06-02"></div>` },
    { q: `<p>Utwórz wyzwalacz, który przy INSERT i UPDATE sprawdzi, czy pensja mieści się w przedziale <strong>2000–12000</strong>; jeśli nie — zgłosi błąd i wycofa operację.</p>`, sol: `<div data-code="s06-03"></div>` },
    { q: `<p>Utwórz tabelę <code>FunduszPlac (Suma, Liczba)</code> z jednym wierszem: łączna suma pensji i liczba kurierów. Wypełnij ją jednym poleceniem, a potem napisz wyzwalacz, który przy INSERT, UPDATE i DELETE na tabeli Kurier utrzymuje ją aktualną.</p>`,
      hint: `<p>Suma zmienia się o SUM(inserted) − SUM(deleted), liczba o COUNT(inserted) − COUNT(deleted). Pamiętaj o ISNULL.</p>`, sol: `<div data-code="s06-04"></div>` },
    { q: `<p>Napisz wyzwalacz, który nie pozwoli zmienić <strong>miasta</strong> oddziału, ale pozwoli zmieniać nazwę i dodawać nowe oddziały.</p>`, sol: `<div data-code="s06-05"></div>` },
    { q: `<p>Napisz <strong>jeden</strong> wyzwalacz, który:</p>
<ul><li>nie pozwoli usunąć kuriera zatrudnionego <strong>przed 2020 rokiem</strong>;</li>
<li>nie pozwoli zmienić stanowiska osobie, która jest <strong>DYREKTOREM</strong>;</li>
<li>nie pozwoli dodać kuriera o nazwisku, które <strong>już występuje w tym samym oddziale</strong>.</li></ul>`,
      hint: `<p>Rodzaj operacji rozpoznasz po tym, czy inserted/deleted są puste.</p>`, sol: `<div data-code="s06-06"></div>` },
    { q: `<p>Napisz wyzwalacz, który nie pozwoli podnieść pensji o <strong>więcej niż 20%</strong> w jednej operacji i nie pozwoli usuwać pracowników <strong>centrali (oddział 10)</strong>.</p>`, sol: `<div data-code="s06-07"></div>` }
  ]
},

't07-indexes-transactions': {
  title: 'Zadania 7: indeksy i transakcje',
  lead: 'Porównanie planów wykonania z różnymi indeksami oraz eksperymenty z transakcjami w dwóch oknach SSMS.',
  intro: `<p>Najlepiej na lokalnym serwerze <code>(localdb)\\MSSQLLocalDB</code>. Najpierw utwórz tabele <strong>Odczyty</strong> i <strong>Konto</strong> z <a href="#/tasks/databases">Baz do ćwiczeń</a>. Plan wykonania włączasz <kbd>Ctrl</kbd>+<kbd>M</kbd>; porównuj <em>Estimated Subtree Cost</em> operacji SELECT (najbardziej lewej).</p>`,
  items: [
    { h: 'Indeksy' },
    { q: `<p>Uruchom <code>SELECT * FROM Odczyty WHERE Czujnik = 777</code> i obejrzyj plan. Jaka operacja się pojawia i ile wynosi koszt?</p>`, sol: `<div data-code="s07-02"></div>` },
    { q: `<p>Załóż indeks <strong>niepogrupowany</strong> na kolumnie Czujnik, powtórz zapytanie i porównaj plan oraz koszt. Usuń indeks.</p>`, sol: `<div data-code="s07-03"></div>` },
    { q: `<p>Strategia „tylko indeks”: uruchom <code>SELECT Czujnik, Wartosc … WHERE Czujnik = 777</code>, potem załóż indeks złożony (Czujnik, Wartosc) i porównaj. Ile operacji ma plan?</p>`, sol: `<div data-code="s07-04"></div>` },
    { q: `<p>Wyszukiwanie zakresowe: <code>WHERE Czujnik BETWEEN 30000 AND 45000</code> — bez indeksu, z indeksem niepogrupowanym i z pogrupowanym. Kiedy serwer używa indeksu?</p>`, sol: `<div data-code="s07-05"></div>` },
    { q: `<p>Sortowanie: <code>SELECT * FROM Odczyty ORDER BY Czujnik</code> — bez indeksu, z niepogrupowanym, z pogrupowanym. Czy znika operacja Sort?</p>`, sol: `<div data-code="s07-06"></div>` },
    { h: 'Transakcje' },
    { q: `<p>Z włączonym <code>IMPLICIT_TRANSACTIONS</code>: dodaj dwa konta, sprawdź zawartość, zrób ROLLBACK, sprawdź; dodaj trzecie konto, COMMIT, sprawdź.</p>`, sol: `<div data-code="s07-07"></div>` },
    { q: `<p>Powtórz to z <code>IMPLICIT_TRANSACTIONS OFF</code>. Co się dzieje przy ROLLBACK i dlaczego? Potem włącz opcję z powrotem.</p>`, sol: `<div data-code="s07-08"></div>` },
    { q: `<p>Dwa okna: w oknie 1 zmień saldo konta (bez COMMIT), w oknie 2 odczytaj tabelę. Co się dzieje z oknem 2? Zrób COMMIT w oknie 1.</p>`, sol: `<div data-code="s07-09-a"></div><div data-code="s07-09-b"></div>` },
    { q: `<p>W oknie 2 ustaw poziom <strong>READ UNCOMMITTED</strong> i powtórz eksperyment. Czy widzisz niezatwierdzone dane?</p>`, sol: `<div data-code="s07-10"></div>` },
    { q: `<p>W obu oknach ustaw <strong>SERIALIZABLE</strong>, w obu wykonaj SELECT, a potem w oknie 1 INSERT. Co się dzieje i czym różni się to od READ COMMITTED?</p>`, sol: `<div data-code="s07-11"></div>` }
  ]
},

't08-backup-security': {
  title: 'Zadania 8: pliki bazy, backup i uprawnienia',
  lead: 'Tworzenie bazy i grup plików, kopie pełne/różnicowe/dziennika, odtwarzanie do punktu w czasie, loginy, użytkownicy, role i DENY.',
  intro: `<p>Na ćwiczeniach robi się to głównie w Management Studio (GUI). Poniżej przy każdym kroku jest też wersja SQL — przydaje się na egzaminie. Pracuj na lokalnym serwerze i własnej bazie <strong>Treningowa</strong>; katalog <code>C:\\SBD</code> utwórz wcześniej.</p>`,
  items: [
    { h: 'Pliki i grupy plików' },
    { q: `<p>Utwórz bazę <strong>Treningowa</strong>. Sprawdź, gdzie leżą i jak duże są pliki danych i dziennika.</p>`, sol: `<p>GUI: Databases → New Database (zakładka Files pokazuje .mdf i .ldf).</p><div data-code="s08-01"></div>` },
    { q: `<p>Dodaj grupę plików <strong>Archiwum</strong> i nowy plik danych w innej lokalizacji.</p>`, sol: `<p>GUI: Properties → Filegroups → Add, potem Files → Add (wybierz grupę).</p><div data-code="s08-02"></div>` },
    { q: `<p>Umieść tabelę w grupie Archiwum.</p>`, sol: `<div data-code="s08-03"></div>` },
    { h: 'Kopie zapasowe' },
    { q: `<p>Ustaw model odtwarzania bazy na <strong>Full</strong>.</p>`, sol: `<div data-code="s08-04"></div>` },
    { q: `<p>Zrób pełną kopię, usuń bazę i odtwórz ją z kopii.</p>`, sol: `<div data-code="s08-05"></div>` },
    { q: `<p>Kopia pełna → zmiana → kopia różnicowa → zmiana → kopia dziennika. Usuń bazę i odtwórz wszystko po kolei. Czy obie zmiany wróciły?</p>`, hint: `<p>Wszystko poza ostatnią kopią — WITH NORECOVERY.</p>`, sol: `<div data-code="s08-06"></div>` },
    { q: `<p>Kopia pełna → zmiana o zapamiętanej godzinie → kopia dziennika. Odtwórz bazę do chwili <strong>tuż przed</strong> zmianą.</p>`, sol: `<div data-code="s08-07"></div>` },
    { h: 'Uprawnienia' },
    { q: `<p>Utwórz login <strong>kasjer</strong> (SQL Server Authentication). Zaloguj się nim w drugim oknie. Czy możesz otworzyć bazę Treningowa?</p>`, sol: `<div data-code="s08-08"></div>` },
    { q: `<p>Utwórz w bazie użytkownika dla tego loginu. Czy teraz możesz wejść do bazy i wykonać SELECT?</p>`, sol: `<div data-code="s08-09"></div>` },
    { q: `<p>Nadaj użytkownikowi SELECT i UPDATE na tabeli Klient. Sprawdź dozwolone i niedozwolone operacje.</p>`, sol: `<div data-code="s08-10"></div>` },
    { q: `<p>Utwórz rolę <strong>magazynierzy</strong>, dodaj do niej użytkownika i nadaj roli inne prawa. Czy użytkownik z nich korzysta?</p>`, sol: `<div data-code="s08-11"></div>` },
    { q: `<p>Zabroń (DENY) operacji na poziomie roli, a nadaj ją (GRANT) użytkownikowi. Czy użytkownik ją wykona?</p>`, sol: `<div data-code="s08-12"></div>` }
  ]
},

't09-plsql': {
  title: 'Zadania 9: PL/SQL — podstawy',
  lead: 'Bloki anonimowe, SELECT INTO, IF, pierwsze procedury z RAISE_APPLICATION_ERROR — na bazie „Kurierzy” (Oracle).',
  intro: `<p>Baza: <a href="#/tasks/databases">Kurierzy + Regal (Oracle)</a>. Nie zapomnij o <code>SET SERVEROUTPUT ON</code>.</p>`,
  items: [
    { q: `<p>W bloku PL/SQL policz kurierów, którzy mają wpisaną premię (nie NULL), i wypisz wynik.</p>`, sol: `<div data-code="s09-01"></div>` },
    { q: `<p>Sprawdź, ilu pracowników ma oddział <strong>20</strong>. Jeśli mniej niż 6 — zatrudnij kurierkę <strong>NOWICKA</strong> (pensja 2600, szef 101, numer = max + 1) i wypisz komunikat; w przeciwnym razie wypisz, że nikogo nie zatrudniono.</p>`, sol: `<div data-code="s09-02"></div>` },
    { q: `<p>Napisz procedurę dodającą oddział (numer, nazwa, miasto): jeśli istnieje oddział o tej <strong>nazwie</strong> — zgłoś błąd (RAISE_APPLICATION_ERROR); jeśli w tym <strong>mieście</strong> jest już oddział — tylko wypisz komunikat; w przeciwnym razie dodaj.</p>`, sol: `<div data-code="s09-03"></div>` },
    { q: `<p>Napisz procedurę zatrudniającą kuriera (parametry: numer oddziału, nazwisko). Jeśli oddział nie istnieje — błąd. Pensja = <strong>zaokrąglona średnia</strong> pensji w oddziale (gdy brak pracowników — 2500), numer = max + 1, data = dziś.</p>`,
      hint: `<p>Istnienie sprawdź przez <code>SELECT COUNT(*) INTO …</code> — nie przez SELECT pojedynczego wiersza.</p>`, sol: `<div data-code="s09-04"></div>` },
    { q: `<p>W bloku PL/SQL znajdź na regale produkt, którego jest <strong>najwięcej</strong> (przy remisie — ten o mniejszym numerze półki) i wydaj <strong>3</strong> sztuki. Jeśli jest mniej niż 3 — zgłoś błąd.</p>`, sol: `<div data-code="s09-05"></div>` }
  ]
},

't10-plsql-cursors': {
  title: 'Zadania 10: PL/SQL — kursory',
  lead: 'Kursor jawny, procedura z parametrami, premie wg średniej, procedura magazynowa, pętla FOR i kursor z parametrem.',
  intro: `<p>Baza: <a href="#/tasks/databases">Kurierzy + Regal (Oracle)</a>.</p>`,
  items: [
    { q: `<p>Kursorem (OPEN / FETCH / EXIT WHEN / CLOSE) przejrzyj kurierów: pensja poniżej <strong>2300</strong> → +8%, powyżej <strong>6000</strong> → −3%. Wypisz każdą zmianę.</p>`,
      hint: `<p>Zmienną na nową pensję zeruj na początku każdego obrotu pętli, inaczej „przeniesiesz” wartość z poprzedniego wiersza.</p>`, sol: `<div data-code="s10-01"></div>` },
    { q: `<p>Przerób to na procedurę z parametrami: próg dolny, próg górny, procent podwyżki (domyślnie 8), procent obniżki (domyślnie 3).</p>`, sol: `<div data-code="s10-02"></div>` },
    { q: `<p>Procedura dla oddziału z parametru: kurierom zarabiającym poniżej średniej w tym oddziale <strong>dodaj 150</strong> do premii (NULL traktuj jak 0). Wypisz, ile osób dostało dodatek.</p>`, sol: `<div data-code="s10-03"></div>` },
    { q: `<p>Przerób zadanie 5 z zestawu 9 na procedurę: podajesz, <strong>ile sztuk</strong> wydać. Jeśli na półce jest za mało — błąd.</p>`, sol: `<div data-code="s10-04"></div>` },
    { q: `<p>Przerób zadanie 1 na wersję z <strong>pętlą FOR</strong> po kursorze (bonus: <code>FOR UPDATE</code> + <code>WHERE CURRENT OF</code>).</p>`, sol: `<div data-code="s10-05"></div>` },
    { q: `<p><em>(Dodatkowe, od autora)</em> Kursor z parametrem (numer oddziału): wypisz ranking pensji w oddziale 30 w postaci „1. NAZWISKO pensja”, używając <code>%ROWCOUNT</code>.</p>`, sol: `<div data-code="s10-06"></div>` }
  ]
},

't11-plsql-triggers': {
  title: 'Zadania 11: PL/SQL — wyzwalacze',
  lead: 'BEFORE/AFTER, poziom instrukcji i wiersza, :OLD/:NEW, INSERTING/UPDATING/DELETING i tabela podsumowań.',
  intro: `<p>Baza: <a href="#/tasks/databases">Kurierzy (Oracle)</a>. Po teście wyłącz wyzwalacz (<code>ALTER TRIGGER … DISABLE</code>) albo usuń go.</p>`,
  items: [
    { q: `<p>Utwórz wyzwalacz, który nie pozwoli usunąć żadnego <strong>oddziału</strong>.</p>`, sol: `<div data-code="s11-01"></div>` },
    { q: `<p>Utwórz wyzwalacz, który przy INSERT i UPDATE pensji nie pozwoli ustawić pensji <strong>niższej niż 2000</strong>. <em>(Da się to zrobić CHECK-iem — ćwiczymy wyzwalacz.)</em></p>`, sol: `<div data-code="s11-02"></div>` },
    { q: `<p>Utwórz tabelę <code>FunduszPlac (Suma, Liczba)</code> (jeden wiersz: suma pensji i liczba kurierów) i wyzwalacz wierszowy, który utrzymuje ją aktualną przy INSERT, UPDATE pensji i DELETE.</p>`, sol: `<div data-code="s11-03"></div>` },
    { q: `<p>Napisz <strong>jeden</strong> wyzwalacz, który:</p>
<ul><li>nie pozwoli usunąć osoby na stanowisku <strong>KIEROWNIK</strong> lub <strong>DYREKTOR</strong>;</li>
<li>nie pozwoli zmienić <strong>daty zatrudnienia</strong>;</li>
<li>nie pozwoli dodać kuriera o nazwisku, które już jest <strong>w tym samym oddziale</strong>.</li></ul>`, sol: `<div data-code="s11-04"></div>` },
    { q: `<p>Napisz wyzwalacz, który nie pozwoli <strong>obniżać premii</strong> i nie pozwoli usuwać pracowników <strong>centrali (oddział 10)</strong>.</p>`, sol: `<div data-code="s11-05"></div>` }
  ]
},

'k1-tsql': {
  title: 'Kolokwium próbne K1 (T-SQL)',
  lead: 'Własny zestaw w stylu kolokwium: procedura z kontrolą danych i wyzwalacz z kilkoma regułami — MS SQL Server.',
  intro: `<div data-note="own"><p>W materiałach z poprzedniego roku było kolokwium z PL/SQL (zestaw K2 niżej). Ten zestaw to jego odpowiednik w T-SQL, ułożony przez autora strony — na wypadek, gdyby kolokwium obejmowało też MS SQL Server.</p></div>
<p>Tabela: <strong>Produkt (IdProdukt, Nazwa, Cena, Stan)</strong> z <a href="#/tasks/databases">Baz do ćwiczeń</a>. Czas na rozwiązanie: spróbuj zmieścić się w 45 minutach.</p>`,
  items: [
    { q: `<p>Napisz procedurę <code>Uzupelnij</code> z parametrem <em>nazwa produktu</em>:</p>
<ul><li>jeśli produkt nie istnieje — zgłoś błąd;</li>
<li>jeśli stan jest mniejszy niż <strong>5</strong> — wypisz „krytycznie niski stan … – zamów u dostawcy”;</li>
<li>w przeciwnym razie zwiększ stan o <strong>20</strong> i wypisz komunikat.</li></ul>`, sol: `<div data-code="k1-01"></div>` },
    { q: `<p>Napisz wyzwalacz na tabeli Produkt, który:</p>
<ul><li>nie pozwoli zmienić <strong>nazwy</strong> produktu;</li>
<li>nie pozwoli podnieść ceny o <strong>więcej niż 15%</strong>;</li>
<li>nie pozwoli ustawić <strong>ujemnego</strong> stanu;</li>
<li>przy zmianie ceny wypisze, o ile procent się zmieniła.</li></ul>`,
      hint: `<p>Porównuj inserted z deleted złączeniem po IdProdukt; pamiętaj o wielu wierszach.</p>`, sol: `<div data-code="k1-02"></div>` }
  ]
},

'k2-plsql': {
  title: 'Kolokwium próbne K2 (PL/SQL)',
  lead: 'Ta sama logika co na kolokwium z zeszłego roku (procedura + wyzwalacz w PL/SQL), ale inna tabela, inne progi i reguły.',
  intro: `<p>Tabela: <strong>Produkt (IdProdukt, Nazwa, Cena, Stan)</strong> w Oracle — z <a href="#/tasks/databases">Baz do ćwiczeń</a>.</p>
<div data-note="warn"><p>Częsty błąd: sprawdzanie, czy produkt istnieje, przez <code>IF v_stan = 0</code> po <code>SELECT … INTO</code>. Gdy wiersza nie ma, SELECT INTO rzuca <code>NO_DATA_FOUND</code> — do IF-a nigdy nie dojdzie. Trzeba to obsłużyć w sekcji EXCEPTION (albo użyć COUNT).</p></div>`,
  items: [
    { q: `<p>Napisz procedurę <code>Uzupelnij(p_nazwa)</code>:</p>
<ul><li>brak produktu → <code>RAISE_APPLICATION_ERROR</code>;</li>
<li>stan mniejszy niż <strong>10</strong> → komunikat „za mało … – najpierw zamówienie”;</li>
<li>w przeciwnym razie stan + <strong>25</strong> i komunikat.</li></ul>`, sol: `<div data-code="k2-01"></div>` },
    { q: `<p>Napisz wyzwalacz na tabeli Produkt, który:</p>
<ul><li>przy zmianie nie pozwoli zmienić <strong>nazwy</strong>;</li>
<li>wypisze procent zmiany ceny i nie pozwoli <strong>obniżyć</strong> ceny o więcej niż <strong>25%</strong>;</li>
<li>nie pozwoli ustawić <strong>ujemnego</strong> stanu (przy INSERT i UPDATE).</li></ul>`, sol: `<div data-code="k2-02"></div>` }
  ]
},

'project': {
  title: 'Projekt: własna baza + procedury i wyzwalacze',
  lead: 'Co trzeba oddać (wg materiałów z zeszłego roku), plan pracy, lista kontrolna i kompletny przykład „Klub fitness” w Oracle i MS SQL.',
  intro: `
<div data-note="info" data-label="Wymagania — na podstawie projektu z zeszłego roku"><p>Dokładne wymagania poda prowadzący ćwiczenia. Z oddanego w zeszłym roku projektu wynika zakres: <strong>diagram ERD</strong> (Vertabelo) → <strong>skrypt tworzący tabele</strong> i wypełniający je danymi dla <strong>Oracle i MS SQL</strong> → <strong>procedury i wyzwalacze</strong> w obu dialektach (w zeszłym roku: 2 procedury, w tym jedna z kursorem, i 2 wyzwalacze).</p></div>
<h2>Plan pracy</h2>
<ol class="steps">
  <li>Wybierz dziedzinę, którą rozumiesz (5–10 tabel), i opisz ją w 5–6 zdaniach.</li>
  <li>Narysuj ERD: przynajmniej jeden związek M:N (tabela asocjacyjna), sensowne klucze, NOT NULL, UNIQUE, CHECK.</li>
  <li>Sprawdź normalizację (3NF).</li>
  <li>Wygeneruj DDL dla Oracle i MS SQL, popraw typy (VARCHAR2/NUMBER vs VARCHAR/INT/DECIMAL).</li>
  <li>Wstaw dane testowe tak, żeby dało się pokazać działanie każdej procedury i wyzwalacza (także przypadki błędne).</li>
  <li>Napisz procedury i wyzwalacze najpierw w jednym dialekcie, przetestuj, potem przepisz na drugi.</li>
  <li>Do każdego obiektu dopisz komentarz „co robi” i skrypt testowy.</li>
</ol>
<div data-note="own" data-label="Od autora strony — lista kontrolna">
<ul>
  <li>Procedura z <strong>parametrami</strong>, sprawdzająca dane wejściowe (błąd przez RAISERROR / RAISE_APPLICATION_ERROR).</li>
  <li>Procedura z <strong>kursorem</strong> (i uzasadnieniem, czemu kursor ma tu sens).</li>
  <li>Wyzwalacz, który <strong>blokuje</strong> niepoprawną operację.</li>
  <li>Wyzwalacz, który <strong>utrzymuje dane pochodne</strong> (licznik, historia, podsumowanie).</li>
  <li>T-SQL: wyzwalacze działają dla wielu wierszy (inserted/deleted). PL/SQL: brak tabeli mutującej, brak COMMIT w wyzwalaczu.</li>
  <li>Nowe klucze: MAX + 1 z NVL/ISNULL albo IDENTITY/sekwencja.</li>
  <li>Skrypt uruchamia się „od zera” bez błędów (kolejność CREATE/DROP!).</li>
</ul>
</div>
<h2>Przykład: „Klub fitness”</h2>
<p>Osoby mogą być klubowiczami i/lub trenerami. Trener prowadzi zajęcia w salach o określonej pojemności; klubowicze zapisują się na zajęcia (M:N). Zmiany stawek trenerów są zapisywane w historii.</p>
<pre data-lang="text">Osoba (IdOsoba PK, Imie, Nazwisko, Telefon UNIQUE)
Klubowicz (IdKlubowicz PK, IdOsoba FK UNIQUE, DataDolaczenia)     ← 1:1 z Osoba
Trener (IdTrener PK, IdOsoba FK UNIQUE, Stawka CHECK > 0)          ← 1:1 z Osoba
Sala (IdSala PK, Nazwa, Pojemnosc)
Zajecia (IdZajecia PK, Nazwa, IdTrener FK, IdSala FK, Termin, CzasMin)
Zapis (IdZajecia PK/FK, IdKlubowicz PK/FK)                           ← M:N
HistoriaStawek (IdTrener FK, StaraStawka, NowaStawka, DataZmiany)</pre>
<div data-note="warn"><p>To przykład do nauki — nie oddawaj go jako swojego projektu. Wybierz własną dziedzinę i własne reguły.</p></div>`,
  items: [
    { q: `<p><strong>Tabele i dane.</strong></p>`, sol: `<div data-code="proj-ddl-ora"></div><div data-code="proj-ddl-ms"></div>` },
    { q: `<p><strong>Procedura 1 (z kursorem):</strong> zapisz osobę (imię, nazwisko, telefon) na najbliższe przyszłe zajęcia o podanej nazwie, na których jest jeszcze wolne miejsce. Jeśli osoby nie ma — dodaj ją; jeśli nie jest klubowiczem — dodaj klubowicza.</p>`, sol: `<div data-code="proj-p1-ora"></div><div data-code="proj-p1-ms"></div>` },
    { q: `<p><strong>Procedura 2:</strong> awansuj istniejącą osobę na trenera ze stawką równą średniej stawce trenerów; jeśli już jest trenerem — tylko komunikat; jeśli osoby nie ma — błąd.</p>`, sol: `<div data-code="proj-p2-ora"></div><div data-code="proj-p2-ms"></div>` },
    { q: `<p><strong>Wyzwalacz 1:</strong> nie pozwól zapisać na zajęcia ponad pojemność sali.</p>`, hint: `<p>W Oracle wyzwalacz wierszowy na Zapis nie może czytać tabeli Zapis (mutating) — użyj wyzwalacza poziomu instrukcji.</p>`, sol: `<div data-code="proj-t1-ora"></div><div data-code="proj-t1-ms"></div>` },
    { q: `<p><strong>Wyzwalacz 2:</strong> każdą zmianę stawki trenera zapisz w HistoriaStawek; nie pozwól obniżyć stawki o więcej niż 10%.</p>`, sol: `<div data-code="proj-t2-ora"></div><div data-code="proj-t2-ms"></div>` }
  ]
}

});
