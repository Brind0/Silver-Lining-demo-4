import { NextRequest, NextResponse } from 'next/server'
import { communicationService, SendMessageRequest } from '@/lib/services/communication-service'
import { updateMessageStatus } from '@/lib/db/messages-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { channel, recipientId, content, originalMessageId, sentBy } = body
    
    if (!channel || !recipientId || !content || !originalMessageId || !sentBy) {
      return NextResponse.json(
        { error: 'Missing required fields: channel, recipientId, content, originalMessageId, sentBy' },
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

    // Prepare send request
    const sendRequest: SendMessageRequest = {
      channel,
      recipientId,
      content,
      originalMessageId,
      sentBy,
      subject: body.subject,
      templateId: body.templateId,
      metadata: {
        signature: body.signature,
        attachments: body.attachments || [],
        priority: body.priority || 'normal'
      }
    }

    // Send the message
    const result = await communicationService.sendMessage(sendRequest)

    if (result.success) {
      // Update the original message status to 'responded'
      await updateMessageStatus(originalMessageId, 'responded')
      
      return NextResponse.json({
        success: true,
        replyId: result.replyId,
        externalMessageId: result.externalMessageId,
        estimatedDelivery: result.estimatedDelivery,
        message: 'Message sent successfully'
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          replyId: result.replyId,
          error: result.error,
          message: 'Failed to send message'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send message API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check message status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const replyId = searchParams.get('replyId')
    
    if (!replyId) {
      return NextResponse.json(
        { error: 'replyId is required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would query the database
    // for the reply status and delivery information
    return NextResponse.json({
      replyId,
      status: 'sent',
      deliveryStatus: 'delivered',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Get message status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}