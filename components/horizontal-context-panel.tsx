"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building,
  Users,
  Lightbulb,
  Clock,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Message } from "@/lib/types/messages"

interface HorizontalContextPanelProps {
  message: Message
  isVisible: boolean
  onClose: () => void
  onReply?: (message: Message) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export function HorizontalContextPanel({ 
  message, 
  isVisible, 
  onClose, 
  onReply,
  isCollapsed = false,
  onToggleCollapse,
  className 
}: HorizontalContextPanelProps) {
  if (!isVisible) return null

  return (
    <div className={cn(
      "bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-300 shadow-sm transition-all duration-300",
      isCollapsed ? "py-2" : "py-4",
      className
    )}>
      <div className="container mx-auto px-6">
        {/* Header with collapse toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Context for Reply
            </h3>
            <Badge variant="outline" className="text-xs">
              {message.priority.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            {onReply && (
              <Button
                onClick={() => onReply(message)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Reply
              </Button>
            )}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-8 w-8 p-0"
              >
                {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Information */}
            {message.project && (
              <Card className="bg-white/70 border-blue-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center text-blue-800">
                    <Building className="h-4 w-4 mr-2" />
                    PROJECT: {message.project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <div className="font-semibold text-gray-900">
                        £{message.project.budget.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Spent:</span>
                      <div className="font-semibold text-gray-900">
                        £{message.project.spent.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Timeline:</span>
                      <div className="font-semibold text-gray-900">
                        Week {message.project.timeline.currentWeek} of {message.project.timeline.totalWeeks}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge 
                        variant={message.project.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {message.project.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            {message.sender && (
              <Card className="bg-white/70 border-green-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center text-green-800">
                    <Users className="h-4 w-4 mr-2" />
                    CONTACT: {message.sender.company || message.sender.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Reliability:</span>
                      <div className="font-semibold text-gray-900">
                        {message.sender.reliabilityScore}/10
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Response:</span>
                      <div className="font-semibold text-gray-900">
                        {message.sender.avgResponseTime} days
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {message.category}
                      </Badge>
                    </div>
                    {message.sender.isVip && (
                      <div>
                        <Badge variant="default" className="text-xs bg-gold text-gold-foreground">
                          VIP Client
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Optional Suggestions */}
            <Card className="bg-white/70 border-amber-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center text-amber-800">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  OPTIONAL SUGGESTIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-gray-600 mb-3">
                  You may want to consider:
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs h-8 bg-white/50 hover:bg-white/80"
                  >
                    <Clock className="h-3 w-3 mr-2" />
                    Schedule follow-up in 24h
                  </Button>
                  
                  {message.category === 'external' && message.sender && message.sender.reliabilityScore < 7 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs h-8 bg-white/50 hover:bg-white/80"
                    >
                      <AlertTriangle className="h-3 w-3 mr-2" />
                      Consider escalation
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs h-8 bg-white/50 hover:bg-white/80"
                  >
                    <Users className="h-3 w-3 mr-2" />
                    CC project manager
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                  Your decision • These are optional recommendations
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Collapsed view shows just essential info */}
        {isCollapsed && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              {message.project && (
                <span className="flex items-center text-blue-700">
                  <Building className="h-4 w-4 mr-1" />
                  {message.project.name}
                </span>
              )}
              {message.sender && (
                <span className="flex items-center text-green-700">
                  <Users className="h-4 w-4 mr-1" />
                  {message.sender.company || message.sender.name}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-600">
              Context available • Your decision
            </div>
          </div>
        )}
      </div>
    </div>
  )
}