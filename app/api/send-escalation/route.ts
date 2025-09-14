import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messageId, emailContent, recipient, subject } = await request.json()

    // In a real application, this would integrate with an email service
    // For demo purposes, we'll simulate sending the email
    console.log('Escalation Email Sent:', {
      messageId,
      recipient,
      subject,
      content: emailContent?.substring(0, 100) + '...'
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Return success response with next steps
    return NextResponse.json({
      success: true,
      emailSent: true,
      message: 'Escalation email sent successfully',
      nextSteps: [
        'Email sent to David Thompson at British Gas Commercial',
        'Response expected within 24 hours',
        'Follow-up reminder scheduled for tomorrow',
        'Project timeline updated with potential delays'
      ],
      sentAt: new Date().toISOString(),
      trackingId: `ESC-${Date.now()}`
    })

  } catch (error) {
    console.error('Error sending escalation email:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send escalation email',
        message: 'There was an error sending the escalation email. Please try again.'
      },
      { status: 500 }
    )
  }
}