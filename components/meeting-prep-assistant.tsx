"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  MessageSquare,
  FileDown,
  Plus,
  CheckCircle,
  AlertTriangle,
  Activity,
  Target,
  Clock,
  X,
  Lightbulb,
  Sparkles,
  ExternalLink,
} from "lucide-react"

interface MeetingPrepAssistantProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  requester: string
}

interface ProcessingStep {
  id: string
  label: string
  status: 'pending' | 'processing' | 'complete'
  icon: any
  data?: any
}

export function MeetingPrepAssistant({
  open,
  onOpenChange,
  projectName,
  requester
}: MeetingPrepAssistantProps) {
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'timeline',
      label: 'Project Timeline Analysis',
      status: 'pending',
      icon: Calendar,
    },
    {
      id: 'budget',
      label: 'Budget Performance Review',
      status: 'pending',
      icon: DollarSign,
    },
    {
      id: 'risks',
      label: 'Risk Assessment & Mitigation',
      status: 'pending',
      icon: AlertTriangle,
    },
    {
      id: 'sentiment',
      label: 'Client Communication Analysis',
      status: 'pending',
      icon: MessageSquare,
    },
  ])

  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [focusArea, setFocusArea] = useState<string>('')

  // Actionable project intelligence data
  const intelligenceData = {
    projectContext: {
      identifier: 'Henderson Golf Sim - Simon\'s Project',
      recentCriticalEvent: 'Equipment delivery delay recovered through weekend installation',
      currentStatus: 'Week 2 of installation phase, back on May 15th target',
      lastClientConcern: 'Timeline impact from equipment delay',
      keyNumbers: '2 weeks lost, 2 weeks recovered, £2,400 overtime cost'
    },
    concreteTimeline: {
      whatHappened: 'TechnoGolf delayed shipment due to component shortage',
      exactRecovery: 'Added 2-person weekend crew for 3 weeks',
      measurableOutcome: 'Recovered 14 days, now tracking to original May 15th completion'
    },
    financialReality: {
      actualCost: '£2,400 overtime costs to maintain timeline',
      budgetPosition: 'Still within 6% variance, industry standard is 8-12%',
      savingsDemonstrated: 'Avoided £8,000 penalty clause for late delivery'
    },
    simonIntelligence: {
      primaryConcerns: ['Timeline', 'Quality standards', 'Budget impact'],
      likelyQuestion: 'Will warranty be affected?',
      readyAnswer: 'Manufacturer confirmed full coverage',
      proactiveTopic: 'Demonstrate installation quality, schedule final walkthrough'
    },
    riskFactors: {
      weatherRisk: 'Weather could affect final week (30% chance of delays)',
      mitigation: 'Indoor backup plan prepared, alternative completion sequence identified',
      nextDecision: 'User training schedule needs confirmation by May 1st'
    }
  }

  useEffect(() => {
    if (open && !isProcessing && !showResults) {
      // Auto-start processing when modal opens
      setTimeout(() => {
        handleStartProcessing()
      }, 500)
    }
  }, [open])

  const handleStartProcessing = async () => {
    setIsProcessing(true)

    // Simulate processing each step
    for (let i = 0; i < processingSteps.length; i++) {
      // Set current step to processing
      setProcessingSteps(prev =>
        prev.map((step, index) =>
          index === i
            ? { ...step, status: 'processing' }
            : step
        )
      )

      // Wait for processing time
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

      // Set current step to complete
      setProcessingSteps(prev =>
        prev.map((step, index) =>
          index === i
            ? { ...step, status: 'complete' }
            : step
        )
      )
    }

    setIsProcessing(false)
    setShowResults(true)
  }

  const handleFocusAdjustment = (focus: string) => {
    setFocusArea(focus)
    // In real implementation, this would re-process with the new focus
  }

  const handleExportAction = (action: string) => {
    console.log(`Export action: ${action}`)
    // In real implementation, this would handle the export
  }

  const handleViewFullBrief = () => {
    // Generate document and navigate to project files
    const projectId = projectName === 'Henderson Golf Sim' ? '1' : '2'
    const documentId = `exec-brief-${Date.now()}`

    // Store the generated document data
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('generatedDocument', JSON.stringify({
        id: documentId,
        projectId,
        projectName,
        requester,
        generatedAt: new Date().toISOString(),
        data: intelligenceData
      }))
    }

    // Close modal and navigate to project files
    onOpenChange(false)

    // Navigate to project page with files tab active
    if (typeof window !== 'undefined') {
      window.location.href = `/projects/${projectId}?tab=files&highlight=${documentId}`
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
      case 'processing': return <Activity className="w-4 h-4 text-blue-500 animate-spin" />
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Meeting Prep Assistant</span>
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Analyzing {projectName} for {requester}'s meeting request
          </p>
        </DialogHeader>

        <div className="space-y-6">

          {/* Processing Section */}
          {!showResults && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Synthesizing Project Intelligence</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {processingSteps.map((step) => {
                  const IconComponent = step.icon
                  return (
                    <Card key={step.id} className={`border transition-all duration-300 ${
                      step.status === 'processing' ? 'border-blue-300 bg-blue-50' :
                      step.status === 'complete' ? 'border-green-300 bg-green-50' :
                      'border-gray-200'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4 text-gray-600" />
                              <p className="text-sm font-medium text-gray-900">
                                {step.label}
                              </p>
                            </div>
                            {step.status === 'processing' && (
                              <p className="text-xs text-blue-600 mt-1">Processing data sources...</p>
                            )}
                            {step.status === 'complete' && (
                              <p className="text-xs text-green-600 mt-1">Analysis complete</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Results Section */}
          {showResults && (
            <div className="space-y-6">
              {/* Project Context Refresher */}
              <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-lg text-indigo-900">Project Context Refresher</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{intelligenceData.projectContext.identifier}</h4>
                    <p className="text-gray-800 font-medium mb-2">{intelligenceData.projectContext.recentCriticalEvent}</p>
                    <p className="text-gray-700">{intelligenceData.projectContext.currentStatus}</p>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm text-gray-600 mb-1"><strong>Simon's Last Concern:</strong></p>
                    <p className="text-gray-800">"{intelligenceData.projectContext.lastClientConcern}"</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-sm text-blue-700 mb-1"><strong>Key Numbers Emily Needs:</strong></p>
                    <p className="font-medium text-blue-900">{intelligenceData.projectContext.keyNumbers}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actionable Intelligence */}
              <div className="grid grid-cols-2 gap-4">
                {/* Timeline Facts */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <CardTitle className="text-base">Timeline Facts</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1"><strong>What Happened:</strong></p>
                      <p className="text-gray-800 text-sm">{intelligenceData.concreteTimeline.whatHappened}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Recovery Action:</strong></p>
                      <p className="text-gray-800 text-sm">{intelligenceData.concreteTimeline.exactRecovery}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-sm text-green-700 mb-1"><strong>Result:</strong></p>
                      <p className="font-medium text-green-800 text-sm">{intelligenceData.concreteTimeline.measurableOutcome}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Reality */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <CardTitle className="text-base">Financial Reality</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Overtime Cost:</strong></p>
                      <p className="text-gray-800 text-sm">{intelligenceData.financialReality.actualCost}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Budget Position:</strong></p>
                      <p className="text-gray-800 text-sm">{intelligenceData.financialReality.budgetPosition}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-sm text-blue-700 mb-1"><strong>Value Delivered:</strong></p>
                      <p className="font-medium text-blue-800 text-sm">{intelligenceData.financialReality.savingsDemonstrated}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Simon Intelligence */}
                <Card className="col-span-2">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <CardTitle className="text-base">Simon-Specific Intelligence</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1"><strong>His Primary Concerns:</strong></p>
                        <p className="text-gray-800 text-sm">{intelligenceData.simonIntelligence.primaryConcerns.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1"><strong>Proactive Topic:</strong></p>
                        <p className="text-gray-800 text-sm">{intelligenceData.simonIntelligence.proactiveTopic}</p>
                      </div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded border border-amber-200">
                      <p className="text-sm text-amber-700 mb-1"><strong>Likely Question: "{intelligenceData.simonIntelligence.likelyQuestion}"</strong></p>
                      <p className="font-medium text-amber-800 text-sm"><strong>Ready Answer:</strong> {intelligenceData.simonIntelligence.readyAnswer}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Factors & Next Steps */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <CardTitle className="text-lg">Risk Factors & Next Steps</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                      <p className="text-sm text-orange-700 mb-2"><strong>Potential Risk:</strong></p>
                      <p className="text-orange-800 text-sm mb-2">{intelligenceData.riskFactors.weatherRisk}</p>
                      <p className="text-sm text-orange-700"><strong>Mitigation Ready:</strong> {intelligenceData.riskFactors.mitigation}</p>
                    </div>

                    <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                      <p className="text-sm text-blue-700 mb-2"><strong>Next Decision Point:</strong></p>
                      <p className="font-medium text-blue-800 text-sm">{intelligenceData.riskFactors.nextDecision}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Primary Action Buttons */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    size="lg"
                    onClick={handleViewFullBrief}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-base font-medium shadow-lg"
                  >
                    <FileDown className="w-5 h-5 mr-2" />
                    View Full Brief
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => handleExportAction('calendar')}
                    className="px-8 py-3 text-base font-medium"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Add to Calendar
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    📄 Full document will be generated and saved to project files
                  </p>
                </div>

                {/* Secondary Actions */}
                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFocusAdjustment('timeline')}
                      className={focusArea === 'timeline' ? 'bg-blue-100 border-blue-300' : ''}
                    >
                      Add Timeline Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFocusAdjustment('budget')}
                      className={focusArea === 'budget' ? 'bg-blue-100 border-blue-300' : ''}
                    >
                      Budget Deep Dive
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFocusAdjustment('risks')}
                      className={focusArea === 'risks' ? 'bg-blue-100 border-blue-300' : ''}
                    >
                      Risk Analysis
                    </Button>
                  </div>
                </div>
              </div>

              {/* Focus Adjustment Results */}
              {focusArea && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <CardTitle className="text-base text-blue-900">
                        Enhanced {focusArea.charAt(0).toUpperCase() + focusArea.slice(1)} Analysis
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-800">
                      {focusArea === 'timeline' && "Detailed timeline analysis shows strategic milestone clustering in final phase, with 92% confidence in delivery window. Key risk mitigation includes parallel track implementation for simulator calibration."}
                      {focusArea === 'budget' && "Budget variance analysis reveals stronger performance compared to peer projects. Cost optimization opportunities identified in equipment procurement (potential 3% reduction) while maintaining quality standards."}
                      {focusArea === 'risks' && "Risk assessment prioritizes installation weather dependencies and equipment delivery coordination. Mitigation strategies include backup venue arrangements and expedited shipping protocols."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}