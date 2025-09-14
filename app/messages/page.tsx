"use client"

import React, { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  Zap,
  Eye,
  CheckCircle,
  Mail,
  MessageCircle,
  Phone,
  Smartphone,
  Settings,
  RefreshCw,
  Filter,
  Users,
  Building,
  Wrench,
  Clock,
  Search,
  Menu,
  X,
  Send,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Message,
  MessageStats,
  Project,
  Contact,
  ContactCategory,
  LayoutState,
  GmailMessageCardProps,
  MessageCardProps,
  AIFirstInterfaceProps
} from "@/lib/types/messages"
import { MessageTabs } from "@/components/message-tabs"
import { MessageReplyView } from "@/components/message-reply-view"
import { MiniChatRAG } from "@/components/mini-chat-rag"
import { useSidebar } from "@/contexts/sidebar-context"

export default function MessagesPage() {
  const { setCollapsed: setSidebarCollapsed, autoCollapseOnMessage } = useSidebar()
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [activeTab, setActiveTab] = useState<ContactCategory | null>('client')
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<MessageStats | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showReplyView, setShowReplyView] = useState(false)
  const [replyMessage, setReplyMessage] = useState<Message | null>(null)

  // New adaptive layout state system
  const [layoutState, setLayoutState] = useState<LayoutState>('browse')
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null)
  const [isMessagePanelCollapsed, setIsMessagePanelCollapsed] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting data fetch...')
        setLoading(true)
        
        // Fetch messages with stats
        console.log('Fetching messages...')
        const messagesResponse = await fetch('/api/messages?stats=true')
        console.log('Messages response status:', messagesResponse.status)
        const messagesData = await messagesResponse.json()
        console.log('Messages data:', messagesData)
        
        // Fetch projects
        console.log('Fetching projects...')
        const projectsResponse = await fetch('/api/projects')
        console.log('Projects response status:', projectsResponse.status)
        const projectsData = await projectsResponse.json()
        console.log('Projects data:', projectsData)
        
        // Fetch contacts
        console.log('Fetching contacts...')
        const contactsResponse = await fetch('/api/contacts')
        console.log('Contacts response status:', contactsResponse.status)
        const contactsData = await contactsResponse.json()
        console.log('Contacts data:', contactsData)
        
        console.log('Setting state...')
        setMessages(messagesData.messages || [])
        setStats(messagesData.stats || null)
        setProjects(projectsData.projects || [])
        setContacts(contactsData.contacts || [])
        console.log('Data fetch completed successfully')
      } catch (error) {
        console.error('Error fetching data:', error)
        // Set empty arrays to prevent infinite loading
        setMessages([])
        setStats(null)
        setProjects([])
        setContacts([])
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    fetchData()

    // Failsafe: Force loading to false after 10 seconds
    const timeout = setTimeout(() => {
      console.warn('Loading timeout reached, forcing loading to false')
      setLoading(false)
    }, 10000)

    return () => clearTimeout(timeout)
  }, [])

  // Handle URL parameters for message selection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const messageId = urlParams.get('messageId')
      const openAI = urlParams.get('openAI')
      const autoQuery = urlParams.get('autoQuery')
      
      if (messageId && messages.length > 0) {
        const targetMessage = messages.find(m => m.id === messageId)
        if (targetMessage) {
          setSelectedMessage(targetMessage)
          setActiveTab(targetMessage.category)
          if (autoCollapseOnMessage) {
            setSidebarCollapsed(true)
          }
          if (openAI === 'true') {
            // Automatically select message and open AI interface
            setTimeout(() => {
              setReplyMessage(targetMessage)
              if (autoCollapseOnMessage) {
                setSidebarCollapsed(true) // Resize sidebar
              }
              setLayoutState('selected') // Use the new AI interface

              // Auto-trigger specific AI query if specified
              if (autoQuery === 'gas-delays-impact') {
                // Dispatch the query to the AI interface
                setTimeout(() => {
                  const queryEvent = new CustomEvent('auto-trigger-query', {
                    detail: {
                      query: "Give me a rundown of the gas supply delays to the Marchmont Historic project"
                    }
                  })
                  window.dispatchEvent(queryEvent)
                }, 1500) // Give time for the interface to load
              }
            }, 500) // Small delay to ensure page is loaded
          }
        }
      }
    }
  }, [messages])

  // Layout state management functions
  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message)
    setReplyMessage(message)
    if (autoCollapseOnMessage) {
      setSidebarCollapsed(true)
    }
    setLayoutState('selected')
    setShowReplyView(true)
  }

  const handleBackToBrowse = () => {
    setSelectedMessage(null)
    setReplyMessage(null)
    if (autoCollapseOnMessage) {
      setSidebarCollapsed(false)
    }
    setLayoutState('browse')
    setShowReplyView(false)
    setShowEmailPreview(false)
    setGeneratedEmail(null)
  }

  const handleManualOverride = () => {
    setLayoutState('manual-override')
  }

  const handleBackToAI = () => {
    setLayoutState('selected')
  }

  // Auto-show email preview when email is generated
  useEffect(() => {
    if (generatedEmail && layoutState === 'selected') {
      setShowEmailPreview(true)
      setLayoutState('preview')
    }
  }, [generatedEmail, layoutState])


  // Calculate tab counts
  const getTabCounts = (): Record<ContactCategory, number> => {
    if (!messages.length) {
      return { client: 0, team: 0, external: 0, system: 0 }
    }
    
    return {
      client: messages.filter(m => m.category === 'client').length,
      team: messages.filter(m => m.category === 'team').length,
      external: messages.filter(m => m.category === 'external').length,
      system: messages.filter(m => m.category === 'system').length,
    }
  }
  
  const tabCounts = getTabCounts()

  // Filter messages based on active tab and search
  const filteredMessages = React.useMemo(() => {
    console.log('Filtering messages, total messages:', messages.length)
    try {
      if (!Array.isArray(messages)) {
        console.error('Messages is not an array:', messages)
        return []
      }

      return messages.filter(message => {
        if (!message) return false
        
        // Tab filter - if activeTab is null, show all categories
        if (activeTab !== null && message.category !== activeTab) return false
        
        // Search filter
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase()
          const matchesSearch = 
            (message.subject || '').toLowerCase().includes(searchLower) ||
            (message.content || '').toLowerCase().includes(searchLower) ||
            (message.sender?.name || '').toLowerCase().includes(searchLower) ||
            (message.sender?.company || '').toLowerCase().includes(searchLower)
          
          if (!matchesSearch) return false
        }
        
        return true
      }).sort((a, b) => {
        // Sort by priority first (urgent > action > review), then by timestamp
        const priorityOrder = { urgent: 3, action: 2, review: 1, complete: 0 }
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority
        }
        
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
    } catch (error) {
      console.error('Error filtering messages:', error)
      return []
    }
  }, [messages, searchQuery, activeTab])

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getSourceIcon = (source: string) => {
    const iconMap = {
      email: Mail,
      whatsapp: MessageCircle,
      sms: Smartphone,
      call: Phone,
      system: Settings
    }
    return iconMap[source as keyof typeof iconMap] || MessageSquare
  }

  const getPriorityColor = (priority: string) => {
    const colorMap = {
      urgent: 'text-red-600 bg-red-50 border-red-200',
      action: 'text-orange-600 bg-orange-50 border-orange-200',
      review: 'text-blue-600 bg-blue-50 border-blue-200',
      complete: 'text-green-600 bg-green-50 border-green-200'
    }
    return colorMap[priority as keyof typeof colorMap] || 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const handleReply = (message: Message) => {
    // Open the professional split-screen reply view
    setReplyMessage(message)
    setShowReplyView(true)
  }
  
  const handleCloseReply = () => {
    setShowReplyView(false)
    setReplyMessage(null)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row h-full">

        {/* Collapsible Message Sidebar */}
        <div className={cn(
          "transition-all duration-300 border-r lg:border-b-0 border-b bg-gray-50 flex-shrink-0",
          layoutState === 'selected'
            ? "h-0 lg:h-full lg:w-72 w-full overflow-hidden lg:overflow-visible"
            : "h-60 lg:h-full lg:w-96 w-full"
        )}>
          
          {/* Filter Tags */}
          <div className="p-4 border-b bg-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Button
                variant={activeTab === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(null)}
                className="h-7 text-xs"
              >
                All Messages
              </Button>
              {(['client', 'team', 'external'] as ContactCategory[]).map((category) => (
                <Button
                  key={category}
                  variant={activeTab === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(category)}
                  className="h-7 text-xs"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({tabCounts[category]})
                </Button>
              ))}
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>

          {/* Gmail-style Message List */}
          <ScrollArea className="flex-1">
            <div>
              {filteredMessages.length === 0 && !loading && (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'No messages found' : 'No messages yet'}
                  </p>
                </div>
              )}
              
              {filteredMessages.map((message) => (
                <GmailMessageCard
                  key={message.id}
                  message={message}
                  isSelected={selectedMessage?.id === message.id}
                  onClick={() => handleMessageSelect(message)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main AI Chat Area */}
        <div className="flex-1 flex flex-col h-full lg:h-auto relative">

          {layoutState === 'browse' ? (
            /* Browse State - No message selected */
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold text-muted-foreground">AI Assistant Ready</h3>
                <p className="text-muted-foreground">Select a message to start AI-powered analysis and response</p>
              </div>
            </div>
          ) : layoutState === 'manual-override' ? (
            /* Manual Override State - Traditional email composition */
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Compose Reply</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToAI}
                >
                  ← Back to AI Assistant
                </Button>
              </div>
              {/* Traditional compose interface would go here */}
              <div className="flex-1 p-6">
                <p className="text-muted-foreground">Traditional email composition interface</p>
              </div>
            </div>
          ) : (
            /* Use MiniChatRAG for the selected message interface too */
            <div className="flex-1 flex flex-col lg:flex-row">
              {/* Message Content Panel */}
              <div className={cn(
                "border-b lg:border-b-0 lg:border-r bg-white transition-all duration-300 ease-in-out",
                isMessagePanelCollapsed ? "w-0 lg:w-8" : "w-full lg:w-1/2"
              )}>
                {!isMessagePanelCollapsed && (
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Original Message
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackToBrowse}
                          className="text-sm"
                        >
                          ← Messages
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMessagePanelCollapsed(true)}
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Collapsed state button */}
                {isMessagePanelCollapsed && (
                  <div className="hidden lg:flex flex-col items-center py-4 border-r">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMessagePanelCollapsed(false)}
                      className="h-8 w-8 p-0 mb-2 hover:bg-gray-100 writing-mode-vertical"
                      title="Show original message"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap origin-center">
                      Message
                    </div>
                  </div>
                )}

                {!isMessagePanelCollapsed && (
                  <div className="p-4 overflow-y-auto h-64 lg:h-auto lg:flex-1">
                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">{replyMessage?.sender?.company || replyMessage?.sender?.name}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(replyMessage?.timestamp || Date.now()).toLocaleString()}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3">{replyMessage?.subject}</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {replyMessage?.content || "No message content available"}
                      </p>
                    </div>

                    {/* Message Metadata */}
                    {replyMessage?.project && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 text-blue-800">
                          <Building className="h-4 w-4" />
                          <span className="font-medium text-sm">Related Project: {replyMessage.project.name}</span>
                        </div>
                      </div>
                    )}

                    {replyMessage?.dueDate && (
                      <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-2 text-orange-800">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium text-sm">
                            Response due: {new Date(replyMessage.dueDate).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* AI Chat Interface */}
              <div className={cn(
                "flex flex-col bg-white transition-all duration-300 ease-in-out",
                isMessagePanelCollapsed ? "w-full" : "w-full lg:w-1/2"
              )}>
                <MiniChatRAG message={replyMessage} className="h-full" />
              </div>
            </div>
          )}
        </div>
      </div>

    </MainLayout>
  )
}

// Gmail-style Message Card Component
function GmailMessageCard({ message, isSelected, onClick }: GmailMessageCardProps) {
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

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'action': return 'bg-orange-500'
      case 'review': return 'bg-blue-500'
      default: return 'bg-gray-300'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInMs = now.getTime() - messageTime.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return messageTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const formatFullTimestamp = (timestamp: string) => {
    const messageTime = new Date(timestamp)
    return messageTime.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const SourceIcon = getSourceIcon(message.source)

  return (
    <div
      className={cn(
        "px-4 py-3 hover:bg-gray-100 cursor-pointer transition-all duration-200 border-l-3 hover:scale-[1.01]",
        isSelected ? "bg-blue-50 border-l-blue-500 scale-[1.01]" : "border-l-transparent"
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className={cn("w-2 h-2 rounded-full mt-2", getPriorityIndicator(message.priority))} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <SourceIcon className="h-3 w-3 text-gray-500" />
              <span className="text-sm font-medium text-gray-900 truncate">
                {message.sender?.company || message.sender?.name}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-medium text-gray-700">{formatTimeAgo(message.timestamp)}</span>
              <span className="text-xs text-gray-500" title={formatFullTimestamp(message.timestamp)}>
                {formatFullTimestamp(message.timestamp).split(' ')[0]} {formatFullTimestamp(message.timestamp).split(' ')[1]}
              </span>
            </div>
          </div>
          
          <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
            {message.subject}
          </h4>
          
          <p className="text-xs text-gray-600 line-clamp-2">
            {message.content}
          </p>
          
          {message.project && (
            <div className="flex items-center space-x-1 mt-2">
              <Building className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{message.project.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// AI-First Interface Component
function AIFirstInterface({
  message,
  layoutState,
  onLayoutStateChange,
  onManualOverride,
  onBackToBrowse,
  showEmailPreview,
  generatedEmail,
  onEmailGenerated,
  onCloseEmailPreview
}: AIFirstInterfaceProps) {
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponses, setAiResponses] = useState<Array<{id: string, query: string, response: string, timestamp: string}>>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle auto-trigger query from URL parameter
  useEffect(() => {
    const handleAutoTrigger = (event: CustomEvent) => {
      const { query } = event.detail
      if (query) {
        setAiQuery(query)
        handleAIQuery(query)
      }
    }

    window.addEventListener('auto-trigger-query', handleAutoTrigger as EventListener)
    return () => window.removeEventListener('auto-trigger-query', handleAutoTrigger as EventListener)
  }, [])

  const handleAIQuery = (query: string) => {
    setIsProcessing(true)

    // Simulate AI processing delay
    setTimeout(() => {
      let response = ""

      // Check if this is the Marchmont demo query
      if (query.toLowerCase().includes('marchmont') && query.toLowerCase().includes('gas supply')) {
        response = generateMarchmontResponse(message)
      } else {
        response = generateGenericResponse(query, message)
      }

      const newResponse = {
        id: `ai-${Date.now()}`,
        query,
        response,
        timestamp: new Date().toISOString()
      }

      setAiResponses(prev => [...prev, newResponse])
      setIsProcessing(false)
      setAiQuery('')
    }, 1500)
  }

  const generateMarchmontResponse = (message: any) => {
    return `## 📋 Gas Supply Delay Summary

**Key Issues:**
• Permit renewal overdue by 6 days (expired 6 Jan 2024)
• British Gas Commercial processing delays
• Affects electrical, plumbing, and HVAC installation

**Project Impact Analysis:**
Timeline: 15 Jan - 30 Apr 2024 [Progress: 84%]
❌ **+5 days** due to gas supplier delay
🎯 **New completion: 5 May 2024**

## ⏰ Timeline Scenarios

**🟢 Best case (response <48hrs):** 30 Apr ✅
**🟡 Likely case (response 3-5 days):** 2 May ⚠️
**🔴 Worst case (response >5 days):** 7 May ❌

## 🎯 Recommended Actions

Choose an action to proceed:`
  }

  const generateGenericResponse = (query: string, message: any) => {
    return `I understand you're asking about "${query}".

Based on the message from ${message?.sender?.company || message?.sender?.name}, here's what I can help with:

• Message analysis and key points
• Timeline impact assessment
• Response recommendations
• Stakeholder communication options

Would you like me to focus on any specific aspect?`
  }

  if (!message) return null

  return (
    <div className="flex flex-col h-full">
      {/* AI Chat Header */}
      <div className="p-4 pl-16 md:pl-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToBrowse}
          >
            ← Messages
          </Button>
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            94% Confident
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onManualOverride}
        >
          Compose Reply
        </Button>
      </div>

      {/* Email Preview Panel - Slide down when email is generated */}
      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-out border-b",
        showEmailPreview && generatedEmail
          ? "max-h-96 opacity-100 translate-y-0"
          : "max-h-0 opacity-0 -translate-y-4"
      )}>
        <div className="bg-yellow-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium flex items-center">
              <div className={cn(
                "w-2 h-2 rounded-full mr-2 transition-colors duration-300",
                showEmailPreview ? "bg-green-500 animate-pulse" : "bg-gray-400"
              )} />
              Generated Email Preview
            </h4>
            <div className="space-x-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 transition-all duration-200">
                Approve & Send
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:bg-yellow-100"
              >
                Refine Tone
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseEmailPreview}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-sm border shadow-sm">
            <pre className="whitespace-pre-wrap font-sans">{generatedEmail || ""}</pre>
          </div>
        </div>
      </div>

      {/* Message Content & AI Chat Split View */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Message Content Panel */}
        <div className={cn(
          "border-b lg:border-b-0 lg:border-r bg-white transition-all duration-300 ease-in-out",
          isMessagePanelCollapsed ? "w-0 lg:w-8" : "w-full lg:w-1/2"
        )}>
          {!isMessagePanelCollapsed && (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Original Message
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMessagePanelCollapsed(true)}
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Collapsed state button */}
          {isMessagePanelCollapsed && (
            <div className="hidden lg:flex flex-col items-center py-4 border-r">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMessagePanelCollapsed(false)}
                className="h-8 w-8 p-0 mb-2 hover:bg-gray-100 writing-mode-vertical"
                title="Show original message"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap origin-center">
                Message
              </div>
            </div>
          )}

          {!isMessagePanelCollapsed && (
            <div className="p-4 overflow-y-auto h-64 lg:h-auto lg:flex-1">
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">{message?.sender?.company || message?.sender?.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(message?.timestamp || Date.now()).toLocaleString()}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">{message?.subject}</h4>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {message?.content || "No message content available"}
              </p>
            </div>

            {/* Message Metadata */}
            {message?.project && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Building className="h-4 w-4" />
                  <span className="font-medium text-sm">Related Project: {message.project.name}</span>
                </div>
              </div>
            )}

            {message?.dueDate && (
              <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2 text-orange-800">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium text-sm">
                    Response due: {new Date(message.dueDate).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            </div>
          )}
        </div>

        {/* AI Chat Interface */}
        <div className={cn(
          "flex flex-col bg-white transition-all duration-300 ease-in-out",
          isMessagePanelCollapsed ? "w-full" : "w-full lg:w-1/2"
        )}>
          {/* Use MiniChatRAG component with professional features */}
          <MiniChatRAG message={message} className="h-full" />
        </div>
      </div>
    </div>
  )
}

// MessageCard component for individual message display
function MessageCard({ message, onReply, priority }: MessageCardProps) {
  const getSourceIcon = (source: string) => {
    const iconMap = {
      email: Mail,
      whatsapp: MessageCircle,
      sms: Smartphone,
      call: Phone,
      system: Settings
    }
    return iconMap[source as keyof typeof iconMap] || MessageSquare
  }

  const getSourceEmoji = (source: string) => {
    const emojiMap = {
      email: '📧',
      whatsapp: '💬', 
      sms: '📱',
      call: '☎️',
      phone: '☎️',
      system: '⚙️',
      mail: '📧',
      message: '💬',
      text: '📱'
    }
    
    return emojiMap[source?.toLowerCase() as keyof typeof emojiMap] || '💼'
  }

  const getBorderColor = (priority: string) => {
    const colorMap = {
      urgent: 'border-l-red-500',
      action: 'border-l-orange-500',
      review: 'border-l-blue-500'
    }
    return colorMap[priority as keyof typeof colorMap] || 'border-l-gray-300'
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const SourceIcon = getSourceIcon(message.source)

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 hover:bg-muted/20 group",
        getBorderColor(priority)
      )}
      onClick={() => onReply(message)}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
            <AvatarFallback className="text-sm sm:text-lg bg-gray-100 flex items-center justify-center">
              {getSourceEmoji(message.source)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
              <div className="flex items-center space-x-2">
                <SourceIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span className="font-medium text-xs sm:text-sm truncate">
                  {message.sender?.company || message.sender?.name}
                  {message.project && (
                    <span className="hidden sm:inline"> - {message.project.name}</span>
                  )}
                </span>
              </div>
              <span className="text-xs text-muted-foreground mt-1 sm:mt-0">
                {formatTimeAgo(message.timestamp)}
              </span>
            </div>
            <h4 className="font-medium text-sm mb-1">{message.subject}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              "{message.content.substring(0, 120)}..."
            </p>
            
            {/* Context-specific badges */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {priority === 'urgent' && (
                <>
                  <Badge variant="destructive" className="text-xs">
                    <span className="hidden sm:inline">Immediate attention required</span>
                    <span className="sm:hidden">Urgent</span>
                  </Badge>
                  {message.dueDate && (
                    <Badge variant="outline" className="text-xs">
                      <span className="hidden sm:inline">Due: {new Date(message.dueDate).toLocaleTimeString()}</span>
                      <span className="sm:hidden">Due {new Date(message.dueDate).toLocaleTimeString().slice(0, 5)}</span>
                    </Badge>
                  )}
                </>
              )}
              {priority === 'action' && (
                <>
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                    Action needed
                  </Badge>
                  {message.project && (
                    <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                      {message.project.name}
                    </Badge>
                  )}
                </>
              )}
              {priority === 'review' && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                  For review
                </Badge>
              )}

              {/* Click to reply indicator */}
              <div className="ml-auto hidden sm:block">
                <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to reply
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}