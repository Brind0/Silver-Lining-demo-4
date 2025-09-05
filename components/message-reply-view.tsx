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
  Mail,
  MessageCircle,
  Phone,
  Smartphone,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Message } from "@/lib/types/messages"
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
      "fixed inset-0 bg-white z-50 flex flex-col",
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
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Split Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Original Message + Business Insights */}
        <div className="w-2/5 border-r bg-gray-50 flex flex-col overflow-hidden">
          {/* Original Message */}
          <div className="p-6 flex-shrink-0">
            <Card className="bg-white border-l-4 border-l-blue-500">
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
                    <h3 className="font-semibold text-gray-900 mb-1">{message.subject}</h3>
                    {message.project && (
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Building className="h-3 w-3" />
                        <span>{message.project.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
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
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Mini Chat RAG System */}
          <div className="flex-1 overflow-hidden min-h-[400px]">
            <MiniChatRAG message={message} className="h-full" />
          </div>
        </div>

        {/* Right Panel - Reply Composer */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Compose Reply
            </h3>
            
            {/* Channel indicator */}
            <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
              <SourceIcon className="h-4 w-4" />
              <span>Replying via {message.source.charAt(0).toUpperCase() + message.source.slice(1)}</span>
            </div>

            {/* Subject line */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Input
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Message composer */}
          <div className="flex-1 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Reply
            </label>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your response here..."
              className="w-full h-full min-h-[300px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Save className="h-4 w-4" />
                <span>Auto-saved</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendReply}
                  disabled={!replyContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}