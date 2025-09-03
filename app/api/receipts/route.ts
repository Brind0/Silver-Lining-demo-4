import { NextRequest, NextResponse } from 'next/server';
import { getAllReceipts, getReceiptStats } from '@/lib/db/receipts-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';

    const receipts = await getAllReceipts();
    
    if (includeStats) {
      const stats = await getReceiptStats();
      return NextResponse.json({
        receipts,
        stats
      });
    }

    return NextResponse.json({ receipts });
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch receipts' },
      { status: 500 }
    );
  }
}