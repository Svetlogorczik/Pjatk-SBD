/* EN – Module 3: T-SQL (MS SQL Server) */
SBD.addContent('en', {

'tsql-basics': {
  title: 'T-SQL: batches, variables, IF and WHILE',
  lead: 'The first procedural language: how to write “programs” in MS SQL Server — variables, assignments, conditionals and loops.',
  body: `
<h2>Why a procedural language</h2>
<p>Plain SQL has no variables, conditions or loops. <strong>Transact-SQL (T-SQL)</strong> is the SQL extension of MS SQL Server (created by Sybase, developed by Microsoft) that adds them. The code runs directly on the server and can be stored as database objects: <strong>stored procedures</strong> and <strong>triggers</strong>.</p>
<div data-note="analogy"><p>SQL is single commands (“give me the list”, “add a row”). T-SQL lets you write a “recipe” out of them: “count the employees; if fewer than 16 — hire a new one, otherwise print a message”.</p></div>

<h2>Batch (script) and GO</h2>
<ul>
  <li>An <strong>anonymous block</strong> — code written in the editor (SSMS) and run at once, but <em>not stored</em> in the database as an object. It can be kept in a .sql file.</li>
  <li>T-SQL syntax is very loose (optional semicolons, any line breaks). Still: put each statement on a new line, use semicolons, indent.</li>
  <li><code>GO</code> ends a batch. SSMS adds it implicitly; you need it explicitly when running several independent parts in one window (e.g. <code>CREATE PROCEDURE</code> must be the first statement in a batch). <strong>A variable lives until the next GO.</strong></li>
  <li>Case does not matter in keywords and names.</li>
</ul>

<h2>Printing results</h2>
<p><code>PRINT</code> writes text to the <em>Messages</em> tab, <code>SELECT</code> returns a result set on the <em>Results</em> tab. After each DML the server prints “(n rows affected)” — <code>SET NOCOUNT ON</code> turns it off.</p>
<div data-code="ts-print"></div>

<h2>Variables</h2>
<ul>
  <li>Every variable must be declared: <code>DECLARE @name TYPE</code>. The name <strong>always starts with @</strong>.</li>
  <li>Types — the same as for table columns (INT, VARCHAR(n), MONEY, DATE…).</li>
  <li>One DECLARE can declare several variables and give them values at once (also a SELECT result in parentheses).</li>
  <li>DECLARE can be anywhere in the code — as long as it is before the variable is used.</li>
  <li>An uninitialised variable is <strong>NULL</strong>.</li>
</ul>
<div data-code="ts-vars"></div>
<h3>System variables</h3>
<p>They start with <code>@@</code>, are not declared and are read-only: <code>@@VERSION</code>, <code>@@ROWCOUNT</code>, <code>@@ERROR</code>, <code>@@IDENTITY</code>, <code>@@FETCH_STATUS</code> and many more.</p>
<div data-code="ts-sysvars"></div>

<h2>Assignment: SET and SELECT</h2>
<ul>
  <li><code>SET @x = expression</code> — assigns <strong>one</strong> variable.</li>
  <li><code>SELECT @x = …, @y = …</code> — can assign <strong>several</strong> at once, also values from a table (<code>SELECT @x = column FROM … WHERE …</code>).</li>
</ul>
<div data-code="ts-assign"></div>
<div data-note="warn"><p>Two dangerous situations where the server <strong>raises no error</strong>:</p>
<ul>
  <li>SELECT returns <strong>many rows</strong> → the variable gets the value from the <strong>last</strong> one;</li>
  <li>SELECT returns <strong>zero rows</strong> → the variable <strong>keeps its old value</strong> (or NULL).</li>
</ul>
<p>In PL/SQL (Oracle) both are errors — one of the important differences.</p></div>
<div data-code="ts-pitfall"></div>
<div data-note="tip"><p>When concatenating text with a number always convert: <code>'There are ' + CAST(@n AS VARCHAR) + ' people'</code>. Without CAST you get a conversion error.</p></div>

<h2>IF … ELSE</h2>
<p class="formula">IF condition
    statement or BEGIN … END
[ELSE
    statement or BEGIN … END]</p>
<ul>
  <li>The IF branch runs when the condition is TRUE; ELSE — when FALSE <strong>or NULL</strong>.</li>
  <li>Anything allowed in WHERE works in the condition: AND/OR/NOT, LIKE, IN, BETWEEN — even a <strong>SELECT in parentheses</strong>.</li>
  <li>Several statements in a branch → <code>BEGIN … END</code> (good habit: always).</li>
  <li>There is no <code>ELSEIF</code> — we nest <code>ELSE IF …</code>.</li>
</ul>
<div data-code="ts-if"></div>
<div data-code="ts-elseif"></div>

<h2>IF EXISTS</h2>
<p><code>IF [NOT] EXISTS (SELECT …)</code> checks whether the query returns <strong>at least one row</strong>. It is very fast — the server stops at the first hit. This syntax (EXISTS outside SELECT) works only in T-SQL; Oracle doesn't have it.</p>
<div data-code="ts-ifexists"></div>
<div data-code="ts-ifexists-bad"></div>

<h2>The WHILE loop</h2>
<p>T-SQL has only one loop: <code>WHILE condition</code> — it runs while the condition is TRUE. Any kind of repetition can be done with it. Make sure the condition eventually stops being true, otherwise the program “loops forever”. In databases a loop most often goes together with a cursor (next topic).</p>
<div data-code="ts-while"></div>
`,
  cheat: `
<ul>
  <li>T-SQL = SQL + variables + IF + WHILE + procedures + triggers (MS SQL Server).</li>
  <li><code>GO</code> ends a batch; variables live until GO. <code>CREATE PROCEDURE</code> — first statement of a batch.</li>
  <li><code>PRINT 'text'</code> → Messages; <code>SELECT</code> → Results. <code>SET NOCOUNT ON</code>.</li>
  <li><code>DECLARE @x INT = 5, @s VARCHAR(20);</code> — name starts with <strong>@</strong>, default NULL.</li>
  <li><code>DECLARE @n INT = (SELECT COUNT(1) FROM Emp);</code></li>
  <li><code>SET @x = …</code> (1 variable) · <code>SELECT @x = col, @y = col2 FROM … WHERE …</code> (several).</li>
  <li>Pitfalls: many rows → last; zero rows → old value; <strong>no error</strong>!</li>
  <li>Concatenation: <code>'There are ' + CAST(@n AS VARCHAR)</code>.</li>
  <li><code>@@ROWCOUNT</code>, <code>@@ERROR</code>, <code>@@IDENTITY</code>, <code>@@FETCH_STATUS</code>.</li>
  <li><code>IF … BEGIN … END ELSE …</code>; no ELSEIF → <code>ELSE IF</code>. ELSE also catches NULL.</li>
  <li><code>IF [NOT] EXISTS (SELECT 1 FROM … WHERE …)</code> — T-SQL only.</li>
  <li><code>WHILE condition BEGIN … END</code>; <code>BREAK</code>, <code>CONTINUE</code>.</li>
</ul>
`
},

'tsql-cursors': {
  title: 'T-SQL: cursors',
  lead: 'How to go through SELECT results row by row: DECLARE, OPEN, FETCH, loop, CLOSE, DEALLOCATE.',
  body: `
<h2>Why a cursor</h2>
<p>The assignment <code>SELECT @x = …</code> works for one row. What if a query returns many rows and <strong>for each</strong> something different must be done (e.g. depending on the value change the salary and print a message)? Then we use a <strong>cursor</strong>.</p>
<p>A cursor stores the SELECT result in a buffer (in MS SQL — a temporary table in tempdb) and lets you fetch it <strong>row by row</strong> into variables. It can be used in a batch, a procedure and a trigger.</p>
<div data-note="analogy"><p>A cursor is a finger moving down a list printed by SELECT: you point at a row, copy its values into variables, do your thing — and move the finger down.</p></div>
<div data-note="warn"><p>Cursors are <strong>slow</strong>. If the task can be done with one SQL statement (e.g. UPDATE with WHERE or a correlated UPDATE), do it without a cursor.</p></div>

<h2>The six steps of a cursor</h2>
<ol class="steps">
  <li><code>DECLARE name CURSOR FOR SELECT …</code> — definition (nothing is read yet).</li>
  <li><code>OPEN name</code> — the SELECT runs, rows go into the buffer, data is locked for other transactions. The row count is in <code>@@CURSOR_ROWS</code>.</li>
  <li><code>FETCH NEXT FROM name INTO @v1, @v2</code> — fetch a row into variables (number and types must match the columns).</li>
  <li>Loop <code>WHILE @@FETCH_STATUS = 0</code> — 0 means “row fetched”, −1 — “end”.</li>
  <li><code>CLOSE name</code> — release locks and the buffer (the definition stays; you can OPEN again).</li>
  <li><code>DEALLOCATE name</code> — remove the cursor definition.</li>
</ol>
<div data-code="ts-cur-basic"></div>
<div data-note="exam"><p><strong>FETCH appears twice:</strong> once <em>before</em> the loop (to set <code>@@FETCH_STATUS</code> — otherwise the loop doesn't start at all) and once <em>at the end</em> of the loop body, just before END. No second FETCH = infinite loop.</p></div>
<p>Errors: FETCH or CLOSE on a closed cursor → <em>Cursor is not open</em>; OPEN on an open one → <em>The cursor is already open</em>.</p>

<h2>A cursor that changes data</h2>
<p>The cursor puts values into variables, but <code>UPDATE</code> “doesn't know” which row it is. That's why UPDATE <strong>must</strong> have <code>WHERE key = @key</code> (without it you change the whole table!) or <code>WHERE CURRENT OF cursor</code>.</p>
<div data-code="ts-cur-update"></div>
<div data-note="tip"><p>Limit rows already in the cursor's SELECT (<code>WHERE sal NOT BETWEEN 1000 AND 3000</code>) instead of reading everything and checking in the loop — less work for the server.</p></div>
<div data-code="ts-cur-setbased"></div>

<h2>Scrollable cursor (SCROLL)</h2>
<p>By default a cursor only moves forward (<code>FETCH NEXT</code>). A cursor declared as <code>SCROLL CURSOR</code> can jump: <code>FETCH PRIOR</code>, <code>FIRST</code>, <code>LAST</code>, <code>ABSOLUTE n</code>, <code>RELATIVE n</code>.</p>
<div data-code="ts-cur-scroll"></div>
`,
  cheat: `
<ol>
  <li><code>DECLARE k CURSOR FOR SELECT a, b FROM … WHERE …;</code></li>
  <li><code>DECLARE @a …, @b …;</code></li>
  <li><code>OPEN k;</code></li>
  <li><code>FETCH NEXT FROM k INTO @a, @b;</code> ← before the loop</li>
  <li><code>WHILE @@FETCH_STATUS = 0 BEGIN … FETCH NEXT FROM k INTO @a, @b; END;</code> ← FETCH at the end</li>
  <li><code>CLOSE k; DEALLOCATE k;</code></li>
</ol>
<ul>
  <li><code>@@FETCH_STATUS</code>: 0 = OK, −1 = end.</li>
  <li>UPDATE in a cursor: <code>WHERE id = @id</code> or <code>WHERE CURRENT OF k</code>.</li>
  <li>Filter in the cursor's SELECT. Cursor = slow → if possible, one UPDATE.</li>
  <li><code>SCROLL CURSOR</code>: FETCH NEXT / PRIOR / FIRST / LAST / ABSOLUTE n / RELATIVE n.</li>
</ul>
`
},

'tsql-procedures': {
  title: 'T-SQL: stored procedures and functions',
  lead: 'Code stored in the database: parameters, three ways to return results, good practices, and scalar and table-valued functions.',
  body: `
<h2>What a stored procedure is</h2>
<p>A <strong>stored procedure</strong> is T-SQL code saved in the database as an object with a unique name. We communicate with it through <strong>parameters</strong>. On the first execution the server compiles it and builds an optimal data access plan.</p>
<p>Advantages:</p>
<ul>
  <li><strong>order and control</strong> — operations on the database are in one place and always run the same way;</li>
  <li><strong>security</strong> — an application gets the right to run the procedure, not to run arbitrary commands on tables;</li>
  <li><strong>less network traffic</strong> — one call instead of many commands.</li>
</ul>
<p>In T-SQL a procedure may refer to tables that do not exist yet at compile time, and may run DDL.</p>

<h2>Syntax</h2>
<p class="formula">CREATE [OR ALTER] PROCEDURE name
    @param1 TYPE [= default] [OUTPUT],
    @param2 TYPE …
AS
BEGIN
    T-SQL statements
END;</p>
<ul>
  <li>Fixing an existing procedure: <code>ALTER PROCEDURE</code> (or <code>CREATE OR ALTER</code> since 2016).</li>
  <li>Parameters are declared like variables but <strong>without DECLARE</strong>. By default they are input (INPUT); <code>OUTPUT</code> — output.</li>
  <li>Running: <code>EXEC</code> / <code>EXECUTE name values</code>. Skipped parameters with a default can be replaced with the word <code>DEFAULT</code>, or parameters can be given by name.</li>
</ul>
<div data-code="ts-proc-basic"></div>

<h2>How a procedure returns results</h2>
<table>
  <thead><tr><th>Way</th><th>Returns</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><strong>Result set</strong></td><td>the result of the (last) SELECT</td><td>visible in SSMS Results; an application must receive it</td></tr>
    <tr><td><strong>OUTPUT parameter</strong></td><td>any values</td><td>the word OUTPUT in the declaration <strong>and</strong> in the call; a variable is needed to receive it</td></tr>
    <tr><td><strong>RETURN</strong></td><td>an INT only</td><td>ends the procedure immediately; received via <code>EXEC @v = proc</code></td></tr>
  </tbody>
</table>
<div data-code="ts-proc-output"></div>

<h2>Good practices (from the lecture)</h2>
<ul>
  <li>First statement after AS: <code>SET NOCOUNT ON</code>.</li>
  <li>Don't use functions in SELECT unless they operate on returned values (they are computed for every row).</li>
  <li>Don't write <code>SELECT *</code>.</li>
  <li>Limit the data read as early as possible.</li>
  <li>Use explicit transactions (<code>BEGIN TRANSACTION … COMMIT</code>) and keep them <strong>short</strong> (fewer locks and deadlocks).</li>
  <li>Handle errors in <code>TRY … CATCH</code>.</li>
  <li>Procedures can be nested — up to 32 levels.</li>
</ul>
<div data-note="warn"><p>A classic beginner's mistake: after editing a procedure you add <code>EXEC name</code> at its end and compile everything without <code>GO</code> before EXEC. The call becomes part of the procedure — it calls itself 32 times and the application hangs. Always separate the definition from the call with <code>GO</code>.</p></div>
<div data-code="ts-proc-template"></div>

<h2>User-defined functions</h2>
<p>Functions resemble procedures with RETURN, but <strong>can be used directly in SQL statements</strong> (in SELECT, WHERE…), without EXEC. They return a value of the type given after <code>RETURNS</code>.</p>
<ul>
  <li>When calling, the name must include the <strong>schema</strong> (<code>dbo.name</code>) and <strong>parentheses</strong>, even without parameters.</li>
  <li>Don't call a function in a SELECT returning many rows if it would give the same result in every row — compute it once into a variable.</li>
</ul>
<h3>Scalar function</h3>
<div data-code="ts-fn-scalar"></div>
<p>Thanks to the function we avoided a subquery and a CTE.</p>
<h3>Table-valued functions</h3>
<p><strong>Inline</strong>: <code>RETURNS TABLE AS RETURN (SELECT …)</code> — like a view with a parameter. <strong>Multi-statement</strong>: after RETURNS you declare a table variable with columns, fill it with any number of statements and end with <code>RETURN</code>.</p>
<div data-code="ts-fn-table"></div>
<h3>What a function cannot do</h3>
<ul>
  <li>modify the database (INSERT/UPDATE/DELETE on tables) — only on its own table variables;</li>
  <li>use <code>OUTPUT INTO</code>, TRY…CATCH, RAISERROR, @@ERROR;</li>
  <li>use dynamic SQL or temporary tables (table variables — yes).</li>
</ul>
`,
  cheat: `
<ul>
  <li><code>CREATE [OR ALTER] PROCEDURE p @a INT, @b VARCHAR(20) = 'x', @result INT OUTPUT AS BEGIN … END; GO</code></li>
  <li>Parameters without DECLARE; input by default.</li>
  <li>Call: <code>EXEC p 1, DEFAULT, @r OUTPUT;</code> or <code>EXEC p @a = 1;</code></li>
  <li>Returning: result set (SELECT) · <code>OUTPUT</code> (in declaration and call) · <code>RETURN int</code> (<code>EXEC @r = p</code>).</li>
  <li><code>RETURN;</code> = leave the procedure immediately.</li>
  <li>Practices: <code>SET NOCOUNT ON</code>, no <code>SELECT *</code>, short transactions, TRY…CATCH, max 32 nesting levels.</li>
  <li>Separate the definition from <code>EXEC</code> with <code>GO</code> (otherwise recursion!).</li>
  <li>Scalar function: <code>CREATE FUNCTION f (@x INT) RETURNS MONEY AS BEGIN … RETURN @v; END</code>; use <code>dbo.f(10)</code>.</li>
  <li>Table-valued: <code>RETURNS TABLE AS RETURN (SELECT …)</code>; multi-statement: <code>RETURNS @t TABLE (…) AS BEGIN … RETURN; END</code>.</li>
  <li>A function does not change the DB; no TRY/RAISERROR, no dynamic SQL, no # tables.</li>
</ul>
`
},

'tsql-triggers': {
  title: 'T-SQL: triggers and error handling',
  lead: 'Procedures run automatically by INSERT, UPDATE, DELETE: inserted/deleted tables, working with many rows, INSTEAD OF, RAISERROR, TRY…CATCH, THROW.',
  body: `
<h2>What a trigger is</h2>
<p>A <strong>trigger</strong> is a special procedure that <strong>you don't call yourself</strong> — the DBMS runs it when a given event happens (a DML or DDL operation, or a server event). We deal with DML triggers. They are used for:</p>
<ul>
  <li>programming integrity constraints that can't be declared;</li>
  <li>fixed actions that must always happen, for every application (e.g. updating summaries, a change log).</li>
</ul>
<div data-note="warn"><p>Triggers in MS SQL and Oracle follow a <strong>different philosophy</strong>, not only a different syntax. Don't copy solutions “1:1” between the environments.</p></div>

<h2>Syntax and when it runs</h2>
<p class="formula">CREATE [OR ALTER] TRIGGER name
ON table
FOR | AFTER  INSERT [, UPDATE] [, DELETE]
AS
    T-SQL statements</p>
<ul>
  <li>Each trigger belongs to <strong>one</strong> table or view; a table may have several triggers (their firing order is <strong>not defined</strong>!).</li>
  <li>A T-SQL trigger fires <strong>AFTER</strong> the DML statement, but <strong>in the same, uncommitted transaction</strong>. The table is already changed — but <code>ROLLBACK</code> in the trigger can undo it all.</li>
  <li>Triggers can nest (a trigger changes a table with another trigger…) up to 32 levels.</li>
</ul>
<div data-code="ts-trg-nodelete"></div>

<h2>The inserted and deleted tables</h2>
<p>In a trigger there are two virtual (read-only) tables with copies of the changed rows:</p>
<table>
  <thead><tr><th>Operation</th><th>inserted</th><th>deleted</th></tr></thead>
  <tbody>
    <tr><td>INSERT</td><td>new rows</td><td>empty</td></tr>
    <tr><td>DELETE</td><td>empty</td><td>deleted rows</td></tr>
    <tr><td>UPDATE</td><td>rows <strong>after</strong> the change</td><td>rows <strong>before</strong> the change</td></tr>
  </tbody>
</table>
<p>All other tables of the database (including the trigger's own table) can be read and changed in a trigger.</p>

<h2>The most important thing: a trigger runs once per STATEMENT</h2>
<div data-note="exam"><p>A T-SQL trigger fires <strong>once for the whole statement</strong>, not for each row. <code>UPDATE Emp SET sal = sal*1.1</code> changes 14 rows → the trigger fires once, and <code>inserted</code> and <code>deleted</code> have 14 rows each. Code like <code>SELECT @sal = sal FROM inserted</code> takes only one (the last) value!</p></div>
<div data-code="ts-trg-rows"></div>
<p>The <code>EXISTS</code> version works for any number of rows, but when the rule is broken it rolls back the <strong>whole</strong> statement. If each row must be treated separately — use a cursor over <code>inserted</code> (or a clever join).</p>
<div data-code="ts-trg-cursor"></div>
<div data-note="own"><p>Many triggers can be written without a cursor — working on the whole inserted/deleted tables (sums, JOINs). It's faster and works for many rows right away:</p></div>
<div data-code="ts-trg-join"></div>
<div data-note="lecture"><p>Rules like “salary &gt; 100” are better written as <code>CHECK</code>, and a default value as <code>DEFAULT</code> — a trigger is a solution for more complex cases (in the labs they are done with triggers for practice).</p></div>

<h3>Which operation and which columns</h3>
<ul>
  <li>INSERT: something in inserted, nothing in deleted; DELETE: the opposite; UPDATE: both non-empty.</li>
  <li><code>UPDATE(column)</code> — TRUE if the column was modified (in SET or in INSERT).</li>
  <li><code>COLUMNS_UPDATED()</code> — a bit mask of all changed columns.</li>
</ul>
<div data-code="ts-trg-which"></div>
<p>Recursion: <strong>indirect</strong> (TR1 on T1 changes T2, and TR2 on T2 changes T1) is possible; <strong>direct</strong> (TR1 changes its own T1) — only after changing a database setting (not recommended).</p>

<h2>INSTEAD OF</h2>
<p>An <code>INSTEAD OF</code> trigger runs <strong>instead of</strong> the DML statement (the statement itself is skipped). On <strong>views</strong> it allows INSERT/UPDATE/DELETE through a view that normally doesn't allow it (e.g. with a join). MS SQL also allows INSTEAD OF on tables (Oracle — no).</p>
<div data-code="ts-trg-instead"></div>
<div data-note="lecture"><p>Triggers are “a very powerful tool, maybe too powerful”: they act the same for every process (an advantage and a drawback), and with related tables it's easy to lose control of their chain. Use them sparingly; procedures are often better.</p></div>

<h2>Error handling</h2>
<p>The server raises errors itself (syntax, a non-existent object, a wrong type) — with a number (Msg), level, state and line.</p>
<div data-code="ts-err-server"></div>
<h3>RAISERROR</h3>
<p><code>RAISERROR (message, severity, state)</code>, where <strong>severity</strong> (0–25) is the weight and <strong>state</strong> (1–127) any “place” number.</p>
<table>
  <thead><tr><th>Severity</th><th>Effect</th></tr></thead>
  <tbody>
    <tr><td>0–9</td><td>a warning + “Msg 50000, Level …” info</td></tr>
    <tr><td>10</td><td>just the message (a warning)</td></tr>
    <tr><td>11–18</td><td>an error (red); inside TRY → jump to CATCH</td></tr>
    <tr><td>19–25</td><td>sysadmin only; 20–25 = fatal, the session is closed</td></tr>
  </tbody>
</table>
<div data-code="ts-raiserror"></div>
<div data-note="warn"><p>RAISERROR <strong>outside</strong> a TRY block <strong>does not stop</strong> the code — the following statements still run!</p></div>
<h3>TRY … CATCH</h3>
<p>Statements go into <code>BEGIN TRY … END TRY</code>. When an error occurs (severity ≥ 11 — from the server, RAISERROR or THROW), control moves to <code>BEGIN CATCH … END CATCH</code>, where we have <code>ERROR_NUMBER()</code>, <code>ERROR_MESSAGE()</code>, <code>ERROR_SEVERITY()</code>, <code>ERROR_STATE()</code>, <code>ERROR_LINE()</code>, <code>ERROR_PROCEDURE()</code>. Outside CATCH they return NULL. Blocks can be nested.</p>
<div data-code="ts-try"></div>
<h3>THROW</h3>
<p><code>THROW number, message, state</code> (number ≥ 50000) — acts like RAISERROR with severity 16, so inside TRY it always goes to CATCH. <code>THROW</code> without parameters in a CATCH block re-throws the caught error.</p>
<div data-code="ts-throw"></div>
<div data-note="tip"><p>Good code anticipates errors and turns them into understandable messages — instead of leaving the user with a system “Msg 547…” and panic “the system doesn't work”.</p></div>
`,
  cheat: `
<ul>
  <li><code>CREATE TRIGGER t ON table FOR|AFTER INSERT, UPDATE, DELETE AS …</code></li>
  <li>Fires <strong>after</strong> DML, in the same transaction; <code>ROLLBACK</code> undoes the statement.</li>
  <li><strong>Once per statement</strong>, not per row! Don't do <code>SELECT @x = col FROM inserted</code> — use <code>EXISTS</code>, JOIN, SUM or a cursor.</li>
  <li>INSERT → inserted; DELETE → deleted; UPDATE → deleted (before) + inserted (after). Read-only.</li>
  <li><code>UPDATE(col)</code> — was the column changed; <code>COLUMNS_UPDATED()</code> — mask.</li>
  <li>Several triggers on a table — undefined order. Nesting up to 32.</li>
  <li><code>INSTEAD OF</code> — instead of DML; views (and tables in MS SQL).</li>
  <li>Simple rules → CHECK / DEFAULT instead of a trigger.</li>
  <li><code>RAISERROR('msg', 16, 1)</code>: &lt;10 warning, 10 message, ≥11 error (TRY→CATCH), 20–25 fatal. Outside TRY it doesn't stop!</li>
  <li><code>BEGIN TRY … END TRY BEGIN CATCH … ERROR_MESSAGE() … END CATCH</code>.</li>
  <li><code>THROW 50001, 'msg', 1;</code> (≥ 50000, like severity 16); <code>THROW;</code> in CATCH = re-throw.</li>
</ul>
`
},

'tsql-advanced': {
  title: 'Advanced T-SQL',
  lead: 'Ranking and window functions, temporary tables, table variables, OUTPUT, CASE, recursive CTE, MERGE and dynamic SQL.',
  body: `
<div data-note="lecture"><p>These constructs make work easier but are not essential — at the start of learning T-SQL they can be skipped. Still, it's worth knowing them (they appear at the exam and help in the project).</p></div>

<h2>Compound operators</h2>
<p><code>+=</code>, <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code> (remainder) — like in C/Java.</p>
<div data-code="ts-compound"></div>

<h2>Ranking functions</h2>
<table>
  <thead><tr><th>Function</th><th>What it does</th><th>Ties (equal values)</th></tr></thead>
  <tbody>
    <tr><td><code>ROW_NUMBER()</code></td><td>numbers rows 1, 2, 3…</td><td>different numbers</td></tr>
    <tr><td><code>RANK()</code></td><td>1 + number of rows “before” in the group</td><td>same number, then a <strong>gap</strong> (1,1,3)</td></tr>
    <tr><td><code>DENSE_RANK()</code></td><td>like RANK</td><td>same number, <strong>no gaps</strong> (1,1,2)</td></tr>
    <tr><td><code>NTILE(n)</code></td><td>splits rows into n equal groups</td><td>—</td></tr>
  </tbody>
</table>
<p>Syntax: <code>function() OVER ([PARTITION BY …] ORDER BY …)</code>. <code>PARTITION BY</code> starts a separate numbering in each group (e.g. each job).</p>
<div data-code="ts-rank"></div>
<p>Ordinary aggregates also work with <code>OVER (PARTITION BY …)</code> — the group result appears <strong>in every row</strong>, without GROUP BY, CTE or a view.</p>
<div data-code="ts-window"></div>

<h2>Temporary tables and table variables</h2>
<table>
  <thead><tr><th></th><th>Temporary table <code>#t</code> / <code>##t</code></th><th>Table variable <code>@t</code></th></tr></thead>
  <tbody>
    <tr><td>Where</td><td>on disk, in <strong>tempdb</strong></td><td>in RAM</td></tr>
    <tr><td>Visibility</td><td><code>#</code> — my session (in a procedure — until it ends); <code>##</code> — all sessions</td><td>batch / procedure</td></tr>
    <tr><td>Creation</td><td><code>CREATE TABLE #t (…)</code> or <code>SELECT … INTO #t</code></td><td><code>DECLARE @t TABLE (…)</code>; <strong>not</strong> via SELECT INTO</td></tr>
    <tr><td>Constraints</td><td>yes (also named), indexes; <strong>no FK</strong></td><td>PK, UNIQUE, NULL, CHECK (unnamed); <strong>no FK</strong></td></tr>
  </tbody>
</table>
<div data-code="ts-temp"></div>
<div data-code="ts-tablevar"></div>
<div data-note="lecture"><p>“Let's use table variables!” — especially when we need the same data many times: reading from disk is expensive, and the variable keeps data in RAM.</p></div>

<h2>UPDATE and DELETE with a join</h2>
<div data-code="ts-upd-join"></div>

<h2>OUTPUT — capturing changed data</h2>
<p><code>inserted</code>/<code>deleted</code> can be read outside triggers too: the <code>OUTPUT</code> clause of INSERT/UPDATE/DELETE writes copies of the changed rows (whole rows, even if you change one column) into a table variable or a temporary table. Great for getting the IDENTITY number of a new row.</p>
<div data-code="ts-output"></div>

<h2>CASE and correlated UPDATE</h2>
<p><code>CASE</code> is “IF inside SELECT”. <strong>Simple CASE</strong> compares an expression with values, <strong>searched CASE</strong> checks any conditions. It works in SELECT, UPDATE and SET.</p>
<div data-code="ts-case"></div>
<div data-code="ts-corr-update"></div>

<h2>Recursive CTE</h2>
<p>A CTE can refer to itself: <strong>anchor</strong> (first SELECT) <code>UNION ALL</code> <strong>step</strong> (SELECT from the CTE) + a stop condition. That's how you generate number series or walk a hierarchy (boss → subordinates → their subordinates).</p>
<div data-code="ts-cte-rec"></div>

<h2>MERGE</h2>
<p>We often need at once to <strong>update</strong> existing rows, <strong>add</strong> missing ones and <strong>delete</strong> unneeded ones (e.g. refresh a department budget table every month). Instead of a procedure with IFs — one <code>MERGE</code> statement:</p>
<ul>
  <li><code>MERGE</code> — target table; <code>USING</code> — source; <code>ON</code> — matching condition;</li>
  <li><code>WHEN MATCHED THEN</code> UPDATE/DELETE (max 2 clauses: the first with <code>AND condition</code>);</li>
  <li><code>WHEN NOT MATCHED [BY TARGET] THEN</code> INSERT — rows only in the source (once);</li>
  <li><code>WHEN NOT MATCHED BY SOURCE THEN</code> UPDATE/DELETE — rows only in the target;</li>
  <li><code>OUTPUT … $action</code> — a log of performed operations.</li>
</ul>
<div data-code="ts-merge"></div>
<div data-note="warn"><p>MERGE <strong>must</strong> end with a semicolon. Watch out for NULL in the ON condition — a row with <code>deptno = NULL</code> never “matches” and is treated as new at every run.</p></div>

<h2>Dynamic SQL</h2>
<p>A normal statement is “rigid”: with parameters you can change values in WHERE, but not a table name or a column list. <strong>Dynamic SQL</strong> builds the statement as text and runs it: <code>EXEC (@text)</code> or — faster and safer — <code>sp_executesql</code> with parameters.</p>
<div data-code="ts-dynamic"></div>
<div data-note="warn"><p>Dynamic SQL is as powerful as it is dangerous: concatenating text with user data opens the door to <strong>SQL Injection</strong>. Pass values as <code>sp_executesql</code> parameters, not by concatenation.</p></div>
`,
  cheat: `
<ul>
  <li><code>SET @x += 5;</code> (+=, -=, *=, /=, %=).</li>
  <li><code>ROW_NUMBER() / RANK() / DENSE_RANK() / NTILE(n) OVER (PARTITION BY a ORDER BY b)</code>. RANK: 1,1,3; DENSE_RANK: 1,1,2.</li>
  <li><code>SUM(sal) OVER (PARTITION BY job)</code> — aggregate in every row. <code>STRING_AGG(col, ', ')</code>.</li>
  <li><code>#t</code> local, <code>##t</code> global (tempdb, no FK); <code>SELECT … INTO #t</code>.</li>
  <li><code>DECLARE @t TABLE (…)</code> — RAM, no FK, no SELECT INTO.</li>
  <li><code>UPDATE e SET … FROM Emp e JOIN Dept d ON …</code>; <code>DELETE e FROM Emp e JOIN …</code>.</li>
  <li><code>INSERT … OUTPUT inserted.* INTO @t SELECT/VALUES …</code> (no semicolon before SELECT).</li>
  <li><code>CASE x WHEN … THEN … ELSE … END</code> / <code>CASE WHEN condition THEN … END</code>.</li>
  <li>Recursive CTE: <code>WITH X AS (anchor UNION ALL step from X WHERE stop) SELECT …</code>.</li>
  <li><code>MERGE target USING source ON … WHEN MATCHED … WHEN NOT MATCHED [BY TARGET] … WHEN NOT MATCHED BY SOURCE … ;</code></li>
  <li>Dynamic SQL: <code>EXEC (@s)</code>; better <code>sp_executesql @s, N'@p INT', @p = 1</code>. Beware SQL Injection.</li>
</ul>
`
}

});
