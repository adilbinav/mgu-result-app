import React from 'react';
import { StudentResult } from '@/lib/types';

interface MarksheetPrintProps {
  result: StudentResult;
}

export const MarksheetPrint: React.FC<MarksheetPrintProps> = ({ result }) => {
  const { prn, name, programme, examCentre, examName, courses, summary } = result;
  const isPg = result.degreeLevel === 'PG';

  return (
    <div className="print-area hidden print:block bg-white p-8 max-w-4xl mx-auto border-2 border-slate-800 text-slate-900 font-serif">
      {/* University Header */}
      <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold tracking-wide uppercase">Mahatma Gandhi University</h1>
        <p className="text-xs uppercase tracking-widest text-slate-700">Priyadarsini Hills P.O., Kottayam, Kerala - 686560</p>
        <h2 className="text-base font-semibold mt-3 uppercase tracking-wider underline">
          Provisional Grade Card / Statement of Marks
        </h2>
        <p className="text-sm font-medium mt-1 text-slate-800">
          {examName || (isPg ? 'PGCSS PG DEGREE EXAMINATION' : 'CBCSS UG DEGREE EXAMINATION')}
        </p>
      </div>

      {/* Candidate Details */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm border border-slate-400 p-4 mb-6 bg-slate-50/50">
        <div>
          <span className="font-semibold text-slate-600">Candidate Name:</span>{' '}
          <span className="font-bold text-slate-900 uppercase">{name}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-600">PRN (Reg No):</span>{' '}
          <span className="font-bold text-slate-900 tracking-wider">{prn}</span>
        </div>
        <div className="col-span-2">
          <span className="font-semibold text-slate-600">Programme:</span>{' '}
          <span className="font-medium text-slate-900">{programme}</span>
        </div>
        <div className="col-span-2">
          <span className="font-semibold text-slate-600">Exam Centre:</span>{' '}
          <span className="font-medium text-slate-900">{examCentre}</span>
        </div>
      </div>

      {/* Course Breakdown Table (PG vs UG) */}
      {isPg ? (
        <table className="w-full text-left text-xs border-collapse border border-slate-600 mb-6">
          <thead>
            <tr className="bg-slate-200 text-slate-900 border-b border-slate-600">
              <th className="border border-slate-500 p-2 text-center" rowSpan={2} style={{ width: '90px' }}>Code</th>
              <th className="border border-slate-500 p-2" rowSpan={2}>Course Title</th>
              <th className="border border-slate-500 p-1 text-center" colSpan={2}>Theory</th>
              <th className="border border-slate-500 p-1 text-center" colSpan={2}>Practical</th>
              <th className="border border-slate-500 p-1.5 text-center" rowSpan={2} style={{ width: '60px' }}>GPA</th>
              <th className="border border-slate-500 p-1.5 text-center" rowSpan={2} style={{ width: '60px' }}>Grade</th>
              <th className="border border-slate-500 p-2 text-center" rowSpan={2} style={{ width: '70px' }}>Status</th>
            </tr>
            <tr className="bg-slate-100 border-b border-slate-600 text-[10px]">
              <th className="border border-slate-500 p-1 text-center" style={{ width: '50px' }}>INT</th>
              <th className="border border-slate-500 p-1 text-center" style={{ width: '50px' }}>EXT</th>
              <th className="border border-slate-500 p-1 text-center" style={{ width: '50px' }}>INT</th>
              <th className="border border-slate-500 p-1 text-center" style={{ width: '50px' }}>EXT</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i} className="border-b border-slate-400">
                <td className="border border-slate-400 p-1.5 font-mono text-[11px] text-center">{c.code}</td>
                <td className="border border-slate-400 p-1.5">{c.title}</td>
                <td className="border border-slate-400 p-1.5 text-center">{c.theoryInt || '---'}</td>
                <td className="border border-slate-400 p-1.5 text-center">{c.theoryExt || '---'}</td>
                <td className="border border-slate-400 p-1.5 text-center">{c.practicalInt || '---'}</td>
                <td className="border border-slate-400 p-1.5 text-center">{c.practicalExt || '---'}</td>
                <td className="border border-slate-400 p-1.5 text-center font-bold">{c.gpa !== undefined ? c.gpa.toFixed(2) : '---'}</td>
                <td className="border border-slate-400 p-1.5 text-center font-bold">{c.grade}</td>
                <td className="border border-slate-400 p-1.5 text-center font-semibold uppercase">{c.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="w-full text-left text-xs border-collapse border border-slate-600 mb-6">
          <thead>
            <tr className="bg-slate-200 text-slate-900 border-b border-slate-600">
              <th className="border border-slate-500 p-2 text-center" rowSpan={2}>Code</th>
              <th className="border border-slate-500 p-2" rowSpan={2}>Course Title</th>
              <th className="border border-slate-500 p-1 text-center" rowSpan={2}>Credits</th>
              <th className="border border-slate-500 p-1 text-center" colSpan={2}>External (ESA)</th>
              <th className="border border-slate-500 p-1 text-center" colSpan={2}>Internal (ISA)</th>
              <th className="border border-slate-500 p-1 text-center" colSpan={2}>Total Marks</th>
              <th className="border border-slate-500 p-1 text-center" rowSpan={2}>Grade</th>
              <th className="border border-slate-500 p-1 text-center" rowSpan={2}>GP</th>
              <th className="border border-slate-500 p-1 text-center" rowSpan={2}>CP</th>
              <th className="border border-slate-500 p-2 text-center" rowSpan={2}>Status</th>
            </tr>
            <tr className="bg-slate-100 border-b border-slate-600 text-[10px]">
              <th className="border border-slate-500 p-1 text-center">Mark</th>
              <th className="border border-slate-500 p-1 text-center">Max</th>
              <th className="border border-slate-500 p-1 text-center">Mark</th>
              <th className="border border-slate-500 p-1 text-center">Max</th>
              <th className="border border-slate-500 p-1 text-center">Mark</th>
              <th className="border border-slate-500 p-1 text-center">Max</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i} className="border-b border-slate-400">
                <td className="border border-slate-400 p-1.5 font-mono text-[11px] text-center">{c.code}</td>
                <td className="border border-slate-400 p-1.5">{c.title}</td>
                <td className="border border-slate-400 p-1.5 text-center font-semibold">{c.credit}</td>
                <td className="border border-slate-400 p-1.5 text-center">{c.esaMarks}</td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-500">{c.esaMax}</td>
                <td className="border border-slate-400 p-1.5 text-center">{c.isaMarks}</td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-500">{c.isaMax}</td>
                <td className="border border-slate-400 p-1.5 text-center font-bold">{c.totalMarks}</td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-500">{c.maxMarks}</td>
                <td className="border border-slate-400 p-1.5 text-center font-bold">{c.grade}</td>
                <td className="border border-slate-400 p-1.5 text-center">{c.gradePoint}</td>
                <td className="border border-slate-400 p-1.5 text-center">{c.creditPoint}</td>
                <td className="border border-slate-400 p-1.5 text-center font-semibold uppercase">{c.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Semester Result Summary */}
      <div className="border-2 border-slate-800 p-4 mb-6 grid grid-cols-4 gap-4 text-center bg-slate-50">
        <div>
          <div className="text-[11px] uppercase text-slate-600 font-semibold">Total Credits</div>
          <div className="text-xl font-bold text-slate-900">{summary.totalCredits}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-slate-600 font-semibold">{isPg ? 'Grading Scale' : 'Total Marks'}</div>
          <div className="text-xl font-bold text-slate-900">
            {isPg ? '5.00 Point Scale' : `${summary.totalMarks} / ${summary.maxMarks} (${summary.percentage}%)`}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-slate-600 font-semibold">{isPg ? 'GPA / Grade' : 'SCPA / Grade'}</div>
          <div className="text-xl font-bold text-slate-900">{summary.scpa.toFixed(2)} ({summary.grade})</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-slate-600 font-semibold">Final Result</div>
          <div className={`text-xl font-black uppercase ${summary.result.toLowerCase() === 'passed' ? 'text-emerald-800' : 'text-rose-800'}`}>
            {summary.result}
          </div>
        </div>
      </div>

      {/* Official Footnote */}
      <div className="text-[10px] text-slate-600 border-t border-slate-400 pt-3 space-y-1">
        <p><strong>Disclaimer:</strong> The results published online are provisional and for immediate information only. This document cannot be treated as an original mark sheet issued by Mahatma Gandhi University.</p>
        <p>Printed on: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
      </div>
    </div>
  );
};
