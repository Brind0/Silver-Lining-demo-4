"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Building2,
  DollarSign,
  Users,
  Target,
  Calendar
} from "lucide-react"

interface ReportData {
  projects: any[]
  businessLines: any
  teamPerformance: any[]
  alerts: any[]
  insights: string[]
}

interface BoardReportTemplateProps {
  data: ReportData
  reportDate?: Date
}

export function BoardReportTemplate({ data, reportDate = new Date() }: BoardReportTemplateProps) {
  const totalRevenue = 230000
  const totalCosts = 225000
  const netProfit = totalRevenue - totalCosts
  const profitMargin = (netProfit / totalRevenue) * 100
  
  const criticalProjects = data.projects.filter(p => p.status === 'RED')
  const onTrackProjects = data.projects.filter(p => p.status === 'GREEN')
  
  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Report Header */}
      <div className="border-b-2 border-primary pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Executive Board Report</h1>
            <p className="text-lg text-gray-600 mt-2">Q3 2024 Business Performance Summary</p>
            <p className="text-sm text-gray-500">Silver Lining Properties - Generated on {reportDate.toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <Badge className="bg-primary text-white text-lg px-4 py-2">CONFIDENTIAL</Badge>
            <div className="mt-2">
              <Button variant="outline" size="sm" className="mr-2">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="mb-6 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>Executive Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">£{totalRevenue.toLocaleString()}</p>
              <p className="text-sm font-medium">Total Revenue</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{data.projects.length}</p>
              <p className="text-sm font-medium">Active Projects</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-purple-50">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{data.teamPerformance.length}</p>
              <p className="text-sm font-medium">Team Members</p>
            </div>
            <div className={`text-center p-4 border rounded-lg ${profitMargin > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <Target className={`h-8 w-8 mx-auto mb-2 ${profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`} />
              <p className={`text-2xl font-bold ${profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </p>
              <p className="text-sm font-medium">Profit Margin</p>
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Q3 2024 demonstrates mixed performance across our business portfolio. While golf simulation projects 
              continue to show strong margins at 22%, our listed buildings division is experiencing significant 
              challenges with the Marchmont Historic project running 37.5% over budget. Immediate strategic action 
              is required to address cost overruns while capitalizing on the high-margin golf sim opportunities.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business Line Performance */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Business Line Performance Analysis</CardTitle>
          <CardDescription>Comparative performance across our core business segments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-900">Golf Simulation</h3>
                <Badge className="bg-green-100 text-green-800">High Performer</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue:</span>
                  <span className="font-medium">£110,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Profit Margin:</span>
                  <span className="font-medium text-green-600">22%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Projects:</span>
                  <span className="font-medium">2 Active</span>
                </div>
                <Progress value={22} className="h-2 mt-2" />
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-red-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-red-900">Listed Buildings</h3>
                <Badge variant="destructive">Requires Attention</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue:</span>
                  <span className="font-medium">£120,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Profit Margin:</span>
                  <span className="font-medium text-red-600">-12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Projects:</span>
                  <span className="font-medium">1 Critical</span>
                </div>
                <div className="w-full h-2 bg-red-200 rounded mt-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues & Risks */}
      {criticalProjects.length > 0 && (
        <Card className="mb-6 border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span>Critical Issues Requiring Immediate Attention</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalProjects.map((project) => (
                <div key={project.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-red-900">{project.name}</h4>
                    <Badge variant="destructive">CRITICAL</Badge>
                  </div>
                  <p className="text-sm text-red-800 mb-2">
                    Project is running {project.overrunRisk}% over budget with £{(project.spent - project.budget).toLocaleString()} in cost overruns.
                  </p>
                  <div className="text-xs text-red-700">
                    <strong>Recommended Action:</strong> Immediate budget review and scope reassessment required.
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Recommendations */}
      <Card className="mb-6 border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-700">
            <TrendingUp className="h-5 w-5" />
            <span>Strategic Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-semibold text-green-900 mb-2">Short Term (Next 30 days)</h4>
                <ul className="text-sm space-y-1 text-green-800">
                  <li>• Conduct emergency review of Marchmont Historic project</li>
                  <li>• Implement cost control measures across listed buildings</li>
                  <li>• Fast-track Henderson and Wentworth golf sim projects</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-900 mb-2">Medium Term (Next Quarter)</h4>
                <ul className="text-sm space-y-1 text-blue-800">
                  <li>• Increase golf sim project pipeline by 50%</li>
                  <li>• Develop specialized historic restoration pricing model</li>
                  <li>• Consider strategic partnership for listed buildings</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Financial Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 border rounded">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold">£{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm text-muted-foreground">Total Costs</p>
              <p className="text-xl font-bold">£{totalCosts.toLocaleString()}</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className={`text-xl font-bold ${netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                £{netProfit.toLocaleString()}
              </p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className={`text-xl font-bold ${profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Footer */}
      <div className="border-t pt-4 mt-6 text-center text-sm text-gray-500">
        <p>This report is confidential and intended for board members only.</p>
        <p className="mt-1">Generated by Silver Lining Business Intelligence Platform on {reportDate.toLocaleString()}</p>
        <p className="mt-1">Next board meeting: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

interface PortfolioReviewTemplateProps {
  data: ReportData
}

export function PortfolioReviewTemplate({ data }: PortfolioReviewTemplateProps) {
  return (
    <div className="max-w-6xl mx-auto bg-white">
      <div className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Portfolio Review</h1>
        <p className="text-gray-600">Comprehensive analysis of all active projects</p>
      </div>

      <div className="space-y-6">
        {data.projects.map((project) => (
          <Card key={project.id} className={`border-l-4 ${
            project.status === 'RED' ? 'border-l-red-500' :
            project.status === 'AMBER' ? 'border-l-orange-500' : 'border-l-green-500'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge variant={project.status === 'RED' ? 'destructive' : 
                       project.status === 'AMBER' ? 'secondary' : 'default'}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription>{project.business} • {project.team.length} team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 border rounded">
                  <p className="text-lg font-bold">£{project.budget.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Budget</p>
                </div>
                <div className="text-center p-3 border rounded">
                  <p className="text-lg font-bold">£{project.spent.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Spent</p>
                </div>
                <div className="text-center p-3 border rounded">
                  <p className="text-lg font-bold">{project.progress}%</p>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
                <div className="text-center p-3 border rounded">
                  <p className={`text-lg font-bold ${project.overrunRisk > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {project.overrunRisk > 0 ? '+' : ''}{project.overrunRisk}%
                  </p>
                  <p className="text-sm text-muted-foreground">Budget Var.</p>
                </div>
              </div>
              <Progress value={project.progress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Team: {project.team.join(', ')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}