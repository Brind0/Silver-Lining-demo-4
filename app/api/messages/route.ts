import { NextRequest, NextResponse } from 'next/server';
import { getAllMessages, getMessageStats } from '@/lib/db/messages-db';
import { MessageFilters } from '@/lib/types/messages';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';
    
    // Parse filters from query params
    const filters: MessageFilters = {};
    
    const priorities = searchParams.get('priorities');
    if (priorities) {
      filters.priorities = priorities.split(',') as any[];
    }
    
    const sources = searchParams.get('sources');
    if (sources) {
      filters.sources = sources.split(',') as any[];
    }
    
    const categories = searchParams.get('categories');
    if (categories) {
      filters.categories = categories.split(',') as any[];
    }
    
    const status = searchParams.get('status');
    if (status) {
      filters.status = status.split(',') as any[];
    }
    
    const projectIds = searchParams.get('projects');
    if (projectIds) {
      filters.projectIds = projectIds.split(',');
    }
    
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filters.searchQuery = searchQuery;
    }
    
    const requiresResponse = searchParams.get('requiresResponse');
    if (requiresResponse === 'true') {
      filters.requiresResponse = true;
    }

    const messages = await getAllMessages(filters);
    
    if (includeStats) {
      const stats = await getMessageStats();
      return NextResponse.json({
        messages,
        stats
      });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}