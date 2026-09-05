'use client';

import React, { useState } from 'react';
import { StudentResult } from '@/lib/types';
import { Layers, Table as TableIcon, ArrowRightLeft } from 'lucide-react';

interface OfficialResultViewProps {
  result: StudentResult;
}

export const OfficialResultView: React.FC<OfficialResultViewProps> = ({ result }) => {
  const { prn, name, programme, examCentre, courses, summary } = result;
  const isPg = result.degreeLevel === 'PG';
  const [mobileViewType, setMobileViewType] = useState<'cards' | 'table'>('cards');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative overflow-hidden my-4 sm:my-6 bg-white p-2 sm:p-6 rounded-xl shadow-md border border-slate-300">
      {/* Official MGU Floating Diagonal Watermark */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span 
          style={{
            fontSize: 'clamp(3rem, 10vw, 5.5rem)',
            color: 'rgba(0, 0, 0, 0.07)',
            transform: 'rotate(-45deg)',
            fontFamily: 'sans-serif',
            fontStyle: 'italic',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}
        >
          MG University
        </span>
      </div>

      {/* Main Official Content Container matching results.mgu.ac.in */}
      <div className="relative z-10 w-full max-w-4xl mx-auto bg-white border border-[#84888c] shadow-[0px_4px_10px_rgba(0,0,0,0.15)] font-sans rounded-sm">
        {/* Top Header Banner */}
        <div 
          className="border-b border-[#E8E8E8] px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-4"
          style={{
            background: 'linear-gradient(to bottom, #ffffff 55%, #f6f6f6 99%, #ededed 100%)',
          }}
        >
          {/* Official Logo */}
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://dsdc.mgu.ac.in/exQpMgmt/images/logo.gif" 
              alt="MGU Logo" 
              className="w-10 h-11 sm:w-14 sm:h-15 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h2 
              className="text-base sm:text-xl font-bold tracking-tight text-[#004F91] leading-tight"
              style={{ textShadow: '1px 1px 0px #bcd6f3' }}
            >
              Mahatma Gandhi University {isPg ? 'PG CSS' : 'CBCSS'} Exam Results
            </h2>
            <p className="text-[11px] sm:text-sm font-semibold text-[#313131]">
              (Revised Scheme)
            </p>
          </div>
        </div>

        {/* Inner Content Area with Fieldset Frame */}
        <div className="p-2.5 sm:p-6 bg-white">
          <fieldset 
            className="p-3 sm:p-5 rounded"
            style={{
              border: '1px solid #739f43',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <legend className="px-1.5 text-sm font-bold text-[#739f43]">
                Result
              </legend>

              {/* Mobile View Toggle (Visible only on small mobile screens) */}
              <div className="sm:hidden flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-300 text-[10px]">
                <button
                  type="button"
                  onClick={() => setMobileViewType('cards')}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    mobileViewType === 'cards' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setMobileViewType('table')}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    mobileViewType === 'table' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>

            {/* Candidate Details (Stacked for phones, Table for tablet/desktop) */}
            <div className="mb-4">
              {/* Mobile Stacked Info (sm:hidden) */}
              <div className="sm:hidden space-y-1.5 text-xs border border-slate-200 p-3 rounded bg-slate-50/70">
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span className="font-bold text-slate-600">PRN:</span>
                  <span className="font-mono font-bold text-slate-900">{prn}</span>
                </div>
                <div className="border-b border-slate-200/60 pb-1">
                  <span className="font-bold text-slate-600 block">Name:</span>
                  <span className="font-bold text-sm" style={{ color: '#993366' }}>{name}</span>
                </div>
                <div className="border-b border-slate-200/60 pb-1">
                  <span className="font-bold text-slate-600 block">{isPg ? 'Program:' : 'Programme:'}</span>
                  <span className="text-slate-900 font-medium">{programme}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">Exam Centre:</span>
                  <span className="text-slate-900 font-medium">{examCentre}</span>
                </div>
              </div>

              {/* Desktop / Tablet Table View (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-1 font-bold text-slate-800 w-48">
                        {isPg ? 'PRN' : 'Permanent Register Number'}
                      </td>
                      <td className="py-1 px-2 font-bold text-center w-6">:</td>
                      <td className="py-1 font-semibold text-slate-900 text-sm">{prn}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold text-slate-800">
                        {isPg ? 'Name' : 'Name of Student'}
                      </td>
                      <td className="py-1 px-2 font-bold text-center">:</td>
                      <td className="py-1 font-bold text-base" style={{ color: '#993366' }}>
                        {name}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold text-slate-800">
                        {isPg ? 'Program' : 'Programme'}
                      </td>
                      <td className="py-1 px-2 font-bold text-center">:</td>
                      <td className="py-1 text-slate-900">{programme}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold text-slate-800">Exam Centre</td>
                      <td className="py-1 px-2 font-bold text-center">:</td>
                      <td className="py-1 text-slate-900">{examCentre}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 1. Mobile Cards View (sm:hidden when cards selected) */}
            {mobileViewType === 'cards' && (
              <div className="sm:hidden space-y-3 mb-4">
                {courses.map((c, i) => (
                  <div 
                    key={i} 
                    className="p-3 rounded border text-xs bg-white shadow-xs"
                    style={{ border: '1px solid #333333' }}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                      <div>
                        <span className="font-mono font-bold text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          {c.code}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs mt-1">
                          {c.title}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                          Grade {c.grade}
                        </span>
                        <div className="mt-1">
                          <strong style={{ fontSize: '11px' }}>
                            <span style={{ color: c.result.toLowerCase() === 'passed' ? 'green' : 'red' }}>
                              {c.result}
                            </span>
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Mark Details Grid (PG vs UG) */}
                    {isPg ? (
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] bg-slate-50 p-2 rounded">
                        <div>
                          <div className="font-bold text-slate-500 text-[10px]">Theory (INT/EXT)</div>
                          <div className="font-semibold">{c.theoryInt || '---'} / {c.theoryExt || '---'}</div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-500 text-[10px]">Practical (INT/EXT)</div>
                          <div className="font-semibold">{c.practicalInt || '---'} / {c.practicalExt || '---'}</div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-500 text-[10px]">Course GPA</div>
                          <div className="font-bold text-blue-700">{c.gpa !== undefined ? c.gpa.toFixed(2) : '---'}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] bg-slate-50 p-2 rounded">
                        <div>
                          <div className="font-bold text-slate-500 text-[10px]">ESA</div>
                          <div className="font-semibold">{c.esaMarks}/{c.esaMax}</div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-500 text-[10px]">ISA</div>
                          <div className="font-semibold">{c.isaMarks}/{c.isaMax}</div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-500 text-[10px]">Total</div>
                          <div className="font-bold text-slate-900">{c.totalMarks}/{c.maxMarks}</div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-500 text-[10px]">Credits (CP)</div>
                          <div className="font-semibold">{c.credit} ({c.creditPoint})</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Semester Result Summary Box */}
                <div 
                  className="p-3.5 rounded text-xs bg-slate-50 text-center space-y-2"
                  style={{ border: '1.5px solid #333333' }}
                >
                  <div className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                    {isPg ? 'SEMESTER RESULT' : 'SEMESTER RESULT'}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold">{isPg ? 'GPA / Grade' : 'SCPA / Grade'}</div>
                      <div className="font-extrabold text-sm text-[#004F91]">
                        {summary.scpa.toFixed(2)} ({summary.grade})
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold">{isPg ? 'Scale' : 'Total Marks'}</div>
                      <div className="font-extrabold text-sm">
                        {isPg ? '5.00 Point' : `${summary.totalMarks}/${summary.maxMarks}`}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold">Status</div>
                      <div className="font-extrabold text-sm uppercase" style={{ color: summary.result.toLowerCase() === 'passed' ? '#339900' : '#cc0000' }}>
                        {summary.result}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Full Table View (Visible always on sm: and conditionally on mobile) */}
            <div className={`${mobileViewType === 'cards' ? 'hidden sm:block' : 'block'} mb-4`}>
              {/* Swipe indicator for mobile */}
              <div className="sm:hidden flex items-center justify-between px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 mb-2">
                <span className="flex items-center gap-1 font-medium">
                  <ArrowRightLeft className="w-3 h-3" />
                  Swipe table horizontally
                </span>
                <span className="font-bold text-[10px]">{isPg ? '9 Columns' : '13 Columns'}</span>
              </div>

              <div className="overflow-x-auto -mx-1 sm:mx-0">
                {isPg ? (
                  /* Authentic MGU PG CSS Table (9 columns) */
                  <table 
                    className="w-full text-xs text-left border-collapse min-w-[700px] sm:min-w-full"
                    style={{
                      border: '1px solid #333333',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <thead>
                      <tr className="bg-slate-50 text-slate-900 font-bold">
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2} style={{ width: '90px' }}>Course Code</th>
                        <th className="border border-[#333333] p-1.5" rowSpan={2}>Course</th>
                        <th className="border border-[#333333] p-1 text-center" colSpan={2} style={{ width: '120px' }}>Theory</th>
                        <th className="border border-[#333333] p-1 text-center" colSpan={2} style={{ width: '120px' }}>Practical</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2} style={{ width: '60px' }}>GPA</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2} style={{ width: '60px' }}>Grade</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2} style={{ width: '70px' }}>Result</th>
                      </tr>
                      <tr className="bg-slate-50 text-[10px] text-slate-800 font-bold">
                        <th className="border border-[#333333] p-1 text-center" style={{ width: '60px' }}>INT</th>
                        <th className="border border-[#333333] p-1 text-center" style={{ width: '60px' }}>EXT</th>
                        <th className="border border-[#333333] p-1 text-center" style={{ width: '60px' }}>INT</th>
                        <th className="border border-[#333333] p-1 text-center" style={{ width: '60px' }}>EXT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="border border-[#333333] p-1.5 text-center font-mono">{c.code}</td>
                          <td className="border border-[#333333] p-1.5 text-left font-medium">{c.title}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.theoryInt || '---'}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.theoryExt || '---'}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.practicalInt || '---'}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.practicalExt || '---'}</td>
                          <td className="border border-[#333333] p-1.5 text-center font-bold">{c.gpa !== undefined ? c.gpa.toFixed(2) : '---'}</td>
                          <td className="border border-[#333333] p-1.5 text-center font-bold">{c.grade}</td>
                          <td className="border border-[#333333] p-1.5 text-center">
                            <strong style={{ fontSize: '11px' }}>
                              <span style={{ color: c.result.toLowerCase() === 'passed' ? 'green' : 'red' }}>
                                {c.result}
                              </span>
                            </strong>
                          </td>
                        </tr>
                      ))}

                      {/* Official PG Semester Result row */}
                      <tr className="bg-slate-50 font-bold">
                        <td className="border border-[#333333] p-2 text-center">&nbsp;</td>
                        <td className="border border-[#333333] p-2 text-left">
                          <strong>Semester Result</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center" colSpan={4}></td>
                        <td className="border border-[#333333] p-2 text-center">
                          <strong>{summary.scpa.toFixed(2)}</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center">
                          <strong>{summary.grade}</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center">
                          <strong style={{ color: summary.result.toLowerCase() === 'passed' ? '#339900' : '#cc0000' }}>
                            {summary.result}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  /* Authentic MGU UG CBCSS Table (13 columns) */
                  <table 
                    className="w-full text-xs text-left border-collapse min-w-[700px] sm:min-w-full"
                    style={{
                      border: '1px solid #333333',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <thead>
                      <tr className="bg-slate-50 text-slate-900 font-bold">
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2}>Course Code</th>
                        <th className="border border-[#333333] p-1.5" rowSpan={2}>Course</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2}>Credit</th>
                        <th className="border border-[#333333] p-1 text-center" colSpan={2}>EXTERNAL</th>
                        <th className="border border-[#333333] p-1 text-center" colSpan={2}>INTERNAL</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2}>Total</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2}>MAX</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2}>Grade</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2}>GP</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2}>CP</th>
                        <th className="border border-[#333333] p-1.5 text-center" rowSpan={2}>Result</th>
                      </tr>
                      <tr className="bg-slate-50 text-[10px] text-slate-800 font-bold">
                        <th className="border border-[#333333] p-1 text-center">ESA</th>
                        <th className="border border-[#333333] p-1 text-center">MAX</th>
                        <th className="border border-[#333333] p-1 text-center">ISA</th>
                        <th className="border border-[#333333] p-1 text-center">MAX</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="border border-[#333333] p-1.5 text-center font-mono">{c.code}</td>
                          <td className="border border-[#333333] p-1.5 text-left font-medium">{c.title}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.credit}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.esaMarks}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.esaMax}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.isaMarks}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.isaMax}</td>
                          <td className="border border-[#333333] p-1.5 text-center font-semibold">{c.totalMarks}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.maxMarks}</td>
                          <td className="border border-[#333333] p-1.5 text-center font-bold">{c.grade}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.gradePoint}</td>
                          <td className="border border-[#333333] p-1.5 text-center">{c.creditPoint}</td>
                          <td className="border border-[#333333] p-1.5 text-center">
                            <strong style={{ fontSize: '11px' }}>
                              <span style={{ color: c.result.toLowerCase() === 'passed' ? 'green' : 'red' }}>
                                {c.result}
                              </span>
                            </strong>
                          </td>
                        </tr>
                      ))}

                      {/* Official SEMESTER RESULT row */}
                      <tr className="bg-slate-50 font-bold">
                        <td className="border border-[#333333] p-2 text-center" colSpan={2}>
                          <strong>SEMESTER RESULT</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center">
                          <strong>{summary.totalCredits}</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center" colSpan={4}>
                          <strong>SCPA:&nbsp;&nbsp;{summary.scpa.toFixed(2)}</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center">
                          <strong>{summary.totalMarks}</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center">
                          <strong>{summary.maxMarks}</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center">
                          <strong>{summary.grade}</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center"></td>
                        <td className="border border-[#333333] p-2 text-center">
                          <strong>{summary.creditPoints}</strong>
                        </td>
                        <td className="border border-[#333333] p-2 text-center">
                          <strong style={{ color: summary.result.toLowerCase() === 'passed' ? '#339900' : '#cc0000' }}>
                            {summary.result}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Official Classic PRINT Button */}
            <div className="mt-4 sm:mt-5 text-center no-print">
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  backgroundColor: '#003366',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  padding: '7px 24px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  border: 'none',
                  fontSize: '13px',
                  letterSpacing: '1px'
                }}
                className="hover:opacity-95 shadow w-full sm:w-auto"
              >
                PRINT
              </button>
            </div>

            {/* Official University Disclaimer Notice */}
            <div className="mt-5 sm:mt-6 text-justify">
              <span 
                style={{
                  border: '1px dotted #FF0033',
                  color: '#FF0033',
                  padding: '8px 12px',
                  display: 'block',
                  fontSize: '11px',
                  lineHeight: '1.5'
                }}
              >
                <strong>NOTE:</strong>{' '}
                <em>
                  The results made available through the web are intended only to provide immediate information to the examinees. This is not a substitute for the original marklists/ grade sheets issued to the candidates. Mahatma Gandhi University reserves the right to update the contents of the web pages without notice. However, discrepancies which may arise due to transmission errors may be informed to the university at email address : support@mgu.ac.in
                </em>
              </span>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};
