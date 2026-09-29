/* SBD – prosta kolorowanie składni SQL / T-SQL / PL/SQL (bez zewnętrznych bibliotek). */
(function (SBD) {
  'use strict';

  function toSet(words) {
    var set = Object.create(null);
    words.split(/\s+/).forEach(function (w) { if (w) set[w] = true; });
    return set;
  }

  var KEYWORDS = toSet(
    'ABSOLUTE ACCEPT ADD AFTER ALL ALTER ALWAYS AND ANY AS ASC AUTHORIZATION AUTOCOMMIT BACKUP BEFORE BEGIN ' +
    'BETWEEN BODY BREAK BUILD BY BULK CALL CASCADE CASE CATCH CHECK CLOSE CLUSTERED COLUMN COMMIT COMMITTED ' +
    'COMPLETE CONNECT CONSTANT CONSTRAINT CONTINUE CREATE CROSS CURRENT CURSOR DATABASE DEALLOCATE DECLARE ' +
    'DEFAULT DEFERRED DEFINITION DELETE DELETING DEMAND DENY DESC DIFFERENTIAL DISABLE DISK DISTINCT ' +
    'DISTRIBUTED DROP EACH ELSE ELSIF ENABLE END EXCEPT EXCEPTION EXCLUSIVE EXEC EXECUTE EXISTS EXIT FAST ' +
    'FETCH FILEGROUP FINAL FIRST FOR FORCE FOREIGN FROM FULL FUNCTION GENERATED GLOBAL GO GOTO GRANT GROUP ' +
    'HAVING IDENTIFIED IDENTITY IDENTITY_INSERT IF IMMEDIATE IMPLICIT_TRANSACTIONS IN INCLUDE INDEX INNER ' +
    'INSERT INSERTING INSTANTIABLE INSTEAD INTERSECT INTO IS ISOLATION JOIN KEY LAST LEFT LEVEL LIKE LINK ' +
    'LOCK LOG LOGIN LOOP MATCHED MATERIALIZED MEMBER MERGE MINUS MODE MODIFY NEXT NOCHECK NOCOUNT ' +
    'NONCLUSTERED NORECOVERY NOT NULL OBJECT OF OFF ON ONLY OPEN OR ORDER OTHERS OUT OUTER OUTPUT OVER ' +
    'OVERRIDING PACKAGE PARTITION PASSWORD PERCENT PRAGMA PRESERVE PRIMARY PRINT PRIOR PRIVATE PROCEDURE ' +
    'PROMPT RAISE RAISERROR READ RECORD RECOVERY REF REFERENCES REFRESH RELATIVE REPEATABLE REPLACE RESTART ' +
    'RESTORE RETURN RETURNS REVERSE REVOKE RIGHT ROLE ROLLBACK ROW ROWS SAVE SCHEMA SCOPE SCROLL SELECT ' +
    'SEQUENCE SERIALIZABLE SERVEROUTPUT SET SNAPSHOT SOME START STATISTICS STOPAT TABLE TABLESPACE TABLOCKX ' +
    'TEMPORARY THEN THROW TIES TO TOP TRAN TRANSACTION TRIGGER TRUNCATE TRY TYPE UNCOMMITTED UNDER UNION ' +
    'UNIQUE UPDATE UPDATING USE USER USING VALUES VARIABLE VARRAY VERIFY VIEW WHEN WHERE WHILE WITH WITHIN ' +
    'INCREMENT MAXVALUE LESS THAN FILLFACTOR PCTFREE PCTUSED FEEDBACK ECHO TIME IO TRUE FALSE'
  );

  var TYPES = toSet(
    'INT INTEGER BIGINT SMALLINT TINYINT BIT DECIMAL NUMERIC NUMBER MONEY SMALLMONEY FLOAT REAL CHAR NCHAR ' +
    'VARCHAR NVARCHAR VARCHAR2 NVARCHAR2 DATE DATETIME DATETIME2 TIMESTAMP BOOLEAN BINARY_INTEGER ' +
    'PLS_INTEGER CLOB BLOB NCLOB TEXT VARBINARY BINARY MAX %TYPE %ROWTYPE %NOTFOUND %FOUND %ROWCOUNT %ISOPEN'
  );

  var FUNCS = toSet(
    'COUNT SUM AVG MIN MAX CAST CONVERT ISNULL NVL COALESCE GETDATE SYSDATE SYSDATETIME ROUND TRUNC FLOOR ' +
    'CEILING UPPER LOWER TRIM RTRIM LTRIM SUBSTR SUBSTRING LEN LENGTH CONCAT YEAR MONTH DAY DATEADD DATEDIFF ' +
    'DATEPART DATENAME EXTRACT ADD_MONTHS MONTHS_BETWEEN TO_CHAR TO_DATE TO_NUMBER TO_TIMESTAMP ROW_NUMBER ' +
    'RANK DENSE_RANK NTILE LISTAGG STRING_AGG SCOPE_IDENTITY ERROR_MESSAGE ERROR_NUMBER ERROR_LINE ' +
    'ERROR_SEVERITY ERROR_STATE ERROR_PROCEDURE RAISE_APPLICATION_ERROR PUT_LINE DBMS_OUTPUT DBMS_LOB ' +
    'OBJECT_ID RAND ABS SQLERRM SQLCODE NEXTVAL CURRVAL EMPTY_CLOB EMPTY_BLOB COLUMNS_UPDATED CURRENT_DATE ' +
    'CURRENT_TIMESTAMP LOCALTIMESTAMP SP_EXECUTESQL OPENROWSET GETLENGTH WRITE VALUE'
  );

  var TOKEN = new RegExp([
    '(--[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',                      /* 1 komentarz */
    "(N?'(?:[^']|'')*')",                                      /* 2 napis */
    '("[^"\\n]*")',                                            /* 3 identyfikator w cudzysłowie */
    '(@@?[A-Za-z_][\\w$#]*|:(?:NEW|OLD|new|old)\\b|:[A-Za-z_]\\w*|&[A-Za-z_]\\w*)', /* 4 zmienne */
    '(%[A-Za-z_]+)',                                           /* 5 atrybuty PL/SQL */
    '(\\b\\d+(?:\\.\\d+)?\\b)',                                /* 6 liczby */
    '([A-Za-z_][\\w$#]*)',                                     /* 7 słowa */
    '([\\s\\S])'                                               /* 8 reszta */
  ].join('|'), 'g');

  function wrap(cls, text) {
    return '<span class="code__tok code__tok--' + cls + '">' + SBD.esc(text) + '</span>';
  }

  SBD.highlight = function (code, lang) {
    if (lang === 'text') return SBD.esc(code);
    var out = '';
    var m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(code)) !== null) {
      if (m[1]) out += wrap('com', m[1]);
      else if (m[2]) out += wrap('str', m[2]);
      else if (m[3]) out += wrap('var', m[3]);
      else if (m[4]) out += wrap('var', m[4]);
      else if (m[5]) out += TYPES[m[5].toUpperCase()] ? wrap('type', m[5]) : wrap('kw', m[5]);
      else if (m[6]) out += wrap('num', m[6]);
      else if (m[7]) {
        var up = m[7].toUpperCase();
        if (KEYWORDS[up]) out += wrap('kw', m[7]);
        else if (TYPES[up]) out += wrap('type', m[7]);
        else if (FUNCS[up]) out += wrap('fn', m[7]);
        else out += SBD.esc(m[7]);
      } else {
        out += SBD.esc(m[8]);
      }
    }
    return out;
  };
})(window.SBD);
