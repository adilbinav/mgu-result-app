import * as cheerio from 'cheerio';
import { ExamInfo, StudentResult, CourseResult, SemesterSummary, BatchResultResponse } from './types';
import { MOCK_EXAMS, MOCK_SINGLE_STUDENT, generateMockBatch } from './mock-data';

// Bypass SSL verification for MGU's internal server certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const MGU_RESULT_URL = 'https://dsdc.mgu.ac.in/exQpMgmt/index.php/public/ResultView_ctrl/';

function computeApplicableAdmissionYears(name: string, semName: string, examYear?: string): number[] {
  const upper = name.toUpperCase();
  const years = new Set<number>();

  // 1. Explicit mention e.g. "2021 ADMISSION"
  const explicitMatches = upper.matchAll(/\b(201\d|202\d)\s+ADMISSION\b/g);
  for (const m of explicitMatches) {
    years.add(parseInt(m[1], 10));
  }

  // 2. Computed standard university cycle based on semester and exam year
  const ey = examYear ? parseInt(examYear, 10) : undefined;
  if (ey) {
    let semNum = 0;
    if (semName.includes('FIRST')) semNum = 1;
    else if (semName.includes('SECOND')) semNum = 2;
    else if (semName.includes('THIRD')) semNum = 3;
    else if (semName.includes('FOURTH')) semNum = 4;
    else if (semName.includes('FIFTH')) semNum = 5;
    else if (semName.includes('SIXTH')) semNum = 6;

    if (semNum > 0) {
      const isLateYear = upper.includes('OCTOBER') || upper.includes('NOVEMBER') || upper.includes('DECEMBER') || upper.includes('SEPTEMBER');
      let regAdm = ey;
      if (semNum === 1) regAdm = isLateYear ? ey : ey - 1;
      else if (semNum === 2) regAdm = ey - 1;
      else if (semNum === 3) regAdm = isLateYear ? ey - 1 : ey - 2;
      else if (semNum === 4) regAdm = ey - 2;
      else if (semNum === 5) regAdm = isLateYear ? ey - 2 : ey - 3;
      else if (semNum === 6) regAdm = ey - 3;

      years.add(regAdm);

      // Supplementary / improvement eligibility
      if (upper.includes('SUPPLEMENTARY') || upper.includes('CBCS') || upper.includes('B.VOC') || upper.includes('B VOC')) {
        years.add(regAdm - 1);
        years.add(regAdm - 2);
      }
    }
  }

  return Array.from(years).sort((a, b) => b - a);
}

// Simple cache for exam list
let cachedExams: ExamInfo[] | null = null;
let lastExamFetchTime = 0;
const EXAM_CACHE_TTL = 15 * 60 * 1000; // 15 mins

export async function fetchExamList(forceDemo: boolean = false): Promise<{ exams: ExamInfo[]; isLive: boolean }> {
  if (forceDemo) {
    return { exams: MOCK_EXAMS, isLive: false };
  }

  const now = Date.now();
  if (cachedExams && (now - lastExamFetchTime) < EXAM_CACHE_TTL) {
    return { exams: cachedExams, isLive: true };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(MGU_RESULT_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`MGU portal returned status ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const options = $('#exam_id option');

    const exams: ExamInfo[] = [];

    options.each((_, el) => {
      const val = $(el).val()?.toString().trim();
      const text = $(el).text().trim();

      if (val && val !== '0' && val !== '') {
        // Detect semester
        let sem = 'OTHER';
        const upper = text.toUpperCase();
        if (upper.includes('FIRST SEMESTER') || upper.includes('1ST SEMESTER') || upper.includes('SEM 1')) sem = 'FIRST SEMESTER';
        else if (upper.includes('SECOND SEMESTER') || upper.includes('2ND SEMESTER') || upper.includes('SEM 2')) sem = 'SECOND SEMESTER';
        else if (upper.includes('THIRD SEMESTER') || upper.includes('3RD SEMESTER') || upper.includes('SEM 3')) sem = 'THIRD SEMESTER';
        else if (upper.includes('FOURTH SEMESTER') || upper.includes('4TH SEMESTER') || upper.includes('SEM 4')) sem = 'FOURTH SEMESTER';
        else if (upper.includes('FIFTH SEMESTER') || upper.includes('5TH SEMESTER') || upper.includes('SEM 5')) sem = 'FIFTH SEMESTER';
        else if (upper.includes('SIXTH SEMESTER') || upper.includes('6TH SEMESTER') || upper.includes('SEM 6')) sem = 'SIXTH SEMESTER';

        // Detect Year
        const yearMatch = text.match(/\b(201\d|202\d)\b/);
        const year = yearMatch ? yearMatch[1] : undefined;

        // Programme category
        let prog = 'CBCS';
        if (upper.includes('B VOC') || upper.includes('B.VOC')) prog = 'B.Voc';
        else if (upper.includes('SUPPLEMENTARY')) prog = 'Supplementary';

        const applicableAdmissionYears = computeApplicableAdmissionYears(text, sem, year);

        exams.push({
          id: val,
          name: text,
          semester: sem,
          year,
          programmeCategory: prog,
          applicableAdmissionYears,
        });
      }
    });

    if (exams.length > 0) {
      cachedExams = exams;
      lastExamFetchTime = now;
      return { exams, isLive: true };
    } else {
      return { exams: MOCK_EXAMS, isLive: false };
    }
  } catch (error) {
    console.warn('Failed to fetch live exam list from MGU, using fallback:', error);
    return { exams: MOCK_EXAMS, isLive: false };
  }
}

export async function fetchStudentResult(
  examId: string,
  prn: string,
  forceDemo: boolean = false
): Promise<StudentResult> {
  const cleanPrn = prn.trim();
  const cleanExamId = examId.trim();

  if (forceDemo) {
    // If testing demo PRN or forced demo
    if (cleanPrn === '210021000001') {
      return { ...MOCK_SINGLE_STUDENT, examId: cleanExamId };
    }
    const num = parseInt(cleanPrn, 10) || 210021000001;
    const batch = generateMockBatch(num, num, cleanExamId);
    return batch.students[0];
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const body = new URLSearchParams({
      exam_id: cleanExamId,
      prn: cleanPrn,
      btnresult: 'Get Result',
    });

    const response = await fetch(MGU_RESULT_URL, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': MGU_RESULT_URL,
      },
      body: body.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from MGU portal`);
    }

    const html = await response.text();
    return parseResultHtml(html, cleanExamId, cleanPrn);
  } catch (error: any) {
    console.error(`Error querying MGU for PRN ${cleanPrn}:`, error.message);
    // If PRN equals our known sample PRN and live fails, fallback cleanly to mock
    if (cleanPrn === '210021000001') {
      return { ...MOCK_SINGLE_STUDENT, examId: cleanExamId };
    }
    throw error;
  }
}

function parseResultHtml(html: string, examId: string, queryPrn: string): StudentResult {
  const $ = cheerio.load(html);

  // Check if result table is present
  const fullText = $('body').text();
  if (!fullText.includes('Name of Student') && !fullText.includes('Permanent Register Number')) {
    throw new Error(`No result found for PRN ${queryPrn} in the selected examination.`);
  }

  // 1. Extract Student Info
  let prn = queryPrn;
  let name = '';
  let programme = '';
  let examCentre = '';

  $('table').each((_, table) => {
    if ($(table).find('table').length === 0 && $(table).text().includes('Name of Student:')) {
      $(table).find('tr').each((__, tr) => {
        const rowText = $(tr).text();
        const tds = $(tr).find('td');
        if (rowText.includes('Permanent Register Number:')) {
          prn = tds.last().text().trim() || prn;
        } else if (rowText.includes('Name of Student:')) {
          name = tds.last().text().trim();
        } else if (rowText.includes('Programme:')) {
          programme = tds.last().text().trim();
        } else if (rowText.includes('Exam Centre:')) {
          examCentre = tds.last().text().trim();
        }
      });
    }
  });

  if (!name) {
    throw new Error(`Student record not found for PRN ${queryPrn}`);
  }

  // 2. Extract Courses Table
  const courses: CourseResult[] = [];
  let summary: SemesterSummary | null = null;

  // Find innermost course table
  $('table').each((_, table) => {
    if ($(table).find('table').length === 0 && $(table).text().includes('Course Code')) {
      const rows = $(table).find('tr');
      rows.each((__, tr) => {
        const tds = $(tr).find('td');
        const cells = tds.map((___, c) => $(c).text().trim()).get();
        const rowText = $(tr).text();

        // Check if this is the summary row: "SEMESTER RESULT"
        if (rowText.includes('SEMESTER RESULT') && cells.length >= 7) {
          const totalCredits = parseInt(cells[1] || '0', 10) || 0;
          const scpaMatch = cells[2]?.match(/\d+(\.\d+)?/);
          const scpa = scpaMatch ? parseFloat(scpaMatch[0]) : 0;
          const totalMarks = parseInt(cells[3] || '0', 10) || 0;
          const maxMarks = parseInt(cells[4] || '0', 10) || 0;
          const grade = cells[5] || '';
          const result = cells[cells.length - 1] || 'Passed';
          const creditPoints = parseFloat(cells[cells.length - 2] || '0') || 0;
          const percentage = maxMarks > 0 ? Number(((totalMarks / maxMarks) * 100).toFixed(2)) : 0;

          summary = {
            totalCredits,
            scpa,
            totalMarks,
            maxMarks,
            percentage,
            grade,
            creditPoints,
            result
          };
          return;
        }

        // Check if regular course row (13 columns)
        if (cells.length === 13) {
          const code = cells[0];
          const title = cells[1];
          const credit = parseInt(cells[2], 10) || 0;
          const esaMarks = cells[3];
          const esaMax = cells[4];
          const isaMarks = cells[5];
          const isaMax = cells[6];
          const totalMarks = parseInt(cells[7], 10) || 0;
          const maxMarks = parseInt(cells[8], 10) || 0;
          const grade = cells[9];
          const gradePoint = parseFloat(cells[10]) || 0;
          const creditPoint = parseFloat(cells[11]) || 0;
          const result = cells[12] || (grade === 'F' ? 'Failed' : 'Passed');

          courses.push({
            code,
            title,
            credit,
            esaMarks,
            esaMax,
            isaMarks,
            isaMax,
            totalMarks,
            maxMarks,
            grade,
            gradePoint,
            creditPoint,
            result
          });
        }
      });
    }
  });

  // Fallback summary calculation if not parsed from exact row
  if (!summary) {
    let totCredits = 0;
    let totMarks = 0;
    let totMaxMarks = 0;
    let totCP = 0;
    let hasFail = false;

    courses.forEach(c => {
      totCredits += c.credit;
      totMarks += c.totalMarks;
      totMaxMarks += c.maxMarks;
      totCP += c.creditPoint;
      if (c.result.toLowerCase().includes('fail') || c.grade === 'F') {
        hasFail = true;
      }
    });

    const scpa = totCredits > 0 ? Number((totCP / totCredits).toFixed(2)) : 0;
    const percentage = totMaxMarks > 0 ? Number(((totMarks / totMaxMarks) * 100).toFixed(2)) : 0;
    const result = hasFail ? 'Failed' : 'Passed';
    let grade = 'B';
    if (scpa >= 9.0) grade = 'A+';
    else if (scpa >= 8.0) grade = 'A';
    else if (scpa >= 7.0) grade = 'B+';
    else if (scpa >= 6.0) grade = 'B';
    else if (scpa >= 5.0) grade = 'C';
    else grade = 'F';

    summary = {
      totalCredits: totCredits,
      scpa,
      totalMarks: totMarks,
      maxMarks: totMaxMarks,
      percentage,
      grade,
      creditPoints: totCP,
      result
    };
  }

  const rawFieldset = $('fieldset.frame').html();

  return {
    prn,
    name,
    programme,
    examCentre,
    examId,
    courses,
    summary,
    isDemo: false,
    rawHtml: rawFieldset ? `<fieldset class="frame">${rawFieldset}</fieldset>` : undefined,
  };
}

export async function fetchBatchResults(
  examId: string,
  startPrn: string,
  endPrn: string,
  forceDemo: boolean = false
): Promise<BatchResultResponse> {
  const startNum = parseInt(startPrn, 10);
  const endNum = parseInt(endPrn, 10);

  if (isNaN(startNum) || isNaN(endNum)) {
    throw new Error('Invalid PRN range');
  }

  if (endNum < startNum) {
    throw new Error('Start PRN must be less than or equal to End PRN');
  }

  const rangeCount = endNum - startNum + 1;
  if (rangeCount > 60) {
    throw new Error('Maximum 60 students can be fetched in a single batch to avoid university rate limits');
  }

  if (forceDemo) {
    return generateMockBatch(startNum, endNum, examId);
  }

  // Generate list of PRNs
  const prnList: string[] = [];
  const padLength = startPrn.length;
  for (let i = startNum; i <= endNum; i++) {
    prnList.push(String(i).padStart(padLength, '0'));
  }

  const students: StudentResult[] = [];
  const concurrency = 3; // Keep polite to MGU server

  for (let i = 0; i < prnList.length; i += concurrency) {
    const chunk = prnList.slice(i, i + concurrency);
    const promises = chunk.map(prn =>
      fetchStudentResult(examId, prn, false).catch(err => {
        console.log(`PRN ${prn} not found or skipped: ${err.message}`);
        return null;
      })
    );

    const results = await Promise.all(promises);
    for (const res of results) {
      if (res) students.push(res);
    }
  }

  if (students.length === 0) {
    // If no real records found (or server timed out), fallback to demo batch with clear flag
    return generateMockBatch(startNum, endNum, examId);
  }

  // Calculate Batch Summary
  let passedCount = 0;
  let totalScpa = 0;
  let highestScpa = 0;
  let lowestScpa = 10;
  let topper: StudentResult | null = null;
  const gradeDistribution: Record<string, number> = {
    'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'F': 0
  };

  for (const s of students) {
    if (s.summary.result.toLowerCase() === 'passed') passedCount++;
    totalScpa += s.summary.scpa;
    if (s.summary.scpa > highestScpa) highestScpa = s.summary.scpa;
    if (s.summary.scpa < lowestScpa) lowestScpa = s.summary.scpa;

    const g = s.summary.grade || 'B';
    gradeDistribution[g] = (gradeDistribution[g] || 0) + 1;

    if (!topper || s.summary.scpa > (topper as StudentResult).summary.scpa) {
      topper = s;
    }
  }

  // Sort students descending by SCPA
  students.sort((a, b) => b.summary.scpa - a.summary.scpa);

  const topperStudent: StudentResult | null = topper;

  return {
    isDemo: false,
    summary: {
      totalRequested: prnList.length,
      totalFound: students.length,
      passedCount,
      failedCount: students.length - passedCount,
      passPercentage: Number(((passedCount / students.length) * 100).toFixed(1)),
      averageScpa: Number((totalScpa / students.length).toFixed(2)),
      highestScpa,
      lowestScpa,
      topper: topperStudent ? {
        name: topperStudent.name,
        prn: topperStudent.prn,
        scpa: topperStudent.summary.scpa,
        totalMarks: topperStudent.summary.totalMarks
      } : undefined,
      gradeDistribution
    },
    students
  };
}
