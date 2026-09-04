'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Download, 
  Trophy, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Building
} from 'lucide-react';
import { ExamInfo, BatchResultResponse, StudentResult } from '@/lib/types';
import { MarksheetPrint } from './MarksheetPrint';
import { generateClassRange } from '@/lib/student-utils';

const ADMISSION_YEARS = [
  'ALL',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
];

interface BatchResultViewProps {
  exams: ExamInfo[];
  isLoadingExams: boolean;
  demoMode: boolean;
  initialStartPrn?: string;
  initialEndPrn?: string;
  initialExamId?: string;
}

export const BatchResultView: React.FC<BatchResultViewProps> = ({
  exams,
  isLoadingExams,
  demoMode,
  initialStartPrn,
  initialEndPrn,
  initialExamId,
}) => {
  const [selectedAdmissionYear, setSelectedAdmissionYear] = useState<string>('ALL');
  const [autoDetectedYear, setAutoDetectedYear] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId || '');
  const [startPrn, setStartPrn] = useState<string>(initialStartPrn || '210021000001');
  const [endPrn, setEndPrn] = useState<string>(initialEndPrn || '210021000015');

  const [loading, setLoading] = useState<boolean>(false);
  const [batchData, setBatchData] = useState<BatchResultResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Search and status filter inside leaderboard
  const [leaderboardSearch, setLeaderboardSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');

  // Auto-detect batch from first 2 digits of start PRN
  useEffect(() => {
    const clean = startPrn.trim();
    if (clean.length >= 2) {
      const prefix = parseInt(clean.slice(0, 2), 10);
      if (!isNaN(prefix) && prefix >= 16 && prefix <= 26) {
        setAutoDetectedYear(2000 + prefix);
      } else {
        setAutoDetectedYear(null);
      }
    } else {
      setAutoDetectedYear(null);
    }
  }, [startPrn]);

  const activeYearFilter = selectedAdmissionYear !== 'ALL'
    ? parseInt(selectedAdmissionYear, 10)
    : (autoDetectedYear || null);

  const filteredExams = exams.filter(e => {
    const matchesBatch = !activeYearFilter || 
      !e.applicableAdmissionYears || 
      e.applicableAdmissionYears.length === 0 || 
      e.applicableAdmissionYears.includes(activeYearFilter);
    return matchesBatch;
  });

  useEffect(() => {
    if (filteredExams.length > 0) {
      const currentStillValid = filteredExams.some(e => e.id === selectedExamId);
      if (!currentStillValid) {
        setSelectedExamId(filteredExams[0].id);
      }
    }
  }, [filteredExams, selectedExamId]);

  // Sorting state
  const [sortField, setSortField] = useState<'scpa' | 'name' | 'prn' | 'totalMarks'>('scpa');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Selected student for detail popup modal
  const [inspectedStudent, setInspectedStudent] = useState<StudentResult | null>(null);

  useEffect(() => {
    if (exams.length > 0 && !selectedExamId) {
      const defaultExam = exams.find(e => e.id === '114') || exams[0];
      setSelectedExamId(defaultExam.id);
    }
  }, [exams, selectedExamId]);

  const handleFetchBatch = async (e?: React.FormEvent, customStart?: string, customEnd?: string) => {
    if (e) e.preventDefault();
    const sPrn = customStart || startPrn;
    const ePrn = customEnd || endPrn;

    if (!selectedExamId) {
      setError('Please select an examination.');
      return;
    }
    if (!sPrn || !ePrn) {
      setError('Both Start PRN and End PRN are required.');
      return;
    }

    setLoading(true);
    setError(null);
    setBatchData(null);

    try {
      const res = await fetch('/api/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: selectedExamId,
          startPrn: sPrn.trim(),
          endPrn: ePrn.trim(),
          demoMode,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch batch results');
      }

      setBatchData(json.data);
    } catch (err: any) {
      setError(err.message || 'Error processing batch query.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = () => {
    setStartPrn('210021000001');
    setEndPrn('210021000015');
    handleFetchBatch(undefined, '210021000001', '210021000015');
  };

  const handleExportCsv = () => {
    if (!batchData || batchData.students.length === 0) return;

    const headers = [
      'Rank',
      'PRN',
      'Student Name',
      'Programme',
      'Exam Centre',
      'SCPA',
      'Grade',
      'Percentage',
      'Total Marks',
      'Max Marks',
      'Status',
    ];

    const rows = sortedStudents.map((s, idx) => [
      idx + 1,
      `"${s.prn}"`,
      `"${s.name}"`,
      `"${s.programme}"`,
      `"${s.examCentre}"`,
      s.summary.scpa.toFixed(2),
      s.summary.grade,
      `${s.summary.percentage}%`,
      s.summary.totalMarks,
      s.summary.maxMarks,
      s.summary.result,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MGU_Batch_Results_${startPrn}_to_${endPrn}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sorting & Filtering
  const sortedStudents = React.useMemo(() => {
    if (!batchData) return [];
    return [...batchData.students]
      .filter(s => {
        const query = leaderboardSearch.trim().toLowerCase();
        const matchesSearch = !query || 
          s.name.toLowerCase().includes(query) || 
          s.prn.includes(query);
        const matchesStatus = statusFilter === 'all' || 
          (statusFilter === 'passed' && s.summary.result.toLowerCase() === 'passed') ||
          (statusFilter === 'failed' && s.summary.result.toLowerCase() !== 'passed');
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = a.summary.scpa;
        let valB: any = b.summary.scpa;

        if (sortField === 'name') {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else if (sortField === 'prn') {
          valA = a.prn;
          valB = b.prn;
        } else if (sortField === 'totalMarks') {
          valA = a.summary.totalMarks;
          valB = b.summary.totalMarks;
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [batchData, sortField, sortAsc, leaderboardSearch, statusFilter]);

  const handleAutoClassScan = () => {
    const range = generateClassRange(startPrn, 60);
    setStartPrn(range.startPrn);
    setEndPrn(range.endPrn);
    handleFetchBatch(undefined, range.startPrn, range.endPrn);
  };

  const toggleSort = (field: 'scpa' | 'name' | 'prn' | 'totalMarks') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for marks/scpa
    }
  };

  const getGradeBadge = (grade: string) => {
    const g = grade.toUpperCase();
    if (g === 'O' || g === 'A+') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (g === 'A') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (g === 'B+') return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    if (g === 'B') return 'bg-sky-100 text-sky-800 border-sky-300';
    if (g === 'C') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Search Header Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Class & Batch Result Checker
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Bulk Scraper
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Fetch results for an entire class or roll-number range at once. Generates class rankings, pass percentage, and downloadable spreadsheet.
          </p>
        </div>

        <form onSubmit={handleFetchBatch} className="mt-6 space-y-4">
          {/* Starting / Admission Year Filter Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Class / Batch Admission Year
              </label>
              {autoDetectedYear && (
                <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Auto-detected {autoDetectedYear} Batch (Starts with {startPrn.slice(0, 2)}...)
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ADMISSION_YEARS.map(yr => {
                const isSelected = selectedAdmissionYear === yr || (selectedAdmissionYear === 'ALL' && autoDetectedYear === parseInt(yr, 10));
                return (
                  <button
                    type="button"
                    key={yr}
                    onClick={() => setSelectedAdmissionYear(yr)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {yr === 'ALL' ? 'All Batches' : `${yr} (${yr.slice(2)}...)`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exam dropdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Examination <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {filteredExams.length} {filteredExams.length === 1 ? 'exam' : 'exams'} available
                {activeYearFilter ? ` for ${activeYearFilter} Batch` : ''}
              </span>
            </div>
            <select
              value={selectedExamId}
              onChange={e => setSelectedExamId(e.target.value)}
              disabled={isLoadingExams}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              {isLoadingExams ? (
                <option>Loading examinations...</option>
              ) : filteredExams.length === 0 ? (
                <option value="">No examinations found for this batch</option>
              ) : (
                filteredExams.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* PRN Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Starting PRN <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoClassScan}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline flex items-center gap-1"
                >
                  <Users className="w-3 h-3 text-indigo-500" />
                  Whole Class (01-60)
                </button>
              </div>
              <input
                type="text"
                value={startPrn}
                onChange={e => setStartPrn(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="210021000001"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div className="sm:col-span-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ending PRN <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-fill Range (15 Students)
                </button>
              </div>
              <input
                type="text"
                value={endPrn}
                onChange={e => setEndPrn(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="210021000015"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div className="sm:col-span-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Batch...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Fetch Class Results</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Batch Results & Analytics */}
      {batchData && (
        <div className="space-y-6">
          {/* Top Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Pass Percentage */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>Pass Percentage</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {batchData.summary.passPercentage}%
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                <span className="text-emerald-600 font-bold">{batchData.summary.passedCount} Passed</span>
                <span>•</span>
                <span className="text-rose-600 font-bold">{batchData.summary.failedCount} Failed</span>
              </div>
            </div>

            {/* Class Topper */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-800">
                <span>Class Topper</span>
                <Trophy className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-2 truncate">
                {batchData.summary.topper?.name || 'N/A'}
              </div>
              <div className="text-xs text-amber-900 mt-1 font-semibold flex items-center gap-2">
                <span>SCPA: {batchData.summary.highestScpa.toFixed(2)}</span>
                <span>({batchData.summary.topper?.totalMarks} Marks)</span>
              </div>
            </div>

            {/* Average SCPA */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>Average SCPA</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-2">
                {batchData.summary.averageScpa.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                Out of 10.0 Grade Points
              </div>
            </div>

            {/* Total Records */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>Records Processed</span>
                <CheckCircle className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {batchData.summary.totalFound}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                {batchData.isDemo ? 'Sample Demonstration Mode' : 'Direct MGU Records'}
              </div>
            </div>
          </div>

          {/* Grade Distribution Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Grade Distribution
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {['A+', 'A', 'B+', 'B', 'C', 'F'].map(grade => {
                const count = batchData.summary.gradeDistribution[grade] || 0;
                const pct = batchData.summary.totalFound > 0 ? (count / batchData.summary.totalFound) * 100 : 0;
                return (
                  <div key={grade} className="bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-2.5">
                    <div className="text-xs font-bold text-slate-600">Grade {grade}</div>
                    <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{count}</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">{pct.toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Table & Mobile Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Class Leaderboard & Mark Sheet ({sortedStudents.length} Students)</span>
              </h3>
              <button
                onClick={handleExportCsv}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export CSV Spreadsheet</span>
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter by student name or PRN..."
                  value={leaderboardSearch}
                  onChange={(e) => setLeaderboardSearch(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
                <span className="text-slate-500 text-[11px] font-medium mr-1">Filter:</span>
                {(['all', 'passed', 'failed'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setStatusFilter(mode)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors ${
                      statusFilter === mode 
                        ? 'bg-white text-blue-700 shadow-xs border border-slate-300 font-bold' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Leaderboard Cards (sm:hidden) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {sortedStudents.map((s, idx) => {
                const isTop1 = idx === 0;
                return (
                  <div key={s.prn} className="p-3.5 space-y-2.5 bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="shrink-0 mt-0.5">
                          {isTop1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                              🥇
                            </span>
                          ) : idx === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                              🥈
                            </span>
                          ) : idx === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-bold text-xs">
                              🥉
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                              {idx + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">
                            {s.name}
                          </h4>
                          <span className="font-mono text-xs text-slate-500 font-medium">
                            PRN: {s.prn}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-extrabold text-blue-700">
                          {s.summary.scpa.toFixed(2)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block -mt-0.5">
                          SCPA
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${getGradeBadge(s.summary.grade)}`}>
                          Grade {s.summary.grade}
                        </span>
                        <span className="text-slate-600 font-medium text-[11px]">
                          {s.summary.totalMarks} <span className="text-slate-400">/{s.summary.maxMarks}</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            s.summary.result.toLowerCase() === 'passed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {s.summary.result}
                        </span>
                      </div>

                      <button
                        onClick={() => setInspectedStudent(s)}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Leaderboard Table (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-center">Rank</th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-blue-600 select-none"
                      onClick={() => toggleSort('prn')}
                    >
                      <div className="flex items-center gap-1">
                        <span>PRN</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-blue-600 select-none"
                      onClick={() => toggleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Student Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-center cursor-pointer hover:text-blue-600 select-none"
                      onClick={() => toggleSort('scpa')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>SCPA</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-center cursor-pointer hover:text-blue-600 select-none"
                      onClick={() => toggleSort('totalMarks')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Marks</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center">Grade</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedStudents.map((s, idx) => {
                    const isTop1 = idx === 0;
                    const isTop3 = idx < 3;
                    return (
                      <tr key={s.prn} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 text-center">
                          {isTop1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                              🥇
                            </span>
                          ) : idx === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                              🥈
                            </span>
                          ) : idx === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-bold text-xs">
                              🥉
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500">{idx + 1}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">
                          {s.prn}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {s.name}
                        </td>
                        <td className="px-4 py-3 text-center font-extrabold text-blue-700 text-base">
                          {s.summary.scpa.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-slate-700">
                          {s.summary.totalMarks} <span className="text-xs text-slate-400">/{s.summary.maxMarks}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md border ${getGradeBadge(s.summary.grade)}`}>
                            {s.summary.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                              s.summary.result.toLowerCase() === 'passed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {s.summary.result}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setInspectedStudent(s)}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
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

      {/* Student Details Inspection Modal */}
      {inspectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <div className="flex items-center justify-between border-b pb-3 sm:pb-4 mb-4">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900">{inspectedStudent.name}</h3>
                <p className="text-xs text-slate-500 font-mono">PRN: {inspectedStudent.prn} • {inspectedStudent.programme}</p>
              </div>
              <button
                onClick={() => setInspectedStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Student mini breakdown */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 text-center">
              <div className="bg-blue-50 p-2.5 sm:p-3 rounded-xl border border-blue-100">
                <div className="text-[10px] sm:text-xs uppercase text-blue-600 font-bold">SCPA</div>
                <div className="text-xl sm:text-2xl font-black text-blue-900">{inspectedStudent.summary.scpa.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] sm:text-xs uppercase text-slate-500 font-bold">Total Marks</div>
                <div className="text-xl sm:text-2xl font-black text-slate-800">{inspectedStudent.summary.totalMarks} <span className="text-xs font-normal text-slate-400">/{inspectedStudent.summary.maxMarks}</span></div>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] sm:text-xs uppercase text-slate-500 font-bold">Result</div>
                <div className={`text-base sm:text-xl font-black uppercase mt-0.5 ${inspectedStudent.summary.result.toLowerCase() === 'passed' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {inspectedStudent.summary.result}
                </div>
              </div>
            </div>

            {/* Mobile Course Cards in Modal (sm:hidden) */}
            <div className="sm:hidden divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden mb-4">
              {inspectedStudent.courses.map((c, i) => (
                <div key={i} className="p-3 space-y-2 bg-white text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">
                        {c.code}
                      </span>
                      <h5 className="font-bold text-slate-900 mt-1">{c.title}</h5>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getGradeBadge(c.grade)}`}>
                        {c.grade}
                      </span>
                      <div className="text-[10px] uppercase font-bold mt-1" style={{ color: c.result.toLowerCase() === 'passed' ? 'green' : 'red' }}>
                        {c.result}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center text-[10px] bg-slate-50 p-1.5 rounded">
                    <div><span className="text-slate-400 block font-semibold">ESA</span><span className="font-bold">{c.esaMarks}/{c.esaMax}</span></div>
                    <div><span className="text-slate-400 block font-semibold">ISA</span><span className="font-bold">{c.isaMarks}/{c.isaMax}</span></div>
                    <div><span className="text-slate-400 block font-semibold">Total</span><span className="font-bold text-blue-700">{c.totalMarks}</span></div>
                    <div><span className="text-slate-400 block font-semibold">Credits</span><span className="font-bold">{c.credit}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Table in Modal (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Course</th>
                    <th className="p-2.5 text-center">Credits</th>
                    <th className="p-2.5 text-center">ESA</th>
                    <th className="p-2.5 text-center">ISA</th>
                    <th className="p-2.5 text-center">Total</th>
                    <th className="p-2.5 text-center">Grade</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inspectedStudent.courses.map((c, i) => (
                    <tr key={i}>
                      <td className="p-2.5 font-mono text-slate-700">{c.code}</td>
                      <td className="p-2.5 font-medium text-slate-900">{c.title}</td>
                      <td className="p-2.5 text-center">{c.credit}</td>
                      <td className="p-2.5 text-center">{c.esaMarks}/{c.esaMax}</td>
                      <td className="p-2.5 text-center">{c.isaMarks}/{c.isaMax}</td>
                      <td className="p-2.5 text-center font-bold">{c.totalMarks}</td>
                      <td className="p-2.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${getGradeBadge(c.grade)}`}>
                          {c.grade}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-semibold uppercase">{c.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-end">
              <button
                onClick={() => setInspectedStudent(null)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
