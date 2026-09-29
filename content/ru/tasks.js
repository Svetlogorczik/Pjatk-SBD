/* RU – упражнения (переработаны: та же логика, что на занятиях, другие базы и формулировки) */
SBD.addTasks('ru', {

'databases': {
  title: 'Учебные базы (скрипты)',
  lead: 'Две собственные учебные базы: «Прокат авто» (упражнения по SQL) и «Курьеры» (T-SQL и PL/SQL), плюс небольшие вспомогательные таблицы.',
  intro: `
<div data-note="own"><p>Базы придуманы автором сайта — по структуре они похожи на базы с занятий (отель, EMP/DEPT), но таблицы и данные другие. Так вы отрабатываете ту же логику, не переписывая готовые решения с занятий.</p></div>
<p>Имена таблиц и столбцов оставлены на польском — как в материалах занятий.</p>
<h2>База «Wypożyczalnia» (прокат авто)</h2>
<table>
  <thead><tr><th>Таблица</th><th>Столбцы</th><th>Примечания</th></tr></thead>
  <tbody>
    <tr><td><strong>Klasa</strong> (класс авто)</td><td>IdKlasa (PK), Nazwa, CenaDoba (цена за сутки)</td><td>ekonomiczna, kompakt, SUV, premium, van</td></tr>
    <tr><td><strong>Auto</strong> (машина)</td><td>NrAuta (PK), Marka (марка), IdKlasa (FK), LiczbaMiejsc (мест)</td><td>9 машин; Hyundai (13) и Ford (51) ни разу не брали</td></tr>
    <tr><td><strong>Klient</strong> (клиент)</td><td>IdKlient (PK), Imie, Nazwisko, Rabat (скидка, NULL)</td><td>10 человек; Wrona и Kaczmarek ничего не брали</td></tr>
    <tr><td><strong>Wypozyczenie</strong> (прокат)</td><td>IdWyp (PK), DataOd, DataDo, IdKlient (FK), NrAuta (FK), Oplacone (оплачено 0/1)</td><td>12 прокатов в 2024–2025</td></tr>
  </tbody>
</table>
<div data-code="db-wyp-mssql"></div>
<div data-code="db-wyp-oracle"></div>
<h2>База «Kurierzy» (курьеры)</h2>
<p>По структуре похожа на EMP/DEPT/SALGRADE из лекций: у курьера есть начальник (рекурсивная связь), отделение и зарплата; таблица Stawka — тарифная сетка.</p>
<table>
  <thead><tr><th>Таблица</th><th>Столбцы</th><th>Примечания</th></tr></thead>
  <tbody>
    <tr><td><strong>Oddzial</strong> (отделение)</td><td>IdOddzial (PK), Nazwa, Miasto (город)</td><td>отделение 40 (ZACHOD) пустое</td></tr>
    <tr><td><strong>Kurier</strong> (курьер)</td><td>IdKurier (PK), Nazwisko, Stanowisko (должность), IdSzef (FK → Kurier), DataZatrudnienia (дата приёма), Pensja (зарплата), Premia (премия, NULL), IdOddzial (FK)</td><td>14 человек; у NOWAK (директор) нет начальника, у PAWLOWSKI нет отделения</td></tr>
    <tr><td><strong>Stawka</strong> (тарифная сетка)</td><td>Poziom (PK), PensjaOd, PensjaDo</td><td>5 уровней</td></tr>
  </tbody>
</table>
<div data-code="db-kur-mssql"></div>
<div data-code="db-kur-oracle"></div>
<h2>Небольшие вспомогательные таблицы</h2>
<p><strong>Regal</strong> — остатки товаров на полках (наборы 5, 9, 10). <strong>Produkt</strong> — для контрольных K1 и K2. <strong>Odczyty</strong> (показания датчиков) и <strong>Konto</strong> (счёт) — для набора по индексам и транзакциям (7).</p>
<div data-code="db-regal-mssql"></div>
<div data-code="db-regal-oracle"></div>
<div data-code="db-produkt-mssql"></div>
<div data-code="db-produkt-oracle"></div>
<div data-code="db-odczyty"></div>
<div data-code="db-konto"></div>
<div data-note="tip"><p>Хотите начать заново? В MS SQL скрипты сами удаляют старые таблицы (<code>IF OBJECT_ID(…) IS NOT NULL DROP TABLE …</code>). В Oracle удалите их вручную, начиная с дочерних: <code>DROP TABLE Wypozyczenie; DROP TABLE Auto; …</code></p></div>`,
  items: []
},

't01-erd': {
  title: 'Упражнения 1: проектирование ERD',
  lead: 'Спроектируйте диаграммы «сущность–связь» по четырём описаниям. Те же трудности, что на занятиях: M:N, две связи между одними и теми же сущностями, «маршруты» через другие точки, реакции со многими компонентами.',
  intro: `<p>Нарисуйте каждую диаграмму в Vertabelo (или на бумаге): сущности, атрибуты с типами, первичные и внешние ключи, кратности. Потом сверьтесь с решением — это одна из возможных правильных версий.</p>`,
  items: [
    { q: `<p><strong>Автошкола.</strong> Школа проводит курсы разных категорий (A, B, C…). Курсант записывается на курс определённой категории. Каждое вождение — с одним инструктором на одной машине; у машины есть категория. Инструктор может иметь права на много категорий. Нужно также хранить результаты внутренних экзаменов (теория/практика, дата, результат).</p>`,
      hint: `<p>Инструктор–Категория — это M:N (права). Вождение связывает три вещи: курсанта (точнее, его запись на курс), инструктора и машину.</p>`,
      sol: `<pre data-lang="text">Kategoria (IdKategoria PK, Symbol, Opis)
Kurs (IdKurs PK, IdKategoria FK, DataStartu, Cena)
Kursant (IdKursant PK, Imie, Nazwisko, Pesel UNIQUE, Telefon)
Zapis (IdZapis PK, IdKursant FK, IdKurs FK, DataZapisu)
Instruktor (IdInstruktor PK, Imie, Nazwisko)
Uprawnienie (IdInstruktor PK/FK, IdKategoria PK/FK, DataNadania)   ← M:N
Samochod (IdSamochod PK, NrRej UNIQUE, Marka, IdKategoria FK)
Jazda (IdJazda PK, IdZapis FK, IdInstruktor FK, IdSamochod FK, Termin, CzasMin)
Egzamin (IdEgzamin PK, IdZapis FK, Rodzaj CHECK IN ('T','P'), Data, Wynik)</pre>
<p>Обратите внимание: есть ли у инструктора права на категорию машины, позже проверит триггер — диаграмма этого не обеспечит.</p>` },

    { q: `<p><strong>Кинотеатр.</strong> В кинотеатре есть залы с пронумерованными местами (ряд, номер). У фильмов есть жанры (у фильма может быть несколько жанров). Сеанс — показ фильма в зале в определённое время. Зритель может купить билеты на сеанс; билет — на <em>конкретное место</em>. Различайте <strong>бронь</strong> (на сеанс, число людей, без мест) и <strong>билет</strong> (конкретное место).</p>`,
      hint: `<p>Как в отеле: «заказ на категорию» и «выделение конкретного номера»: Бронь → Сеанс, Билет → Сеанс + Место. Уникальность места на сеансе: UNIQUE (IdSeans, IdMiejsce).</p>`,
      sol: `<pre data-lang="text">Sala (IdSala PK, Nazwa)
Miejsce (IdMiejsce PK, IdSala FK, Rzad, Numer, UNIQUE(IdSala, Rzad, Numer))
Gatunek (IdGatunek PK, Nazwa)
Film (IdFilm PK, Tytul, CzasMin)
FilmGatunek (IdFilm PK/FK, IdGatunek PK/FK)                  ← M:N
Seans (IdSeans PK, IdFilm FK, IdSala FK, Termin)
Widz (IdWidz PK, Imie, Nazwisko, Email)
Rezerwacja (IdRezerwacja PK, IdWidz FK, IdSeans FK, LiczbaOsob)
Bilet (IdBilet PK, IdSeans FK, IdMiejsce FK, IdWidz FK NULL, Cena,
       UNIQUE(IdSeans, IdMiejsce))                          ← одно место = один билет</pre>` },

    { q: `<p><strong>Городской транспорт.</strong> Есть остановки (название, тарифная зона) и линии (номер, тип: автобус/трамвай). Линия проходит остановки в определённом порядке; известно время проезда между соседними остановками. База должна позволять посчитать, сколько длится поездка от остановки A до B на данной линии, в том числе с пересадкой на другой остановке.</p>`,
      hint: `<p>Это аналог «тропы между горными приютами»: нужна сущность Отрезок/Маршрут с порядком (порядковый номер) и временем. Пересадка = два отрезка разных линий, сходящихся на одной остановке.</p>`,
      sol: `<pre data-lang="text">Przystanek (IdPrzystanek PK, Nazwa, Strefa)
Linia (IdLinia PK, Numer, Typ CHECK IN ('A','T'))
Przebieg (IdLinia PK/FK, NrKolejny PK, IdPrzystanek FK,
          CzasOdPoprzedniego)          ← порядок остановок линии
-- поездка A→B на одной линии: SUM(CzasOdPoprzedniego) для NrKolejny между позициями A и B
-- с пересадкой: соединить два таких отрезка на общей остановке (self join Przebieg)</pre>
<p>Линия–Остановка — это M:N (у линии много остановок, остановку обслуживают многие линии) — Przebieg это ассоциативная сущность с дополнительными атрибутами.</p>` },

    { q: `<p><strong>Рецепты.</strong> Есть ингредиенты (название, единица, калории на единицу, количество в кладовой) и рецепты. Рецепт использует много ингредиентов в определённом количестве. Рецепт может также использовать <em>другой рецепт</em> как ингредиент (например, «песочное тесто» в «тарте»). Также храним, когда рецепт готовили и сколько порций получилось.</p>`,
      hint: `<p>Как «химические реакции»: ингредиент может быть одного из двух видов. Один способ: у строки рецепта два необязательных внешних ключа (IdSkladnik или IdPodprzepis) + CHECK, что заполнен ровно один.</p>`,
      sol: `<pre data-lang="text">Skladnik (IdSkladnik PK, Nazwa, Jednostka, KcalNaJedn, IloscWSpizarni)
Przepis (IdPrzepis PK, Nazwa, Porcje)
PozycjaPrzepisu (IdPozycja PK, IdPrzepis FK,
                 IdSkladnik FK NULL, IdPodprzepis FK NULL → Przepis,
                 Ilosc)                  ← CHECK: заполнен ровно один из двух FK
Przygotowanie (IdPrzygotowanie PK, IdPrzepis FK, Data, IleWyszloPorcji)</pre>
<p>IdPodprzepis → Przepis — это <strong>рекурсивная</strong> связь (через таблицу строк). В MS SQL правило «ровно один» записывается так: <code>CHECK ((IdSkladnik IS NULL AND IdPodprzepis IS NOT NULL) OR (IdSkladnik IS NOT NULL AND IdPodprzepis IS NULL))</code>.</p>` },

    { q: `<p><strong>Нормализация.</strong> Таблица ZAMOWIENIE {NrZam, DataZam, IdKlienta, NazwiskoKlienta, MiastoKlienta, KodTowaru, NazwaTowaru, Ilosc, CenaTowaru} (заказ со строками). Ключ: (NrZam, KodTowaru). Выпишите функциональные зависимости, определите нормальную форму и разложите таблицу до 3НФ.</p>`,
      hint: `<p>Ищите зависимости от части ключа (NrZam → …, KodTowaru → …) и транзитивные (IdKlienta → …).</p>`,
      sol: `<ul>
<li>NrZam → DataZam, IdKlienta (частичная) ⇒ нет 2НФ;</li>
<li>KodTowaru → NazwaTowaru, CenaTowaru (частичная);</li>
<li>IdKlienta → NazwiskoKlienta, MiastoKlienta (транзитивная через NrZam) ⇒ нет 3НФ;</li>
<li>(NrZam, KodTowaru) → Ilosc — единственная «хорошая» зависимость.</li></ul>
<pre data-lang="text">Klient (IdKlienta PK, Nazwisko, Miasto)
Towar (KodTowaru PK, Nazwa, Cena)
Zamowienie (NrZam PK, DataZam, IdKlienta FK)
PozycjaZam (NrZam PK/FK, KodTowaru PK/FK, Ilosc)</pre>
<p>Исходная таблица была только в 1НФ.</p>` }
  ]
},

't02-sql': {
  title: 'Упражнения 2: SQL — повторение 1',
  lead: 'SELECT, сортировка, DISTINCT, соединения, LIKE, IN, BETWEEN, NULL, простые агрегаты и DML на базе «Прокат авто».',
  intro: `<p>База: <a href="#/tasks/databases">Прокат авто</a>. Решения на диалекте MS SQL; отличия Oracle — в комментариях.</p>`,
  items: [
    { q: `<p>Выведите всех клиентов, отсортированных по фамилии по убыванию, а при одинаковой фамилии — по имени по возрастанию.</p>`, sol: `<div data-code="s02-01"></div>` },
    { q: `<p>Выведите без повторов все количества мест в машинах, от наименьшего.</p>`, sol: `<div data-code="s02-02"></div>` },
    { q: `<p>Выведите все прокаты клиентки <strong>Ewa Pawlak</strong> (даты и номер машины).</p>`, sol: `<div data-code="s02-03"></div>` },
    { q: `<p>Выведите прокаты, начатые в <strong>2024</strong> году клиентами, чья фамилия начинается на «K» или «P». Покажите имя, фамилию, марку машины и дату.</p>`,
      hint: `<p>Три таблицы. Следите за порядком AND/OR — нужны скобки. Год: <code>YEAR()</code> в MS SQL, <code>EXTRACT(YEAR FROM …)</code> в Oracle.</p>`, sol: `<div data-code="s02-04"></div>` },
    { q: `<p>На машинах каких марок ездил <strong>Jan Kowalczyk</strong>? (без повторов)</p>`, sol: `<div data-code="s02-05"></div>` },
    { q: `<p>Выведите количество машин в каждом классе (название класса + количество).</p>`, sol: `<div data-code="s02-06"></div>` },
    { q: `<p>Выведите клиентов и их прокаты так, чтобы в результате был <strong>каждый</strong> клиент — даже тот, кто ни разу ничего не брал.</p>`, hint: `<p>Внешнее соединение со стороны Klient.</p>`, sol: `<div data-code="s02-07"></div>` },
    { q: `<p>Выведите клиентов, которые брали машину № <strong>11</strong> и <strong>не заплатили</strong>.</p>`, sol: `<div data-code="s02-08"></div>` },
    { q: `<p>Выведите: «Фамилия Имя» в одном столбце с названием <em>Klient</em>, DataOd, DataDo, марку машины, название класса.</p>`, sol: `<div data-code="s02-09"></div>` },
    { q: `<p>Одним запросом выведите: прокаты машин класса <strong>premium</strong> клиентами со скидкой <strong>не меньше 10</strong> <em>и</em> прокаты машин класса <strong>ekonomiczna</strong> клиентами <strong>без оговорённой скидки</strong> (NULL).</p>`,
      hint: `<p>Два условия с AND, соединённые через OR — каждое в скобках. NULL проверяется через IS NULL.</p>`, sol: `<div data-code="s02-10"></div>` },
    { q: `<p>Выведите (без повторов) клиентов, у которых <strong>есть</strong> оговорённая скидка (не NULL) и которые хотя бы раз брали машину.</p>`, sol: `<div data-code="s02-11"></div>` },
    { q: `<p>Выведите прокаты машин <strong>Toyota, Skoda, Kia</strong>: имя, фамилию, дату и марку.</p>`, sol: `<div data-code="s02-12"></div>` },
    { q: `<p>Выведите классы, у которых цена за сутки в диапазоне <strong>&lt;150, 300&gt;</strong>.</p>`, sol: `<div data-code="s02-13"></div>` },
    { q: `<p>Выведите фамилии и имена (в одном столбце с названием <em>Dluznik</em> = должник) клиентов с неоплаченным прокатом. Без повторов, сортировка по фамилии, потом по имени.</p>`, sol: `<div data-code="s02-14"></div>` },
    { q: `<p>Сколько прокатов оплачено?</p>`, sol: `<div data-code="s02-15"></div>` },
    { q: `<p>Сколько прокатов началось в <strong>2025</strong> году?</p>`, sol: `<div data-code="s02-16"></div>` },
    { q: `<p>Добавьте нового клиента (любые данные) и один прокат для него.</p>`, sol: `<div data-code="s02-17"></div>` },
    { q: `<p>Продлите только что добавленный прокат на <strong>2 дня</strong>.</p>`, sol: `<div data-code="s02-18"></div>` },
    { q: `<p>Удалите этот прокат.</p>`, sol: `<div data-code="s02-19"></div>` },
    { q: `<p><em>(Дополнительно, от автора)</em> Для каждого проката посчитайте число дней и сумму к оплате: дни × цена класса за сутки, уменьшенная на скидку клиента (NULL = 0%).</p>`,
      hint: `<p>MS SQL: <code>DATEDIFF(day, DataOd, DataDo)</code>; Oracle: <code>DataDo - DataOd</code>.</p>`, sol: `<div data-code="s02-20"></div>` }
  ]
},

't03-sql': {
  title: 'Упражнения 3: SQL — повторение 2',
  lead: 'Группировка с HAVING, подзапросы (обычные и коррелированные), NOT EXISTS, UNION, ALL и CTE на базе «Прокат авто».',
  intro: `<p>База: <a href="#/tasks/databases">Прокат авто</a>.</p>`,
  items: [
    { q: `<p>Выведите клиентов с количеством их прокатов. Покажите только тех, кто брал машину <strong>минимум дважды</strong>.</p>`, sol: `<div data-code="s03-01"></div>` },
    { q: `<p>Выведите машины с <strong>наименьшим</strong> числом мест.</p>`, hint: `<p>Подзапрос с MIN в WHERE.</p>`, sol: `<div data-code="s03-02"></div>` },
    { q: `<p>Для каждой машины выведите дату её <strong>первого</strong> проката. Машины, которые ни разу не брали, тоже должны быть.</p>`, sol: `<div data-code="s03-03"></div>` },
    { q: `<p>Выведите число прокатов каждой машины. Пропустите машины класса <strong>van</strong> и машины, которые брали <strong>только один раз</strong>.</p>`, hint: `<p>Какое условие идёт в WHERE, а какое в HAVING?</p>`, sol: `<div data-code="s03-04"></div>` },
    { q: `<p>Выведите данные (имя, фамилия, номер машины, дата) <strong>самого старого</strong> проката.</p>`, sol: `<div data-code="s03-05"></div>` },
    { q: `<p>Выведите машины, которые <strong>ни разу</strong> не брали.</p>`, sol: `<div data-code="s03-06"></div>` },
    { q: `<p>С помощью <strong>NOT EXISTS</strong> выведите клиентов, которые ни разу не ездили на машине класса <strong>premium</strong>.</p>`, sol: `<div data-code="s03-07"></div>` },
    { q: `<p>Одним запросом выведите: клиентов, бравших машину класса <strong>SUV</strong> (имя, фамилия, дата), и клиентов, которые ничего не брали (имя, фамилия, текст «brak» = нет).</p>`,
      hint: `<p>UNION требует совместимых типов столбцов — дату нужно превратить в текст.</p>`, sol: `<div data-code="s03-08"></div>` },
    { q: `<p>Найдите класс, в котором <strong>больше всего машин</strong>.</p>`, hint: `<p><code>HAVING COUNT(*) &gt;= ALL (…)</code></p>`, sol: `<div data-code="s03-09"></div>` },
    { q: `<p>Для каждого класса выведите машину(ы) с <strong>наибольшим</strong> числом мест.</p>`, hint: `<p>Подзапрос, коррелированный по IdKlasa.</p>`, sol: `<div data-code="s03-10"></div>` },
    { q: `<p><em>(Дополнительно, от автора)</em> С помощью CTE выведите клиентов, у которых суммарное число дней проката выше среднего среди всех клиентов, бравших машины.</p>`, sol: `<div data-code="s03-11"></div>` }
  ]
},

't04-tsql': {
  title: 'Упражнения 4: T-SQL — основы',
  lead: 'Переменные, PRINT, IF, первые процедуры с параметрами и проверкой данных — на базе «Курьеры» (MS SQL).',
  intro: `<p>База: <a href="#/tasks/databases">Курьеры (MS SQL)</a>.</p>`,
  items: [
    { q: `<p>Объявите переменную, запишите в неё число сотрудников отделения с названием <strong>POLNOC</strong> и выведите через PRINT сообщение «Oddział POLNOC zatrudnia N osób» (в отделении POLNOC работает N человек).</p>`, sol: `<div data-code="s04-01"></div>` },
    { q: `<p>Проверьте, сколько сотрудников в отделении <strong>30</strong>. Если меньше 6 — примите курьера <strong>NOWICKI</strong> (зарплата 2500, начальник 102, сегодняшняя дата, номер = наибольший + 1) и выведите сообщение. Иначе выведите, что никого не приняли.</p>`, sol: `<div data-code="s04-02"></div>` },
    { q: `<p>Напишите процедуру, которая возвращает курьеров с зарплатой в диапазоне, заданном <strong>двумя параметрами</strong> (от, до), отсортированных по зарплате.</p>`, sol: `<div data-code="s04-03"></div>` },
    { q: `<p>Напишите процедуру, добавляющую отделение (номер, название, город). Если отделение с таким названием <strong>или</strong> в таком городе уже есть — не добавлять и вывести сообщение; иначе добавить и подтвердить.</p>`, sol: `<div data-code="s04-04"></div>` },
    { q: `<p>Напишите процедуру приёма курьера. Параметры: фамилия и номер отделения. Процедура:</p>
<ul><li>выдаёт ошибку, если отделения нет;</li>
<li>ставит зарплату, равную <strong>наименьшей зарплате среди сотрудников с должностью KURIER</strong> этого отделения (если таких нет — 2500);</li>
<li>назначает начальником <strong>руководителя</strong> отделения (KIEROWNIK);</li>
<li>номер = наибольший существующий + 1.</li></ul>`,
      hint: `<p>RAISERROR вне TRY не останавливает процедуру — после него нужен RETURN.</p>`, sol: `<div data-code="s04-05"></div>` }
  ]
},

't05-tsql-cursors': {
  title: 'Упражнения 5: T-SQL — курсоры',
  lead: 'Курсор, изменяющий данные, та же логика в процедуре с параметрами, премии относительно среднего и «склад» без курсора.',
  intro: `<p>Базы: <a href="#/tasks/databases">Курьеры + Regal (MS SQL)</a>.</p>`,
  items: [
    { q: `<p>С помощью курсора пройдите по курьерам и измените зарплаты: ниже <strong>2500</strong> — повышение на <strong>5%</strong>, выше <strong>6000</strong> — снижение на <strong>5%</strong>. Выводите каждое изменение («ФАМИЛИЯ: старая -&gt; новая»).</p>`, sol: `<div data-code="s05-01"></div>` },
    { q: `<p>Превратите упражнение 1 в процедуру: пороги (нижний, верхний) и процент изменения должны быть параметрами (процент по умолчанию 5).</p>`, sol: `<div data-code="s05-02"></div>` },
    { q: `<p>Напишите процедуру, которая для отделения, переданного параметром, считает среднюю зарплату и даёт курьерам этого отделения, зарабатывающим <strong>ниже среднего</strong>, премию в размере <strong>8%</strong> зарплаты. Выведите, кто получил премию.</p>`, sol: `<div data-code="s05-03"></div>` },
    { q: `<p><em>(без курсора)</em> В таблице Regal найдите товар с <strong>наименьшим</strong> остатком и увеличьте его остаток на <strong>10</strong>. При равенстве меняйте только одну строку (с меньшим номером полки). Если наименьший остаток 50 или больше — выдайте ошибку «нечего заказывать».</p>`,
      hint: `<p><code>SELECT TOP 1 … ORDER BY Sztuk, IdPolki</code> даёт ровно одну строку.</p>`, sol: `<div data-code="s05-04"></div>` },
    { q: `<p>Превратите упражнение 4 в процедуру, которой передаётся <strong>количество штук</strong> для заказа.</p>`, sol: `<div data-code="s05-05"></div>` },
    { q: `<p><em>(Дополнительно, от автора)</em> Сделайте упражнение 1 <strong>одним оператором UPDATE</strong>, показав изменения с помощью предложения OUTPUT.</p>`, sol: `<div data-code="s05-06"></div>` }
  ]
},

't06-tsql-triggers': {
  title: 'Упражнения 6: T-SQL — триггеры',
  lead: 'Блокировка операций, дополнение данных, проверка значений, сводная таблица и составные правила — в том числе для многих строк.',
  intro: `<p>База: <a href="#/tasks/databases">Курьеры (MS SQL)</a>. После каждого упражнения удаляйте триггер (<code>DROP TRIGGER имя</code>), чтобы он не мешал следующим.</p>
<div data-note="warn"><p>Помните: триггер T-SQL срабатывает <strong>один раз на оператор</strong>. Проверяйте каждое решение и оператором, который меняет несколько строк сразу.</p></div>`,
  items: [
    { q: `<p>Создайте триггер, который не позволяет удалить ни одно <strong>отделение</strong>.</p>`, sol: `<div data-code="s06-01"></div>` },
    { q: `<p>Создайте триггер, который при добавлении курьера без <strong>даты приёма</strong> подставляет сегодняшнюю дату. <em>(Это можно сделать через DEFAULT — здесь тренируем триггер.)</em></p>`, sol: `<div data-code="s06-02"></div>` },
    { q: `<p>Создайте триггер, который при INSERT и UPDATE проверяет, что зарплата в диапазоне <strong>2000–12000</strong>; если нет — выдаёт ошибку и откатывает.</p>`, sol: `<div data-code="s06-03"></div>` },
    { q: `<p>Создайте таблицу <code>FunduszPlac (Suma, Liczba)</code> с одной строкой: сумма зарплат и число курьеров. Заполните её одним оператором, затем напишите триггер, который поддерживает её в актуальном состоянии при INSERT, UPDATE и DELETE в Kurier.</p>`,
      hint: `<p>Сумма меняется на SUM(inserted) − SUM(deleted), количество — на COUNT(inserted) − COUNT(deleted). Не забудьте ISNULL.</p>`, sol: `<div data-code="s06-04"></div>` },
    { q: `<p>Напишите триггер, который не позволяет менять <strong>город</strong> отделения, но разрешает менять название и добавлять новые отделения.</p>`, sol: `<div data-code="s06-05"></div>` },
    { q: `<p>Напишите <strong>один</strong> триггер, который:</p>
<ul><li>не позволяет удалить курьера, принятого <strong>до 2020 года</strong>;</li>
<li>не позволяет менять должность человеку, который является <strong>DYREKTOR</strong> (директор);</li>
<li>не позволяет добавить курьера с фамилией, которая <strong>уже есть в том же отделении</strong>.</li></ul>`,
      hint: `<p>Операцию можно распознать по тому, пусты ли inserted/deleted.</p>`, sol: `<div data-code="s06-06"></div>` },
    { q: `<p>Напишите триггер, который не позволяет поднять зарплату <strong>более чем на 20%</strong> за одну операцию и не позволяет удалять сотрудников <strong>головного офиса (отделение 10)</strong>.</p>`, sol: `<div data-code="s06-07"></div>` }
  ]
},

't07-indexes-transactions': {
  title: 'Упражнения 7: индексы и транзакции',
  lead: 'Сравнение планов выполнения с разными индексами и эксперименты с транзакциями в двух окнах SSMS.',
  intro: `<p>Лучше всего на локальном сервере <code>(localdb)\\MSSQLLocalDB</code>. Сначала создайте таблицы <strong>Odczyty</strong> и <strong>Konto</strong> из раздела <a href="#/tasks/databases">Учебные базы</a>. План выполнения включается сочетанием <kbd>Ctrl</kbd>+<kbd>M</kbd>; сравнивайте <em>Estimated Subtree Cost</em> оператора SELECT (самого левого).</p>`,
  items: [
    { h: 'Индексы' },
    { q: `<p>Выполните <code>SELECT * FROM Odczyty WHERE Czujnik = 777</code> и посмотрите на план. Какой оператор появился и какова стоимость?</p>`, sol: `<div data-code="s07-02"></div>` },
    { q: `<p>Создайте <strong>некластерный</strong> индекс по Czujnik, повторите запрос и сравните план и стоимость. Удалите индекс.</p>`, sol: `<div data-code="s07-03"></div>` },
    { q: `<p>Стратегия «только индекс»: выполните <code>SELECT Czujnik, Wartosc … WHERE Czujnik = 777</code>, затем создайте составной индекс (Czujnik, Wartosc) и сравните. Сколько операторов в плане?</p>`, sol: `<div data-code="s07-04"></div>` },
    { q: `<p>Поиск по диапазону: <code>WHERE Czujnik BETWEEN 30000 AND 45000</code> — без индекса, с некластерным и с кластерным. Когда сервер использует индекс?</p>`, sol: `<div data-code="s07-05"></div>` },
    { q: `<p>Сортировка: <code>SELECT * FROM Odczyty ORDER BY Czujnik</code> — без индекса, с некластерным и с кластерным. Исчезает ли оператор Sort?</p>`, sol: `<div data-code="s07-06"></div>` },
    { h: 'Транзакции' },
    { q: `<p>С включённым <code>IMPLICIT_TRANSACTIONS</code>: добавьте два счёта, проверьте содержимое, ROLLBACK, проверьте; добавьте третий счёт, COMMIT, проверьте.</p>`, sol: `<div data-code="s07-07"></div>` },
    { q: `<p>Повторите с <code>IMPLICIT_TRANSACTIONS OFF</code>. Что происходит при ROLLBACK и почему? Потом снова включите опцию.</p>`, sol: `<div data-code="s07-08"></div>` },
    { q: `<p>Два окна: в окне 1 измените баланс счёта (без COMMIT), в окне 2 прочитайте таблицу. Что происходит с окном 2? Сделайте COMMIT в окне 1.</p>`, sol: `<div data-code="s07-09-a"></div><div data-code="s07-09-b"></div>` },
    { q: `<p>В окне 2 установите уровень <strong>READ UNCOMMITTED</strong> и повторите эксперимент. Видны ли незафиксированные данные?</p>`, sol: `<div data-code="s07-10"></div>` },
    { q: `<p>В обоих окнах установите <strong>SERIALIZABLE</strong>, выполните SELECT в обоих, затем INSERT в окне 1. Что происходит и чем это отличается от READ COMMITTED?</p>`, sol: `<div data-code="s07-11"></div>` }
  ]
},

't08-backup-security': {
  title: 'Упражнения 8: файлы базы, резервные копии и права',
  lead: 'Создание базы и файловых групп, полные/разностные копии и копии журнала, восстановление на момент времени, логины, пользователи, роли и DENY.',
  intro: `<p>На занятиях это делается в основном в Management Studio (GUI). У каждого шага ниже есть и SQL-вариант — пригодится на экзамене. Работайте на локальном сервере и своей базе <strong>Treningowa</strong>; заранее создайте папку <code>C:\\SBD</code>.</p>`,
  items: [
    { h: 'Файлы и файловые группы' },
    { q: `<p>Создайте базу <strong>Treningowa</strong>. Проверьте, где лежат файлы данных и журнала и какого они размера.</p>`, sol: `<p>GUI: Databases → New Database (на вкладке Files видны .mdf и .ldf).</p><div data-code="s08-01"></div>` },
    { q: `<p>Добавьте файловую группу <strong>Archiwum</strong> и новый файл данных в другом месте.</p>`, sol: `<p>GUI: Properties → Filegroups → Add, затем Files → Add (выберите группу).</p><div data-code="s08-02"></div>` },
    { q: `<p>Разместите таблицу в файловой группе Archiwum.</p>`, sol: `<div data-code="s08-03"></div>` },
    { h: 'Резервные копии' },
    { q: `<p>Установите модель восстановления базы <strong>Full</strong>.</p>`, sol: `<div data-code="s08-04"></div>` },
    { q: `<p>Сделайте полную копию, удалите базу и восстановите её из копии.</p>`, sol: `<div data-code="s08-05"></div>` },
    { q: `<p>Полная копия → изменение → разностная копия → изменение → копия журнала. Удалите базу и восстановите всё по порядку. Вернулись ли оба изменения?</p>`, hint: `<p>Всё, кроме последней копии — WITH NORECOVERY.</p>`, sol: `<div data-code="s08-06"></div>` },
    { q: `<p>Полная копия → изменение в запомненный момент → копия журнала. Восстановите базу на момент <strong>непосредственно перед</strong> изменением.</p>`, sol: `<div data-code="s08-07"></div>` },
    { h: 'Права' },
    { q: `<p>Создайте логин <strong>kasjer</strong> (SQL Server Authentication). Войдите под ним во втором окне. Можно ли открыть базу Treningowa?</p>`, sol: `<div data-code="s08-08"></div>` },
    { q: `<p>Создайте пользователя базы для этого логина. Можно ли теперь войти в базу и выполнить SELECT?</p>`, sol: `<div data-code="s08-09"></div>` },
    { q: `<p>Дайте пользователю SELECT и UPDATE на таблицу Klient. Проверьте разрешённые и запрещённые операции.</p>`, sol: `<div data-code="s08-10"></div>` },
    { q: `<p>Создайте роль <strong>magazynierzy</strong>, добавьте в неё пользователя и дайте роли другие права. Получил ли их пользователь?</p>`, sol: `<div data-code="s08-11"></div>` },
    { q: `<p>Запретите (DENY) операцию на уровне роли и разрешите (GRANT) её пользователю. Может ли пользователь её выполнить?</p>`, sol: `<div data-code="s08-12"></div>` }
  ]
},

't09-plsql': {
  title: 'Упражнения 9: PL/SQL — основы',
  lead: 'Анонимные блоки, SELECT INTO, IF, первые процедуры с RAISE_APPLICATION_ERROR — на базе «Курьеры» (Oracle).',
  intro: `<p>База: <a href="#/tasks/databases">Курьеры + Regal (Oracle)</a>. Не забудьте <code>SET SERVEROUTPUT ON</code>.</p>`,
  items: [
    { q: `<p>В блоке PL/SQL посчитайте курьеров, у которых есть премия (не NULL), и выведите результат.</p>`, sol: `<div data-code="s09-01"></div>` },
    { q: `<p>Проверьте, сколько сотрудников в отделении <strong>20</strong>. Если меньше 6 — примите курьера <strong>NOWICKA</strong> (зарплата 2600, начальник 101, номер = max + 1) и выведите сообщение; иначе выведите, что никого не приняли.</p>`, sol: `<div data-code="s09-02"></div>` },
    { q: `<p>Напишите процедуру добавления отделения (номер, название, город): если отделение с таким <strong>названием</strong> существует — выдать ошибку (RAISE_APPLICATION_ERROR); если в этом <strong>городе</strong> уже есть отделение — только вывести сообщение; иначе добавить.</p>`, sol: `<div data-code="s09-03"></div>` },
    { q: `<p>Напишите процедуру приёма курьера (параметры: номер отделения, фамилия). Если отделения нет — ошибка. Зарплата = <strong>округлённая средняя</strong> зарплата отделения (если сотрудников нет — 2500), номер = max + 1, дата = сегодня.</p>`,
      hint: `<p>Существование проверяйте через <code>SELECT COUNT(*) INTO …</code> — а не однострочным SELECT.</p>`, sol: `<div data-code="s09-04"></div>` },
    { q: `<p>В блоке PL/SQL найдите на полках товар с <strong>наибольшим</strong> остатком (при равенстве — с меньшим номером полки) и выдайте <strong>3</strong> штуки. Если их меньше 3 — выдайте ошибку.</p>`, sol: `<div data-code="s09-05"></div>` }
  ]
},

't10-plsql-cursors': {
  title: 'Упражнения 10: PL/SQL — курсоры',
  lead: 'Явный курсор, процедура с параметрами, премии относительно среднего, складская процедура, цикл FOR и курсор с параметром.',
  intro: `<p>База: <a href="#/tasks/databases">Курьеры + Regal (Oracle)</a>.</p>`,
  items: [
    { q: `<p>С помощью курсора (OPEN / FETCH / EXIT WHEN / CLOSE) пройдите по курьерам: зарплата ниже <strong>2300</strong> → +8%, выше <strong>6000</strong> → −3%. Выводите каждое изменение.</p>`,
      hint: `<p>Обнуляйте переменную новой зарплаты в начале каждой итерации, иначе значение «переедет» из предыдущей строки.</p>`, sol: `<div data-code="s10-01"></div>` },
    { q: `<p>Превратите это в процедуру с параметрами: нижний порог, верхний порог, процент повышения (по умолчанию 8), процент снижения (по умолчанию 3).</p>`, sol: `<div data-code="s10-02"></div>` },
    { q: `<p>Процедура для отделения, переданного параметром: курьерам, зарабатывающим ниже среднего по отделению, <strong>добавить 150</strong> к премии (NULL считать 0). Вывести, сколько человек её получили.</p>`, sol: `<div data-code="s10-03"></div>` },
    { q: `<p>Превратите упражнение 5 из набора 9 в процедуру: передаётся, <strong>сколько штук</strong> выдать. Если на полке слишком мало — ошибка.</p>`, sol: `<div data-code="s10-04"></div>` },
    { q: `<p>Перепишите упражнение 1 с курсорным <strong>циклом FOR</strong> (бонус: <code>FOR UPDATE</code> + <code>WHERE CURRENT OF</code>).</p>`, sol: `<div data-code="s10-05"></div>` },
    { q: `<p><em>(Дополнительно, от автора)</em> Курсор с параметром (номер отделения): выведите рейтинг зарплат отделения 30 в виде «1. ФАМИЛИЯ зарплата», используя <code>%ROWCOUNT</code>.</p>`, sol: `<div data-code="s10-06"></div>` }
  ]
},

't11-plsql-triggers': {
  title: 'Упражнения 11: PL/SQL — триггеры',
  lead: 'BEFORE/AFTER, уровень оператора и строки, :OLD/:NEW, INSERTING/UPDATING/DELETING и сводная таблица.',
  intro: `<p>База: <a href="#/tasks/databases">Курьеры (Oracle)</a>. После проверки отключите триггер (<code>ALTER TRIGGER … DISABLE</code>) или удалите его.</p>`,
  items: [
    { q: `<p>Создайте триггер, который не позволяет удалить ни одно <strong>отделение</strong>.</p>`, sol: `<div data-code="s11-01"></div>` },
    { q: `<p>Создайте триггер, который при INSERT и при UPDATE зарплаты не допускает зарплату <strong>ниже 2000</strong>. <em>(Это можно сделать через CHECK — тренируем триггер.)</em></p>`, sol: `<div data-code="s11-02"></div>` },
    { q: `<p>Создайте таблицу <code>FunduszPlac (Suma, Liczba)</code> (одна строка: сумма зарплат и число курьеров) и строковый триггер, который поддерживает её актуальной при INSERT, UPDATE зарплаты и DELETE.</p>`, sol: `<div data-code="s11-03"></div>` },
    { q: `<p>Напишите <strong>один</strong> триггер, который:</p>
<ul><li>не позволяет удалить человека с должностью <strong>KIEROWNIK</strong> или <strong>DYREKTOR</strong>;</li>
<li>не позволяет менять <strong>дату приёма</strong>;</li>
<li>не позволяет добавить курьера с фамилией, которая уже есть <strong>в том же отделении</strong>.</li></ul>`, sol: `<div data-code="s11-04"></div>` },
    { q: `<p>Напишите триггер, который не позволяет <strong>уменьшать премию</strong> и не позволяет удалять сотрудников <strong>головного офиса (отделение 10)</strong>.</p>`, sol: `<div data-code="s11-05"></div>` }
  ]
},

'k1-tsql': {
  title: 'Пробная контрольная K1 (T-SQL)',
  lead: 'Собственный набор в стиле контрольной: процедура с проверкой данных и триггер с несколькими правилами — MS SQL Server.',
  intro: `<div data-note="own"><p>В прошлогодних материалах была контрольная по PL/SQL (набор K2 ниже). Этот набор — её аналог на T-SQL, сделанный автором сайта, на случай если контрольная будет охватывать и MS SQL Server.</p></div>
<p>Таблица: <strong>Produkt (IdProdukt, Nazwa, Cena, Stan)</strong> из раздела <a href="#/tasks/databases">Учебные базы</a>. Постарайтесь уложиться в 45 минут.</p>`,
  items: [
    { q: `<p>Напишите процедуру <code>Uzupelnij</code> с параметром <em>название товара</em>:</p>
<ul><li>если товара нет — выдать ошибку;</li>
<li>если остаток меньше <strong>5</strong> — вывести «критически низкий остаток … – закажите у поставщика»;</li>
<li>иначе увеличить остаток на <strong>20</strong> и вывести сообщение.</li></ul>`, sol: `<div data-code="k1-01"></div>` },
    { q: `<p>Напишите триггер на таблицу Produkt, который:</p>
<ul><li>не позволяет менять <strong>название</strong> товара;</li>
<li>не позволяет поднять цену <strong>более чем на 15%</strong>;</li>
<li>не допускает <strong>отрицательный</strong> остаток;</li>
<li>при изменении цены выводит, на сколько процентов она изменилась.</li></ul>`,
      hint: `<p>Сравнивайте inserted с deleted, соединяя по IdProdukt; помните о многих строках.</p>`, sol: `<div data-code="k1-02"></div>` }
  ]
},

'k2-plsql': {
  title: 'Пробная контрольная K2 (PL/SQL)',
  lead: 'Та же логика, что в прошлогодней контрольной (процедура + триггер на PL/SQL), но другая таблица, пороги и правила.',
  intro: `<p>Таблица: <strong>Produkt (IdProdukt, Nazwa, Cena, Stan)</strong> в Oracle — из раздела <a href="#/tasks/databases">Учебные базы</a>.</p>
<div data-note="warn"><p>Частая ошибка: проверять существование товара через <code>IF v_stan = 0</code> после <code>SELECT … INTO</code>. Если строки нет, SELECT INTO выбрасывает <code>NO_DATA_FOUND</code> — до IF дело не доходит. Это нужно обработать в разделе EXCEPTION (или использовать COUNT).</p></div>`,
  items: [
    { q: `<p>Напишите процедуру <code>Uzupelnij(p_nazwa)</code>:</p>
<ul><li>товара нет → <code>RAISE_APPLICATION_ERROR</code>;</li>
<li>остаток меньше <strong>10</strong> → сообщение «слишком мало … – сначала закажите»;</li>
<li>иначе остаток + <strong>25</strong> и сообщение.</li></ul>`, sol: `<div data-code="k2-01"></div>` },
    { q: `<p>Напишите триггер на таблицу Produkt, который:</p>
<ul><li>при изменении не позволяет менять <strong>название</strong>;</li>
<li>выводит процент изменения цены и не позволяет <strong>снизить</strong> цену более чем на <strong>25%</strong>;</li>
<li>не допускает <strong>отрицательный</strong> остаток (при INSERT и UPDATE).</li></ul>`, sol: `<div data-code="k2-02"></div>` }
  ]
},

'project': {
  title: 'Проект: своя база + процедуры и триггеры',
  lead: 'Что сдавать (по опыту прошлого года), план работы, чек-лист и полный пример «Фитнес-клуб» на Oracle и MS SQL.',
  intro: `
<div data-note="info" data-label="Требования — по проекту прошлого года"><p>Точные требования даст преподаватель упражнений. Сданный в прошлом году проект подсказывает объём: <strong>ERD</strong> (Vertabelo) → <strong>скрипт создания таблиц</strong> и заполнения данными для <strong>Oracle и MS SQL</strong> → <strong>процедуры и триггеры</strong> на обоих диалектах (в прошлом году: 2 процедуры, одна с курсором, и 2 триггера).</p></div>
<h2>План работы</h2>
<ol class="steps">
  <li>Выберите понятную вам предметную область (5–10 таблиц) и опишите её в 5–6 предложениях.</li>
  <li>Нарисуйте ERD: минимум одна связь M:N (ассоциативная таблица), разумные ключи, NOT NULL, UNIQUE, CHECK.</li>
  <li>Проверьте нормализацию (3НФ).</li>
  <li>Сгенерируйте DDL для Oracle и MS SQL, поправьте типы (VARCHAR2/NUMBER и VARCHAR/INT/DECIMAL).</li>
  <li>Вставьте тестовые данные так, чтобы можно было показать каждую процедуру и триггер (включая ошибочные случаи).</li>
  <li>Сначала напишите процедуры и триггеры на одном диалекте, протестируйте, затем перепишите на другой.</li>
  <li>К каждому объекту добавьте комментарий «что делает» и тестовый скрипт.</li>
</ol>
<div data-note="own" data-label="От автора сайта — чек-лист">
<ul>
  <li>Процедура с <strong>параметрами</strong>, проверяющая входные данные (ошибка через RAISERROR / RAISE_APPLICATION_ERROR).</li>
  <li>Процедура с <strong>курсором</strong> (и обоснованием, почему курсор здесь уместен).</li>
  <li>Триггер, который <strong>блокирует</strong> недопустимую операцию.</li>
  <li>Триггер, который <strong>поддерживает производные данные</strong> (счётчик, история, сводка).</li>
  <li>T-SQL: триггеры работают для многих строк (inserted/deleted). PL/SQL: нет mutating table, нет COMMIT в триггере.</li>
  <li>Новые ключи: MAX + 1 с NVL/ISNULL или IDENTITY/последовательность.</li>
  <li>Скрипт выполняется «с нуля» без ошибок (порядок CREATE/DROP!).</li>
</ul>
</div>
<h2>Пример: «Фитнес-клуб»</h2>
<p>Люди могут быть членами клуба и/или тренерами. Тренер ведёт занятия в залах определённой вместимости; члены клуба записываются на занятия (M:N). Изменения ставок тренеров записываются в таблицу истории.</p>
<pre data-lang="text">Osoba (IdOsoba PK, Imie, Nazwisko, Telefon UNIQUE)                  ← человек
Klubowicz (IdKlubowicz PK, IdOsoba FK UNIQUE, DataDolaczenia)     ← член клуба, 1:1 с Osoba
Trener (IdTrener PK, IdOsoba FK UNIQUE, Stawka CHECK > 0)          ← тренер, 1:1 с Osoba
Sala (IdSala PK, Nazwa, Pojemnosc)                                   ← зал + вместимость
Zajecia (IdZajecia PK, Nazwa, IdTrener FK, IdSala FK, Termin, CzasMin)
Zapis (IdZajecia PK/FK, IdKlubowicz PK/FK)                           ← записи M:N
HistoriaStawek (IdTrener FK, StaraStawka, NowaStawka, DataZmiany)   ← история ставок</pre>
<div data-note="warn"><p>Это учебный пример — не сдавайте его как свой проект. Выберите свою предметную область и свои правила.</p></div>`,
  items: [
    { q: `<p><strong>Таблицы и данные.</strong></p>`, sol: `<div data-code="proj-ddl-ora"></div><div data-code="proj-ddl-ms"></div>` },
    { q: `<p><strong>Процедура 1 (с курсором):</strong> записать человека (имя, фамилия, телефон) на ближайшее будущее занятие с заданным названием, где ещё есть свободное место. Если человека нет — добавить; если он не член клуба — добавить запись члена клуба.</p>`, sol: `<div data-code="proj-p1-ora"></div><div data-code="proj-p1-ms"></div>` },
    { q: `<p><strong>Процедура 2:</strong> сделать существующего человека тренером со ставкой, равной средней ставке тренеров; если он уже тренер — только сообщение; если человека нет — ошибка.</p>`, sol: `<div data-code="proj-p2-ora"></div><div data-code="proj-p2-ms"></div>` },
    { q: `<p><strong>Триггер 1:</strong> не допускать записи сверх вместимости зала.</p>`, hint: `<p>В Oracle строковый триггер на Zapis не может читать Zapis (mutating) — используйте триггер уровня оператора.</p>`, sol: `<div data-code="proj-t1-ora"></div><div data-code="proj-t1-ms"></div>` },
    { q: `<p><strong>Триггер 2:</strong> записывать каждое изменение ставки тренера в HistoriaStawek; не позволять снижать ставку более чем на 10%.</p>`, sol: `<div data-code="proj-t2-ora"></div><div data-code="proj-t2-ms"></div>` }
  ]
}

});
