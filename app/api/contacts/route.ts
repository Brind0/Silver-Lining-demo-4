import { NextRequest, NextResponse } from 'next/server';
import { getAllContacts } from '@/lib/db/messages-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let contacts = await getAllContacts();
    
    if (category) {
      contacts = contacts.filter(contact => contact.category === category);
    }

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}