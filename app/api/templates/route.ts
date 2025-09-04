import { NextRequest, NextResponse } from 'next/server'
import { createTemplate, getTemplates, incrementTemplateUsage } from '@/lib/db/messages-db'
import { MessageTemplate } from '@/lib/types/messages'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as MessageTemplate['category'] | null
    
    const templates = await getTemplates(category || undefined)
    
    return NextResponse.json({
      success: true,
      templates
    })

  } catch (error) {
    console.error('Get templates API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, content, category, createdBy } = body
    
    if (!name || !content || !category || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields: name, content, category, createdBy' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['quick_reply', 'professional', 'escalation', 'client_vip', 'team', 'external']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Generate template ID
    const templateId = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const template: Omit<MessageTemplate, 'created_at' | 'updated_at'> = {
      id: templateId,
      name,
      content,
      category,
      recipientType: body.recipientType || [],
      messageTypes: body.messageTypes || [],
      variables: body.variables || [],
      isActive: body.isActive !== false, // Default to true
      usageCount: 0,
      createdBy
    }

    await createTemplate(template)

    return NextResponse.json({
      success: true,
      templateId,
      message: 'Template created successfully'
    })

  } catch (error) {
    console.error('Create template API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, action } = body
    
    if (!templateId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: templateId, action' },
        { status: 400 }
      )
    }

    if (action === 'increment_usage') {
      await incrementTemplateUsage(templateId)
      return NextResponse.json({
        success: true,
        message: 'Template usage incremented'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Update template API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}