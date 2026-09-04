export interface ExamInfo {
  id: string;
  name: string;
  semester: string;
  year?: string;
  programmeCategory?: string;
  applicableAdmissionYears?: number[];
}

export interface CourseResult {
  code: string;
  title: string;
  credit: number;
  esaMarks: string; // External
  esaMax: string;
  isaMarks: string; // Internal
  isaMax: string;
  totalMarks: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
  creditPoint: number;
  result: 'Passed' | 'Failed' | string;
}

export interface SemesterSummary {
  totalCredits: number;
  scpa: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  creditPoints: number;
  result: 'Passed' | 'Failed' | string;
}

export interface StudentResult {
  prn: string;
  name: string;
  programme: string;
  examCentre: string;
  examId: string;
  examName?: string;
  courses: CourseResult[];
  summary: SemesterSummary;
  isDemo?: boolean;
  rawHtml?: string;
}

export interface BatchSummary {
  totalRequested: number;
  totalFound: number;
  passedCount: number;
  failedCount: number;
  passPercentage: number;
  averageScpa: number;
  highestScpa: number;
  lowestScpa: number;
  topper?: {
    name: string;
    prn: string;
    scpa: number;
    totalMarks: number;
  };
  gradeDistribution: Record<string, number>;
}

export interface BatchResultResponse {
  summary: BatchSummary;
  students: StudentResult[];
  isDemo?: boolean;
}

export interface SavedPrn {
  prn: string;
  name?: string;
  label?: string;
  starred?: boolean;
  lastChecked: string;
  examName?: string;
  scpa?: number;
}

export interface GradeGapAnalysis {
  courseCode: string;
  courseTitle: string;
  currentGrade: string;
  currentMarks: number;
  maxMarks: number;
  percentage: number;
  nextGrade: string | null;
  marksNeeded: number | null;
  isBorderlinePass: boolean;
  esaMarksNeededForPass?: number;
  recommendRevaluation: boolean;
}

export interface SemesterRecord {
  semester: number;
  name: string;
  scpa: number;
  credits: number;
  completed: boolean;
}
