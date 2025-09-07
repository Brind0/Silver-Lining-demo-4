'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  DollarSign,
  CheckCircle,
  Phone,
  Mail,
  FileText,
  BarChart3,
  Calculator
} from 'lucide-react'
import {
  calculateEVMMetrics,
  decomposeVariance,
  generateProfessionalAnalysis,
  calculateROI,
  formatCurrency,
  formatPercentage,
  getStatusDisplay,
  PROJECT_THRESHOLDS,
  type EVMMetrics,
  type SupplierPerformance,
  type ProjectThresholds
} from '@/lib/evm-calculations'

interface VarianceCardProps {
  projectName: string;
  projectType: 'luxury' | 'heritage' | 'standard';
  budgetAtCompletion: number;
  physicalProgress: number;
  plannedProgress: number;
  actualCost: number;
  standardPrice?: number;
  actualPrice?: number;
  standardQuantity?: number;
  actualQuantity?: number;
  standardLaborRate?: number;
  actualLaborRate?: number;
  laborHours?: number;
  suppliers?: SupplierPerformance[];
  onInvestigate?: (metrics: EVMMetrics) => void;
  onContactSupplier?: (supplier: SupplierPerformance) => void;
  className?: string;
}

export function ProfessionalVarianceCard({
  projectName,
  projectType,
  budgetAtCompletion,
  physicalProgress,
  plannedProgress,
  actualCost,
  standardPrice = 0,
  actualPrice = 0,
  standardQuantity = 0,
  actualQuantity = 0,
  standardLaborRate = 0,
  actualLaborRate = 0,
  laborHours = 0,
  suppliers = [],
  onInvestigate,
  onContactSupplier,
  className
}: VarianceCardProps) {
  const metrics = calculateEVMMetrics(
    budgetAtCompletion,
    physicalProgress,
    plannedProgress,
    actualCost,
    projectType
  );

  let variance = null;
  if (standardPrice && actualPrice && standardQuantity && actualQuantity) {
    variance = decomposeVariance(
      standardPrice,
      actualPrice,
      standardQuantity,
      actualQuantity,
      standardLaborRate,
      actualLaborRate,
      laborHours
    );
  }

  const analysis = generateProfessionalAnalysis(metrics, variance!, suppliers, projectType);
  const statusDisplay = getStatusDisplay(metrics.overallStatus);
  const thresholds = PROJECT_THRESHOLDS[projectType];
  
  const variancePercent = (Math.abs(metrics.CV) / metrics.BAC) * 100;
  const isAboveThreshold = variancePercent > thresholds.acceptableVarianceRange[1];

  return (
    <Card className={`${className} ${statusDisplay.bgColor} border-l-4 border-l-${statusDisplay.color}-500`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-blue-600" />
              {projectName} - EVM Analysis
            </CardTitle>
            <div className="flex items-center space-x-3 mt-2">
              <Badge className={`${statusDisplay.textColor} ${statusDisplay.bgColor}`}>
                {statusDisplay.badge}
              </Badge>
              <span className="text-sm text-gray-600 capitalize">{projectType} Project</span>
              <span className="text-sm text-gray-500">
                Week {Math.ceil((physicalProgress / 100) * 24)} of 24
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              CPI: {metrics.CPI.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              SPI: {metrics.SPI.toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* EVM Performance Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-600 uppercase tracking-wide">Earned Value</div>
            <div className="text-lg font-semibold text-blue-600">{formatCurrency(metrics.EV)}</div>
            <div className="text-xs text-gray-500">{formatPercentage(physicalProgress)}% complete</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-gray-600 uppercase tracking-wide">Actual Cost</div>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.AC)}</div>
            <div className="text-xs text-gray-500">vs {formatCurrency(metrics.PV)} planned</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-gray-600 uppercase tracking-wide">Cost Variance</div>
            <div className={`text-lg font-semibold flex items-center ${
              metrics.CV >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.CV >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {formatCurrency(metrics.CV, true)}
            </div>
            <div className="text-xs text-gray-500">{formatPercentage(variancePercent)} of budget</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-gray-600 uppercase tracking-wide">Forecast EAC</div>
            <div className="text-lg font-semibold text-purple-600">{formatCurrency(metrics.EAC)}</div>
            <div className="text-xs text-gray-500">
              VAC: {formatCurrency(metrics.VAC, true)}
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Cost Performance Index</span>
              <Badge variant={metrics.cpiStatus === 'EXCELLENT' ? 'default' : 
                             metrics.cpiStatus === 'ACCEPTABLE' ? 'secondary' : 
                             metrics.cpiStatus === 'ATTENTION' ? 'destructive' : 'destructive'}>
                {metrics.cpiStatus}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Critical (&lt;{thresholds.cpiThresholds.attention})</span>
                <span>Excellent (&gt;{thresholds.cpiThresholds.excellent})</span>
              </div>
              <Progress 
                value={Math.min(Math.max(metrics.CPI, 0.5), 1.2) * 100 - 50} 
                className="h-2"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Schedule Performance Index</span>
              <Badge variant={metrics.spiStatus === 'EXCELLENT' ? 'default' : 
                             metrics.spiStatus === 'ACCEPTABLE' ? 'secondary' : 
                             metrics.spiStatus === 'ATTENTION' ? 'destructive' : 'destructive'}>
                {metrics.spiStatus}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Critical (&lt;{thresholds.spiThresholds.attention})</span>
                <span>Excellent (&gt;{thresholds.spiThresholds.excellent})</span>
              </div>
              <Progress 
                value={Math.min(Math.max(metrics.SPI, 0.5), 1.2) * 100 - 50} 
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Professional Analysis */}
        <div className="space-y-3">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-900">Professional Analysis</h4>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-800 leading-relaxed">{analysis}</p>
          </div>
        </div>

        {/* Variance Decomposition */}
        {variance && (
          <div className="space-y-3">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Variance Breakdown</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-600 uppercase tracking-wide">Price Variance</div>
                <div className={`text-lg font-semibold ${
                  variance.priceVariance >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(variance.priceVariance, true)}
                </div>
                <div className="text-xs text-gray-500">Market conditions</div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-600 uppercase tracking-wide">Quantity Variance</div>
                <div className={`text-lg font-semibold ${
                  variance.quantityVariance >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(variance.quantityVariance, true)}
                </div>
                <div className="text-xs text-gray-500">Waste & efficiency</div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-600 uppercase tracking-wide">Efficiency Variance</div>
                <div className={`text-lg font-semibold ${
                  variance.efficiencyVariance >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(variance.efficiencyVariance, true)}
                </div>
                <div className="text-xs text-gray-500">Labor productivity</div>
              </div>
            </div>
            
            {variance.primaryDriver && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Primary Cost Driver: {variance.primaryDriver} Variance
                  </span>
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Contributing {formatPercentage((Math.abs(
                    variance.primaryDriver === 'Price' ? variance.priceVariance :
                    variance.primaryDriver === 'Quantity' ? variance.quantityVariance :
                    variance.efficiencyVariance
                  ) / Math.abs(variance.totalVariance)) * 100)} of total variance
                </div>
              </div>
            )}
          </div>
        )}

        {/* Supplier Performance Summary */}
        {suppliers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-600" />
                <h4 className="text-sm font-semibold text-gray-900">Key Supplier Performance</h4>
              </div>
              <span className="text-xs text-gray-500">
                {suppliers.filter(s => s.riskLevel === 'HIGH').length} high-risk suppliers
              </span>
            </div>
            
            <div className="space-y-2">
              {suppliers.slice(0, 2).map((supplier, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  supplier.riskLevel === 'HIGH' ? 'border-red-200 bg-red-50' :
                  supplier.riskLevel === 'MEDIUM' ? 'border-amber-200 bg-amber-50' :
                  'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-xs text-gray-600">
                        On-time: {formatPercentage(supplier.onTimeDelivery)} | 
                        Quality: {formatPercentage(supplier.qualityCompliance)} | 
                        Defects: {formatPercentage(supplier.defectRate)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        supplier.riskLevel === 'HIGH' ? 'destructive' :
                        supplier.riskLevel === 'MEDIUM' ? 'default' : 'secondary'
                      }>
                        {supplier.riskLevel}
                      </Badge>
                      {onContactSupplier && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onContactSupplier(supplier)}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {supplier.bsCompliance.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {supplier.bsCompliance.map(standard => (
                        <Badge key={standard} variant="outline" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-GB')} | 
            Next review: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
          </div>
          
          <div className="flex space-x-2">
            {isAboveThreshold && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onInvestigate?.(metrics)}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Investigate
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInvestigate?.(metrics)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Full Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface VarianceGridProps {
  projects: Array<{
    id: string;
    name: string;
    type: 'luxury' | 'heritage' | 'standard';
    budgetAtCompletion: number;
    physicalProgress: number;
    plannedProgress: number;
    actualCost: number;
    suppliers?: SupplierPerformance[];
  }>;
  onInvestigate?: (projectId: string, metrics: EVMMetrics) => void;
  onContactSupplier?: (supplier: SupplierPerformance) => void;
  className?: string;
}

export function ProfessionalVarianceGrid({
  projects,
  onInvestigate,
  onContactSupplier,
  className
}: VarianceGridProps) {
  const criticalProjects = projects.filter(p => {
    const metrics = calculateEVMMetrics(
      p.budgetAtCompletion,
      p.physicalProgress,
      p.plannedProgress,
      p.actualCost,
      p.type
    );
    return metrics.overallStatus === 'RED';
  });

  const attentionProjects = projects.filter(p => {
    const metrics = calculateEVMMetrics(
      p.budgetAtCompletion,
      p.physicalProgress,
      p.plannedProgress,
      p.actualCost,
      p.type
    );
    return metrics.overallStatus === 'AMBER';
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Critical Projects First */}
      {criticalProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Critical Projects Requiring Immediate Action ({criticalProjects.length})
            </h3>
          </div>
          
          <div className="grid gap-6">
            {criticalProjects.map(project => (
              <ProfessionalVarianceCard
                key={project.id}
                projectName={project.name}
                projectType={project.type}
                budgetAtCompletion={project.budgetAtCompletion}
                physicalProgress={project.physicalProgress}
                plannedProgress={project.plannedProgress}
                actualCost={project.actualCost}
                suppliers={project.suppliers}
                onInvestigate={(metrics) => onInvestigate?.(project.id, metrics)}
                onContactSupplier={onContactSupplier}
              />
            ))}
          </div>
        </div>
      )}

      {/* Attention Projects */}
      {attentionProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center">
            <TrendingDown className="h-5 w-5 mr-2 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Projects Requiring Attention ({attentionProjects.length})
            </h3>
          </div>
          
          <div className="grid gap-6">
            {attentionProjects.map(project => (
              <ProfessionalVarianceCard
                key={project.id}
                projectName={project.name}
                projectType={project.type}
                budgetAtCompletion={project.budgetAtCompletion}
                physicalProgress={project.physicalProgress}
                plannedProgress={project.plannedProgress}
                actualCost={project.actualCost}
                suppliers={project.suppliers}
                onInvestigate={(metrics) => onInvestigate?.(project.id, metrics)}
                onContactSupplier={onContactSupplier}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Other Projects */}
      <div className="space-y-4">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            All Projects Overview ({projects.length})
          </h3>
        </div>
        
        <div className="grid gap-6">
          {projects.map(project => (
            <ProfessionalVarianceCard
              key={project.id}
              projectName={project.name}
              projectType={project.type}
              budgetAtCompletion={project.budgetAtCompletion}
              physicalProgress={project.physicalProgress}
              plannedProgress={project.plannedProgress}
              actualCost={project.actualCost}
              suppliers={project.suppliers}
              onInvestigate={(metrics) => onInvestigate?.(project.id, metrics)}
              onContactSupplier={onContactSupplier}
            />
          ))}
        </div>
      </div>
    </div>
  );
}