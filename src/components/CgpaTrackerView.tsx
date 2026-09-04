'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  GraduationCap, 
  Award, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  Info,
  ChevronRight,
  BookmarkPlus
} from 'lucide-react';
import { SemesterRecord } from '@/lib/types';
import { calculateCgpa, getSavedCgpaRecords, saveCgpaRecords } from '@/lib/student-utils';

interface CgpaTrackerViewProps {
  lastCheckedScpa?: number;
  lastCheckedSemesterName?: string;
}

export const CgpaTrackerView: React.FC<CgpaTrackerViewProps> = ({
  lastCheckedScpa,
  lastCheckedSemesterName,
}) => {
  const [semesters, setSemesters] = useState<SemesterRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    setSemesters(getSavedCgpaRecords());
    setMounted(true);
  }, []);

  const handleUpdateSemester = (index: number, field: 'scpa' | 'credits' | 'completed', value: any) => {
    setSemesters(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };

      if (field === 'scpa') {
        const num = parseFloat(value);
        item.scpa = isNaN(num) ? 0 : Math.min(10, Math.max(0, num));
        if (item.scpa > 0) item.completed = true;
      } else if (field === 'credits') {
        const num = parseInt(value, 10);
        item.credits = isNaN(num) ? 0 : Math.max(1, num);
      } else if (field === 'completed') {
        item.completed = Boolean(value);
      }

      updated[index] = item;
      saveCgpaRecords(updated);
      return updated;
    });
  };

  const handleReset = () => {
    const resetList: SemesterRecord[] = [
      { semester: 1, name: 'Semester 1', scpa: 0, credits: 20, completed: false },
      { semester: 2, name: 'Semester 2', scpa: 0, credits: 20, completed: false },
      { semester: 3, name: 'Semester 3', scpa: 0, credits: 20, completed: false },
      { semester: 4, name: 'Semester 4', scpa: 0, credits: 20, completed: false },
      { semester: 5, name: 'Semester 5', scpa: 0, credits: 20, completed: false },
      { semester: 6, name: 'Semester 6', scpa: 0, credits: 20, completed: false },
    ];
    setSemesters(resetList);
    saveCgpaRecords(resetList);
  };

  const handleImportRecent = () => {
    if (!lastCheckedScpa) return;
    // Determine target semester from name or first incomplete
    let targetIndex = semesters.findIndex(s => !s.completed);
    if (targetIndex === -1) targetIndex = 4; // default Sem 5

    if (lastCheckedSemesterName) {
      const lower = lastCheckedSemesterName.toLowerCase();
      if (lower.includes('first')) targetIndex = 0;
      else if (lower.includes('second')) targetIndex = 1;
      else if (lower.includes('third')) targetIndex = 2;
      else if (lower.includes('fourth')) targetIndex = 3;
      else if (lower.includes('fifth')) targetIndex = 4;
      else if (lower.includes('sixth')) targetIndex = 5;
    }

    handleUpdateSemester(targetIndex, 'scpa', lastCheckedScpa);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const stats = calculateCgpa(semesters);

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Multi-Semester CGPA & Degree Tracker
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                10-Point Scale
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Track your Semester Grade Points (SCPA) across all 6 semesters of your MG University CBCSS degree and calculate your cumulative final CGPA.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {lastCheckedScpa && (
              <button
                type="button"
                onClick={handleImportRecent}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Import SCPA ({lastCheckedScpa.toFixed(2)})</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Live Cumulative Summary Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* CGPA */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-md">
            <div className="text-xs uppercase font-bold tracking-wider text-blue-200 flex items-center justify-between">
              <span>Cumulative CGPA</span>
              <Award className="w-4 h-4 text-blue-200" />
            </div>
            <div className="text-3xl sm:text-4xl font-black mt-2">
              {stats.cgpa.toFixed(2)}
            </div>
            <div className="text-xs text-blue-100 mt-1 font-medium">
              Out of 10.00 Grade Points
            </div>
          </div>

          {/* Equivalent Percentage */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Equivalent Percentage
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {stats.percentage.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Formula: CGPA × 10 (CBCSS)
            </div>
          </div>

          {/* Degree Classification */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Projected Degree Class
            </div>
            <div className="text-lg font-black text-slate-900 mt-2 leading-tight">
              {stats.classification}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              {stats.completedSemesters} of 6 Semesters Recorded
            </div>
          </div>

          {/* Total Credits */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Credits Earned
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {stats.totalCredits} <span className="text-sm font-normal text-slate-400">/ 120</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Standard CBCSS 3-Year Degree
            </div>
          </div>
        </div>
      </div>

      {/* 6 Semester Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {semesters.map((sem, idx) => {
          const isDone = sem.completed && sem.scpa > 0;
          return (
            <div 
              key={sem.semester}
              className={`p-5 rounded-2xl border transition-all ${
                isDone 
                  ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/10' 
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isDone ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    S{sem.semester}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{sem.name}</h4>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sem.completed}
                    onChange={(e) => handleUpdateSemester(idx, 'completed', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Done</span>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Semester SCPA (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="e.g. 7.85"
                    value={sem.scpa > 0 ? sem.scpa : ''}
                    onChange={(e) => handleUpdateSemester(idx, 'scpa', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Credits (C)
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Default: 20</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={sem.credits}
                    onChange={(e) => handleUpdateSemester(idx, 'credits', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
                  />
                </div>

                {isDone && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Credit Points (SCPA × C):</span>
                    <span className="font-bold text-blue-700">{(sem.scpa * sem.credits).toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card on MG University CBCSS Grading Standard */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
        <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
          <Info className="w-4 h-4 text-blue-600" />
          <span>MG University CBCSS Cumulative Grading Criteria</span>
        </h5>
        <p>
          Cumulative Grade Point Average (CGPA) is computed as Total Credit Points earned across completed semesters divided by Total Credits (CGPA = Σ(SCPA × Credits) / Σ Credits), where SCPA is the Semester Credit Point Average.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-medium">
          <div className="bg-white p-2 rounded-lg border border-slate-200"><strong>9.00 - 10.00:</strong> Outstanding (O)</div>
          <div className="bg-white p-2 rounded-lg border border-slate-200"><strong>8.00 - 8.99:</strong> Excellent (A+)</div>
          <div className="bg-white p-2 rounded-lg border border-slate-200"><strong>7.00 - 7.99:</strong> Very Good (A)</div>
          <div className="bg-white p-2 rounded-lg border border-slate-200"><strong>6.00 - 6.99:</strong> Good (B+)</div>
        </div>
      </div>
    </div>
  );
};
