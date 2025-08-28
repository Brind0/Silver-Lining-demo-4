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
} from "lucide-react"

const costSummary = {
  totalBudget: 125000,
  totalSpent: 87500,
  thisMonth: 12500,
  lastMonth: 15000,
  categories: [
    { name: "Materials", budgeted: 60000, spent: 45000, percentage: 75 },
    { name: "Labor", budgeted: 40000, spent: 28000, percentage: 70 },
    { name: "Equipment", budgeted: 15000, spent: 10500, percentage: 70 },
    { name: "Permits", budgeted: 5000, spent: 2500, percentage: 50 },
    { name: "Other", budgeted: 5000, spent: 1500, percentage: 30 },
  ],
}

const recentExpenses = [
  {
    id: 1,
    date: "2024-02-15",
    description: "Kitchen Cabinets - Oak Wood",
    category: "Materials",
    project: "Kitchen Renovation - Maple Street",
    amount: 3500,
    status: "approved",
    receipt: true,
  },
  {
    id: 2,
    date: "2024-02-14",
    description: "Electrical Work - Phase 2",
    category: "Labor",
    project: "Office Refurbishment",
    amount: 1200,
    status: "pending",
    receipt: false,
  },
  {
    id: 3,
    date: "2024-02-13",
    description: "Concrete Mixer Rental",
    category: "Equipment",
    project: "Garden Landscaping",
    amount: 250,
    status: "approved",
    receipt: true,
  },
  {
    id: 4,
    date: "2024-02-12",
    description: "Building Permit Fee",
    category: "Permits",
    project: "Bathroom Refit",
    amount: 450,
    status: "approved",
    receipt: true,
  },
  {
    id: 5,
    date: "2024-02-11",
    description: "Plumbing Supplies",
    category: "Materials",
    project: "Bathroom Refit",
    amount: 680,
    status: "approved",
    receipt: true,
  },
]

const reconciliationTransactions = [
  { id: 1, description: "Henderson Golf Sim - Equipment", amount: 28500, matched: false },
  { id: 2, description: "Marchmont Historic - Materials", amount: 15000, matched: false },
  { id: 3, description: "Wentworth Golf Sim - Planning", amount: 3200, matched: false },
  { id: 4, description: "Tunbridge Restoration - Labor", amount: 8500, matched: false },
  { id: 5, description: "Ascot Entertainment - Design", amount: 4200, matched: false },
  { id: 6, description: "Henderson Golf Sim - Installation", amount: 2500, matched: false },
  { id: 7, description: "Marchmont Historic - Permits", amount: 3200, matched: false },
  { id: 8, description: "Wentworth Golf Sim - Materials", amount: 1800, matched: false },
  { id: 9, description: "Tunbridge Restoration - Equipment", amount: 950, matched: false },
  { id: 10, description: "Ascot Entertainment - Consultation", amount: 1200, matched: false },
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
    case "Labor":
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

export default function CostsPage() {
  const [uploadState, setUploadState] = useState<"idle" | "processing" | "success">("idle")
  const [reconciliationState, setReconciliationState] = useState<"idle" | "running" | "complete">("idle")
  const [reconciliationProgress, setReconciliationProgress] = useState(0)
  const [timeCounter, setTimeCounter] = useState(0)
  const [matchedTransactions, setMatchedTransactions] = useState<number[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedCounter end={costSummary.totalBudget} prefix="£" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                £{costSummary.totalSpent.toLocaleString()} spent ({budgetUtilization.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedCounter end={costSummary.thisMonth} prefix="£" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                {monthlyChange > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                )}
                {Math.abs(monthlyChange).toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <PulseBadge
                  pulse={true}
                  pulseColor="amber"
                  className="text-2xl font-bold bg-transparent border-none p-0"
                >
                  3
                </PulseBadge>
              </div>
              <p className="text-xs text-muted-foreground">£2,450 total value</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedCounter end={8} suffix=" hrs" />
              </div>
              <p className="text-xs text-muted-foreground">this week via automation</p>
            </CardContent>
          </Card>
        </div>

        {/* Receipt Upload Demo and Reconciliation Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Receipt Upload & Processing
              </CardTitle>
              <CardDescription>AI-powered OCR with automatic expense matching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-all duration-500 ${
                  uploadState === "processing"
                    ? "border-blue-300 bg-blue-50 scale-105"
                    : uploadState === "success"
                      ? "border-green-300 bg-green-50 scale-105"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {uploadState === "idle" && (
                  <div className="space-y-3 transition-all duration-300">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground transition-transform duration-300 hover:scale-110" />
                    <p className="text-sm font-medium">Drop receipt here or click to upload</p>
                    <p className="text-xs text-muted-foreground">Supports JPG, PNG, PDF</p>
                    <Button
                      onClick={handleReceiptUpload}
                      className="mt-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Receipt
                    </Button>
                  </div>
                )}

                {uploadState === "processing" && (
                  <div className="space-y-3 animate-in fade-in duration-500">
                    <div className="relative">
                      <div className="animate-spin h-8 w-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <Sparkles className="h-4 w-4 absolute top-2 left-1/2 transform -translate-x-1/2 text-blue-500 animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-blue-700 animate-pulse">Processing receipt...</p>
                    <p className="text-xs text-blue-600">Extracting data with OCR</p>
                  </div>
                )}

                {uploadState === "success" && (
                  <div className="space-y-3 animate-in zoom-in duration-500">
                    <div className="relative">
                      <CheckCircle className="h-8 w-8 mx-auto text-green-500 animate-bounce" />
                      {showSuccessAnimation && (
                        <div className="absolute inset-0 animate-ping">
                          <CheckCircle className="h-8 w-8 mx-auto text-green-400 opacity-75" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-green-700">Receipt processed successfully!</p>
                    <p className="text-xs text-green-600">Data extracted and expense created</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500 animate-pulse" />
                Instant Reconciliation Demo
              </CardTitle>
              <CardDescription>Watch 50 transactions reconcile in 30 seconds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reconciliationState === "idle" && (
                <div className="text-center space-y-4 transition-all duration-300">
                  <div className="text-4xl font-bold text-muted-foreground animate-pulse">
                    <AnimatedCounter end={50} />
                  </div>
                  <p className="text-sm text-muted-foreground">transactions ready to reconcile</p>
                  <Button
                    onClick={startReconciliation}
                    size="lg"
                    className="w-full transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Start Reconciliation Demo
                  </Button>
                  <p className="text-xs text-muted-foreground">Traditional method: 2 hours → Our system: 30 seconds</p>
                </div>
              )}

              {reconciliationState === "running" && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 animate-pulse">
                      <AnimatedCounter end={Math.floor(reconciliationProgress)} />
                    </div>
                    <p className="text-sm text-muted-foreground">transactions processed</p>
                  </div>
                  <Progress value={reconciliationProgress} className="h-4 transition-all duration-300">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300" />
                  </Progress>
                  <div className="flex justify-between text-sm">
                    <span className="animate-pulse">Time: {timeCounter}s</span>
                    <span className="animate-pulse">
                      Speed: {Math.floor(reconciliationProgress / Math.max(timeCounter, 1))} tx/sec
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600 animate-pulse">
                      Time Saved: 2 hours <ArrowRight className="inline h-4 w-4 mx-1 animate-bounce" /> {timeCounter}{" "}
                      seconds
                    </div>
                  </div>
                </div>
              )}

              {reconciliationState === "complete" && (
                <div className="text-center space-y-4 animate-in zoom-in duration-700">
                  <div className="relative">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 animate-bounce" />
                    {showSuccessAnimation && (
                      <div className="absolute inset-0 animate-ping">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-400 opacity-75" />
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-green-600 animate-pulse">Complete!</div>
                  <p className="text-sm text-muted-foreground">50 transactions in {timeCounter} seconds</p>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 animate-in slide-in-from-bottom duration-500">
                    <p className="text-sm font-medium text-green-800">💰 Time Saved: 1 hour 59 minutes 30 seconds</p>
                  </div>
                  <Button
                    onClick={() => setReconciliationState("idle")}
                    variant="outline"
                    className="w-full bg-transparent transition-all duration-200 hover:scale-105"
                  >
                    Run Demo Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Budget Utilization */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Budget Utilization by Category</CardTitle>
            <CardDescription>Track spending against budgeted amounts for each category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {costSummary.categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getCategoryColor(category.name)}`}>{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        £{category.spent.toLocaleString()} / £{category.budgeted.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">{category.percentage}% utilized</div>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Latest expense entries with approval workflow</CardDescription>
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="henderson">Henderson Golf Sim</SelectItem>
                  <SelectItem value="marchmont">Marchmont Historic</SelectItem>
                  <SelectItem value="wentworth">Wentworth Golf Sim</SelectItem>
                  <SelectItem value="tunbridge">Tunbridge Restoration</SelectItem>
                  <SelectItem value="ascot">Ascot Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>VAT</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{expense.project}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="font-medium">£{expense.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      £{Math.floor(expense.amount * 0.2).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(expense.status)}
                        {expense.status === "pending" && expense.amount >= 500 && expense.amount <= 5000 && (
                          <div className="flex space-x-1">
                            <Button size="sm" className="h-6 text-xs px-2">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2 bg-transparent">
                              Reject
                            </Button>
                          </div>
                        )}
                        {expense.amount > 5000 && (
                          <Badge variant="outline" className="text-xs">
                            Requires Emily + Simon approval
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Expense</DropdownMenuItem>
                          <DropdownMenuItem>Upload Receipt</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Live Transaction Matching */}
        {reconciliationState === "running" && matchedTransactions.length > 0 && (
          <Card className="animate-in slide-in-from-bottom duration-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-500 animate-pulse" />
                Live Transaction Matching
              </CardTitle>
              <CardDescription>Watch transactions being matched in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {reconciliationTransactions
                  .filter((tx) => matchedTransactions.includes(tx.id))
                  .map((transaction, index) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-right duration-500 hover:shadow-md transition-all"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
                        <span className="text-sm font-medium">{transaction.description}</span>
                      </div>
                      <span className="text-sm font-bold text-green-700">£{transaction.amount.toLocaleString()}</span>
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
