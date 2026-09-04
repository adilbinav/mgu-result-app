import { NextResponse } from 'next/server';
import { fetchExamList } from '@/lib/mgu-scraper';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const demo = searchParams.get('demo') === 'true';

    const { exams, isLive } = await fetchExamList(demo);
    return NextResponse.json({
      success: true,
      isLive,
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
