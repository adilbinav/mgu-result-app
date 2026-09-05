'use client';

import React from 'react';
import { GraduationCap, Users, Sparkles, Server, CheckCircle2, AlertCircle, Calculator, ArrowRightLeft } from 'lucide-react';

import { DegreeLevel } from '@/lib/types';

export type NavTab = 'single' | 'batch' | 'cgpa' | 'compare';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isLive: boolean;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  degreeLevel: DegreeLevel;
  setDegreeLevel: (val: DegreeLevel) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLive,
  demoMode,
  setDemoMode,
  degreeLevel,
  setDegreeLevel,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr ${
              degreeLevel === 'PG'
                ? 'from-indigo-700 via-purple-600 to-indigo-800'
                : 'from-blue-700 via-blue-600 to-indigo-600'
            } flex items-center justify-center text-white shadow-md shadow-blue-500/20`}>
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-xl tracking-tight text-slate-900">
                  MG University Results
                </h1>
                <span className={`hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  degreeLevel === 'PG' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {degreeLevel === 'PG' ? 'PGCSS (PG)' : 'CBCSS (UG)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden lg:block">
                Mahatma Gandhi University, Kottayam, Kerala
              </p>
            </div>
          </div>

          {/* Degree Level Selector (UG / PG Switcher) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold shadow-inner">
            <button
              type="button"
              onClick={() => setDegreeLevel('UG')}
              title="Switch to Undergraduate (CBCSS) examinations"
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                degreeLevel === 'UG'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎓 UG</span>
              <span className="hidden xl:inline text-[10px] opacity-90">(CBCSS)</span>
            </button>
            <button
              type="button"
              onClick={() => setDegreeLevel('PG')}
              title="Switch to Postgraduate (PGCSS) examinations"
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                degreeLevel === 'PG'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏛️ PG</span>
              <span className="hidden xl:inline text-[10px] opacity-90">(PGCSS)</span>
            </button>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'single'
                  ? 'bg-white text-blue-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Single Result</span>
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'batch'
                  ? 'bg-white text-blue-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Batch</span>
            </button>
            <button
              onClick={() => setActiveTab('cgpa')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'cgpa'
                  ? 'bg-white text-blue-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>CGPA</span>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'compare'
                  ? 'bg-white text-blue-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Compare</span>
            </button>
          </div>

          {/* Server status & Demo Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Status indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border bg-slate-50 border-slate-200">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isLive && !demoMode ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isLive && !demoMode ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="text-slate-600 font-medium">
                {demoMode ? 'Demo Simulator' : isLive ? 'MGU Server Live' : 'MGU Offline (Mock)'}
              </span>
            </div>

            {/* Toggle demo switch */}
            <button
              onClick={() => setDemoMode(!demoMode)}
              title="Toggle between Live MGU Server and Offline Simulator"
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                demoMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${demoMode ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {demoMode ? 'Demo Mode Active' : 'Demo Mode'}
              </span>
              <span className="sm:hidden">{demoMode ? 'Demo' : 'Live'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip (sm:hidden) */}
        <div className="sm:hidden grid grid-cols-4 gap-1 pb-2.5 text-center text-xs font-medium border-t border-slate-100 pt-2">
          <button
            onClick={() => setActiveTab('single')}
            className={`py-1 rounded-lg flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'single' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="text-[10px]">Single</span>
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`py-1 rounded-lg flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'batch' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px]">Batch</span>
          </button>
          <button
            onClick={() => setActiveTab('cgpa')}
            className={`py-1 rounded-lg flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'cgpa' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span className="text-[10px]">CGPA</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`py-1 rounded-lg flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'compare' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="text-[10px]">Compare</span>
          </button>
        </div>
      </div>
    </header>
  );
};
