"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { BoardReportTemplate, PortfolioReviewTemplate } from "@/components/professional-report-templates"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis } from "recharts"
import {
  Search,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Users,
  BarChart3,
  PieChart3,
  Download,
  Share,
  Filter,
  Zap,
  Eye,
  Building2,
  Target,
  Clock,
  Sparkles,
  FileText,
  Presentation
} from "lucide-react"

const businessData = {
  projects: [
    {
      id: 1,
      name: "Henderson Golf Sim",
      business: "golf-sim",
      budget: 45000,
      spent: 38000,
      status: "AMBER",
      progress: 84,
      team: ["John Smith", "Sarah Wilson"],
      overrunRisk: 15
    },
    {
      id: 2,
      name: "Marchmont Historic",
      business: "listed-buildings",
      budget: 120000,
      spent: 165000,
      status: "RED",
      progress: 75,
      team: ["Mike Johnson", "Emma Davis", "Tom Brown"],
      overrunRisk: 37.5
    },
    {
      id: 3,
      name: "Wentworth Golf Sim",
      business: "golf-sim",
      budget: 65000,
      spent: 22000,
      status: "GREEN",
      progress: 34,
      team: ["Sarah Wilson", "Tom Brown"],
      overrunRisk: -15
    }
  ],
  businessLines: {
    "golf-sim": { totalProjects: 2, avgEfficiency: 89, totalRevenue: 110000, profitMargin: 22 },
    "listed-buildings": { totalProjects: 1, avgEfficiency: 65, totalRevenue: 120000, profitMargin: -12 }
  },
  teamPerformance: [
    { name: "Sarah Wilson", projectsCompleted: 8, avgEfficiency: 94, costPerProject: 12500 },
    { name: "John Smith", projectsCompleted: 5, avgEfficiency: 88, costPerProject: 15000 },
    { name: "Mike Johnson", projectsCompleted: 3, avgEfficiency: 72, costPerProject: 18500 }
  ],
  alerts: [
    { type: "critical", message: "Marchmont Historic 37.5% over budget - immediate action required", project: "Marchmont Historic" },
    { type: "warning", message: "Henderson Golf Sim trending 6% over budget this month", project: "Henderson Golf Sim" },
    { type: "opportunity", message: "Golf sim projects showing 22% higher profit margin", category: "Business Line" }
  ],
  insights: [
    "Listed building projects historically run 15% over budget due to unforeseen restoration requirements",
    "Sarah Wilson's team completes projects 23% faster than company average",
    "Q2 material costs typically increase 12% - consider early procurement for upcoming projects"
  ]
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState("dashboard")
  const [selectedComparison, setSelectedComparison] = useState("projects")
  const [showBoardReport, setShowBoardReport] = useState(false)
  const [showPortfolioReport, setShowPortfolioReport] = useState(false)

  const quickReports = [
    { id: "dashboard", name: "Executive Dashboard", icon: BarChart3, description: "Key metrics and alerts" },
    { id: "projects", name: "Project Portfolio", icon: Building2, description: "All projects overview" },
    { id: "financial", name: "Financial Analysis", icon: DollarSign, description: "Revenue and cost analysis" },
    { id: "teams", name: "Team Performance", icon: Users, description: "Staff efficiency metrics" },
    { id: "risk", name: "Risk Assessment", icon: AlertTriangle, description: "Projects needing attention" }
  ]

  const criticalAlerts = businessData.alerts.filter(alert => alert.type === 'critical')
  const warningAlerts = businessData.alerts.filter(alert => alert.type === 'warning')
  const opportunities = businessData.alerts.filter(alert => alert.type === 'opportunity')

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header with Intelligent Search */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Executive Reports</h1>
              <p className="text-muted-foreground">Smart business intelligence and strategic insights</p>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={showBoardReport} onOpenChange={setShowBoardReport}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Board Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Executive Board Report</DialogTitle>
                    <DialogDescription>Professional quarterly business report</DialogDescription>
                  </DialogHeader>
                  <BoardReportTemplate data={businessData} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={showPortfolioReport} onOpenChange={setShowPortfolioReport}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Presentation className="h-4 w-4 mr-2" />
                    Portfolio Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Project Portfolio Review</DialogTitle>
                    <DialogDescription>Comprehensive project analysis</DialogDescription>
                  </DialogHeader>
                  <PortfolioReviewTemplate data={businessData} />
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Intelligent Query Builder */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-primary">
                  <Brain className="h-5 w-5" />
                  <span className="font-medium">Smart Query</span>
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ask me anything... e.g., 'Compare golf sim projects to historic building projects' or 'Which teams are most cost-effective?'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
                <Button>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Compare project performances
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Show budget variance analysis
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Team efficiency rankings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts Bar */}
        {criticalAlerts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-900">Critical Alerts ({criticalAlerts.length})</span>
              </div>
              <div className="mt-2 space-y-2">
                {criticalAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-red-800">{alert.message}</span>
                    <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Reports Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {quickReports.map((report) => (
            <Card 
              key={report.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedReport === report.id ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardContent className="p-4 text-center">
                <report.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm">{report.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Executive Dashboard */}
        {selectedReport === "dashboard" && (
          <div className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <Building2 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    2 active, 1 at risk
                  </p>
                  <div className="mt-2 text-xs">
                    <span className="text-green-600">2 on track</span> • <span className="text-red-600">1 critical</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold">£230K</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                    £25K over budget
                  </p>
                  <div className="mt-2 text-xs">
                    <span className="text-red-600">10.9% variance</span> • <span className="text-orange-600">Action needed</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold">84%</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +7% vs last quarter
                  </p>
                  <div className="mt-2 text-xs">
                    <span className="text-green-600">Above target</span> • <span className="text-blue-600">Best: Sarah Wilson</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  <Target className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold">18%</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    Above 15% target
                  </p>
                  <div className="mt-2 text-xs">
                    <span className="text-green-600">Golf-sim: 22%</span> • <span className="text-red-600">Historic: -12%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Scorecard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span>Performance Scorecard</span>
                </CardTitle>
                <CardDescription>Key business metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Financial Health</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Revenue Growth</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={78} className="w-16 h-2" />
                          <span className="text-sm font-medium">+12%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Budget Adherence</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={45} className="w-16 h-2" />
                          <span className="text-sm font-medium">45%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cash Flow</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={92} className="w-16 h-2" />
                          <span className="text-sm font-medium">Strong</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Operational Excellence</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Project Delivery</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={67} className="w-16 h-2" />
                          <span className="text-sm font-medium">67%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Quality Score</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={89} className="w-16 h-2" />
                          <span className="text-sm font-medium">4.5/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Client Satisfaction</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={95} className="w-16 h-2" />
                          <span className="text-sm font-medium">95%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Team Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resource Utilization</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={84} className="w-16 h-2" />
                          <span className="text-sm font-medium">84%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Skill Development</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={72} className="w-16 h-2" />
                          <span className="text-sm font-medium">72%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Team Satisfaction</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={88} className="w-16 h-2" />
                          <span className="text-sm font-medium">88%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Risk Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span>Risk Radar</span>
                    <Badge variant="outline" className="ml-2">
                      {businessData.projects.filter(p => p.status === 'RED').length} Critical
                    </Badge>
                  </CardTitle>
                  <CardDescription>Projects requiring immediate attention with risk scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businessData.projects
                      .sort((a, b) => {
                        const order = { 'RED': 3, 'AMBER': 2, 'GREEN': 1 }
                        return order[b.status as keyof typeof order] - order[a.status as keyof typeof order]
                      })
                      .map((project) => (
                        <div key={project.id} className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                          project.status === 'RED' ? 'border-red-200 bg-red-50' :
                          project.status === 'AMBER' ? 'border-orange-200 bg-orange-50' :
                          'border-green-200 bg-green-50'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`h-4 w-4 rounded-full ${
                                project.status === 'RED' ? 'bg-red-500' :
                                project.status === 'AMBER' ? 'bg-orange-500' : 'bg-green-500'
                              }`} />
                              <div>
                                <p className="font-semibold text-sm">{project.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {project.business} • Team: {project.team.length}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={project.status === 'RED' ? 'destructive' : 
                                     project.status === 'AMBER' ? 'secondary' : 'default'}>
                                {project.status}
                              </Badge>
                              <p className="text-xs mt-1 font-medium">
                                {project.overrunRisk > 0 ? `+${project.overrunRisk}%` : `${project.overrunRisk}%`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="text-muted-foreground">Budget:</span>
                              <p className="font-medium">£{project.budget.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Spent:</span>
                              <p className="font-medium">£{project.spent.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Progress:</span>
                              <p className="font-medium">{project.progress}%</p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Progress 
                              value={project.progress} 
                              className={`h-2 ${project.status === 'RED' ? 'bg-red-200' : ''}`} 
                            />
                          </div>
                          
                          {project.status === 'RED' && (
                            <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-800">
                              ⚠️ Immediate action required - project significantly over budget
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <span>Smart Insights</span>
                  </CardTitle>
                  <CardDescription>AI-powered business intelligence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {opportunities.map((opportunity, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-green-50">
                        <div className="flex items-start space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                          <p className="text-sm text-green-800">{opportunity.message}</p>
                        </div>
                      </div>
                    ))}
                    {businessData.insights.map((insight, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-start space-x-2">
                          <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                          <p className="text-sm text-blue-800">{insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Financial Analysis Report */}
        {selectedReport === "financial" && (
          <div className="space-y-6">
            {/* Financial Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Performance Analysis</CardTitle>
                <CardDescription>Revenue, costs, and profitability comparison across business lines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Business Line Financial Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-blue-900">Golf Sim Projects</h3>
                        <Badge className="bg-blue-600">High Margin</Badge>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Total Revenue</span>
                          <span className="text-lg font-bold text-blue-900">£110,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Total Costs</span>
                          <span className="text-lg font-bold">£85,800</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm font-semibold">Net Profit</span>
                          <span className="text-lg font-bold text-green-600">£24,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Profit Margin</span>
                          <span className="text-lg font-bold text-green-600">22%</span>
                        </div>
                        <Progress value={22} className="h-3" />
                      </div>
                    </div>
                    
                    <div className="p-6 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-purple-900">Listed Buildings</h3>
                        <Badge variant="destructive">Loss Making</Badge>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Total Revenue</span>
                          <span className="text-lg font-bold text-purple-900">£120,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Total Costs</span>
                          <span className="text-lg font-bold">£134,400</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm font-semibold">Net Profit</span>
                          <span className="text-lg font-bold text-red-600">-£14,400</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Profit Margin</span>
                          <span className="text-lg font-bold text-red-600">-12%</span>
                        </div>
                        <Progress value={0} className="h-3 bg-red-100" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Key Financial Insights */}
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h4 className="font-semibold text-orange-900">Financial Analysis Insights</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="text-gray-700">• Golf sim projects generate 34% higher profit margins</p>
                        <p className="text-gray-700">• Listed buildings experiencing 12% loss on current project</p>
                        <p className="text-gray-700">• Material costs for historic projects 45% higher than estimated</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700">• Recommend focusing pipeline on golf sim installations</p>
                        <p className="text-gray-700">• Review listed buildings pricing strategy</p>
                        <p className="text-gray-700">• Consider specialized historic restoration team</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Team Performance Report */}
        {selectedReport === "teams" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Analysis</CardTitle>
                <CardDescription>Individual and comparative team efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {businessData.teamPerformance.map((member, index) => (
                    <div key={member.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.projectsCompleted} projects completed</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={member.avgEfficiency > 90 ? 'default' : member.avgEfficiency > 80 ? 'secondary' : 'destructive'}>
                            {member.avgEfficiency}% Efficiency
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 border rounded">
                          <p className="text-2xl font-bold">{member.projectsCompleted}</p>
                          <p className="text-xs text-muted-foreground">Projects</p>
                          <p className="text-xs text-green-600">Completed</p>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <p className="text-2xl font-bold">{member.avgEfficiency}%</p>
                          <p className="text-xs text-muted-foreground">Average</p>
                          <p className="text-xs text-blue-600">Efficiency</p>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <p className="text-2xl font-bold">£{member.costPerProject.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Cost per</p>
                          <p className="text-xs text-purple-600">Project</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Efficiency Score</span>
                          <span>{member.avgEfficiency}%</span>
                        </div>
                        <Progress value={member.avgEfficiency} className="h-2" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Team Comparison Summary */}
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Team Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Most Efficient</p>
                          <p className="text-lg font-bold text-green-600">Sarah Wilson</p>
                          <p className="text-sm">94% efficiency</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Most Cost-Effective</p>
                          <p className="text-lg font-bold text-blue-600">Sarah Wilson</p>
                          <p className="text-sm">£12,500 per project</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Needs Support</p>
                          <p className="text-lg font-bold text-orange-600">Mike Johnson</p>
                          <p className="text-sm">72% efficiency</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Risk Assessment Report */}
        {selectedReport === "risk" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Risk Assessment Dashboard</span>
                </CardTitle>
                <CardDescription>Comprehensive risk analysis across all projects and teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Critical Risk Projects */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-red-900">Critical Risk Projects</h3>
                    <div className="space-y-4">
                      {businessData.projects.filter(p => p.status === 'RED').map((project) => (
                        <div key={project.id} className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-red-900">{project.name}</h4>
                            <Badge variant="destructive">CRITICAL</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Budget Overrun:</span>
                              <p className="font-bold text-red-600">{project.overrunRisk}%</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Amount Over:</span>
                              <p className="font-bold text-red-600">£{(project.spent - project.budget).toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Progress:</span>
                              <p className="font-bold">{project.progress}%</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Team Size:</span>
                              <p className="font-bold">{project.team.length} members</p>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-red-100 rounded text-sm text-red-800">
                            <strong>Recommended Actions:</strong>
                            <ul className="list-disc list-inside mt-1">
                              <li>Immediate budget review and cost control measures</li>
                              <li>Consider project scope reduction or client renegotiation</li>
                              <li>Assign additional project management oversight</li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Risk Factors Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Financial Risk Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Budget Variance</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={75} className="w-16 h-2" />
                              <span className="text-sm font-medium text-red-600">High</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Cash Flow Risk</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={30} className="w-16 h-2" />
                              <span className="text-sm font-medium text-green-600">Low</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Cost Escalation</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={60} className="w-16 h-2" />
                              <span className="text-sm font-medium text-orange-600">Medium</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Operational Risk Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Resource Availability</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={45} className="w-16 h-2" />
                              <span className="text-sm font-medium text-orange-600">Medium</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Timeline Risk</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={65} className="w-16 h-2" />
                              <span className="text-sm font-medium text-orange-600">Medium</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Quality Risk</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={25} className="w-16 h-2" />
                              <span className="text-sm font-medium text-green-600">Low</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Project Portfolio Report */}
        {selectedReport === "projects" && (
          <Card>
            <CardHeader>
              <CardTitle>Project Portfolio Overview</CardTitle>
              <CardDescription>Comprehensive view of all active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {businessData.projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{project.name}</h3>
                        <Badge className={`${
                          project.business === 'golf-sim' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {project.business}
                        </Badge>
                      </div>
                      <Badge variant={project.status === 'RED' ? 'destructive' : 
                             project.status === 'AMBER' ? 'secondary' : 'default'}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Budget</p>
                        <p className="text-lg">£{project.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Spent</p>
                        <p className="text-lg">£{project.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Progress</p>
                        <p className="text-lg">{project.progress}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Team Size</p>
                        <p className="text-lg">{project.team.length}</p>
                      </div>
                    </div>
                    
                    <Progress value={project.progress} className="w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}