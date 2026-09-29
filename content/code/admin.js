/* Kod do wykładów z administrowania, baz rozproszonych, hurtowni i obiektów/LOB.
   Komentarze: @{polski|english|русский}. */
SBD.addCode({

  /* ================= Budowa serwera / pliki ================= */
  'adm-files': {
    lang: 'sql', title: '@{Pliki, grupy plików i przestrzenie tabel|Files, filegroups and tablespaces|Файлы, файловые группы и табличные пространства}',
    code: `
-- MS SQL: @{baza = plik danych .mdf (+ .ndf) + dziennik .ldf|database = data file .mdf (+ .ndf) + log .ldf|база = файл данных .mdf (+ .ndf) + журнал .ldf}
CREATE DATABASE Sklep
ON PRIMARY (NAME = Sklep_dane, FILENAME = 'D:\\Dane\\Sklep.mdf'),
FILEGROUP Archiwum (NAME = Sklep_arch, FILENAME = 'E:\\Archiwum\\Sklep_arch.ndf')
LOG ON (NAME = Sklep_log, FILENAME = 'F:\\Logi\\Sklep.ldf');   -- @{dziennik na INNYM dysku niż dane|log on a DIFFERENT disk than data|журнал на ДРУГОМ диске, чем данные}

-- @{tabela w wybranej grupie plików|a table in a chosen filegroup|таблица в выбранной файловой группе}
CREATE TABLE salgrade (grade INT, losal INT, hisal INT) ON Archiwum;

-- Oracle: @{tabela w przestrzeni tabel|a table in a tablespace|таблица в табличном пространстве}
CREATE TABLE salgrade (grade INTEGER, losal INTEGER, hisal INTEGER) TABLESPACE human_resources;`
  },

  /* ================= Indeksy ================= */
  'adm-idx-create': {
    lang: 'sql', title: '@{Zakładanie i usuwanie indeksów|Creating and dropping indexes|Создание и удаление индексов}',
    code: `
CREATE UNIQUE INDEX ind_emp_num ON emp (empno);    -- @{unikalny|unique|уникальный}
CREATE INDEX ind_emp_naz ON emp (ename);           -- @{zwykły: nazwiska mogą się powtarzać|ordinary: names may repeat|обычный: фамилии могут повторяться}

DROP INDEX ind_emp_naz ON emp;                     -- MS SQL
DROP INDEX ind_emp_naz;                            -- Oracle`
  },

  'adm-idx-types': {
    lang: 'mssql', title: '@{Pogrupowany, niepogrupowany, złożony, pokrywający|Clustered, non-clustered, composite, covering|Кластерный, некластерный, составной, покрывающий}',
    code: `
CREATE CLUSTERED INDEX ind_emp_naz ON emp (ename);      -- @{wiersze fizycznie w kolejności indeksu (max 1 na tabelę)|rows physically in index order (max 1 per table)|строки физически в порядке индекса (макс. 1 на таблицу)}
CREATE NONCLUSTERED INDEX ind_emp_dept ON emp (deptno); -- @{osobna struktura ze wskaźnikami (może być wiele)|separate structure with pointers (can be many)|отдельная структура с указателями (может быть много)}

-- @{złożony: kolejność ma znaczenie!|composite: order matters!|составной: порядок важен!}
CREATE NONCLUSTERED INDEX ind_emp_job_sal ON emp (job, sal);
SELECT * FROM emp WHERE job = 'SALESMAN' AND sal = 1000;   -- @{użyje indeksu|will use the index|использует индекс}
SELECT * FROM emp WHERE sal = 1000;                        -- @{raczej nie (brak pierwszej kolumny)|probably not (first column missing)|скорее нет (нет первого столбца)}

-- @{„tylko indeks” (pokrywający): wszystkie potrzebne kolumny są w indeksie|"index only" (covering): all needed columns are in the index|«только индекс» (покрывающий): все нужные столбцы есть в индексе}
CREATE INDEX ind_emp_1 ON emp (ename, sal, job);           -- @{dobry dla: SELECT ename, sal, job … WHERE ename = …|good for: SELECT ename, sal, job … WHERE ename = …|хорош для: SELECT ename, sal, job … WHERE ename = …}
CREATE INDEX ind_emp_2 ON emp (ename) INCLUDE (sal, job);  -- @{kolumny dołączone tylko w liściach|included columns only in the leaves|включённые столбцы только в листьях}`
  },

  'adm-idx-where': {
    lang: 'sql', title: '@{Funkcja w WHERE może „wyłączyć” indeks|A function in WHERE may "switch off" the index|Функция в WHERE может «отключить» индекс}',
    code: `
SELECT * FROM emp WHERE sal * 12 = 12000;   -- @{indeks na sal raczej nieużyty|index on sal probably unused|индекс по sal скорее не используется}
SELECT * FROM emp WHERE sal = 1000;         -- @{to samo, ale indeks zadziała|same thing, but the index works|то же самое, но индекс сработает}

-- Oracle: @{indeks funkcyjny|function-based index|функциональный индекс}
CREATE INDEX x ON emp (sal * 12);

-- MS SQL: @{kolumna wyliczana + zwykły indeks|computed column + ordinary index|вычисляемый столбец + обычный индекс}
ALTER TABLE emp ADD roczna AS (sal * 12);
CREATE INDEX x ON emp (roczna);`
  },

  'adm-stats': {
    lang: 'mssql', title: '@{Pomiar wydajności zapytania|Measuring query performance|Измерение производительности запроса}',
    code: `
SET STATISTICS IO ON;     -- scan count, logical reads (@{strony z bufora i dysku|pages from buffer and disk|страницы из буфера и диска}), physical reads, read-ahead reads
SET STATISTICS TIME ON;   -- @{czas kompilacji i wykonania|compile and execution time|время компиляции и выполнения}

SELECT * FROM emp WHERE ename = 'BLAKE';

-- @{W SSMS: Ctrl+M = „Include Actual Execution Plan” (plan z kosztami)|In SSMS: Ctrl+M = "Include Actual Execution Plan" (plan with costs)|В SSMS: Ctrl+M = «Include Actual Execution Plan» (план с затратами)}`
  },

  /* ================= Transakcje ================= */
  'adm-tx-basic': {
    lang: 'mssql', title: 'BEGIN TRAN, SAVE TRAN, ROLLBACK',
    code: `
BEGIN TRAN;
    INSERT INTO Osoba (Id, Nazwisko) VALUES (1, 'Kowalski');
    INSERT INTO Osoba (Id, Nazwisko) VALUES (2, 'Lenkiewicz');
    SAVE TRAN x;                                   -- @{punkt zapisu|savepoint|точка сохранения}
    INSERT INTO Osoba (Id, Nazwisko) VALUES (3, 'Nowak');
    SELECT * FROM Osoba;                           -- @{3 osoby|3 people|3 человека}
    ROLLBACK TRAN x;                               -- @{cofnij do punktu x|roll back to point x|откат к точке x}
    SELECT * FROM Osoba;                           -- @{2 osoby|2 people|2 человека}
ROLLBACK TRAN;                                     -- @{cofnij całą transakcję|roll back the whole transaction|откат всей транзакции}
SELECT * FROM Osoba;                               -- @{nikogo|nobody|никого}`
  },

  'adm-tx-transfer': {
    lang: 'mssql', title: '@{Przelew jako transakcja (wszystko albo nic)|A transfer as a transaction (all or nothing)|Перевод как транзакция (всё или ничего)}',
    code: `
BEGIN TRY
    BEGIN TRAN;
        IF (SELECT Saldo FROM Konto WHERE IdKonta = 1234) < 1000
            THROW 50001, 'Brak srodkow', 1;
        UPDATE Konto SET Saldo = Saldo - 1000 WHERE IdKonta = 1234;
        UPDATE Konto SET Saldo = Saldo + 1000 WHERE IdKonta = 5678;
    COMMIT;                                        -- @{oba UPDATE albo żaden|both UPDATEs or none|оба UPDATE или ни одного}
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK;
    PRINT 'Przelew anulowany: ' + ERROR_MESSAGE();
END CATCH;`
  },

  'adm-autocommit': {
    lang: 'sql', title: '@{Autocommit i poziomy izolacji|Autocommit and isolation levels|Автокоммит и уровни изоляции}',
    code: `
-- MS SQL: @{wyłącz automatyczne zatwierdzanie|turn off automatic commit|выключить автоматическое подтверждение}
SET IMPLICIT_TRANSACTIONS ON;
-- Oracle (SQL Developer / SQL*Plus):
SET AUTOCOMMIT OFF;

-- @{poziom izolacji (działa od następnej transakcji, w bieżącym połączeniu)|isolation level (applies from the next transaction, in the current connection)|уровень изоляции (со следующей транзакции, в текущем соединении)}
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;     -- @{domyślny|default|по умолчанию}
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;           -- @{MS SQL: wielowersyjność|MS SQL: multiversioning|MS SQL: многоверсионность}`
  },

  'adm-locks': {
    lang: 'sql', title: '@{Ręczne blokady i transakcja tylko do odczytu|Manual locks and a read-only transaction|Ручные блокировки и транзакция только для чтения}',
    code: `
LOCK TABLE emp IN EXCLUSIVE MODE;          -- Oracle
SELECT * FROM emp WITH (TABLOCKX);         -- MS SQL: @{blokada wyłączna całej tabeli|exclusive lock on the whole table|исключительная блокировка всей таблицы}

SET TRANSACTION READ ONLY;                 -- Oracle: @{odczyty bez blokad (wielowersyjność)|reads without locks (multiversioning)|чтение без блокировок (многоверсионность)}`
  },

  /* ================= Backup / restore / uprawnienia ================= */
  'adm-backup': {
    lang: 'mssql', title: '@{Kopie zapasowe z poziomu SQL|Backups from SQL|Резервные копии из SQL}',
    code: `
-- @{pełna|full|полная}
BACKUP DATABASE Sklep TO DISK = 'C:\\backup\\sklep.bak';
-- @{różnicowa: zmiany od ostatniej PEŁNEJ|differential: changes since the last FULL|разностная: изменения с последней ПОЛНОЙ}
BACKUP DATABASE Sklep TO DISK = 'C:\\backup\\sklep.bak' WITH DIFFERENTIAL;
-- @{dziennika transakcji (wymaga modelu odtwarzania FULL; czyści log)|transaction log (requires FULL recovery model; truncates the log)|журнала транзакций (нужна модель FULL; очищает журнал)}
BACKUP LOG Sklep TO DISK = 'C:\\backup\\sklep_log.bak';`
  },

  'adm-restore': {
    lang: 'mssql', title: '@{Odtwarzanie – kolejność i NORECOVERY|Restore – order and NORECOVERY|Восстановление – порядок и NORECOVERY}',
    code: `
-- @{1) ostatnia pełna (baza jeszcze niedostępna)|1) the last full one (database not yet available)|1) последняя полная (база ещё недоступна)}
RESTORE DATABASE Sklep FROM DISK = 'C:\\backup\\sklep.bak' WITH FILE = 1, NORECOVERY;
-- @{2) ostatnia różnicowa|2) the last differential|2) последняя разностная}
RESTORE DATABASE Sklep FROM DISK = 'C:\\backup\\sklep.bak' WITH FILE = 2, NORECOVERY;
-- @{3) kolejne kopie logu; ostatnia z RECOVERY (baza znów dostępna)|3) subsequent log backups; the last one WITH RECOVERY (database available again)|3) последующие копии журнала; последняя с RECOVERY (база снова доступна)}
RESTORE LOG Sklep FROM DISK = 'C:\\backup\\sklep_log.bak' WITH RECOVERY;

-- @{do punktu w czasie (np. tuż przed przypadkowym DELETE)|to a point in time (e.g. just before an accidental DELETE)|на момент времени (напр. перед случайным DELETE)}
RESTORE LOG Sklep FROM DISK = 'C:\\backup\\sklep_log.bak'
WITH STOPAT = '2026-11-20 14:29:00', RECOVERY;`
  },

  'adm-security': {
    lang: 'sql', title: '@{Konta, użytkownicy, role, uprawnienia|Logins, users, roles, permissions|Логины, пользователи, роли, права}',
    code: `
-- MS SQL: @{login (serwer) → user (baza)|login (server) → user (database)|логин (сервер) → пользователь (база)}
CREATE LOGIN jkowalski WITH PASSWORD = 'Haslo!2026';
CREATE USER  jkowalski FOR LOGIN jkowalski;
-- Oracle: @{użytkownik = konto|user = account|пользователь = учётная запись}
CREATE USER jkowalski IDENTIFIED BY haslo;

GRANT SELECT, UPDATE ON emp TO jkowalski;
GRANT SELECT (empno, ename, sal) ON emp TO jkowalski;   -- @{tylko wybrane kolumny|only chosen columns|только выбранные столбцы}
REVOKE UPDATE ON emp FROM jkowalski;
DENY DELETE ON emp TO jkowalski;                        -- @{MS SQL: DENY silniejsze niż GRANT|MS SQL: DENY is stronger than GRANT|MS SQL: DENY сильнее GRANT}

CREATE ROLE ksiegowi;                                   -- @{rola = grupa uprawnień|role = group of permissions|роль = группа прав}
GRANT SELECT ON emp TO ksiegowi;
ALTER ROLE ksiegowi ADD MEMBER jkowalski;               -- MS SQL (Oracle: GRANT ksiegowi TO jkowalski;)

CREATE SCHEMA kadry;                                    -- @{kontener obiektów (domyślny: dbo)|container of objects (default: dbo)|контейнер объектов (по умолчанию: dbo)}
SELECT * FROM kadry.pracownicy;                         -- @{odwołanie do innego schematu|referring to another schema|обращение к другой схеме}`
  },

  /* ================= Wydajność ================= */
  'adm-matview': {
    lang: 'oracle', title: '@{Perspektywa zmaterializowana z odświeżaniem|Materialized view with refresh|Материализованное представление с обновлением}',
    code: `
CREATE MATERIALIZED VIEW mv_budzety
BUILD IMMEDIATE                 -- @{od razu wypełnij (DEFERRED = później)|fill now (DEFERRED = later)|заполнить сразу (DEFERRED = позже)}
REFRESH COMPLETE ON DEMAND      -- FAST / COMPLETE / FORCE;  ON DEMAND / ON COMMIT
AS
SELECT deptno, SUM(sal) AS suma FROM emp GROUP BY deptno;

-- @{albo odświeżanie wg harmonogramu:|or refresh on a schedule:|или обновление по расписанию:}
-- REFRESH COMPLETE START WITH SYSDATE NEXT SYSDATE + 1`
  },

  'adm-partition': {
    lang: 'oracle', title: '@{Partycjonowanie zakresowe (Oracle)|Range partitioning (Oracle)|Секционирование по диапазону (Oracle)}',
    code: `
CREATE TABLE emp_part (
    empno    INTEGER,
    ename    VARCHAR2(10),
    hiredate DATE
)
PARTITION BY RANGE (hiredate) (
    PARTITION p1 VALUES LESS THAN (DATE '2009-01-01') TABLESPACE prz_tab1,
    PARTITION p2 VALUES LESS THAN (MAXVALUE)          TABLESPACE prz_tab2
);`
  },

  'adm-fill': {
    lang: 'sql', title: '@{Współczynniki wypełnienia|Fill factors|Коэффициенты заполнения}',
    code: `
-- Oracle: @{% wolnego miejsca w bloku / kiedy blok znów „wolny” dla INSERT|% free space in a block / when a block is "free" again for INSERT|% свободного места в блоке / когда блок снова «свободен» для INSERT}
CREATE TABLE emp2 (empno INTEGER, ename VARCHAR2(10)) PCTFREE 20 PCTUSED 50;

-- MS SQL: @{jak mocno zapełniać strony indeksu|how full to fill index pages|насколько заполнять страницы индекса}
CREATE INDEX x ON emp (ename) WITH (FILLFACTOR = 60);`
  },

  /* ================= Bazy rozproszone ================= */
  'dist-link': {
    lang: 'sql', title: '@{Połączenie z odległą bazą|Link to a remote database|Связь с удалённой базой}',
    code: `
-- Oracle: Database Link
CREATE DATABASE LINK warszawa CONNECT TO scott IDENTIFIED BY tiger USING 'baza_waw';
SELECT * FROM emp@warszawa;
SELECT * FROM emp@warszawa UNION SELECT * FROM emp@gdansk UNION SELECT * FROM emp@katowice;
UPDATE emp@warszawa SET sal = sal * 1.1;

-- MS SQL: Linked Server (@{nazwa czteroczłonowa|four-part name|четырёхчастное имя})
SELECT *
FROM   emp e
       INNER JOIN zdalny_serwer.baza_danych..dept d ON e.deptno = d.deptno;

-- @{transakcja rozproszona (protokół 2PC)|distributed transaction (2PC protocol)|распределённая транзакция (протокол 2PC)}
BEGIN DISTRIBUTED TRANSACTION;
    UPDATE emp SET sal = sal + 100 WHERE empno = 7369;
    UPDATE zdalny_serwer.baza_danych.dbo.emp SET sal = sal - 100 WHERE empno = 7499;
COMMIT;`
  },

  /* ================= Hurtownie ================= */
  'dw-star': {
    lang: 'sql', title: '@{Schemat gwiazdy – tabele|Star schema – tables|Схема «звезда» – таблицы}',
    code: `
-- @{wymiary (nieznormalizowane)|dimensions (denormalised)|измерения (ненормализованные)}
CREATE TABLE Produkt (IdProduktu INT PRIMARY KEY, NazwaProduktu VARCHAR(50), NazwaKategorii VARCHAR(30), OpisKategorii VARCHAR(100));
CREATE TABLE Klient  (IdKlienta INT PRIMARY KEY, Imie VARCHAR(20), Nazwisko VARCHAR(30), Adres VARCHAR(100));
CREATE TABLE Obszar  (IdObszaru INT PRIMARY KEY, NazwaObszaru VARCHAR(30), OpisObszaru VARCHAR(100));
CREATE TABLE Czas    (IdCzasu INT PRIMARY KEY, Data DATE, Miesiac INT, Kwartal INT, Rok INT);

-- @{tabela faktów: klucze wymiarów + miary (sumowalne)|fact table: dimension keys + measures (additive)|таблица фактов: ключи измерений + меры (суммируемые)}
CREATE TABLE Sprzedaz (
    IdProduktu  INT REFERENCES Produkt,
    IdKlienta   INT REFERENCES Klient,
    IdObszaru   INT REFERENCES Obszar,
    IdCzasu     INT REFERENCES Czas,
    LiczbaSztuk INT,
    Kwota       DECIMAL(12,2),
    PRIMARY KEY (IdProduktu, IdKlienta, IdObszaru, IdCzasu)
);`
  },

  'dw-query': {
    lang: 'sql', title: '@{Typowe zapytanie analityczne|A typical analytical query|Типичный аналитический запрос}',
    code: `
-- @{sprzedaż kategorii w kolejnych kwartałach – „przekrój kostki”|sales per category per quarter – a "slice of the cube"|продажи по категориям по кварталам – «срез куба»}
SELECT   c.Rok, c.Kwartal, p.NazwaKategorii,
         SUM(s.LiczbaSztuk) AS Sztuk,
         SUM(s.Kwota)       AS Obrot
FROM     Sprzedaz s
         JOIN Czas    c ON s.IdCzasu = c.IdCzasu
         JOIN Produkt p ON s.IdProduktu = p.IdProduktu
GROUP BY c.Rok, c.Kwartal, p.NazwaKategorii
ORDER BY c.Rok, c.Kwartal, Obrot DESC;`
  },

  /* ================= Obiekty i LOB ================= */
  'obj-type': {
    lang: 'oracle', title: '@{Typ obiektowy: specyfikacja i ciało|Object type: specification and body|Объектный тип: спецификация и тело}',
    code: `
CREATE TYPE name_typ AS OBJECT (
    f_name   VARCHAR2(25),
    l_name   VARCHAR2(25),
    initials VARCHAR2(7),
    MEMBER FUNCTION full_name RETURN VARCHAR2      -- @{metoda obiektu|object method|метод объекта}
);
/
CREATE TYPE BODY name_typ AS
    MEMBER FUNCTION full_name RETURN VARCHAR2 IS
    BEGIN
        RETURN l_name || ' ' || f_name;
    END full_name;
END;
/

CREATE TABLE name_table OF name_typ;                          -- @{tabela obiektowa|object table|объектная таблица}
INSERT INTO name_table VALUES ('Marilyn', 'Monroe', 'MM');
INSERT INTO name_table VALUES (name_typ('Brigitte', 'Bardot', 'BB'));   -- @{konstruktor|constructor|конструктор}
SELECT f_name, l_name, nt.full_name() FROM name_table nt;

-- @{typ w typie i obiekt jako kolumna tabeli relacyjnej|type inside a type and an object as a column of a relational table|тип внутри типа и объект как столбец реляционной таблицы}
CREATE TABLE department (dept_name VARCHAR2(20), manager name_typ, location VARCHAR2(20));`
  },

  'obj-inherit': {
    lang: 'oracle', title: '@{Dziedziczenie i typy abstrakcyjne|Inheritance and abstract types|Наследование и абстрактные типы}',
    code: `
CREATE TYPE Person AS OBJECT (first VARCHAR2(50), last VARCHAR2(50)) NOT FINAL;   -- @{można dziedziczyć|can be inherited|можно наследовать}
/
CREATE TYPE Emp_t UNDER Person (salary NUMBER) FINAL;
/
DECLARE
    x Emp_t := Emp_t('Jan', 'Kowalski', 10000);
BEGIN
    DBMS_OUTPUT.PUT_LINE(x.first || ' ' || x.last || ' ' || x.salary);
END;
/

CREATE TYPE Figure AS OBJECT (
    NOT INSTANTIABLE MEMBER FUNCTION area RETURN NUMBER     -- @{metoda abstrakcyjna|abstract method|абстрактный метод}
) NOT INSTANTIABLE NOT FINAL;
/
CREATE TYPE Rect UNDER Figure (
    x NUMBER, y NUMBER,
    OVERRIDING MEMBER FUNCTION area RETURN NUMBER
);
/
CREATE TYPE BODY Rect AS
    OVERRIDING MEMBER FUNCTION area RETURN NUMBER IS
    BEGIN RETURN x * y; END;
END;
/`
  },

  'obj-ref': {
    lang: 'oracle', title: 'REF, VALUE, VARRAY',
    code: `
CREATE TYPE Dept_Type AS OBJECT (Name VARCHAR2(10), Loc VARCHAR2(50));
/
CREATE TABLE Obj_Dept OF Dept_Type;

CREATE TYPE Emp_Type AS OBJECT (Name VARCHAR2(20), Sal NUMBER, Dept_ref REF Dept_Type);   -- @{REF = wskaźnik do obiektu|REF = pointer to an object|REF = указатель на объект}
/
CREATE TABLE Obj_Emp OF Emp_Type (Dept_ref SCOPE IS Obj_Dept);                            -- @{wskazuje tylko do Obj_Dept|points only to Obj_Dept|указывает только в Obj_Dept}

-- @{VALUE(alias) = cały obiekt z tabeli obiektowej|VALUE(alias) = the whole object from an object table|VALUE(alias) = весь объект из объектной таблицы}
-- SELECT VALUE(p) INTO p1 FROM person_tab p WHERE p.l_name = 'ALLEN';

-- @{VARRAY = tablica o maksymalnym rozmiarze|VARRAY = array with a maximum size|VARRAY = массив с максимальным размером}
CREATE TYPE Lista AS VARRAY(3) OF VARCHAR2(30);
/`
  },

  'obj-lob': {
    lang: 'oracle', title: '@{Duże obiekty: CLOB i BLOB|Large objects: CLOB and BLOB|Большие объекты: CLOB и BLOB}',
    code: `
CREATE TABLE employee (
    emp_id   NUMBER,
    emp_name VARCHAR2(35),
    resume   CLOB,          -- @{duży tekst|large text|большой текст}
    picture  BLOB           -- @{dane binarne (zdjęcie)|binary data (photo)|двоичные данные (фото)}
);
INSERT INTO employee VALUES (7897, 'Jan Kowalski', 'Znakomity aktor', NULL);
INSERT INTO employee VALUES (7898, 'Marilyn Monroe', EMPTY_CLOB(), NULL);   -- @{pusty LOB, gotowy do zapisu|empty LOB, ready to write|пустой LOB, готовый к записи}

-- @{dopisanie tekstu do CLOB przez pakiet DBMS_LOB (przez lokator)|appending text to a CLOB via DBMS_LOB (via the locator)|дописывание текста в CLOB через пакет DBMS_LOB (через локатор)}
DECLARE
    lob  CLOB;
    txt  VARCHAR2(2000) := ' tekst do dopisania';
BEGIN
    SELECT resume INTO lob FROM employee WHERE emp_id = 7898 FOR UPDATE;
    DBMS_LOB.WRITE(lob, LENGTH(txt), DBMS_LOB.GETLENGTH(lob) + 1, txt);
    COMMIT;
END;
/

-- MS SQL: @{wczytanie pliku do kolumny VARBINARY(MAX)|loading a file into a VARBINARY(MAX) column|загрузка файла в столбец VARBINARY(MAX)}
-- INSERT INTO emp (Empno, Ename, Photo)
-- SELECT 1, 'BLAKE', BulkColumn FROM OPENROWSET(BULK 'C:\\images\\IMG01.jpg', SINGLE_BLOB) AS Photo;`
  }
});
