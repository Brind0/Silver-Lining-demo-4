import { Message, MessageStats, Project, Contact, MessageFilters, Reply, DeliveryStatus, MessageStatus } from '@/lib/types/messages'

// Mock database for messages functionality
// In production, this would connect to your actual database

export interface MessagesDB {
  getMessages(): Promise<Message[]>
  getMessageStats(): Promise<MessageStats>
  getProjects(): Promise<Project[]>
  getContacts(): Promise<Contact[]>
  createMessage(message: Partial<Message>): Promise<Message>
  updateMessage(id: string, updates: Partial<Message>): Promise<Message>
  deleteMessage(id: string): Promise<void>
}

class MockMessagesDB implements MessagesDB {
  private messages: Message[] = [
    {
      id: '1',
      subject: 'Golf simulator delivery status',
      content: 'When will the simulator be delivered? Guests coming Friday and I need to know if we\'ll be ready. This is very important for the weekend event.',
      senderId: 'henderson-golf',
      sender: {
        id: 'henderson-golf',
        name: 'Henderson Golf Project',
        company: 'Henderson Golf Simulator',
        avatar: undefined,
        category: 'client',
        reliabilityScore: 9,
        avgResponseTime: 0.5,
        isVip: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      source: 'whatsapp',
      category: 'client',
      priority: 'action',
      status: 'requires_response',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      responseRequired: true,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      projectId: 'henderson-golf-sim',
      project: {
        id: 'henderson-golf-sim',
        name: 'Henderson Golf Simulator',
        description: 'High-end golf simulator installation',
        budget: 50000,
        spent: 38000,
        timeline: {
          currentWeek: 12,
          totalWeeks: 16
        },
        status: 'active',
        startDate: new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      aiSuggestions: [],
      chaseHistory: [],
      relatedMessages: [],
      tags: ['vip', 'delivery'],
      metadata: {
        hasAttachment: false,
        attachmentCount: 0,
        estimatedImportance: 8
      },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      subject: 'Paint delivery delayed again',
      content: 'Paint delivery delayed again, what should I do? The heritage paint we ordered is now 3 days late and we need to keep the project moving.',
      senderId: 'site-team-marchmont',
      sender: {
        id: 'site-team-marchmont',
        name: 'Site Team',
        company: 'Marchmont Heritage',
        avatar: undefined,
        category: 'team',
        reliabilityScore: 7,
        avgResponseTime: 1.2,
        isVip: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      source: 'sms',
      category: 'team',
      priority: 'action',
      status: 'requires_response',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      responseRequired: true,
      projectId: 'marchmont-heritage',
      project: {
        id: 'marchmont-heritage',
        name: 'Marchmont Heritage',
        description: 'Historic building renovation',
        budget: 75000,
        spent: 45000,
        timeline: {
          currentWeek: 8,
          totalWeeks: 14
        },
        status: 'active',
        startDate: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      aiSuggestions: [],
      chaseHistory: [],
      relatedMessages: [],
      tags: ['urgent', 'supplies'],
      metadata: {
        hasAttachment: false,
        attachmentCount: 0,
        estimatedImportance: 7
      },
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      subject: 'Excavation permission expired, work stopped',
      content: 'The excavation permission for Henderson Golf Project has expired as of today. All work must cease immediately until renewed.',
      senderId: 'thames-water',
      sender: {
        id: 'thames-water',
        name: 'Thames Water',
        company: 'Thames Water Authority',
        avatar: undefined,
        category: 'external',
        reliabilityScore: 8,
        avgResponseTime: 2.1,
        isVip: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      source: 'email',
      category: 'external',
      priority: 'urgent',
      status: 'requires_response',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      responseRequired: true,
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      projectId: 'henderson-golf-sim',
      project: {
        id: 'henderson-golf-sim',
        name: 'Henderson Golf Simulator',
        description: 'High-end golf simulator installation',
        budget: 50000,
        spent: 38000,
        timeline: {
          currentWeek: 12,
          totalWeeks: 16
        },
        status: 'active',
        startDate: new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      aiSuggestions: [],
      chaseHistory: [],
      relatedMessages: [],
      tags: ['urgent', 'permissions', 'legal'],
      metadata: {
        hasAttachment: true,
        attachmentCount: 1,
        estimatedImportance: 10
      },
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      subject: 'Additional documentation required for listed building',
      content: 'Dear Emily, Following our site visit last week, we require additional documentation for the Marchmont Heritage project.',
      senderId: 'historic-england',
      sender: {
        id: 'historic-england',
        name: 'Historic England',
        company: 'Historic England',
        avatar: undefined,
        category: 'external',
        reliabilityScore: 6,
        avgResponseTime: 3.5,
        isVip: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      source: 'email',
      category: 'external',
      priority: 'review',
      status: 'requires_response',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      responseRequired: true,
      projectId: 'marchmont-heritage',
      project: {
        id: 'marchmont-heritage',
        name: 'Marchmont Heritage',
        description: 'Historic building renovation',
        budget: 75000,
        spent: 45000,
        timeline: {
          currentWeek: 8,
          totalWeeks: 14
        },
        status: 'active',
        startDate: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      aiSuggestions: [],
      chaseHistory: [],
      relatedMessages: [],
      tags: ['documentation', 'heritage'],
      metadata: {
        hasAttachment: false,
        attachmentCount: 0,
        estimatedImportance: 5
      },
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ]

  private projects: Project[] = [
    {
      id: 'henderson-golf-sim',
      name: 'Henderson Golf Simulator',
      budget: 50000,
      spent: 38000,
      timeline: {
        currentWeek: 12,
        totalWeeks: 16
      },
      status: 'active'
    },
    {
      id: 'marchmont-heritage',
      name: 'Marchmont Heritage',
      budget: 75000,
      spent: 45000,
      timeline: {
        currentWeek: 8,
        totalWeeks: 14
      },
      status: 'active'
    }
  ]

  private contacts: Contact[] = [
    {
      id: 'henderson-golf',
      name: 'Henderson Golf Project',
      email: 'info@hendersongolf.com',
      company: 'Henderson Golf Simulator',
      category: 'client',
      reliabilityScore: 9,
      avgResponseTime: 0.5,
      isVip: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'site-team-marchmont',
      name: 'Site Team',
      phone: '+44 7XXX XXX XXX',
      company: 'Marchmont Heritage',
      category: 'team',
      reliabilityScore: 7,
      avgResponseTime: 1.2,
      isVip: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'thames-water',
      name: 'Thames Water',
      email: 'permits@thameswater.co.uk',
      company: 'Thames Water Authority',
      category: 'external',
      reliabilityScore: 8,
      avgResponseTime: 2.1,
      isVip: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'historic-england',
      name: 'Historic England',
      email: 'enquiries@historicengland.org.uk',
      company: 'Historic England',
      category: 'external',
      reliabilityScore: 6,
      avgResponseTime: 3.5,
      isVip: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  async getMessages(): Promise<Message[]> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...this.messages]
  }

  async getMessageStats(): Promise<MessageStats> {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const urgent = this.messages.filter(m => m.priority === 'urgent').length
    const actionRequired = this.messages.filter(m => m.priority === 'action').length
    const requiresResponse = this.messages.filter(m => m.responseRequired).length
    const unread = this.messages.filter(m => m.status === 'unread').length
    const overdue = this.messages.filter(m => 
      m.dueDate && new Date(m.dueDate) < new Date() && m.responseRequired
    ).length
    
    const totalToday = this.messages.filter(m => {
      const today = new Date()
      const messageDate = new Date(m.timestamp)
      return messageDate.toDateString() === today.toDateString()
    }).length

    const bySource = this.messages.reduce((acc, message) => {
      acc[message.source] = (acc[message.source] || 0) + 1
      return acc
    }, {} as Record<MessageSource, number>)

    const byCategory = this.messages.reduce((acc, message) => {
      acc[message.category] = (acc[message.category] || 0) + 1
      return acc
    }, {} as Record<ContactCategory, number>)

    // Calculate average response time from sender data
    const averageResponseTime = this.messages.reduce((acc, message, index, arr) => {
      return acc + (message.sender?.avgResponseTime || 2)
    }, 0) / this.messages.length

    return {
      total: this.messages.length,
      urgent,
      actionRequired,
      requiresResponse,
      unread,
      overdue,
      totalToday,
      bySource,
      byCategory,
      averageResponseTime: Math.round(averageResponseTime * 10) / 10
    }
  }

  async getProjects(): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return [...this.projects]
  }

  async getContacts(): Promise<Contact[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return [...this.contacts]
  }

  async createMessage(messageData: Partial<Message>): Promise<Message> {
    const message: Message = {
      id: Date.now().toString(),
      subject: messageData.subject || '',
      content: messageData.content || '',
      senderId: messageData.senderId || 'unknown',
      sender: messageData.sender,
      source: messageData.source || 'email',
      category: messageData.category || 'external',
      priority: messageData.priority || 'review',
      timestamp: new Date().toISOString(),
      responseRequired: messageData.responseRequired || false,
      dueDate: messageData.dueDate,
      project: messageData.project
    }

    this.messages.unshift(message)
    return message
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<Message> {
    const index = this.messages.findIndex(m => m.id === id)
    if (index === -1) {
      throw new Error('Message not found')
    }

    this.messages[index] = { ...this.messages[index], ...updates }
    return this.messages[index]
  }

  async deleteMessage(id: string): Promise<void> {
    const index = this.messages.findIndex(m => m.id === id)
    if (index === -1) {
      throw new Error('Message not found')
    }

    this.messages.splice(index, 1)
  }
}

// Export singleton instance
export const messagesDB = new MockMessagesDB()

// Export functions that the messages page expects
export const getMessages = () => messagesDB.getMessages()
export const getMessageStats = () => messagesDB.getMessageStats()
export const getProjects = () => messagesDB.getProjects()
export const getContacts = () => messagesDB.getContacts()
export const createMessage = (message: Partial<Message>) => messagesDB.createMessage(message)
export const updateMessage = (id: string, updates: Partial<Message>) => messagesDB.updateMessage(id, updates)
export const deleteMessage = (id: string) => messagesDB.deleteMessage(id)

// Additional functions needed by API routes and services
export const getAllMessages = async (filters?: MessageFilters): Promise<Message[]> => {
  try {
    let messages = await messagesDB.getMessages()

    if (!filters) return messages

    // Apply filters
    if (filters.priorities?.length) {
      messages = messages.filter(m => filters.priorities!.includes(m.priority))
    }
    if (filters.sources?.length) {
      messages = messages.filter(m => filters.sources!.includes(m.source))
    }
    if (filters.categories?.length) {
      messages = messages.filter(m => filters.categories!.includes(m.category))
    }
    if (filters.status?.length) {
      messages = messages.filter(m => filters.status!.includes(m.status))
    }
    if (filters.projectIds?.length) {
      messages = messages.filter(m => m.project && filters.projectIds!.includes(m.project.id))
    }
    if (filters.requiresResponse) {
      messages = messages.filter(m => m.responseRequired)
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      messages = messages.filter(m => 
        m.subject.toLowerCase().includes(query) ||
        m.content.toLowerCase().includes(query) ||
        m.sender?.name.toLowerCase().includes(query) ||
        m.sender?.company?.toLowerCase().includes(query)
      )
    }

    return messages
  } catch (error) {
    console.error('Error getting filtered messages:', error)
    throw new Error('Failed to retrieve messages')
  }
}

export const getMessageById = async (id: string): Promise<Message | null> => {
  try {
    const messages = await messagesDB.getMessages()
    return messages.find(m => m.id === id) || null
  } catch (error) {
    console.error('Error getting message by ID:', error)
    throw new Error('Failed to retrieve message')
  }
}

export const updateMessageStatus = async (id: string, status: MessageStatus): Promise<boolean> => {
  try {
    await messagesDB.updateMessage(id, { status })
    return true
  } catch (error) {
    console.error('Error updating message status:', error)
    return false
  }
}

// Reply management functions
const replies: Reply[] = []

export const createReply = async (reply: Omit<Reply, 'created_at' | 'updated_at'>): Promise<Reply> => {
  try {
    const now = new Date().toISOString()
    const fullReply: Reply = {
      ...reply,
      created_at: now,
      updated_at: now
    }
    replies.push(fullReply)
    return fullReply
  } catch (error) {
    console.error('Error creating reply:', error)
    throw new Error('Failed to create reply')
  }
}

export const updateReplyStatus = async (
  replyId: string, 
  status: Reply['status'], 
  metadata?: Partial<Reply>
): Promise<Reply | null> => {
  try {
    const replyIndex = replies.findIndex(r => r.id === replyId)
    if (replyIndex === -1) {
      throw new Error(`Reply with ID ${replyId} not found`)
    }

    const now = new Date().toISOString()
    replies[replyIndex] = {
      ...replies[replyIndex],
      ...metadata,
      status,
      updated_at: now
    }

    return replies[replyIndex]
  } catch (error) {
    console.error('Error updating reply status:', error)
    throw new Error('Failed to update reply status')
  }
}

// Delivery status tracking
const deliveryStatuses: DeliveryStatus[] = []

export const createDeliveryStatus = async (status: DeliveryStatus): Promise<DeliveryStatus> => {
  try {
    deliveryStatuses.push(status)
    return status
  } catch (error) {
    console.error('Error creating delivery status:', error)
    throw new Error('Failed to create delivery status')
  }
}

export const getDeliveryStatus = async (replyId: string): Promise<DeliveryStatus[]> => {
  try {
    return deliveryStatuses.filter(ds => ds.replyId === replyId)
  } catch (error) {
    console.error('Error getting delivery status:', error)
    throw new Error('Failed to retrieve delivery status')
  }
}

// Additional API route helper functions
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    return await messagesDB.getProjects()
  } catch (error) {
    console.error('Error getting all projects:', error)
    throw new Error('Failed to retrieve projects')
  }
}

export const getAllContacts = async (): Promise<Contact[]> => {
  try {
    return await messagesDB.getContacts()
  } catch (error) {
    console.error('Error getting all contacts:', error)
    throw new Error('Failed to retrieve contacts')
  }
}