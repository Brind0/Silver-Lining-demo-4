import { NextRequest, NextResponse } from 'next/server'
import { saveDraft, getDraft, deleteDraft } from '@/lib/db/messages-db'
import { Draft, MessageSource } from '@/lib/types/messages'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { messageId, content, channel, recipientId } = body
    
    if (!messageId || !content || !channel || !recipientId) {
      return NextResponse.json(
        { error: 'Missing required fields: messageId, content, channel, recipientId' },
        { status: 400 }
      )
    }

    // Validate channel type
    const validChannels = ['email', 'whatsapp', 'sms']
    if (!validChannels.includes(channel)) {
      return NextResponse.json(
        { error: 'Invalid channel. Must be one of: email, whatsapp, sms' },
        { status: 400 }
      )
    }

    // Generate draft ID if not provided
    const draftId = body.draftId || `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const draft: Omit<Draft, 'created_at' | 'updated_at'> = {
      id: draftId,
      messageId,
      content,
      channel: channel as MessageSource,
      recipientId,
      subject: body.subject,
      templateId: body.templateId,
      metadata: {
        autoSaveInterval: body.autoSaveInterval || 30000, // Default 30 seconds
        lastSaved: new Date().toISOString()
      }
    }

    const savedDraftId = await saveDraft(draft)

    return NextResponse.json({
      success: true,
      draftId: savedDraftId,
      lastSaved: draft.metadata.lastSaved,
      message: 'Draft saved successfully'
    })

  } catch (error) {
    console.error('Save draft API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    
    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId is required' },
        { status: 400 }
      )
    }

    const draft = await getDraft(messageId)
    
    if (!draft) {
      return NextResponse.json({
        success: true,
        draft: null,
        message: 'No draft found'
      })
    }

    return NextResponse.json({
      success: true,
      draft
    })

  } catch (error) {
    console.error('Get draft API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    
    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId is required' },
        { status: 400 }
      )
    }

    const deleted = await deleteDraft(messageId)
    
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Draft deleted successfully' : 'Draft not found'
    })

  } catch (error) {
    console.error('Delete draft API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}