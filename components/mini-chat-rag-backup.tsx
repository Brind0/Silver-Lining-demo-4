"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Bot,
  User,
  Copy,
  Clock,
  TrendingUp,
  Users,
  Building,
  DollarSign,
  Calendar,
  MessageCircle,
  Mail,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  X,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Message, Project, ChatMessage, MiniChatRAGProps, QuickQuestion, AITemplateSelectedEvent, AutoTriggerQueryEvent } from "@/lib/types/messages"

function ProfessionalMessageContent({ content }: { content: string }) {
  const formatContent = (text: string) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      if (trimmedLine.startsWith('# ') || trimmedLine.startsWith('## ')) {
        const headerText = trimmedLine.replace(/^#{1,3}\s/, '')
        elements.push(
          <div key={index} className="font-semibold text-sm text-gray-900 mt-3 mb-2">
            {headerText}
          </div>
        )
      } else if (trimmedLine.startsWith('• ') || trimmedLine.startsWith('- ')) {
        const bulletText = trimmedLine.replace(/^[•-]\s/, '')
        elements.push(
          <div key={index} className="flex items-start mb-1">
            <span className="text-gray-600 mr-2 mt-0.5">•</span>
            <span className="text-gray-800">{bulletText}</span>
          </div>
        )
      } else if (trimmedLine.includes('**') && trimmedLine.includes('**')) {
        const parts = trimmedLine.split('**')
        const formattedParts = parts.map((part, partIndex) =>
          partIndex % 2 === 1 ?
            <span key={partIndex} className="font-semibold text-gray-900">{part}</span> :
            <span key={partIndex} className="text-gray-800">{part}</span>
        )
        elements.push(<div key={index} className="mb-1">{formattedParts}</div>)
      } else if (trimmedLine.length > 0) {
        elements.push(
          <div key={index} className="text-gray-800 mb-1">
            {trimmedLine}
          </div>
        )
      } else if (index < lines.length - 1) {
        elements.push(<div key={index} className="mb-2" />)
      }
    })

    return elements
  }

  return <>{formatContent(content)}</>
}

export function MiniChatRAG({ message, className }: MiniChatRAGProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [displayedContent, setDisplayedContent] = useState<Record<string, string>>({})
  const [showReplyComposition, setShowReplyComposition] = useState(false)
  const [compositionData, setCompositionData] = useState<{
    emailContent: string
    type: string
    confidence: number
  } | null>(null)
  const [refinementQuery, setRefinementQuery] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    window.addEventListener('auto-trigger-query', handleAutoTrigger)
    window.addEventListener('escalation-sent', handleEscalationSent)
    window.addEventListener('show-reply-composition', handleShowReplyComposition)

    return () => {
      window.removeEventListener('auto-trigger-query', handleAutoTrigger)
      window.removeEventListener('escalation-sent', handleEscalationSent)
      window.removeEventListener('show-reply-composition', handleShowReplyComposition)
    }
  }, [])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const handleAutoTrigger = (event: Event) => {
    const customEvent = event as CustomEvent<{ query: string }>
    const { query } = customEvent.detail
    if (query) {
      handleSubmit(query)
    }
  }

  const handleEscalationSent = (event: Event) => {
    const customEvent = event as CustomEvent<{ emailSent: boolean; nextStep: string }>
    const { emailSent, nextStep } = customEvent.detail
    if (emailSent && nextStep === 'follow-up-composition') {
      const followUpMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `Great! I've prepared the escalation email for the Marchmont House gas connection delay. The email has been sent to David Thompson at British Gas Commercial.

## Next Steps:
• **Schedule Daily Follow-ups**: Set reminders to check on permit status
• **Prepare Alternative Solutions**: Research backup heating options if delays extend
• **Update Project Timeline**: Adjust milestone dates to account for potential 6-day overrun
• **Notify Stakeholders**: Keep the client informed of our proactive escalation

Would you like me to help you prepare follow-up actions or update the project timeline?`,
        timestamp: new Date().toISOString(),
        confidence: 95
      }
      setChatHistory(prev => [...prev, followUpMessage])
      setShowReplyComposition(false)
    }
  }

  const handleShowReplyComposition = (event: Event) => {
    const customEvent = event as CustomEvent<{ emailContent: string; type: string; confidence: number }>
    const { emailContent, type, confidence } = customEvent.detail
    setCompositionData({ emailContent, type, confidence })
    setShowReplyComposition(true)
  }

  const quickQuestions: QuickQuestion[] = [
    {
      text: "Project Timeline Impact",
      query: "What's the impact on project timeline and critical path?",
      icon: Calendar
    },
    {
      text: "Budget Implications",
      query: "How will this delay affect project budget and costs?",
      icon: DollarSign
    },
    {
      text: "Escalation Options",
      query: "What escalation options do we have to resolve this quickly?",
      icon: AlertTriangle
    },
    {
      text: "Stakeholder Communication",
      query: "How should we communicate this delay to stakeholders?",
      icon: MessageCircle
    }
  ]

  const handleQuickQuestion = async (question: string) => {
    await handleSubmit(question)
  }

  const handleUseAsReply = (content: string) => {
    const event: AITemplateSelectedEvent = new CustomEvent('ai-template-selected', {
      detail: {
        template: content,
        confidence: compositionData?.confidence || 85,
        messageId: message.id
      }
    })
    window.dispatchEvent(event)
    setShowReplyComposition(false)
  }

  const handleRefineResponse = (content: string) => {
    const refinementQuery = `Please refine this response to be more professional and concise: "${content.substring(0, 200)}..."`
    handleSubmit(refinementQuery)
  }

  const handleSendEscalationEmail = () => {
    const emailContent = `Subject: URGENT: Gas Connection Permit Delay - Escalation Required

Dear David Thompson,

I hope this email finds you well. I am writing to escalate a critical issue regarding the gas connection permit for the Marchmont House Heritage project (Permit Reference: GAS-2024-MH-001).

## Current Situation:
• Gas connection works were scheduled to begin on March 15th, 2024
• We have experienced an unexpected 6-day delay in permit approval
• This delay directly impacts our critical path and project delivery timeline
• The heritage nature of this property makes alternative solutions challenging

## Business Impact:
• **Timeline Risk**: 6-day delay affects subsequent electrical and plumbing work
• **Budget Impact**: Potential £12,000 in additional costs due to trade rescheduling
• **Client Relations**: High-profile heritage project with significant stakeholder visibility

## Immediate Action Required:
We respectfully request your urgent intervention to:
1. **Expedite Permit Review**: Priority processing of our pending application
2. **Provide Clear Timeline**: Definitive approval date for planning purposes
3. **Alternative Solutions**: If delays are unavoidable, guidance on interim measures

## Our Commitment:
We remain fully committed to compliance with all safety and heritage regulations. Our team is available for immediate consultation to address any outstanding concerns.

Given the critical nature of this project, I would be grateful for your urgent attention to this matter. I am available at your convenience for a call to discuss resolution options.

Thank you for your anticipated cooperation.

Best regards,
[Your Name]
[Your Title]
[Contact Information]`

    const newMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: `I've prepared a professional escalation email for the gas permit delay. This email strikes the right balance between urgency and professionalism.

## Key Elements Included:
• **Clear subject line** indicating urgency and specific issue
• **Structured format** with current situation, business impact, and action items
• **Professional tone** while emphasizing critical timeline impact
• **Specific details** including permit reference and project context
• **Solution-focused approach** requesting specific actions

The email includes quantified impacts (6-day delay, £12,000 potential costs) to emphasize business consequences while maintaining a collaborative tone.`,
      timestamp: new Date().toISOString(),
      confidence: 94,
      displayedContent: '',
      showRecommendedActions: true
    }

    setChatHistory(prev => [...prev, newMessage])

    setTimeout(() => {
      startTypewriter(newMessage.id, newMessage.content)
    }, 300)

    setTimeout(() => {
      const event = new CustomEvent('show-reply-composition', {
        detail: {
          emailContent,
          type: 'escalation',
          confidence: 94
        }
      })
      window.dispatchEvent(event)
    }, 2000)
  }

  const handleUpdateProjectTimeline = () => {
    const newMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: `I'll help you update the project timeline to account for the 6-day gas connection delay.

## Timeline Impact Analysis:
• **Original Gas Connection Date**: March 15th, 2024
• **Revised Gas Connection Date**: March 21st, 2024 (pending permit approval)
• **Downstream Impact**: All subsequent trades delayed by 6 days
• **Critical Path**: Electrical rough-in now starts March 22nd instead of March 16th

## Affected Milestones:
• **Week 8**: Gas connection (delayed)
• **Week 9**: Electrical rough-in (delayed)
• **Week 10**: Plumbing installation (delayed)
• **Week 12**: Final inspections (at risk)

## Risk Mitigation Options:
• **Parallel Work Streams**: Begin non-gas dependent work immediately
• **Extended Hours**: Consider weekend work to recover lost time
• **Resource Allocation**: Add additional trades to accelerate catch-up

Would you like me to create a revised project schedule or explore specific mitigation strategies?`,
      timestamp: new Date().toISOString(),
      confidence: 88
    }
    setChatHistory(prev => [...prev, newMessage])
  }

  const handleViewProject = () => {
    const params = new URLSearchParams({
      from: 'messages',
      messageId: message.id,
      action: 'view-project-timeline'
    })

    window.location.href = `/projects/2?${params.toString()}`
  }

  const handleContactSupplier = () => {
    const newMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: `I'll help you contact British Gas Commercial about the permit delay.

## Direct Contact Strategy:
• **Primary Contact**: David Thompson - Senior Permits Manager
• **Phone**: 0800 111-999 (Direct line for commercial permits)
• **Email**: d.thompson@britishgas.com
• **Reference**: Gas connection permit GAS-2024-MH-001

## Recommended Approach:
• **Immediate Call**: Follow up on escalation email within 2 hours
• **Professional Tone**: Emphasize partnership and solutions focus
• **Document Everything**: Record all conversations and commitments
• **Set Expectations**: Request specific timeline commitments

## Key Discussion Points:
• **Urgency**: Heritage project with tight timeline constraints
• **Business Impact**: £12,000 potential delay costs to quantify urgency
• **Alternative Solutions**: Ask about expedited processing options
• **Next Steps**: Confirm daily status update schedule

## Backup Contacts:
• **Regional Manager**: Sarah Mitchell (if David unavailable)
• **Commercial Helpdesk**: 0800 111-888 (general permits queries)
• **Escalation Path**: British Gas Commercial Director's office

Would you like me to prepare talking points for the call or draft a follow-up email template?`,
      timestamp: new Date().toISOString(),
      confidence: 89
    }
    setChatHistory(prev => [...prev, newMessage])
  }

  const handlePrepareFollowUps = () => {
    const followUpMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: `I'll help you prepare comprehensive follow-up actions for the gas connection delay.

## Immediate Follow-ups (Next 24 hours):
• **Call British Gas**: Direct phone follow-up to escalation email
• **Client Notification**: Inform client of proactive escalation steps
• **Team Brief**: Update all trades on revised timeline
• **Backup Planning**: Research alternative heating solutions

## Weekly Follow-ups:
• **Permit Status Check**: Daily monitoring of approval progress
• **Stakeholder Updates**: Weekly client communications
• **Budget Tracking**: Monitor delay-related cost impacts
• **Schedule Adjustments**: Refine timeline as new info emerges

## Escalation Triggers:
• **Day 3**: If no response, escalate to British Gas manager
• **Day 5**: Consider involving local council liaison
• **Day 7**: Activate backup heating plan if available

## Documentation Required:
• **Email Trail**: All correspondence with British Gas
• **Cost Tracking**: Delay-related expenses for client billing
• **Timeline Updates**: Revised schedule communications

Would you like me to set up automated reminders or prepare any specific follow-up templates?`,
      timestamp: new Date().toISOString(),
      confidence: 91
    }
    setChatHistory(prev => [...prev, followUpMessage])
  }

  const handleApproveAllMessages = () => {
    const approvalMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: `Perfect! I've processed all the follow-up actions for the Marchmont House gas connection delay.

## Actions Completed:
✅ **Escalation Email Prepared** - Professional escalation to British Gas Commercial
✅ **Timeline Impact Assessed** - 6-day delay mapped to critical path
✅ **Follow-up Plan Created** - Daily monitoring and stakeholder communication schedule
✅ **Risk Mitigation Options** - Parallel work streams and resource reallocation strategies

## Next Immediate Steps:
1. **Send Escalation Email** to David Thompson (British Gas Commercial)
2. **Update Client** on proactive escalation and mitigation measures
3. **Reschedule Trades** for revised timeline starting March 21st
4. **Set Daily Reminders** for permit status monitoring

## Project Status Update:
• **Risk Level**: Elevated (due to timeline impact)
• **Mitigation Status**: Active escalation in progress
• **Client Communication**: Proactive transparency maintained
• **Team Coordination**: All trades briefed on revised schedule

The escalation approach balances urgency with professionalism, emphasizing business impact while maintaining collaborative relationships. All documentation is prepared for immediate action.

Ready to proceed with sending the escalation email?`,
      timestamp: new Date().toISOString(),
      confidence: 96
    }
    setChatHistory(prev => [...prev, approvalMessage])
  }

  const handleReturnToProject = () => {
    const params = new URLSearchParams({
      from: 'messages-resolved',
      messageId: message.id,
      action: 'gas-delay-escalated',
      status: 'completed'
    })

    window.location.href = `/projects/2?${params.toString()}`
  }

  const handleApproveAndSend = async () => {
    try {
      const response = await fetch('/api/send-escalation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: message.id,
          emailContent: compositionData?.emailContent,
          recipient: 'David Thompson <d.thompson@britishgas.com>',
          subject: 'URGENT: Gas Connection Permit Delay - Escalation Required'
        })
      })

      if (response.ok) {
        const event = new CustomEvent('escalation-sent', {
          detail: {
            emailSent: true,
            nextStep: 'follow-up-composition'
          }
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error('Error sending escalation:', error)
    }
  }

  const handleAIRefinement = async () => {
    if (!refinementQuery.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/refine-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent: compositionData?.emailContent,
          refinementInstructions: refinementQuery,
          context: {
            messageId: message.id,
            projectId: message.project?.id,
            type: compositionData?.type
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        setCompositionData(prev => prev ? {
          ...prev,
          emailContent: result.refinedContent,
          confidence: result.confidence || prev.confidence
        } : null)

        setRefinementQuery('')
      }
    } catch (error) {
      console.error('Error refining email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (questionText?: string) => {
    const question = questionText || inputValue.trim()
    if (!question || isLoading) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question,
      timestamp: new Date().toISOString()
    }

    setChatHistory(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/rag-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: question,
          context: {
            messageId: message.id,
            projectId: message.project?.id,
            senderId: message.senderId,
            category: message.category,
            priority: message.priority
          },
          conversationHistory: chatHistory
        }),
        signal: abortController.signal
      })

      const result = await response.json()

      if (result.success) {
        const assistantMessageId = `assistant-${Date.now()}`
        const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          type: 'assistant',
          content: result.response,
          timestamp: new Date().toISOString(),
          citations: result.citations,
          confidence: result.confidence,
          isStreaming: true,
          displayedContent: '',
          showRecommendedActions: result.showRecommendedActions || false
        }
        setChatHistory(prev => [...prev, assistantMessage])

        setTimeout(() => {
          startTypewriter(assistantMessageId, result.response)
        }, 300)
      } else {
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: 'assistant',
          content: "I'm sorry, I couldn't process your question at the moment. Please try again.",
          timestamp: new Date().toISOString()
        }
        setChatHistory(prev => [...prev, errorMessage])
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return
      }

      console.error('RAG Chat error:', error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: "There was an error processing your request. Please try again.",
        timestamp: new Date().toISOString()
      }
      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [messageId]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [messageId]: false }))
      }, 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const startTypewriter = (messageId: string, fullContent: string) => {
    const words = fullContent.split(/(\s+)/)
    let currentWordIndex = 0

    const typeNextWord = () => {
      if (currentWordIndex < words.length) {
        const displayedContent = words.slice(0, currentWordIndex + 1).join('')
        setDisplayedContent(prev => ({ ...prev, [messageId]: displayedContent }))

        setChatHistory(prev => prev.map(msg =>
          msg.id === messageId
            ? { ...msg, displayedContent, isStreaming: currentWordIndex < words.length - 1 }
            : msg
        ))

        currentWordIndex++

        const currentWord = words[currentWordIndex - 1]
        const delay = currentWord?.includes('\n') ? 100 :
                     currentWord?.length > 8 ? 80 :
                     currentWord?.includes('.') || currentWord?.includes('!') ? 120 : 45

        setTimeout(typeNextWord, delay)
      } else {
        setChatHistory(prev => prev.map(msg =>
          msg.id === messageId
            ? { ...msg, isStreaming: false }
            : msg
        ))
      }
    }

    typeNextWord()
  }

  const handleRecommendedAction = (action: string) => {
    switch (action) {
      case 'Send Escalation Email':
        handleSendEscalationEmail()
        break
      case 'Contact Supplier':
        handleContactSupplier()
        break
      case 'Update Timeline':
        handleUpdateProjectTimeline()
        break
      case 'View Project':
        handleViewProject()
        break
      default:
        console.log('Unknown action:', action)
    }
  }

  const getContextualSuggestions = (): string[] => {
    const suggestions: string[] = []

    if (message.priority === 'urgent') {
      suggestions.push("What are the immediate risks if we don't respond quickly?")
    }

    if (message.content.toLowerCase().includes('delay')) {
      suggestions.push("What's causing delays and how can we mitigate them?")
    }

    if (message.content.toLowerCase().includes('budget') || message.content.toLowerCase().includes('cost')) {
      suggestions.push("Show me the current budget impact analysis")
    }

    if (message.content.toLowerCase().includes('permit') || message.content.toLowerCase().includes('compliance')) {
      suggestions.push("What are the compliance implications and next steps?")
    }

    return suggestions
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
        <h4 className="font-semibold text-gray-900 flex items-center text-sm">
          <Bot className="h-4 w-4 mr-2 text-blue-600" />
          Project Assistant
        </h4>
        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
          {message.project?.name || 'General'}
        </Badge>
      </div>

      {/* Reply Composition Box - appears above chat when escalation email is triggered */}
      {showReplyComposition && compositionData && (
        <div className="flex-shrink-0 border-b bg-yellow-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                Email Composition
              </h4>
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={handleApproveAndSend} className="bg-green-600 hover:bg-green-700">
                  Approve & Send
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReplyComposition(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm max-h-48 overflow-y-auto">
              <div className="p-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Subject: URGENT: Gas Connection Permit Delay - Escalation Required
                </div>
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-mono">
                  {compositionData.emailContent}
                </div>
              </div>
            </div>

            {/* Refinement Input */}
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Ask me to refine the tone, add details, or make changes..."
                value={refinementQuery}
                onChange={(e) => setRefinementQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIRefinement()}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={handleAIRefinement}
                disabled={!refinementQuery.trim() || isLoading}
              >
                Refine
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "flex-1 min-h-0 flex flex-col",
        showReplyComposition ? "max-h-[60vh]" : "max-h-full"
      )}>
        <div className="flex-1 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full px-4">
          <div className="py-4 space-y-4">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg p-3 shadow-sm border",
                    msg.type === 'user'
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-900 border-gray-200"
                  )}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      msg.type === 'user'
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {msg.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      {msg.type === 'assistant' ? (
                        <div className="text-sm leading-relaxed">
                          <ProfessionalMessageContent
                            content={msg.displayedContent || msg.content}
                          />
                          {msg.isStreaming && (
                            <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse" />
                          )}
                        </div>
                      ) : (
                        <div className="text-sm leading-relaxed">{msg.content}</div>
                      )}
                    </div>
                    {msg.type === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="flex-shrink-0 h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {msg.showRecommendedActions && !msg.isStreaming && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-700 mb-2">Recommended Actions:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecommendedAction('Send Escalation Email')}
                          className="h-8 px-3 text-xs text-gray-700 hover:text-gray-900 justify-start border-gray-300"
                        >
                          <Mail className="h-3 w-3 mr-2" />
                          Send Escalation Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecommendedAction('Contact Supplier')}
                          className="h-8 px-3 text-xs text-gray-700 hover:text-gray-900 justify-start border-gray-300"
                        >
                          <AlertTriangle className="h-3 w-3 mr-2" />
                          Contact Supplier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecommendedAction('Update Timeline')}
                          className="h-8 px-3 text-xs text-gray-700 hover:text-gray-900 justify-start border-gray-300"
                        >
                          <Calendar className="h-3 w-3 mr-2" />
                          Update Timeline
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecommendedAction('View Project')}
                          className="h-8 px-3 text-xs text-gray-700 hover:text-gray-900 justify-start border-gray-300"
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          View Project
                        </Button>
                      </div>
                    </div>
                  )}

                  {msg.confidence && (
                    <div className="text-xs text-gray-500 mt-2">
                      {msg.confidence}% confident
                    </div>
                  )}

                  {copiedStates[msg.id] && (
                    <div className="text-xs text-green-600 mt-1">Copied!</div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg p-3 shadow-sm border bg-white text-gray-900 border-gray-200">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-gray-400" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          </ScrollArea>
        </div>

        <div className="border-t bg-white p-4 flex-shrink-0">
          {chatHistory.length === 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Quick questions about this message:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, index) => {
                  const IconComponent = q.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickQuestion(q.query)}
                      className="h-8 px-2 text-xs text-gray-600 hover:text-blue-700 justify-start"
                      disabled={isLoading}
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {q.text}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about this message or project..."
              disabled={isLoading}
              className="text-sm"
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {chatHistory.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {getContextualSuggestions().slice(0, 2).map((suggestion, index) => {
                  const quickQ = quickQuestions.find(q => q.query.toLowerCase().includes(suggestion.toLowerCase().split(' ')[0]))
                  const IconComponent = quickQ?.icon || MessageCircle
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickQuestion(suggestion)}
                      className="h-6 px-2 text-xs text-gray-600 hover:text-blue-700"
                      disabled={isLoading}
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {suggestion.length > 35 ? `${suggestion.substring(0, 35)}...` : suggestion}
                    </Button>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">{chatHistory.length} messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}