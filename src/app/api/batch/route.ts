import { NextResponse } from 'next/server';
import { fetchBatchResults } from '@/lib/mgu-scraper';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { examId, startPrn, endPrn, degreeLevel } = body;
    const cleanDegree = (degreeLevel === 'PG' ? 'PG' : 'UG') as 'UG' | 'PG';

    if (!examId || !startPrn || !endPrn) {
      return NextResponse.json(
        { success: false, error: 'Examination, Start PRN, and End PRN are all required.' },
        { status: 400 }
      );
    }

    const startNum = parseInt(startPrn, 10);
    const endNum = parseInt(endPrn, 10);

    if (isNaN(startNum) || isNaN(endNum)) {
      return NextResponse.json(
        { success: false, error: 'PRN values must be valid numbers.' },
        { status: 400 }
      );
    }

    if (endNum < startNum) {
      return NextResponse.json(
        { success: false, error: 'Start PRN must be less than or equal to End PRN.' },
        { status: 400 }
      );
    }

    if (endNum - startNum + 1 > 60) {
      return NextResponse.json(
        { success: false, error: 'Range cannot exceed 60 students per query to protect server limits.' },
        { status: 400 }
      );
    }

    const batchData = await fetchBatchResults(
      String(examId),
      String(startPrn).trim(),
      String(endPrn).trim(),
      false,
      cleanDegree
    );

    return NextResponse.json({
      success: true,
      data: batchData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process batch query' },
      { status: 500 }
    );
  }
}
