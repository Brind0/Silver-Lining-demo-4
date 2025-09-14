"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Mail, 
  Users, 
  AlertTriangle, 
  Bot,
  Send,
  Edit3,
  CheckCircle,
  Clock,
  Building,
  Briefcase,
  Settings,
  Sparkles,
  Eye,
  Copy,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Message, Contact } from "@/lib/types/messages"

interface EmailTemplate {
  id: string
  name: string
  category: 'crisis_escalation' | 'client_notification' | 'team_coordination' | 'stakeholder_update'
  tone: 'professional' | 'urgent' | 'diplomatic' | 'direct'
  recipientType: 'client' | 'supplier' | 'team' | 'management'
  subject: string
  content: string
  variables: string[]
  confidence: number
  usageContext: string
}

interface StakeholderGroup {
  id: string
  name: string
  type: 'client' | 'supplier' | 'team' | 'management'
  contacts: Contact[]
  priority: 'high' | 'medium' | 'low'
  notificationTiming: 'immediate' | 'scheduled' | 'after_supplier'
}

interface AIEmailTemplateSystemProps {
  message: Message
  onTemplateSelect: (template: EmailTemplate, recipients: Contact[]) => void
  className?: string
}

const getEmailTemplates = (message: Message): EmailTemplate[] => {
  if (message.sender?.company?.includes('British Gas Commercial')) {
    return [
      {
        id: 'crisis-client-notification',
        name: 'Client Crisis Notification',
        category: 'client_notification',
        tone: 'diplomatic',
        recipientType: 'client',
        subject: 'Marchmont House Project Update - Timeline Adjustment Required',
        content: `Dear [CLIENT_NAME],\n\nI hope this message finds you well. I'm writing to provide you with an important update regarding the Marchmont House Heritage restoration project.\n\nSituation Overview:\nWe've encountered an unexpected challenge with our gas connection permit, which expired 6 days ago and is now affecting our project timeline. This is a regulatory requirement that must be resolved before gas utilities can be connected.\n\nCurrent Impact:\n• Original completion date: May 15, 2024\n• Revised completion estimate: May 20-28, 2024 (5-13 day delay)\n• Additional costs: £12,000-£31,000 depending on resolution speed\n\nImmediate Actions Taken:\n✓ Emergency permit renewal application submitted\n✓ Direct contact with local authority permit office\n✓ Historic England liaison engaged for expedited processing\n✓ Alternative timeline scenarios prepared\n✓ Daily project coordination calls established\n\nNext Steps:\n1. Permit status update expected by [DATE]\n2. Revised timeline confirmation within 48 hours\n3. Daily progress updates until resolution\n\nI want to assure you that this situation has our highest priority attention. While the delay is unfortunate, we're taking every possible step to minimize its impact and ensure the project's continued excellence.\n\nI'll call you personally by [TIME] today to discuss this in detail and answer any questions you may have.\n\nWarm regards,\nEmily Johnson\nOperations Director\n[PHONE] | [EMAIL]`,
        variables: ['CLIENT_NAME', 'DATE', 'TIME', 'PHONE', 'EMAIL'],
        confidence: 0.95,
        usageContext: 'High-stakes client communication requiring transparency and reassurance'
      },
      {
        id: 'supplier-escalation',
        name: 'Supplier Crisis Escalation',
        category: 'crisis_escalation',
        tone: 'professional',
        recipientType: 'supplier',
        subject: 'URGENT: Marchmont Gas Connection - Escalated Resolution Required',
        content: `David,\n\nThank you for bringing the permit situation to my attention. I fully understand the critical nature of this 6-day delay and its impact on both our organizations.\n\nImmediate Response Plan:\n\nWithin Next 2 Hours:\n• Direct contact with permit office (I'll personally call)\n• Historic England liaison for expedited processing\n• Alternative supplier consultation as backup option\n• Legal review of permit requirements\n\nToday's Actions:\n• Client notification with transparent timeline\n• Emergency stakeholder coordination meeting\n• Daily progress tracking protocol established\n• Cost impact analysis and documentation\n\nCommitments:\n✓ Personal involvement in permit resolution\n✓ 2-hour status updates between our teams\n✓ Flexible rescheduling once permits secured\n✓ Full documentation for future prevention\n\nFinancial Understanding:\nI acknowledge the £2,400/day delay cost impact and will work to minimize exposure for both parties. Our relationship is important, and we'll navigate this together.\n\nI'll call you at [TIME] with a definitive action plan and timeline. This has my personal guarantee of highest priority attention.\n\nThank you for your partnership during this challenge.\n\nBest regards,\nEmily Johnson\nOperations Director\nDirect: [PHONE] | [EMAIL]`,
        variables: ['TIME', 'PHONE', 'EMAIL'],
        confidence: 0.92,
        usageContext: 'Crisis escalation requiring supplier partnership and urgent coordination'
      },
      {
        id: 'team-coordination',
        name: 'Internal Team Coordination',
        category: 'team_coordination',
        tone: 'direct',
        recipientType: 'team',
        subject: 'URGENT TEAM BRIEFING: Marchmont Gas Connection Crisis - All Hands',
        content: `Team,\n\nUrgent situation requiring immediate attention and coordination.\n\nSITUATION:\n• Gas connection permit expired 6 days ago\n• Project completion at risk (May 15 → May 20-28)\n• Multiple trades affected: Electrical, Plumbing, HVAC, Finishing\n• Daily cost impact: £2,400\n• Client notification scheduled for 3pm today\n\nIMMEDIATE ACTIONS REQUIRED:\n\n[PROJECT_MANAGER]: \n• Contact permit office immediately\n• Prepare 3 timeline scenarios for client meeting\n• Document all decisions for audit trail\n\n[SITE_SUPERVISOR]:\n• Notify affected trades of potential delays\n• Assess work-around possibilities\n• Secure site compliance during permit gap\n\n[CLIENT_RELATIONS]:\n• Prepare client communication materials\n• Schedule follow-up calls with affected parties\n• Monitor client satisfaction metrics\n\n[FINANCE]:\n• Calculate exact cost impacts per scenario\n• Prepare change order documentation\n• Review insurance/penalty clauses\n\nCOORDINATION PROTOCOL:\n• Daily team calls at 9am until resolved\n• Immediate escalation for any new issues\n• Client updates every 24 hours minimum\n• Documentation of all communications\n\nThis is our top priority. Questions to me immediately.\n\nEmily\n[PHONE] | Available 24/7`,
        variables: ['PROJECT_MANAGER', 'SITE_SUPERVISOR', 'PHONE'],
        confidence: 0.94,
        usageContext: 'Internal crisis coordination requiring clear action items and accountability'
      },
      {
        id: 'management-briefing',
        name: 'Senior Management Briefing',
        category: 'stakeholder_update',
        tone: 'professional',
        recipientType: 'management',
        subject: 'Executive Brief: Marchmont Project Crisis - Risk Assessment & Response',
        content: `[EXECUTIVE_TEAM],\n\nExecutive summary of critical situation requiring board awareness.\n\nPROJECT: Marchmont House Heritage Restoration\nCONTRACT VALUE: £120,000\nCLIENT: Marchmont Trust (Heritage Sector)\n\nCRISIS OVERVIEW:\nGas connection permit expired 6 days ago, threatening project completion deadline and client relationship.\n\nFINANCIAL IMPACT:\nBest Case: £12,000 additional costs (5-day delay)\nRealistic Case: £31,200 additional costs (13-day delay)\nWorst Case: £50,400 additional costs (21-day delay)\n\nSTRATEGIC IMPLICATIONS:\n• Heritage sector reputation at stake\n• Potential precedent for future regulatory challenges\n• Client relationship management critical\n• Media attention possible (historic property)\n\nRESPONSE STRATEGY:\n✓ Personal leadership engagement (Emily Johnson)\n✓ Transparent client communication\n✓ Regulatory relationship building\n✓ Process improvement implementation\n✓ Legal protection review\n\nNEXT 48 HOURS:\n• Permit resolution expected\n• Client relationship secured\n• Timeline confirmed\n• Cost exposure finalized\n• Process improvements identified\n\nRECOMMENDATION:\nSupport current response strategy. Situation contained with minimal strategic risk if handled properly.\n\nQuestions or concerns: [PHONE] | [EMAIL]\n\nEmily Johnson\nOperations Director`,
        variables: ['EXECUTIVE_TEAM', 'PHONE', 'EMAIL'],
        confidence: 0.97,
        usageContext: 'Executive briefing requiring strategic context and risk assessment'
      }
    ]
  }
  return []
}

const getStakeholderGroups = (message: Message): StakeholderGroup[] => {
  if (message.sender?.company?.includes('British Gas Commercial')) {
    return [
      {
        id: 'client-group',
        name: 'Client Stakeholders',
        type: 'client',
        contacts: [
          {
            id: 'marchmont-trust',
            name: 'Sarah Marchmont',
            email: 'sarah@marchmontrust.org.uk',
            company: 'Marchmont Trust',
            category: 'client',
            reliabilityScore: 9,
            avgResponseTime: 0.8,
            isVip: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        priority: 'high',
        notificationTiming: 'scheduled'
      },
      {
        id: 'supplier-group',
        name: 'Critical Suppliers',
        type: 'supplier',
        contacts: [message.sender!],
        priority: 'high',
        notificationTiming: 'immediate'
      },
      {
        id: 'project-team',
        name: 'Project Team',
        type: 'team',
        contacts: [
          {
            id: 'project-manager',
            name: 'Tom Brown',
            email: 'tom@silverlining.co.uk',
            company: 'Silver Lining Construction',
            category: 'team',
            reliabilityScore: 9,
            avgResponseTime: 0.3,
            isVip: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'site-supervisor',
            name: 'Emma Davis',
            email: 'emma@silverlining.co.uk',
            company: 'Silver Lining Construction',
            category: 'team',
            reliabilityScore: 8,
            avgResponseTime: 0.5,
            isVip: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        priority: 'high',
        notificationTiming: 'immediate'
      },
      {
        id: 'management-group',
        name: 'Senior Management',
        type: 'management',
        contacts: [
          {
            id: 'ceo',
            name: 'James Wilson',
            email: 'james@silverlining.co.uk',
            company: 'Silver Lining Construction',
            category: 'team',
            reliabilityScore: 10,
            avgResponseTime: 2.0,
            isVip: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        priority: 'medium',
        notificationTiming: 'scheduled'
      }
    ]
  }
  return []
}

export function AIEmailTemplateSystem({ message, onTemplateSelect, className }: AIEmailTemplateSystemProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [selectedStakeholders, setSelectedStakeholders] = useState<StakeholderGroup[]>([])
  const [customizations, setCustomizations] = useState<Record<string, string>>({})
  
  const templates = getEmailTemplates(message)
  const stakeholderGroups = getStakeholderGroups(message)

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    // Initialize customizations with current date/time
    const now = new Date()
    setCustomizations({
      DATE: now.toLocaleDateString('en-GB'),
      TIME: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      PHONE: '07XXX XXX XXX',
      EMAIL: 'emily@silverlining.co.uk',
      CLIENT_NAME: 'Sarah',
      PROJECT_MANAGER: 'Tom Brown',
      SITE_SUPERVISOR: 'Emma Davis',
      EXECUTIVE_TEAM: 'Board Members'
    })
  }

  const handleStakeholderToggle = (group: StakeholderGroup) => {
    setSelectedStakeholders(prev => {
      const exists = prev.find(g => g.id === group.id)
      if (exists) {
        return prev.filter(g => g.id !== group.id)
      } else {
        return [...prev, group]
      }
    })
  }

  const getPersonalizedContent = (template: EmailTemplate) => {
    let content = template.content
    template.variables.forEach(variable => {
      const value = customizations[variable] || `[${variable}]`
      content = content.replace(new RegExp(`\\[${variable}\\]`, 'g'), value)
    })
    return content
  }

  const handleSendEmails = () => {
    if (!selectedTemplate) return
    
    selectedStakeholders.forEach(group => {
      group.contacts.forEach(contact => {
        onTemplateSelect(selectedTemplate, [contact])
      })
    })
  }

  if (templates.length === 0) return null

  return (
    <div className={cn("space-y-4", className)}>
      {/* AI Template Header */}
      <Card className="border-2 border-purple-200 bg-purple-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg text-purple-800">
              AI Email Template System
            </CardTitle>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              Smart Communication
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-purple-700">
            AI-generated professional email templates tailored for crisis communication and stakeholder management.
          </p>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={cn(
              "cursor-pointer transition-all border-2",
              selectedTemplate?.id === template.id 
                ? 'border-purple-500 bg-purple-50 ring-2 ring-offset-2 ring-purple-500'
                : 'border-gray-200 hover:border-gray-300'
            )}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-gray-800">
                    {template.name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-1"
                  >
                    {Math.round(template.confidence * 100)}%
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {template.usageContext}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.tone}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.recipientType}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>Email</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <>
          {/* Stakeholder Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Select Recipients</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stakeholderGroups.map((group) => (
                  <div 
                    key={group.id}
                    className={cn(
                      "p-3 rounded-lg border-2 cursor-pointer transition-all",
                      selectedStakeholders.find(g => g.id === group.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() => handleStakeholderToggle(group)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{group.name}</h4>
                      <Badge 
                        variant={group.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {group.priority}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {group.contacts.map((contact, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          <span>{contact.name} ({contact.email})</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Send: {group.notificationTiming.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Template Preview</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                  <Input 
                    value={selectedTemplate.subject}
                    className="bg-gray-50 border-gray-200"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Content</label>
                  <Textarea 
                    value={getPersonalizedContent(selectedTemplate)}
                    className="bg-gray-50 border-gray-200 min-h-[200px] font-mono text-xs"
                    readOnly
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-gray-500">
                    Recipients: {selectedStakeholders.reduce((acc, group) => acc + group.contacts.length, 0)} contacts
                  </div>
                  <Button 
                    onClick={handleSendEmails}
                    disabled={selectedStakeholders.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Emails ({selectedStakeholders.reduce((acc, group) => acc + group.contacts.length, 0)})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}