'use client';

import React from 'react';
import { GraduationCap, Users, Sparkles, Server, CheckCircle2, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'single' | 'batch';
  setActiveTab: (tab: 'single' | 'batch') => void;
  isLive: boolean;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLive,
  demoMode,
  setDemoMode,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">
                  MG University Results
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  CBCSS Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Mahatma Gandhi University, Kottayam, Kerala
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg transition-all ${
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
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'batch'
                  ? 'bg-white text-blue-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Batch / Class</span>
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
      </div>
    </header>
  );
};
