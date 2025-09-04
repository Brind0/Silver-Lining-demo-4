import { NextRequest, NextResponse } from 'next/server';
import { getExternalCompanyMetrics } from '@/lib/db/messages-db';

export async function GET(request: NextRequest) {
  try {
    const metrics = await getExternalCompanyMetrics();
    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching external company metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external company metrics' },
      { status: 500 }
    );
  }
}