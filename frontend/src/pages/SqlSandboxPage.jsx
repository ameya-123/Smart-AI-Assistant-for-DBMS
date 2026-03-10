import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, Database, Terminal, AlertCircle, 
  RefreshCw, Eraser, CheckCircle2, Table as TableIcon,
  Layout, Info, X
} from 'lucide-react';

const STARTER_TEMPLATE = `-- workspace.sql
CREATE TABLE Students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    major TEXT,
    gpa REAL
);

INSERT INTO Students (name, major, gpa) VALUES 
('Arjun Mehta', 'Computer Science', 3.8),
('Priya Sharma', 'Data Science', 3.9);

SELECT * FROM Students;`;

const SqlSandboxPage = () => {
  const [db, setDb] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [sqlResults, setSqlResults] = useState(null);
  const [sqlQuery, setSqlQuery] = useState(STARTER_TEMPLATE);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTableSchema, setSelectedTableSchema] = useState(null);

  // Function to scan the database and see what tables exist
  const refreshSchema = useCallback((currentDb) => {
    try {
      const result = currentDb.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      if (result.length > 0) {
        setAvailableTables(result[0].values.map(row => row[0]));
      } else {
        setAvailableTables([]);
      }
    } catch (err) {
      console.error("Schema refresh error:", err);
    }
  }, []);

  // NEW: Function to fetch columns for a specific table
  const inspectTable = (tableName) => {
    if (!db) return;
    try {
      const result = db.exec(`PRAGMA table_info(${tableName});`);
      if (result.length > 0) {
        // Columns: cid, name, type, notnull, dflt_value, pk
        const columns = result[0].values.map(row => ({
          name: row[1],
          type: row[2],
          isPk: row[5] === 1
        }));
        setSelectedTableSchema({ name: tableName, columns });
      }
    } catch (err) {
      setSqlError(`Could not inspect table: ${err.message}`);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      }).then(SQL => {
        const newDb = new SQL.Database();
        setDb(newDb);
        refreshSchema(newDb);
      });
    };
    return () => { document.body.removeChild(script); };
  }, [refreshSchema]);

  const runQuery = () => {
    if (!db || !sqlQuery.trim()) return;
    setIsExecuting(true);
    setSqlError(null);
    setSqlResults(null);
    const startTime = performance.now();
    
    try {
      const results = db.exec(sqlQuery);
      setSqlResults(results);
      refreshSchema(db);
    } catch (err) {
      setSqlError(err.message);
    } finally {
      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(1));
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans">
      <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Database className="text-indigo-600" size={24} />
          <div>
            <h1 className="text-xl font-bold text-gray-900">SQL Sandbox</h1>
            <p className="text-xs text-gray-500">Click a table to inspect its columns</p>
          </div>
        </div>
        <Link to="/tutor" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-all">
          <ArrowLeft size={16} /> Back to Chat
        </Link>
      </header>

      <main className="flex-1 flex flex-col p-6 gap-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Top Section: Active Schema & Inspector */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2 tracking-widest">
              <TableIcon size={14} /> Active Database Schema
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableTables.length > 0 ? (
                availableTables.map(table => (
                  <button 
                    key={table} 
                    onClick={() => inspectTable(table)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-mono text-sm font-bold transition-all hover:scale-105 ${
                      selectedTableSchema?.name === table 
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md' 
                      : 'bg-white text-indigo-700 border-indigo-100 hover:bg-indigo-50'
                    }`}
                  >
                    <Database size={12} /> {table}
                  </button>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic py-2">No tables found. Create one!</span>
              )}
            </div>
          </div>

          {/* TABLE INSPECTOR PANEL (Appears when table is clicked) */}
          {selectedTableSchema && (
            <div className="bg-indigo-900 text-indigo-100 p-4 rounded-xl shadow-lg border border-indigo-800 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Info size={16} />
                  <span className="font-bold text-sm">Inspecting: <span className="font-mono text-white underline">{selectedTableSchema.name}</span></span>
                </div>
                <button onClick={() => setSelectedTableSchema(null)} className="hover:text-white"><X size={18}/></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedTableSchema.columns.map(col => (
                  <div key={col.name} className="bg-white/10 p-2 rounded border border-white/10">
                    <p className="text-[10px] uppercase font-bold text-indigo-300 tracking-tighter">
                      {col.isPk ? '🔑 Primary Key' : 'Column'}
                    </p>
                    <p className="font-mono text-sm font-bold truncate">{col.name}</p>
                    <p className="text-[10px] font-mono text-indigo-400">{col.type || 'NUMERIC'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* Left: Dark macOS Editor */}
          <div className="flex-1 flex flex-col bg-[#0d1117] rounded-xl shadow-2xl border border-gray-800 overflow-hidden relative">
            <div className="h-10 px-4 bg-[#161b22] border-b border-gray-800 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <span className="text-gray-500 text-[11px] font-mono">workspace.sql</span>
              <div className="flex gap-3">
                <button onClick={() => setSqlQuery('')} className="text-gray-500 hover:text-white"><Eraser size={14} /></button>
                <button onClick={() => setSqlQuery(STARTER_TEMPLATE)} className="text-gray-500 hover:text-white"><RefreshCw size={14} /></button>
              </div>
            </div>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="flex-1 p-6 bg-transparent text-[#e6edf3] font-mono text-[14px] leading-relaxed resize-none focus:outline-none"
              spellCheck="false"
            />
            <div className="p-4 bg-[#0d1117] border-t border-gray-800 flex justify-end">
              <button
                onClick={runQuery}
                disabled={!db || isExecuting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg transition-all active:scale-95"
              >
                {isExecuting ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                Run Code
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-10 px-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Output</span>
              {executionTime && !sqlError && (
                <div className="text-[10px] font-mono text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                  <CheckCircle2 size={10} className="inline mr-1" /> {executionTime}ms
                </div>
              )}
            </div>
            <div className="flex-1 overflow-auto bg-white">
              {sqlError && (
                <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 font-mono text-xs text-red-600">{sqlError}</div>
              )}
              {sqlResults && sqlResults.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-gray-50 shadow-sm">
                    <tr>
                      {sqlResults[0].columns.map((col, i) => (
                        <th key={i} className="px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sqlResults[0].values.map((row, i) => (
                      <tr key={i} className="hover:bg-indigo-50/20 transition-colors">
                        {row.map((val, j) => (
                          <td key={j} className="px-6 py-3 font-mono text-sm text-gray-600">{val?.toString() ?? 'null'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : !sqlError && (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                  <Layout size={40} strokeWidth={1} />
                  <p className="text-sm font-medium tracking-tight uppercase">Console Ready</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SqlSandboxPage;