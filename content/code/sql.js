/* Kod do wykładów: powtórka (model, ERD, normalizacja) i język SQL.
   Komentarze w kodzie mają warianty językowe: @{polski|english|русский}. */
SBD.addCode({

  /* ================= Model relacyjny / ERD ================= */
  'rm-constraints': {
    lang: 'sql', title: '@{Więzy spójności w CREATE TABLE|Integrity constraints in CREATE TABLE|Ограничения целостности в CREATE TABLE}',
    code: `
CREATE TABLE Miasto (
    IdMiasto  INT          PRIMARY KEY,     -- @{klucz główny: unikalny i nigdy NULL|primary key: unique and never NULL|первичный ключ: уникален и никогда не NULL}
    Nazwa     VARCHAR(40)  NOT NULL UNIQUE  -- @{nazwa musi być podana i nie może się powtarzać|name is required and must not repeat|название обязательно и не может повторяться}
);

CREATE TABLE Student (
    NrIndeksu  INT          PRIMARY KEY,
    Nazwisko   VARCHAR(40)  NOT NULL,
    Pesel      CHAR(11)     UNIQUE,                       -- @{UNIQUE: bez powtórzeń, ale NULL dozwolony|UNIQUE: no duplicates, but NULL allowed|UNIQUE: без повторов, но NULL разрешён}
    Rok        INT          CHECK (Rok BETWEEN 1 AND 4),  -- @{CHECK: tylko wartości 1–4|CHECK: only values 1–4|CHECK: только значения 1–4}
    IdMiasto   INT          NULL REFERENCES Miasto        -- @{klucz obcy → Miasto (NULL = nie wiemy)|foreign key → Miasto (NULL = unknown)|внешний ключ → Miasto (NULL = неизвестно)}
);`
  },

  'erd-mn': {
    lang: 'sql', title: '@{Związek wiele-do-wielu → encja asocjacyjna|Many-to-many → associative entity|Многие-ко-многим → ассоциативная сущность}',
    code: `
CREATE TABLE Przedmiot (
    KodPrzedmiotu  VARCHAR(5)   PRIMARY KEY,
    Nazwa          VARCHAR(60)  NOT NULL
);

-- @{Student ↔ Przedmiot to związek niejednoznaczny (M:N).|Student ↔ Subject is a many-to-many relationship.|Student ↔ Przedmiot — связь многие-ко-многим.}
-- @{Rozkładamy go na dwa związki 1:N przez nową tabelę Zapis.|We split it into two 1:N relationships via a new table Zapis.|Разбиваем её на две связи 1:N через новую таблицу Zapis.}
CREATE TABLE Zapis (
    NrIndeksu      INT         NOT NULL REFERENCES Student,
    KodPrzedmiotu  VARCHAR(5)  NOT NULL REFERENCES Przedmiot,
    CONSTRAINT PK_Zapis PRIMARY KEY (NrIndeksu, KodPrzedmiotu)  -- @{klucz = suma kluczy obu encji|key = sum of both entity keys|ключ = сумма ключей обеих сущностей}
);`
  },

  'erd-recursive': {
    lang: 'sql', title: '@{Związek rekurencyjny (szef – podwładny)|Recursive relationship (boss – subordinate)|Рекурсивная связь (начальник – подчинённый)}',
    code: `
CREATE TABLE Pracownik (
    IdPracownik  INT          PRIMARY KEY,
    Nazwisko     VARCHAR(40)  NOT NULL,
    IdSzef       INT          NULL REFERENCES Pracownik  -- @{musi dopuszczać NULL: prezes nie ma szefa|must allow NULL: the CEO has no boss|обязан допускать NULL: у директора нет начальника}
);

INSERT INTO Pracownik VALUES (1, 'Prezes',   NULL);  -- @{bez NULL nie wstawilibyśmy pierwszego wiersza|without NULL we could not insert the first row|без NULL мы не вставили бы первую строку}
INSERT INTO Pracownik VALUES (2, 'Kowalski', 1);`
  },

  'erd-actions': {
    lang: 'sql', title: '@{Akcje referencyjne|Referential actions|Ссылочные действия}',
    code: `
CREATE TABLE Adres (
    IdAdres    INT PRIMARY KEY,
    NrIndeksu  INT REFERENCES Student ON DELETE CASCADE,  -- @{usuwasz studenta → znikają jego adresy|delete a student → his addresses disappear|удаляешь студента → удаляются его адреса}
    IdMiasto   INT REFERENCES Miasto ON DELETE SET NULL   -- @{usuwasz miasto → w adresach pojawia się NULL|delete a city → addresses get NULL|удаляешь город → в адресах появляется NULL}
);
-- @{Bez klauzuli ON DELETE działa domyślne NO ACTION: serwer zablokuje usunięcie.|Without ON DELETE the default NO ACTION applies: the server blocks the delete.|Без ON DELETE действует NO ACTION: сервер заблокирует удаление.}`
  },

  'norm-final': {
    lang: 'sql', title: '@{Schemat po normalizacji (3NF / BCNF)|Schema after normalization (3NF / BCNF)|Схема после нормализации (3NF / BCNF)}',
    code: `
CREATE TABLE Wykladowca (
    Wykladowca  VARCHAR(20)  PRIMARY KEY,
    NrTelefonu  VARCHAR(15),
    Stopien     VARCHAR(15)
);

CREATE TABLE Przedmiot (
    KodPrzedmiotu  VARCHAR(5)   PRIMARY KEY,
    Przedmiot      VARCHAR(60)  NOT NULL,
    Wykladowca     VARCHAR(20)  REFERENCES Wykladowca  -- @{było „przechodnio” w PRZEDMIOT – teraz klucz obcy|was transitive in PRZEDMIOT – now a foreign key|было «транзитивно» в PRZEDMIOT – теперь внешний ключ}
);

CREATE TABLE Student (
    NrIndeksu  INT          PRIMARY KEY,
    Nazwisko   VARCHAR(40)  NOT NULL
);

CREATE TABLE Ocena (
    NrIndeksu      INT           REFERENCES Student,
    KodPrzedmiotu  VARCHAR(5)    REFERENCES Przedmiot,
    Ocena          NUMERIC(2,1)  NOT NULL,
    PRIMARY KEY (NrIndeksu, KodPrzedmiotu)  -- @{ocena zależy od CAŁEGO klucza|grade depends on the WHOLE key|оценка зависит от ВСЕГО ключа}
);`
  },

  /* ================= SQL – podstawy ================= */
  'sql-comments': {
    lang: 'sql', title: '@{Komentarze i średnik|Comments and semicolon|Комментарии и точка с запятой}',
    code: `
/* @{Komentarz blokowy:|Block comment:|Блочный комментарий:}
   @{wiele linii, serwer je pomija|many lines, the server skips them|много строк, сервер их пропускает} */

-- @{Komentarz jednoliniowy (do końca linii)|Single-line comment (to end of line)|Однострочный комментарий (до конца строки)}
SELECT ename, sal       -- @{można komentować część linii|you can comment part of a line|можно комментировать часть строки}
FROM   Emp
WHERE  job = 'CLERK';   -- @{tekst i daty zawsze w apostrofach: 'CLERK', '2021-11-21'|text and dates always in single quotes: 'CLERK', '2021-11-21'|текст и даты всегда в одинарных кавычках: 'CLERK', '2021-11-21'}`
  },

  'sql-groups': {
    lang: 'sql', title: '@{Cztery grupy poleceń SQL|The four groups of SQL commands|Четыре группы команд SQL}',
    code: `
-- DQL  (@{odczyt danych|reading data|чтение данных})
SELECT * FROM Emp;

-- DML  (@{operacje na danych|operations on data|операции с данными})
INSERT INTO Dept VALUES (50, 'IT', 'WARSAW');
UPDATE Emp SET sal = sal * 1.1 WHERE empno = 7369;
DELETE FROM Dept WHERE deptno = 50;

-- DDL  (@{operacje na obiektach|operations on objects|операции с объектами})
CREATE TABLE Test (Id INT);
ALTER TABLE Test ADD Opis VARCHAR(20);
DROP TABLE Test;

-- DCL  (@{uprawnienia|permissions|права доступа})
GRANT SELECT ON Emp TO jan;
REVOKE SELECT ON Emp FROM jan;
DENY DELETE ON Emp TO jan;      -- @{tylko MS SQL Server|MS SQL Server only|только MS SQL Server}`
  },

  'sql-types-ms': {
    lang: 'mssql', title: '@{Najczęstsze typy – MS SQL Server|Common types – MS SQL Server|Частые типы – MS SQL Server}',
    code: `
CREATE TABLE Produkt (
    Id         INT            PRIMARY KEY,  -- @{liczba całkowita (4 bajty)|integer (4 bytes)|целое (4 байта)}
    Kod        CHAR(5),                     -- @{stała długość, dopełniana spacjami|fixed length, padded with spaces|фиксированная длина, дополняется пробелами}
    Nazwa      VARCHAR(50),                 -- @{zmienna długość|variable length|переменная длина}
    NazwaPL    NVARCHAR(50),                -- @{Unicode (polskie znaki), 2 bajty/znak|Unicode, 2 bytes/char|Unicode, 2 байта/символ}
    Cena       DECIMAL(8,2),                -- @{8 cyfr, w tym 2 po przecinku|8 digits, 2 after the point|8 цифр, 2 после запятой}
    Waluta     MONEY,
    Aktywny    BIT,                         -- @{0 / 1 / NULL|0 / 1 / NULL|0 / 1 / NULL}
    Dodano     DATE,
    Zmieniono  DATETIME2
);`
  },

  'sql-types-ora': {
    lang: 'oracle', title: '@{Najczęstsze typy – Oracle|Common types – Oracle|Частые типы – Oracle}',
    code: `
CREATE TABLE Produkt (
    Id         INTEGER       PRIMARY KEY,  -- @{w środku to NUMBER(38)|internally NUMBER(38)|внутри это NUMBER(38)}
    Kod        CHAR(5),
    Nazwa      VARCHAR2(50),               -- @{„oraclowy” VARCHAR|Oracle's VARCHAR|«ораклевский» VARCHAR}
    Cena       NUMBER(8,2),                -- @{wszystkie liczby to NUMBER(p,s)|all numbers are NUMBER(p,s)|все числа — NUMBER(p,s)}
    Dodano     DATE,                       -- @{w Oracle DATE ma też godzinę|in Oracle DATE also stores time|в Oracle DATE хранит и время}
    Zmieniono  TIMESTAMP
);`
  },

  /* ================= Schemat EMP / DEPT / SALGRADE ================= */
  'eds-mssql': {
    lang: 'mssql', title: '@{Skrypt: tabele EMP, DEPT, SALGRADE (MS SQL)|Script: EMP, DEPT, SALGRADE tables (MS SQL)|Скрипт: таблицы EMP, DEPT, SALGRADE (MS SQL)}',
    code: `
CREATE TABLE DEPT (
    DEPTNO INT PRIMARY KEY,
    DNAME  VARCHAR(14),
    LOC    VARCHAR(13)
);
INSERT INTO DEPT VALUES (10, 'ACCOUNTING', 'NEW YORK'), (20, 'RESEARCH', 'DALLAS'),
                        (30, 'SALES', 'CHICAGO'),       (40, 'OPERATIONS', 'BOSTON');

CREATE TABLE EMP (
    EMPNO    INT NOT NULL PRIMARY KEY,
    ENAME    VARCHAR(10),
    JOB      VARCHAR(9),
    MGR      INT,                        -- @{szef (związek rekurencyjny)|boss (recursive relationship)|начальник (рекурсивная связь)}
    HIREDATE DATE,
    SAL      INT,                        -- @{płaca miesięczna|monthly salary|месячная зарплата}
    COMM     INT,                        -- @{prowizja (często NULL)|commission (often NULL)|комиссия (часто NULL)}
    DEPTNO   INT REFERENCES DEPT
);
INSERT INTO EMP VALUES
 (7369,'SMITH','CLERK',7902,'1980-12-17',800,NULL,20),   (7499,'ALLEN','SALESMAN',7698,'1981-02-20',1600,300,30),
 (7521,'WARD','SALESMAN',7698,'1981-02-22',1250,500,30),  (7566,'JONES','MANAGER',7839,'1981-04-02',2975,NULL,20),
 (7654,'MARTIN','SALESMAN',7698,'1981-09-28',1250,1400,30),(7698,'BLAKE','MANAGER',7839,'1981-05-01',2850,NULL,30),
 (7782,'CLARK','MANAGER',7839,'1981-06-09',2450,NULL,10), (7788,'SCOTT','ANALYST',7566,'1982-12-09',3000,NULL,20),
 (7839,'KING','PRESIDENT',NULL,'1981-11-17',5000,NULL,10),(7844,'TURNER','SALESMAN',7698,'1981-09-08',1500,0,30),
 (7876,'ADAMS','CLERK',7788,'1983-01-12',1100,NULL,20),   (7900,'JAMES','CLERK',7698,'1981-12-03',950,NULL,30),
 (7902,'FORD','ANALYST',7566,'1981-12-03',3000,NULL,20),  (7934,'MILLER','CLERK',7782,'1982-01-23',1300,NULL,10);

CREATE TABLE SALGRADE (GRADE INT PRIMARY KEY, LOSAL INT, HISAL INT);
INSERT INTO SALGRADE VALUES (1,700,1200),(2,1201,1400),(3,1401,2000),(4,2001,3000),(5,3001,9999);

-- @{W wersji z wykładu SMITH nie ma działu – żeby to sprawdzić:|In the lecture version SMITH has no department – to try it:|В версии из лекции у SMITH нет отдела — чтобы попробовать:}
-- UPDATE EMP SET DEPTNO = NULL WHERE EMPNO = 7369;`
  },

  'eds-oracle': {
    lang: 'oracle', title: '@{Skrypt: tabele EMP, DEPT, SALGRADE (Oracle)|Script: EMP, DEPT, SALGRADE tables (Oracle)|Скрипт: таблицы EMP, DEPT, SALGRADE (Oracle)}',
    code: `
CREATE TABLE DEPT (DEPTNO NUMBER(2) PRIMARY KEY, DNAME VARCHAR2(14), LOC VARCHAR2(13));
INSERT INTO DEPT VALUES (10, 'ACCOUNTING', 'NEW YORK');
INSERT INTO DEPT VALUES (20, 'RESEARCH',   'DALLAS');
INSERT INTO DEPT VALUES (30, 'SALES',      'CHICAGO');
INSERT INTO DEPT VALUES (40, 'OPERATIONS', 'BOSTON');

CREATE TABLE EMP (
    EMPNO    NUMBER(4) PRIMARY KEY,
    ENAME    VARCHAR2(10),
    JOB      VARCHAR2(9),
    MGR      NUMBER(4),
    HIREDATE DATE,
    SAL      NUMBER(7,2),
    COMM     NUMBER(7,2),
    DEPTNO   NUMBER(2) REFERENCES DEPT
);
INSERT INTO EMP VALUES (7369,'SMITH','CLERK',7902,DATE '1980-12-17',800,NULL,20);
INSERT INTO EMP VALUES (7499,'ALLEN','SALESMAN',7698,DATE '1981-02-20',1600,300,30);
INSERT INTO EMP VALUES (7521,'WARD','SALESMAN',7698,DATE '1981-02-22',1250,500,30);
INSERT INTO EMP VALUES (7566,'JONES','MANAGER',7839,DATE '1981-04-02',2975,NULL,20);
INSERT INTO EMP VALUES (7654,'MARTIN','SALESMAN',7698,DATE '1981-09-28',1250,1400,30);
INSERT INTO EMP VALUES (7698,'BLAKE','MANAGER',7839,DATE '1981-05-01',2850,NULL,30);
INSERT INTO EMP VALUES (7782,'CLARK','MANAGER',7839,DATE '1981-06-09',2450,NULL,10);
INSERT INTO EMP VALUES (7788,'SCOTT','ANALYST',7566,DATE '1982-12-09',3000,NULL,20);
INSERT INTO EMP VALUES (7839,'KING','PRESIDENT',NULL,DATE '1981-11-17',5000,NULL,10);
INSERT INTO EMP VALUES (7844,'TURNER','SALESMAN',7698,DATE '1981-09-08',1500,0,30);
INSERT INTO EMP VALUES (7876,'ADAMS','CLERK',7788,DATE '1983-01-12',1100,NULL,20);
INSERT INTO EMP VALUES (7900,'JAMES','CLERK',7698,DATE '1981-12-03',950,NULL,30);
INSERT INTO EMP VALUES (7902,'FORD','ANALYST',7566,DATE '1981-12-03',3000,NULL,20);
INSERT INTO EMP VALUES (7934,'MILLER','CLERK',7782,DATE '1982-01-23',1300,NULL,10);

CREATE TABLE SALGRADE (GRADE NUMBER PRIMARY KEY, LOSAL NUMBER, HISAL NUMBER);
INSERT INTO SALGRADE VALUES (1, 700, 1200);
INSERT INTO SALGRADE VALUES (2, 1201, 1400);
INSERT INTO SALGRADE VALUES (3, 1401, 2000);
INSERT INTO SALGRADE VALUES (4, 2001, 3000);
INSERT INTO SALGRADE VALUES (5, 3001, 9999);
COMMIT;`
  },

  /* ================= SELECT z jednej tabeli ================= */
  'sel-basic': {
    lang: 'sql', title: 'SELECT … FROM',
    code: `
-- @{wybrane kolumny|chosen columns|выбранные столбцы}
SELECT ename, sal, job
FROM   Emp;

-- @{wszystkie kolumny|all columns|все столбцы}
SELECT * FROM Emp;

-- @{tylko MS SQL: pierwsze 2 wiersze / 10% wierszy|MS SQL only: first 2 rows / 10% of rows|только MS SQL: первые 2 строки / 10% строк}
SELECT TOP 2 * FROM Emp;
SELECT TOP 10 PERCENT * FROM Emp;`
  },

  'sel-concat': {
    lang: 'sql', title: '@{Łączenie tekstu (konkatenacja)|Joining text (concatenation)|Склейка текста (конкатенация)}',
    code: `
-- Oracle: || (@{liczba zamienia się na tekst automatycznie|the number is converted to text automatically|число превращается в текст автоматически})
SELECT 'Pracownik ' || ename || ' zarabia ' || sal
FROM   Emp;

-- MS SQL: @{operator + i jawna konwersja CAST|operator + with explicit CAST|оператор + и явное CAST}
SELECT 'Pracownik ' + ename + ' zarabia ' + CAST(sal AS VARCHAR)
FROM   Emp;

-- @{oba serwery: CONCAT sam konwertuje typy (Oracle: tylko 2 argumenty!)|both servers: CONCAT converts types itself (Oracle: only 2 arguments!)|оба сервера: CONCAT сам приводит типы (Oracle: только 2 аргумента!)}
SELECT CONCAT(ename, job) FROM Emp;`
  },

  'sel-noFrom': {
    lang: 'sql', title: '@{SELECT bez tabeli|SELECT without a table|SELECT без таблицы}',
    code: `
-- MS SQL: @{klauzulę FROM można pominąć|FROM can be omitted|FROM можно опустить}
SELECT 1, 'Ala ma kota', GETDATE();

-- Oracle: @{FROM jest obowiązkowe → tabela pomocnicza DUAL|FROM is required → helper table DUAL|FROM обязателен → вспомогательная таблица DUAL}
SELECT 1, 'Ala ma kota', SYSDATE FROM dual;

-- @{Uwaga: literał zwróci się tyle razy, ile wierszy ma tabela!|Note: a literal is returned as many times as the table has rows!|Внимание: литерал вернётся столько раз, сколько строк в таблице!}
SELECT 'X' FROM Emp;   -- 14 @{wierszy|rows|строк}`
  },

  'sel-alias': {
    lang: 'sql', title: '@{Aliasy kolumn|Column aliases|Псевдонимы столбцов}',
    code: `
SELECT ename AS "Nazwisko pracownika",  -- @{ze spacją → cudzysłów podwójny|with a space → double quotes|с пробелом → двойные кавычки}
       job   Stanowisko,                -- @{AS można pominąć|AS can be omitted|AS можно опустить}
       12 * sal AS Roczna,
       deptno
FROM   Emp;`
  },

  'sel-null': {
    lang: 'sql', title: '@{NULL w obliczeniach i funkcje NVL / ISNULL|NULL in calculations and NVL / ISNULL|NULL в вычислениях и функции NVL / ISNULL}',
    code: `
-- @{Źle: gdy comm = NULL, cały wynik = NULL|Wrong: when comm = NULL the whole result = NULL|Плохо: если comm = NULL, весь результат = NULL}
SELECT ename, 12 * sal + comm AS "Roczny dochod?"
FROM   Emp;

-- @{Dobrze – Oracle|Correct – Oracle|Правильно – Oracle}
SELECT ename, 12 * sal + NVL(comm, 0) AS "Roczny dochod!"
FROM   Emp;

-- @{Dobrze – MS SQL|Correct – MS SQL|Правильно – MS SQL}
SELECT ename, 12 * sal + ISNULL(comm, 0) AS "Roczny dochod!"
FROM   Emp;

-- @{Oba serwery (standard): COALESCE zwraca pierwszy nie-NULL|Both servers (standard): COALESCE returns the first non-NULL|Оба сервера (стандарт): COALESCE возвращает первый не-NULL}
SELECT ename, 12 * sal + COALESCE(comm, 0) FROM Emp;`
  },

  'sel-distinct': {
    lang: 'sql', title: 'DISTINCT',
    code: `
SELECT job FROM Emp;            -- 14 @{wierszy, stanowiska się powtarzają|rows, jobs repeat|строк, должности повторяются}
SELECT DISTINCT job FROM Emp;   -- 5 @{różnych stanowisk|different jobs|разных должностей}`
  },

  'sel-order': {
    lang: 'sql', title: 'ORDER BY',
    code: `
SELECT   ename AS Nazwisko,
         job   AS Stanowisko,
         12 * sal + NVL(comm, 0) AS "Roczny dochod"   -- @{w MS SQL: ISNULL|in MS SQL: ISNULL|в MS SQL: ISNULL}
FROM     Emp
ORDER BY 2, "Roczny dochod" DESC;
-- @{2 = druga kolumna z listy SELECT (rosnąco),|2 = second column of the SELECT list (ascending),|2 = второй столбец списка SELECT (по возрастанию),}
-- @{potem alias – malejąco.|then the alias – descending.|затем псевдоним – по убыванию.}`
  },

  /* ================= WHERE i złączenia ================= */
  'wh-basic': {
    lang: 'sql', title: 'WHERE',
    code: `
SELECT ename, job, sal
FROM   Emp
WHERE  deptno = 10;

SELECT empno, ename, job, sal
FROM   Emp
WHERE  sal >= 1100 AND job = 'CLERK';

-- @{wiersze z comm = NULL odpadną (porównanie z NULL daje NULL)|rows with comm = NULL are dropped (comparison with NULL gives NULL)|строки с comm = NULL отпадут (сравнение с NULL даёт NULL)}
SELECT ename, sal, comm
FROM   Emp
WHERE  sal > comm;`
  },

  'wh-ops': {
    lang: 'sql', title: '@{Operatory: IN, BETWEEN, LIKE, IS NULL|Operators: IN, BETWEEN, LIKE, IS NULL|Операторы: IN, BETWEEN, LIKE, IS NULL}',
    code: `
SELECT * FROM Emp WHERE deptno IN (10, 30);            -- @{jedna z wartości listy|one of the list values|одно из значений списка}
SELECT * FROM Emp WHERE sal BETWEEN 1000 AND 2000;     -- @{przedział domknięty: 1000 i 2000 też|closed range: 1000 and 2000 included|закрытый интервал: 1000 и 2000 тоже}
SELECT * FROM Emp WHERE ename LIKE 'M%';               -- @{% = dowolny ciąg znaków|% = any string|% = любая строка}
SELECT * FROM Emp WHERE ename LIKE '_A%';              -- @{_ = dokładnie jeden znak|_ = exactly one character|_ = ровно один символ}
SELECT * FROM Emp WHERE comm IS NULL;                  -- @{NIGDY: comm = NULL|NEVER: comm = NULL|НИКОГДА: comm = NULL}
SELECT * FROM Emp WHERE comm IS NOT NULL;`
  },

  'wh-precedence': {
    lang: 'sql', title: '@{Kolejność NOT → AND → OR|Order NOT → AND → OR|Порядок NOT → AND → OR}',
    code: `
-- @{ŹLE: AND wiąże mocniej, więc dostaniemy WSZYSTKICH CLERK|WRONG: AND binds stronger, so we get ALL clerks|НЕВЕРНО: AND связывает сильнее, поэтому получим ВСЕХ CLERK}
SELECT empno, ename, job, sal
FROM   Emp
WHERE  job = 'CLERK' OR job = 'SALESMAN' AND sal > 1100;

-- @{DOBRZE: nawiasy zmieniają kolejność|CORRECT: parentheses change the order|ВЕРНО: скобки меняют порядок}
SELECT empno, ename, job, sal
FROM   Emp
WHERE  (job = 'CLERK' OR job = 'SALESMAN') AND sal > 1100;`
  },

  'wh-tuple': {
    lang: 'sql', title: '@{Porównanie list wartości|Comparing value lists|Сравнение списков значений}',
    code: `
-- Oracle: @{porównanie par (wektorów)|comparing pairs (vectors)|сравнение пар (векторов)}
SELECT ename, job, deptno
FROM   Emp
WHERE  (job, deptno) IN (('MANAGER', 10), ('CLERK', 20));

-- MS SQL: @{tego nie ma – piszemy to samo przez AND / OR|not supported – write the same with AND / OR|не поддерживается — пишем то же через AND / OR}
SELECT ename, job, deptno
FROM   Emp
WHERE  (job = 'MANAGER' AND deptno = 10)
   OR  (job = 'CLERK'   AND deptno = 20);`
  },

  'j-cartesian': {
    lang: 'sql', title: '@{Iloczyn kartezjański – czego NIE chcemy|Cartesian product – what we do NOT want|Декартово произведение — чего мы НЕ хотим}',
    code: `
SELECT ename, dname, loc
FROM   Emp, Dept;          -- 14 × 4 = 56 @{wierszy: każdy z każdym|rows: everyone with everyone|строк: каждый с каждым}`
  },

  'j-where': {
    lang: 'sql', title: '@{Złączenie w WHERE (stary zapis)|Join in WHERE (old style)|Соединение в WHERE (старая запись)}',
    code: `
SELECT ename, dname, loc, Dept.deptno
FROM   Emp, Dept
WHERE  Emp.deptno = Dept.deptno;   -- @{warunek złączenia: FK = PK|join condition: FK = PK|условие соединения: FK = PK}`
  },

  'j-inner': {
    lang: 'sql', title: 'INNER JOIN',
    code: `
SELECT ename, dname, loc, d.deptno
FROM   Emp e
       INNER JOIN Dept d ON e.deptno = d.deptno
WHERE  e.deptno <> 30;       -- @{warunki filtrujące osobno, w WHERE|filter conditions separately, in WHERE|условия фильтрации отдельно, в WHERE}

-- @{trzy tabele: kolejne JOIN … ON …|three tables: another JOIN … ON …|три таблицы: ещё один JOIN … ON …}
-- FROM T1 JOIN T2 ON T1.k = T2.k JOIN T3 ON T2.k2 = T3.k2`
  },

  'j-outer': {
    lang: 'sql', title: 'LEFT / RIGHT / FULL JOIN',
    code: `
-- @{wszyscy pracownicy, także bez działu|all employees, also without a department|все сотрудники, даже без отдела}
SELECT ename, dname, loc
FROM   Emp LEFT JOIN Dept ON Emp.deptno = Dept.deptno;

-- @{wszystkie działy, także puste (OPERATIONS)|all departments, also empty ones (OPERATIONS)|все отделы, даже пустые (OPERATIONS)}
SELECT ename, dname, loc
FROM   Emp RIGHT JOIN Dept ON Emp.deptno = Dept.deptno;

-- @{jedno i drugie naraz|both at once|и то, и другое сразу}
SELECT ename, dname, loc
FROM   Emp FULL JOIN Dept ON Emp.deptno = Dept.deptno;

-- @{Oracle – stary zapis (+) = to samo co RIGHT JOIN powyżej|Oracle – old (+) notation = same as RIGHT JOIN above|Oracle — старая запись (+) = то же, что RIGHT JOIN выше}
SELECT ename, dname, loc
FROM   Emp, Dept
WHERE  Emp.deptno (+) = Dept.deptno;`
  },

  'j-other': {
    lang: 'sql', title: '@{CROSS JOIN, złączenie nierównościowe, samozłączenie|CROSS JOIN, non-equi join, self join|CROSS JOIN, неравенственное соединение, самосоединение}',
    code: `
-- @{CROSS JOIN = iloczyn kartezjański zapisany jawnie|CROSS JOIN = Cartesian product written explicitly|CROSS JOIN = явно записанное декартово произведение}
SELECT ename, dname FROM Emp CROSS JOIN Dept;

-- @{Emp i Salgrade nie mają kluczy – łączymy warunkiem BETWEEN|Emp and Salgrade have no keys – join with BETWEEN|у Emp и Salgrade нет ключей — соединяем через BETWEEN}
SELECT ename, sal, grade
FROM   Emp JOIN Salgrade ON sal BETWEEN losal AND hisal;

-- @{Samozłączenie: ta sama tabela dwa razy, różne aliasy|Self join: same table twice, different aliases|Самосоединение: одна таблица дважды, разные псевдонимы}
SELECT k.ename AS Szef, p.ename AS Podwladny
FROM   Emp k JOIN Emp p ON k.empno = p.mgr;`
  },

  'set-ops': {
    lang: 'sql', title: 'UNION / INTERSECT / EXCEPT (MINUS)',
    code: `
-- @{suma bez powtórzeń (UNION ALL – z powtórzeniami)|union without duplicates (UNION ALL – with duplicates)|объединение без повторов (UNION ALL — с повторами)}
SELECT job FROM Emp WHERE deptno = 10
UNION
SELECT job FROM Emp WHERE deptno = 30;

-- @{część wspólna|intersection|пересечение}
SELECT job FROM Emp WHERE deptno = 10
INTERSECT
SELECT job FROM Emp WHERE deptno = 30;

-- @{różnica: MS SQL = EXCEPT, Oracle = MINUS|difference: MS SQL = EXCEPT, Oracle = MINUS|разность: MS SQL = EXCEPT, Oracle = MINUS}
SELECT job FROM Emp WHERE deptno = 10
EXCEPT
SELECT job FROM Emp WHERE deptno = 30;`
  },

  /* ================= Grupowanie ================= */
  'g-agg': {
    lang: 'sql', title: '@{Funkcje agregujące na całej tabeli|Aggregate functions on the whole table|Агрегатные функции по всей таблице}',
    code: `
SELECT COUNT(1)  AS "Liczba pracownikow",
       SUM(sal)  AS "Budzet plac",
       MIN(sal)  AS "Placa minimalna",
       MAX(sal)  AS "Placa maksymalna",
       AVG(sal)  AS "Placa srednia"
FROM   Emp;             -- @{wynik: dokładnie 1 wiersz|result: exactly 1 row|результат: ровно 1 строка}`
  },

  'g-count': {
    lang: 'sql', title: '@{Różne argumenty COUNT|Different COUNT arguments|Разные аргументы COUNT}',
    code: `
SELECT COUNT(*),               -- 14: @{wszystkie wiersze|all rows|все строки}
       COUNT(1),               -- 14: @{to samo|the same|то же самое}
       COUNT(comm),            --  4: @{tylko wartości różne od NULL|only non-NULL values|только значения не NULL}
       COUNT(DISTINCT job),    --  5: @{różne stanowiska|distinct jobs|разные должности}
       COUNT(DISTINCT mgr)     --  6: @{różni szefowie (NULL nie liczy się)|distinct bosses (NULL not counted)|разные начальники (NULL не считается)}
FROM   Emp;`
  },

  'g-group': {
    lang: 'sql', title: 'GROUP BY',
    code: `
-- @{jeden wiersz na każdy dział|one row per department|одна строка на каждый отдел}
SELECT   deptno,
         SUM(12 * sal + ISNULL(comm, 0)) AS Roczna,   -- Oracle: NVL
         MIN(sal) AS Minimalna,
         MAX(sal) AS Maksymalna,
         AVG(sal) AS Srednia
FROM     Emp
GROUP BY deptno;

-- @{grupy według PAR (dział, stanowisko)|groups by PAIRS (department, job)|группы по ПАРАМ (отдел, должность)}
SELECT   deptno, job, AVG(sal) AS Srednia
FROM     Emp
GROUP BY deptno, job
ORDER BY 1, 2;`
  },

  'g-having': {
    lang: 'sql', title: 'HAVING',
    code: `
-- @{średnie płace na stanowiskach, gdzie pracują min. 2 osoby|average pay per job where at least 2 people work|средняя зарплата по должностям, где работают минимум 2 человека}
SELECT   job, AVG(sal) AS Srednia
FROM     Emp
GROUP BY job
HAVING   COUNT(1) > 1;     -- PRESIDENT @{odpada (tylko KING)|is dropped (only KING)|отпадает (только KING)}`
  },

  'g-error': {
    lang: 'sql', title: '@{Najczęstszy błąd w GROUP BY|The most common GROUP BY error|Самая частая ошибка с GROUP BY}',
    code: `
-- @{BŁĄD: dname nie ma w GROUP BY i nie jest w funkcji agregującej|ERROR: dname is not in GROUP BY and not in an aggregate|ОШИБКА: dname нет в GROUP BY и он не в агрегатной функции}
SELECT   d.deptno, d.dname, MIN(sal)
FROM     Emp e JOIN Dept d ON e.deptno = d.deptno
GROUP BY d.deptno;
-- MS SQL: Msg 8120 ... is invalid in the select list ...
-- Oracle: ORA-00979: not a GROUP BY expression

-- @{Poprawka: dopisz kolumnę do GROUP BY|Fix: add the column to GROUP BY|Исправление: добавь столбец в GROUP BY}
SELECT   d.deptno, d.dname, MIN(sal)
FROM     Emp e JOIN Dept d ON e.deptno = d.deptno
GROUP BY d.deptno, d.dname;`
  },

  'g-where-having': {
    lang: 'sql', title: '@{WHERE czy HAVING?|WHERE or HAVING?|WHERE или HAVING?}',
    code: `
-- @{DOBRZE: pomijamy MANAGER-ów zanim powstaną grupy|CORRECT: skip MANAGERs before groups are built|ВЕРНО: исключаем MANAGER до построения групп}
SELECT   deptno, AVG(sal) AS "srednia placa"
FROM     Emp
WHERE    job <> 'MANAGER'          -- @{filtr WIERSZY|filters ROWS|фильтр СТРОК}
GROUP BY deptno
HAVING   AVG(sal) > 1000;          -- @{filtr GRUP (tu wolno agregaty)|filters GROUPS (aggregates allowed here)|фильтр ГРУПП (здесь можно агрегаты)}

-- @{Działa, ale nieoptymalnie: dział 10 jest liczony, a potem wyrzucany|Works, but not optimal: dept 10 is computed and then dropped|Работает, но неоптимально: отдел 10 считается, а потом выбрасывается}
SELECT deptno, SUM(sal) FROM Emp GROUP BY deptno HAVING deptno <> 10;
-- @{Lepiej:|Better:|Лучше:}
SELECT deptno, SUM(sal) FROM Emp WHERE deptno <> 10 GROUP BY deptno;`
  },

  /* ================= Podzapytania ================= */
  'sq-simple': {
    lang: 'sql', title: '@{Podzapytanie zwracające jedną wartość|Subquery returning a single value|Подзапрос, возвращающий одно значение}',
    code: `
-- @{kto zarabia najwięcej?|who earns the most?|кто зарабатывает больше всех?}
SELECT ename
FROM   Emp
WHERE  sal = (SELECT MAX(sal) FROM Emp);

-- @{dwa podzapytania w jednym WHERE|two subqueries in one WHERE|два подзапроса в одном WHERE}
SELECT ename, job
FROM   Emp
WHERE  job = (SELECT job FROM Emp WHERE empno = 7876)
  AND  sal > (SELECT sal FROM Emp WHERE empno = 7369);

-- @{zagnieżdżanie: więcej niż średnia w dziale z NEW YORK|nesting: more than the average in the NEW YORK department|вложенность: больше средней в отделе из NEW YORK}
SELECT ename, sal
FROM   Emp
WHERE  sal > (SELECT AVG(sal)
              FROM   Emp
              WHERE  deptno = (SELECT deptno FROM Dept WHERE loc = 'NEW YORK'));`
  },

  'sq-in': {
    lang: 'sql', title: '@{IN i pułapka NOT IN z NULL|IN and the NOT IN + NULL trap|IN и ловушка NOT IN с NULL}',
    code: `
-- @{działy, w których pracują urzędnicy|departments where clerks work|отделы, где работают клерки}
SELECT dname, loc
FROM   Dept
WHERE  deptno IN (SELECT deptno FROM Emp WHERE job = 'CLERK');

-- @{kierownicy = ci, którzy są czyimś szefem|managers = those who are someone's boss|руководители = те, кто является чьим-то начальником}
SELECT ename FROM Emp WHERE empno IN (SELECT mgr FROM Emp);

-- @{PUŁAPKA: pusty wynik! Lista zawiera NULL (KING nie ma szefa)|TRAP: empty result! The list contains NULL (KING has no boss)|ЛОВУШКА: пустой результат! В списке есть NULL (у KING нет начальника)}
SELECT ename FROM Emp WHERE empno NOT IN (SELECT mgr FROM Emp);

-- @{Poprawnie: wyrzuć NULL z podzapytania|Correct: remove NULL from the subquery|Правильно: убери NULL из подзапроса}
SELECT ename FROM Emp
WHERE  empno NOT IN (SELECT mgr FROM Emp WHERE mgr IS NOT NULL);`
  },

  'sq-all-any': {
    lang: 'sql', title: 'ALL / SOME (ANY)',
    code: `
-- @{>= ALL = większe lub równe KAŻDEJ wartości (czyli maksimum)|>= ALL = greater or equal to EVERY value (i.e. the maximum)|>= ALL = больше или равно КАЖДОМУ значению (т.е. максимум)}
SELECT ename, sal FROM Emp
WHERE  sal >= ALL (SELECT sal FROM Emp WHERE deptno = 30);

-- @{>= SOME/ANY = większe lub równe KTÓREJKOLWIEK (czyli minimum)|>= SOME/ANY = greater or equal to ANY one (i.e. the minimum)|>= SOME/ANY = больше или равно ХОТЯ БЫ ОДНОМУ (т.е. минимум)}
SELECT ename, sal FROM Emp
WHERE  sal >= SOME (SELECT sal FROM Emp WHERE deptno = 30);

-- @{dział z najwyższą średnią – działa w obu serwerach|department with the highest average – works on both servers|отдел с самой высокой средней — работает на обоих серверах}
SELECT   deptno, AVG(sal)
FROM     Emp
GROUP BY deptno
HAVING   AVG(sal) >= ALL (SELECT AVG(sal) FROM Emp GROUP BY deptno);

-- @{tylko Oracle: zagnieżdżone agregaty MAX(AVG(...))|Oracle only: nested aggregates MAX(AVG(...))|только Oracle: вложенные агрегаты MAX(AVG(...))}
SELECT   deptno, AVG(sal) FROM Emp GROUP BY deptno
HAVING   AVG(sal) = (SELECT MAX(AVG(sal)) FROM Emp GROUP BY deptno);`
  },

  'sq-from-cte': {
    lang: 'sql', title: '@{Podzapytanie w FROM i CTE (WITH)|Subquery in FROM and CTE (WITH)|Подзапрос в FROM и CTE (WITH)}',
    code: `
-- @{zarabiający powyżej średniej swojego działu – podzapytanie w FROM|earning above their department average – subquery in FROM|зарабатывающие выше средней своего отдела — подзапрос в FROM}
SELECT e.ename, e.sal, x.avsal, x.deptno
FROM   Emp e
       JOIN (SELECT deptno, AVG(sal) AS avsal
             FROM   Emp
             GROUP BY deptno) x ON e.deptno = x.deptno
WHERE  e.sal > x.avsal;

-- @{to samo przez CTE: najpierw nazwany zbiór, potem zapytanie|the same with a CTE: first a named set, then the query|то же через CTE: сначала именованный набор, потом запрос}
WITH x (deptno, avsal) AS (
    SELECT deptno, AVG(sal) FROM Emp GROUP BY deptno
)
SELECT e.ename, e.sal, ROUND(x.avsal, 2) AS avsal
FROM   Emp e JOIN x ON e.deptno = x.deptno
WHERE  e.sal > x.avsal;`
  },

  'sq-corr': {
    lang: 'sql', title: '@{Podzapytanie skorelowane i EXISTS|Correlated subquery and EXISTS|Коррелированный подзапрос и EXISTS}',
    code: `
-- @{najlepiej zarabiający w KAŻDYM dziale|top earner in EACH department|самый высокооплачиваемый в КАЖДОМ отделе}
SELECT a.deptno, a.ename, a.sal
FROM   Emp a
WHERE  a.sal = (SELECT MAX(b.sal)
                FROM   Emp b
                WHERE  b.deptno = a.deptno);   -- @{← korelacja z zapytaniem zewnętrznym|← correlation with the outer query|← связь с внешним запросом}

-- @{działy bez pracowników|departments without employees|отделы без сотрудников}
SELECT dname
FROM   Dept d
WHERE  NOT EXISTS (SELECT 1 FROM Emp e WHERE e.deptno = d.deptno);

-- @{pracownicy, którzy NIE są niczyimi szefami – bez problemu z NULL|employees who are NOT anybody's boss – no NULL problem|сотрудники, которые НЕ являются чьими-то начальниками — без проблемы с NULL}
SELECT k.empno, k.ename, k.job
FROM   Emp k
WHERE  NOT EXISTS (SELECT 1 FROM Emp p WHERE p.mgr = k.empno);`
  },

  /* ================= DML ================= */
  'dml-insert': {
    lang: 'sql', title: 'INSERT',
    code: `
-- @{pełna składnia: lista kolumn + lista wartości (zalecane)|full syntax: column list + value list (recommended)|полный синтаксис: список столбцов + список значений (рекомендуется)}
INSERT INTO Emp (empno, ename, job, sal, deptno, comm, hiredate)
VALUES (1001, 'PINK', 'SALESMAN', 2500, 20, NULL, GETDATE());   -- Oracle: SYSDATE

-- @{skrócona: wartości dla WSZYSTKICH kolumn w kolejności z CREATE TABLE|short: values for ALL columns in CREATE TABLE order|краткий: значения для ВСЕХ столбцов в порядке CREATE TABLE}
INSERT INTO Dept VALUES (50, 'IT', 'WARSAW');`
  },

  'dml-insert-many': {
    lang: 'sql', title: '@{Kilka wierszy naraz|Several rows at once|Несколько строк сразу}',
    code: `
-- MS SQL
INSERT INTO Dept (deptno, dname, loc)
VALUES (60, 'HR', 'KRAKOW'),
       (70, 'LOGISTICS', 'GDANSK');

-- Oracle: INSERT ALL … SELECT * FROM dual
INSERT ALL
  INTO Dept (deptno, dname, loc) VALUES (60, 'HR', 'KRAKOW')
  INTO Dept (deptno, dname, loc) VALUES (70, 'LOGISTICS', 'GDANSK')
SELECT * FROM dual;`
  },

  'dml-insert-select': {
    lang: 'sql', title: '@{INSERT z SELECT i nowy klucz = MAX + 1|INSERT from SELECT and new key = MAX + 1|INSERT из SELECT и новый ключ = MAX + 1}',
    code: `
-- @{SELECT zamiast VALUES – może czytać z innych tabel|SELECT instead of VALUES – can read other tables|SELECT вместо VALUES — может читать другие таблицы}
INSERT INTO Emp (empno, ename, job, sal, deptno)
SELECT 1006, 'BROWN', 'MANAGER', 3100, deptno
FROM   Dept
WHERE  loc = 'DALLAS';

-- @{kolejny numer: MAX + 1 (NVL/ISNULL – gdy tabela pusta)|next number: MAX + 1 (NVL/ISNULL – when the table is empty)|следующий номер: MAX + 1 (NVL/ISNULL — если таблица пуста)}
INSERT INTO Emp (empno, ename, job, sal)
SELECT ISNULL(MAX(empno), 0) + 1, 'WHITE', 'CLERK', 1900    -- Oracle: NVL
FROM   Emp;`
  },

  'dml-ctas': {
    lang: 'sql', title: '@{Nowa tabela z wyniku SELECT|New table from a SELECT result|Новая таблица из результата SELECT}',
    code: `
-- MS SQL: SELECT … INTO
SELECT   d.dname AS Dzial, SUM(e.sal) AS Budzet
INTO     BudzetyDzialow
FROM     Emp e JOIN Dept d ON e.deptno = d.deptno
GROUP BY d.dname;

-- Oracle: CREATE TABLE … AS SELECT
CREATE TABLE BudzetyDzialow AS
SELECT   d.dname AS Dzial, SUM(e.sal) AS Budzet
FROM     Emp e JOIN Dept d ON e.deptno = d.deptno
GROUP BY d.dname;`
  },

  'dml-update': {
    lang: 'sql', title: 'UPDATE',
    code: `
-- @{podwyżka 10% dla sprzedawców|10% raise for salesmen|повышение на 10% для продавцов}
UPDATE Emp SET sal = sal * 1.1 WHERE job = 'SALESMAN';

-- @{podzapytanie w WHERE: pracownicy z Dallas|subquery in WHERE: employees in Dallas|подзапрос в WHERE: сотрудники из Далласа}
UPDATE Emp SET sal = sal * 1.1
WHERE  deptno = (SELECT deptno FROM Dept WHERE loc = 'DALLAS');

-- @{skorelowany UPDATE (oba serwery)|correlated UPDATE (both servers)|коррелированный UPDATE (оба сервера)}
UPDATE BudzetyDzialow
SET    Budzet = (SELECT SUM(e.sal)
                 FROM   Emp e JOIN Dept d ON e.deptno = d.deptno
                 WHERE  d.dname = BudzetyDzialow.Dzial);

-- @{BEZ WHERE zmieniasz WSZYSTKIE wiersze!|WITHOUT WHERE you change ALL rows!|БЕЗ WHERE изменятся ВСЕ строки!}`
  },

  'dml-delete': {
    lang: 'sql', title: '@{DELETE i klucz obcy|DELETE and the foreign key|DELETE и внешний ключ}',
    code: `
DELETE FROM Emp WHERE job IS NULL;

-- @{Usunięcie działu z Dallas: najpierw „odpinamy” pracowników,|Deleting the Dallas department: first "detach" the employees,|Удаление отдела из Далласа: сначала «отвязываем» сотрудников,}
-- @{inaczej więzy referencyjne zablokują DELETE.|otherwise referential integrity blocks the DELETE.|иначе ссылочная целостность заблокирует DELETE.}
UPDATE Emp SET deptno = NULL
WHERE  deptno = (SELECT deptno FROM Dept WHERE loc = 'DALLAS');

DELETE FROM Dept WHERE loc = 'DALLAS';`
  },

  'dml-truncate': {
    lang: 'sql', title: '@{DELETE vs TRUNCATE i ROLLBACK|DELETE vs TRUNCATE and ROLLBACK|DELETE vs TRUNCATE и ROLLBACK}',
    code: `
-- MS SQL (@{wyłączamy autocommit|autocommit off|выключаем автокоммит})
SET IMPLICIT_TRANSACTIONS ON;
CREATE TABLE Alfa (a1 INT IDENTITY, a2 VARCHAR(10));
INSERT INTO Alfa (a2) VALUES ('Ala'), ('Ola'), ('Ula');
COMMIT;
DELETE FROM Alfa;   ROLLBACK;   SELECT * FROM Alfa;  -- @{dane wróciły|data is back|данные вернулись}
TRUNCATE TABLE Alfa; ROLLBACK;  SELECT * FROM Alfa;  -- @{w MS SQL też wróciły (DDL jest transakcyjne)|in MS SQL also back (DDL is transactional)|в MS SQL тоже вернулись (DDL транзакционный)}

-- Oracle
-- DELETE FROM Alfa;  ROLLBACK;   → @{dane wracają|data comes back|данные возвращаются}
-- TRUNCATE TABLE Alfa; ROLLBACK; → @{dane NIE wracają (DDL = automatyczny COMMIT)|data does NOT come back (DDL = automatic COMMIT)|данные НЕ возвращаются (DDL = автоматический COMMIT)}`
  },

  /* ================= DDL ================= */
  'ddl-inline': {
    lang: 'sql', title: '@{Więzy „w linii” i „poza linią”|Inline and out-of-line constraints|Ограничения «в строке» и «вне строки»}',
    code: `
-- @{w linii: przy kolumnie|inline: next to the column|в строке: рядом со столбцом}
CREATE TABLE Osoba (
    IdOsoba   INT          PRIMARY KEY,
    Imie      VARCHAR(20)  NOT NULL,
    Nazwisko  VARCHAR(30)
);

-- @{poza linią, z własnymi nazwami (CONSTRAINT)|out of line, with own names (CONSTRAINT)|вне строки, с собственными именами (CONSTRAINT)}
CREATE TABLE Osoba2 (
    IdOsoba   INT,
    Imie      VARCHAR(20),
    Nazwisko  VARCHAR(50),
    CONSTRAINT PK_Osoba2 PRIMARY KEY (IdOsoba),
    CONSTRAINT UQ_Osoba2 UNIQUE (Nazwisko)
);`
  },

  'ddl-identity': {
    lang: 'mssql', title: 'IDENTITY',
    code: `
CREATE TABLE Osoba (
    IdOsoba  INT IDENTITY PRIMARY KEY,   -- @{= IDENTITY(1,1): start 1, krok 1|= IDENTITY(1,1): start 1, step 1|= IDENTITY(1,1): начало 1, шаг 1}
    Imie     VARCHAR(10)
);

INSERT INTO Osoba (Imie) VALUES ('Ala'), ('Ela'), ('Ula');   -- @{IdOsoba pomijamy!|skip IdOsoba!|IdOsoba не указываем!}
SELECT * FROM Osoba;

CREATE TABLE Dzial (
    IdDzial     INT IDENTITY(10, 10) PRIMARY KEY,   -- 10, 20, 30, …
    Nazwa       VARCHAR(10),
    Lokalizacja VARCHAR(30)
);

-- @{ostatnio wygenerowana wartość – w moim zasięgu (zalecane)|last generated value – in my scope (recommended)|последнее сгенерированное значение — в моей области (рекомендуется)}
INSERT INTO Osoba (Imie) VALUES ('Pelagia');
SELECT SCOPE_IDENTITY();     -- @{@@IDENTITY = ostatnia w całej sesji (mniej dokładna)|@@IDENTITY = last in the whole session (less precise)|@@IDENTITY = последнее во всей сессии (менее точно)}

-- @{tylko wyjątkowo (admin): ręczne wartości|only in special cases (admin): manual values|только в исключительных случаях (админ): ручные значения}
SET IDENTITY_INSERT Osoba ON;
INSERT INTO Osoba (IdOsoba, Imie) VALUES (100, 'Jola');
SET IDENTITY_INSERT Osoba OFF;`
  },

  'ddl-sequence': {
    lang: 'sql', title: '@{Sekwencje|Sequences|Последовательности}',
    code: `
-- MS SQL (@{od 2012|since 2012|с 2012})
CREATE SEQUENCE Test AS INT START WITH 50 INCREMENT BY 10;
INSERT INTO Dzial2 (IdDzial, Nazwa) VALUES (NEXT VALUE FOR Test, 'LOGISTIC');
ALTER SEQUENCE Test RESTART WITH 500;
-- @{sekwencja jako DEFAULT kolumny|sequence as a column DEFAULT|последовательность как DEFAULT столбца}
CREATE TABLE Kontener (
    IdKontener  INT IDENTITY PRIMARY KEY,
    NrKontenera INT DEFAULT (NEXT VALUE FOR Test),
    Pojemnosc   DECIMAL(4,2)
);

-- Oracle
CREATE SEQUENCE seq_dzial START WITH 50 INCREMENT BY 10;
INSERT INTO Dzial2 (IdDzial, Nazwa) VALUES (seq_dzial.NEXTVAL, 'LOGISTIC');
SELECT seq_dzial.CURRVAL FROM dual;         -- @{ostatnia wartość w tej sesji|last value in this session|последнее значение в этой сессии}
DROP SEQUENCE seq_dzial;`
  },

  'ddl-alter': {
    lang: 'sql', title: 'ALTER TABLE',
    code: `
-- MS SQL
ALTER TABLE Osoba ADD Email VARCHAR(50);
ALTER TABLE Osoba ALTER COLUMN Email VARCHAR(80);
ALTER TABLE Osoba DROP COLUMN Email;

-- Oracle (@{nawiasy przy kilku kolumnach|parentheses for several columns|скобки при нескольких столбцах})
ALTER TABLE Osoba ADD (Email VARCHAR2(50));
ALTER TABLE Osoba MODIFY (Email VARCHAR2(80));
ALTER TABLE Osoba DROP COLUMN Email;

-- @{oba: CHECK dodany później, z nazwą, i jego usunięcie|both: CHECK added later, named, and dropped|оба: CHECK, добавленный позже, с именем, и его удаление}
ALTER TABLE Emp ADD CONSTRAINT Emp_Sal_Comm CHECK (sal + comm <= 10000);
ALTER TABLE Emp DROP CONSTRAINT Emp_Sal_Comm;

-- NOT NULL
ALTER TABLE Emp ALTER COLUMN ename VARCHAR(20) NOT NULL;   -- MS SQL
ALTER TABLE Emp MODIFY (ename NOT NULL);                    -- Oracle

-- DEFAULT
ALTER TABLE Kontener ADD CONSTRAINT Def_Poj DEFAULT 25 FOR Pojemnosc;  -- MS SQL
ALTER TABLE Kontener MODIFY (Pojemnosc DEFAULT 25);                   -- Oracle`
  },

  'ddl-fk': {
    lang: 'sql', title: '@{Klucze obce przez ALTER (związek cykliczny)|Foreign keys via ALTER (cyclic relationship)|Внешние ключи через ALTER (циклическая связь)}',
    code: `
-- @{Miasto → Panstwo (miasto leży w państwie) i Panstwo → Miasto (stolica).|City → Country (city lies in a country) and Country → City (capital).|Город → Государство (где находится) и Государство → Город (столица).}
-- @{Najpierw obie tabele bez FK, potem ALTER TABLE:|First both tables without FKs, then ALTER TABLE:|Сначала обе таблицы без FK, потом ALTER TABLE:}
ALTER TABLE Miasto  ADD CONSTRAINT FK_Miasto_Panstwo
      FOREIGN KEY (IdPanstwo) REFERENCES Panstwo;
ALTER TABLE Panstwo ADD CONSTRAINT FK_Panstwo_Stolica
      FOREIGN KEY (IdStolica) REFERENCES Miasto;

-- @{akcja referencyjna przy usuwaniu działu|referential action when deleting a department|ссылочное действие при удалении отдела}
ALTER TABLE Emp ADD CONSTRAINT FK_Emp_Dept
      FOREIGN KEY (deptno) REFERENCES Dept ON DELETE SET NULL;`
  },

  'ddl-disable': {
    lang: 'sql', title: '@{Wyłączanie więzów (tylko admin!)|Disabling constraints (admin only!)|Отключение ограничений (только админ!)}',
    code: `
-- Oracle
ALTER TABLE Emp DISABLE CONSTRAINT FK_Emp_Dept;
ALTER TABLE Emp ENABLE  CONSTRAINT FK_Emp_Dept;

-- MS SQL (@{tylko FOREIGN KEY i CHECK|only FOREIGN KEY and CHECK|только FOREIGN KEY и CHECK})
ALTER TABLE Emp NOCHECK CONSTRAINT FK_Emp_Dept;
ALTER TABLE Emp CHECK   CONSTRAINT FK_Emp_Dept;
ALTER TABLE Emp NOCHECK CONSTRAINT ALL;`
  },

  'ddl-scenario': {
    lang: 'mssql', title: '@{Scenariusz: zmiana schematu z przepisaniem danych|Scenario: schema change with data migration|Сценарий: изменение схемы с переносом данных}',
    code: `
CREATE TABLE Producent (IdProducent INT PRIMARY KEY, Producent VARCHAR(30));
CREATE TABLE Towar (IdTowar INT PRIMARY KEY, Towar VARCHAR(30), Cena MONEY, IdProducent INT);
ALTER TABLE Towar ADD CONSTRAINT FK_Towar_Producent FOREIGN KEY (IdProducent) REFERENCES Producent;

INSERT INTO Producent VALUES (1, 'Sony'), (2, 'Samsung'), (3, 'LG');
INSERT INTO Towar (IdTowar, Towar, IdProducent, Cena)
VALUES (1, 'Telewizor', 1, 1500), (2, 'Telewizor', 2, 1300), (3, 'Pralka', 3, 2000), (4, 'Lodowka', 2, 2100);

-- @{Nowy pomysł: ten sam towar u wielu producentów, każdy z własną ceną (M:N)|New idea: the same product from many producers, each with its own price (M:N)|Новая идея: один товар у многих производителей, у каждого своя цена (M:N)}
CREATE TABLE CenaProducenta (
    IdTowar     INT FOREIGN KEY REFERENCES Towar,
    IdProducent INT FOREIGN KEY REFERENCES Producent,
    Cena        MONEY,
    CONSTRAINT PK_Cena PRIMARY KEY (IdTowar, IdProducent)
);
INSERT INTO CenaProducenta (IdProducent, IdTowar, Cena)
SELECT IdProducent, IdTowar, Cena FROM Towar;       -- @{przepisanie danych|copy data over|перенос данных}

-- @{usuwamy stare kolumny (najpierw więzy!)|drop old columns (constraints first!)|удаляем старые столбцы (сначала ограничения!)}
ALTER TABLE Towar DROP CONSTRAINT FK_Towar_Producent;
ALTER TABLE Towar DROP COLUMN IdProducent;
ALTER TABLE Towar DROP COLUMN Cena;

-- @{sprzątanie: najpierw tabela podrzędna|cleanup: child table first|очистка: сначала подчинённая таблица}
DROP TABLE CenaProducenta; DROP TABLE Towar; DROP TABLE Producent;`
  },

  /* ================= Widoki ================= */
  'v-create': {
    lang: 'sql', title: 'CREATE VIEW',
    code: `
CREATE VIEW Urzednicy (Numer, Nazwisko, Placa) AS
SELECT empno, ename, sal
FROM   Emp
WHERE  job = 'CLERK';

SELECT * FROM Urzednicy;     -- @{używamy jak tabeli|used like a table|используем как таблицу}
DROP VIEW Urzednicy;`
  },

  'v-order': {
    lang: 'mssql', title: '@{Widok z ORDER BY w MS SQL|View with ORDER BY in MS SQL|Представление с ORDER BY в MS SQL}',
    code: `
-- @{MS SQL wymaga TOP przy ORDER BY w widoku (sztuczka z wykładu: 99.99 PERCENT)|MS SQL requires TOP with ORDER BY in a view (lecture trick: 99.99 PERCENT)|MS SQL требует TOP при ORDER BY в представлении (приём из лекции: 99.99 PERCENT)}
ALTER VIEW Urzednicy (Numer, Nazwisko, Placa) AS
SELECT TOP 99.99 PERCENT empno, ename, sal
FROM   Emp
WHERE  job = 'CLERK'
ORDER  BY ename;`
  },

  'v-dml': {
    lang: 'sql', title: '@{DML przez widok i WITH CHECK OPTION|DML through a view and WITH CHECK OPTION|DML через представление и WITH CHECK OPTION}',
    code: `
CREATE VIEW Emp_Dept20 AS
SELECT ename AS Nazwisko, job AS Stanowisko, sal AS Placa, comm AS Prowizja
FROM   Emp
WHERE  deptno = 20;

-- @{zmienia tylko pracowników działu 20 – innych widok „nie widzi”|changes only department 20 – the view "does not see" others|меняет только сотрудников отдела 20 — других представление «не видит»}
UPDATE Emp_Dept20 SET Prowizja = Placa * 0.05 WHERE Placa < 2000;

CREATE VIEW Emp_No_Dept AS
SELECT empno AS Nr, ename AS Nazwisko, deptno AS Dzial, sal AS Placa
FROM   Emp
WHERE  deptno IS NULL
WITH CHECK OPTION;

UPDATE Emp_No_Dept SET Placa = Placa + 100;   -- @{OK|OK|OK}
UPDATE Emp_No_Dept SET Dzial = 40;            -- @{BŁĄD: wiersz „wyszedłby” z widoku|ERROR: the row would "leave" the view|ОШИБКА: строка «вышла бы» из представления}`
  },

  'v-mat': {
    lang: 'oracle', title: '@{Perspektywa zmaterializowana (Oracle)|Materialized view (Oracle)|Материализованное представление (Oracle)}',
    code: `
CREATE MATERIALIZED VIEW Budzet_plac_dzialow AS
SELECT   d.dname AS "Nazwa dzialu",
         d.deptno AS "Nr dzialu",
         SUM(12 * e.sal + NVL(e.comm, 0)) AS Budzet,
         SYSDATE AS "Data sporzadzenia"
FROM     Emp e JOIN Dept d ON e.deptno = d.deptno
GROUP BY d.dname, d.deptno;

SELECT * FROM Budzet_plac_dzialow;   -- @{dane są fizycznie zapisane (kopia!)|data is physically stored (a copy!)|данные физически сохранены (копия!)}
-- @{wersja modyfikowalna: CREATE MATERIALIZED VIEW … FOR UPDATE AS SELECT …|updatable version: CREATE MATERIALIZED VIEW … FOR UPDATE AS SELECT …|изменяемая версия: CREATE MATERIALIZED VIEW … FOR UPDATE AS SELECT …}`
  },

  /* ================= Funkcje wbudowane (Suplement) ================= */
  'fn-ms': {
    lang: 'mssql', title: '@{Funkcje MS SQL: daty, konwersje, liczby|MS SQL functions: dates, conversions, numbers|Функции MS SQL: даты, преобразования, числа}',
    code: `
SELECT GETDATE(), SYSDATETIME();                       -- @{teraz (różna precyzja)|now (different precision)|сейчас (разная точность)}
SELECT DATENAME(month, '2022-05-11'),                  -- May
       DATEPART(month, '2022-05-11');                  -- 5
SELECT DATEDIFF(month, '2010-04-10', '2022-04-10');    -- 144 @{miesiące|months|месяца}
SELECT DATEADD(dd, 7, '2022-05-10');                   -- @{+7 dni|+7 days|+7 дней}
SELECT DAY(GETDATE()), MONTH(GETDATE()), YEAR(GETDATE());

SELECT CAST(2 AS VARCHAR) + ' koty';
SELECT CONVERT(VARCHAR, GETDATE(), 107);               -- @{107 = format daty (np. May 11, 2022)|107 = date format (e.g. May 11, 2022)|107 = формат даты (напр. May 11, 2022)}

SELECT ROUND(125.367, 2),                               -- 125.370
       ROUND(125.367, 2, 1),                            -- 125.360 (@{obcięcie|truncation|отсечение})
       CEILING(125.367),                                -- 126
       FLOOR(125.367);                                  -- 125`
  },

  'fn-ora': {
    lang: 'oracle', title: '@{Funkcje Oracle: daty, konwersje|Oracle functions: dates, conversions|Функции Oracle: даты, преобразования}',
    code: `
ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';      -- @{format daty dla tej sesji|date format for this session|формат даты для этой сессии}
SELECT value FROM V$NLS_PARAMETERS WHERE parameter = 'NLS_DATE_FORMAT';

SELECT CURRENT_DATE, SYSDATE FROM dual;
SELECT CURRENT_TIMESTAMP, LOCALTIMESTAMP FROM dual;
SELECT EXTRACT(YEAR FROM SYSDATE), EXTRACT(MONTH FROM SYSDATE) FROM dual;
SELECT ADD_MONTHS(SYSDATE, -3) FROM dual;                               -- @{3 miesiące temu|3 months ago|3 месяца назад}
SELECT MONTHS_BETWEEN(DATE '2022-03-24', SYSDATE) FROM dual;             -- @{liczba rzeczywista!|a real number!|дробное число!}
SELECT MONTHS_BETWEEN(TO_DATE('24-02-2022', 'DD-MM-YYYY'), SYSDATE) FROM dual;

SELECT CAST(hiredate AS VARCHAR2(20)) FROM emp;       -- @{przy tekście podaj długość|give a length for text|для текста укажи длину}
SELECT 100 + CAST('123' AS NUMBER) FROM dual;
SELECT TO_CHAR(SYSDATE, 'DD.MM.YYYY HH24:MI') FROM dual;`
  }
});
