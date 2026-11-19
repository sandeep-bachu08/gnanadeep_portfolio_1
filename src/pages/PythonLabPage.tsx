import React, { useEffect, useState } from 'react';
import {
  Calculator,
  Database,
  ExternalLink,
  GitBranch,
  Play,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  CGPACalcResult,
  clearPythonHistory,
  DSAAlgorithm,
  DSARunResult,
  fetchPythonHistory,
  PythonExecutionRecord,
  runCGPACalculator,
  runPythonDSA,
  runReadOnlySQL,
  SQLQueryResult,
} from '../services/api';

type ToolTab = 'dsa' | 'sql' | 'cgpa';

const SQL_PRESETS = [
  {
    label: 'B.Tech Semesters',
    query: 'SELECT semester_number, semester_label, sgpa, status FROM academic_semesters ORDER BY semester_number;',
  },
  {
    label: 'Education History',
    query: 'SELECT stage_code, degree, institution, duration, current_status FROM education_history;',
  },
  {
    label: 'Technical Skills',
    query: 'SELECT name, description FROM skills ORDER BY id;',
  },
  {
    label: 'Spoken Languages',
    query: 'SELECT language, proficiency FROM languages ORDER BY id;',
  },
  {
    label: 'Average SGPA',
    query: 'SELECT COUNT(sgpa) AS completed_terms, ROUND(AVG(sgpa), 2) AS avg_sgpa FROM academic_semesters WHERE sgpa IS NOT NULL;',
  },
];

export const PythonLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>('dsa');

  const [algorithm, setAlgorithm] = useState<DSAAlgorithm>('merge_sort');
  const [numbersInput, setNumbersInput] = useState('38, 27, 43, 3, 9, 82, 10');
  const [targetInput, setTargetInput] = useState('27');
  const [expressionInput, setExpressionInput] = useState('{[()()]}');
  const [dsaLoading, setDsaLoading] = useState(false);
  const [dsaError, setDsaError] = useState<string | null>(null);
  const [dsaResult, setDsaResult] = useState<DSARunResult | null>(null);

  const [sqlQuery, setSqlQuery] = useState(SQL_PRESETS[0].query);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [sqlResult, setSqlResult] = useState<SQLQueryResult | null>(null);

  const [projectedSem3, setProjectedSem3] = useState('7.50');
  const [projectedSem4, setProjectedSem4] = useState('');
  const [targetCgpa, setTargetCgpa] = useState('7.50');
  const [cgpaLoading, setCgpaLoading] = useState(false);
  const [cgpaError, setCgpaError] = useState<string | null>(null);
  const [cgpaResult, setCgpaResult] = useState<CGPACalcResult | null>(null);

  const [history, setHistory] = useState<PythonExecutionRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const items = await fetchPythonHistory();
      setHistory(items);
    } catch {
      // Non-blocking if backend is booting
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRunDSA = async (e: React.FormEvent) => {
    e.preventDefault();
    setDsaError(null);
    setDsaLoading(true);

    try {
      if (algorithm === 'balanced_brackets') {
        const res = await runPythonDSA({
          algorithm,
          expression: expressionInput,
        });
        setDsaResult(res);
      } else {
        const parsedNumbers = numbersInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => Number(s));

        if (parsedNumbers.length === 0 || parsedNumbers.some((n) => !Number.isInteger(n))) {
          throw new Error('Enter comma-separated whole integers (e.g. 38, 27, 43, 3).');
        }

        const parsedTarget =
          algorithm === 'binary_search' ? Number(targetInput.trim()) : undefined;
        if (algorithm === 'binary_search' && !Number.isInteger(parsedTarget)) {
          throw new Error('Enter a valid integer target for Binary Search.');
        }

        const res = await runPythonDSA({
          algorithm,
          numbers: parsedNumbers,
          target: parsedTarget,
        });
        setDsaResult(res);
      }
      await loadHistory();
    } catch (err) {
      setDsaError(err instanceof Error ? err.message : 'Python execution failed.');
    } finally {
      setDsaLoading(false);
    }
  };

  const handleRunSQL = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const queryToRun = (overrideQuery ?? sqlQuery).trim();
    if (!queryToRun) return;

    setSqlError(null);
    setSqlLoading(true);
    try {
      const res = await runReadOnlySQL(queryToRun);
      setSqlResult(res);
      await loadHistory();
    } catch (err) {
      setSqlError(err instanceof Error ? err.message : 'SQLite query failed.');
      setSqlResult(null);
    } finally {
      setSqlLoading(false);
    }
  };

  const handleRunCGPA = async (e: React.FormEvent) => {
    e.preventDefault();
    setCgpaError(null);
    setCgpaLoading(true);

    try {
      const projected: number[] = [];
      for (const val of [projectedSem3, projectedSem4]) {
        if (val.trim()) {
          const num = Number(val.trim());
          if (Number.isNaN(num) || num < 0 || num > 10) {
            throw new Error('Projected SGPA values must be numbers between 0.00 and 10.00.');
          }
          projected.push(num);
        }
      }

      const targetNum = targetCgpa.trim() ? Number(targetCgpa.trim()) : null;
      if (targetNum !== null && (Number.isNaN(targetNum) || targetNum < 0 || targetNum > 10)) {
        throw new Error('Target CGPA must be between 0.00 and 10.00.');
      }

      const res = await runCGPACalculator({
        projected_semesters: projected,
        target_cgpa: targetNum,
        total_semesters: 8,
      });
      setCgpaResult(res);
      await loadHistory();
    } catch (err) {
      setCgpaError(err instanceof Error ? err.message : 'CGPA calculation failed.');
    } finally {
      setCgpaLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearPythonHistory();
      setHistory([]);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
      {/* Page Header */}
      <div className="pb-10 border-b border-[#E8D9B9] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#B39458]">
            <span>Python Backend</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#777777]">FastAPI &amp; SQLite Interactive Workbench</span>
          </div>
          <h1
            className="mt-3 font-display font-bold text-[#252525] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          >
            Python, FastAPI &amp; SQLite
          </h1>
          <p className="mt-2 text-sm text-[#777777] max-w-2xl">
            Live backend features powered by Python 3, FastAPI, Pydantic validation, and an embedded
            SQLite database. Execute algorithms, query portfolio tables, and model academic CGPA
            projections in real time.
          </p>
        </div>

        <a
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] hover:border-[#B39458] text-xs font-mono text-[#252525] hover:text-[#B39458] transition-colors self-start lg:self-auto whitespace-nowrap shrink-0"
        >
          <span>Open FastAPI Docs</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#B39458]" />
        </a>
      </div>

      {/* Tool Selector Segmented Bar */}
      <div className="mt-10 flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#F8F6F1] border border-[#E8D9B9] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('dsa')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'dsa'
              ? 'bg-[#B39458] text-white shadow-xs'
              : 'text-[#777777] hover:text-[#252525]'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Python Algorithms</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sql')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'sql'
              ? 'bg-[#B39458] text-white shadow-xs'
              : 'text-[#777777] hover:text-[#252525]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>SQLite Query Console</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cgpa')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'cgpa'
              ? 'bg-[#B39458] text-white shadow-xs'
              : 'text-[#777777] hover:text-[#252525]'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>SGPA / CGPA Analyzer</span>
        </button>
      </div>

      {/* Active Tool Panel */}
      <div className="mt-8">
        {activeTab === 'dsa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleRunDSA}
              className="lg:col-span-5 p-7 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] shadow-[0_8px_30px_rgba(37,37,37,0.03)] space-y-5"
            >
              <div className="pb-4 border-b border-[#E8D9B9]">
                <h2 className="font-display text-lg font-bold text-[#252525]">
                  Server-Side Python Runner
                </h2>
                <p className="mt-1 text-xs text-[#777777]">
                  Sends input to FastAPI <span className="font-mono text-[#252525]">POST /api/python/dsa</span> and logs timing in SQLite.
                </p>
              </div>

              <div>
                <label htmlFor="dsa-algo" className="block font-mono text-xs text-[#252525] font-medium mb-1.5">
                  Algorithm
                </label>
                <select
                  id="dsa-algo"
                  value={algorithm}
                  onChange={(e) => {
                    setAlgorithm(e.target.value as DSAAlgorithm);
                    setDsaResult(null);
                    setDsaError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] text-sm text-[#252525] focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF]"
                >
                  <option value="merge_sort">Merge Sort (Divide &amp; Conquer)</option>
                  <option value="quick_sort">Quick Sort (Pivot Partitioning)</option>
                  <option value="binary_search">Binary Search (Sorted Array)</option>
                  <option value="balanced_brackets">Balanced Brackets (Stack Validator)</option>
                </select>
              </div>

              {algorithm !== 'balanced_brackets' ? (
                <>
                  <div>
                    <label htmlFor="dsa-numbers" className="block font-mono text-xs text-[#252525] font-medium mb-1.5">
                      Integer List (comma-separated)
                    </label>
                    <input
                      id="dsa-numbers"
                      type="text"
                      value={numbersInput}
                      onChange={(e) => setNumbersInput(e.target.value)}
                      placeholder="38, 27, 43, 3, 9, 82, 10"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] font-mono text-sm text-[#252525] focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF]"
                    />
                  </div>

                  {algorithm === 'binary_search' && (
                    <div>
                      <label htmlFor="dsa-target" className="block font-mono text-xs text-[#252525] font-medium mb-1.5">
                        Target Integer
                      </label>
                      <input
                        id="dsa-target"
                        type="text"
                        value={targetInput}
                        onChange={(e) => setTargetInput(e.target.value)}
                        placeholder="27"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] font-mono text-sm text-[#252525] focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF]"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <label htmlFor="dsa-expr" className="block font-mono text-xs text-[#252525] font-medium mb-1.5">
                    Bracket Expression
                  </label>
                  <input
                    id="dsa-expr"
                    type="text"
                    value={expressionInput}
                    onChange={(e) => setExpressionInput(e.target.value)}
                    placeholder="{[()()]}"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] font-mono text-sm text-[#252525] focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF]"
                  />
                </div>
              )}

              {dsaError && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                  {dsaError}
                </p>
              )}

              <button
                type="submit"
                disabled={dsaLoading}
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg bg-[#B39458] hover:bg-[#9E8047] disabled:opacity-60 text-white font-medium text-sm transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>{dsaLoading ? 'Running in Python...' : 'Run in Python'}</span>
              </button>
            </form>

            <div className="lg:col-span-7 p-7 rounded-2xl border border-[#E8D9B9] bg-[#F8F6F1] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E8D9B9]">
                <h3 className="font-display text-base font-bold text-[#252525]">
                  Python Execution Output
                </h3>
                {dsaResult && (
                  <span className="font-mono text-xs text-[#B39458] tabular-nums">
                    {dsaResult.complexity} · {dsaResult.execution_ms.toFixed(3)} ms
                  </span>
                )}
              </div>

              {!dsaResult ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-[#777777]">
                    Select an algorithm and click <strong className="text-[#252525] font-medium">Run in Python</strong> to execute it on the FastAPI backend.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl border border-[#E8D9B9] bg-[#FFFFFF]">
                    <p className="font-mono text-xs text-[#777777] mb-1.5">Returned Value</p>
                    <pre className="font-mono text-sm text-[#252525] overflow-x-auto">
                      {JSON.stringify(dsaResult.result, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-[#777777] mb-2">
                      Execution Trace ({dsaResult.steps.length} steps)
                    </p>
                    <ol className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {dsaResult.steps.map((step, i) => (
                        <li
                          key={`${i}-${step}`}
                          className="flex items-baseline gap-3 px-3.5 py-2 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] font-mono text-xs text-[#252525]"
                        >
                          <span className="text-[#B39458] tabular-nums shrink-0">
                            {String(i + 1).padStart(2, '0')}.
                          </span>
                          <span className="break-all">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sql' && (
          <div className="space-y-6">
            <div className="p-7 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] shadow-[0_8px_30px_rgba(37,37,37,0.03)] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8D9B9]">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#252525]">
                    SQLite Read-Only Query Console
                  </h2>
                  <p className="mt-1 text-xs text-[#777777]">
                    Run live <span className="font-mono text-[#252525]">SELECT</span> queries directly against <span className="font-mono text-[#252525]">backend/portfolio.db</span> via FastAPI.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {SQL_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setSqlQuery(preset.query);
                        handleRunSQL(undefined, preset.query);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] hover:border-[#B39458] text-xs font-mono text-[#252525] hover:text-[#B39458] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={(e) => handleRunSQL(e)} className="space-y-4">
                <textarea
                  rows={3}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  aria-label="SQLite SELECT query"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8D9B9] bg-[#F8F6F1] font-mono text-sm text-[#252525] focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF]"
                />

                {sqlError && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                    {sqlError}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={sqlLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B39458] hover:bg-[#9E8047] disabled:opacity-60 text-white font-medium text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Play className="w-4 h-4" />
                    <span>{sqlLoading ? 'Querying SQLite...' : 'Execute SELECT Query'}</span>
                  </button>

                  {sqlResult && (
                    <span className="font-mono text-xs text-[#777777] tabular-nums">
                      {sqlResult.row_count} row(s) returned in {sqlResult.execution_ms.toFixed(3)} ms
                    </span>
                  )}
                </div>
              </form>
            </div>

            {sqlResult && (
              <div className="rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] overflow-hidden shadow-[0_8px_30px_rgba(37,37,37,0.03)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8D9B9] bg-[#F8F6F1] font-mono text-xs text-[#777777]">
                        {sqlResult.columns.map((col) => (
                          <th key={col} className="py-3 px-4 font-medium">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8D9B9] text-sm">
                      {sqlResult.rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={Math.max(sqlResult.columns.length, 1)}
                            className="py-6 px-4 text-center text-[#777777] font-mono text-xs"
                          >
                            No rows matched this query.
                          </td>
                        </tr>
                      ) : (
                        sqlResult.rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#F8F6F1]/60">
                            {sqlResult.columns.map((col) => (
                              <td
                                key={col}
                                className="py-3 px-4 text-[#252525] font-mono text-xs tabular-nums"
                              >
                                {row[col] === null || row[col] === undefined ? 'NULL' : String(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cgpa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleRunCGPA}
              className="lg:col-span-5 p-7 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] shadow-[0_8px_30px_rgba(37,37,37,0.03)] space-y-5"
            >
              <div className="pb-4 border-b border-[#E8D9B9]">
                <h2 className="font-display text-lg font-bold text-[#252525]">
                  Academic SGPA &amp; CGPA Planner
                </h2>
                <p className="mt-1 text-xs text-[#777777]">
                  Reads recorded Sem 1 (6.75) &amp; Sem 2 (6.60) from SQLite and computes target projections in Python.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sem3-sgpa" className="block font-mono text-xs text-[#252525] font-medium mb-1.5">
                    Projected Sem 3 SGPA
                  </label>
                  <input
                    id="sem3-sgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={projectedSem3}
                    onChange={(e) => setProjectedSem3(e.target.value)}
                    placeholder="7.50"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] font-mono text-sm text-[#252525] focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF] tabular-nums"
                  />
                </div>

                <div>
                  <label htmlFor="sem4-sgpa" className="block font-mono text-xs text-[#252525] font-medium mb-1.5">
                    Projected Sem 4 (Optional)
                  </label>
                  <input
                    id="sem4-sgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={projectedSem4}
                    onChange={(e) => setProjectedSem4(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] font-mono text-sm text-[#252525] focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="target-cgpa" className="block font-mono text-xs text-[#252525] font-medium mb-1.5">
                  Target Final CGPA (8 Semesters)
                </label>
                <input
                  id="target-cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(e.target.value)}
                  placeholder="7.50"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] font-mono text-sm text-[#252525] focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF] tabular-nums"
                />
              </div>

              {cgpaError && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                  {cgpaError}
                </p>
              )}

              <button
                type="submit"
                disabled={cgpaLoading}
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg bg-[#B39458] hover:bg-[#9E8047] disabled:opacity-60 text-white font-medium text-sm transition-colors cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>{cgpaLoading ? 'Calculating in Python...' : 'Calculate CGPA Projection'}</span>
              </button>
            </form>

            <div className="lg:col-span-7 p-7 rounded-2xl border border-[#E8D9B9] bg-[#F8F6F1] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8D9B9]">
                <h3 className="font-display text-base font-bold text-[#252525]">
                  Python Calculation Breakdown
                </h3>
                {cgpaResult && (
                  <span className="font-mono text-xs text-[#B39458] tabular-nums">
                    {cgpaResult.execution_ms.toFixed(3)} ms
                  </span>
                )}
              </div>

              {!cgpaResult ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-[#777777]">
                    Click <strong className="text-[#252525] font-medium">Calculate CGPA Projection</strong> to query SQLite semester records and run the Python analyzer.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-[#E8D9B9] bg-[#FFFFFF]">
                      <p className="font-mono text-xs text-[#777777]">Recorded CGPA</p>
                      <p className="mt-1.5 font-display text-2xl font-bold text-[#252525] tabular-nums">
                        {cgpaResult.current_cgpa.toFixed(2)}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-[#777777]">Sem 1 &amp; Sem 2</p>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E8D9B9] bg-[#FFFFFF]">
                      <p className="font-mono text-xs text-[#777777]">Projected CGPA</p>
                      <p className="mt-1.5 font-display text-2xl font-bold text-[#B39458] tabular-nums">
                        {cgpaResult.projected_cgpa.toFixed(2)}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-[#777777]">With inputs</p>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E8D9B9] bg-[#FFFFFF]">
                      <p className="font-mono text-xs text-[#777777]">Needed Avg SGPA</p>
                      <p className="mt-1.5 font-display text-2xl font-bold text-[#252525] tabular-nums">
                        {cgpaResult.required_avg_sgpa_for_target !== null
                          ? cgpaResult.required_avg_sgpa_for_target.toFixed(2)
                          : '—'}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-[#777777]">
                        Next {cgpaResult.remaining_semesters_count} term(s)
                      </p>
                    </div>
                  </div>

                  {cgpaResult.target_achievable !== null && (
                    <div className="p-4 rounded-xl border border-[#E8D9B9] bg-[#FFFFFF] text-sm text-[#252525]">
                      {cgpaResult.target_achievable ? (
                        <span>
                          Target CGPA is achievable by averaging{' '}
                          <strong className="font-mono text-[#B39458] tabular-nums">
                            {cgpaResult.required_avg_sgpa_for_target?.toFixed(2)}
                          </strong>{' '}
                          across the remaining {cgpaResult.remaining_semesters_count} semester(s).
                        </span>
                      ) : (
                        <span>
                          Target exceeds the 10.00 scale based on remaining semesters. Adjust target
                          or projected semester scores.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Persisted SQLite Execution Log */}
      <section className="mt-16 pt-12 border-t border-[#E8D9B9]">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="font-mono text-xs text-[#B39458]">SQLite Persistence</p>
            <h2 className="mt-1.5 font-display text-2xl font-bold text-[#252525] tracking-tight">
              Recent Python Execution Log
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadHistory}
              disabled={historyLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] text-xs font-mono text-[#252525] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#B39458]" />
              <span>Refresh</span>
            </button>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] hover:border-[#B39458] text-xs font-mono text-[#777777] hover:text-[#252525] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Log</span>
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] overflow-hidden shadow-[0_8px_30px_rgba(37,37,37,0.03)]">
          {history.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#777777]">
              No executions recorded in SQLite yet. Run any Python tool above to see live records
              saved to <span className="font-mono text-[#252525]">portfolio.db</span>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8D9B9] bg-[#F8F6F1] font-mono text-xs text-[#777777]">
                    <th className="py-3 px-4 font-normal">Tool</th>
                    <th className="py-3 px-4 font-normal">Input</th>
                    <th className="py-3 px-4 font-normal">Output Summary</th>
                    <th className="py-3 px-4 font-normal text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D9B9] text-xs font-mono">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8F6F1]/60">
                      <td className="py-3 px-4 font-semibold text-[#B39458] whitespace-nowrap">
                        {item.tool_type}
                      </td>
                      <td className="py-3 px-4 text-[#252525] max-w-[280px] truncate">
                        {item.input_summary}
                      </td>
                      <td className="py-3 px-4 text-[#777777] max-w-[280px] truncate">
                        {item.result_summary}
                      </td>
                      <td className="py-3 px-4 text-[#252525] text-right tabular-nums whitespace-nowrap">
                        {item.execution_ms.toFixed(3)} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
