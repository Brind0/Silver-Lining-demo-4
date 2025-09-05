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
  MessageCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Message, Project } from "@/lib/types/messages"

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  citations?: string[]
  confidence?: number
}

interface MiniChatRAGProps {
  message: Message
  className?: string
}

const QUICK_QUESTIONS = [
  { icon: DollarSign, text: "Current budget status?", query: "What's the current budget status for this project?" },
  { icon: Calendar, text: "Next milestone?", query: "When is the next milestone or deadline for this project?" },
  { icon: Users, text: "Key contacts?", query: "Who are the key contacts for this project?" },
  { icon: Clock, text: "Timeline status?", query: "What's the current timeline status and any delays?" },
  { icon: TrendingUp, text: "Project risks?", query: "Are there any current risks or issues with this project?" },
  { icon: MessageCircle, text: "Similar issues?", query: "Have we had similar issues with this project or client before?" }
]

export function MiniChatRAG({ message, className }: MiniChatRAGProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight
        }
      }
    }
    
    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [chatHistory])

  const handleQuickQuestion = async (question: string) => {
    await handleSubmit(question)
  }

  const handleSubmit = async (questionText?: string) => {
    const question = questionText || inputValue.trim()
    if (!question || isLoading) return

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Add user message
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
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: result.response,
          timestamp: new Date().toISOString(),
          citations: result.citations,
          confidence: result.confidence
        }
        setChatHistory(prev => [...prev, assistantMessage])
      } else {
        // Handle error
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: 'assistant',
          content: "I'm sorry, I couldn't process your question at the moment. Please try again.",
          timestamp: new Date().toISOString()
        }
        setChatHistory(prev => [...prev, errorMessage])
      }
    } catch (error) {
      // Don't show error for aborted requests
      if (error.name === 'AbortError') {
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

  // Generate contextual suggestions based on message content
  const getContextualSuggestions = (): string[] => {
    const suggestions = []
    
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
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <h4 className="font-semibold text-gray-900 flex items-center text-sm">
          <Bot className="h-4 w-4 mr-2 text-blue-600" />
          Project Assistant
        </h4>
        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
          {message.project?.name || 'General'}
        </Badge>
      </div>

      {/* Quick Questions */}
      {chatHistory.length === 0 && (
        <div className="p-3 border-b bg-gray-50">
          <p className="text-xs text-gray-600 mb-2 font-medium">Quick questions:</p>
          <div className="grid grid-cols-2 gap-1 mb-2">
            {QUICK_QUESTIONS.slice(0, 4).map((q, index) => {
              const IconComponent = q.icon
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickQuestion(q.query)}
                  className="h-8 px-2 text-xs justify-start text-gray-700 hover:bg-white hover:text-blue-700 border border-transparent hover:border-blue-200"
                  disabled={isLoading}
                >
                  <IconComponent className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{q.text}</span>
                </Button>
              )
            })}
          </div>
          
          {/* Contextual Suggestions */}
          {getContextualSuggestions().length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Contextual for this message:</p>
              <div className="space-y-1">
                {getContextualSuggestions().slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={`contextual-${index}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickQuestion(suggestion)}
                    className="w-full h-7 px-2 text-xs justify-start text-blue-700 hover:bg-blue-50 border border-blue-200"
                    disabled={isLoading}
                  >
                    <MessageCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate text-left">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat History */}
      <ScrollArea className="flex-1 p-3 min-h-0" ref={scrollAreaRef}>
        <div className="space-y-3 pb-2">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start space-x-2",
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.type === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="h-3 w-3 text-blue-600" />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed",
                msg.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              )}>
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                
                {/* Citations and confidence for assistant messages */}
                {msg.type === 'assistant' && (msg.citations || msg.confidence) && (
                  <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                    {msg.confidence && (
                      <Badge variant="outline" className="text-xs h-5 px-1">
                        {Math.round(msg.confidence * 100)}% confident
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="h-5 w-5 p-0 text-gray-500 hover:text-gray-700"
                      disabled={copiedStates[msg.id]}
                    >
                      {copiedStates[msg.id] ? (
                        <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
              {msg.type === 'user' && (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="h-3 w-3 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-3 w-3 text-blue-600" />
              </div>
              <div className="bg-gray-100 text-gray-800 border border-gray-200 rounded-lg px-3 py-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex-shrink-0 p-3 border-t bg-white">
        <div className="flex items-center space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about this project..."
            className="flex-1 text-xs h-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Additional Quick Actions */}
        {chatHistory.length > 0 && (
          <div className="flex items-center justify-between mt-2 border-t border-gray-100 pt-2">
            <div className="flex items-center space-x-1">
              {QUICK_QUESTIONS.slice(0, 2).map((q, index) => {
                const IconComponent = q.icon
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickQuestion(q.query)}
                    className="h-6 px-2 text-xs text-gray-600 hover:text-blue-700"
                    disabled={isLoading}
                  >
                    <IconComponent className="h-3 w-3 mr-1" />
                    {q.text}
                  </Button>
                )
              })}
            </div>
            <p className="text-xs text-gray-500">{chatHistory.length} messages</p>
          </div>
        )}
      </div>
    </div>
  )
}