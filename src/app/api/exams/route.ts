import { NextResponse } from 'next/server';
import { fetchExamList } from '@/lib/mgu-scraper';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const degreeParam = searchParams.get('degree')?.toUpperCase();
    const degreeLevel = degreeParam === 'PG' ? 'PG' : 'UG';

    const { exams, isLive } = await fetchExamList(false, degreeLevel);
    return NextResponse.json({
      success: true,
      isLive,
      degreeLevel,
      count: exams.length,
      exams,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch examinations' },
      { status: 500 }
    );
  }
}
