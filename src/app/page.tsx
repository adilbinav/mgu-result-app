'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from '@/components/Navbar';
import { SingleResultView } from '@/components/SingleResultView';
import { BatchResultView } from '@/components/BatchResultView';
import { CgpaTrackerView } from '@/components/CgpaTrackerView';
import { StudentCompareView } from '@/components/StudentCompareView';
import { ExamInfo, DegreeLevel } from '@/lib/types';
import { ShieldAlert, ExternalLink, School, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('single');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>('UG');
  const [exams, setExams] = useState<ExamInfo[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Batch navigation preset
  const [batchPreset, setBatchPreset] = useState<{ startPrn: string; endPrn: string; examId: string } | null>(null);

  // Recent SCPA for CGPA tracker
  const [lastCheckedScpa, setLastCheckedScpa] = useState<number | undefined>();
  const [lastCheckedSemesterName, setLastCheckedSemesterName] = useState<string | undefined>();

  const handleNavigateToBatch = (startPrn: string, endPrn: string, examId: string) => {
    setBatchPreset({ startPrn, endPrn, examId });
    setActiveTab('batch');
  };

  const handleSetLastCheckedScpa = (scpa: number, examName?: string) => {
    setLastCheckedScpa(scpa);
    setLastCheckedSemesterName(examName);
  };

  // Load active examinations whenever demoMode OR degreeLevel changes
  useEffect(() => {
    let isMounted = true;
    async function loadExams() {
      setIsLoadingExams(true);
      try {
        const res = await fetch(`/api/exams?demo=${demoMode}&degree=${degreeLevel}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setExams(data.exams);
          setIsLive(data.isLive);
        }
      } catch (err) {
        console.error(`Failed to load ${degreeLevel} exams list:`, err);
      } finally {
        if (isMounted) setIsLoadingExams(false);
      }
    }
    loadExams();
    return () => {
      isMounted = false;
    };
  }, [demoMode, degreeLevel]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLive={isLive}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
        degreeLevel={degreeLevel}
        setDegreeLevel={setDegreeLevel}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* University Info Notice Banner */}
        <div className={`mb-6 p-4 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print ${
          degreeLevel === 'PG'
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/20'
            : 'bg-gradient-to-r from-blue-900 to-indigo-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <School className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>
                  {degreeLevel === 'PG' 
                    ? 'Mahatma Gandhi University PGCSS (PG) Examination Results' 
                    : 'Mahatma Gandhi University CBCSS (UG) Examination Results'}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-medium">
                  {degreeLevel === 'PG' ? 'PG Server Active' : 'UG Server Active'}
                </span>
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                {degreeLevel === 'PG'
                  ? 'Fast & reliable result portal for postgraduate PGCSS degree examinations (M.Sc, M.A, M.Com, MSW, M.Voc, etc.).'
                  : 'Fast & reliable result portal for undergraduate CBCSS & B.Voc degree examinations.'}
              </p>
            </div>
          </div>
          <a
            href={degreeLevel === 'PG' 
              ? 'https://dsdc.mgu.ac.in/exQpMgmt/index.php/public/PGResultView_ctrl/'
              : 'https://dsdc.mgu.ac.in/exQpMgmt/index.php/public/ResultView_ctrl/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3 h-3 text-blue-300" />
          </a>
        </div>

        {/* Tab View Switch */}
        {activeTab === 'single' && (
          <SingleResultView
            exams={exams}
            isLoadingExams={isLoadingExams}
            demoMode={demoMode}
            degreeLevel={degreeLevel}
            setDegreeLevel={setDegreeLevel}
            onNavigateToBatch={handleNavigateToBatch}
            onSetLastCheckedScpa={handleSetLastCheckedScpa}
          />
        )}
        {activeTab === 'batch' && (
          <BatchResultView
            exams={exams}
            isLoadingExams={isLoadingExams}
            demoMode={demoMode}
            degreeLevel={degreeLevel}
            setDegreeLevel={setDegreeLevel}
            initialStartPrn={batchPreset?.startPrn}
            initialEndPrn={batchPreset?.endPrn}
            initialExamId={batchPreset?.examId}
          />
        )}
        {activeTab === 'cgpa' && (
          <CgpaTrackerView
            lastCheckedScpa={lastCheckedScpa}
            lastCheckedSemesterName={lastCheckedSemesterName}
          />
        )}
        {activeTab === 'compare' && (
          <StudentCompareView
            exams={exams}
            isLoadingExams={isLoadingExams}
            demoMode={demoMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-wrap justify-center items-center gap-4 font-medium text-slate-600">
            <a href="https://mgu.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              MG University Official Site
            </a>
            <span>•</span>
            <a href="https://dsdc.mgu.ac.in/exQpMgmt/index.php/public/ResultView_ctrl/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              Direct Result View Server
            </a>
            <span>•</span>
            <span>CBCSS Revised Scheme (2017 Adm. Onwards)</span>
          </div>
          <p className="max-w-2xl mx-auto text-[11px] text-slate-400">
            Disclaimer: This web application retrieves provisional examination marks from the official Mahatma Gandhi University portal for faster accessibility and class analytics. It is not an official substitute for the original grade cards issued by the University.
          </p>
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} MG University Result Finder & Analytics
          </p>
        </div>
      </footer>
    </div>
  );
}
