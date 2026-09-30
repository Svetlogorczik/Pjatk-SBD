/* RU – Модуль 3: T-SQL (MS SQL Server) */
SBD.addContent('ru', {

'tsql-basics': {
  title: 'T-SQL: пакеты, переменные, IF и WHILE',
  lead: 'Первый процедурный язык: как писать «программы» в MS SQL Server — переменные, присваивание, условия и циклы.',
  body: `
<h2>Зачем процедурный язык</h2>
<p>В чистом SQL нет переменных, условий и циклов. <strong>Transact-SQL (T-SQL)</strong> — расширение SQL в MS SQL Server (создано Sybase, развивается Microsoft), которое их добавляет. Код выполняется прямо на сервере и может храниться как объекты базы: <strong>хранимые процедуры</strong> и <strong>триггеры</strong>.</p>
<div data-note="analogy"><p>SQL — это отдельные команды («дай список», «добавь строку»). T-SQL позволяет составить из них «рецепт»: «посчитай сотрудников; если их меньше 16 — прими нового, иначе выведи сообщение».</p></div>

<h2>Пакет (скрипт) и GO</h2>
<ul>
  <li><strong>Анонимный блок</strong> — код, написанный в редакторе (SSMS) и сразу выполненный, но <em>не сохранённый</em> в базе как объект. Его можно хранить в файле .sql.</li>
  <li>Синтаксис T-SQL очень свободный (необязательные точки с запятой, любые переносы строк). И всё же: каждый оператор с новой строки, точки с запятой, отступы.</li>
  <li><code>GO</code> завершает пакет. SSMS добавляет его неявно; явно он нужен, когда в одном окне запускается несколько независимых частей (например, <code>CREATE PROCEDURE</code> должен быть первым оператором пакета). <strong>Переменная живёт до ближайшего GO.</strong></li>
  <li>Регистр в ключевых словах и именах не важен.</li>
</ul>

<h2>Вывод результатов</h2>
<p><code>PRINT</code> пишет текст на вкладку <em>Messages</em>, <code>SELECT</code> возвращает набор строк на вкладку <em>Results</em>. После каждого DML сервер печатает «(n rows affected)» — это отключает <code>SET NOCOUNT ON</code>.</p>
<div data-code="ts-print"></div>

<h2>Переменные</h2>
<ul>
  <li>Каждую переменную нужно объявить: <code>DECLARE @имя ТИП</code>. Имя <strong>всегда начинается с @</strong>.</li>
  <li>Типы — те же, что у столбцов таблиц (INT, VARCHAR(n), MONEY, DATE…).</li>
  <li>Один DECLARE может объявить несколько переменных и сразу дать им значения (в том числе результат SELECT в скобках).</li>
  <li>DECLARE может стоять в любом месте кода — лишь бы до использования переменной.</li>
  <li>Неинициализированная переменная равна <strong>NULL</strong>.</li>
</ul>
<div data-code="ts-vars"></div>
<h3>Системные переменные</h3>
<p>Начинаются с <code>@@</code>, не объявляются и доступны только для чтения: <code>@@VERSION</code>, <code>@@ROWCOUNT</code>, <code>@@ERROR</code>, <code>@@IDENTITY</code>, <code>@@FETCH_STATUS</code> и многие другие.</p>
<div data-code="ts-sysvars"></div>

<h2>Присваивание: SET и SELECT</h2>
<ul>
  <li><code>SET @x = выражение</code> — присваивает <strong>одну</strong> переменную.</li>
  <li><code>SELECT @x = …, @y = …</code> — может присвоить <strong>несколько</strong> сразу, в том числе значения из таблицы (<code>SELECT @x = столбец FROM … WHERE …</code>).</li>
</ul>
<div data-code="ts-assign"></div>
<div data-note="warn"><p>Две опасные ситуации, в которых сервер <strong>не выдаёт ошибки</strong>:</p>
<ul>
  <li>SELECT возвращает <strong>много строк</strong> → переменная получает значение из <strong>последней</strong>;</li>
  <li>SELECT возвращает <strong>ноль строк</strong> → переменная <strong>сохраняет старое значение</strong> (или NULL).</li>
</ul>
<p>В PL/SQL (Oracle) обе ситуации — ошибки; это одно из важных различий.</p></div>
<div data-code="ts-pitfall"></div>
<div data-note="tip"><p>При склейке текста с числом всегда преобразуйте: <code>'There are ' + CAST(@n AS VARCHAR) + ' people'</code>. Без CAST получите ошибку преобразования.</p></div>

<h2>IF … ELSE</h2>
<p class="formula">IF условие
    оператор или BEGIN … END
[ELSE
    оператор или BEGIN … END]</p>
<ul>
  <li>Ветка IF выполняется, когда условие TRUE; ELSE — когда FALSE <strong>или NULL</strong>.</li>
  <li>В условии работает всё, что разрешено в WHERE: AND/OR/NOT, LIKE, IN, BETWEEN — даже <strong>SELECT в скобках</strong>.</li>
  <li>Несколько операторов в ветке → <code>BEGIN … END</code> (хорошая привычка: всегда).</li>
  <li><code>ELSEIF</code> нет — вкладываем <code>ELSE IF …</code>.</li>
</ul>
<div data-code="ts-if"></div>
<div data-code="ts-elseif"></div>

<h2>IF EXISTS</h2>
<p><code>IF [NOT] EXISTS (SELECT …)</code> проверяет, возвращает ли запрос <strong>хотя бы одну строку</strong>. Это очень быстро — сервер останавливается на первом попадании. Такой синтаксис (EXISTS вне SELECT) работает только в T-SQL; в Oracle его нет.</p>
<div data-code="ts-ifexists"></div>
<div data-code="ts-ifexists-bad"></div>

<h2>Цикл WHILE</h2>
<p>В T-SQL только один цикл: <code>WHILE условие</code> — он выполняется, пока условие TRUE. Им можно сделать любой вид повторения. Следите, чтобы условие когда-нибудь перестало быть истинным, иначе программа «зациклится». В базах данных цикл чаще всего идёт вместе с курсором (следующая тема).</p>
<div data-code="ts-while"></div>
`,
  cheat: `
<ul>
  <li>T-SQL = SQL + переменные + IF + WHILE + процедуры + триггеры (MS SQL Server).</li>
  <li><code>GO</code> завершает пакет; переменные живут до GO. <code>CREATE PROCEDURE</code> — первый оператор пакета.</li>
  <li><code>PRINT 'текст'</code> → Messages; <code>SELECT</code> → Results. <code>SET NOCOUNT ON</code>.</li>
  <li><code>DECLARE @x INT = 5, @s VARCHAR(20);</code> — имя начинается с <strong>@</strong>, по умолчанию NULL.</li>
  <li><code>DECLARE @n INT = (SELECT COUNT(1) FROM Emp);</code></li>
  <li><code>SET @x = …</code> (1 переменная) · <code>SELECT @x = col, @y = col2 FROM … WHERE …</code> (несколько).</li>
  <li>Ловушки: много строк → последняя; ноль строк → старое значение; <strong>ошибки нет</strong>!</li>
  <li>Конкатенация: <code>'There are ' + CAST(@n AS VARCHAR)</code>.</li>
  <li><code>@@ROWCOUNT</code>, <code>@@ERROR</code>, <code>@@IDENTITY</code>, <code>@@FETCH_STATUS</code>.</li>
  <li><code>IF … BEGIN … END ELSE …</code>; ELSEIF нет → <code>ELSE IF</code>. ELSE ловит и NULL.</li>
  <li><code>IF [NOT] EXISTS (SELECT 1 FROM … WHERE …)</code> — только T-SQL.</li>
  <li><code>WHILE условие BEGIN … END</code>; <code>BREAK</code>, <code>CONTINUE</code>.</li>
</ul>
`
},

'tsql-cursors': {
  title: 'T-SQL: курсоры',
  lead: 'Как пройти по результату SELECT строка за строкой: DECLARE, OPEN, FETCH, цикл, CLOSE, DEALLOCATE.',
  body: `
<h2>Зачем курсор</h2>
<p>Присваивание <code>SELECT @x = …</code> годится для одной строки. А если запрос возвращает много строк и <strong>для каждой</strong> нужно сделать что-то своё (например, в зависимости от значения изменить зарплату и вывести сообщение)? Тогда используем <strong>курсор</strong>.</p>
<p>Курсор сохраняет результат SELECT в буфере (в MS SQL — временная таблица в tempdb) и позволяет читать его <strong>строка за строкой</strong> в переменные. Его можно использовать в пакете, процедуре и триггере.</p>
<div data-note="analogy"><p>Курсор — это палец, который движется вниз по списку, напечатанному SELECT: показали на строку, переписали её значения в переменные, сделали своё дело — и сдвинули палец ниже.</p></div>
<div data-note="warn"><p>Курсоры <strong>медленные</strong>. Если задачу можно решить одним оператором SQL (например, UPDATE с WHERE или коррелированный UPDATE), делайте без курсора.</p></div>

<h2>Шесть шагов курсора</h2>
<ol class="steps">
  <li><code>DECLARE имя CURSOR FOR SELECT …</code> — определение (пока ничего не читается).</li>
  <li><code>OPEN имя</code> — выполняется SELECT, строки попадают в буфер, данные блокируются для других транзакций. Число строк — в <code>@@CURSOR_ROWS</code>.</li>
  <li><code>FETCH NEXT FROM имя INTO @v1, @v2</code> — чтение строки в переменные (число и типы должны соответствовать столбцам).</li>
  <li>Цикл <code>WHILE @@FETCH_STATUS = 0</code> — 0 значит «строка прочитана», −1 — «конец».</li>
  <li><code>CLOSE имя</code> — освобождение блокировок и буфера (определение остаётся; можно снова OPEN).</li>
  <li><code>DEALLOCATE имя</code> — удаление определения курсора.</li>
</ol>
<div data-code="ts-cur-basic"></div>
<div data-note="exam"><p><strong>FETCH встречается дважды:</strong> один раз <em>перед</em> циклом (чтобы установить <code>@@FETCH_STATUS</code> — иначе цикл вообще не начнётся) и один раз <em>в конце</em> тела цикла, прямо перед END. Нет второго FETCH = бесконечный цикл.</p></div>
<p>Ошибки: FETCH или CLOSE на закрытом курсоре → <em>Cursor is not open</em>; OPEN на открытом → <em>The cursor is already open</em>.</p>

<h2>Курсор, изменяющий данные</h2>
<p>Курсор кладёт значения в переменные, но <code>UPDATE</code> «не знает», какая это строка. Поэтому у UPDATE <strong>обязан</strong> быть <code>WHERE ключ = @ключ</code> (без него изменится вся таблица!) или <code>WHERE CURRENT OF курсор</code>.</p>
<div data-code="ts-cur-update"></div>
<div data-note="tip"><p>Ограничивайте строки уже в SELECT курсора (<code>WHERE sal NOT BETWEEN 1000 AND 3000</code>), а не читайте всё и проверяйте в цикле — серверу меньше работы.</p></div>
<div data-code="ts-cur-setbased"></div>

<h2>Прокручиваемый курсор (SCROLL)</h2>
<p>По умолчанию курсор движется только вперёд (<code>FETCH NEXT</code>). Курсор, объявленный как <code>SCROLL CURSOR</code>, умеет прыгать: <code>FETCH PRIOR</code>, <code>FIRST</code>, <code>LAST</code>, <code>ABSOLUTE n</code>, <code>RELATIVE n</code>.</p>
<div data-code="ts-cur-scroll"></div>
`,
  cheat: `
<ol>
  <li><code>DECLARE k CURSOR FOR SELECT a, b FROM … WHERE …;</code></li>
  <li><code>DECLARE @a …, @b …;</code></li>
  <li><code>OPEN k;</code></li>
  <li><code>FETCH NEXT FROM k INTO @a, @b;</code> ← перед циклом</li>
  <li><code>WHILE @@FETCH_STATUS = 0 BEGIN … FETCH NEXT FROM k INTO @a, @b; END;</code> ← FETCH в конце</li>
  <li><code>CLOSE k; DEALLOCATE k;</code></li>
</ol>
<ul>
  <li><code>@@FETCH_STATUS</code>: 0 = OK, −1 = конец.</li>
  <li>UPDATE в курсоре: <code>WHERE id = @id</code> или <code>WHERE CURRENT OF k</code>.</li>
  <li>Фильтруйте в SELECT курсора. Курсор = медленно → если можно, один UPDATE.</li>
  <li><code>SCROLL CURSOR</code>: FETCH NEXT / PRIOR / FIRST / LAST / ABSOLUTE n / RELATIVE n.</li>
</ul>
`
},

'tsql-procedures': {
  title: 'T-SQL: хранимые процедуры и функции',
  lead: 'Код, хранящийся в базе: параметры, три способа вернуть результат, хорошие практики, скалярные и табличные функции.',
  body: `
<h2>Что такое хранимая процедура</h2>
<p><strong>Хранимая процедура</strong> — код T-SQL, сохранённый в базе как объект с уникальным именем. Общаемся с ней через <strong>параметры</strong>. При первом выполнении сервер компилирует её и строит оптимальный план доступа к данным.</p>
<p>Преимущества:</p>
<ul>
  <li><strong>порядок и контроль</strong> — операции с базой собраны в одном месте и всегда выполняются одинаково;</li>
  <li><strong>безопасность</strong> — приложение получает право выполнять процедуру, а не произвольные команды над таблицами;</li>
  <li><strong>меньше сетевого трафика</strong> — один вызов вместо множества команд.</li>
</ul>
<p>В T-SQL процедура может ссылаться на таблицы, которых ещё нет на момент компиляции, и может выполнять DDL.</p>

<h2>Синтаксис</h2>
<p class="formula">CREATE [OR ALTER] PROCEDURE имя
    @парам1 ТИП [= значение_по_умолчанию] [OUTPUT],
    @парам2 ТИП …
AS
BEGIN
    операторы T-SQL
END;</p>
<ul>
  <li>Исправление существующей процедуры: <code>ALTER PROCEDURE</code> (или <code>CREATE OR ALTER</code> с версии 2016).</li>
  <li>Параметры объявляются как переменные, но <strong>без DECLARE</strong>. По умолчанию они входные (INPUT); <code>OUTPUT</code> — выходные.</li>
  <li>Запуск: <code>EXEC</code> / <code>EXECUTE имя значения</code>. Пропускаемые параметры со значением по умолчанию можно заменить словом <code>DEFAULT</code> либо передавать параметры по имени.</li>
</ul>
<div data-code="ts-proc-basic"></div>

<h2>Как процедура возвращает результат</h2>
<table>
  <thead><tr><th>Способ</th><th>Возвращает</th><th>Примечания</th></tr></thead>
  <tbody>
    <tr><td><strong>Набор строк</strong></td><td>результат (последнего) SELECT</td><td>виден в SSMS на вкладке Results; приложение должно его принять</td></tr>
    <tr><td><strong>Параметр OUTPUT</strong></td><td>любые значения</td><td>слово OUTPUT в объявлении <strong>и</strong> в вызове; для приёма нужна переменная</td></tr>
    <tr><td><strong>RETURN</strong></td><td>только INT</td><td>немедленно завершает процедуру; принимается через <code>EXEC @v = proc</code></td></tr>
  </tbody>
</table>
<div data-code="ts-proc-output"></div>

<h2>Хорошие практики (с лекции)</h2>
<ul>
  <li>Первый оператор после AS: <code>SET NOCOUNT ON</code>.</li>
  <li>Не используйте функции в SELECT, если они не работают с возвращаемыми значениями (они вычисляются для каждой строки).</li>
  <li>Не пишите <code>SELECT *</code>.</li>
  <li>Ограничивайте читаемые данные как можно раньше.</li>
  <li>Используйте явные транзакции (<code>BEGIN TRANSACTION … COMMIT</code>) и делайте их <strong>короткими</strong> (меньше блокировок и взаимоблокировок).</li>
  <li>Обрабатывайте ошибки в <code>TRY … CATCH</code>.</li>
  <li>Процедуры можно вкладывать — до 32 уровней.</li>
</ul>
<div data-note="warn"><p>Классическая ошибка новичка: после правки процедуры вы добавляете в конце <code>EXEC имя</code> и компилируете всё без <code>GO</code> перед EXEC. Вызов становится частью процедуры — она вызывает сама себя 32 раза, и приложение зависает. Всегда отделяйте определение от вызова словом <code>GO</code>.</p></div>
<div data-code="ts-proc-template"></div>

<h2>Пользовательские функции</h2>
<p>Функции похожи на процедуры с RETURN, но их <strong>можно использовать прямо в операторах SQL</strong> (в SELECT, WHERE…), без EXEC. Они возвращают значение типа, указанного после <code>RETURNS</code>.</p>
<ul>
  <li>При вызове имя должно включать <strong>схему</strong> (<code>dbo.имя</code>) и <strong>скобки</strong>, даже без параметров.</li>
  <li>Не вызывайте функцию в SELECT, возвращающем много строк, если она даёт один и тот же результат в каждой строке — вычислите её один раз в переменную.</li>
</ul>
<h3>Скалярная функция</h3>
<div data-code="ts-fn-scalar"></div>
<p>Благодаря функции мы обошлись без подзапроса и CTE.</p>
<h3>Табличные функции</h3>
<p><strong>Inline</strong>: <code>RETURNS TABLE AS RETURN (SELECT …)</code> — как представление с параметром. <strong>Многооператорная</strong>: после RETURNS объявляется табличная переменная со столбцами, её заполняют любым числом операторов и заканчивают <code>RETURN</code>.</p>
<div data-code="ts-fn-table"></div>
<h3>Чего функция не может</h3>
<ul>
  <li>изменять базу (INSERT/UPDATE/DELETE по таблицам) — только по своим табличным переменным;</li>
  <li>использовать <code>OUTPUT INTO</code>, TRY…CATCH, RAISERROR, @@ERROR;</li>
  <li>использовать динамический SQL и временные таблицы (табличные переменные — можно).</li>
</ul>
`,
  cheat: `
<ul>
  <li><code>CREATE [OR ALTER] PROCEDURE p @a INT, @b VARCHAR(20) = 'x', @result INT OUTPUT AS BEGIN … END; GO</code></li>
  <li>Параметры без DECLARE; по умолчанию входные.</li>
  <li>Вызов: <code>EXEC p 1, DEFAULT, @r OUTPUT;</code> или <code>EXEC p @a = 1;</code></li>
  <li>Возврат: набор строк (SELECT) · <code>OUTPUT</code> (в объявлении и вызове) · <code>RETURN int</code> (<code>EXEC @r = p</code>).</li>
  <li><code>RETURN;</code> = немедленно выйти из процедуры.</li>
  <li>Практики: <code>SET NOCOUNT ON</code>, без <code>SELECT *</code>, короткие транзакции, TRY…CATCH, максимум 32 уровня вложенности.</li>
  <li>Отделяйте определение от <code>EXEC</code> словом <code>GO</code> (иначе рекурсия!).</li>
  <li>Скалярная функция: <code>CREATE FUNCTION f (@x INT) RETURNS MONEY AS BEGIN … RETURN @v; END</code>; вызов <code>dbo.f(10)</code>.</li>
  <li>Табличная: <code>RETURNS TABLE AS RETURN (SELECT …)</code>; многооператорная: <code>RETURNS @t TABLE (…) AS BEGIN … RETURN; END</code>.</li>
  <li>Функция не меняет БД; без TRY/RAISERROR, без динамического SQL, без таблиц #.</li>
</ul>
`
},

'tsql-triggers': {
  title: 'T-SQL: триггеры и обработка ошибок',
  lead: 'Процедуры, запускаемые автоматически при INSERT, UPDATE, DELETE: таблицы inserted/deleted, работа со многими строками, INSTEAD OF, RAISERROR, TRY…CATCH, THROW.',
  body: `
<h2>Что такое триггер</h2>
<p><strong>Триггер</strong> — особая процедура, которую <strong>вы не вызываете сами</strong>: СУБД запускает её при наступлении события (операция DML или DDL, событие сервера). Мы занимаемся триггерами DML. Их используют для:</p>
<ul>
  <li>программирования ограничений целостности, которые нельзя объявить декларативно;</li>
  <li>постоянных действий, которые должны выполняться всегда и для любого приложения (например, обновление сводок, журнал изменений).</li>
</ul>
<div data-note="warn"><p>У триггеров в MS SQL и Oracle <strong>разная философия</strong>, а не только разный синтаксис. Не переносите решения «один в один» между средами.</p></div>

<h2>Синтаксис и момент запуска</h2>
<p class="formula">CREATE [OR ALTER] TRIGGER имя
ON таблица
FOR | AFTER  INSERT [, UPDATE] [, DELETE]
AS
    операторы T-SQL</p>
<ul>
  <li>Каждый триггер принадлежит <strong>одной</strong> таблице или представлению; у таблицы может быть несколько триггеров (порядок их запуска <strong>не определён</strong>!).</li>
  <li>Триггер T-SQL срабатывает <strong>ПОСЛЕ</strong> оператора DML, но <strong>в той же, ещё не зафиксированной транзакции</strong>. Таблица уже изменена — но <code>ROLLBACK</code> в триггере может всё отменить.</li>
  <li>Триггеры могут вкладываться (триггер меняет таблицу с другим триггером…) до 32 уровней.</li>
</ul>
<div data-code="ts-trg-nodelete"></div>

<h2>Таблицы inserted и deleted</h2>
<p>В триггере есть две виртуальные таблицы (только для чтения) с копиями изменённых строк:</p>
<table>
  <thead><tr><th>Операция</th><th>inserted</th><th>deleted</th></tr></thead>
  <tbody>
    <tr><td>INSERT</td><td>новые строки</td><td>пусто</td></tr>
    <tr><td>DELETE</td><td>пусто</td><td>удалённые строки</td></tr>
    <tr><td>UPDATE</td><td>строки <strong>после</strong> изменения</td><td>строки <strong>до</strong> изменения</td></tr>
  </tbody>
</table>
<p>Все остальные таблицы базы (включая собственную таблицу триггера) в триггере можно читать и менять.</p>

<h2>Самое важное: триггер срабатывает один раз на ОПЕРАТОР</h2>
<div data-note="exam"><p>Триггер T-SQL срабатывает <strong>один раз на весь оператор</strong>, а не для каждой строки. <code>UPDATE Emp SET sal = sal*1.1</code> меняет 14 строк → триггер срабатывает один раз, а в <code>inserted</code> и <code>deleted</code> по 14 строк. Код вида <code>SELECT @sal = sal FROM inserted</code> возьмёт только одно (последнее) значение!</p></div>
<div data-code="ts-trg-rows"></div>
<p>Вариант с <code>EXISTS</code> работает при любом числе строк, но при нарушении правила откатывает <strong>весь</strong> оператор. Если каждую строку нужно обрабатывать отдельно — используйте курсор по <code>inserted</code> (или хитрое соединение).</p>
<div data-code="ts-trg-cursor"></div>
<div data-note="own"><p>Многие триггеры можно написать без курсора — работая с таблицами inserted/deleted целиком (суммы, JOIN). Это быстрее и сразу работает для многих строк:</p></div>
<div data-code="ts-trg-join"></div>
<div data-note="lecture"><p>Правила вроде «зарплата &gt; 100» лучше записывать как <code>CHECK</code>, а значение по умолчанию — как <code>DEFAULT</code>; триггер — решение для более сложных случаев (на занятиях их делают триггерами ради тренировки).</p></div>

<h3>Какая операция и какие столбцы</h3>
<ul>
  <li>INSERT: что-то в inserted, ничего в deleted; DELETE: наоборот; UPDATE: обе непустые.</li>
  <li><code>UPDATE(столбец)</code> — TRUE, если столбец изменялся (в SET или в INSERT).</li>
  <li><code>COLUMNS_UPDATED()</code> — битовая маска всех изменённых столбцов.</li>
</ul>
<div data-code="ts-trg-which"></div>
<p>Рекурсия: <strong>косвенная</strong> (TR1 на T1 меняет T2, а TR2 на T2 меняет T1) возможна; <strong>прямая</strong> (TR1 меняет свою же T1) — только после изменения настройки базы (не рекомендуется).</p>

<h2>INSTEAD OF</h2>
<p>Триггер <code>INSTEAD OF</code> выполняется <strong>вместо</strong> оператора DML (сам оператор пропускается). На <strong>представлениях</strong> он позволяет делать INSERT/UPDATE/DELETE через представление, которое обычно этого не допускает (например, с соединением). MS SQL разрешает INSTEAD OF и на таблицах (Oracle — нет).</p>
<div data-code="ts-trg-instead"></div>
<div data-note="lecture"><p>Триггеры — «очень мощный инструмент, может быть, даже слишком мощный»: они действуют одинаково для любого процесса (и плюс, и минус), а при связанных таблицах легко потерять контроль над их цепочкой. Используйте их экономно; процедуры часто лучше.</p></div>

<h2>Обработка ошибок</h2>
<p>Сервер сам выдаёт ошибки (синтаксис, несуществующий объект, неверный тип) — с номером (Msg), уровнем, состоянием и строкой.</p>
<div data-code="ts-err-server"></div>
<h3>RAISERROR</h3>
<p><code>RAISERROR (сообщение, severity, state)</code>, где <strong>severity</strong> (0–25) — тяжесть, а <strong>state</strong> (1–127) — любой номер «места».</p>
<table>
  <thead><tr><th>Severity</th><th>Эффект</th></tr></thead>
  <tbody>
    <tr><td>0–9</td><td>предупреждение + информация «Msg 50000, Level …»</td></tr>
    <tr><td>10</td><td>только сообщение (предупреждение)</td></tr>
    <tr><td>11–18</td><td>ошибка (красным); внутри TRY → переход в CATCH</td></tr>
    <tr><td>19–25</td><td>только sysadmin; 20–25 = фатальная, сессия закрывается</td></tr>
  </tbody>
</table>
<div data-code="ts-raiserror"></div>
<div data-note="warn"><p>RAISERROR <strong>вне</strong> блока TRY <strong>не останавливает</strong> код — следующие операторы всё равно выполняются!</p></div>
<h3>TRY … CATCH</h3>
<p>Операторы помещают в <code>BEGIN TRY … END TRY</code>. При ошибке (severity ≥ 11 — от сервера, RAISERROR или THROW) управление переходит в <code>BEGIN CATCH … END CATCH</code>, где доступны <code>ERROR_NUMBER()</code>, <code>ERROR_MESSAGE()</code>, <code>ERROR_SEVERITY()</code>, <code>ERROR_STATE()</code>, <code>ERROR_LINE()</code>, <code>ERROR_PROCEDURE()</code>. Вне CATCH они возвращают NULL. Блоки можно вкладывать.</p>
<div data-code="ts-try"></div>
<h3>THROW</h3>
<p><code>THROW номер, сообщение, state</code> (номер ≥ 50000) — работает как RAISERROR с severity 16, поэтому внутри TRY всегда ведёт в CATCH. <code>THROW</code> без параметров в блоке CATCH повторно выбрасывает пойманную ошибку.</p>
<div data-code="ts-throw"></div>
<div data-note="tip"><p>Хороший код предвидит ошибки и превращает их в понятные сообщения — вместо того чтобы оставить пользователя с системным «Msg 547…» и паникой «система не работает».</p></div>
`,
  cheat: `
<ul>
  <li><code>CREATE TRIGGER t ON таблица FOR|AFTER INSERT, UPDATE, DELETE AS …</code></li>
  <li>Срабатывает <strong>после</strong> DML, в той же транзакции; <code>ROLLBACK</code> отменяет оператор.</li>
  <li><strong>Один раз на оператор</strong>, а не на строку! Не пишите <code>SELECT @x = col FROM inserted</code> — используйте <code>EXISTS</code>, JOIN, SUM или курсор.</li>
  <li>INSERT → inserted; DELETE → deleted; UPDATE → deleted (до) + inserted (после). Только чтение.</li>
  <li><code>UPDATE(col)</code> — менялся ли столбец; <code>COLUMNS_UPDATED()</code> — маска.</li>
  <li>Несколько триггеров на таблице — порядок не определён. Вложенность до 32.</li>
  <li><code>INSTEAD OF</code> — вместо DML; представления (и таблицы в MS SQL).</li>
  <li>Простые правила → CHECK / DEFAULT вместо триггера.</li>
  <li><code>RAISERROR('msg', 16, 1)</code>: &lt;10 предупреждение, 10 сообщение, ≥11 ошибка (TRY→CATCH), 20–25 фатальная. Вне TRY не останавливает!</li>
  <li><code>BEGIN TRY … END TRY BEGIN CATCH … ERROR_MESSAGE() … END CATCH</code>.</li>
  <li><code>THROW 50001, 'msg', 1;</code> (≥ 50000, как severity 16); <code>THROW;</code> в CATCH = повторный выброс.</li>
</ul>
`
},

'tsql-advanced': {
  title: 'T-SQL для продвинутых',
  lead: 'Ранжирующие и оконные функции, временные таблицы, табличные переменные, OUTPUT, CASE, рекурсивные CTE, MERGE и динамический SQL.',
  body: `
<div data-note="lecture"><p>Эти конструкции облегчают работу, но не обязательны — в начале изучения T-SQL их можно пропустить. И всё же знать их стоит (они встречаются на экзамене и помогают в проекте).</p></div>

<h2>Составные операторы</h2>
<p><code>+=</code>, <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code> (остаток) — как в C/Java.</p>
<div data-code="ts-compound"></div>

<h2>Ранжирующие функции</h2>
<table>
  <thead><tr><th>Функция</th><th>Что делает</th><th>Равные значения</th></tr></thead>
  <tbody>
    <tr><td><code>ROW_NUMBER()</code></td><td>нумерует строки 1, 2, 3…</td><td>разные номера</td></tr>
    <tr><td><code>RANK()</code></td><td>1 + число строк «перед» в группе</td><td>одинаковый номер, затем <strong>пропуск</strong> (1,1,3)</td></tr>
    <tr><td><code>DENSE_RANK()</code></td><td>как RANK</td><td>одинаковый номер, <strong>без пропусков</strong> (1,1,2)</td></tr>
    <tr><td><code>NTILE(n)</code></td><td>делит строки на n равных групп</td><td>—</td></tr>
  </tbody>
</table>
<p>Синтаксис: <code>функция() OVER ([PARTITION BY …] ORDER BY …)</code>. <code>PARTITION BY</code> начинает отдельную нумерацию в каждой группе (например, для каждой должности).</p>
<div data-code="ts-rank"></div>
<p>Обычные агрегаты тоже работают с <code>OVER (PARTITION BY …)</code> — результат по группе появляется <strong>в каждой строке</strong>, без GROUP BY, CTE или представления.</p>
<div data-code="ts-window"></div>

<h2>Временные таблицы и табличные переменные</h2>
<table>
  <thead><tr><th></th><th>Временная таблица <code>#t</code> / <code>##t</code></th><th>Табличная переменная <code>@t</code></th></tr></thead>
  <tbody>
    <tr><td>Где</td><td>на диске, в <strong>tempdb</strong></td><td>в оперативной памяти</td></tr>
    <tr><td>Видимость</td><td><code>#</code> — моя сессия (в процедуре — до её конца); <code>##</code> — все сессии</td><td>пакет / процедура</td></tr>
    <tr><td>Создание</td><td><code>CREATE TABLE #t (…)</code> или <code>SELECT … INTO #t</code></td><td><code>DECLARE @t TABLE (…)</code>; <strong>не</strong> через SELECT INTO</td></tr>
    <tr><td>Ограничения</td><td>да (в том числе именованные), индексы; <strong>без FK</strong></td><td>PK, UNIQUE, NULL, CHECK (без имён); <strong>без FK</strong></td></tr>
  </tbody>
</table>
<div data-code="ts-temp"></div>
<div data-code="ts-tablevar"></div>
<div data-note="lecture"><p>«Используйте табличные переменные!» — особенно когда одни и те же данные нужны много раз: чтение с диска дорого, а переменная держит данные в памяти.</p></div>

<h2>UPDATE и DELETE с соединением</h2>
<div data-code="ts-upd-join"></div>

<h2>OUTPUT — перехват изменённых данных</h2>
<p><code>inserted</code>/<code>deleted</code> можно читать и вне триггеров: предложение <code>OUTPUT</code> в INSERT/UPDATE/DELETE записывает копии изменённых строк (целиком, даже если меняется один столбец) в табличную переменную или временную таблицу. Отлично подходит, чтобы получить номер IDENTITY новой строки.</p>
<div data-code="ts-output"></div>

<h2>CASE и коррелированный UPDATE</h2>
<p><code>CASE</code> — это «IF внутри SELECT». <strong>Простой CASE</strong> сравнивает выражение со значениями, <strong>поисковый CASE</strong> проверяет любые условия. Работает в SELECT, UPDATE и SET.</p>
<div data-code="ts-case"></div>
<div data-code="ts-corr-update"></div>

<h2>Рекурсивное CTE</h2>
<p>CTE может ссылаться само на себя: <strong>якорь</strong> (первый SELECT) <code>UNION ALL</code> <strong>шаг</strong> (SELECT из CTE) + условие остановки. Так генерируют ряды чисел или обходят иерархию (начальник → подчинённые → их подчинённые).</p>
<div data-code="ts-cte-rec"></div>

<h2>MERGE</h2>
<p>Часто нужно одновременно <strong>обновить</strong> существующие строки, <strong>добавить</strong> недостающие и <strong>удалить</strong> лишние (например, каждый месяц обновлять таблицу бюджетов отделов). Вместо процедуры с IF — один оператор <code>MERGE</code>:</p>
<ul>
  <li><code>MERGE</code> — целевая таблица; <code>USING</code> — источник; <code>ON</code> — условие сопоставления;</li>
  <li><code>WHEN MATCHED THEN</code> UPDATE/DELETE (максимум 2 предложения: первое с <code>AND условие</code>);</li>
  <li><code>WHEN NOT MATCHED [BY TARGET] THEN</code> INSERT — строки только в источнике (один раз);</li>
  <li><code>WHEN NOT MATCHED BY SOURCE THEN</code> UPDATE/DELETE — строки только в цели;</li>
  <li><code>OUTPUT … $action</code> — журнал выполненных операций.</li>
</ul>
<div data-code="ts-merge"></div>
<div data-note="warn"><p>MERGE <strong>обязан</strong> заканчиваться точкой с запятой. Осторожно с NULL в условии ON — строка с <code>deptno = NULL</code> никогда не «совпадает» и при каждом запуске считается новой.</p></div>

<h2>Динамический SQL</h2>
<p>Обычный оператор «жёсткий»: параметрами можно менять значения в WHERE, но не имя таблицы или список столбцов. <strong>Динамический SQL</strong> собирает оператор как текст и выполняет его: <code>EXEC (@text)</code> или — быстрее и безопаснее — <code>sp_executesql</code> с параметрами.</p>
<div data-code="ts-dynamic"></div>
<div data-note="warn"><p>Динамический SQL настолько же мощный, насколько опасный: склейка текста с данными пользователя открывает дорогу <strong>SQL Injection</strong>. Передавайте значения как параметры <code>sp_executesql</code>, а не конкатенацией.</p></div>
`,
  cheat: `
<ul>
  <li><code>SET @x += 5;</code> (+=, -=, *=, /=, %=).</li>
  <li><code>ROW_NUMBER() / RANK() / DENSE_RANK() / NTILE(n) OVER (PARTITION BY a ORDER BY b)</code>. RANK: 1,1,3; DENSE_RANK: 1,1,2.</li>
  <li><code>SUM(sal) OVER (PARTITION BY job)</code> — агрегат в каждой строке. <code>STRING_AGG(col, ', ')</code>.</li>
  <li><code>#t</code> локальная, <code>##t</code> глобальная (tempdb, без FK); <code>SELECT … INTO #t</code>.</li>
  <li><code>DECLARE @t TABLE (…)</code> — память, без FK, без SELECT INTO.</li>
  <li><code>UPDATE e SET … FROM Emp e JOIN Dept d ON …</code>; <code>DELETE e FROM Emp e JOIN …</code>.</li>
  <li><code>INSERT … OUTPUT inserted.* INTO @t SELECT/VALUES …</code> (без точки с запятой перед SELECT).</li>
  <li><code>CASE x WHEN … THEN … ELSE … END</code> / <code>CASE WHEN условие THEN … END</code>.</li>
  <li>Рекурсивное CTE: <code>WITH X AS (якорь UNION ALL шаг из X WHERE стоп) SELECT …</code>.</li>
  <li><code>MERGE цель USING источник ON … WHEN MATCHED … WHEN NOT MATCHED [BY TARGET] … WHEN NOT MATCHED BY SOURCE … ;</code></li>
  <li>Динамический SQL: <code>EXEC (@s)</code>; лучше <code>sp_executesql @s, N'@p INT', @p = 1</code>. Осторожно: SQL Injection.</li>
</ul>
`
}

});
