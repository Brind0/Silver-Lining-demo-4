import { Message, Contact, Project } from '@/lib/types/messages'

export interface OfficeAgentContext {
  message: Message
  conversationHistory: AgentMessage[]
  businessContext: {
    currentProjects: Project[]
    clientHistory: Contact[]
    timeOfDay: 'morning' | 'afternoon' | 'evening'
    workloadStatus: 'light' | 'normal' | 'heavy'
  }
}

export interface AgentMessage {
  id: string
  type: 'user' | 'agent' | 'system'
  content: string
  timestamp: string
  metadata?: {
    confidence: number
    suggestedActions?: string[]
    riskLevel?: 'low' | 'medium' | 'high'
    responseTime?: number
  }
}

export interface AgentResponse {
  message: AgentMessage
  suggestedQuestions?: string[]
  actionableInsights?: {
    priority: 'low' | 'medium' | 'high'
    action: string
    reasoning: string
  }[]
}

export class OfficeAgentService {
  private knowledgeBase = {
    responseTemplates: {
      urgentClient: "Given this is from a VIP client with urgent priority, I recommend immediate attention.",
      delayedDelivery: "Delivery delays require proactive communication to maintain client relationships.",
      teamCommunication: "Internal team issues need direct, solution-focused responses.",
      compliance: "Compliance and documentation requests require systematic, thorough responses.",
      budgetConcerns: "Financial implications should be addressed transparently with alternatives."
    },
    
    clientInsights: {
      vip: "VIP clients expect immediate acknowledgment and proactive updates",
      regular: "Standard clients value clear timelines and professional communication",
      external: "External companies require formal documentation and clear liability statements"
    },
    
    riskFactors: {
      urgent_overdue: "High risk - Urgent message past due date",
      client_vip_delayed: "Medium risk - VIP client experiencing delays", 
      compliance_deadline: "High risk - Compliance deadline approaching",
      budget_overrun: "Medium risk - Project budget implications",
      team_blocker: "Medium risk - Team productivity impact"
    }
  }

  async generateResponse(userInput: string, context: OfficeAgentContext): Promise<AgentResponse> {
    const { message, conversationHistory } = context
    
    // Analyze the input and context to generate appropriate response
    const analysis = this.analyzeInput(userInput, message)
    const insights = this.generateInsights(message, context)
    const response = this.craftResponse(analysis, insights, message)
    
    return {
      message: {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: response.content,
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: response.confidence,
          suggestedActions: response.actions,
          riskLevel: response.riskLevel,
          responseTime: this.calculateExpectedResponseTime(message)
        }
      },
      suggestedQuestions: this.generateFollowUpQuestions(analysis, message),
      actionableInsights: insights
    }
  }

  private analyzeInput(input: string, message: Message) {
    const inputLower = input.toLowerCase()
    
    return {
      intent: this.detectIntent(inputLower),
      topics: this.extractTopics(inputLower, message),
      urgencyLevel: this.assessUrgency(inputLower, message),
      informationRequest: this.identifyInformationNeeds(inputLower)
    }
  }

  private detectIntent(input: string): string {
    if (input.includes('urgent') || input.includes('priority') || input.includes('risk')) {
      return 'urgency_assessment'
    }
    if (input.includes('tone') || input.includes('approach') || input.includes('how should')) {
      return 'communication_strategy'
    }
    if (input.includes('history') || input.includes('previous') || input.includes('past')) {
      return 'historical_context'
    }
    if (input.includes('suggest') || input.includes('draft') || input.includes('write')) {
      return 'content_generation'
    }
    if (input.includes('deadline') || input.includes('timeline') || input.includes('when')) {
      return 'timeline_analysis'
    }
    return 'general_inquiry'
  }

  private extractTopics(input: string, message: Message): string[] {
    const topics = []
    
    if (input.includes('budget') || message.content.toLowerCase().includes('cost')) {
      topics.push('budget_impact')
    }
    if (input.includes('client') || message.category === 'client') {
      topics.push('client_relationship')
    }
    if (input.includes('team') || message.category === 'team') {
      topics.push('team_coordination')
    }
    if (input.includes('legal') || input.includes('compliance') || input.includes('permit')) {
      topics.push('compliance_legal')
    }
    if (input.includes('delivery') || input.includes('schedule') || input.includes('timeline')) {
      topics.push('project_timeline')
    }
    
    return topics
  }

  private assessUrgency(input: string, message: Message): 'low' | 'medium' | 'high' {
    if (message.priority === 'urgent' || message.dueDate && new Date(message.dueDate) < new Date()) {
      return 'high'
    }
    if (message.priority === 'action' || message.sender?.isVip) {
      return 'medium'
    }
    return 'low'
  }

  private identifyInformationNeeds(input: string): string[] {
    const needs = []
    
    if (input.includes('who') || input.includes('contact')) needs.push('contact_info')
    if (input.includes('when') || input.includes('deadline')) needs.push('timeline')
    if (input.includes('what') || input.includes('details')) needs.push('context_details')
    if (input.includes('why') || input.includes('reason')) needs.push('reasoning')
    if (input.includes('how') || input.includes('approach')) needs.push('methodology')
    
    return needs
  }

  private generateInsights(message: Message, context: OfficeAgentContext) {
    const insights = []
    
    // Risk assessment insight
    if (message.priority === 'urgent' && message.sender?.isVip) {
      insights.push({
        priority: 'high' as const,
        action: 'Immediate response required',
        reasoning: 'VIP client with urgent request - high relationship risk if delayed'
      })
    }

    // Budget impact insight
    if (message.content.toLowerCase().includes('cost') || message.content.toLowerCase().includes('£')) {
      insights.push({
        priority: 'medium' as const,
        action: 'Prepare cost justification',
        reasoning: 'Financial implications mentioned - client may need detailed breakdown'
      })
    }

    // Compliance insight
    if (message.content.toLowerCase().includes('permit') || message.content.toLowerCase().includes('compliance')) {
      insights.push({
        priority: 'high' as const,
        action: 'Review legal requirements',
        reasoning: 'Compliance issues can have legal and financial consequences'
      })
    }

    return insights
  }

  private craftResponse(analysis: any, insights: any[], message: Message) {
    let content = ""
    let confidence = 0.8
    let actions = []
    let riskLevel: 'low' | 'medium' | 'high' = 'low'

    switch (analysis.intent) {
      case 'urgency_assessment':
        content = this.generateUrgencyResponse(message, analysis)
        confidence = 0.92
        riskLevel = analysis.urgencyLevel
        actions = ['Set response deadline', 'Prioritize in workflow', 'Notify team if needed']
        break

      case 'communication_strategy':
        content = this.generateCommunicationStrategy(message, analysis)
        confidence = 0.88
        actions = ['Choose appropriate tone', 'Select communication channel', 'Prepare key points']
        break

      case 'historical_context':
        content = this.generateHistoricalContext(message)
        confidence = 0.85
        actions = ['Review past interactions', 'Check project history', 'Note communication patterns']
        break

      case 'content_generation':
        content = this.generateContentSuggestions(message, analysis)
        confidence = 0.90
        actions = ['Draft response outline', 'Choose key messages', 'Review before sending']
        break

      case 'timeline_analysis':
        content = this.generateTimelineAnalysis(message)
        confidence = 0.87
        riskLevel = message.dueDate && new Date(message.dueDate) < new Date() ? 'high' : 'medium'
        actions = ['Check project schedule', 'Coordinate with team', 'Set realistic expectations']
        break

      default:
        content = this.generateGeneralResponse(message, analysis)
        confidence = 0.75
        actions = ['Analyze message context', 'Prepare appropriate response']
    }

    return { content, confidence, actions, riskLevel }
  }

  private generateUrgencyResponse(message: Message, analysis: any): string {
    const urgencyMapping = {
      high: "🔴 **HIGH URGENCY**",
      medium: "🟡 **MEDIUM PRIORITY**", 
      low: "🟢 **STANDARD PRIORITY**"
    }

    const factors = []
    if (message.priority === 'urgent') factors.push('Marked as urgent')
    if (message.sender?.isVip) factors.push('VIP client')
    if (message.dueDate) {
      const isOverdue = new Date(message.dueDate) < new Date()
      factors.push(isOverdue ? 'Past due date' : 'Has deadline')
    }
    if (message.content.toLowerCase().includes('stop') || message.content.toLowerCase().includes('cease')) {
      factors.push('Work stoppage mentioned')
    }

    return `${urgencyMapping[analysis.urgencyLevel]} Analysis:\n\n**Risk Factors:**\n${factors.map(f => `• ${f}`).join('\n')}\n\n**Recommended Response Time:** ${this.getResponseTimeRecommendation(analysis.urgencyLevel)}\n\n**Impact Assessment:** ${this.getImpactAssessment(message)}`
  }

  private generateCommunicationStrategy(message: Message, analysis: any): string {
    const clientType = message.sender?.isVip ? 'VIP' : 'Standard'
    const category = message.category

    let tone, approach, keyElements

    if (category === 'client') {
      tone = message.sender?.isVip ? 'Personal and proactive' : 'Professional and solution-focused'
      approach = 'Acknowledge concern, provide solution, set expectations'
      keyElements = ['Immediate acknowledgment', 'Clear action plan', 'Timeline for resolution']
    } else if (category === 'team') {
      tone = 'Direct and collaborative'
      approach = 'Problem-solve together, clarify responsibilities'
      keyElements = ['Understand the issue', 'Provide guidance or resources', 'Confirm next steps']
    } else {
      tone = 'Formal and documentation-focused'
      approach = 'Address requirements systematically'
      keyElements = ['Formal acknowledgment', 'Detailed response', 'Paper trail maintenance']
    }

    return `**Communication Strategy for ${clientType} ${category.toUpperCase()}:**\n\n**Recommended Tone:** ${tone}\n\n**Approach:** ${approach}\n\n**Key Elements to Include:**\n${keyElements.map(e => `• ${e}`).join('\n')}\n\n**Channel Optimization:** ${this.getChannelAdvice(message.source)}`
  }

  private generateHistoricalContext(message: Message): string {
    const reliability = message.sender?.reliabilityScore || 7
    const avgResponse = message.sender?.avgResponseTime || 1.5

    return `**Communication History with ${message.sender?.company}:**\n\n**Reliability Score:** ${reliability}/10 ${this.getReliabilityComment(reliability)}\n\n**Average Response Time:** ${avgResponse} days\n\n**Communication Pattern:** ${this.getCommunicationPattern(reliability, avgResponse)}\n\n**Recommendation:** ${this.getHistoricalRecommendation(reliability, avgResponse, message)}`
  }

  private generateContentSuggestions(message: Message, analysis: any): string {
    const suggestions = []

    // Opening suggestions
    if (message.sender?.isVip) {
      suggestions.push("**Opening:** 'Thank you for bringing this to my immediate attention...'")
    } else if (message.priority === 'urgent') {
      suggestions.push("**Opening:** 'I understand the urgency of this matter...'")
    } else {
      suggestions.push("**Opening:** 'Thank you for your message regarding...'")
    }

    // Content structure
    suggestions.push("**Structure:** Acknowledge → Explain → Action Plan → Timeline")

    // Closing suggestions
    if (message.category === 'client') {
      suggestions.push("**Closing:** 'I'll keep you updated on progress and reach out immediately if anything changes.'")
    } else {
      suggestions.push("**Closing:** 'Please let me know if you need any clarification.'")
    }

    return `**Content Generation Suggestions:**\n\n${suggestions.join('\n\n')}\n\n**Key Messages to Convey:**\n• Acknowledge the issue/request\n• Show understanding of impact\n• Provide clear next steps\n• Set appropriate expectations`
  }

  private generateTimelineAnalysis(message: Message): string {
    const now = new Date()
    const dueDate = message.dueDate ? new Date(message.dueDate) : null
    
    let timelineStatus = "No specific deadline mentioned"
    let urgencyNote = ""
    
    if (dueDate) {
      const timeDiff = dueDate.getTime() - now.getTime()
      const hoursUntilDue = Math.floor(timeDiff / (1000 * 60 * 60))
      
      if (hoursUntilDue < 0) {
        timelineStatus = `⚠️ OVERDUE by ${Math.abs(hoursUntilDue)} hours`
        urgencyNote = "Immediate response required - past deadline"
      } else if (hoursUntilDue < 24) {
        timelineStatus = `🔴 Due in ${hoursUntilDue} hours`
        urgencyNote = "Response needed today"
      } else {
        const daysUntilDue = Math.floor(hoursUntilDue / 24)
        timelineStatus = `🟡 Due in ${daysUntilDue} days`
        urgencyNote = "Standard response timeline"
      }
    }

    return `**Timeline Analysis:**\n\n**Current Status:** ${timelineStatus}\n\n**Response Priority:** ${urgencyNote}\n\n**Recommended Action Timeline:**\n• Acknowledge receipt: Within 1 hour\n• Detailed response: ${this.getDetailedResponseTime(message)}\n• Follow-up (if needed): ${this.getFollowUpTime(message)}`
  }

  private generateGeneralResponse(message: Message, analysis: any): string {
    return `I've analyzed your question about "${analysis.topics.join(', ') || 'this message'}".\n\n**Context Summary:**\n• From: ${message.sender?.company || message.sender?.name}\n• Type: ${message.category.toUpperCase()} communication\n• Channel: ${message.source.toUpperCase()}\n• Priority: ${message.priority.toUpperCase()}\n\n**Key Considerations:**\n• Response method should match urgency level\n• Maintain professional relationships\n• Document important communications\n\nWhat specific aspect would you like me to elaborate on?`
  }

  private generateFollowUpQuestions(analysis: any, message: Message): string[] {
    const questions = []
    
    if (analysis.intent === 'urgency_assessment') {
      questions.push('What\'s the potential impact of delay?', 'Should I escalate this?', 'Who else needs to be informed?')
    } else if (analysis.intent === 'communication_strategy') {
      questions.push('Draft an opening line?', 'What tone should I use?', 'Any template suggestions?')
    } else if (analysis.intent === 'historical_context') {
      questions.push('Show recent interactions', 'Communication preferences?', 'Past response patterns?')
    } else {
      questions.push('Risk assessment?', 'Suggest tone', 'Show history', 'Draft response')
    }
    
    return questions
  }

  // Helper methods
  private calculateExpectedResponseTime(message: Message): number {
    if (message.priority === 'urgent') return 1 // 1 hour
    if (message.priority === 'action') return 4 // 4 hours  
    return 24 // 24 hours
  }

  private getResponseTimeRecommendation(urgency: string): string {
    switch (urgency) {
      case 'high': return 'Within 1-2 hours'
      case 'medium': return 'Within 4-6 hours'
      default: return 'Within 24 hours'
    }
  }

  private getImpactAssessment(message: Message): string {
    const factors = []
    if (message.sender?.isVip) factors.push('Client relationship risk')
    if (message.content.toLowerCase().includes('stop')) factors.push('Project delay risk')
    if (message.content.toLowerCase().includes('£')) factors.push('Financial implications')
    
    return factors.length ? factors.join(', ') : 'Standard business communication'
  }

  private getChannelAdvice(source: string): string {
    switch (source) {
      case 'email': return 'Email allows for detailed, documented responses'
      case 'whatsapp': return 'WhatsApp enables quick, informal follow-up'
      case 'sms': return 'SMS best for brief confirmations and updates'
      default: return 'Choose channel based on message urgency and formality needs'
    }
  }

  private getReliabilityComment(score: number): string {
    if (score >= 8) return '(Highly reliable)'
    if (score >= 6) return '(Generally reliable)'
    return '(May need follow-up)'
  }

  private getCommunicationPattern(reliability: number, avgResponse: number): string {
    if (reliability >= 8 && avgResponse <= 1) return 'Quick and reliable responder'
    if (reliability >= 6 && avgResponse <= 2) return 'Consistently responsive'
    return 'May require follow-up or chase'
  }

  private getHistoricalRecommendation(reliability: number, avgResponse: number, message: Message): string {
    if (reliability < 6) {
      return 'Consider follow-up mechanism due to lower reliability score'
    }
    if (avgResponse > 2 && message.priority === 'urgent') {
      return 'Use multiple channels for urgent communications with this contact'
    }
    return 'Standard communication approach should be effective'
  }

  private getDetailedResponseTime(message: Message): string {
    if (message.priority === 'urgent') return 'Within 2 hours'
    if (message.priority === 'action') return 'By end of day'
    return 'Within 24-48 hours'
  }

  private getFollowUpTime(message: Message): string {
    const baseTime = message.priority === 'urgent' ? '24 hours' : '48-72 hours'
    return `${baseTime} if no response received`
  }
}