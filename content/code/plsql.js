/* Kod do wykładów PL/SQL (Oracle). Komentarze: @{polski|english|русский}. */
SBD.addCode({

  /* ================= Podstawy ================= */
  'pl-output': {
    lang: 'oracle', title: '@{Wypisywanie komunikatów|Printing messages|Вывод сообщений}',
    code: `
SET SERVEROUTPUT ON;          -- @{raz na sesję w SQL Developer / SQL*Plus|once per session in SQL Developer / SQL*Plus|один раз за сессию в SQL Developer / SQL*Plus}

BEGIN
    DBMS_OUTPUT.PUT_LINE('Witaj, PL/SQL!');
END;
/`
  },

  'pl-block': {
    lang: 'oracle', title: '@{Budowa bloku anonimowego|Structure of an anonymous block|Структура анонимного блока}',
    code: `
DECLARE                         -- @{(opcjonalnie) zmienne, stałe, kursory, wyjątki|(optional) variables, constants, cursors, exceptions|(необязательно) переменные, константы, курсоры, исключения}
    v_liczba INTEGER;
BEGIN                           -- @{(obowiązkowo) instrukcje SQL i PL/SQL|(required) SQL and PL/SQL statements|(обязательно) инструкции SQL и PL/SQL}
    SELECT COUNT(*) INTO v_liczba FROM emp;
    DBMS_OUTPUT.PUT_LINE('W tabeli jest ' || v_liczba || ' osob');
EXCEPTION                       -- @{(opcjonalnie) obsługa błędów|(optional) error handling|(необязательно) обработка ошибок}
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Blad: ' || SQLERRM);
END;                            -- @{każda instrukcja kończy się średnikiem – obowiązkowo|every statement ends with a semicolon – mandatory|каждая инструкция заканчивается ; – обязательно}
/`
  },

  'pl-vars': {
    lang: 'oracle', title: '@{Zmienne, stałe i przypisanie|Variables, constants and assignment|Переменные, константы и присваивание}',
    code: `
DECLARE
    v_nazwisko  VARCHAR2(30);                  -- @{bez @! jedna deklaracja = jedna linia ze średnikiem|no @! one declaration = one line with a semicolon|без @! одно объявление = одна строка с ;}
    v_placa     INTEGER := 1200;               -- @{wartość początkowa|initial value|начальное значение}
    v_data      DATE;
    v_info      VARCHAR2(100);
    c_max       CONSTANT INTEGER := 10;        -- @{stała: wartość obowiązkowa|constant: value required|константа: значение обязательно}
    v_licznik   INTEGER NOT NULL DEFAULT 0;    -- @{NOT NULL wymaga wartości początkowej|NOT NULL requires an initial value|NOT NULL требует начального значения}
BEGIN
    SELECT SYSDATE INTO v_data FROM dual;      -- @{przypisanie przez SELECT … INTO|assignment via SELECT … INTO|присваивание через SELECT … INTO}
    v_nazwisko := 'Kowalski';                  -- @{operator przypisania :=|assignment operator :=|оператор присваивания :=}
    v_info := 'Pracownik ' || v_nazwisko || ' zarabia ' || v_placa || ' od dnia ' || v_data;
    DBMS_OUTPUT.PUT_LINE(v_info);
END;
/`
  },

  'pl-null-var': {
    lang: 'oracle', title: '@{Niezainicjowana zmienna = NULL|Uninitialised variable = NULL|Неинициализированная переменная = NULL}',
    code: `
DECLARE
    v_ile INTEGER;                   -- NULL
BEGIN
    v_ile := v_ile + 1;              -- NULL + 1 = NULL
    DBMS_OUTPUT.PUT_LINE(v_ile);     -- @{wypisze pustą linię|prints an empty line|выведет пустую строку}
END;
/`
  },

  'pl-no-tsql': {
    lang: 'oracle', title: '@{Czego z T-SQL NIE wolno w PL/SQL|What from T-SQL is NOT allowed in PL/SQL|Чего из T-SQL НЕЛЬЗЯ в PL/SQL}',
    code: `
-- @{ŹLE (składnia T-SQL):|WRONG (T-SQL syntax):|НЕВЕРНО (синтаксис T-SQL):}
--   v_ile INTEGER := (SELECT COUNT(*) FROM emp);
--   IF EXISTS (SELECT 1 FROM dept WHERE deptno = 50) THEN …
--   IF v_x = (SELECT …) THEN …

-- @{DOBRZE: najpierw SELECT … INTO, potem IF na zmiennej|CORRECT: first SELECT … INTO, then IF on the variable|ПРАВИЛЬНО: сначала SELECT … INTO, затем IF по переменной}
DECLARE
    v_ile INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_ile FROM dept WHERE deptno = 50;   -- @{COUNT zawsze zwraca 1 wiersz – bez błędu|COUNT always returns 1 row – no error|COUNT всегда возвращает 1 строку – без ошибки}
    IF v_ile = 0 THEN
        INSERT INTO dept VALUES (50, 'IT', 'WARSAW');
        DBMS_OUTPUT.PUT_LINE('Dodano dzial 50');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Dzial 50 juz istnieje');
    END IF;
END;
/`
  },

  'pl-type': {
    lang: 'oracle', title: '%TYPE @{i|and|и} %ROWTYPE',
    code: `
DECLARE
    v_ile   INTEGER;
    v_max   v_ile%TYPE := 10;                 -- @{typ jak innej zmiennej|type of another variable|тип как у другой переменной}
    v_sal   CONSTANT emp.sal%TYPE := 1100;    -- @{typ jak kolumny emp.sal|type of column emp.sal|тип как у столбца emp.sal}
    v_test  emp%ROWTYPE;                      -- @{cały wiersz tabeli emp|a whole row of table emp|вся строка таблицы emp}
BEGIN
    SELECT * INTO v_test FROM emp WHERE empno = 7788;
    DBMS_OUTPUT.PUT_LINE(v_test.ename || ' zarabia ' || v_test.sal);   -- @{zmienna.kolumna|variable.column|переменная.столбец}
END;
/`
  },

  'pl-record': {
    lang: 'oracle', title: '@{Własny typ rekordowy (RECORD)|Own record type (RECORD)|Собственный тип записи (RECORD)}',
    code: `
DECLARE
    TYPE typ_dane IS RECORD (
        naz  VARCHAR2(20),
        plac NUMBER
    );
    dane typ_dane;
BEGIN
    SELECT ename, sal INTO dane FROM emp WHERE empno = 7788;
    DBMS_OUTPUT.PUT_LINE(dane.naz || ' zarabia ' || dane.plac);
END;
/`
  },

  'pl-scope': {
    lang: 'oracle', title: '@{Zasięg zmiennych w blokach zagnieżdżonych|Variable scope in nested blocks|Область видимости во вложенных блоках}',
    code: `
DECLARE
    v_tytul VARCHAR2(30);
BEGIN
    v_tytul := 'ORACLE jest latwy';
    DECLARE
        v_tytul  VARCHAR2(30);          -- @{ta sama nazwa = INNA zmienna|same name = DIFFERENT variable|то же имя = ДРУГАЯ переменная}
        v_tytul2 VARCHAR2(30);
    BEGIN
        v_tytul  := 'PL/SQL jest TRUDNY';
        v_tytul2 := 'widoczna tylko tu';
        DBMS_OUTPUT.PUT_LINE(v_tytul);  -- PL/SQL jest TRUDNY
    END;
    DBMS_OUTPUT.PUT_LINE(v_tytul);      -- ORACLE jest latwy
    -- DBMS_OUTPUT.PUT_LINE(v_tytul2);  -- @{błąd: poza zasięgiem|error: out of scope|ошибка: вне области видимости}
END;
/`
  },

  'pl-bind': {
    lang: 'oracle', title: '@{Zmienne podstawienia (&) i wiązania (:)|Substitution (&) and bind (:) variables|Переменные подстановки (&) и связывания (:)}',
    code: `
-- @{Tylko SQL Developer / SQL*Plus (DBeaver i DataGrip tego nie obsługują)|SQL Developer / SQL*Plus only (DBeaver and DataGrip do not support it)|Только SQL Developer / SQL*Plus (DBeaver и DataGrip не поддерживают)}
ACCEPT year_sal PROMPT 'Podaj roczne zarobki'
DECLARE
    v_sal NUMBER(8,2) := &year_sal;        -- @{& = wartość wpisana z klawiatury|& = value typed on the keyboard|& = значение, введённое с клавиатуры}
BEGIN
    DBMS_OUTPUT.PUT_LINE(v_sal / 12);
END;
/

VARIABLE b_sal NUMBER
BEGIN
    :b_sal := &year_sal / 12;              -- @{: = zmienna środowiska, widoczna poza blokiem|: = environment variable, visible outside the block|: = переменная среды, видна вне блока}
END;
/
PRINT b_sal`
  },

  'pl-sqlattr': {
    lang: 'oracle', title: 'SQL%ROWCOUNT, SQL%FOUND, SQL%NOTFOUND',
    code: `
BEGIN
    UPDATE emp SET sal = sal * 1.05 WHERE deptno = 20;
    DBMS_OUTPUT.PUT_LINE('Zmieniono wierszy: ' || SQL%ROWCOUNT);
    IF SQL%NOTFOUND THEN
        DBMS_OUTPUT.PUT_LINE('Nikogo nie zmieniono');
    END IF;
END;
/`
  },

  'pl-if': {
    lang: 'oracle', title: 'IF … ELSIF … ELSE … END IF',
    code: `
DECLARE
    v_ile INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_ile FROM emp;
    IF v_ile < 10 THEN
        DBMS_OUTPUT.PUT_LINE('Mala firma');
    ELSIF v_ile < 16 THEN                       -- @{ELSIF – bez „E” w środku!|ELSIF – no "E" in the middle!|ELSIF – без «E» в середине!}
        DBMS_OUTPUT.PUT_LINE('Srednia firma');
    ELSE                                        -- @{także gdy warunek = NULL|also when the condition = NULL|также когда условие = NULL}
        DBMS_OUTPUT.PUT_LINE('Duza firma');
    END IF;                                     -- @{END IF – obowiązkowe|END IF – mandatory|END IF – обязательно}
END;
/`
  },

  'pl-loops': {
    lang: 'oracle', title: '@{Pętle: LOOP, FOR, WHILE|Loops: LOOP, FOR, WHILE|Циклы: LOOP, FOR, WHILE}',
    code: `
DECLARE
    x    NUMBER := 0;
    done BOOLEAN := FALSE;
BEGIN
    -- @{1) LOOP z EXIT|1) LOOP with EXIT|1) LOOP с EXIT}
    LOOP
        DBMS_OUTPUT.PUT_LINE('x = ' || x);
        x := x + 1;
        EXIT WHEN x > 3;                    -- @{albo: IF x > 3 THEN EXIT; END IF;|or: IF x > 3 THEN EXIT; END IF;|или: IF x > 3 THEN EXIT; END IF;}
    END LOOP;

    -- @{2) FOR: licznik tworzy się sam|2) FOR: the counter is created automatically|2) FOR: счётчик создаётся сам}
    FOR i IN 1..3 LOOP
        DBMS_OUTPUT.PUT_LINE('i = ' || i);
    END LOOP;
    FOR i IN REVERSE 1..3 LOOP              -- 3, 2, 1
        DBMS_OUTPUT.PUT_LINE('i = ' || i);
    END LOOP;
    -- FOR k IN 3..1 LOOP … @{– nie wykona się ani razu|– does not run at all|– не выполнится ни разу}

    -- @{3) WHILE|3) WHILE|3) WHILE}
    WHILE NOT done LOOP
        DBMS_OUTPUT.PUT_LINE('Hello, world!');
        done := TRUE;
    END LOOP;
END;
/`
  },

  /* ================= Kursory i wyjątki ================= */
  'pl-cur-basic': {
    lang: 'oracle', title: '@{Kursor jawny: OPEN – FETCH – EXIT WHEN – CLOSE|Explicit cursor: OPEN – FETCH – EXIT WHEN – CLOSE|Явный курсор: OPEN – FETCH – EXIT WHEN – CLOSE}',
    code: `
SET SERVEROUTPUT ON;
DECLARE
    v_dname  VARCHAR2(14);
    v_deptno INTEGER;
    v_suma   NUMBER(8,2);
    CURSOR cur_dept IS SELECT deptno, dname FROM dept;     -- @{deklaracja w DECLARE|declared in DECLARE|объявление в DECLARE}
BEGIN
    OPEN cur_dept;
    LOOP
        FETCH cur_dept INTO v_deptno, v_dname;
        EXIT WHEN cur_dept%NOTFOUND;                        -- @{zaraz po FETCH!|right after FETCH!|сразу после FETCH!}
        SELECT NVL(SUM(sal), 0) INTO v_suma FROM emp WHERE deptno = v_deptno;
        DBMS_OUTPUT.PUT_LINE('Budzet dzialu ' || v_dname || ' wynosi ' || v_suma);
    END LOOP;
    CLOSE cur_dept;
END;
/`
  },

  'pl-cur-alias': {
    lang: 'oracle', title: '@{Wyrażenia w kursorze wymagają aliasów|Expressions in a cursor need aliases|Выражения в курсоре требуют псевдонимов}',
    code: `
DECLARE
    CURSOR budzety IS
        SELECT d.deptno, d.dname, SUM(e.sal) AS budzet     -- @{alias obowiązkowy|alias required|псевдоним обязателен}
        FROM   emp e JOIN dept d ON e.deptno = d.deptno
        GROUP BY d.deptno, d.dname;
    r budzety%ROWTYPE;                                     -- @{rekord o strukturze kursora|record shaped like the cursor|запись со структурой курсора}
BEGIN
    OPEN budzety;
    LOOP
        FETCH budzety INTO r;
        EXIT WHEN budzety%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE(r.dname || ': ' || r.budzet);
    END LOOP;
    CLOSE budzety;
END;
/`
  },

  'pl-cur-for': {
    lang: 'oracle', title: '@{Pętla FOR z kursorem (najwygodniejsza)|FOR loop with a cursor (the handiest)|Цикл FOR с курсором (самый удобный)}',
    code: `
DECLARE
    CURSOR kursor IS SELECT dname, loc FROM dept;
BEGIN
    FOR w IN kursor LOOP                   -- @{OPEN, FETCH, EXIT i CLOSE dzieją się same|OPEN, FETCH, EXIT and CLOSE happen automatically|OPEN, FETCH, EXIT и CLOSE происходят сами}
        DBMS_OUTPUT.PUT_LINE(w.dname || ' - ' || w.loc);
    END LOOP;
END;
/

-- @{wersja bez deklaracji kursora|version without declaring the cursor|версия без объявления курсора}
BEGIN
    FOR w IN (SELECT ename, sal FROM emp WHERE deptno = 10) LOOP
        DBMS_OUTPUT.PUT_LINE(w.ename || ' ' || w.sal);
    END LOOP;
END;
/`
  },

  'pl-cur-param': {
    lang: 'oracle', title: '@{Kursor z parametrami|Cursor with parameters|Курсор с параметрами}',
    code: `
DECLARE
    CURSOR dept_job (p_deptno INTEGER, p_job VARCHAR2) IS
        SELECT empno, ename, sal FROM emp
        WHERE  deptno = p_deptno AND job = p_job;
    r dept_job%ROWTYPE;
BEGIN
    OPEN dept_job(10, 'CLERK');            -- @{wartości parametrów przy OPEN|parameter values at OPEN|значения параметров при OPEN}
    LOOP
        FETCH dept_job INTO r;
        EXIT WHEN dept_job%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE(r.empno || ' ' || r.ename || ' ' || r.sal);
    END LOOP;
    CLOSE dept_job;

    FOR w IN dept_job(20, 'ANALYST') LOOP  -- @{ten sam kursor, inne parametry|same cursor, other parameters|тот же курсор, другие параметры}
        DBMS_OUTPUT.PUT_LINE(w.ename);
    END LOOP;
END;
/`
  },

  'pl-cur-update': {
    lang: 'oracle', title: 'FOR UPDATE + WHERE CURRENT OF',
    code: `
DECLARE
    CURSOR ename_sal IS
        SELECT ename, sal FROM emp
        FOR UPDATE OF sal;                        -- @{zablokuj wiersze do zmiany|lock the rows for change|заблокировать строки для изменения}
    v_nowa NUMBER(8,2);
BEGIN
    FOR r IN ename_sal LOOP
        IF r.sal < 1000 THEN
            v_nowa := r.sal * 1.1;
            UPDATE emp SET sal = v_nowa
            WHERE CURRENT OF ename_sal;           -- @{bieżący wiersz kursora|the cursor's current row|текущая строка курсора}
            DBMS_OUTPUT.PUT_LINE('Podwyzka: ' || r.ename || ' do ' || v_nowa);
        END IF;
    END LOOP;
    COMMIT;
END;
/`
  },

  'pl-exc-named': {
    lang: 'oracle', title: '@{Wyjątki predefiniowane|Predefined exceptions|Предопределённые исключения}',
    code: `
DECLARE
    v_ename emp.ename%TYPE;
BEGIN
    SELECT ename INTO v_ename FROM emp WHERE sal = 1100;   -- @{musi zwrócić DOKŁADNIE 1 wiersz|must return EXACTLY 1 row|должен вернуть РОВНО 1 строку}
    DBMS_OUTPUT.PUT_LINE(v_ename);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Brak pracownikow o pensji 1100');
    WHEN TOO_MANY_ROWS THEN
        DBMS_OUTPUT.PUT_LINE('Jest kilku pracownikow o pensji 1100');
    WHEN OTHERS THEN                                       -- @{wszystko inne|everything else|всё остальное}
        DBMS_OUTPUT.PUT_LINE('Blad nr ' || SQLCODE || ': ' || SUBSTR(SQLERRM, 1, 50));
END;
/`
  },

  'pl-exc-own': {
    lang: 'oracle', title: '@{Własny wyjątek i RAISE|Own exception and RAISE|Собственное исключение и RAISE}',
    code: `
DECLARE
    v_budzet   NUMBER;
    e_za_malo  EXCEPTION;                                 -- @{deklaracja wyjątku|exception declaration|объявление исключения}
BEGIN
    SELECT SUM(sal + 100) INTO v_budzet FROM emp WHERE deptno = 30;
    IF v_budzet <= 11000 THEN
        UPDATE emp SET sal = sal + 100 WHERE deptno = 30;
        DBMS_OUTPUT.PUT_LINE('Dokonano podwyzki w dziale 30');
    ELSE
        RAISE e_za_malo;                                  -- @{podniesienie|raise it|возбуждение}
    END IF;
EXCEPTION
    WHEN e_za_malo THEN
        DBMS_OUTPUT.PUT_LINE('Zbyt maly budzet na podwyzki');
END;
/`
  },

  'pl-raise-app': {
    lang: 'oracle', title: 'RAISE_APPLICATION_ERROR',
    code: `
BEGIN
    RAISE_APPLICATION_ERROR(-20100, 'Nie ma takiego dzialu');   -- @{numer od -20000 do -20999|number from -20000 to -20999|номер от -20000 до -20999}
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -20100 THEN
            DBMS_OUTPUT.PUT_LINE('Przechwycono: ' || SQLERRM);
        END IF;
END;
/
-- @{Bez obsługi w EXCEPTION błąd trafia do aplikacji (i wycofuje instrukcję).|Without an EXCEPTION handler the error goes to the application (and rolls back the statement).|Без обработки в EXCEPTION ошибка уходит в приложение (и откатывает инструкцию).}`
  },

  /* ================= Procedury, funkcje, pakiety ================= */
  'pl-proc-basic': {
    lang: 'oracle', title: '@{Procedura i sposoby wywołania|Procedure and ways to call it|Процедура и способы вызова}',
    code: `
CREATE OR REPLACE PROCEDURE UpdSal (v_up NUMBER, v_deptno NUMBER)   -- @{typy BEZ rozmiaru!|types WITHOUT size!|типы БЕЗ размера!}
IS                                                                  -- @{IS albo AS – bez różnicy|IS or AS – no difference|IS или AS – без разницы}
BEGIN
    UPDATE emp SET sal = sal * (1 + v_up / 100) WHERE deptno = v_deptno;
END;
/

CALL UpdSal(5, 20);            -- @{SQL Developer, DBeaver|SQL Developer, DBeaver|SQL Developer, DBeaver}
EXECUTE UpdSal(5, 20);         -- @{SQL Developer, SQL*Plus|SQL Developer, SQL*Plus|SQL Developer, SQL*Plus}
BEGIN UpdSal(5, 20); END;      -- @{w kodzie PL/SQL|in PL/SQL code|в коде PL/SQL}
/`
  },

  'pl-proc-out': {
    lang: 'oracle', title: '@{Parametr OUT|OUT parameter|Параметр OUT}',
    code: `
CREATE OR REPLACE PROCEDURE UpdSal2 (
    v_up     IN  NUMBER,          -- @{IN (domyślny): tylko do odczytu|IN (default): read-only|IN (по умолчанию): только чтение}
    v_deptno IN  NUMBER,
    v_budzet OUT NUMBER           -- @{OUT: wynik na zewnątrz|OUT: result goes out|OUT: результат наружу}
)
IS
BEGIN
    UPDATE emp SET sal = sal * (1 + v_up / 100) WHERE deptno = v_deptno;
    COMMIT;
    SELECT SUM(sal) INTO v_budzet FROM emp WHERE deptno = v_deptno;
END;
/

DECLARE
    v_wynik NUMBER(10);
BEGIN
    UpdSal2(5, 30, v_wynik);      -- @{potrzebna zmienna na wynik → blok PL/SQL|need a variable for the result → PL/SQL block|нужна переменная для результата → блок PL/SQL}
    DBMS_OUTPUT.PUT_LINE('Budzet dzialu 30: ' || v_wynik);
END;
/`
  },

  'pl-proc-default': {
    lang: 'oracle', title: '@{Wartości domyślne i notacja =>|Default values and => notation|Значения по умолчанию и нотация =>}',
    code: `
CREATE OR REPLACE PROCEDURE Pokaz (
    v_deptno emp.deptno%TYPE DEFAULT 10,
    v_job    emp.job%TYPE    DEFAULT 'SALESMAN'
)
AS
BEGIN
    DBMS_OUTPUT.PUT_LINE(v_deptno || ' ' || v_job);
END;
/
CALL Pokaz();                                   -- 10 SALESMAN
CALL Pokaz(v_job => 'MANAGER');                 -- 10 MANAGER
CALL Pokaz(v_deptno => 20);                     -- 20 SALESMAN
CALL Pokaz(v_deptno => 20, v_job => 'MANAGER'); -- 20 MANAGER`
  },

  'pl-func': {
    lang: 'oracle', title: '@{Funkcja i jej użycie|A function and its use|Функция и её использование}',
    code: `
CREATE OR REPLACE FUNCTION IleRek (p_deptno INTEGER)
RETURN INTEGER                                   -- @{typ wyniku|result type|тип результата}
AS
    v_ile INTEGER;                               -- @{zmienne bez słowa DECLARE|variables without the DECLARE keyword|переменные без слова DECLARE}
BEGIN
    SELECT COUNT(1) INTO v_ile FROM emp WHERE deptno = p_deptno;
    RETURN v_ile;
END;
/

SELECT IleRek(30) FROM dual;                     -- @{w SQL|in SQL|в SQL}

DECLARE
    v_n INTEGER;
BEGIN
    v_n := IleRek(30);                           -- @{w PL/SQL|in PL/SQL|в PL/SQL}
    DBMS_OUTPUT.PUT_LINE('W dziale 30 jest ' || v_n || ' pracownikow');
END;
/`
  },

  'pl-overload': {
    lang: 'oracle', title: '@{Przeciążanie nazw (w bloku lub pakiecie)|Name overloading (in a block or package)|Перегрузка имён (в блоке или пакете)}',
    code: `
DECLARE
    v_budzet NUMBER(8,2);
    PROCEDURE emp_dept (v_bud OUT NUMBER, v_deptno INTEGER) IS      -- @{wersja z numerem|version with a number|версия с номером}
    BEGIN
        SELECT SUM(sal) INTO v_bud FROM emp WHERE deptno = v_deptno;
    END;
    PROCEDURE emp_dept (v_bud OUT NUMBER, v_dname VARCHAR2) IS      -- @{wersja z nazwą|version with a name|версия с именем}
    BEGIN
        SELECT SUM(sal) INTO v_bud FROM emp
        WHERE  deptno = (SELECT deptno FROM dept WHERE dname = v_dname);
    END;
BEGIN
    emp_dept(v_budzet, 10);        DBMS_OUTPUT.PUT_LINE(v_budzet);
    emp_dept(v_budzet, 'SALES');   DBMS_OUTPUT.PUT_LINE(v_budzet);
END;
/`
  },

  'pl-package': {
    lang: 'oracle', title: '@{Pakiet: specyfikacja + ciało|Package: specification + body|Пакет: спецификация + тело}',
    code: `
CREATE OR REPLACE PACKAGE Obsluga_Prac AS          -- @{część publiczna (interfejs)|public part (interface)|публичная часть (интерфейс)}
    v_zat  INTEGER;
    v_zwol INTEGER;
    PROCEDURE Zatrudnij (p_ename VARCHAR2, p_sal NUMBER, p_dname VARCHAR2);
    PROCEDURE Zwolnij (p_empno INTEGER);
END Obsluga_Prac;
/

CREATE OR REPLACE PACKAGE BODY Obsluga_Prac AS     -- @{implementacja (część prywatna)|implementation (private part)|реализация (приватная часть)}
    PROCEDURE Zatrudnij (p_ename VARCHAR2, p_sal NUMBER, p_dname VARCHAR2) AS
        v_id INTEGER;
    BEGIN
        SELECT NVL(MAX(empno), 0) + 1 INTO v_id FROM emp;
        INSERT INTO emp (empno, ename, sal, deptno, hiredate)
        SELECT v_id, p_ename, p_sal, deptno, SYSDATE FROM dept WHERE dname = p_dname;
        COMMIT;
        v_zat := v_zat + 1;
    END Zatrudnij;

    PROCEDURE Zwolnij (p_empno INTEGER) IS
    BEGIN
        DELETE FROM emp WHERE empno = p_empno;
        COMMIT;
        v_zwol := v_zwol + 1;
    END Zwolnij;
BEGIN                                              -- @{inicjalizacja: raz na sesję|initialisation: once per session|инициализация: один раз за сессию}
    v_zat := 0;
    v_zwol := 0;
END Obsluga_Prac;
/

BEGIN
    Obsluga_Prac.Zatrudnij('MALINOWSKI', 1225, 'SALES');
    DBMS_OUTPUT.PUT_LINE('Zatrudniono w tej sesji: ' || Obsluga_Prac.v_zat);
END;
/`
  },

  /* ================= Wyzwalacze ================= */
  'pl-trg-statement': {
    lang: 'oracle', title: '@{Wyzwalacz poziomu instrukcji|Statement-level trigger|Триггер уровня инструкции}',
    code: `
CREATE TABLE Budzet (Wartosc NUMBER(10,2), DataAktualizacji DATE);

CREATE OR REPLACE TRIGGER emp_UpdBudzet
AFTER INSERT OR UPDATE OF sal OR DELETE ON emp     -- @{bez FOR EACH ROW = raz na instrukcję|no FOR EACH ROW = once per statement|без FOR EACH ROW = раз на инструкцию}
DECLARE
    v_budzet NUMBER(10,2);
BEGIN
    SELECT SUM(sal) INTO v_budzet FROM emp;         -- @{tu WOLNO czytać emp|reading emp IS allowed here|здесь МОЖНО читать emp}
    INSERT INTO Budzet (Wartosc, DataAktualizacji) VALUES (v_budzet, SYSDATE);
    DBMS_OUTPUT.PUT_LINE('Budzet: ' || v_budzet);
END;
/`
  },

  'pl-trg-row': {
    lang: 'oracle', title: '@{Wyzwalacz wierszowy: :OLD i :NEW|Row-level trigger: :OLD and :NEW|Строчный триггер: :OLD и :NEW}',
    code: `
CREATE OR REPLACE TRIGGER In_Grade_Trigg
BEFORE UPDATE ON emp
FOR EACH ROW                                      -- @{dla KAŻDEGO zmienianego wiersza|for EACH changed row|для КАЖДОЙ изменяемой строки}
DECLARE
    v_old salgrade.grade%TYPE;
    v_new salgrade.grade%TYPE;
BEGIN
    SELECT grade INTO v_old FROM salgrade WHERE :OLD.sal BETWEEN losal AND hisal;
    SELECT grade INTO v_new FROM salgrade WHERE :NEW.sal BETWEEN losal AND hisal;
    IF v_old != v_new THEN
        :NEW.sal := :OLD.sal;                     -- @{BEFORE: można podmienić nową wartość|BEFORE: the new value can be replaced|BEFORE: новое значение можно подменить}
        DBMS_OUTPUT.PUT_LINE('Nie zmieniamy grupy zarobkowej!');
    END IF;
END;
/`
  },

  'pl-trg-mutating': {
    lang: 'oracle', title: '@{Antyprzykład: tabela mutująca (ORA-04091)|Anti-example: mutating table (ORA-04091)|Антипример: мутирующая таблица (ORA-04091)}',
    code: `
CREATE OR REPLACE TRIGGER control_sal
BEFORE INSERT OR UPDATE OF sal ON emp
FOR EACH ROW
DECLARE
    v_avsal NUMBER(7,2);
BEGIN
    SELECT AVG(sal) INTO v_avsal FROM emp WHERE deptno = :NEW.deptno;   -- @{czytamy EMP w wyzwalaczu wierszowym na EMP!|reading EMP in a row trigger on EMP!|читаем EMP в строчном триггере на EMP!}
    IF :NEW.sal > 1.5 * v_avsal THEN
        :NEW.sal := :OLD.sal;
    END IF;
END;
/
UPDATE emp SET sal = sal * 2 WHERE deptno = 10;
-- ORA-04091: table EMP is mutating, trigger/function may not see it
-- @{Kompiluje się, ale nie działa. Usuń go: DROP TRIGGER control_sal;|It compiles but does not work. Drop it: DROP TRIGGER control_sal;|Компилируется, но не работает. Удали: DROP TRIGGER control_sal;}`
  },

  'pl-trg-predicates': {
    lang: 'oracle', title: 'INSERTING / UPDATING / DELETING',
    code: `
CREATE OR REPLACE TRIGGER emp_straznik
BEFORE INSERT OR UPDATE OR DELETE ON emp
FOR EACH ROW
BEGIN
    IF DELETING THEN
        IF :OLD.job = 'PRESIDENT' THEN
            RAISE_APPLICATION_ERROR(-20001, 'Nie wolno usunac prezesa');
        END IF;
    ELSIF UPDATING THEN
        IF :NEW.sal < :OLD.sal THEN
            RAISE_APPLICATION_ERROR(-20002, 'Nie wolno obnizac pensji');
        END IF;
    ELSIF INSERTING THEN
        IF :NEW.hiredate IS NULL THEN
            :NEW.hiredate := SYSDATE;            -- @{uzupełnienie brakującej wartości|filling in a missing value|заполнение недостающего значения}
        END IF;
    END IF;
END;
/
-- @{Wyłączenie / włączenie / usunięcie:|Disable / enable / drop:|Отключение / включение / удаление:}
ALTER TRIGGER emp_straznik DISABLE;
ALTER TRIGGER emp_straznik ENABLE;
DROP TRIGGER emp_straznik;`
  },

  'pl-trg-instead': {
    lang: 'oracle', title: '@{INSTEAD OF na widoku (Oracle)|INSTEAD OF on a view (Oracle)|INSTEAD OF на представлении (Oracle)}',
    code: `
CREATE OR REPLACE VIEW EmpDept_View AS
SELECT e.ename, e.sal, d.dname
FROM   emp e JOIN dept d ON e.deptno = d.deptno;

CREATE OR REPLACE TRIGGER io_empdept
INSTEAD OF INSERT ON EmpDept_View
FOR EACH ROW
DECLARE
    v_deptno dept.deptno%TYPE;
    v_empno  emp.empno%TYPE;
BEGIN
    BEGIN
        SELECT deptno INTO v_deptno FROM dept WHERE dname = :NEW.dname;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN                   -- @{nie ma działu → utwórz|no department → create|нет отдела → создать}
            SELECT NVL(MAX(deptno), 0) + 10 INTO v_deptno FROM dept;
            INSERT INTO dept (deptno, dname) VALUES (v_deptno, :NEW.dname);
    END;
    SELECT NVL(MAX(empno), 0) + 1 INTO v_empno FROM emp;
    INSERT INTO emp (empno, ename, sal, deptno) VALUES (v_empno, :NEW.ename, :NEW.sal, v_deptno);
END;
/
INSERT INTO EmpDept_View (ename, sal, dname) VALUES ('KOWALSKI', 1200, 'MARKETING');`
  },

  'pl-trg-system': {
    lang: 'oracle', title: '@{Wyzwalacz systemowy (DDL)|System (DDL) trigger|Системный (DDL) триггер}',
    code: `
CREATE OR REPLACE TRIGGER no_drop
BEFORE DROP ON SCHEMA                           -- @{zdarzenie DDL w moim schemacie|a DDL event in my schema|событие DDL в моей схеме}
BEGIN
    RAISE_APPLICATION_ERROR(-20010, 'W tym schemacie nie wolno usuwac obiektow');
END;
/
-- @{Inne zdarzenia: CREATE, ALTER, GRANT, REVOKE, LOGON, LOGOFF, STARTUP, SHUTDOWN, SERVERERROR;|Other events: CREATE, ALTER, GRANT, REVOKE, LOGON, LOGOFF, STARTUP, SHUTDOWN, SERVERERROR;|Другие события: CREATE, ALTER, GRANT, REVOKE, LOGON, LOGOFF, STARTUP, SHUTDOWN, SERVERERROR;}
-- @{zakres: ON SCHEMA albo ON DATABASE.|scope: ON SCHEMA or ON DATABASE.|область: ON SCHEMA или ON DATABASE.}`
  },

  /* ================= Zaawansowane ================= */
  'pl-names': {
    lang: 'oracle', title: '@{Nazwy w cudzysłowie|Quoted names|Имена в кавычках}',
    code: `
DECLARE
    "abc" VARCHAR2(10);                         -- @{w cudzysłowie: wielkość liter ma znaczenie|quoted: case matters|в кавычках: регистр важен}
BEGIN
    "abc" := 'Alamakota';
    DBMS_OUTPUT.PUT_LINE("abc");                -- OK
    -- DBMS_OUTPUT.PUT_LINE("ABC");             -- @{błąd: to inna nazwa|error: that is a different name|ошибка: это другое имя}
    -- DBMS_OUTPUT.PUT_LINE(abc);               -- @{błąd: bez cudzysłowu = ABC|error: unquoted = ABC|ошибка: без кавычек = ABC}
END;
/`
  },

  'pl-identity': {
    lang: 'oracle', title: '@{IDENTITY w Oracle (od 12c) – trzy warianty|IDENTITY in Oracle (12c+) – three variants|IDENTITY в Oracle (с 12c) – три варианта}',
    code: `
-- @{1) ALWAYS: tylko serwer nadaje numer (jak w MS SQL)|1) ALWAYS: only the server assigns the number (as in MS SQL)|1) ALWAYS: номер назначает только сервер (как в MS SQL)}
CREATE TABLE dept1 (
    deptno INTEGER GENERATED ALWAYS AS IDENTITY START WITH 10 INCREMENT BY 10 PRIMARY KEY,
    dname  VARCHAR2(20) NOT NULL
);
INSERT INTO dept1 (dname) VALUES ('ACCOUNTING');          -- OK: 10
-- INSERT INTO dept1 (deptno, dname) VALUES (20, 'X');    -- ORA-32795: cannot insert into a generated always identity column

-- @{2) BY DEFAULT: numer z serwera, chyba że podasz własny (ryzyko duplikatów!)|2) BY DEFAULT: server number unless you give your own (duplicate risk!)|2) BY DEFAULT: номер от сервера, если не указал свой (риск дублей!)}
CREATE TABLE dept2 (
    deptno INTEGER GENERATED BY DEFAULT AS IDENTITY START WITH 10 INCREMENT BY 10 PRIMARY KEY,
    dname  VARCHAR2(20)
);

-- @{3) BY DEFAULT ON NULL: numer z serwera także, gdy podasz NULL|3) BY DEFAULT ON NULL: server number also when you pass NULL|3) BY DEFAULT ON NULL: номер от сервера и когда передан NULL}
CREATE TABLE dept3 (
    deptno INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY START WITH 10 INCREMENT BY 10 PRIMARY KEY,
    dname  VARCHAR2(20)
);
INSERT INTO dept3 (deptno, dname) VALUES (NULL, 'OPERATIONS');   -- @{dostanie numer z generatora|gets a generated number|получит номер из генератора}`
  },

  'pl-seq': {
    lang: 'oracle', title: '@{Sekwencja zamiast IDENTITY|Sequence instead of IDENTITY|Последовательность вместо IDENTITY}',
    code: `
CREATE SEQUENCE seq_dept START WITH 10 INCREMENT BY 10;
INSERT INTO dept VALUES (seq_dept.NEXTVAL, 'ACCOUNTING', 'NEW YORK');
BEGIN
    DBMS_OUTPUT.PUT_LINE('Ostatni deptno = ' || seq_dept.CURRVAL);
END;
/`
  },

  'pl-temp': {
    lang: 'oracle', title: '@{Tabele tymczasowe: GLOBAL i PRIVATE|Temporary tables: GLOBAL and PRIVATE|Временные таблицы: GLOBAL и PRIVATE}',
    code: `
-- GTT: @{obiekt TRWAŁY, ale każda sesja widzi tylko swoje wiersze|a PERMANENT object, but each session sees only its own rows|ПОСТОЯННЫЙ объект, но каждая сессия видит только свои строки}
CREATE GLOBAL TEMPORARY TABLE temp1 (
    id   INTEGER,
    info VARCHAR2(50)
) ON COMMIT PRESERVE ROWS;        -- @{dane do końca SESJI (domyślnie DELETE ROWS = do końca transakcji)|data until end of SESSION (default DELETE ROWS = until end of transaction)|данные до конца СЕССИИ (по умолчанию DELETE ROWS = до конца транзакции)}
INSERT INTO temp1 VALUES (1, 'Dane sesji 1');
SELECT * FROM temp1;

-- PTT (@{od 18c|since 18c|с 18c}):@{i definicja, i dane są tymczasowe (RAM)|both definition and data are temporary (RAM)|и определение, и данные временные (RAM)}
CREATE PRIVATE TEMPORARY TABLE ora$ptt_moja (
    id NUMBER,
    opis VARCHAR2(20)
) ON COMMIT DROP DEFINITION;     -- @{nazwa MUSI zaczynać się od ORA$PTT_|name MUST start with ORA$PTT_|имя ДОЛЖНО начинаться с ORA$PTT_}
INSERT INTO ora$ptt_moja VALUES (1, 'ONE');
COMMIT;                          -- @{po COMMIT tabela znika|after COMMIT the table disappears|после COMMIT таблица исчезает}`
  },

  'pl-analytic': {
    lang: 'oracle', title: '@{Funkcje analityczne i LISTAGG|Analytic functions and LISTAGG|Аналитические функции и LISTAGG}',
    code: `
SELECT ROW_NUMBER() OVER (PARTITION BY job ORDER BY sal DESC) AS pozycja,
       job, ename, sal
FROM   emp;

SELECT ename, job, sal,
       SUM(sal) OVER (PARTITION BY job) AS job_suma,
       AVG(sal) OVER (PARTITION BY job) AS job_srednia
FROM   emp;

-- @{RANK jako agregat: które miejsce zajęłaby płaca 1600 z prowizją 300?|RANK as an aggregate: which place would salary 1600 with commission 300 take?|RANK как агрегат: какое место заняла бы зарплата 1600 с комиссией 300?}
SELECT RANK(1600, 300) WITHIN GROUP (ORDER BY sal, comm DESC) FROM emp;

SELECT ename, sal, deptno,
       RANK()       OVER (PARTITION BY deptno ORDER BY sal DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS drnk
FROM   emp;

-- @{lista nazwisk w jednym polu|list of names in one field|список фамилий в одном поле}
SELECT LISTAGG(RTRIM(ename), ', ') WITHIN GROUP (ORDER BY ename) AS "Pracownicy dzialu 10"
FROM   emp WHERE deptno = 10;`
  },

  'pl-merge': {
    lang: 'oracle', title: 'MERGE @{w Oracle|in Oracle|в Oracle}',
    code: `
CREATE TABLE budzety_dzialow (
    deptno NUMBER(2),
    budzet NUMBER,
    data_aktualizacji DATE
);

MERGE INTO budzety_dzialow bd
USING (SELECT deptno, SUM(sal) AS ss FROM emp GROUP BY deptno) s
ON (NVL(s.deptno, -1) = NVL(bd.deptno, -1))            -- @{NVL: żeby NULL też się dopasował|NVL: so that NULL matches too|NVL: чтобы NULL тоже сопоставлялся}
WHEN MATCHED THEN
    UPDATE SET bd.budzet = s.ss, bd.data_aktualizacji = SYSDATE
    DELETE WHERE bd.deptno IS NULL                     -- @{usuń dopasowane wiersze spełniające warunek|delete matched rows meeting the condition|удалить совпавшие строки, удовлетворяющие условию}
WHEN NOT MATCHED THEN
    INSERT (deptno, budzet, data_aktualizacji) VALUES (s.deptno, s.ss, SYSDATE)
    WHERE s.deptno IS NOT NULL;                        -- @{nie wstawiaj „działu NULL”|do not insert a "NULL department"|не вставлять «отдел NULL»}`
  },

  'pl-func-avg': {
    lang: 'oracle', title: '@{Funkcja w SQL i w bloku ze zmienną podstawienia|Function in SQL and in a block with a substitution variable|Функция в SQL и в блоке с переменной подстановки}',
    code: `
CREATE OR REPLACE FUNCTION Srednia_w_dziale (p_deptno IN NUMBER)
RETURN NUMBER
IS
    v_srednia NUMBER(8,2);
BEGIN
    SELECT AVG(sal) INTO v_srednia FROM emp WHERE deptno = p_deptno;
    RETURN v_srednia;
END;
/
SELECT Srednia_w_dziale(20) FROM dual;

SET VERIFY OFF
ACCEPT p_deptno PROMPT 'Podaj numer dzialu'
DECLARE
    v_deptno INTEGER := &p_deptno;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Srednia w dziale ' || v_deptno || ': ' || Srednia_w_dziale(v_deptno));
END;
/`
  },

  'pl-dynamic': {
    lang: 'oracle', title: 'EXECUTE IMMEDIATE',
    code: `
DECLARE
    v_sql     VARCHAR2(200);
    v_deptno  INTEGER := 60;
    v_empno   INTEGER := 7788;
    v_emp     emp%ROWTYPE;
BEGIN
    v_sql := 'INSERT INTO dept (deptno, dname, loc) VALUES (:1, :2, :3)';
    EXECUTE IMMEDIATE v_sql USING v_deptno, 'ACCOUNTS', 'DETROIT';   -- @{wartości przez USING (bezpiecznie)|values via USING (safe)|значения через USING (безопасно)}

    EXECUTE IMMEDIATE 'UPDATE emp SET deptno = :d WHERE empno = :e' USING v_deptno, v_empno;

    EXECUTE IMMEDIATE 'SELECT * FROM emp WHERE empno = :e' INTO v_emp USING v_empno;
    DBMS_OUTPUT.PUT_LINE(v_emp.ename || ' pracuje teraz w dziale ' || v_emp.deptno);

    EXECUTE IMMEDIATE 'CREATE TABLE log_tmp (x INTEGER)';           -- @{DDL w PL/SQL tylko tak|DDL in PL/SQL only this way|DDL в PL/SQL только так}
END;
/`
  }
});
