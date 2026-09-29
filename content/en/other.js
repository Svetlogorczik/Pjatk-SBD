/* EN – Module 6: extra topics */
SBD.addContent('en', {

'distributed': {
  title: 'Distributed databases',
  lead: 'A database in one place or many? Standby databases (log shipping, mirroring), replication in MS SQL, links to remote databases and the 2PC protocol.',
  body: `
<div data-note="lecture"><p>This topic is lecture-only — no labs. Worth knowing for the exam (pros/cons, replication types, 2PC).</p></div>

<h2>Centralised vs distributed database</h2>
<table>
  <thead><tr><th></th><th>Centralised (one node)</th><th>Distributed (many nodes, part of the data replicated)</th></tr></thead>
  <tbody>
    <tr><td>Pros</td><td>one control system = easy consistency; proven transaction and recovery algorithms</td><td>data closer to the user (faster queries); local control over own data; higher availability (replicas)</td></tr>
    <tr><td>Cons</td><td>long waits from remote nodes; no local control; heavy network traffic</td><td>consistency is harder; transactions and recovery more complex; updating replicas</td></tr>
  </tbody>
</table>
<p>Example from the lecture: a company's HR — the Gdańsk office keeps data for Northern Poland, Kraków for the South, Warsaw for the Centre; the company structure is replicated in every node, and country-wide reports are made periodically.</p>
<div data-note="lecture"><p>Codd's rule 11 (distribution independence) talked about this almost 60 years ago.</p></div>

<h2>Standby databases (MS SQL)</h2>
<dl>
  <dt>Log Shipping</dt><dd>automatic, regular transaction log backups restored on another server (or several). The standby can take over after a failure or serve as a read-only database (reports, analyses). Delay = log backup frequency.</dd>
  <dt>Mirroring</dt><dd>a mirror database on another server, changes sent immediately (no or minimal delay), a fully transactional setup is possible; after a failure the standby takes over the main role (even automatically).</dd>
</dl>

<h2>Replication (MS SQL)</h2>
<p>It lets you build a truly distributed database: we replicate chosen tables, procedures, views — and with filters even specific columns and rows. Terms: <strong>publisher</strong> (source), <strong>distributor</strong>, <strong>subscriber</strong> (receiver), <strong>publication</strong> (a set of articles).</p>
<table>
  <thead><tr><th>Type</th><th>How it works</th><th>When</th></tr></thead>
  <tbody>
    <tr><td><strong>Snapshot</strong></td><td>creates a full image of the data every time and sends it all, overwriting the subscriber's data; does not analyse changes</td><td>not too big tables, subscribers change nothing, infrequent sync; needs high bandwidth</td></tr>
    <tr><td><strong>Transactional</strong></td><td>a snapshot at the start, then tracking INSERT/UPDATE/DELETE in the log and sending changes in order; delay usually &lt; 1 min</td><td>little data transferred, near real-time</td></tr>
    <tr><td><strong>Merge</strong></td><td>changes can also be made at subscribers; they are merged and sent to everyone; <strong>conflicts</strong> are possible (by default the publisher wins, priorities or manual resolution can be set)</td><td>the most advanced</td></tr>
  </tbody>
</table>

<h2>Linking to a remote database</h2>
<p>Oracle — <strong>Database Link</strong>, MS SQL — <strong>Linked Server</strong>. Ordinary SQL works on remote data (SELECT, UPDATE, joins with local tables).</p>
<div data-code="dist-link"></div>

<h2>Distributed transactions and the 2PC protocol</h2>
<p>A transaction spanning several servers (MS SQL: <code>BEGIN DISTRIBUTED TRANSACTION</code>) uses the <strong>two-phase commit protocol (2PC)</strong>. The node that started the transaction is the <strong>coordinator</strong>.</p>
<ol class="steps">
  <li><strong>Phase 1 — voting:</strong> the coordinator sends <code>prepare</code>. Each node writes <code>prepare</code> or <code>abort</code> to its log and answers <code>yes</code> or <code>no</code>.</li>
  <li><strong>Phase 2 — completion:</strong> if <em>everyone</em> answered yes — the coordinator writes <code>commit</code> to its log and sends commit; otherwise it writes and sends <code>abort</code>.</li>
  <li>The nodes write commit/abort and end, then send <code>ack</code>. After all acks the coordinator writes <code>end</code>.</li>
</ol>
<p>Any node can decide to abort. Every decision is <strong>written to the log first</strong> and only then sent — that makes it failure-proof.</p>
<div data-note="analogy"><p>Like a wedding: the official (coordinator) asks both “do you?” (phase 1). Only when both say “yes” does he announce the marriage (phase 2). One “no” — and it's off.</p></div>
`,
  cheat: `
<ul>
  <li>Centralised: easy consistency, but slow from afar and heavy traffic. Distributed: data closer, local control, availability — but hard consistency and transactions.</li>
  <li><strong>Log shipping</strong>: periodic log backups to a standby (delay). <strong>Mirroring</strong>: immediate sync, automatic failover.</li>
  <li>MS SQL replication: <strong>snapshot</strong> (everything, overwrites), <strong>transactional</strong> (changes from the log, &lt; 1 min), <strong>merge</strong> (changes everywhere, conflicts, publisher wins).</li>
  <li>Oracle <code>CREATE DATABASE LINK l CONNECT TO u IDENTIFIED BY p USING 'svc';</code> → <code>emp@l</code>. MS SQL: Linked Server, <code>server.db.schema.table</code>.</li>
  <li><code>BEGIN DISTRIBUTED TRANSACTION</code> → <strong>2PC</strong>: prepare/vote → commit/abort → ack/end. Log first, then message.</li>
</ul>
`
},

'warehouses': {
  title: 'Data warehouses (introduction)',
  lead: 'Why a transactional system can’t answer strategic questions, what a data warehouse is, OLTP vs OLAP, the multidimensional model, the cube, star and snowflake.',
  body: `
<div data-note="lecture"><p>One lecture (A. Chądzyńska-Krasowska), only an introduction — SBD doesn't go deeper.</p></div>

<h2>The problem: data yes, information no</h2>
<p><strong>OLTP</strong> (transactional, operational) systems answer <strong>operational questions</strong> very well: how many orders are pending? which product is out of stock? what's the status of an order? how many clients do we have?</p>
<p>But they don't answer <strong>strategic questions</strong>: which products are gaining and which losing popularity? which categories are seasonal? does something sell better in certain regions? who are our best clients? which clients are likely to leave soon?</p>
<p>The solution: a system into which we load selected, integrated data from different sources and keep it for a long time — a <strong>data warehouse</strong>.</p>

<h2>Definition (Bill Inmon, 1992)</h2>
<p>A data warehouse is a database supporting decision making, which is:</p>
<dl>
  <dt>subject-oriented</dt><dd>data concerns a subject (e.g. sales), not activities (e.g. taking orders); it is organised for specific analyses.</dd>
  <dt>nonvolatile</dt><dd>once loaded, data usually doesn't change — only new portions are added; the same query returns the same result.</dd>
  <dt>integrated</dt><dd>data is uniform: dates in one format, the same character encoding, the same information in the same form.</dd>
  <dt>time-variant</dt><dd>successive layers of data from many years; every fact has the time of the event (if the source lacks it — it must be added).</dd>
</dl>

<h2>OLTP vs OLAP</h2>
<p><strong>OLTP</strong> (On-Line Transaction Processing) — reliable processing of many transactions and data consistency. <strong>OLAP</strong> (On-Line Analytical Processing) — multidimensional analysis of huge amounts of data.</p>
<table>
  <thead><tr><th></th><th>OLTP</th><th>OLAP (warehouse)</th></tr></thead>
  <tbody>
    <tr><td>Users</td><td>clerks, IT staff — thousands</td><td>managers, analysts — hundreds</td></tr>
    <tr><td>Purpose</td><td>daily work</td><td>decision support</td></tr>
    <tr><td>Design</td><td>activity-oriented</td><td>subject-oriented</td></tr>
    <tr><td>Schema</td><td>normalised, many tables, many join paths</td><td>normalisation not required, few tables, one join path</td></tr>
    <tr><td>Data</td><td>current, detailed; no history</td><td>historical, aggregated, integrated; full history</td></tr>
    <tr><td>Freshness</td><td>immediate</td><td>with a delay (e.g. daily)</td></tr>
    <tr><td>Operations</td><td>frequent INSERT/UPDATE/DELETE of single rows</td><td>practically only reads; data loaded in batches</td></tr>
    <tr><td>Queries</td><td>many simple, very short</td><td>few, but on huge data (seconds – hours)</td></tr>
    <tr><td>Size</td><td>100 MB – GB</td><td>100 GB – TB</td></tr>
  </tbody>
</table>
<p>That's why it is recommended to <strong>separate</strong> the warehouse from operational systems: heavy OLAP queries would slow OLTP, and OLTP concurrency and recovery mechanisms don't suit analyses.</p>

<h2>Why a company needs a warehouse</h2>
<ul>
  <li>business analyses (reports, trends, finance) <strong>without loading</strong> transactional systems;</li>
  <li>decision support (DS), simulations, knowledge discovery (KDD, data mining);</li>
  <li>a complete picture of the company from many sources;</li>
  <li>access to historical data (also for legal reasons);</li>
  <li>unified definitions — no more “many versions of the truth” (e.g. gross churn = deactivations vs net churn = deactivations − reactivations).</li>
</ul>

<h2>Multidimensional model</h2>
<ul>
  <li><strong>Fact</strong> — a single event (a sale, a bank operation), described by <strong>measures</strong> — numbers (quantity, amount, profit).</li>
  <li><strong>Dimensions</strong> — what we analyse along (product, client, region, time). They are described by attributes which form <strong>hierarchies</strong> (category → product; year → quarter → month → date; country → province → city).</li>
  <li><strong>OLAP cube</strong> — an n-dimensional array: edges are dimensions, cells hold measure summaries. Pick two dimensions and you get a report table.</li>
</ul>

<h2>Designing a warehouse — 4 steps</h2>
<ol class="steps">
  <li>Business requirements and the warehouse <strong>subject</strong> (e.g. sales).</li>
  <li><strong>Grain</strong> — the level of detail of a fact (each transaction separately, or a client's purchases of a product on a given day together?).</li>
  <li><strong>Dimensions</strong>, their attributes and hierarchies.</li>
  <li><strong>Measures</strong> — should be additive (at least partly).</li>
</ol>

<h2>Schemas: star, snowflake, constellation</h2>
<ul>
  <li><strong>Star</strong> — in the middle a <strong>fact table</strong> (dimension keys + measures; normalised, measures additive), around it <strong>dimension tables</strong> (denormalised).</li>
  <li><strong>Snowflake</strong> — a step towards normalisation: hierarchies moved to separate tables (e.g. Category separate from Product).</li>
  <li><strong>Fact constellation</strong> — several fact tables (e.g. Sales, Profit) sharing dimensions (e.g. Time).</li>
</ul>
<div data-code="dw-star"></div>
<div data-code="dw-query"></div>
<p>Kimball recommended a pure star (performance, simplicity for users); snowflake supporters say business people think in hierarchies. The designer decides. The dimensional model is easy to understand, unambiguous, close to how business sees the company, and usually performs well.</p>

<h2>Aggregates</h2>
<p><strong>Aggregation</strong> = precomputing measures useful in analyses (e.g. monthly sales per category). The transactional approach says “don't store what you can compute”, the analytical one — “store it if it significantly speeds up analyses”. Problems: which aggregates to choose (user requirements, statistics) and how users should know they exist (an aggregate navigator).</p>
`,
  cheat: `
<ul>
  <li>OLTP → operational questions; warehouse (OLAP) → strategic questions.</li>
  <li>Inmon 1992: warehouse = <strong>subject-oriented, nonvolatile, integrated, time-variant</strong>.</li>
  <li>OLTP: thousands of users, normalised, current data, many short DMLs. OLAP: hundreds of analysts, few tables, history, almost only reads, batch loading, TBs. Keep them separate.</li>
  <li><strong>Fact</strong> + <strong>measures</strong> (numbers, additive) analysed along <strong>dimensions</strong> (product, client, region, time) with hierarchies.</li>
  <li>OLAP cube: dimensions = edges, cells = summaries.</li>
  <li>Design: subject → grain → dimensions/hierarchies → measures.</li>
  <li><strong>Star</strong>: fact table + denormalised dimensions. <strong>Snowflake</strong>: hierarchies in separate tables. <strong>Constellation</strong>: several fact tables, shared dimensions.</li>
  <li>Aggregates = precomputed measures (speed at the cost of space).</li>
</ul>
`
},

'object-lob': {
  title: 'Object features and large objects (LOB)',
  lead: 'The object-relational model in Oracle: object types, methods, inheritance, object tables, REF and VARRAY, and storing large data in CLOB/BLOB.',
  body: `
<div data-note="own"><p>This topic comes from the “SBD_W13 Obiektowe-LOB” slides of the previous course edition. It was not mentioned in the plan announced at the first 2026/27 lecture — treat it as a supplement.</p></div>

<h2>Why objects in a database</h2>
<p>The <strong>SQL:1999</strong> standard is based on the <strong>object-relational</strong> model. Object types provide two kinds of abstraction:</p>
<ul>
  <li><strong>procedural abstraction</strong> — algorithm details are hidden in procedures/functions; changing a procedure doesn't require changing the application;</li>
  <li><strong>data abstraction</strong> — a complex data structure is hidden from the user.</li>
</ul>
<p>Benefits: easier modelling of business objects, modularity, reusable components, server code grouped around the data, and above all a <strong>smaller mismatch</strong> between the database model and an object-oriented application (the same concepts: class = object type, instance = object).</p>

<h2>Object type</h2>
<p>It consists of a <strong>specification</strong> (<code>CREATE TYPE … AS OBJECT</code> — attributes and method headers) and a <strong>body</strong> (<code>CREATE TYPE BODY</code> — method implementation). An attribute can be another object type.</p>
<p><strong>Methods</strong> are functions/procedures in a type:</p>
<ul>
  <li><code>MEMBER</code> — work on a specific object;</li>
  <li><code>CONSTRUCTOR</code> — create an object (the default constructor has the type's name: <code>name_typ('Jan', 'Kowalski', 'JK')</code>);</li>
  <li><code>STATIC</code> — concern the whole type, not an object.</li>
</ul>
<div data-code="obj-type"></div>
<p>An <strong>object table</strong> (<code>CREATE TABLE t OF type</code>) stores objects as rows; ordinary INSERT/UPDATE/DELETE/SELECT work on it, and methods are called through an alias: <code>nt.full_name()</code>. <code>VALUE(alias)</code> returns the whole object. An object can also be a <strong>column</strong> of an ordinary relational table.</p>

<h2>Inheritance</h2>
<ul>
  <li><code>NOT FINAL</code> — the type can be inherited from; <code>UNDER base_type</code> — a subtype; <code>FINAL</code> — end of the hierarchy.</li>
  <li><code>NOT INSTANTIABLE</code> — an abstract type or method (no objects/implementation); <code>OVERRIDING</code> — overriding a method in a subtype.</li>
</ul>
<div data-code="obj-inherit"></div>

<h2>REF and collections</h2>
<ul>
  <li><code>REF type</code> — a pointer (reference) to an object in an object table; <code>SCOPE IS table</code> limits which table it may point to. The object counterpart of a foreign key.</li>
  <li><code>VARRAY(n) OF type</code> — an array with a maximum size n.</li>
</ul>
<div data-code="obj-ref"></div>

<h2>Large objects (LOB)</h2>
<p>Large data is stored in LOB types: <strong>CLOB</strong> — large text (a CV, a description), <strong>BLOB</strong> — binary data (photos, files). The row holds a <strong>locator</strong> (pointer), and the data itself can live separately.</p>
<ul>
  <li><code>EMPTY_CLOB()</code> / <code>EMPTY_BLOB()</code> — initialise an empty LOB (unlike NULL — you can write into an empty LOB);</li>
  <li>operations on the content: the <strong><code>DBMS_LOB</code></strong> package (e.g. <code>GETLENGTH</code>, <code>WRITE</code>) — the locator must be fetched with <code>SELECT … FOR UPDATE</code>;</li>
  <li>ordinary DML also works: UPDATE (e.g. copying a CLOB from another row), DELETE, TRUNCATE, DROP.</li>
</ul>
<div data-code="obj-lob"></div>
<p>In MS SQL the counterparts are <code>VARCHAR(MAX)</code>, <code>NVARCHAR(MAX)</code> and <code>VARBINARY(MAX)</code>, and a file can be loaded with <code>OPENROWSET(BULK …, SINGLE_BLOB)</code>.</p>
`,
  cheat: `
<ul>
  <li>SQL:1999 = object-relational model. Procedural + data abstraction; smaller mismatch DB ↔ OO application.</li>
  <li><code>CREATE TYPE t AS OBJECT (attributes, MEMBER FUNCTION f RETURN …);</code> + <code>CREATE TYPE BODY t AS … END;</code></li>
  <li>Methods: MEMBER (object), CONSTRUCTOR (creation, <code>t(…)</code>), STATIC (type).</li>
  <li><code>CREATE TABLE x OF t;</code> — object table; <code>alias.method()</code>, <code>VALUE(alias)</code>.</li>
  <li>Inheritance: <code>NOT FINAL</code>, <code>UNDER</code>, <code>FINAL</code>, <code>NOT INSTANTIABLE</code>, <code>OVERRIDING</code>.</li>
  <li><code>REF t</code> + <code>SCOPE IS table</code> — pointer to an object; <code>VARRAY(n) OF t</code>.</li>
  <li>LOB: <code>CLOB</code> (text), <code>BLOB</code> (binary); <code>EMPTY_CLOB()</code>; <code>DBMS_LOB.WRITE/GETLENGTH</code> after <code>SELECT … FOR UPDATE</code>.</li>
  <li>MS SQL: <code>VARCHAR(MAX)</code>, <code>VARBINARY(MAX)</code>, <code>OPENROWSET(BULK …)</code>.</li>
</ul>
`
}

});
