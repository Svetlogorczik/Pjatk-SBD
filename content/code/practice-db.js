/* Skrypty baz treningowych (wymyślone przez autora strony, NIE pochodzą z ćwiczeń).
   Komentarze: @{polski|english|русский}. */
SBD.addCode({

  /* ============ Wypożyczalnia samochodów ============ */
  'db-wyp-mssql': {
    lang: 'mssql', title: '@{Baza „Wypożyczalnia” – MS SQL Server|"Car rental" database – MS SQL Server|База «Прокат авто» – MS SQL Server}',
    code: `
IF OBJECT_ID('Wypozyczenie') IS NOT NULL DROP TABLE Wypozyczenie;
IF OBJECT_ID('Auto')         IS NOT NULL DROP TABLE Auto;
IF OBJECT_ID('Klasa')        IS NOT NULL DROP TABLE Klasa;
IF OBJECT_ID('Klient')       IS NOT NULL DROP TABLE Klient;

CREATE TABLE Klasa (
    IdKlasa   INT          PRIMARY KEY,
    Nazwa     VARCHAR(20)  NOT NULL,
    CenaDoba  DECIMAL(8,2) NOT NULL          -- @{cena za dobę|price per day|цена за сутки}
);
CREATE TABLE Auto (
    NrAuta       INT         PRIMARY KEY,
    Marka        VARCHAR(20) NOT NULL,
    IdKlasa      INT         NOT NULL REFERENCES Klasa,
    LiczbaMiejsc INT         NOT NULL
);
CREATE TABLE Klient (
    IdKlient  INT         PRIMARY KEY,
    Imie      VARCHAR(20) NOT NULL,
    Nazwisko  VARCHAR(30) NOT NULL,
    Rabat     INT         NULL              -- @{procent rabatu; NULL = brak ustalonego rabatu|discount percent; NULL = no agreed discount|процент скидки; NULL = скидка не назначена}
);
CREATE TABLE Wypozyczenie (
    IdWyp     INT  PRIMARY KEY,
    DataOd    DATE NOT NULL,
    DataDo    DATE NOT NULL,
    IdKlient  INT  NOT NULL REFERENCES Klient,
    NrAuta    INT  NOT NULL REFERENCES Auto,
    Oplacone  BIT  NOT NULL                 -- @{1 = zapłacone, 0 = dług|1 = paid, 0 = debt|1 = оплачено, 0 = долг}
);

INSERT INTO Klasa VALUES (1,'ekonomiczna',120),(2,'kompakt',160),(3,'SUV',250),(4,'premium',400),(5,'van',300);

INSERT INTO Auto VALUES
 (11,'Toyota',1,5),(12,'Fiat',1,4),(13,'Hyundai',1,4),(21,'Skoda',2,5),(22,'Volkswagen',2,7),
 (31,'Kia',3,5),(41,'BMW',4,4),(42,'Audi',4,5),(51,'Ford',5,9);

INSERT INTO Klient VALUES
 (1,'Jan','Kowalczyk',10),(2,'Anna','Lis',NULL),(3,'Marek','Kania',5),(4,'Ewa','Pawlak',NULL),
 (5,'Tomasz','Lewandowski',15),(6,'Olga','Nowicka',0),(7,'Piotr','Krawiec',NULL),
 (8,'Zofia','Pietrzak',10),(9,'Adam','Wrona',NULL),(10,'Beata','Kaczmarek',5);

INSERT INTO Wypozyczenie VALUES
 (1,'2024-03-02','2024-03-05',1,11,1), (2,'2024-04-10','2024-04-12',2,21,1),
 (3,'2024-05-01','2024-05-08',3,41,0), (4,'2024-06-15','2024-06-20',1,31,1),
 (5,'2024-07-01','2024-07-03',5,11,0), (6,'2024-08-12','2024-08-19',7,22,1),
 (7,'2025-01-05','2025-01-06',4,12,1), (8,'2025-02-14','2025-02-16',8,42,0),
 (9,'2025-03-20','2025-03-25',3,11,1), (10,'2025-05-02','2025-05-04',6,21,1),
 (11,'2025-06-30','2025-07-07',1,41,1),(12,'2025-08-08','2025-08-10',5,31,0);`
  },

  'db-wyp-oracle': {
    lang: 'oracle', title: '@{Baza „Wypożyczalnia” – Oracle|"Car rental" database – Oracle|База «Прокат авто» – Oracle}',
    code: `
CREATE TABLE Klasa (
    IdKlasa   INTEGER      PRIMARY KEY,
    Nazwa     VARCHAR2(20) NOT NULL,
    CenaDoba  NUMBER(8,2)  NOT NULL
);
CREATE TABLE Auto (
    NrAuta       INTEGER      PRIMARY KEY,
    Marka        VARCHAR2(20) NOT NULL,
    IdKlasa      INTEGER      NOT NULL REFERENCES Klasa,
    LiczbaMiejsc INTEGER      NOT NULL
);
CREATE TABLE Klient (
    IdKlient  INTEGER      PRIMARY KEY,
    Imie      VARCHAR2(20) NOT NULL,
    Nazwisko  VARCHAR2(30) NOT NULL,
    Rabat     INTEGER      NULL
);
CREATE TABLE Wypozyczenie (
    IdWyp     INTEGER   PRIMARY KEY,
    DataOd    DATE      NOT NULL,
    DataDo    DATE      NOT NULL,
    IdKlient  INTEGER   NOT NULL REFERENCES Klient,
    NrAuta    INTEGER   NOT NULL REFERENCES Auto,
    Oplacone  NUMBER(1) NOT NULL CHECK (Oplacone IN (0, 1))
);

INSERT INTO Klasa VALUES (1, 'ekonomiczna', 120);
INSERT INTO Klasa VALUES (2, 'kompakt', 160);
INSERT INTO Klasa VALUES (3, 'SUV', 250);
INSERT INTO Klasa VALUES (4, 'premium', 400);
INSERT INTO Klasa VALUES (5, 'van', 300);

INSERT INTO Auto VALUES (11, 'Toyota', 1, 5);
INSERT INTO Auto VALUES (12, 'Fiat', 1, 4);
INSERT INTO Auto VALUES (13, 'Hyundai', 1, 4);
INSERT INTO Auto VALUES (21, 'Skoda', 2, 5);
INSERT INTO Auto VALUES (22, 'Volkswagen', 2, 7);
INSERT INTO Auto VALUES (31, 'Kia', 3, 5);
INSERT INTO Auto VALUES (41, 'BMW', 4, 4);
INSERT INTO Auto VALUES (42, 'Audi', 4, 5);
INSERT INTO Auto VALUES (51, 'Ford', 5, 9);

INSERT INTO Klient VALUES (1, 'Jan', 'Kowalczyk', 10);
INSERT INTO Klient VALUES (2, 'Anna', 'Lis', NULL);
INSERT INTO Klient VALUES (3, 'Marek', 'Kania', 5);
INSERT INTO Klient VALUES (4, 'Ewa', 'Pawlak', NULL);
INSERT INTO Klient VALUES (5, 'Tomasz', 'Lewandowski', 15);
INSERT INTO Klient VALUES (6, 'Olga', 'Nowicka', 0);
INSERT INTO Klient VALUES (7, 'Piotr', 'Krawiec', NULL);
INSERT INTO Klient VALUES (8, 'Zofia', 'Pietrzak', 10);
INSERT INTO Klient VALUES (9, 'Adam', 'Wrona', NULL);
INSERT INTO Klient VALUES (10, 'Beata', 'Kaczmarek', 5);

INSERT INTO Wypozyczenie VALUES (1,  DATE '2024-03-02', DATE '2024-03-05', 1, 11, 1);
INSERT INTO Wypozyczenie VALUES (2,  DATE '2024-04-10', DATE '2024-04-12', 2, 21, 1);
INSERT INTO Wypozyczenie VALUES (3,  DATE '2024-05-01', DATE '2024-05-08', 3, 41, 0);
INSERT INTO Wypozyczenie VALUES (4,  DATE '2024-06-15', DATE '2024-06-20', 1, 31, 1);
INSERT INTO Wypozyczenie VALUES (5,  DATE '2024-07-01', DATE '2024-07-03', 5, 11, 0);
INSERT INTO Wypozyczenie VALUES (6,  DATE '2024-08-12', DATE '2024-08-19', 7, 22, 1);
INSERT INTO Wypozyczenie VALUES (7,  DATE '2025-01-05', DATE '2025-01-06', 4, 12, 1);
INSERT INTO Wypozyczenie VALUES (8,  DATE '2025-02-14', DATE '2025-02-16', 8, 42, 0);
INSERT INTO Wypozyczenie VALUES (9,  DATE '2025-03-20', DATE '2025-03-25', 3, 11, 1);
INSERT INTO Wypozyczenie VALUES (10, DATE '2025-05-02', DATE '2025-05-04', 6, 21, 1);
INSERT INTO Wypozyczenie VALUES (11, DATE '2025-06-30', DATE '2025-07-07', 1, 41, 1);
INSERT INTO Wypozyczenie VALUES (12, DATE '2025-08-08', DATE '2025-08-10', 5, 31, 0);
COMMIT;`
  },

  /* ============ Firma kurierska ============ */
  'db-kur-mssql': {
    lang: 'mssql', title: '@{Baza „Kurierzy” – MS SQL Server|"Couriers" database – MS SQL Server|База «Курьеры» – MS SQL Server}',
    code: `
IF OBJECT_ID('Kurier')  IS NOT NULL DROP TABLE Kurier;
IF OBJECT_ID('Oddzial') IS NOT NULL DROP TABLE Oddzial;
IF OBJECT_ID('Stawka')  IS NOT NULL DROP TABLE Stawka;

CREATE TABLE Oddzial (
    IdOddzial INT PRIMARY KEY,
    Nazwa     VARCHAR(20) NOT NULL,
    Miasto    VARCHAR(20) NOT NULL
);
CREATE TABLE Stawka (                     -- @{siatka płac (jak SALGRADE)|pay scale (like SALGRADE)|сетка зарплат (как SALGRADE)}
    Poziom    INT PRIMARY KEY,
    PensjaOd  INT NOT NULL,
    PensjaDo  INT NOT NULL
);
CREATE TABLE Kurier (
    IdKurier         INT PRIMARY KEY,
    Nazwisko         VARCHAR(20) NOT NULL,
    Stanowisko       VARCHAR(20),
    IdSzef           INT NULL REFERENCES Kurier,     -- @{związek rekurencyjny|recursive relationship|рекурсивная связь}
    DataZatrudnienia DATE,
    Pensja           INT,
    Premia           INT NULL,
    IdOddzial        INT NULL REFERENCES Oddzial
);

INSERT INTO Oddzial VALUES (10,'CENTRALA','WARSZAWA'),(20,'POLNOC','GDANSK'),(30,'POLUDNIE','KRAKOW'),(40,'ZACHOD','POZNAN');
INSERT INTO Stawka VALUES (1,2000,2999),(2,3000,3999),(3,4000,4999),(4,5000,6999),(5,7000,9999);

INSERT INTO Kurier VALUES
 (100,'NOWAK','DYREKTOR',NULL,'2015-01-10',9000,NULL,10),
 (101,'WOJCIK','KIEROWNIK',100,'2016-03-01',6500,NULL,20),
 (102,'KAMINSKI','KIEROWNIK',100,'2016-05-15',6200,NULL,30),
 (103,'ZIELINSKA','ANALITYK',100,'2018-09-01',5200,NULL,10),
 (104,'SZYMANSKI','KURIER',101,'2019-02-11',3100,400,20),
 (105,'WOZNIAK','KURIER',101,'2020-06-20',2800,250,20),
 (106,'DABROWSKI','KURIER',101,'2021-01-04',2400,NULL,20),
 (107,'KOZLOWSKA','DYSPOZYTOR',101,'2021-07-19',3300,0,20),
 (108,'JANKOWSKI','KURIER',102,'2019-10-01',3500,600,30),
 (109,'MAZUR','KURIER',102,'2022-03-14',2200,NULL,30),
 (110,'KRAWCZYK','DYSPOZYTOR',102,'2020-11-30',3400,NULL,30),
 (111,'PIOTROWSKI','KURIER',102,'2023-05-05',2100,150,30),
 (112,'GRABOWSKI','ANALITYK',103,'2022-08-22',4800,NULL,10),
 (113,'PAWLOWSKI','KURIER',102,'2024-01-15',2300,NULL,NULL);   -- @{bez oddziału|no branch|без отдела}`
  },

  'db-kur-oracle': {
    lang: 'oracle', title: '@{Baza „Kurierzy” – Oracle|"Couriers" database – Oracle|База «Курьеры» – Oracle}',
    code: `
CREATE TABLE Oddzial (
    IdOddzial INTEGER PRIMARY KEY,
    Nazwa     VARCHAR2(20) NOT NULL,
    Miasto    VARCHAR2(20) NOT NULL
);
CREATE TABLE Stawka (
    Poziom    INTEGER PRIMARY KEY,
    PensjaOd  INTEGER NOT NULL,
    PensjaDo  INTEGER NOT NULL
);
CREATE TABLE Kurier (
    IdKurier         INTEGER PRIMARY KEY,
    Nazwisko         VARCHAR2(20) NOT NULL,
    Stanowisko       VARCHAR2(20),
    IdSzef           INTEGER NULL REFERENCES Kurier,
    DataZatrudnienia DATE,
    Pensja           INTEGER,
    Premia           INTEGER NULL,
    IdOddzial        INTEGER NULL REFERENCES Oddzial
);

INSERT INTO Oddzial VALUES (10, 'CENTRALA', 'WARSZAWA');
INSERT INTO Oddzial VALUES (20, 'POLNOC', 'GDANSK');
INSERT INTO Oddzial VALUES (30, 'POLUDNIE', 'KRAKOW');
INSERT INTO Oddzial VALUES (40, 'ZACHOD', 'POZNAN');

INSERT INTO Stawka VALUES (1, 2000, 2999);
INSERT INTO Stawka VALUES (2, 3000, 3999);
INSERT INTO Stawka VALUES (3, 4000, 4999);
INSERT INTO Stawka VALUES (4, 5000, 6999);
INSERT INTO Stawka VALUES (5, 7000, 9999);

INSERT INTO Kurier VALUES (100, 'NOWAK', 'DYREKTOR', NULL, DATE '2015-01-10', 9000, NULL, 10);
INSERT INTO Kurier VALUES (101, 'WOJCIK', 'KIEROWNIK', 100, DATE '2016-03-01', 6500, NULL, 20);
INSERT INTO Kurier VALUES (102, 'KAMINSKI', 'KIEROWNIK', 100, DATE '2016-05-15', 6200, NULL, 30);
INSERT INTO Kurier VALUES (103, 'ZIELINSKA', 'ANALITYK', 100, DATE '2018-09-01', 5200, NULL, 10);
INSERT INTO Kurier VALUES (104, 'SZYMANSKI', 'KURIER', 101, DATE '2019-02-11', 3100, 400, 20);
INSERT INTO Kurier VALUES (105, 'WOZNIAK', 'KURIER', 101, DATE '2020-06-20', 2800, 250, 20);
INSERT INTO Kurier VALUES (106, 'DABROWSKI', 'KURIER', 101, DATE '2021-01-04', 2400, NULL, 20);
INSERT INTO Kurier VALUES (107, 'KOZLOWSKA', 'DYSPOZYTOR', 101, DATE '2021-07-19', 3300, 0, 20);
INSERT INTO Kurier VALUES (108, 'JANKOWSKI', 'KURIER', 102, DATE '2019-10-01', 3500, 600, 30);
INSERT INTO Kurier VALUES (109, 'MAZUR', 'KURIER', 102, DATE '2022-03-14', 2200, NULL, 30);
INSERT INTO Kurier VALUES (110, 'KRAWCZYK', 'DYSPOZYTOR', 102, DATE '2020-11-30', 3400, NULL, 30);
INSERT INTO Kurier VALUES (111, 'PIOTROWSKI', 'KURIER', 102, DATE '2023-05-05', 2100, 150, 30);
INSERT INTO Kurier VALUES (112, 'GRABOWSKI', 'ANALITYK', 103, DATE '2022-08-22', 4800, NULL, 10);
INSERT INTO Kurier VALUES (113, 'PAWLOWSKI', 'KURIER', 102, DATE '2024-01-15', 2300, NULL, NULL);
COMMIT;`
  },

  /* ============ Małe tabele pomocnicze ============ */
  'db-regal-mssql': {
    lang: 'mssql', title: '@{Tabela Regal – MS SQL|Regal table – MS SQL|Таблица Regal – MS SQL}',
    code: `
CREATE TABLE Regal (
    IdPolki  INT PRIMARY KEY,
    Produkt  VARCHAR(20) NOT NULL,
    Sztuk    INT NOT NULL
);
INSERT INTO Regal VALUES (1,'Mleko',40),(2,'Chleb',15),(3,'Maslo',8),(4,'Jajka',8),(5,'Ser',25),(6,'Woda',60);`
  },

  'db-regal-oracle': {
    lang: 'oracle', title: '@{Tabela Regal – Oracle|Regal table – Oracle|Таблица Regal – Oracle}',
    code: `
CREATE TABLE Regal (
    IdPolki  INTEGER PRIMARY KEY,
    Produkt  VARCHAR2(20) NOT NULL,
    Sztuk    INTEGER NOT NULL
);
INSERT INTO Regal VALUES (1, 'Mleko', 40);
INSERT INTO Regal VALUES (2, 'Chleb', 15);
INSERT INTO Regal VALUES (3, 'Maslo', 8);
INSERT INTO Regal VALUES (4, 'Jajka', 8);
INSERT INTO Regal VALUES (5, 'Ser', 25);
INSERT INTO Regal VALUES (6, 'Woda', 60);
COMMIT;`
  },

  'db-produkt-mssql': {
    lang: 'mssql', title: '@{Tabela Produkt – MS SQL|Produkt table – MS SQL|Таблица Produkt – MS SQL}',
    code: `
CREATE TABLE Produkt (
    IdProdukt INT PRIMARY KEY,
    Nazwa     VARCHAR(30) NOT NULL,
    Cena      DECIMAL(8,2) NOT NULL,
    Stan      INT NOT NULL
);
INSERT INTO Produkt VALUES (1,'Parasol',49.99,12),(2,'Kalosze',129.00,3),(3,'Plaszcz',259.00,7),(4,'Czapka',39.90,40);`
  },

  'db-produkt-oracle': {
    lang: 'oracle', title: '@{Tabela Produkt – Oracle|Produkt table – Oracle|Таблица Produkt – Oracle}',
    code: `
CREATE TABLE Produkt (
    IdProdukt INTEGER PRIMARY KEY,
    Nazwa     VARCHAR2(30) NOT NULL,
    Cena      NUMBER(8,2) NOT NULL,
    Stan      INTEGER NOT NULL
);
INSERT INTO Produkt VALUES (1, 'Parasol', 49.99, 12);
INSERT INTO Produkt VALUES (2, 'Kalosze', 129.00, 3);
INSERT INTO Produkt VALUES (3, 'Plaszcz', 259.00, 7);
INSERT INTO Produkt VALUES (4, 'Czapka', 39.90, 40);
COMMIT;`
  },

  'db-odczyty': {
    lang: 'mssql', title: '@{Tabela Odczyty (200 000 losowych wierszy)|Odczyty table (200,000 random rows)|Таблица Odczyty (200 000 случайных строк)}',
    code: `
CREATE TABLE Odczyty (Id INT IDENTITY, Czujnik INT, Wartosc INT);
GO
SET NOCOUNT ON;
DECLARE @i INT = 1;
BEGIN TRAN;                                   -- @{jedna transakcja = dużo szybciej|one transaction = much faster|одна транзакция = намного быстрее}
WHILE @i <= 200000
BEGIN
    INSERT INTO Odczyty (Czujnik, Wartosc)
    VALUES (CONVERT(INT, RAND() * 50000), CONVERT(INT, RAND() * 100000));
    SET @i += 1;
END;
COMMIT;
GO
SELECT COUNT(*) FROM Odczyty;`
  },

  'db-konto': {
    lang: 'mssql', title: '@{Tabela Konto (transakcje)|Konto table (transactions)|Таблица Konto (транзакции)}',
    code: `
SET IMPLICIT_TRANSACTIONS ON;      -- @{od teraz COMMIT/ROLLBACK robimy sami|from now on we COMMIT/ROLLBACK ourselves|теперь COMMIT/ROLLBACK делаем сами}
CREATE TABLE Konto (Id INT PRIMARY KEY, Wlasciciel VARCHAR(30), Saldo MONEY);
COMMIT;`
  }
});
