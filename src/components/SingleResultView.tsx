'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Printer, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  Award, 
  BookOpen, 
  Building2, 
  UserCheck, 
  Percent, 
  Flame, 
  ArrowRight,
  RefreshCw,
  Sparkles,
  Info,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamInfo, StudentResult } from '@/lib/types';
import { MarksheetPrint } from './MarksheetPrint';
import { OfficialResultView } from './OfficialResultView';
import { GradeBoosterCard } from './GradeBoosterCard';
import { RecentPrnChips } from './RecentPrnChips';
import { generateClassRange, savePrnToStorage } from '@/lib/student-utils';

interface SingleResultViewProps {
  exams: ExamInfo[];
  isLoadingExams: boolean;
  demoMode: boolean;
  onNavigateToBatch?: (startPrn: string, endPrn: string, examId: string) => void;
  onSetLastCheckedScpa?: (scpa: number, examName?: string) => void;
}

const SEMESTER_FILTERS = [
  'ALL',
  'FIFTH SEMESTER',
  'SIXTH SEMESTER',
  'FOURTH SEMESTER',
  'THIRD SEMESTER',
  'SECOND SEMESTER',
  'FIRST SEMESTER',
];

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

export const SingleResultView: React.FC<SingleResultViewProps> = ({
  exams,
  isLoadingExams,
  demoMode,
  onNavigateToBatch,
  onSetLastCheckedScpa,
}) => {
  const [selectedAdmissionYear, setSelectedAdmissionYear] = useState<string>('ALL');
  const [autoDetectedYear, setAutoDetectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');
  const [examSearch, setExamSearch] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [prn, setPrn] = useState<string>('');
  const [viewFormat, setViewFormat] = useState<'official' | 'modern'>('official');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<StudentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-generate class range if PRN has enough digits
  const classRange = React.useMemo(() => {
    if (prn.trim().length >= 8) {
      return generateClassRange(prn.trim(), 60);
    }
    return null;
  }, [prn]);

  // Auto-detect admission year from first 2 digits of PRN (e.g. 210021000001 -> 2021 Batch)
  useEffect(() => {
    const clean = prn.trim();
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
  }, [prn]);

  // Effective admission year: manual selection takes precedence over auto-detection
  const activeYearFilter = selectedAdmissionYear !== 'ALL'
    ? parseInt(selectedAdmissionYear, 10)
    : (autoDetectedYear || null);

  // Filter exams based on search, semester tab, and admission year
  const filteredExams = exams.filter(e => {
    const matchesSem = selectedSemester === 'ALL' || e.semester === selectedSemester;
    const matchesSearch = !examSearch || e.name.toLowerCase().includes(examSearch.toLowerCase());
    const matchesBatch = !activeYearFilter || 
      !e.applicableAdmissionYears || 
      e.applicableAdmissionYears.length === 0 || 
      e.applicableAdmissionYears.includes(activeYearFilter);
    return matchesSem && matchesSearch && matchesBatch;
  });

  // Keep selectedExamId valid whenever filteredExams change
  useEffect(() => {
    if (filteredExams.length > 0) {
      const currentStillValid = filteredExams.some(e => e.id === selectedExamId);
      if (!currentStillValid) {
        setSelectedExamId(filteredExams[0].id);
      }
    }
  }, [filteredExams, selectedExamId]);

  const handleFetchResult = async (e?: React.FormEvent, customPrn?: string, customExamId?: string) => {
    if (e) e.preventDefault();
    const queryPrn = customPrn || prn;
    const queryExamId = customExamId || selectedExamId;

    if (!queryExamId) {
      setError('Please select an Examination from the list.');
      return;
    }
    if (!queryPrn || queryPrn.trim().length < 5) {
      setError('Please enter a valid PRN (Permanent Register Number).');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: queryExamId,
          prn: queryPrn.trim(),
          demoMode,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to retrieve result');
      }

      // Attach exam name if missing
      const examObj = exams.find(x => x.id === queryExamId);
      const studentData: StudentResult = {
        ...json.data,
        examName: examObj ? examObj.name : 'MG University CBCSS Examination',
      };

      setResult(studentData);

      // Save to recent PRNs in local storage
      savePrnToStorage(studentData.prn, studentData.name, studentData.summary.scpa, studentData.examName);

      // Update parent last checked SCPA for CGPA tracker import
      if (onSetLastCheckedScpa) {
        onSetLastCheckedScpa(studentData.summary.scpa, studentData.examName);
      }

      // Trigger confetti if passed
      if (studentData.summary.result.toLowerCase() === 'passed') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching your marksheet.');
    } finally {
      setLoading(false);
    }
  };

  const fillSamplePrn = (samplePrn: string, sampleExamId: string = '114') => {
    setPrn(samplePrn);
    setSelectedExamId(sampleExamId);
    handleFetchResult(undefined, samplePrn, sampleExamId);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!result) return;
    const shareText = `🎓 MG University Result for ${result.name} (PRN: ${result.prn}):\nProgramme: ${result.programme}\nSCPA: ${result.summary.scpa.toFixed(2)} (${result.summary.grade})\nPercentage: ${result.summary.percentage}%\nResult: ${result.summary.result}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Grade color helper
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Search and Query Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 no-print">
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Check Exam Result</span>
            {demoMode && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Demo Simulator
              </span>
            )}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Select your semester examination, input your Register Number (PRN), and fetch your verified grade card.
          </p>
        </div>

        <form onSubmit={handleFetchResult} className="mt-6 space-y-5">
          {/* Starting / Admission Year Filter Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Starting / Admission Year (Batch)
              </label>
              {autoDetectedYear && (
                <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Auto-detected {autoDetectedYear} Batch from PRN ({prn.slice(0, 2)}...)
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

          {/* Semester Filter Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Filter by Semester
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SEMESTER_FILTERS.map(sem => (
                <button
                  type="button"
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedSemester === sem
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sem === 'ALL' ? 'All Semesters' : sem.replace(' SEMESTER', ' Sem')}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="exam-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Select Examination <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredExams.length} {filteredExams.length === 1 ? 'exam' : 'exams'} available
                  {activeYearFilter ? ` for ${activeYearFilter} Batch` : ''}
                </span>
              </div>
              <div className="relative">
                <select
                  id="exam-select"
                  value={selectedExamId}
                  onChange={e => setSelectedExamId(e.target.value)}
                  disabled={isLoadingExams}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none pr-10"
                >
                  {isLoadingExams ? (
                    <option>Loading available examinations...</option>
                  ) : filteredExams.length === 0 ? (
                    <option value="">No exams found matching filter</option>
                  ) : (
                    filteredExams.map(ex => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Quick Filter Search */}
            <div className="md:col-span-4 space-y-2">
              <label htmlFor="exam-search" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Search Exam
              </label>
              <div className="relative">
                <input
                  id="exam-search"
                  type="text"
                  placeholder="e.g. 2024, B.Voc, CBCS..."
                  value={examSearch}
                  onChange={e => setExamSearch(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* PRN Input and Submit Button */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-2">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="prn-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Permanent Register Number (PRN) <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fillSamplePrn('210021000001', '114')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    Try Real Student PRN (210021000001)
                  </button>
                </div>
              </div>
              <input
                id="prn-input"
                type="text"
                maxLength={14}
                placeholder="Enter 12-digit PRN, e.g. 210021000001"
                value={prn}
                onChange={e => setPrn(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-base font-mono font-semibold text-slate-900 tracking-wider placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />

              {/* Recent & Starred PRN Quick Chips */}
              <RecentPrnChips
                currentPrn={prn}
                onSelectPrn={(selected) => {
                  setPrn(selected);
                  handleFetchResult(undefined, selected);
                }}
              />

              {/* 1-Click Class Auto-Scan Button */}
              {classRange && onNavigateToBatch && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToBatch(classRange.startPrn, classRange.endPrn, selectedExamId)}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl font-semibold border border-indigo-200 transition-colors shadow-xs"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>🚀 Scan My Entire Class ({classRange.startPrn.slice(-3)} to {classRange.endPrn.slice(-3)})</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-medium">Auto-detected college roll range (001 to 060)</span>
                </div>
              )}
            </div>

            <div className="md:col-span-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Fetching Result...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Get Result</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Result Not Found / Error</p>
              <p className="text-rose-600 mt-0.5">{error}</p>
              <div className="mt-2 text-xs text-rose-700">
                Tip: If the university server is busy, you can toggle <strong>Demo Mode</strong> in the top header or click <strong>Try Real Student PRN</strong> above.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Result Display Section */}
      {result && (
        <div className="space-y-6">
          {/* Grade Booster & Revaluation Analysis Card */}
          <GradeBoosterCard courses={result.courses} scpa={result.summary.scpa} />

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print bg-white p-3 sm:px-5 sm:py-3.5 rounded-2xl border border-slate-200 shadow-sm">
            {/* View Format Switcher */}
            <div className="grid grid-cols-2 sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewFormat('official')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg transition-all text-center ${
                  viewFormat === 'official'
                    ? 'bg-white text-blue-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏛️ Official Format</span>
              </button>
              <button
                type="button"
                onClick={() => setViewFormat('modern')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg transition-all text-center ${
                  viewFormat === 'modern'
                    ? 'bg-white text-blue-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>✨ Modern View</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Marksheet</span>
              </button>
            </div>
          </div>

          {viewFormat === 'official' ? (
            <OfficialResultView result={result} />
          ) : (
            <>
          {/* Student Profile & Quick Summary */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 no-print marksheet-watermark">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Student Identity */}
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>PRN: {result.prn}</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {result.name}
                </h3>
                <div className="space-y-1 text-sm text-slate-600">
                  <p className="flex items-center gap-2 font-medium">
                    <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{result.programme}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{result.examCentre}</span>
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                {/* SCPA Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 p-4 rounded-xl text-center">
                  <div className="text-xs uppercase font-bold tracking-wider text-blue-600">
                    SCPA / SGPA
                  </div>
                  <div className="text-3xl font-extrabold text-blue-900 mt-1">
                    {result.summary.scpa.toFixed(2)}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${getGradeBadge(result.summary.grade)}`}>
                      Grade {result.summary.grade}
                    </span>
                  </div>
                </div>

                {/* Percentage Card */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
                    Percentage
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800 mt-1">
                    {result.summary.percentage}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">
                    {result.summary.totalMarks} / {result.summary.maxMarks} Marks
                  </div>
                </div>

                {/* Status Card */}
                <div className="col-span-2 bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between px-5">
                  <span className="text-xs uppercase font-bold text-slate-500">Semester Status</span>
                  <span
                    className={`text-sm font-black uppercase px-3 py-1 rounded-full ${
                      result.summary.result.toLowerCase() === 'passed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {result.summary.result}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Courses / Subjects Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden no-print">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Course-wise Performance ({result.courses.length} Courses)</span>
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                Total Credits: {result.summary.totalCredits}
              </span>
            </div>

            {/* Mobile Course Cards (Visible only on mobile: sm:hidden) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {result.courses.map((course, idx) => (
                <div key={idx} className="p-3.5 space-y-2.5 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {course.code}
                      </span>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        {course.title}
                      </h5>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md border ${getGradeBadge(course.grade)}`}>
                        Grade {course.grade}
                      </span>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            course.result.toLowerCase() === 'passed'
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-rose-700 bg-rose-50'
                          }`}
                        >
                          {course.result}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">ESA</div>
                      <div className="font-semibold text-slate-800">{course.esaMarks} <span className="text-[10px] text-slate-400">/{course.esaMax}</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">ISA</div>
                      <div className="font-semibold text-slate-800">{course.isaMarks} <span className="text-[10px] text-slate-400">/{course.isaMax}</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Total</div>
                      <div className="font-bold text-blue-700">{course.totalMarks} <span className="text-[10px] text-slate-400">/{course.maxMarks}</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Credits</div>
                      <div className="font-semibold text-slate-800">{course.credit} <span className="text-[10px] text-slate-400">({course.creditPoint} CP)</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Table (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Course Title</th>
                    <th className="px-3 py-3 text-center">Credit</th>
                    <th className="px-3 py-3 text-center">External (ESA)</th>
                    <th className="px-3 py-3 text-center">Internal (ISA)</th>
                    <th className="px-3 py-3 text-center">Total / Max</th>
                    <th className="px-3 py-3 text-center">Grade</th>
                    <th className="px-3 py-3 text-center">GP</th>
                    <th className="px-3 py-3 text-center">CP</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.courses.map((course, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">
                        {course.code}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 max-w-xs">
                        {course.title}
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-slate-700">
                        {course.credit}
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-slate-700">
                        {course.esaMarks} <span className="text-xs text-slate-400">/{course.esaMax}</span>
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-slate-700">
                        {course.isaMarks} <span className="text-xs text-slate-400">/{course.isaMax}</span>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-slate-900">
                        {course.totalMarks} <span className="text-xs font-normal text-slate-400">/{course.maxMarks}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md border ${getGradeBadge(course.grade)}`}>
                          {course.grade}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-slate-600 font-medium">
                        {course.gradePoint}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-600 font-medium">
                        {course.creditPoint}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                            course.result.toLowerCase() === 'passed'
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-rose-700 bg-rose-50'
                          }`}
                        >
                          {course.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Totals */}
            <div className="bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 sm:gap-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Total Credits: <strong>{result.summary.totalCredits}</strong></span>
                <span>Credit Points (CP): <strong>{result.summary.creditPoints}</strong></span>
                <span>Total Marks: <strong>{result.summary.totalMarks} / {result.summary.maxMarks}</strong></span>
              </div>
              <div className="font-semibold text-slate-800 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-200 flex items-center justify-between sm:justify-start gap-2">
                <span>Semester SCPA:</span>
                <span className="text-blue-600 text-sm font-bold">{result.summary.scpa.toFixed(2)}</span>
              </div>
            </div>
          </div>
            </>
          )}

          {/* Printable Layout (Hidden on Screen, Visible on Print) */}
          <MarksheetPrint result={result} />
        </div>
      )}
    </div>
  );
};
