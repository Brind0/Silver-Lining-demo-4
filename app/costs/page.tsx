"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedCounter } from "@/components/animated-counter"
import { PulseBadge } from "@/components/pulse-badge"
import { TableSkeleton } from "@/components/loading-skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MoreHorizontal,
  AlertTriangle,
  Upload,
  CheckCircle,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
  User,
  Eye,
  Activity,
  Receipt,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const costSummary = {
  totalBudget: 125000,
  totalSpent: 87500,
  thisMonth: 12500,
  lastMonth: 15000,
  categories: [
    { name: "Materials", budgeted: 60000, spent: 45000, percentage: 75 },
    { name: "Labour", budgeted: 40000, spent: 28000, percentage: 70 },
    { name: "Equipment", budgeted: 15000, spent: 10500, percentage: 70 },
    { name: "Permits", budgeted: 5000, spent: 2500, percentage: 50 },
    { name: "Other", budgeted: 5000, spent: 1500, percentage: 30 },
  ],
}

const monthlyData = {
  currentIncome: 45000,
  totalExpenses: 12500,
  netProfit: 32500,
  profitMargin: 72.2,
}

const budgetForecasting = {
  monthlyBurnRate: 12500,
  remainingBudget: 37500,
  runwayMonths: 3.2,
  projectedCompletion: "March 2024",
  status: "on_track", // on_track, caution, over_budget
}

const recentExpenses = [
  {
    id: 1,
    date: "2024-02-15",
    timeAgo: "2 minutes ago",
    description: "Kitchen Cabinets - Oak Wood",
    vendor: "Premium Woodworks Ltd",
    category: "Materials",
    project: "Kitchen Renovation - Maple Street",
    amount: 3500,
    status: "approved",
    receipt: true,
    priority: "normal",
    isNew: false,
  },
  {
    id: 2,
    date: "2024-02-14", 
    timeAgo: "Just now",
    description: "Electrical Work - Phase 2",
    vendor: "Spark & Co Electrical",
    category: "Labour",
    project: "Office Refurbishment",
    amount: 1200,
    status: "pending",
    receipt: false,
    priority: "high",
    isNew: true,
  },
  {
    id: 3,
    date: "2024-02-13",
    timeAgo: "15 minutes ago",
    description: "Concrete Mixer Rental",
    vendor: "BuildEquip Hire",
    category: "Equipment", 
    project: "Garden Landscaping",
    amount: 250,
    status: "approved",
    receipt: true,
    priority: "normal",
    isNew: false,
  },
  {
    id: 4,
    date: "2024-02-12",
    timeAgo: "1 hour ago",
    description: "Building Permit Fee",
    vendor: "City Council",
    category: "Permits",
    project: "Bathroom Refit",
    amount: 450,
    status: "approved", 
    receipt: true,
    priority: "normal",
    isNew: false,
  },
  {
    id: 5,
    date: "2024-02-11",
    timeAgo: "3 hours ago",
    description: "Heritage Restoration Materials",
    vendor: "Historic Building Supplies",
    category: "Materials",
    project: "Marchmont Historic",
    amount: 8500,
    status: "pending",
    receipt: true,
    priority: "urgent",
    isNew: false,
  },
]

const reconciliationTransactions = [
  { id: 1, description: "Henderson Golf Sim - Equipment", amount: 28500, matched: false },
  { id: 2, description: "Marchmont Historic - Materials", amount: 15000, matched: false },
  { id: 3, description: "Wentworth Golf Sim - Planning", amount: 3200, matched: false },
  { id: 4, description: "Tunbridge Restoration - Labour", amount: 8500, matched: false },
  { id: 5, description: "Ascot Entertainment - Design", amount: 4200, matched: false },
  { id: 6, description: "Henderson Golf Sim - Installation", amount: 2500, matched: false },
  { id: 7, description: "Marchmont Historic - Permits", amount: 3200, matched: false },
  { id: 8, description: "Wentworth Golf Sim - Materials", amount: 1800, matched: false },
  { id: 9, description: "Tunbridge Restoration - Equipment", amount: 950, matched: false },
  { id: 10, description: "Ascot Entertainment - Consultation", amount: 1200, matched: false },
]

const executiveActions = [
  {
    id: 1,
    type: "high_value_approval",
    title: "Henderson Golf Simulator - Final Phase",
    amount: 28500,
    project: "Henderson Golf Sim",
    daysPending: 2,
    priority: "high",
    description: "Executive approval required (>£5k)"
  },
  {
    id: 2,
    type: "high_value_approval", 
    title: "Historic Building Materials",
    amount: 15000,
    project: "Marchmont Historic",
    daysPending: 1,
    priority: "high",
    description: "Executive approval required (>£5k)"
  },
  {
    id: 3,
    type: "budget_overrun",
    title: "Materials Budget Exceeded",
    amount: 5000,
    project: "Multiple Projects",
    daysPending: 3,
    priority: "urgent",
    description: "75% utilised, approaching limit"
  },
  {
    id: 4,
    type: "urgent_pending",
    title: "Electrical Work - Phase 2", 
    amount: 1200,
    project: "Office Refurbishment",
    daysPending: 5,
    priority: "urgent",
    description: "Pending >3 days, contractor waiting"
  },
  {
    id: 5,
    type: "missing_receipt",
    title: "Equipment Rental - Missing Receipt",
    amount: 2500,
    project: "Garden Landscaping", 
    daysPending: 7,
    priority: "medium",
    description: "Significant expense, no documentation"
  }
]

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Approved
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Pending
        </Badge>
      )
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Materials":
      return "text-blue-600"
    case "Labour":
      return "text-green-600"
    case "Equipment":
      return "text-purple-600"
    case "Permits":
      return "text-orange-600"
    case "Other":
      return "text-gray-600"
    default:
      return "text-gray-600"
  }
}

function getCategoryAccentStyles(category: string) {
  switch (category) {
    case "Materials":
      return {
        hover: "hover:bg-blue-50 hover:border-blue-300",
        border: "border-blue-200",
        priority: "bg-blue-500"
      }
    case "Labour":
      return {
        hover: "hover:bg-green-50 hover:border-green-300",
        border: "border-green-200", 
        priority: "bg-green-500"
      }
    case "Equipment":
      return {
        hover: "hover:bg-purple-50 hover:border-purple-300",
        border: "border-purple-200",
        priority: "bg-purple-500"
      }
    case "Permits":
      return {
        hover: "hover:bg-orange-50 hover:border-orange-300", 
        border: "border-orange-200",
        priority: "bg-orange-500"
      }
    case "Other":
      return {
        hover: "hover:bg-gray-50 hover:border-gray-300",
        border: "border-gray-200",
        priority: "bg-gray-500"
      }
    default:
      return {
        hover: "hover:bg-gray-50 hover:border-gray-300",
        border: "border-gray-200", 
        priority: "bg-gray-500"
      }
  }
}

function getUtilisationColor(percentage: number) {
  if (percentage <= 50) {
    return {
      text: "text-green-700",
      bg: "bg-green-100", 
      progress: "bg-green-500",
      border: "border-green-200"
    }
  } else if (percentage <= 75) {
    return {
      text: "text-yellow-700",
      bg: "bg-yellow-100",
      progress: "bg-yellow-500", 
      border: "border-yellow-200"
    }
  } else if (percentage <= 90) {
    return {
      text: "text-orange-700",
      bg: "bg-orange-100",
      progress: "bg-orange-500",
      border: "border-orange-200" 
    }
  } else {
    return {
      text: "text-red-700",
      bg: "bg-red-100",
      progress: "bg-red-500",
      border: "border-red-200"
    }
  }
}

function getExpensePriority(amount: number) {
  if (amount <= 1000) {
    return {
      level: "low",
      bg: "bg-green-50",
      border: "border-l-green-400",
      text: "text-green-900"
    }
  } else if (amount <= 3000) {
    return {
      level: "medium", 
      bg: "bg-yellow-50",
      border: "border-l-yellow-400",
      text: "text-yellow-900"
    }
  } else if (amount <= 5000) {
    return {
      level: "high",
      bg: "bg-orange-50", 
      border: "border-l-orange-400",
      text: "text-orange-900"
    }
  } else {
    return {
      level: "critical",
      bg: "bg-red-50",
      border: "border-l-red-400", 
      text: "text-red-900"
    }
  }
}

function getActionPriority(priority: string) {
  switch (priority) {
    case "urgent":
      return {
        dot: "bg-red-500",
        text: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200"
      }
    case "high":
      return {
        dot: "bg-orange-500", 
        text: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200"
      }
    case "medium":
      return {
        dot: "bg-yellow-500",
        text: "text-yellow-700", 
        bg: "bg-yellow-50",
        border: "border-yellow-200"
      }
    default:
      return {
        dot: "bg-gray-500",
        text: "text-gray-700",
        bg: "bg-gray-50", 
        border: "border-gray-200"
      }
  }
}

function getActionIcon(type: string) {
  switch (type) {
    case "high_value_approval":
      return "💰"
    case "budget_overrun":
      return "⚠️"
    case "urgent_pending":
      return "⏰"
    case "missing_receipt":
      return "📄"
    default:
      return "❗"
  }
}

function getBudgetStatus(status: string) {
  switch (status) {
    case "on_track":
      return {
        color: "text-green-600",
        bg: "bg-green-100",
        dot: "bg-green-500",
        label: "On Track"
      }
    case "caution":
      return {
        color: "text-yellow-600", 
        bg: "bg-yellow-100",
        dot: "bg-yellow-500",
        label: "Caution"
      }
    case "over_budget":
      return {
        color: "text-red-600",
        bg: "bg-red-100", 
        dot: "bg-red-500",
        label: "Over Budget"
      }
    default:
      return {
        color: "text-gray-600",
        bg: "bg-gray-100",
        dot: "bg-gray-500",
        label: "Unknown"
      }
  }
}

export default function CostsPage() {
  const [uploadState, setUploadState] = useState<"idle" | "processing" | "success">("idle")
  const [reconciliationState, setReconciliationState] = useState<"idle" | "running" | "complete">("idle")
  const [reconciliationProgress, setReconciliationProgress] = useState(0)
  const [timeCounter, setTimeCounter] = useState(0)
  const [matchedTransactions, setMatchedTransactions] = useState<number[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [denyingActionId, setDenyingActionId] = useState<number | null>(null)
  const [denyReason, setDenyReason] = useState("")
  const [currentApprovalIndex, setCurrentApprovalIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { toast } = useToast()

  const budgetUtilization = (costSummary.totalSpent / costSummary.totalBudget) * 100
  const monthlyChange = ((costSummary.thisMonth - costSummary.lastMonth) / costSummary.lastMonth) * 100

  const handleReceiptUpload = () => {
    setUploadState("processing")
    setTimeout(() => {
      setUploadState("success")
      setShowSuccessAnimation(true)
      toast({
        title: "Receipt Processed Successfully! ✨",
        description: "OCR extracted data and matched to existing expense.",
      })
      setTimeout(() => {
        setUploadState("idle")
        setShowSuccessAnimation(false)
      }, 3000)
    }, 3000)
  }

  const startReconciliation = () => {
    setReconciliationState("running")
    setReconciliationProgress(0)
    setTimeCounter(0)
    setMatchedTransactions([])

    const totalTransactions = 50
    const duration = 30000 // 30 seconds
    const interval = duration / totalTransactions

    let currentTransaction = 0
    const startTime = Date.now()

    const reconciliationInterval = setInterval(() => {
      currentTransaction++
      const progress = (currentTransaction / totalTransactions) * 100
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000)

      setReconciliationProgress(progress)
      setTimeCounter(elapsedTime)

      if (currentTransaction <= reconciliationTransactions.length) {
        setMatchedTransactions((prev) => [...prev, reconciliationTransactions[currentTransaction - 1].id])
      }

      if (currentTransaction >= totalTransactions) {
        clearInterval(reconciliationInterval)
        setReconciliationState("complete")
        setShowSuccessAnimation(true)
        toast({
          title: "🎉 Reconciliation Complete!",
          description: `${totalTransactions} transactions processed in ${elapsedTime} seconds. Time saved: 2 hours → 30 seconds`,
        })
        setTimeout(() => setShowSuccessAnimation(false), 5000)
      }
    }, interval)
  }

  const availableApprovals = executiveActions.filter(action => action.priority === "urgent" || action.priority === "high")
  const currentApproval = availableApprovals[currentApprovalIndex]

  const navigateApproval = (direction: 'next' | 'prev') => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentApprovalIndex((prev) => (prev + 1) % availableApprovals.length)
      } else {
        setCurrentApprovalIndex((prev) => (prev - 1 + availableApprovals.length) % availableApprovals.length)
      }
      setIsTransitioning(false)
    }, 150)
  }

  const handleApproval = (actionId: number) => {
    toast({
      title: "✅ Approved Successfully",
      description: "Request has been approved and user notified.",
    })
    
    // Auto-advance to next approval after a brief delay
    setTimeout(() => {
      if (availableApprovals.length > 1) {
        navigateApproval('next')
      }
    }, 800)
  }

  const handleDeny = (actionId: number) => {
    setDenyingActionId(actionId)
  }

  const submitDenyReason = () => {
    if (denyReason.trim()) {
      toast({
        title: "❌ Request Declined",
        description: `Reason sent to requester: "${denyReason}"`,
      })
      setDenyingActionId(null)
      setDenyReason("")
      
      // Auto-advance to next approval after denial
      setTimeout(() => {
        if (availableApprovals.length > 1) {
          navigateApproval('next')
        }
      }, 800)
    }
  }

  const filteredExpenses =
    selectedProject === "all"
      ? recentExpenses
      : recentExpenses.filter((expense) => expense.project.toLowerCase().includes(selectedProject.toLowerCase()))

  if (isLoading) {
    return (
      <MainLayout>
        <TableSkeleton rows={8} />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground transition-all duration-300 hover:scale-105">
              Cost Tracking
            </h1>
            <p className="text-muted-foreground">Real-time expense reconciliation and budget monitoring</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 transition-all duration-200 hover:scale-105 bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 transition-all duration-200 hover:scale-105 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="h-10 transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Cost Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-xs font-medium">Total Budget</CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-1 pb-1">
              <div className="text-base font-bold">
                <AnimatedCounter end={costSummary.totalBudget} prefix="£" />
              </div>
              <p className="text-xs text-muted-foreground leading-none mb-2">
                £{costSummary.totalSpent.toLocaleString()} spent ({budgetUtilization.toFixed(1)}%)
              </p>
              
              {/* Budget Forecasting Section */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Budget Forecasting</span>
                  <div className={`w-2 h-2 rounded-full ${getBudgetStatus(budgetForecasting.status).dot}`}></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Burn Rate:</span>
                    <span className="text-xs font-medium">£{(budgetForecasting.monthlyBurnRate / 1000).toFixed(1)}K/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Runway:</span>
                    <span className="text-xs font-medium">{budgetForecasting.runwayMonths} months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Forecast:</span>
                    <span className={`text-xs font-medium ${getBudgetStatus(budgetForecasting.status).color}`}>
                      {getBudgetStatus(budgetForecasting.status).label}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-xs font-medium">This Month</CardTitle>
              <Calendar className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-1 pb-1">
              <div className="text-base font-bold">
                <AnimatedCounter end={costSummary.thisMonth} prefix="£" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center leading-none mb-2">
                {monthlyChange > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                )}
                {Math.abs(monthlyChange).toFixed(1)}% from last month
              </p>

              {/* Monthly Overview Section */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Monthly Overview</span>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Income:</span>
                    <span className="text-xs font-medium text-green-600">£{(monthlyData.currentIncome / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Expenses:</span>
                    <span className="text-xs font-medium text-red-600">£{(monthlyData.totalExpenses / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Net Profit:</span>
                    <span className="text-xs font-bold text-green-600">£{(monthlyData.netProfit / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Margin:</span>
                    <span className="text-xs font-medium">{monthlyData.profitMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Executive Actions Card */}
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-xs font-medium">Requires Approval</CardTitle>
                {availableApprovals.length > 0 && (
                  <Badge variant="secondary" className="h-4 text-xs px-1.5">
                    {currentApprovalIndex + 1} of {availableApprovals.length}
                  </Badge>
                )}
              </div>
              <User className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-1 pb-2">
              {availableApprovals.length === 0 ? (
                <div className="text-center py-3 text-xs text-muted-foreground">
                  <CheckCircle className="h-4 w-4 mx-auto mb-1 text-green-500" />
                  All approvals complete!
                </div>
              ) : currentApproval ? (
                <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                  <div 
                    className="group p-1.5 rounded border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-bold text-gray-900 leading-none">£{currentApproval.amount.toLocaleString()}</div>
                        <div className="text-xs font-medium text-gray-700 truncate leading-tight">{currentApproval.title}</div>
                        <div className="text-xs text-muted-foreground truncate leading-none">{currentApproval.project}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${currentApproval.priority === "urgent" ? 'bg-red-500' : 'bg-orange-500'} animate-pulse ml-1`}></div>
                    </div>
                    
                    {/* Hover details - hidden by default */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1">
                      <div className="text-xs text-blue-700 font-medium">
                        {currentApproval.priority === "urgent" ? `⚡ Pending ${currentApproval.daysPending} days` : `Pending ${currentApproval.daysPending} days`}
                      </div>
                      <div className="text-xs text-gray-600">{currentApproval.description}</div>
                    </div>

                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproval(currentApproval.id)}
                        className="h-5 text-xs px-1.5 bg-green-600 hover:bg-green-700 group-hover:shadow-md transition-all duration-300"
                      >
                        ✓
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeny(currentApproval.id)}
                        className="h-5 text-xs px-1.5 border-red-200 text-red-600 hover:bg-red-50 group-hover:shadow-md transition-all duration-300"
                      >
                        ✗
                      </Button>
                    </div>
                  </div>

                  {/* Navigation */}
                  {availableApprovals.length > 1 && (
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateApproval('prev')}
                        disabled={isTransitioning}
                        className="h-5 w-5 p-0 hover:bg-gray-100"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      
                      <div className="flex space-x-0.5">
                        {availableApprovals.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1 h-1 rounded-full transition-colors duration-200 ${
                              index === currentApprovalIndex ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateApproval('next')}
                        disabled={isTransitioning}
                        className="h-5 w-5 p-0 hover:bg-gray-100"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>


        {/* Live Expense Management */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle>Live Expenses</CardTitle>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Live Updates</span>
                    </div>
                  </div>
                  <CardDescription>Real-time expense monitoring and approval</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-orange-600">
                    {filteredExpenses.filter(e => e.status === "pending").length} Pending
                  </div>
                  <div className="text-xs text-muted-foreground">
                    £{filteredExpenses.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0).toLocaleString()} total
                  </div>
                </div>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="henderson">Henderson Golf</SelectItem>
                    <SelectItem value="marchmont">Marchmont Historic</SelectItem>
                    <SelectItem value="office">Office Refurb</SelectItem>
                    <SelectItem value="garden">Garden Landscape</SelectItem>
                    <SelectItem value="bathroom">Bathroom Refit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredExpenses
                .sort((a, b) => {
                  const priorityOrder = { urgent: 0, high: 1, normal: 2 }
                  return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
                })
                .map((expense) => {
                  const priority = getExpensePriority(expense.amount)
                  const isUrgent = expense.priority === "urgent"
                  const isHigh = expense.priority === "high"
                  const categoryStyles = getCategoryAccentStyles(expense.category)
                  
                  return (
                    <div 
                      key={expense.id}
                      className={`group relative p-3 rounded border bg-white transition-all duration-300 hover:shadow-md hover:scale-[1.005] ${
                        expense.isNew ? 'animate-in slide-in-from-top duration-500 border-blue-300 bg-blue-50' :
                        `border-gray-200 ${categoryStyles.hover}`
                      }`}
                    >
                      {/* Priority Indicator */}
                      {(isUrgent || isHigh) && (
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300 ${
                          isUrgent ? 'bg-red-500 group-hover:animate-pulse' : 'bg-orange-500 group-hover:animate-pulse'
                        }`}></div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <div className={`text-lg font-bold ${priority.text}`}>
                              £{expense.amount.toLocaleString()}
                            </div>
                            <div className="flex items-center space-x-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                              {expense.receipt ? (
                                <Receipt className="h-3 w-3 text-green-600" />
                              ) : (
                                <div className="h-3 w-3 rounded border border-dashed border-gray-400" />
                              )}
                            </div>
                            <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                              {getStatusBadge(expense.status)}
                            </div>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium text-gray-900 truncate">{expense.description}</div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="truncate">{expense.vendor}</span>
                              <span>•</span>
                              <span className="bg-gray-100 group-hover:bg-gray-200 px-1.5 py-0.5 rounded text-xs truncate max-w-24 transition-colors duration-300">{expense.project.split(' ')[0]}</span>
                              <span>•</span>
                              <span className="whitespace-nowrap">{expense.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-3">
                          {expense.status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleApproval(expense.id)}
                                className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700 text-xs"
                              >
                                ✓
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeny(expense.id)}
                                className="h-6 w-6 p-0 border-red-200 text-red-600 hover:bg-red-50 text-xs"
                              >
                                ✗
                              </Button>
                            </>
                          )}
                          
                          {expense.amount > 5000 && expense.status === "pending" && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-40 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" title="Executive approval required"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Deny Reason Dialog */}
      <Dialog open={denyingActionId !== null} onOpenChange={() => setDenyingActionId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Decline Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this request. This will be sent to the person who made the request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason for declining..."
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDenyingActionId(null)
                setDenyReason("")
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={submitDenyReason}
              disabled={!denyReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Send & Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
