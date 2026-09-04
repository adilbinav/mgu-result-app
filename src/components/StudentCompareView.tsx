'use client';

import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Users, 
  Trophy, 
  Sparkles, 
  RefreshCw, 
  Award, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ExamInfo, StudentResult } from '@/lib/types';

interface StudentCompareViewProps {
  exams: ExamInfo[];
  isLoadingExams: boolean;
  demoMode: boolean;
  defaultPrn?: string;
  defaultExamId?: string;
}

export const StudentCompareView: React.FC<StudentCompareViewProps> = ({
  exams,
  isLoadingExams,
  demoMode,
  defaultPrn = '210021000001',
  defaultExamId = '114',
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(defaultExamId || (exams[0]?.id || ''));
  const [prn1, setPrn1] = useState<string>(defaultPrn || '210021000001');
  const [prn2, setPrn2] = useState<string>('210021000002');

  const [loading, setLoading] = useState<boolean>(false);
  const [student1, setStudent1] = useState<StudentResult | null>(null);
  const [student2, setStudent2] = useState<StudentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSingleStudent = async (prn: string, examId: string): Promise<StudentResult> => {
    const res = await fetch('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, prn, demoMode }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to fetch result for PRN ${prn}`);
    }
    return json.data;
  };

  const handleCompare = async (e?: React.FormEvent, customP1?: string, customP2?: string) => {
    if (e) e.preventDefault();
    const p1 = (customP1 || prn1).trim();
    const p2 = (customP2 || prn2).trim();

    if (!p1 || !p2) {
      setError('Please enter both student PRNs to compare.');
      return;
    }
    if (p1 === p2) {
      setError('Please enter two distinct PRNs.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [res1, res2] = await Promise.all([
        fetchSingleStudent(p1, selectedExamId),
        fetchSingleStudent(p2, selectedExamId),
      ]);
      setStudent1(res1);
      setStudent2(res2);
    } catch (err: any) {
      setError(err.message || 'Error comparing student results');
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    setPrn1('210021000001');
    setPrn2('210021000002');
    setSelectedExamId('114');
    handleCompare(undefined, '210021000001', '210021000002');
  };

  // Compute common courses
  const comparisonRows = React.useMemo(() => {
    if (!student1 || !student2) return [];

    const map2 = new Map(student2.courses.map(c => [c.code.trim().toUpperCase(), c]));
    return student1.courses.map(c1 => {
      const c2 = map2.get(c1.code.trim().toUpperCase());
      const diffTotal = c2 ? c1.totalMarks - c2.totalMarks : 0;
      return {
        code: c1.code,
        title: c1.title,
        c1,
        c2,
        diffTotal,
      };
    });
  }, [student1, student2]);

  const scpaDiff = student1 && student2 ? student1.summary.scpa - student2.summary.scpa : 0;
  const marksDiff = student1 && student2 ? student1.summary.totalMarks - student2.summary.totalMarks : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Search Header Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Side-by-Side Student Comparison
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Comparator
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Compare academic marks, SCPA, external ESA, and course scores between two classmates.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSample}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample Classmates (01 vs 02)</span>
          </button>
        </div>

        <form onSubmit={handleCompare} className="mt-6 space-y-4">
          {/* Exam Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Examination
            </label>
            <select
              value={selectedExamId}
              onChange={e => setSelectedExamId(e.target.value)}
              disabled={isLoadingExams}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {exams.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2 PRN inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5 space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Student 1 (PRN)
              </label>
              <input
                type="text"
                value={prn1}
                onChange={e => setPrn1(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="210021000001"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div className="sm:col-span-5 space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Student 2 (PRN)
              </label>
              <input
                type="text"
                value={prn2}
                onChange={e => setPrn2(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="210021000002"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-sm disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                <span>Compare</span>
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {student1 && student2 && (
        <div className="space-y-6">
          {/* Side by side summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {student1.prn}
                </span>
                <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  student1.summary.result.toLowerCase() === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {student1.summary.result}
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mt-2">{student1.name}</h3>
              <p className="text-xs text-slate-500">{student1.programme}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <div className="text-[10px] uppercase font-bold text-blue-600">SCPA</div>
                  <div className="text-2xl font-black text-blue-900">{student1.summary.scpa.toFixed(2)}</div>
                  <div className="text-[11px] text-blue-700 font-semibold">Grade {student1.summary.grade}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Total Marks</div>
                  <div className="text-2xl font-black text-slate-800">{student1.summary.totalMarks}</div>
                  <div className="text-[11px] text-slate-500 font-medium">/{student1.summary.maxMarks} ({student1.summary.percentage}%)</div>
                </div>
              </div>
            </div>

            {/* Student 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {student2.prn}
                </span>
                <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  student2.summary.result.toLowerCase() === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {student2.summary.result}
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mt-2">{student2.name}</h3>
              <p className="text-xs text-slate-500">{student2.programme}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <div className="text-[10px] uppercase font-bold text-indigo-600">SCPA</div>
                  <div className="text-2xl font-black text-indigo-900">{student2.summary.scpa.toFixed(2)}</div>
                  <div className="text-[11px] text-indigo-700 font-semibold">Grade {student2.summary.grade}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Total Marks</div>
                  <div className="text-2xl font-black text-slate-800">{student2.summary.totalMarks}</div>
                  <div className="text-[11px] text-slate-500 font-medium">/{student2.summary.maxMarks} ({student2.summary.percentage}%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Head to head differential pill */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold shadow-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                {scpaDiff > 0 ? (
                  <><strong>{student1.name}</strong> leads by <strong>+{scpaDiff.toFixed(2)} SCPA</strong> ({Math.abs(marksDiff)} marks)</>
                ) : scpaDiff < 0 ? (
                  <><strong>{student2.name}</strong> leads by <strong>+{Math.abs(scpaDiff).toFixed(2)} SCPA</strong> ({Math.abs(marksDiff)} marks)</>
                ) : (
                  <>Both students tied with identical SCPA of <strong>{student1.summary.scpa.toFixed(2)}</strong></>
                )}
              </span>
            </div>
          </div>

          {/* Course by course comparison */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h4 className="font-bold text-slate-900 text-base">Course-by-Course Marks Comparison</h4>
            </div>

            {/* Mobile Cards (sm:hidden) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="p-3.5 space-y-2 bg-white text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">{row.code}</span>
                      <h5 className="font-bold text-slate-900 mt-1">{row.title}</h5>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                      <div className="text-[10px] text-blue-700 font-bold truncate">{student1.name.split(' ')[0]}</div>
                      <div className="text-base font-extrabold text-blue-900 mt-0.5">{row.c1.totalMarks} <span className="text-[10px] font-normal text-slate-400">({row.c1.grade})</span></div>
                    </div>
                    <div className="bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-indigo-700 font-bold truncate">{student2.name.split(' ')[0]}</div>
                      <div className="text-base font-extrabold text-indigo-900 mt-0.5">{row.c2 ? row.c2.totalMarks : 'N/A'} <span className="text-[10px] font-normal text-slate-400">({row.c2 ? row.c2.grade : '-'})</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3 text-center bg-blue-50/40 text-blue-900">{student1.name}</th>
                    <th className="px-4 py-3 text-center bg-indigo-50/40 text-indigo-900">{student2.name}</th>
                    <th className="px-4 py-3 text-center">Score Differential</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {comparisonRows.map((row, idx) => {
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono font-semibold text-slate-700">{row.code}</td>
                        <td className="px-4 py-3 font-medium text-slate-900 max-w-xs">{row.title}</td>
                        <td className="px-4 py-3 text-center font-bold text-slate-800 bg-blue-50/20">
                          {row.c1.totalMarks} <span className="text-xs font-medium text-slate-400">({row.c1.grade})</span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-800 bg-indigo-50/20">
                          {row.c2 ? `${row.c2.totalMarks} (${row.c2.grade})` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-center font-bold">
                          {row.diffTotal > 0 ? (
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+{row.diffTotal} (S1 Higher)</span>
                          ) : row.diffTotal < 0 ? (
                            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{row.diffTotal} (S2 Higher)</span>
                          ) : (
                            <span className="text-slate-400">Tied (0)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
