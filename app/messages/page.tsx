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
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Message, MessageStats, Project, Contact, ContactCategory } from "@/lib/types/messages"
import { MessageTabs } from "@/components/message-tabs"
import { MessageReplyView } from "@/components/message-reply-view"

export default function MessagesPage() {
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
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
      <div className="flex flex-col h-full">

        {/* Tab Navigation */}
        <MessageTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabCounts={tabCounts}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search Header */}
          <div className="border-b p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={activeTab ? `Search ${activeTab} messages...` : "Search all messages..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{filteredMessages.length} messages</span>
                {stats && (
                  <>
                    <span>•</span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                      {filteredMessages.filter(m => m.priority === 'urgent').length} urgent
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-1" />
                      {filteredMessages.filter(m => m.responseRequired).length} need response
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Messages List */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {filteredMessages.length === 0 && !loading && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchQuery ? 'No messages match your search' : activeTab ? `No ${activeTab} messages yet` : 'No messages yet'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search terms' : activeTab ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} messages will appear here when received` : 'Messages will appear here when received'}
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery('')}
                      className="mt-4"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}

              {/* Messages grouped by priority for better organization */}
              {filteredMessages.length > 0 && (
                <div className="space-y-6">
                  {/* Urgent Messages */}
                  {filteredMessages.filter(m => m.priority === 'urgent').length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-red-600 font-medium">
                        <AlertCircle className="h-4 w-4" />
                        <span>URGENT - NEEDS IMMEDIATE ATTENTION</span>
                        <Badge variant="destructive" className="text-xs">
                          {filteredMessages.filter(m => m.priority === 'urgent').length}
                        </Badge>
                      </div>
                      {filteredMessages.filter(m => m.priority === 'urgent').map((message) => (
                        <MessageCard 
                          key={message.id} 
                          message={message} 
                          onReply={handleReply}
                          priority="urgent"
                        />
                      ))}
                    </div>
                  )}

                  {/* Action Required Messages */}
                  {filteredMessages.filter(m => m.priority === 'action').length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-orange-600 font-medium">
                        <Zap className="h-4 w-4" />
                        <span>ACTION REQUIRED</span>
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                          {filteredMessages.filter(m => m.priority === 'action').length}
                        </Badge>
                      </div>
                      {filteredMessages.filter(m => m.priority === 'action').map((message) => (
                        <MessageCard 
                          key={message.id} 
                          message={message} 
                          onReply={handleReply}
                          priority="action"
                        />
                      ))}
                    </div>
                  )}

                  {/* Review Messages */}
                  {filteredMessages.filter(m => m.priority === 'review').length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-blue-600 font-medium">
                        <Eye className="h-4 w-4" />
                        <span>FOR REVIEW</span>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {filteredMessages.filter(m => m.priority === 'review').length}
                        </Badge>
                      </div>
                      {filteredMessages.filter(m => m.priority === 'review').map((message) => (
                        <MessageCard 
                          key={message.id} 
                          message={message} 
                          onReply={handleReply}
                          priority="review"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Professional Message Reply View */}
        {showReplyView && replyMessage && (
          <MessageReplyView
            message={replyMessage}
            isVisible={showReplyView}
            onClose={handleCloseReply}
          />
        )}
      </div>
    </MainLayout>
  )
}

// MessageCard component for individual message display
interface MessageCardProps {
  message: Message
  onReply: (message: Message) => void
  priority: 'urgent' | 'action' | 'review'
}

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
        "cursor-pointer transition-all hover:shadow-md border-l-4 hover:bg-muted/20 group",
        getBorderColor(priority)
      )}
      onClick={() => onReply(message)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-lg bg-gray-100 flex items-center justify-center">
              {getSourceEmoji(message.source)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <SourceIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">
                {message.sender?.company || message.sender?.name}
                {message.project && ` - ${message.project.name}`}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(message.timestamp)}
              </span>
            </div>
            <h4 className="font-medium text-sm mb-1">{message.subject}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              "{message.content.substring(0, 120)}..."
            </p>
            
            {/* Context-specific badges */}
            <div className="flex items-center space-x-2">
              {priority === 'urgent' && (
                <>
                  <Badge variant="destructive" className="text-xs">
                    Immediate attention required
                  </Badge>
                  {message.dueDate && (
                    <Badge variant="outline" className="text-xs">
                      Due: {new Date(message.dueDate).toLocaleTimeString()}
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
                    <Badge variant="outline" className="text-xs">
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
              <div className="ml-auto">
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