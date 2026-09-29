/* Kod do wykładów T-SQL (MS SQL Server). Komentarze: @{polski|english|русский}. */
SBD.addCode({

  /* ================= Podstawy ================= */
  'ts-print': {
    lang: 'mssql', title: '@{PRINT, SELECT i GO|PRINT, SELECT and GO|PRINT, SELECT и GO}',
    code: `
PRINT 'Ala ma ' + CAST(2 + 2 AS VARCHAR) + ' koty.';   -- @{zakładka Messages|Messages tab|вкладка Messages}
SELECT 'Ala ma ' + CAST(2 + 2 AS VARCHAR) + ' koty.';  -- @{zakładka Results (zestaw wyników)|Results tab (result set)|вкладка Results (набор результатов)}

SET NOCOUNT ON;    -- @{wyłącza komunikaty „(n rows affected)”|turns off "(n rows affected)" messages|отключает сообщения «(n rows affected)»}
GO                 -- @{koniec paczki (batch): zmienne „umierają” po GO|end of batch: variables "die" after GO|конец пакета: переменные «умирают» после GO}`
  },

  'ts-vars': {
    lang: 'mssql', title: '@{Zmienne|Variables|Переменные}',
    code: `
DECLARE @Ile INT;                                   -- @{nazwa zawsze od @|name always starts with @|имя всегда начинается с @}
DECLARE @Nazwisko VARCHAR(30), @Imie VARCHAR(20);   -- @{kilka naraz|several at once|несколько сразу}

DECLARE @Cena MONEY = 1500,                         -- @{z wartością początkową|with an initial value|с начальным значением}
        @Kupujacy VARCHAR(30) = 'PJATK',
        @Data DATE = GETDATE();

DECLARE @Liczba INT = (SELECT COUNT(1) FROM Emp);   -- @{wartość z zapytania|value from a query|значение из запроса}

DECLARE @Pusta INT;
PRINT ISNULL(CAST(@Pusta AS VARCHAR), 'NULL');      -- @{niezainicjowana zmienna = NULL|uninitialised variable = NULL|неинициализированная переменная = NULL}`
  },

  'ts-sysvars': {
    lang: 'mssql', title: '@{Zmienne systemowe @@|System variables @@|Системные переменные @@}',
    code: `
SELECT @@VERSION;          -- @{wersja serwera|server version|версия сервера}

UPDATE Emp SET sal = sal WHERE deptno = 20;
PRINT @@ROWCOUNT;          -- @{ile wierszy dotknęła ostatnia instrukcja|how many rows the last statement touched|сколько строк затронула последняя инструкция}
PRINT @@ERROR;             -- @{numer ostatniego błędu (0 = brak)|number of the last error (0 = none)|номер последней ошибки (0 = нет)}
-- @@IDENTITY     @{ostatnia wartość IDENTITY|last IDENTITY value|последнее значение IDENTITY}
-- @@FETCH_STATUS @{wynik ostatniego FETCH kursora (0 = OK)|result of the last cursor FETCH (0 = OK)|результат последнего FETCH курсора (0 = OK)}`
  },

  'ts-assign': {
    lang: 'mssql', title: '@{Przypisanie: SET i SELECT|Assignment: SET and SELECT|Присваивание: SET и SELECT}',
    code: `
DECLARE @Imie VARCHAR(20), @Nazwisko VARCHAR(50), @Data DATE;

SELECT @Imie = 'Jan', @Nazwisko = 'Kowalski';   -- @{SELECT: kilka zmiennych naraz|SELECT: several variables at once|SELECT: несколько переменных сразу}
SET @Data = GETDATE();                          -- @{SET: tylko jedna zmienna|SET: only one variable|SET: только одна переменная}

DECLARE @ename VARCHAR(10), @job VARCHAR(9), @hiredate DATE;
SELECT @ename = ename, @job = job, @hiredate = hiredate
FROM   Emp
WHERE  empno = 7788;                             -- @{zapytanie zwraca 1 wiersz – OK|query returns 1 row – OK|запрос возвращает 1 строку – OK}
SELECT @ename, @job, @hiredate;

DECLARE @Ilu INT;
SELECT @Ilu = COUNT(1) FROM Emp;
PRINT 'W tabeli EMP jest ' + CAST(@Ilu AS VARCHAR) + ' pracownikow';`
  },

  'ts-pitfall': {
    lang: 'mssql', title: '@{Pułapki przypisania przez SELECT|SELECT assignment pitfalls|Ловушки присваивания через SELECT}',
    code: `
DECLARE @ename VARCHAR(10);

-- @{1) Wiele wierszy: BEZ błędu, zmienna dostaje wartość z OSTATNIEGO wiersza|1) Many rows: NO error, the variable gets the value of the LAST row|1) Много строк: БЕЗ ошибки, переменная получает значение ПОСЛЕДНЕЙ строки}
SELECT @ename = ename FROM Emp;
PRINT @ename;

-- @{2) Zero wierszy: BEZ błędu, zmienna ZACHOWUJE starą wartość|2) Zero rows: NO error, the variable KEEPS its old value|2) Ноль строк: БЕЗ ошибки, переменная СОХРАНЯЕТ старое значение}
SELECT @ename = ename FROM Emp WHERE empno = 7788;   -- SCOTT
SELECT @ename = ename FROM Emp WHERE empno = 9999;   -- @{nie ma takiego pracownika|no such employee|такого сотрудника нет}
PRINT @ename;                                        -- @{nadal SCOTT!|still SCOTT!|всё ещё SCOTT!}`
  },

  'ts-if': {
    lang: 'mssql', title: 'IF … ELSE',
    code: `
DECLARE @Info VARCHAR(60), @Budzet MONEY;
SELECT @Budzet = SUM(sal) * 1.1 FROM Emp;

IF @Budzet < 35000
BEGIN                                          -- @{kilka instrukcji → BEGIN … END|several statements → BEGIN … END|несколько инструкций → BEGIN … END}
    UPDATE Emp SET sal = sal * 1.1;
    SET @Info = 'Dokonano podwyzki o 10%';
END
ELSE
    SET @Info = 'Nie dokonano podwyzki - brak budzetu';   -- @{jedna instrukcja – BEGIN/END opcjonalne|one statement – BEGIN/END optional|одна инструкция – BEGIN/END не обязателен}

PRINT @Info;

-- @{SELECT może być wprost w warunku IF|SELECT can be placed right in the IF condition|SELECT можно писать прямо в условии IF}
IF (SELECT SUM(sal) * 1.1 FROM Emp) < 35000
    PRINT 'Stac nas na podwyzke';`
  },

  'ts-elseif': {
    lang: 'mssql', title: '@{Kilka ścieżek: zagnieżdżone IF (nie ma ELSEIF)|Several paths: nested IF (no ELSEIF)|Несколько ветвей: вложенные IF (ELSEIF нет)}',
    code: `
DECLARE @Info VARCHAR(80), @Budzet MONEY;
SELECT @Budzet = SUM(sal) FROM Emp;

IF @Budzet * 1.1 < 30000
BEGIN
    UPDATE Emp SET sal = sal * 1.1;
    SET @Info = 'Wszystkim podniesiono place o 10%';
END
ELSE IF @Budzet BETWEEN 28000 AND 30000
BEGIN
    UPDATE Emp SET sal = sal * 1.1 WHERE sal < 1200;
    SET @Info = 'Podwyzka dla ' + CAST(@@ROWCOUNT AS VARCHAR) + ' najmniej zarabiajacych';
END
ELSE
    SET @Info = 'Bez podwyzek';

PRINT @Info;`
  },

  'ts-ifexists': {
    lang: 'mssql', title: 'IF [NOT] EXISTS',
    code: `
IF EXISTS (SELECT 1 FROM Emp WHERE deptno IS NULL)
    PRINT 'Jest pracownik bez dzialu';

IF NOT EXISTS (SELECT 1 FROM Dept WHERE dname = 'IT')
    INSERT INTO Dept VALUES (50, 'IT', 'WARSAW');

-- @{Liczy się, czy jest WIERSZ – wartość na liście SELECT nie ma znaczenia:|What matters is whether a ROW exists – the SELECT list value is irrelevant:|Важно, есть ли СТРОКА – значение в списке SELECT не важно:}
IF EXISTS (SELECT comm FROM Emp WHERE empno = 7788)   -- TRUE, @{choć comm = NULL|although comm = NULL|хотя comm = NULL}
    PRINT 'Pracownik 7788 istnieje';`
  },

  'ts-ifexists-bad': {
    lang: 'mssql', title: '@{Niepotrzebny podwójny odczyt – i lepsza wersja|Unnecessary double read – and a better version|Лишнее двойное чтение – и лучшая версия}',
    code: `
-- @{Źle: dwa razy czytamy ten sam wiersz|Bad: we read the same row twice|Плохо: дважды читаем одну строку}
DECLARE @empno INT;
IF EXISTS (SELECT 1 FROM Emp WHERE ename = 'PINK')
    SELECT @empno = empno FROM Emp WHERE ename = 'PINK';
ELSE
    INSERT INTO Emp (empno, ename) SELECT ISNULL(MAX(empno), 0) + 1, 'PINK' FROM Emp;

-- @{Lepiej: jeden odczyt, potem test na NULL|Better: one read, then a NULL test|Лучше: одно чтение, потом проверка на NULL}
DECLARE @empno2 INT;
SELECT @empno2 = empno FROM Emp WHERE ename = 'PINK';
IF @empno2 IS NULL
    INSERT INTO Emp (empno, ename) SELECT ISNULL(MAX(empno), 0) + 1, 'PINK' FROM Emp;`
  },

  'ts-while': {
    lang: 'mssql', title: '@{Pętla WHILE|WHILE loop|Цикл WHILE}',
    code: `
DECLARE @i INT = 1;
WHILE @i <= 5
BEGIN
    PRINT 'Krok ' + CAST(@i AS VARCHAR);
    SET @i = @i + 1;            -- @{bez tego pętla nigdy się nie skończy!|without this the loop never ends!|без этого цикл никогда не закончится!}
END;
-- @{BREAK – wyjście z pętli, CONTINUE – następny obrót|BREAK – leave the loop, CONTINUE – next iteration|BREAK – выход из цикла, CONTINUE – следующая итерация}`
  },

  /* ================= Kursory ================= */
  'ts-cur-basic': {
    lang: 'mssql', title: '@{Kursor – pełny schemat|Cursor – full pattern|Курсор – полная схема}',
    code: `
DECLARE Test CURSOR FOR                          -- @{1. deklaracja: jaki SELECT|1. declare: which SELECT|1. объявление: какой SELECT}
    SELECT ename, sal FROM Emp WHERE sal > 2000;

DECLARE @ename VARCHAR(20), @sal MONEY;

OPEN Test;                                       -- @{2. otwarcie: SELECT się wykonuje|2. open: the SELECT runs|2. открытие: SELECT выполняется}
FETCH NEXT FROM Test INTO @ename, @sal;          -- @{3. pierwszy odczyt (ustawia @@FETCH_STATUS)|3. first fetch (sets @@FETCH_STATUS)|3. первое чтение (ставит @@FETCH_STATUS)}

WHILE @@FETCH_STATUS = 0                         -- @{0 = wiersz pobrany|0 = row fetched|0 = строка получена}
BEGIN
    PRINT 'Pracownik ' + @ename + ' zarabia ' + CAST(@sal AS VARCHAR);
    FETCH NEXT FROM Test INTO @ename, @sal;      -- @{4. następny wiersz – NA KOŃCU pętli|4. next row – at the END of the loop|4. следующая строка – В КОНЦЕ цикла}
END;

CLOSE Test;                                      -- @{5. zwolnij blokady i bufor|5. release locks and buffer|5. освободить блокировки и буфер}
DEALLOCATE Test;                                 -- @{6. usuń definicję kursora|6. remove the cursor definition|6. удалить определение курсора}`
  },

  'ts-cur-update': {
    lang: 'mssql', title: '@{Kursor, który zmienia dane|A cursor that changes data|Курсор, изменяющий данные}',
    code: `
DECLARE Test1 CURSOR FOR
    SELECT ename, empno, sal FROM Emp
    WHERE  sal NOT BETWEEN 1000 AND 3000;        -- @{filtruj już w kursorze = szybciej|filter in the cursor itself = faster|фильтруй уже в курсоре = быстрее}

DECLARE @ename VARCHAR(15), @empno INT, @sal MONEY;

OPEN Test1;
FETCH NEXT FROM Test1 INTO @ename, @empno, @sal;
WHILE @@FETCH_STATUS = 0
BEGIN
    IF @sal > 3000
    BEGIN
        SET @sal = @sal - 100;
        UPDATE Emp SET sal = @sal WHERE empno = @empno;   -- @{WHERE obowiązkowe!|WHERE is mandatory!|WHERE обязателен!}
        PRINT @ename + ' po obnizce: ' + CAST(@sal AS VARCHAR);
    END;
    IF @sal < 1000
    BEGIN
        SET @sal = @sal + 100;
        UPDATE Emp SET sal = @sal WHERE empno = @empno;
        PRINT @ename + ' po podwyzce: ' + CAST(@sal AS VARCHAR);
    END;
    FETCH NEXT FROM Test1 INTO @ename, @empno, @sal;
END;
CLOSE Test1;
DEALLOCATE Test1;

-- @{Zamiast WHERE empno = @empno można: UPDATE Emp SET sal = @sal WHERE CURRENT OF Test1;|Instead of WHERE empno = @empno you can: UPDATE Emp SET sal = @sal WHERE CURRENT OF Test1;|Вместо WHERE empno = @empno можно: UPDATE Emp SET sal = @sal WHERE CURRENT OF Test1;}`
  },

  'ts-cur-setbased': {
    lang: 'mssql', title: '@{To samo bez kursora (szybciej)|The same without a cursor (faster)|То же без курсора (быстрее)}',
    code: `
UPDATE Emp SET sal = sal - 100 WHERE sal > 3000;
UPDATE Emp SET sal = sal + 100 WHERE sal < 1000;
-- @{Kursor ma sens, gdy po każdym wierszu trzeba zrobić coś osobno (np. PRINT, wywołać procedurę).|A cursor makes sense when each row needs separate work (e.g. PRINT, calling a procedure).|Курсор имеет смысл, когда для каждой строки нужно отдельное действие (напр. PRINT, вызов процедуры).}`
  },

  'ts-cur-scroll': {
    lang: 'mssql', title: 'SCROLL CURSOR',
    code: `
DECLARE Przewijany SCROLL CURSOR FOR
    SELECT ename FROM Emp ORDER BY ename;
DECLARE @ename VARCHAR(20);

OPEN Przewijany;
FETCH LAST        FROM Przewijany INTO @ename;   PRINT @ename;   -- @{ostatni|last|последний}
FETCH PRIOR       FROM Przewijany INTO @ename;   PRINT @ename;   -- @{poprzedni|previous|предыдущий}
FETCH FIRST       FROM Przewijany INTO @ename;   PRINT @ename;   -- @{pierwszy|first|первый}
FETCH ABSOLUTE 5  FROM Przewijany INTO @ename;   PRINT @ename;   -- @{5. wiersz|5th row|5-я строка}
FETCH RELATIVE -2 FROM Przewijany INTO @ename;   PRINT @ename;   -- @{2 wiersze wstecz|2 rows back|на 2 строки назад}
CLOSE Przewijany;
DEALLOCATE Przewijany;`
  },

  /* ================= Procedury i funkcje ================= */
  'ts-proc-basic': {
    lang: 'mssql', title: '@{Procedura z parametrami domyślnymi|Procedure with default parameters|Процедура с параметрами по умолчанию}',
    code: `
CREATE PROCEDURE Dept_Job
    @job    VARCHAR(20) = 'MANAGER',     -- @{parametr = zmienna bez DECLARE|parameter = variable without DECLARE|параметр = переменная без DECLARE}
    @deptno INT         = 10
AS
BEGIN
    SELECT ename, job, deptno
    FROM   Emp
    WHERE  job = @job AND deptno = @deptno;
END;
GO

EXEC Dept_Job;                   -- @{domyślne: MANAGER, 10 → CLARK|defaults: MANAGER, 10 → CLARK|по умолчанию: MANAGER, 10 → CLARK}
EXEC Dept_Job 'CLERK';           -- CLERK, 10 → MILLER
EXEC Dept_Job DEFAULT, 20;       -- @{pominięty pierwszy → DEFAULT|first skipped → DEFAULT|первый пропущен → DEFAULT}  → JONES
EXEC Dept_Job @deptno = 30;      -- @{parametr po nazwie|parameter by name|параметр по имени}`
  },

  'ts-proc-output': {
    lang: 'mssql', title: '@{Trzy sposoby zwracania wyniku|Three ways to return a result|Три способа вернуть результат}',
    code: `
-- @{1) Result set: wynik ostatniego SELECT|1) Result set: result of the last SELECT|1) Result set: результат последнего SELECT}
CREATE PROCEDURE Emp_Dane_Dzialu @deptno INT = 10
AS
    SELECT ename, job, sal FROM Emp WHERE deptno = @deptno;
GO

-- @{2) Parametr OUTPUT|2) OUTPUT parameter|2) Параметр OUTPUT}
CREATE PROCEDURE Zmien_Place
    @empno   INT,
    @procent INT = 20,
    @info    VARCHAR(80) OUTPUT
AS
BEGIN
    DECLARE @nowa MONEY;
    SELECT @nowa = sal + sal * @procent / 100 FROM Emp WHERE empno = @empno;
    UPDATE Emp SET sal = @nowa WHERE empno = @empno;
    SET @info = 'Pracownik ' + CAST(@empno AS VARCHAR) + ' zarabia teraz ' + CAST(@nowa AS VARCHAR);
END;
GO
DECLARE @wynik VARCHAR(80);
EXEC Zmien_Place 7369, DEFAULT, @wynik OUTPUT;   -- @{OUTPUT także przy wywołaniu!|OUTPUT also in the call!|OUTPUT и при вызове!}
PRINT @wynik;
GO

-- @{3) RETURN: tylko liczba całkowita, kończy procedurę|3) RETURN: integer only, ends the procedure|3) RETURN: только целое число, завершает процедуру}
CREATE PROCEDURE Ile_Pracownikow
AS
BEGIN
    DECLARE @ile INT;
    SELECT @ile = COUNT(1) FROM Emp;
    RETURN @ile;
END;
GO
DECLARE @n INT;
EXEC @n = Ile_Pracownikow;
PRINT @n;`
  },

  'ts-proc-template': {
    lang: 'mssql', title: '@{Szablon „porządnej” procedury|Template of a "proper" procedure|Шаблон «правильной» процедуры}',
    code: `
CREATE OR ALTER PROCEDURE Dodaj_Dzial      -- @{CREATE OR ALTER: od MS SQL 2016|CREATE OR ALTER: since MS SQL 2016|CREATE OR ALTER: с MS SQL 2016}
    @deptno INT,
    @dname  VARCHAR(14),
    @loc    VARCHAR(13)
AS
BEGIN
    SET NOCOUNT ON;                                  -- @{zawsze na początku|always at the start|всегда в начале}
    IF EXISTS (SELECT 1 FROM Dept WHERE dname = @dname OR loc = @loc)
    BEGIN
        PRINT 'Taki dzial juz istnieje - nic nie dodano';
        RETURN;                                      -- @{wyjście z procedury|leave the procedure|выход из процедуры}
    END;

    BEGIN TRY
        BEGIN TRANSACTION;
            INSERT INTO Dept (deptno, dname, loc) VALUES (@deptno, @dname, @loc);
        COMMIT;
        PRINT 'Dodano dzial ' + @dname;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        PRINT 'Blad: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO
EXEC Dodaj_Dzial 50, 'IT', 'WARSAW';
-- @{Uwaga: NIE wpisuj „EXEC Dodaj_Dzial” w treści procedury przed GO – wywoła samą siebie!|Careful: do NOT put "EXEC Dodaj_Dzial" inside the procedure body before GO – it will call itself!|Осторожно: НЕ пиши «EXEC Dodaj_Dzial» в теле процедуры до GO – она вызовет сама себя!}`
  },

  'ts-fn-scalar': {
    lang: 'mssql', title: '@{Funkcja skalarna|Scalar function|Скалярная функция}',
    code: `
CREATE FUNCTION srednia_w_dziale (@deptno INT)
RETURNS MONEY
AS
BEGIN
    DECLARE @srednia MONEY;
    SELECT @srednia = AVG(sal) FROM Emp WHERE deptno = @deptno;
    RETURN @srednia;
END;
GO

-- @{wywołanie ZAWSZE ze schematem (dbo.) i nawiasami|call ALWAYS with the schema (dbo.) and parentheses|вызов ВСЕГДА со схемой (dbo.) и скобками}
SELECT ename, sal, deptno, dbo.srednia_w_dziale(deptno) AS srednia
FROM   Emp
WHERE  sal > dbo.srednia_w_dziale(deptno)
ORDER  BY deptno, ename;`
  },

  'ts-fn-table': {
    lang: 'mssql', title: '@{Funkcje tabelaryczne|Table-valued functions|Табличные функции}',
    code: `
-- @{prosta: jeden SELECT = „widok z parametrem”|simple: one SELECT = "a view with a parameter"|простая: один SELECT = «представление с параметром»}
CREATE FUNCTION pracownicy_dzialu (@deptno INT)
RETURNS TABLE
AS
RETURN (SELECT empno, ename, job, sal FROM Emp WHERE deptno = @deptno);
GO
SELECT * FROM dbo.pracownicy_dzialu(30);

-- @{złożona: sami definiujemy strukturę wyniku|multi-statement: we define the result structure|многооператорная: сами задаём структуру результата}
CREATE FUNCTION podsumowanie_dzialow ()
RETURNS @wynik TABLE (deptno INT, liczba INT, suma MONEY)
AS
BEGIN
    INSERT INTO @wynik
    SELECT deptno, COUNT(1), SUM(sal) FROM Emp GROUP BY deptno;
    RETURN;
END;
GO
SELECT * FROM dbo.podsumowanie_dzialow();`
  },

  /* ================= Wyzwalacze i błędy ================= */
  'ts-trg-nodelete': {
    lang: 'mssql', title: '@{Wyzwalacz blokujący DELETE|Trigger blocking DELETE|Триггер, блокирующий DELETE}',
    code: `
CREATE TRIGGER TR_Emp_NoDelete
ON Emp
FOR DELETE                 -- @{FOR = AFTER: po wykonaniu DELETE, ale w tej samej transakcji|FOR = AFTER: after the DELETE, but in the same transaction|FOR = AFTER: после DELETE, но в той же транзакции}
AS
    ROLLBACK;              -- @{wycofuje DELETE|rolls back the DELETE|откатывает DELETE}
GO
DELETE FROM Emp;           -- @{nic nie zostanie usunięte|nothing will be deleted|ничего не удалится}
DROP TRIGGER TR_Emp_NoDelete;`
  },

  'ts-trg-rows': {
    lang: 'mssql', title: '@{Jeden czy wiele wierszy? (ważne!)|One or many rows? (important!)|Одна строка или много? (важно!)}',
    code: `
-- @{ŹLE: działa tylko, gdy INSERT/UPDATE dotyczy JEDNEGO wiersza|WRONG: works only if INSERT/UPDATE affects ONE row|ПЛОХО: работает, только если INSERT/UPDATE затрагивает ОДНУ строку}
CREATE TRIGGER TR2 ON Emp FOR INSERT, UPDATE
AS
BEGIN
    DECLARE @sal MONEY;
    SELECT @sal = sal FROM inserted;          -- @{przy wielu wierszach: wartość z ostatniego!|with many rows: value of the last one!|при многих строках: значение последней!}
    IF @sal < 100
    BEGIN
        ROLLBACK;
        RAISERROR ('Niedopuszczalna wartosc SAL!', 16, 1);
    END;
END;
GO

-- @{DOBRZE: sprawdzamy wszystkie wiersze naraz|CORRECT: check all rows at once|ПРАВИЛЬНО: проверяем все строки сразу}
CREATE OR ALTER TRIGGER TR2 ON Emp FOR INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE sal < 100)
    BEGIN
        ROLLBACK;                              -- @{wycofa CAŁĄ instrukcję|rolls back the WHOLE statement|откатит ВСЮ инструкцию}
        RAISERROR ('Niedopuszczalna wartosc SAL!', 16, 1);
    END;
END;`
  },

  'ts-trg-cursor': {
    lang: 'mssql', title: '@{Osobno dla każdego wiersza: kursor po inserted|Per row: a cursor over inserted|Для каждой строки: курсор по inserted}',
    code: `
CREATE TRIGGER TR_Emp_Ins ON Emp FOR INSERT
AS
IF EXISTS (SELECT 1 FROM inserted WHERE sal < 100)
BEGIN
    DECLARE TR_cursor CURSOR FOR
        SELECT empno FROM inserted WHERE sal < 100;
    DECLARE @empno INT;
    OPEN TR_cursor;
    FETCH NEXT FROM TR_cursor INTO @empno;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        DELETE FROM Emp WHERE empno = @empno;    -- @{usuwamy tylko złe wiersze|delete only the bad rows|удаляем только плохие строки}
        FETCH NEXT FROM TR_cursor INTO @empno;
    END;
    CLOSE TR_cursor;
    DEALLOCATE TR_cursor;
END;`
  },

  'ts-trg-join': {
    lang: 'mssql', title: '@{Wyzwalacz bez kursora: JOIN z inserted/deleted|Trigger without a cursor: JOIN with inserted/deleted|Триггер без курсора: JOIN с inserted/deleted}',
    code: `
-- @{Tabela z podsumowaniem utrzymywana przez wyzwalacz|A summary table maintained by a trigger|Таблица-сводка, поддерживаемая триггером}
CREATE TABLE Budzet (wartosc INT NOT NULL);
INSERT INTO Budzet (wartosc) SELECT SUM(sal) FROM Emp;
GO
CREATE TRIGGER TR_Budzet ON Emp
FOR INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Budzet
    SET wartosc = wartosc
                + ISNULL((SELECT SUM(sal) FROM inserted), 0)    -- @{nowe wartości|new values|новые значения}
                - ISNULL((SELECT SUM(sal) FROM deleted), 0);    -- @{stare wartości|old values|старые значения}
END;
-- @{UPDATE = deleted (przed) + inserted (po), więc jedna formuła obsługuje wszystkie 3 operacje|UPDATE = deleted (before) + inserted (after), so one formula handles all 3 operations|UPDATE = deleted (до) + inserted (после), поэтому одна формула обслуживает все 3 операции}`
  },

  'ts-trg-which': {
    lang: 'mssql', title: '@{Która operacja i które kolumny?|Which operation and which columns?|Какая операция и какие столбцы?}',
    code: `
CREATE TRIGGER TR_Emp_Log ON Emp
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
        PRINT 'UPDATE';
    ELSE IF EXISTS (SELECT 1 FROM inserted)
        PRINT 'INSERT';
    ELSE IF EXISTS (SELECT 1 FROM deleted)
        PRINT 'DELETE';

    IF UPDATE(sal)                               -- @{czy kolumna sal była w SET / INSERT?|was column sal in SET / INSERT?|была ли колонка sal в SET / INSERT?}
        PRINT 'Zmieniano place';
END;`
  },

  'ts-trg-instead': {
    lang: 'mssql', title: '@{INSTEAD OF na widoku|INSTEAD OF on a view|INSTEAD OF на представлении}',
    code: `
CREATE VIEW EmpDept_View AS
SELECT e.ename, e.sal, d.dname
FROM   Emp e INNER JOIN Dept d ON e.deptno = d.deptno;
GO

-- @{Widok ze złączeniem nie przyjmie INSERT – wyzwalacz zrobi to „zamiast”|A join view does not accept INSERT – the trigger does it "instead"|Представление с соединением не примет INSERT – триггер сделает это «вместо»}
CREATE TRIGGER IO_EmpDept ON EmpDept_View
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @deptno INT, @empno INT;
    SELECT @deptno = d.deptno FROM Dept d JOIN inserted i ON d.dname = i.dname;
    IF @deptno IS NULL                               -- @{nie ma działu → utwórz|no department → create it|нет отдела → создать}
    BEGIN
        SELECT @deptno = ISNULL(MAX(deptno), 0) + 10 FROM Dept;
        INSERT INTO Dept (deptno, dname) SELECT @deptno, dname FROM inserted;
    END;
    SELECT @empno = ISNULL(MAX(empno), 0) + 1 FROM Emp;
    INSERT INTO Emp (empno, ename, sal, deptno)
    SELECT @empno, ename, sal, @deptno FROM inserted;
END;
GO
INSERT INTO EmpDept_View (ename, sal, dname) VALUES ('KOWALSKI', 1200, 'MARKETING');`
  },

  'ts-err-server': {
    lang: 'mssql', title: '@{Błędy zgłaszane przez serwer|Errors raised by the server|Ошибки, выдаваемые сервером}',
    code: `
SELECT FROM Emp WHERE deptno = 10;
-- Msg 156, Level 15: Incorrect syntax near the keyword 'FROM'.

UPDATE Emo SET comm = 100 WHERE empno = 7788;
-- Msg 208, Level 16: Invalid object name 'Emo'.

UPDATE Emp SET comm = 'Ala' WHERE empno = 7788;
-- Msg 245, Level 16: Conversion failed when converting the varchar value 'Ala' to data type int.`
  },

  'ts-raiserror': {
    lang: 'mssql', title: 'RAISERROR (message, severity, state)',
    code: `
RAISERROR ('Ostrzezenie z informacjami', 9, 1);   -- @{severity < 10: ostrzeżenie + Msg 50000|severity < 10: warning + Msg 50000|severity < 10: предупреждение + Msg 50000}
RAISERROR ('Tylko komunikat', 10, 1);             -- @{= 10: sam tekst|= 10: text only|= 10: только текст}
RAISERROR ('Prawdziwy blad', 16, 1);              -- @{>= 11: błąd (czerwony); w TRY → skok do CATCH|>= 11: error (red); inside TRY → jump to CATCH|>= 11: ошибка (красная); в TRY → переход в CATCH}
PRINT 'Poza TRY kod leci dalej';                  -- @{RAISERROR poza TRY NIE przerywa wykonania!|RAISERROR outside TRY does NOT stop execution!|RAISERROR вне TRY НЕ прерывает выполнение!}
-- @{20–25: błąd krytyczny – zrywa połączenie (tylko sysadmin)|20–25: fatal – kills the connection (sysadmin only)|20–25: фатальная – рвёт соединение (только sysadmin)}`
  },

  'ts-try': {
    lang: 'mssql', title: 'TRY … CATCH',
    code: `
BEGIN TRY
    PRINT 'Przed bledem';
    RAISERROR ('Cos poszlo nie tak', 16, 1);
    PRINT 'Tego nie zobaczysz';                  -- @{po błędzie >= 11 sterowanie idzie do CATCH|after an error >= 11 control goes to CATCH|после ошибки >= 11 управление уходит в CATCH}
END TRY
BEGIN CATCH
    SELECT ERROR_NUMBER()    AS Nr,              -- 50000 @{dla błędów użytkownika|for user errors|для пользовательских ошибок}
           ERROR_MESSAGE()   AS Komunikat,
           ERROR_SEVERITY()  AS Poziom,
           ERROR_STATE()     AS Stan,
           ERROR_LINE()      AS Linia,
           ERROR_PROCEDURE() AS Procedura;
END CATCH;`
  },

  'ts-throw': {
    lang: 'mssql', title: 'THROW',
    code: `
BEGIN TRY
    THROW 50001, 'Za malo towaru w magazynie', 1;   -- @{numer >= 50000; zachowuje się jak severity 16|number >= 50000; behaves like severity 16|номер >= 50000; ведёт себя как severity 16}
END TRY
BEGIN CATCH
    PRINT 'Przechwycono: ' + ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    SELECT 1 / 0;                                   -- @{dzielenie przez zero|division by zero|деление на ноль}
END TRY
BEGIN CATCH
    THROW;                                          -- @{bez parametrów: „przerzuć” błąd dalej (tylko w CATCH)|without parameters: re-throw the error (CATCH only)|без параметров: «пробросить» ошибку дальше (только в CATCH)}
END CATCH;`
  },

  /* ================= Zaawansowane ================= */
  'ts-compound': {
    lang: 'mssql', title: '@{Skrócone operatory|Compound operators|Составные операторы}',
    code: `
DECLARE @Ile INT = 10;
SET @Ile += 5;   PRINT @Ile;   -- 15
SET @Ile -= 5;   PRINT @Ile;   -- 10
SET @Ile *= 5;   PRINT @Ile;   -- 50
SET @Ile /= 2;   PRINT @Ile;   -- 25
SET @Ile %= 7;   PRINT @Ile;   -- 4 (@{reszta z dzielenia|remainder|остаток от деления})`
  },

  'ts-rank': {
    lang: 'mssql', title: 'NTILE, ROW_NUMBER, RANK, DENSE_RANK',
    code: `
SELECT NTILE(5) OVER (ORDER BY sal) AS NrGrupy, job, ename, sal     -- @{5 równych grup|5 equal groups|5 равных групп}
FROM   Emp;

SELECT ROW_NUMBER() OVER (ORDER BY sal) AS Pozycja, ename, sal      -- @{1, 2, 3, … bez powtórzeń|1, 2, 3, … no repeats|1, 2, 3, … без повторов}
FROM   Emp;

SELECT ename, job, sal,
       ROW_NUMBER() OVER (PARTITION BY job ORDER BY sal) AS RowNr,   -- 1, 2, 3, 4
       RANK()       OVER (PARTITION BY job ORDER BY sal) AS Rnk,     -- 1, 1, 3, 4  (@{dziura po remisie|gap after a tie|пропуск после ничьей})
       DENSE_RANK() OVER (PARTITION BY job ORDER BY sal) AS DRnk     -- 1, 1, 2, 3  (@{bez dziur|no gaps|без пропусков})
FROM   Emp
ORDER  BY job, sal;`
  },

  'ts-window': {
    lang: 'mssql', title: '@{Agregaty z OVER (PARTITION BY)|Aggregates with OVER (PARTITION BY)|Агрегаты с OVER (PARTITION BY)}',
    code: `
-- @{suma/średnia stanowiska w KAŻDYM wierszu – bez GROUP BY i bez podzapytań|job sum/average in EVERY row – no GROUP BY, no subqueries|сумма/среднее по должности в КАЖДОЙ строке – без GROUP BY и подзапросов}
SELECT ename, job, sal,
       SUM(sal) OVER (PARTITION BY job) AS SumaStan,
       AVG(sal) OVER (PARTITION BY job) AS SredniaStan,
       MIN(sal) OVER (PARTITION BY job) AS MinStan,
       MAX(sal) OVER (PARTITION BY job) AS MaxStan
FROM   Emp;

-- STRING_AGG (@{od MS SQL 2017|since MS SQL 2017|с MS SQL 2017})
SELECT deptno, STRING_AGG(ename, ', ') WITHIN GROUP (ORDER BY ename) AS Pracownicy
FROM   Emp
GROUP  BY deptno;`
  },

  'ts-temp': {
    lang: 'mssql', title: '@{Tabele tymczasowe # i ##|Temporary tables # and ##|Временные таблицы # и ##}',
    code: `
CREATE TABLE #Wysocy (empno INT, ename VARCHAR(10), sal MONEY);   -- @{# = lokalna: tylko moja sesja|# = local: my session only|# = локальная: только моя сессия}
INSERT INTO #Wysocy SELECT empno, ename, sal FROM Emp WHERE sal > 2500;
SELECT * FROM #Wysocy;

SELECT deptno, SUM(sal) AS suma INTO #Sumy FROM Emp GROUP BY deptno;  -- @{utworzenie „w locie”|created "on the fly"|создание «на лету»}

-- ##Globalna @{= widoczna dla wszystkich sesji|= visible to all sessions|= видна всем сессиям}
DROP TABLE #Wysocy;   -- @{sprzątaj jawnie (dobra praktyka)|clean up explicitly (good practice)|убирай явно (хорошая практика)}
DROP TABLE #Sumy;
-- @{Mieszkają w bazie tempdb; nie mogą mieć kluczy obcych.|They live in tempdb; they cannot have foreign keys.|Живут в базе tempdb; не могут иметь внешних ключей.}`
  },

  'ts-tablevar': {
    lang: 'mssql', title: '@{Zmienna tabelaryczna|Table variable|Табличная переменная}',
    code: `
DECLARE @emp20 TABLE (
    Nr_prac     INT PRIMARY KEY,           -- @{PK, UNIQUE, NULL, CHECK – tak; FK – nie|PK, UNIQUE, NULL, CHECK – yes; FK – no|PK, UNIQUE, NULL, CHECK – да; FK – нет}
    Nazwisko    VARCHAR(20),
    Stanowisko  VARCHAR(10),
    Nazwa_dzialu VARCHAR(14)
);

INSERT INTO @emp20
SELECT e.empno, e.ename, e.job, d.dname
FROM   Emp e JOIN Dept d ON e.deptno = d.deptno
WHERE  e.deptno = 20;

SELECT * FROM @emp20;       -- @{żyje do końca bloku/procedury|lives until the end of the batch/procedure|живёт до конца пакета/процедуры}
-- @{SELECT … INTO @emp20 – NIE zadziała (struktura musi być znana z góry)|SELECT … INTO @emp20 – will NOT work (structure must be known in advance)|SELECT … INTO @emp20 – НЕ сработает (структура должна быть известна заранее)}`
  },

  'ts-upd-join': {
    lang: 'mssql', title: '@{UPDATE / DELETE ze złączeniem|UPDATE / DELETE with a join|UPDATE / DELETE с соединением}',
    code: `
-- @{podwyżka 123 dla pracowników z Dallas|a raise of 123 for employees in Dallas|надбавка 123 сотрудникам из Далласа}
UPDATE e SET sal += 123
FROM   Emp e JOIN Dept d ON e.deptno = d.deptno
WHERE  d.loc = 'DALLAS';

-- @{usunięcie pracowników z Dallas (zmienia się TYLKO tabela e)|delete employees in Dallas (ONLY table e changes)|удаление сотрудников из Далласа (меняется ТОЛЬКО таблица e)}
DELETE e
FROM   Emp e JOIN Dept d ON e.deptno = d.deptno
WHERE  d.loc = 'DALLAS';`
  },

  'ts-output': {
    lang: 'mssql', title: '@{OUTPUT – przechwycenie zmienianych wierszy|OUTPUT – capturing changed rows|OUTPUT – перехват изменяемых строк}',
    code: `
DECLARE @Out TABLE (empno INT, ename VARCHAR(20), job VARCHAR(20), sal MONEY, hiredate DATE);

INSERT INTO Emp (empno, ename, job, sal, hiredate)
OUTPUT inserted.empno, inserted.ename, inserted.job, inserted.sal, inserted.hiredate
INTO   @Out                                  -- @{tu NIE może być średnika!|NO semicolon here!|здесь НЕ должно быть точки с запятой!}
SELECT ISNULL(MAX(empno), 0) + 1, 'PINK', 'ANALYST', 1200, GETDATE()
FROM   Emp;

SELECT * FROM @Out;   -- @{np. nowy numer z IDENTITY / MAX+1|e.g. the new number from IDENTITY / MAX+1|напр. новый номер из IDENTITY / MAX+1}`
  },

  'ts-case': {
    lang: 'mssql', title: 'CASE (simple / searched)',
    code: `
SELECT ename,
       CASE job                          -- @{simple CASE: porównanie z wartościami|simple CASE: compare with values|простой CASE: сравнение со значениями}
           WHEN 'CLERK'     THEN 'Urzednik'
           WHEN 'ANALYST'   THEN 'Analityk'
           WHEN 'MANAGER'   THEN 'Menedzer'
           WHEN 'SALESMAN'  THEN 'Sprzedawca'
           WHEN 'PRESIDENT' THEN 'Prezes'
           ELSE 'Inne'
       END AS Stanowisko_PL,
       CASE                              -- @{searched CASE: dowolne warunki|searched CASE: any conditions|поисковый CASE: любые условия}
           WHEN sal < 1000 THEN 'niska'
           WHEN sal > 4500 THEN 'bardzo wysoka'
           ELSE 'srednia'
       END AS Placa_opis
FROM   Emp;`
  },

  'ts-corr-update': {
    lang: 'mssql', title: '@{Skorelowany UPDATE – dwie składnie|Correlated UPDATE – two syntaxes|Коррелированный UPDATE – два синтаксиса}',
    code: `
-- @{1) podzapytanie w SET (MS SQL i Oracle)|1) subquery in SET (MS SQL and Oracle)|1) подзапрос в SET (MS SQL и Oracle)}
UPDATE Emp SET sal = (SELECT AVG(e1.sal) FROM Emp e1 WHERE e1.job = Emp.job);

-- @{2) UPDATE … FROM (tylko MS SQL)|2) UPDATE … FROM (MS SQL only)|2) UPDATE … FROM (только MS SQL)}
UPDATE e SET e.deptno = d.deptno
FROM   Emp e JOIN Dept d ON e.deptno = d.deptno;

-- @{BŁĄD: w składni 2 nie wolno agregatu w SET|ERROR: no aggregate allowed in SET in syntax 2|ОШИБКА: в синтаксисе 2 нельзя агрегат в SET}
-- UPDATE e1 SET sal = AVG(e2.sal) FROM Emp e1 JOIN Emp e2 ON e2.job = e1.job;
-- → An aggregate may not appear in the set list of an UPDATE statement.`
  },

  'ts-cte-rec': {
    lang: 'mssql', title: '@{Rekurencyjne CTE|Recursive CTE|Рекурсивное CTE}',
    code: `
-- @{liczby 0–10|numbers 0–10|числа 0–10}
WITH Kolumna (X) AS (
    SELECT 0                                  -- @{kotwica (start)|anchor (start)|якорь (старт)}
    UNION ALL
    SELECT X + 1 FROM Kolumna WHERE X < 10    -- @{krok rekurencji + warunek stopu|recursive step + stop condition|шаг рекурсии + условие остановки}
)
SELECT X FROM Kolumna;

-- @{hierarchia: kto komu podlega i na jakim poziomie|hierarchy: who reports to whom and at what level|иерархия: кто кому подчиняется и на каком уровне}
WITH X (EmpId, EmpName, SzefId, Poziom) AS (
    SELECT empno, ename, mgr, 1 FROM Emp WHERE ename = 'KING'
    UNION ALL
    SELECT e.empno, e.ename, e.mgr, X.Poziom + 1
    FROM   Emp e INNER JOIN X ON X.EmpId = e.mgr AND X.Poziom < 4
)
SELECT * FROM X;`
  },

  'ts-merge': {
    lang: 'mssql', title: 'MERGE',
    code: `
CREATE TABLE BudzetyDzialow (Deptno INT NULL, Budzet INT NULL, DataAkt DATETIME);
GO
MERGE BudzetyDzialow AS Target                               -- @{tabela docelowa|target table|целевая таблица}
USING (SELECT deptno, SUM(sal) FROM Emp GROUP BY deptno)
      AS Source (Dzial, Budzet)                              -- @{źródło|source|источник}
ON    Target.Deptno = Source.Dzial                           -- @{jak dopasować wiersze|how to match rows|как сопоставлять строки}
WHEN MATCHED THEN                                            -- @{jest w obu → aktualizuj|in both → update|есть в обоих → обновить}
    UPDATE SET Budzet = Source.Budzet, DataAkt = GETDATE()
WHEN NOT MATCHED BY TARGET THEN                              -- @{tylko w źródle → wstaw|only in source → insert|только в источнике → вставить}
    INSERT (Deptno, Budzet, DataAkt) VALUES (Source.Dzial, Source.Budzet, GETDATE())
WHEN NOT MATCHED BY SOURCE THEN                              -- @{tylko w docelowej → usuń|only in target → delete|только в целевой → удалить}
    DELETE
OUTPUT deleted.Deptno, $action, inserted.*;                  -- @{log operacji; MERGE MUSI kończyć się średnikiem|log of actions; MERGE MUST end with a semicolon|журнал операций; MERGE ОБЯЗАН заканчиваться ;}`
  },

  'ts-dynamic': {
    lang: 'mssql', title: '@{Dynamiczny SQL: EXEC i sp_executesql|Dynamic SQL: EXEC and sp_executesql|Динамический SQL: EXEC и sp_executesql}',
    code: `
-- @{1) sklejanie tekstu + EXEC (uwaga na SQL Injection!)|1) concatenating text + EXEC (beware of SQL Injection!)|1) склейка текста + EXEC (осторожно, SQL Injection!)}
DECLARE @sql VARCHAR(1000),
        @kolumny VARCHAR(75) = 'empno, ename, sal',
        @job VARCHAR(20) = '''MANAGER''',                       -- @{apostrofy w apostrofach|quotes inside quotes|кавычки внутри кавычек}
        @deptno INT = 20;
SET @sql = 'SELECT ' + @kolumny + ' FROM Emp WHERE job = ' + @job
         + ' AND deptno = ' + CAST(@deptno AS VARCHAR);
EXEC (@sql);

-- @{2) sp_executesql z parametrami – wydajniej i bezpieczniej|2) sp_executesql with parameters – faster and safer|2) sp_executesql с параметрами – быстрее и безопаснее}
DECLARE @cmd NVARCHAR(1000) = N'SELECT ' + @kolumny + N' FROM Emp WHERE job = @Jb AND deptno = @Dno';
EXEC sp_executesql @cmd,
     N'@Jb NVARCHAR(20), @Dno INT',                              -- @{definicje parametrów|parameter definitions|определения параметров}
     @Jb = N'MANAGER', @Dno = 20;                                -- @{wartości|values|значения}`
  }
});
