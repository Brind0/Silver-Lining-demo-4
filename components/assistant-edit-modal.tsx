"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, User, Send, Loader2, CheckCircle, Calendar, DollarSign, Users, Clock } from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: {
    type: string
    description: string
    changes: Record<string, any>
    status: 'pending' | 'confirmed' | 'executing' | 'completed'
  }
}

interface AssistantEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectData: {
    id: number
    name: string
    client: string
    budget: number
    spent: number
    progress: number
    status: string
    startDate: string
    endDate: string
    team: Array<{ name: string; role: string }>
  }
  onProjectUpdate: (updates: Record<string, any>) => void
}

export function AssistantEditModal({ 
  open, 
  onOpenChange, 
  projectData, 
  onProjectUpdate 
}: AssistantEditModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your project assistant for "${projectData.name}". I can help you make changes to your project quickly and easily. Just tell me what you'd like to update - I can handle budget adjustments, timeline changes, team modifications, status updates, and more!`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Parse user intent and generate response
    const assistantResponse = await processUserRequest(input.trim())
    
    setMessages(prev => [...prev, assistantResponse])
    setIsProcessing(false)
  }

  const processUserRequest = async (request: string): Promise<Message> => {
    const lowerRequest = request.toLowerCase()
    
    // Budget-related requests
    if (lowerRequest.includes('budget') || lowerRequest.includes('£') || lowerRequest.includes('cost')) {
      const budgetMatch = request.match(/£?([\d,]+)/g)
      if (budgetMatch) {
        const newBudget = parseInt(budgetMatch[0].replace(/[£,]/g, ''))
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I can help you update the budget. I found that you want to set it to £${newBudget.toLocaleString()}. This would change the budget from £${projectData.budget.toLocaleString()} to £${newBudget.toLocaleString()}.`,
          timestamp: new Date(),
          action: {
            type: 'budget_update',
            description: `Update project budget to £${newBudget.toLocaleString()}`,
            changes: { budget: newBudget },
            status: 'pending'
          }
        }
      }
    }

    // Timeline/deadline requests
    if (lowerRequest.includes('deadline') || lowerRequest.includes('timeline') || lowerRequest.includes('extend') || lowerRequest.includes('date')) {
      const daysMatch = request.match(/(\d+)\s*(day|week|month)/g)
      if (daysMatch && lowerRequest.includes('extend')) {
        const days = parseInt(daysMatch[0])
        const currentEnd = new Date(projectData.endDate)
        const newEnd = new Date(currentEnd)
        
        if (lowerRequest.includes('week')) {
          newEnd.setDate(newEnd.getDate() + (days * 7))
        } else if (lowerRequest.includes('month')) {
          newEnd.setMonth(newEnd.getMonth() + days)
        } else {
          newEnd.setDate(newEnd.getDate() + days)
        }

        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I can extend the project deadline by ${daysMatch[0]}. This would move the end date from ${currentEnd.toLocaleDateString()} to ${newEnd.toLocaleDateString()}.`,
          timestamp: new Date(),
          action: {
            type: 'timeline_update',
            description: `Extend deadline by ${daysMatch[0]}`,
            changes: { endDate: newEnd.toISOString() },
            status: 'pending'
          }
        }
      }
    }

    // Team-related requests
    if (lowerRequest.includes('team') || lowerRequest.includes('add') || lowerRequest.includes('member')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I can help you manage the team. Could you provide more details? For example: "Add Sarah Wilson as a Project Manager" or "Remove John from the team".`,
        timestamp: new Date()
      }
    }

    // Status updates
    if (lowerRequest.includes('status') || lowerRequest.includes('critical') || lowerRequest.includes('risk') || lowerRequest.includes('progress')) {
      let newStatus = ''
      if (lowerRequest.includes('critical') || lowerRequest.includes('red')) {
        newStatus = 'RED'
      } else if (lowerRequest.includes('risk') || lowerRequest.includes('amber')) {
        newStatus = 'AMBER'
      } else if (lowerRequest.includes('progress') || lowerRequest.includes('green')) {
        newStatus = 'GREEN'
      }

      if (newStatus) {
        const statusText = newStatus === 'RED' ? 'Critical' : newStatus === 'AMBER' ? 'At Risk' : 'On Progress'
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I can update the project status to "${statusText}". This will change the status indicator and may trigger different alert levels.`,
          timestamp: new Date(),
          action: {
            type: 'status_update',
            description: `Update project status to ${statusText}`,
            changes: { status: newStatus },
            status: 'pending'
          }
        }
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I understand you want to make changes to the project. I can help with:
      
• **Budget adjustments** - "Increase budget by £5000" or "Set budget to £50000"
• **Timeline changes** - "Extend deadline by 2 weeks" or "Move end date to March 15th"
• **Status updates** - "Mark as critical" or "Change status to at risk"
• **Team management** - "Add team member" or "Update project manager"
• **Progress tracking** - "Update progress to 90%" or "Mark phase as complete"

What specific change would you like to make?`,
      timestamp: new Date()
    }
  }

  const executeAction = async (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId && msg.action 
        ? { ...msg, action: { ...msg.action, status: 'executing' } }
        : msg
    ))

    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 2000))

    const message = messages.find(m => m.id === messageId)
    if (message?.action) {
      onProjectUpdate(message.action.changes)
      
      setMessages(prev => [
        ...prev.map(msg => 
          msg.id === messageId && msg.action 
            ? { ...msg, action: { ...msg.action, status: 'completed' } }
            : msg
        ),
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✅ Changes have been successfully applied! The project has been updated and all changes have been saved to the database.`,
          timestamp: new Date()
        }
      ])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            Project Assistant - {projectData.name}
          </DialogTitle>
        </DialogHeader>

        {/* Project Context Bar */}
        <div className="bg-muted p-3 rounded-lg flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            £{projectData.budget.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {projectData.progress}%
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(projectData.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {projectData.team.length} members
          </div>
          <Badge variant={projectData.status === 'RED' ? 'destructive' : 'secondary'}>
            {projectData.status}
          </Badge>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto pr-4 max-h-96 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'assistant' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg ${
                    message.role === 'assistant' 
                      ? 'bg-muted text-foreground' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                  
                  {/* Action Card */}
                  {message.action && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-blue-900">{message.action.description}</p>
                          <p className="text-xs text-blue-600 mt-1">
                            {message.action.status === 'pending' && 'Ready to execute'}
                            {message.action.status === 'executing' && 'Applying changes...'}
                            {message.action.status === 'completed' && 'Successfully completed'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {message.action.status === 'executing' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                          {message.action.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                      
                      {message.action.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => executeAction(message.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Apply Changes
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setMessages(prev => prev.map(msg => 
                              msg.id === message.id 
                                ? { ...msg, action: undefined }
                                : msg
                            ))
                          }}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Assistant is thinking...
                </div>
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-200" />
        
        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            placeholder="Tell me what you'd like to change about the project..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isProcessing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}