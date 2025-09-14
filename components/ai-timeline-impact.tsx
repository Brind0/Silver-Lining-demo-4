"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  AlertTriangle, 
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bot,
  Users,
  Wrench,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineScenario {
  id: string
  name: string
  probability: number
  description: string
  completionDate: string
  delayDays: number
  additionalCost: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  impactedTrades: string[]
  keyMilestones: Milestone[]
}

interface Milestone {
  id: string
  name: string
  originalDate: string
  revisedDate: string
  status: 'completed' | 'at_risk' | 'delayed' | 'critical'
  dependencies: string[]
  trade: string
}

interface AITimelineImpactProps {
  projectId: string
  crisisType: 'gas_delay' | 'permit_expiry' | 'supplier_delay'
  className?: string
}

const getTimelineScenarios = (projectId: string, crisisType: string): TimelineScenario[] => {
  if (projectId === '2' && crisisType === 'gas_delay') {
    return [
      {
        id: 'best-case',
        name: 'Best Case',
        probability: 25,
        description: 'Permit renewed tomorrow, minimal disruption',
        completionDate: '2024-05-20',
        delayDays: 5,
        additionalCost: 12000,
        riskLevel: 'medium',
        impactedTrades: ['electrical', 'plumbing'],
        keyMilestones: [
          {
            id: 'gas-connection',
            name: 'Gas Connection',
            originalDate: '2024-05-10',
            revisedDate: '2024-05-13',
            status: 'delayed',
            dependencies: ['permit-renewal'],
            trade: 'utilities'
          },
          {
            id: 'electrical-work',
            name: 'Electrical Installation',
            originalDate: '2024-05-12',
            revisedDate: '2024-05-16',
            status: 'at_risk',
            dependencies: ['gas-connection'],
            trade: 'electrical'
          },
          {
            id: 'final-inspection',
            name: 'Final Inspection',
            originalDate: '2024-05-15',
            revisedDate: '2024-05-20',
            status: 'at_risk',
            dependencies: ['electrical-work'],
            trade: 'inspection'
          }
        ]
      },
      {
        id: 'realistic-case',
        name: 'Realistic Case',
        probability: 55,
        description: 'Permit issues continue for 3-5 days',
        completionDate: '2024-05-28',
        delayDays: 13,
        additionalCost: 31200,
        riskLevel: 'high',
        impactedTrades: ['electrical', 'plumbing', 'hvac', 'finishing'],
        keyMilestones: [
          {
            id: 'gas-connection',
            name: 'Gas Connection',
            originalDate: '2024-05-10',
            revisedDate: '2024-05-18',
            status: 'critical',
            dependencies: ['permit-renewal'],
            trade: 'utilities'
          },
          {
            id: 'electrical-work',
            name: 'Electrical Installation',
            originalDate: '2024-05-12',
            revisedDate: '2024-05-22',
            status: 'critical',
            dependencies: ['gas-connection'],
            trade: 'electrical'
          },
          {
            id: 'hvac-installation',
            name: 'HVAC Installation',
            originalDate: '2024-05-14',
            revisedDate: '2024-05-25',
            status: 'critical',
            dependencies: ['gas-connection', 'electrical-work'],
            trade: 'hvac'
          },
          {
            id: 'final-inspection',
            name: 'Final Inspection',
            originalDate: '2024-05-15',
            revisedDate: '2024-05-28',
            status: 'critical',
            dependencies: ['hvac-installation'],
            trade: 'inspection'
          }
        ]
      },
      {
        id: 'worst-case',
        name: 'Worst Case',
        probability: 20,
        description: 'Extended permit issues, major delays',
        completionDate: '2024-06-05',
        delayDays: 21,
        additionalCost: 50400,
        riskLevel: 'critical',
        impactedTrades: ['electrical', 'plumbing', 'hvac', 'finishing', 'cleanup'],
        keyMilestones: [
          {
            id: 'gas-connection',
            name: 'Gas Connection',
            originalDate: '2024-05-10',
            revisedDate: '2024-05-25',
            status: 'critical',
            dependencies: ['permit-renewal'],
            trade: 'utilities'
          },
          {
            id: 'electrical-work',
            name: 'Electrical Installation',
            originalDate: '2024-05-12',
            revisedDate: '2024-05-28',
            status: 'critical',
            dependencies: ['gas-connection'],
            trade: 'electrical'
          },
          {
            id: 'hvac-installation',
            name: 'HVAC Installation',
            originalDate: '2024-05-14',
            revisedDate: '2024-06-02',
            status: 'critical',
            dependencies: ['gas-connection', 'electrical-work'],
            trade: 'hvac'
          },
          {
            id: 'final-inspection',
            name: 'Final Inspection',
            originalDate: '2024-05-15',
            revisedDate: '2024-06-05',
            status: 'critical',
            dependencies: ['hvac-installation'],
            trade: 'inspection'
          }
        ]
      }
    ]
  }
  return []
}

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return 'border-green-500 bg-green-50'
    case 'medium': return 'border-amber-500 bg-amber-50'
    case 'high': return 'border-orange-500 bg-orange-50'
    case 'critical': return 'border-red-500 bg-red-50'
    default: return 'border-gray-300 bg-gray-50'
  }
}

const getRiskTextColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return 'text-green-700'
    case 'medium': return 'text-amber-700'
    case 'high': return 'text-orange-700'
    case 'critical': return 'text-red-700'
    default: return 'text-gray-700'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600'
    case 'at_risk': return 'text-amber-600'
    case 'delayed': return 'text-orange-600'
    case 'critical': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return CheckCircle
    case 'at_risk': return AlertCircle
    case 'delayed': return Clock
    case 'critical': return XCircle
    default: return Clock
  }
}

export function AITimelineImpact({ projectId, crisisType, className }: AITimelineImpactProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('realistic-case')
  const scenarios = getTimelineScenarios(projectId, crisisType)

  if (scenarios.length === 0) return null

  const currentScenario = scenarios.find(s => s.id === selectedScenario)
  if (!currentScenario) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* AI Analysis Header */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-800">
              AI Timeline Impact Analysis
            </CardTitle>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              Predictive Modeling
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-blue-700">
            Based on historical project data and current crisis parameters, here are the most likely timeline scenarios with their probability assessments.
          </p>
        </CardContent>
      </Card>

      {/* Scenario Selection */}
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarios.map((scenario) => (
            <Tooltip key={scenario.id}>
              <TooltipTrigger asChild>
                <Card
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    selectedScenario === scenario.id
                      ? getRiskColor(scenario.riskLevel) + ' ring-2 ring-offset-2 ring-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className={cn(
                          "font-semibold text-sm",
                          selectedScenario === scenario.id
                            ? getRiskTextColor(scenario.riskLevel)
                            : 'text-gray-700'
                        )}>
                          {scenario.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-1"
                        >
                          {scenario.probability}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {scenario.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span>+{scenario.delayDays} days</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3 text-gray-500" />
                          <span>£{(scenario.additionalCost / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs p-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-900">{scenario.name} Scenario Details</h4>

                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">📋 Key Milestones:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {scenario.keyMilestones.slice(0, 2).map((milestone) => (
                        <li key={milestone.id} className="flex items-start space-x-1">
                          <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>
                            <strong>{milestone.name}:</strong> {milestone.originalDate} → {milestone.revisedDate}
                          </span>
                        </li>
                      ))}
                      {scenario.keyMilestones.length > 2 && (
                        <li className="text-xs text-gray-500 italic">
                          +{scenario.keyMilestones.length - 2} more milestones...
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">🔧 Impacted Trades:</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.impactedTrades.map((trade) => (
                        <Badge key={trade} variant="outline" className="text-xs px-2 py-0.5">
                          {trade}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-xs">
                      <span><strong>Final Completion:</strong> {scenario.completionDate}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span><strong>Risk Level:</strong> <span className={`${getRiskTextColor(scenario.riskLevel)} font-medium`}>
                        {scenario.riskLevel.charAt(0).toUpperCase() + scenario.riskLevel.slice(1)}
                      </span></span>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Detailed Timeline View */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>{currentScenario.name} Timeline</span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Completion: {formatDate(currentScenario.completionDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Cost: £{currentScenario.additionalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Risk Level Indicator */}
            <div className={cn(
              "p-3 rounded-lg border-2",
              getRiskColor(currentScenario.riskLevel)
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={cn(
                    "h-5 w-5",
                    getRiskTextColor(currentScenario.riskLevel)
                  )} />
                  <span className={cn(
                    "font-semibold",
                    getRiskTextColor(currentScenario.riskLevel)
                  )}>
                    Risk Level: {currentScenario.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{currentScenario.impactedTrades.length} trades affected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone Timeline */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center space-x-2">
                <Wrench className="h-4 w-4" />
                <span>Critical Path Milestones</span>
              </h4>
              
              {currentScenario.keyMilestones.map((milestone, index) => {
                const StatusIcon = getStatusIcon(milestone.status)
                const isLastItem = index === currentScenario.keyMilestones.length - 1
                
                return (
                  <div key={milestone.id} className="relative">
                    {/* Timeline Line */}
                    {!isLastItem && (
                      <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-white hover:bg-gray-50">
                      <StatusIcon className={cn(
                        "h-5 w-5 mt-0.5 flex-shrink-0",
                        getStatusColor(milestone.status)
                      )} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-sm text-gray-800">
                            {milestone.name}
                          </h5>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs px-2 py-1",
                              milestone.status === 'completed' && "bg-green-100 text-green-800 border-green-300",
                              milestone.status === 'at_risk' && "bg-amber-100 text-amber-800 border-amber-300",
                              milestone.status === 'delayed' && "bg-orange-100 text-orange-800 border-orange-300",
                              milestone.status === 'critical' && "bg-red-100 text-red-800 border-red-300"
                            )}
                          >
                            {milestone.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <span>Original: {formatDate(milestone.originalDate)}</span>
                          </div>
                          <ChevronRight className="h-3 w-3" />
                          <div className="flex items-center space-x-1">
                            <span className={cn(
                              milestone.status === 'critical' ? 'text-red-600 font-medium' :
                              milestone.status === 'delayed' ? 'text-orange-600 font-medium' :
                              'text-gray-600'
                            )}>
                              Revised: {formatDate(milestone.revisedDate)}
                            </span>
                          </div>
                        </div>
                        
                        {milestone.dependencies.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            Depends on: {milestone.dependencies.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}