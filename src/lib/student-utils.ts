import { CourseResult, GradeGapAnalysis, SavedPrn, SemesterRecord } from './types';

/**
 * Parses an MGU 12-digit PRN into its constituent parts:
 * - Year prefix (first 2 digits, e.g. 21 -> 2021)
 * - Base College/Programme code prefix (e.g. 2100210000)
 * - Student roll number (e.g. 01 to 60)
 */
export function parsePrn(prn: string) {
  const clean = prn.trim();
  if (clean.length < 6) return null;

  const yearDigits = clean.slice(0, 2);
  const yearNum = parseInt(yearDigits, 10);
  const admissionYear = yearNum >= 15 && yearNum <= 30 ? 2000 + yearNum : null;

  // Most MGU PRNs are 12 digits (e.g. 210021000015).
  // The last 3 or 4 digits represent the student serial number in the class.
  const rollDigitsCount = clean.length >= 12 ? (clean.length === 12 ? 3 : 4) : 2;
  const basePrefix = clean.slice(0, clean.length - rollDigitsCount);
  const rollPart = clean.slice(clean.length - rollDigitsCount);
  const rollNumber = parseInt(rollPart, 10);

  return {
    admissionYear,
    basePrefix,
    rollPart,
    rollNumber: isNaN(rollNumber) ? 1 : rollNumber,
    rollDigitsCount,
  };
}

/**
 * Given any student PRN from a class, generate the start (001) and end (060) PRN range.
 */
export function generateClassRange(prn: string, classSize: number = 60) {
  const parsed = parsePrn(prn);
  if (!parsed || !parsed.basePrefix) {
    return {
      startPrn: prn,
      endPrn: prn,
      classSize,
    };
  }

  const { basePrefix, rollDigitsCount } = parsed;
  const startRoll = '1'.padStart(rollDigitsCount, '0');
  const endRoll = String(classSize).padStart(rollDigitsCount, '0');

  return {
    startPrn: `${basePrefix}${startRoll}`,
    endPrn: `${basePrefix}${endRoll}`,
    basePrefix,
    admissionYear: parsed.admissionYear,
    classSize,
  };
}

/**
 * MGU CBCSS Grade Thresholds (Percentage of Max Marks)
 */
const GRADE_THRESHOLDS: { grade: string; minPct: number }[] = [
  { grade: 'O', minPct: 95 },
  { grade: 'A+', minPct: 85 },
  { grade: 'A', minPct: 75 },
  { grade: 'B+', minPct: 65 },
  { grade: 'B', minPct: 55 },
  { grade: 'C', minPct: 45 },
  { grade: 'D', minPct: 35 },
];

/**
 * Analyzes grade boundaries for each course to tell students:
 * - How close they are to the next higher grade (Revaluation candidate)
 * - If they narrowly missed passing ESA or Aggregate
 */
export function analyzeCourseGradeGap(course: CourseResult): GradeGapAnalysis {
  const total = Number(course.totalMarks) || 0;
  const max = Number(course.maxMarks) || 100;
  const pct = max > 0 ? (total / max) * 100 : 0;
  const currentGrade = course.grade.trim().toUpperCase();

  // Find next grade
  let nextGrade: string | null = null;
  let marksNeeded: number | null = null;

  for (let i = GRADE_THRESHOLDS.length - 1; i >= 0; i--) {
    const t = GRADE_THRESHOLDS[i];
    if (pct < t.minPct) {
      nextGrade = t.grade;
      const targetMarks = Math.ceil((t.minPct / 100) * max);
      marksNeeded = Math.max(1, targetMarks - total);
      break;
    }
  }

  // ESA External pass threshold in CBCSS is typically 30% or 35% of ESA max (usually 24/80 or 28/80)
  const esa = Number(course.esaMarks) || 0;
  const esaMax = Number(course.esaMax) || 80;
  const esaPassMin = Math.ceil(0.35 * esaMax);
  const esaMarksNeeded = esa < esaPassMin ? esaPassMin - esa : undefined;

  const isFailed = course.result.toLowerCase() !== 'passed';
  const isBorderlinePass = isFailed && ((esaMarksNeeded !== undefined && esaMarksNeeded <= 4) || total >= (0.32 * max));

  // Recommend revaluation if within 1 to 3 marks of a better grade or if borderline failed
  const recommendRevaluation = (marksNeeded !== null && marksNeeded <= 3) || isBorderlinePass;

  return {
    courseCode: course.code,
    courseTitle: course.title,
    currentGrade,
    currentMarks: total,
    maxMarks: max,
    percentage: Math.round(pct * 10) / 10,
    nextGrade,
    marksNeeded,
    isBorderlinePass,
    esaMarksNeededForPass: esaMarksNeeded,
    recommendRevaluation,
  };
}

/**
 * CGPA Calculation & Classification on 10-point scale
 */
export function calculateCgpa(semesters: SemesterRecord[]) {
  const completed = semesters.filter(s => s.completed && s.scpa > 0 && s.credits > 0);
  if (completed.length === 0) {
    return {
      cgpa: 0,
      totalCredits: 0,
      completedSemesters: 0,
      classification: 'In Progress',
      percentage: 0,
    };
  }

  let totalCreditPoints = 0;
  let totalCredits = 0;

  for (const s of completed) {
    totalCreditPoints += s.scpa * s.credits;
    totalCredits += s.credits;
  }

  const cgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;
  // Standard conversion in MG University CBCSS: Percentage ≈ CGPA * 10
  const percentage = cgpa * 10;

  let classification = 'Third Class';
  if (cgpa >= 9.0) {
    classification = 'Outstanding (O) - Distinction';
  } else if (cgpa >= 8.0) {
    classification = 'First Class with Distinction (A+)';
  } else if (cgpa >= 7.0) {
    classification = 'First Class (A)';
  } else if (cgpa >= 6.0) {
    classification = 'First Class (B+)';
  } else if (cgpa >= 5.0) {
    classification = 'Second Class (B)';
  } else if (cgpa >= 4.0) {
    classification = 'Third Class (C)';
  } else {
    classification = 'Needs Improvement';
  }

  return {
    cgpa: Math.round(cgpa * 100) / 100,
    totalCredits,
    completedSemesters: completed.length,
    classification,
    percentage: Math.round(percentage * 10) / 10,
  };
}

/**
 * Local Storage helpers for Saved PRNs & Bookmarks
 */
const STORAGE_KEY_PRNS = 'mgu_saved_prns_v1';
const STORAGE_KEY_CGPA = 'mgu_saved_cgpa_v1';

export function getSavedPrns(): SavedPrn[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRNS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load saved PRNs', e);
    return [];
  }
}

export function savePrnToStorage(prn: string, name?: string, scpa?: number, examName?: string, label?: string) {
  if (typeof window === 'undefined') return;
  try {
    const list = getSavedPrns();
    const cleanPrn = prn.trim();
    const existingIndex = list.findIndex(item => item.prn === cleanPrn);

    const updatedItem: SavedPrn = {
      prn: cleanPrn,
      name: name || (existingIndex >= 0 ? list[existingIndex].name : undefined),
      label: label || (existingIndex >= 0 ? list[existingIndex].label : undefined),
      starred: existingIndex >= 0 ? list[existingIndex].starred : false,
      lastChecked: new Date().toISOString(),
      examName: examName || (existingIndex >= 0 ? list[existingIndex].examName : undefined),
      scpa: scpa !== undefined ? scpa : (existingIndex >= 0 ? list[existingIndex].scpa : undefined),
    };

    if (existingIndex >= 0) {
      list[existingIndex] = updatedItem;
    } else {
      list.unshift(updatedItem);
    }

    // Keep maximum 15 recent PRNs
    const pruned = list.slice(0, 15);
    localStorage.setItem(STORAGE_KEY_PRNS, JSON.stringify(pruned));
  } catch (e) {
    console.error('Failed to save PRN to storage', e);
  }
}

export function toggleStarredPrn(prn: string): SavedPrn[] {
  if (typeof window === 'undefined') return [];
  try {
    const list = getSavedPrns();
    const updated = list.map(item => {
      if (item.prn === prn) {
        return { ...item, starred: !item.starred };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY_PRNS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to toggle starred PRN', e);
    return [];
  }
}

export function removeSavedPrn(prn: string): SavedPrn[] {
  if (typeof window === 'undefined') return [];
  try {
    const list = getSavedPrns().filter(item => item.prn !== prn);
    localStorage.setItem(STORAGE_KEY_PRNS, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error('Failed to remove saved PRN', e);
    return [];
  }
}

export function getSavedCgpaRecords(): SemesterRecord[] {
  const defaultSemesters: SemesterRecord[] = [
    { semester: 1, name: 'Semester 1', scpa: 0, credits: 20, completed: false },
    { semester: 2, name: 'Semester 2', scpa: 0, credits: 20, completed: false },
    { semester: 3, name: 'Semester 3', scpa: 0, credits: 20, completed: false },
    { semester: 4, name: 'Semester 4', scpa: 0, credits: 20, completed: false },
    { semester: 5, name: 'Semester 5', scpa: 0, credits: 20, completed: false },
    { semester: 6, name: 'Semester 6', scpa: 0, credits: 20, completed: false },
  ];

  if (typeof window === 'undefined') return defaultSemesters;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CGPA);
    if (!raw) return defaultSemesters;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length === 6 ? parsed : defaultSemesters;
  } catch (e) {
    console.error('Failed to load CGPA records', e);
    return defaultSemesters;
  }
}

export function saveCgpaRecords(records: SemesterRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CGPA, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save CGPA records', e);
  }
}
