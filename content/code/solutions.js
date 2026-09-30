/* Rozwiązania zadań treningowych (autor strony). Komentarze: @{polski|english|русский}. */
SBD.addCode({

  /* ================= Zadania 2: SQL – powtórka 1 (Wypożyczalnia) ================= */
  's02-01': { lang: 'sql', code: `
SELECT *
FROM   Klient
ORDER  BY Nazwisko DESC, Imie ASC;` },

  's02-02': { lang: 'sql', code: `
SELECT DISTINCT LiczbaMiejsc
FROM   Auto
ORDER  BY LiczbaMiejsc;          -- 4, 5, 7, 9` },

  's02-03': { lang: 'sql', code: `
SELECT w.DataOd, w.DataDo, w.NrAuta
FROM   Wypozyczenie w
       JOIN Klient k ON w.IdKlient = k.IdKlient
WHERE  k.Imie = 'Ewa' AND k.Nazwisko = 'Pawlak';` },

  's02-04': { lang: 'sql', code: `
SELECT k.Imie, k.Nazwisko, a.Marka, w.DataOd
FROM   Wypozyczenie w
       JOIN Klient k ON w.IdKlient = k.IdKlient
       JOIN Auto   a ON w.NrAuta   = a.NrAuta
WHERE  (k.Nazwisko LIKE 'K%' OR k.Nazwisko LIKE 'P%')   -- @{nawiasy konieczne!|parentheses required!|скобки обязательны!}
  AND  YEAR(w.DataOd) = 2024;                           -- Oracle: EXTRACT(YEAR FROM w.DataOd) = 2024` },

  's02-05': { lang: 'sql', code: `
SELECT DISTINCT a.Marka
FROM   Wypozyczenie w
       JOIN Klient k ON w.IdKlient = k.IdKlient
       JOIN Auto   a ON w.NrAuta   = a.NrAuta
WHERE  k.Imie = 'Jan' AND k.Nazwisko = 'Kowalczyk';     -- Toyota, Kia, BMW` },

  's02-06': { lang: 'sql', code: `
SELECT   kl.Nazwa, COUNT(a.NrAuta) AS LiczbaAut      -- @{COUNT(kolumna) – klasa bez aut dałaby 0|COUNT(column) – a class without cars would give 0|COUNT(столбец) – класс без машин дал бы 0}
FROM     Klasa kl
         LEFT JOIN Auto a ON a.IdKlasa = kl.IdKlasa
GROUP BY kl.Nazwa;` },

  's02-07': { lang: 'sql', code: `
SELECT k.Imie, k.Nazwisko, k.Rabat, w.DataOd, w.DataDo, w.NrAuta, w.Oplacone
FROM   Klient k
       LEFT JOIN Wypozyczenie w ON w.IdKlient = k.IdKlient   -- @{Wrona i Kaczmarek z NULL-ami|Wrona and Kaczmarek with NULLs|Wrona и Kaczmarek с NULL}
ORDER  BY k.Nazwisko;` },

  's02-08': { lang: 'sql', code: `
SELECT k.*
FROM   Klient k
       JOIN Wypozyczenie w ON w.IdKlient = k.IdKlient
WHERE  w.NrAuta = 11 AND w.Oplacone = 0;                -- Tomasz Lewandowski` },

  's02-09': { lang: 'sql', code: `
-- MS SQL
SELECT k.Nazwisko + ' ' + k.Imie AS Klient, w.DataOd, w.DataDo, a.Marka, kl.Nazwa AS Klasa
FROM   Wypozyczenie w
       JOIN Klient k  ON w.IdKlient = k.IdKlient
       JOIN Auto   a  ON w.NrAuta   = a.NrAuta
       JOIN Klasa  kl ON a.IdKlasa  = kl.IdKlasa;

-- Oracle: k.Nazwisko || ' ' || k.Imie AS Klient` },

  's02-10': { lang: 'sql', code: `
SELECT k.Imie, k.Nazwisko, k.Rabat, kl.Nazwa AS Klasa, w.DataOd
FROM   Wypozyczenie w
       JOIN Klient k  ON w.IdKlient = k.IdKlient
       JOIN Auto   a  ON w.NrAuta   = a.NrAuta
       JOIN Klasa  kl ON a.IdKlasa  = kl.IdKlasa
WHERE  (kl.Nazwa = 'premium'     AND k.Rabat >= 10)
   OR  (kl.Nazwa = 'ekonomiczna' AND k.Rabat IS NULL);   -- @{wynik: wypożyczenia 7, 8, 11|result: rentals 7, 8, 11|результат: прокаты 7, 8, 11}` },

  's02-11': { lang: 'sql', code: `
SELECT DISTINCT k.IdKlient, k.Imie, k.Nazwisko, k.Rabat
FROM   Klient k
       JOIN Wypozyczenie w ON w.IdKlient = k.IdKlient
WHERE  k.Rabat IS NOT NULL;                -- @{5 osób (Nowicka ma rabat 0 – to NIE jest NULL!)|5 people (Nowicka has 0 – that is NOT NULL!)|5 человек (у Nowicka 0 – это НЕ NULL!)}` },

  's02-12': { lang: 'sql', code: `
SELECT k.Imie, k.Nazwisko, w.DataOd, a.Marka
FROM   Wypozyczenie w
       JOIN Klient k ON w.IdKlient = k.IdKlient
       JOIN Auto   a ON w.NrAuta   = a.NrAuta
WHERE  a.Marka IN ('Toyota', 'Skoda', 'Kia');` },

  's02-13': { lang: 'sql', code: `
SELECT *
FROM   Klasa
WHERE  CenaDoba BETWEEN 150 AND 300;       -- kompakt, SUV, van (@{300 też – przedział domknięty|300 too – closed range|300 тоже – закрытый интервал})` },

  's02-14': { lang: 'sql', code: `
SELECT DISTINCT k.Nazwisko + ' ' + k.Imie AS Dluznik     -- Oracle: ||
FROM   Klient k
       JOIN Wypozyczenie w ON w.IdKlient = k.IdKlient
WHERE  w.Oplacone = 0
ORDER  BY Dluznik;      -- @{tekst zaczyna się od nazwiska, więc to sortuje po nazwisku, potem imieniu|the text starts with the surname, so this sorts by surname, then first name|текст начинается с фамилии, поэтому сортирует по фамилии, затем по имени}` },

  's02-15': { lang: 'sql', code: `
SELECT COUNT(*) AS Oplaconych
FROM   Wypozyczenie
WHERE  Oplacone = 1;                       -- 8` },

  's02-16': { lang: 'sql', code: `
SELECT COUNT(*) FROM Wypozyczenie WHERE YEAR(DataOd) = 2025;                 -- MS SQL → 6
SELECT COUNT(*) FROM Wypozyczenie WHERE EXTRACT(YEAR FROM DataOd) = 2025;    -- Oracle` },

  's02-17': { lang: 'sql', code: `
INSERT INTO Klient (IdKlient, Imie, Nazwisko, Rabat)
VALUES (11, 'Kamil', 'Ostrowski', 5);

INSERT INTO Wypozyczenie (IdWyp, DataOd, DataDo, IdKlient, NrAuta, Oplacone)
VALUES (13, '2026-10-01', '2026-10-04', 11, 22, 0);
-- Oracle: DATE '2026-10-01', DATE '2026-10-04'  (+ COMMIT)` },

  's02-18': { lang: 'sql', code: `
UPDATE Wypozyczenie SET DataDo = DATEADD(day, 2, DataDo) WHERE IdWyp = 13;   -- MS SQL
UPDATE Wypozyczenie SET DataDo = DataDo + 2 WHERE IdWyp = 13;                -- Oracle: @{data + liczba = dni|date + number = days|дата + число = дни}` },

  's02-19': { lang: 'sql', code: `
DELETE FROM Wypozyczenie WHERE IdWyp = 13;
-- @{Klienta 11 usuniesz dopiero po usunięciu jego wypożyczeń (klucz obcy!)|You can delete client 11 only after deleting his rentals (foreign key!)|Клиента 11 удалишь только после удаления его прокатов (внешний ключ!)}` },

  's02-20': { lang: 'sql', code: `
-- MS SQL
SELECT w.IdWyp, k.Nazwisko,
       DATEDIFF(day, w.DataOd, w.DataDo) AS Dni,
       DATEDIFF(day, w.DataOd, w.DataDo) * kl.CenaDoba * (100 - ISNULL(k.Rabat, 0)) / 100 AS DoZaplaty
FROM   Wypozyczenie w
       JOIN Klient k  ON w.IdKlient = k.IdKlient
       JOIN Auto   a  ON w.NrAuta   = a.NrAuta
       JOIN Klasa  kl ON a.IdKlasa  = kl.IdKlasa;

-- Oracle: (w.DataDo - w.DataOd) AS Dni,  … * (100 - NVL(k.Rabat, 0)) / 100` },

  /* ================= Zadania 3: SQL – powtórka 2 ================= */
  's03-01': { lang: 'sql', code: `
SELECT   k.IdKlient, k.Imie, k.Nazwisko, COUNT(*) AS Wypozyczen
FROM     Klient k
         JOIN Wypozyczenie w ON w.IdKlient = k.IdKlient
GROUP BY k.IdKlient, k.Imie, k.Nazwisko
HAVING   COUNT(*) >= 2;                  -- Kowalczyk 3, Kania 2, Lewandowski 2` },

  's03-02': { lang: 'sql', code: `
SELECT NrAuta, Marka, LiczbaMiejsc
FROM   Auto
WHERE  LiczbaMiejsc = (SELECT MIN(LiczbaMiejsc) FROM Auto);   -- Fiat, Hyundai, BMW` },

  's03-03': { lang: 'sql', code: `
SELECT   a.NrAuta, a.Marka, MIN(w.DataOd) AS PierwszeWypozyczenie
FROM     Auto a
         LEFT JOIN Wypozyczenie w ON w.NrAuta = a.NrAuta   -- @{Hyundai i Ford → NULL|Hyundai and Ford → NULL|Hyundai и Ford → NULL}
GROUP BY a.NrAuta, a.Marka
ORDER BY a.NrAuta;` },

  's03-04': { lang: 'sql', code: `
SELECT   a.NrAuta, a.Marka, COUNT(*) AS Ile
FROM     Auto a
         JOIN Wypozyczenie w ON w.NrAuta  = a.NrAuta
         JOIN Klasa kl       ON a.IdKlasa = kl.IdKlasa
WHERE    kl.Nazwa <> 'van'            -- @{filtr wierszy → WHERE|row filter → WHERE|фильтр строк → WHERE}
GROUP BY a.NrAuta, a.Marka
HAVING   COUNT(*) > 1;                -- @{filtr grup → HAVING|group filter → HAVING|фильтр групп → HAVING}` },

  's03-05': { lang: 'sql', code: `
SELECT k.Imie, k.Nazwisko, w.NrAuta, w.DataOd
FROM   Wypozyczenie w
       JOIN Klient k ON w.IdKlient = k.IdKlient
WHERE  w.DataOd = (SELECT MIN(DataOd) FROM Wypozyczenie);   -- Jan Kowalczyk, 2024-03-02` },

  's03-06': { lang: 'sql', code: `
-- @{wersja 1: NOT IN (NrAuta w Wypozyczenie nigdy nie jest NULL, więc bezpiecznie)|version 1: NOT IN (NrAuta in Wypozyczenie is never NULL, so it is safe)|версия 1: NOT IN (NrAuta в Wypozyczenie никогда не NULL, поэтому безопасно)}
SELECT * FROM Auto
WHERE  NrAuta NOT IN (SELECT NrAuta FROM Wypozyczenie);

-- @{wersja 2: NOT EXISTS|version 2: NOT EXISTS|версия 2: NOT EXISTS}
SELECT * FROM Auto a
WHERE  NOT EXISTS (SELECT 1 FROM Wypozyczenie w WHERE w.NrAuta = a.NrAuta);   -- Hyundai 13, Ford 51` },

  's03-07': { lang: 'sql', code: `
SELECT k.Imie, k.Nazwisko
FROM   Klient k
WHERE  NOT EXISTS (
         SELECT 1
         FROM   Wypozyczenie w
                JOIN Auto  a  ON w.NrAuta  = a.NrAuta
                JOIN Klasa kl ON a.IdKlasa = kl.IdKlasa
         WHERE  kl.Nazwa = 'premium'
           AND  w.IdKlient = k.IdKlient          -- @{korelacja|correlation|корреляция}
       );` },

  's03-08': { lang: 'sql', code: `
-- MS SQL
SELECT k.Imie, k.Nazwisko, CONVERT(VARCHAR(10), w.DataOd, 120) AS Data
FROM   Wypozyczenie w
       JOIN Klient k ON w.IdKlient = k.IdKlient
       JOIN Auto   a ON w.NrAuta   = a.NrAuta
       JOIN Klasa kl ON a.IdKlasa  = kl.IdKlasa
WHERE  kl.Nazwa = 'SUV'
UNION
SELECT k.Imie, k.Nazwisko, 'brak'
FROM   Klient k
WHERE  k.IdKlient NOT IN (SELECT IdKlient FROM Wypozyczenie);

-- Oracle: TO_CHAR(w.DataOd, 'YYYY-MM-DD') @{zamiast CONVERT – kolumny muszą mieć ten sam typ!|instead of CONVERT – columns must have the same type!|вместо CONVERT – столбцы должны быть одного типа!}` },

  's03-09': { lang: 'sql', code: `
SELECT   kl.Nazwa, COUNT(*) AS LiczbaAut
FROM     Klasa kl
         JOIN Auto a ON a.IdKlasa = kl.IdKlasa
GROUP BY kl.Nazwa
HAVING   COUNT(*) >= ALL (SELECT COUNT(*) FROM Auto GROUP BY IdKlasa);   -- ekonomiczna (3)` },

  's03-10': { lang: 'sql', code: `
SELECT kl.Nazwa, a.Marka, a.LiczbaMiejsc
FROM   Auto a
       JOIN Klasa kl ON a.IdKlasa = kl.IdKlasa
WHERE  a.LiczbaMiejsc = (SELECT MAX(a2.LiczbaMiejsc)
                         FROM   Auto a2
                         WHERE  a2.IdKlasa = a.IdKlasa)   -- @{skorelowane|correlated|коррелированный}
ORDER  BY kl.Nazwa;` },

  's03-11': { lang: 'sql', code: `
-- MS SQL
WITH Dni (IdKlient, SumaDni) AS (
    SELECT IdKlient, SUM(DATEDIFF(day, DataOd, DataDo))
    FROM   Wypozyczenie
    GROUP  BY IdKlient
)
SELECT k.Imie, k.Nazwisko, d.SumaDni
FROM   Dni d
       JOIN Klient k ON k.IdKlient = d.IdKlient
WHERE  d.SumaDni > (SELECT AVG(SumaDni * 1.0) FROM Dni);   -- @{* 1.0 – żeby średnia nie była całkowita|* 1.0 – so the average is not an integer|* 1.0 – чтобы среднее не было целым}

-- Oracle: SUM(DataDo - DataOd)  @{i bez * 1.0 (Oracle dzieli dokładnie)|and no * 1.0 needed (Oracle divides exactly)|и без * 1.0 (Oracle делит точно)}` },

  /* ================= Zadania 4: T-SQL podstawy (Kurierzy) ================= */
  's04-01': { lang: 'mssql', code: `
DECLARE @ile INT;
SELECT @ile = COUNT(*)
FROM   Kurier k JOIN Oddzial o ON k.IdOddzial = o.IdOddzial
WHERE  o.Nazwa = 'POLNOC';
PRINT 'Oddzial POLNOC zatrudnia ' + CAST(@ile AS VARCHAR) + ' osob';   -- 5` },

  's04-02': { lang: 'mssql', code: `
DECLARE @ile INT = (SELECT COUNT(*) FROM Kurier WHERE IdOddzial = 30);
IF @ile < 6
BEGIN
    INSERT INTO Kurier (IdKurier, Nazwisko, Stanowisko, IdSzef, DataZatrudnienia, Pensja, IdOddzial)
    SELECT MAX(IdKurier) + 1, 'NOWICKI', 'KURIER', 102, GETDATE(), 2500, 30
    FROM   Kurier;
    PRINT 'Zatrudniono NOWICKIEGO w oddziale 30';
END
ELSE
    PRINT 'Oddzial 30 ma komplet - nikogo nie zatrudniono';` },

  's04-03': { lang: 'mssql', code: `
CREATE PROCEDURE Kurierzy_Przedzial
    @min INT,
    @max INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT IdKurier, Nazwisko, Stanowisko, Pensja
    FROM   Kurier
    WHERE  Pensja BETWEEN @min AND @max
    ORDER  BY Pensja;
END;
GO
EXEC Kurierzy_Przedzial 2500, 3500;
EXEC Kurierzy_Przedzial @min = 5000, @max = 99999;` },

  's04-04': { lang: 'mssql', code: `
CREATE PROCEDURE Dodaj_Oddzial
    @id     INT,
    @nazwa  VARCHAR(20),
    @miasto VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Oddzial WHERE Nazwa = @nazwa OR Miasto = @miasto)
        PRINT 'Oddzial o tej nazwie lub w tym miescie juz istnieje - nic nie dodano';
    ELSE
    BEGIN
        INSERT INTO Oddzial (IdOddzial, Nazwa, Miasto) VALUES (@id, @nazwa, @miasto);
        PRINT 'Dodano oddzial ' + @nazwa;
    END;
END;
GO
EXEC Dodaj_Oddzial 50, 'WSCHOD', 'LUBLIN';   -- @{doda|adds|добавит}
EXEC Dodaj_Oddzial 60, 'NOWY', 'GDANSK';     -- @{nie doda (miasto zajęte)|will not add (city taken)|не добавит (город занят)}` },

  's04-05': { lang: 'mssql', code: `
CREATE PROCEDURE Zatrudnij_Kuriera
    @nazwisko  VARCHAR(20),
    @idOddzial INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM Oddzial WHERE IdOddzial = @idOddzial)
    BEGIN
        RAISERROR ('Nie ma oddzialu o numerze %d', 16, 1, @idOddzial);
        RETURN;                     -- @{RAISERROR poza TRY nie przerywa – potrzebny RETURN|RAISERROR outside TRY does not stop – RETURN needed|RAISERROR вне TRY не прерывает – нужен RETURN}
    END;

    DECLARE @id INT, @pensja INT, @szef INT;
    SELECT @id = ISNULL(MAX(IdKurier), 0) + 1 FROM Kurier;
    SELECT @pensja = MIN(Pensja) FROM Kurier
    WHERE  IdOddzial = @idOddzial AND Stanowisko = 'KURIER';
    SET @pensja = ISNULL(@pensja, 2500);      -- @{brak kurierów w oddziale|no couriers in the branch|в отделе нет курьеров}
    SELECT @szef = IdKurier FROM Kurier
    WHERE  IdOddzial = @idOddzial AND Stanowisko = 'KIEROWNIK';

    INSERT INTO Kurier (IdKurier, Nazwisko, Stanowisko, IdSzef, DataZatrudnienia, Pensja, IdOddzial)
    VALUES (@id, @nazwisko, 'KURIER', @szef, GETDATE(), @pensja, @idOddzial);
    PRINT 'Zatrudniono ' + @nazwisko + ' z pensja ' + CAST(@pensja AS VARCHAR);
END;
GO
EXEC Zatrudnij_Kuriera 'LIS', 20;    -- @{pensja 2400, szef 101|salary 2400, boss 101|зарплата 2400, начальник 101}
EXEC Zatrudnij_Kuriera 'KOT', 40;    -- @{pensja 2500, szef NULL|salary 2500, boss NULL|зарплата 2500, начальник NULL}
EXEC Zatrudnij_Kuriera 'MYSZ', 99;   -- @{błąd|error|ошибка}` },

  /* ================= Zadania 5: T-SQL kursory ================= */
  's05-01': { lang: 'mssql', code: `
DECLARE k CURSOR FOR
    SELECT IdKurier, Nazwisko, Pensja FROM Kurier
    WHERE  Pensja < 2500 OR Pensja > 6000;
DECLARE @id INT, @nazw VARCHAR(20), @p INT, @nowa INT;

OPEN k;
FETCH NEXT FROM k INTO @id, @nazw, @p;
WHILE @@FETCH_STATUS = 0
BEGIN
    IF @p < 2500
        SET @nowa = @p * 1.05;
    ELSE
        SET @nowa = @p * 0.95;
    UPDATE Kurier SET Pensja = @nowa WHERE IdKurier = @id;
    PRINT @nazw + ': ' + CAST(@p AS VARCHAR) + ' -> ' + CAST(@nowa AS VARCHAR);
    FETCH NEXT FROM k INTO @id, @nazw, @p;
END;
CLOSE k;
DEALLOCATE k;` },

  's05-02': { lang: 'mssql', code: `
CREATE PROCEDURE Koryguj_Pensje
    @dolny   INT,
    @gorny   INT,
    @procent DECIMAL(5,2) = 5
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE k CURSOR FOR
        SELECT IdKurier, Nazwisko, Pensja FROM Kurier
        WHERE  Pensja < @dolny OR Pensja > @gorny;
    DECLARE @id INT, @nazw VARCHAR(20), @p INT, @nowa INT;

    OPEN k;
    FETCH NEXT FROM k INTO @id, @nazw, @p;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @p < @dolny
            SET @nowa = @p * (1 + @procent / 100);
        ELSE
            SET @nowa = @p * (1 - @procent / 100);
        UPDATE Kurier SET Pensja = @nowa WHERE IdKurier = @id;
        PRINT @nazw + ': ' + CAST(@p AS VARCHAR) + ' -> ' + CAST(@nowa AS VARCHAR);
        FETCH NEXT FROM k INTO @id, @nazw, @p;
    END;
    CLOSE k;
    DEALLOCATE k;
END;
GO
EXEC Koryguj_Pensje 2500, 6000;
EXEC Koryguj_Pensje @dolny = 3000, @gorny = 5000, @procent = 2.5;` },

  's05-03': { lang: 'mssql', code: `
CREATE PROCEDURE Premie_Oddzialu @idOddzial INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @srednia DECIMAL(10,2) = (SELECT AVG(Pensja * 1.0) FROM Kurier WHERE IdOddzial = @idOddzial);

    DECLARE k CURSOR FOR
        SELECT IdKurier, Nazwisko, Pensja FROM Kurier
        WHERE  IdOddzial = @idOddzial AND Pensja < @srednia;
    DECLARE @id INT, @nazw VARCHAR(20), @p INT;

    OPEN k;
    FETCH NEXT FROM k INTO @id, @nazw, @p;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        UPDATE Kurier SET Premia = @p * 0.08 WHERE IdKurier = @id;
        PRINT @nazw + ' dostaje premie ' + CAST(CAST(@p * 0.08 AS INT) AS VARCHAR);
        FETCH NEXT FROM k INTO @id, @nazw, @p;
    END;
    CLOSE k;
    DEALLOCATE k;
END;
GO
EXEC Premie_Oddzialu 30;   -- @{średnia 3480 → MAZUR, KRAWCZYK, PIOTROWSKI|average 3480 → MAZUR, KRAWCZYK, PIOTROWSKI|среднее 3480 → MAZUR, KRAWCZYK, PIOTROWSKI}
-- @{Bez kursora: UPDATE Kurier SET Premia = Pensja * 0.08 WHERE IdOddzial = 30 AND Pensja < @srednia;|Without a cursor: UPDATE Kurier SET Premia = Pensja * 0.08 WHERE IdOddzial = 30 AND Pensja < @srednia;|Без курсора: UPDATE Kurier SET Premia = Pensja * 0.08 WHERE IdOddzial = 30 AND Pensja < @srednia;}` },

  's05-04': { lang: 'mssql', code: `
DECLARE @id INT, @sztuk INT;
SELECT TOP 1 @id = IdPolki, @sztuk = Sztuk
FROM   Regal
ORDER  BY Sztuk ASC, IdPolki ASC;           -- @{przy remisie mniejsze Id → tylko jeden wiersz|on a tie the smaller Id → only one row|при равенстве меньший Id → только одна строка}

IF @sztuk >= 50
    RAISERROR ('Wszystkiego jest dosc - nic nie zamawiamy', 16, 1);
ELSE
BEGIN
    UPDATE Regal SET Sztuk = Sztuk + 10 WHERE IdPolki = @id;
    PRINT 'Domowiono 10 szt. na polke ' + CAST(@id AS VARCHAR);   -- @{półka 3 (Maslo)|shelf 3 (Maslo)|полка 3 (Maslo)}
END;` },

  's05-05': { lang: 'mssql', code: `
CREATE PROCEDURE Domow @ile INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @id INT, @sztuk INT;
    SELECT TOP 1 @id = IdPolki, @sztuk = Sztuk FROM Regal ORDER BY Sztuk, IdPolki;
    IF @sztuk >= 50
    BEGIN
        RAISERROR ('Wszystkiego jest dosc - nic nie zamawiamy', 16, 1);
        RETURN;
    END;
    UPDATE Regal SET Sztuk = Sztuk + @ile WHERE IdPolki = @id;
    PRINT 'Domowiono ' + CAST(@ile AS VARCHAR) + ' szt. na polke ' + CAST(@id AS VARCHAR);
END;
GO
EXEC Domow 25;` },

  's05-06': { lang: 'mssql', code: `
UPDATE Kurier
SET    Pensja = CASE WHEN Pensja < 2500 THEN Pensja * 1.05
                     ELSE Pensja * 0.95 END
OUTPUT deleted.Nazwisko, deleted.Pensja AS Stara, inserted.Pensja AS Nowa   -- @{„wypisanie zmian” bez kursora|"printing changes" without a cursor|«вывод изменений» без курсора}
WHERE  Pensja < 2500 OR Pensja > 6000;` },

  /* ================= Zadania 6: T-SQL wyzwalacze ================= */
  's06-01': { lang: 'mssql', code: `
CREATE TRIGGER TR_Oddzial_NoDelete ON Oddzial
FOR DELETE
AS
BEGIN
    ROLLBACK;
    RAISERROR ('Oddzialow nie wolno usuwac', 16, 1);
END;
GO
DELETE FROM Oddzial WHERE IdOddzial = 40;   -- @{zablokowane|blocked|заблокировано}` },

  's06-02': { lang: 'mssql', code: `
CREATE TRIGGER TR_Kurier_Data ON Kurier
FOR INSERT
AS
    UPDATE Kurier
    SET    DataZatrudnienia = CAST(GETDATE() AS DATE)
    WHERE  DataZatrudnienia IS NULL
      AND  IdKurier IN (SELECT IdKurier FROM inserted);   -- @{działa też dla wielu wierszy|works for many rows too|работает и для многих строк}
GO
INSERT INTO Kurier (IdKurier, Nazwisko, Pensja, IdOddzial) VALUES (200, 'TEST', 2500, 20);
SELECT * FROM Kurier WHERE IdKurier = 200;
-- @{To samo prościej: DEFAULT GETDATE() na kolumnie.|The same, simpler: DEFAULT GETDATE() on the column.|То же проще: DEFAULT GETDATE() на столбце.}` },

  's06-03': { lang: 'mssql', code: `
CREATE TRIGGER TR_Kurier_Pensja ON Kurier
FOR INSERT, UPDATE
AS
IF EXISTS (SELECT 1 FROM inserted WHERE Pensja NOT BETWEEN 2000 AND 12000)
BEGIN
    ROLLBACK;
    RAISERROR ('Pensja musi byc z przedzialu 2000 - 12000', 16, 1);
END;
GO
UPDATE Kurier SET Pensja = 1500 WHERE IdKurier = 109;   -- @{błąd|error|ошибка}
-- @{Uwaga: Pensja = NULL przejdzie (NULL NOT BETWEEN … = NULL). Prościej: CHECK (Pensja BETWEEN 2000 AND 12000).|Note: Pensja = NULL passes (NULL NOT BETWEEN … = NULL). Simpler: CHECK (Pensja BETWEEN 2000 AND 12000).|Внимание: Pensja = NULL пройдёт (NULL NOT BETWEEN … = NULL). Проще: CHECK (Pensja BETWEEN 2000 AND 12000).}` },

  's06-04': { lang: 'mssql', code: `
CREATE TABLE FunduszPlac (Suma INT NOT NULL, Liczba INT NOT NULL);
INSERT INTO FunduszPlac (Suma, Liczba) SELECT SUM(Pensja), COUNT(*) FROM Kurier;   -- 56800, 14
GO
CREATE TRIGGER TR_Fundusz ON Kurier
FOR INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE FunduszPlac
    SET Suma   = Suma + ISNULL((SELECT SUM(Pensja) FROM inserted), 0)
                      - ISNULL((SELECT SUM(Pensja) FROM deleted), 0),
        Liczba = Liczba + (SELECT COUNT(*) FROM inserted)
                        - (SELECT COUNT(*) FROM deleted);
END;
GO
UPDATE Kurier SET Pensja = Pensja + 100 WHERE IdOddzial = 20;   -- +500
SELECT * FROM FunduszPlac;` },

  's06-05': { lang: 'mssql', code: `
CREATE TRIGGER TR_Oddzial_Miasto ON Oddzial
FOR UPDATE
AS
IF EXISTS (SELECT 1
           FROM   inserted i JOIN deleted d ON i.IdOddzial = d.IdOddzial
           WHERE  i.Miasto <> d.Miasto)
BEGIN
    ROLLBACK;
    RAISERROR ('Nie wolno zmieniac miasta oddzialu', 16, 1);
END;
GO
UPDATE Oddzial SET Nazwa = 'POMORZE' WHERE IdOddzial = 20;   -- OK
UPDATE Oddzial SET Miasto = 'SOPOT'  WHERE IdOddzial = 20;   -- @{błąd|error|ошибка}
INSERT INTO Oddzial VALUES (50, 'WSCHOD', 'LUBLIN');         -- OK` },

  's06-06': { lang: 'mssql', code: `
CREATE TRIGGER TR_Kurier_Reguly ON Kurier
FOR INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @ins BIT = CASE WHEN EXISTS (SELECT 1 FROM inserted) THEN 1 ELSE 0 END;
    DECLARE @del BIT = CASE WHEN EXISTS (SELECT 1 FROM deleted)  THEN 1 ELSE 0 END;

    -- DELETE
    IF @del = 1 AND @ins = 0
       AND EXISTS (SELECT 1 FROM deleted WHERE DataZatrudnienia < '2020-01-01')
    BEGIN
        ROLLBACK; RAISERROR ('Nie wolno usuwac osob zatrudnionych przed 2020', 16, 1); RETURN;
    END;

    -- UPDATE
    IF @del = 1 AND @ins = 1
       AND EXISTS (SELECT 1 FROM deleted d JOIN inserted i ON d.IdKurier = i.IdKurier
                   WHERE d.Stanowisko = 'DYREKTOR' AND ISNULL(i.Stanowisko, '') <> 'DYREKTOR')
    BEGIN
        ROLLBACK; RAISERROR ('Nie wolno zmienic stanowiska dyrektora', 16, 1); RETURN;
    END;

    -- INSERT (@{wyzwalacz AFTER: nowe wiersze już są w tabeli|AFTER trigger: new rows are already in the table|триггер AFTER: новые строки уже в таблице})
    IF @ins = 1 AND @del = 0
       AND EXISTS (SELECT 1 FROM inserted i
                   JOIN Kurier k ON k.Nazwisko = i.Nazwisko AND k.IdOddzial = i.IdOddzial
                                AND k.IdKurier <> i.IdKurier)
    BEGIN
        ROLLBACK; RAISERROR ('W tym oddziale jest juz kurier o tym nazwisku', 16, 1); RETURN;
    END;
END;` },

  's06-07': { lang: 'mssql', code: `
CREATE TRIGGER TR_Kurier_Limity ON Kurier
FOR UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted i JOIN deleted d ON i.IdKurier = d.IdKurier
               WHERE i.Pensja > d.Pensja * 1.2)
    BEGIN
        ROLLBACK; RAISERROR ('Podwyzka wieksza niz 20%% jest zabroniona', 16, 1); RETURN;   -- @{%% = znak %|%% = a % sign|%% = знак %}
    END;
    IF NOT EXISTS (SELECT 1 FROM inserted)
       AND EXISTS (SELECT 1 FROM deleted WHERE IdOddzial = 10)
    BEGIN
        ROLLBACK; RAISERROR ('Z centrali (oddzial 10) nie wolno usuwac', 16, 1); RETURN;
    END;
END;` },

  /* ================= Zadania 7: indeksy i transakcje ================= */
  's07-02': { lang: 'mssql', code: `
-- @{Włącz plan: Ctrl+M (Include Actual Execution Plan)|Turn on the plan: Ctrl+M (Include Actual Execution Plan)|Включи план: Ctrl+M (Include Actual Execution Plan)}
SELECT * FROM Odczyty WHERE Czujnik = 777;
-- @{Oczekiwane: Table Scan; zapisz Estimated Subtree Cost operacji SELECT|Expected: Table Scan; note the Estimated Subtree Cost of the SELECT operator|Ожидается: Table Scan; запиши Estimated Subtree Cost оператора SELECT}` },

  's07-03': { lang: 'mssql', code: `
CREATE NONCLUSTERED INDEX ix_czujnik ON Odczyty (Czujnik);
SELECT * FROM Odczyty WHERE Czujnik = 777;
-- @{Oczekiwane: Index Seek + RID Lookup, koszt wielokrotnie mniejszy|Expected: Index Seek + RID Lookup, cost many times lower|Ожидается: Index Seek + RID Lookup, стоимость во много раз меньше}
DROP INDEX ix_czujnik ON Odczyty;` },

  's07-04': { lang: 'mssql', code: `
SELECT Czujnik, Wartosc FROM Odczyty WHERE Czujnik = 777;     -- @{przed: Table Scan|before: Table Scan|до: Table Scan}
CREATE INDEX ix_cz_wart ON Odczyty (Czujnik, Wartosc);         -- @{kolejność kolumn ważna!|column order matters!|порядок столбцов важен!}
SELECT Czujnik, Wartosc FROM Odczyty WHERE Czujnik = 777;
-- @{Po: tylko Index Seek → SELECT. Serwer nie czyta stron z danymi.|After: only Index Seek → SELECT. The server does not read data pages.|После: только Index Seek → SELECT. Сервер не читает страницы данных.}
DROP INDEX ix_cz_wart ON Odczyty;` },

  's07-05': { lang: 'mssql', code: `
SELECT * FROM Odczyty WHERE Czujnik BETWEEN 30000 AND 45000;   -- Table Scan

CREATE NONCLUSTERED INDEX ix_czujnik ON Odczyty (Czujnik);
SELECT * FROM Odczyty WHERE Czujnik BETWEEN 30000 AND 45000;
-- @{Zapewne nadal Table Scan: ~30% wierszy – Lookup dla każdego byłby droższy|Probably still a Table Scan: ~30% of rows – a Lookup for each would cost more|Скорее всего всё ещё Table Scan: ~30% строк – Lookup для каждой был бы дороже}
DROP INDEX ix_czujnik ON Odczyty;

CREATE CLUSTERED INDEX cx_czujnik ON Odczyty (Czujnik);
SELECT * FROM Odczyty WHERE Czujnik BETWEEN 30000 AND 45000;
-- @{Clustered Index Seek: wiersze leżą obok siebie → tani odczyt zakresu|Clustered Index Seek: rows lie next to each other → cheap range read|Clustered Index Seek: строки лежат рядом → дешёвое чтение диапазона}
DROP INDEX cx_czujnik ON Odczyty;` },

  's07-06': { lang: 'mssql', code: `
SELECT * FROM Odczyty ORDER BY Czujnik;          -- Table Scan + Sort (@{drogi|expensive|дорого})

CREATE NONCLUSTERED INDEX ix_czujnik ON Odczyty (Czujnik);
SELECT * FROM Odczyty ORDER BY Czujnik;          -- @{zwykle bez zmian (SELECT * wymaga wszystkich kolumn)|usually no change (SELECT * needs all columns)|обычно без изменений (SELECT * нужны все столбцы)}
DROP INDEX ix_czujnik ON Odczyty;

CREATE CLUSTERED INDEX cx_czujnik ON Odczyty (Czujnik);
SELECT * FROM Odczyty ORDER BY Czujnik;          -- Clustered Index Scan, @{bez Sort|no Sort|без Sort}
DROP INDEX cx_czujnik ON Odczyty;` },

  's07-07': { lang: 'mssql', code: `
SET IMPLICIT_TRANSACTIONS ON;
INSERT INTO Konto VALUES (1, 'Ala', 1000);
INSERT INTO Konto VALUES (2, 'Olek', 500);
SELECT * FROM Konto;        -- @{2 wiersze (widzę własne zmiany)|2 rows (I see my own changes)|2 строки (вижу свои изменения)}
ROLLBACK;
SELECT * FROM Konto;        -- @{pusto|empty|пусто}
INSERT INTO Konto VALUES (3, 'Ula', 700);
COMMIT;
SELECT * FROM Konto;        -- @{1 wiersz|1 row|1 строка}` },

  's07-08': { lang: 'mssql', code: `
SET IMPLICIT_TRANSACTIONS OFF;   -- @{autocommit: każde polecenie zatwierdza się samo|autocommit: each statement commits itself|автокоммит: каждая команда подтверждается сама}
INSERT INTO Konto VALUES (4, 'Ewa', 100);
ROLLBACK;   -- @{błąd: „no corresponding BEGIN TRANSACTION” – nie ma czego wycofać|error: "no corresponding BEGIN TRANSACTION" – nothing to roll back|ошибка: «no corresponding BEGIN TRANSACTION» – нечего откатывать}
SELECT * FROM Konto;             -- @{Ewa została|Ewa stayed|Ewa осталась}
SET IMPLICIT_TRANSACTIONS ON;    -- @{wróć do trybu ręcznego|back to manual mode|вернуть ручной режим}
COMMIT;` },

  's07-09-a': { lang: 'mssql', title: '@{Okno 1|Window 1|Окно 1}', code: `
SET IMPLICIT_TRANSACTIONS ON;
COMMIT;
UPDATE Konto SET Saldo = Saldo - 50 WHERE Id = 3;    -- @{blokada X na wierszu|X lock on the row|блокировка X на строке}
-- @{… teraz przejdź do okna 2 …|… now switch to window 2 …|… теперь перейди в окно 2 …}
COMMIT;                                             -- @{po tym okno 2 dostaje wynik|after this window 2 gets its result|после этого окно 2 получит результат}` },

  's07-09-b': { lang: 'mssql', title: '@{Okno 2|Window 2|Окно 2}', code: `
SET IMPLICIT_TRANSACTIONS ON;
COMMIT;
SELECT * FROM Konto;    -- @{czeka (READ COMMITTED + blokada X z okna 1)|waits (READ COMMITTED + X lock from window 1)|ждёт (READ COMMITTED + блокировка X из окна 1)}` },

  's07-10': { lang: 'mssql', title: '@{Okno 2 – brudny odczyt|Window 2 – dirty read|Окно 2 – грязное чтение}', code: `
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
COMMIT;                  -- @{poziom działa od następnej transakcji|the level applies from the next transaction|уровень действует со следующей транзакции}
SELECT * FROM Konto;     -- @{widać NIEZATWIERDZONĄ zmianę z okna 1 (bez czekania)|the UNCOMMITTED change from window 1 is visible (no waiting)|видно НЕПОДТВЕРЖДЁННОЕ изменение из окна 1 (без ожидания)}
-- @{Jeśli okno 1 zrobi ROLLBACK – przeczytaliśmy dane, których „nigdy nie było”.|If window 1 does ROLLBACK – we read data that "never existed".|Если окно 1 сделает ROLLBACK – мы прочитали данные, которых «никогда не было».}
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;` },

  's07-11': { lang: 'mssql', code: `
-- @{W OBU oknach:|In BOTH windows:|В ОБОИХ окнах:}
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET IMPLICIT_TRANSACTIONS ON;
COMMIT;
SELECT * FROM Konto;

-- @{Okno 1:|Window 1:|Окно 1:}
INSERT INTO Konto VALUES (10, 'Nowy', 0);
-- @{czeka, aż okno 2 zrobi COMMIT – SELECT w oknie 2 zablokował zakres (brak fantomów).|waits until window 2 does COMMIT – the SELECT in window 2 locked the range (no phantoms).|ждёт, пока окно 2 сделает COMMIT – SELECT в окне 2 заблокировал диапазон (нет фантомов).}
-- @{Przy READ COMMITTED INSERT wykonałby się od razu (fantom).|With READ COMMITTED the INSERT would run at once (phantom).|При READ COMMITTED INSERT выполнился бы сразу (фантом).}` },

  /* ================= Zadania 8: pliki, backup, uprawnienia ================= */
  's08-01': { lang: 'mssql', code: `
CREATE DATABASE Treningowa;     -- @{albo: prawy klik Databases → New Database|or: right-click Databases → New Database|или: правый клик Databases → New Database}
GO
SELECT name, physical_name, size * 8 / 1024 AS MB
FROM   Treningowa.sys.database_files;       -- @{gdzie leżą .mdf i .ldf|where the .mdf and .ldf live|где лежат .mdf и .ldf}` },

  's08-02': { lang: 'mssql', code: `
ALTER DATABASE Treningowa ADD FILEGROUP Archiwum;
ALTER DATABASE Treningowa ADD FILE (
    NAME = Treningowa_arch,
    FILENAME = 'C:\\SBD\\Treningowa_arch.ndf'     -- @{katalog musi istnieć|the folder must exist|папка должна существовать}
) TO FILEGROUP Archiwum;` },

  's08-03': { lang: 'mssql', code: `
USE Treningowa;
-- @{Nowa tabela od razu w grupie Archiwum:|A new table directly in the Archiwum filegroup:|Новая таблица сразу в группе Archiwum:}
CREATE TABLE Archiwum_Wyp (IdWyp INT PRIMARY KEY, DataOd DATE, DataDo DATE) ON Archiwum;
-- @{Istniejącą tabelę najłatwiej przenieść w GUI: Design → Properties → Regular Data Space → Filegroup.|An existing table is easiest to move in the GUI: Design → Properties → Regular Data Space → Filegroup.|Существующую таблицу проще перенести в GUI: Design → Properties → Regular Data Space → Filegroup.}` },

  's08-04': { lang: 'mssql', code: `
ALTER DATABASE Treningowa SET RECOVERY FULL;
SELECT name, recovery_model_desc FROM sys.databases WHERE name = 'Treningowa';` },

  's08-05': { lang: 'mssql', code: `
USE master;
BACKUP DATABASE Treningowa TO DISK = 'C:\\SBD\\treningowa_full.bak';
DROP DATABASE Treningowa;
RESTORE DATABASE Treningowa FROM DISK = 'C:\\SBD\\treningowa_full.bak';   -- @{domyślnie WITH RECOVERY|WITH RECOVERY by default|по умолчанию WITH RECOVERY}` },

  's08-06': { lang: 'mssql', code: `
BACKUP DATABASE Treningowa TO DISK = 'C:\\SBD\\t_full.bak';
-- @{… zmiana 1 (np. INSERT) …|… change 1 (e.g. INSERT) …|… изменение 1 (напр. INSERT) …}
BACKUP DATABASE Treningowa TO DISK = 'C:\\SBD\\t_diff.bak' WITH DIFFERENTIAL;
-- @{… zmiana 2 …|… change 2 …|… изменение 2 …}
BACKUP LOG Treningowa TO DISK = 'C:\\SBD\\t_log.bak';

USE master;
DROP DATABASE Treningowa;
RESTORE DATABASE Treningowa FROM DISK = 'C:\\SBD\\t_full.bak' WITH NORECOVERY;
RESTORE DATABASE Treningowa FROM DISK = 'C:\\SBD\\t_diff.bak' WITH NORECOVERY;
RESTORE LOG      Treningowa FROM DISK = 'C:\\SBD\\t_log.bak'  WITH RECOVERY;   -- @{ostatnia: RECOVERY|last one: RECOVERY|последняя: RECOVERY}` },

  's08-07': { lang: 'mssql', code: `
BACKUP DATABASE Treningowa TO DISK = 'C:\\SBD\\p_full.bak';
-- @{… zmiana o znanej godzinie, np. przypadkowy DELETE o 14:30:15 …|… a change at a known time, e.g. an accidental DELETE at 14:30:15 …|… изменение в известное время, напр. случайный DELETE в 14:30:15 …}
BACKUP LOG Treningowa TO DISK = 'C:\\SBD\\p_log.bak';

USE master;
RESTORE DATABASE Treningowa FROM DISK = 'C:\\SBD\\p_full.bak' WITH NORECOVERY, REPLACE;
RESTORE LOG Treningowa FROM DISK = 'C:\\SBD\\p_log.bak'
WITH STOPAT = '2026-11-20 14:30:00', RECOVERY;    -- @{tuż PRZED zmianą, ale po kopii pełnej|just BEFORE the change, but after the full backup|прямо ПЕРЕД изменением, но после полной копии}` },

  's08-08': { lang: 'mssql', code: `
CREATE LOGIN kasjer WITH PASSWORD = 'Kasjer!2026',
     CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;     -- @{bez polityki haseł (tylko do ćwiczeń!)|no password policy (practice only!)|без политики паролей (только для учёбы!)}
-- @{Test: nowe okno SSMS → SQL Server Authentication → kasjer. Bazy Treningowa jeszcze nie otworzysz.|Test: new SSMS window → SQL Server Authentication → kasjer. You cannot open Treningowa yet.|Проверка: новое окно SSMS → SQL Server Authentication → kasjer. Базу Treningowa пока не откроешь.}` },

  's08-09': { lang: 'mssql', code: `
USE Treningowa;
CREATE USER kasjer FOR LOGIN kasjer;
-- @{Teraz kasjer „wejdzie” do bazy, ale SELECT na tabelach dalej zwróci błąd uprawnień.|Now kasjer can "enter" the database, but SELECT on tables still returns a permission error.|Теперь kasjer «войдёт» в базу, но SELECT по таблицам всё ещё даст ошибку прав.}` },

  's08-10': { lang: 'mssql', code: `
GRANT SELECT, UPDATE ON dbo.Klient TO kasjer;

-- @{Szybki test bez drugiego okna (dodatek autora):|Quick test without a second window (author's addition):|Быстрая проверка без второго окна (дополнение автора):}
EXECUTE AS USER = 'kasjer';
    SELECT * FROM dbo.Klient;              -- OK
    UPDATE dbo.Klient SET Rabat = 5 WHERE IdKlient = 2;   -- OK
    DELETE FROM dbo.Klient WHERE IdKlient = 9;            -- @{błąd: brak uprawnienia DELETE|error: no DELETE permission|ошибка: нет права DELETE}
REVERT;` },

  's08-11': { lang: 'mssql', code: `
CREATE ROLE magazynierzy;
ALTER ROLE magazynierzy ADD MEMBER kasjer;
GRANT SELECT, INSERT ON dbo.Auto TO magazynierzy;

EXECUTE AS USER = 'kasjer';
    SELECT * FROM dbo.Auto;                -- @{OK – prawo z roli|OK – permission from the role|OK – право из роли}
REVERT;` },

  's08-12': { lang: 'mssql', code: `
DENY  SELECT ON dbo.Auto TO magazynierzy;   -- @{zakaz na roli|deny on the role|запрет на роли}
GRANT SELECT ON dbo.Auto TO kasjer;         -- @{zgoda na użytkowniku|grant on the user|разрешение на пользователе}

EXECUTE AS USER = 'kasjer';
    SELECT * FROM dbo.Auto;                -- @{BŁĄD: DENY jest silniejsze niż GRANT|ERROR: DENY is stronger than GRANT|ОШИБКА: DENY сильнее GRANT}
REVERT;` },

  /* ================= Zadania 9: PL/SQL podstawy ================= */
  's09-01': { lang: 'oracle', code: `
SET SERVEROUTPUT ON;
DECLARE
    v_ile INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_ile FROM Kurier WHERE Premia IS NOT NULL;
    DBMS_OUTPUT.PUT_LINE('Premie ma ' || v_ile || ' kurierow');   -- 5
END;
/` },

  's09-02': { lang: 'oracle', code: `
DECLARE
    v_ile INTEGER;
    v_id  INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_ile FROM Kurier WHERE IdOddzial = 20;
    IF v_ile < 6 THEN
        SELECT NVL(MAX(IdKurier), 0) + 1 INTO v_id FROM Kurier;
        INSERT INTO Kurier (IdKurier, Nazwisko, Stanowisko, IdSzef, DataZatrudnienia, Pensja, IdOddzial)
        VALUES (v_id, 'NOWICKA', 'KURIER', 101, SYSDATE, 2600, 20);
        DBMS_OUTPUT.PUT_LINE('Zatrudniono NOWICKA, id = ' || v_id);
    ELSE
        DBMS_OUTPUT.PUT_LINE('Oddzial 20 ma komplet - nikogo nie zatrudniono');
    END IF;
END;
/` },

  's09-03': { lang: 'oracle', code: `
CREATE OR REPLACE PROCEDURE Dodaj_Oddzial (p_id INTEGER, p_nazwa VARCHAR2, p_miasto VARCHAR2)
AS
    v_ile INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_ile FROM Oddzial WHERE Nazwa = p_nazwa;
    IF v_ile > 0 THEN
        RAISE_APPLICATION_ERROR(-20010, 'Oddzial o nazwie ' || p_nazwa || ' juz istnieje');
    END IF;

    SELECT COUNT(*) INTO v_ile FROM Oddzial WHERE Miasto = p_miasto;
    IF v_ile > 0 THEN
        DBMS_OUTPUT.PUT_LINE('W miescie ' || p_miasto || ' jest juz oddzial - nic nie dodano');
    ELSE
        INSERT INTO Oddzial VALUES (p_id, p_nazwa, p_miasto);
        DBMS_OUTPUT.PUT_LINE('Dodano oddzial ' || p_nazwa);
    END IF;
END;
/
CALL Dodaj_Oddzial(50, 'WSCHOD', 'LUBLIN');     -- @{doda|adds|добавит}
CALL Dodaj_Oddzial(60, 'NOWY', 'KRAKOW');       -- @{komunikat|message|сообщение}
CALL Dodaj_Oddzial(70, 'POLNOC', 'OLSZTYN');    -- @{błąd -20010|error -20010|ошибка -20010}` },

  's09-04': { lang: 'oracle', code: `
CREATE OR REPLACE PROCEDURE Zatrudnij (p_idOddzial INTEGER, p_nazwisko VARCHAR2)
AS
    v_ile    INTEGER;
    v_pensja Kurier.Pensja%TYPE;
    v_id     Kurier.IdKurier%TYPE;
BEGIN
    SELECT COUNT(*) INTO v_ile FROM Oddzial WHERE IdOddzial = p_idOddzial;
    IF v_ile = 0 THEN
        RAISE_APPLICATION_ERROR(-20011, 'Nie istnieje oddzial ' || p_idOddzial);
    END IF;

    SELECT NVL(ROUND(AVG(Pensja)), 2500) INTO v_pensja     -- @{AVG z pustego zbioru = NULL|AVG of an empty set = NULL|AVG пустого набора = NULL}
    FROM   Kurier WHERE IdOddzial = p_idOddzial;
    SELECT NVL(MAX(IdKurier), 0) + 1 INTO v_id FROM Kurier;

    INSERT INTO Kurier (IdKurier, Nazwisko, Stanowisko, DataZatrudnienia, Pensja, IdOddzial)
    VALUES (v_id, p_nazwisko, 'KURIER', SYSDATE, v_pensja, p_idOddzial);
    DBMS_OUTPUT.PUT_LINE('Zatrudniono ' || p_nazwisko || ' (id ' || v_id || '), pensja ' || v_pensja);
END;
/
CALL Zatrudnij(30, 'SOWA');     -- @{pensja = średnia w oddziale 30|salary = average in branch 30|зарплата = средняя в отделе 30}
CALL Zatrudnij(99, 'WILK');     -- ORA-20011` },

  's09-05': { lang: 'oracle', code: `
DECLARE
    v_id    INTEGER;
    v_sztuk INTEGER;
BEGIN
    SELECT MAX(Sztuk) INTO v_sztuk FROM Regal;
    SELECT MIN(IdPolki) INTO v_id FROM Regal WHERE Sztuk = v_sztuk;   -- @{jedna półka nawet przy remisie|one shelf even on a tie|одна полка даже при равенстве}
    IF v_sztuk >= 3 THEN
        UPDATE Regal SET Sztuk = Sztuk - 3 WHERE IdPolki = v_id;
        DBMS_OUTPUT.PUT_LINE('Wydano 3 szt. z polki ' || v_id);         -- @{półka 6 (Woda)|shelf 6 (Woda)|полка 6 (Woda)}
    ELSE
        RAISE_APPLICATION_ERROR(-20020, 'Za malo towaru na polce ' || v_id);
    END IF;
END;
/` },

  /* ================= Zadania 10: PL/SQL kursory ================= */
  's10-01': { lang: 'oracle', code: `
DECLARE
    CURSOR k IS SELECT IdKurier, Nazwisko, Pensja FROM Kurier;
    v_id   Kurier.IdKurier%TYPE;
    v_nazw Kurier.Nazwisko%TYPE;
    v_p    Kurier.Pensja%TYPE;
    v_nowa Kurier.Pensja%TYPE;
BEGIN
    OPEN k;
    LOOP
        FETCH k INTO v_id, v_nazw, v_p;
        EXIT WHEN k%NOTFOUND;
        v_nowa := NULL;                          -- @{zeruj w każdym obrocie!|reset in every iteration!|сбрасывай на каждой итерации!}
        IF v_p < 2300 THEN
            v_nowa := ROUND(v_p * 1.08);
        ELSIF v_p > 6000 THEN
            v_nowa := ROUND(v_p * 0.97);
        END IF;
        IF v_nowa IS NOT NULL THEN
            UPDATE Kurier SET Pensja = v_nowa WHERE IdKurier = v_id;
            DBMS_OUTPUT.PUT_LINE(v_nazw || ': ' || v_p || ' -> ' || v_nowa);
        END IF;
    END LOOP;
    CLOSE k;
END;
/` },

  's10-02': { lang: 'oracle', code: `
CREATE OR REPLACE PROCEDURE Koryguj (
    p_dolny   NUMBER,
    p_gorny   NUMBER,
    p_podw    NUMBER DEFAULT 8,
    p_obn     NUMBER DEFAULT 3
) AS
    CURSOR k IS SELECT IdKurier, Nazwisko, Pensja FROM Kurier
                WHERE  Pensja < p_dolny OR Pensja > p_gorny;
    v_nowa NUMBER;
BEGIN
    FOR r IN k LOOP
        IF r.Pensja < p_dolny THEN
            v_nowa := ROUND(r.Pensja * (1 + p_podw / 100));
        ELSE
            v_nowa := ROUND(r.Pensja * (1 - p_obn / 100));
        END IF;
        UPDATE Kurier SET Pensja = v_nowa WHERE IdKurier = r.IdKurier;
        DBMS_OUTPUT.PUT_LINE(r.Nazwisko || ': ' || r.Pensja || ' -> ' || v_nowa);
    END LOOP;
END;
/
CALL Koryguj(2300, 6000);
CALL Koryguj(p_dolny => 3000, p_gorny => 5000, p_obn => 1);` },

  's10-03': { lang: 'oracle', code: `
CREATE OR REPLACE PROCEDURE Premia_Ponizej_Sredniej (p_idOddzial INTEGER)
AS
    v_avg NUMBER;
BEGIN
    SELECT AVG(Pensja) INTO v_avg FROM Kurier WHERE IdOddzial = p_idOddzial;
    UPDATE Kurier
    SET    Premia = NVL(Premia, 0) + 150             -- @{NULL + 150 = NULL, stąd NVL|NULL + 150 = NULL, hence NVL|NULL + 150 = NULL, поэтому NVL}
    WHERE  IdOddzial = p_idOddzial AND Pensja < v_avg;
    DBMS_OUTPUT.PUT_LINE('Premie podniesiono ' || SQL%ROWCOUNT || ' osobom');
END;
/
CALL Premia_Ponizej_Sredniej(20);` },

  's10-04': { lang: 'oracle', code: `
CREATE OR REPLACE PROCEDURE Wydaj (p_ile INTEGER)
AS
    v_id    INTEGER;
    v_sztuk INTEGER;
BEGIN
    SELECT MAX(Sztuk) INTO v_sztuk FROM Regal;
    SELECT MIN(IdPolki) INTO v_id FROM Regal WHERE Sztuk = v_sztuk;
    IF v_sztuk < p_ile THEN                                -- @{porównujemy STAN, nie numer półki!|compare the STOCK, not the shelf number!|сравниваем ОСТАТОК, а не номер полки!}
        RAISE_APPLICATION_ERROR(-20021, 'Na polce ' || v_id || ' jest tylko ' || v_sztuk || ' szt.');
    END IF;
    UPDATE Regal SET Sztuk = Sztuk - p_ile WHERE IdPolki = v_id;
    DBMS_OUTPUT.PUT_LINE('Wydano ' || p_ile || ' szt. z polki ' || v_id);
END;
/
CALL Wydaj(10);
CALL Wydaj(1000);    -- ORA-20021` },

  's10-05': { lang: 'oracle', code: `
DECLARE
    CURSOR k IS SELECT Nazwisko, Pensja FROM Kurier FOR UPDATE OF Pensja;
    v_nowa NUMBER;
BEGIN
    FOR r IN k LOOP                             -- @{OPEN/FETCH/EXIT/CLOSE automatycznie|OPEN/FETCH/EXIT/CLOSE automatically|OPEN/FETCH/EXIT/CLOSE автоматически}
        v_nowa := NULL;
        IF r.Pensja < 2300 THEN
            v_nowa := ROUND(r.Pensja * 1.08);
        ELSIF r.Pensja > 6000 THEN
            v_nowa := ROUND(r.Pensja * 0.97);
        END IF;
        IF v_nowa IS NOT NULL THEN
            UPDATE Kurier SET Pensja = v_nowa WHERE CURRENT OF k;
            DBMS_OUTPUT.PUT_LINE(r.Nazwisko || ': ' || r.Pensja || ' -> ' || v_nowa);
        END IF;
    END LOOP;
END;
/` },

  's10-06': { lang: 'oracle', code: `
DECLARE
    CURSOR k (p_odd INTEGER) IS
        SELECT Nazwisko, Pensja FROM Kurier
        WHERE  IdOddzial = p_odd
        ORDER  BY Pensja DESC;
    r k%ROWTYPE;
BEGIN
    OPEN k(30);
    LOOP
        FETCH k INTO r;
        EXIT WHEN k%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE(k%ROWCOUNT || '. ' || r.Nazwisko || ' ' || r.Pensja);
    END LOOP;
    CLOSE k;
END;
/` },

  /* ================= Zadania 11: PL/SQL wyzwalacze ================= */
  's11-01': { lang: 'oracle', code: `
CREATE OR REPLACE TRIGGER oddzial_no_delete
BEFORE DELETE ON Oddzial                 -- @{poziom instrukcji wystarczy|statement level is enough|уровня инструкции достаточно}
BEGIN
    RAISE_APPLICATION_ERROR(-20100, 'Oddzialow nie wolno usuwac');
END;
/
DELETE FROM Oddzial WHERE IdOddzial = 40;   -- ORA-20100` },

  's11-02': { lang: 'oracle', code: `
CREATE OR REPLACE TRIGGER kurier_min_pensja
BEFORE INSERT OR UPDATE OF Pensja ON Kurier
FOR EACH ROW                             -- @{bez tego nie ma :NEW (częsty błąd!)|without this there is no :NEW (common mistake!)|без этого нет :NEW (частая ошибка!)}
BEGIN
    IF :NEW.Pensja < 2000 THEN
        RAISE_APPLICATION_ERROR(-20110, 'Pensja nie moze byc nizsza niz 2000');
    END IF;
END;
/
UPDATE Kurier SET Pensja = 1900 WHERE IdKurier = 111;   -- ORA-20110` },

  's11-03': { lang: 'oracle', code: `
CREATE TABLE FunduszPlac (Suma INTEGER NOT NULL, Liczba INTEGER NOT NULL);
INSERT INTO FunduszPlac SELECT SUM(Pensja), COUNT(*) FROM Kurier;
COMMIT;

CREATE OR REPLACE TRIGGER kurier_fundusz
AFTER INSERT OR UPDATE OF Pensja OR DELETE ON Kurier
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        UPDATE FunduszPlac SET Suma = Suma + NVL(:NEW.Pensja, 0), Liczba = Liczba + 1;
    ELSIF UPDATING THEN
        UPDATE FunduszPlac SET Suma = Suma + NVL(:NEW.Pensja, 0) - NVL(:OLD.Pensja, 0);
    ELSE
        UPDATE FunduszPlac SET Suma = Suma - NVL(:OLD.Pensja, 0), Liczba = Liczba - 1;
    END IF;
END;
/
-- @{Zmieniamy INNĄ tabelę (FunduszPlac) – to w wyzwalaczu wierszowym wolno.|We change ANOTHER table (FunduszPlac) – that is allowed in a row trigger.|Меняем ДРУГУЮ таблицу (FunduszPlac) – в строчном триггере это разрешено.}` },

  's11-04': { lang: 'oracle', code: `
CREATE OR REPLACE TRIGGER kurier_reguly
BEFORE INSERT OR UPDATE OR DELETE ON Kurier
FOR EACH ROW
DECLARE
    v_ile INTEGER;
BEGIN
    IF DELETING THEN
        IF :OLD.Stanowisko IN ('KIEROWNIK', 'DYREKTOR') THEN
            RAISE_APPLICATION_ERROR(-20101, 'Nie wolno usuwac kadry kierowniczej');
        END IF;
    ELSIF UPDATING THEN
        IF :OLD.DataZatrudnienia <> :NEW.DataZatrudnienia THEN
            RAISE_APPLICATION_ERROR(-20102, 'Nie wolno zmieniac daty zatrudnienia');
        END IF;
    ELSIF INSERTING THEN
        SELECT COUNT(*) INTO v_ile FROM Kurier
        WHERE  Nazwisko = :NEW.Nazwisko AND IdOddzial = :NEW.IdOddzial;
        IF v_ile > 0 THEN
            RAISE_APPLICATION_ERROR(-20103, 'W tym oddziale jest juz kurier o tym nazwisku');
        END IF;
    END IF;
END;
/
-- @{Czytanie tabeli Kurier przy INSERT zadziała dla INSERT … VALUES (1 wiersz),|Reading Kurier on INSERT works for INSERT … VALUES (1 row),|Чтение Kurier при INSERT сработает для INSERT … VALUES (1 строка),}
-- @{ale INSERT … SELECT (wiele wierszy) da ORA-04091 (tabela mutująca).|but INSERT … SELECT (many rows) gives ORA-04091 (mutating table).|но INSERT … SELECT (много строк) даст ORA-04091 (мутирующая таблица).}` },

  's11-05': { lang: 'oracle', code: `
CREATE OR REPLACE TRIGGER kurier_ochrona
BEFORE UPDATE OF Premia OR DELETE ON Kurier
FOR EACH ROW
BEGIN
    IF DELETING THEN
        IF :OLD.IdOddzial = 10 THEN
            RAISE_APPLICATION_ERROR(-20104, 'Z centrali nie wolno usuwac');
        END IF;
    ELSIF NVL(:NEW.Premia, 0) < NVL(:OLD.Premia, 0) THEN
        RAISE_APPLICATION_ERROR(-20105, 'Nie wolno obnizac premii');
    END IF;
END;
/
UPDATE Kurier SET Premia = 100 WHERE IdKurier = 104;   -- ORA-20105 (400 → 100)
DELETE FROM Kurier WHERE IdKurier = 112;               -- ORA-20104` },

  /* ================= Kolokwium 1 (T-SQL) – własne ================= */
  'k1-01': { lang: 'mssql', code: `
CREATE OR ALTER PROCEDURE Uzupelnij @nazwa VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @stan INT;
    SELECT @stan = Stan FROM Produkt WHERE Nazwa = @nazwa;   -- @{0 wierszy → @stan zostaje NULL|0 rows → @stan stays NULL|0 строк → @stan остаётся NULL}

    IF @stan IS NULL
    BEGIN
        RAISERROR ('Nie ma produktu o nazwie %s', 16, 1, @nazwa);
        RETURN;
    END;

    IF @stan < 5
        PRINT 'Krytycznie niski stan produktu ' + @nazwa + ' - zamow u dostawcy';
    ELSE
    BEGIN
        UPDATE Produkt SET Stan = Stan + 20 WHERE Nazwa = @nazwa;
        PRINT 'Dodano 20 szt. produktu ' + @nazwa;
    END;
END;
GO
EXEC Uzupelnij 'Kalosze';   -- @{niski stan (3)|low stock (3)|низкий остаток (3)}
EXEC Uzupelnij 'Parasol';   -- +20
EXEC Uzupelnij 'Rower';     -- @{błąd|error|ошибка}` },

  'k1-02': { lang: 'mssql', code: `
CREATE OR ALTER TRIGGER TR_Produkt ON Produkt
FOR INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted i JOIN deleted d ON i.IdProdukt = d.IdProdukt
               WHERE i.Nazwa <> d.Nazwa)
    BEGIN ROLLBACK; RAISERROR ('Nie wolno zmieniac nazwy produktu', 16, 1); RETURN; END;

    IF EXISTS (SELECT 1 FROM inserted i JOIN deleted d ON i.IdProdukt = d.IdProdukt
               WHERE i.Cena > d.Cena * 1.15)
    BEGIN ROLLBACK; RAISERROR ('Cena nie moze wzrosnac o wiecej niz 15%%', 16, 1); RETURN; END;

    IF EXISTS (SELECT 1 FROM inserted WHERE Stan < 0)
    BEGIN ROLLBACK; RAISERROR ('Stan nie moze byc ujemny', 16, 1); RETURN; END;

    -- @{informacja o zmianie ceny (STRING_AGG – od MS SQL 2017)|price change info (STRING_AGG – since MS SQL 2017)|информация об изменении цены (STRING_AGG – с MS SQL 2017)}
    DECLARE @info VARCHAR(400);
    SELECT @info = STRING_AGG(i.Nazwa + ': ' +
                   CAST(CAST((i.Cena - d.Cena) * 100 / d.Cena AS DECIMAL(6,2)) AS VARCHAR) + '%', ', ')
    FROM   inserted i JOIN deleted d ON i.IdProdukt = d.IdProdukt
    WHERE  i.Cena <> d.Cena;
    IF @info IS NOT NULL PRINT 'Zmiana ceny: ' + @info;
END;
GO
UPDATE Produkt SET Cena = Cena * 1.10 WHERE IdProdukt = 1;   -- OK, +10%
UPDATE Produkt SET Cena = Cena * 1.30 WHERE IdProdukt = 2;   -- @{błąd|error|ошибка}
UPDATE Produkt SET Stan = -1 WHERE IdProdukt = 3;            -- @{błąd|error|ошибка}` },

  'k1-03': { lang: 'mssql', code: `
CREATE OR ALTER PROCEDURE Podwyzka @id INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @pensja INT, @nazwisko VARCHAR(20);
    SELECT @pensja = Pensja, @nazwisko = Nazwisko FROM Kurier WHERE IdKurier = @id;

    IF @nazwisko IS NULL          -- @{0 wierszy → zmienne zostają NULL|0 rows → variables stay NULL|0 строк → переменные остаются NULL}
    BEGIN
        RAISERROR ('Nie ma kuriera o id %d', 16, 1, @id);
        RETURN;
    END;

    IF @pensja >= 7000
        PRINT @nazwisko + ' ma juz najwyzsza stawke - bez podwyzki';
    ELSE
    BEGIN
        UPDATE Kurier SET Pensja = Pensja + 300 WHERE IdKurier = @id;
        PRINT @nazwisko + ': nowa pensja ' + CAST(@pensja + 300 AS VARCHAR);
    END;
END;
GO
EXEC Podwyzka 100;   -- @{bez podwyżki (9000)|no raise (9000)|без прибавки (9000)}
EXEC Podwyzka 105;   -- 2800 → 3100
EXEC Podwyzka 999;   -- @{błąd|error|ошибка}` },

  'k1-04': { lang: 'mssql', code: `
CREATE OR ALTER TRIGGER TR_Kurier_Kontrola ON Kurier
FOR INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE Premia < 0 OR Premia > Pensja)
    BEGIN ROLLBACK; RAISERROR ('Premia musi byc w zakresie 0..pensja', 16, 1); RETURN; END;

    IF EXISTS (SELECT 1 FROM inserted i JOIN deleted d ON i.IdKurier = d.IdKurier
               WHERE i.DataZatrudnienia <> d.DataZatrudnienia)
    BEGIN ROLLBACK; RAISERROR ('Nie wolno zmieniac daty zatrudnienia', 16, 1); RETURN; END;

    IF EXISTS (SELECT 1 FROM inserted i JOIN deleted d ON i.IdKurier = d.IdKurier
               WHERE i.Pensja > d.Pensja * 1.20)
    BEGIN ROLLBACK; RAISERROR ('Pensja nie moze wzrosnac o wiecej niz 20%%', 16, 1); RETURN; END;

    -- @{Pensja jest INT, dlatego 100.0 – inaczej dzielenie całkowite|Pensja is INT, hence 100.0 – otherwise integer division|Pensja — INT, поэтому 100.0, иначе деление целочисленное}
    DECLARE @info VARCHAR(400);
    SELECT @info = STRING_AGG(i.Nazwisko + ': ' +
                   CAST(CAST((i.Pensja - d.Pensja) * 100.0 / d.Pensja AS DECIMAL(6,2)) AS VARCHAR) + '%', ', ')
    FROM   inserted i JOIN deleted d ON i.IdKurier = d.IdKurier
    WHERE  i.Pensja <> d.Pensja;
    IF @info IS NOT NULL PRINT 'Zmiana pensji: ' + @info;
END;
GO
UPDATE Kurier SET Pensja = Pensja * 1.1 WHERE IdKurier = 104;   -- OK, +10%
UPDATE Kurier SET Pensja = Pensja * 1.5 WHERE IdKurier = 105;   -- @{błąd|error|ошибка}
UPDATE Kurier SET Premia = 5000 WHERE IdKurier = 104;           -- @{błąd (premia > pensja)|error (bonus > salary)|ошибка (премия > зарплаты)}` },

  /* ================= Kolokwium 2 (PL/SQL) ================= */
  'k2-01': { lang: 'oracle', code: `
CREATE OR REPLACE PROCEDURE Uzupelnij (p_nazwa VARCHAR2)
AS
    v_stan Produkt.Stan%TYPE;
BEGIN
    SELECT Stan INTO v_stan FROM Produkt WHERE Nazwa = p_nazwa;   -- @{brak wiersza → NO_DATA_FOUND|no row → NO_DATA_FOUND|нет строки → NO_DATA_FOUND}
    IF v_stan < 10 THEN
        DBMS_OUTPUT.PUT_LINE('Za malo produktu ' || p_nazwa || ' (' || v_stan || ' szt.) - najpierw zamowienie');
    ELSE
        UPDATE Produkt SET Stan = Stan + 25 WHERE Nazwa = p_nazwa;
        DBMS_OUTPUT.PUT_LINE('Dodano 25 szt. produktu ' || p_nazwa);
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20200, 'Nie ma produktu o nazwie ' || p_nazwa);
END;
/
CALL Uzupelnij('Czapka');    -- +25
CALL Uzupelnij('Plaszcz');   -- @{za mało (7)|too few (7)|мало (7)}
CALL Uzupelnij('Rower');     -- ORA-20200` },

  'k2-02': { lang: 'oracle', code: `
CREATE OR REPLACE TRIGGER produkt_kontrola
BEFORE INSERT OR UPDATE ON Produkt
FOR EACH ROW
DECLARE
    v_proc NUMBER(7,2);
BEGIN
    IF :NEW.Stan < 0 THEN
        RAISE_APPLICATION_ERROR(-20201, 'Stan nie moze byc ujemny');
    END IF;

    IF UPDATING THEN
        IF :NEW.Nazwa <> :OLD.Nazwa THEN
            RAISE_APPLICATION_ERROR(-20202, 'Nie wolno zmieniac nazwy produktu');
        END IF;
        IF :NEW.Cena <> :OLD.Cena THEN
            v_proc := (:NEW.Cena - :OLD.Cena) / :OLD.Cena * 100;
            DBMS_OUTPUT.PUT_LINE('Cena produktu ' || :NEW.Nazwa || ' zmienia sie o ' || v_proc || '%');
            IF v_proc < -25 THEN
                RAISE_APPLICATION_ERROR(-20203, 'Nie wolno obnizac ceny o wiecej niz 25%');
            END IF;
        END IF;
    END IF;
END;
/
UPDATE Produkt SET Cena = Cena * 0.9 WHERE IdProdukt = 1;   -- OK, -10%
UPDATE Produkt SET Cena = Cena * 0.5 WHERE IdProdukt = 3;   -- ORA-20203
UPDATE Produkt SET Nazwa = 'Kurtka' WHERE IdProdukt = 3;    -- ORA-20202` },

  'k2-03': { lang: 'oracle', code: `
CREATE OR REPLACE PROCEDURE Podwyzka (p_id Kurier.IdKurier%TYPE)
AS
    v_pensja   Kurier.Pensja%TYPE;
    v_nazwisko Kurier.Nazwisko%TYPE;
BEGIN
    SELECT Pensja, Nazwisko INTO v_pensja, v_nazwisko
    FROM   Kurier WHERE IdKurier = p_id;          -- @{brak wiersza → NO_DATA_FOUND|no row → NO_DATA_FOUND|нет строки → NO_DATA_FOUND}

    IF v_pensja >= 7000 THEN
        DBMS_OUTPUT.PUT_LINE(v_nazwisko || ' ma juz najwyzsza stawke - bez podwyzki');
    ELSE
        UPDATE Kurier SET Pensja = Pensja + 300 WHERE IdKurier = p_id;
        DBMS_OUTPUT.PUT_LINE(v_nazwisko || ': nowa pensja ' || (v_pensja + 300));
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20210, 'Nie ma kuriera o id ' || p_id);
END;
/
CALL Podwyzka(100);   -- @{bez podwyżki (9000)|no raise (9000)|без прибавки (9000)}
CALL Podwyzka(105);   -- 2800 → 3100
CALL Podwyzka(999);   -- ORA-20210` },

  'k2-04': { lang: 'oracle', code: `
CREATE OR REPLACE TRIGGER kurier_kontrola
BEFORE INSERT OR UPDATE ON Kurier
FOR EACH ROW
DECLARE
    v_proc NUMBER(7,2);
BEGIN
    IF :NEW.Premia < 0 OR :NEW.Premia > :NEW.Pensja THEN
        RAISE_APPLICATION_ERROR(-20211, 'Premia musi byc w zakresie 0..pensja');
    END IF;

    IF UPDATING THEN
        IF :NEW.DataZatrudnienia <> :OLD.DataZatrudnienia THEN
            RAISE_APPLICATION_ERROR(-20212, 'Nie wolno zmieniac daty zatrudnienia');
        END IF;
        IF :NEW.Pensja <> :OLD.Pensja THEN
            v_proc := (:NEW.Pensja - :OLD.Pensja) / :OLD.Pensja * 100;
            DBMS_OUTPUT.PUT_LINE('Pensja ' || :NEW.Nazwisko || ' zmienia sie o ' || v_proc || '%');
            IF v_proc > 20 THEN
                RAISE_APPLICATION_ERROR(-20213, 'Pensja nie moze wzrosnac o wiecej niz 20%');
            END IF;
        END IF;
    END IF;
END;
/
UPDATE Kurier SET Pensja = Pensja * 1.1 WHERE IdKurier = 104;   -- OK, +10%
UPDATE Kurier SET Pensja = Pensja * 1.5 WHERE IdKurier = 105;   -- ORA-20213
UPDATE Kurier SET Premia = 5000 WHERE IdKurier = 104;           -- ORA-20211` },

  /* ================= Projekt – przykład „Klub fitness” ================= */
  'proj-ddl-ora': {
    lang: 'oracle', title: '@{Przykładowy projekt „Klub fitness” – tabele i dane (Oracle)|Sample project "Fitness club" – tables and data (Oracle)|Пример проекта «Фитнес-клуб» – таблицы и данные (Oracle)}',
    code: `
CREATE TABLE Osoba (
    IdOsoba   INTEGER PRIMARY KEY,
    Imie      VARCHAR2(20) NOT NULL,
    Nazwisko  VARCHAR2(30) NOT NULL,
    Telefon   VARCHAR2(15) NOT NULL UNIQUE
);
CREATE TABLE Klubowicz (
    IdKlubowicz    INTEGER PRIMARY KEY,
    IdOsoba        INTEGER NOT NULL UNIQUE REFERENCES Osoba,
    DataDolaczenia DATE DEFAULT SYSDATE NOT NULL
);
CREATE TABLE Trener (
    IdTrener    INTEGER PRIMARY KEY,
    IdOsoba     INTEGER NOT NULL UNIQUE REFERENCES Osoba,
    Stawka      NUMBER(7,2) NOT NULL CHECK (Stawka > 0)
);
CREATE TABLE Sala (
    IdSala     INTEGER PRIMARY KEY,
    Nazwa      VARCHAR2(20) NOT NULL,
    Pojemnosc  INTEGER NOT NULL CHECK (Pojemnosc > 0)
);
CREATE TABLE Zajecia (
    IdZajecia  INTEGER PRIMARY KEY,
    Nazwa      VARCHAR2(30) NOT NULL,
    IdTrener   INTEGER NOT NULL REFERENCES Trener,
    IdSala     INTEGER NOT NULL REFERENCES Sala,
    Termin     TIMESTAMP NOT NULL,
    CzasMin    INTEGER DEFAULT 60 NOT NULL
);
CREATE TABLE Zapis (                                     -- @{M:N Zajecia–Klubowicz|M:N Zajecia–Klubowicz|M:N Zajecia–Klubowicz}
    IdZajecia    INTEGER REFERENCES Zajecia ON DELETE CASCADE,
    IdKlubowicz  INTEGER REFERENCES Klubowicz,
    PRIMARY KEY (IdZajecia, IdKlubowicz)
);
CREATE TABLE HistoriaStawek (
    IdTrener     INTEGER NOT NULL REFERENCES Trener,
    StaraStawka  NUMBER(7,2),
    NowaStawka   NUMBER(7,2),
    DataZmiany   DATE DEFAULT SYSDATE
);

INSERT INTO Osoba VALUES (1, 'Kasia', 'Mila', '500100100');
INSERT INTO Osoba VALUES (2, 'Robert', 'Silny', '500100200');
INSERT INTO Osoba VALUES (3, 'Iga', 'Zwinna', '500100300');
INSERT INTO Osoba VALUES (4, 'Leon', 'Szybki', '500100400');
INSERT INTO Klubowicz VALUES (1, 1, DATE '2026-01-10');
INSERT INTO Klubowicz VALUES (2, 4, DATE '2026-03-05');
INSERT INTO Trener VALUES (1, 2, 120);
INSERT INTO Trener VALUES (2, 3, 100);
INSERT INTO Sala VALUES (1, 'Duza', 20);
INSERT INTO Sala VALUES (2, 'Mala', 2);
INSERT INTO Zajecia VALUES (1, 'Joga', 2, 2, TIMESTAMP '2026-12-01 18:00:00', 60);
INSERT INTO Zajecia VALUES (2, 'Joga', 2, 1, TIMESTAMP '2026-12-08 18:00:00', 60);
INSERT INTO Zajecia VALUES (3, 'Crossfit', 1, 1, TIMESTAMP '2026-12-02 19:00:00', 45);
INSERT INTO Zapis VALUES (1, 1);
INSERT INTO Zapis VALUES (1, 2);       -- @{sala „Mala” – zajęcia 1 pełne (2/2)|room "Mala" – class 1 full (2/2)|зал «Mala» – занятие 1 заполнено (2/2)}
COMMIT;`
  },

  'proj-ddl-ms': {
    lang: 'mssql', title: '@{„Klub fitness” – tabele i dane (MS SQL)|"Fitness club" – tables and data (MS SQL)|«Фитнес-клуб» – таблицы и данные (MS SQL)}',
    code: `
CREATE TABLE Osoba (
    IdOsoba   INT PRIMARY KEY,
    Imie      VARCHAR(20) NOT NULL,
    Nazwisko  VARCHAR(30) NOT NULL,
    Telefon   VARCHAR(15) NOT NULL UNIQUE
);
CREATE TABLE Klubowicz (
    IdKlubowicz    INT PRIMARY KEY,
    IdOsoba        INT NOT NULL UNIQUE REFERENCES Osoba,
    DataDolaczenia DATE NOT NULL DEFAULT GETDATE()
);
CREATE TABLE Trener (
    IdTrener  INT PRIMARY KEY,
    IdOsoba   INT NOT NULL UNIQUE REFERENCES Osoba,
    Stawka    DECIMAL(7,2) NOT NULL CHECK (Stawka > 0)
);
CREATE TABLE Sala (
    IdSala     INT PRIMARY KEY,
    Nazwa      VARCHAR(20) NOT NULL,
    Pojemnosc  INT NOT NULL CHECK (Pojemnosc > 0)
);
CREATE TABLE Zajecia (
    IdZajecia  INT PRIMARY KEY,
    Nazwa      VARCHAR(30) NOT NULL,
    IdTrener   INT NOT NULL REFERENCES Trener,
    IdSala     INT NOT NULL REFERENCES Sala,
    Termin     DATETIME2 NOT NULL,
    CzasMin    INT NOT NULL DEFAULT 60
);
CREATE TABLE Zapis (
    IdZajecia    INT REFERENCES Zajecia ON DELETE CASCADE,
    IdKlubowicz  INT REFERENCES Klubowicz,
    PRIMARY KEY (IdZajecia, IdKlubowicz)
);
CREATE TABLE HistoriaStawek (
    IdTrener     INT NOT NULL REFERENCES Trener,
    StaraStawka  DECIMAL(7,2),
    NowaStawka   DECIMAL(7,2),
    DataZmiany   DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

INSERT INTO Osoba VALUES (1,'Kasia','Mila','500100100'),(2,'Robert','Silny','500100200'),
                         (3,'Iga','Zwinna','500100300'),(4,'Leon','Szybki','500100400');
INSERT INTO Klubowicz VALUES (1, 1, '2026-01-10'), (2, 4, '2026-03-05');
INSERT INTO Trener VALUES (1, 2, 120), (2, 3, 100);
INSERT INTO Sala VALUES (1, 'Duza', 20), (2, 'Mala', 2);
INSERT INTO Zajecia VALUES (1,'Joga',2,2,'2026-12-01 18:00',60),(2,'Joga',2,1,'2026-12-08 18:00',60),
                           (3,'Crossfit',1,1,'2026-12-02 19:00',45);
INSERT INTO Zapis VALUES (1, 1), (1, 2);`
  },

  'proj-p1-ora': {
    lang: 'oracle', title: '@{Procedura 1 (z kursorem): zapis na najbliższe wolne zajęcia|Procedure 1 (with a cursor): sign up for the nearest free class|Процедура 1 (с курсором): запись на ближайшее свободное занятие}',
    code: `
CREATE OR REPLACE PROCEDURE Zapisz_Na_Zajecia (
    p_imie VARCHAR2, p_nazwisko VARCHAR2, p_telefon VARCHAR2, p_zajecia VARCHAR2
) AS
    CURSOR k IS
        SELECT z.IdZajecia, z.Termin, s.Pojemnosc
        FROM   Zajecia z JOIN Sala s ON s.IdSala = z.IdSala
        WHERE  z.Nazwa = p_zajecia AND z.Termin > SYSTIMESTAMP
        ORDER  BY z.Termin;
    v_osoba  INTEGER;
    v_klub   INTEGER;
    v_zajete INTEGER;
    v_jest   INTEGER;
BEGIN
    -- @{1) osoba: znajdź po telefonie albo dodaj|1) person: find by phone or add|1) человек: найти по телефону или добавить}
    SELECT MAX(IdOsoba) INTO v_osoba FROM Osoba WHERE Telefon = p_telefon;   -- @{MAX: 0 wierszy → NULL, bez wyjątku|MAX: 0 rows → NULL, no exception|MAX: 0 строк → NULL, без исключения}
    IF v_osoba IS NULL THEN
        SELECT NVL(MAX(IdOsoba), 0) + 1 INTO v_osoba FROM Osoba;
        INSERT INTO Osoba VALUES (v_osoba, p_imie, p_nazwisko, p_telefon);
    END IF;
    -- @{2) klubowicz: znajdź albo dodaj|2) member: find or add|2) член клуба: найти или добавить}
    SELECT MAX(IdKlubowicz) INTO v_klub FROM Klubowicz WHERE IdOsoba = v_osoba;
    IF v_klub IS NULL THEN
        SELECT NVL(MAX(IdKlubowicz), 0) + 1 INTO v_klub FROM Klubowicz;
        INSERT INTO Klubowicz (IdKlubowicz, IdOsoba) VALUES (v_klub, v_osoba);
    END IF;
    -- @{3) pierwsze przyszłe zajęcia z wolnym miejscem|3) the first future class with a free seat|3) первое будущее занятие со свободным местом}
    FOR r IN k LOOP
        SELECT COUNT(*) INTO v_zajete FROM Zapis WHERE IdZajecia = r.IdZajecia;
        SELECT COUNT(*) INTO v_jest FROM Zapis WHERE IdZajecia = r.IdZajecia AND IdKlubowicz = v_klub;
        IF v_jest = 0 AND v_zajete < r.Pojemnosc THEN
            INSERT INTO Zapis VALUES (r.IdZajecia, v_klub);
            DBMS_OUTPUT.PUT_LINE('Zapisano na zajecia ' || p_zajecia || ' dnia ' || TO_CHAR(r.Termin, 'YYYY-MM-DD HH24:MI'));
            RETURN;
        END IF;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Brak wolnych miejsc na zajeciach ' || p_zajecia);
END;
/
CALL Zapisz_Na_Zajecia('Ola', 'Nowa', '500100500', 'Joga');   -- @{zajęcia 1 pełne → zapis na zajęcia 2|class 1 full → signed up for class 2|занятие 1 полное → запись на занятие 2}` },

  'proj-p1-ms': {
    lang: 'mssql', title: '@{Procedura 1 – wersja T-SQL|Procedure 1 – T-SQL version|Процедура 1 – версия T-SQL}',
    code: `
CREATE OR ALTER PROCEDURE Zapisz_Na_Zajecia
    @imie VARCHAR(20), @nazwisko VARCHAR(30), @telefon VARCHAR(15), @zajecia VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @osoba INT, @klub INT, @idZaj INT, @termin DATETIME2, @poj INT, @zajete INT;

    SELECT @osoba = IdOsoba FROM Osoba WHERE Telefon = @telefon;
    IF @osoba IS NULL
    BEGIN
        SELECT @osoba = ISNULL(MAX(IdOsoba), 0) + 1 FROM Osoba;
        INSERT INTO Osoba VALUES (@osoba, @imie, @nazwisko, @telefon);
    END;

    SELECT @klub = IdKlubowicz FROM Klubowicz WHERE IdOsoba = @osoba;
    IF @klub IS NULL
    BEGIN
        SELECT @klub = ISNULL(MAX(IdKlubowicz), 0) + 1 FROM Klubowicz;
        INSERT INTO Klubowicz (IdKlubowicz, IdOsoba) VALUES (@klub, @osoba);
    END;

    DECLARE k CURSOR FOR
        SELECT z.IdZajecia, z.Termin, s.Pojemnosc
        FROM   Zajecia z JOIN Sala s ON s.IdSala = z.IdSala
        WHERE  z.Nazwa = @zajecia AND z.Termin > SYSDATETIME()
        ORDER  BY z.Termin;
    OPEN k;
    FETCH NEXT FROM k INTO @idZaj, @termin, @poj;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SELECT @zajete = COUNT(*) FROM Zapis WHERE IdZajecia = @idZaj;
        IF @zajete < @poj
           AND NOT EXISTS (SELECT 1 FROM Zapis WHERE IdZajecia = @idZaj AND IdKlubowicz = @klub)
        BEGIN
            INSERT INTO Zapis VALUES (@idZaj, @klub);
            PRINT 'Zapisano na zajecia ' + @zajecia + ' dnia ' + CONVERT(VARCHAR(16), @termin, 120);
            BREAK;
        END;
        FETCH NEXT FROM k INTO @idZaj, @termin, @poj;
    END;
    IF @@FETCH_STATUS <> 0 PRINT 'Brak wolnych miejsc na zajeciach ' + @zajecia;
    CLOSE k;
    DEALLOCATE k;
END;
GO
EXEC Zapisz_Na_Zajecia 'Ola', 'Nowa', '500100500', 'Joga';` },

  'proj-p2-ora': {
    lang: 'oracle', title: '@{Procedura 2: awans osoby na trenera|Procedure 2: promote a person to trainer|Процедура 2: сделать человека тренером}',
    code: `
CREATE OR REPLACE PROCEDURE Awansuj_Na_Trenera (p_idOsoba INTEGER)
AS
    v_ile    INTEGER;
    v_stawka Trener.Stawka%TYPE;
    v_id     Trener.IdTrener%TYPE;
BEGIN
    SELECT COUNT(*) INTO v_ile FROM Osoba WHERE IdOsoba = p_idOsoba;
    IF v_ile = 0 THEN
        RAISE_APPLICATION_ERROR(-20310, 'Nie ma osoby o id ' || p_idOsoba);
    END IF;
    SELECT COUNT(*) INTO v_ile FROM Trener WHERE IdOsoba = p_idOsoba;
    IF v_ile > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Ta osoba juz jest trenerem');
        RETURN;
    END IF;
    SELECT NVL(ROUND(AVG(Stawka), 2), 80) INTO v_stawka FROM Trener;
    SELECT NVL(MAX(IdTrener), 0) + 1 INTO v_id FROM Trener;
    INSERT INTO Trener VALUES (v_id, p_idOsoba, v_stawka);
    DBMS_OUTPUT.PUT_LINE('Nowy trener (id ' || v_id || '), stawka ' || v_stawka);
END;
/
CALL Awansuj_Na_Trenera(1);   -- @{średnia stawka 110|average rate 110|средняя ставка 110}
CALL Awansuj_Na_Trenera(1);   -- @{już jest trenerem|already a trainer|уже тренер}` },

  'proj-p2-ms': {
    lang: 'mssql', title: '@{Procedura 2 – wersja T-SQL|Procedure 2 – T-SQL version|Процедура 2 – версия T-SQL}',
    code: `
CREATE OR ALTER PROCEDURE Awansuj_Na_Trenera @idOsoba INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM Osoba WHERE IdOsoba = @idOsoba)
    BEGIN
        RAISERROR ('Nie ma osoby o id %d', 16, 1, @idOsoba);
        RETURN;
    END;
    IF EXISTS (SELECT 1 FROM Trener WHERE IdOsoba = @idOsoba)
    BEGIN
        PRINT 'Ta osoba juz jest trenerem';
        RETURN;
    END;
    DECLARE @stawka DECIMAL(7,2), @id INT;
    SELECT @stawka = ISNULL(ROUND(AVG(Stawka), 2), 80) FROM Trener;
    SELECT @id = ISNULL(MAX(IdTrener), 0) + 1 FROM Trener;
    INSERT INTO Trener VALUES (@id, @idOsoba, @stawka);
    PRINT 'Nowy trener (id ' + CAST(@id AS VARCHAR) + '), stawka ' + CAST(@stawka AS VARCHAR);
END;
GO
EXEC Awansuj_Na_Trenera 1;` },

  'proj-t1-ora': {
    lang: 'oracle', title: '@{Wyzwalacz 1: limit miejsc (poziom instrukcji – bez tabeli mutującej)|Trigger 1: seat limit (statement level – no mutating table)|Триггер 1: лимит мест (уровень инструкции – без мутирующей таблицы)}',
    code: `
CREATE OR REPLACE TRIGGER zapis_limit
AFTER INSERT ON Zapis                      -- @{bez FOR EACH ROW → wolno czytać Zapis|no FOR EACH ROW → reading Zapis is allowed|без FOR EACH ROW → можно читать Zapis}
DECLARE
    v_ile INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_ile
    FROM  (SELECT z.IdZajecia
           FROM   Zapis z
                  JOIN Zajecia zj ON zj.IdZajecia = z.IdZajecia
                  JOIN Sala s     ON s.IdSala = zj.IdSala
           GROUP  BY z.IdZajecia, s.Pojemnosc
           HAVING COUNT(*) > s.Pojemnosc);
    IF v_ile > 0 THEN
        RAISE_APPLICATION_ERROR(-20301, 'Brak wolnych miejsc na zajeciach');   -- @{cofnie cały INSERT|rolls back the whole INSERT|откатит весь INSERT}
    END IF;
END;
/
INSERT INTO Zapis VALUES (1, 3);   -- @{zajęcia 1 pełne → ORA-20301 (jeśli klubowicz 3 istnieje)|class 1 full → ORA-20301 (if member 3 exists)|занятие 1 полное → ORA-20301 (если член клуба 3 существует)}` },

  'proj-t1-ms': {
    lang: 'mssql', title: '@{Wyzwalacz 1 – wersja T-SQL|Trigger 1 – T-SQL version|Триггер 1 – версия T-SQL}',
    code: `
CREATE OR ALTER TRIGGER TR_Zapis_Limit ON Zapis
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1
               FROM   (SELECT DISTINCT IdZajecia FROM inserted) i
                      JOIN Zajecia zj ON zj.IdZajecia = i.IdZajecia
                      JOIN Sala s     ON s.IdSala = zj.IdSala
               WHERE  (SELECT COUNT(*) FROM Zapis z WHERE z.IdZajecia = i.IdZajecia) > s.Pojemnosc)
    BEGIN
        ROLLBACK;
        RAISERROR ('Brak wolnych miejsc na zajeciach', 16, 1);
    END;
END;` },

  'proj-t2-ora': {
    lang: 'oracle', title: '@{Wyzwalacz 2: historia stawek i limit obniżki|Trigger 2: rate history and cut limit|Триггер 2: история ставок и лимит снижения}',
    code: `
CREATE OR REPLACE TRIGGER trener_stawka
BEFORE UPDATE OF Stawka ON Trener
FOR EACH ROW
BEGIN
    IF :NEW.Stawka < :OLD.Stawka * 0.9 THEN
        RAISE_APPLICATION_ERROR(-20302, 'Stawki nie wolno obnizyc o wiecej niz 10%');
    END IF;
    IF :NEW.Stawka <> :OLD.Stawka THEN
        INSERT INTO HistoriaStawek (IdTrener, StaraStawka, NowaStawka)   -- @{inna tabela → wolno|another table → allowed|другая таблица → можно}
        VALUES (:OLD.IdTrener, :OLD.Stawka, :NEW.Stawka);
    END IF;
END;
/
UPDATE Trener SET Stawka = 130 WHERE IdTrener = 1;   -- OK + @{wpis w historii|history entry|запись в истории}
UPDATE Trener SET Stawka = 50  WHERE IdTrener = 2;   -- ORA-20302` },

  'proj-t2-ms': {
    lang: 'mssql', title: '@{Wyzwalacz 2 – wersja T-SQL|Trigger 2 – T-SQL version|Триггер 2 – версия T-SQL}',
    code: `
CREATE OR ALTER TRIGGER TR_Trener_Stawka ON Trener
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT UPDATE(Stawka) RETURN;
    IF EXISTS (SELECT 1 FROM inserted i JOIN deleted d ON i.IdTrener = d.IdTrener
               WHERE i.Stawka < d.Stawka * 0.9)
    BEGIN
        ROLLBACK;
        RAISERROR ('Stawki nie wolno obnizyc o wiecej niz 10%%', 16, 1);
        RETURN;
    END;
    INSERT INTO HistoriaStawek (IdTrener, StaraStawka, NowaStawka)
    SELECT d.IdTrener, d.Stawka, i.Stawka
    FROM   inserted i JOIN deleted d ON i.IdTrener = d.IdTrener
    WHERE  i.Stawka <> d.Stawka;
END;` }
});
