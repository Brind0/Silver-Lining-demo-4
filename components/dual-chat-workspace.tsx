"use client"

import { useState, useEffect, useCallback } from "react"
// Removed Dialog import - now using full-screen overlay
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  X, 
  MessageSquare,
  Bot,
  Send,
  Mic,
  MicOff,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  User,
  Building,
  FileText,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Message } from "@/lib/types/messages"
import { OfficeAgentService, OfficeAgentContext, AgentMessage } from "@/lib/services/office-agent-service"

interface DualChatWorkspaceProps {
  isOpen: boolean
  onClose: () => void
  message: Message | null
}

// Using AgentMessage from the service

interface WorkspaceState {
  isContextCollapsed: boolean
  leftPanelWidth: number
  isVoiceEnabled: boolean
  agentChatHistory: AgentMessage[]
  responseDrafts: AgentMessage[]
}

export function DualChatWorkspace({ isOpen, onClose, message }: DualChatWorkspaceProps) {
  const officeAgent = new OfficeAgentService()
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>({
    isContextCollapsed: false,
    leftPanelWidth: 45, // percentage
    isVoiceEnabled: false,
    agentChatHistory: [],
    responseDrafts: []
  })

  const [agentInput, setAgentInput] = useState('')
  const [responseInput, setResponseInput] = useState('')
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(45)
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)
  const [templates, setTemplates] = useState<Array<{
    id: string
    name: string
    content: string
    category: string
  }>>([])

  // Mock templates for the demo
  const defaultTemplates = [
    {
      id: 'urgent-ack',
      name: 'Urgent Acknowledgment',
      content: `Thank you for bringing this to my immediate attention. I understand the urgency of this matter and I'm taking action right away.\n\nI'll provide you with an update within the next 2 hours.\n\nBest regards,\nEmily Johnson`,
      category: 'urgent'
    },
    {
      id: 'delay-response',
      name: 'Delay Solution',
      content: `I understand there's been a delay with the delivery. Let me address this immediately.\n\nI'm exploring alternative options to minimize the impact on your timeline. I'll have concrete solutions for you by [TIME].\n\nThank you for your patience.\n\nBest regards,\nEmily Johnson`,
      category: 'problem_solving'
    },
    {
      id: 'client-update',
      name: 'Client Status Update',
      content: `Thank you for your message. I wanted to provide you with a quick update on the progress.\n\nCurrent status:\n• [KEY UPDATE 1]\n• [KEY UPDATE 2]\n• [NEXT STEPS]\n\nI'll continue to keep you informed of any developments.\n\nBest regards,\nEmily Johnson`,
      category: 'updates'
    },
    {
      id: 'team-coordination',
      name: 'Team Coordination',
      content: `Hi [NAME],\n\nThanks for flagging this. Let's coordinate on the next steps:\n\n1. [ACTION ITEM 1]\n2. [ACTION ITEM 2]\n3. [TIMELINE]\n\nLet me know if you need any resources or support from my end.\n\nEmily`,
      category: 'team'
    }
  ]

  // Initialize agent conversation with context when opening
  useEffect(() => {
    if (isOpen && message && workspaceState.agentChatHistory.length === 0) {
      initializeAgentContext()
    }
  }, [isOpen, message])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      // Cmd/Ctrl + 1: Focus office agent input
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault()
        const agentInput = document.querySelector('[data-agent-input]') as HTMLInputElement
        agentInput?.focus()
      }

      // Cmd/Ctrl + 2: Focus response composer
      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault()
        const responseInput = document.querySelector('[data-response-input]') as HTMLTextAreaElement
        responseInput?.focus()
      }

      // Cmd/Ctrl + Enter: Send response
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (currentResponse.trim()) {
          handleSendResponse()
        }
      }

      // Escape: Close workspace
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }

      // Cmd/Ctrl + \: Toggle context panel
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault()
        toggleContextPanel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentResponse, onClose])

  // Enhanced drag functionality
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector('[data-workspace-container]')
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const containerWidth = containerRect.width
      const contextPanelWidth = workspaceState.isContextCollapsed ? 0 : 320 // 20rem = 320px
      const availableWidth = containerWidth - contextPanelWidth

      const currentX = e.clientX - containerRect.left
      const deltaX = currentX - dragStartX
      const newWidthPercent = startWidth + (deltaX / availableWidth * 100)
      
      // Constrain between 25% and 75%
      const clampedWidth = Math.max(25, Math.min(75, newWidthPercent))
      
      setWorkspaceState(prev => ({
        ...prev,
        leftPanelWidth: clampedWidth
      }))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragStartX, startWidth, workspaceState.isContextCollapsed])

  // Persist workspace state to localStorage
  useEffect(() => {
    if (isOpen && message) {
      const stateKey = `workspace-state-${message.id}`
      const savedState = localStorage.getItem(stateKey)
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState)
          setWorkspaceState(prev => ({
            ...prev,
            leftPanelWidth: parsed.leftPanelWidth || 45,
            isContextCollapsed: parsed.isContextCollapsed || false
          }))
        } catch (e) {
          console.warn('Failed to load workspace state:', e)
        }
      }
    }
  }, [isOpen, message])

  // Save workspace state
  useEffect(() => {
    if (isOpen && message) {
      const stateKey = `workspace-state-${message.id}`
      const stateToSave = {
        leftPanelWidth: workspaceState.leftPanelWidth,
        isContextCollapsed: workspaceState.isContextCollapsed,
        lastUpdated: Date.now()
      }
      localStorage.setItem(stateKey, JSON.stringify(stateToSave))
    }
  }, [workspaceState.leftPanelWidth, workspaceState.isContextCollapsed, isOpen, message])

  // Close template dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!showTemplateDropdown) return
      
      const target = e.target as Element
      if (!target.closest('[data-template-dropdown]')) {
        setShowTemplateDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showTemplateDropdown])

  const initializeAgentContext = useCallback(() => {
    if (!message) return

    const contextMessage: AgentMessage = {
      id: `context-${Date.now()}`,
      type: 'system',
      content: `New message requires attention: "${message.subject}" from ${message.sender?.company || message.sender?.name}`,
      timestamp: new Date().toISOString()
    }

    const welcomeMessage: AgentMessage = {
      id: `welcome-${Date.now()}`,
      type: 'agent',
      content: `I've analyzed the message from ${message.sender?.company || message.sender?.name}. Here's what I found:\n\n• **Priority**: ${message.priority.toUpperCase()}\n• **Source**: ${message.source}\n• **Response due**: ${message.dueDate ? new Date(message.dueDate).toLocaleString() : 'No deadline set'}\n\nWhat would you like to know about this situation?`,
      timestamp: new Date().toISOString(),
      metadata: {
        confidence: 0.9,
        suggestedActions: ['Assess urgency', 'Review context', 'Plan response'],
        riskLevel: message.priority === 'urgent' ? 'high' : 'medium'
      }
    }

    setWorkspaceState(prev => ({
      ...prev,
      agentChatHistory: [contextMessage, welcomeMessage]
    }))
  }, [message])

  const handleAgentChat = async (input: string) => {
    if (!input.trim() || !message) return

    // Add user message
    const userMessage: AgentMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    setWorkspaceState(prev => ({
      ...prev,
      agentChatHistory: [...prev.agentChatHistory, userMessage]
    }))
    setAgentInput('')
    setIsAgentTyping(true)

    try {
      // Create context for the office agent
      const context: OfficeAgentContext = {
        message,
        conversationHistory: workspaceState.agentChatHistory,
        businessContext: {
          currentProjects: [], // In real app, fetch from API
          clientHistory: [], // In real app, fetch from API  
          timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening',
          workloadStatus: 'normal' // In real app, calculate based on current tasks
        }
      }

      // Get intelligent response from office agent service
      const agentResponse = await officeAgent.generateResponse(input, context)

      setWorkspaceState(prev => ({
        ...prev,
        agentChatHistory: [...prev.agentChatHistory, agentResponse.message]
      }))
    } catch (error) {
      console.error('Office agent error:', error)
      // Fallback response
      const fallbackResponse: AgentMessage = {
        id: `agent-error-${Date.now()}`,
        type: 'agent',
        content: "I'm sorry, I encountered an issue processing your request. Let me know if you'd like to try again or ask something else.",
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: 0.5
        }
      }
      
      setWorkspaceState(prev => ({
        ...prev,
        agentChatHistory: [...prev.agentChatHistory, fallbackResponse]
      }))
    } finally {
      setIsAgentTyping(false)
    }
  }

  // Initialize templates
  useEffect(() => {
    // In real app, fetch templates from API based on message context
    const contextualTemplates = defaultTemplates.filter(template => {
      if (message?.priority === 'urgent' && template.category === 'urgent') return true
      if (message?.category === 'team' && template.category === 'team') return true
      if (message?.content.toLowerCase().includes('delay') && template.category === 'problem_solving') return true
      return template.category === 'updates' // Always include updates
    })
    setTemplates(contextualTemplates)
  }, [message])

  const handleTemplateSelect = (template: typeof defaultTemplates[0]) => {
    const processedContent = template.content
      .replace(/\[NAME\]/g, message?.sender?.name?.split(' ')[0] || 'there')
      .replace(/\[TIME\]/g, new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    
    setCurrentResponse(processedContent)
    setShowTemplateDropdown(false)
  }

  const handleResponseInput = (input: string) => {
    setCurrentResponse(input)
    // Auto-save draft would trigger here
  }

  const handleSendResponse = async () => {
    if (!currentResponse.trim() || !message) return

    // Implementation for sending response (reuse from existing AI modal)
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: message.source,
          recipientId: message.senderId,
          content: currentResponse,
          subject: `Re: ${message.subject}`,
          originalMessageId: message.id,
          sentBy: 'Emily Johnson',
          priority: message.priority === 'urgent' ? 'high' : 'normal'
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log('Message sent successfully:', result.replyId)
        onClose()
      } else {
        console.error('Failed to send message:', result.error)
        alert(`Failed to send message: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const toggleContextPanel = () => {
    setWorkspaceState(prev => ({
      ...prev,
      isContextCollapsed: !prev.isContextCollapsed
    }))
  }

  // Workspace is now always full-screen

  if (!message || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
      {/* Full-screen overlay */}
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleContextPanel}
            className="p-1"
          >
            {workspaceState.isContextCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Reply Workspace</span>
            <Badge variant="secondary" className="text-xs">
              {message.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground">
            Context shown above • Your decision
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" data-workspace-container>
        {/* Simplified Message Reference - Only show when collapsed or as minimal reference */}
        {!workspaceState.isContextCollapsed && (
          <div className="w-72 bg-white border-r flex flex-col">
            {/* Minimal Message Reference */}
            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
              <h3 className="font-semibold text-sm mb-3 flex items-center text-blue-800">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Reference
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender?.avatar} />
                    <AvatarFallback>
                      {message.sender?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {message.sender?.company || message.sender?.name}
                      </span>
                      <Badge 
                        variant={message.priority === 'urgent' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {message.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {message.project?.name} • {new Date(message.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{message.subject}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Note about full context */}
            <div className="p-4 bg-blue-50 border-b text-center">
              <p className="text-xs text-blue-700">
                Full context is available at the top of the messages page
              </p>
            </div>
          </div>
        )}

          {/* Main Workspace - Split Panels */}
          <div className="flex-1 flex">
            {/* Left Panel - Office Agent Chat */}
            <div 
              className="flex flex-col bg-white border-r"
              style={{ width: `${workspaceState.leftPanelWidth}%` }}
            >
              {/* Agent Header */}
              <div className="p-4 border-b bg-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-sm">Office Agent</h3>
                      <p className="text-xs text-muted-foreground">AI Assistant for insights</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWorkspaceState(prev => ({ ...prev, isVoiceEnabled: !prev.isVoiceEnabled }))}
                    className={cn(
                      "p-2",
                      workspaceState.isVoiceEnabled && "bg-blue-100 text-blue-700"
                    )}
                  >
                    {workspaceState.isVoiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Agent Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {workspaceState.agentChatHistory.map((chatMessage) => (
                    <div
                      key={chatMessage.id}
                      className={cn(
                        "flex",
                        chatMessage.type === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] p-3 rounded-lg text-sm",
                          chatMessage.type === 'user' 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : chatMessage.type === 'agent'
                            ? "bg-gray-100 text-gray-900 rounded-bl-none"
                            : "bg-yellow-50 text-yellow-800 text-xs p-2 rounded"
                        )}
                      >
                        <div className="whitespace-pre-wrap">{chatMessage.content}</div>
                        {chatMessage.metadata?.confidence && (
                          <div className="mt-2 pt-2 border-t border-gray-200 text-xs opacity-70">
                            Confidence: {Math.round(chatMessage.metadata.confidence * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isAgentTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Agent Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    data-agent-input
                    value={agentInput}
                    onChange={(e) => setAgentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAgentChat(agentInput))}
                    placeholder="Ask the office agent... (⌘+1 to focus)"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => handleAgentChat(agentInput)}
                    disabled={!agentInput.trim() || isAgentTyping}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick Questions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {['What\'s the urgency?', 'Suggest tone', 'Show history', 'Risk assessment'].map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAgentChat(question)}
                      className="text-xs px-2 py-1 h-auto"
                      disabled={isAgentTyping}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Resizer */}
            <div 
              className={cn(
                "w-2 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors duration-150 relative group",
                isDragging && "bg-blue-500"
              )}
              onMouseDown={(e) => {
                e.preventDefault()
                const container = document.querySelector('[data-workspace-container]')
                if (!container) return

                const containerRect = container.getBoundingClientRect()
                setDragStartX(e.clientX - containerRect.left)
                setStartWidth(workspaceState.leftPanelWidth)
                setIsDragging(true)
              }}
            >
              {/* Visual indicator */}
              <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            </div>

            {/* Right Panel - Response Composer */}
            <div className="flex-1 flex flex-col bg-white">
              {/* Response Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-sm">Response Composer</h3>
                      <p className="text-xs text-muted-foreground">
                        Replying via {message.source === 'email' ? 'Email' : message.source === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Template Dropdown */}
                    <div className="relative" data-template-dropdown>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                        className="text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Templates
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                      
                      {showTemplateDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-72 bg-white border rounded-lg shadow-lg z-50">
                          <div className="p-2 border-b">
                            <span className="text-xs font-medium text-muted-foreground">Quick Response Templates</span>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {templates.map((template) => (
                              <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template)}
                                className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                              >
                                <div className="font-medium text-sm mb-1">{template.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                  {template.content.substring(0, 100)}...
                                </div>
                                <div className="mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {template.category}
                                  </Badge>
                                </div>
                              </button>
                            ))}
                          </div>
                          <div className="p-2 border-t">
                            <button
                              onClick={() => setShowTemplateDropdown(false)}
                              className="text-xs text-muted-foreground hover:text-gray-900 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {currentResponse.length} chars
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Response Composition Area */}
              <div className="flex-1 p-4">
                <textarea
                  data-response-input
                  value={currentResponse}
                  onChange={(e) => handleResponseInput(e.target.value)}
                  placeholder={`Type your ${message.source} response here... (⌘+2 to focus, ⌘+Enter to send)`}
                  className="w-full h-full resize-none border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Response Actions */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      Auto-saved
                    </span>
                    <span className="flex items-center">
                      <Building className="h-3 w-3 mr-1" />
                      {message.source.charAt(0).toUpperCase() + message.source.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSendResponse}
                      disabled={!currentResponse.trim()}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}