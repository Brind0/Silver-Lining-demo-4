"use client"

import { useState, use } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, ComposedChart } from "recharts"
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  FileText,
  ImageIcon,
  Check,
  ChevronDown,
  Download,
} from "lucide-react"
import Link from "next/link"

const projects = [
  {
    id: 1,
    name: "Henderson Golf Sim",
    budget: 45000,
    spent: 38000,
    status: "AMBER",
    statusPhrase: "Over budget",
    overrunPercentage: 6,
    progress: 84,
    client: "Henderson Estate",
    startDate: "2024-01-15",
    endDate: "2024-04-30",
    description: "Installation of state-of-the-art golf simulation system with premium finishes and custom lighting.",
    team: [
      { name: "John Smith", role: "Project Manager", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Sarah Wilson", role: "Installation Lead", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Mike Johnson", role: "Technical Specialist", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    phases: [
      { name: "Planning", status: "completed", progress: 100 },
      { name: "Site Preparation", status: "completed", progress: 100 },
      { name: "Equipment Installation", status: "in-progress", progress: 84 },
      { name: "Calibration", status: "pending", progress: 0 },
      { name: "Final Testing", status: "pending", progress: 0 },
    ],
    expenses: [
      { category: "Equipment", budgeted: 30000, spent: 28500, status: "Approved" },
      { category: "Installation", budgeted: 12000, spent: 8200, status: "Approved" },
      { category: "Materials", budgeted: 3000, spent: 1300, status: "Pending" },
    ],
    recentExpenses: [
      { date: "2024-02-15", description: "Golf simulator equipment", amount: 28500, vat: 5700, status: "Approved" },
      { date: "2024-02-10", description: "Installation materials", amount: 1200, vat: 240, status: "Approved" },
      { date: "2024-02-08", description: "Electrical work", amount: 2500, vat: 500, status: "Pending Approval" },
    ],
    documents: [
      { name: "Project Specification.pdf", uploadDate: "2024-01-10" },
      { name: "Installation Manual.pdf", uploadDate: "2024-01-20" },
      { name: "Safety Guidelines.pdf", uploadDate: "2024-01-25" },
    ],
    photos: [
      { name: "Site Survey - Week 1.jpg", uploadDate: "2024-01-15" },
      { name: "Installation Progress.jpg", uploadDate: "2024-02-01" },
      { name: "Equipment Setup.jpg", uploadDate: "2024-02-10" },
    ],
    tasks: [
      { id: 1, name: "Install main electrical panel", category: "electrical", status: "completed", assignee: "John Smith", dueDate: "2024-02-15", description: "Install 200-amp electrical panel with dedicated circuits for golf simulator equipment", priority: "High", estimatedHours: 8, actualHours: 7, notes: "Completed ahead of schedule. All circuits tested and approved by inspector." },
      { id: 2, name: "Run wiring for simulator", category: "electrical", status: "completed", assignee: "Sarah Wilson", dueDate: "2024-02-20", description: "Run dedicated 220V wiring from panel to simulator location", priority: "High", estimatedHours: 6, actualHours: 6, notes: "Wiring completed and tested. Ready for equipment connection." },
      { id: 3, name: "Install water supply lines", category: "plumbing", status: "in-progress", assignee: "Mike Johnson", dueDate: "2024-03-01", description: "Install water supply for climate control and cleaning systems", priority: "Medium", estimatedHours: 4, actualHours: 2, notes: "60% complete. Waiting for specialized fittings delivery." },
      { id: 4, name: "Build custom framework", category: "carpenter", status: "pending", assignee: "John Smith", dueDate: "2024-03-10", description: "Construct custom wooden framework for simulator mounting", priority: "High", estimatedHours: 12, actualHours: 0, notes: "Materials ordered. Waiting for electrical work completion." },
      { id: 5, name: "Install flooring", category: "other", status: "pending", assignee: "Sarah Wilson", dueDate: "2024-03-15", description: "Install specialized anti-static flooring for simulator area", priority: "Medium", estimatedHours: 8, actualHours: 0, notes: "Flooring materials in storage. Scheduled after framework completion." },
      { id: 6, name: "Connect drainage system", category: "plumbing", status: "in-progress", assignee: "Mike Johnson", dueDate: "2024-03-05", description: "Connect drainage for HVAC condensation and cleaning runoff", priority: "Low", estimatedHours: 3, actualHours: 1, notes: "Drainage partially connected. Final connections pending." },
      { id: 7, name: "Install lighting fixtures", category: "electrical", status: "pending", assignee: "John Smith", dueDate: "2024-03-20", description: "Install LED lighting system with dimmer controls", priority: "Medium", estimatedHours: 5, actualHours: 0, notes: "Fixtures selected and approved by client. Installation scheduled." },
    ],
    weeklySpending: [
      { week: "Week 1", date: "Jan 15", spent: 8000, cumulative: 8000, forecast: 8500, weekNumber: 1 },
      { week: "Week 2", date: "Jan 22", spent: 12000, cumulative: 20000, forecast: 17000, weekNumber: 2 },
      { week: "Week 3", date: "Jan 29", spent: 9500, cumulative: 29500, forecast: 25500, weekNumber: 3 },
      { week: "Week 4", date: "Feb 5", spent: 8500, cumulative: 38000, forecast: 34000, weekNumber: 4 },
      { week: "Week 5", date: "Feb 12", spent: 0, cumulative: 38000, forecast: 42500, weekNumber: 5 },
      { week: "Week 6", date: "Feb 19", spent: 0, cumulative: 38000, forecast: 46000, weekNumber: 6, riskAlert: { overrun: 6000, confidence: 85, date: "Apr 15", action: "Switch to Supplier B, £2k savings" }},
      { week: "Week 7", date: "Feb 26", spent: 0, cumulative: 38000, forecast: 48500, weekNumber: 7 },
      { week: "Week 8", date: "Mar 5", spent: 0, cumulative: 38000, forecast: 51000, weekNumber: 8 },
    ],
    currentWeekPosition: 4.3,
    budgetForecast: {
      projectedTotal: 51000,
      overrunAmount: 6000,
      overrunDate: "2024-04-15",
      currentBurnRate: 6500,
      daysUntilOverrun: 21,
      confidence: 85
    }
  },
  {
    id: 2,
    name: "Marchmont Historic",
    budget: 120000,
    spent: 165000,
    status: "RED",
    statusPhrase: "Critical overrun",
    overrunPercentage: 37.5,
    progress: 75,
    client: "Marchmont Trust",
    startDate: "2023-11-01",
    endDate: "2024-05-15",
    description: "Historic building restoration with period-appropriate materials and modern safety standards.",
    team: [
      { name: "Emma Davis", role: "Heritage Specialist", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Tom Brown", role: "Restoration Lead", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Alice Cooper", role: "Project Coordinator", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    phases: [
      { name: "Assessment", status: "completed", progress: 100 },
      { name: "Structural Work", status: "completed", progress: 100 },
      { name: "Restoration", status: "in-progress", progress: 75 },
      { name: "Final Inspection", status: "pending", progress: 0 },
    ],
    expenses: [
      { category: "Materials", budgeted: 80000, spent: 110000, status: "Over Budget" },
      { category: "Labor", budgeted: 35000, spent: 45000, status: "Over Budget" },
      { category: "Permits", budgeted: 5000, spent: 10000, status: "Over Budget" },
    ],
    recentExpenses: [
      { date: "2024-02-12", description: "Period stone materials", amount: 15000, vat: 3000, status: "Approved" },
      { date: "2024-02-05", description: "Specialist craftsman", amount: 8500, vat: 1700, status: "Approved" },
      { date: "2024-01-28", description: "Additional permits", amount: 3200, vat: 640, status: "Pending Approval" },
    ],
    documents: [
      { name: "Heritage Assessment.pdf", uploadDate: "2023-10-15" },
      { name: "Building Plans.pdf", uploadDate: "2023-11-01" },
      { name: "Conservation Report.pdf", uploadDate: "2023-12-10" },
    ],
    photos: [
      { name: "Before Restoration.jpg", uploadDate: "2023-11-05" },
      { name: "Structural Work Progress.jpg", uploadDate: "2024-01-15" },
      { name: "Material Samples.jpg", uploadDate: "2024-02-01" },
    ],
    tasks: [
      { id: 1, name: "Restore period stonework", category: "carpenter", status: "completed", assignee: "Emma Davis", dueDate: "2024-01-20", description: "Restore original limestone facade using traditional techniques", priority: "High", estimatedHours: 40, actualHours: 38, notes: "Restoration completed to heritage standards. Stone color perfectly matched." },
      { id: 2, name: "Update electrical systems", category: "electrical", status: "completed", assignee: "Tom Brown", dueDate: "2024-02-01", description: "Upgrade electrical systems while maintaining period aesthetics", priority: "High", estimatedHours: 24, actualHours: 26, notes: "All wiring hidden within walls. Modern safety standards met." },
      { id: 3, name: "Repair roof drainage", category: "plumbing", status: "in-progress", assignee: "Alice Cooper", dueDate: "2024-02-28", description: "Repair and upgrade roof drainage system with period-appropriate materials", priority: "High", estimatedHours: 16, actualHours: 12, notes: "75% complete. Custom lead work in progress." },
      { id: 4, name: "Install heritage windows", category: "carpenter", status: "in-progress", assignee: "Emma Davis", dueDate: "2024-03-15", description: "Install custom-made sash windows matching original specifications", priority: "Medium", estimatedHours: 32, actualHours: 20, notes: "First floor windows installed. Ground floor in progress." },
      { id: 5, name: "Conservation cleaning", category: "other", status: "pending", assignee: "Tom Brown", dueDate: "2024-04-01", description: "Gentle cleaning of historic surfaces using approved conservation methods", priority: "Low", estimatedHours: 20, actualHours: 0, notes: "Awaiting completion of other work. Cleaning products approved by heritage officer." },
      { id: 6, name: "Install period plumbing", category: "plumbing", status: "pending", assignee: "Alice Cooper", dueDate: "2024-03-30", description: "Install modern plumbing systems concealed within period fixtures", priority: "Medium", estimatedHours: 18, actualHours: 0, notes: "Period fixtures sourced and ready. Installation follows drainage completion." },
    ],
    weeklySpending: [
      { week: "Week 1", date: "Jan 15", spent: 8000, cumulative: 8000, forecast: 8500, weekNumber: 1 },
      { week: "Week 2", date: "Jan 22", spent: 12000, cumulative: 20000, forecast: 17000, weekNumber: 2 },
      { week: "Week 3", date: "Jan 29", spent: 9500, cumulative: 29500, forecast: 25500, weekNumber: 3 },
      { week: "Week 4", date: "Feb 5", spent: 8500, cumulative: 38000, forecast: 34000, weekNumber: 4 },
      { week: "Week 5", date: "Feb 12", spent: 0, cumulative: 38000, forecast: 42500, weekNumber: 5 },
      { week: "Week 6", date: "Feb 19", spent: 0, cumulative: 38000, forecast: 46000, weekNumber: 6, riskAlert: { overrun: 6000, confidence: 85, date: "Apr 15", action: "Switch to Supplier B, £2k savings" }},
      { week: "Week 7", date: "Feb 26", spent: 0, cumulative: 38000, forecast: 48500, weekNumber: 7 },
      { week: "Week 8", date: "Mar 5", spent: 0, cumulative: 38000, forecast: 51000, weekNumber: 8 },
    ],
    currentWeekPosition: 4.3,
    budgetForecast: {
      projectedTotal: 51000,
      overrunAmount: 6000,
      overrunDate: "2024-04-15",
      currentBurnRate: 6500,
      daysUntilOverrun: 21,
      confidence: 85
    }
  },
  {
    id: 2,
    name: "Marchmont Historic",
    budget: 120000,
    spent: 165000,
    status: "RED",
    statusPhrase: "Critical overrun",
    overrunPercentage: 37.5,
    progress: 75,
    client: "Marchmont Trust",
    startDate: "2023-11-01",
    endDate: "2024-05-15",
    description: "Historic building restoration with period-appropriate materials and modern safety standards.",
    team: [
      { name: "Emma Davis", role: "Heritage Specialist", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Tom Brown", role: "Restoration Lead", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Alice Cooper", role: "Project Coordinator", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    phases: [
      { name: "Assessment", status: "completed", progress: 100 },
      { name: "Structural Work", status: "completed", progress: 100 },
      { name: "Restoration", status: "in-progress", progress: 75 },
      { name: "Final Inspection", status: "pending", progress: 0 },
    ],
    expenses: [
      { category: "Materials", budgeted: 80000, spent: 110000, status: "Over Budget" },
      { category: "Labor", budgeted: 35000, spent: 45000, status: "Over Budget" },
      { category: "Permits", budgeted: 5000, spent: 10000, status: "Over Budget" },
    ],
    recentExpenses: [
      { date: "2024-02-12", description: "Period stone materials", amount: 15000, vat: 3000, status: "Approved" },
      { date: "2024-02-05", description: "Specialist craftsman", amount: 8500, vat: 1700, status: "Approved" },
      { date: "2024-01-28", description: "Additional permits", amount: 3200, vat: 640, status: "Pending Approval" },
    ],
    documents: [
      { name: "Heritage Assessment.pdf", uploadDate: "2023-10-15" },
      { name: "Building Plans.pdf", uploadDate: "2023-11-01" },
      { name: "Conservation Report.pdf", uploadDate: "2023-12-10" },
    ],
    photos: [
      { name: "Before Restoration.jpg", uploadDate: "2023-11-05" },
      { name: "Structural Work Progress.jpg", uploadDate: "2024-01-15" },
      { name: "Material Samples.jpg", uploadDate: "2024-02-01" },
    ],
    tasks: [
      { id: 1, name: "Restore period stonework", category: "carpenter", status: "completed", assignee: "Emma Davis", dueDate: "2024-01-20", description: "Restore original limestone facade using traditional techniques", priority: "High", estimatedHours: 40, actualHours: 38, notes: "Restoration completed to heritage standards. Stone color perfectly matched." },
      { id: 2, name: "Update electrical systems", category: "electrical", status: "completed", assignee: "Tom Brown", dueDate: "2024-02-01", description: "Upgrade electrical systems while maintaining period aesthetics", priority: "High", estimatedHours: 24, actualHours: 26, notes: "All wiring hidden within walls. Modern safety standards met." },
      { id: 3, name: "Repair roof drainage", category: "plumbing", status: "in-progress", assignee: "Alice Cooper", dueDate: "2024-02-28", description: "Repair and upgrade roof drainage system with period-appropriate materials", priority: "High", estimatedHours: 16, actualHours: 12, notes: "75% complete. Custom lead work in progress." },
      { id: 4, name: "Install heritage windows", category: "carpenter", status: "in-progress", assignee: "Emma Davis", dueDate: "2024-03-15", description: "Install custom-made sash windows matching original specifications", priority: "Medium", estimatedHours: 32, actualHours: 20, notes: "First floor windows installed. Ground floor in progress." },
      { id: 5, name: "Conservation cleaning", category: "other", status: "pending", assignee: "Tom Brown", dueDate: "2024-04-01", description: "Gentle cleaning of historic surfaces using approved conservation methods", priority: "Low", estimatedHours: 20, actualHours: 0, notes: "Awaiting completion of other work. Cleaning products approved by heritage officer." },
      { id: 6, name: "Install period plumbing", category: "plumbing", status: "pending", assignee: "Alice Cooper", dueDate: "2024-03-30", description: "Install modern plumbing systems concealed within period fixtures", priority: "Medium", estimatedHours: 18, actualHours: 0, notes: "Period fixtures sourced and ready. Installation follows drainage completion." },
    ],
    weeklySpending: [
      { week: "Week 1", spent: 20000, cumulative: 20000, forecast: 18000 },
      { week: "Week 2", spent: 25000, cumulative: 45000, forecast: 36000 },
      { week: "Week 3", spent: 30000, cumulative: 75000, forecast: 54000 },
      { week: "Week 4", spent: 28000, cumulative: 103000, forecast: 72000 },
      { week: "Week 5", spent: 35000, cumulative: 138000, forecast: 90000 },
      { week: "Week 6", spent: 27000, cumulative: 165000, forecast: 108000 },
      { week: "Week 7", spent: 0, cumulative: 165000, forecast: 126000 },
      { week: "Week 8", spent: 0, cumulative: 165000, forecast: 144000 },
    ],
    budgetForecast: {
      projectedTotal: 195000,
      overrunAmount: 75000,
      overrunDate: "2024-01-28",
      currentBurnRate: 28500,
      daysUntilOverrun: -30,
      confidence: 92
    }
  },
]

function getProjectData(id: string) {
  return projects.find((p) => p.id === Number.parseInt(id)) || projects[0]
}

function getStatusIcon(status: string) {
  switch (status) {
    case "GREEN":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "AMBER":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    case "RED":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "GREEN":
      return "On Progress"
    case "AMBER":
      return "At Risk"
    case "RED":
      return "Critical"
    default:
      return "Unknown"
  }
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const projectData = getProjectData(id)
  const [activeTab, setActiveTab] = useState("overview")
  const [groupTasks, setGroupTasks] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [taskAssignments, setTaskAssignments] = useState<{[key: number]: string}>({})

  const toggleTaskCompletion = (taskId: number) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const openTaskDetails = (task: any) => {
    setSelectedTask(task)
  }

  const updateTaskAssignee = (taskId: number, newAssignee: string) => {
    setTaskAssignments(prev => ({ ...prev, [taskId]: newAssignee }))
  }

  const getTaskAssignee = (task: any) => {
    return taskAssignments[task.id] || task.assignee
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 border-red-200"
      case "Medium": return "text-amber-600 bg-amber-50 border-amber-200"
      case "Low": return "text-green-600 bg-green-50 border-green-200"
      default: return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getBudgetStatus = (project: any) => {
    if (!project.budgetForecast) {
      return { status: "unknown", color: "bg-gray-500", textColor: "text-gray-700" }
    }
    const overrunPercentage = ((project.budgetForecast.projectedTotal - project.budget) / project.budget) * 100
    if (overrunPercentage <= 5) return { status: "on-track", color: "bg-green-500", textColor: "text-green-700" }
    if (overrunPercentage <= 15) return { status: "at-risk", color: "bg-amber-500", textColor: "text-amber-700" }
    return { status: "over-budget", color: "bg-red-500", textColor: "text-red-700" }
  }

  const formatOverrunWarning = (project: any) => {
    if (!project.budgetForecast) return "No forecast available"
    const overrun = project.budgetForecast.overrunAmount
    const days = project.budgetForecast.daysUntilOverrun
    if (days < 0) return `£${overrun.toLocaleString()} Already Over Budget`
    if (days <= 30) return `£${overrun.toLocaleString()} Overrun Forecast in ${days} days`
    return `£${overrun.toLocaleString()} Projected Overrun`
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{projectData.name}</h1>
              <p className="text-muted-foreground">{projectData.client}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={projectData.status === "RED" ? "destructive" : "secondary"}
              className={
                projectData.status === "AMBER"
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : projectData.status === "GREEN"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : ""
              }
            >
              {projectData.status}
            </Badge>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </div>
        </div>

        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Progress Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-gray-600">Progress</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={
                    projectData.status === "GREEN" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : projectData.status === "AMBER"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                  }
                >
                  {getStatusText(projectData.status)}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{projectData.progress}%</div>
              <Progress 
                value={projectData.progress} 
                className={`h-2 ${
                  projectData.status === "GREEN" 
                    ? "[&>div]:bg-green-500" 
                    : projectData.status === "AMBER"
                      ? "[&>div]:bg-amber-500"
                      : "[&>div]:bg-red-500"
                }`}
              />
            </CardContent>
          </Card>

          {/* Budget Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 text-muted-foreground text-sm font-semibold flex items-center justify-center">£</span>
                  <span className="text-sm font-medium text-gray-600">Budget</span>
                </div>
                {projectData.spent > projectData.budget && (
                  <Badge variant="destructive" className="text-xs">
                    Over Budget
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">£{projectData.budget.toLocaleString()}</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">£{projectData.spent.toLocaleString()} spent</span>
                <span className={`text-sm font-medium ${
                  projectData.spent > projectData.budget 
                    ? "text-red-600" 
                    : projectData.spent > projectData.budget * 0.9
                      ? "text-amber-600"
                      : "text-green-600"
                }`}>
                  {((projectData.spent / projectData.budget) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    projectData.spent > projectData.budget 
                      ? "bg-red-500" 
                      : projectData.spent > projectData.budget * 0.9
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min((projectData.spent / projectData.budget) * 100, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-gray-600">Timeline</span>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {new Date(projectData.startDate).toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short' 
                })} - {new Date(projectData.endDate).toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
              <div className="text-sm text-gray-600">
                {Math.ceil((new Date(projectData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
              </div>
            </CardContent>
          </Card>

          {/* Team Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-gray-600">Team</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{projectData.team.length}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">members</span>
                <div className="flex -space-x-2">
                  {projectData.team.slice(0, 3).map((member, index) => (
                    <div 
                      key={index}
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                  {projectData.team.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                      +{projectData.team.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{projectData.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Phases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projectData.phases.map((phase, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{phase.name}</span>
                        <Badge
                          variant={
                            phase.status === "completed"
                              ? "default"
                              : phase.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {phase.status}
                        </Badge>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">Project Tasks</h3>
                <button
                  onClick={() => setGroupTasks(!groupTasks)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    groupTasks
                      ? "bg-gray-100 text-gray-800 border-2 border-gray-300 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {groupTasks ? "GROUPED" : "GROUP TASKS"}
                </button>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            
            {!groupTasks ? (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {projectData.tasks?.map((task) => {
                      const isCompleted = completedTasks.includes(task.id)
                      return (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                          <div className="flex items-center space-x-3 flex-1">
                            <button
                              onClick={() => toggleTaskCompletion(task.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                isCompleted
                                  ? "bg-gray-900 border-gray-900 text-white"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {isCompleted && <Check className="h-3 w-3" />}
                            </button>
                            <div className={`w-3 h-3 rounded-full ${
                              task.status === "completed" ? "bg-green-500" :
                              task.status === "in-progress" ? "bg-amber-500" :
                              "bg-gray-300"
                            }`} />
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="cursor-pointer flex-1 hover:bg-gray-50 p-1 rounded">
                                  <p className={`text-sm font-medium transition-all ${
                                    isCompleted ? "line-through text-gray-500" : ""
                                  }`}>{task.name}</p>
                                  <p className={`text-xs text-muted-foreground transition-all ${
                                    isCompleted ? "line-through" : ""
                                  }`}>{getTaskAssignee(task)} • Due {new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      task.status === "completed" ? "bg-green-500" :
                                      task.status === "in-progress" ? "bg-amber-500" :
                                      "bg-gray-300"
                                    }`} />
                                    <span>{task.name}</span>
                                  </DialogTitle>
                                  <DialogDescription>
                                    {task.description}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Assigned to</label>
                                      <Select value={getTaskAssignee(task)} onValueChange={(value) => updateTaskAssignee(task.id, value)}>
                                        <SelectTrigger className="w-full mt-1">
                                          <SelectValue placeholder="Select team member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {projectData.team.map((member, index) => (
                                            <SelectItem key={index} value={member.name}>
                                              <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                  {member.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <span>{member.name}</span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Due Date</label>
                                      <p className="text-sm text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <label className="text-sm font-medium text-gray-700">Category</label>
                                      <Badge variant="outline" className="text-xs font-semibold border-2 px-3 py-1 bg-gray-100 text-gray-800 border-gray-300 ml-4">
                                        {task.category.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <label className="text-sm font-medium text-gray-700">Priority</label>
                                      <Badge className={`text-xs font-semibold border-2 px-3 py-1 ml-4 ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Estimated Hours</label>
                                      <p className="text-sm text-gray-900">{task.estimatedHours}h</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Actual Hours</label>
                                      <p className="text-sm text-gray-900">{task.actualHours}h</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Progress</label>
                                    <div className="mt-1">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                          {task.status === "completed" ? "Completed" :
                                           task.status === "in-progress" ? "In Progress" : "Pending"}
                                        </span>
                                        <span className="text-gray-600">
                                          {task.actualHours > 0 ? Math.round((task.actualHours / task.estimatedHours) * 100) : 0}%
                                        </span>
                                      </div>
                                      <Progress 
                                        value={task.actualHours > 0 ? Math.round((task.actualHours / task.estimatedHours) * 100) : 0} 
                                        className="h-2 mt-1" 
                                      />
                                    </div>
                                  </div>
                                  {task.notes && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Notes</label>
                                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{task.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-xs font-semibold border-2 px-3 py-1 bg-gray-100 text-gray-800 border-gray-300"
                          >
                            {task.category.toUpperCase()}
                          </Badge>
                        </div>
                      )
                    }) || <p className="text-muted-foreground">No tasks available</p>}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {["plumbing", "electrical", "carpenter", "other"].map((category) => {
                  const categoryTasks = projectData.tasks?.filter(task => task.category === category) || [];
                  return (
                    <Card key={category} className="h-fit">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium capitalize flex items-center justify-between">
                          {category}
                          <Badge variant="secondary" className="text-xs font-semibold border-2 px-2 py-1 bg-gray-100 text-gray-800 border-gray-300">
                            {categoryTasks.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {categoryTasks.length > 0 ? categoryTasks.map((task) => {
                          const isCompleted = completedTasks.includes(task.id)
                          return (
                            <div key={task.id} className="p-3 rounded border hover:bg-gray-50">
                              <div className="flex items-center space-x-3 mb-2">
                                <button
                                  onClick={() => toggleTaskCompletion(task.id)}
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    isCompleted
                                      ? "bg-gray-900 border-gray-900 text-white"
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                >
                                  {isCompleted && <Check className="h-3 w-3" />}
                                </button>
                                <div className={`w-3 h-3 rounded-full ${
                                  task.status === "completed" ? "bg-green-500" :
                                  task.status === "in-progress" ? "bg-amber-500" :
                                  "bg-gray-300"
                                }`} />
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <p className={`text-sm font-medium line-clamp-2 transition-all cursor-pointer hover:text-blue-600 ${
                                      isCompleted ? "line-through text-gray-500" : ""
                                    }`}>{task.name}</p>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${
                                          task.status === "completed" ? "bg-green-500" :
                                          task.status === "in-progress" ? "bg-amber-500" :
                                          "bg-gray-300"
                                        }`} />
                                        <span>{task.name}</span>
                                      </DialogTitle>
                                      <DialogDescription>
                                        {task.description}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium text-gray-700">Assigned to</label>
                                          <Select value={getTaskAssignee(task)} onValueChange={(value) => updateTaskAssignee(task.id, value)}>
                                            <SelectTrigger className="w-full mt-1">
                                              <SelectValue placeholder="Select team member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {projectData.team.map((member, index) => (
                                                <SelectItem key={index} value={member.name}>
                                                  <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                      {member.name.split(" ").map(n => n[0]).join("")}
                                                    </div>
                                                    <span>{member.name}</span>
                                                  </div>
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-700">Due Date</label>
                                          <p className="text-sm text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <label className="text-sm font-medium text-gray-700">Category</label>
                                          <Badge variant="outline" className="text-xs font-semibold border-2 px-3 py-1 bg-gray-100 text-gray-800 border-gray-300 ml-4">
                                            {task.category.toUpperCase()}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <label className="text-sm font-medium text-gray-700">Priority</label>
                                          <Badge className={`text-xs font-semibold border-2 px-3 py-1 ml-4 ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium text-gray-700">Estimated Hours</label>
                                          <p className="text-sm text-gray-900">{task.estimatedHours}h</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-700">Actual Hours</label>
                                          <p className="text-sm text-gray-900">{task.actualHours}h</p>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-700">Progress</label>
                                        <div className="mt-1">
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">
                                              {task.status === "completed" ? "Completed" :
                                               task.status === "in-progress" ? "In Progress" : "Pending"}
                                            </span>
                                            <span className="text-gray-600">
                                              {task.actualHours > 0 ? Math.round((task.actualHours / task.estimatedHours) * 100) : 0}%
                                            </span>
                                          </div>
                                          <Progress 
                                            value={task.actualHours > 0 ? Math.round((task.actualHours / task.estimatedHours) * 100) : 0} 
                                            className="h-2 mt-1" 
                                          />
                                        </div>
                                      </div>
                                      {task.notes && (
                                        <div>
                                          <label className="text-sm font-medium text-gray-700">Notes</label>
                                          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{task.notes}</p>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                              <p className={`text-sm text-muted-foreground transition-all ml-8 ${
                                isCompleted ? "line-through" : ""
                              }`}>{getTaskAssignee(task)}</p>
                              <p className={`text-sm text-muted-foreground transition-all ml-8 ${
                                isCompleted ? "line-through" : ""
                              }`}>Due {new Date(task.dueDate).toLocaleDateString()}</p>
                            </div>
                          )
                        }) : (
                          <p className="text-xs text-muted-foreground">No {category} tasks</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectData.team.map((member, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <div className="space-y-6">
              {/* Budget Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Budget Forecasts
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge 
                          className={`text-xs font-semibold border-2 px-3 py-1 ${
                            getBudgetStatus(projectData).status === "on-track" ? "bg-green-100 text-green-800 border-green-300" :
                            getBudgetStatus(projectData).status === "at-risk" ? "bg-amber-100 text-amber-800 border-amber-300" :
                            "bg-red-100 text-red-800 border-red-300"
                          }`}
                        >
                          {getBudgetStatus(projectData).status === "on-track" ? "On Track" :
                           getBudgetStatus(projectData).status === "at-risk" ? "At Risk" : "Over Budget"}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Based on current spend rate of £{projectData.budgetForecast?.currentBurnRate?.toLocaleString() || 'N/A'}/week</p>
                        <p>Forecast confidence: {projectData.budgetForecast?.confidence || 'N/A'}%</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Overall Budget Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Project Budget</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          £{projectData.spent.toLocaleString()} / £{projectData.budget.toLocaleString()}
                        </span>
                        <span className={`text-xs font-medium ${getBudgetStatus(projectData).textColor}`}>
                          Forecast: £{projectData.budgetForecast?.projectedTotal?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress
                        value={(projectData.spent / projectData.budget) * 100}
                        className={`h-3 [&>div]:${getBudgetStatus(projectData).color}`}
                      />
                      {/* Forecast indicator */}
                      <div 
                        className="absolute top-0 h-3 w-0.5 bg-gray-400 opacity-60"
                        style={{ left: `${Math.min(((projectData.budgetForecast?.projectedTotal || 0) / projectData.budget) * 100, 100)}%` }}
                      />
                    </div>
                    {(projectData.budgetForecast?.overrunAmount || 0) > 0 && (
                      <div className={`p-2 rounded-lg ${
                        getBudgetStatus(projectData).status === "over-budget" ? "bg-red-50 border border-red-200" :
                        "bg-amber-50 border border-amber-200"
                      }`}>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className={`h-4 w-4 ${
                            getBudgetStatus(projectData).status === "over-budget" ? "text-red-600" : "text-amber-600"
                          }`} />
                          <Tooltip>
                            <TooltipTrigger>
                              <span className={`text-xs font-medium ${
                                getBudgetStatus(projectData).status === "over-budget" ? "text-red-700" : "text-amber-700"
                              }`}>
                                {formatOverrunWarning(projectData)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Based on current spend rate and project timeline</p>
                              <p>Current burn rate: £{projectData.budgetForecast?.currentBurnRate?.toLocaleString() || 'N/A'}/week</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Trends Chart */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                    <div className="flex flex-col">
                      <CardTitle className="text-lg font-semibold flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                        Spending Trends
                      </CardTitle>
                      <div className="text-xs text-muted-foreground mt-1">
                        Weekly spending analysis and trend forecasting
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="outline" onClick={exportToPDF}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={exportToPDF}>Export to PDF</DropdownMenuItem>
                          <DropdownMenuItem onClick={exportToExcel}>Export to Excel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart 
                          data={projectData.weeklySpending || []} 
                          margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
                          onClick={(data: any) => {
                            if (data?.activePayload?.[0]?.payload?.riskAlert) {
                              const alert = data.activePayload[0].payload.riskAlert;
                              if (confirm(`Risk Alert: £${alert.overrun.toLocaleString()} overrun expected by ${alert.date} (${alert.confidence}% confidence)\n\nRecommended Action: ${alert.action}\n\nClick OK to implement this action.`)) {
                                console.log(`Action taken: ${alert.action} at ${new Date().toISOString()}`);
                                alert(`Action logged: ${alert.action}`);
                              }
                            }
                          }}
                        >
                          <CartesianGrid 
                            strokeDasharray="1 2" 
                            stroke="#e5e7eb" 
                            strokeOpacity={0.3}
                            horizontal={true}
                            vertical={false}
                          />
                          
                          <XAxis 
                            dataKey="week" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 11, 
                              fill: '#6b7280',
                              fontWeight: 500
                            }}
                            interval={0}
                          />
                          
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 10, 
                              fill: '#6b7280',
                              fontWeight: 400
                            }}
                            tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                            domain={[0, 'dataMax + 3000']}
                          />
                          
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              fontSize: '11px',
                              padding: '8px 12px'
                            }}
                            formatter={(value, name, props) => {
                              const payload = props.payload;
                              if (payload?.riskAlert && name === 'forecast') {
                                return [
                                  <div key="risk-alert" className="space-y-1">
                                    <div className="font-medium text-red-600">⚠️ Risk Alert</div>
                                    <div>£{payload.riskAlert.overrun.toLocaleString()} overrun expected by {payload.riskAlert.date}</div>
                                    <div className="text-xs text-gray-500">({payload.riskAlert.confidence}% confidence)</div>
                                    <div className="text-xs text-blue-600 cursor-pointer font-medium mt-2">
                                      💡 {payload.riskAlert.action}
                                    </div>
                                  </div>,
                                  ''
                                ];
                              }
                              return [
                                `£${Number(value).toLocaleString()}`, 
                                name === 'cumulative' ? 'Actual Spend' : 
                                name === 'forecast' ? 'Projected Spend' : 'Weekly Spend'
                              ];
                            }}
                            labelFormatter={(label, payload) => {
                              const data = payload?.[0]?.payload;
                              if (data) {
                                return `${label} - ${data.date}`;
                              }
                              return label;
                            }}
                            labelStyle={{ 
                              color: '#374151', 
                              fontWeight: 600,
                              fontSize: '11px'
                            }}
                          />
                          
                          {/* Current week indicator - flexible positioning */}
                          <ReferenceLine 
                            x={projectData.currentWeekPosition || 4.3}
                            stroke="#10b981" 
                            strokeWidth={2} 
                            strokeOpacity={0.8}
                            label={{ 
                              value: "Today", 
                              position: "top",
                              style: { 
                                textAnchor: 'middle',
                                fontSize: '10px',
                                fontWeight: 600,
                                fill: '#10b981'
                              }
                            }}
                          />
                          
                          {/* Budget limit line - RED HORIZONTAL with right-side label */}
                          <ReferenceLine 
                            y={projectData.budget} 
                            stroke="#dc2626" 
                            strokeWidth={2}
                            strokeOpacity={1}
                            label={{ 
                              value: `Budget Limit £${(projectData.budget / 1000).toFixed(0)}k`, 
                              position: "insideTopRight",
                              offset: 10,
                              style: {
                                fontSize: '10px',
                                fontWeight: 600,
                                fill: '#dc2626',
                                textAnchor: 'start'
                              }
                            }}
                          />
                          
                          {/* Actual spending line - BLACK SOLID */}
                          <Line 
                            type="monotone" 
                            dataKey="cumulative" 
                            stroke="#000000" 
                            strokeWidth={2.5} 
                            dot={{ 
                              fill: '#000000', 
                              stroke: '#ffffff',
                              strokeWidth: 1, 
                              r: 3
                            }}
                            activeDot={{ 
                              r: 5, 
                              fill: '#000000',
                              stroke: '#ffffff',
                              strokeWidth: 2
                            }}
                          />
                          
                          {/* Forecast line - BLACK DASHED */}
                          <Line 
                            type="monotone" 
                            dataKey="forecast" 
                            stroke="#000000" 
                            strokeWidth={2} 
                            strokeDasharray="6 3"
                            dot={(props) => {
                              const { payload, index } = props;
                              if (payload?.riskAlert) {
                                return (
                                  <circle 
                                    key={`risk-dot-${index}`}
                                    cx={props.cx} 
                                    cy={props.cy} 
                                    r="6" 
                                    fill="#9ca3af" 
                                    stroke="#ffffff" 
                                    strokeWidth="2"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      if (confirm(`Risk Alert: £${payload.riskAlert.overrun.toLocaleString()} overrun expected by ${payload.riskAlert.date} (${payload.riskAlert.confidence}% confidence)\n\nRecommended Action: ${payload.riskAlert.action}\n\nClick OK to implement this action.`)) {
                                        console.log(`Action taken: ${payload.riskAlert.action} at ${new Date().toISOString()}`);
                                        alert(`Action logged: ${payload.riskAlert.action}`);
                                      }
                                    }}
                                  />
                                );
                              }
                              return (
                                <circle 
                                  key={`forecast-dot-${index}`}
                                  cx={props.cx} 
                                  cy={props.cy} 
                                  r="2" 
                                  fill="#000000" 
                                  stroke="#ffffff" 
                                  strokeWidth="1"
                                />
                              );
                            }}
                            activeDot={{ 
                              r: 4, 
                              fill: '#000000',
                              stroke: '#ffffff',
                              strokeWidth: 1
                            }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projectData.expenses.map((expense, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{expense.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              £{expense.spent.toLocaleString()} / £{expense.budgeted.toLocaleString()}
                            </span>
                            <Badge variant={expense.status === "Over Budget" ? "destructive" : "secondary"}>
                              {expense.status}
                            </Badge>
                          </div>
                        </div>
                        <Progress
                          value={(expense.spent / expense.budgeted) * 100}
                          className={`h-2 ${expense.status === "Over Budget" ? "[&>div]:bg-red-500" : ""}`}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Forecasting Tools */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Weekly Burn Rate</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">£{projectData.budgetForecast?.currentBurnRate?.toLocaleString() || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">Average weekly spend</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Completion Forecast</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">
                      {(projectData.budgetForecast?.daysUntilOverrun || 0) > 0 ? 
                        `${projectData.budgetForecast.daysUntilOverrun}d` : 
                        "Over"
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(projectData.budgetForecast?.daysUntilOverrun || 0) > 0 ? 
                        "Until budget limit" : 
                        "Budget exceeded"
                      }
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Forecast Confidence</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{projectData.budgetForecast?.confidence || 'N/A'}%</div>
                    <div className="text-xs text-muted-foreground">Based on historical data</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Expenses Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectData.recentExpenses.map((expense, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-xs">{new Date(expense.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-xs">{expense.description}</TableCell>
                          <TableCell className="text-xs">
                            £{expense.amount.toLocaleString()}
                            <div className="text-muted-foreground">VAT: £{expense.vat.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={expense.status === "Pending Approval" ? "secondary" : "default"}
                              className="text-xs"
                            >
                              {expense.status}
                            </Badge>
                            {expense.status === "Pending Approval" && (
                              <div className="flex space-x-1 mt-1">
                                <Button size="sm" className="h-6 text-xs px-2">
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="h-6 text-xs px-2 bg-transparent">
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project Files</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projectData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Photos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projectData.photos.map((photo, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{photo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {new Date(photo.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
