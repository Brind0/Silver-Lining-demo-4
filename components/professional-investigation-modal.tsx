'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Calculator,
  BarChart3,
  Clock,
  DollarSign,
  Wrench,
  Shield,
  Activity
} from 'lucide-react'
import {
  calculateROI,
  formatCurrency,
  formatPercentage,
  getStatusDisplay,
  type EVMMetrics,
  type SupplierPerformance
} from '@/lib/evm-calculations'

interface RemediationOption {
  title: string;
  description: string;
  investment: number;
  netBenefit: number;
  timeframe: number; // months
  successProbability: number; // percentage
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  criticalPathImpact: number; // days
  implementation: string;
  owner: string;
  deadline: string;
}

interface InvestigationData {
  rootCause: string;
  timeline: string;
  industryContext: string;
  trendAnalysis: string;
  benchmarking: {
    projectCPI: number;
    industryStandard: string;
    similarProjects: string;
    supplierPerformance: string;
  };
  remediationOptions: RemediationOption[];
  relatedDocumentation: string[];
  impactedSuppliers: SupplierPerformance[];
}

interface ProfessionalInvestigationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  metrics: EVMMetrics;
  category: string;
  varianceAmount: number;
  investigationData: InvestigationData;
  onSelectOption?: (option: RemediationOption) => void;
  onContactSupplier?: (supplier: SupplierPerformance) => void;
}

export function ProfessionalInvestigationModal({
  open,
  onOpenChange,
  projectName,
  metrics,
  category,
  varianceAmount,
  investigationData,
  onSelectOption,
  onContactSupplier
}: ProfessionalInvestigationModalProps) {
  const [selectedTab, setSelectedTab] = useState('analysis')
  
  const statusDisplay = getStatusDisplay(metrics.overallStatus)
  const variancePercent = (Math.abs(varianceAmount) / metrics.BAC) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Search className="h-6 w-6 mr-3 text-blue-600" />
            Variance Investigation: {projectName}
          </DialogTitle>
          <DialogDescription className="text-base">
            Professional analysis of {category} variance requiring immediate commercial intervention
          </DialogDescription>
        </DialogHeader>

        {/* Executive Summary */}
        <Card className={`${statusDisplay.bgColor} border-l-4 border-l-${statusDisplay.color}-500 mb-6`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">Executive Summary</span>
              <Badge className={`${statusDisplay.textColor} ${statusDisplay.bgColor}`}>
                {statusDisplay.badge}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Variance Impact</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(Math.abs(varianceAmount), true)}
              </div>
              <div className="text-sm text-gray-600">{formatPercentage(variancePercent)} of budget</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Cost Performance</div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.CPI.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Current CPI vs 0.95 target</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Forecast Impact</div>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(metrics.VAC, true)}
              </div>
              <div className="text-sm text-gray-600">VAC at completion</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Risk Level</div>
              <div className={`text-2xl font-bold ${
                metrics.overallStatus === 'RED' ? 'text-red-600' :
                metrics.overallStatus === 'AMBER' ? 'text-amber-600' : 'text-green-600'
              }`}>
                {statusDisplay.badge}
              </div>
              <div className="text-sm text-gray-600">Immediate intervention required</div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Root Cause Analysis
            </TabsTrigger>
            <TabsTrigger value="benchmarking" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Industry Benchmarking
            </TabsTrigger>
            <TabsTrigger value="remediation" className="flex items-center">
              <Wrench className="h-4 w-4 mr-2" />
              Remediation Options
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Supplier Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Root Cause */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-600" />
                    Primary Cost Driver Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Root Cause:</h4>
                    <p className="text-gray-700 leading-relaxed">{investigationData.rootCause}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Timeline:</h4>
                    <p className="text-gray-700 leading-relaxed">{investigationData.timeline}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Trend Analysis:</h4>
                    <p className="text-gray-700 leading-relaxed">{investigationData.trendAnalysis}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Industry Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Industry Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Market Conditions:</h4>
                    <p className="text-gray-700 leading-relaxed">{investigationData.industryContext}</p>
                  </div>
                  
                  {/* Related Documentation */}
                  {investigationData.relatedDocumentation.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Supporting Documentation:</h4>
                      <div className="flex flex-wrap gap-2">
                        {investigationData.relatedDocumentation.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="benchmarking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Performance Benchmarking
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Project Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Current CPI:</span>
                        <span className="font-medium">{investigationData.benchmarking.projectCPI.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Industry Standard:</span>
                        <span className="font-medium">{investigationData.benchmarking.industryStandard}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Peer Comparison</h4>
                    <p className="text-sm text-gray-700">{investigationData.benchmarking.similarProjects}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">Supplier Performance</h4>
                    <p className="text-sm text-amber-700">{investigationData.benchmarking.supplierPerformance}</p>
                  </div>
                  
                  {/* Performance Indicators */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cost Performance vs Industry</span>
                        <span>{formatPercentage(((metrics.CPI - 0.95) / 0.95) * 100, 1)}</span>
                      </div>
                      <Progress 
                        value={Math.min(Math.max(metrics.CPI / 1.1 * 100, 0), 100)} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Schedule Performance vs Target</span>
                        <span>{formatPercentage(((metrics.SPI - 0.95) / 0.95) * 100, 1)}</span>
                      </div>
                      <Progress 
                        value={Math.min(Math.max(metrics.SPI / 1.1 * 100, 0), 100)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remediation" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Decision Impact Analysis</h3>
                <span className="text-sm text-gray-600">
                  {investigationData.remediationOptions.length} options evaluated
                </span>
              </div>
              
              {investigationData.remediationOptions.map((option, index) => {
                const roi = calculateROI(option.netBenefit, option.investment, option.timeframe)
                
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            option.riskLevel === 'LOW' ? 'secondary' :
                            option.riskLevel === 'MEDIUM' ? 'default' : 'destructive'
                          }>
                            {option.riskLevel} RISK
                          </Badge>
                          <Badge variant="outline">
                            {formatPercentage(option.successProbability)} Success
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700">{option.description}</p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">ROI</div>
                          <div className="text-lg font-bold text-green-600">
                            {formatPercentage(roi.roi)}
                          </div>
                          <div className="text-xs text-gray-500">over {option.timeframe} months</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Investment</div>
                          <div className="text-lg font-bold text-red-600">
                            {formatCurrency(option.investment)}
                          </div>
                          <div className="text-xs text-gray-500">upfront cost</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Net Benefit</div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(option.netBenefit)}
                          </div>
                          <div className="text-xs text-gray-500">total saving</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Timeline</div>
                          <div className="text-lg font-bold text-purple-600">
                            {Math.round(roi.paybackPeriod)} weeks
                          </div>
                          <div className="text-xs text-gray-500">payback period</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-900">Implementation:</span>
                            <span className="text-gray-700 ml-2">{option.implementation}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Owner:</span>
                            <span className="text-gray-700 ml-2">{option.owner}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Deadline:</span>
                            <span className="text-gray-700 ml-2">{option.deadline}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          onClick={() => onSelectOption?.(option)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Implement Solution
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-orange-600" />
                  Impacted Supplier Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {investigationData.impactedSuppliers.map((supplier, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    supplier.riskLevel === 'HIGH' ? 'border-red-200 bg-red-50' :
                    supplier.riskLevel === 'MEDIUM' ? 'border-amber-200 bg-amber-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                        <div className="text-sm text-gray-600">
                          Risk Level: {supplier.riskLevel} | Trend: {supplier.trend}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onContactSupplier?.(supplier)}>
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">On-Time:</span>
                        <span className="font-medium ml-2">{formatPercentage(supplier.onTimeDelivery)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quality:</span>
                        <span className="font-medium ml-2">{formatPercentage(supplier.qualityCompliance)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Defects:</span>
                        <span className="font-medium ml-2">{formatPercentage(supplier.defectRate)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Contract:</span>
                        <span className="font-medium ml-2">{formatPercentage(supplier.contractCompliance)}</span>
                      </div>
                    </div>
                    
                    {supplier.bsCompliance.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-600">BS Compliance: </span>
                        <div className="inline-flex flex-wrap gap-1 mt-1">
                          {supplier.bsCompliance.map(standard => (
                            <Badge key={standard} variant="outline" className="text-xs">
                              {standard}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}