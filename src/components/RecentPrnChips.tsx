'use client';

import React, { useState, useEffect } from 'react';
import { Star, Clock, X, Sparkles } from 'lucide-react';
import { SavedPrn } from '@/lib/types';
import { getSavedPrns, removeSavedPrn, toggleStarredPrn } from '@/lib/student-utils';

interface RecentPrnChipsProps {
  onSelectPrn: (prn: string) => void;
  currentPrn: string;
}

export const RecentPrnChips: React.FC<RecentPrnChipsProps> = ({ onSelectPrn, currentPrn }) => {
  const [savedPrns, setSavedPrns] = useState<SavedPrn[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);

  const refreshList = () => {
    setSavedPrns(getSavedPrns());
  };

  useEffect(() => {
    refreshList();
    setMounted(true);
  }, [currentPrn]);

  const handleToggleStar = (e: React.MouseEvent, prn: string) => {
    e.stopPropagation();
    const updated = toggleStarredPrn(prn);
    setSavedPrns(updated);
  };

  const handleRemove = (e: React.MouseEvent, prn: string) => {
    e.stopPropagation();
    const updated = removeSavedPrn(prn);
    setSavedPrns(updated);
  };

  if (!mounted || savedPrns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Recent & Saved PRNs:</span>
        </span>
        <span className="text-[10px] text-slate-400">1-click to fill</span>
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        {savedPrns.slice(0, 6).map((item) => {
          const isCurrent = currentPrn === item.prn;
          return (
            <div
              key={item.prn}
              onClick={() => onSelectPrn(item.prn)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                isCurrent
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={(e) => handleToggleStar(e, item.prn)}
                title={item.starred ? 'Starred' : 'Star this PRN'}
                className="hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-3 h-3 ${
                    item.starred ? 'fill-amber-400 text-amber-500' : 'text-slate-300 hover:text-amber-400'
                  }`}
                />
              </button>

              <span>{item.prn}</span>

              {item.name && (
                <span className="font-sans font-medium text-[10px] text-slate-500 truncate max-w-[80px]">
                  ({item.name.split(' ')[0]})
                </span>
              )}

              {item.scpa !== undefined && (
                <span className="font-sans font-bold text-[10px] text-blue-600">
                  {item.scpa.toFixed(1)}
                </span>
              )}

              <button
                type="button"
                onClick={(e) => handleRemove(e, item.prn)}
                title="Remove"
                className="text-slate-400 hover:text-rose-500 ml-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
