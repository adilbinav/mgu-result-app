'use client';

import React from 'react';
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { CourseResult } from '@/lib/types';
import { analyzeCourseGradeGap } from '@/lib/student-utils';

interface GradeBoosterCardProps {
  courses: CourseResult[];
  scpa: number;
}

export const GradeBoosterCard: React.FC<GradeBoosterCardProps> = ({ courses, scpa }) => {
  const analysisList = courses.map(c => analyzeCourseGradeGap(c));
  const revalCandidates = analysisList.filter(a => a.recommendRevaluation);

  if (revalCandidates.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-50/80 rounded-2xl p-4 sm:p-6 border border-amber-200 shadow-xs no-print space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
              <span>Grade Booster & Revaluation Advisor</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                {revalCandidates.length} Course{revalCandidates.length > 1 ? 's' : ''} Identified
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Identifies courses where you are within 1–3 marks of the next higher letter grade or passing boundary.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {revalCandidates.map((c, i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-xs text-xs space-y-1.5">
            <div className="flex items-start justify-between gap-1">
              <div>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded">
                  {c.courseCode}
                </span>
                <h5 className="font-bold text-slate-900 mt-1 line-clamp-1">{c.courseTitle}</h5>
              </div>
              <span className="shrink-0 font-bold px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800">
                Grade {c.currentGrade} ({c.currentMarks}/{c.maxMarks})
              </span>
            </div>

            <div className="bg-amber-50/80 p-2 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
              {c.marksNeeded !== null && c.marksNeeded <= 3 ? (
                <div className="flex items-center gap-1.5 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Needs only <strong>{c.marksNeeded} more mark{c.marksNeeded > 1 ? 's' : ''}</strong> for <strong>Grade {c.nextGrade}</strong>! Revaluation highly recommended.
                  </span>
                </div>
              ) : c.isBorderlinePass ? (
                <div className="flex items-center gap-1.5 font-medium text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>
                    Borderline failed in External ESA. {c.esaMarksNeededForPass ? `Missing only ${c.esaMarksNeededForPass} mark(s) in ESA to pass.` : 'Eligible for scrutiny.'}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-amber-900/80 flex items-center justify-between pt-1">
        <span>
          💡 MG University revaluation/scrutiny applications can be submitted online within 15 days of result publication via the official portal.
        </span>
      </div>
    </div>
  );
};
