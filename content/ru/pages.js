/* RU – страницы: главная (легенда), условия зачёта, введение к упражнениям */
SBD.addPages('ru', {

home: {
  news: `
<div data-note="info" data-label="Новости · 29.09.2026">
  <p>Прошла первая лекция семестра (повторение реляционных баз данных). На следующей неделе — второе повторение, затем процедурные языки T-SQL и PL/SQL. Преподаватель анонсировал материалы в EDUX (слайды + файл о нормализации). <a href="#/course">Все правила и даты →</a></p>
</div>`,
  legend: `
<div data-note="lecture"><p>Прозвучало на лекции или есть в слайдах преподавателя (например, замечание или пример из записи).</p></div>
<div data-note="exam"><p>Легко может попасться на экзамене или нужно на занятиях.</p></div>
<div data-note="warn"><p>Типичная ошибка — лучше запомнить заранее, чем совершить.</p></div>
<div data-note="tip"><p>Практический совет или объяснение простыми словами с примером.</p></div>
<div data-note="own"><p>Материал, добавленный автором сайта — <strong>этого нет в лекциях</strong> (рекомендации, дополнительные примеры, тест, калькулятор).</p></div>`
},

course: {
  title: 'Как сдать предмет: экзамен и даты',
  lead: 'Всё, что известно о сдаче «Систем баз данных» (SBD) в зимнем семестре 2026/27 — с указанием источника каждой информации.',
  body: `
<p><span class="status status--confirmed">EDUX — подтверждено</span> <span class="status status--lecture">из записи 29.09.2026</span> <span class="status status--estimated">оценка</span> <span class="status status--unknown">нет данных</span></p>
<p>У каждого пункта есть метка, чтобы было видно, насколько он достоверен. Состояние на <strong>29.09.2026</strong>.</p>

<h2>Основная информация</h2>
<table>
  <tbody>
    <tr><th>Предмет</th><td>Systemy baz danych (SBD) — лекция, дневное отделение, группа 1w</td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Семестр</th><td>зимний 2026/2027</td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Форма лекций</th><td><strong>дистанционно, через MS Teams</strong></td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Курс в EDUX</th><td>Paweł Lenkiewicz (pawell@pjwstk.edu.pl)</td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Лекции</th><td>повторение + T-SQL + PL/SQL (лектор первой лекции); администрирование баз данных — 5 лекций (Paweł Lenkiewicz, на MS SQL Server); хранилища данных — 1 лекция (Agnieszka Chądzyńska-Krasowska)</td><td><span class="status status--lecture">запись</span></td></tr>
    <tr><th>Связь с RBD</th><td>SBD — продолжение «Реляционных баз данных» (RBD); правила зачёта SBD и RBD <strong>одинаковые</strong></td><td><span class="status status--lecture">запись</span></td></tr>
  </tbody>
</table>
<div data-note="lecture"><p>В заголовке правил в EDUX написано «Systemy Bazy Danych (RBD)» — преподаватель сказал, что это ошибка и он исправит на SBD. Правила такие же, как для RBD.</p></div>

<h2>Условия зачёта предмета</h2>
<p>Нужно <strong>и то, и другое</strong>:</p>
<ol class="steps">
  <li><strong>Зачёт по упражнениям (ćwiczenia)</strong> — оценка не ниже <strong>3.0</strong>. Правила упражнений устанавливает <strong>каждый преподаватель</strong> для своих групп. <span class="status status--confirmed">EDUX</span></li>
  <li><strong>Сданный экзамен</strong> — минимум <strong>10 баллов</strong> в тесте. <span class="status status--confirmed">EDUX</span></li>
</ol>

<h2>Экзамен — как он выглядит</h2>
<ul>
  <li>Тест <strong>с выбором ответов</strong> на компьютерах, в <strong>EDUX</strong> — как экзамен по RBD. <span class="status status--confirmed">EDUX</span></li>
  <li>В каждом вопросе <strong>4 ответа</strong>; правильными могут быть <strong>один, два, три или все четыре</strong>.</li>
  <li>«Большие баллы»: <strong>1 балл</strong> ставится, только если отмечены <strong>все правильные</strong> ответы и <strong>ни одного неправильного</strong>. Иначе — 0.</li>
  <li><strong>20 вопросов</strong>; экзамен сдан от <strong>10 баллов</strong> (10 из 20 вопросов полностью верно).</li>
  <li>Ориентировочное время: <strong>30 минут</strong>.</li>
  <li>Если вопрос неоднозначный, сообщите об этом проводящему экзамен <strong>во время экзамена</strong>. Потом можно оспорить только те вопросы, о которых сообщили.</li>
</ul>
<div data-note="own"><p><strong>Советы к экзамену:</strong> раз засчитывается только полный ответ, для каждого варианта спрашивайте себя «это <em>всегда</em> так?». Осторожно со словами «только», «всегда», «никогда», «оба сервера». Самые частые ловушки: NULL (например, <code>NOT IN</code>, <code>COUNT(столбец)</code>), WHERE и HAVING, различия MS SQL / Oracle, триггеры T-SQL (раз на оператор) и PL/SQL (<code>FOR EACH ROW</code>), 2НФ/3НФ/НФБК. Тренируйтесь на <a href="#/quiz">пробном тесте</a> в режиме симуляции (20 вопросов / 30 мин).</p></div>

<h2>Итоговая оценка</h2>
<p>Оценка за упражнения переводится в баллы и суммируется с баллами за экзамен. <span class="status status--confirmed">EDUX</span></p>
<table>
  <thead><tr><th>Оценка за упражнения</th><th>Баллы</th></tr></thead>
  <tbody>
    <tr><td>3.0</td><td>15</td></tr>
    <tr><td>3.5</td><td>19</td></tr>
    <tr><td>4.0</td><td>23</td></tr>
    <tr><td>4.5</td><td>27</td></tr>
    <tr><td>5.0</td><td>30</td></tr>
  </tbody>
</table>
<table>
  <thead><tr><th>Сумма баллов (упражнения + экзамен, макс. 50)</th><th>Итоговая оценка</th></tr></thead>
  <tbody>
    <tr><td>&lt; 25</td><td>2.0</td></tr>
    <tr><td>25 – 29</td><td>3.0</td></tr>
    <tr><td>30 – 34</td><td>3.5</td></tr>
    <tr><td>35 – 39</td><td>4.0</td></tr>
    <tr><td>40 – 44</td><td>4.5</td></tr>
    <tr><td>45 – 50</td><td>5.0</td></tr>
  </tbody>
</table>
<div data-note="tip"><p>В EDUX таблица записана как «&lt; 30 pkt – 3.0, &lt; 35 – 3.5, … &lt; 45 – 4.5, &gt; 44 – 5.0»; выше — то же в виде диапазонов. Минимальный проходной результат: 15 (за 3.0 по упражнениям) + 10 (экзамен) = 25 баллов → 3.0.</p></div>
<div data-widget="calc"></div>

<h2>План семестра</h2>
<ol class="timeline">
  <li class="timeline__item timeline__item--done">
    <p class="timeline__date">29.09.2026 · Лекция 1 <span class="status status--lecture">состоялась</span></p>
    <p class="timeline__text">Повторение RBD: реляционная модель, правила Кодда, ограничения, ERD, нормализация. См. темы 1–3.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">~06.10.2026 · Лекция 2 <span class="status status--lecture">анонсирована</span></p>
    <p class="timeline__text">Второе повторение (язык SQL). Дата рассчитана как «через неделю» — проверьте расписание.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">следующие недели · T-SQL и PL/SQL <span class="status status--lecture">анонсировано</span></p>
    <p class="timeline__text">Процедурные языки MS SQL Server и Oracle: переменные, курсоры, процедуры, триггеры.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">5 лекций · администрирование (P. Lenkiewicz) <span class="status status--lecture">анонсировано</span></p>
    <p class="timeline__text">На MS SQL Server: файлы, индексы, транзакции, резервное копирование, права, производительность, распределённые базы. Две темы (резервные копии и индексы) будут и на упражнениях.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">1 лекция · хранилища данных (A. Chądzyńska-Krasowska) <span class="status status--lecture">анонсировано</span></p>
    <p class="timeline__text">Введение в тему, без упражнений.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">зимняя сессия · экзамен <span class="status status--unknown">дата неизвестна</span></p>
    <p class="timeline__text">Дата экзамена ещё не опубликована. Обычно это сессия январь–февраль 2027 — <strong>проверяйте EDUX</strong>.</p>
  </li>
</ol>

<h2>Упражнения — чего ожидать</h2>
<p><span class="status status--estimated">по материалам прошлого года</span> Порядок тем может измениться — решает преподаватель.</p>
<table>
  <thead><tr><th>Тема</th><th>Содержание</th><th>Практика на сайте</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Повторение ERD (проектирование базы)</td><td><a href="#/tasks/t01-erd">Упражнения 1</a></td></tr>
    <tr><td>2–3</td><td>Повторение SQL: SELECT, соединения, группировка, подзапросы, DML</td><td><a href="#/tasks/t02-sql">2</a>, <a href="#/tasks/t03-sql">3</a></td></tr>
    <tr><td>4–6</td><td>T-SQL: основы, процедуры, курсоры, триггеры</td><td><a href="#/tasks/t04-tsql">4</a>, <a href="#/tasks/t05-tsql-cursors">5</a>, <a href="#/tasks/t06-tsql-triggers">6</a></td></tr>
    <tr><td>7</td><td>Индексы и транзакции (планы выполнения, уровни изоляции)</td><td><a href="#/tasks/t07-indexes-transactions">7</a></td></tr>
    <tr><td>8</td><td>Файлы базы, backup/restore, права</td><td><a href="#/tasks/t08-backup-security">8</a></td></tr>
    <tr><td>9–11</td><td>PL/SQL: основы, курсоры, триггеры</td><td><a href="#/tasks/t09-plsql">9</a>, <a href="#/tasks/t10-plsql-cursors">10</a>, <a href="#/tasks/t11-plsql-triggers">11</a></td></tr>
    <tr><td>Контрольные</td><td>В прошлом году контрольная 2 = процедура + триггер на PL/SQL</td><td><a href="#/tasks/k1-tsql">K1</a>, <a href="#/tasks/k2-plsql">K2</a></td></tr>
    <tr><td>Проект</td><td>Своя база (ERD → скрипты) + процедуры и триггеры в Oracle и MS SQL</td><td><a href="#/tasks/project">Проект</a></td></tr>
  </tbody>
</table>

<h2>Важное с первой лекции</h2>
<ul>
  <li>Преподаватель <strong>проверяет присутствие</strong> — на следующих лекциях будет список. <span class="status status--lecture">запись</span></li>
  <li>Вопросы можно задавать в любой момент, перебивая лекцию. <span class="status status--lecture">запись</span></li>
  <li>В EDUX должны появиться слайды лекции и текстовый файл с подробным разбором нормализации. <span class="status status--lecture">запись</span></li>
  <li>Повторение не случайно: на защитах дипломов студенты часто не могут ответить на базовые вопросы по теории баз данных. <span class="status status--lecture">запись</span></li>
</ul>

<h2>Рекомендации</h2>
<div data-note="own">
<ul>
  <li><strong>Установите инструменты в начале семестра:</strong> SQL Server (Express или LocalDB — на занятиях используется <code>(localdb)\\MSSQLLocalDB</code>) + SQL Server Management Studio; для Oracle — SQL Developer (сервер даёт университет) или бесплатная Oracle Database Free. Универсально: DBeaver или DataGrip.</li>
  <li><strong>Каждую неделю:</strong> прочитайте лекцию на сайте → откройте конспект → сделайте упражнения по теме. Не оставляйте T-SQL и PL/SQL на конец — они требуют больше всего работы.</li>
  <li><strong>Пишите код дважды:</strong> одну и ту же задачу на T-SQL и на PL/SQL. Больше всего баллов теряется из-за путаницы синтаксиса (например, <code>@переменная</code> и <code>переменная</code>, <code>PRINT</code> и <code>DBMS_OUTPUT.PUT_LINE</code>).</li>
  <li><strong>Начните проект рано</strong> — ERD и скрипты занимают больше времени, чем кажется.</li>
  <li><strong>Перед экзаменом:</strong> пройдите все конспекты (<a href="#/cheatsheets">страница конспектов</a>) и несколько раз сделайте симуляцию теста.</li>
</ul>
</div>
`
},

tasksIntro: `
<div data-note="warn" data-label="Важно">
  <p>Эти упражнения <strong>переработаны</strong>: у них та же логика, что у заданий с занятий, но другие базы (прокат автомобилей, курьерская фирма), другие данные и формулировки. Они для учёбы — не сдавайте их как свои решения заданий с занятий.</p>
</div>
<ol class="steps">
  <li>Сначала выполните скрипты из раздела <a href="#/tasks/databases">Учебные базы</a> (MS SQL и/или Oracle).</li>
  <li>Попробуйте решить задание сами. Если застряли — откройте подсказку.</li>
  <li>Только потом сравните с решением. Часто правильных вариантов несколько.</li>
</ol>`
});
