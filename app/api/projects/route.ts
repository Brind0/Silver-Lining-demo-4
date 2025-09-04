import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/db/messages-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let projects = await getAllProjects();
    
    if (status) {
      projects = projects.filter(project => project.status === status);
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}