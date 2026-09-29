/* EN – Module 1: recap of Relational Databases */
SBD.addContent('en', {

'relational-model': {
  title: 'Relational model, Codd’s rules and integrity constraints',
  lead: 'What a database is, where the name “relational” comes from, what NULL is and how the database itself keeps data correct.',
  body: `
<h2>What a database is</h2>
<p>Data is one of the most valuable resources of every company — next to money, people and buildings. It has to be <strong>managed</strong>: stored, protected, made available. That is the job of a database.</p>
<p>The word “database” has two meanings:</p>
<ul>
  <li><strong>Database Management System (DBMS, Polish: SZBD)</strong> — the program that takes care of data structure, security and access rules (e.g. MS SQL Server, Oracle);</li>
  <li><strong>a collection of data</strong> — the data itself stored in that system.</li>
</ul>
<p>A layperson usually means the second one (“I keep a database of contacts in my notebook”). We, IT people, mean <strong>both at once</strong>: the system + the data it manages.</p>
<div data-note="analogy"><p>A library: the books on the shelves are the <em>data</em>, and the librarian with the rules (who may borrow, where things are, what is forbidden) is the <em>DBMS</em>.</p></div>
<div data-note="lecture"><p>The lecture reminded us that data is very valuable today (leaks of medical data of millions of people) and that databases are literally everywhere — even in your phone.</p></div>

<h2>Where the name “relational” comes from</h2>
<p>The relational model was proposed by <strong>Edgar Codd in 1970</strong> — and it still works today (more than half a century!). The name comes from mathematics:</p>
<ul>
  <li>The <strong>Cartesian product</strong> A × B is the set of <em>all</em> pairs (x, y) with x ∈ A, y ∈ B. It is not commutative: A × B ≠ B × A.</li>
  <li>A single pair (x, y) is a <strong>tuple</strong>. For n sets a tuple has n elements.</li>
  <li>A <strong>relation</strong> is a <em>subset</em> of a Cartesian product.</li>
  <li>A <strong>table</strong> is the physical form of a relation: n sets → n columns, each tuple → one row.</li>
</ul>
<p>Example: A = {Ala, Ola}, B = {SQL, Java}. A × B = {(Ala,SQL), (Ala,Java), (Ola,SQL), (Ola,Java)}. The relation “who knows which language” may be {(Ala,SQL), (Ola,Java)} — i.e. a table with two rows.</p>
<div data-note="warn"><p>A database is <strong>not</strong> called relational because “tables are linked by relations”. Links between tables are <strong>relationships</strong>. The name comes from <strong>relation = table</strong> (a subset of a Cartesian product). The lecturer stressed that this mistake happens even at engineering thesis defences.</p></div>
<p>Importantly, not only a table is a relation, but also <strong>the result of every SELECT</strong> and a <strong>view</strong>. Everything we work on in a relational database is a relation — that is why we can compare and combine them.</p>

<h2>Three levels of looking at a database</h2>
<dl>
  <dt>Logical</dt><dd>the design: tables, columns, data types, relationships.</dd>
  <dt>Physical</dt><dd>the files on disk where the server really keeps the data (see the administration lectures).</dd>
  <dt>User</dt><dd>interfaces (applications) through which an ordinary person sees and changes data without knowing SQL.</dd>
</dl>

<h2>Codd’s rules</h2>
<p>Codd described a relational database with 13 rules (0–12). You don't have to know all of them by heart, but the ones highlighted in the lecture are worth understanding:</p>
<table>
  <thead><tr><th>No.</th><th>Rule</th><th>In plain words</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>Foundation rule</td><td>A relational system manages data <strong>only</strong> by means of the relational model — no mixing with other solutions.</td></tr>
    <tr><td>1</td><td>Information rule</td><td>At the logical level everything (including table and column names) is values in tables.</td></tr>
    <tr><td>2</td><td>Guaranteed access</td><td>Every single value can be reached by 3 things: <strong>table name + column name + primary key value</strong>. (In MS SQL a fourth one comes in: the database name.)</td></tr>
    <tr><td>3</td><td>NULL</td><td>There is a special marker <code>NULL</code> = “no value / unknown”. It is <strong>not</strong> 0 nor an empty string and works for every type.</td></tr>
    <tr><td>4</td><td>Metadata (catalog)</td><td>The description of the database (which tables, columns…) is also kept in tables and read with SQL.</td></tr>
    <tr><td>5</td><td>Comprehensive language</td><td>One language (SQL) for everything: defining tables, views, constraints, data, permissions, transactions.</td></tr>
    <tr><td>6</td><td>View updating</td><td>Data can be changed through views when it makes sense.</td></tr>
    <tr><td>7</td><td>High-level operations</td><td>We operate on whole sets (tables), not only row by row.</td></tr>
    <tr><td>8</td><td>Physical independence</td><td>Changing how data is stored on disk does not break applications.</td></tr>
    <tr><td>9</td><td>Logical independence</td><td>Correct changes in tables do not break applications.</td></tr>
    <tr><td>10</td><td>Integrity independence</td><td>Correctness rules are defined in the database, not in the application.</td></tr>
    <tr><td>11</td><td>Distribution independence</td><td>Data can live in different places of a network (distributed databases) — already almost 60 years ago!</td></tr>
    <tr><td>12</td><td>Non-subversion</td><td>Even low-level access cannot bypass integrity constraints.</td></tr>
  </tbody>
</table>

<h2>NULL and three-valued logic</h2>
<p><code>NULL</code> means “unknown”. Therefore:</p>
<ul>
  <li>every arithmetic or text operation with <code>NULL</code> gives <code>NULL</code> (e.g. <code>5 * NULL = NULL</code>);</li>
  <li>even <code>NULL = NULL</code> is not TRUE but <code>NULL</code> (“I don't know whether two unknown things are equal”);</li>
  <li>there are two exceptions in logic: <code>NULL OR TRUE = TRUE</code> and <code>NULL AND FALSE = FALSE</code>.</li>
</ul>
<table>
  <thead><tr><th>A</th><th>B</th><th>A AND B</th><th>A OR B</th><th>NOT A</th></tr></thead>
  <tbody>
    <tr><td>TRUE</td><td>NULL</td><td>NULL</td><td>TRUE</td><td>FALSE</td></tr>
    <tr><td>FALSE</td><td>NULL</td><td>FALSE</td><td>NULL</td><td>TRUE</td></tr>
    <tr><td>NULL</td><td>NULL</td><td>NULL</td><td>NULL</td><td>NULL</td></tr>
  </tbody>
</table>
<div data-note="exam"><p>The <code>WHERE</code> clause lets through only rows for which the condition is <strong>TRUE</strong>. Rows giving FALSE <em>or NULL</em> are dropped. That is where “disappearing” rows with NULLs come from.</p></div>

<h2>Integrity constraints</h2>
<p><strong>Integrity constraints</strong> are rules that guarantee the data in the database is logically correct. The key principle:</p>
<p><strong>We define the rules when designing the database — and the DBMS enforces them</strong>, always and for everyone (every application, every user).</p>
<p>Constraints can be defined with SQL declarations (simplest), triggers, procedures or indexes. More complex rules often need triggers and procedures — i.e. programming, which we learn this semester.</p>

<h3>Primary key — PRIMARY KEY</h3>
<p>It identifies a row unambiguously. Theory says every row of a table must be different, but SQL itself does not enforce it — that's why we need a key. Requirements:</p>
<ul>
  <li><strong>uniqueness</strong> — a different value in every row (for a composite key: a different combination of values);</li>
  <li><strong>no NULL</strong> — NULL answers “I don't know” to every question, so it cannot be an identifier.</li>
</ul>
<p>There is <strong>one</strong> primary key per table (there may be several candidate keys — we choose one as primary). If no natural column is unique, we add a <strong>surrogate key</strong> (e.g. a sequential number).</p>

<h3>UNIQUE, NOT NULL, CHECK</h3>
<ul>
  <li><strong>UNIQUE</strong> — meaningful values cannot repeat, but NULL is allowed. Oracle follows the theory (many NULLs), while MS SQL Server treats NULL as an ordinary value — a UNIQUE column can hold <em>only one</em> NULL.</li>
  <li><strong>NOT NULL</strong> — the column must have a value.</li>
  <li><strong>CHECK</strong> — a condition on values, e.g. a grade range 2–5 or a comparison of two columns (end date ≥ start date).</li>
</ul>

<h3>Referential integrity — FOREIGN KEY</h3>
<p>It appears when we link tables with a <strong>primary key ↔ foreign key</strong> pair. The rule: the foreign key value in the child table (the “many” side) must exist as a primary key in the parent table (the “one” side) — or be NULL if the relationship is optional. The DBMS enforces it automatically.</p>
<div data-code="rm-constraints"></div>

<h2>Index — a preview</h2>
<p>An <strong>index</strong> is an extra structure that lets you quickly find rows by a column value — like the index at the end of a book: instead of reading the whole book, you look it up and immediately know the page. A table can have <strong>one clustered (sorted) index</strong> and <strong>several non-clustered</strong> ones. Details: the lecture about indexes.</p>
`,
  cheat: `
<ul>
  <li><strong>Database</strong> = DBMS (management system) + collection of data.</li>
  <li><strong>Relation</strong> = subset of a Cartesian product = <strong>table</strong> (and also a SELECT result and a view). Links between tables are <strong>relationships</strong>, not relations!</li>
  <li>A × B — all pairs, not commutative. A pair = <strong>tuple</strong>.</li>
  <li>Levels: logical, physical (files), user (interfaces).</li>
  <li>Codd 1970, 13 rules (0–12). Key ones: 0 (only the relational model), 2 (table + column + key), 3 (NULL), 4 (metadata in tables), 10 (constraints in the DB), 11 (distribution).</li>
  <li><code>NULL</code> ≠ 0 ≠ ''. Operation with NULL → NULL. <code>NULL = NULL</code> → NULL. Exceptions: <code>NULL OR TRUE = TRUE</code>, <code>NULL AND FALSE = FALSE</code>.</li>
  <li>WHERE lets through only TRUE.</li>
  <li>Constraints: <strong>we define, the DBMS enforces</strong>.
    <ul>
      <li>PK: unique + NOT NULL, one per table, may be composite.</li>
      <li>UNIQUE: no duplicates, NULL allowed (MS SQL: only one NULL).</li>
      <li>NOT NULL, CHECK (condition), FK (a value from the parent PK or NULL).</li>
    </ul>
  </li>
  <li>Index = book index; 1 clustered + many non-clustered.</li>
</ul>
`
},

'erd': {
  title: 'Design: entity-relationship diagrams (ERD)',
  lead: 'How to turn a description of reality into a table design: entities, attributes, 1:N, M:N, recursive and 1:1 relationships.',
  body: `
<h2>Why we draw a diagram</h2>
<p>A database describes a fragment of reality. Before writing dozens of <code>CREATE TABLE</code> statements we draw an <strong>intermediate model</strong> — an entity-relationship diagram (ERD). On one hand it shows real-world objects and dependencies between them, on the other it is the template of future tables. A picture is much easier to understand than code, so we use CASE tools (in the labs: Vertabelo) which then generate the SQL script.</p>

<h2>Entity, attribute, instance</h2>
<ul>
  <li><strong>Entity</strong> — a model of a <em>class of objects</em> described by the same features: Student, Car, Lecture room. An entity becomes a table.</li>
  <li><strong>Attribute</strong> — a named feature of an entity with a data type (Nazwisko VARCHAR(40)). An attribute becomes a column.</li>
  <li><strong>Entity instance</strong> — a single object (a specific student Kowalski). In a table — one row.</li>
</ul>
<div data-note="analogy"><p>An entity is an empty “Student card” form, attributes are the form fields, and instances are the filled-in cards of specific people.</p></div>
<div data-note="lecture"><p>Good practice: <strong>first</strong> design entities for things that really exist, <strong>then</strong> think about relationships. Remember that there can be <strong>more than one</strong> relationship between two entities (e.g. Person–City: “lives in” and “was born in”).</p></div>

<h2>Relationship</h2>
<p>A <strong>relationship</strong> is an ordered list of entities (an entity may repeat), formally Z(E1, …, En). Most often we have <strong>binary relationships</strong> — between two entities, e.g. Student and City of birth. A relationship instance is a set of pairs, e.g. (Kowalski, Warsaw), (Zieliński, Kraków).</p>

<h2>Functional (one-to-many, 1:N) relationship</h2>
<p>A relationship is <strong>functional</strong> (Polish: <em>jednoznaczny</em>) when it can be described by a function: each student gets <em>at most one</em> city of birth. One city may have many students.</p>
<ul>
  <li><strong>The “many” side</strong> (child entity) — the domain of the function: Student.</li>
  <li><strong>The “one” side</strong> (parent entity) — the codomain: City.</li>
  <li>If we don't know the city of every student — a <em>partial</em> function; if we know it for everyone — a <em>total</em> one.</li>
</ul>
<p><strong>Implementation:</strong> two tables. The table on the “many” side gets a <strong>foreign key</strong> column pointing to the primary key value of the “one” side (Student.IdMiasto → Miasto.IdMiasto). A CASE tool does exactly this when you draw the relationship line.</p>

<h2>Relationship properties</h2>
<dl>
  <dt>Name</dt><dd>Every relationship has a unique name. CASE tools build it from table names. <strong>Watch out in Oracle:</strong> every name is max. 30 characters — with long table names you must shorten the relationship name by hand.</dd>
  <dt>Cardinality</dt><dd>How many times the same key value from the “one” side may appear on the “many” side (usually 0..many, but other cases happen).</dd>
  <dt>Identifying / non-identifying</dt><dd>Identifying — the foreign key <strong>is part of the primary key</strong> of the child table. Non-identifying — it is not.</dd>
  <dt>Optionality</dt><dd>A relationship is optional when the foreign key column allows NULL.</dd>
  <dt>Referential actions</dt><dd>What the server does when we delete a parent row referenced by child rows: <code>NO ACTION</code> (default — blocked), <code>SET NULL</code>, <code>SET DEFAULT</code>, <code>CASCADE</code> (delete the children too).</dd>
</dl>
<div data-code="erd-actions"></div>

<h2>Non-functional (many-to-many, M:N) relationship</h2>
<p>A student enrols in many subjects, and many students enrol in a subject. Such a relationship cannot be described by a function — there is no “predecessor” and “successor”. <strong>The relational model cannot store it directly</strong>, so we split it into functional relationships:</p>
<ol class="steps">
  <li>For the relationship Z(E1, E2) create a new entity E0 — an <strong>associative entity</strong> (e.g. Zapis = enrolment).</li>
  <li>Create two 1:N relationships: E0–E1 and E0–E2.</li>
  <li>The key of E0 = the keys of E1 and E2 together. The relationships are <strong>identifying</strong>, so E0 is always a dependent (weak) entity.</li>
  <li>For an n-ary relationship (n &gt; 2) — one entity E0 and n binary relationships.</li>
</ol>
<div data-code="erd-mn"></div>

<h2>Special cases</h2>
<h3>Recursive relationship</h3>
<p>The same entity appears twice in the relationship — e.g. an employee and their boss (the well-known EMP table: column MGR points to the EMPNO of another employee). Such a relationship:</p>
<ul>
  <li><strong>cannot</strong> be identifying;</li>
  <li><strong>must</strong> be optional (the FK allows NULL) — otherwise we could not insert the first row (the CEO has no boss).</li>
</ul>
<div data-code="erd-recursive"></div>
<h3>One-to-one (1:1) relationship</h3>
<p>A special case of 1:N: each row on the “one” side corresponds to at most one row on the “many” side (an injective function). It can be implemented with one, two or three tables.</p>

<h2>How to design — step by step</h2>
<div data-note="own">
<ol>
  <li>Read the description and underline the <strong>nouns</strong> — candidate entities (client, animal, visit…).</li>
  <li>For each entity list attributes and choose an <strong>identifier</strong> (or add a surrogate Id).</li>
  <li>Underline the <strong>verbs</strong> (“a client <em>has</em> animals”, “a visit <em>concerns</em> an animal”) — these are relationships.</li>
  <li>For every relationship ask both ways: “how many X can one Y have?”. You get 1:N or M:N.</li>
  <li>Turn every M:N into an associative entity. It often gets its own attributes (e.g. Enrolment.Date, OrderLine.Quantity).</li>
  <li>Check that no information is stored twice (normalization — next topic).</li>
  <li>Generate the SQL script and test it on the server.</li>
</ol>
</div>
<div data-note="own" data-label="From the site author — example (Library)">
<p>“A reader borrows copies of books. A book can have many authors, an author wrote many books. The library has several copies of the same book.”</p>
<pre data-lang="text">Autor (IdAutor PK, Imie, Nazwisko)
Ksiazka (IdKsiazka PK, Tytul, RokWydania)
KsiazkaAutor (IdKsiazka PK/FK, IdAutor PK/FK)        ← M:N Book–Author
Egzemplarz (IdEgzemplarz PK, IdKsiazka FK, Sygnatura) ← 1:N (copies)
Czytelnik (IdCzytelnik PK, Imie, Nazwisko, Email)
Wypozyczenie (IdWypozyczenie PK, IdEgzemplarz FK, IdCzytelnik FK,
              DataOd, DataDo NULL)                    ← DataDo NULL = not returned yet</pre>
</div>
`,
  cheat: `
<ul>
  <li><strong>ERD</strong> = intermediate model: reality → diagram → tables (a CASE tool, e.g. Vertabelo, generates SQL).</li>
  <li>Entity → table, attribute → column, instance → row.</li>
  <li>Entities first (real things), then relationships. There may be several relationships between two entities.</li>
  <li><strong>1:N (functional)</strong> = a function. The FK goes on the <strong>“many”</strong> (child) side.</li>
  <li>Relationship properties: name (Oracle ≤ 30 characters!), cardinality, identifying (FK ∈ PK) / non-identifying, optionality (FK NULL), referential actions.</li>
  <li>Actions: <code>NO ACTION</code> (default, blocks), <code>CASCADE</code>, <code>SET NULL</code>, <code>SET DEFAULT</code>.</li>
  <li><strong>M:N</strong> → associative entity E0; key = both keys; identifying relationships; E0 dependent. N-ary: E0 + n relationships.</li>
  <li><strong>Recursive</strong>: non-identifying and optional (FK NULL), e.g. EMP.MGR → EMP.EMPNO.</li>
  <li><strong>1:1</strong>: special 1:N, 1–3 tables.</li>
  <li>Method: nouns → entities, verbs → relationships, ask “how many?” both ways.</li>
</ul>
`
},

'normalization': {
  title: 'Normalization: from 1NF to BCNF (and 4NF)',
  lead: 'How to recognise a bad table by repeated data and how to decompose it — with simple examples.',
  body: `
<h2>Why normalize</h2>
<p><strong>The normalization principle:</strong> every fact should be stored in the database <strong>in one place only</strong>. When the same fact is stored several times we have <strong>redundancy</strong>, which leads to errors and contradictions — the so-called <strong>anomalies</strong>:</p>
<ul>
  <li><strong>insertion anomaly</strong> — you cannot store fact A without fact B (e.g. a subject without a student);</li>
  <li><strong>update anomaly</strong> — a change must be made in many rows, and if you forget one, the data contradicts itself;</li>
  <li><strong>deletion anomaly</strong> — deleting one thing, you lose another piece of information along the way.</li>
</ul>
<div data-note="lecture"><p>Redundancy is not always bad. Example from the university database: we store the PESEL number, the date of birth and the sex, although PESEL already contains the date and the sex. We do it for convenience and speed — but such <strong>deliberate</strong> redundancy must be <strong>controlled</strong>, usually programmatically (triggers, procedures), because plain SQL is not enough.</p></div>

<h2>Concepts you cannot do without</h2>
<h3>Functional dependency X → Y</h3>
<p>We say that <strong>X determines Y</strong> if for any two rows: when they have equal X, they also have equal Y. In plain words: <em>knowing X you can predict Y</em>, in every row of the table.</p>
<p>Example: PESEL → DateOfBirth. Two rows with the same PESEL must have the same date of birth.</p>
<p class="formula">A relation r with schema R satisfies X → Y if for all tuples t, u: t|X = u|X ⇒ t|Y = u|Y</p>
<h3>Superkey and key</h3>
<ul>
  <li><strong>Superkey</strong> — any set of columns X that determines the whole row (X → R). The set of all columns is always a superkey.</li>
  <li><strong>Key</strong> — a <strong>minimal</strong> superkey: remove any column and it no longer identifies the row. There may be several keys — one is chosen as the primary key.</li>
  <li><strong>Key attribute</strong> — a column that belongs to <em>any</em> key.</li>
</ul>
<h3>“Bad” dependencies</h3>
<ul>
  <li><strong>on the key</strong> — X is a superkey: this is fine;</li>
  <li><strong>partial</strong> — on <em>part</em> of a composite key: bad (no 2NF);</li>
  <li><strong>transitive</strong> — on a column that is neither a key nor part of one: bad (no 3NF).</li>
</ul>

<h2>First normal form (1NF)</h2>
<p>Each cell (row × column) holds <strong>one indivisible (atomic) value</strong> — not a list, not a set. Additionally: values in a column are of one type, column names are unique, and the order of rows and columns carries no information.</p>
<p>Bad (a list in a cell):</p>
<table class="table--data">
  <thead><tr><th>NrIndeksu</th><th>Nazwisko</th><th>KodPrzedmiotu</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>Kowalski</td><td>AM, HKJ, WSI</td></tr>
    <tr><td>102</td><td>Malinowski</td><td>AM, PPJ</td></tr>
    <tr><td>105</td><td>Kwiatkowski</td><td>SBD</td></tr>
  </tbody>
</table>
<p>Fix — one subject per row. Now the table is in 1NF, the key is the pair (NrIndeksu, KodPrzedmiotu), but the surname repeats in many rows:</p>
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
<p>Anomalies: you cannot add a subject nobody takes; changing a student number needs fixes in many rows; deleting Kwiatkowski deletes the information that the subject SBD exists. Solution: <strong>decompose</strong> into STUDENT {NrIndeksu, Nazwisko}, PRZEDMIOT {KodPrzedmiotu, Przedmiot} and — since the relationship is M:N — an associative table PROGRAM {NrIndeksu, KodPrzedmiotu}.</p>

<h2>Second normal form (2NF)</h2>
<p>A table is in <strong>2NF</strong> when it is in 1NF and <strong>has no partial dependencies</strong> (on part of the key).</p>
<p>Example: OCENA {NrIndeksu, KodPrzedmiotu, Ocena, Wykladowca} (grade and lecturer). Key: (NrIndeksu, KodPrzedmiotu). But to know <em>who</em> gave the grade, KodPrzedmiotu alone is enough (each subject has one lecturer): <strong>KodPrzedmiotu → Wykladowca</strong> — a dependency on part of the key.</p>
<div data-note="warn"><p><strong>A wrong “fix”</strong>: adding a surrogate column IdOcena as the primary key. The problem does not go away! A partial dependency concerns <strong>every</strong> key, not only the primary one — and (NrIndeksu, KodPrzedmiotu) is still a key, so the dependency on its part still exists. The table must be decomposed anyway.</p></div>
<p>Correct: move the Wykladowca column to PRZEDMIOT {KodPrzedmiotu, Przedmiot, Wykladowca}, and keep {NrIndeksu, KodPrzedmiotu, Ocena} in OCENA.</p>
<div data-note="lecture"><p>A second example from the lecture: SUPPLIERS {SupplierName, ProductName, SupplierAddress, Price}. The price depends on the pair (supplier, product) — the same flower pot costs differently in different shops. But the address depends on the supplier only. When a supplier stops selling a product, its address disappears too. Partial dependencies are rare and easy to fix.</p></div>

<h2>Third normal form (3NF)</h2>
<p>A table is in <strong>3NF</strong> when it is in 2NF and <strong>no non-key attribute depends on another non-key attribute</strong> (no transitive dependencies).</p>
<p>Example: PRZEDMIOT {KodPrzedmiotu, Przedmiot, Wykladowca, NrTelefonu, Stopien}. The key is KodPrzedmiotu, but the phone and the academic degree depend on the <strong>lecturer</strong>, not on the subject: KodPrzedmiotu → Wykladowca → NrTelefonu. When a lecturer teaches two subjects, their phone is stored twice.</p>
<p>Correct: WYKLADOWCA {Wykladowca, NrTelefonu, Stopien} and PRZEDMIOT {KodPrzedmiotu, Przedmiot, Wykladowca}, where Wykladowca is a foreign key.</p>
<div data-note="lecture"><p>Example from the recording: EMPLOYEE {Id, Surname, UniversityName, UniversityAddress}. UniversityName → UniversityAddress, and UniversityName is not a key. Deleting all employees of a university loses its address. Students usually struggle more with transitive dependencies than with partial ones.</p></div>

<h2>Algorithm for removing bad dependencies</h2>
<ol class="steps">
  <li>Move the columns of the “bad” dependency X → Y <strong>to a new table</strong>. The left side (X) is the key of the new table.</li>
  <li>From the original table <strong>remove the right side</strong> (Y). The left side (X) stays and acts as a <strong>foreign key</strong>.</li>
</ol>
<p>Practical rule: <strong>every kind of object — a separate table.</strong></p>
<div data-code="norm-final"></div>

<h2>Boyce–Codd normal form (BCNF) vs 3NF</h2>
<p><strong>BCNF:</strong> for every dependency X → A either A ∈ X (trivial), or X is a superkey. So only dependencies on a (super)key are allowed.</p>
<p><strong>3NF (full definition):</strong> for every X → A: A ∈ X, <em>or</em> X is a superkey, <em>or</em> <strong>A is a key attribute</strong>. This third case is the only difference.</p>
<p>Why the exception? Some tables cannot be brought to BCNF without losing information. Example: exams {NrIndeksu, KodPrzedmiotu, Termin, Wykladowca, Ocena}; in a given attempt you take the exam with one lecturer, but a subject has several lecturers. Key: (NrIndeksu, KodPrzedmiotu, Termin). There is a dependency <strong>Wykladowca → KodPrzedmiotu</strong>. Wykladowca is not a key, so this is not BCNF — but KodPrzedmiotu is a key attribute, so it is 3NF.</p>
<div data-note="exam"><p>In practice we normalize a database <strong>to 3NF</strong> (often we get BCNF along the way). 3NF vs BCNF difference = allowing a dependency whose right side is a key attribute.</p></div>

<h2>4NF and 5NF</h2>
<p>Having no bad functional dependencies does not yet guarantee no redundancy. There are also:</p>
<ul>
  <li><strong>multivalued dependencies</strong> → no <strong>4NF</strong>;</li>
  <li><strong>join dependencies</strong> → no <strong>5NF</strong>.</li>
</ul>
<p>4NF: the table is in BCNF and has no multivalued dependencies. Example: {NrIndeksu, KodPrzedmiotu, Dyscyplina} — a student's subjects and sports are <strong>independent</strong>, so every combination must be stored (2 subjects × 2 sports = 4 rows). Solution: two tables {NrIndeksu, KodPrzedmiotu} and {NrIndeksu, Dyscyplina}.</p>
<div data-note="lecture"><p>The lecturer often sees missing 4NF in student projects, justified by “there will be fewer tables”. Fewer tables = more rows and anomalies.</p></div>
<div data-note="own"><p>A quick 4NF test: if a table has two “multi” columns that know nothing about each other (e.g. a person's hobbies and foreign languages), they should go into two separate tables.</p></div>
`,
  cheat: `
<ul>
  <li>Goal: <strong>every fact in one place</strong>. Redundancy → insertion, update, deletion anomalies. Deliberate redundancy must be controlled (e.g. PESEL + date of birth).</li>
  <li><strong>X → Y</strong>: knowing X, I know Y (in every row).</li>
  <li><strong>Superkey</strong>: X → whole row. <strong>Key</strong>: minimal superkey. <strong>Key attribute</strong>: belongs to some key.</li>
  <li><strong>1NF</strong>: atomic values (no lists in a cell).</li>
  <li><strong>2NF</strong>: 1NF + no <strong>partial</strong> dependencies (on part of a composite key). A surrogate Id does NOT fix 2NF!</li>
  <li><strong>3NF</strong>: 2NF + no <strong>transitive</strong> dependencies (non-key → non-key).</li>
  <li>Fix: X and Y to a new table (X = PK), remove Y from the original, X stays as FK.</li>
  <li><strong>BCNF</strong>: every X → A has X as a superkey. <strong>3NF</strong> additionally allows A = key attribute. Practice: go to 3NF.</li>
  <li><strong>4NF</strong>: BCNF + no multivalued dependencies (independent lists → separate tables). <strong>5NF</strong>: no join dependencies.</li>
</ul>
`
}

});
