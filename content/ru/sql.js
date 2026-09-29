/* RU – Модуль 2: язык SQL */
SBD.addContent('ru', {

'sql-basics': {
  title: 'SQL — основы, диалекты и типы данных',
  lead: 'Откуда взялся SQL, чем отличаются MS SQL Server и Oracle, как группируются команды и какие бывают типы данных.',
  body: `
<h2>Откуда взялся SQL</h2>
<p>Ранние модели данных (сетевая, иерархическая) были основаны на файлах записей — хватало обычных языков программирования (COBOL, C). После публикации реляционной модели (Кодд, 1970) понадобился новый <strong>реляционный язык</strong>:</p>
<ul>
  <li>1974 — в IBM команда Дональда Чемберлина представляет <strong>SEQUEL</strong>;</li>
  <li>1977 — SYSTEM R с SEQUEL/2; название сменили на <strong>SQL</strong> (по юридическим причинам — имя SEQUEL было зарегистрированной маркой);</li>
  <li>1986 — стандарт ANSI, 1987 — стандарт ISO.</li>
</ul>
<p>Каждый сервер реализует стандарт немного по-своему — говорят о <strong>диалектах</strong>. Известные системы: Oracle Database, IBM DB2, PostgreSQL, MS SQL Server (изначально куплен у Sybase), MySQL, MariaDB. Ни один диалект не реализует весь стандарт, и нет двух одинаковых.</p>
<p>На курсе используются два диалекта: <strong>MS SQL Server</strong> (кратко: MS SQL) и <strong>Oracle</strong>. Если разница не упомянута, команда работает одинаково в обоих.</p>
<div data-note="lecture"><p>Преподаватель предостерегает от готовых решений из интернета: они бывают ошибочными или относятся к другому диалекту, а новичок этого не отличит. Высший авторитет — <strong>документация производителя</strong>.</p></div>

<h2>Что такое SQL и чем он не является</h2>
<ul>
  <li>SQL — <strong>язык данных</strong>: он служит только для операций с базой.</li>
  <li>Это <strong>не</strong> язык программирования: нет переменных, IF, циклов. (Поэтому в этом семестре мы изучаем расширения: T-SQL и PL/SQL.)</li>
  <li>Он <strong>декларативный</strong>: вы говорите, <em>что</em> хотите получить, а сервер решает, <em>как</em>.</li>
  <li>Говорят «запрос», хотя на самом деле мы выдаём <strong>команды</strong> — не все из них что-то возвращают.</li>
</ul>

<h2>Правила записи</h2>
<ul>
  <li>Ключевые слова и имена объектов можно писать строчными или прописными.</li>
  <li>Но <strong>данные</strong> могут быть чувствительны к регистру: Oracle по умолчанию различает регистр (<code>'Kowalski' ≠ 'KOWALSKI'</code>), MS SQL по умолчанию — нет.</li>
  <li>Заканчивайте команду точкой с запятой <code>;</code> — Oracle её требует, MS SQL нет, но лучше ставить всегда.</li>
  <li><strong>Текст и даты</strong> — всегда в одинарных кавычках: <code>'Ala'</code>, <code>'2021-11-21'</code>.</li>
  <li>Команду можно переносить на новую строку где угодно.</li>
</ul>
<div data-code="sql-comments"></div>
<div data-note="tip"><p>Сочетания клавиш: в SSMS закомментировать <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd> / раскомментировать <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>U</kbd>; в SQL Developer <kbd>Ctrl</kbd>+<kbd>/</kbd> работает в обе стороны.</p></div>
<p>В описаниях синтаксиса используется нотация BNF: <code>[ ]</code> — необязательно, <code>|</code> — выбор, <code>{ }</code> — обязательно, <code>(…)</code> — может повторяться.</p>

<h2>Четыре группы команд</h2>
<table>
  <thead><tr><th>Группа</th><th>Расшифровка</th><th>Команды</th><th>Назначение</th></tr></thead>
  <tbody>
    <tr><td><strong>DQL</strong></td><td>Data Query Language</td><td><code>SELECT</code></td><td>чтение данных (ничего не меняет)</td></tr>
    <tr><td><strong>DML</strong></td><td>Data Manipulation Language</td><td><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code></td><td>изменение данных</td></tr>
    <tr><td><strong>DDL</strong></td><td>Data Definition Language</td><td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code></td><td>создание и изменение объектов (таблиц, представлений…)</td></tr>
    <tr><td><strong>DCL</strong></td><td>Data Control Language</td><td><code>GRANT</code>, <code>REVOKE</code>, <code>DENY</code>*</td><td>права (* DENY — только MS SQL)</td></tr>
  </tbody>
</table>
<p>В RBD вы изучили DQL, DML и DDL. DCL входит в программу SBD.</p>
<div data-code="sql-groups"></div>

<h2>Типы данных</h2>
<p>Стандарт определяет, например, <code>CHARACTER(n)</code> (фиксированная длина, дополняется пробелами), <code>CHARACTER VARYING(n)</code> = <code>VARCHAR(n)</code> (переменная длина), <code>NUMERIC(p, q)</code> (p цифр, q после запятой), <code>INTEGER</code>. На практике важны типы конкретного сервера:</p>
<table>
  <thead><tr><th>Вид</th><th>MS SQL Server</th><th>Oracle</th></tr></thead>
  <tbody>
    <tr><td>Текст фиксированной / переменной длины</td><td><code>CHAR(n)</code>, <code>VARCHAR(n)</code> до 8000, <code>VARCHAR(MAX)</code></td><td><code>CHAR(n)</code>, <code>VARCHAR2(n)</code></td></tr>
    <tr><td>Текст Unicode</td><td><code>NCHAR</code>, <code>NVARCHAR</code> (2 байта/символ)</td><td><code>NCHAR</code>, <code>NVARCHAR2</code></td></tr>
    <tr><td>Целые</td><td><code>TINYINT</code> (0–255), <code>SMALLINT</code>, <code>INT</code>, <code>BIGINT</code>, <code>BIT</code> (0/1/NULL)</td><td><code>INTEGER</code> = <code>NUMBER(38)</code></td></tr>
    <tr><td>Десятичные</td><td><code>DECIMAL(p,s)</code> = <code>NUMERIC(p,s)</code>, <code>MONEY</code>, <code>SMALLMONEY</code></td><td><code>NUMBER(p,s)</code> (s может быть отрицательным — округление слева от запятой)</td></tr>
    <tr><td>Дата и время</td><td><code>DATE</code>, <code>TIME</code>, <code>DATETIME2</code> (<code>DATETIME</code> — устаревший)</td><td><code>DATE</code> (со временем!), <code>TIMESTAMP(s)</code></td></tr>
    <tr><td>Двоичные</td><td><code>BINARY(n)</code>, <code>VARBINARY(n)</code></td><td><code>BLOB</code>, <code>RAW</code></td></tr>
  </tbody>
</table>
<div data-code="sql-types-ms"></div>
<div data-code="sql-types-ora"></div>

<h2>Инструменты</h2>
<ul>
  <li><strong>MS SQL Server:</strong> SQL Server Management Studio (SSMS) — полноценный графический инструмент, в том числе для администрирования; Azure Data Studio — текстовый режим.</li>
  <li><strong>Oracle:</strong> SQL Developer; самый старый клиент — SQL*Plus (командная строка).</li>
  <li><strong>Универсальные:</strong> DataGrip, DBeaver — подключаются ко многим серверам.</li>
</ul>
<p>Студенты PJATK получают доступ к серверам Oracle и MS SQL Server в домене университета.</p>
`,
  cheat: `
<ul>
  <li>SQL: IBM, SEQUEL (1974) → SQL; стандарт ANSI 1986, ISO 1987. Диалекты различаются в деталях.</li>
  <li>SQL = язык <strong>данных</strong>, <strong>декларативный</strong>, без переменных/циклов (их добавляют T-SQL и PL/SQL).</li>
  <li>Текст и даты в <code>'одинарных кавычках'</code>. Точка с запятой: Oracle — обязательна, MS SQL — рекомендуется.</li>
  <li>Oracle по умолчанию различает регистр данных, MS SQL — нет.</li>
  <li>Комментарии: <code>-- строка</code>, <code>/* блок */</code>.</li>
  <li><strong>DQL</strong> SELECT · <strong>DML</strong> INSERT/UPDATE/DELETE · <strong>DDL</strong> CREATE/ALTER/DROP · <strong>DCL</strong> GRANT/REVOKE/DENY (DENY только MS SQL).</li>
  <li>Типы MS SQL: INT, BIT, DECIMAL(p,s), MONEY, VARCHAR(n), NVARCHAR, DATE, DATETIME2.</li>
  <li>Типы Oracle: NUMBER(p,s), INTEGER, VARCHAR2(n), DATE (со временем), TIMESTAMP.</li>
  <li>Инструменты: SSMS (MS SQL), SQL Developer (Oracle), DBeaver/DataGrip (оба).</li>
</ul>
`
},

'select-basics': {
  title: 'SELECT — чтение данных из одной таблицы',
  lead: 'База EMP/DEPT/SALGRADE, список SELECT, выражения, псевдонимы, NULL, DISTINCT и сортировка.',
  body: `
<h2>Учебная база: EMP, DEPT, SALGRADE</h2>
<p>Большинство примеров лекций использует три таблицы фирмы (так называемая схема EDS):</p>
<table>
  <thead><tr><th>Таблица</th><th>Столбцы</th><th>Содержимое</th></tr></thead>
  <tbody>
    <tr><td><strong>EMP</strong></td><td><code>EMPNO</code> (PK), <code>ENAME</code>, <code>JOB</code>, <code>MGR</code> (FK → EMPNO начальника), <code>HIREDATE</code>, <code>SAL</code> (месячная зарплата), <code>COMM</code> (комиссионные), <code>DEPTNO</code> (FK → DEPT)</td><td>14 сотрудников</td></tr>
    <tr><td><strong>DEPT</strong></td><td><code>DEPTNO</code> (PK), <code>DNAME</code>, <code>LOC</code></td><td>4 отдела</td></tr>
    <tr><td><strong>SALGRADE</strong></td><td><code>GRADE</code>, <code>LOSAL</code>, <code>HISAL</code></td><td>5 уровней зарплат</td></tr>
  </tbody>
</table>
<p>На что обратить внимание в данных:</p>
<ul>
  <li>У <strong>KING</strong> (PRESIDENT) <code>MGR = NULL</code> — нет начальника.</li>
  <li>Комиссионные есть только у 4 человек; у остальных <code>COMM = NULL</code> («может получать, а может и нет»), а у TURNER <code>COMM = 0</code> («точно не получает»).</li>
  <li>В отделе <strong>40 (OPERATIONS, BOSTON)</strong> нет сотрудников.</li>
</ul>
<div data-code="eds-mssql"></div>
<div data-code="eds-oracle"></div>

<h2>Структура оператора SELECT</h2>
<p>SELECT состоит из <strong>предложений в строго заданном порядке</strong>. SELECT и FROM обязательны:</p>
<p class="formula">SELECT [DISTINCT] выражения
FROM     источники
[WHERE   условие]
[GROUP BY выражения]
[HAVING  условие]
[ORDER BY выражения];</p>
<p>SELECT никогда не меняет данные. Он задаёт: <em>откуда</em> читаем (FROM), <em>какие</em> строки (WHERE), <em>в каком виде</em> возвращаем (SELECT, ORDER BY).</p>
<div data-code="sel-basic"></div>
<div data-note="tip"><p>Если имя столбца есть в нескольких таблицах, добавьте перед ним имя таблицы: <code>Emp.deptno</code>. При одной таблице это не нужно.</p></div>

<h2>Выражения в списке SELECT</h2>
<p>В списке SELECT могут быть не только столбцы, но и <strong>литералы</strong> (константы: <code>1</code>, <code>'текст'</code>), операции <code>+ - * /</code>, функции и скобки. Соединение текстов (конкатенация): Oracle <code>||</code>, MS SQL <code>+</code>.</p>
<div data-code="sel-concat"></div>
<div data-note="warn"><p>В MS SQL <code>+</code> означает и «сложить», и «склеить». Поэтому <code>'earns ' + sal</code> (текст + число) требует <code>CAST(sal AS VARCHAR)</code>. Oracle сам переводит число в текст.</p></div>
<p>Преобразование типов: <code>CAST(выражение AS тип)</code> — в обоих серверах; в MS SQL есть ещё <code>CONVERT(тип, выражение, стиль)</code>, в Oracle — <code>TO_CHAR</code>, <code>TO_DATE</code>, <code>TO_NUMBER</code>.</p>
<div data-code="sel-noFrom"></div>

<h2>Псевдонимы (алиасы)</h2>
<p>Столбцам результата можно давать имена (псевдонимы). Простой псевдоним — слово без пробелов; псевдоним с пробелами пишется в <code>"двойных кавычках"</code>. Слово <code>AS</code> необязательно. Псевдоним не переименовывает столбец в таблице — он действует только в этом запросе.</p>
<div data-code="sel-alias"></div>

<h2>NULL в выражениях</h2>
<p>Любая операция с NULL даёт NULL. Если у сотрудника <code>comm = NULL</code>, то <code>12*sal + comm</code> тоже NULL — хотя по смыслу должен получиться годовой доход. Решение: заменить NULL значением с помощью <code>NVL</code> (Oracle) / <code>ISNULL</code> (MS SQL) / <code>COALESCE</code> (оба).</p>
<div data-code="sel-null"></div>
<div data-note="exam"><p><code>NVL(x, y)</code> и <code>ISNULL(x, y)</code>: если <code>x</code> не NULL, возвращают <code>x</code>, иначе <code>y</code>. Оба аргумента должны быть одного типа. В Oracle конкатенация с NULL <em>не</em> даёт NULL (NULL считается пустой строкой); в MS SQL — даёт.</p></div>

<h2>DISTINCT</h2>
<p>Повторяющиеся строки результата автоматически не удаляются. <code>DISTINCT</code> убирает дубликаты — но для этого нужна сортировка, поэтому для сервера это «дорого». <code>SELECT DISTINCT *</code> не имеет смысла (строки таблицы и так уникальны благодаря ключу).</p>
<div data-code="sel-distinct"></div>

<h2>ORDER BY</h2>
<p>Без ORDER BY сервер возвращает строки в произвольном порядке (обычно в порядке вставки). <code>ORDER BY</code> встречается <strong>один раз, всегда в конце</strong>. Сортировать можно по столбцам, выражениям, псевдонимам и даже номеру позиции в списке SELECT; <code>ASC</code> (по возрастанию, по умолчанию) или <code>DESC</code> (по убыванию).</p>
<div data-code="sel-order"></div>
<div data-note="tip"><p><code>TOP n</code> в MS SQL без <code>ORDER BY</code> возвращает «какие-то» n строк — результат зависит от порядка. Сортировка больших наборов нагружает сервер; помогают индексы.</p></div>
`,
  cheat: `
<ul>
  <li>Порядок предложений: <code>SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY</code>. Обязательны: SELECT, FROM (MS SQL разрешает без FROM, Oracle — <code>FROM dual</code>).</li>
  <li>EMP: у KING MGR NULL, у большинства COMM NULL, у TURNER COMM 0, отдел 40 пуст.</li>
  <li><code>SELECT *</code> — все столбцы; <code>TOP n [PERCENT]</code> — только MS SQL.</li>
  <li>Конкатенация: Oracle <code>||</code>, MS SQL <code>+</code> + <code>CAST(x AS VARCHAR)</code>; <code>CONCAT()</code> в обоих.</li>
  <li>Псевдоним: <code>столбец AS псевдоним</code>, с пробелом <code>"Мой псевдоним"</code>.</li>
  <li>NULL в операции → NULL. Замена: <code>NVL</code> (Oracle), <code>ISNULL</code> (MS SQL), <code>COALESCE</code> (оба).</li>
  <li><code>DISTINCT</code> убирает дубликаты (дорого).</li>
  <li><code>ORDER BY col1, 2 DESC</code> — один раз, в конце; по имени, псевдониму или номеру.</li>
  <li>Текущая дата: <code>GETDATE()</code> (MS SQL), <code>SYSDATE</code> (Oracle).</li>
</ul>
`
},

'where-joins': {
  title: 'WHERE и соединение таблиц (JOIN)',
  lead: 'Как выбирать строки по условию и читать данные сразу из многих таблиц: INNER, OUTER, CROSS, self join и операции над множествами.',
  body: `
<h2>Предложение WHERE</h2>
<p><code>WHERE</code> — фильтр строк. В результат попадают только строки, для которых условие <strong>TRUE</strong>. Если условие даёт FALSE или NULL — строка отбрасывается.</p>
<div data-code="wh-basic"></div>

<h3>Операторы</h3>
<table>
  <thead><tr><th>Оператор</th><th>Значение</th><th>Пример</th></tr></thead>
  <tbody>
    <tr><td><code>= &lt;&gt; != &lt; &lt;= &gt; &gt;=</code></td><td>сравнения</td><td><code>sal &gt;= 1100</code></td></tr>
    <tr><td><code>IS [NOT] NULL</code></td><td>проверка на NULL (единственно правильная!)</td><td><code>comm IS NULL</code></td></tr>
    <tr><td><code>[NOT] IN (…)</code></td><td>принадлежит списку</td><td><code>deptno IN (10, 30)</code></td></tr>
    <tr><td><code>[NOT] BETWEEN a AND b</code></td><td>в <strong>замкнутом</strong> диапазоне (a ≤ x ≤ b)</td><td><code>sal BETWEEN 1000 AND 2000</code></td></tr>
    <tr><td><code>[NOT] LIKE</code></td><td>шаблон: <code>%</code> любая строка, <code>_</code> один символ</td><td><code>ename LIKE 'Kowal%'</code></td></tr>
    <tr><td><code>NOT, AND, OR</code></td><td>логика (в таком порядке приоритета)</td><td><code>NOT (a AND b)</code></td></tr>
  </tbody>
</table>
<div data-code="wh-ops"></div>
<div data-note="lecture"><p><code>LIKE</code> работает и с числами и датами (сервер переводит их в текст, например <code>hiredate LIKE '%81%'</code>), но медленно — для чисел используйте сравнения и BETWEEN, для дат — функции дат.</p></div>

<h3>Приоритет логических операторов</h3>
<p><code>AND</code> имеет более высокий приоритет, чем <code>OR</code>. Без скобок легко получить неверный результат:</p>
<div data-code="wh-precedence"></div>
<div data-code="wh-tuple"></div>
<div data-note="exam"><p><code>WHERE comm = comm</code> вернёт только 4 строки (где comm не NULL), потому что <code>NULL = NULL</code> — это NULL. <code>WHERE empno = empno</code> вернёт все строки — первичный ключ никогда не бывает NULL. А <code>WHERE 1 = 1</code> всегда TRUE.</p></div>

<h2>Данные из многих таблиц</h2>
<p>Данные разложены по многим таблицам, связанным парами <strong>первичный ключ – внешний ключ</strong>. Чтобы их соединить, ищем строки, где эти значения равны.</p>
<p>Эксперимент: <code>SELECT … FROM Emp, Dept</code> без условия возвращает <strong>56 строк</strong> (14 × 4) — каждого сотрудника с каждым отделом. Это <strong>декартово произведение</strong>. В нём есть «правдивые» строки (сотрудник + его отдел) и масса ложных. Условие соединения отбирает только правдивые.</p>
<div data-code="j-cartesian"></div>
<div data-code="j-where"></div>
<div data-note="analogy"><p>Представьте, что каждую карточку сотрудника вы кладёте рядом с каждой карточкой отдела (56 пар), а потом оставляете только те пары, где номер отдела на обеих карточках одинаковый.</p></div>

<h2>INNER JOIN</h2>
<p>Тот же результат, но условие соединения записано во <code>FROM</code>: <code>T1 JOIN T2 ON условие</code>. Сервер выполняет обе формы одинаково, но JOIN читабельнее: <strong>соединения во FROM, фильтры в WHERE</strong>.</p>
<div data-code="j-inner"></div>
<p>INNER JOIN возвращает только строки, для которых условие ON — TRUE. Сотрудник с <code>deptno = NULL</code> и отдел без сотрудников <strong>не появятся</strong>. Составной ключ соединяют так: <code>ON t1.k1 = t2.k1 AND t1.k2 = t2.k2</code>.</p>

<h2>OUTER JOIN</h2>
<table>
  <thead><tr><th>Соединение</th><th>Что добавляется в результат</th></tr></thead>
  <tbody>
    <tr><td><code>LEFT [OUTER] JOIN</code></td><td>все строки <strong>левой</strong> таблицы, даже без пары (недостающие столбцы = NULL)</td></tr>
    <tr><td><code>RIGHT [OUTER] JOIN</code></td><td>все строки <strong>правой</strong> таблицы</td></tr>
    <tr><td><code>FULL [OUTER] JOIN</code></td><td>все строки обеих сторон (LEFT + RIGHT)</td></tr>
  </tbody>
</table>
<div data-code="j-outer"></div>

<h2>CROSS JOIN, соединение по неравенству и self join</h2>
<ul>
  <li><code>CROSS JOIN</code> — явно записанное декартово произведение.</li>
  <li>Условие соединения не обязано быть равенством ключей — важно лишь, даёт ли ON TRUE. Emp и Salgrade соединяют через <code>sal BETWEEN losal AND hisal</code>.</li>
  <li><strong>Self join</strong> (рекурсивная связь): одна и та же таблица встречается дважды, поэтому у неё <strong>обязаны</strong> быть два разных псевдонима (например, K = начальник, P = подчинённый).</li>
</ul>
<div data-code="j-other"></div>

<h2>Операции над множествами</h2>
<p>Результаты SELECT — отношения, поэтому их можно объединять как множества. Условие: одинаковое число столбцов, в том же порядке, с совместимыми типами.</p>
<ul>
  <li><code>UNION</code> — объединение без дубликатов; <code>UNION ALL</code> — с дубликатами (быстрее);</li>
  <li><code>INTERSECT</code> — пересечение;</li>
  <li><code>EXCEPT</code> (стандарт, MS SQL) / <code>MINUS</code> (Oracle) — разность.</li>
</ul>
<div data-code="set-ops"></div>
<div data-note="tip"><p>Псевдонимы таблиц (<code>Emp e</code>) сокращают код и обязательны в self join. В MS SQL идентификатор с пробелом можно также записать в <code>[квадратных скобках]</code>.</p></div>
`,
  cheat: `
<ul>
  <li>WHERE пропускает только <strong>TRUE</strong> (FALSE и NULL отбрасываются).</li>
  <li>NULL проверяют через <code>IS NULL</code> / <code>IS NOT NULL</code>, никогда <code>= NULL</code>.</li>
  <li><code>BETWEEN a AND b</code> — замкнутый диапазон. <code>LIKE</code>: <code>%</code> строка, <code>_</code> один символ.</li>
  <li>Приоритет: <code>NOT &gt; AND &gt; OR</code> → ставьте скобки.</li>
  <li><code>(a, b) IN ((…), (…))</code> — только Oracle.</li>
  <li><code>FROM A, B</code> без условия = декартово произведение (14×4 = 56).</li>
  <li><code>A JOIN B ON A.fk = B.pk</code> — только совпавшие пары. <code>LEFT</code>/<code>RIGHT</code>/<code>FULL</code> — плюс строки без пары (NULL).</li>
  <li>Oracle: <code>A.x (+) = B.x</code> — старая запись внешнего соединения.</li>
  <li>По неравенству: <code>JOIN Salgrade ON sal BETWEEN losal AND hisal</code>.</li>
  <li>Self join: <code>FROM Emp k JOIN Emp p ON k.empno = p.mgr</code>.</li>
  <li><code>UNION</code> (без дубликатов), <code>UNION ALL</code>, <code>INTERSECT</code>, <code>EXCEPT</code> (MS) / <code>MINUS</code> (Oracle).</li>
</ul>
`
},

'group-by': {
  title: 'Агрегатные функции, GROUP BY и HAVING',
  lead: 'Подсчёты, суммы и средние — для всей таблицы и для групп строк. Главное правило группировки и WHERE против HAVING.',
  body: `
<h2>Агрегатные функции</h2>
<p>До сих пор SELECT возвращал данные строка за строкой. <strong>Агрегирующие</strong> запросы возвращают информацию о наборе строк: сколько их, какова сумма, среднее…</p>
<table>
  <thead><tr><th>Функция</th><th>Возвращает</th></tr></thead>
  <tbody>
    <tr><td><code>COUNT</code></td><td>число строк / значений</td></tr>
    <tr><td><code>SUM</code></td><td>сумму</td></tr>
    <tr><td><code>AVG</code></td><td>среднее</td></tr>
    <tr><td><code>MIN</code>, <code>MAX</code></td><td>наименьшее / наибольшее значение</td></tr>
  </tbody>
</table>
<p>Аргументом может быть выражение или <code>DISTINCT выражение</code>. <strong>Значения NULL игнорируются</strong>.</p>
<div data-code="g-agg"></div>

<h3>COUNT — осторожно</h3>
<p><code>COUNT</code> считает <strong>осмысленные (не NULL) появления своего аргумента</strong>. Для константы (<code>COUNT(1)</code>, <code>COUNT('Ala')</code>) и звёздочки (<code>COUNT(*)</code>) результат — число строк. Для столбца — число значений, отличных от NULL.</p>
<div data-code="g-count"></div>
<div data-note="lecture"><p>Подсчёт константы не заставляет сервер читать данные. А вот функция в аргументе (например, <code>COUNT(GETDATE())</code>) — плохая идея: она вычисляется отдельно для каждой строки.</p></div>

<h2>GROUP BY</h2>
<p><code>GROUP BY выражения</code> делит строки на группы с <strong>одинаковыми значениями</strong> этих выражений. Агрегаты затем считаются отдельно для каждой группы, и каждая группа даёт <strong>одну строку результата</strong>.</p>
<ul>
  <li><code>GROUP BY job</code> — столько групп, сколько разных должностей;</li>
  <li><code>GROUP BY deptno, job</code> — столько групп, сколько разных <em>пар</em> (отдел, должность);</li>
  <li>NULL в выражении группировки образует <strong>отдельную группу</strong>.</li>
</ul>
<div data-code="g-group"></div>
<div data-note="analogy"><p>Вы раскладываете карточки сотрудников в стопки по номеру отдела. Потом для каждой стопки считаете: сколько карточек, сумма зарплат, среднее. В результате — одна строка на стопку, детали отдельных карточек уже не видны.</p></div>

<h2>HAVING</h2>
<p><code>HAVING</code> — фильтр для <strong>групп</strong>: он работает после группировки и вычисления агрегатов. В нём можно использовать агрегатные функции.</p>
<div data-code="g-having"></div>

<h2>Золотое правило группировки</h2>
<div data-note="exam"><p>При <code>GROUP BY</code> в списке <code>SELECT</code>, в <code>HAVING</code> и <code>ORDER BY</code> могут быть <strong>только</strong>:</p>
<ul>
  <li>константы,</li>
  <li>агрегатные функции,</li>
  <li>столбцы и выражения, которые есть в <code>GROUP BY</code>.</li>
</ul>
<p>Причина: после группировки доступа к отдельным строкам нет — на группу одна строка.</p></div>
<div data-code="g-error"></div>
<p>А если мы хотим <em>фамилию</em> человека с наименьшей зарплатой в отделе? Добавление <code>ename</code> в GROUP BY «сработает», но даст неверный ответ: каждый человек станет отдельной группой. Правильный путь — <strong>подзапрос</strong>, аналитическая функция или CTE (следующая тема).</p>

<h2>WHERE или HAVING?</h2>
<ul>
  <li><strong>WHERE</strong> работает <strong>при чтении строк</strong> — до группировки. Агрегаты в нём запрещены.</li>
  <li><strong>HAVING</strong> работает <strong>после группировки</strong> — над готовыми группами.</li>
  <li>Не переносите в HAVING условия, которые можно проверить в WHERE — сервер будет зря читать и группировать строки, которые всё равно выбросит. Общее правило: <strong>отсеивайте ненужные строки как можно раньше</strong>.</li>
</ul>
<div data-code="g-where-having"></div>

<h2>Как сервер выполняет группирующий запрос (концептуально)</h2>
<ol class="steps">
  <li>Берутся все комбинации строк таблиц из FROM (декартово произведение).</li>
  <li>Применяется WHERE (включая условия соединения) — остаются только TRUE.</li>
  <li>Оставшиеся строки делятся на группы по GROUP BY.</li>
  <li>Для каждой группы вычисляются выражения списка SELECT (агрегаты).</li>
  <li>Применяется HAVING — остаются только группы с TRUE.</li>
  <li>Если есть DISTINCT — удаляются дубликаты.</li>
  <li>Если есть операции над множествами (UNION…) — они выполняются.</li>
  <li>Если есть ORDER BY — сортировка.</li>
</ol>
<p>Это мысленная модель — реальный сервер оптимизирует по-своему. Группировка требует сортировки, поэтому она дорогая.</p>
<div data-note="tip"><p>Исключение Oracle: <code>GROUP BY</code> и <code>HAVING</code> можно менять местами. В MS SQL — нельзя.</p></div>
`,
  cheat: `
<ul>
  <li>Агрегаты: <code>COUNT, SUM, AVG, MIN, MAX</code>; <strong>NULL игнорируется</strong>; можно <code>DISTINCT</code>.</li>
  <li><code>COUNT(*)</code> = <code>COUNT(1)</code> = число строк; <code>COUNT(col)</code> = число не-NULL.</li>
  <li>Без GROUP BY → агрегат даёт 1 строку. <code>GROUP BY a, b</code> → 1 строка на комбинацию (NULL = отдельная группа).</li>
  <li><strong>Правило:</strong> в SELECT/HAVING/ORDER BY только константы, агрегаты, выражения из GROUP BY.</li>
  <li>Ошибка: MS SQL <em>Msg 8120</em>, Oracle <em>ORA-00979</em> — столбца нет в GROUP BY.</li>
  <li><strong>WHERE</strong> = фильтр строк (до группировки, без агрегатов). <strong>HAVING</strong> = фильтр групп (после, с агрегатами).</li>
  <li>Фильтруйте как можно раньше (WHERE вместо HAVING, когда возможно).</li>
  <li>Порядок: FROM → WHERE → GROUP BY → агрегаты → HAVING → DISTINCT → UNION → ORDER BY.</li>
</ul>
`
},

'subqueries': {
  title: 'Подзапросы, EXISTS и CTE',
  lead: 'Как использовать результат одного SELECT внутри другого: обычные и коррелированные подзапросы, IN, ALL/ANY, EXISTS и WITH.',
  body: `
<h2>Идея подзапроса</h2>
<p>Мы хотим найти самого высокооплачиваемого сотрудника. Можно в два шага: сначала <code>SELECT MAX(sal)</code> (результат 5000), потом <code>WHERE sal = 5000</code>. В чистом SQL нет переменных, чтобы перенести результат, — но на место значения можно поставить <strong>весь запрос</strong>. Это и есть <strong>подзапрос</strong>.</p>
<ul>
  <li>Подзапрос — это SELECT в <strong>скобках</strong>, без точки с запятой внутри.</li>
  <li>Он может стоять в <code>WHERE</code>, <code>HAVING</code>, <code>FROM</code> (и в INSERT/UPDATE/DELETE).</li>
  <li>В одном предложении может быть несколько подзапросов; подзапросы можно вкладывать.</li>
  <li><strong>Никакого ORDER BY</strong> внутри подзапроса.</li>
</ul>
<div data-code="sq-simple"></div>

<h2>Сколько значений возвращает подзапрос?</h2>
<ul>
  <li>С <code>=, &lt;, &gt;, &lt;=, &gt;=, &lt;&gt;</code> подзапрос должен вернуть <strong>ровно одно значение</strong> — иначе ошибка.</li>
  <li>Если он возвращает много строк — используйте <code>IN</code> / <code>NOT IN</code> или кванторы <code>ALL</code> / <code>ANY</code>.</li>
</ul>

<h2>IN, NOT IN и ловушка NULL</h2>
<div data-code="sq-in"></div>
<div data-note="warn"><p><strong>NOT IN с NULL в списке всегда даёт пустой результат.</strong> <code>x NOT IN (a, b, NULL)</code> означает <code>x&lt;&gt;a AND x&lt;&gt;b AND x&lt;&gt;NULL</code>, а <code>x&lt;&gt;NULL</code> — это NULL, значит всё выражение никогда не TRUE. Исправления: <code>WHERE … IS NOT NULL</code> в подзапросе (просто и надёжно) или <code>NOT EXISTS</code> (изящнее всего). <code>NVL(mgr, 0)</code> тоже «работает», но только если 0 никогда не бывает реальным значением — рискованно.</p></div>
<p>Oracle умеет сравнивать списки: <code>WHERE (sal, job) IN (SELECT MAX(sal), job FROM Emp GROUP BY job)</code> — самый высокооплачиваемый на каждой должности. MS SQL так не умеет.</p>

<h2>ALL и SOME (ANY)</h2>
<ul>
  <li><code>&gt;= ALL (…)</code> — больше или равно <strong>каждому</strong> значению → то есть максимум;</li>
  <li><code>&gt;= SOME (…)</code> = <code>&gt;= ANY (…)</code> — больше или равно <strong>хотя бы одному</strong> → то есть минимум. SOME и ANY — синонимы.</li>
</ul>
<div data-code="sq-all-any"></div>

<h2>Подзапрос во FROM и CTE</h2>
<p>Подзапрос во FROM работает как таблица, построенная «на лету», — ему нужен псевдоним. При многих таких подзапросах лучше использовать представление или <strong>CTE (Common Table Expression)</strong>: <code>WITH имя (столбцы) AS (SELECT …)</code>, сразу за которым идёт запрос, использующий это имя.</p>
<div data-code="sq-from-cte"></div>

<h2>Коррелированные подзапросы</h2>
<p>В <strong>обычном</strong> подзапросе результат не зависит от внешнего запроса — его можно выполнить отдельно. В <strong>коррелированном</strong> подзапрос ссылается на столбец внешнего запроса, поэтому (концептуально) выполняется <strong>отдельно для каждой внешней строки</strong>.</p>
<p>Пример: «в каждом отделе человек с наибольшей зарплатой». Для строки сотрудника <code>a</code> считаем MAX зарплаты в <em>его</em> отделе (<code>b.deptno = a.deptno</code>) и сравниваем.</p>

<h2>EXISTS и NOT EXISTS</h2>
<p>Иногда важно не значение, а только <strong>вернул ли подзапрос хоть что-то</strong>. <code>EXISTS (…)</code> — TRUE, если есть хотя бы одна строка. В списке SELECT внутри пишем что угодно (<code>1</code> или <code>'x'</code>) — важны строки, а не значения. Серверу достаточно найти первую подходящую строку.</p>
<div data-code="sq-corr"></div>
<div data-note="exam"><p>Классические задачи на NOT EXISTS: «отделы без сотрудников», «сотрудники, которые не являются начальниками», «клиенты, которые никогда не покупали X». У NOT EXISTS нет проблемы с NULL, которая ломает NOT IN.</p></div>
<p>Подзапросы можно использовать и в <code>INSERT</code> (источник строк), <code>DELETE</code> (условие) и <code>UPDATE</code> (условие или новое значение) — см. тему DML.</p>
`,
  cheat: `
<ul>
  <li>Подзапрос: <code>(SELECT …)</code> в WHERE, HAVING, FROM; без ORDER BY; можно вкладывать.</li>
  <li>С <code>= &lt; &gt;</code> — ровно 1 значение. Много значений → <code>IN</code>, <code>ALL</code>, <code>ANY/SOME</code>.</li>
  <li><strong>NOT IN + NULL в списке = пустой результат!</strong> Добавьте <code>WHERE col IS NOT NULL</code> или используйте <code>NOT EXISTS</code>.</li>
  <li><code>&gt;= ALL</code> ≈ максимум, <code>&gt;= ANY</code> ≈ минимум.</li>
  <li><code>(a, b) IN (SELECT …)</code> и <code>MAX(AVG(…))</code> — только Oracle.</li>
  <li>Подзапросу во FROM нужен псевдоним. Альтернативы: представление, <code>WITH x AS (…) SELECT …</code> (CTE).</li>
  <li><strong>Коррелированный</strong>: подзапрос использует внешний столбец (<code>b.deptno = a.deptno</code>).</li>
  <li><code>[NOT] EXISTS (SELECT 1 …)</code> — проверяет, есть ли строки; типично: «без…», «никогда не…».</li>
</ul>
`
},

'dml': {
  title: 'DML: INSERT, UPDATE, DELETE, транзакции, TRUNCATE',
  lead: 'Вставка, изменение и удаление данных в обоих диалектах, фиксация изменений и DELETE против TRUNCATE.',
  body: `
<h2>Общее правило</h2>
<p>Команды DML (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) всегда работают с <strong>одной таблицей</strong>. Различия диалектов здесь больше, чем в SELECT.</p>

<h2>INSERT</h2>
<p><strong>Полный синтаксис</strong> — список столбцов и список значений в том же порядке. Можно опустить столбцы, которые допускают NULL, имеют DEFAULT, вычисляемые или генерируются автоматически (IDENTITY).</p>
<p><strong>Краткий синтаксис</strong> — без списка столбцов; тогда нужно дать значения для <strong>всех</strong> столбцов в порядке <code>CREATE TABLE</code>. «Упрощение» часто мнимое (например, со столбцом IDENTITY в старом MS SQL).</p>
<div data-code="dml-insert"></div>
<div data-code="dml-insert-many"></div>
<div data-code="dml-insert-select"></div>
<div data-note="warn"><p><code>MAX(id) + 1</code> — быстрый способ получить новый ключ, но при многих одновременных пользователях два человека могут получить один и тот же номер. В реальных системах используют IDENTITY или последовательности (тема DDL).</p></div>

<h3>Новая таблица из результата SELECT</h3>
<div data-code="dml-ctas"></div>
<div data-note="warn"><p>В Oracle похожий синтаксис <code>SELECT … INTO переменные</code> используется в PL/SQL для <strong>присваивания значений переменным</strong>, а не для создания таблиц. Не путайте!</p></div>

<h2>UPDATE</h2>
<p><code>UPDATE таблица SET столбец = выражение, … [WHERE условие]</code>. Меняются строки, для которых WHERE даёт TRUE. <strong>Без WHERE меняются все строки.</strong> В WHERE и SET могут быть подзапросы (в том числе коррелированные).</p>
<div data-code="dml-update"></div>
<p>В MS SQL есть ещё <code>UPDATE … SET … FROM другая_таблица WHERE условие_соединения</code> (без агрегатов в SET) — см. тему «T-SQL для продвинутых».</p>

<h2>DELETE</h2>
<p><code>DELETE FROM таблица [WHERE условие]</code> удаляет <strong>строки целиком</strong>. Нельзя нарушать ссылочную целостность: если хотя бы на одну удаляемую строку ссылается внешний ключ (с NO ACTION), вся операция блокируется. Сначала «отвяжите» или удалите дочерние строки.</p>
<div data-code="dml-delete"></div>

<h2>Транзакции: COMMIT и ROLLBACK</h2>
<p><strong>Транзакция</strong> — набор команд, которые выполняются <em>все или ни одна</em>.</p>
<ul>
  <li><code>COMMIT</code> — подтвердить (сделать постоянными) изменения с последнего COMMIT/ROLLBACK;</li>
  <li><code>ROLLBACK</code> — отменить эти изменения.</li>
</ul>
<p>Два режима сервера:</p>
<ul>
  <li><strong>autocommit</strong> (по умолчанию в MS SQL) — каждая корректная команда фиксируется сама; чтобы сгруппировать несколько команд, пишем <code>BEGIN TRANSACTION … COMMIT/ROLLBACK</code>;</li>
  <li><strong>без autocommit</strong> — изменения не постоянны до COMMIT (в MS SQL: <code>SET IMPLICIT_TRANSACTIONS ON</code>).</li>
</ul>
<p>Подробнее о транзакциях — в лекции по администрированию.</p>

<h2>TRUNCATE</h2>
<p><code>TRUNCATE TABLE таблица</code> удаляет <strong>все</strong> строки (без WHERE) и работает гораздо быстрее DELETE, потому что не блокирует каждую строку. TRUNCATE относится к <strong>DDL</strong>! Отсюда важное различие:</p>
<table>
  <thead><tr><th></th><th>Oracle</th><th>MS SQL Server</th></tr></thead>
  <tbody>
    <tr><td>TRUNCATE + ROLLBACK</td><td>данные <strong>пропали навсегда</strong> (DDL не транзакционный)</td><td>данные <strong>возвращаются</strong> (DDL транзакционный)</td></tr>
    <tr><td>Счётчик IDENTITY</td><td>—</td><td>TRUNCATE его <strong>сбрасывает</strong></td></tr>
  </tbody>
</table>
<div data-code="dml-truncate"></div>

<h2>GRANT и REVOKE</h2>
<p>Для полноты: <code>GRANT</code> даёт пользователю право на операцию с объектом, <code>REVOKE</code> — забирает его. Подробности — в лекции о правах.</p>
`,
  cheat: `
<ul>
  <li>DML всегда работает с <strong>одной</strong> таблицей.</li>
  <li><code>INSERT INTO t (k1, k2) VALUES (v1, v2);</code> — рекомендуется полный синтаксис.</li>
  <li>Много строк: MS SQL <code>VALUES (…), (…)</code>; Oracle <code>INSERT ALL INTO … INTO … SELECT * FROM dual</code>.</li>
  <li><code>INSERT … SELECT …</code> вместо VALUES. Новый ключ: <code>SELECT ISNULL/NVL(MAX(id),0)+1</code>.</li>
  <li>Новая таблица: MS SQL <code>SELECT … INTO new FROM …</code>; Oracle <code>CREATE TABLE new AS SELECT …</code>.</li>
  <li><code>UPDATE t SET k = w WHERE …</code> — без WHERE меняет всё!</li>
  <li><code>DELETE FROM t WHERE …</code> — блокируется FK (NO ACTION).</li>
  <li><code>COMMIT</code> фиксирует, <code>ROLLBACK</code> отменяет. MS SQL: autocommit; <code>BEGIN TRAN</code> или <code>SET IMPLICIT_TRANSACTIONS ON</code>.</li>
  <li><code>TRUNCATE</code> = DDL, быстро, без WHERE. ROLLBACK: Oracle — не отменит, MS SQL — отменит. MS SQL сбрасывает IDENTITY.</li>
</ul>
`
},

'ddl': {
  title: 'DDL: таблицы, ограничения, IDENTITY и последовательности',
  lead: 'CREATE / ALTER / DROP в обоих диалектах: объявление ограничений, автонумерация, ссылочные действия и изменение схемы.',
  body: `
<h2>Команды DDL</h2>
<p>DDL работает с <strong>объектами</strong> базы: таблицами, представлениями, индексами, процедурами, триггерами, а в MS SQL и целыми базами (<code>CREATE DATABASE</code>). Шаблон всегда один:</p>
<p class="formula">CREATE | ALTER | DROP  тип_объекта  имя_объекта  …</p>
<p>В RBD таблицы за вас создавал CASE-инструмент. Теперь мы пишем DDL вручную — а синтаксис двух диалектов немного различается, поэтому скрипты не всегда можно просто перенести.</p>

<h2>CREATE TABLE</h2>
<ul>
  <li>Имя: максимум <strong>30 символов в Oracle</strong> (касается всех имён, в том числе ограничений!), 128 в MS SQL.</li>
  <li>Oracle: максимум 1000 столбцов; MS SQL: максимум 8060 байт на строку.</li>
  <li>Начинайте имена с латинской буквы, используйте буквы, цифры и <code>_</code>. Национальные символы и пробелы иногда формально разрешены, но это путь к проблемам.</li>
</ul>

<h2>Ограничения целостности — повторение</h2>
<p>Принцип: <strong>мы задаём правила, СУБД их соблюдает</strong> — при каждой операции, транзакции, импорте, кто бы их ни выполнял. Проверки в приложении тоже полезны (меньше сетевого трафика), но естественное место — сервер.</p>
<table>
  <thead><tr><th>Ограничение</th><th>Значение</th></tr></thead>
  <tbody>
    <tr><td><code>NOT NULL</code></td><td>у столбца обязательно должно быть значение</td></tr>
    <tr><td><code>PRIMARY KEY</code></td><td>первичный ключ (один или несколько столбцов)</td></tr>
    <tr><td><code>FOREIGN KEY … REFERENCES t</code></td><td>внешний ключ на первичный ключ таблицы t</td></tr>
    <tr><td><code>UNIQUE</code></td><td>без повторов</td></tr>
    <tr><td><code>CHECK (условие)</code></td><td>условие для вставляемых/изменяемых значений</td></tr>
    <tr><td><code>DEFAULT значение</code></td><td>значение по умолчанию</td></tr>
  </tbody>
</table>
<p>У каждого ограничения есть имя, уникальное в базе. Если его не задать, сервер придумает своё (некрасивое). Своё имя задаётся через <code>CONSTRAINT имя</code> — удобно, когда позже захотите удалить или отключить ограничение.</p>
<div data-code="ddl-inline"></div>
<div data-note="tip"><p>Многостолбцовые ограничения (например, составной первичный ключ) нужно записывать «вне строки столбца».</p></div>

<h2>Автоматическая нумерация</h2>
<h3>IDENTITY (MS SQL)</h3>
<p>Один столбец таблицы может иметь свойство <code>IDENTITY(начало, шаг)</code> (по умолчанию 1, 1). Сервер сам подставляет следующие номера — в INSERT этот столбец <strong>пропускаем</strong>, а попытка вставить значение — ошибка.</p>
<div data-code="ddl-identity"></div>
<div data-note="lecture"><p>Преподаватель иронично описывает типичную историю: студент пишет краткий INSERT без списка столбцов, получает ошибку, «гуглит» <code>SET IDENTITY_INSERT … ON</code> — и только что выключил механизм, который должен был делать работу за него. Мораль: пишите INSERT со списком столбцов, а IDENTITY_INSERT оставьте администраторам.</p></div>
<p>Последнее сгенерированное значение читают через <code>SCOPE_IDENTITY()</code> (текущая область — лучше) или <code>@@IDENTITY</code> (последнее в сессии). В Oracle IDENTITY тоже есть начиная с 12c — в трёх вариантах (тема «PL/SQL для продвинутых»).</p>
<h3>Последовательности</h3>
<p><strong>Последовательность (sequence)</strong> — отдельный объект, генерирующий номера, независимый от таблиц (Oracle; MS SQL с 2012). Её можно использовать в нескольких таблицах и вне их.</p>
<div data-code="ddl-sequence"></div>

<h2>ALTER TABLE</h2>
<p>Изменение столбцов и ограничений существующей таблицы. Oracle использует <code>MODIFY</code> и скобки, MS SQL — <code>ALTER COLUMN</code>. В MS SQL NOT NULL и DEFAULT — свойства/ограничения столбца; в Oracle NOT NULL и DEFAULT — свойства столбца, меняемые через MODIFY.</p>
<div data-code="ddl-alter"></div>
<div data-note="warn"><p>CHECK пропускает значения, для которых условие TRUE <strong>или NULL</strong>; блокирует только FALSE. Нельзя добавить новый столбец NOT NULL в таблицу со строками — сначала добавьте столбец, заполните его, потом установите NOT NULL (в Oracle помогает DEFAULT).</p></div>
<div data-note="lecture"><p>DEFAULT может содержать константы и функции SQL (GETDATE, SYSDATE), но не имена столбцов и не функции T-SQL/PL/SQL. В Oracle последовательность нельзя использовать в DEFAULT (в MS SQL можно — см. пример с таблицей Kontener).</p></div>

<h3>Внешние ключи и ссылочные действия</h3>
<p>Внешний ключ можно добавить позже через ALTER TABLE — это единственный способ для <strong>циклических связей</strong> (A указывает на B, а B на A): сначала создаём обе таблицы, потом добавляем FK.</p>
<table>
  <thead><tr><th>Действие при DELETE</th><th>Что происходит с дочерними строками</th><th>Oracle</th></tr></thead>
  <tbody>
    <tr><td><code>NO ACTION</code> (по умолчанию)</td><td>ошибка, удаление запрещено</td><td>да</td></tr>
    <tr><td><code>CASCADE</code></td><td>удаляются вместе с родителем (хорошо для ассоциативных таблиц)</td><td>да</td></tr>
    <tr><td><code>SET NULL</code></td><td>FK := NULL</td><td>да</td></tr>
    <tr><td><code>SET DEFAULT</code></td><td>FK := значение по умолчанию</td><td><strong>нет</strong></td></tr>
  </tbody>
</table>
<div data-code="ddl-fk"></div>

<h2>Отключение ограничений</h2>
<p>Ограничения можно отключить и вставить нарушающие их данные — но это <strong>особая операция</strong>, только для администраторов, и никогда не способ «обойти защиту». Пока плохие данные в таблице, ограничение нельзя снова включить.</p>
<div data-code="ddl-disable"></div>

<h2>DROP и пример сценария</h2>
<p><code>DROP TABLE t</code> удаляет таблицу вместе с данными. Не сработает, если у других таблиц есть внешние ключи на неё (с NO ACTION) — сначала удаляйте дочерние таблицы.</p>
<div data-code="ddl-scenario"></div>
`,
  cheat: `
<ul>
  <li><code>CREATE | ALTER | DROP тип имя</code>. Oracle: имена ≤ 30 символов.</li>
  <li>Ограничения: NOT NULL, PRIMARY KEY, FOREIGN KEY … REFERENCES, UNIQUE, CHECK, DEFAULT. Имя: <code>CONSTRAINT имя …</code>.</li>
  <li>Многостолбцовые ограничения — «вне строки»: <code>PRIMARY KEY (a, b)</code>.</li>
  <li>MS SQL: <code>INT IDENTITY(начало, шаг)</code>; пропускать в INSERT; <code>SCOPE_IDENTITY()</code>; <code>SET IDENTITY_INSERT t ON</code> — только для администратора.</li>
  <li>Последовательности: MS SQL <code>NEXT VALUE FOR s</code>; Oracle <code>s.NEXTVAL</code>, <code>s.CURRVAL</code>.</li>
  <li>ALTER: MS SQL <code>ADD / ALTER COLUMN / DROP COLUMN</code>; Oracle <code>ADD (…) / MODIFY (…) / DROP COLUMN</code>.</li>
  <li><code>ALTER TABLE t ADD CONSTRAINT c CHECK (…)</code>; <code>DROP CONSTRAINT c</code>.</li>
  <li>CHECK блокирует только FALSE (NULL проходит).</li>
  <li>ON DELETE: NO ACTION (по умолчанию), CASCADE, SET NULL, SET DEFAULT (нет в Oracle).</li>
  <li>Цикл FK → сначала таблицы, потом <code>ALTER TABLE … ADD FOREIGN KEY</code>.</li>
  <li>Отключение: Oracle <code>DISABLE/ENABLE CONSTRAINT</code>; MS SQL <code>NOCHECK/CHECK CONSTRAINT</code>.</li>
  <li>DROP — сначала дочерние таблицы.</li>
</ul>
`
},

'views': {
  title: 'Представления (views)',
  lead: 'Сохранённые запросы, которые выглядят как таблицы: создание, ограничения DML, WITH CHECK OPTION и материализованные представления.',
  body: `
<h2>Что такое представление</h2>
<p><strong>Представление</strong> (польск. perspektywa, widok) — это <strong>именованное определение SELECT, сохранённое в базе</strong>, которое можно многократно использовать как таблицу. Представление <strong>не хранит данных</strong>, только рецепт их чтения; строки вычисляются при каждом использовании.</p>
<div data-note="analogy"><p>Представление — окно, местами с матовым стеклом: каждая группа пользователей видит через него только те строки и столбцы, которые ей положены, — но данные по-прежнему живут в таблицах за окном.</p></div>
<p>Зачем нужны представления:</p>
<ul>
  <li><strong>безопасность</strong> — пользователь видит только свои данные и не знает структуры всей базы;</li>
  <li><strong>удобство</strong> — сложный запрос пишется один раз;</li>
  <li>источник данных для элементов управления в приложениях.</li>
</ul>
<div data-note="lecture"><p>Правило с лекции: давайте пользователям данные через <strong>представления</strong>, а ещё лучше через <strong>хранимые процедуры</strong> — а не напрямую из таблиц.</p></div>

<h2>Создание</h2>
<p class="formula">CREATE VIEW имя [(столбец, …)] AS оператор_select;</p>
<p>Имена столбцов представления можно указать в скобках, задать псевдонимами в SELECT или взять из исходных столбцов. Изменение определения: <code>ALTER VIEW</code> (MS SQL) или <code>CREATE OR REPLACE VIEW</code> (Oracle). Удаление: <code>DROP VIEW</code>.</p>
<div data-code="v-create"></div>
<div data-code="v-order"></div>

<h2>DML через представление</h2>
<p>Правило Кодда говорит, что данные должны меняться через представления. Так и есть — если представление удовлетворяет довольно строгим условиям (тогда ясно, какую строку таблицы менять):</p>
<ul>
  <li>нет <code>DISTINCT</code>;</li>
  <li><strong>одна</strong> таблица (или одно обновляемое представление) во FROM;</li>
  <li>в списке SELECT только имена столбцов (без выражений);</li>
  <li>нет подзапросов в WHERE;</li>
  <li>нет <code>GROUP BY</code> и <code>HAVING</code>.</li>
</ul>
<p>Представление, соединяющее Emp и Dept, этим условиям уже не удовлетворяет. (Это можно обойти триггером <code>INSTEAD OF</code> — тема о триггерах.)</p>

<h2>WITH CHECK OPTION</h2>
<p>Предложение <code>WITH CHECK OPTION</code> при INSERT/UPDATE через представление проверяет, <strong>удовлетворяет ли новая/изменённая строка по-прежнему WHERE представления</strong>. Если нет — операция отклоняется. То есть нельзя через представление «вытолкнуть» строку из него.</p>
<div data-code="v-dml"></div>

<h2>Материализованные представления (только Oracle)</h2>
<p><strong>Материализованное представление</strong> физически <strong>хранит</strong> результат запроса. Используется для сильно агрегированных данных, которые долго вычислять, — прежде всего в хранилищах данных. Данные всегда <strong>производные</strong> (копия) от таблиц. Виды: только для чтения (по умолчанию) и обновляемые (<code>FOR UPDATE</code>). Варианты обновления — тема о производительности.</p>
<div data-code="v-mat"></div>
<div data-note="tip"><p>Аналог в MS SQL — <strong>индексированные представления</strong> (упоминаются в лекции о производительности).</p></div>
`,
  cheat: `
<ul>
  <li>Представление = сохранённый SELECT, «виртуальная таблица», <strong>не хранит данных</strong>.</li>
  <li>Зачем: безопасность (только нужные строки/столбцы), удобство. Лучше представлений: процедуры.</li>
  <li><code>CREATE VIEW v (k1, k2) AS SELECT …;</code> · <code>ALTER VIEW</code> (MS) / <code>CREATE OR REPLACE VIEW</code> (Oracle) · <code>DROP VIEW v</code>.</li>
  <li>MS SQL: ORDER BY в представлении только с <code>TOP</code> (например, <code>TOP 99.99 PERCENT</code>).</li>
  <li>DML через представление: без DISTINCT, 1 таблица во FROM, простые столбцы, без подзапросов в WHERE, без GROUP BY/HAVING.</li>
  <li><code>WITH CHECK OPTION</code> — нельзя изменить строку так, чтобы она вышла из представления.</li>
  <li><code>CREATE MATERIALIZED VIEW</code> (Oracle) — физическая копия результата, для хранилищ; <code>FOR UPDATE</code> = обновляемое.</li>
</ul>
`
},

'functions': {
  title: 'Полезные встроенные функции (Дополнение)',
  lead: 'Функции даты и времени, преобразования типов и математические функции в MS SQL Server и Oracle — шпаргалка с примерами.',
  body: `
<h2>Зачем эта тема</h2>
<p>Дополнение к лекциям собирает самые используемые функции обоих серверов. Полный список — в документации, а здесь «набор инструментов» для занятий.</p>
<div data-note="warn"><p>В MS SQL после имени функции <strong>всегда</strong> ставятся скобки, даже без аргументов: <code>GETDATE()</code>. В Oracle некоторые функции пишутся без них: <code>SYSDATE</code>, <code>CURRENT_DATE</code>.</p></div>

<h2>MS SQL Server</h2>
<table>
  <thead><tr><th>Функция</th><th>Что делает</th></tr></thead>
  <tbody>
    <tr><td><code>GETDATE()</code>, <code>SYSDATETIME()</code></td><td>текущие дата и время (разная точность)</td></tr>
    <tr><td><code>DATENAME(часть, дата)</code></td><td>название части даты как текст (например, <code>May</code>)</td></tr>
    <tr><td><code>DATEPART(часть, дата)</code></td><td>часть даты как число (например, 5)</td></tr>
    <tr><td><code>DATEDIFF(часть, от, до)</code></td><td>разность <code>до − от</code> в единицах (year, month, day, hour…)</td></tr>
    <tr><td><code>DATEADD(часть, n, дата)</code></td><td>дата, сдвинутая на n единиц</td></tr>
    <tr><td><code>DAY()</code>, <code>MONTH()</code>, <code>YEAR()</code></td><td>день, месяц, год</td></tr>
    <tr><td><code>CAST(x AS тип)</code>, <code>CONVERT(тип, x, стиль)</code></td><td>преобразование; стиль = код формата даты (например, 107)</td></tr>
    <tr><td><code>ROUND(x, n[, 1])</code></td><td>округление до n знаков; третий аргумент ≠ 0 = отбросить</td></tr>
    <tr><td><code>CEILING(x)</code>, <code>FLOOR(x)</code></td><td>вверх / вниз до целого</td></tr>
  </tbody>
</table>
<div data-code="fn-ms"></div>

<h2>Oracle</h2>
<table>
  <thead><tr><th>Функция</th><th>Что делает</th></tr></thead>
  <tbody>
    <tr><td><code>SYSDATE</code>, <code>CURRENT_DATE</code></td><td>текущая дата (системная / сессии)</td></tr>
    <tr><td><code>CURRENT_TIMESTAMP</code>, <code>LOCALTIMESTAMP</code></td><td>текущее время</td></tr>
    <tr><td><code>EXTRACT(YEAR FROM дата)</code></td><td>часть даты (YEAR, MONTH, DAY…)</td></tr>
    <tr><td><code>ADD_MONTHS(дата, n)</code></td><td>дата, сдвинутая на n месяцев</td></tr>
    <tr><td><code>MONTHS_BETWEEN(d1, d2)</code></td><td>число месяцев между датами (дробное!)</td></tr>
    <tr><td><code>TO_CHAR</code>, <code>TO_DATE</code>, <code>TO_NUMBER</code></td><td>преобразования с форматом</td></tr>
    <tr><td><code>CAST(x AS тип)</code></td><td>как в MS SQL, но для текста укажите длину: <code>VARCHAR2(20)</code></td></tr>
  </tbody>
</table>
<p>Формат даты в Oracle зависит от настроек сессии. Его можно изменить: <code>ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';</code> (до конца сессии). <code>TO_DATE</code> с явным форматом делает код независимым от этих настроек.</p>
<div data-code="fn-ora"></div>
<div data-note="own"><p>Фильтр по году: MS SQL <code>WHERE YEAR(date) = 2025</code>, Oracle <code>WHERE EXTRACT(YEAR FROM date) = 2025</code>. Но условие-диапазон <code>date &gt;= '2025-01-01' AND date &lt; '2026-01-01'</code> быстрее — оно может использовать индекс (см. тему об индексах).</p></div>
`,
  cheat: `
<ul>
  <li>MS SQL: <code>GETDATE()</code>, <code>DATEPART/DATENAME(часть, d)</code>, <code>DATEDIFF(часть, от, до)</code>, <code>DATEADD(часть, n, d)</code>, <code>YEAR/MONTH/DAY(d)</code>.</li>
  <li>MS SQL: <code>CAST(x AS VARCHAR)</code>, <code>CONVERT(VARCHAR, d, 107)</code>, <code>ROUND(x, n[,1])</code>, <code>CEILING</code>, <code>FLOOR</code>, <code>ISNULL</code>.</li>
  <li>Oracle: <code>SYSDATE</code>, <code>CURRENT_DATE</code>, <code>EXTRACT(YEAR FROM d)</code>, <code>ADD_MONTHS(d, n)</code>, <code>MONTHS_BETWEEN(d1, d2)</code>.</li>
  <li>Oracle: <code>TO_CHAR(d, 'YYYY-MM-DD')</code>, <code>TO_DATE('24-02-2022','DD-MM-YYYY')</code>, <code>CAST(x AS VARCHAR2(20))</code>, <code>NVL</code>.</li>
  <li>Oracle: <code>ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD'</code> — до конца сессии.</li>
  <li>MS SQL всегда со скобками: <code>GETDATE()</code>; Oracle без: <code>SYSDATE</code>.</li>
</ul>
`
}

});
