"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Sparkles, 
  Send, 
  Copy, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Building
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Message, AISuggestion } from "@/lib/types/messages"

interface AIResponseModalProps {
  isOpen: boolean
  onClose: () => void
  message: Message | null
}

// Mock AI suggestions - in real app this would come from API
const generateMockSuggestions = (message: Message | null): AISuggestion[] => {
  if (!message) return []
  
  if (message.priority === 'urgent' && message.sender?.company?.includes('Thames Water')) {
    return [
      {
        id: 'ai-1',
        type: 'response_draft',
        title: 'Professional Escalation Response',
        content: `Hi there,\n\nThank you for notifying us about the excavation permit expiry. This is indeed critical for the Henderson Golf Project timeline.\n\nImmediate actions taken:\n• Contacted permit office this morning\n• Expedited renewal submitted with priority handling\n• Site safety protocols implemented during wait period\n\nI'll update you within 2 hours with the renewal status. We're working to minimize any delays to the £2,400/day cost impact.\n\nKind regards,\nEmily Johnson\nOperations Director`,
        confidence: 0.92,
        metadata: { tone: 'professional', urgency: 'high', includes_timeline: true }
      },
      {
        id: 'ai-2',
        type: 'response_draft',
        title: 'Direct & Urgent Response',
        content: `URGENT: Excavation permit renewal in progress.\n\nActions:\n1. Emergency permit application submitted - 2hr processing\n2. Site secured and compliant during interim\n3. All trades notified of temporary hold\n\nExpected resolution: Today 4pm\nDaily delay cost: £2,400 (tracking for billing)\n\nWill call you at 4pm with update.\n\nEmily Johnson\n07XXX XXX XXX`,
        confidence: 0.88,
        metadata: { tone: 'urgent', direct: true, includes_contact: true }
      },
      {
        id: 'ai-3',
        type: 'action_suggestion',
        title: 'Proactive Follow-up Actions',
        content: 'Schedule automatic permit renewal reminders 30 days before expiry for all future projects. Add to project management checklist.',
        confidence: 0.95,
        metadata: { type: 'process_improvement' }
      }
    ]
  }
  
  if (message.category === 'team' && message.content.includes('delivery delayed')) {
    return [
      {
        id: 'ai-4',
        type: 'response_draft',
        title: 'Solution-Focused Team Response',
        content: `Hi Andre,\n\nThanks for the heads up on the heritage paint delay.\n\nAlternative solutions:\n• Local specialist supplier (Farrow & Ball) has matching heritage colors in stock\n• 24hr delivery available for £45 premium\n• Quality equivalent to original specification\n\nShall I arrange the alternative delivery for tomorrow morning? This keeps us on schedule.\n\nLet me know ASAP so I can coordinate.\n\nEmily`,
        confidence: 0.90,
        metadata: { solution_focused: true, includes_alternatives: true }
      },
      {
        id: 'ai-5',
        type: 'response_draft',
        title: 'Quick Problem-Solver Response',
        content: `Andre - paint delay noted.\n\nQuick fix: Heritage paint specialist 2 miles away has exact match in stock. Can collect today or deliver tomorrow AM.\n\nCost: +£45 for rush delivery vs 3-day delay cost.\n\nYour call - shall I arrange pickup/delivery?\n\nEmily\n07XXX XXX XXX`,
        confidence: 0.85,
        metadata: { informal: true, quick_solution: true }
      }
    ]
  }
  
  // Default suggestions for other message types
  return [
    {
      id: 'ai-default',
      type: 'response_draft',
      title: 'Professional Acknowledgment',
      content: `Thank you for your message regarding ${message.project?.name || 'the project'}.\n\nI'll review the details and get back to you within 24 hours with a comprehensive response.\n\nBest regards,\nEmily Johnson`,
      confidence: 0.75,
      metadata: { tone: 'professional', acknowledgment: true }
    }
  ]
}

export function AIResponseModal({ isOpen, onClose, message }: AIResponseModalProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null)
  const [editedResponse, setEditedResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const suggestions = generateMockSuggestions(message)

  // Load existing draft when modal opens
  useEffect(() => {
    if (isOpen && message) {
      loadDraft()
    }
  }, [isOpen, message])

  // Auto-save functionality
  const saveDraft = useCallback(async () => {
    if (!message || !editedResponse.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: message.id,
          content: editedResponse,
          channel: message.source,
          recipientId: message.senderId,
          subject: `Re: ${message.subject}`,
          autoSaveInterval: 30000
        })
      })

      const result = await response.json()
      if (result.success) {
        setLastSaved(result.lastSaved)
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [message, editedResponse])

  // Auto-save every 30 seconds when typing
  useEffect(() => {
    if (!editedResponse.trim()) return

    const timeoutId = setTimeout(() => {
      saveDraft()
    }, 30000)

    return () => clearTimeout(timeoutId)
  }, [editedResponse, saveDraft])

  const loadDraft = async () => {
    if (!message) return

    try {
      const response = await fetch(`/api/drafts?messageId=${message.id}`)
      const result = await response.json()
      
      if (result.success && result.draft) {
        setEditedResponse(result.draft.content)
        setLastSaved(result.draft.metadata.lastSaved)
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
  }

  const deleteDraftAfterSend = async () => {
    if (!message) return
    
    try {
      await fetch(`/api/drafts?messageId=${message.id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Failed to delete draft:', error)
    }
  }
  
  const handleSuggestionSelect = (suggestion: AISuggestion) => {
    setSelectedSuggestion(suggestion)
    setEditedResponse(suggestion.content)
  }
  
  const handleRegenerateResponse = async () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      // In real app, would fetch new suggestions from API
    }, 2000)
  }
  
  const handleSendResponse = async () => {
    if (!message || !editedResponse.trim()) return

    setIsGenerating(true) // Use existing loading state
    
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: message.source,
          recipientId: message.senderId,
          content: editedResponse,
          subject: `Re: ${message.subject}`,
          originalMessageId: message.id,
          sentBy: 'Emily Johnson', // In real app, get from user session
          templateId: selectedSuggestion?.id.includes('template') ? selectedSuggestion.id : undefined,
          signature: 'Emily Johnson\nOperations Director',
          priority: message.priority === 'urgent' ? 'high' : 'normal'
        })
      })

      const result = await response.json()

      if (result.success) {
        // Show success notification (you could add a toast here)
        console.log('Message sent successfully:', result.replyId)
        
        // Delete the draft after successful send
        await deleteDraftAfterSend()
        
        // Close modal after success
        onClose()
        
        // In a real app, you might want to refresh the messages list
        // or update the message status in the parent component
      } else {
        // Show error notification
        console.error('Failed to send message:', result.error)
        alert(`Failed to send message: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleCopyResponse = () => {
    navigator.clipboard.writeText(editedResponse)
    // Could show a toast notification here
  }
  
  if (!message) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span>AI Response Assistant</span>
          </DialogTitle>
          <DialogDescription>
            Generate and customize AI-powered responses for this message
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
          {/* Original Message Context */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Original Message
              </h3>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.sender?.avatar} />
                      <AvatarFallback>
                        {message.sender?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {message.sender?.company || message.sender?.name}
                        </span>
                        <Badge 
                          variant={message.priority === 'urgent' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {message.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {message.project?.name} • {new Date(message.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium mb-2">{message.subject}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {message.content}
                  </p>
                  
                  {message.dueDate && (
                    <div className="flex items-center space-x-2 mt-3 p-2 bg-orange-50 rounded-lg">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">
                        Response due: {new Date(message.dueDate).toLocaleString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* AI Suggestions List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Suggestions
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRegenerateResponse}
                  disabled={isGenerating}
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
                  Regenerate
                </Button>
              </div>
              
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <Card 
                      key={suggestion.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-gray-50",
                        selectedSuggestion?.id === suggestion.id && "ring-2 ring-blue-500"
                      )}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(suggestion.confidence * 100)}% match
                            </Badge>
                            {suggestion.type === 'action_suggestion' && (
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {suggestion.content.substring(0, 120)}...
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Response Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Response Editor
              </h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyResponse}
                  disabled={!editedResponse}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-green-600"
                  disabled={!selectedSuggestion}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600"
                  disabled={!selectedSuggestion}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {selectedSuggestion ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{selectedSuggestion.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(selectedSuggestion.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-800">
                    AI-generated response based on context and best practices
                  </p>
                </div>
                
                <Textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  className="min-h-[300px] resize-none"
                  placeholder="Edit the AI-generated response or write your own..."
                />
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>{editedResponse.length} characters</span>
                    {lastSaved && (
                      <span className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        Last saved: {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    {isSaving && (
                      <span className="flex items-center text-xs text-blue-600">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                        Saving...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Grammar checked
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-blue-500" />
                      Professional tone
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="space-y-2">
                  <Sparkles className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Select an AI suggestion to start editing your response
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>
              Sending via {message.source === 'email' ? 'Email' : 
                          message.source === 'whatsapp' ? 'WhatsApp' : 
                          message.source === 'sms' ? 'SMS' : 'Phone'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendResponse}
              disabled={!editedResponse.trim() || isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Response
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}