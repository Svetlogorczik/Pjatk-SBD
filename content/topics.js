/* SBD – struktura kursu (niezależna od języka): moduły, kolejność tematów, źródła, powiązane zadania.
   Tytuły i treść są w content/<lang>/*.js */
(function (SBD) {
  'use strict';

  /* Wykłady po kolei (n = numer wykładu). topics = części wykładu, tasks = ćwiczenia po tym wykładzie,
     marks = kolokwia / obrona projektu na zajęciach o tym numerze (wg zasad zaliczenia ćwiczeń). */
  SBD.modules = [
    { id: 'w1', n: 1, topics: ['relational-model', 'erd', 'normalization'], tasks: ['t01-erd'] },
    { id: 'w2', n: 2, topics: ['sql-basics', 'select-basics', 'where-joins', 'group-by', 'dml'], tasks: ['databases', 't02-sql'] },
    { id: 'w3', n: 3, topics: ['subqueries', 'ddl', 'views', 'functions'], tasks: ['t03-sql'], marks: [{ key: 'k1', href: '#/tasks/t03-sql' }] },
    { id: 'w4', n: 4, topics: ['tsql-basics', 'tsql-procedures'], tasks: ['t04-tsql'] },
    { id: 'w5', n: 5, topics: ['tsql-cursors'], tasks: ['t05-tsql-cursors'] },
    { id: 'w6', n: 6, topics: ['tsql-triggers', 'tsql-advanced'], tasks: ['t06-tsql-triggers', 'k1-tsql'] },
    { id: 'w7', n: 7, topics: ['adm-indexes', 'adm-transactions'], tasks: ['t07-indexes-transactions'] },
    { id: 'w8', n: 8, topics: ['adm-server', 'adm-backup-security'], tasks: ['t08-backup-security'], marks: [{ key: 'k2', href: '#/tasks/k1-tsql' }] },
    { id: 'w9', n: 9, topics: ['plsql-basics', 'plsql-procedures'], tasks: ['t09-plsql'] },
    { id: 'w10', n: 10, topics: ['plsql-cursors'], tasks: ['t10-plsql-cursors'] },
    { id: 'w11', n: 11, topics: ['plsql-triggers', 'plsql-advanced'], tasks: ['t11-plsql-triggers', 'k2-plsql'] },
    { id: 'w12', n: 12, topics: ['adm-performance'], tasks: [] },
    { id: 'w13', n: 13, topics: ['object-lob'], tasks: [], marks: [{ key: 'k3', href: '#/tasks/k2-plsql' }] },
    { id: 'w14', n: 14, topics: ['distributed', 'warehouses'], tasks: [], marks: [{ key: 'proj', href: '#/tasks/project' }, { key: 'retake', href: '#/course' }] }
  ];
  SBD.modules.forEach(function (m) { m.icon = String(m.n); m.marks = m.marks || []; });

  var W01 = 'SBD W01 Model relacyjny.pdf';
  var REC = 'Nagranie wykładu 29.09.2026 (SBD_1.txt)';
  var TSQL = 'Transact SQL (T-SQL).pdf';
  var PLSQL = 'Język PL_SQL.pdf';

  SBD.topicMeta = {
    'relational-model': { dialects: ['theory'], src: [W01, REC], tasks: [] },
    'erd': { dialects: ['theory'], src: [W01, REC], tasks: ['t01-erd', 'project'] },
    'normalization': { dialects: ['theory'], src: [W01, 'W5a_Normalizacja na przykładach.pdf', REC], tasks: ['t01-erd'] },

    'sql-basics': { dialects: ['sql'], src: ['SQL Wykład 1.pdf'], tasks: ['databases'] },
    'select-basics': { dialects: ['sql'], src: ['SQL Wykład 2.pdf'], tasks: ['t02-sql'] },
    'where-joins': { dialects: ['sql'], src: ['SQL Wykład 3.pdf'], tasks: ['t02-sql'] },
    'group-by': { dialects: ['sql'], src: ['SQL Wykład 4.pdf'], tasks: ['t02-sql', 't03-sql'] },
    'subqueries': { dialects: ['sql'], src: ['SQL Wykład 5.pdf'], tasks: ['t03-sql'], marks: [{ key: 'k1', href: '#/tasks/t03-sql' }] },
    'dml': { dialects: ['sql'], src: ['SQL Wykład 6.pdf'], tasks: ['t02-sql'] },
    'ddl': { dialects: ['sql'], src: ['SQL Wykład 7.pdf'], tasks: ['project'] },
    'views': { dialects: ['sql'], src: ['SQL Wykład 8.pdf'], tasks: [] },
    'functions': { dialects: ['mssql', 'oracle'], src: ['Suplement.pdf'], tasks: [] },

    'tsql-basics': { dialects: ['mssql'], src: [TSQL + ' – cz. I'], tasks: ['t04-tsql'] },
    'tsql-cursors': { dialects: ['mssql'], src: [TSQL + ' – cz. I'], tasks: ['t05-tsql-cursors'] },
    'tsql-procedures': { dialects: ['mssql'], src: [TSQL + ' – cz. II, III'], tasks: ['t04-tsql', 't05-tsql-cursors', 'k1-tsql'] },
    'tsql-triggers': { dialects: ['mssql'], src: [TSQL + ' – cz. II'], tasks: ['t06-tsql-triggers', 'k1-tsql'] },
    'tsql-advanced': { dialects: ['mssql'], src: [TSQL + ' – cz. III'], tasks: [] },

    'plsql-basics': { dialects: ['oracle'], src: [PLSQL + ' – cz. 1–8'], tasks: ['t09-plsql'] },
    'plsql-cursors': { dialects: ['oracle'], src: [PLSQL + ' – cz. 9–10'], tasks: ['t10-plsql-cursors'] },
    'plsql-procedures': { dialects: ['oracle'], src: [PLSQL + ' – cz. VI'], tasks: ['t09-plsql', 't10-plsql-cursors', 'k2-plsql'] },
    'plsql-triggers': { dialects: ['oracle'], src: [PLSQL + ' – cz. VI'], tasks: ['t11-plsql-triggers', 'k2-plsql'] },
    'plsql-advanced': { dialects: ['oracle'], src: [PLSQL + ' – cz. VII'], tasks: [] },

    'adm-server': { dialects: ['theory', 'mssql'], src: ['SBD_ADM1.pptx (P. Lenkiewicz)'], tasks: ['t08-backup-security'], marks: [{ key: 'k2', href: '#/tasks/k1-tsql' }] },
    'adm-indexes': { dialects: ['theory', 'mssql'], src: ['SBD_ADM1.pptx', 'SBD_ADM3.pptx', REC], tasks: ['t07-indexes-transactions'] },
    'adm-transactions': { dialects: ['theory', 'mssql'], src: ['SBD_ADM2.pptx', 'SBD_ADM3.pptx'], tasks: ['t07-indexes-transactions'] },
    'adm-backup-security': { dialects: ['mssql'], src: ['SBD_ADM2.pptx', REC], tasks: ['t08-backup-security'], marks: [{ key: 'k2', href: '#/tasks/k1-tsql' }] },
    'adm-performance': { dialects: ['theory', 'mssql', 'oracle'], src: ['SBD_ADM3.pptx'], tasks: ['t07-indexes-transactions'] },

    'distributed': { dialects: ['theory'], src: ['SBD_W14_rozproszone.pptx'], tasks: [] },
    'warehouses': { dialects: ['theory'], src: ['WykladSkrotSBD_Hurtownie danych.pdf (A. Chądzyńska-Krasowska)'], tasks: [] },
    'object-lob': { dialects: ['oracle'], src: ['SBD_W13 Obiektowe-LOB.ppt'], tasks: [] }
  };

  /* Zestawy zadań. own: true = zestaw w całości wymyślony przez autora strony. */
  SBD.taskSets = [
    { id: 'databases', icon: '🗄', dialects: ['mssql', 'oracle'], topics: ['sql-basics', 'ddl'] },
    { id: 't01-erd', icon: '1', dialects: ['theory'], topics: ['erd', 'normalization'] },
    { id: 't02-sql', icon: '2', dialects: ['sql'], topics: ['select-basics', 'where-joins', 'group-by', 'dml'] },
    { id: 't03-sql', icon: '3', dialects: ['sql'], topics: ['group-by', 'subqueries'] },
    { id: 't04-tsql', icon: '4', dialects: ['mssql'], topics: ['tsql-basics', 'tsql-procedures'] },
    { id: 't05-tsql-cursors', icon: '5', dialects: ['mssql'], topics: ['tsql-cursors', 'tsql-procedures'] },
    { id: 't06-tsql-triggers', icon: '6', dialects: ['mssql'], topics: ['tsql-triggers'] },
    { id: 't07-indexes-transactions', icon: '7', dialects: ['mssql'], topics: ['adm-indexes', 'adm-transactions'] },
    { id: 't08-backup-security', icon: '8', dialects: ['mssql'], topics: ['adm-server', 'adm-backup-security'] },
    { id: 't09-plsql', icon: '9', dialects: ['oracle'], topics: ['plsql-basics', 'plsql-procedures'] },
    { id: 't10-plsql-cursors', icon: '10', dialects: ['oracle'], topics: ['plsql-cursors', 'plsql-procedures'] },
    { id: 't11-plsql-triggers', icon: '11', dialects: ['oracle'], topics: ['plsql-triggers'] },
    { id: 'k1-tsql', icon: 'K2', own: true, dialects: ['mssql'], topics: ['tsql-procedures', 'tsql-triggers'] },
    { id: 'k2-plsql', icon: 'K3', dialects: ['oracle'], topics: ['plsql-procedures', 'plsql-triggers'] },
    { id: 'project', icon: 'P', dialects: ['mssql', 'oracle'], topics: ['erd', 'ddl', 'tsql-procedures', 'tsql-triggers', 'plsql-procedures', 'plsql-triggers'] }
  ];

  /* meta.lec = numer wykładu, meta.part/meta.of = część wykładu, meta.no = etykieta do listy (np. 4.2).
     set.lec = numer wykładu, po którym są te ćwiczenia. */
  SBD.modules.forEach(function (m) {
    var n = m.topics.length;
    m.topics.forEach(function (id, i) {
      var t = SBD.topicMeta[id];
      t.lec = String(m.n); t.part = i + 1; t.of = n;
      t.no = n > 1 ? m.n + '.' + (i + 1) : String(m.n);
    });
    SBD.taskSets.forEach(function (x) { if (m.tasks.indexOf(x.id) >= 0) x.lec = m.n; });
  });

  /* Płaska lista tematów w kolejności nauki. */
  SBD.topicOrder = [];
  SBD.modules.forEach(function (m) {
    m.topics.forEach(function (id) {
      SBD.topicOrder.push(id);
      SBD.topicMeta[id].module = m.id;
    });
  });
})(window.SBD);
