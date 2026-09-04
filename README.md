# MG University Exam Result Web Application

A modern, fast, and feature-packed web application for retrieving and analyzing **Mahatma Gandhi (MG) University CBCSS & B.Voc undergraduate semester examination results**.

The app connects directly to the official university results portal (`https://dsdc.mgu.ac.in/exQpMgmt/index.php/public/ResultView_ctrl/`), extracts student mark cards into structured data, and provides features that are missing from the university site:
- **Single Result Lookup**: Individual mark card with student details, course-wise ESA/ISA marks, SCPA, Grade, and status.
- **Batch / Class Result Checker**: Enter a range of roll numbers (PRNs) to fetch results for an entire class at once.
- **Class Leaderboard & Analytics**: Automatically computes Pass Percentage, Top Ranker, Class Average SCPA, and Grade distribution.
- **Print & Clean PDF Marksheet**: Official-style grade card with university header, candidate details, course table, and disclaimer.
- **CSV Spreadsheet Export**: One-click download of batch class results to Excel/CSV.
- **Dual-Mode Engine (Live & Offline Demo Simulator)**: Works live with university servers and has a 1-click fallback simulator with authentic student data.

---

## 🚀 Quick Start

### 1. Run Development Server
```bash
npm run dev
```

### 2. Build for Production
```bash
npm run build
npm run start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎓 Verified Real Student Test PRN
- **Examination**: `FIFTH SEMESTER CBCS EXAMINATION OCTOBER 2023` (Exam ID: 114)
- **PRN**: `210021000001`
- **Candidate**: `AAYISHA IZZATH M.Y`
- **Result**: Passed (SCPA: 6.75, Grade: B+, 400/600 Marks)

You can also click the **"Try Real Student PRN (210021000001)"** button in the UI for 1-click testing.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Icons & Visuals**: Lucide React, Canvas-confetti
- **Scraper Engine**: Cheerio, Node.js HTTPS / Fetch with SSL certificate handling
