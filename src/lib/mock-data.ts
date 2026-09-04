import { ExamInfo, StudentResult, BatchResultResponse } from './types';

export const MOCK_EXAMS: ExamInfo[] = [
  {
    id: "114",
    name: "FIFTH SEMESTER CBCS EXAMINATION OCTOBER 2023",
    semester: "FIFTH SEMESTER",
    year: "2023",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2021, 2020, 2019]
  },
  {
    id: "143",
    name: "FIFTH SEMESTER CBCS EXAMINATION OCTOBER 2024",
    semester: "FIFTH SEMESTER",
    year: "2024",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021, 2020]
  },
  {
    id: "177",
    name: "FIFTH SEMESTER CBCS EXAMINATION OCTOBER 2025",
    semester: "FIFTH SEMESTER",
    year: "2025",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2023, 2022, 2021]
  },
  {
    id: "144",
    name: "FIFTH SEMESTER B Voc Degree EXAMINATION OCTOBER 2024",
    semester: "FIFTH SEMESTER",
    year: "2024",
    programmeCategory: "B.Voc",
    applicableAdmissionYears: [2022, 2021]
  },
  {
    id: "115",
    name: "SIXTH SEMESTER CBCS EXAMINATION MARCH 2024",
    semester: "SIXTH SEMESTER",
    year: "2024",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2021, 2020]
  },
  {
    id: "110",
    name: "FOURTH SEMESTER CBCS EXAMINATION APRIL 2024",
    semester: "FOURTH SEMESTER",
    year: "2024",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021]
  },
  {
    id: "105",
    name: "THIRD SEMESTER CBCS EXAMINATION NOVEMBER 2023",
    semester: "THIRD SEMESTER",
    year: "2023",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021]
  },
  {
    id: "101",
    name: "SECOND SEMESTER CBCS EXAMINATION MAY 2023",
    semester: "SECOND SEMESTER",
    year: "2023",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021]
  },
  {
    id: "95",
    name: "FIRST SEMESTER CBCS EXAMINATION JANUARY 2023",
    semester: "FIRST SEMESTER",
    year: "2023",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021]
  }
];

export const MOCK_SINGLE_STUDENT: StudentResult = {
  prn: "210021000001",
  name: "AAYISHA IZZATH M.Y",
  programme: "B.A Arabic Language and Literature Model II",
  examCentre: "MES College, Marampally",
  examId: "114",
  examName: "FIFTH SEMESTER CBCS EXAMINATION OCTOBER 2023",
  isDemo: true,
  courses: [
    {
      code: "AR5CRT12",
      title: "Environment Studies and Human Rights",
      credit: 5,
      esaMarks: "41",
      esaMax: "80",
      isaMarks: "18",
      isaMax: "20",
      totalMarks: 59,
      maxMarks: 100,
      grade: "B",
      gradePoint: 6,
      creditPoint: 30,
      result: "Passed"
    },
    {
      code: "AR5CRT20",
      title: "Applied Arabic Grammar",
      credit: 3,
      esaMarks: "58",
      esaMax: "80",
      isaMarks: "18",
      isaMax: "20",
      totalMarks: 76,
      maxMarks: 100,
      grade: "A",
      gradePoint: 8,
      creditPoint: 24,
      result: "Passed"
    },
    {
      code: "AR5CRT21",
      title: "Literary History of Classical Arabic",
      credit: 3,
      esaMarks: "47",
      esaMax: "80",
      isaMarks: "18",
      isaMax: "20",
      totalMarks: 65,
      maxMarks: 100,
      grade: "B+",
      gradePoint: 7,
      creditPoint: 21,
      result: "Passed"
    },
    {
      code: "AR5CRT22",
      title: "Classical Literature in Arabic",
      credit: 3,
      esaMarks: "35",
      esaMax: "80",
      isaMarks: "18",
      isaMax: "20",
      totalMarks: 53,
      maxMarks: 100,
      grade: "C",
      gradePoint: 5,
      creditPoint: 15,
      result: "Passed"
    },
    {
      code: "AR5VOT05",
      title: "Professional Translation",
      credit: 3,
      esaMarks: "63",
      esaMax: "80",
      isaMarks: "17",
      isaMax: "20",
      totalMarks: 80,
      maxMarks: 100,
      grade: "A",
      gradePoint: 8,
      creditPoint: 24,
      result: "Passed"
    },
    {
      code: "EN5OPT03",
      title: "English for Careers",
      credit: 3,
      esaMarks: "50",
      esaMax: "80",
      isaMarks: "17",
      isaMax: "20",
      totalMarks: 67,
      maxMarks: 100,
      grade: "B+",
      gradePoint: 7,
      creditPoint: 21,
      result: "Passed"
    }
  ],
  summary: {
    totalCredits: 20,
    scpa: 6.75,
    totalMarks: 400,
    maxMarks: 600,
    percentage: 66.67,
    grade: "B+",
    creditPoints: 135,
    result: "Passed"
  }
};

const SAMPLE_STUDENT_NAMES = [
  "Aayisha Izzath M.Y",
  "Rahul K. Nair",
  "Ananya Suresh",
  "Muhammed Bilal",
  "Sneha Mariam Varghese",
  "Ashwin Prasad",
  "Devika Menon",
  "Gokul Krishnan",
  "Fathima Zahra",
  "Rohan Mathew",
  "Meera Santhosh",
  "Arjun R. Pillai",
  "Parvathy B.",
  "Joel Thomas",
  "Kavya Rajeev"
];

export function generateMockBatch(startNum: number, endNum: number, examId: string = "114"): BatchResultResponse {
  const count = Math.min(Math.max(endNum - startNum + 1, 1), 30);
  const students: StudentResult[] = [];
  const gradeDistribution: Record<string, number> = {
    'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'F': 0
  };

  let passed = 0;
  let totalScpa = 0;
  let highestScpa = 0;
  let lowestScpa = 10;
  let topper: StudentResult | null = null;

  for (let i = 0; i < count; i++) {
    const curPrn = String(startNum + i);
    const name = SAMPLE_STUDENT_NAMES[i % SAMPLE_STUDENT_NAMES.length];
    
    // Generate deterministic marks based on i
    const seed = (startNum + i * 17) % 100;
    const isFailed = seed < 15; // 15% fail rate
    
    let scpa = isFailed ? Number((3.2 + (seed % 15) / 10).toFixed(2)) : Number((5.8 + (seed % 40) / 10).toFixed(2));
    if (scpa > 9.8) scpa = 9.8;
    
    let grade = 'B';
    if (isFailed) grade = 'F';
    else if (scpa >= 9.0) grade = 'A+';
    else if (scpa >= 8.0) grade = 'A';
    else if (scpa >= 7.0) grade = 'B+';
    else if (scpa >= 6.0) grade = 'B';
    else grade = 'C';

    gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;

    const maxMarks = 600;
    const totalMarks = Math.round((scpa / 10) * maxMarks * (0.95 + (seed % 10) / 100));
    const percentage = Number(((totalMarks / maxMarks) * 100).toFixed(2));

    const status = isFailed ? 'Failed' : 'Passed';
    if (status === 'Passed') passed++;

    totalScpa += scpa;
    if (scpa > highestScpa) {
      highestScpa = scpa;
    }
    if (scpa < lowestScpa) {
      lowestScpa = scpa;
    }

    const student: StudentResult = {
      prn: curPrn,
      name,
      programme: "B.Sc Computer Science Model III",
      examCentre: "Union Christian College, Aluva",
      examId,
      examName: "FIFTH SEMESTER CBCS EXAMINATION OCTOBER 2023",
      isDemo: true,
      courses: [
        {
          code: "CS5CRT12",
          title: "Computer Networks",
          credit: 4,
          esaMarks: String(Math.round(totalMarks * 0.12)),
          esaMax: "80",
          isaMarks: "18",
          isaMax: "20",
          totalMarks: Math.round(totalMarks * 0.16),
          maxMarks: 100,
          grade: grade,
          gradePoint: Math.round(scpa),
          creditPoint: Math.round(scpa * 4),
          result: status
        },
        {
          code: "CS5CRT13",
          title: "Operating Systems",
          credit: 4,
          esaMarks: String(Math.round(totalMarks * 0.13)),
          esaMax: "80",
          isaMarks: "19",
          isaMax: "20",
          totalMarks: Math.round(totalMarks * 0.17),
          maxMarks: 100,
          grade: grade,
          gradePoint: Math.round(scpa),
          creditPoint: Math.round(scpa * 4),
          result: status
        },
        {
          code: "CS5CRT14",
          title: "Java Programming",
          credit: 4,
          esaMarks: String(Math.round(totalMarks * 0.14)),
          esaMax: "80",
          isaMarks: "17",
          isaMax: "20",
          totalMarks: Math.round(totalMarks * 0.17),
          maxMarks: 100,
          grade: grade,
          gradePoint: Math.round(scpa),
          creditPoint: Math.round(scpa * 4),
          result: status
        },
        {
          code: "CS5OPT01",
          title: "Open Course - Informatics",
          credit: 4,
          esaMarks: String(Math.round(totalMarks * 0.13)),
          esaMax: "80",
          isaMarks: "18",
          isaMax: "20",
          totalMarks: Math.round(totalMarks * 0.16),
          maxMarks: 100,
          grade: grade,
          gradePoint: Math.round(scpa),
          creditPoint: Math.round(scpa * 4),
          result: status
        },
        {
          code: "CS5CRP05",
          title: "Software Lab V (Java & OS)",
          credit: 4,
          esaMarks: String(Math.round(totalMarks * 0.14)),
          esaMax: "80",
          isaMarks: "20",
          isaMax: "20",
          totalMarks: Math.round(totalMarks * 0.17),
          maxMarks: 100,
          grade: grade,
          gradePoint: Math.round(scpa),
          creditPoint: Math.round(scpa * 4),
          result: status
        }
      ],
      summary: {
        totalCredits: 20,
        scpa,
        totalMarks,
        maxMarks,
        percentage,
        grade,
        creditPoints: Math.round(scpa * 20),
        result: status
      }
    };

    if (!topper || student.summary.scpa > topper.summary.scpa) {
      topper = student;
    }

    students.push(student);
  }

  // sort by SCPA descending
  students.sort((a, b) => b.summary.scpa - a.summary.scpa);

  return {
    isDemo: true,
    summary: {
      totalRequested: count,
      totalFound: count,
      passedCount: passed,
      failedCount: count - passed,
      passPercentage: Number(((passed / count) * 100).toFixed(1)),
      averageScpa: Number((totalScpa / count).toFixed(2)),
      highestScpa,
      lowestScpa,
      topper: topper ? {
        name: topper.name,
        prn: topper.prn,
        scpa: topper.summary.scpa,
        totalMarks: topper.summary.totalMarks
      } : undefined,
      gradeDistribution
    },
    students
  };
}
