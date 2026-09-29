/* EN – Module 2: the SQL language */
SBD.addContent('en', {

'sql-basics': {
  title: 'SQL — basics, dialects and data types',
  lead: 'Where SQL came from, how MS SQL Server and Oracle differ, how commands are grouped and what the data types are.',
  body: `
<h2>Where SQL came from</h2>
<p>Earlier data models (network, hierarchical) were based on files of records — ordinary programming languages (COBOL, C) were enough. After the relational model was published (Codd, 1970), a new <strong>relational language</strong> was needed:</p>
<ul>
  <li>1974 — at IBM Donald Chamberlain's team presents <strong>SEQUEL</strong>;</li>
  <li>1977 — SYSTEM R with SEQUEL/2; the name was changed to <strong>SQL</strong> (for legal reasons — the name SEQUEL was trademarked);</li>
  <li>1986 — ANSI standard, 1987 — ISO standard.</li>
</ul>
<p>Every server implements the standard a bit differently — we talk about <strong>dialects</strong>. Well-known systems: Oracle Database, IBM DB2, PostgreSQL, MS SQL Server (originally bought from Sybase), MySQL, MariaDB. No dialect implements the whole standard and no two are identical.</p>
<p>In this course we use two dialects: <strong>MS SQL Server</strong> (short: MS SQL) and <strong>Oracle</strong>. If no difference is mentioned, a command works the same in both.</p>
<div data-note="lecture"><p>The lecturer warns against ready-made solutions from the internet: they are sometimes wrong or concern another dialect, which a beginner cannot tell. The ultimate authority is the <strong>vendor's documentation</strong>.</p></div>

<h2>What SQL is and what it is not</h2>
<ul>
  <li>SQL is a <strong>data language</strong> — used only for operations on a database.</li>
  <li>It is <strong>not</strong> a programming language: no variables, IFs, loops. (That's why this semester we learn the extensions: T-SQL and PL/SQL.)</li>
  <li>It is <strong>declarative</strong>: you say <em>what</em> you want, and the server decides <em>how</em>.</li>
  <li>People say “query”, although we really issue <strong>commands</strong> — not all of them return something.</li>
</ul>

<h2>Writing rules</h2>
<ul>
  <li>Keywords and object names can be written in lower or upper case.</li>
  <li>But the <strong>data</strong> may be case-sensitive: Oracle distinguishes case by default (<code>'Kowalski' ≠ 'KOWALSKI'</code>), MS SQL by default does not.</li>
  <li>End a command with a semicolon <code>;</code> — Oracle requires it, MS SQL does not, but it's worth always using it.</li>
  <li><strong>Text and dates</strong> always in single quotes: <code>'Ala'</code>, <code>'2021-11-21'</code>.</li>
  <li>A command can be broken into lines anywhere.</li>
</ul>
<div data-code="sql-comments"></div>
<div data-note="tip"><p>Shortcuts: in SSMS comment <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd> / uncomment <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>U</kbd>; in SQL Developer <kbd>Ctrl</kbd>+<kbd>/</kbd> works both ways.</p></div>
<p>Syntax descriptions use BNF notation: <code>[ ]</code> — optional, <code>|</code> — choice, <code>{ }</code> — required, <code>(…)</code> — may repeat.</p>

<h2>Four groups of commands</h2>
<table>
  <thead><tr><th>Group</th><th>Stands for</th><th>Commands</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><strong>DQL</strong></td><td>Data Query Language</td><td><code>SELECT</code></td><td>reading data (changes nothing)</td></tr>
    <tr><td><strong>DML</strong></td><td>Data Manipulation Language</td><td><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code></td><td>changing data</td></tr>
    <tr><td><strong>DDL</strong></td><td>Data Definition Language</td><td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code></td><td>creating and changing objects (tables, views…)</td></tr>
    <tr><td><strong>DCL</strong></td><td>Data Control Language</td><td><code>GRANT</code>, <code>REVOKE</code>, <code>DENY</code>*</td><td>permissions (* DENY — MS SQL only)</td></tr>
  </tbody>
</table>
<p>In RBD you learned DQL, DML and DDL. DCL is part of the SBD syllabus.</p>
<div data-code="sql-groups"></div>

<h2>Data types</h2>
<p>The standard defines e.g. <code>CHARACTER(n)</code> (fixed length, padded with spaces), <code>CHARACTER VARYING(n)</code> = <code>VARCHAR(n)</code> (variable length), <code>NUMERIC(p, q)</code> (p digits, q after the point), <code>INTEGER</code>. In practice what matters are the types of a specific server:</p>
<table>
  <thead><tr><th>Kind</th><th>MS SQL Server</th><th>Oracle</th></tr></thead>
  <tbody>
    <tr><td>Fixed / variable text</td><td><code>CHAR(n)</code>, <code>VARCHAR(n)</code> up to 8000, <code>VARCHAR(MAX)</code></td><td><code>CHAR(n)</code>, <code>VARCHAR2(n)</code></td></tr>
    <tr><td>Unicode text</td><td><code>NCHAR</code>, <code>NVARCHAR</code> (2 bytes/char)</td><td><code>NCHAR</code>, <code>NVARCHAR2</code></td></tr>
    <tr><td>Integers</td><td><code>TINYINT</code> (0–255), <code>SMALLINT</code>, <code>INT</code>, <code>BIGINT</code>, <code>BIT</code> (0/1/NULL)</td><td><code>INTEGER</code> = <code>NUMBER(38)</code></td></tr>
    <tr><td>Decimals</td><td><code>DECIMAL(p,s)</code> = <code>NUMERIC(p,s)</code>, <code>MONEY</code>, <code>SMALLMONEY</code></td><td><code>NUMBER(p,s)</code> (s may be negative — rounding left of the point)</td></tr>
    <tr><td>Date and time</td><td><code>DATE</code>, <code>TIME</code>, <code>DATETIME2</code> (<code>DATETIME</code> — outdated)</td><td><code>DATE</code> (with time!), <code>TIMESTAMP(s)</code></td></tr>
    <tr><td>Binary</td><td><code>BINARY(n)</code>, <code>VARBINARY(n)</code></td><td><code>BLOB</code>, <code>RAW</code></td></tr>
  </tbody>
</table>
<div data-code="sql-types-ms"></div>
<div data-code="sql-types-ora"></div>

<h2>Tools</h2>
<ul>
  <li><strong>MS SQL Server:</strong> SQL Server Management Studio (SSMS) — a full GUI tool also for administration; Azure Data Studio — text mode.</li>
  <li><strong>Oracle:</strong> SQL Developer; the oldest client: SQL*Plus (command line).</li>
  <li><strong>Universal:</strong> DataGrip, DBeaver — connect to many servers.</li>
</ul>
<p>PJATK students get access to Oracle and MS SQL Server servers in the university domain.</p>
`,
  cheat: `
<ul>
  <li>SQL: IBM, SEQUEL (1974) → SQL; ANSI standard 1986, ISO 1987. Dialects differ in details.</li>
  <li>SQL = a <strong>data</strong>, <strong>declarative</strong> language, no variables/loops (T-SQL and PL/SQL add them).</li>
  <li>Text and dates in <code>'single quotes'</code>. Semicolon: Oracle — required, MS SQL — recommended.</li>
  <li>Oracle is case-sensitive for data by default, MS SQL is not.</li>
  <li>Comments: <code>-- line</code>, <code>/* block */</code>.</li>
  <li><strong>DQL</strong> SELECT · <strong>DML</strong> INSERT/UPDATE/DELETE · <strong>DDL</strong> CREATE/ALTER/DROP · <strong>DCL</strong> GRANT/REVOKE/DENY (DENY MS SQL only).</li>
  <li>MS SQL types: INT, BIT, DECIMAL(p,s), MONEY, VARCHAR(n), NVARCHAR, DATE, DATETIME2.</li>
  <li>Oracle types: NUMBER(p,s), INTEGER, VARCHAR2(n), DATE (with time), TIMESTAMP.</li>
  <li>Tools: SSMS (MS SQL), SQL Developer (Oracle), DBeaver/DataGrip (both).</li>
</ul>
`
},

'select-basics': {
  title: 'SELECT — reading data from one table',
  lead: 'The EMP/DEPT/SALGRADE database, the SELECT list, expressions, aliases, NULL, DISTINCT and sorting.',
  body: `
<h2>Sample database: EMP, DEPT, SALGRADE</h2>
<p>Most lecture examples use three tables of a company (the so-called EDS schema):</p>
<table>
  <thead><tr><th>Table</th><th>Columns</th><th>Contents</th></tr></thead>
  <tbody>
    <tr><td><strong>EMP</strong></td><td><code>EMPNO</code> (PK), <code>ENAME</code>, <code>JOB</code>, <code>MGR</code> (FK → boss's EMPNO), <code>HIREDATE</code>, <code>SAL</code> (monthly salary), <code>COMM</code> (commission), <code>DEPTNO</code> (FK → DEPT)</td><td>14 employees</td></tr>
    <tr><td><strong>DEPT</strong></td><td><code>DEPTNO</code> (PK), <code>DNAME</code>, <code>LOC</code></td><td>4 departments</td></tr>
    <tr><td><strong>SALGRADE</strong></td><td><code>GRADE</code>, <code>LOSAL</code>, <code>HISAL</code></td><td>5 salary grades</td></tr>
  </tbody>
</table>
<p>What to notice in the data:</p>
<ul>
  <li><strong>KING</strong> (PRESIDENT) has <code>MGR = NULL</code> — no boss.</li>
  <li>Only 4 people have a commission; the rest have <code>COMM = NULL</code> (“may or may not get one”), and TURNER has <code>COMM = 0</code> (“certainly gets none”).</li>
  <li>Department <strong>40 (OPERATIONS, BOSTON)</strong> has no employees.</li>
</ul>
<div data-code="eds-mssql"></div>
<div data-code="eds-oracle"></div>

<h2>Structure of a SELECT statement</h2>
<p>SELECT consists of <strong>clauses in a strict order</strong>. SELECT and FROM are mandatory:</p>
<p class="formula">SELECT [DISTINCT] expressions
FROM     sources
[WHERE   condition]
[GROUP BY expressions]
[HAVING  condition]
[ORDER BY expressions];</p>
<p>SELECT never changes data. It defines: <em>where</em> we read from (FROM), <em>which</em> rows (WHERE), <em>in what form</em> we return them (SELECT, ORDER BY).</p>
<div data-code="sel-basic"></div>
<div data-note="tip"><p>If a column name exists in several tables, prefix it with the table name: <code>Emp.deptno</code>. With one table it is not needed.</p></div>

<h2>Expressions in the SELECT list</h2>
<p>The SELECT list may contain not only columns but also <strong>literals</strong> (constants: <code>1</code>, <code>'text'</code>), operations <code>+ - * /</code>, functions and parentheses. Joining texts (concatenation): Oracle <code>||</code>, MS SQL <code>+</code>.</p>
<div data-code="sel-concat"></div>
<div data-note="warn"><p>In MS SQL <code>+</code> means both “add” and “concatenate”. Therefore <code>'earns ' + sal</code> (text + number) needs <code>CAST(sal AS VARCHAR)</code>. Oracle converts the number to text itself.</p></div>
<p>Type conversions: <code>CAST(expression AS type)</code> — both servers; MS SQL also has <code>CONVERT(type, expression, style)</code>, Oracle — <code>TO_CHAR</code>, <code>TO_DATE</code>, <code>TO_NUMBER</code>.</p>
<div data-code="sel-noFrom"></div>

<h2>Aliases</h2>
<p>We can name result columns (aliases). A simple alias is a word without spaces; an alias with spaces goes in <code>"double quotes"</code>. The word <code>AS</code> is optional. An alias does not rename the column in the table — it works only in this query.</p>
<div data-code="sel-alias"></div>

<h2>NULL in expressions</h2>
<p>Every operation with NULL gives NULL. If an employee has <code>comm = NULL</code>, then <code>12*sal + comm</code> is NULL too — although business-wise we should get the yearly pay. Solution: replace NULL with a value using <code>NVL</code> (Oracle) / <code>ISNULL</code> (MS SQL) / <code>COALESCE</code> (both).</p>
<div data-code="sel-null"></div>
<div data-note="exam"><p><code>NVL(x, y)</code> and <code>ISNULL(x, y)</code>: if <code>x</code> is not NULL they return <code>x</code>, otherwise <code>y</code>. Both arguments should be of the same type. In Oracle concatenation with NULL does <em>not</em> give NULL (NULL is treated as an empty string); in MS SQL it does.</p></div>

<h2>DISTINCT</h2>
<p>Duplicate result rows are not removed automatically. <code>DISTINCT</code> removes duplicates — but it needs sorting, so it is “expensive” for the server. <code>SELECT DISTINCT *</code> makes no sense (table rows are unique anyway thanks to the key).</p>
<div data-code="sel-distinct"></div>

<h2>ORDER BY</h2>
<p>Without ORDER BY the server returns rows in any order (usually insertion order). <code>ORDER BY</code> appears <strong>once, always last</strong>. You can sort by columns, expressions, aliases and even the position number in the SELECT list; <code>ASC</code> (ascending, default) or <code>DESC</code> (descending).</p>
<div data-code="sel-order"></div>
<div data-note="tip"><p><code>TOP n</code> in MS SQL without <code>ORDER BY</code> returns “some” n rows — the result depends on the order. Sorting large sets loads the server; indexes help.</p></div>
`,
  cheat: `
<ul>
  <li>Clause order: <code>SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY</code>. Mandatory: SELECT, FROM (MS SQL allows no FROM, Oracle — <code>FROM dual</code>).</li>
  <li>EMP: KING has MGR NULL, most COMM NULL, TURNER COMM 0, department 40 empty.</li>
  <li><code>SELECT *</code> — all columns; <code>TOP n [PERCENT]</code> — MS SQL only.</li>
  <li>Concatenation: Oracle <code>||</code>, MS SQL <code>+</code> + <code>CAST(x AS VARCHAR)</code>; <code>CONCAT()</code> in both.</li>
  <li>Alias: <code>column AS alias</code>, with a space <code>"My alias"</code>.</li>
  <li>NULL in an operation → NULL. Replace: <code>NVL</code> (Oracle), <code>ISNULL</code> (MS SQL), <code>COALESCE</code> (both).</li>
  <li><code>DISTINCT</code> removes duplicates (expensive).</li>
  <li><code>ORDER BY col1, 2 DESC</code> — once, at the end; by name, alias or number.</li>
  <li>Current date: <code>GETDATE()</code> (MS SQL), <code>SYSDATE</code> (Oracle).</li>
</ul>
`
},

'where-joins': {
  title: 'WHERE and table joins (JOIN)',
  lead: 'How to select rows with a condition and read data from many tables at once: INNER, OUTER, CROSS, self join and set operators.',
  body: `
<h2>The WHERE clause</h2>
<p><code>WHERE</code> is a row filter. Only rows for which the condition is <strong>TRUE</strong> get into the result. When the condition gives FALSE or NULL — the row is dropped.</p>
<div data-code="wh-basic"></div>

<h3>Operators</h3>
<table>
  <thead><tr><th>Operator</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>= &lt;&gt; != &lt; &lt;= &gt; &gt;=</code></td><td>comparisons</td><td><code>sal &gt;= 1100</code></td></tr>
    <tr><td><code>IS [NOT] NULL</code></td><td>NULL test (the only correct one!)</td><td><code>comm IS NULL</code></td></tr>
    <tr><td><code>[NOT] IN (…)</code></td><td>belongs to a list</td><td><code>deptno IN (10, 30)</code></td></tr>
    <tr><td><code>[NOT] BETWEEN a AND b</code></td><td>in a <strong>closed</strong> range (a ≤ x ≤ b)</td><td><code>sal BETWEEN 1000 AND 2000</code></td></tr>
    <tr><td><code>[NOT] LIKE</code></td><td>pattern: <code>%</code> any string, <code>_</code> one character</td><td><code>ename LIKE 'Kowal%'</code></td></tr>
    <tr><td><code>NOT, AND, OR</code></td><td>logic (in this order of priority)</td><td><code>NOT (a AND b)</code></td></tr>
  </tbody>
</table>
<div data-code="wh-ops"></div>
<div data-note="lecture"><p><code>LIKE</code> also works on numbers and dates (the server converts them to text, e.g. <code>hiredate LIKE '%81%'</code>), but it is slow — for numbers use comparisons and BETWEEN, for dates use date functions.</p></div>

<h3>Priority of logical operators</h3>
<p><code>AND</code> has a higher priority than <code>OR</code>. Without parentheses it is easy to get a wrong result:</p>
<div data-code="wh-precedence"></div>
<div data-code="wh-tuple"></div>
<div data-note="exam"><p><code>WHERE comm = comm</code> returns only 4 rows (where comm is not NULL), because <code>NULL = NULL</code> is NULL. <code>WHERE empno = empno</code> returns all rows — a primary key is never NULL. And <code>WHERE 1 = 1</code> is always TRUE.</p></div>

<h2>Data from many tables</h2>
<p>Data is spread over many tables linked by <strong>primary key – foreign key</strong> pairs. To combine them we look for rows where these values are equal.</p>
<p>Experiment: <code>SELECT … FROM Emp, Dept</code> without a condition returns <strong>56 rows</strong> (14 × 4) — every employee with every department. This is the <strong>Cartesian product</strong>. It contains the “true” rows (employee + their department) and lots of false ones. A join condition selects only the true ones.</p>
<div data-code="j-cartesian"></div>
<div data-code="j-where"></div>
<div data-note="analogy"><p>Imagine putting each employee card next to each department card (56 pairs) and then keeping only the pairs where the department number on both cards is the same.</p></div>

<h2>INNER JOIN</h2>
<p>The same result, but the join condition is written in <code>FROM</code>: <code>T1 JOIN T2 ON condition</code>. The server executes both forms the same way, but JOIN is more readable: <strong>joins in FROM, filters in WHERE</strong>.</p>
<div data-code="j-inner"></div>
<p>INNER JOIN returns only rows for which the ON condition is TRUE. An employee with <code>deptno = NULL</code> and a department without employees <strong>will not appear</strong>. A composite key is joined with <code>ON t1.k1 = t2.k1 AND t1.k2 = t2.k2</code>.</p>

<h2>OUTER JOIN</h2>
<table>
  <thead><tr><th>Join</th><th>What is added to the result</th></tr></thead>
  <tbody>
    <tr><td><code>LEFT [OUTER] JOIN</code></td><td>all rows of the <strong>left</strong> table, even without a match (missing columns = NULL)</td></tr>
    <tr><td><code>RIGHT [OUTER] JOIN</code></td><td>all rows of the <strong>right</strong> table</td></tr>
    <tr><td><code>FULL [OUTER] JOIN</code></td><td>all rows of both sides (LEFT + RIGHT)</td></tr>
  </tbody>
</table>
<div data-code="j-outer"></div>

<h2>CROSS JOIN, non-equi join and self join</h2>
<ul>
  <li><code>CROSS JOIN</code> — an explicitly written Cartesian product.</li>
  <li>The join condition doesn't have to be equality of keys — what matters is whether ON gives TRUE. Emp and Salgrade are joined with <code>sal BETWEEN losal AND hisal</code>.</li>
  <li><strong>Self join</strong> (recursive relationship): the same table appears twice, so it <strong>must</strong> have two different aliases (e.g. K = boss, P = subordinate).</li>
</ul>
<div data-code="j-other"></div>

<h2>Set operators</h2>
<p>SELECT results are relations, so they can be combined like sets. Condition: the same number of columns, in the same order, with compatible types.</p>
<ul>
  <li><code>UNION</code> — union without duplicates; <code>UNION ALL</code> — with duplicates (faster);</li>
  <li><code>INTERSECT</code> — intersection;</li>
  <li><code>EXCEPT</code> (standard, MS SQL) / <code>MINUS</code> (Oracle) — difference.</li>
</ul>
<div data-code="set-ops"></div>
<div data-note="tip"><p>Table aliases (<code>Emp e</code>) shorten the code and are required in a self join. In MS SQL an identifier with a space can also be written in <code>[brackets]</code>.</p></div>
`,
  cheat: `
<ul>
  <li>WHERE lets through only <strong>TRUE</strong> (FALSE and NULL are dropped).</li>
  <li>Test NULL with <code>IS NULL</code> / <code>IS NOT NULL</code>, never <code>= NULL</code>.</li>
  <li><code>BETWEEN a AND b</code> — closed range. <code>LIKE</code>: <code>%</code> string, <code>_</code> one char.</li>
  <li>Priority: <code>NOT &gt; AND &gt; OR</code> → use parentheses.</li>
  <li><code>(a, b) IN ((…), (…))</code> — Oracle only.</li>
  <li><code>FROM A, B</code> without a condition = Cartesian product (14×4 = 56).</li>
  <li><code>A JOIN B ON A.fk = B.pk</code> — matched pairs only. <code>LEFT</code>/<code>RIGHT</code>/<code>FULL</code> — plus unmatched rows (NULLs).</li>
  <li>Oracle: <code>A.x (+) = B.x</code> — old outer join notation.</li>
  <li>Non-equi: <code>JOIN Salgrade ON sal BETWEEN losal AND hisal</code>.</li>
  <li>Self join: <code>FROM Emp k JOIN Emp p ON k.empno = p.mgr</code>.</li>
  <li><code>UNION</code> (no duplicates), <code>UNION ALL</code>, <code>INTERSECT</code>, <code>EXCEPT</code> (MS) / <code>MINUS</code> (Oracle).</li>
</ul>
`
},

'group-by': {
  title: 'Aggregate functions, GROUP BY and HAVING',
  lead: 'Counting, sums and averages — for the whole table and for groups of rows. The most important grouping rule and WHERE vs HAVING.',
  body: `
<h2>Aggregate functions</h2>
<p>So far SELECT returned data row by row. <strong>Aggregate</strong> queries return information about a set of rows: how many there are, what the sum is, the average…</p>
<table>
  <thead><tr><th>Function</th><th>Returns</th></tr></thead>
  <tbody>
    <tr><td><code>COUNT</code></td><td>number of rows / values</td></tr>
    <tr><td><code>SUM</code></td><td>sum</td></tr>
    <tr><td><code>AVG</code></td><td>average</td></tr>
    <tr><td><code>MIN</code>, <code>MAX</code></td><td>smallest / largest value</td></tr>
  </tbody>
</table>
<p>The argument can be an expression or <code>DISTINCT expression</code>. <strong>NULL values are ignored</strong>.</p>
<div data-code="g-agg"></div>

<h3>COUNT — watch out</h3>
<p><code>COUNT</code> counts <strong>meaningful (non-NULL) occurrences of its argument</strong>. For a constant (<code>COUNT(1)</code>, <code>COUNT('Ala')</code>) and a star (<code>COUNT(*)</code>) the result is the number of rows. For a column — the number of non-NULL values.</p>
<div data-code="g-count"></div>
<div data-note="lecture"><p>Counting a constant does not force the server to read data. But a function as the argument (e.g. <code>COUNT(GETDATE())</code>) is a bad idea — it is evaluated separately for every row.</p></div>

<h2>GROUP BY</h2>
<p><code>GROUP BY expressions</code> splits rows into groups with <strong>equal values</strong> of these expressions. Aggregates are then computed separately for each group, and each group gives <strong>one result row</strong>.</p>
<ul>
  <li><code>GROUP BY job</code> — as many groups as distinct jobs;</li>
  <li><code>GROUP BY deptno, job</code> — as many groups as distinct <em>pairs</em> (department, job);</li>
  <li>NULL in a grouping expression forms a <strong>separate group</strong>.</li>
</ul>
<div data-code="g-group"></div>
<div data-note="analogy"><p>You spread employee cards into piles by department number. Then for each pile you count: how many cards, the salary sum, the average. The result is one line per pile — details of single cards are no longer visible.</p></div>

<h2>HAVING</h2>
<p><code>HAVING</code> is a filter for <strong>groups</strong> — it works after grouping and computing aggregates. Aggregate functions are allowed in it.</p>
<div data-code="g-having"></div>

<h2>The golden rule of grouping</h2>
<div data-note="exam"><p>With <code>GROUP BY</code>, the <code>SELECT</code> list, <code>HAVING</code> and <code>ORDER BY</code> may contain <strong>only</strong>:</p>
<ul>
  <li>constants,</li>
  <li>aggregate functions,</li>
  <li>columns and expressions that are in <code>GROUP BY</code>.</li>
</ul>
<p>Reason: after grouping there is no access to single rows — there is one row per group.</p></div>
<div data-code="g-error"></div>
<p>What if we want the <em>name</em> of the person with the lowest salary in a department? Adding <code>ename</code> to GROUP BY “works” but gives a wrong answer: every person becomes a separate group. The right way is a <strong>subquery</strong>, an analytic function or a CTE (next topic).</p>

<h2>WHERE or HAVING?</h2>
<ul>
  <li><strong>WHERE</strong> works <strong>while reading rows</strong> — before grouping. Aggregates are not allowed in it.</li>
  <li><strong>HAVING</strong> works <strong>after grouping</strong> — on finished groups.</li>
  <li>Don't move conditions that can be checked in WHERE into HAVING — the server would needlessly read and group rows it will throw away anyway. General rule: <strong>eliminate unneeded rows as early as possible</strong>.</li>
</ul>
<div data-code="g-where-having"></div>

<h2>How the server executes a grouping query (conceptually)</h2>
<ol class="steps">
  <li>Take all combinations of rows of the FROM tables (Cartesian product).</li>
  <li>Apply WHERE (including join conditions) — keep only TRUE.</li>
  <li>Split the remaining rows into groups by GROUP BY.</li>
  <li>For each group compute the SELECT list expressions (aggregates).</li>
  <li>Apply HAVING — keep only groups with TRUE.</li>
  <li>If there is DISTINCT — remove duplicates.</li>
  <li>If there are set operators (UNION…) — apply them.</li>
  <li>If there is ORDER BY — sort.</li>
</ol>
<p>This is a mental model — a real server optimizes it its own way. Grouping needs sorting, so it is expensive.</p>
<div data-note="tip"><p>An Oracle exception: <code>GROUP BY</code> and <code>HAVING</code> may swap places. In MS SQL — no.</p></div>
`,
  cheat: `
<ul>
  <li>Aggregates: <code>COUNT, SUM, AVG, MIN, MAX</code>; <strong>NULL ignored</strong>; <code>DISTINCT</code> allowed.</li>
  <li><code>COUNT(*)</code> = <code>COUNT(1)</code> = number of rows; <code>COUNT(col)</code> = number of non-NULLs.</li>
  <li>No GROUP BY → aggregate gives 1 row. <code>GROUP BY a, b</code> → 1 row per combination (NULL = separate group).</li>
  <li><strong>Rule:</strong> in SELECT/HAVING/ORDER BY only constants, aggregates, GROUP BY expressions.</li>
  <li>Error: MS SQL <em>Msg 8120</em>, Oracle <em>ORA-00979</em> — a column is missing from GROUP BY.</li>
  <li><strong>WHERE</strong> = row filter (before grouping, no aggregates). <strong>HAVING</strong> = group filter (after, with aggregates).</li>
  <li>Filter as early as possible (WHERE instead of HAVING when possible).</li>
  <li>Order: FROM → WHERE → GROUP BY → aggregates → HAVING → DISTINCT → UNION → ORDER BY.</li>
</ul>
`
},

'subqueries': {
  title: 'Subqueries, EXISTS and CTE',
  lead: 'How to use the result of one SELECT inside another: plain and correlated subqueries, IN, ALL/ANY, EXISTS and WITH.',
  body: `
<h2>The idea of a subquery</h2>
<p>We want to find the best-paid employee. We can do it in two steps: first <code>SELECT MAX(sal)</code> (result 5000), then <code>WHERE sal = 5000</code>. Plain SQL has no variables to carry the result — but we can put <strong>the whole query</strong> in place of the value. That is a <strong>subquery</strong>.</p>
<ul>
  <li>A subquery is a SELECT in <strong>parentheses</strong>, without a semicolon inside.</li>
  <li>It can appear in <code>WHERE</code>, <code>HAVING</code>, <code>FROM</code> (and in INSERT/UPDATE/DELETE).</li>
  <li>One clause may contain several subqueries; subqueries can be nested.</li>
  <li><strong>No ORDER BY</strong> inside a subquery.</li>
</ul>
<div data-code="sq-simple"></div>

<h2>How many values does the subquery return?</h2>
<ul>
  <li>With <code>=, &lt;, &gt;, &lt;=, &gt;=, &lt;&gt;</code> the subquery must return <strong>exactly one value</strong> — otherwise an error.</li>
  <li>When it returns many rows — use <code>IN</code> / <code>NOT IN</code> or the quantifiers <code>ALL</code> / <code>ANY</code>.</li>
</ul>

<h2>IN, NOT IN and the NULL trap</h2>
<div data-code="sq-in"></div>
<div data-note="warn"><p><strong>NOT IN with a NULL in the list always gives an empty result.</strong> <code>x NOT IN (a, b, NULL)</code> means <code>x&lt;&gt;a AND x&lt;&gt;b AND x&lt;&gt;NULL</code>, and <code>x&lt;&gt;NULL</code> is NULL — so the whole thing is never TRUE. Fixes: <code>WHERE … IS NOT NULL</code> in the subquery (simple and safe) or <code>NOT EXISTS</code> (most elegant). <code>NVL(mgr, 0)</code> also “works”, but only if 0 is never a real value — risky.</p></div>
<p>Oracle can compare lists: <code>WHERE (sal, job) IN (SELECT MAX(sal), job FROM Emp GROUP BY job)</code> — top earner in each job. MS SQL cannot.</p>

<h2>ALL and SOME (ANY)</h2>
<ul>
  <li><code>&gt;= ALL (…)</code> — greater or equal to <strong>every</strong> value → i.e. the maximum;</li>
  <li><code>&gt;= SOME (…)</code> = <code>&gt;= ANY (…)</code> — greater or equal to <strong>any one</strong> → i.e. the minimum. SOME and ANY are synonyms.</li>
</ul>
<div data-code="sq-all-any"></div>

<h2>Subquery in FROM and CTE</h2>
<p>A subquery in FROM works like a table built “on the fly” — it needs an alias. With many such subqueries it's better to use a view or a <strong>CTE (Common Table Expression)</strong>: <code>WITH name (columns) AS (SELECT …)</code>, immediately followed by the query that uses the name.</p>
<div data-code="sq-from-cte"></div>

<h2>Correlated subqueries</h2>
<p>In a <strong>plain</strong> subquery the result does not depend on the outer query — it could be run on its own. In a <strong>correlated</strong> one the subquery refers to a column of the outer query, so (conceptually) it runs <strong>separately for each outer row</strong>.</p>
<p>Example: “in each department the person with the highest salary”. For employee row <code>a</code> we compute MAX salary in <em>their</em> department (<code>b.deptno = a.deptno</code>) and compare.</p>

<h2>EXISTS and NOT EXISTS</h2>
<p>Sometimes we don't care about the value, only about <strong>whether the subquery returns anything</strong>. <code>EXISTS (…)</code> is TRUE if at least one row exists. Inside the SELECT list we write anything (<code>1</code> or <code>'x'</code>) — rows matter, not values. The server only needs to find the first matching row.</p>
<div data-code="sq-corr"></div>
<div data-note="exam"><p>Classic NOT EXISTS tasks: “departments without employees”, “employees who are not bosses”, “clients who never bought X”. NOT EXISTS has no problem with NULL, which breaks NOT IN.</p></div>
<p>Subqueries can also be used in <code>INSERT</code> (source of rows), <code>DELETE</code> (condition) and <code>UPDATE</code> (condition or new value) — see the DML topic.</p>
`,
  cheat: `
<ul>
  <li>Subquery: <code>(SELECT …)</code> in WHERE, HAVING, FROM; no ORDER BY; can be nested.</li>
  <li>With <code>= &lt; &gt;</code> — exactly 1 value. Many values → <code>IN</code>, <code>ALL</code>, <code>ANY/SOME</code>.</li>
  <li><strong>NOT IN + NULL in the list = empty result!</strong> Add <code>WHERE col IS NOT NULL</code> or use <code>NOT EXISTS</code>.</li>
  <li><code>&gt;= ALL</code> ≈ maximum, <code>&gt;= ANY</code> ≈ minimum.</li>
  <li><code>(a, b) IN (SELECT …)</code> and <code>MAX(AVG(…))</code> — Oracle only.</li>
  <li>A subquery in FROM needs an alias. Alternatives: a view, <code>WITH x AS (…) SELECT …</code> (CTE).</li>
  <li><strong>Correlated</strong>: the subquery uses an outer column (<code>b.deptno = a.deptno</code>).</li>
  <li><code>[NOT] EXISTS (SELECT 1 …)</code> — checks whether rows exist; typical: “without…”, “never…”.</li>
</ul>
`
},

'dml': {
  title: 'DML: INSERT, UPDATE, DELETE, transactions, TRUNCATE',
  lead: 'Inserting, changing and deleting data in both dialects, committing changes and DELETE vs TRUNCATE.',
  body: `
<h2>General rule</h2>
<p>DML commands (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) always work on <strong>one table</strong>. Dialect differences are bigger here than in SELECT.</p>

<h2>INSERT</h2>
<p><strong>Full syntax</strong> — a list of columns and a list of values in the same order. You may omit columns that allow NULL, have DEFAULT, are computed or generated automatically (IDENTITY).</p>
<p><strong>Short syntax</strong> — no column list; then values must be given for <strong>all</strong> columns in <code>CREATE TABLE</code> order. The “simplification” is often illusory (e.g. with an IDENTITY column in older MS SQL).</p>
<div data-code="dml-insert"></div>
<div data-code="dml-insert-many"></div>
<div data-code="dml-insert-select"></div>
<div data-note="warn"><p><code>MAX(id) + 1</code> is a quick way to get a new key, but with many users at once two people may get the same number. Real systems use IDENTITY or sequences (DDL topic).</p></div>

<h3>A new table from a SELECT result</h3>
<div data-code="dml-ctas"></div>
<div data-note="warn"><p>In Oracle a similar syntax <code>SELECT … INTO variables</code> is used in PL/SQL to <strong>assign values to variables</strong>, not to create tables. Don't confuse them!</p></div>

<h2>UPDATE</h2>
<p><code>UPDATE table SET column = expression, … [WHERE condition]</code>. Rows for which WHERE gives TRUE are changed. <strong>No WHERE = all rows change.</strong> WHERE and SET may contain subqueries (also correlated).</p>
<div data-code="dml-update"></div>
<p>MS SQL also has <code>UPDATE … SET … FROM other_table WHERE join_condition</code> (no aggregates in SET) — see the advanced T-SQL topic.</p>

<h2>DELETE</h2>
<p><code>DELETE FROM table [WHERE condition]</code> removes <strong>whole rows</strong>. It must not violate referential integrity: if even one deleted row is referenced by a foreign key (with NO ACTION), the whole operation is blocked. First “detach” or delete the child rows.</p>
<div data-code="dml-delete"></div>

<h2>Transactions: COMMIT and ROLLBACK</h2>
<p>A <strong>transaction</strong> is a set of commands that run <em>all or none</em>.</p>
<ul>
  <li><code>COMMIT</code> — confirm (make permanent) the changes since the last COMMIT/ROLLBACK;</li>
  <li><code>ROLLBACK</code> — undo those changes.</li>
</ul>
<p>Two server modes:</p>
<ul>
  <li><strong>autocommit</strong> (MS SQL default) — each correct command commits itself; to group several commands we write <code>BEGIN TRANSACTION … COMMIT/ROLLBACK</code>;</li>
  <li><strong>no autocommit</strong> — changes are not permanent until COMMIT (in MS SQL: <code>SET IMPLICIT_TRANSACTIONS ON</code>).</li>
</ul>
<p>More on transactions: the administration lecture.</p>

<h2>TRUNCATE</h2>
<p><code>TRUNCATE TABLE table</code> removes <strong>all</strong> rows (no WHERE) and is much faster than DELETE because it doesn't lock each row. TRUNCATE belongs to <strong>DDL</strong>! Hence an important difference:</p>
<table>
  <thead><tr><th></th><th>Oracle</th><th>MS SQL Server</th></tr></thead>
  <tbody>
    <tr><td>TRUNCATE + ROLLBACK</td><td>data is <strong>gone for good</strong> (DDL is not transactional)</td><td>data <strong>comes back</strong> (DDL is transactional)</td></tr>
    <tr><td>IDENTITY counter</td><td>—</td><td>TRUNCATE <strong>resets</strong> it</td></tr>
  </tbody>
</table>
<div data-code="dml-truncate"></div>

<h2>GRANT and REVOKE</h2>
<p>For completeness: <code>GRANT</code> gives a user a right to an operation on an object, <code>REVOKE</code> takes it away. Details — the permissions lecture.</p>
`,
  cheat: `
<ul>
  <li>DML always works on <strong>one</strong> table.</li>
  <li><code>INSERT INTO t (k1, k2) VALUES (v1, v2);</code> — full syntax recommended.</li>
  <li>Many rows: MS SQL <code>VALUES (…), (…)</code>; Oracle <code>INSERT ALL INTO … INTO … SELECT * FROM dual</code>.</li>
  <li><code>INSERT … SELECT …</code> instead of VALUES. New key: <code>SELECT ISNULL/NVL(MAX(id),0)+1</code>.</li>
  <li>New table: MS SQL <code>SELECT … INTO new FROM …</code>; Oracle <code>CREATE TABLE new AS SELECT …</code>.</li>
  <li><code>UPDATE t SET k = w WHERE …</code> — without WHERE it changes everything!</li>
  <li><code>DELETE FROM t WHERE …</code> — blocked by FK (NO ACTION).</li>
  <li><code>COMMIT</code> makes permanent, <code>ROLLBACK</code> undoes. MS SQL: autocommit; <code>BEGIN TRAN</code> or <code>SET IMPLICIT_TRANSACTIONS ON</code>.</li>
  <li><code>TRUNCATE</code> = DDL, fast, no WHERE. ROLLBACK: Oracle — won't undo, MS SQL — will. MS SQL resets IDENTITY.</li>
</ul>
`
},

'ddl': {
  title: 'DDL: tables, constraints, IDENTITY and sequences',
  lead: 'CREATE / ALTER / DROP in both dialects: declaring constraints, automatic numbering, referential actions and schema changes.',
  body: `
<h2>DDL commands</h2>
<p>DDL works on <strong>objects</strong> of the database: tables, views, indexes, procedures, triggers, and in MS SQL also whole databases (<code>CREATE DATABASE</code>). The pattern is always the same:</p>
<p class="formula">CREATE | ALTER | DROP  object_type  object_name  …</p>
<p>In RBD the CASE tool created tables for you. Now we write DDL by hand — and the syntax of the two dialects differs a bit, so scripts can't always simply be moved.</p>

<h2>CREATE TABLE</h2>
<ul>
  <li>Name: max <strong>30 characters in Oracle</strong> (applies to all names, constraints too!), 128 in MS SQL.</li>
  <li>Oracle: max 1000 columns; MS SQL: max 8060 bytes per row.</li>
  <li>Start names with a Latin letter, use letters, digits and <code>_</code>. National characters and spaces are sometimes formally allowed but ask for trouble.</li>
</ul>

<h2>Integrity constraints — recap</h2>
<p>Principle: <strong>we define the rules, the DBMS enforces them</strong> — in every operation, transaction, import, no matter who runs it. Checks in the application are useful too (less network traffic), but the natural place is the server.</p>
<table>
  <thead><tr><th>Constraint</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>NOT NULL</code></td><td>the column must have a value</td></tr>
    <tr><td><code>PRIMARY KEY</code></td><td>primary key (one or more columns)</td></tr>
    <tr><td><code>FOREIGN KEY … REFERENCES t</code></td><td>foreign key to the primary key of table t</td></tr>
    <tr><td><code>UNIQUE</code></td><td>no duplicates</td></tr>
    <tr><td><code>CHECK (condition)</code></td><td>condition for inserted/updated values</td></tr>
    <tr><td><code>DEFAULT value</code></td><td>default value</td></tr>
  </tbody>
</table>
<p>Every constraint has a name unique in the database. If you don't give one, the server invents its own (ugly) name. You give your own name with <code>CONSTRAINT name</code> — handy when you later want to drop or disable it.</p>
<div data-code="ddl-inline"></div>
<div data-note="tip"><p>Multi-column constraints (e.g. a composite primary key) must be written “out of line”.</p></div>

<h2>Automatic numbering</h2>
<h3>IDENTITY (MS SQL)</h3>
<p>One column in a table can have the <code>IDENTITY(seed, increment)</code> property (default 1, 1). The server fills in consecutive numbers — in INSERT we <strong>omit</strong> that column, and trying to insert a value is an error.</p>
<div data-code="ddl-identity"></div>
<div data-note="lecture"><p>The lecturer ironically describes a typical story: a student uses the short INSERT without a column list, gets an error, “googles” <code>SET IDENTITY_INSERT … ON</code> — and has just switched off the mechanism that was supposed to do the work. Moral: write INSERT with a column list and leave IDENTITY_INSERT to administrators.</p></div>
<p>The last generated value is read with <code>SCOPE_IDENTITY()</code> (current scope — better) or <code>@@IDENTITY</code> (last in the session). Oracle also has IDENTITY since 12c — in three variants (advanced PL/SQL topic).</p>
<h3>Sequences</h3>
<p>A <strong>sequence</strong> is a separate object generating numbers, independent of tables (Oracle; MS SQL since 2012). It can be used in several tables and outside them.</p>
<div data-code="ddl-sequence"></div>

<h2>ALTER TABLE</h2>
<p>Changing columns and constraints of an existing table. Oracle uses <code>MODIFY</code> and parentheses, MS SQL — <code>ALTER COLUMN</code>. In MS SQL NOT NULL and DEFAULT are column properties/constraints; in Oracle NOT NULL and DEFAULT are column properties changed with MODIFY.</p>
<div data-code="ddl-alter"></div>
<div data-note="warn"><p>CHECK lets through values for which the condition is TRUE <strong>or NULL</strong>; it blocks only FALSE. You cannot add a new NOT NULL column to a table with rows — first add the column, fill it, then set NOT NULL (in Oracle DEFAULT helps).</p></div>
<div data-note="lecture"><p>A DEFAULT may contain constants and SQL functions (GETDATE, SYSDATE), but not column names nor T-SQL/PL/SQL functions. In Oracle a sequence cannot be used in DEFAULT (in MS SQL it can — see the Kontener table example).</p></div>

<h3>Foreign keys and referential actions</h3>
<p>A foreign key can be added later with ALTER TABLE — the only way for <strong>cyclic relationships</strong> (A points to B and B to A): first create both tables, then add the FKs.</p>
<table>
  <thead><tr><th>Action on DELETE</th><th>What happens to child rows</th><th>Oracle</th></tr></thead>
  <tbody>
    <tr><td><code>NO ACTION</code> (default)</td><td>error, delete blocked</td><td>yes</td></tr>
    <tr><td><code>CASCADE</code></td><td>deleted together with the parent (good for associative tables)</td><td>yes</td></tr>
    <tr><td><code>SET NULL</code></td><td>FK := NULL</td><td>yes</td></tr>
    <tr><td><code>SET DEFAULT</code></td><td>FK := default value</td><td><strong>no</strong></td></tr>
  </tbody>
</table>
<div data-code="ddl-fk"></div>

<h2>Disabling constraints</h2>
<p>Constraints can be disabled and data breaking them inserted — but that's a <strong>special operation</strong>, for administrators only, never a way to “bypass security”. As long as bad data is in the table, the constraint cannot be re-enabled.</p>
<div data-code="ddl-disable"></div>

<h2>DROP and a sample scenario</h2>
<p><code>DROP TABLE t</code> removes the table with its data. It fails if other tables have foreign keys to it (with NO ACTION) — drop child tables first.</p>
<div data-code="ddl-scenario"></div>
`,
  cheat: `
<ul>
  <li><code>CREATE | ALTER | DROP type name</code>. Oracle: names ≤ 30 characters.</li>
  <li>Constraints: NOT NULL, PRIMARY KEY, FOREIGN KEY … REFERENCES, UNIQUE, CHECK, DEFAULT. Name: <code>CONSTRAINT name …</code>.</li>
  <li>Multi-column constraints — “out of line”: <code>PRIMARY KEY (a, b)</code>.</li>
  <li>MS SQL: <code>INT IDENTITY(seed, step)</code>; omit in INSERT; <code>SCOPE_IDENTITY()</code>; <code>SET IDENTITY_INSERT t ON</code> — admin only.</li>
  <li>Sequences: MS SQL <code>NEXT VALUE FOR s</code>; Oracle <code>s.NEXTVAL</code>, <code>s.CURRVAL</code>.</li>
  <li>ALTER: MS SQL <code>ADD / ALTER COLUMN / DROP COLUMN</code>; Oracle <code>ADD (…) / MODIFY (…) / DROP COLUMN</code>.</li>
  <li><code>ALTER TABLE t ADD CONSTRAINT c CHECK (…)</code>; <code>DROP CONSTRAINT c</code>.</li>
  <li>CHECK blocks only FALSE (NULL passes).</li>
  <li>ON DELETE: NO ACTION (default), CASCADE, SET NULL, SET DEFAULT (not in Oracle).</li>
  <li>FK cycle → tables first, then <code>ALTER TABLE … ADD FOREIGN KEY</code>.</li>
  <li>Disabling: Oracle <code>DISABLE/ENABLE CONSTRAINT</code>; MS SQL <code>NOCHECK/CHECK CONSTRAINT</code>.</li>
  <li>DROP child tables first.</li>
</ul>
`
},

'views': {
  title: 'Views',
  lead: 'Stored queries that look like tables: creating them, DML limits, WITH CHECK OPTION and materialized views.',
  body: `
<h2>What a view is</h2>
<p>A <strong>view</strong> (Polish: perspektywa, widok) is a <strong>named SELECT definition stored in the database</strong> that can be used many times — like a table. A view <strong>stores no data</strong>, only the recipe for reading it; rows are computed at every use.</p>
<div data-note="analogy"><p>A view is a window with frosted glass in some places: each user group sees through it only the rows and columns it should — but the data still lives in the tables behind the window.</p></div>
<p>Why views:</p>
<ul>
  <li><strong>security</strong> — a user sees only their data and doesn't know the structure of the whole database;</li>
  <li><strong>convenience</strong> — you write a complex query once;</li>
  <li>a data source for controls in applications.</li>
</ul>
<div data-note="lecture"><p>Rule from the lecture: give users data through <strong>views</strong>, or even better through <strong>stored procedures</strong> — not directly from tables.</p></div>

<h2>Creating</h2>
<p class="formula">CREATE VIEW name [(column, …)] AS select_statement;</p>
<p>View column names can be given in parentheses, set by aliases in the SELECT, or taken from the original columns. Changing the definition: <code>ALTER VIEW</code> (MS SQL) or <code>CREATE OR REPLACE VIEW</code> (Oracle). Removing: <code>DROP VIEW</code>.</p>
<div data-code="v-create"></div>
<div data-code="v-order"></div>

<h2>DML through a view</h2>
<p>Codd's rule says data should be changeable through views. It is — if the view meets fairly strict conditions (then it is clear which table row to change):</p>
<ul>
  <li>no <code>DISTINCT</code>;</li>
  <li><strong>one</strong> table (or one updatable view) in FROM;</li>
  <li>only column names in the SELECT list (no expressions);</li>
  <li>no subqueries in WHERE;</li>
  <li>no <code>GROUP BY</code> and <code>HAVING</code>.</li>
</ul>
<p>A view joining Emp and Dept no longer meets these conditions. (This can be worked around with an <code>INSTEAD OF</code> trigger — triggers topic.)</p>

<h2>WITH CHECK OPTION</h2>
<p>The <code>WITH CHECK OPTION</code> clause checks on INSERT/UPDATE through the view whether the new/changed row <strong>still satisfies the view's WHERE</strong>. If not — the operation is rejected. So you cannot “push” a row out of the view through it.</p>
<div data-code="v-dml"></div>

<h2>Materialized views (Oracle only)</h2>
<p>A <strong>materialized view</strong> physically <strong>stores</strong> the query result. It is used for heavily aggregated data that takes long to compute — mainly in data warehouses. The data is always <strong>derived</strong> (a copy) from the tables. Types: read only (default) and updatable (<code>FOR UPDATE</code>). Refresh options — performance topic.</p>
<div data-code="v-mat"></div>
<div data-note="tip"><p>The MS SQL counterpart is <strong>indexed views</strong> (mentioned in the performance lecture).</p></div>
`,
  cheat: `
<ul>
  <li>View = a stored SELECT, a “virtual table”, <strong>stores no data</strong>.</li>
  <li>Why: security (only needed rows/columns), convenience. Better than views: procedures.</li>
  <li><code>CREATE VIEW v (k1, k2) AS SELECT …;</code> · <code>ALTER VIEW</code> (MS) / <code>CREATE OR REPLACE VIEW</code> (Oracle) · <code>DROP VIEW v</code>.</li>
  <li>MS SQL: ORDER BY in a view only with <code>TOP</code> (e.g. <code>TOP 99.99 PERCENT</code>).</li>
  <li>DML through a view: no DISTINCT, 1 table in FROM, plain columns, no subqueries in WHERE, no GROUP BY/HAVING.</li>
  <li><code>WITH CHECK OPTION</code> — you can't change a row so that it leaves the view.</li>
  <li><code>CREATE MATERIALIZED VIEW</code> (Oracle) — physical copy of the result, for warehouses; <code>FOR UPDATE</code> = updatable.</li>
</ul>
`
},

'functions': {
  title: 'Useful built-in functions (Supplement)',
  lead: 'Date and time, type conversion and math functions in MS SQL Server and Oracle — a cheat sheet with examples.',
  body: `
<h2>Why this topic</h2>
<p>The lecture supplement collects the most used functions of both servers. The full list is in the documentation — here is a “toolbox” for the labs.</p>
<div data-note="warn"><p>In MS SQL a function name is <strong>always</strong> followed by parentheses, even without arguments: <code>GETDATE()</code>. In Oracle some functions are written without them: <code>SYSDATE</code>, <code>CURRENT_DATE</code>.</p></div>

<h2>MS SQL Server</h2>
<table>
  <thead><tr><th>Function</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><code>GETDATE()</code>, <code>SYSDATETIME()</code></td><td>current date and time (different precision)</td></tr>
    <tr><td><code>DATENAME(part, date)</code></td><td>name of a date part as text (e.g. <code>May</code>)</td></tr>
    <tr><td><code>DATEPART(part, date)</code></td><td>date part as a number (e.g. 5)</td></tr>
    <tr><td><code>DATEDIFF(part, from, to)</code></td><td>difference <code>to − from</code> in units (year, month, day, hour…)</td></tr>
    <tr><td><code>DATEADD(part, n, date)</code></td><td>date shifted by n units</td></tr>
    <tr><td><code>DAY()</code>, <code>MONTH()</code>, <code>YEAR()</code></td><td>day, month, year</td></tr>
    <tr><td><code>CAST(x AS type)</code>, <code>CONVERT(type, x, style)</code></td><td>conversion; style = date format code (e.g. 107)</td></tr>
    <tr><td><code>ROUND(x, n[, 1])</code></td><td>round to n places; third argument ≠ 0 = truncate</td></tr>
    <tr><td><code>CEILING(x)</code>, <code>FLOOR(x)</code></td><td>up / down to an integer</td></tr>
  </tbody>
</table>
<div data-code="fn-ms"></div>

<h2>Oracle</h2>
<table>
  <thead><tr><th>Function</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><code>SYSDATE</code>, <code>CURRENT_DATE</code></td><td>current date (system / session)</td></tr>
    <tr><td><code>CURRENT_TIMESTAMP</code>, <code>LOCALTIMESTAMP</code></td><td>current time</td></tr>
    <tr><td><code>EXTRACT(YEAR FROM date)</code></td><td>a date part (YEAR, MONTH, DAY…)</td></tr>
    <tr><td><code>ADD_MONTHS(date, n)</code></td><td>date shifted by n months</td></tr>
    <tr><td><code>MONTHS_BETWEEN(d1, d2)</code></td><td>number of months between dates (a real number!)</td></tr>
    <tr><td><code>TO_CHAR</code>, <code>TO_DATE</code>, <code>TO_NUMBER</code></td><td>conversions with a format</td></tr>
    <tr><td><code>CAST(x AS type)</code></td><td>as in MS SQL, but give a length for text: <code>VARCHAR2(20)</code></td></tr>
  </tbody>
</table>
<p>The date format in Oracle depends on the session settings. You can change it: <code>ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';</code> (until the end of the session). Using <code>TO_DATE</code> with an explicit format makes code independent of these settings.</p>
<div data-code="fn-ora"></div>
<div data-note="own"><p>To filter by year: MS SQL <code>WHERE YEAR(date) = 2025</code>, Oracle <code>WHERE EXTRACT(YEAR FROM date) = 2025</code>. A range condition <code>date &gt;= '2025-01-01' AND date &lt; '2026-01-01'</code> is faster though — it can use an index (see the indexes topic).</p></div>
`,
  cheat: `
<ul>
  <li>MS SQL: <code>GETDATE()</code>, <code>DATEPART/DATENAME(part, d)</code>, <code>DATEDIFF(part, from, to)</code>, <code>DATEADD(part, n, d)</code>, <code>YEAR/MONTH/DAY(d)</code>.</li>
  <li>MS SQL: <code>CAST(x AS VARCHAR)</code>, <code>CONVERT(VARCHAR, d, 107)</code>, <code>ROUND(x, n[,1])</code>, <code>CEILING</code>, <code>FLOOR</code>, <code>ISNULL</code>.</li>
  <li>Oracle: <code>SYSDATE</code>, <code>CURRENT_DATE</code>, <code>EXTRACT(YEAR FROM d)</code>, <code>ADD_MONTHS(d, n)</code>, <code>MONTHS_BETWEEN(d1, d2)</code>.</li>
  <li>Oracle: <code>TO_CHAR(d, 'YYYY-MM-DD')</code>, <code>TO_DATE('24-02-2022','DD-MM-YYYY')</code>, <code>CAST(x AS VARCHAR2(20))</code>, <code>NVL</code>.</li>
  <li>Oracle: <code>ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD'</code> — until the session ends.</li>
  <li>MS SQL always with parentheses: <code>GETDATE()</code>; Oracle without: <code>SYSDATE</code>.</li>
</ul>
`
}

});
