/* EN – practice exercises (reworked: the same logic as the labs, different databases and wording) */
SBD.addTasks('en', {

'databases': {
  title: 'Practice databases (scripts)',
  lead: 'Two own practice databases: “Car rental” (SQL exercises) and “Couriers” (T-SQL and PL/SQL), plus small helper tables.',
  intro: `
<div data-note="own"><p>The databases were made up by the site author — they resemble the lab databases in structure (hotel, EMP/DEPT) but have different tables and data. This way you practise the same logic without copying ready-made lab solutions.</p></div>
<p>Table and column names stay in Polish, just like in the lab materials.</p>
<h2>“Wypożyczalnia” (car rental) database</h2>
<table>
  <thead><tr><th>Table</th><th>Columns</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><strong>Klasa</strong> (car class)</td><td>IdKlasa (PK), Nazwa, CenaDoba (price per day)</td><td>ekonomiczna, kompakt, SUV, premium, van</td></tr>
    <tr><td><strong>Auto</strong> (car)</td><td>NrAuta (PK), Marka (brand), IdKlasa (FK), LiczbaMiejsc (seats)</td><td>9 cars; Hyundai (13) and Ford (51) never rented</td></tr>
    <tr><td><strong>Klient</strong> (client)</td><td>IdKlient (PK), Imie, Nazwisko, Rabat (discount, NULL)</td><td>10 people; Wrona and Kaczmarek never rented anything</td></tr>
    <tr><td><strong>Wypozyczenie</strong> (rental)</td><td>IdWyp (PK), DataOd, DataDo, IdKlient (FK), NrAuta (FK), Oplacone (paid 0/1)</td><td>12 rentals in 2024–2025</td></tr>
  </tbody>
</table>
<div data-code="db-wyp-mssql"></div>
<div data-code="db-wyp-oracle"></div>
<h2>“Kurierzy” (couriers) database</h2>
<p>Its structure resembles EMP/DEPT/SALGRADE from the lectures: a courier has a boss (recursive relationship), a branch and a salary; the Stawka table is a pay scale.</p>
<table>
  <thead><tr><th>Table</th><th>Columns</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><strong>Oddzial</strong> (branch)</td><td>IdOddzial (PK), Nazwa, Miasto (city)</td><td>branch 40 (ZACHOD) is empty</td></tr>
    <tr><td><strong>Kurier</strong> (courier)</td><td>IdKurier (PK), Nazwisko, Stanowisko (job), IdSzef (FK → Kurier), DataZatrudnienia (hire date), Pensja (salary), Premia (bonus, NULL), IdOddzial (FK)</td><td>14 people; NOWAK (director) has no boss, PAWLOWSKI has no branch</td></tr>
    <tr><td><strong>Stawka</strong> (pay scale)</td><td>Poziom (PK), PensjaOd, PensjaDo</td><td>5 levels</td></tr>
  </tbody>
</table>
<div data-code="db-kur-mssql"></div>
<div data-code="db-kur-oracle"></div>
<h2>Small helper tables</h2>
<p><strong>Regal</strong> — stock of products on shelves (sets 5, 9, 10). <strong>Produkt</strong> — for tests K1 and K2. <strong>Odczyty</strong> (sensor readings) and <strong>Konto</strong> (account) — for the indexes and transactions set (7).</p>
<div data-code="db-regal-mssql"></div>
<div data-code="db-regal-oracle"></div>
<div data-code="db-produkt-mssql"></div>
<div data-code="db-produkt-oracle"></div>
<div data-code="db-odczyty"></div>
<div data-code="db-konto"></div>
<div data-note="tip"><p>Want to start over? In MS SQL the scripts drop old tables themselves (<code>IF OBJECT_ID(…) IS NOT NULL DROP TABLE …</code>). In Oracle drop them by hand, child tables first: <code>DROP TABLE Wypozyczenie; DROP TABLE Auto; …</code></p></div>`,
  items: []
},

't01-erd': {
  title: 'Exercises 1: ERD design',
  lead: 'Design entity-relationship diagrams for four descriptions. The same challenges as in the labs: M:N, two relationships between the same entities, “routes” through other points, reactions with many components.',
  intro: `<p>Draw each diagram in Vertabelo (or on paper): entities, attributes with types, primary and foreign keys, cardinalities. Then check the solution — it is one of the possible correct versions.</p>`,
  items: [
    { q: `<p><strong>Driving school.</strong> The school runs courses of different categories (A, B, C…). A trainee enrols in a course of a given category. Each driving lesson is with one instructor in one car; a car has a category. An instructor may be licensed for many categories. Internal exam results must also be stored (theory/practice, date, result).</p>`,
      hint: `<p>Instructor–Category is M:N (licences). A driving lesson links three things: the trainee (actually their course enrolment), the instructor and the car.</p>`,
      sol: `<pre data-lang="text">Kategoria (IdKategoria PK, Symbol, Opis)
Kurs (IdKurs PK, IdKategoria FK, DataStartu, Cena)
Kursant (IdKursant PK, Imie, Nazwisko, Pesel UNIQUE, Telefon)
Zapis (IdZapis PK, IdKursant FK, IdKurs FK, DataZapisu)
Instruktor (IdInstruktor PK, Imie, Nazwisko)
Uprawnienie (IdInstruktor PK/FK, IdKategoria PK/FK, DataNadania)   ← M:N
Samochod (IdSamochod PK, NrRej UNIQUE, Marka, IdKategoria FK)
Jazda (IdJazda PK, IdZapis FK, IdInstruktor FK, IdSamochod FK, Termin, CzasMin)
Egzamin (IdEgzamin PK, IdZapis FK, Rodzaj CHECK IN ('T','P'), Data, Wynik)</pre>
<p>Note: whether the instructor is licensed for the car's category will be checked later with a trigger — the diagram cannot enforce it.</p>` },

    { q: `<p><strong>Cinema.</strong> The cinema has rooms with numbered seats (row, number). Films have genres (a film can have several genres). A screening is a showing of a film in a room at a given time. A viewer can buy tickets for a screening; a ticket is for a <em>specific seat</em>. Distinguish a <strong>reservation</strong> (for a screening, number of people, no seats) and a <strong>ticket</strong> (a specific seat).</p>`,
      hint: `<p>Like in a hotel: “an order for a category” vs “allocation of a specific room”: Reservation → Screening, Ticket → Screening + Seat. Seat uniqueness per screening: UNIQUE (IdSeans, IdMiejsce).</p>`,
      sol: `<pre data-lang="text">Sala (IdSala PK, Nazwa)
Miejsce (IdMiejsce PK, IdSala FK, Rzad, Numer, UNIQUE(IdSala, Rzad, Numer))
Gatunek (IdGatunek PK, Nazwa)
Film (IdFilm PK, Tytul, CzasMin)
FilmGatunek (IdFilm PK/FK, IdGatunek PK/FK)                  ← M:N
Seans (IdSeans PK, IdFilm FK, IdSala FK, Termin)
Widz (IdWidz PK, Imie, Nazwisko, Email)
Rezerwacja (IdRezerwacja PK, IdWidz FK, IdSeans FK, LiczbaOsob)
Bilet (IdBilet PK, IdSeans FK, IdMiejsce FK, IdWidz FK NULL, Cena,
       UNIQUE(IdSeans, IdMiejsce))                          ← one seat = one ticket</pre>` },

    { q: `<p><strong>Public transport.</strong> We have stops (name, fare zone) and lines (number, type: bus/tram). A line passes the stops in a given order; the travel time between consecutive stops is known. The database must allow computing how long a trip from stop A to B takes on a given line, also with a change at another stop.</p>`,
      hint: `<p>This is the counterpart of “trails between mountain huts”: you need a Segment/Route entity with an order (sequence number) and a time. A change = two segments of different lines meeting at the same stop.</p>`,
      sol: `<pre data-lang="text">Przystanek (IdPrzystanek PK, Nazwa, Strefa)
Linia (IdLinia PK, Numer, Typ CHECK IN ('A','T'))
Przebieg (IdLinia PK/FK, NrKolejny PK, IdPrzystanek FK,
          CzasOdPoprzedniego)          ← order of stops of a line
-- trip A→B on one line: SUM(CzasOdPoprzedniego) for NrKolejny between the positions of A and B
-- with a change: join two such segments at a common stop (self join of Przebieg)</pre>
<p>Line–Stop is M:N (a line has many stops, many lines serve a stop) — Przebieg is an associative entity with extra attributes.</p>` },

    { q: `<p><strong>Recipes.</strong> We have ingredients (name, unit, calories per unit, amount in the pantry) and recipes. A recipe uses many ingredients in given amounts. A recipe can also use <em>another recipe</em> as an ingredient (e.g. “shortcrust pastry” in a “tart”). We also record when a recipe was prepared and how many portions came out.</p>`,
      hint: `<p>Like “chemical reactions”: an ingredient can be one of two kinds. One way: a recipe line has two optional foreign keys (IdSkladnik or IdPodprzepis) + a CHECK that exactly one is filled.</p>`,
      sol: `<pre data-lang="text">Skladnik (IdSkladnik PK, Nazwa, Jednostka, KcalNaJedn, IloscWSpizarni)
Przepis (IdPrzepis PK, Nazwa, Porcje)
PozycjaPrzepisu (IdPozycja PK, IdPrzepis FK,
                 IdSkladnik FK NULL, IdPodprzepis FK NULL → Przepis,
                 Ilosc)                  ← CHECK: exactly one of the two FKs filled
Przygotowanie (IdPrzygotowanie PK, IdPrzepis FK, Data, IleWyszloPorcji)</pre>
<p>IdPodprzepis → Przepis is a <strong>recursive</strong> relationship (through the lines table). In MS SQL the “exactly one” rule is <code>CHECK ((IdSkladnik IS NULL AND IdPodprzepis IS NOT NULL) OR (IdSkladnik IS NOT NULL AND IdPodprzepis IS NULL))</code>.</p>` },

    { q: `<p><strong>Normalization.</strong> Table ZAMOWIENIE {NrZam, DataZam, IdKlienta, NazwiskoKlienta, MiastoKlienta, KodTowaru, NazwaTowaru, Ilosc, CenaTowaru} (an order with lines). Key: (NrZam, KodTowaru). List the functional dependencies, state the normal form and decompose the table to 3NF.</p>`,
      hint: `<p>Look for dependencies on part of the key (NrZam → …, KodTowaru → …) and transitive ones (IdKlienta → …).</p>`,
      sol: `<ul>
<li>NrZam → DataZam, IdKlienta (partial) ⇒ no 2NF;</li>
<li>KodTowaru → NazwaTowaru, CenaTowaru (partial);</li>
<li>IdKlienta → NazwiskoKlienta, MiastoKlienta (transitive via NrZam) ⇒ no 3NF;</li>
<li>(NrZam, KodTowaru) → Ilosc — the only “good” dependency.</li></ul>
<pre data-lang="text">Klient (IdKlienta PK, Nazwisko, Miasto)
Towar (KodTowaru PK, Nazwa, Cena)
Zamowienie (NrZam PK, DataZam, IdKlienta FK)
PozycjaZam (NrZam PK/FK, KodTowaru PK/FK, Ilosc)</pre>
<p>The original table was only in 1NF.</p>` }
  ]
},

't02-sql': {
  title: 'Exercises 2: SQL — recap 1',
  lead: 'SELECT, sorting, DISTINCT, joins, LIKE, IN, BETWEEN, NULL, simple aggregates and DML on the “Car rental” database.',
  intro: `<p>Database: <a href="#/tasks/databases">Car rental</a>. Solutions are in the MS SQL dialect; Oracle differences are in comments.</p>`,
  items: [
    { q: `<p>List all clients sorted by surname descending, and for the same surname — by first name ascending.</p>`, sol: `<div data-code="s02-01"></div>` },
    { q: `<p>Give, without duplicates, all seat counts of the cars, from the smallest.</p>`, sol: `<div data-code="s02-02"></div>` },
    { q: `<p>List all rentals of the client <strong>Ewa Pawlak</strong> (dates and car number).</p>`, sol: `<div data-code="s02-03"></div>` },
    { q: `<p>List rentals started in <strong>2024</strong> by clients whose surname starts with “K” or “P”. Give the first name, surname, car brand and date.</p>`,
      hint: `<p>Three tables. Watch the AND/OR order — parentheses needed. Year: <code>YEAR()</code> in MS SQL, <code>EXTRACT(YEAR FROM …)</code> in Oracle.</p>`, sol: `<div data-code="s02-04"></div>` },
    { q: `<p>Which car brands did <strong>Jan Kowalczyk</strong> drive? (no duplicates)</p>`, sol: `<div data-code="s02-05"></div>` },
    { q: `<p>Give the number of cars in each class (class name + count).</p>`, sol: `<div data-code="s02-06"></div>` },
    { q: `<p>Give clients and their rentals so that <strong>every</strong> client is in the result — also one who has never rented anything.</p>`, hint: `<p>An outer join from the Klient side.</p>`, sol: `<div data-code="s02-07"></div>` },
    { q: `<p>List clients who rented car no. <strong>11</strong> and <strong>did not pay</strong>.</p>`, sol: `<div data-code="s02-08"></div>` },
    { q: `<p>List: “Surname FirstName” in one column named <em>Klient</em>, DataOd, DataDo, car brand, class name.</p>`, sol: `<div data-code="s02-09"></div>` },
    { q: `<p>In one query list: rentals of <strong>premium</strong> cars by clients with a discount of <strong>at least 10</strong> <em>and</em> rentals of <strong>ekonomiczna</strong> cars by clients <strong>without an agreed discount</strong> (NULL).</p>`,
      hint: `<p>Two AND conditions joined with OR — each in parentheses. NULL is tested with IS NULL.</p>`, sol: `<div data-code="s02-10"></div>` },
    { q: `<p>List (no duplicates) clients who <strong>have</strong> an agreed discount (not NULL) and have rented at least once.</p>`, sol: `<div data-code="s02-11"></div>` },
    { q: `<p>List rentals of <strong>Toyota, Skoda, Kia</strong> cars: first name, surname, date and brand.</p>`, sol: `<div data-code="s02-12"></div>` },
    { q: `<p>Give the classes whose price per day is in the range <strong>&lt;150, 300&gt;</strong>.</p>`, sol: `<div data-code="s02-13"></div>` },
    { q: `<p>List surnames and first names (in one column named <em>Dluznik</em> = debtor) of clients with an unpaid rental. No duplicates, sort by surname, then first name.</p>`, sol: `<div data-code="s02-14"></div>` },
    { q: `<p>How many rentals are paid?</p>`, sol: `<div data-code="s02-15"></div>` },
    { q: `<p>How many rentals started in <strong>2025</strong>?</p>`, sol: `<div data-code="s02-16"></div>` },
    { q: `<p>Add a new client (any data) and one rental for them.</p>`, sol: `<div data-code="s02-17"></div>` },
    { q: `<p>Extend the rental you have just added by <strong>2 days</strong>.</p>`, sol: `<div data-code="s02-18"></div>` },
    { q: `<p>Delete that rental.</p>`, sol: `<div data-code="s02-19"></div>` },
    { q: `<p><em>(Extra, by the author)</em> For each rental compute the number of days and the amount to pay: days × class price per day, reduced by the client's discount (NULL = 0%).</p>`,
      hint: `<p>MS SQL: <code>DATEDIFF(day, DataOd, DataDo)</code>; Oracle: <code>DataDo - DataOd</code>.</p>`, sol: `<div data-code="s02-20"></div>` }
  ]
},

't03-sql': {
  title: 'Exercises 3: SQL — recap 2',
  lead: 'Grouping with HAVING, subqueries (plain and correlated), NOT EXISTS, UNION, ALL and CTE on the “Car rental” database.',
  intro: `<p>Database: <a href="#/tasks/databases">Car rental</a>.</p>`,
  items: [
    { q: `<p>List clients with the number of their rentals. Show only those who rented <strong>at least twice</strong>.</p>`, sol: `<div data-code="s03-01"></div>` },
    { q: `<p>List the cars with the <strong>smallest</strong> number of seats.</p>`, hint: `<p>A subquery with MIN in WHERE.</p>`, sol: `<div data-code="s03-02"></div>` },
    { q: `<p>For each car give the date of its <strong>first</strong> rental. Cars never rented must also appear.</p>`, sol: `<div data-code="s03-03"></div>` },
    { q: `<p>Give the number of rentals of each car. Skip cars of class <strong>van</strong> and cars rented <strong>only once</strong>.</p>`, hint: `<p>Which condition goes to WHERE and which to HAVING?</p>`, sol: `<div data-code="s03-04"></div>` },
    { q: `<p>Give the data (first name, surname, car number, date) of the <strong>oldest</strong> rental.</p>`, sol: `<div data-code="s03-05"></div>` },
    { q: `<p>List cars that were <strong>never</strong> rented.</p>`, sol: `<div data-code="s03-06"></div>` },
    { q: `<p>Using <strong>NOT EXISTS</strong>, list clients who never drove a <strong>premium</strong> car.</p>`, sol: `<div data-code="s03-07"></div>` },
    { q: `<p>In one query list: clients who rented a <strong>SUV</strong> car (first name, surname, date), and clients who never rented anything (first name, surname, the text “brak” = none).</p>`,
      hint: `<p>UNION needs compatible column types — the date must be turned into text.</p>`, sol: `<div data-code="s03-08"></div>` },
    { q: `<p>Find the class with the <strong>most cars</strong>.</p>`, hint: `<p><code>HAVING COUNT(*) &gt;= ALL (…)</code></p>`, sol: `<div data-code="s03-09"></div>` },
    { q: `<p>For each class give the car(s) with the <strong>largest</strong> number of seats.</p>`, hint: `<p>A subquery correlated on IdKlasa.</p>`, sol: `<div data-code="s03-10"></div>` },
    { q: `<p><em>(Extra, by the author)</em> Using a CTE, list clients whose total rental days are above the average of all renting clients.</p>`, sol: `<div data-code="s03-11"></div>` }
  ]
},

't04-tsql': {
  title: 'Exercises 4: T-SQL — basics',
  lead: 'Variables, PRINT, IF, first procedures with parameters and data checks — on the “Couriers” database (MS SQL).',
  intro: `<p>Database: <a href="#/tasks/databases">Couriers (MS SQL)</a>.</p>`,
  items: [
    { q: `<p>Declare a variable, store in it the number of employees of the branch named <strong>POLNOC</strong> and PRINT the message “Oddział POLNOC zatrudnia N osób” (branch POLNOC employs N people).</p>`, sol: `<div data-code="s04-01"></div>` },
    { q: `<p>Check how many employees branch <strong>30</strong> has. If fewer than 6 — hire courier <strong>NOWICKI</strong> (salary 2500, boss 102, today's date, number = largest + 1) and print a message. Otherwise print that nobody was hired.</p>`, sol: `<div data-code="s04-02"></div>` },
    { q: `<p>Write a procedure that returns couriers with a salary in the range given by <strong>two parameters</strong> (from, to), sorted by salary.</p>`, sol: `<div data-code="s04-03"></div>` },
    { q: `<p>Write a procedure that adds a branch (number, name, city). If a branch with this name <strong>or</strong> in this city already exists — don't add it and print a message; otherwise add it and confirm.</p>`, sol: `<div data-code="s04-04"></div>` },
    { q: `<p>Write a procedure hiring a courier. Parameters: surname and branch number. The procedure:</p>
<ul><li>raises an error if the branch doesn't exist;</li>
<li>sets the salary to the <strong>lowest salary among KURIER-job employees</strong> of this branch (if none — 2500);</li>
<li>sets the boss to the branch <strong>manager</strong> (KIEROWNIK);</li>
<li>number = largest existing + 1.</li></ul>`,
      hint: `<p>RAISERROR outside TRY doesn't stop the procedure — RETURN is needed after it.</p>`, sol: `<div data-code="s04-05"></div>` }
  ]
},

't05-tsql-cursors': {
  title: 'Exercises 5: T-SQL — cursors',
  lead: 'A cursor that modifies data, the same logic in a procedure with parameters, bonuses based on the average, and a “warehouse” without a cursor.',
  intro: `<p>Databases: <a href="#/tasks/databases">Couriers + Regal (MS SQL)</a>.</p>`,
  items: [
    { q: `<p>Using a cursor go through the couriers and change salaries: below <strong>2500</strong> — a <strong>5%</strong> raise, above <strong>6000</strong> — a <strong>5%</strong> cut. Print every change (“SURNAME: old -&gt; new”).</p>`, sol: `<div data-code="s05-01"></div>` },
    { q: `<p>Turn exercise 1 into a procedure: the thresholds (lower, upper) and the change percentage should be parameters (percentage default 5).</p>`, sol: `<div data-code="s05-02"></div>` },
    { q: `<p>Write a procedure that, for the branch given as a parameter, computes the average salary and gives couriers of this branch earning <strong>below the average</strong> a bonus equal to <strong>8%</strong> of their salary. Print who got a bonus.</p>`, sol: `<div data-code="s05-03"></div>` },
    { q: `<p><em>(no cursor)</em> In the Regal table find the product with the <strong>smallest</strong> stock and increase its stock by <strong>10</strong>. On a tie change only one row (the smaller shelf number). If the smallest stock is 50 or more — raise an error “nothing to order”.</p>`,
      hint: `<p><code>SELECT TOP 1 … ORDER BY Sztuk, IdPolki</code> gives exactly one row.</p>`, sol: `<div data-code="s05-04"></div>` },
    { q: `<p>Turn exercise 4 into a procedure to which you pass the <strong>number of pieces</strong> to order.</p>`, sol: `<div data-code="s05-05"></div>` },
    { q: `<p><em>(Extra, by the author)</em> Do exercise 1 with <strong>one UPDATE statement</strong>, showing the changes with the OUTPUT clause.</p>`, sol: `<div data-code="s05-06"></div>` }
  ]
},

't06-tsql-triggers': {
  title: 'Exercises 6: T-SQL — triggers',
  lead: 'Blocking operations, filling in data, checking values, a summary table and compound rules — working for many rows too.',
  intro: `<p>Database: <a href="#/tasks/databases">Couriers (MS SQL)</a>. After each exercise drop the trigger (<code>DROP TRIGGER name</code>) so it doesn't interfere with the next ones.</p>
<div data-note="warn"><p>Remember: a T-SQL trigger fires <strong>once per statement</strong>. Test every solution also with a statement changing several rows at once.</p></div>`,
  items: [
    { q: `<p>Create a trigger that doesn't allow deleting any <strong>branch</strong>.</p>`, sol: `<div data-code="s06-01"></div>` },
    { q: `<p>Create a trigger that, when a courier is added without a <strong>hire date</strong>, fills in today's date. <em>(DEFAULT could do it — here we practise a trigger.)</em></p>`, sol: `<div data-code="s06-02"></div>` },
    { q: `<p>Create a trigger that on INSERT and UPDATE checks whether the salary is in the range <strong>2000–12000</strong>; if not — raises an error and rolls back.</p>`, sol: `<div data-code="s06-03"></div>` },
    { q: `<p>Create the table <code>FunduszPlac (Suma, Liczba)</code> with one row: the total of salaries and the number of couriers. Fill it with one statement, then write a trigger that keeps it up to date on INSERT, UPDATE and DELETE of Kurier.</p>`,
      hint: `<p>The sum changes by SUM(inserted) − SUM(deleted), the count by COUNT(inserted) − COUNT(deleted). Remember ISNULL.</p>`, sol: `<div data-code="s06-04"></div>` },
    { q: `<p>Write a trigger that doesn't allow changing the <strong>city</strong> of a branch, but allows changing the name and adding new branches.</p>`, sol: `<div data-code="s06-05"></div>` },
    { q: `<p>Write <strong>one</strong> trigger that:</p>
<ul><li>doesn't allow deleting a courier hired <strong>before 2020</strong>;</li>
<li>doesn't allow changing the job of a person who is <strong>DYREKTOR</strong> (director);</li>
<li>doesn't allow adding a courier with a surname that <strong>already exists in the same branch</strong>.</li></ul>`,
      hint: `<p>Recognise the operation by whether inserted/deleted are empty.</p>`, sol: `<div data-code="s06-06"></div>` },
    { q: `<p>Write a trigger that doesn't allow raising a salary by <strong>more than 20%</strong> in one operation and doesn't allow deleting employees of the <strong>head office (branch 10)</strong>.</p>`, sol: `<div data-code="s06-07"></div>` }
  ]
},

't07-indexes-transactions': {
  title: 'Exercises 7: indexes and transactions',
  lead: 'Comparing execution plans with different indexes and experiments with transactions in two SSMS windows.',
  intro: `<p>Best on the local server <code>(localdb)\\MSSQLLocalDB</code>. First create the <strong>Odczyty</strong> and <strong>Konto</strong> tables from <a href="#/tasks/databases">Practice databases</a>. The execution plan is turned on with <kbd>Ctrl</kbd>+<kbd>M</kbd>; compare the <em>Estimated Subtree Cost</em> of the SELECT operator (leftmost).</p>`,
  items: [
    { h: 'Indexes' },
    { q: `<p>Run <code>SELECT * FROM Odczyty WHERE Czujnik = 777</code> and look at the plan. Which operator appears and what is the cost?</p>`, sol: `<div data-code="s07-02"></div>` },
    { q: `<p>Create a <strong>non-clustered</strong> index on Czujnik, repeat the query and compare the plan and cost. Drop the index.</p>`, sol: `<div data-code="s07-03"></div>` },
    { q: `<p>The “index only” strategy: run <code>SELECT Czujnik, Wartosc … WHERE Czujnik = 777</code>, then create a composite index (Czujnik, Wartosc) and compare. How many operators does the plan have?</p>`, sol: `<div data-code="s07-04"></div>` },
    { q: `<p>Range search: <code>WHERE Czujnik BETWEEN 30000 AND 45000</code> — without an index, with a non-clustered one and with a clustered one. When does the server use the index?</p>`, sol: `<div data-code="s07-05"></div>` },
    { q: `<p>Sorting: <code>SELECT * FROM Odczyty ORDER BY Czujnik</code> — without an index, with a non-clustered and with a clustered one. Does the Sort operator disappear?</p>`, sol: `<div data-code="s07-06"></div>` },
    { h: 'Transactions' },
    { q: `<p>With <code>IMPLICIT_TRANSACTIONS</code> on: add two accounts, check the contents, ROLLBACK, check; add a third account, COMMIT, check.</p>`, sol: `<div data-code="s07-07"></div>` },
    { q: `<p>Repeat it with <code>IMPLICIT_TRANSACTIONS OFF</code>. What happens at ROLLBACK and why? Then turn the option back on.</p>`, sol: `<div data-code="s07-08"></div>` },
    { q: `<p>Two windows: in window 1 change an account balance (no COMMIT), in window 2 read the table. What happens to window 2? Do COMMIT in window 1.</p>`, sol: `<div data-code="s07-09-a"></div><div data-code="s07-09-b"></div>` },
    { q: `<p>In window 2 set the level <strong>READ UNCOMMITTED</strong> and repeat the experiment. Can you see uncommitted data?</p>`, sol: `<div data-code="s07-10"></div>` },
    { q: `<p>In both windows set <strong>SERIALIZABLE</strong>, run a SELECT in both, then an INSERT in window 1. What happens and how is it different from READ COMMITTED?</p>`, sol: `<div data-code="s07-11"></div>` }
  ]
},

't08-backup-security': {
  title: 'Exercises 8: database files, backup and permissions',
  lead: 'Creating a database and filegroups, full/differential/log backups, point-in-time restore, logins, users, roles and DENY.',
  intro: `<p>In the labs this is done mainly in Management Studio (GUI). Each step below also has an SQL version — useful for the exam. Work on the local server and your own database <strong>Treningowa</strong>; create the folder <code>C:\\SBD</code> beforehand.</p>`,
  items: [
    { h: 'Files and filegroups' },
    { q: `<p>Create the database <strong>Treningowa</strong>. Check where the data and log files are and how big they are.</p>`, sol: `<p>GUI: Databases → New Database (the Files tab shows the .mdf and .ldf).</p><div data-code="s08-01"></div>` },
    { q: `<p>Add a filegroup <strong>Archiwum</strong> and a new data file in another location.</p>`, sol: `<p>GUI: Properties → Filegroups → Add, then Files → Add (choose the group).</p><div data-code="s08-02"></div>` },
    { q: `<p>Put a table in the Archiwum filegroup.</p>`, sol: `<div data-code="s08-03"></div>` },
    { h: 'Backups' },
    { q: `<p>Set the database recovery model to <strong>Full</strong>.</p>`, sol: `<div data-code="s08-04"></div>` },
    { q: `<p>Take a full backup, drop the database and restore it from the backup.</p>`, sol: `<div data-code="s08-05"></div>` },
    { q: `<p>Full backup → change → differential backup → change → log backup. Drop the database and restore everything in order. Did both changes come back?</p>`, hint: `<p>Everything except the last backup — WITH NORECOVERY.</p>`, sol: `<div data-code="s08-06"></div>` },
    { q: `<p>Full backup → a change at a remembered time → log backup. Restore the database to the moment <strong>just before</strong> the change.</p>`, sol: `<div data-code="s08-07"></div>` },
    { h: 'Permissions' },
    { q: `<p>Create the login <strong>kasjer</strong> (SQL Server Authentication). Log in with it in a second window. Can you open the Treningowa database?</p>`, sol: `<div data-code="s08-08"></div>` },
    { q: `<p>Create a database user for this login. Can you now enter the database and run a SELECT?</p>`, sol: `<div data-code="s08-09"></div>` },
    { q: `<p>Grant the user SELECT and UPDATE on the Klient table. Check allowed and forbidden operations.</p>`, sol: `<div data-code="s08-10"></div>` },
    { q: `<p>Create a role <strong>magazynierzy</strong>, add the user to it and grant the role other rights. Does the user get them?</p>`, sol: `<div data-code="s08-11"></div>` },
    { q: `<p>DENY an operation at the role level and GRANT it to the user. Can the user run it?</p>`, sol: `<div data-code="s08-12"></div>` }
  ]
},

't09-plsql': {
  title: 'Exercises 9: PL/SQL — basics',
  lead: 'Anonymous blocks, SELECT INTO, IF, first procedures with RAISE_APPLICATION_ERROR — on the “Couriers” database (Oracle).',
  intro: `<p>Database: <a href="#/tasks/databases">Couriers + Regal (Oracle)</a>. Don't forget <code>SET SERVEROUTPUT ON</code>.</p>`,
  items: [
    { q: `<p>In a PL/SQL block count the couriers who have a bonus (not NULL) and print the result.</p>`, sol: `<div data-code="s09-01"></div>` },
    { q: `<p>Check how many employees branch <strong>20</strong> has. If fewer than 6 — hire courier <strong>NOWICKA</strong> (salary 2600, boss 101, number = max + 1) and print a message; otherwise print that nobody was hired.</p>`, sol: `<div data-code="s09-02"></div>` },
    { q: `<p>Write a procedure adding a branch (number, name, city): if a branch with this <strong>name</strong> exists — raise an error (RAISE_APPLICATION_ERROR); if there already is a branch in this <strong>city</strong> — only print a message; otherwise add it.</p>`, sol: `<div data-code="s09-03"></div>` },
    { q: `<p>Write a procedure hiring a courier (parameters: branch number, surname). If the branch doesn't exist — error. Salary = <strong>rounded average</strong> salary of the branch (if no employees — 2500), number = max + 1, date = today.</p>`,
      hint: `<p>Check existence with <code>SELECT COUNT(*) INTO …</code> — not with a single-row SELECT.</p>`, sol: `<div data-code="s09-04"></div>` },
    { q: `<p>In a PL/SQL block find on the shelves the product with the <strong>largest</strong> stock (on a tie — the smaller shelf number) and issue <strong>3</strong> pieces. If there are fewer than 3 — raise an error.</p>`, sol: `<div data-code="s09-05"></div>` }
  ]
},

't10-plsql-cursors': {
  title: 'Exercises 10: PL/SQL — cursors',
  lead: 'An explicit cursor, a procedure with parameters, bonuses based on the average, a warehouse procedure, a FOR loop and a cursor with a parameter.',
  intro: `<p>Database: <a href="#/tasks/databases">Couriers + Regal (Oracle)</a>.</p>`,
  items: [
    { q: `<p>With a cursor (OPEN / FETCH / EXIT WHEN / CLOSE) go through the couriers: salary below <strong>2300</strong> → +8%, above <strong>6000</strong> → −3%. Print every change.</p>`,
      hint: `<p>Reset the new-salary variable at the start of every loop iteration, otherwise you “carry over” the value from the previous row.</p>`, sol: `<div data-code="s10-01"></div>` },
    { q: `<p>Turn it into a procedure with parameters: lower threshold, upper threshold, raise percentage (default 8), cut percentage (default 3).</p>`, sol: `<div data-code="s10-02"></div>` },
    { q: `<p>A procedure for the branch given as a parameter: couriers earning below the branch average get <strong>150 added</strong> to their bonus (treat NULL as 0). Print how many people got it.</p>`, sol: `<div data-code="s10-03"></div>` },
    { q: `<p>Turn exercise 5 of set 9 into a procedure: you pass <strong>how many pieces</strong> to issue. If there are too few on the shelf — error.</p>`, sol: `<div data-code="s10-04"></div>` },
    { q: `<p>Rewrite exercise 1 with a cursor <strong>FOR loop</strong> (bonus: <code>FOR UPDATE</code> + <code>WHERE CURRENT OF</code>).</p>`, sol: `<div data-code="s10-05"></div>` },
    { q: `<p><em>(Extra, by the author)</em> A cursor with a parameter (branch number): print the salary ranking of branch 30 as “1. SURNAME salary”, using <code>%ROWCOUNT</code>.</p>`, sol: `<div data-code="s10-06"></div>` }
  ]
},

't11-plsql-triggers': {
  title: 'Exercises 11: PL/SQL — triggers',
  lead: 'BEFORE/AFTER, statement and row level, :OLD/:NEW, INSERTING/UPDATING/DELETING and a summary table.',
  intro: `<p>Database: <a href="#/tasks/databases">Couriers (Oracle)</a>. After testing disable the trigger (<code>ALTER TRIGGER … DISABLE</code>) or drop it.</p>`,
  items: [
    { q: `<p>Create a trigger that doesn't allow deleting any <strong>branch</strong>.</p>`, sol: `<div data-code="s11-01"></div>` },
    { q: `<p>Create a trigger that on INSERT and on UPDATE of the salary doesn't allow a salary <strong>lower than 2000</strong>. <em>(A CHECK could do it — we practise a trigger.)</em></p>`, sol: `<div data-code="s11-02"></div>` },
    { q: `<p>Create the table <code>FunduszPlac (Suma, Liczba)</code> (one row: salary total and courier count) and a row-level trigger that keeps it up to date on INSERT, UPDATE of the salary and DELETE.</p>`, sol: `<div data-code="s11-03"></div>` },
    { q: `<p>Write <strong>one</strong> trigger that:</p>
<ul><li>doesn't allow deleting a person with the job <strong>KIEROWNIK</strong> or <strong>DYREKTOR</strong>;</li>
<li>doesn't allow changing the <strong>hire date</strong>;</li>
<li>doesn't allow adding a courier with a surname already present <strong>in the same branch</strong>.</li></ul>`, sol: `<div data-code="s11-04"></div>` },
    { q: `<p>Write a trigger that doesn't allow <strong>lowering the bonus</strong> and doesn't allow deleting employees of the <strong>head office (branch 10)</strong>.</p>`, sol: `<div data-code="s11-05"></div>` }
  ]
},

'k1-tsql': {
  title: 'Practice test 2 (T-SQL): procedure + trigger',
  lead: 'An own test-style set: a procedure with data checks and a trigger with several rules — MS SQL Server.',
  intro: `<div data-note="own"><p>This year the T-SQL test is in <strong>class 8</strong> (10 pts). The tasks were written by the site author in the style of last year’s test — they are <strong>not</strong> real test tasks.</p></div>
<p>Table: <strong>Produkt (IdProdukt, Nazwa, Cena, Stan)</strong> from <a href="#/tasks/databases">Practice databases</a>. Try to fit in 45 minutes.</p>`,
  items: [
    { q: `<p>Write a procedure <code>Uzupelnij</code> with the parameter <em>product name</em>:</p>
<ul><li>if the product doesn't exist — raise an error;</li>
<li>if the stock is less than <strong>5</strong> — print “critically low stock … – order from the supplier”;</li>
<li>otherwise increase the stock by <strong>20</strong> and print a message.</li></ul>`, sol: `<div data-code="k1-01"></div>` },
    { q: `<p>Write a trigger on the Produkt table that:</p>
<ul><li>doesn't allow changing the product <strong>name</strong>;</li>
<li>doesn't allow raising the price by <strong>more than 15%</strong>;</li>
<li>doesn't allow a <strong>negative</strong> stock;</li>
<li>when the price changes, prints by how many percent.</li></ul>`,
      hint: `<p>Compare inserted with deleted by joining on IdProdukt; remember about many rows.</p>`, sol: `<div data-code="k1-02"></div>` },
    { h: `Variant B — the Kurier table`, text: `<p>A different scenario, same difficulty. Table <strong>Kurier (IdKurier, Nazwisko, DataZatrudnienia, Pensja, Premia, …)</strong> from Practice databases.</p>` },
    { q: `<p>Write a procedure <code>Podwyzka</code> with a <em>courier id</em> parameter:</p>
<ul><li>no such courier → raise an error;</li>
<li>salary is <strong>7000 or more</strong> → print “… already has the top rate – no raise”;</li>
<li>otherwise increase the salary by <strong>300</strong> and print the new salary.</li></ul>`, sol: `<div data-code="k1-03"></div>` },
    { q: `<p>Write a trigger on the Kurier table that:</p>
<ul><li>does not allow changing the <strong>hire date</strong>;</li>
<li>on a salary change prints the percentage change and does not allow <strong>raising</strong> it by more than <strong>20%</strong>;</li>
<li>does not allow the bonus to be <strong>negative</strong> or <strong>greater than the salary</strong> (INSERT and UPDATE).</li></ul>`, sol: `<div data-code="k1-04"></div>` }
  ]
},

'k2-plsql': {
  title: 'Practice test 3 (PL/SQL): procedure + trigger',
  lead: 'The same logic as last year’s test (a procedure + a trigger in PL/SQL), but a different table, thresholds and rules.',
  intro: `<p>Table: <strong>Produkt (IdProdukt, Nazwa, Cena, Stan)</strong> in Oracle — from <a href="#/tasks/databases">Practice databases</a>.</p>
<div data-note="warn"><p>A common mistake: checking whether the product exists with <code>IF v_stock = 0</code> after <code>SELECT … INTO</code>. When there is no row, SELECT INTO raises <code>NO_DATA_FOUND</code> — the IF is never reached. It must be handled in the EXCEPTION section (or use COUNT).</p></div>`,
  items: [
    { q: `<p>Write a procedure <code>Uzupelnij(p_nazwa)</code>:</p>
<ul><li>no product → <code>RAISE_APPLICATION_ERROR</code>;</li>
<li>stock less than <strong>10</strong> → message “too few … – order first”;</li>
<li>otherwise stock + <strong>25</strong> and a message.</li></ul>`, sol: `<div data-code="k2-01"></div>` },
    { q: `<p>Write a trigger on the Produkt table that:</p>
<ul><li>on update doesn't allow changing the <strong>name</strong>;</li>
<li>prints the price change percentage and doesn't allow <strong>lowering</strong> the price by more than <strong>25%</strong>;</li>
<li>doesn't allow a <strong>negative</strong> stock (on INSERT and UPDATE).</li></ul>`, sol: `<div data-code="k2-02"></div>` },
    { h: `Variant B — the Kurier table`, text: `<p>A different scenario, same difficulty. Table <strong>Kurier (IdKurier, Nazwisko, DataZatrudnienia, Pensja, Premia, …)</strong> from Practice databases.</p>` },
    { q: `<p>Write a procedure <code>Podwyzka</code> with a <em>courier id</em> parameter:</p>
<ul><li>no such courier → raise an error;</li>
<li>salary is <strong>7000 or more</strong> → print “… already has the top rate – no raise”;</li>
<li>otherwise increase the salary by <strong>300</strong> and print the new salary.</li></ul>`, sol: `<div data-code="k2-03"></div>` },
    { q: `<p>Write a trigger on the Kurier table that:</p>
<ul><li>does not allow changing the <strong>hire date</strong>;</li>
<li>on a salary change prints the percentage change and does not allow <strong>raising</strong> it by more than <strong>20%</strong>;</li>
<li>does not allow the bonus to be <strong>negative</strong> or <strong>greater than the salary</strong> (INSERT and UPDATE).</li></ul>`, sol: `<div data-code="k2-04"></div>` }
  ]
},

'project': {
  title: 'Project: own database + procedures and triggers',
  lead: 'What to hand in (based on last year), a work plan, a checklist and a complete “Fitness club” example in Oracle and MS SQL.',
  intro: `
<div data-note="info" data-label="Requirements — based on last year's project"><p>The exact requirements will be given by the lab teacher. Last year's submitted project suggests the scope: an <strong>ERD</strong> (Vertabelo) → a <strong>script creating the tables</strong> and filling them with data for <strong>Oracle and MS SQL</strong> → <strong>procedures and triggers</strong> in both dialects (last year: 2 procedures, one with a cursor, and 2 triggers).</p></div>
<h2>Work plan</h2>
<ol class="steps">
  <li>Choose a domain you understand (5–10 tables) and describe it in 5–6 sentences.</li>
  <li>Draw the ERD: at least one M:N relationship (associative table), sensible keys, NOT NULL, UNIQUE, CHECK.</li>
  <li>Check normalization (3NF).</li>
  <li>Generate DDL for Oracle and MS SQL, fix the types (VARCHAR2/NUMBER vs VARCHAR/INT/DECIMAL).</li>
  <li>Insert test data so that every procedure and trigger can be demonstrated (including error cases).</li>
  <li>Write procedures and triggers in one dialect first, test, then rewrite in the other.</li>
  <li>Add a “what it does” comment and a test script to every object.</li>
</ol>
<div data-note="own" data-label="From the site author — checklist">
<ul>
  <li>A procedure with <strong>parameters</strong> that validates input (error via RAISERROR / RAISE_APPLICATION_ERROR).</li>
  <li>A procedure with a <strong>cursor</strong> (and a justification why a cursor makes sense there).</li>
  <li>A trigger that <strong>blocks</strong> an invalid operation.</li>
  <li>A trigger that <strong>maintains derived data</strong> (a counter, history, summary).</li>
  <li>T-SQL: triggers work for many rows (inserted/deleted). PL/SQL: no mutating table, no COMMIT in a trigger.</li>
  <li>New keys: MAX + 1 with NVL/ISNULL or IDENTITY/sequence.</li>
  <li>The script runs “from scratch” without errors (CREATE/DROP order!).</li>
</ul>
</div>
<h2>Example: “Fitness club”</h2>
<p>People can be club members and/or trainers. A trainer runs classes in rooms of a given capacity; members sign up for classes (M:N). Changes of trainer rates are recorded in a history table.</p>
<pre data-lang="text">Osoba (IdOsoba PK, Imie, Nazwisko, Telefon UNIQUE)                  ← person
Klubowicz (IdKlubowicz PK, IdOsoba FK UNIQUE, DataDolaczenia)     ← member, 1:1 with Osoba
Trener (IdTrener PK, IdOsoba FK UNIQUE, Stawka CHECK > 0)          ← trainer, 1:1 with Osoba
Sala (IdSala PK, Nazwa, Pojemnosc)                                   ← room + capacity
Zajecia (IdZajecia PK, Nazwa, IdTrener FK, IdSala FK, Termin, CzasMin)
Zapis (IdZajecia PK/FK, IdKlubowicz PK/FK)                           ← M:N sign-ups
HistoriaStawek (IdTrener FK, StaraStawka, NowaStawka, DataZmiany)   ← rate history</pre>
<div data-note="warn"><p>This is a learning example — don't hand it in as your project. Choose your own domain and your own rules.</p></div>`,
  items: [
    { q: `<p><strong>Tables and data.</strong></p>`, sol: `<div data-code="proj-ddl-ora"></div><div data-code="proj-ddl-ms"></div>` },
    { q: `<p><strong>Procedure 1 (with a cursor):</strong> sign a person (first name, surname, phone) up for the nearest future class with a given name that still has a free seat. If the person doesn't exist — add them; if they are not a member — add a member record.</p>`, sol: `<div data-code="proj-p1-ora"></div><div data-code="proj-p1-ms"></div>` },
    { q: `<p><strong>Procedure 2:</strong> promote an existing person to trainer with a rate equal to the average trainer rate; if already a trainer — just a message; if the person doesn't exist — error.</p>`, sol: `<div data-code="proj-p2-ora"></div><div data-code="proj-p2-ms"></div>` },
    { q: `<p><strong>Trigger 1:</strong> don't allow signing up beyond the room capacity.</p>`, hint: `<p>In Oracle a row trigger on Zapis cannot read Zapis (mutating) — use a statement-level trigger.</p>`, sol: `<div data-code="proj-t1-ora"></div><div data-code="proj-t1-ms"></div>` },
    { q: `<p><strong>Trigger 2:</strong> record every change of a trainer's rate in HistoriaStawek; don't allow lowering the rate by more than 10%.</p>`, sol: `<div data-code="proj-t2-ora"></div><div data-code="proj-t2-ms"></div>` }
  ]
}

});
