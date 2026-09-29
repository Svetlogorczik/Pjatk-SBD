/* EN – Module 5: database administration (P. Lenkiewicz) */
SBD.addContent('en', {

'adm-server': {
  title: 'Server architecture and physical data organisation',
  lead: 'What happens “under the hood”: server engines, data and log files, pages, RAM buffers, write-ahead logging, filegroups and RAID.',
  body: `
<h2>What a database server consists of</h2>
<p>When a client (application, SSMS) sends an SQL command through a driver, three “engines” work on the server:</p>
<table>
  <thead><tr><th>Engine</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><strong>SQL engine</strong></td><td>parsing and compiling the command → optimisation (choosing a plan) → execution</td></tr>
    <tr><td><strong>Transaction engine</strong></td><td>concurrency (many users at once), logs, recovery after a failure</td></tr>
    <tr><td><strong>Storage engine</strong></td><td>managing files on disk and buffers in RAM (data buffer, log buffer)</td></tr>
  </tbody>
</table>

<h2>Database files (MS SQL Server)</h2>
<ul>
  <li>A server can host many databases; each database consists of <strong>data files</strong> — the first <code>.mdf</code>, the next ones <code>.ndf</code> — and a <strong>transaction log file</strong> <code>.ldf</code>.</li>
  <li>A data file is divided into <strong>8 KB pages</strong>; 8 consecutive pages form an <strong>extent</strong> (64 KB). A page is the smallest piece of data the server reads from disk.</li>
</ul>
<div data-note="lecture"><p>You will see these files in the labs: creating a database in Management Studio, filegroups, moving a table to another filegroup.</p></div>

<h2>Transaction log and write-ahead logging</h2>
<p>Transactions are written <strong>first to the log</strong>, and only then are their results written to data files. Thanks to that we can:</p>
<ul>
  <li>roll back transactions (ROLLBACK);</li>
  <li>keep consistency after a failure (e.g. a power cut);</li>
  <li>restore the database to any point in time.</li>
</ul>
<p>Every log record has an <strong>LSN</strong> number and contains, among others: operation type, transaction id, page id, the data image <em>before</em> and <em>after</em> the change. MS SQL has one Transaction Log; Oracle has two logs: <strong>undo</strong> (to roll back transactions) and <strong>redo</strong> (to recover after a failure).</p>
<p><strong>WAL (Write-Ahead Logging)</strong> — the rule that information must reach the log <strong>before</strong> the transaction is committed.</p>
<div data-note="analogy"><p>Like a cashier who first writes every operation in a notebook and only then moves the money. If something gets mixed up, the notebook tells what happened.</p></div>

<h2>Disk and RAM — buffer management</h2>
<p>Data lives on disk (RAM is expensive and volatile), but <strong>the server can work on it only in RAM</strong> — so it loads pages into the <strong>buffer pool</strong>. The algorithm:</p>
<ol class="steps">
  <li>A process needs a page. If it's already in the pool — increase its reference count and give the process a pointer.</li>
  <li>If not — choose a frame with reference count = 0 (according to the replacement strategy).</li>
  <li>If that frame is “dirty” (changed in RAM), first write it to disk.</li>
  <li>Load the needed page into the frame, set the count to 1.</li>
</ol>
<p>Changing a page sets the <strong>dirty</strong> bit. When a process releases a page, the count decreases; a page with count 0 can be replaced.</p>

<h2>Filegroups and tablespaces</h2>
<p>A <strong>filegroup</strong> (MS SQL) / <strong>tablespace</strong> (Oracle) is an intermediate layer between logical objects (tables, indexes) and physical files. One group may hold many objects, and a group has at least one file.</p>
<div data-code="adm-files"></div>

<h2>Recommendations for files and disks</h2>
<ul>
  <li>Keep the transaction log on a <strong>different disk</strong> than the data.</li>
  <li>Don't keep data or logs on the operating system disk.</li>
  <li>Tables that are often joined may go to separate disks.</li>
  <li><strong>RAID 0</strong> (striping) — faster but less safe; <strong>RAID 1</strong> (mirror) — safer, half the capacity — recommended in most cases.</li>
</ul>
`,
  cheat: `
<ul>
  <li>Engines: SQL (parse → optimise → execute), Transaction (concurrency, logs, recovery), Storage (files, buffers).</li>
  <li>MS SQL: data <code>.mdf</code> (+ <code>.ndf</code>), log <code>.ldf</code>; page 8 KB, extent = 8 pages.</li>
  <li>Log: log first, then data → ROLLBACK, consistency after failure, point-in-time restore. A record has an LSN.</li>
  <li>Oracle: undo log (rollback) + redo log (recovery).</li>
  <li><strong>WAL</strong>: write to the log before the transaction is committed.</li>
  <li>The server works on pages in RAM (buffer pool); reference count; dirty bit → write to disk before replacing.</li>
  <li>Filegroup (MS SQL: <code>ON group</code>) / tablespace (Oracle: <code>TABLESPACE t</code>).</li>
  <li>Log on a different disk than data; not on the system disk. RAID 1 recommended, RAID 0 fast but risky.</li>
</ul>
`
},

'adm-indexes': {
  title: 'Indexes and the query execution plan',
  lead: 'How the server finds data quickly: B+ tree, clustered and non-clustered, composite and covering indexes, when to create them and how to read a query plan.',
  body: `
<h2>What an index is</h2>
<p>The query <code>SELECT * FROM emp WHERE ename = 'BLAKE'</code> without an index requires scanning <strong>all</strong> rows, i.e. reading all table pages — very expensive for a large table.</p>
<p>An <strong>index</strong> is an extra structure that links column values with the physical addresses of rows (the place on disk). It works like a <strong>book index</strong>: you look a word up in an alphabetical list and immediately know the page.</p>
<div data-code="adm-idx-create"></div>

<h2>When an index is worth it</h2>
<table>
  <thead><tr><th>Worth it</th><th>Rather not</th></tr></thead>
  <tbody>
    <tr><td>on <strong>foreign keys</strong> (almost always)</td><td>on <strong>frequently updated</strong> tables (every INSERT/UPDATE/DELETE must also fix the index)</td></tr>
    <tr><td>on the primary key (created automatically)</td><td>on tables rarely searched with WHERE</td></tr>
    <tr><td>on columns often in <code>WHERE</code></td><td>on <strong>small</strong> tables</td></tr>
    <tr><td>on columns in <code>ORDER BY</code>, <code>GROUP BY</code>, <code>DISTINCT</code></td><td>on <strong>low-selectivity</strong> data (e.g. sex)</td></tr>
  </tbody>
</table>

<h2>B+ tree</h2>
<p>The most common index structure. The root and inner nodes hold “signpost” values, and the <strong>leaves</strong> hold all key values (sorted) with pointers to data. Advantages:</p>
<ul>
  <li>high branching → only a few reads from root to leaf;</li>
  <li>supports <strong>range</strong> searches (BETWEEN, &gt;, &lt;);</li>
  <li>supports <strong>sorting</strong>.</li>
</ul>

<h2>Clustered vs non-clustered index</h2>
<table>
  <thead><tr><th></th><th>Clustered</th><th>Non-clustered</th></tr></thead>
  <tbody>
    <tr><td>Data</td><td>table rows <strong>physically ordered</strong> like the index</td><td>rows in another (usually random) order; the index holds pointers</td></tr>
    <tr><td>How many per table</td><td><strong>only one</strong></td><td>many</td></tr>
    <tr><td>Best for</td><td>ranges, sorting, low-selectivity data; gives a bigger gain</td><td>queries returning single rows; foreign keys</td></tr>
  </tbody>
</table>
<div data-code="adm-idx-types"></div>
<p>Other structures: a <strong>hash index</strong> — good only for equality lookups (no ranges or sorting); a <strong>bitmap index</strong> — used in data warehouses.</p>

<h2>Composite index and the “index only” strategy</h2>
<ul>
  <li><strong>Composite index</strong> — on several columns. <strong>Order matters:</strong> the server uses it when the query refers at least to the <em>first</em> index column.</li>
  <li><strong>“Index only” strategy (covering index)</strong> — if all columns used by the query are in the index, the server doesn't read data pages at all. Often the fastest method.</li>
  <li><strong>Included columns</strong> (<code>INCLUDE</code>, MS SQL) — extra columns stored only in the leaves of a non-clustered index; they make the “index only” strategy easier.</li>
</ul>

<h2>When an index won't work</h2>
<p>If in WHERE the column is “hidden” in a function or an expression (<code>sal * 12 = 12000</code>), the server may not use the index. Rewrite the condition (<code>sal = 1000</code>) or use a function-based index (Oracle) / a computed column with an index (MS SQL).</p>
<div data-code="adm-idx-where"></div>

<h2>The query execution plan</h2>
<p>A plan is a graphical representation of how the optimiser chose to run the query, with <strong>estimated costs</strong> (CPU, I/O, total). It shows whether (and which) index was used, and lets you compare costs before and after creating an index. In the labs you look at the <em>Estimated Subtree Cost</em> of the last (leftmost) operator.</p>
<table>
  <thead><tr><th>Operator</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><strong>Table Scan</strong></td><td>the whole table was read. With a WHERE query — a hint that an index may be worth creating.</td></tr>
    <tr><td><strong>Index Seek</strong></td><td>an index was used to find specific rows — good.</td></tr>
    <tr><td><strong>Index Scan</strong></td><td>an index was used to read all rows. With WHERE — maybe another index is worth it.</td></tr>
    <tr><td><strong>Nested Loops</strong></td><td>a join with nested loops, usually using indexes.</td></tr>
    <tr><td><strong>Merge Join</strong></td><td>a join by merging sorted sets.</td></tr>
  </tbody>
</table>
<div data-code="adm-stats"></div>

<h2>Optimiser, statistics and tuning</h2>
<ul>
  <li>Oracle, MS SQL and most modern servers have a <strong>cost-based optimiser</strong>: using <strong>statistics</strong> (data distribution, row counts) it estimates which plan is fastest. Statistics must be up to date (automatically, manually or on a schedule).</li>
  <li>A programmer can give a <strong>hint</strong> on how to run a query — only in special cases.</li>
  <li><strong>Index maintenance</strong>: after many changes an index gets “fragmented”; it is rebuilt manually or (better) automatically on a schedule.</li>
  <li><strong>Tuning</strong> is a continuous process and a compromise — improving one thing may worsen another; it's not only about indexes and not only about the slowest queries, but about the overall server load. Tools like the <em>Database Engine Tuning Advisor</em> propose indexes based on a recorded workload.</li>
</ul>
<div data-note="lecture"><p>In the labs: a table with 100k random rows, comparing plans and costs — no index, a non-clustered index, a composite one, a clustered one; point lookups, ranges and sorting. General conclusion: a non-clustered index is great for single values, weak for ranges; a clustered one wins for ranges and ORDER BY.</p></div>
`,
  cheat: `
<ul>
  <li>Index = book index: value → row address. <code>CREATE [UNIQUE] INDEX i ON t (col);</code> · <code>DROP INDEX i ON t</code> (MS) / <code>DROP INDEX i</code> (Oracle).</li>
  <li>Worth it: FK, PK (auto), WHERE, ORDER BY/GROUP BY/DISTINCT. Not worth it: small tables, often changed, low-selectivity data.</li>
  <li>B+ tree: few reads, ranges, sorting.</li>
  <li><strong>CLUSTERED</strong>: data physically in order, 1 per table, ranges and sorting. <strong>NONCLUSTERED</strong>: many, single rows, FKs.</li>
  <li>Hash — equality only. Bitmap — warehouses.</li>
  <li>Composite <code>(a, b)</code>: works when WHERE uses <strong>a</strong>. “Index only” = all query columns in the index; <code>INCLUDE (…)</code> in MS SQL.</li>
  <li>A function on a column in WHERE breaks the index → rewrite / function-based index (Oracle) / computed column (MS).</li>
  <li>Plan: Table Scan (bad with WHERE), Index Seek (good), Index Scan, Nested Loops, Merge Join. Cost: Estimated Subtree Cost.</li>
  <li><code>SET STATISTICS IO ON</code> / <code>TIME ON</code>.</li>
  <li>Cost-based optimiser + up-to-date statistics; hints rarely; index maintenance; Tuning Advisor.</li>
</ul>
`
},

'adm-transactions': {
  title: 'Transactions, isolation and locks',
  lead: 'ACID, COMMIT/ROLLBACK/SAVEPOINT, autocommit, concurrency anomalies, four isolation levels, S/X locks, 2PL, deadlocks and multiversioning.',
  body: `
<h2>What a transaction is</h2>
<p>A single SQL command of one user is simple. But from the application's point of view one “operation” is often a <strong>sequence of reads and writes</strong>, and many users work on the same data at once. The server interleaves their operations (<strong>concurrency</strong>), but the effect should be as if each transaction ran alone.</p>
<p>Example from the lecture — a transfer of 1000:</p>
<ol class="steps">
  <li><code>SELECT Saldo FROM Konto WHERE IdKonta = 1234</code> — is there enough money?</li>
  <li><code>UPDATE Konto SET Saldo = Saldo − 1000 WHERE IdKonta = 1234</code></li>
  <li><code>UPDATE Konto SET Saldo = Saldo + 1000 WHERE IdKonta = 5678</code></li>
</ol>
<p>What can go wrong: a failure between steps 2 and 3 (the money disappears!) or another transaction lowers the balance between steps 1 and 2.</p>
<div data-code="adm-tx-transfer"></div>

<h2>ACID</h2>
<dl>
  <dt>A — Atomicity</dt><dd>all operations of a transaction happen, or none.</dd>
  <dt>C — Consistency</dt><dd>after the transaction the database is consistent (if it was before).</dd>
  <dt>I — Isolation</dt><dd>the result is as if nobody else worked on that data meanwhile.</dd>
  <dt>D — Durability</dt><dd>committed data survives hardware and software failures.</dd>
</dl>
<p>Mechanisms that provide this: <strong>locks</strong>, <strong>logs</strong> (e.g. the transaction log) and <strong>snapshots</strong> (several versions of the same rows).</p>

<h2>Committing and rolling back</h2>
<ul>
  <li>The server itself opens a transaction for every DML statement.</li>
  <li>Your own transaction in MS SQL: <code>BEGIN TRAN[SACTION]</code> … <code>COMMIT</code> / <code>ROLLBACK</code>.</li>
  <li><code>SAVE TRAN name</code> — a savepoint; <code>ROLLBACK TRAN name</code> rolls back only to it.</li>
  <li>By default <strong>autocommit</strong> is on (COMMIT after every DML and DDL). Turning it off: MS SQL <code>SET IMPLICIT_TRANSACTIONS ON</code>, Oracle <code>SET AUTOCOMMIT OFF</code>.</li>
</ul>
<div data-code="adm-tx-basic"></div>

<h2>Anomalies of interleaved transactions</h2>
<table>
  <thead><tr><th>Anomaly</th><th>What happens</th></tr></thead>
  <tbody>
    <tr><td><strong>Dirty read</strong></td><td>T1 writes A, T2 reads A, T1 does ROLLBACK — T2 read something that “never existed”.</td></tr>
    <tr><td><strong>Non-repeatable read</strong></td><td>T1 reads A, T2 changes A and commits, T1 reads A again — gets a different value.</td></tr>
    <tr><td><strong>Phantoms</strong></td><td>T1 reads the set of rows meeting a condition (e.g. the best-paid SALESMAN), T2 inserts a new matching row — on re-reading a “phantom” appears.</td></tr>
  </tbody>
</table>

<h2>Isolation levels (ANSI/ISO standard)</h2>
<table>
  <thead><tr><th>Level</th><th>Dirty read</th><th>Non-repeatable read</th><th>Phantoms</th></tr></thead>
  <tbody>
    <tr><td>READ UNCOMMITTED</td><td class="table__yes">YES</td><td class="table__yes">YES</td><td class="table__yes">YES</td></tr>
    <tr><td>READ COMMITTED (<strong>default</strong>)</td><td class="table__no">NO</td><td class="table__yes">YES</td><td class="table__yes">YES</td></tr>
    <tr><td>REPEATABLE READ</td><td class="table__no">NO</td><td class="table__no">NO</td><td class="table__yes">YES</td></tr>
    <tr><td>SERIALIZABLE</td><td class="table__no">NO</td><td class="table__no">NO</td><td class="table__no">NO</td></tr>
  </tbody>
</table>
<p>“YES” = the anomaly can occur. The level is set with <code>SET TRANSACTION ISOLATION LEVEL …</code>; it applies only to the current connection/procedure and from the next transaction (it's worth doing a COMMIT).</p>
<div data-code="adm-autocommit"></div>
<div data-note="exam"><p>Remember the table as “steps”: each higher level removes one more anomaly. Default = READ COMMITTED. SERIALIZABLE removes all, but limits concurrency the most.</p></div>

<h2>Locks</h2>
<ul>
  <li><strong>Shared (S)</strong> — for reading; many transactions can hold S on the same object, but then nobody can take X.</li>
  <li><strong>Exclusive (X)</strong> — for writing; only one transaction, no other locks (not even S).</li>
  <li><strong>Multi-level locks</strong>: database → table → page → row; a lock on an “inner” object implies some lock on the outer object.</li>
</ul>
<h3>Strict 2PL (strict two-phase locking)</h3>
<ol class="steps">
  <li>Before reading an object a transaction takes S, before writing — X. Whoever cannot get a lock waits in a queue or is rolled back.</li>
  <li>All locks are released <strong>at once</strong> — at COMMIT or ROLLBACK.</li>
</ol>
<p>Two phases: acquiring locks (and working) → releasing everything at the end.</p>
<h3>Deadlock</h3>
<p>A cycle of transactions waiting for each other's locks (T1 waits for T2, T2 for T1). Ways to deal with it: <strong>prevention</strong>, <strong>detection</strong> (the server picks a “victim” and rolls it back), <strong>timeout</strong>.</p>
<p>The DBMS takes locks automatically (depending on the isolation level), but you can also do it manually:</p>
<div data-code="adm-locks"></div>

<h2>Multiversioning</h2>
<p>Instead of blocking readers: a writing process creates a <strong>new version</strong> of an object, and readers keep using the old one (from a version store). Reads take no locks, don't block writes and aren't blocked by them — fewer deadlocks.</p>
<ul>
  <li>MS SQL: the <code>SNAPSHOT</code> level — optimistic locking: reads work on a snapshot from the start of the transaction; if someone else changed the same data meanwhile, the SNAPSHOT transaction gets an error.</li>
  <li>Oracle: at READ COMMITTED queries take no shared locks — it uses multiversioning; also <code>SET TRANSACTION READ ONLY</code>.</li>
  <li><strong>Database snapshot</strong> (MS SQL) — a static, read-only image of the database at a point in time: for reports, analyses, protection against mistakes; takes only as much space as the data that changed.</li>
</ul>
<div data-note="lecture"><p>In the labs: two SSMS tabs, <code>IMPLICIT_TRANSACTIONS ON</code>, UPDATE in one window → SELECT in the other waits for the lock until COMMIT; READ UNCOMMITTED → uncommitted data is visible; SERIALIZABLE → even a SELECT blocks an INSERT (no phantoms). Before each exercise do COMMIT in both windows.</p></div>
`,
  cheat: `
<ul>
  <li>Transaction = a sequence of operations, “all or nothing”. <strong>ACID</strong>: atomicity, consistency, isolation, durability.</li>
  <li>MS SQL: <code>BEGIN TRAN … COMMIT / ROLLBACK</code>; <code>SAVE TRAN x</code> + <code>ROLLBACK TRAN x</code>.</li>
  <li>Autocommit by default. Off: <code>SET IMPLICIT_TRANSACTIONS ON</code> (MS), <code>SET AUTOCOMMIT OFF</code> (Oracle).</li>
  <li>Anomalies: dirty read, non-repeatable read, phantoms.</li>
  <li>READ UNCOMMITTED (all) → READ COMMITTED (<strong>default</strong>, no dirty) → REPEATABLE READ (+ no non-repeatable) → SERIALIZABLE (none).</li>
  <li><code>SET TRANSACTION ISOLATION LEVEL …</code> — from the next transaction, in this connection.</li>
  <li>Locks: S (read, many), X (write, one, excludes S). Multi-level: DB/table/page/row.</li>
  <li><strong>Strict 2PL</strong>: S before reading, X before writing; release everything at COMMIT/ROLLBACK.</li>
  <li><strong>Deadlock</strong>: a waiting cycle → prevention / detection / timeout.</li>
  <li>Multiversioning: MS <code>SNAPSHOT</code> (optimistic), Oracle READ COMMITTED without S, <code>READ ONLY</code>; database snapshot.</li>
</ul>
`
},

'adm-backup-security': {
  title: 'Backups and permissions',
  lead: 'Why and how to back up: full, differential, log; restore order, NORECOVERY and point in time. Logins, users, roles, GRANT/REVOKE/DENY and schemas.',
  body: `
<h2>Why backups</h2>
<ul>
  <li>to minimise losses after a <strong>failure</strong> (hardware, software, viruses);</li>
  <li>to undo the effects of a <strong>user error</strong> (e.g. accidentally deleted rows);</li>
  <li>as an <strong>archive</strong>.</li>
</ul>
<p>The administrator plans a backup <strong>strategy</strong> considering: how often data changes, how important it is, what downtime is acceptable, how big the database is, what hardware we have and when the database is least loaded.</p>

<h2>Backup types (MS SQL)</h2>
<table>
  <thead><tr><th>Backup</th><th>Contains</th></tr></thead>
  <tbody>
    <tr><td><strong>Full</strong></td><td>the whole database</td></tr>
    <tr><td><strong>Differential</strong></td><td>changes since the last <strong>full</strong> backup</td></tr>
    <tr><td><strong>Transaction log</strong></td><td>all log records since the previous log backup</td></tr>
  </tbody>
</table>
<p>You can back up the whole database or only selected files / filegroups.</p>
<h3>Transaction log backup</h3>
<ul>
  <li>When it runs, the log is <strong>truncated</strong> — without log backups the log grows forever.</li>
  <li>It lets you restore the database state at <strong>any moment</strong>.</li>
  <li>To restore it you first need a restored full backup.</li>
  <li>It can be the “last resort”: if after a failure you can still back up the log, nothing is lost.</li>
  <li>It requires the database recovery model <strong>Full</strong> (Properties → Options → Recovery model).</li>
</ul>
<h3>Sample strategies</h3>
<ul>
  <li>full every day at 1:00 + log 4× a day (working hours);</li>
  <li>full on Sunday at 1:00 + differential every day at 1:00 + log 4× a day;</li>
  <li>full file1 on Sunday, full file2 on Wednesday, differential on other days + log 4× a day.</li>
</ul>
<div data-code="adm-backup"></div>

<h2>Restoring</h2>
<p><strong>The order is very important:</strong></p>
<ol class="steps">
  <li>the last available <strong>full</strong> backup;</li>
  <li>the last available <strong>differential</strong> backup (if any);</li>
  <li><strong>all</strong> log backups taken after the last differential (or full), in order.</li>
</ol>
<p>Every backup except the last is restored <code>WITH NORECOVERY</code> — the database is then unavailable to users, but you can restore further backups. The last one — <code>WITH RECOVERY</code> (default), and the database becomes available. A log backup can be restored <strong>to a point in time</strong>: <code>WITH STOPAT = 'date'</code>.</p>
<div data-code="adm-restore"></div>
<div data-note="lecture"><p>In the labs this is done in Management Studio: Tasks → Back Up (type: Full / Differential / Transaction Log), then Restore Database → From Device. The point in time is chosen in “To a point in time” — just before the change, but not earlier than the full backup.</p></div>

<h2>Permissions</h2>
<table>
  <thead><tr><th>Command</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>GRANT</code></td><td>grants a permission</td></tr>
    <tr><td><code>REVOKE</code></td><td>takes away a (previously granted) permission</td></tr>
    <tr><td><code>DENY</code></td><td>explicitly <strong>forbids</strong> — stronger than GRANT (MS SQL only)</td></tr>
  </tbody>
</table>
<h3>Users and logins</h3>
<ul>
  <li><strong>MS SQL — two levels:</strong> a <em>login</em> (an account to log in to the <strong>server</strong>) and a <em>user</em> (a user in a specific <strong>database</strong>, mapped to a login). A login alone gives no access to user databases.</li>
  <li><strong>Oracle:</strong> <code>CREATE USER … IDENTIFIED BY password</code> — a user is also the account.</li>
</ul>
<h3>Roles and schemas</h3>
<ul>
  <li><strong>Role</strong> — a named group of permissions; makes managing many users easier: grant rights to the role, add users to the role.</li>
  <li><strong>Schema</strong> — a container of objects (tables, views…). Every object belongs to a schema (default <code>dbo</code>), every user has a default schema. An object from another schema: <code>schema.object</code>. Schemas allow granting permissions collectively.</li>
</ul>
<div data-code="adm-security"></div>
<div data-note="exam"><p>DENY at the role level + GRANT at the user level → the user <strong>cannot</strong> run the operation (DENY wins). This is one of the lab tasks.</p></div>
`,
  cheat: `
<ul>
  <li>Backup: full (everything), <strong>differential</strong> (since the last full), <strong>log</strong> (since the last log backup; truncates the log; Full model).</li>
  <li><code>BACKUP DATABASE b TO DISK = '…' [WITH DIFFERENTIAL];</code> · <code>BACKUP LOG b TO DISK = '…';</code></li>
  <li>Restore: full → last differential → all logs in order.</li>
  <li>All but the last: <code>WITH NORECOVERY</code>; the last: <code>WITH RECOVERY</code>.</li>
  <li>Point in time: <code>RESTORE LOG … WITH STOPAT = '…'</code>.</li>
  <li>Strategies: e.g. full nightly + log 4× a day; or full on Sunday + daily differential + log.</li>
  <li>GRANT / REVOKE / DENY (DENY &gt; GRANT, MS SQL only).</li>
  <li>MS SQL: <code>CREATE LOGIN … WITH PASSWORD</code> (server) + <code>CREATE USER … FOR LOGIN</code> (database). Oracle: <code>CREATE USER … IDENTIFIED BY</code>.</li>
  <li>Role: <code>CREATE ROLE r; GRANT … TO r;</code> + members. Schema: a container, default <code>dbo</code>, <code>schema.object</code>.</li>
</ul>
`
},

'adm-performance': {
  title: 'Performance: materialisation, denormalisation, partitioning, tips',
  lead: 'Advanced ways to speed up a database and practical performance tips from the lecture.',
  body: `
<h2>How to measure query performance</h2>
<p>Besides the plan cost, MS SQL offers:</p>
<ul>
  <li><code>SET STATISTICS IO ON</code> — scan count, <strong>logical reads</strong> (pages read from buffer and disk), <strong>physical reads</strong> (pages that had to be fetched from disk), read-ahead reads (pre-fetched into the buffer);</li>
  <li><code>SET STATISTICS TIME ON</code> — parse, compile and execution time.</li>
</ul>

<h2>Materialisation</h2>
<p><strong>Materialisation</strong> = permanently storing (partially) computed results for faster later use. It can be done with DBMS mechanisms (materialized views in Oracle, indexed views in MS SQL) or by hand (an extra table updated by triggers or on a schedule).</p>
<ul>
  <li>immediate update — data is current but expensive;</li>
  <li>periodic update — cheaper, but results may be out of date.</li>
</ul>
<p>It is deliberate <strong>redundancy</strong>!</p>
<div data-code="adm-matview"></div>

<h2>Denormalisation</h2>
<p><strong>Denormalisation</strong> is a deliberate giving-up of normalisation to improve performance (e.g. in data warehouses): extra tables or columns with data computable from other data. In a denormalised schema the <strong>programmer</strong>, not the DBMS, must keep data consistent.</p>

<h2>Function-based index and included columns</h2>
<p>Reminder: when WHERE contains a function on a column, Oracle allows a function-based index (<code>CREATE INDEX x ON emp (sal * 12)</code>), MS SQL — a computed column with an index. In MS SQL <code>INCLUDE (…)</code> adds columns to index leaves and helps the “index only” strategy.</p>

<h2>Partitioning</h2>
<p><strong>Partitioning</strong> splits a table physically into parts (e.g. on separate disks) — horizontally, i.e. by rows. The sets are smaller, so queries on subsets are faster. Recommended for <strong>very large</strong> tables.</p>
<p>Example: a huge sales table; users usually ask about one month → 12 partitions. The key question: how to choose the <strong>partitioning key</strong>. Partitions are defined by: a range of values (Oracle, MS SQL), a list of values (Oracle), a hash function (Oracle).</p>
<div data-code="adm-partition"></div>

<h2>Fill factors</h2>
<ul>
  <li>Oracle: <code>PCTFREE</code> — how many % of space to leave free in each block (for future UPDATEs); <code>PCTUSED</code> — when a block is “free” again for INSERT. For tables and indexes.</li>
  <li>MS SQL: <code>FILLFACTOR</code> — how full to fill index pages.</li>
</ul>
<div data-code="adm-fill"></div>

<h2>Performance tips (from the lecture)</h2>
<h3>1. Indexes</h3>
<ul>
  <li>create them on foreign keys and on columns in WHERE, ORDER BY, GROUP BY, DISTINCT;</li>
  <li>limit them on small and frequently updated tables;</li>
  <li>maintain indexes; consider “index only” for frequently repeated queries;</li>
  <li>clustered ones give the biggest gain for ranges and sorting.</li>
</ul>
<h3>2. Transactions</h3>
<ul>
  <li>transactions should be <strong>short</strong> (sometimes several short ones instead of one long);</li>
  <li>don't set a high isolation level “just in case”;</li>
  <li>read-only transactions — on a mirror copy or with snapshots.</li>
</ul>
<h3>3. Files</h3>
<ul>
  <li>log, data and system — on separate disks; consider a separate file/disk for indexes; often-joined tables on different disks.</li>
</ul>
<h3>4. SQL</h3>
<ul>
  <li>avoid subqueries when possible; limit functions and complex expressions in WHERE;</li>
  <li>don't use DISTINCT without need;</li>
  <li>triggers — only when necessary and written optimally;</li>
  <li>avoid cursors — a cursor solution is almost always slower than even a complex query;</li>
  <li>temporary tables help when an intermediate result is used many times — but not when one statement is enough.</li>
</ul>
<h3>5. Materialisation</h3>
<ul>
  <li>for repeated complex queries consider a denormalised table with precomputed data (updated by triggers or periodically) or materialized / indexed views.</li>
</ul>
<h3>6. Application design</h3>
<ul>
  <li>don't fetch data “just in case” — filter on the server;</li>
  <li>sorting, joins, grouping are done faster by the server than by the client;</li>
  <li>a series of SQL statements → one stored procedure;</li>
  <li>don't open a new connection for every statement.</li>
</ul>
`,
  cheat: `
<ul>
  <li><code>SET STATISTICS IO ON</code> (logical/physical reads), <code>SET STATISTICS TIME ON</code>.</li>
  <li><strong>Materialisation</strong> = storing computed results (Oracle materialized view, MS indexed view, table + trigger). Immediate (expensive) or periodic (stale). Redundancy!</li>
  <li><code>CREATE MATERIALIZED VIEW … BUILD IMMEDIATE|DEFERRED REFRESH FAST|COMPLETE|FORCE ON DEMAND|ON COMMIT AS SELECT …</code></li>
  <li><strong>Denormalisation</strong>: deliberate, for performance; the programmer keeps consistency.</li>
  <li>Function-based index (Oracle) / computed column (MS); <code>INCLUDE</code>.</li>
  <li><strong>Partitioning</strong>: horizontal split of big tables; range (both), list, hash (Oracle). <code>PARTITION BY RANGE (col) (PARTITION p1 VALUES LESS THAN (…), …)</code>.</li>
  <li><code>PCTFREE/PCTUSED</code> (Oracle), <code>FILLFACTOR</code> (MS).</li>
  <li>Tips: indexes on FK and WHERE; short transactions; log on a separate disk; no cursors, no needless DISTINCT and subqueries; procedures instead of statement series; filter on the server.</li>
</ul>
`
}

});
