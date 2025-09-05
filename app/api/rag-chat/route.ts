import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ragService, RAGContext } from '@/lib/services/rag-service'

// Validation schemas
const ChatMessageSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(5000).trim(),
  timestamp: z.string().datetime()
})

const RAGContextSchema = z.object({
  messageId: z.string().min(1).max(100),
  senderId: z.string().min(1).max(100),
  projectId: z.string().min(1).max(100).optional(),
  category: z.enum(['client', 'team', 'external', 'system']),
  priority: z.enum(['urgent', 'action', 'review', 'complete'])
})

const RAGChatRequestSchema = z.object({
  query: z.string().min(1).max(1000).trim(),
  context: RAGContextSchema,
  conversationHistory: z.array(ChatMessageSchema).max(50).default([])
})

// Rate limiting (simple in-memory implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 20
  
  const current = requestCounts.get(clientIP) || { count: 0, resetTime: now + windowMs }
  
  if (now > current.resetTime) {
    current.count = 1
    current.resetTime = now + windowMs
  } else {
    current.count++
  }
  
  requestCounts.set(clientIP, current)
  
  return current.count <= maxRequests
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Please wait before making more requests.'
      }, { status: 429 })
    }

    // Parse and validate request body
    const rawBody = await request.json()
    const body = RAGChatRequestSchema.parse(rawBody)

    // Generate RAG response
    const ragResponse = await ragService.generateResponse(
      body.query,
      body.context,
      body.conversationHistory || []
    )

    // Return successful response
    return NextResponse.json({
      success: true,
      response: ragResponse.response,
      confidence: ragResponse.confidence,
      citations: ragResponse.citations || [],
      suggestedFollowUps: ragResponse.suggestedFollowUps || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('RAG Chat API error:', error)
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request format',
        details: process.env.NODE_ENV === 'development' ? error.errors : undefined
      }, { status: 400 })
    }
    
    // Handle other errors
    return NextResponse.json({
      success: false,
      error: 'Internal server error while processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to submit queries.'
  }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to submit queries.'
  }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to submit queries.'
  }, { status: 405 })
}