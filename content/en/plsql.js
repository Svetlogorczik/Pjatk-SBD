/* EN – Module 4: PL/SQL (Oracle) */
SBD.addContent('en', {

'plsql-basics': {
  title: 'PL/SQL: blocks, variables, IF and loops',
  lead: 'Oracle’s procedural language: stricter than T-SQL. Block structure, declarations, %TYPE, variable scope, IF/ELSIF and three kinds of loops.',
  body: `
<h2>PL/SQL vs T-SQL</h2>
<p><strong>PL/SQL</strong> plays in Oracle the same role as T-SQL in MS SQL Server: it adds variables, conditions, loops, error handling, and code can be stored as <strong>procedures, functions, triggers and packages</strong>. It appeared in Oracle 7; its syntax is modelled on the <strong>Ada</strong> language.</p>
<p>The syntax is more complex but <strong>orderly and strictly enforced</strong>: every statement ends with a semicolon, every IF has END IF, every loop END LOOP.</p>
<div data-note="warn"><p>A common mistake: carrying T-SQL habits over to PL/SQL. There are no <code>@variables</code>, <code>PRINT</code>, <code>IF EXISTS</code> or <code>DECLARE @x = (SELECT …)</code> here. Treat PL/SQL as a separate language.</p></div>

<h2>Tools</h2>
<ul>
  <li><strong>SQL*Plus</strong> — the oldest client, command line, works everywhere; has its own commands (VARIABLE, ACCEPT, PRINT…).</li>
  <li><strong>SQL Developer</strong> — Oracle's GUI tool (the SSMS counterpart), the main one in the labs; understands part of the SQL*Plus commands.</li>
  <li><strong>DBeaver, DataGrip</strong> — universal; SQL*Plus commands (e.g. <code>&amp;variables</code>) do not work there.</li>
</ul>
<p>Important SQL*Plus commands in SQL Developer: <code>SET SERVEROUTPUT ON</code> (show messages!), <code>SET AUTOCOMMIT ON|OFF</code>, <code>SET VERIFY OFF</code>, <code>EXEC procedure(…)</code>, <code>VARIABLE</code>, <code>ACCEPT … PROMPT</code>.</p>
<div data-code="pl-output"></div>
<div data-note="tip"><p>Nothing is printed? The most common reason: <code>SET SERVEROUTPUT ON</code> was not run in this session.</p></div>
<p>A <code>/</code> on its own line after a block means “run the block” in SQL*Plus / SQL Developer (similar to GO in MS SQL).</p>

<h2>Anonymous block</h2>
<p>In PL/SQL a block has a <strong>formal structure</strong>. Outside a block only plain SQL commands can run — variables and control statements must be inside a block.</p>
<p class="formula">DECLARE      -- optional: variables, constants, cursors, exceptions
BEGIN        -- required: SQL and PL/SQL statements
EXCEPTION    -- optional: error handling
END;</p>
<p>Blocks can be nested — an inner block is a single statement for the outer one. Inside a block SELECT (with INTO), INSERT, UPDATE, DELETE, COMMIT, ROLLBACK are allowed.</p>
<div data-code="pl-block"></div>

<h2>Names in Oracle</h2>
<ul>
  <li>start with a Latin letter; then letters, digits, <code>$</code>, <code>#</code>, <code>_</code>;</li>
  <li>max <strong>30 characters</strong>; cannot be a keyword;</li>
  <li>case doesn't matter (Oracle stores everything in UPPER CASE), unless the name is in <code>"quotes"</code>.</li>
</ul>

<h2>Variables</h2>
<p class="formula">name [CONSTANT] type [NOT NULL] [:= | DEFAULT value];</p>
<ul>
  <li>Declared in the DECLARE section, <strong>each separately</strong>, with a semicolon. Names <strong>without @</strong> (usually with the prefix <code>v_</code>).</li>
  <li>Types: all Oracle SQL types + e.g. <code>BOOLEAN</code> and <code>BINARY_INTEGER</code>/<code>PLS_INTEGER</code> (fast integers).</li>
  <li>Assignment: the <code>:=</code> operator or <code>SELECT … INTO variables FROM …</code>.</li>
  <li>A CONSTANT and a NOT NULL variable must get a value in the declaration.</li>
  <li>An uninitialised variable = NULL.</li>
</ul>
<div data-code="pl-vars"></div>
<div data-note="exam"><p><code>SELECT … INTO</code> must return <strong>exactly one row</strong>. Zero rows → the <code>NO_DATA_FOUND</code> exception, more → <code>TOO_MANY_ROWS</code>. That's why we check existence with <code>SELECT COUNT(*) INTO v_count …</code> (COUNT always gives one row), not with “read and check NULL” like in T-SQL.</p></div>
<div data-code="pl-no-tsql"></div>
<div data-code="pl-null-var"></div>
<p>For single-row queries without a table Oracle has helper tables: <code>DUAL</code> (returns 'X') and <code>DUMMY</code> (returns 0).</p>

<h3>%TYPE, %ROWTYPE and RECORD</h3>
<p>A variable's type can be “copied”: <code>variable%TYPE</code> (like another variable), <code>table.column%TYPE</code> (like a column), <code>table%ROWTYPE</code> (a whole row — fields are read as <code>variable.column</code>). When the source type changes, the variable type changes too. You can also define your own record type <code>TYPE … IS RECORD (…)</code>.</p>
<div data-code="pl-type"></div>
<div data-code="pl-record"></div>
<div data-note="warn"><p>A row variable (%ROWTYPE) cannot be used directly after <code>VALUES</code> in an INSERT.</p></div>

<h3>Variable scope</h3>
<p>A variable from an outer block is visible in nested blocks. A variable from an inner block is <strong>not</strong> visible outside nor in “sibling” blocks. The same name in an inner block is a <strong>different variable</strong>.</p>
<div data-code="pl-scope"></div>

<h3>Substitution and bind variables</h3>
<p>From SQL*Plus come: <strong>substitution variables</strong> <code>&amp;name</code> (value typed on the keyboard, only on the right side of an assignment) and <strong>bind variables</strong> <code>:name</code> (declared with VARIABLE, live outside the block, printed with PRINT). They work in SQL Developer, not in DBeaver/DataGrip.</p>
<div data-code="pl-bind"></div>

<h3>System variables</h3>
<p><code>SQL%ROWCOUNT</code> (how many rows the last statement processed), <code>SQL%FOUND</code>, <code>SQL%NOTFOUND</code>, and in the EXCEPTION section: <code>SQLCODE</code> (error number) and <code>SQLERRM</code> (message).</p>
<div data-code="pl-sqlattr"></div>

<h2>IF … THEN … ELSIF … ELSE … END IF</h2>
<ul>
  <li>Statements after <code>THEN</code> — when the condition is TRUE; after <code>ELSE</code> — when FALSE <strong>or NULL</strong>.</li>
  <li><code>ELSIF</code> (spelled without an “E”!) checks further conditions.</li>
  <li>The whole thing ends with <code>END IF;</code>.</li>
</ul>
<div data-code="pl-if"></div>

<h2>Loops</h2>
<p>In PL/SQL it is basically one statement <code>LOOP … END LOOP</code> in three variants:</p>
<ul>
  <li><strong>LOOP</strong> — no condition; leave with <code>EXIT</code>, <code>EXIT WHEN condition</code> or an error;</li>
  <li><strong>FOR i IN a..b LOOP</strong> — a counter from a to b by 1 (declared automatically); <code>REVERSE</code> — from b to a; if a &gt; b the loop doesn't run at all;</li>
  <li><strong>WHILE condition LOOP</strong> — while the condition is TRUE.</li>
</ul>
<div data-code="pl-loops"></div>
`,
  cheat: `
<ul>
  <li>Block: <code>DECLARE … BEGIN … EXCEPTION … END;</code> + <code>/</code>. Always <code>SET SERVEROUTPUT ON</code>.</li>
  <li>Printing: <code>DBMS_OUTPUT.PUT_LINE('text' || v_x);</code> — concatenation <code>||</code>.</li>
  <li>Variables without @: <code>v_x INTEGER := 0;</code> · <code>c CONSTANT NUMBER := 10;</code> · <code>v NUMBER NOT NULL := 1;</code></li>
  <li>Assignment: <code>:=</code> or <code>SELECT col INTO v_x FROM …</code> (exactly 1 row!).</li>
  <li>0 rows → <code>NO_DATA_FOUND</code>; &gt;1 → <code>TOO_MANY_ROWS</code>. Existence: <code>SELECT COUNT(*) INTO v_count …</code>.</li>
  <li>NOT allowed: <code>IF EXISTS</code>, <code>:= (SELECT …)</code>, <code>IF x = (SELECT …)</code>.</li>
  <li><code>emp.sal%TYPE</code>, <code>emp%ROWTYPE</code>, <code>TYPE t IS RECORD (…)</code>.</li>
  <li>Scope: outer is visible inside, not the other way round.</li>
  <li><code>&amp;x</code> — from the keyboard; <code>:x</code> — bind variable (SQL Developer).</li>
  <li><code>SQL%ROWCOUNT</code>, <code>SQL%FOUND</code>, <code>SQL%NOTFOUND</code>, <code>SQLCODE</code>, <code>SQLERRM</code>.</li>
  <li><code>IF … THEN … ELSIF … THEN … ELSE … END IF;</code></li>
  <li><code>LOOP … EXIT WHEN …; END LOOP;</code> · <code>FOR i IN 1..n LOOP … END LOOP;</code> · <code>WHILE … LOOP … END LOOP;</code></li>
  <li>Names ≤ 30 characters; in <code>"…"</code> case-sensitive.</li>
</ul>
`
},

'plsql-cursors': {
  title: 'PL/SQL: cursors and exception handling',
  lead: 'Explicit cursors, %NOTFOUND and friends, the cursor FOR loop, parameters, FOR UPDATE, predefined and own exceptions, RAISE_APPLICATION_ERROR.',
  body: `
<h2>Cursors in PL/SQL</h2>
<p>The idea is the same as in T-SQL (see the T-SQL cursors topic) — only the syntax differs. Cursors are used <strong>more often</strong> in PL/SQL, because a PL/SQL procedure cannot simply return a SELECT result as a “result set”.</p>
<table>
  <thead><tr><th>Step</th><th>PL/SQL</th><th>T-SQL (for comparison)</th></tr></thead>
  <tbody>
    <tr><td>Declaration</td><td><code>CURSOR k IS SELECT …;</code> (in DECLARE)</td><td><code>DECLARE k CURSOR FOR SELECT …</code></td></tr>
    <tr><td>Open</td><td><code>OPEN k;</code></td><td><code>OPEN k</code></td></tr>
    <tr><td>Fetch</td><td><code>FETCH k INTO v1, v2;</code></td><td><code>FETCH NEXT FROM k INTO @v1, @v2</code></td></tr>
    <tr><td>End of data</td><td><code>EXIT WHEN k%NOTFOUND;</code></td><td><code>WHILE @@FETCH_STATUS = 0</code></td></tr>
    <tr><td>Close</td><td><code>CLOSE k;</code></td><td><code>CLOSE k; DEALLOCATE k;</code></td></tr>
  </tbody>
</table>
<h3>Cursor attributes</h3>
<ul>
  <li><code>k%FOUND</code> — TRUE if the last FETCH got a row;</li>
  <li><code>k%NOTFOUND</code> — TRUE if it didn't (end of data);</li>
  <li><code>k%ROWCOUNT</code> — how many rows have been fetched so far;</li>
  <li><code>k%ISOPEN</code> — whether the cursor is open.</li>
</ul>
<div data-code="pl-cur-basic"></div>
<div data-note="exam"><p>In PL/SQL <strong>one</strong> FETCH in a <code>LOOP</code> is enough, right after it <code>EXIT WHEN k%NOTFOUND;</code>. In T-SQL FETCH appears twice (before the loop and at its end).</p></div>
<p>If the cursor's SELECT list contains expressions (e.g. <code>SUM(sal)</code>), they must get <strong>aliases</strong>. It is handy to fetch a row into a <code>k%ROWTYPE</code> record.</p>
<div data-code="pl-cur-alias"></div>

<h2>The cursor FOR loop</h2>
<p>The handiest way: <code>FOR record IN cursor LOOP … END LOOP;</code>. OPEN, FETCH, the end check and CLOSE happen <strong>automatically</strong>, and the record variable doesn't need to be declared. You can even put the SELECT right in parentheses.</p>
<div data-code="pl-cur-for"></div>

<h2>Cursor with parameters</h2>
<p>The cursor's SELECT can use parameters; you open the same cursor many times with different values.</p>
<div data-code="pl-cur-param"></div>

<h2>Changing data through a cursor</h2>
<p><code>FOR UPDATE [OF column]</code> in the declaration locks rows for modification, and <code>WHERE CURRENT OF cursor</code> in UPDATE/DELETE points to the row currently fetched by the cursor.</p>
<div data-code="pl-cur-update"></div>

<h2>Exception handling</h2>
<p>An error in the executable section (BEGIN…END) is handled in the <code>EXCEPTION</code> section of <strong>the same block</strong>. If it isn't there — the error “travels” to the enclosing block and finally to the application. Errors in the DECLARE and EXCEPTION sections go straight to the enclosing block.</p>
<p class="formula">EXCEPTION
    WHEN exception_name_1 THEN statements;
    WHEN exception_name_2 THEN statements;
    WHEN OTHERS THEN statements;   -- everything else</p>
<h3>Predefined exceptions</h3>
<table>
  <thead><tr><th>Exception</th><th>When</th></tr></thead>
  <tbody>
    <tr><td><code>NO_DATA_FOUND</code></td><td>SELECT … INTO returned no row</td></tr>
    <tr><td><code>TOO_MANY_ROWS</code></td><td>SELECT … INTO returned more than one row</td></tr>
    <tr><td><code>DUP_VAL_ON_INDEX</code></td><td>a duplicate value in a UNIQUE / PK column</td></tr>
    <tr><td><code>ZERO_DIVIDE</code></td><td>division by zero</td></tr>
    <tr><td><code>INVALID_NUMBER</code></td><td>conversion to a number failed</td></tr>
    <tr><td><code>INVALID_CURSOR</code>, <code>CURSOR_ALREADY_OPEN</code></td><td>a wrong cursor operation</td></tr>
    <tr><td><code>TIMEOUT_ON_RESOURCE</code></td><td>waited too long for a resource</td></tr>
  </tbody>
</table>
<div data-code="pl-exc-named"></div>
<div data-note="tip"><p>Good practice: every error should be handled — at worst in <code>WHEN OTHERS</code> of the outermost block. To know which statement failed, use nested blocks with their own handlers or a step counter.</p></div>

<h3>Own exceptions</h3>
<p>Declare <code>name EXCEPTION;</code> in DECLARE, raise it with <code>RAISE name;</code>, handle with <code>WHEN name THEN …</code>.</p>
<div data-code="pl-exc-own"></div>

<h3>RAISE_APPLICATION_ERROR</h3>
<p><code>RAISE_APPLICATION_ERROR(number, 'message')</code> raises an error with your own number in the range <strong>−20000 … −20999</strong> and a message. It can be handled in the same block or left to the application. It is the basic tool in procedures and triggers (“this is not allowed…”).</p>
<div data-code="pl-raise-app"></div>
`,
  cheat: `
<ul>
  <li><code>CURSOR k IS SELECT …;</code> → <code>OPEN k;</code> → <code>LOOP FETCH k INTO …; EXIT WHEN k%NOTFOUND; … END LOOP;</code> → <code>CLOSE k;</code></li>
  <li>Attributes: <code>%FOUND</code>, <code>%NOTFOUND</code>, <code>%ROWCOUNT</code>, <code>%ISOPEN</code>.</li>
  <li>Expressions in the cursor SELECT → aliases. Record: <code>r k%ROWTYPE;</code></li>
  <li><code>FOR r IN k LOOP … r.column … END LOOP;</code> — everything automatic. Or <code>FOR r IN (SELECT …) LOOP</code>.</li>
  <li>Parameters: <code>CURSOR k (p INTEGER) IS SELECT … WHERE x = p;</code> → <code>OPEN k(10);</code></li>
  <li><code>… FOR UPDATE OF sal;</code> + <code>UPDATE … WHERE CURRENT OF k;</code></li>
  <li><code>EXCEPTION WHEN NO_DATA_FOUND THEN … WHEN TOO_MANY_ROWS THEN … WHEN OTHERS THEN … SQLCODE, SQLERRM</code></li>
  <li>Others: <code>DUP_VAL_ON_INDEX</code>, <code>ZERO_DIVIDE</code>, <code>INVALID_NUMBER</code>, <code>CURSOR_ALREADY_OPEN</code>.</li>
  <li>Own: <code>e EXCEPTION;</code> → <code>RAISE e;</code> → <code>WHEN e THEN</code>.</li>
  <li><code>RAISE_APPLICATION_ERROR(-20001, 'text');</code> — numbers −20000…−20999.</li>
  <li>An unhandled error goes to the enclosing block / application.</li>
</ul>
`
},

'plsql-procedures': {
  title: 'PL/SQL: procedures, functions and packages',
  lead: 'Code objects in Oracle: CREATE OR REPLACE, IN/OUT/IN OUT parameters, defaults, functions in SQL, overloading and packages.',
  body: `
<h2>Procedures and functions as database objects</h2>
<p>Procedures and functions are stored in the database as objects; any process with the right permissions can use them. They can also be defined inside a block (then they work only there) or grouped into <strong>packages</strong>. The idea is the same as in T-SQL, but the syntax and restrictions differ.</p>

<h2>Procedure syntax</h2>
<p class="formula">CREATE [OR REPLACE] PROCEDURE name (parameters)
{IS | AS}
    variable declarations     -- WITHOUT the word DECLARE!
BEGIN
    statements
[EXCEPTION …]
END;</p>
<ul>
  <li><code>OR REPLACE</code> — if the procedure exists, it is replaced without an error (in T-SQL you need ALTER). Very handy while fixing code.</li>
  <li><code>IS</code> and <code>AS</code> — interchangeable.</li>
  <li>Parameter: <code>name [IN | OUT | IN OUT] type [DEFAULT value]</code>. <strong>Type without size</strong>: <code>NUMBER</code>, <code>VARCHAR2</code>, or <code>emp.sal%TYPE</code>.</li>
</ul>
<div data-code="pl-proc-basic"></div>

<h2>Parameter modes</h2>
<table>
  <thead><tr><th>Mode</th><th>Direction</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><code>IN</code> (default)</td><td>into the procedure</td><td>read-only — cannot be on the left side of <code>:=</code></td></tr>
    <tr><td><code>OUT</code></td><td>out of the procedure</td><td>the value goes out after a successful end</td></tr>
    <tr><td><code>IN OUT</code></td><td>both ways</td><td>you pass a value and get it back changed</td></tr>
  </tbody>
</table>
<div data-code="pl-proc-out"></div>

<h2>Default values and named notation</h2>
<p>Parameters with <code>DEFAULT</code> go at the end of the list; they can be omitted in a call. When you want to give only some — use the <code>parameter =&gt; value</code> notation.</p>
<div data-code="pl-proc-default"></div>

<h2>Functions</h2>
<p class="formula">CREATE [OR REPLACE] FUNCTION name (parameters)
RETURN type {IS | AS}
    declarations
BEGIN
    …
    RETURN expression;
END;</p>
<p>The difference: a procedure <em>may</em> return values through OUT parameters, while a function <strong>always</strong> returns one value through <code>RETURN</code> — under its own name. Functions can be used in SQL (<code>SELECT f(30) FROM dual</code>) and in PL/SQL (<code>v := f(30);</code>).</p>
<div data-code="pl-func"></div>
<div data-note="exam"><p>A function used <strong>in an SQL statement</strong> cannot: run DML or DDL (change the database), have OUT parameters, use non-local package variables; all parameters must be given and the <code>=&gt;</code> notation is not allowed.</p></div>

<h2>Overloading</h2>
<p>In one block or package there may be several procedures/functions with the same name if they differ in the number or types of parameters (“subtypes” such as CHAR vs VARCHAR2 are not enough). Standalone procedures cannot be overloaded.</p>
<div data-code="pl-overload"></div>

<h2>Packages</h2>
<p>A <strong>package</strong> groups related cursors, variables, constants, exceptions, procedures and functions. It has two parts:</p>
<ul>
  <li><strong>specification</strong> (<code>CREATE PACKAGE</code>) — the public part: the interface, procedure headers;</li>
  <li><strong>body</strong> (<code>CREATE PACKAGE BODY</code>) — the implementation + private elements + an optional initialisation block (run once, on first use in a session).</li>
</ul>
<p>Package variables live until the end of the session. Elements are referred to with a dot: <code>package.procedure(…)</code>, <code>package.variable</code>.</p>
<div data-code="pl-package"></div>
<div data-note="own"><p>The typical pattern of lab tasks (“insert if it doesn't exist; compute the new number as MAX+1; raise an error if there is no department”): <code>SELECT COUNT(*) INTO v_count … ;</code> → <code>IF v_count = 0 THEN RAISE_APPLICATION_ERROR(…)</code> → <code>SELECT NVL(MAX(id), 0) + 1 INTO v_id …</code> → <code>INSERT …</code> → <code>DBMS_OUTPUT.PUT_LINE(…)</code>.</p></div>
`,
  cheat: `
<ul>
  <li><code>CREATE OR REPLACE PROCEDURE p (a NUMBER, b IN VARCHAR2, w OUT NUMBER) IS v_x NUMBER; BEGIN … END; /</code></li>
  <li>Declarations after IS/AS <strong>without DECLARE</strong>. Parameter types <strong>without size</strong>.</li>
  <li>IN (default, read-only) · OUT (result) · IN OUT (both).</li>
  <li>Call: <code>CALL p(1, 'x');</code> · <code>EXEC p(1, 'x');</code> · <code>BEGIN p(1, 'x', v_w); END;</code></li>
  <li><code>DEFAULT</code> at the end of the list; <code>p(b =&gt; 'MANAGER')</code>.</li>
  <li><code>CREATE OR REPLACE FUNCTION f (x NUMBER) RETURN NUMBER IS … BEGIN … RETURN v; END;</code></li>
  <li>Function in SQL: <code>SELECT f(30) FROM dual;</code> — no DML/DDL, no OUT, no <code>=&gt;</code>.</li>
  <li>Overloading: only in a block/package, different number/types of parameters.</li>
  <li>Package: <code>CREATE PACKAGE pk AS … END pk;</code> + <code>CREATE PACKAGE BODY pk AS … [BEGIN init] END pk;</code>; use <code>pk.proc()</code>.</li>
</ul>
`
},

'plsql-triggers': {
  title: 'PL/SQL: triggers',
  lead: 'BEFORE/AFTER, statement and row level (FOR EACH ROW), :OLD/:NEW, INSERTING/UPDATING/DELETING, the mutating table, INSTEAD OF and system triggers.',
  body: `
<h2>Triggers in Oracle</h2>
<p>A PL/SQL trigger is a procedure bound to a <strong>table, view, schema or the whole database</strong>, run automatically by an event: INSERT/UPDATE/DELETE or a system event. The role is the same as in T-SQL, but <strong>the philosophy is different</strong> — above all, Oracle has row-level triggers and a choice of BEFORE/AFTER.</p>

<h2>Syntax</h2>
<p class="formula">CREATE [OR REPLACE] TRIGGER name
{BEFORE | AFTER} {INSERT | UPDATE [OF columns] | DELETE} [OR …]
ON table
[FOR EACH ROW]
PL/SQL block</p>
<p>When defining it you decide three things:</p>
<ol class="steps">
  <li><strong>which operations</strong> fire it (combined with <code>OR</code>; for UPDATE you can list columns: <code>UPDATE OF sal</code>);</li>
  <li><strong>when</strong>: <code>BEFORE</code> (before the statement) or <code>AFTER</code> (after);</li>
  <li><strong>how many times</strong>: once for the whole statement (default) or <strong>for each row</strong> (<code>FOR EACH ROW</code>).</li>
</ol>

<h2>Two kinds of triggers</h2>
<table>
  <thead><tr><th></th><th>Statement level</th><th>Row level (<code>FOR EACH ROW</code>)</th></tr></thead>
  <tbody>
    <tr><td>How many times</td><td>once per statement</td><td>once for every changed row</td></tr>
    <tr><td>Access to values</td><td>no :OLD/:NEW</td><td><code>:OLD.column</code> (before), <code>:NEW.column</code> (after)</td></tr>
    <tr><td>Reading the trigger's table</td><td>allowed</td><td><strong>not allowed</strong> (mutating table)</td></tr>
  </tbody>
</table>
<div data-code="pl-trg-statement"></div>
<div data-code="pl-trg-row"></div>
<div data-note="tip"><p>In a <code>BEFORE … FOR EACH ROW</code> trigger you can <strong>change</strong> the value being written by assigning to <code>:NEW.column</code> (e.g. fill in a date, fix a salary). On INSERT <code>:OLD</code> is empty (NULL), on DELETE — <code>:NEW</code>.</p></div>

<h2>Which operation fired the trigger</h2>
<p>The predicates <code>INSERTING</code>, <code>UPDATING</code>, <code>DELETING</code> used in IF — handy when a trigger reacts to several operations. To block an operation we raise <code>RAISE_APPLICATION_ERROR</code> (the whole statement is rolled back).</p>
<div data-code="pl-trg-predicates"></div>

<h2>Restrictions</h2>
<div data-note="exam"><ul>
  <li>Triggers <strong>must not</strong> use <code>COMMIT</code> or <code>ROLLBACK</code> (we block with RAISE_APPLICATION_ERROR).</li>
  <li>A row-level trigger <strong>must not read or change the table it works on</strong> (except <code>:OLD</code>/<code>:NEW</code>) — nor tables linked to it by foreign keys. Exception: INSERT … VALUES of a single row.</li>
</ul></div>
<p>Breaking the second rule gives the famous <strong>ORA-04091: table … is mutating</strong>. The trigger compiles, but on the first UPDATE everything is rolled back:</p>
<div data-code="pl-trg-mutating"></div>
<div data-note="own"><p>How to avoid a mutating table? Simplest: move the logic to a <strong>statement-level</strong> trigger (reading the table is allowed there) or into a procedure. An advanced solution is a compound trigger (COMPOUND TRIGGER) — beyond the lecture.</p></div>

<h2>Several triggers on one table</h2>
<p>You can have many, but you don't control the order within the same type — don't write triggers that depend on the order. General order:</p>
<ol>
  <li>BEFORE statement;</li>
  <li>BEFORE row → AFTER row (for each row in turn);</li>
  <li>AFTER statement.</li>
</ol>
<p>Disabling and dropping: <code>ALTER TRIGGER name DISABLE | ENABLE;</code>, <code>DROP TRIGGER name;</code>. A broken trigger (e.g. a mutating one) can block others — disable or drop it.</p>

<h2>INSTEAD OF</h2>
<p>It allows DML through views built on several tables: the PL/SQL block does separate operations on each table, and the user sees only the view. In Oracle <strong>only on views</strong> (in MS SQL also on tables).</p>
<div data-code="pl-trg-instead"></div>

<h2>System triggers</h2>
<p>Oracle can react to <strong>database</strong> events (SERVERERROR, LOGON, LOGOFF, STARTUP, SHUTDOWN) and <strong>DDL/DCL</strong> events (CREATE, ALTER, DROP, GRANT, REVOKE) — for a schema (<code>ON SCHEMA</code>) or the whole database (<code>ON DATABASE</code>).</p>
<div data-code="pl-trg-system"></div>
<div data-note="own"><p><strong>T-SQL vs PL/SQL — key trigger differences:</strong></p>
<table>
  <thead><tr><th></th><th>T-SQL</th><th>PL/SQL</th></tr></thead>
  <tbody>
    <tr><td>Timing</td><td>AFTER (FOR) or INSTEAD OF</td><td>BEFORE, AFTER, INSTEAD OF</td></tr>
    <tr><td>Rows</td><td>always once per statement</td><td>once per statement or FOR EACH ROW</td></tr>
    <tr><td>Old/new data</td><td><code>deleted</code>/<code>inserted</code> tables</td><td><code>:OLD</code>/<code>:NEW</code> (row level only)</td></tr>
    <tr><td>Blocking an operation</td><td><code>ROLLBACK</code> (+ RAISERROR)</td><td><code>RAISE_APPLICATION_ERROR</code> (COMMIT/ROLLBACK forbidden)</td></tr>
    <tr><td>Recognising the operation</td><td>whether inserted/deleted are empty</td><td><code>INSERTING/UPDATING/DELETING</code></td></tr>
  </tbody>
</table></div>
`,
  cheat: `
<ul>
  <li><code>CREATE OR REPLACE TRIGGER t BEFORE|AFTER INSERT OR UPDATE [OF col] OR DELETE ON tab [FOR EACH ROW] DECLARE … BEGIN … END; /</code></li>
  <li>No FOR EACH ROW — once per statement, no :OLD/:NEW, reading the table allowed.</li>
  <li>FOR EACH ROW — for each row; <code>:OLD.col</code>, <code>:NEW.col</code>; in BEFORE you may set <code>:NEW.col := …</code>.</li>
  <li><code>IF INSERTING / UPDATING / DELETING THEN …</code></li>
  <li>Blocking: <code>RAISE_APPLICATION_ERROR(-20001, '…');</code>. <strong>No COMMIT/ROLLBACK</strong>.</li>
  <li>A row trigger doesn't read its own table → <strong>ORA-04091 mutating</strong>.</li>
  <li>Order: BEFORE stmt → (BEFORE row → AFTER row)× → AFTER stmt.</li>
  <li><code>ALTER TRIGGER t DISABLE|ENABLE;</code> · <code>DROP TRIGGER t;</code></li>
  <li><code>INSTEAD OF</code> — views only (in Oracle).</li>
  <li>System: <code>… ON SCHEMA | ON DATABASE</code> (LOGON, DROP, CREATE…).</li>
</ul>
`
},

'plsql-advanced': {
  title: 'Advanced PL/SQL',
  lead: 'Quoted names, IDENTITY in three variants, sequences, GTT/PTT temporary tables, analytic functions, MERGE and EXECUTE IMMEDIATE.',
  body: `
<div data-note="lecture"><p>These features extend the possibilities but are not needed for basic operations. Recursive CTE, CASE and correlated UPDATE work in Oracle practically the same as in MS SQL — see “Advanced T-SQL”.</p></div>

<h2>Names in Oracle</h2>
<p>Oracle stores names in <strong>UPPER CASE</strong>, unless you use quotes — then the name is stored exactly as written and must be referenced exactly the same way. Max 30 characters (also constraint names generated by CASE tools!).</p>
<div data-code="pl-names"></div>

<h2>Auto-numbering</h2>
<h3>IDENTITY (since Oracle 12c)</h3>
<table>
  <thead><tr><th>Variant</th><th>Behaviour</th></tr></thead>
  <tbody>
    <tr><td><code>GENERATED ALWAYS AS IDENTITY</code></td><td>always a server number; giving your own = error ORA-32795 (like in MS SQL)</td></tr>
    <tr><td><code>GENERATED BY DEFAULT AS IDENTITY</code></td><td>a server number unless you give your own — the generator doesn't check it, so duplicates are easy</td></tr>
    <tr><td><code>GENERATED BY DEFAULT ON NULL AS IDENTITY</code></td><td>a server number when you omit the column <strong>or</strong> pass NULL</td></tr>
  </tbody>
</table>
<div data-code="pl-identity"></div>
<p>Restrictions: one IDENTITY column per table, numeric type, no DEFAULT; a table created by <code>CREATE TABLE … AS SELECT</code> does not inherit IDENTITY; Oracle has no <code>SCOPE_IDENTITY()</code> equivalent.</p>
<h3>Sequences</h3>
<p>The older, still used way. Advantage: one sequence can feed several columns/tables; <code>CURRVAL</code> easily reads the last value.</p>
<div data-code="pl-seq"></div>

<h2>Temporary tables</h2>
<table>
  <thead><tr><th></th><th>GLOBAL TEMPORARY (GTT)</th><th>PRIVATE TEMPORARY (PTT, since 18c)</th></tr></thead>
  <tbody>
    <tr><td>Definition</td><td>a <strong>permanent object</strong>, visible to all sessions</td><td>temporary, only in my session, in RAM</td></tr>
    <tr><td>Data</td><td>private to the session</td><td>private to the session</td></tr>
    <tr><td>Data lifetime</td><td><code>ON COMMIT DELETE ROWS</code> (default, until the end of the transaction) / <code>PRESERVE ROWS</code> (until the end of the session)</td><td><code>ON COMMIT DROP DEFINITION</code> / <code>PRESERVE DEFINITION</code></td></tr>
    <tr><td>Name</td><td>any</td><td>must start with <code>ORA$PTT_</code></td></tr>
    <tr><td>Other</td><td>can be indexed; not in backups; DDL only when nobody uses it</td><td>no indexes, no DEFAULT, not accessible from other databases</td></tr>
  </tbody>
</table>
<div data-code="pl-temp"></div>

<h2>Analytic functions</h2>
<p><code>ROW_NUMBER</code>, <code>RANK</code>, <code>DENSE_RANK</code> with <code>OVER (PARTITION BY … ORDER BY …)</code> work as in MS SQL. Oracle also has <code>RANK(values) WITHIN GROUP (ORDER BY …)</code> as an <strong>aggregate</strong> (what position a given value would take) and <code>LISTAGG</code> — joining group values into one text (like STRING_AGG).</p>
<div data-code="pl-analytic"></div>

<h2>MERGE</h2>
<p>The idea is as in T-SQL (synchronise a target table with a source), the syntax slightly different: <code>MERGE INTO … USING … ON (…) WHEN MATCHED THEN UPDATE … [DELETE WHERE …] WHEN NOT MATCHED THEN INSERT … [WHERE …]</code>. In Oracle DELETE is part of the MATCHED branch — it deletes only matched rows.</p>
<div data-code="pl-merge"></div>
<div data-note="lecture"><p>The lecture showed an “oscillator”: DELETE removes the “NULL department” row, but the next MERGE inserts it again. An extra condition <code>WHERE s.deptno IS NOT NULL</code> in the INSERT branch helps.</p></div>

<h2>Functions — reminder</h2>
<div data-code="pl-func-avg"></div>

<h2>Dynamic SQL</h2>
<p>In a PL/SQL block you <strong>cannot</strong> write DDL directly. The solution is dynamic SQL: the older package <code>DBMS_SQL</code> (complicated) or the “native” <code>EXECUTE IMMEDIATE text [INTO variables] [USING values]</code>. In the text we use bind variables <code>:1</code>, <code>:name</code>, and pass values with <code>USING</code> — this protects against SQL Injection.</p>
<div data-code="pl-dynamic"></div>
`,
  cheat: `
<ul>
  <li>Names: UPPER CASE, ≤ 30 characters; <code>"abc"</code> ≠ <code>abc</code>.</li>
  <li>IDENTITY: <code>GENERATED ALWAYS | BY DEFAULT | BY DEFAULT ON NULL AS IDENTITY [START WITH … INCREMENT BY …]</code>.</li>
  <li>Sequence: <code>CREATE SEQUENCE s START WITH 10 INCREMENT BY 10;</code> · <code>s.NEXTVAL</code>, <code>s.CURRVAL</code>.</li>
  <li>GTT: <code>CREATE GLOBAL TEMPORARY TABLE … ON COMMIT DELETE|PRESERVE ROWS;</code> — permanent definition, session data.</li>
  <li>PTT: <code>CREATE PRIVATE TEMPORARY TABLE ora$ptt_x … ON COMMIT DROP|PRESERVE DEFINITION;</code></li>
  <li><code>ROW_NUMBER/RANK/DENSE_RANK() OVER (PARTITION BY … ORDER BY …)</code>; <code>RANK(x) WITHIN GROUP (ORDER BY …)</code>.</li>
  <li><code>LISTAGG(col, ', ') WITHIN GROUP (ORDER BY col)</code>.</li>
  <li><code>MERGE INTO t USING s ON (…) WHEN MATCHED THEN UPDATE SET … DELETE WHERE … WHEN NOT MATCHED THEN INSERT … VALUES … WHERE …;</code></li>
  <li><code>EXECUTE IMMEDIATE 'SQL with :1' [INTO v] USING val;</code> — the only way to run DDL in a block.</li>
</ul>
`
}

});
