"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  X,
  Send,
  Save,
  FileText,
  Building,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  AlertCircle,
  AlertTriangle,
  Mail,
  MessageCircle,
  Phone,
  Smartphone,
  Settings,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Message, AITemplateSelectedEvent } from "@/lib/types/messages"
import { MiniChatRAG } from "@/components/mini-chat-rag"

interface MessageReplyViewProps {
  message: Message
  isVisible: boolean
  onClose: () => void
  className?: string
}


export function MessageReplyView({
  message,
  isVisible,
  onClose,
  className
}: MessageReplyViewProps) {
  const [replyContent, setReplyContent] = useState('')
  const [replySubject, setReplySubject] = useState('')
  const [isMessageExpanded, setIsMessageExpanded] = useState(false)
  const [showReplyComposition, setShowReplyComposition] = useState(false)
  const [compositionData, setCompositionData] = useState<{
    emailContent: string
    type: string
    confidence: number
  } | null>(null)
  const [isRefinementMode, setIsRefinementMode] = useState(false)
  const [refinementQuery, setRefinementQuery] = useState('')
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)

  const handleApproveAndSend = async () => {
    // Simulate sending the email
    try {
      // Send the escalation email
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'email',
          recipientId: 'british-gas-commercial',
          content: replyContent,
          subject: replySubject,
          originalMessageId: message.id,
          sentBy: 'Emily Johnson',
          priority: 'urgent'
        })
      })

      if (response.ok) {
        // Hide composition area and show success message
        setShowReplyComposition(false)
        setIsRefinementMode(false)

        // Trigger follow-up workflow
        setTimeout(() => {
          const followUpEvent = new CustomEvent('escalation-sent', {
            detail: {
              emailSent: true,
              nextStep: 'follow-up-composition'
            }
          })
          window.dispatchEvent(followUpEvent)
        }, 1000)
      }
    } catch (error) {
      console.error('Error sending escalation email:', error)
      alert('Failed to send escalation email. Please try again.')
    }
  }

  const handleAIRefinement = async () => {
    if (!refinementQuery.trim()) return

    try {
      // Simulate AI refinement
      const response = await fetch('/api/ai-refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent: replyContent,
          refinementInstruction: refinementQuery
        })
      })

      if (response.ok) {
        const result = await response.json()
        setReplyContent(result.refinedContent || replyContent)
        setIsRefinementMode(false)
        setRefinementQuery('')
      } else {
        // Fallback refinement for demo
        let refinedContent = replyContent

        if (refinementQuery.toLowerCase().includes('urgent') || refinementQuery.toLowerCase().includes('formal')) {
          refinedContent = replyContent.replace('I would appreciate', 'I require')
            .replace('discuss next steps', 'confirm immediate action')
        }

        if (refinementQuery.toLowerCase().includes('friendly') || refinementQuery.toLowerCase().includes('casual')) {
          refinedContent = replyContent.replace('Dear David', 'Hi David')
            .replace('Best regards', 'Thanks')
        }

        setReplyContent(refinedContent)
        setIsRefinementMode(false)
        setRefinementQuery('')
      }
    } catch (error) {
      console.error('Error refining content:', error)
    }
  }

  const handleSendReply = async () => {
    if (!replyContent.trim()) return

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: message.source,
          recipientId: message.senderId,
          content: replyContent,
          subject: replySubject,
          originalMessageId: message.id,
          sentBy: 'Emily Johnson',
          priority: message.priority === 'urgent' ? 'high' : 'normal'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        onClose()
      } else {
        alert(`Failed to send message: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  // Initialize reply subject
  useEffect(() => {
    if (message) {
      setReplySubject(`Re: ${message.subject}`)
    }
  }, [message])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return

      if (e.key === 'Escape') {
        onClose()
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSendReply()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, onClose, handleSendReply])

  // Handle AI template selection
  useEffect(() => {
    const handleTemplateSelected = (event: AITemplateSelectedEvent) => {
      if (!isVisible) return

      const { content, subject } = event.detail
      setReplyContent(content)
      if (subject) {
        setReplySubject(subject)
      }
    }

    window.addEventListener('ai-template-selected', handleTemplateSelected as EventListener)
    return () => window.removeEventListener('ai-template-selected', handleTemplateSelected as EventListener)
  }, [isVisible])

  // Handle reply composition area show/hide
  useEffect(() => {
    const handleShowReplyComposition = (event: CustomEvent) => {
      if (!isVisible) return

      const { emailContent, type, confidence } = event.detail
      setCompositionData({ emailContent, type, confidence })
      setShowReplyComposition(true)
      setReplyContent(emailContent)
      setReplySubject('URGENT: Gas Connection Permit Delay - Escalation Required')
    }

    window.addEventListener('show-reply-composition', handleShowReplyComposition as EventListener)
    return () => window.removeEventListener('show-reply-composition', handleShowReplyComposition as EventListener)
  }, [isVisible])


  const getSourceIcon = (source: string) => {
    const iconMap = {
      email: Mail,
      whatsapp: MessageCircle,
      sms: Smartphone,
      call: Phone,
      system: Settings
    }
    return iconMap[source as keyof typeof iconMap] || Mail
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (!isVisible) return null

  const SourceIcon = getSourceIcon(message.source)

  return (
    <div className={cn(
      "fixed inset-0 bg-white z-50 flex flex-col h-screen",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">Message Reply</h2>
          <Badge variant="outline" className="text-xs">
            {message.priority.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
            className="h-8 w-8 p-0"
            title={isLeftPanelCollapsed ? "Show message panel" : "Collapse message panel"}
          >
            {isLeftPanelCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Original Message + AI Crisis Response */}
        <div className={cn(
          "border-r-0 lg:border-r border-b lg:border-b-0 bg-gray-50 flex flex-col h-80 lg:h-full transition-all duration-300 overflow-hidden",
          // Handle both left panel and message expand/collapse states
          isLeftPanelCollapsed
            ? "w-0 lg:w-0 opacity-0" // Completely collapsed
            : isMessageExpanded
            ? "w-full lg:w-3/5 opacity-100" // Expanded width
            : "w-full lg:w-2/5 opacity-100" // Normal width
        )}>
          {/* Original Message */}
          <div className="flex-shrink-0">
            <Card className="bg-white border-l-4 border-l-blue-500 mx-6 mt-6">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={message.sender?.avatar} />
                    <AvatarFallback>
                      {message.sender?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <SourceIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">
                        {message.sender?.company || message.sender?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(message.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 mb-1">{message.subject}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                        title={isMessageExpanded ? "Collapse message to access AI assistant" : "Expand message for full view"}
                      >
                        {isMessageExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {message.project && (
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Building className="h-3 w-3" />
                        <span>{message.project.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              {isMessageExpanded && (
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.dueDate && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-2 text-orange-800">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          Response needed by {new Date(message.dueDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Collapse button when expanded */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMessageExpanded(false)}
                      className="h-8 text-xs text-gray-600 hover:text-blue-700 px-0"
                    >
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Collapse message
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
            
            {/* Message Preview when collapsed */}
            {!isMessageExpanded && (
              <div className="mx-6 mt-2 mb-4">
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {message.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMessageExpanded(true)}
                      className="h-6 text-xs text-blue-600 hover:text-blue-800 p-0"
                    >
                      Read full message →
                    </Button>
                    <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                      💡 Collapsed for AI access
                    </div>
                  </div>
                </div>
                {message.dueDate && (
                  <div className="mt-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-2 text-orange-800">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium text-xs">
                        Response needed by {new Date(message.dueDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conditional Content Based on Message State */}
          {!isMessageExpanded && message.priority === 'urgent' && message.sender?.company?.includes('British Gas Commercial') ? (
            // Show AI Assistant when message is collapsed
            <>
              <Separator />
              <div className="flex-1 overflow-hidden min-h-0">
                <div className="p-4 bg-gray-50 border-b flex-shrink-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-900">AI Analysis Active</span>
                  </div>
                  <p className="text-xs text-gray-600">Processing project impact analysis...</p>
                </div>
                <div className="flex-1 min-h-0">
                  <MiniChatRAG message={message} className="h-full mini-chat-rag" />
                </div>
              </div>
            </>
          ) : isMessageExpanded ? (
            // Show message expanded state with option to collapse
            <div className="flex-1 overflow-hidden">
              <div className="p-6 text-center border-t bg-blue-50">
                <p className="text-sm text-blue-700 mb-3">
                  💡 Collapse the message above to access AI analysis and response suggestions
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMessageExpanded(false)}
                  className="border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show AI Assistant
                </Button>
              </div>
            </div>
          ) : (
            // Default AI assistant for other messages
            <>
              <Separator />
              <div className="flex-1 overflow-hidden min-h-0">
                <MiniChatRAG message={message} className="h-full mini-chat-rag" />
              </div>
            </>
          )}
        </div>

        {/* Right Panel - AI Chat Interface */}
        <div className={cn(
          "flex flex-col bg-white transition-all duration-300",
          isLeftPanelCollapsed
            ? "w-full flex-1" // Take full width when left panel is collapsed
            : isMessageExpanded
            ? "flex-1" // Take remaining space when message is expanded
            : "flex-1 lg:flex-[3]" // Take more space when message is collapsed
        )}>
          {/* AI Chat Interface */}
          <div className="flex-1 min-h-0">
            <MiniChatRAG message={message} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  )
}