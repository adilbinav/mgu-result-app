'use client';

import React from 'react';
import { StudentResult } from '@/lib/types';

interface OfficialResultViewProps {
  result: StudentResult;
}

export const OfficialResultView: React.FC<OfficialResultViewProps> = ({ result }) => {
  const { prn, name, programme, examCentre, courses, summary } = result;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative overflow-hidden my-6 bg-white p-2 sm:p-6 rounded-lg shadow-md border border-slate-300">
      {/* Official MGU Floating Diagonal Watermark */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span 
          style={{
            fontSize: '5.5rem',
            color: 'rgba(0, 0, 0, 0.08)',
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
      <div className="relative z-10 max-w-4xl mx-auto bg-white border border-[#84888c] shadow-[0px_4px_10px_rgba(0,0,0,0.15)] font-sans">
        {/* Top Header Banner */}
        <div 
          className="border-b border-[#E8E8E8] px-4 py-3 flex items-center gap-4"
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
              className="w-14 h-15 object-contain"
              onError={(e) => {
                // fallback if image blocked
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h2 
              className="text-lg sm:text-xl font-bold tracking-tight text-[#004F91]"
              style={{ textShadow: '1px 1px 0px #bcd6f3' }}
            >
              Mahatma Gandhi University CBCSS Exam Results
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#313131]">
              (Revised Scheme)
            </p>
          </div>
        </div>

        {/* Inner Content Area with Fieldset Frame */}
        <div className="p-4 sm:p-6 bg-white">
          <fieldset 
            className="p-4 sm:p-5 rounded"
            style={{
              border: '1px solid #739f43',
              backgroundColor: '#FFFFFF',
            }}
          >
            <legend className="px-2 text-sm font-bold text-[#739f43]">
              Result
            </legend>

            {/* Candidate Details Table */}
            <div className="mb-5 overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <tbody>
                  <tr>
                    <td className="py-1 font-bold text-slate-800 w-48">Permanent Register Number</td>
                    <td className="py-1 px-2 font-bold text-center w-6">:</td>
                    <td className="py-1 font-semibold text-slate-900 text-sm">{prn}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold text-slate-800">Name of Student</td>
                    <td className="py-1 px-2 font-bold text-center">:</td>
                    <td className="py-1 font-bold text-base" style={{ color: '#993366' }}>
                      {name}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold text-slate-800">Programme</td>
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

            {/* Official Course Table with .bord_rslt styling */}
            <div className="overflow-x-auto">
              <table 
                className="w-full text-xs text-left border-collapse"
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
            </div>

            {/* Official Classic PRINT Button */}
            <div className="mt-5 text-center no-print">
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
                className="hover:opacity-95 shadow"
              >
                PRINT
              </button>
            </div>

            {/* Official University Disclaimer Notice */}
            <div className="mt-6 text-justify">
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
