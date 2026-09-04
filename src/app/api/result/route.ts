import { NextResponse } from 'next/server';
import { fetchStudentResult } from '@/lib/mgu-scraper';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { examId, prn, demoMode } = body;

    if (!examId || !prn) {
      return NextResponse.json(
        { success: false, error: 'Both Examination and PRN (Register Number) are required.' },
        { status: 400 }
      );
    }

    const cleanPrn = String(prn).trim();
    if (cleanPrn.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid PRN (typically 10-12 digits).' },
        { status: 400 }
      );
    }

    const result = await fetchStudentResult(String(examId), cleanPrn, Boolean(demoMode));
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch result' },
      { status: 404 }
    );
  }
}
