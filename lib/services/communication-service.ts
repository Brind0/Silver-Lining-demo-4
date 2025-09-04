import { MessageSource, Reply, DeliveryStatus } from '@/lib/types/messages'
import { createReply, updateReplyStatus, createDeliveryStatus } from '@/lib/db/messages-db'

export interface SendMessageRequest {
  channel: MessageSource
  recipientId: string
  subject?: string
  content: string
  originalMessageId?: string
  templateId?: string
  sentBy: string
  metadata?: {
    signature?: string
    attachments?: string[]
    priority?: 'normal' | 'high'
  }
}

export interface SendMessageResponse {
  success: boolean
  replyId: string
  externalMessageId?: string
  error?: string
  estimatedDelivery?: string
}

export interface CommunicationProvider {
  sendEmail(to: string, subject: string, content: string, options?: any): Promise<{ success: boolean, messageId?: string, error?: string }>
  sendWhatsApp(to: string, content: string, options?: any): Promise<{ success: boolean, messageId?: string, error?: string }>
  sendSMS(to: string, content: string, options?: any): Promise<{ success: boolean, messageId?: string, error?: string }>
}

// Mock provider for development - replace with real integrations
class MockCommunicationProvider implements CommunicationProvider {
  async sendEmail(to: string, subject: string, content: string, options?: any) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05
    
    if (success) {
      return {
        success: true,
        messageId: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    } else {
      return {
        success: false,
        error: 'Email delivery failed: SMTP timeout'
      }
    }
  }

  async sendWhatsApp(to: string, content: string, options?: any) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const success = Math.random() > 0.02
    
    if (success) {
      return {
        success: true,
        messageId: `wa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    } else {
      return {
        success: false,
        error: 'WhatsApp delivery failed: Number not registered'
      }
    }
  }

  async sendSMS(to: string, content: string, options?: any) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const success = Math.random() > 0.03
    
    if (success) {
      return {
        success: true,
        messageId: `sms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    } else {
      return {
        success: false,
        error: 'SMS delivery failed: Invalid number format'
      }
    }
  }
}

export class CommunicationService {
  private provider: CommunicationProvider

  constructor(provider?: CommunicationProvider) {
    this.provider = provider || new MockCommunicationProvider()
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    // Generate unique reply ID
    const replyId = `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Create reply record in database with 'sending' status
      const reply: Omit<Reply, 'created_at' | 'updated_at'> = {
        id: replyId,
        originalMessageId: request.originalMessageId || '',
        content: request.content,
        channel: request.channel,
        recipientId: request.recipientId,
        subject: request.subject,
        status: 'sending',
        sentBy: request.sentBy,
        templateUsed: request.templateId,
        metadata: {
          signature: request.metadata?.signature,
          attachments: request.metadata?.attachments || []
        }
      }

      await createReply(reply)

      // Get recipient info for sending
      const recipient = await this.getRecipientInfo(request.recipientId)
      if (!recipient) {
        await this.updateDeliveryStatus(replyId, 'failed', 'Recipient not found')
        return {
          success: false,
          replyId,
          error: 'Recipient not found'
        }
      }

      // Send message based on channel
      let result: { success: boolean, messageId?: string, error?: string }
      
      switch (request.channel) {
        case 'email':
          if (!recipient.email) {
            throw new Error('Recipient email address not available')
          }
          result = await this.provider.sendEmail(
            recipient.email,
            request.subject || 'Message from Emily Johnson',
            this.formatEmailContent(request.content, request.metadata?.signature),
            { priority: request.metadata?.priority }
          )
          break

        case 'whatsapp':
          if (!recipient.phone) {
            throw new Error('Recipient phone number not available')
          }
          result = await this.provider.sendWhatsApp(
            recipient.phone,
            request.content
          )
          break

        case 'sms':
          if (!recipient.phone) {
            throw new Error('Recipient phone number not available')
          }
          result = await this.provider.sendSMS(
            recipient.phone,
            request.content
          )
          break

        default:
          throw new Error(`Unsupported channel: ${request.channel}`)
      }

      if (result.success) {
        // Update reply status to sent
        await updateReplyStatus(replyId, 'sent', {
          sentAt: new Date().toISOString()
        })

        // Update reply with external message ID
        if (result.messageId) {
          await this.updateReplyExternalId(replyId, request.channel, result.messageId)
        }

        // Create delivery status record
        await createDeliveryStatus({
          replyId,
          status: 'sent',
          timestamp: new Date().toISOString()
        })

        return {
          success: true,
          replyId,
          externalMessageId: result.messageId,
          estimatedDelivery: this.getEstimatedDeliveryTime(request.channel)
        }
      } else {
        await this.updateDeliveryStatus(replyId, 'failed', result.error || 'Unknown error')
        return {
          success: false,
          replyId,
          error: result.error || 'Unknown error'
        }
      }

    } catch (error) {
      console.error('Communication service error:', error)
      await this.updateDeliveryStatus(replyId, 'failed', error instanceof Error ? error.message : 'Unknown error')
      
      return {
        success: false,
        replyId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async getRecipientInfo(recipientId: string) {
    // In a real implementation, this would query the contacts database
    // For now, return mock data based on known contact IDs from seed data
    const mockRecipients: Record<string, { email?: string, phone?: string }> = {
      'henderson-golf': { email: 'info@hendersongolf.com' },
      'site-team-marchmont': { phone: '+44 7XXX XXX XXX' },
      'thames-water': { email: 'permits@thameswater.co.uk' },
      'historic-england': { email: 'enquiries@historicengland.org.uk' }
    }
    
    return mockRecipients[recipientId] || null
  }

  private formatEmailContent(content: string, signature?: string): string {
    let formatted = content

    // Add professional email formatting
    if (!formatted.includes('Dear') && !formatted.includes('Hi ')) {
      // Content already starts with a greeting
    } else if (!formatted.match(/^(Dear|Hi|Hello)/)) {
      formatted = `${formatted}`
    }

    // Add signature if provided
    if (signature) {
      formatted += `\n\n${signature}`
    } else {
      // Default professional signature
      formatted += `\n\nBest regards,\nEmily Johnson\nOperations Director\n\n--\nThis message was sent via our project management system.`
    }

    return formatted
  }

  private async updateDeliveryStatus(replyId: string, status: 'sent' | 'delivered' | 'read' | 'failed', error?: string) {
    await updateReplyStatus(replyId, status === 'failed' ? 'failed' : status, {
      failureReason: error
    })

    await createDeliveryStatus({
      replyId,
      status,
      timestamp: new Date().toISOString(),
      errorMessage: error
    })
  }

  private async updateReplyExternalId(replyId: string, channel: MessageSource, externalId: string) {
    // This would update the reply record with the external message ID
    // Implementation depends on your database structure
    console.log(`Reply ${replyId} sent via ${channel} with external ID: ${externalId}`)
  }

  private getEstimatedDeliveryTime(channel: MessageSource): string {
    const now = new Date()
    let estimatedMinutes: number

    switch (channel) {
      case 'email':
        estimatedMinutes = 2 // 2 minutes
        break
      case 'whatsapp':
        estimatedMinutes = 1 // 1 minute
        break
      case 'sms':
        estimatedMinutes = 1 // 1 minute
        break
      default:
        estimatedMinutes = 5
    }

    return new Date(now.getTime() + estimatedMinutes * 60000).toISOString()
  }

  // Webhook handlers for delivery status updates from providers
  async handleEmailDeliveryWebhook(data: any) {
    // Handle email delivery status updates from email provider
    const { replyId, status, timestamp } = this.parseEmailWebhookData(data)
    if (replyId) {
      await createDeliveryStatus({
        replyId,
        status,
        timestamp,
        providerResponse: data
      })
    }
  }

  async handleWhatsAppWebhook(data: any) {
    // Handle WhatsApp delivery status updates
    const { replyId, status, timestamp } = this.parseWhatsAppWebhookData(data)
    if (replyId) {
      await createDeliveryStatus({
        replyId,
        status,
        timestamp,
        providerResponse: data
      })
    }
  }

  async handleSMSWebhook(data: any) {
    // Handle SMS delivery status updates
    const { replyId, status, timestamp } = this.parseSMSWebhookData(data)
    if (replyId) {
      await createDeliveryStatus({
        replyId,
        status,
        timestamp,
        providerResponse: data
      })
    }
  }

  private parseEmailWebhookData(data: any): { replyId: string | null, status: 'sent' | 'delivered' | 'read' | 'failed', timestamp: string } {
    // Parse email provider webhook data
    return {
      replyId: data.replyId || null,
      status: data.status || 'sent',
      timestamp: data.timestamp || new Date().toISOString()
    }
  }

  private parseWhatsAppWebhookData(data: any): { replyId: string | null, status: 'sent' | 'delivered' | 'read' | 'failed', timestamp: string } {
    // Parse WhatsApp webhook data
    return {
      replyId: data.replyId || null,
      status: data.status || 'sent',
      timestamp: data.timestamp || new Date().toISOString()
    }
  }

  private parseSMSWebhookData(data: any): { replyId: string | null, status: 'sent' | 'delivered' | 'read' | 'failed', timestamp: string } {
    // Parse SMS provider webhook data
    return {
      replyId: data.replyId || null,
      status: data.status || 'sent',
      timestamp: data.timestamp || new Date().toISOString()
    }
  }
}

// Default instance
export const communicationService = new CommunicationService()

// Real provider implementations would go here:

/* Example real email provider using SendGrid:
class SendGridProvider implements CommunicationProvider {
  private apiKey: string
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }
  
  async sendEmail(to: string, subject: string, content: string, options?: any) {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(this.apiKey)
    
    try {
      const msg = {
        to,
        from: 'emily@yourcompany.com',
        subject,
        html: content,
        ...options
      }
      
      const response = await sgMail.send(msg)
      return { success: true, messageId: response[0].headers['x-message-id'] }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  // ... implement other methods
}
*/

/* Example WhatsApp provider using Twilio:
class TwilioWhatsAppProvider {
  async sendWhatsApp(to: string, content: string, options?: any) {
    const client = require('twilio')(accountSid, authToken)
    
    try {
      const message = await client.messages.create({
        body: content,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${to}`
      })
      
      return { success: true, messageId: message.sid }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
*/