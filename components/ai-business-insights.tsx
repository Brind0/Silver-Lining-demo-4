"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Bot,
  BarChart3,
  Clock,
  DollarSign,
  Users,
  Target,
  Lightbulb,
  Shield,
  Calendar,
  Building,
  Wrench,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface SupplierPerformance {
  id: string
  name: string
  category: 'utilities' | 'materials' | 'labor' | 'permits'
  reliabilityScore: number
  averageDelayDays: number
  projectsWorked: number
  onTimeDelivery: number
  costVariance: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  trend: 'improving' | 'stable' | 'declining'
  lastIssue: string
  recommendations: string[]
}

interface BusinessInsight {
  id: string
  title: string
  type: 'pattern_recognition' | 'cost_optimization' | 'risk_mitigation' | 'process_improvement'
  severity: 'info' | 'warning' | 'critical'
  description: string
  impact: string
  actionItems: string[]
  confidence: number
  supportingData: any[]
}

interface AIBusinessInsightsProps {
  projectId?: string
  className?: string
}

const getSupplierPerformanceData = (): SupplierPerformance[] => {
  return [
    {
      id: 'british-gas',
      name: 'British Gas Commercial',
      category: 'utilities',
      reliabilityScore: 6.2,
      averageDelayDays: 4.2,
      projectsWorked: 8,
      onTimeDelivery: 62,
      costVariance: 12.5,
      riskLevel: 'high',
      trend: 'declining',
      lastIssue: 'Permit expiry (Current)',
      recommendations: [
        'Implement 45-day permit renewal alerts',
        'Establish backup utility supplier relationships',
        'Add 10-day buffer to all gas connection timelines'
      ]
    },
    {
      id: 'thames-water',
      name: 'Thames Water Authority',
      category: 'utilities',
      reliabilityScore: 8.1,
      averageDelayDays: 2.1,
      projectsWorked: 12,
      onTimeDelivery: 81,
      costVariance: 5.2,
      riskLevel: 'medium',
      trend: 'stable',
      lastIssue: 'Excavation permit delay (2 weeks ago)',
      recommendations: [
        'Maintain current relationship',
        'Consider premium processing options for critical projects'
      ]
    },
    {
      id: 'heritage-materials',
      name: 'Heritage Building Supplies',
      category: 'materials',
      reliabilityScore: 9.3,
      averageDelayDays: 0.8,
      projectsWorked: 15,
      onTimeDelivery: 93,
      costVariance: -2.1,
      riskLevel: 'low',
      trend: 'improving',
      lastIssue: 'None in past 6 months',
      recommendations: [
        'Preferred supplier for heritage projects',
        'Negotiate volume discount agreements'
      ]
    },
    {
      id: 'historic-england',
      name: 'Historic England',
      category: 'permits',
      reliabilityScore: 6.8,
      averageDelayDays: 3.5,
      projectsWorked: 6,
      onTimeDelivery: 68,
      costVariance: 0,
      riskLevel: 'medium',
      trend: 'stable',
      lastIssue: 'Planning approval delay (1 month ago)',
      recommendations: [
        'Early engagement in project planning',
        'Maintain specialist heritage consultant relationship'
      ]
    }
  ]
}

const getBusinessInsights = (): BusinessInsight[] => {
  return [
    {
      id: 'utility-delay-pattern',
      title: 'Utility Supplier Delay Pattern Identified',
      type: 'pattern_recognition',
      severity: 'warning',
      description: 'Analysis of 20 recent projects shows utility suppliers (gas, water, electric) cause 68% of timeline delays, averaging 4.2 days per incident.',
      impact: 'Average cost impact of £8,400 per project, with heritage projects 2.3x more vulnerable due to permit complexities.',
      actionItems: [
        'Implement utility-specific project buffers (8-12 days)',
        'Establish backup supplier relationships',
        'Create permit tracking system with 45-day renewal alerts',
        'Negotiate priority service agreements with key utilities'
      ],
      confidence: 0.92,
      supportingData: [
        { name: 'Jan', utilityDelays: 3, otherDelays: 1 },
        { name: 'Feb', utilityDelays: 2, otherDelays: 2 },
        { name: 'Mar', utilityDelays: 4, otherDelays: 1 },
        { name: 'Apr', utilityDelays: 5, otherDelays: 2 },
        { name: 'May', utilityDelays: 3, otherDelays: 1 }
      ]
    },
    {
      id: 'heritage-project-optimization',
      title: 'Heritage Project Risk Factors',
      type: 'risk_mitigation',
      severity: 'critical',
      description: 'Heritage restoration projects show 3.2x higher regulatory delay risk and 45% longer permit processing times compared to standard construction.',
      impact: 'Heritage projects require specialized workflow with extended timelines. Current buffer recommendations insufficient.',
      actionItems: [
        'Establish heritage project specialist team',
        'Create regulatory relationship management program',
        'Implement heritage-specific project templates',
        'Add 25% timeline buffer for all heritage work',
        'Develop regulatory fast-track procedures'
      ],
      confidence: 0.88,
      supportingData: [
        { type: 'Heritage', avgDelay: 8.2, projects: 6 },
        { type: 'Standard', avgDelay: 2.6, projects: 14 },
        { type: 'Commercial', avgDelay: 1.8, projects: 8 }
      ]
    },
    {
      id: 'cost-optimization-opportunity',
      title: 'Supplier Cost Optimization Opportunity',
      type: 'cost_optimization',
      severity: 'info',
      description: 'Analysis shows potential 12-18% cost savings through strategic supplier consolidation and volume negotiations.',
      impact: 'Estimated annual savings of £45,000-£68,000 across all projects with improved reliability scores.',
      actionItems: [
        'Consolidate heritage material suppliers',
        'Negotiate annual volume agreements',
        'Implement preferred supplier program with performance incentives',
        'Review and optimize supplier payment terms'
      ],
      confidence: 0.85,
      supportingData: [
        { category: 'Current Avg Cost', value: 125000 },
        { category: 'Optimized Cost', value: 108000 },
        { category: 'Potential Savings', value: 17000 }
      ]
    },
    {
      id: 'communication-efficiency',
      title: 'Client Communication Response Time Improvement',
      type: 'process_improvement',
      severity: 'info',
      description: 'AI-assisted communication templates reduce response time by 67% and increase client satisfaction scores by 23%.',
      impact: 'Faster crisis resolution, improved client relationships, reduced administrative overhead.',
      actionItems: [
        'Expand AI template system to all project types',
        'Train team on template customization',
        'Implement automated stakeholder notification workflows',
        'Create communication quality metrics dashboard'
      ],
      confidence: 0.94,
      supportingData: [
        { metric: 'Response Time', before: 4.2, after: 1.4, unit: 'hours' },
        { metric: 'Client Satisfaction', before: 7.8, after: 9.6, unit: '/10' },
        { metric: 'Template Usage', before: 0, after: 85, unit: '%' }
      ]
    }
  ]
}

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return 'text-green-600'
    case 'medium': return 'text-amber-600'
    case 'high': return 'text-orange-600'
    case 'critical': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'improving': return <ArrowUp className="h-4 w-4 text-green-600" />
    case 'declining': return <ArrowDown className="h-4 w-4 text-red-600" />
    case 'stable': return <Minus className="h-4 w-4 text-gray-600" />
    default: return <Minus className="h-4 w-4 text-gray-600" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'border-red-500 bg-red-50'
    case 'warning': return 'border-amber-500 bg-amber-50'
    case 'info': return 'border-blue-500 bg-blue-50'
    default: return 'border-gray-300 bg-gray-50'
  }
}

export function AIBusinessInsights({ projectId, className }: AIBusinessInsightsProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'suppliers' | 'trends'>('insights')
  
  const supplierData = getSupplierPerformanceData()
  const businessInsights = getBusinessInsights()

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="border-2 border-emerald-200 bg-emerald-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg text-emerald-800">
              AI Business Intelligence
            </CardTitle>
            <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">
              Strategic Insights
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-emerald-700">
            AI-powered pattern recognition and strategic recommendations based on historical project data and performance analysis.
          </p>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        {[
          { id: 'insights', label: 'Strategic Insights', icon: Lightbulb },
          { id: 'suppliers', label: 'Supplier Performance', icon: Users },
          { id: 'trends', label: 'Performance Trends', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2",
                activeTab === tab.id && "bg-emerald-600 hover:bg-emerald-700"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Strategic Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {businessInsights.map((insight) => (
            <Card 
              key={insight.id} 
              className={cn(
                "border-2",
                getSeverityColor(insight.severity)
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "p-2 rounded-lg",
                      insight.severity === 'critical' && "bg-red-100",
                      insight.severity === 'warning' && "bg-amber-100",
                      insight.severity === 'info' && "bg-blue-100"
                    )}>
                      {insight.type === 'pattern_recognition' && <BarChart3 className="h-4 w-4" />}
                      {insight.type === 'risk_mitigation' && <Shield className="h-4 w-4" />}
                      {insight.type === 'cost_optimization' && <DollarSign className="h-4 w-4" />}
                      {insight.type === 'process_improvement' && <Target className="h-4 w-4" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {insight.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Analysis</h4>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Business Impact</h4>
                    <p className="text-sm text-gray-700">{insight.impact}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Recommended Actions</h4>
                    <ul className="space-y-1">
                      {insight.actionItems.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {insight.supportingData.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Supporting Data</h4>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          {insight.type === 'pattern_recognition' ? (
                            <BarChart data={insight.supportingData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="utilityDelays" fill="#ef4444" name="Utility Delays" />
                              <Bar dataKey="otherDelays" fill="#6b7280" name="Other Delays" />
                            </BarChart>
                          ) : (
                            <BarChart data={insight.supportingData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="category" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#10b981" />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Supplier Performance Tab */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          {supplierData.map((supplier) => (
            <Card key={supplier.id} className="border-2">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Supplier Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{supplier.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {supplier.category.toUpperCase()}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            supplier.riskLevel === 'low' && "bg-green-100 text-green-800 border-green-300",
                            supplier.riskLevel === 'medium' && "bg-amber-100 text-amber-800 border-amber-300",
                            supplier.riskLevel === 'high' && "bg-orange-100 text-orange-800 border-orange-300",
                            supplier.riskLevel === 'critical' && "bg-red-100 text-red-800 border-red-300"
                          )}
                        >
                          {supplier.riskLevel.toUpperCase()} RISK
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(supplier.trend)}
                          <span className="text-xs text-gray-600">{supplier.trend}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {supplier.reliabilityScore}/10
                      </div>
                      <div className="text-xs text-gray-600">Reliability Score</div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <div className="text-lg font-semibold text-gray-800">
                        {supplier.averageDelayDays}
                      </div>
                      <div className="text-xs text-gray-600">Avg Delay Days</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <div className="text-lg font-semibold text-gray-800">
                        {supplier.onTimeDelivery}%
                      </div>
                      <div className="text-xs text-gray-600">On-Time Delivery</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <div className="text-lg font-semibold text-gray-800">
                        {supplier.costVariance > 0 ? '+' : ''}{supplier.costVariance}%
                      </div>
                      <div className="text-xs text-gray-600">Cost Variance</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <div className="text-lg font-semibold text-gray-800">
                        {supplier.projectsWorked}
                      </div>
                      <div className="text-xs text-gray-600">Projects</div>
                    </div>
                  </div>

                  {/* Last Issue */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Last Issue</h4>
                    <p className="text-sm text-gray-700">{supplier.lastIssue}</p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">AI Recommendations</h4>
                    <ul className="space-y-1">
                      {supplier.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Performance Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Delay Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={businessInsights[0].supportingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="utilityDelays" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Utility Delays"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="otherDelays" 
                      stroke="#6b7280" 
                      strokeWidth={2}
                      name="Other Delays"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cost Efficiency Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">+15%</div>
                    <div className="text-xs text-gray-600">Improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Timeline Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">78%</div>
                    <div className="text-xs text-gray-600">On Schedule</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Client Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-600">9.2/10</div>
                    <div className="text-xs text-gray-600">Average Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}