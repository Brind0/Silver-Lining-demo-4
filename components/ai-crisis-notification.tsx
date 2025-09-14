"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  X, 
  MessageSquare, 
  Clock,
  DollarSign,
  TrendingDown,
  Bot,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CrisisData {
  id: string
  type: 'timeline_risk' | 'budget_overrun' | 'supplier_delay' | 'permit_issue'
  title: string
  description: string
  severity: 'high' | 'critical'
  timelineImpact: number // days
  costImpact: number // currency
  messageId?: string
  projectId: string
  affectedTrades: string[]
  autoDetectedAt: string
}

interface AICrisisNotificationProps {
  projectId: string
  className?: string
}

// Mock crisis detection - in real app this would come from AI analysis
const detectProjectCrises = (projectId: string): CrisisData[] => {
  if (projectId === '2' || projectId === 2 || projectId === 'marchmont-heritage') { // Marchmont Historic project
    return [{
      id: 'gas-delay-crisis-001',
      type: 'supplier_delay',
      title: 'Gas Connection Overdue - Timeline Risk Detected',
      description: '6-day delay threatens May 15 completion, £12k cost impact, affects 4 trades',
      severity: 'critical',
      timelineImpact: 21,
      costImpact: 12000,
      messageId: '5',
      projectId: projectId,
      affectedTrades: ['electrical', 'plumbing', 'hvac', 'finishing'],
      autoDetectedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
    }]
  }
  return []
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'border-red-500 bg-red-50/50'
    case 'high': return 'border-amber-500 bg-amber-50/50'
    default: return 'border-gray-300 bg-gray-50/50'
  }
}

const getSeverityTextColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-700'
    case 'high': return 'text-amber-700'
    default: return 'text-gray-700'
  }
}

export function AICrisisNotification({ projectId, className }: AICrisisNotificationProps) {
  const [crises, setCrises] = useState<CrisisData[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [dismissedCrises, setDismissedCrises] = useState<string[]>([])

  useEffect(() => {
    // Reset dismissed crises when projectId changes (for demo purposes)
    setDismissedCrises([])
    setIsVisible(false)
    
    // Simulate AI crisis detection
    const detectedCrises = detectProjectCrises(projectId)
    setCrises(detectedCrises)
    
    if (detectedCrises.length > 0) {
      // Show notification with slight delay for dramatic effect
      setTimeout(() => {
        setIsVisible(true)
      }, 1500)
    }
  }, [projectId])
  
  // Handle dismissed crises separately
  useEffect(() => {
    if (crises.length > 0) {
      const activeCrises = crises.filter(crisis => !dismissedCrises.includes(crisis.id))
      if (activeCrises.length === 0) {
        setIsVisible(false)
      }
    }
  }, [dismissedCrises, crises])

  const handleDismiss = (crisisId: string) => {
    setDismissedCrises(prev => [...prev, crisisId])
    setCrises(prev => prev.filter(c => c.id !== crisisId))
    if (crises.length <= 1) {
      setIsVisible(false)
    }
  }

  const handleViewMessage = (crisis: CrisisData) => {
    // Navigate to messages page with the specific message selected and auto-trigger AI query
    if (crisis.messageId) {
      window.location.href = `/messages?messageId=${crisis.messageId}&openAI=true&autoQuery=gas-delays-impact`
    } else {
      window.location.href = '/messages'
    }
  }

  const activeCrises = crises.filter(crisis => !dismissedCrises.includes(crisis.id))


  if (!isVisible || activeCrises.length === 0) {
    return null
  }

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]",
      "animate-in slide-in-from-right-5 duration-500",
      className
    )}>
      {activeCrises.map((crisis) => (
        <Card 
          key={crisis.id}
          className={cn(
            "border-2 shadow-lg backdrop-blur-sm",
            getSeverityColor(crisis.severity),
            "mb-2 last:mb-0"
          )}
        >
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <Badge 
                  variant="outline" 
                  className="text-xs font-semibold border-2 px-2 py-1 bg-blue-100 text-blue-800 border-blue-300"
                >
                  AI AGENT
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(crisis.id)}
                className="h-8 w-8 p-0 hover:bg-white/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Alert Content */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className={cn(
                  "h-5 w-5 mt-0.5 flex-shrink-0",
                  crisis.severity === 'critical' ? 'text-red-500' : 'text-amber-500'
                )} />
                <div className="min-w-0">
                  <h3 className={cn(
                    "font-semibold text-sm leading-tight",
                    getSeverityTextColor(crisis.severity)
                  )}>
                    {crisis.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {crisis.description}
                  </p>
                </div>
              </div>

              {/* Impact Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">
                    +{crisis.timelineImpact} days
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">
                    £{(crisis.costImpact / 1000).toFixed(0)}k impact
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingDown className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">
                    {crisis.affectedTrades.length} trades affected
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bot className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600">
                    Auto-detected
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleViewMessage(crisis)}
                  className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Manage Issue
                </Button>
                <Link href="/messages" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs border-2 hover:bg-white/50"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Messages
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}