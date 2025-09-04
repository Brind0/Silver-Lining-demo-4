import { NextRequest, NextResponse } from 'next/server';
import { getMessageById, updateMessageStatus } from '@/lib/db/messages-db';
import { MessageStatus } from '@/lib/types/messages';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const message = await getMessageById(params.id);
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['unread', 'read', 'requires_response', 'responded', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status provided' },
        { status: 400 }
      );
    }

    const success = await updateMessageStatus(params.id, status as MessageStatus);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Message not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}