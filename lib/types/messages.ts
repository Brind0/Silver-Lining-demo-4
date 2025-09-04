export type MessageSource = 'email' | 'whatsapp' | 'sms' | 'call' | 'system';
export type MessagePriority = 'urgent' | 'action' | 'review' | 'complete';
export type ContactCategory = 'client' | 'team' | 'external' | 'system';
export type MessageStatus = 'unread' | 'read' | 'requires_response' | 'responded' | 'archived' | 'draft_saved' | 'sending' | 'sent' | 'delivered' | 'failed';

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  avatar?: string;
  category: ContactCategory;
  reliabilityScore: number;
  avgResponseTime: number;
  isVip: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  startDate: string;
  endDate?: string;
  timeline: {
    totalWeeks: number;
    currentWeek: number;
  };
  created_at: string;
  updated_at: string;
}

export interface ChaseRecord {
  id: string;
  messageId: string;
  chaseDate: string;
  method: 'email' | 'phone' | 'sms';
  note?: string;
  response?: string;
  responseDate?: string;
}

export interface AISuggestion {
  id: string;
  type: 'response_draft' | 'action_suggestion' | 'escalation' | 'chase_reminder';
  title: string;
  content: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  source: MessageSource;
  senderId: string;
  sender?: Contact;
  projectId?: string;
  project?: Project;
  category: ContactCategory;
  priority: MessagePriority;
  status: MessageStatus;
  subject: string;
  content: string;
  timestamp: string;
  responseRequired: boolean;
  dueDate?: string;
  threadId?: string;
  parentMessageId?: string;
  aiSuggestions: AISuggestion[];
  chaseHistory: ChaseRecord[];
  relatedMessages: string[];
  tags: string[];
  metadata: {
    hasAttachment?: boolean;
    attachmentCount?: number;
    originalMessageId?: string;
    deliveryStatus?: 'delivered' | 'read' | 'failed';
    estimatedImportance?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface MessageThread {
  id: string;
  participants: Contact[];
  subject: string;
  projectId?: string;
  messageCount: number;
  lastActivity: string;
  priority: MessagePriority;
  status: 'active' | 'resolved' | 'archived';
  messages: Message[];
}

export interface MessageFilters {
  priorities?: MessagePriority[];
  sources?: MessageSource[];
  categories?: ContactCategory[];
  projectIds?: string[];
  status?: MessageStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
  requiresResponse?: boolean;
  isUrgent?: boolean;
}

export interface MessageStats {
  total: number;
  urgent: number;
  actionRequired: number;
  requiresResponse: number;
  unread: number;
  overdue: number;
  bySource: Record<MessageSource, number>;
  byCategory: Record<ContactCategory, number>;
  averageResponseTime: number;
  totalToday: number;
}

export interface ExternalCompanyMetrics {
  contactId: string;
  contact: Contact;
  totalMessages: number;
  averageResponseTime: number;
  reliabilityScore: number;
  pendingResponses: number;
  overdueResponses: number;
  lastChaseDate?: string;
  nextChaseDate?: string;
  communicationTrend: 'improving' | 'declining' | 'stable';
}

export interface Reply {
  id: string;
  originalMessageId: string;
  originalMessage?: Message;
  content: string;
  channel: MessageSource;
  recipientId: string;
  recipient?: Contact;
  subject?: string;
  status: 'draft' | 'sending' | 'sent' | 'delivered' | 'failed';
  sentBy: string;
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  templateUsed?: string;
  metadata: {
    emailMessageId?: string;
    whatsappMessageId?: string;
    smsMessageId?: string;
    attachments?: string[];
    signature?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'quick_reply' | 'professional' | 'escalation' | 'client_vip' | 'team' | 'external';
  recipientType: ContactCategory[];
  messageTypes: MessagePriority[];
  variables: string[]; // e.g., ['name', 'project', 'company']
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  created_at: string;
  updated_at: string;
}

export interface Draft {
  id: string;
  messageId: string;
  content: string;
  channel: MessageSource;
  recipientId: string;
  subject?: string;
  templateId?: string;
  metadata: {
    autoSaveInterval: number;
    lastSaved: string;
  };
  created_at: string;
  updated_at: string;
}

export interface DeliveryStatus {
  replyId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  providerResponse?: any;
  errorMessage?: string;
}