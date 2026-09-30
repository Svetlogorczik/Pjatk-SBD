/* EN – pages: home (legend), passing the course, exercises intro */
SBD.addPages('en', {

home: {
  news: `
<div data-note="info" data-label="News · 29.09.2026">
  <p>The first lecture of the semester took place (a recap of Relational Databases). Next week — a second recap, then the procedural languages T-SQL and PL/SQL. The lecturer announced the materials (slides + a file about normalization) in EDUX. <a href="#/course">All rules and dates →</a></p>
</div>`,
  legend: `
<div data-note="lecture"><p>Something said during the lecture or present in the lecturer's slides (e.g. a remark or an example from the recording).</p></div>
<div data-note="exam"><p>Something that is easy to ask at the exam or needed in the labs.</p></div>
<div data-note="warn"><p>A typical mistake — better remember it before you make it.</p></div>
<div data-note="tip"><p>A practical tip or a plain-words explanation with an example.</p></div>
<div data-note="own"><p>Material added by the site author — <strong>it is not in the lectures</strong> (recommendations, extra examples, the quiz, the calculator).</p></div>`
},

course: {
  title: 'Passing the course, the exam and dates',
  lead: 'Everything known about passing Database Systems (SBD) in the 2026/27 winter semester — with the source of each piece of information.',
  body: `
<p><span class="status status--confirmed">EDUX — confirmed</span> <span class="status status--lecture">from the 29.09.2026 recording</span> <span class="status status--estimated">estimated</span> <span class="status status--unknown">no data</span></p>
<p>Every item has a label so you know how certain it is. Status as of <strong>29.09.2026</strong>.</p>

<h2>Basic information</h2>
<table>
  <tbody>
    <tr><th>Course</th><td>Systemy baz danych (SBD) — lecture, full-time studies, group 1w</td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Semester</th><td>winter 2026/2027</td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Lecture form</th><td><strong>remote, via MS Teams</strong></td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>EDUX course</th><td>Paweł Lenkiewicz (pawell@pjwstk.edu.pl)</td><td><span class="status status--confirmed">EDUX</span></td></tr>
    <tr><th>Lectures</th><td>recap + T-SQL + PL/SQL (the lecturer of the first lecture); database administration — 5 lectures (Paweł Lenkiewicz, on MS SQL Server); data warehouses — 1 lecture (Agnieszka Chądzyńska-Krasowska)</td><td><span class="status status--lecture">recording</span></td></tr>
    <tr><th>Relation to RBD</th><td>SBD continues Relational Databases (RBD); the passing rules of SBD and RBD are <strong>identical</strong></td><td><span class="status status--lecture">recording</span></td></tr>
  </tbody>
</table>
<div data-note="lecture"><p>The rules header in EDUX says “Systemy Bazy Danych (RBD)” — the lecturer said it is a mistake and will change it to SBD. The rules are the same as for RBD.</p></div>

<h2>Conditions for passing the course</h2>
<p>You need <strong>both</strong>:</p>
<ol class="steps">
  <li><strong>Passed labs (ćwiczenia)</strong> — grade at least <strong>3.0</strong>. The rules for the labs are set by <strong>each lab teacher</strong> for their groups. <span class="status status--confirmed">EDUX</span></li>
  <li><strong>Passed exam</strong> — at least <strong>10 points</strong> in the test. <span class="status status--confirmed">EDUX</span></li>
</ol>

<h2>Passing the labs — points and tests</h2>
<p><span class="status status--confirmed">instructor’s rules · full-time studies</span> According to the document “Zasady zaliczenia ćwiczeń – SBD dzienne” (instructor: K. Bajszczak). Other groups may have different rules — check with your instructor.</p>
<table>
  <thead><tr><th>What</th><th>Points</th><th>When</th><th>Practice on this site</th></tr></thead>
  <tbody>
    <tr><td>Test 1: ERD + SQL</td><td>10</td><td>class 3</td><td><a href="#/tasks/t01-erd">Exercises 1</a>, <a href="#/tasks/t02-sql">2</a>, <a href="#/tasks/t03-sql">3</a></td></tr>
    <tr><td>Test 2: T-SQL</td><td>10</td><td>class 8</td><td><a href="#/tasks/k1-tsql">T-SQL practice set</a></td></tr>
    <tr><td>Test 3: PL/SQL</td><td>10</td><td>class 13</td><td><a href="#/tasks/k2-plsql">PL/SQL practice set</a></td></tr>
    <tr><td>Project</td><td>10</td><td>defence in class 14 — in person</td><td><a href="#/tasks/project">Project</a></td></tr>
  </tbody>
</table>
<ul>
  <li>You need <strong>at least 50% (5 pts) in every test and in the project</strong> — otherwise no passing grade, even with a high total.</li>
  <li>In the <strong>last class</strong> you can retake <strong>one</strong> test.</li>
  <li>Attendance is mandatory; <strong>three absences</strong> per semester are allowed.</li>
</ul>
<table>
  <thead><tr><th>Total points (max 40)</th><th>Lab grade</th></tr></thead>
  <tbody>
    <tr><td>36–40</td><td>5</td></tr>
    <tr><td>32–35</td><td>4.5</td></tr>
    <tr><td>28–31</td><td>4</td></tr>
    <tr><td>24–27</td><td>3.5</td></tr>
    <tr><td>20–23</td><td>3</td></tr>
    <tr><td>0–19</td><td>2</td></tr>
  </tbody>
</table>

<h2>The exam — what it looks like</h2>
<ul>
  <li>A <strong>multiple-choice</strong> test on computers, in <strong>EDUX</strong> — just like the RBD exam. <span class="status status--confirmed">EDUX</span></li>
  <li>Each question has <strong>4 answers</strong>; <strong>one, two, three or all four</strong> can be correct.</li>
  <li>“Big points”: you get <strong>1 point</strong> only if you tick <strong>all correct</strong> answers and <strong>no wrong one</strong>. Otherwise — 0.</li>
  <li><strong>20 questions</strong>; the exam is passed from <strong>10 points</strong> (10 of 20 questions fully correct).</li>
  <li>Expected duration: <strong>30 minutes</strong>.</li>
  <li>If a question is ambiguous, report it to the person running the exam <strong>during the exam</strong>. Only reported questions can later be appealed.</li>
</ul>
<div data-note="own"><p><strong>Exam tips:</strong> since only a complete answer counts, ask yourself for every option “is this <em>always</em> true?”. Watch out for “only”, “always”, “never”, “both servers”. The most common traps: NULL (e.g. <code>NOT IN</code>, <code>COUNT(column)</code>), WHERE vs HAVING, MS SQL / Oracle differences, T-SQL triggers (once per statement) vs PL/SQL (<code>FOR EACH ROW</code>), 2NF/3NF/BCNF. Practise with the <a href="#/quiz">practice quiz</a> in simulation mode (20 questions / 30 min).</p></div>

<h2>Final grade</h2>
<p>The lab grade is converted into points and added to the exam points. <span class="status status--confirmed">EDUX</span></p>
<table>
  <thead><tr><th>Lab grade</th><th>Points</th></tr></thead>
  <tbody>
    <tr><td>3.0</td><td>15</td></tr>
    <tr><td>3.5</td><td>19</td></tr>
    <tr><td>4.0</td><td>23</td></tr>
    <tr><td>4.5</td><td>27</td></tr>
    <tr><td>5.0</td><td>30</td></tr>
  </tbody>
</table>
<table>
  <thead><tr><th>Total points (labs + exam, max 50)</th><th>Final grade</th></tr></thead>
  <tbody>
    <tr><td>&lt; 25</td><td>2.0</td></tr>
    <tr><td>25 – 29</td><td>3.0</td></tr>
    <tr><td>30 – 34</td><td>3.5</td></tr>
    <tr><td>35 – 39</td><td>4.0</td></tr>
    <tr><td>40 – 44</td><td>4.5</td></tr>
    <tr><td>45 – 50</td><td>5.0</td></tr>
  </tbody>
</table>
<div data-note="tip"><p>In EDUX the table reads “&lt; 30 pts – 3.0, &lt; 35 – 3.5, … &lt; 45 – 4.5, &gt; 44 – 5.0”; above it is written as ranges. The minimum passing result is 15 (for 3.0 in the labs) + 10 (exam) = 25 points → 3.0.</p></div>
<div data-widget="calc"></div>

<h2>Semester plan</h2>
<ol class="timeline">
  <li class="timeline__item timeline__item--done">
    <p class="timeline__date">29.09.2026 · Lecture 1 <span class="status status--lecture">took place</span></p>
    <p class="timeline__text">Recap of RBD: relational model, Codd's rules, constraints, ERD, normalization. See topics 1–3.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">~06.10.2026 · Lecture 2 <span class="status status--lecture">announced</span></p>
    <p class="timeline__text">Second recap (the SQL language). The date is computed as “next week” — check the timetable.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">following weeks · T-SQL and PL/SQL <span class="status status--lecture">announced</span></p>
    <p class="timeline__text">Procedural languages of MS SQL Server and Oracle: variables, cursors, procedures, triggers.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">5 lectures · administration (P. Lenkiewicz) <span class="status status--lecture">announced</span></p>
    <p class="timeline__text">On MS SQL Server: files, indexes, transactions, backup/restore, permissions, performance, distributed databases. Two topics (backup and indexes) will also be in the labs.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">1 lecture · data warehouses (A. Chądzyńska-Krasowska) <span class="status status--lecture">announced</span></p>
    <p class="timeline__text">An introduction to the topic, no labs.</p>
  </li>
  <li class="timeline__item">
    <p class="timeline__date">winter session · exam <span class="status status--unknown">date unknown</span></p>
    <p class="timeline__text">The exam date has not been published yet. Usually it is the January–February 2027 session — <strong>check EDUX</strong>.</p>
  </li>
</ol>

<h2>Labs — what to expect</h2>
<p><span class="status status--estimated">based on last year's materials</span> The order of topics may change — the lab teacher decides.</p>
<table>
  <thead><tr><th>Topic</th><th>Content</th><th>Practice on this site</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>ERD recap (database design)</td><td><a href="#/tasks/t01-erd">Exercises 1</a></td></tr>
    <tr><td>2–3</td><td>SQL recap: SELECT, joins, grouping, subqueries, DML</td><td><a href="#/tasks/t02-sql">2</a>, <a href="#/tasks/t03-sql">3</a></td></tr>
    <tr><td>4–6</td><td>T-SQL: basics, procedures, cursors, triggers</td><td><a href="#/tasks/t04-tsql">4</a>, <a href="#/tasks/t05-tsql-cursors">5</a>, <a href="#/tasks/t06-tsql-triggers">6</a></td></tr>
    <tr><td>7</td><td>Indexes and transactions (execution plans, isolation levels)</td><td><a href="#/tasks/t07-indexes-transactions">7</a></td></tr>
    <tr><td>8</td><td>Database files, backup/restore, permissions</td><td><a href="#/tasks/t08-backup-security">8</a></td></tr>
    <tr><td>9–11</td><td>PL/SQL: basics, cursors, triggers</td><td><a href="#/tasks/t09-plsql">9</a>, <a href="#/tasks/t10-plsql-cursors">10</a>, <a href="#/tasks/t11-plsql-triggers">11</a></td></tr>
    <tr><td>Tests</td><td>class 3: ERD + SQL · class 8: T-SQL · class 13: PL/SQL (10 pts each)</td><td><a href="#/tasks/t03-sql">SQL</a>, <a href="#/tasks/k1-tsql">T-SQL</a>, <a href="#/tasks/k2-plsql">PL/SQL</a></td></tr>
    <tr><td>Project</td><td>Own database (ERD → scripts) + procedures and triggers in Oracle and MS SQL</td><td><a href="#/tasks/project">Project</a></td></tr>
  </tbody>
</table>

<h2>Important from the first lecture</h2>
<ul>
  <li>The lecturer <strong>takes attendance</strong> — he announced an attendance list at the next lectures. <span class="status status--lecture">recording</span></li>
  <li>You can ask questions at any time by interrupting the lecture. <span class="status status--lecture">recording</span></li>
  <li>The lecture slides and a text file with a detailed walkthrough of normalization are to appear in EDUX. <span class="status status--lecture">recording</span></li>
  <li>The recap is deliberate: at diploma defences students often cannot answer basic database theory questions. <span class="status status--lecture">recording</span></li>
</ul>

<h2>Recommendations</h2>
<div data-note="own">
<ul>
  <li><strong>Install the tools at the start of the semester:</strong> SQL Server (Express or LocalDB — the labs use <code>(localdb)\\MSSQLLocalDB</code>) + SQL Server Management Studio; for Oracle — SQL Developer (the university provides a server) or the free Oracle Database Free. Universal: DBeaver or DataGrip.</li>
  <li><strong>Every week:</strong> read the lecture on this site → open the cheat sheet → do the exercises for the topic. Don't leave T-SQL and PL/SQL for the end — they take the most work.</li>
  <li><strong>Write code twice:</strong> the same task in T-SQL and in PL/SQL. Most points are lost by mixing up syntax (e.g. <code>@variable</code> vs <code>variable</code>, <code>PRINT</code> vs <code>DBMS_OUTPUT.PUT_LINE</code>).</li>
  <li><strong>Start the project early</strong> — the ERD and scripts take longer than it seems.</li>
  <li><strong>Before the exam:</strong> go through all the cheat sheets (<a href="#/cheatsheets">cheat sheet page</a>) and do the quiz simulation several times.</li>
</ul>
</div>
`
},

tasksIntro: `
<div data-note="warn" data-label="Important">
  <p>These exercises are <strong>reworked</strong>: they follow the same logic as the lab tasks but use different databases (a car rental, a courier company), different data and different wording. They are for learning — do not hand them in as your own solutions of lab tasks.</p>
</div>
<ol class="steps">
  <li>First run the scripts from <a href="#/tasks/databases">Practice databases</a> (MS SQL and/or Oracle).</li>
  <li>Try to solve the task yourself. If you get stuck — open the hint.</li>
  <li>Only then compare with the solution. Often several versions are correct.</li>
</ol>`
});
