/* RU – Модуль 4: PL/SQL (Oracle) */
SBD.addContent('ru', {

'plsql-basics': {
  title: 'PL/SQL: блоки, переменные, IF и циклы',
  lead: 'Процедурный язык Oracle: строже, чем T-SQL. Структура блока, объявления, %TYPE, область видимости, IF/ELSIF и три вида циклов.',
  body: `
<h2>PL/SQL и T-SQL</h2>
<p><strong>PL/SQL</strong> играет в Oracle ту же роль, что T-SQL в MS SQL Server: добавляет переменные, условия, циклы, обработку ошибок, а код можно хранить как <strong>процедуры, функции, триггеры и пакеты</strong>. Появился в Oracle 7; синтаксис создан по образцу языка <strong>Ada</strong>.</p>
<p>Синтаксис сложнее, но <strong>упорядочен и строго проверяется</strong>: каждый оператор заканчивается точкой с запятой, каждый IF имеет END IF, каждый цикл — END LOOP.</p>
<div data-note="warn"><p>Частая ошибка: переносить привычки T-SQL в PL/SQL. Здесь нет <code>@переменных</code>, <code>PRINT</code>, <code>IF EXISTS</code> и <code>DECLARE @x = (SELECT …)</code>. Считайте PL/SQL отдельным языком.</p></div>

<h2>Инструменты</h2>
<ul>
  <li><strong>SQL*Plus</strong> — самый старый клиент, командная строка, работает везде; имеет свои команды (VARIABLE, ACCEPT, PRINT…).</li>
  <li><strong>SQL Developer</strong> — графический инструмент Oracle (аналог SSMS), основной на занятиях; понимает часть команд SQL*Plus.</li>
  <li><strong>DBeaver, DataGrip</strong> — универсальные; команды SQL*Plus (например, <code>&amp;переменные</code>) там не работают.</li>
</ul>
<p>Важные команды SQL*Plus в SQL Developer: <code>SET SERVEROUTPUT ON</code> (показывать сообщения!), <code>SET AUTOCOMMIT ON|OFF</code>, <code>SET VERIFY OFF</code>, <code>EXEC процедура(…)</code>, <code>VARIABLE</code>, <code>ACCEPT … PROMPT</code>.</p>
<div data-code="pl-output"></div>
<div data-note="tip"><p>Ничего не выводится? Самая частая причина: в этой сессии не выполнен <code>SET SERVEROUTPUT ON</code>.</p></div>
<p>Символ <code>/</code> на отдельной строке после блока означает «выполнить блок» в SQL*Plus / SQL Developer (похоже на GO в MS SQL).</p>

<h2>Анонимный блок</h2>
<p>В PL/SQL у блока <strong>формальная структура</strong>. Вне блока можно выполнять только обычные команды SQL — переменные и управляющие операторы должны быть внутри блока.</p>
<p class="formula">DECLARE      -- необязательно: переменные, константы, курсоры, исключения
BEGIN        -- обязательно: операторы SQL и PL/SQL
EXCEPTION    -- необязательно: обработка ошибок
END;</p>
<p>Блоки можно вкладывать — внутренний блок для внешнего является одним оператором. Внутри блока разрешены SELECT (с INTO), INSERT, UPDATE, DELETE, COMMIT, ROLLBACK.</p>
<div data-code="pl-block"></div>

<h2>Имена в Oracle</h2>
<ul>
  <li>начинаются с латинской буквы; далее буквы, цифры, <code>$</code>, <code>#</code>, <code>_</code>;</li>
  <li>не более <strong>30 символов</strong>; не могут быть ключевым словом;</li>
  <li>регистр не важен (Oracle хранит всё ПРОПИСНЫМИ), если только имя не в <code>"кавычках"</code>.</li>
</ul>

<h2>Переменные</h2>
<p class="formula">имя [CONSTANT] тип [NOT NULL] [:= | DEFAULT значение];</p>
<ul>
  <li>Объявляются в разделе DECLARE, <strong>каждая отдельно</strong>, с точкой с запятой. Имена <strong>без @</strong> (обычно с префиксом <code>v_</code>).</li>
  <li>Типы: все типы SQL Oracle + например <code>BOOLEAN</code> и <code>BINARY_INTEGER</code>/<code>PLS_INTEGER</code> (быстрые целые).</li>
  <li>Присваивание: оператор <code>:=</code> или <code>SELECT … INTO переменные FROM …</code>.</li>
  <li>Константа (CONSTANT) и переменная NOT NULL должны получить значение при объявлении.</li>
  <li>Неинициализированная переменная = NULL.</li>
</ul>
<div data-code="pl-vars"></div>
<div data-note="exam"><p><code>SELECT … INTO</code> должен вернуть <strong>ровно одну строку</strong>. Ноль строк → исключение <code>NO_DATA_FOUND</code>, больше → <code>TOO_MANY_ROWS</code>. Поэтому существование проверяют через <code>SELECT COUNT(*) INTO v_count …</code> (COUNT всегда даёт одну строку), а не «прочитать и проверить на NULL», как в T-SQL.</p></div>
<div data-code="pl-no-tsql"></div>
<div data-code="pl-null-var"></div>
<p>Для однострочных запросов без таблицы в Oracle есть вспомогательные таблицы: <code>DUAL</code> (возвращает 'X') и <code>DUMMY</code> (возвращает 0).</p>

<h3>%TYPE, %ROWTYPE и RECORD</h3>
<p>Тип переменной можно «скопировать»: <code>переменная%TYPE</code> (как у другой переменной), <code>таблица.столбец%TYPE</code> (как у столбца), <code>таблица%ROWTYPE</code> (целая строка — поля читаются как <code>переменная.столбец</code>). Когда меняется исходный тип, меняется и тип переменной. Можно также определить свой тип записи <code>TYPE … IS RECORD (…)</code>.</p>
<div data-code="pl-type"></div>
<div data-code="pl-record"></div>
<div data-note="warn"><p>Переменную-строку (%ROWTYPE) нельзя использовать напрямую после <code>VALUES</code> в INSERT.</p></div>

<h3>Область видимости переменных</h3>
<p>Переменная внешнего блока видна во вложенных блоках. Переменная внутреннего блока <strong>не</strong> видна ни снаружи, ни в «соседних» блоках. То же имя во внутреннем блоке — это <strong>другая переменная</strong>.</p>
<div data-code="pl-scope"></div>

<h3>Переменные подстановки и связывания</h3>
<p>Из SQL*Plus пришли: <strong>переменные подстановки</strong> <code>&amp;имя</code> (значение вводится с клавиатуры, только в правой части присваивания) и <strong>переменные связывания</strong> <code>:имя</code> (объявляются через VARIABLE, живут вне блока, выводятся через PRINT). Работают в SQL Developer, но не в DBeaver/DataGrip.</p>
<div data-code="pl-bind"></div>

<h3>Системные переменные</h3>
<p><code>SQL%ROWCOUNT</code> (сколько строк обработал последний оператор), <code>SQL%FOUND</code>, <code>SQL%NOTFOUND</code>, а в разделе EXCEPTION: <code>SQLCODE</code> (номер ошибки) и <code>SQLERRM</code> (сообщение).</p>
<div data-code="pl-sqlattr"></div>

<h2>IF … THEN … ELSIF … ELSE … END IF</h2>
<ul>
  <li>Операторы после <code>THEN</code> — когда условие TRUE; после <code>ELSE</code> — когда FALSE <strong>или NULL</strong>.</li>
  <li><code>ELSIF</code> (пишется без «E»!) проверяет следующие условия.</li>
  <li>Всё заканчивается <code>END IF;</code>.</li>
</ul>
<div data-code="pl-if"></div>

<h2>Циклы</h2>
<p>В PL/SQL это, по сути, один оператор <code>LOOP … END LOOP</code> в трёх вариантах:</p>
<ul>
  <li><strong>LOOP</strong> — без условия; выход через <code>EXIT</code>, <code>EXIT WHEN условие</code> или ошибку;</li>
  <li><strong>FOR i IN a..b LOOP</strong> — счётчик от a до b с шагом 1 (объявляется автоматически); <code>REVERSE</code> — от b к a; если a &gt; b, цикл не выполняется ни разу;</li>
  <li><strong>WHILE условие LOOP</strong> — пока условие TRUE.</li>
</ul>
<div data-code="pl-loops"></div>
`,
  cheat: `
<ul>
  <li>Блок: <code>DECLARE … BEGIN … EXCEPTION … END;</code> + <code>/</code>. Всегда <code>SET SERVEROUTPUT ON</code>.</li>
  <li>Вывод: <code>DBMS_OUTPUT.PUT_LINE('текст' || v_x);</code> — конкатенация <code>||</code>.</li>
  <li>Переменные без @: <code>v_x INTEGER := 0;</code> · <code>c CONSTANT NUMBER := 10;</code> · <code>v NUMBER NOT NULL := 1;</code></li>
  <li>Присваивание: <code>:=</code> или <code>SELECT col INTO v_x FROM …</code> (ровно 1 строка!).</li>
  <li>0 строк → <code>NO_DATA_FOUND</code>; &gt;1 → <code>TOO_MANY_ROWS</code>. Существование: <code>SELECT COUNT(*) INTO v_count …</code>.</li>
  <li>НЕЛЬЗЯ: <code>IF EXISTS</code>, <code>:= (SELECT …)</code>, <code>IF x = (SELECT …)</code>.</li>
  <li><code>emp.sal%TYPE</code>, <code>emp%ROWTYPE</code>, <code>TYPE t IS RECORD (…)</code>.</li>
  <li>Видимость: внешнее видно внутри, но не наоборот.</li>
  <li><code>&amp;x</code> — с клавиатуры; <code>:x</code> — переменная связывания (SQL Developer).</li>
  <li><code>SQL%ROWCOUNT</code>, <code>SQL%FOUND</code>, <code>SQL%NOTFOUND</code>, <code>SQLCODE</code>, <code>SQLERRM</code>.</li>
  <li><code>IF … THEN … ELSIF … THEN … ELSE … END IF;</code></li>
  <li><code>LOOP … EXIT WHEN …; END LOOP;</code> · <code>FOR i IN 1..n LOOP … END LOOP;</code> · <code>WHILE … LOOP … END LOOP;</code></li>
  <li>Имена ≤ 30 символов; в <code>"…"</code> регистр важен.</li>
</ul>
`
},

'plsql-cursors': {
  title: 'PL/SQL: курсоры и обработка исключений',
  lead: 'Явные курсоры, %NOTFOUND и другие атрибуты, курсорный цикл FOR, параметры, FOR UPDATE, встроенные и свои исключения, RAISE_APPLICATION_ERROR.',
  body: `
<h2>Курсоры в PL/SQL</h2>
<p>Идея та же, что в T-SQL (см. тему о курсорах T-SQL), — отличается только синтаксис. В PL/SQL курсоры используются <strong>чаще</strong>, потому что процедура PL/SQL не может просто вернуть результат SELECT как «набор строк».</p>
<table>
  <thead><tr><th>Шаг</th><th>PL/SQL</th><th>T-SQL (для сравнения)</th></tr></thead>
  <tbody>
    <tr><td>Объявление</td><td><code>CURSOR k IS SELECT …;</code> (в DECLARE)</td><td><code>DECLARE k CURSOR FOR SELECT …</code></td></tr>
    <tr><td>Открытие</td><td><code>OPEN k;</code></td><td><code>OPEN k</code></td></tr>
    <tr><td>Чтение</td><td><code>FETCH k INTO v1, v2;</code></td><td><code>FETCH NEXT FROM k INTO @v1, @v2</code></td></tr>
    <tr><td>Конец данных</td><td><code>EXIT WHEN k%NOTFOUND;</code></td><td><code>WHILE @@FETCH_STATUS = 0</code></td></tr>
    <tr><td>Закрытие</td><td><code>CLOSE k;</code></td><td><code>CLOSE k; DEALLOCATE k;</code></td></tr>
  </tbody>
</table>
<h3>Атрибуты курсора</h3>
<ul>
  <li><code>k%FOUND</code> — TRUE, если последний FETCH получил строку;</li>
  <li><code>k%NOTFOUND</code> — TRUE, если не получил (конец данных);</li>
  <li><code>k%ROWCOUNT</code> — сколько строк уже прочитано;</li>
  <li><code>k%ISOPEN</code> — открыт ли курсор.</li>
</ul>
<div data-code="pl-cur-basic"></div>
<div data-note="exam"><p>В PL/SQL достаточно <strong>одного</strong> FETCH в <code>LOOP</code>, сразу после него <code>EXIT WHEN k%NOTFOUND;</code>. В T-SQL FETCH встречается дважды (перед циклом и в его конце).</p></div>
<p>Если в списке SELECT курсора есть выражения (например, <code>SUM(sal)</code>), им нужны <strong>псевдонимы</strong>. Строку удобно читать в запись <code>k%ROWTYPE</code>.</p>
<div data-code="pl-cur-alias"></div>

<h2>Курсорный цикл FOR</h2>
<p>Самый удобный способ: <code>FOR запись IN курсор LOOP … END LOOP;</code>. OPEN, FETCH, проверка конца и CLOSE происходят <strong>автоматически</strong>, а переменную-запись не нужно объявлять. SELECT можно даже записать прямо в скобках.</p>
<div data-code="pl-cur-for"></div>

<h2>Курсор с параметрами</h2>
<p>SELECT курсора может использовать параметры; один и тот же курсор открывают много раз с разными значениями.</p>
<div data-code="pl-cur-param"></div>

<h2>Изменение данных через курсор</h2>
<p><code>FOR UPDATE [OF столбец]</code> в объявлении блокирует строки для изменения, а <code>WHERE CURRENT OF курсор</code> в UPDATE/DELETE указывает на строку, только что прочитанную курсором.</p>
<div data-code="pl-cur-update"></div>

<h2>Обработка исключений</h2>
<p>Ошибка в исполняемом разделе (BEGIN…END) обрабатывается в разделе <code>EXCEPTION</code> <strong>того же блока</strong>. Если обработчика там нет — ошибка «уходит» во внешний блок и в конце концов в приложение. Ошибки в разделах DECLARE и EXCEPTION сразу идут во внешний блок.</p>
<p class="formula">EXCEPTION
    WHEN имя_исключения_1 THEN операторы;
    WHEN имя_исключения_2 THEN операторы;
    WHEN OTHERS THEN операторы;   -- всё остальное</p>
<h3>Встроенные исключения</h3>
<table>
  <thead><tr><th>Исключение</th><th>Когда</th></tr></thead>
  <tbody>
    <tr><td><code>NO_DATA_FOUND</code></td><td>SELECT … INTO не вернул ни одной строки</td></tr>
    <tr><td><code>TOO_MANY_ROWS</code></td><td>SELECT … INTO вернул больше одной строки</td></tr>
    <tr><td><code>DUP_VAL_ON_INDEX</code></td><td>повтор значения в столбце UNIQUE / PK</td></tr>
    <tr><td><code>ZERO_DIVIDE</code></td><td>деление на ноль</td></tr>
    <tr><td><code>INVALID_NUMBER</code></td><td>не удалось преобразовать в число</td></tr>
    <tr><td><code>INVALID_CURSOR</code>, <code>CURSOR_ALREADY_OPEN</code></td><td>неверная операция с курсором</td></tr>
    <tr><td><code>TIMEOUT_ON_RESOURCE</code></td><td>слишком долгое ожидание ресурса</td></tr>
  </tbody>
</table>
<div data-code="pl-exc-named"></div>
<div data-note="tip"><p>Хорошая практика: каждая ошибка должна быть обработана — в крайнем случае в <code>WHEN OTHERS</code> самого внешнего блока. Чтобы знать, какой оператор упал, используйте вложенные блоки со своими обработчиками или счётчик шагов.</p></div>

<h3>Свои исключения</h3>
<p>Объявляем <code>имя EXCEPTION;</code> в DECLARE, выбрасываем через <code>RAISE имя;</code>, обрабатываем <code>WHEN имя THEN …</code>.</p>
<div data-code="pl-exc-own"></div>

<h3>RAISE_APPLICATION_ERROR</h3>
<p><code>RAISE_APPLICATION_ERROR(номер, 'сообщение')</code> выбрасывает ошибку со своим номером в диапазоне <strong>−20000 … −20999</strong> и сообщением. Её можно обработать в том же блоке или оставить приложению. Это основной инструмент в процедурах и триггерах («так делать нельзя…»).</p>
<div data-code="pl-raise-app"></div>
`,
  cheat: `
<ul>
  <li><code>CURSOR k IS SELECT …;</code> → <code>OPEN k;</code> → <code>LOOP FETCH k INTO …; EXIT WHEN k%NOTFOUND; … END LOOP;</code> → <code>CLOSE k;</code></li>
  <li>Атрибуты: <code>%FOUND</code>, <code>%NOTFOUND</code>, <code>%ROWCOUNT</code>, <code>%ISOPEN</code>.</li>
  <li>Выражения в SELECT курсора → псевдонимы. Запись: <code>r k%ROWTYPE;</code></li>
  <li><code>FOR r IN k LOOP … r.столбец … END LOOP;</code> — всё автоматически. Или <code>FOR r IN (SELECT …) LOOP</code>.</li>
  <li>Параметры: <code>CURSOR k (p INTEGER) IS SELECT … WHERE x = p;</code> → <code>OPEN k(10);</code></li>
  <li><code>… FOR UPDATE OF sal;</code> + <code>UPDATE … WHERE CURRENT OF k;</code></li>
  <li><code>EXCEPTION WHEN NO_DATA_FOUND THEN … WHEN TOO_MANY_ROWS THEN … WHEN OTHERS THEN … SQLCODE, SQLERRM</code></li>
  <li>Другие: <code>DUP_VAL_ON_INDEX</code>, <code>ZERO_DIVIDE</code>, <code>INVALID_NUMBER</code>, <code>CURSOR_ALREADY_OPEN</code>.</li>
  <li>Свои: <code>e EXCEPTION;</code> → <code>RAISE e;</code> → <code>WHEN e THEN</code>.</li>
  <li><code>RAISE_APPLICATION_ERROR(-20001, 'текст');</code> — номера −20000…−20999.</li>
  <li>Необработанная ошибка уходит во внешний блок / приложение.</li>
</ul>
`
},

'plsql-procedures': {
  title: 'PL/SQL: процедуры, функции и пакеты',
  lead: 'Программные объекты Oracle: CREATE OR REPLACE, параметры IN/OUT/IN OUT, значения по умолчанию, функции в SQL, перегрузка и пакеты.',
  body: `
<h2>Процедуры и функции как объекты базы</h2>
<p>Процедуры и функции хранятся в базе как объекты; ими может пользоваться любой процесс с нужными правами. Их можно определить и внутри блока (тогда они работают только там) или сгруппировать в <strong>пакеты</strong>. Идея та же, что в T-SQL, но синтаксис и ограничения другие.</p>

<h2>Синтаксис процедуры</h2>
<p class="formula">CREATE [OR REPLACE] PROCEDURE имя (параметры)
{IS | AS}
    объявления переменных     -- БЕЗ слова DECLARE!
BEGIN
    операторы
[EXCEPTION …]
END;</p>
<ul>
  <li><code>OR REPLACE</code> — если процедура существует, она заменяется без ошибки (в T-SQL нужен ALTER). Очень удобно при исправлении кода.</li>
  <li><code>IS</code> и <code>AS</code> — взаимозаменяемы.</li>
  <li>Параметр: <code>имя [IN | OUT | IN OUT] тип [DEFAULT значение]</code>. <strong>Тип без размера</strong>: <code>NUMBER</code>, <code>VARCHAR2</code> или <code>emp.sal%TYPE</code>.</li>
</ul>
<div data-code="pl-proc-basic"></div>

<h2>Режимы параметров</h2>
<table>
  <thead><tr><th>Режим</th><th>Направление</th><th>Примечания</th></tr></thead>
  <tbody>
    <tr><td><code>IN</code> (по умолчанию)</td><td>в процедуру</td><td>только чтение — не может стоять слева от <code>:=</code></td></tr>
    <tr><td><code>OUT</code></td><td>из процедуры</td><td>значение выходит после успешного завершения</td></tr>
    <tr><td><code>IN OUT</code></td><td>в обе стороны</td><td>передаёте значение и получаете его изменённым</td></tr>
  </tbody>
</table>
<div data-code="pl-proc-out"></div>

<h2>Значения по умолчанию и именованная запись</h2>
<p>Параметры с <code>DEFAULT</code> ставятся в конце списка; при вызове их можно опустить. Если нужно задать только некоторые — используйте запись <code>параметр =&gt; значение</code>.</p>
<div data-code="pl-proc-default"></div>

<h2>Функции</h2>
<p class="formula">CREATE [OR REPLACE] FUNCTION имя (параметры)
RETURN тип {IS | AS}
    объявления
BEGIN
    …
    RETURN выражение;
END;</p>
<p>Разница: процедура <em>может</em> возвращать значения через параметры OUT, а функция <strong>всегда</strong> возвращает одно значение через <code>RETURN</code> — под своим именем. Функции можно использовать в SQL (<code>SELECT f(30) FROM dual</code>) и в PL/SQL (<code>v := f(30);</code>).</p>
<div data-code="pl-func"></div>
<div data-note="exam"><p>Функция, используемая <strong>в операторе SQL</strong>, не может: выполнять DML или DDL (менять базу), иметь параметры OUT, использовать нелокальные переменные пакета; все параметры должны быть заданы, и запись <code>=&gt;</code> запрещена.</p></div>

<h2>Перегрузка</h2>
<p>В одном блоке или пакете может быть несколько процедур/функций с одним именем, если они различаются числом или типами параметров («подтипов» вроде CHAR и VARCHAR2 недостаточно). Отдельно стоящие процедуры перегружать нельзя.</p>
<div data-code="pl-overload"></div>

<h2>Пакеты</h2>
<p><strong>Пакет</strong> группирует связанные курсоры, переменные, константы, исключения, процедуры и функции. У него две части:</p>
<ul>
  <li><strong>спецификация</strong> (<code>CREATE PACKAGE</code>) — публичная часть: интерфейс, заголовки процедур;</li>
  <li><strong>тело</strong> (<code>CREATE PACKAGE BODY</code>) — реализация + приватные элементы + необязательный блок инициализации (выполняется один раз, при первом обращении в сессии).</li>
</ul>
<p>Переменные пакета живут до конца сессии. К элементам обращаются через точку: <code>пакет.процедура(…)</code>, <code>пакет.переменная</code>.</p>
<div data-code="pl-package"></div>
<div data-note="own"><p>Типичный шаблон заданий с занятий («вставь, если не существует; новый номер как MAX+1; выдай ошибку, если нет отдела»): <code>SELECT COUNT(*) INTO v_count … ;</code> → <code>IF v_count = 0 THEN RAISE_APPLICATION_ERROR(…)</code> → <code>SELECT NVL(MAX(id), 0) + 1 INTO v_id …</code> → <code>INSERT …</code> → <code>DBMS_OUTPUT.PUT_LINE(…)</code>.</p></div>
`,
  cheat: `
<ul>
  <li><code>CREATE OR REPLACE PROCEDURE p (a NUMBER, b IN VARCHAR2, w OUT NUMBER) IS v_x NUMBER; BEGIN … END; /</code></li>
  <li>Объявления после IS/AS <strong>без DECLARE</strong>. Типы параметров <strong>без размера</strong>.</li>
  <li>IN (по умолчанию, только чтение) · OUT (результат) · IN OUT (в обе стороны).</li>
  <li>Вызов: <code>CALL p(1, 'x');</code> · <code>EXEC p(1, 'x');</code> · <code>BEGIN p(1, 'x', v_w); END;</code></li>
  <li><code>DEFAULT</code> в конце списка; <code>p(b =&gt; 'MANAGER')</code>.</li>
  <li><code>CREATE OR REPLACE FUNCTION f (x NUMBER) RETURN NUMBER IS … BEGIN … RETURN v; END;</code></li>
  <li>Функция в SQL: <code>SELECT f(30) FROM dual;</code> — без DML/DDL, без OUT, без <code>=&gt;</code>.</li>
  <li>Перегрузка: только в блоке/пакете, разное число/типы параметров.</li>
  <li>Пакет: <code>CREATE PACKAGE pk AS … END pk;</code> + <code>CREATE PACKAGE BODY pk AS … [BEGIN init] END pk;</code>; вызов <code>pk.proc()</code>.</li>
</ul>
`
},

'plsql-triggers': {
  title: 'PL/SQL: триггеры',
  lead: 'BEFORE/AFTER, уровень оператора и строки (FOR EACH ROW), :OLD/:NEW, INSERTING/UPDATING/DELETING, мутирующая таблица, INSTEAD OF и системные триггеры.',
  body: `
<h2>Триггеры в Oracle</h2>
<p>Триггер PL/SQL — процедура, привязанная к <strong>таблице, представлению, схеме или всей базе</strong> и запускаемая автоматически событием: INSERT/UPDATE/DELETE или системным событием. Роль та же, что в T-SQL, но <strong>философия другая</strong> — прежде всего, в Oracle есть строковые триггеры и выбор BEFORE/AFTER.</p>

<h2>Синтаксис</h2>
<p class="formula">CREATE [OR REPLACE] TRIGGER имя
{BEFORE | AFTER} {INSERT | UPDATE [OF столбцы] | DELETE} [OR …]
ON таблица
[FOR EACH ROW]
блок PL/SQL</p>
<p>При определении вы решаете три вещи:</p>
<ol class="steps">
  <li><strong>какие операции</strong> его запускают (соединяются через <code>OR</code>; для UPDATE можно перечислить столбцы: <code>UPDATE OF sal</code>);</li>
  <li><strong>когда</strong>: <code>BEFORE</code> (до оператора) или <code>AFTER</code> (после);</li>
  <li><strong>сколько раз</strong>: один раз на весь оператор (по умолчанию) или <strong>для каждой строки</strong> (<code>FOR EACH ROW</code>).</li>
</ol>

<h2>Два вида триггеров</h2>
<table>
  <thead><tr><th></th><th>Уровень оператора</th><th>Уровень строки (<code>FOR EACH ROW</code>)</th></tr></thead>
  <tbody>
    <tr><td>Сколько раз</td><td>один раз на оператор</td><td>один раз для каждой изменённой строки</td></tr>
    <tr><td>Доступ к значениям</td><td>нет :OLD/:NEW</td><td><code>:OLD.столбец</code> (до), <code>:NEW.столбец</code> (после)</td></tr>
    <tr><td>Чтение таблицы триггера</td><td>разрешено</td><td><strong>запрещено</strong> (mutating table)</td></tr>
  </tbody>
</table>
<div data-code="pl-trg-statement"></div>
<div data-code="pl-trg-row"></div>
<div data-note="tip"><p>В триггере <code>BEFORE … FOR EACH ROW</code> можно <strong>изменить</strong> записываемое значение, присвоив его <code>:NEW.столбец</code> (например, подставить дату, поправить зарплату). При INSERT <code>:OLD</code> пуст (NULL), при DELETE — <code>:NEW</code>.</p></div>

<h2>Какая операция запустила триггер</h2>
<p>Предикаты <code>INSERTING</code>, <code>UPDATING</code>, <code>DELETING</code> используются в IF — удобно, когда триггер реагирует на несколько операций. Чтобы запретить операцию, выбрасываем <code>RAISE_APPLICATION_ERROR</code> (весь оператор откатывается).</p>
<div data-code="pl-trg-predicates"></div>

<h2>Ограничения</h2>
<div data-note="exam"><ul>
  <li>Триггеры <strong>не могут</strong> использовать <code>COMMIT</code> и <code>ROLLBACK</code> (запрещаем через RAISE_APPLICATION_ERROR).</li>
  <li>Строковый триггер <strong>не может читать или менять таблицу, на которой работает</strong> (кроме <code>:OLD</code>/<code>:NEW</code>) — а также таблицы, связанные с ней внешними ключами. Исключение: INSERT … VALUES одной строки.</li>
</ul></div>
<p>Нарушение второго правила даёт знаменитую <strong>ORA-04091: table … is mutating</strong>. Триггер компилируется, но при первом же UPDATE всё откатывается:</p>
<div data-code="pl-trg-mutating"></div>
<div data-note="own"><p>Как избежать мутирующей таблицы? Проще всего: перенести логику в триггер <strong>уровня оператора</strong> (там читать таблицу можно) или в процедуру. Продвинутое решение — составной триггер (COMPOUND TRIGGER), это за рамками лекции.</p></div>

<h2>Несколько триггеров на одной таблице</h2>
<p>Их может быть много, но порядок внутри одного типа вы не контролируете — не пишите триггеры, зависящие от порядка. Общий порядок:</p>
<ol>
  <li>BEFORE оператора;</li>
  <li>BEFORE строки → AFTER строки (для каждой строки по очереди);</li>
  <li>AFTER оператора.</li>
</ol>
<p>Отключение и удаление: <code>ALTER TRIGGER имя DISABLE | ENABLE;</code>, <code>DROP TRIGGER имя;</code>. Сломанный триггер (например, мутирующий) может блокировать остальные — отключите или удалите его.</p>

<h2>INSTEAD OF</h2>
<p>Позволяет выполнять DML через представления, построенные на нескольких таблицах: блок PL/SQL делает отдельные операции с каждой таблицей, а пользователь видит только представление. В Oracle — <strong>только на представлениях</strong> (в MS SQL и на таблицах).</p>
<div data-code="pl-trg-instead"></div>

<h2>Системные триггеры</h2>
<p>Oracle умеет реагировать на события <strong>базы</strong> (SERVERERROR, LOGON, LOGOFF, STARTUP, SHUTDOWN) и события <strong>DDL/DCL</strong> (CREATE, ALTER, DROP, GRANT, REVOKE) — для схемы (<code>ON SCHEMA</code>) или всей базы (<code>ON DATABASE</code>).</p>
<div data-code="pl-trg-system"></div>
<div data-note="own"><p><strong>T-SQL и PL/SQL — главные различия триггеров:</strong></p>
<table>
  <thead><tr><th></th><th>T-SQL</th><th>PL/SQL</th></tr></thead>
  <tbody>
    <tr><td>Момент</td><td>AFTER (FOR) или INSTEAD OF</td><td>BEFORE, AFTER, INSTEAD OF</td></tr>
    <tr><td>Строки</td><td>всегда один раз на оператор</td><td>один раз на оператор или FOR EACH ROW</td></tr>
    <tr><td>Старые/новые данные</td><td>таблицы <code>deleted</code>/<code>inserted</code></td><td><code>:OLD</code>/<code>:NEW</code> (только уровень строки)</td></tr>
    <tr><td>Запрет операции</td><td><code>ROLLBACK</code> (+ RAISERROR)</td><td><code>RAISE_APPLICATION_ERROR</code> (COMMIT/ROLLBACK запрещены)</td></tr>
    <tr><td>Определение операции</td><td>пусты ли inserted/deleted</td><td><code>INSERTING/UPDATING/DELETING</code></td></tr>
  </tbody>
</table></div>
`,
  cheat: `
<ul>
  <li><code>CREATE OR REPLACE TRIGGER t BEFORE|AFTER INSERT OR UPDATE [OF col] OR DELETE ON tab [FOR EACH ROW] DECLARE … BEGIN … END; /</code></li>
  <li>Без FOR EACH ROW — один раз на оператор, нет :OLD/:NEW, читать таблицу можно.</li>
  <li>FOR EACH ROW — для каждой строки; <code>:OLD.col</code>, <code>:NEW.col</code>; в BEFORE можно <code>:NEW.col := …</code>.</li>
  <li><code>IF INSERTING / UPDATING / DELETING THEN …</code></li>
  <li>Запрет: <code>RAISE_APPLICATION_ERROR(-20001, '…');</code>. <strong>Без COMMIT/ROLLBACK</strong>.</li>
  <li>Строковый триггер не читает свою таблицу → <strong>ORA-04091 mutating</strong>.</li>
  <li>Порядок: BEFORE оператора → (BEFORE строки → AFTER строки)× → AFTER оператора.</li>
  <li><code>ALTER TRIGGER t DISABLE|ENABLE;</code> · <code>DROP TRIGGER t;</code></li>
  <li><code>INSTEAD OF</code> — только представления (в Oracle).</li>
  <li>Системные: <code>… ON SCHEMA | ON DATABASE</code> (LOGON, DROP, CREATE…).</li>
</ul>
`
},

'plsql-advanced': {
  title: 'PL/SQL для продвинутых',
  lead: 'Имена в кавычках, IDENTITY в трёх вариантах, последовательности, временные таблицы GTT/PTT, аналитические функции, MERGE и EXECUTE IMMEDIATE.',
  body: `
<div data-note="lecture"><p>Эти возможности расширяют арсенал, но для базовых операций не нужны. Рекурсивные CTE, CASE и коррелированный UPDATE работают в Oracle практически так же, как в MS SQL, — см. «T-SQL для продвинутых».</p></div>

<h2>Имена в Oracle</h2>
<p>Oracle хранит имена <strong>ПРОПИСНЫМИ</strong>, если не использовать кавычки — тогда имя хранится в точности как написано, и обращаться к нему нужно точно так же. Максимум 30 символов (в том числе имена ограничений, сгенерированные CASE-инструментами!).</p>
<div data-code="pl-names"></div>

<h2>Автонумерация</h2>
<h3>IDENTITY (с Oracle 12c)</h3>
<table>
  <thead><tr><th>Вариант</th><th>Поведение</th></tr></thead>
  <tbody>
    <tr><td><code>GENERATED ALWAYS AS IDENTITY</code></td><td>всегда номер сервера; своё значение = ошибка ORA-32795 (как в MS SQL)</td></tr>
    <tr><td><code>GENERATED BY DEFAULT AS IDENTITY</code></td><td>номер сервера, если не задать свой — генератор его не проверяет, поэтому легко получить дубликаты</td></tr>
    <tr><td><code>GENERATED BY DEFAULT ON NULL AS IDENTITY</code></td><td>номер сервера, когда столбец пропущен <strong>или</strong> передан NULL</td></tr>
  </tbody>
</table>
<div data-code="pl-identity"></div>
<p>Ограничения: один столбец IDENTITY на таблицу, числовой тип, без DEFAULT; таблица, созданная через <code>CREATE TABLE … AS SELECT</code>, не наследует IDENTITY; аналога <code>SCOPE_IDENTITY()</code> в Oracle нет.</p>
<h3>Последовательности</h3>
<p>Более старый, но по-прежнему используемый способ. Плюс: одна последовательность может обслуживать несколько столбцов/таблиц; <code>CURRVAL</code> легко читает последнее значение.</p>
<div data-code="pl-seq"></div>

<h2>Временные таблицы</h2>
<table>
  <thead><tr><th></th><th>GLOBAL TEMPORARY (GTT)</th><th>PRIVATE TEMPORARY (PTT, с 18c)</th></tr></thead>
  <tbody>
    <tr><td>Определение</td><td><strong>постоянный объект</strong>, виден всем сессиям</td><td>временное, только в моей сессии, в памяти</td></tr>
    <tr><td>Данные</td><td>приватны для сессии</td><td>приватны для сессии</td></tr>
    <tr><td>Время жизни данных</td><td><code>ON COMMIT DELETE ROWS</code> (по умолчанию, до конца транзакции) / <code>PRESERVE ROWS</code> (до конца сессии)</td><td><code>ON COMMIT DROP DEFINITION</code> / <code>PRESERVE DEFINITION</code></td></tr>
    <tr><td>Имя</td><td>любое</td><td>должно начинаться с <code>ORA$PTT_</code></td></tr>
    <tr><td>Прочее</td><td>можно индексировать; не попадает в резервные копии; DDL только когда никто не использует</td><td>без индексов, без DEFAULT, недоступна из других баз</td></tr>
  </tbody>
</table>
<div data-code="pl-temp"></div>

<h2>Аналитические функции</h2>
<p><code>ROW_NUMBER</code>, <code>RANK</code>, <code>DENSE_RANK</code> с <code>OVER (PARTITION BY … ORDER BY …)</code> работают как в MS SQL. В Oracle есть ещё <code>RANK(значения) WITHIN GROUP (ORDER BY …)</code> как <strong>агрегат</strong> (какое место заняло бы данное значение) и <code>LISTAGG</code> — склейка значений группы в один текст (как STRING_AGG).</p>
<div data-code="pl-analytic"></div>

<h2>MERGE</h2>
<p>Идея как в T-SQL (синхронизировать целевую таблицу с источником), синтаксис немного другой: <code>MERGE INTO … USING … ON (…) WHEN MATCHED THEN UPDATE … [DELETE WHERE …] WHEN NOT MATCHED THEN INSERT … [WHERE …]</code>. В Oracle DELETE — часть ветки MATCHED: он удаляет только совпавшие строки.</p>
<div data-code="pl-merge"></div>
<div data-note="lecture"><p>На лекции показан «осциллятор»: DELETE удаляет строку «отдел NULL», но следующий MERGE вставляет её снова. Помогает дополнительное условие <code>WHERE s.deptno IS NOT NULL</code> в ветке INSERT.</p></div>

<h2>Функции — напоминание</h2>
<div data-code="pl-func-avg"></div>

<h2>Динамический SQL</h2>
<p>В блоке PL/SQL <strong>нельзя</strong> напрямую писать DDL. Решение — динамический SQL: старый пакет <code>DBMS_SQL</code> (сложный) или «родной» <code>EXECUTE IMMEDIATE текст [INTO переменные] [USING значения]</code>. В тексте используем переменные связывания <code>:1</code>, <code>:имя</code>, а значения передаём через <code>USING</code> — это защищает от SQL Injection.</p>
<div data-code="pl-dynamic"></div>
`,
  cheat: `
<ul>
  <li>Имена: ПРОПИСНЫЕ, ≤ 30 символов; <code>"abc"</code> ≠ <code>abc</code>.</li>
  <li>IDENTITY: <code>GENERATED ALWAYS | BY DEFAULT | BY DEFAULT ON NULL AS IDENTITY [START WITH … INCREMENT BY …]</code>.</li>
  <li>Последовательность: <code>CREATE SEQUENCE s START WITH 10 INCREMENT BY 10;</code> · <code>s.NEXTVAL</code>, <code>s.CURRVAL</code>.</li>
  <li>GTT: <code>CREATE GLOBAL TEMPORARY TABLE … ON COMMIT DELETE|PRESERVE ROWS;</code> — определение постоянное, данные сессии.</li>
  <li>PTT: <code>CREATE PRIVATE TEMPORARY TABLE ora$ptt_x … ON COMMIT DROP|PRESERVE DEFINITION;</code></li>
  <li><code>ROW_NUMBER/RANK/DENSE_RANK() OVER (PARTITION BY … ORDER BY …)</code>; <code>RANK(x) WITHIN GROUP (ORDER BY …)</code>.</li>
  <li><code>LISTAGG(col, ', ') WITHIN GROUP (ORDER BY col)</code>.</li>
  <li><code>MERGE INTO t USING s ON (…) WHEN MATCHED THEN UPDATE SET … DELETE WHERE … WHEN NOT MATCHED THEN INSERT … VALUES … WHERE …;</code></li>
  <li><code>EXECUTE IMMEDIATE 'SQL с :1' [INTO v] USING val;</code> — единственный способ выполнить DDL в блоке.</li>
</ul>
`
}

});
