import { Message, Project, Contact } from '@/lib/types/messages'
import { messagesDB } from '@/lib/db/messages-db'

export interface RAGContext {
  messageId: string
  projectId?: string
  senderId: string
  category: string
  priority: string
}

export interface RAGResponse {
  response: string
  confidence: number
  citations: string[]
  suggestedFollowUps?: string[]
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
}

export class RAGService {
  private knowledgeBase = {
    // Project-specific templates and insights
    projectInsights: {
      budget: {
        questions: ['budget', 'cost', 'spend', 'financial', 'money', '£', '$'],
        responseTemplate: (project: Project) => {
          const spentPercentage = Math.round((project.spent / project.budget) * 100)
          const remaining = project.budget - project.spent
          const weeklyBurn = project.spent / project.timeline.currentWeek
          const projectedTotal = weeklyBurn * project.timeline.totalWeeks
          const isOverBudget = projectedTotal > project.budget
          
          return `**Budget Status for ${project.name}:**

💰 **Current Position:**
• Budget: £${project.budget.toLocaleString()}
• Spent: £${project.spent.toLocaleString()} (${spentPercentage}%)
• Remaining: £${remaining.toLocaleString()}

📊 **Forecast:**
• Weekly burn rate: £${Math.round(weeklyBurn).toLocaleString()}
• Projected total: £${Math.round(projectedTotal).toLocaleString()}
• Status: ${isOverBudget ? `⚠️ £${Math.round(projectedTotal - project.budget).toLocaleString()} over budget` : '✅ On track'}

**Week ${project.timeline.currentWeek} of ${project.timeline.totalWeeks} (${Math.round((project.timeline.currentWeek / project.timeline.totalWeeks) * 100)}% complete)**`
        }
      },
      timeline: {
        questions: ['timeline', 'schedule', 'deadline', 'milestone', 'when', 'completion', 'finish'],
        responseTemplate: (project: Project) => {
          const progressPercentage = Math.round((project.timeline.currentWeek / project.timeline.totalWeeks) * 100)
          const remainingWeeks = project.timeline.totalWeeks - project.timeline.currentWeek
          
          return `**Timeline Status for ${project.name}:**

🗓️ **Current Progress:**
• Week ${project.timeline.currentWeek} of ${project.timeline.totalWeeks}
• ${progressPercentage}% complete
• ${remainingWeeks} weeks remaining

⏰ **Key Dates:**
• Started: ${new Date(project.startDate).toLocaleDateString()}
• Expected completion: ${new Date(new Date(project.startDate).getTime() + (project.timeline.totalWeeks * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
• Status: ${project.status === 'active' ? '🟢 Active' : project.status === 'on_hold' ? '🟡 On Hold' : '🔴 Issues'}

${remainingWeeks <= 2 ? '⚠️ **Project nearing completion - ensure final deliverables are ready**' : ''}${progressPercentage > 75 && project.spent / project.budget > 0.9 ? '\n💡 **Budget and timeline both in final phase - monitor closely**' : ''}`
        }
      },
      contacts: {
        questions: ['contact', 'who', 'team', 'client', 'person', 'people', 'responsible'],
        responseTemplate: (project: Project, allContacts: Contact[]) => {
          const projectContacts = allContacts.filter(c => 
            c.name.toLowerCase().includes(project.name.toLowerCase()) ||
            c.company?.toLowerCase().includes(project.name.toLowerCase())
          )
          
          return `**Key Contacts for ${project.name}:**

${projectContacts.map(contact => {
            const reliability = contact.reliabilityScore >= 8 ? '🟢 High' : contact.reliabilityScore >= 6 ? '🟡 Medium' : '🔴 Low'
            return `👤 **${contact.name}** (${contact.company})
• Category: ${contact.category.toUpperCase()}
• Reliability: ${reliability} (${contact.reliabilityScore}/10)
• Avg Response: ${contact.avgResponseTime} days
• ${contact.isVip ? '⭐ VIP Contact' : 'Standard Priority'}
${contact.email ? `• Email: ${contact.email}` : ''}${contact.phone ? `• Phone: ${contact.phone}` : ''}`
          }).join('\n\n')}

💡 **Communication Tips:**
${projectContacts.some(c => c.isVip) ? '• VIP contacts require immediate response\n' : ''}${projectContacts.some(c => c.reliabilityScore < 6) ? '• Some contacts may need follow-up\n' : ''}• Best response times during business hours`
        }
      },
      risks: {
        questions: ['risk', 'issue', 'problem', 'concern', 'delay', 'blocker'],
        responseTemplate: (project: Project, messages: Message[]) => {
          const projectMessages = messages.filter(m => m.project?.id === project.id)
          const urgentMessages = projectMessages.filter(m => m.priority === 'urgent')
          const overdueMessages = projectMessages.filter(m => 
            m.dueDate && new Date(m.dueDate) < new Date() && m.responseRequired
          )
          
          const budgetRisk = (project.spent / project.budget) > 0.85
          const timelineRisk = (project.timeline.currentWeek / project.timeline.totalWeeks) > 0.8
          
          return `**Risk Assessment for ${project.name}:**

🚨 **Current Risks:**
${urgentMessages.length > 0 ? `• ${urgentMessages.length} urgent message(s) requiring attention\n` : ''}${overdueMessages.length > 0 ? `• ${overdueMessages.length} overdue response(s)\n` : ''}${budgetRisk ? `• Budget risk: ${Math.round((project.spent / project.budget) * 100)}% spent\n` : ''}${timelineRisk ? `• Timeline risk: ${Math.round((project.timeline.currentWeek / project.timeline.totalWeeks) * 100)}% time elapsed\n` : ''}

📊 **Risk Level:** ${urgentMessages.length > 0 || overdueMessages.length > 0 ? '🔴 HIGH' : budgetRisk || timelineRisk ? '🟡 MEDIUM' : '🟢 LOW'}

💡 **Recommendations:**
${urgentMessages.length > 0 ? '• Address urgent messages immediately\n' : ''}${budgetRisk ? '• Review remaining budget allocation\n' : ''}${timelineRisk ? '• Assess timeline feasibility\n' : ''}• Regular stakeholder communication
• Document all issues and resolutions`
        }
      }
    }
  }

  async generateResponse(
    query: string, 
    context: RAGContext, 
    conversationHistory: ChatMessage[]
  ): Promise<RAGResponse> {
    try {
      // Get relevant data based on context
      const messages = await messagesDB.getMessages()
      const projects = await messagesDB.getProjects()
      const contacts = await messagesDB.getContacts()
      
      const currentProject = context.projectId ? 
        projects.find(p => p.id === context.projectId) : null
      const currentMessage = messages.find(m => m.id === context.messageId)
      
      // Analyze query intent
      const intent = this.analyzeQueryIntent(query.toLowerCase())
      const confidence = this.calculateConfidence(query, intent, currentProject)
      
      // Generate response based on intent and available data
      let response: string
      let citations: string[] = []
      
      switch (intent.type) {
        case 'budget':
          if (currentProject) {
            response = this.knowledgeBase.projectInsights.budget.responseTemplate(currentProject)
            citations = ['Project financial data', 'Current spend tracking']
          } else {
            response = "I don't have specific project budget information available. Could you specify which project you're asking about?"
          }
          break
          
        case 'timeline':
          if (currentProject) {
            response = this.knowledgeBase.projectInsights.timeline.responseTemplate(currentProject)
            citations = ['Project timeline data', 'Progress tracking']
          } else {
            response = "I don't have timeline information for this context. Could you specify the project?"
          }
          break
          
        case 'contacts':
          if (currentProject) {
            response = this.knowledgeBase.projectInsights.contacts.responseTemplate(currentProject, contacts)
            citations = ['Contact database', 'Communication history']
          } else {
            response = this.generateGeneralContactInfo(contacts, context)
            citations = ['Contact database']
          }
          break
          
        case 'risks':
          if (currentProject) {
            response = this.knowledgeBase.projectInsights.risks.responseTemplate(currentProject, messages)
            citations = ['Project status', 'Message history', 'Risk assessment']
          } else {
            response = "I can help assess project risks. Could you specify which project you'd like me to analyze?"
          }
          break
          
        case 'history':
          response = this.generateHistoryResponse(currentMessage, messages, context)
          citations = ['Message history', 'Communication logs']
          break
          
        case 'general':
        default:
          response = this.generateGeneralResponse(query, currentMessage, currentProject, context)
          citations = ['Project data', 'Message context']
          break
      }
      
      return {
        response,
        confidence,
        citations,
        suggestedFollowUps: this.generateFollowUpSuggestions(intent.type, currentProject)
      }
    } catch (error) {
      console.error('RAG Service error:', error)
      return {
        response: "I'm having trouble accessing the information right now. Please try asking your question again.",
        confidence: 0.1,
        citations: []
      }
    }
  }

  private analyzeQueryIntent(query: string): { type: string; keywords: string[] } {
    const queryWords = query.split(' ').map(w => w.toLowerCase())
    
    for (const [intentType, intentData] of Object.entries(this.knowledgeBase.projectInsights)) {
      const matchedKeywords = intentData.questions.filter(keyword => 
        queryWords.some(word => word.includes(keyword) || keyword.includes(word))
      )
      
      if (matchedKeywords.length > 0) {
        return { type: intentType, keywords: matchedKeywords }
      }
    }
    
    // Check for history-related queries
    if (queryWords.some(word => ['history', 'before', 'previous', 'past', 'similar'].includes(word))) {
      return { type: 'history', keywords: ['history'] }
    }
    
    return { type: 'general', keywords: [] }
  }

  private calculateConfidence(query: string, intent: any, project: Project | null): number {
    let confidence = 0.6 // Base confidence
    
    // Boost confidence if we have project context
    if (project) confidence += 0.2
    
    // Boost confidence if query matches known patterns well
    if (intent.keywords.length > 0) confidence += 0.1
    
    // Boost confidence for specific, clear questions
    if (query.includes('?')) confidence += 0.05
    if (query.length > 10) confidence += 0.05
    
    return Math.min(confidence, 0.95) // Cap at 95%
  }

  private generateGeneralContactInfo(contacts: Contact[], context: RAGContext): string {
    const relevantContact = contacts.find(c => c.id === context.senderId)
    
    if (relevantContact) {
      return `**Contact Information:**

👤 **${relevantContact.name}**
• Company: ${relevantContact.company}
• Category: ${relevantContact.category.toUpperCase()}
• Reliability Score: ${relevantContact.reliabilityScore}/10
• Average Response Time: ${relevantContact.avgResponseTime} days
• ${relevantContact.isVip ? '⭐ VIP Contact' : 'Standard Priority'}

💡 **Communication Insights:**
${relevantContact.reliabilityScore >= 8 ? '• Highly reliable - responses usually on time' : 
  relevantContact.reliabilityScore >= 6 ? '• Generally reliable - may need gentle follow-up' : 
  '• May require follow-up or alternative communication channels'}
${relevantContact.avgResponseTime > 2 ? '• Consider allowing extra time for responses' : '• Typically responds promptly'}`
    }
    
    return "I can provide contact information and communication insights. What specific contact details do you need?"
  }

  private generateHistoryResponse(currentMessage: Message | undefined, allMessages: Message[], context: RAGContext): string {
    if (!currentMessage) {
      return "I don't have access to the current message context. Could you provide more details?"
    }
    
    const relatedMessages = allMessages.filter(m => 
      (m.senderId === currentMessage.senderId || m.project?.id === currentMessage.project?.id) &&
      m.id !== currentMessage.id
    )
    
    const recentMessages = relatedMessages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3)
    
    if (recentMessages.length === 0) {
      return "This appears to be the first communication from this contact/project in our records."
    }
    
    return `**Communication History:**

📧 **Recent interactions with ${currentMessage.sender?.company || currentMessage.sender?.name}:**

${recentMessages.map((msg, index) => `${index + 1}. **${msg.subject}** (${new Date(msg.timestamp).toLocaleDateString()})
   • Priority: ${msg.priority.toUpperCase()}
   • Status: ${msg.status.replace('_', ' ')}
   • ${msg.content.substring(0, 80)}...`).join('\n\n')}

💡 **Pattern Analysis:**
• Total messages: ${relatedMessages.length + 1}
• Average priority: ${this.calculateAveragePriority(relatedMessages)}
• Communication trend: ${this.analyzeCommunicationTrend(relatedMessages)}`
  }

  private generateGeneralResponse(query: string, message: Message | undefined, project: Project | null, context: RAGContext): string {
    const projectInfo = project ? `for **${project.name}**` : 'for this context'
    
    return `I understand you're asking about "${query}" ${projectInfo}.

${project ? `**Project Context:**
• ${project.name} (Week ${project.timeline.currentWeek}/${project.timeline.totalWeeks})
• Budget: £${project.spent.toLocaleString()} of £${project.budget.toLocaleString()} spent
• Status: ${project.status}

` : ''}**I can help with:**
• Budget and financial information
• Timeline and milestone details
• Contact information and communication history
• Risk assessment and project status
• Historical patterns and similar issues

Could you be more specific about what information you need?`
  }

  private generateFollowUpSuggestions(intentType: string, project: Project | null): string[] {
    const suggestions = []
    
    switch (intentType) {
      case 'budget':
        suggestions.push('Show weekly spending trends', 'Compare to similar projects', 'Budget risk assessment')
        break
      case 'timeline':
        suggestions.push('Show critical path items', 'Identify potential delays', 'Compare original vs current schedule')
        break
      case 'contacts':
        suggestions.push('Show communication preferences', 'Recent interaction history', 'Escalation contacts')
        break
      case 'risks':
        suggestions.push('Show mitigation strategies', 'Compare to project benchmarks', 'Generate risk report')
        break
      default:
        suggestions.push('Show project overview', 'Recent activity summary', 'Key metrics dashboard')
    }
    
    return suggestions
  }

  private calculateAveragePriority(messages: Message[]): string {
    if (messages.length === 0) return 'N/A'
    
    const priorityValues = { urgent: 3, action: 2, review: 1, complete: 0 }
    const average = messages.reduce((sum, msg) => sum + (priorityValues[msg.priority as keyof typeof priorityValues] || 0), 0) / messages.length
    
    if (average >= 2.5) return 'HIGH'
    if (average >= 1.5) return 'MEDIUM'
    return 'LOW'
  }

  private analyzeCommunicationTrend(messages: Message[]): string {
    if (messages.length < 2) return 'Insufficient data'
    
    const sorted = messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const recent = sorted.slice(-3)
    const older = sorted.slice(0, -3)
    
    if (older.length === 0) return 'Recent communication pattern'
    
    const recentUrgent = recent.filter(m => m.priority === 'urgent').length / recent.length
    const olderUrgent = older.filter(m => m.priority === 'urgent').length / older.length
    
    if (recentUrgent > olderUrgent + 0.2) return 'Escalating urgency'
    if (recentUrgent < olderUrgent - 0.2) return 'Decreasing urgency'
    return 'Consistent communication level'
  }
}

export const ragService = new RAGService()