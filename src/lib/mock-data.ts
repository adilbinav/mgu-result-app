import { ExamInfo, StudentResult, BatchResultResponse } from './types';

export const MOCK_EXAMS: ExamInfo[] = [
  {
    id: "114",
    name: "FIFTH SEMESTER CBCS EXAMINATION OCTOBER 2023",
    semester: "FIFTH SEMESTER",
    year: "2023",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2021, 2020, 2019],
    degreeLevel: "UG"
  },
  {
    id: "143",
    name: "FIFTH SEMESTER CBCS EXAMINATION OCTOBER 2024",
    semester: "FIFTH SEMESTER",
    year: "2024",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021, 2020],
    degreeLevel: "UG"
  },
  {
    id: "177",
    name: "FIFTH SEMESTER CBCS EXAMINATION OCTOBER 2025",
    semester: "FIFTH SEMESTER",
    year: "2025",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2023, 2022, 2021],
    degreeLevel: "UG"
  },
  {
    id: "144",
    name: "FIFTH SEMESTER B Voc Degree EXAMINATION OCTOBER 2024",
    semester: "FIFTH SEMESTER",
    year: "2024",
    programmeCategory: "B.Voc",
    applicableAdmissionYears: [2022, 2021],
    degreeLevel: "UG"
  },
  {
    id: "115",
    name: "SIXTH SEMESTER CBCS EXAMINATION MARCH 2024",
    semester: "SIXTH SEMESTER",
    year: "2024",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2021, 2020],
    degreeLevel: "UG"
  },
  {
    id: "110",
    name: "FOURTH SEMESTER CBCS EXAMINATION APRIL 2024",
    semester: "FOURTH SEMESTER",
    year: "2024",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021],
    degreeLevel: "UG"
  },
  {
    id: "105",
    name: "THIRD SEMESTER CBCS EXAMINATION NOVEMBER 2023",
    semester: "THIRD SEMESTER",
    year: "2023",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021],
    degreeLevel: "UG"
  },
  {
    id: "101",
    name: "SECOND SEMESTER CBCS EXAMINATION MAY 2023",
    semester: "SECOND SEMESTER",
    year: "2023",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021],
    degreeLevel: "UG"
  },
  {
    id: "95",
    name: "FIRST SEMESTER CBCS EXAMINATION JANUARY 2023",
    semester: "FIRST SEMESTER",
    year: "2023",
    programmeCategory: "CBCS",
    applicableAdmissionYears: [2022, 2021],
    degreeLevel: "UG"
  }
];

export const MOCK_PG_EXAMS: ExamInfo[] = [
  {
    id: "119",
    name: "FIRST SEMESTER PGCSS EXAMINATION DECEMBER 2023",
    semester: "FIRST SEMESTER",
    year: "2023",
    programmeCategory: "PGCSS",
    applicableAdmissionYears: [2023, 2022],
    degreeLevel: "PG"
  },
  {
    id: "147",
    name: "FIRST SEMESTER PGCSS EXAMINATION DECEMBER 2024",
    semester: "FIRST SEMESTER",
    year: "2024",
    programmeCategory: "PGCSS",
    applicableAdmissionYears: [2024, 2023],
    degreeLevel: "PG"
  },
  {
    id: "130",
    name: "SECOND SEMESTER PGCSS EXAMINATION JUNE 2024",
    semester: "SECOND SEMESTER",
    year: "2024",
    programmeCategory: "PGCSS",
    applicableAdmissionYears: [2023, 2022],
    degreeLevel: "PG"
  },
  {
    id: "100",
    name: "SECOND SEMESTER PGCSS EXAMINATION JUNE 2023",
    semester: "SECOND SEMESTER",
    year: "2023",
    programmeCategory: "PGCSS",
    applicableAdmissionYears: [2022, 2021],
    degreeLevel: "PG"
  },
  {
    id: "123",
    name: "THIRD SEMESTER PGCSS SUPPLEMENTARY EXAMINATION JANUARY 2024",
    semester: "THIRD SEMESTER",
    year: "2024",
    programmeCategory: "PGCSS",
    applicableAdmissionYears: [2022, 2021],
    degreeLevel: "PG"
  },
  {
    id: "161",
    name: "THIRD SEMESTER PGCSS SUPPLEMENTARY EXAMINATION APRIL 2025",
    semester: "THIRD SEMESTER",
    year: "2025",
    programmeCategory: "PGCSS",
    applicableAdmissionYears: [2023, 2022],
    degreeLevel: "PG"
  },
  {
    id: "140",
    name: "FOURTH SEMESTER PGCSS EXAMINATION JULY 2024",
    semester: "FOURTH SEMESTER",
    year: "2024",
    programmeCategory: "PGCSS",
    applicableAdmissionYears: [2022, 2021],
    degreeLevel: "PG"
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

export const MOCK_PG_SINGLE_STUDENT: StudentResult = {
  prn: "230011018561",
  name: "NAJLA. P",
  programme: "M Sc BIOTECHNOLOGY",
  examCentre: "MES College, Marampally",
  examId: "119",
  examName: "FIRST SEMESTER PGCSS EXAMINATION DECEMBER 2023",
  isDemo: true,
  degreeLevel: 'PG',
  courses: [
    {
      code: "BT020101",
      title: "General Biochemistry",
      credit: 4,
      theoryInt: "5.00",
      theoryExt: "4.07",
      practicalInt: "---",
      practicalExt: "---",
      gpa: 4.30,
      grade: "A",
      result: "Passed",
      esaMarks: "4.07",
      esaMax: "5.00",
      isaMarks: "5.00",
      isaMax: "5.00",
      totalMarks: 86,
      maxMarks: 100,
      gradePoint: 4.30,
      creditPoint: 17.2,
    },
    {
      code: "BT020102",
      title: "Cell Biology and Genetics",
      credit: 4,
      theoryInt: "5.00",
      theoryExt: "3.73",
      practicalInt: "---",
      practicalExt: "---",
      gpa: 4.05,
      grade: "A",
      result: "Passed",
      esaMarks: "3.73",
      esaMax: "5.00",
      isaMarks: "5.00",
      isaMax: "5.00",
      totalMarks: 81,
      maxMarks: 100,
      gradePoint: 4.05,
      creditPoint: 16.2,
    },
    {
      code: "BT020103",
      title: "Instrumentation and Biostatistics",
      credit: 4,
      theoryInt: "4.80",
      theoryExt: "4.03",
      practicalInt: "---",
      practicalExt: "---",
      gpa: 4.22,
      grade: "A",
      result: "Passed",
      esaMarks: "4.03",
      esaMax: "5.00",
      isaMarks: "4.80",
      isaMax: "5.00",
      totalMarks: 84,
      maxMarks: 100,
      gradePoint: 4.22,
      creditPoint: 16.88,
    },
    {
      code: "BT020104",
      title: "Biophysics and Bioinformatics",
      credit: 4,
      theoryInt: "5.00",
      theoryExt: "4.23",
      practicalInt: "---",
      practicalExt: "---",
      gpa: 4.42,
      grade: "A",
      result: "Passed",
      esaMarks: "4.23",
      esaMax: "5.00",
      isaMarks: "5.00",
      isaMax: "5.00",
      totalMarks: 88,
      maxMarks: 100,
      gradePoint: 4.42,
      creditPoint: 17.68,
    },
    {
      code: "BT020105",
      title: "Lab Course - I",
      credit: 4,
      theoryInt: "---",
      theoryExt: "---",
      practicalInt: "5.00",
      practicalExt: "4.80",
      gpa: 4.85,
      grade: "A+",
      result: "Passed",
      esaMarks: "4.80",
      esaMax: "5.00",
      isaMarks: "5.00",
      isaMax: "5.00",
      totalMarks: 97,
      maxMarks: 100,
      gradePoint: 4.85,
      creditPoint: 19.4,
    }
  ],
  summary: {
    totalCredits: 20,
    scpa: 4.37,
    gpa: 4.37,
    scale: '5-point',
    totalMarks: 436,
    maxMarks: 500,
    percentage: 87.2,
    grade: "A",
    creditPoints: 87.36,
    result: "Passed"
  }
};

export function generateMockPgBatch(startNum: number, endNum: number, examId: string): BatchResultResponse {
  const count = endNum - startNum + 1;
  const students: StudentResult[] = [];
  let passed = 0;
  let totalGpa = 0;
  let highestGpa = 0;
  let lowestGpa = 5.0;
  let topper: StudentResult | null = null;
  const gradeDistribution: Record<string, number> = {
    'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0
  };

  const samplePgNames = [
    'NAJLA. P', 'ANJALI KRISHNAN', 'FATHIMA SHIRIN', 'RAHUL R NAIR',
    'ARYA SURESH', 'NIDHIN JOY', 'ASWATHY K.S', 'MOHAMMED AFEEF',
    'ARCHANA MENON', 'VISHNU DAS', 'HARITHA MOHAN', 'SARATH CHANDRAN'
  ];

  for (let i = 0; i < count; i++) {
    const prnVal = String(startNum + i);
    const name = samplePgNames[i % samplePgNames.length] + (i >= samplePgNames.length ? ` ${Math.floor(i / samplePgNames.length) + 1}` : '');

    // Pseudo-random GPA on 5-point scale between 2.2 and 4.9
    const seed = (startNum + i) % 100;
    const isFail = seed % 12 === 0;
    const gpa = isFail
      ? Number((1.5 + (seed % 5) * 0.1).toFixed(2))
      : Number((3.2 + (seed % 17) * 0.1).toFixed(2));
    
    let grade = 'B';
    if (gpa >= 4.5) grade = 'A+';
    else if (gpa >= 4.0) grade = 'A';
    else if (gpa >= 3.5) grade = 'B';
    else if (gpa >= 3.0) grade = 'C';
    else if (gpa >= 2.5) grade = 'D';
    else if (gpa >= 2.0) grade = 'E';
    else grade = 'F';

    const status = isFail ? 'Failed' : 'Passed';
    if (!isFail) passed++;

    totalGpa += gpa;
    if (gpa > highestGpa) highestGpa = gpa;
    if (gpa < lowestGpa) lowestGpa = gpa;
    gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;

    const student: StudentResult = {
      prn: prnVal,
      name,
      programme: "M Sc BIOTECHNOLOGY",
      examCentre: "MES College, Marampally",
      examId,
      examName: "FIRST SEMESTER PGCSS EXAMINATION DECEMBER 2023",
      isDemo: true,
      degreeLevel: 'PG',
      courses: [
        {
          code: "BT020101",
          title: "General Biochemistry",
          credit: 4,
          theoryInt: "4.80",
          theoryExt: String(Number((gpa - 0.2).toFixed(2))),
          practicalInt: "---",
          practicalExt: "---",
          gpa: gpa,
          grade: grade,
          result: status,
          esaMarks: String(Number((gpa - 0.2).toFixed(2))),
          esaMax: "5.00",
          isaMarks: "4.80",
          isaMax: "5.00",
          totalMarks: Math.round(gpa * 20),
          maxMarks: 100,
          gradePoint: gpa,
          creditPoint: Number((gpa * 4).toFixed(2)),
        },
        {
          code: "BT020102",
          title: "Cell Biology and Genetics",
          credit: 4,
          theoryInt: "5.00",
          theoryExt: String(Number((gpa - 0.1).toFixed(2))),
          practicalInt: "---",
          practicalExt: "---",
          gpa: gpa,
          grade: grade,
          result: status,
          esaMarks: String(Number((gpa - 0.1).toFixed(2))),
          esaMax: "5.00",
          isaMarks: "5.00",
          isaMax: "5.00",
          totalMarks: Math.round(gpa * 20),
          maxMarks: 100,
          gradePoint: gpa,
          creditPoint: Number((gpa * 4).toFixed(2)),
        },
        {
          code: "BT020105",
          title: "Lab Course - I",
          credit: 4,
          theoryInt: "---",
          theoryExt: "---",
          practicalInt: "5.00",
          practicalExt: "4.60",
          gpa: Number((Math.min(5.0, gpa + 0.3)).toFixed(2)),
          grade: gpa >= 4.2 ? "A+" : "A",
          result: status,
          esaMarks: "4.60",
          esaMax: "5.00",
          isaMarks: "5.00",
          isaMax: "5.00",
          totalMarks: 94,
          maxMarks: 100,
          gradePoint: 4.8,
          creditPoint: 19.2,
        }
      ],
      summary: {
        totalCredits: 12,
        scpa: gpa,
        gpa: gpa,
        scale: '5-point',
        totalMarks: Math.round(gpa * 60),
        maxMarks: 300,
        percentage: Number(((gpa / 5.0) * 100).toFixed(1)),
        grade,
        creditPoints: Number((gpa * 12).toFixed(2)),
        result: status
      }
    };

    if (!topper || student.summary.scpa > topper.summary.scpa) {
      topper = student;
    }

    students.push(student);
  }

  students.sort((a, b) => b.summary.scpa - a.summary.scpa);

  return {
    isDemo: true,
    degreeLevel: 'PG',
    summary: {
      totalRequested: count,
      totalFound: count,
      passedCount: passed,
      failedCount: count - passed,
      passPercentage: Number(((passed / count) * 100).toFixed(1)),
      averageScpa: Number((totalGpa / count).toFixed(2)),
      highestScpa: highestGpa,
      lowestScpa: lowestGpa,
      topper: topper ? {
        name: topper.name,
        prn: topper.prn,
        scpa: topper.summary.scpa,
        totalMarks: topper.summary.totalMarks
      } : undefined,
      gradeDistribution,
      degreeLevel: 'PG'
    },
    students
  };
}
