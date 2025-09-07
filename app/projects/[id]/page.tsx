"use client"

import React, { useState, useEffect, use } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, BarChart, Bar, Legend } from "recharts"
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
  Eye,
  Check,
  Search,
  Settings,
  ChevronDown,
  FileEdit,
  MessageSquare,
  Download,
  RefreshCw,
  X,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  StickyNote,
  Target,
  Activity,
  Mail,
  Wrench,
  Shield,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { DocumentCreationModal } from "@/components/document-creation-modal"
import { ProjectEditModal } from "@/components/project-edit-modal"
import { AssistantEditModal } from "@/components/assistant-edit-modal"
import { TechnicalSpecificationsModal } from "@/components/technical-specifications-modal"
import { ActivityTooltip } from "@/components/activity-tooltip"
import { ProfessionalVarianceCard, ProfessionalVarianceGrid } from "@/components/professional-variance-cards"
import { ProfessionalInvestigationModal } from "@/components/professional-investigation-modal"
import { formatCurrency } from "@/lib/evm-calculations"

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
      // Historical cumulative data with more realistic fluctuations and plateaus
      { week: "Week 1", date: "Oct 2", actual: 2800, projected: 2800, projectedUpper: null, projectedLower: null, budget: 4200, daily: [400, 350, 500, 450, 400, 350, 350] },
      { week: "Week 2", date: "Oct 9", actual: 5600, projected: 5600, projectedUpper: null, projectedLower: null, budget: 7800, daily: [400, 350, 500, 450, 400, 400, 300] },
      { week: "Week 3", date: "Oct 16", actual: 5600, projected: 5600, projectedUpper: null, projectedLower: null, budget: 10500, daily: [0, 0, 0, 0, 0, 0, 0] }, // Plateau - material delay
      { week: "Week 4", date: "Oct 23", actual: 9800, projected: 9800, projectedUpper: null, projectedLower: null, budget: 13800, daily: [600, 550, 700, 650, 600, 550, 350] },
      { week: "Week 5", date: "Oct 30", actual: 14200, projected: 14200, projectedUpper: null, projectedLower: null, budget: 16200, daily: [650, 600, 700, 650, 600, 500, 400] },
      { week: "Week 6", date: "Nov 6", actual: 14200, projected: 14200, projectedUpper: null, projectedLower: null, budget: 19500, daily: [0, 0, 0, 0, 0, 0, 0] }, // Plateau - permit issues
      { week: "Week 7", date: "Nov 13", actual: 18900, projected: 18900, projectedUpper: null, projectedLower: null, budget: 22100, daily: [700, 650, 800, 750, 700, 600, 500] },
      { week: "Week 8", date: "Nov 20", actual: 24500, projected: 24500, projectedUpper: null, projectedLower: null, budget: 24800, daily: [800, 750, 900, 850, 800, 700, 500] },
      { week: "Week 9", date: "Nov 27", actual: 27200, projected: 27200, projectedUpper: null, projectedLower: null, budget: 27200, daily: [400, 350, 500, 450, 400, 350, 350] }, // Holiday week slowdown
      { week: "Week 10", date: "Dec 4", actual: 32800, projected: 32800, projectedUpper: null, projectedLower: null, budget: 30100, daily: [800, 750, 900, 850, 800, 700, 500] },
      { week: "Week 11", date: "Dec 11", actual: 32800, projected: 32800, projectedUpper: null, projectedLower: null, budget: 32500, daily: [0, 0, 0, 0, 0, 0, 0] }, // Plateau - weather delays
      { week: "Week 12", date: "Dec 18", actual: 35100, projected: 35100, projectedUpper: 35100, projectedLower: 35100, budget: 35200, daily: [350, 300, 400, 350, 300, 250, 250] }, // Current week - confidence starts at actual
      // Future projections diverge gradually over time from actual spend
      { week: "Week 13", date: "Dec 25", actual: null, projected: 36800, projectedUpper: 37200, projectedLower: 36400, budget: 37800, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 14", date: "Jan 1", actual: null, projected: 38200, projectedUpper: 39000, projectedLower: 37400, budget: 39500, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 15", date: "Jan 8", actual: null, projected: 39400, projectedUpper: 40600, projectedLower: 38200, budget: 41200, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 16", date: "Jan 15", actual: null, projected: 40500, projectedUpper: 42100, projectedLower: 38900, budget: 42800, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 17", date: "Jan 22", actual: null, projected: 41200, projectedUpper: 43200, projectedLower: 39200, budget: 43600, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 18", date: "Jan 29", actual: null, projected: 41800, projectedUpper: 44100, projectedLower: 39500, budget: 43800, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 19", date: "Feb 5", actual: null, projected: 42200, projectedUpper: 44800, projectedLower: 39600, budget: 44200, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 20", date: "Feb 12", actual: null, projected: 42500, projectedUpper: 45300, projectedLower: 39700, budget: 44500, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 21", date: "Feb 19", actual: null, projected: 42700, projectedUpper: 45600, projectedLower: 39800, budget: 44700, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 22", date: "Feb 26", actual: null, projected: 42800, projectedUpper: 45800, projectedLower: 39800, budget: 44900, daily: [0, 0, 0, 0, 0, 0, 0] },
      { week: "Week 23", date: "Mar 5", actual: null, projected: 42800, projectedUpper: 45800, projectedLower: 39800, budget: 45000, daily: [0, 0, 0, 0, 0, 0, 0] },
    ],
    costBreakdown: {
      materials: { budget: 18000, projected: 19500, actual: 16200 },
      labour: { budget: 15000, projected: 16800, actual: 14300 },
      equipment: { budget: 8000, projected: 8200, actual: 7500 },
      permits: { budget: 2000, projected: 2100, actual: 0 },
      overhead: { budget: 1500, projected: 1600, actual: 0 },
      contingency: { budget: 500, projected: 800, actual: 0 }
    },
    keyDrivers: [
      { name: "Premium Equipment Upgrade", budget: 8000, actual: 7500, variance: -500, status: "under" },
      { name: "Specialist Labour Premium", budget: 15000, actual: 14300, variance: -700, status: "under" },
      { name: "Custom Materials", budget: 18000, actual: 16200, variance: -1800, status: "under" },
      { name: "Extended Installation Time", budget: 0, actual: 0, variance: 0, status: "neutral" },
      { name: "Additional Safety Requirements", budget: 2000, actual: 0, variance: -2000, status: "under" }
    ],
    riskAlerts: [
      { id: 1, type: "warning", level: "amber", confidence: 82, title: "Material Delivery Delay Risk", message: "Weather conditions may delay specialized flooring delivery by 3-5 days", impact: "£1,200 potential overtime costs", dismissed: false },
      { id: 2, type: "predictive", level: "green", confidence: 89, title: "Under Budget Projection", message: "Current spending trend indicates 8% under budget completion", impact: "£3,600 potential savings", dismissed: false }
    ],
    dismissedAlerts: [],
    timePeriod: "30days",
    currentWeekPosition: 4.3,
    budgetForecast: {
      projectedTotal: 42800,
      overrunAmount: -2200,
      overrunDate: null,
      currentBurnRate: 5500,
      daysUntilOverrun: null,
      confidence: 87
    },
    // EVM and Professional Analysis Data
    projectType: 'luxury' as const,
    physicalProgress: 82, // From site surveys - physical completion percentage
    plannedProgress: 84, // Planned progress at this stage
    evmMetrics: {
      standardPrice: 850, // Standard material price per unit
      actualPrice: 920, // Actual price paid per unit
      standardQuantity: 45, // Planned material quantity
      actualQuantity: 42, // Actual quantity used
      standardLaborRate: 75, // Standard hourly rate
      actualLaborRate: 68, // Actual rate negotiated
      laborHours: 180 // Total labor hours
    },
    suppliers: [
      {
        name: 'Premium Golf Tech Ltd',
        onTimeDelivery: 94.2,
        qualityCompliance: 98.5,
        defectRate: 1.8,
        costCompetitiveness: 4 as const,
        contractCompliance: 96.8,
        bsCompliance: ['BS6576', 'BS8102'],
        leadTimeReliability: 102.3,
        trend: 'STABLE' as const,
        riskLevel: 'LOW' as const
      },
      {
        name: 'Elite Installations Co',
        onTimeDelivery: 89.1,
        qualityCompliance: 95.2,
        defectRate: 3.1,
        costCompetitiveness: 3 as const,
        contractCompliance: 91.4,
        bsCompliance: ['BS8102'],
        leadTimeReliability: 97.8,
        trend: 'DECLINING' as const,
        riskLevel: 'MEDIUM' as const
      },
      {
        name: 'Henderson Flooring Specialists',
        onTimeDelivery: 97.8,
        qualityCompliance: 99.1,
        defectRate: 0.9,
        costCompetitiveness: 5 as const,
        contractCompliance: 98.7,
        bsCompliance: ['BS6576', 'BS8102', 'PAS2035'],
        leadTimeReliability: 101.2,
        trend: 'IMPROVING' as const,
        riskLevel: 'LOW' as const
      }
    ]
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
      { category: "Labour", budgeted: 35000, spent: 45000, status: "Over Budget" },
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
    },
    // EVM and Professional Analysis Data
    projectType: 'heritage' as const,
    physicalProgress: 75, // From heritage surveys - physical completion percentage
    plannedProgress: 80, // Planned progress at this stage
    evmMetrics: {
      standardPrice: 1200, // Standard heritage material price per unit
      actualPrice: 1450, // Actual specialized material price per unit
      standardQuantity: 85, // Planned material quantity
      actualQuantity: 92, // Actual quantity used (higher due to waste)
      standardLaborRate: 95, // Standard specialist craftsman rate
      actualLaborRate: 108, // Actual rate for heritage specialists
      laborHours: 420 // Total specialized labor hours
    },
    suppliers: [
      {
        name: 'Heritage Stone Ltd',
        onTimeDelivery: 87.3,
        qualityCompliance: 94.1,
        defectRate: 4.2,
        costCompetitiveness: 2 as const,
        contractCompliance: 89.6,
        bsCompliance: ['BS6576', 'BS8102', 'PAS2035'],
        leadTimeReliability: 89.4,
        trend: 'DECLINING' as const,
        riskLevel: 'HIGH' as const
      },
      {
        name: 'Cotswold Conservation Materials',
        onTimeDelivery: 96.8,
        qualityCompliance: 99.2,
        defectRate: 0.8,
        costCompetitiveness: 5 as const,
        contractCompliance: 97.3,
        bsCompliance: ['BS6576', 'BS8102', 'PAS2035'],
        leadTimeReliability: 103.2,
        trend: 'IMPROVING' as const,
        riskLevel: 'LOW' as const
      },
      {
        name: 'Traditional Craftsmen Guild',
        onTimeDelivery: 91.5,
        qualityCompliance: 97.8,
        defectRate: 2.1,
        costCompetitiveness: 3 as const,
        contractCompliance: 94.7,
        bsCompliance: ['BS8102'],
        leadTimeReliability: 95.6,
        trend: 'STABLE' as const,
        riskLevel: 'MEDIUM' as const
      }
    ]
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
  const [searchTerm, setSearchTerm] = useState("")
  const [createdDocuments, setCreatedDocuments] = useState<any[]>([])
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showProjectEditModal, setShowProjectEditModal] = useState(false)
  const [showAssistantModal, setShowAssistantModal] = useState(false)
  const [showTechnicalModal, setShowTechnicalModal] = useState(false)
  const [timePeriod, setTimePeriod] = useState("30days")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedDrillDown, setSelectedDrillDown] = useState<any>(null)
  const [showDrillDownModal, setShowDrillDownModal] = useState(false)
  const [modalType, setModalType] = useState<'spending-trends' | 'cost-categories' | 'budget-alerts' | 'transactions'>('spending-trends')
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([])
  const [lastRefresh, setLastRefresh] = useState(new Date())
  
  // Temporal filter states for enhanced modals
  const [temporalDateRange, setTemporalDateRange] = useState<'all' | 'last4' | 'last8'>('all')
  const [temporalViewMode, setTemporalViewMode] = useState<'cumulative' | 'weekly'>('cumulative')
  
  // Timeline week selection state
  const [selectedTimelineWeek, setSelectedTimelineWeek] = useState("")
  
  // Cost Categories modal state
  const [varianceThreshold, setVarianceThreshold] = useState(5) // Show variances above 5%
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null) // Filter by category
  const [showVarianceInvestigation, setShowVarianceInvestigation] = useState(false)
  const [selectedVariancePoint, setSelectedVariancePoint] = useState<any>(null)
  
  // Professional Analysis modal state
  const [showProfessionalModal, setShowProfessionalModal] = useState(false)
  const [selectedProfessionalAnalysis, setSelectedProfessionalAnalysis] = useState<any>(null)

  // Initialize selectedTimelineWeek with the first week
  useEffect(() => {
    const allData = getAllProjectData()
    if (allData.length > 0 && !selectedTimelineWeek) {
      setSelectedTimelineWeek(allData[0].week)
    }
  }, [selectedTimelineWeek])

  const toggleTaskCompletion = (taskId: number) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const dismissAlert = (alertId: number) => {
    setDismissedAlerts(prev => [...prev, alertId])
  }

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period)
    // In a real app, this would trigger data refetch
  }

  const getFilteredSpendingData = () => {
    const fullData = projectData.weeklySpending || []
    const currentDate = new Date()
    const currentWeekIndex = 11 // We're currently at Week 12 (index 11) - moved to middle for demo
    
    // Process the data to separate actual vs projected based on current date
    const processedData = fullData.map((week, index) => {
      const budgetAllocation = (week as any).budget || 0 // Budget allocation line data
      
      // Actual spending only shows for weeks up to the current week
      const actual = index <= currentWeekIndex ? (week as any).actual : null
      
      // Projected spending only shows from current week onwards (and only in lifetime view)
      const projected = (index >= currentWeekIndex && timePeriod === 'lifetime') ? week.projected : null
      const projectedUpper = (index >= currentWeekIndex && timePeriod === 'lifetime') ? week.projectedUpper : null
      const projectedLower = (index >= currentWeekIndex && timePeriod === 'lifetime') ? week.projectedLower : null
      
      return {
        ...week,
        actual,
        projected,
        projectedUpper,
        projectedLower,
        budgetAllocation, // Budget allocation line (planned spending from project start)
        budgetCeiling: 45000 // Total project budget ceiling
      }
    })
    
    switch (timePeriod) {
      case '30days':
        // Show last 4-5 weeks (approximately 30 days) - ending at current week
        return processedData.slice(Math.max(0, currentWeekIndex - 4), currentWeekIndex + 1)
      
      case '90days':
        // Show last 12-13 weeks (approximately 90 days) - ending at current week
        return processedData.slice(Math.max(0, currentWeekIndex - 12), currentWeekIndex + 1)
      
      case 'lifetime':
        // Show all project data
        return processedData
      
      default:
        return processedData.slice(Math.max(0, currentWeekIndex - 4), currentWeekIndex + 1)
    }
  }

  // Get all project data independent of main dashboard timeline filter - for modals only
  const getAllProjectData = () => {
    const fullData = projectData.weeklySpending || []
    const currentWeekIndex = 11 // Week 12 is current
    
    // Process the data to separate actual vs projected based on current date
    const processedData = fullData.map((week, index) => {
      const budgetAllocation = (week as any).budget || 0
      const actual = index <= currentWeekIndex ? (week as any).actual : null
      const projected = index >= currentWeekIndex ? (week as any).projected || (week as any).forecast : null
      const projectedUpper = index >= currentWeekIndex ? (week as any).projectedUpper : null
      const projectedLower = index >= currentWeekIndex ? (week as any).projectedLower : null
      
      return {
        ...week,
        actual,
        projected,
        projectedUpper,
        projectedLower,
        budgetAllocation,
        budgetCeiling: 45000
      }
    })
    
    return processedData // Always return full project timeline for modals (all 23 weeks)
  }

  // Get temporally filtered data for Cost Categories modal with toggle controls
  const getTemporallyFilteredData = () => {
    const allData = getAllProjectData()
    
    // Apply date range filter
    let filteredByRange = allData
    const currentWeekIndex = 11 // Week 12 is current
    switch (temporalDateRange) {
      case 'last4':
        filteredByRange = allData.slice(Math.max(0, currentWeekIndex - 3), currentWeekIndex + 1)
        break
      case 'last8':
        filteredByRange = allData.slice(Math.max(0, currentWeekIndex - 7), currentWeekIndex + 1)
        break
      case 'all':
        // Show all weeks including current week (weeks 1-12)
        filteredByRange = allData.slice(0, currentWeekIndex + 1)
        break
    }
    
    // Apply view mode transformation
    if (temporalViewMode === 'weekly') {
      // Convert cumulative data to weekly deltas
      return filteredByRange.map((week, index) => {
        const prevWeek = index > 0 ? filteredByRange[index - 1] : null
        const weeklyActual = week.actual && prevWeek?.actual 
          ? week.actual - prevWeek.actual 
          : week.actual
        const weeklyProjected = week.projected && prevWeek?.projected 
          ? week.projected - prevWeek.projected 
          : week.projected
        
        return {
          ...week,
          actual: weeklyActual,
          projected: weeklyProjected,
          budget: week.budget && prevWeek?.budget ? week.budget - prevWeek.budget : week.budget
        }
      })
    }
    
    return filteredByRange // Return cumulative data (default)
  }

  const handleRefresh = () => {
    setLastRefresh(new Date())
    // In a real app, this would trigger data refetch
  }

  const handleDrillDown = (data: any, type: 'line' | 'bar', modalType: 'spending-trends' | 'cost-categories' | 'budget-alerts' | 'transactions' = 'spending-trends') => {
    console.log('handleDrillDown called with data:', data, 'type:', type, 'modalType:', modalType)
    
    // Handle spending trends chart clicks specifically
    if (data && data.activePayload && data.activePayload[0]) {
      const weekData = data.activePayload[0].payload
      const clickedMetric = data.activePayload[0].dataKey || 'actual'
      console.log('Setting selectedDrillDown with weekData:', weekData, 'activeLabel:', data.activeLabel)
      setSelectedDrillDown({ 
        ...weekData, 
        week: data.activeLabel, // Use activeLabel as the week property
        type, 
        weekIndex: data.activeLabel,
        clickedMetric: clickedMetric
      })
    } else {
      console.log('Setting selectedDrillDown with fallback data:', data)
      // For fallback, ensure we have a week property
      setSelectedDrillDown({ 
        ...data, 
        week: data.activeLabel || data.week,
        type 
      })
    }
    setModalType(modalType)
    setShowDrillDownModal(true)
  }

  // Generate detailed spending breakdown for the selected week
  const getSpendingBreakdown = (weekData: any) => {
    if (!weekData) return []
    
    const weekNumber = parseInt(weekData.week?.replace('Week ', '') || '1')
    const baseAmounts = {
      materials: Math.floor((weekData.actual || 25000) * 0.45),
      labour: Math.floor((weekData.actual || 25000) * 0.35), 
      equipment: Math.floor((weekData.actual || 25000) * 0.15),
      overhead: Math.floor((weekData.actual || 25000) * 0.05)
    }
    
    return [
      { category: 'Materials', amount: baseAmounts.materials, budget: Math.floor(baseAmounts.materials * 1.1), variance: baseAmounts.materials - Math.floor(baseAmounts.materials * 1.1) },
      { category: 'Labour', amount: baseAmounts.labour, budget: Math.floor(baseAmounts.labour * 0.95), variance: baseAmounts.labour - Math.floor(baseAmounts.labour * 0.95) },
      { category: 'Equipment', amount: baseAmounts.equipment, budget: Math.floor(baseAmounts.equipment * 1.05), variance: baseAmounts.equipment - Math.floor(baseAmounts.equipment * 1.05) },
      { category: 'Overhead', amount: baseAmounts.overhead, budget: Math.floor(baseAmounts.overhead * 0.9), variance: baseAmounts.overhead - Math.floor(baseAmounts.overhead * 0.9) }
    ]
  }

  // Generate top cost drivers for the selected week
  const getCostDrivers = (weekData: any) => {
    if (!weekData) return []
    
    const weekNumber = parseInt(weekData.week?.replace('Week ', '') || '1')
    const drivers = [
      { name: 'Material Price Increase', impact: 1200, type: 'overrun', description: 'Steel prices up 8% from forecast' },
      { name: 'Efficient Labour Usage', impact: -800, type: 'savings', description: 'Team ahead of schedule' },
      { name: 'Equipment Rental', impact: 450, type: 'overrun', description: 'Extended crane rental needed' },
      { name: 'Bulk Purchase Discount', impact: -300, type: 'savings', description: 'Volume discount achieved' }
    ]
    
    return drivers.filter((_, i) => (weekNumber + i) % 3 === 0 || i < 2)
  }

  // Generate time-series data for variance analysis
  const getVarianceTimeSeriesData = () => {
    const allData = getAllProjectData()
    return allData.map(weekData => {
      const breakdown = getSpendingBreakdown(weekData)
      return {
        week: weekData.week,
        date: weekData.date,
        materials: breakdown.find(b => b.category === 'Materials')?.variance || 0,
        labour: breakdown.find(b => b.category === 'Labour')?.variance || 0,
        equipment: breakdown.find(b => b.category === 'Equipment')?.variance || 0,
        overhead: breakdown.find(b => b.category === 'Overhead')?.variance || 0,
        materialsPercent: breakdown.find(b => b.category === 'Materials')?.variance ? 
          (breakdown.find(b => b.category === 'Materials')!.variance / breakdown.find(b => b.category === 'Materials')!.budget * 100) : 0,
        labourPercent: breakdown.find(b => b.category === 'Labour')?.variance ? 
          (breakdown.find(b => b.category === 'Labour')!.variance / breakdown.find(b => b.category === 'Labour')!.budget * 100) : 0,
        equipmentPercent: breakdown.find(b => b.category === 'Equipment')?.variance ? 
          (breakdown.find(b => b.category === 'Equipment')!.variance / breakdown.find(b => b.category === 'Equipment')!.budget * 100) : 0,
        overheadPercent: breakdown.find(b => b.category === 'Overhead')?.variance ? 
          (breakdown.find(b => b.category === 'Overhead')!.variance / breakdown.find(b => b.category === 'Overhead')!.budget * 100) : 0
      }
    })
  }

  // Get variance investigation data
  const getVarianceInvestigation = (week: string, category: string) => {
    const investigations = {
      'Week 8-Materials': {
        rootCause: 'Steel price increase due to supply chain disruption',
        impact: '£1,200 over budget',
        timeline: 'Price spike occurred on Oct 15th, affecting orders placed Oct 16-20',
        invoices: ['INV-2024-1042', 'INV-2024-1055'],
        suppliers: [
          { name: 'SteelCorp Ltd', contact: '+44 1234 567890', action: 'Renegotiate rates' },
          { name: 'MetalPro', contact: '+44 1234 567891', action: 'Alternative quotes' }
        ],
        scenarios: {
          immediate: 'Act now: Save £800 by switching supplier',
          delayed: 'Wait 2 weeks: Additional £400 cost risk'
        }
      },
      'Week 12-Labour': {
        rootCause: 'Weather delays causing overtime premiums',
        impact: '£890 over budget',
        timeline: 'Rain delays Oct 25-27 forced weekend overtime',
        invoices: ['PAY-2024-0892', 'PAY-2024-0901'],
        suppliers: [
          { name: 'CrewForce Ltd', contact: '+44 1234 567895', action: 'Adjust schedule' },
          { name: 'StaffingPro', contact: '+44 1234 567896', action: 'Backup crew' }
        ],
        scenarios: {
          immediate: 'Reschedule: Avoid £500 future overtime',
          delayed: 'Continue current: Risk £1,200 additional costs'
        }
      },
      'Week 10-Equipment': {
        rootCause: 'Concrete mixer breakdown requiring emergency rental',
        impact: '£650 over budget',
        timeline: 'Equipment failure on Nov 1st, rental secured same day',
        invoices: ['RENT-2024-3341', 'REP-2024-2215'],
        suppliers: [
          { name: 'EquipRent Pro', contact: '+44 1234 567892', action: 'Extended rental discount' },
          { name: 'MachineRepair Ltd', contact: '+44 1234 567893', action: 'Preventive maintenance plan' }
        ],
        scenarios: {
          immediate: 'Purchase replacement: Save £300 long-term',
          delayed: 'Continue rental: Additional £200 per week'
        }
      },
      'Week 6-Materials': {
        rootCause: 'Premium insulation required due to building regulation changes',
        impact: '£1,450 over budget',
        timeline: 'Regulation update published Oct 20th, implementation required',
        invoices: ['INV-2024-1089', 'INV-2024-1094'],
        suppliers: [
          { name: 'InsulationPro', contact: '+44 1234 567894', action: 'Bulk discount negotiation' },
          { name: 'BuildMaterials Ltd', contact: '+44 1234 567897', action: 'Alternative products' }
        ],
        scenarios: {
          immediate: 'Negotiate bulk deal: Save £400 on remaining orders',
          delayed: 'Standard pricing: Continue with 15% premium'
        }
      }
    }
    
    return investigations[`${week}-${category}` as keyof typeof investigations] || {
      rootCause: `${category} spending variance detected - investigating cost drivers and supplier performance`,
      impact: 'Variance impact being quantified against project budget and timeline',
      timeline: `${week} variance identified, full analysis expected within 24-48 hours`,
      invoices: ['Analysis in progress'],
      suppliers: [
        { name: 'Primary Supplier Review', contact: 'Contact details being compiled', action: 'Performance assessment' },
        { name: 'Alternative Quotes', contact: 'Market research underway', action: 'Cost comparison analysis' }
      ],
      scenarios: { 
        immediate: 'Immediate action: Hold current orders pending analysis results', 
        delayed: 'Wait for analysis: Risk of continued variance if root cause persists' 
      }
    }
  }

  // Handle chart point clicks for variance investigation
  const handleVariancePointClick = (data: any, category: string) => {
    setSelectedVariancePoint({ ...data, category })
    setShowVarianceInvestigation(true)
  }

  // Get chart data with proper cumulative/weekly toggle and Other category - consistent with Spending Trends
  const getCostCategoryChartData = () => {
    const allData = getAllProjectData()
    
    // Apply date range filter
    let filteredByRange = allData
    const currentWeekIndex = 11 // Week 12 is current
    switch (temporalDateRange) {
      case 'last4':
        filteredByRange = allData.slice(Math.max(0, currentWeekIndex - 3), currentWeekIndex + 1)
        break
      case 'last8':
        filteredByRange = allData.slice(Math.max(0, currentWeekIndex - 7), currentWeekIndex + 1)
        break
      case 'all':
        // Show all weeks including current week (weeks 1-12)
        filteredByRange = allData.slice(0, currentWeekIndex + 1)
        break
    }

    return filteredByRange.map((weekData, index) => {
      if (temporalViewMode === 'cumulative') {
        // For cumulative view, use the actual cumulative data directly
        // The weeklySpending data is already cumulative, so use it as-is
        const cumulativeTotal = weekData.actual || 0
        
        return {
          week: weekData.week,
          date: weekData.date,
          materials: Math.floor(cumulativeTotal * 0.40),    // 40% of cumulative spending
          labour: Math.floor(cumulativeTotal * 0.35),       // 35% of cumulative spending
          equipment: Math.floor(cumulativeTotal * 0.15),    // 15% of cumulative spending
          other: Math.floor(cumulativeTotal * 0.10),        // 10% of cumulative spending
          variance: cumulativeTotal - (weekData.budget || 0),
          budget: weekData.budget || 0
        }
      } else {
        // For weekly view, calculate actual weekly spending (delta from previous week)
        const currentCumulative = weekData.actual || 0
        const previousWeekData = index > 0 ? filteredByRange[index - 1] : null
        const previousCumulative = previousWeekData ? (previousWeekData.actual || 0) : 0
        const weeklySpending = currentCumulative - previousCumulative
        
        // Calculate weekly budget allocation (delta from previous week)
        const currentBudget = weekData.budget || 0
        const previousBudget = previousWeekData ? (previousWeekData.budget || 0) : 0
        const weeklyBudget = currentBudget - previousBudget
        
        return {
          week: weekData.week,
          date: weekData.date,
          materials: Math.floor(weeklySpending * 0.40),     // 40% of this week's spending
          labour: Math.floor(weeklySpending * 0.35),        // 35% of this week's spending
          equipment: Math.floor(weeklySpending * 0.15),     // 15% of this week's spending
          other: Math.floor(weeklySpending * 0.10),         // 10% of this week's spending
          variance: weeklySpending - weeklyBudget,
          budget: weeklyBudget
        }
      }
    })
  }

  // Get actionable variance breakdown with remediation steps
  const getActionableVarianceBreakdown = () => {
    // Use the same temporal filtering as the chart
    const allData = getAllProjectData()
    let filteredData = allData
    
    // Apply date range filter to match chart filtering
    const currentWeekIndex = 11 // Week 12 is current
    switch (temporalDateRange) {
      case 'last4':
        filteredData = allData.slice(Math.max(0, currentWeekIndex - 3), currentWeekIndex + 1)
        break
      case 'last8':
        filteredData = allData.slice(Math.max(0, currentWeekIndex - 7), currentWeekIndex + 1)
        break
      case 'all':
        // Show all weeks including current week (weeks 1-12)
        filteredData = allData.slice(0, currentWeekIndex + 1)
        break
    }
    
    // Generate variance time series data for the filtered period
    const timeSeriesData = filteredData.map(weekData => {
      const breakdown = getSpendingBreakdown(weekData)
      return {
        week: weekData.week,
        date: weekData.date,
        materials: breakdown.find(b => b.category === 'Materials')!.variance,
        materialsPercent: breakdown.find(b => b.category === 'Materials')!.budget > 0 ? 
          (breakdown.find(b => b.category === 'Materials')!.variance / breakdown.find(b => b.category === 'Materials')!.budget * 100) : 0,
        labour: breakdown.find(b => b.category === 'Labour')!.variance,
        labourPercent: breakdown.find(b => b.category === 'Labour')!.budget > 0 ? 
          (breakdown.find(b => b.category === 'Labour')!.variance / breakdown.find(b => b.category === 'Labour')!.budget * 100) : 0,
        equipment: breakdown.find(b => b.category === 'Equipment')!.variance,
        equipmentPercent: breakdown.find(b => b.category === 'Equipment')!.budget > 0 ? 
          (breakdown.find(b => b.category === 'Equipment')!.variance / breakdown.find(b => b.category === 'Equipment')!.budget * 100) : 0,
        overhead: breakdown.find(b => b.category === 'Overhead')!.variance,
        overheadPercent: breakdown.find(b => b.category === 'Overhead')!.budget > 0 ? 
          (breakdown.find(b => b.category === 'Overhead')!.variance / breakdown.find(b => b.category === 'Overhead')!.budget * 100) : 0
      }
    })
    
    const significantVariances = []
    
    // Find significant variances above threshold
    for (const weekData of timeSeriesData) {
      const categories = [
        { name: 'Materials', percent: weekData.materialsPercent, value: weekData.materials },
        { name: 'Labour', percent: weekData.labourPercent, value: weekData.labour },
        { name: 'Equipment', percent: weekData.equipmentPercent, value: weekData.equipment },
        { name: 'Overhead', percent: weekData.overheadPercent, value: weekData.overhead }
      ]
      
      for (const category of categories) {
        if (Math.abs(category.percent) >= varianceThreshold) {
          const investigation = getVarianceInvestigation(weekData.week, category.name)
          significantVariances.push({
            category: category.name,
            week: weekData.week,
            date: weekData.date,
            variancePercent: category.percent,
            varianceAmount: category.value,
            investigation
          })
        }
      }
    }
    
    // Group by category and get most significant variance per category
    const grouped = significantVariances.reduce((acc: any, variance) => {
      if (!acc[variance.category] || Math.abs(variance.variancePercent) > Math.abs(acc[variance.category].variancePercent)) {
        acc[variance.category] = variance
      }
      return acc
    }, {})
    
    return Object.values(grouped)
  }

  // Navigate between time periods
  const navigateWeek = (direction: 'prev' | 'next') => {
    console.log('navigateWeek called with:', direction, 'selectedDrillDown:', selectedDrillDown)
    if (!selectedDrillDown?.week) {
      console.log('No selectedDrillDown.week, returning early')
      return
    }
    
    const filteredData = getAllProjectData()
    console.log('filteredData:', filteredData)
    const weekIndex = filteredData.findIndex(d => d.week === selectedDrillDown.week)
    console.log('current weekIndex:', weekIndex, 'for week:', selectedDrillDown.week)
    
    if (direction === 'prev' && weekIndex > 0) {
      const newWeek = filteredData[weekIndex - 1]
      console.log('Navigating to previous week:', newWeek)
      setSelectedDrillDown({ 
        ...newWeek, 
        type: selectedDrillDown.type, 
        weekIndex: newWeek.week,
        clickedMetric: selectedDrillDown.clickedMetric || 'actual'
      })
    } else if (direction === 'next' && weekIndex < filteredData.length - 1) {
      const newWeek = filteredData[weekIndex + 1]
      console.log('Navigating to next week:', newWeek)
      setSelectedDrillDown({ 
        ...newWeek, 
        type: selectedDrillDown.type, 
        weekIndex: newWeek.week,
        clickedMetric: selectedDrillDown.clickedMetric || 'actual'
      })
    } else {
      console.log('Cannot navigate:', direction, 'weekIndex:', weekIndex, 'length:', filteredData.length)
    }
  }

  // Get previous week data for comparison
  const getPreviousWeekData = (currentWeek: any) => {
    if (!currentWeek?.week) return null
    
    const filteredData = getAllProjectData()
    const weekIndex = filteredData.findIndex(d => d.week === currentWeek.week)
    
    return weekIndex > 0 ? filteredData[weekIndex - 1] : null
  }

  // Calculate comprehensive metrics for the selected period
  const getComprehensiveMetrics = (weekData: any) => {
    if (!weekData) return null
    
    const totalBudget = 45000 // Project total budget
    const weekNumber = parseInt(weekData.week?.replace('Week ', '') || '1')
    const budgetRemaining = totalBudget - (weekData.actual || 0)
    const prevWeek = getPreviousWeekData(weekData)
    
    return {
      totalSpend: weekData.actual || 0,
      budgetAllocation: weekData.budgetAllocation || 0,
      projectedSpend: weekData.projected || 0,
      budgetRemaining: budgetRemaining,
      variance: {
        amount: (weekData.actual || 0) - (weekData.budgetAllocation || 0),
        percentage: weekData.budgetAllocation ? (((weekData.actual || 0) - weekData.budgetAllocation) / weekData.budgetAllocation) * 100 : 0
      },
      weekOverWeekChange: prevWeek ? {
        amount: (weekData.actual || 0) - (prevWeek.actual || 0),
        percentage: prevWeek.actual ? (((weekData.actual || 0) - prevWeek.actual) / prevWeek.actual) * 100 : 0
      } : null,
      budgetUtilization: (weekData.actual || 0) / totalBudget * 100,
      confidenceInterval: {
        upper: weekData.projectedUpper || 0,
        lower: weekData.projectedLower || 0
      }
    }
  }

  const exportToPDF = () => {
    console.log('Exporting dashboard to PDF...')
    // Implementation would go here
  }

  const exportToExcel = () => {
    console.log('Exporting dashboard to Excel...')
    // Implementation would go here
  }

  // Auto-refresh effect
  React.useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh()
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const filteredAlerts = projectData.riskAlerts?.filter(alert => 
    !dismissedAlerts.includes(alert.id)
  ) || []

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

  const filteredFiles = searchTerm
    ? [
        ...projectData.documents
          .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(doc => ({ ...doc, type: 'document', isNew: false })),
        ...projectData.photos
          .filter(photo => photo.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(photo => ({ ...photo, type: 'photo', isNew: false })),
        ...createdDocuments
          .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(doc => ({ ...doc, type: 'document', isNew: true, uploadDate: doc.createdDate }))
      ].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    : []

  const technicalSpecifications = {
    materials: [
      {
        category: "Stone & Masonry",
        specification: "Period-matched limestone blocks (Bath stone equivalent)",
        supplier: "Heritage Stone Supplies Ltd",
        quantity: "45 tons",
        unitCost: "£180/ton",
        status: "Delivered"
      },
      {
        category: "Timber",
        specification: "Reclaimed oak beams (19th century specification)",
        supplier: "Traditional Building Materials Co",
        quantity: "12 beams",
        unitCost: "£320/beam",
        status: "Installed"
      },
      {
        category: "Roofing",
        specification: "Welsh slate tiles (500mm x 250mm)",
        supplier: "Celtic Slate Quarries",
        quantity: "2,400 tiles",
        unitCost: "£4.50/tile",
        status: "On Order"
      }
    ],
    equipment: [
      {
        category: "Lifting Equipment",
        specification: "Mobile crane (25-ton capacity, heritage-approved)",
        supplier: "Precision Crane Hire",
        quantity: "1 unit",
        unitCost: "£450/day",
        status: "Approved"
      },
      {
        category: "Safety Equipment",
        specification: "Scaffolding system (heritage building certified)",
        supplier: "Heritage Access Solutions",
        quantity: "Complete system",
        unitCost: "£2,800/month",
        status: "Installed"
      }
    ],
    safety: [
      {
        requirement: "Heritage Building Safety Protocol",
        specification: "HSE Guidelines for Historic Buildings (HSG 33)",
        compliance: "Grade I Listed Building Requirements",
        status: "Compliant"
      },
      {
        requirement: "Structural Safety Assessment",
        specification: "Monthly structural integrity inspections",
        compliance: "Building Control Approved",
        status: "Current"
      }
    ],
    testing: [
      {
        test: "Stone Integrity Assessment",
        procedure: "Ultrasonic testing of limestone blocks",
        frequency: "Weekly during installation",
        lastCompleted: "2024-02-10",
        nextDue: "2024-02-17",
        status: "Scheduled"
      },
      {
        test: "Timber Moisture Content",
        procedure: "Electronic moisture meter testing",
        frequency: "Bi-weekly",
        lastCompleted: "2024-02-08",
        nextDue: "2024-02-22",
        status: "Overdue"
      }
    ]
  }

  const recentActivity = [
    {
      action: "Heritage stone delivered",
      project: projectData.name,
      time: "15 min ago",
      icon: CheckCircle,
      color: "text-green-600",
      details: "45 tons of period-matched limestone blocks delivered from Heritage Stone Supplies Ltd",
      user: "Emma Davis",
      exactTime: new Date(Date.now() - 15 * 60 * 1000).toLocaleString(),
      amount: "£8,100",
      status: "Completed",
      nextStep: "Begin installation phase"
    },
    {
      action: "Safety inspection passed",
      project: projectData.name,
      time: "45 min ago",
      icon: CheckCircle,
      color: "text-green-600",
      details: "Heritage building safety protocols inspection completed successfully",
      user: "Tom Brown",
      exactTime: new Date(Date.now() - 45 * 60 * 1000).toLocaleString(),
      amount: "£320",
      status: "Completed",
      nextStep: "Continue restoration work"
    },
    {
      action: "Budget review approved",
      project: projectData.name,
      time: "1 hour ago",
      icon: DollarSign,
      color: "text-blue-600",
      details: "Monthly budget review and overrun analysis approved by client",
      user: "Alice Cooper",
      exactTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString(),
      amount: "£0",
      status: "Approved",
      nextStep: "Implement cost control measures"
    },
    {
      action: "Structural assessment completed",
      project: projectData.name,
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-blue-600",
      details: "Monthly structural integrity inspection completed with no issues identified",
      user: "Tom Brown",
      exactTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
      amount: "£450",
      status: "Approved",
      nextStep: "Schedule next inspection"
    },
    {
      action: "Timber moisture test overdue",
      project: projectData.name,
      time: "1 day ago",
      icon: AlertTriangle,
      color: "text-red-600",
      details: "Bi-weekly timber moisture content testing is overdue and requires immediate attention",
      user: "Alice Cooper",
      exactTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(),
      amount: "£0",
      status: "Attention Required",
      nextStep: "Schedule emergency moisture testing"
    },
    {
      action: "Oak beam installation started",
      project: projectData.name,
      time: "2 days ago",
      icon: Settings,
      color: "text-amber-600",
      details: "Installation of reclaimed oak beams for structural support has commenced",
      user: "Emma Davis",
      exactTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
      amount: "£3,840",
      status: "Pending Review",
      nextStep: "Monitor installation progress"
    },
    {
      action: "Welsh slate tiles ordered",
      project: projectData.name,
      time: "3 days ago",
      icon: Plus,
      color: "text-amber-600",
      details: "2,400 Welsh slate tiles ordered from Celtic Slate Quarries for roof restoration",
      user: "Emma Davis",
      exactTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
      amount: "£10,800",
      status: "Pending Review",
      nextStep: "Confirm delivery schedule"
    },
    {
      action: "Crane rental confirmed",
      project: projectData.name,
      time: "4 days ago",
      icon: CheckCircle,
      color: "text-green-600",
      details: "25-ton heritage-approved mobile crane rental confirmed for stone installation",
      user: "Tom Brown",
      exactTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString(),
      amount: "£2,250",
      status: "Completed",
      nextStep: "Coordinate delivery schedule"
    }
  ]

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
            <TabsTrigger value="professional">Professional Analysis</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[600px]">
              {/* Left Column - Project Description + Quick Specs (3/5 width) */}
              <div className="lg:col-span-3 space-y-6">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{projectData.description}</p>
                  </CardContent>
                </Card>

                {/* Technical Specs Summary Bar */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowTechnicalModal(true)}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      Technical Specifications
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">
                          {projectData.name.includes('Heritage') ? 'Historic Building' : 
                           projectData.name.includes('Office') ? 'Commercial Office' : 
                           'Residential Complex'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Scale:</span>
                        <span className="font-medium">
                          {projectData.budget > 100000 ? 'Large Scale' : 
                           projectData.budget > 50000 ? 'Medium Scale' : 'Small Scale'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">
                          {Math.ceil((new Date(projectData.endDate).getTime() - new Date(projectData.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team:</span>
                        <span className="font-medium">{projectData.team.length} members</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Phases - Compact Horizontal Layout */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Project Phases</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
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
                              className="text-xs"
                            >
                              {phase.status}
                            </Badge>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{phase.progress}% complete</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Expanded Recent Activity (2/5 width, full height) */}
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                    <p className="text-sm text-muted-foreground">Latest project updates and developments</p>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-1">
                    {recentActivity.map((activity, index) => {
                      const IconComponent = activity.icon
                      return (
                        <ActivityTooltip key={index} activity={activity}>
                          <div className="py-3 px-3 -mx-3 border-b border-gray-100 last:border-b-0 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm hover:scale-[1.01]">
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                activity.status === 'Completed' ? 'bg-green-100' :
                                activity.status === 'Approved' ? 'bg-blue-100' :
                                activity.status === 'Attention Required' ? 'bg-red-100' :
                                'bg-amber-100'
                              }`}>
                                <IconComponent className={`w-4 h-4 ${activity.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 leading-tight">{activity.action}</p>
                                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs px-2 py-0.5 ${
                                      activity.status === 'Completed' ? 'border-green-200 text-green-700' :
                                      activity.status === 'Approved' ? 'border-blue-200 text-blue-700' :
                                      activity.status === 'Attention Required' ? 'border-red-200 text-red-700' :
                                      'border-amber-200 text-amber-700'
                                    }`}
                                  >
                                    {activity.status}
                                  </Badge>
                                  {activity.amount && activity.amount !== "£0" && (
                                    <span className="text-xs font-medium text-gray-900">{activity.amount}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </ActivityTooltip>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
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


              {/* 2x2 Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Left: Comprehensive Line Graph */}
              <Card className="col-span-1 h-[500px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                  <CardTitle className="text-lg">Spending Trends</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lifetime">Project Lifetime</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Button size="sm" variant="outline" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-auto">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart 
                        data={getFilteredSpendingData()} 
                        margin={{ top: 20, right: 120, left: 20, bottom: 5 }}
                        onClick={(data) => handleDrillDown(data, 'line', 'spending-trends')}
                      >
                        <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" strokeOpacity={0.4} />
                        
                        <XAxis 
                          dataKey="week" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#1e3a8a', fontWeight: 500 }}
                          tickFormatter={(value) => value.replace('Week ', '')}
                          label={{ value: 'Project Timeline (Weeks)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#1e3a8a', fontSize: 12, fontWeight: 600 } }}
                        />
                        
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#1e3a8a', fontWeight: 400 }}
                          tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                          domain={[0, timePeriod === 'lifetime' ? 50000 : 40000]}
                          label={{ value: 'Cumulative Cost (£)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#1e3a8a', fontSize: 12, fontWeight: 600 } }}
                        />
                        
                        <RechartsTooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #1e3a8a',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)'
                          }}
                          content={({ active, payload, label }) => {
                            if (!active || !payload || !payload.length) return null
                            
                            const data = payload[0].payload
                            
                            return (
                              <div className="bg-white border border-blue-900 rounded-lg shadow-lg p-3">
                                <p className="text-blue-900 font-semibold mb-2">{label}</p>
                                
                                {/* Show Actual Spend first if present */}
                                {data.actual && (
                                  <div className="mb-3">
                                    <div className="font-medium text-blue-900 mb-1">Actual Spend</div>
                                    <div className="space-y-1">
                                      <div className="font-medium text-blue-900">£{Number(data.actual).toLocaleString()}</div>
                                      {data.daily && (
                                        <>
                                          <div className="text-xs text-gray-600">Weekly: £{data.daily.reduce((sum: number, day: number) => sum + day, 0).toLocaleString()}</div>
                                          <div className="text-xs cursor-pointer text-blue-600 hover:text-blue-800" onClick={() => handleDrillDown(data, 'line', 'spending-trends')}>Click for details →</div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Show Projected Spend if present */}
                                {data.projected && (
                                  <div className="mb-3">
                                    <div className="font-medium text-blue-900 mb-1">Projected Spend</div>
                                    <div className="space-y-0.5">
                                      <div className="font-medium text-blue-900">£{Number(data.projected).toLocaleString()}</div>
                                      {data.projectedUpper && data.projectedLower && (
                                        <>
                                          <div className="text-xs text-gray-600">Upper: £{Number(data.projectedUpper).toLocaleString()}</div>
                                          <div className="text-xs text-gray-600">Lower: £{Number(data.projectedLower).toLocaleString()}</div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Show Budget Allocation last */}
                                {data.budgetAllocation && (
                                  <div>
                                    <div className="font-medium text-red-600 mb-1">Budget Allocation</div>
                                    <div className="font-medium text-red-600">£{Number(data.budgetAllocation).toLocaleString()}</div>
                                  </div>
                                )}
                              </div>
                            )
                          }}
                        />
                        
                        {/* Budget ceiling (red horizontal line) */}
                        <ReferenceLine y={45000} stroke="#dc2626" strokeWidth={2} strokeDasharray="4 4"
                          label={{ value: "Budget", position: "right", style: { fill: '#dc2626', fontWeight: 500, fontSize: 11 } }} />
                        
                        {/* Vertical indicator at Week 12 to mark "today" - only visible on lifetime view */}
                        {timePeriod === 'lifetime' && (
                          <ReferenceLine x="Week 12" stroke="#9ca3af" strokeWidth={2} strokeDasharray="2 2"
                            label={{ value: "Today", position: "top", offset: 10, style: { fill: '#6b7280', fontWeight: 500, fontSize: 11 } }} />
                        )}
                        
                        {/* Shaded confidence interval for projections (only visible on lifetime view) */}
                        {timePeriod === 'lifetime' && (
                          <Area type="monotone" dataKey="projectedUpper" stroke="none" fill="#9ca3af" fillOpacity={0.15} connectNulls={false} />
                        )}
                        {timePeriod === 'lifetime' && (
                          <Area type="monotone" dataKey="projectedLower" stroke="none" fill="white" fillOpacity={1} connectNulls={false} />
                        )}
                        
                        {/* Lines */}
                        <Line type="monotone" dataKey="actual" stroke="#000000" strokeWidth={3} name="actual" 
                              dot={false} activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2, fill: 'white' }}
                              connectNulls={false} />
                        <Line type="monotone" dataKey="projected" stroke="#000000" strokeWidth={2} strokeDasharray="8 4" name="projected"
                              dot={false} activeDot={{ r: 5, stroke: '#000000', strokeWidth: 2, fill: 'white' }} connectNulls={false} />
                        <Line type="monotone" dataKey="budgetAllocation" stroke="#dc2626" strokeWidth={2} name="budgetAllocation"
                              dot={false} activeDot={{ r: 4, stroke: '#dc2626', strokeWidth: 1, fill: 'white' }} connectNulls={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 bg-black"></div>
                        <span className="text-gray-600">Actual Spend</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 relative">
                          <div className="absolute inset-0 border-b-2 border-dashed border-black"></div>
                        </div>
                        <span className="text-gray-600">Projected Spend</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 bg-red-600"></div>
                        <span className="text-gray-600">Budget Allocation</span>
                      </div>
                      {timePeriod === 'lifetime' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-300 opacity-30"></div>
                          <span className="text-gray-600">Confidence Range</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Right: Key Cost Drivers */}
              <Card className="col-span-1 h-[500px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-green-600" />
                      Budget Impact Analysis
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Active cost overruns impacting budget with immediate remediation actions</p>
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
                <CardContent className="flex-1 min-h-0 overflow-auto">
                  <div className="space-y-4">
                    {[
                      { 
                        driver: 'Steel Price Spike', 
                        description: 'Price increase already applied to current orders', 
                        impact: 1200, 
                        type: 'overrun',
                        category: 'Materials',
                        daysActive: 12,
                        dailyImpact: 0,
                        actionText: 'Renegotiate Contract',
                        actionDetails: 'SteelCorp Ltd: +44 1234 567890 | Alternative: MetalPro: +44 1234 567891 | Contract renegotiation deadline: 3 days'
                      },
                      { 
                        driver: 'Crane Rental Overrun', 
                        description: 'Extended rental period already incurred', 
                        impact: 450, 
                        type: 'overrun',
                        category: 'Equipment',
                        daysActive: 8,
                        dailyImpact: 45,
                        actionText: 'Switch Provider',
                        actionDetails: 'CraneHire Plus: +44 1234 567892 | 15% cheaper rates available | Immediate availability confirmed'
                      },
                      { 
                        driver: 'Overtime Labor Costs', 
                        description: 'Weather delays causing daily overtime charges', 
                        impact: 890, 
                        type: 'overrun',
                        category: 'Labour',
                        daysActive: 5,
                        dailyImpact: 178,
                        actionText: 'Adjust Schedule',
                        actionDetails: 'Crew management portal: scheduletools.com | Emergency scheduling: +44 1234 567895'
                      },
                      { 
                        driver: 'Emergency Waterproofing', 
                        description: 'Additional materials already ordered due to rain damage', 
                        impact: 650, 
                        type: 'overrun',
                        category: 'Materials',
                        daysActive: 3,
                        dailyImpact: 0,
                        actionText: 'Insurance Claim',
                        actionDetails: 'Claim #WX2024-1847 | Adjuster: Sarah Mills +44 1234 567896 | Documentation required by Friday'
                      },
                      { 
                        driver: 'Specialized Subcontractor', 
                        description: 'Expert plumbing work already commenced at premium rate', 
                        impact: 890, 
                        type: 'overrun',
                        category: 'Labour',
                        daysActive: 15,
                        dailyImpact: 0,
                        actionText: 'Compare Quotes',
                        actionDetails: 'PlumbPro: +44 1234 567893 | AquaExperts: +44 1234 567894 | Current contract ends Monday'
                      }
                    ].map((driver, index) => {
                      const isOverrun = driver.type === 'overrun'
                      const impact = Math.abs(driver.impact)
                      
                      return (
                        <div key={index} className={`p-4 border rounded-lg hover:shadow-sm transition-all cursor-pointer overflow-hidden ${
                          isOverrun ? 'border-red-200 hover:bg-red-25' : 'border-green-200 hover:bg-green-25'
                        }`}>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">{driver.driver}</div>
                              <div className="text-sm text-gray-600 mt-1">{driver.description}</div>
                              {isOverrun && (
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">{driver.daysActive} days active</span>
                                  </div>
                                  {driver.dailyImpact > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <AlertTriangle className="h-3 w-3 text-red-400" />
                                      <span className="text-xs text-red-600 font-medium">£{driver.dailyImpact}/day</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0 ml-3">
                              <div className={`text-lg font-bold ${
                                isOverrun ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {isOverrun ? '+' : '-'}£{impact.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">{driver.category}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {isOverrun ? (
                                <TrendingUp className="h-4 w-4 text-red-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-green-600" />
                              )}
                              <span className={`text-sm font-medium ${
                                isOverrun ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {isOverrun ? 'Cost Overrun' : 'Cost Saving'}
                              </span>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto"
                                  onClick={() => handleDrillDown(driver, 'bar', 'cost-categories')}
                                >
                                  {driver.actionText} <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p className="text-sm">{driver.actionDetails}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>


              {/* Bottom Left: Budget Risk Alerts */}
              <Card className="col-span-1 h-[500px] flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                    Budget Risk Alerts
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Future trends and upcoming events that may impact project budget</p>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-auto">
                  <div className="space-y-4">
                    {/* Enhanced Risk Alerts with Actions */}
                    {[
                      {
                        id: 1,
                        level: 'amber',
                        title: 'Future Material Cost Risk',
                        message: 'Market indicators suggest 5-8% steel price increase over next 6-8 weeks - proactive action recommended',
                        impact: '£2,400 potential increase',
                        confidence: 85,
                        recommendation: 'Lock in current pricing or establish hedging strategy to prevent budget overrun',
                        actions: [
                          { label: 'Secure Fixed Pricing Contract', urgent: true },
                          { label: 'Evaluate Alternative Materials', urgent: false }
                        ],
                        positiveContext: '15% contingency buffer available to absorb potential increases'
                      },
                      {
                        id: 2,
                        level: 'green',
                        title: 'Bulk Purchase Opportunity',
                        message: 'ElectricPro offers 8% additional discount on next electrical component order if placed by month-end',
                        impact: '£400 potential savings',
                        confidence: 88,
                        recommendation: 'Accelerate electrical component procurement to capture discount window',
                        actions: [
                          { label: 'Review Electrical Requirements', urgent: false },
                          { label: 'Place Early Order', urgent: true }
                        ],
                        positiveContext: 'Current electrical timeline allows for early procurement'
                      },
                      {
                        id: 3,
                        level: 'red',
                        title: 'Weather Risk Exposure',
                        message: '40% chance of rainfall next week could impact crane operations and extend rental period',
                        impact: '£1,800 potential additional cost',
                        confidence: 78,
                        recommendation: 'Implement weather contingency plan: accelerate crane-dependent work or secure backup equipment',
                        actions: [
                          { label: 'Execute Weather Contingency Plan', urgent: true },
                          { label: 'Secure Backup Equipment Options', urgent: true }
                        ],
                        positiveContext: 'Alternative indoor work can progress during weather delays'
                      },
                      {
                        id: 4,
                        level: 'amber',
                        title: 'Seasonal Supply Chain Disruption',
                        message: 'Approaching holiday period (Dec 20-Jan 3) may cause 2-week delays in specialized equipment delivery',
                        impact: '£1,200 potential storage and delay costs',
                        confidence: 68,
                        recommendation: 'Order critical equipment by Nov 30th to avoid seasonal delays, or plan alternative work sequences',
                        actions: [
                          { label: 'Accelerate Equipment Orders', urgent: true },
                          { label: 'Develop Alternative Work Schedule', urgent: false }
                        ],
                        positiveContext: 'Most materials already secured, only specialized fittings at risk'
                      },
                      {
                        id: 5,
                        level: 'green',
                        title: 'Energy Cost Optimization Window',
                        message: 'Projected 15% drop in energy costs next month due to seasonal demand patterns',
                        impact: '£800 potential savings',
                        confidence: 73,
                        recommendation: 'Schedule energy-intensive operations (concrete curing, heating) for optimal pricing window',
                        actions: [
                          { label: 'Reschedule Energy Operations', urgent: false },
                          { label: 'Lock in Favorable Rates', urgent: false }
                        ],
                        positiveContext: 'Flexible timeline allows optimization for cost savings'
                      }
                    ].map((alert) => (
                      <div key={alert.id} className={`rounded-lg border-l-4 p-4 ${
                        alert.level === 'red' ? 'border-red-500 bg-red-50' :
                        alert.level === 'amber' ? 'border-amber-500 bg-amber-50' :
                        'border-green-500 bg-green-50'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {alert.level === 'red' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                             alert.level === 'amber' ? <AlertTriangle className="h-4 w-4 text-amber-600" /> :
                             <CheckCircle className="h-4 w-4 text-green-600" />}
                            <h4 className={`font-semibold text-sm ${
                              alert.level === 'red' ? 'text-red-800' :
                              alert.level === 'amber' ? 'text-amber-800' :
                              'text-green-800'
                            }`}>
                              {alert.title}
                            </h4>
                          </div>
                          <Badge className={`text-xs ${
                            alert.level === 'red' ? 'bg-red-100 text-red-800 border-red-300' :
                            alert.level === 'amber' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-green-100 text-green-800 border-green-300'
                          }`}>
                            {alert.confidence}% confidence
                          </Badge>
                        </div>
                        
                        <p className={`text-sm mb-2 ${
                          alert.level === 'red' ? 'text-red-700' :
                          alert.level === 'amber' ? 'text-amber-700' :
                          'text-green-700'
                        }`}>
                          {alert.message}
                        </p>
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-xs font-medium ${
                            alert.level === 'red' ? 'text-red-800' :
                            alert.level === 'amber' ? 'text-amber-800' :
                            'text-green-800'
                          }`}>
                            Impact: {alert.impact}
                          </span>
                          <span className="text-xs text-gray-600">
                            {alert.positiveContext}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-700">
                            Recommendation: {alert.recommendation}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {alert.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant={action.urgent ? "default" : "outline"}
                                className={`text-xs h-7 ${action.urgent ? 
                                  (alert.level === 'red' ? 'bg-red-600 hover:bg-red-700' : 
                                   alert.level === 'amber' ? 'bg-amber-600 hover:bg-amber-700' :
                                   'bg-green-600 hover:bg-green-700') : ''
                                }`}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Project Health Summary */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Project Health Score: 82%</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        Overall project remains on track with manageable risks and positive performance indicators.
                        Labour efficiency gains are offsetting material cost pressures.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Right: Cost Categories Bar Chart */}
              <Card className="col-span-1 h-[500px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-slate-600" />
                    Cost Categories
                  </CardTitle>
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
                <CardContent className="flex-1 min-h-0 overflow-auto">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(projectData.costBreakdown || {}).map(([category, data]) => ({
                          category: category.charAt(0).toUpperCase() + category.slice(1),
                          Budget: data.budget,
                          Projected: data.projected, 
                          Actual: data.actual
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        onClick={(data) => handleDrillDown(data, 'bar', 'cost-categories')}
                      >
                        <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" strokeOpacity={0.4} />
                        <XAxis dataKey="category" 
                               tick={{ fontSize: 10, fill: '#475569', fontWeight: 500 }}
                               angle={-45}
                               textAnchor="end"
                               height={80} />
                        <YAxis tick={{ fontSize: 10, fill: '#475569', fontWeight: 400 }}
                               tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
                        <RechartsTooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(71, 85, 105, 0.15)'
                          }}
                          formatter={(value: any, name: string) => [`£${Number(value).toLocaleString()}`, name]}
                          labelStyle={{ color: '#475569', fontWeight: 600 }}
                        />
                        <Legend />
                        <Bar dataKey="Budget" fill="#dc2626" name="Budget" />
                        <Bar dataKey="Projected" fill="#475569" name="Projected" />
                        <Bar dataKey="Actual" fill="#059669" name="Actual" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            

            {/* Additional Forecasting Tools - Stats Cards (Moved to bottom) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Weekly Burn Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-900 mt-2">
                    £{projectData.budgetForecast?.currentBurnRate?.toLocaleString() || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Per week average</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Days to Budget Limit</span>
                  </div>
                  <div className={`text-2xl font-bold mt-2 ${
                    (projectData.budgetForecast?.daysUntilOverrun || 0) < 30 
                      ? "text-red-600" 
                      : (projectData.budgetForecast?.daysUntilOverrun || 0) < 60 
                        ? "text-amber-600" 
                        : "text-green-600"
                  }`}>
                    {projectData.budgetForecast?.daysUntilOverrun === null || (projectData.budgetForecast?.daysUntilOverrun || 0) < 0
                      ? "Under Budget" 
                      : `${projectData.budgetForecast.daysUntilOverrun} days`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {projectData.budgetForecast?.confidence}% confidence
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Projected Total</span>
                  </div>
                  <div className={`text-2xl font-bold mt-2 ${
                    (projectData.budgetForecast?.projectedTotal || 0) > projectData.budget
                      ? "text-red-600"
                      : (projectData.budgetForecast?.projectedTotal || 0) > projectData.budget * 0.9
                        ? "text-amber-600"
                        : "text-green-600"
                  }`}>
                    £{projectData.budgetForecast?.projectedTotal?.toLocaleString() || 'N/A'}
                  </div>
                  <p className={`text-xs mt-1 ${
                    (projectData.budgetForecast?.overrunAmount || 0) > 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}>
                    {(projectData.budgetForecast?.overrunAmount || 0) > 0
                      ? `£${projectData.budgetForecast!.overrunAmount.toLocaleString()} over`
                      : (projectData.budgetForecast?.overrunAmount || 0) < 0
                        ? `£${Math.abs(projectData.budgetForecast!.overrunAmount).toLocaleString()} under`
                        : "On budget"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Project Transactions */}
            <Card className="mt-6">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Project Transactions
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    {/* Week Filter */}
                    <Select defaultValue="Week 12">
                      <SelectTrigger className="w-32 h-9">
                        <SelectValue placeholder="Week" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredSpendingData().map((weekData) => (
                          <SelectItem key={weekData.week} value={weekData.week}>
                            {weekData.week}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Phase Filter */}
                    <Select defaultValue="all">
                      <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="Phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Phases</SelectItem>
                        <SelectItem value="foundation">Foundation</SelectItem>
                        <SelectItem value="framing">Framing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="finishing">Finishing</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button size="sm" variant="outline" onClick={exportToPDF}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-auto" style={{ maxHeight: '350px' }}>
                <div className="space-y-3">
                  <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-600 pb-2 border-b">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Category</div>
                    <div>Vendor</div>
                    <div className="text-right">Amount</div>
                    <div className="text-center">Status</div>
                  </div>
                  
                  {/* Sample transaction data */}
                  {[
                    { date: '2024-03-15', description: 'Steel reinforcement bars', category: 'Materials', vendor: 'SteelCorp Ltd', amount: 2800, status: 'paid' },
                    { date: '2024-03-14', description: 'Labour - Foundation work', category: 'Labour', vendor: 'BuildCrew Inc', amount: 1500, status: 'pending' },
                    { date: '2024-03-13', description: 'Concrete mixer rental', category: 'Equipment', vendor: 'EquipRent', amount: 450, status: 'paid' },
                    { date: '2024-03-12', description: 'Safety equipment', category: 'Materials', vendor: 'SafetyFirst', amount: 320, status: 'paid' },
                    { date: '2024-03-11', description: 'Electrical components', category: 'Materials', vendor: 'ElectricPro', amount: 890, status: 'pending' },
                    { date: '2024-03-10', description: 'Labour - Site preparation', category: 'Labour', vendor: 'BuildCrew Inc', amount: 1200, status: 'paid' },
                  ].map((transaction, index) => (
                    <div key={index} className="grid grid-cols-6 gap-4 text-sm py-2 hover:bg-gray-50 rounded transition-colors">
                      <div className="text-gray-900">{new Date(transaction.date).toLocaleDateString()}</div>
                      <div className="text-gray-900 truncate">{transaction.description}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.category === 'Materials' ? 'bg-blue-100 text-blue-800' :
                          transaction.category === 'Labour' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.category}
                        </span>
                      </div>
                      <div className="text-gray-700 truncate">{transaction.vendor}</div>
                      <div className="text-right font-medium">£{transaction.amount.toLocaleString()}</div>
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals (Moved to bottom) */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-sm">Budget Increase Request</p>
                        <p className="text-xs text-gray-600">Additional £5,000 for premium materials</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-amber-700 border-amber-300">Pending</Badge>
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Material Specification Change</p>
                        <p className="text-xs text-gray-600">Welsh slate tiles approved</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-700 border-green-300">Approved</Badge>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Schedule Extension Request</p>
                        <p className="text-xs text-gray-600">Weather delay compensation - 3 days</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-blue-700 border-blue-300">Under Review</Badge>
                      <Button size="sm" variant="outline">Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Excel Spreadsheet Component */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Project Workbook</span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="h-8 px-2 text-xs">
                      Save
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2 text-xs">
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Excel-like Interface */}
                <div className="border rounded-lg bg-white overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b text-xs">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-700">Sheet: Budget Analysis</span>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">Bold</Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">Italic</Button>
                        <span className="text-gray-400">|</span>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">Sort</Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">Filter</Button>
                      </div>
                    </div>
                    <div className="text-gray-500">Cell: A1</div>
                  </div>
                  
                  {/* Spreadsheet Grid */}
                  <div className="overflow-auto" style={{ height: '400px' }}>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="w-12 h-8 border border-gray-300 text-xs font-medium text-gray-600 bg-gray-200"></th>
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((col) => (
                            <th key={col} className="min-w-24 h-8 border border-gray-300 text-xs font-medium text-gray-600 bg-gray-200 px-2">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="w-12 h-8 border border-gray-300 text-xs text-center text-gray-600 bg-gray-100 font-medium">1</td>
                          <td className="border border-gray-300 px-2 py-1 text-sm font-medium bg-blue-50">Category</td>
                          <td className="border border-gray-300 px-2 py-1 text-sm font-medium bg-blue-50">Budget</td>
                          <td className="border border-gray-300 px-2 py-1 text-sm font-medium bg-blue-50">Actual</td>
                          <td className="border border-gray-300 px-2 py-1 text-sm font-medium bg-blue-50">Variance</td>
                          <td className="border border-gray-300 px-2 py-1 text-sm font-medium bg-blue-50">% Complete</td>
                          <td className="border border-gray-300 px-2 py-1 text-sm font-medium bg-blue-50">Forecast</td>
                          <td className="border border-gray-300 px-2 py-1 text-sm font-medium bg-blue-50">Notes</td>
                          <td className="border border-gray-300"></td>
                        </tr>
                        {[
                          ['Materials', '£18,000', '£16,200', '-£1,800', '85%', '£19,500', 'Premium upgrade approved'],
                          ['Labour', '£15,000', '£14,300', '-£700', '82%', '£16,800', 'Overtime for weather delays'],
                          ['Equipment', '£8,000', '£7,500', '-£500', '90%', '£8,200', 'Installation on schedule'],
                          ['Permits', '£2,000', '£2,000', '£0', '100%', '£2,000', 'All permits obtained'],
                          ['Overhead', '£1,500', '£1,200', '-£300', '75%', '£1,800', 'Site management costs'],
                          ['Contingency', '£500', '£0', '-£500', '0%', '£300', 'Reserved for final phase'],
                          ['TOTAL', '£45,000', '£41,200', '-£3,800', '84%', '£48,600', 'Project tracking well']
                        ].map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex === 6 ? 'bg-blue-50 font-medium' : 'hover:bg-gray-50'}>
                            <td className="w-12 h-8 border border-gray-300 text-xs text-center text-gray-600 bg-gray-100 font-medium">{rowIndex + 2}</td>
                            {row.map((cell, cellIndex) => (
                              <td 
                                key={cellIndex} 
                                className={`border border-gray-300 px-2 py-1 text-sm ${
                                  cellIndex === 0 ? 'font-medium' : 
                                  cellIndex === 3 ? (cell.startsWith('-') ? 'text-green-600' : cell === '£0' ? 'text-gray-600' : 'text-red-600') :
                                  cellIndex === 4 ? 'text-center' :
                                  cellIndex === 5 ? (cell.startsWith('£') ? 'font-medium text-blue-600' : 'text-gray-600') :
                                  cellIndex === 6 ? 'text-xs text-gray-600' : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                            <td className="border border-gray-300"></td>
                          </tr>
                        ))}
                        {/* Empty rows */}
                        {Array.from({ length: 8 }, (_, i) => (
                          <tr key={`empty-${i}`}>
                            <td className="w-12 h-8 border border-gray-300 text-xs text-center text-gray-600 bg-gray-100 font-medium">{i + 9}</td>
                            {Array.from({ length: 8 }, (_, j) => (
                              <td key={j} className="border border-gray-300 h-8"></td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Formula Bar */}
                  <div className="border-t bg-white px-3 py-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600 font-medium w-8">fx</span>
                      <Input 
                        className="flex-1 h-8 text-sm border-gray-300" 
                        placeholder="Enter formula or value..."
                        defaultValue="=SUM(B2:B7)"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto-refresh indicator */}
            <div className="flex items-center justify-between pt-6 text-xs text-gray-500 mt-8 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span>Auto-refresh: {autoRefresh ? 'On' : 'Off'}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className="text-xs h-auto p-1"
                >
                  {autoRefresh ? 'Disable' : 'Enable'}
                </Button>
              </div>
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Project Files</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Project
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowProjectEditModal(true)}>
                    <FileEdit className="h-4 w-4 mr-2" />
                    Manual Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAssistantModal(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Work with Assistant
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for documents or photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowDocumentModal(true)} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Document
              </Button>
            </div>

            {searchTerm && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Showing results for "{searchTerm}"
                </p>
                {filteredFiles.length === 0 ? (
                  <Card className="p-6 text-center">
                    <div className="space-y-3">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">No files found matching your search</p>
                      <Button onClick={() => setShowDocumentModal(true)} size="sm">
                        Create Document Instead
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {filteredFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        {file.type === 'document' ? (
                          <FileText className="h-4 w-4 text-blue-500" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-green-500" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">{file.name}</p>
                            {file.isNew && (
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {file.type === 'document' ? 'Document' : 'Photo'} • 
                            {file.isNew ? 'Created' : 'Uploaded'} {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!searchTerm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Documents</span>
                      <Badge variant="secondary" className="text-xs">
                        {projectData.documents.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {projectData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {createdDocuments.map((doc, index) => (
                      <div key={`created-${index}`} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
                        <FileText className="h-4 w-4 text-green-500" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">{doc.name}</p>
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(doc.createdDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>Photos</span>
                      <Badge variant="secondary" className="text-xs">
                        {projectData.photos.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {projectData.photos.map((photo, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
                        <ImageIcon className="h-4 w-4 text-green-500" />
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
            )}
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Professional Variance Analysis</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Earned Value Management (EVM) analysis compliant with UK construction industry standards
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  BS6576 | BS8102 | PAS2035 Compliant
                </Badge>
              </div>

              {/* Professional Variance Cards */}
              {projectData.projectType && projectData.physicalProgress && projectData.evmMetrics && (
                <ProfessionalVarianceCard
                  projectName={projectData.name}
                  projectType={projectData.projectType}
                  budgetAtCompletion={projectData.budget}
                  physicalProgress={projectData.physicalProgress}
                  plannedProgress={projectData.plannedProgress}
                  actualCost={projectData.spent}
                  standardPrice={projectData.evmMetrics?.standardPrice}
                  actualPrice={projectData.evmMetrics?.actualPrice}
                  standardQuantity={projectData.evmMetrics?.standardQuantity}
                  actualQuantity={projectData.evmMetrics?.actualQuantity}
                  standardLaborRate={projectData.evmMetrics?.standardLaborRate}
                  actualLaborRate={projectData.evmMetrics?.actualLaborRate}
                  laborHours={projectData.evmMetrics?.laborHours}
                  suppliers={projectData.suppliers}
                  onInvestigate={(metrics) => {
                    setSelectedProfessionalAnalysis({
                      metrics,
                      category: 'Cost Performance',
                      varianceAmount: metrics.CV,
                      investigationData: {
                        rootCause: `${projectData.projectType === 'heritage' ? 'Heritage material' : 'Premium equipment'} price escalation due to supply chain constraints and specialist supplier premium. Market conditions have driven 15% increase in material costs since project baseline, with limited alternative suppliers meeting ${projectData.projectType === 'heritage' ? 'conservation standards' : 'luxury specification requirements'}.`,
                        timeline: 'Price escalation commenced Week 8 following supplier notification. Impact accumulated over 4-week period with 68% contribution to total variance. Current trajectory indicates continued pressure through Q2.',
                        industryContext: `${projectData.projectType === 'heritage' ? 'Heritage restoration sector' : 'Luxury construction market'} experiencing 12-18% material cost inflation. Brexit supply chain disruption and specialist skill shortages driving premium rates. Industry CPI average 0.92 for comparable projects.`,
                        trendAnalysis: `${projectData.CPI < 0.90 ? 'Declining performance trend requires immediate intervention' : 'Performance within manageable parameters but trending negative'}. 30-day moving average shows ${projectData.CPI < 0.95 ? 'deteriorating' : 'stable'} cost control.`,
                        benchmarking: {
                          projectCPI: metrics.CPI,
                          industryStandard: projectData.projectType === 'heritage' ? '0.90-1.05' : '0.95-1.10',
                          similarProjects: `Peer analysis: ${projectData.projectType === 'heritage' ? 'Heritage projects' : 'Luxury installations'} averaging ${projectData.projectType === 'heritage' ? '12%' : '8%'} variance. Project ranks ${metrics.CPI < 0.92 ? 'bottom quartile' : 'median'} for cost performance.`,
                          supplierPerformance: `Key suppliers ${projectData.suppliers?.[0]?.riskLevel === 'HIGH' ? 'underperforming' : 'meeting'} SLA requirements. ${projectData.suppliers?.filter(s => s.riskLevel === 'HIGH').length || 0} high-risk suppliers requiring management attention.`
                        },
                        remediationOptions: [
                          {
                            title: 'Switch to Alternative Supplier',
                            description: `Transition to ${projectData.projectType === 'heritage' ? 'Cotswold Conservation Materials' : 'Premium Golf Tech Ltd'} for remaining 40% of materials. Verified supplier with superior performance metrics and 8% cost advantage.`,
                            investment: 2500,
                            netBenefit: 8200,
                            timeframe: 2,
                            successProbability: 85,
                            riskLevel: 'LOW' as const,
                            criticalPathImpact: 3,
                            implementation: '3-day transition period',
                            owner: 'Procurement Manager',
                            deadline: '14 days from approval'
                          },
                          {
                            title: 'Renegotiate Current Contract',
                            description: 'Leverage project scale and payment terms to secure 5-7% price reduction. Include volume commitment and early payment incentives.',
                            investment: 800,
                            netBenefit: 4200,
                            timeframe: 1.5,
                            successProbability: 65,
                            riskLevel: 'MEDIUM' as const,
                            criticalPathImpact: 0,
                            implementation: '2-week negotiation cycle',
                            owner: 'Commercial Manager',
                            deadline: '10 days from approval'
                          },
                          {
                            title: 'Value Engineering Optimization',
                            description: 'Technical review of specifications to identify cost-neutral alternatives maintaining quality standards. Focus on material quantities and installation methods.',
                            investment: 1500,
                            netBenefit: 6800,
                            timeframe: 3,
                            successProbability: 78,
                            riskLevel: 'LOW' as const,
                            criticalPathImpact: -2,
                            implementation: '1-week technical review',
                            owner: 'Technical Director',
                            deadline: '21 days from approval'
                          }
                        ],
                        relatedDocumentation: [
                          `Invoice #${Math.floor(Math.random() * 9000) + 1000}`,
                          'Supplier Performance Report',
                          'Market Price Analysis',
                          `${projectData.projectType === 'heritage' ? 'Conservation Standards Compliance' : 'Quality Specification Document'}`
                        ],
                        impactedSuppliers: projectData.suppliers?.filter(s => s.riskLevel !== 'LOW') || []
                      }
                    })
                    setShowProfessionalModal(true)
                  }}
                  onContactSupplier={(supplier) => {
                    // Handle supplier contact
                    console.log('Contacting supplier:', supplier.name)
                  }}
                />
              )}

              {/* Industry Benchmarking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Industry Benchmarking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Project Classification</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium capitalize">{projectData.projectType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget Range:</span>
                          <span className="font-medium">{formatCurrency(projectData.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Complexity:</span>
                          <span className="font-medium">
                            {projectData.projectType === 'heritage' ? 'High (Conservation)' : 
                             projectData.projectType === 'luxury' ? 'High (Premium)' : 'Standard'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Performance vs Peers</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Industry CPI Range:</span>
                          <span className="font-medium">
                            {projectData.projectType === 'heritage' ? '0.85-1.05' : '0.95-1.10'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Typical Variance:</span>
                          <span className="font-medium">
                            {projectData.projectType === 'heritage' ? '10-15%' : '5-10%'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Project Ranking:</span>
                          <span className="font-medium">
                            {Math.abs(projectData.spent - projectData.budget) / projectData.budget < 0.1 ? 'Top Quartile' : 'Median'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Compliance Standards</h4>
                      <div className="flex flex-wrap gap-2">
                        {projectData.suppliers?.[0]?.bsCompliance?.map(standard => (
                          <Badge key={standard} variant="outline" className="text-xs">
                            {standard}
                          </Badge>
                        )) || [
                          <Badge key="default" variant="outline" className="text-xs">BS8102</Badge>
                        ]}
                      </div>
                      <p className="text-xs text-gray-600">
                        All suppliers verified compliant with relevant British Standards
                        {projectData.projectType === 'heritage' && ' and conservation requirements'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <DocumentCreationModal
        open={showDocumentModal}
        onOpenChange={setShowDocumentModal}
        onDocumentCreated={(doc) => setCreatedDocuments(prev => [...prev, doc])}
        projectContext={{
          name: projectData.name,
          client: projectData.client,
          budget: projectData.budget,
          team: projectData.team,
          status: projectData.status,
          description: projectData.description
        }}
      />
      
      <ProjectEditModal
        open={showProjectEditModal}
        onOpenChange={setShowProjectEditModal}
        projectData={projectData}
        onSave={(updatedProject) => {
          console.log('Project updated:', updatedProject)
        }}
      />
      
      <AssistantEditModal
        open={showAssistantModal}
        onOpenChange={setShowAssistantModal}
        projectData={projectData}
        onSave={(updatedProject) => {
          console.log('Project updated via assistant:', updatedProject)
        }}
      />
      
      <TechnicalSpecificationsModal
        open={showTechnicalModal}
        onOpenChange={setShowTechnicalModal}
        projectName={projectData.name}
        technicalSpecifications={technicalSpecifications}
      />

      {/* Unified Modal System */}
      <Dialog open={showDrillDownModal} onOpenChange={setShowDrillDownModal}>
        <DialogContent className="!max-w-[70vw] !w-[70vw] max-h-[90vh] flex flex-col" showCloseButton={false}>
          {(() => {
            console.log('Modal rendering with selectedDrillDown:', selectedDrillDown, 'modalType:', modalType)
            const metrics = getComprehensiveMetrics(selectedDrillDown)
            const filteredData = getAllProjectData()
            const currentIndex = filteredData.findIndex(d => d.week === selectedDrillDown?.week)
            const canGoPrev = currentIndex > 0
            const canGoNext = currentIndex < filteredData.length - 1
            
            // Modal titles and descriptions based on type
            const modalConfig = {
              'spending-trends': {
                title: selectedDrillDown?.week ? `${selectedDrillDown.week} - Spending Trends` : 'Spending Trends',
                description: 'Time-period analysis with milestone context and spending patterns'
              },
              'cost-categories': {
                title: `Cost Categories Analysis - ${temporalDateRange === 'last4' ? 'Last 4 Weeks' : temporalDateRange === 'last8' ? 'Last 8 Weeks' : 'All Weeks'}`,
                description: 'Category breakdown analysis with variance investigation'
              },
              'budget-alerts': {
                title: 'Budget Risk Analysis',
                description: 'Risk details, mitigation actions, and confidence intervals'
              },
              'transactions': {
                title: selectedDrillDown?.week ? `${selectedDrillDown.week} - Transactions` : 'Transaction Details',
                description: 'Detailed transaction history and cost driver breakdowns'
              }
            }
            
            const config = modalConfig[modalType]
            
            return (
              <>
                {/* Unified Modal Header - Fixed */}
                <DialogHeader className="pb-4 border-b flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                          {config.title}
                        </DialogTitle>
                        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                      </div>
                      
                      {/* Timeline Navigation - shown for spending-trends and transactions */}
                      {(modalType === 'spending-trends' || modalType === 'transactions') && (
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2 relative z-10">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigateWeek('prev')}
                            disabled={!canGoPrev}
                            className="h-9 w-9 p-0 hover:bg-white hover:shadow-sm transition-all"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Select value={selectedDrillDown?.week || ''} onValueChange={(value) => {
                            const allData = projectData.weeklySpending || []
                            const rawWeekData = allData.find(d => d.week === value)
                            if (rawWeekData) {
                              // Process the data to match the expected format
                              const currentWeekIndex = 11
                              const weekIndex = allData.findIndex(d => d.week === value)
                              const processedWeekData = {
                                ...rawWeekData,
                                actual: weekIndex <= currentWeekIndex ? rawWeekData.actual : null,
                                projected: weekIndex >= currentWeekIndex ? rawWeekData.projected : null,
                                projectedUpper: weekIndex >= currentWeekIndex ? rawWeekData.projectedUpper : null,
                                projectedLower: weekIndex >= currentWeekIndex ? rawWeekData.projectedLower : null,
                                budgetAllocation: rawWeekData.budget || 0
                              }
                              setSelectedDrillDown({
                                ...processedWeekData,
                                week: value,
                                type: selectedDrillDown?.type || 'line',
                                clickedMetric: selectedDrillDown?.clickedMetric || 'actual'
                              })
                            }
                          }}>
                            <SelectTrigger className="min-w-[100px] h-9 text-sm">
                              <SelectValue placeholder="Select Period" />
                            </SelectTrigger>
                            <SelectContent>
                              {(projectData.weeklySpending || []).map((weekData) => (
                                <SelectItem key={weekData.week} value={weekData.week}>
                                  {weekData.week}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigateWeek('next')}
                            disabled={!canGoNext}
                            className="h-9 w-9 p-0 hover:bg-white hover:shadow-sm transition-all"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDrillDownModal(false)}
                      className="h-10 w-10 p-0 hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <DialogDescription className="text-gray-600 mt-2">
                    {config.description}
                  </DialogDescription>
                </DialogHeader>

                {/* Scrollable Modal Content */}
                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                  <div className="space-y-6">
                {/* Specialized Modal Content */}
                {modalType === 'spending-trends' && (
                  <div className="space-y-6">
                    {/* Top Row: Two Column Layout */}
                    <div className="grid grid-cols-2 gap-8">
                  {/* Column 1: Summary Metrics (Enhanced) */}
                  <div className="col-span-1 space-y-6">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <Target className="h-5 w-5 mr-2 text-blue-600" />
                          Key Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {metrics && (
                          <>
                            {/* Total Spend */}
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-blue-900">Total Spend</span>
                                <span className="text-lg font-bold text-blue-900">£{metrics.totalSpend.toLocaleString()}</span>
                              </div>
                              <div className="text-xs text-blue-700">
                                {metrics.budgetUtilization.toFixed(1)}% of total budget utilized
                              </div>
                            </div>
                            
                            {/* Budget Remaining */}
                            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-green-900">Budget Remaining</span>
                                <span className="text-lg font-bold text-green-900">£{metrics.budgetRemaining.toLocaleString()}</span>
                              </div>
                              <div className="text-xs text-green-700">
                                {(100 - metrics.budgetUtilization).toFixed(1)}% remaining of £45,000 total
                              </div>
                            </div>
                            
                            {/* Variance */}
                            <div className={`p-4 rounded-lg border ${
                              Math.abs(metrics.variance.percentage) < 5 ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200' :
                              metrics.variance.amount < 0 ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' :
                              'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
                            }`}>
                              <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm font-medium ${
                                  Math.abs(metrics.variance.percentage) < 5 ? 'text-amber-900' :
                                  metrics.variance.amount < 0 ? 'text-green-900' : 'text-red-900'
                                }`}>Variance vs Budget</span>
                                <span className={`text-lg font-bold flex items-center ${
                                  Math.abs(metrics.variance.percentage) < 5 ? 'text-amber-900' :
                                  metrics.variance.amount < 0 ? 'text-green-900' : 'text-red-900'
                                }`}>
                                  {metrics.variance.amount < 0 ? <TrendingDown className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1" />}
                                  {metrics.variance.amount < 0 ? '-' : '+'} £{Math.abs(metrics.variance.amount).toLocaleString()}
                                </span>
                              </div>
                              <div className={`text-xs ${
                                Math.abs(metrics.variance.percentage) < 5 ? 'text-amber-700' :
                                metrics.variance.amount < 0 ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {Math.abs(metrics.variance.percentage).toFixed(1)}% {metrics.variance.amount < 0 ? 'under' : 'over'} budget allocation
                              </div>
                            </div>
                            
                            {/* Week-over-Week Change */}
                            {metrics.weekOverWeekChange && (
                              <div className={`p-4 rounded-lg border ${
                                Math.abs(metrics.weekOverWeekChange.percentage) < 10 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200' :
                                metrics.weekOverWeekChange.amount > 0 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200' :
                                'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                              }`}>
                                <div className="flex justify-between items-center mb-2">
                                  <span className={`text-sm font-medium ${
                                    Math.abs(metrics.weekOverWeekChange.percentage) < 10 ? 'text-gray-900' :
                                    metrics.weekOverWeekChange.amount > 0 ? 'text-orange-900' : 'text-blue-900'
                                  }`}>Week-over-Week</span>
                                  <span className={`text-lg font-bold flex items-center ${
                                    Math.abs(metrics.weekOverWeekChange.percentage) < 10 ? 'text-gray-900' :
                                    metrics.weekOverWeekChange.amount > 0 ? 'text-orange-900' : 'text-blue-900'
                                  }`}>
                                    {metrics.weekOverWeekChange.amount > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                    {metrics.weekOverWeekChange.amount > 0 ? '+' : ''}{metrics.weekOverWeekChange.percentage.toFixed(1)}%
                                  </span>
                                </div>
                                <div className={`text-xs ${
                                  Math.abs(metrics.weekOverWeekChange.percentage) < 10 ? 'text-gray-700' :
                                  metrics.weekOverWeekChange.amount > 0 ? 'text-orange-700' : 'text-blue-700'
                                }`}>
                                  {metrics.weekOverWeekChange.amount > 0 ? '+' : ''}£{metrics.weekOverWeekChange.amount.toLocaleString()} vs previous week
                                </div>
                              </div>
                            )}
                            
                            {/* Confidence Intervals */}
                            {metrics.confidenceInterval.upper > 0 && (
                              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                                <div className="text-sm font-medium text-purple-900 mb-2">Projection Confidence</div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-purple-700">Upper Range:</span>
                                    <span className="font-medium text-purple-900">£{metrics.confidenceInterval.upper.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-purple-700">Lower Range:</span>
                                    <span className="font-medium text-purple-900">£{metrics.confidenceInterval.lower.toLocaleString()}</span>
                                  </div>
                                  <div className="text-xs text-slate-600 pt-1">
                                    ±{(((metrics.confidenceInterval.upper - metrics.confidenceInterval.lower) / 2 / metrics.projectedSpend) * 100).toFixed(0)}% confidence range
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Column 2: Enhanced Trend Analysis */}
                  <div className="col-span-1 space-y-6">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-slate-600" />
                          Trend Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Period-over-Period Comparison */}
                          {metrics?.weekOverWeekChange && (
                            <div className={`p-4 rounded-lg border ${
                              Math.abs(metrics.weekOverWeekChange.percentage) < 5 ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200' :
                              metrics.weekOverWeekChange.amount > 0 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200' :
                              'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-semibold ${
                                  Math.abs(metrics.weekOverWeekChange.percentage) < 5 ? 'text-blue-900' :
                                  metrics.weekOverWeekChange.amount > 0 ? 'text-orange-900' : 'text-green-900'
                                }`}>Period Comparison</span>
                                <div className="flex items-center">
                                  {metrics.weekOverWeekChange.amount > 0 ? <TrendingUp className="h-4 w-4 text-orange-600" /> : <TrendingDown className="h-4 w-4 text-green-600" />}
                                  <span className={`ml-1 font-bold text-sm ${
                                    Math.abs(metrics.weekOverWeekChange.percentage) < 5 ? 'text-blue-700' :
                                    metrics.weekOverWeekChange.amount > 0 ? 'text-orange-700' : 'text-green-700'
                                  }`}>
                                    {metrics.weekOverWeekChange.amount > 0 ? '+' : ''}{metrics.weekOverWeekChange.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                              <p className={`text-xs leading-relaxed ${
                                Math.abs(metrics.weekOverWeekChange.percentage) < 5 ? 'text-blue-700' :
                                metrics.weekOverWeekChange.amount > 0 ? 'text-orange-700' : 'text-green-700'
                              }`}>
                                {metrics.weekOverWeekChange.amount > 0 ? 'Spending increased' : 'Spending decreased'} by £{Math.abs(metrics.weekOverWeekChange.amount).toLocaleString()} compared to previous week
                              </p>
                            </div>
                          )}
                          
                          <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-indigo-900">Budget Performance</span>
                              <Target className="h-4 w-4 text-indigo-600" />
                            </div>
                            <p className="text-xs text-indigo-700 leading-relaxed">
                              {metrics?.variance.amount && metrics.variance.amount < 0 ? 
                                `Tracking ${Math.abs(metrics.variance.percentage).toFixed(1)}% under budget allocation with strong cost control` :
                                `Exceeding budget by ${metrics?.variance.percentage.toFixed(1) || '0'}% requiring attention to cost management`
                              }
                            </p>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-teal-900">Milestone Impact</span>
                              <Activity className="h-4 w-4 text-teal-600" />
                            </div>
                            <p className="text-xs text-teal-700 leading-relaxed">
                              Foundation work completion ahead of schedule enabling accelerated equipment mobilization and potential early delivery
                            </p>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-r from-violet-50 to-violet-100 rounded-lg border border-violet-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-violet-900">Forecast Accuracy</span>
                              <BarChart3 className="h-4 w-4 text-violet-600" />
                            </div>
                            <p className="text-xs text-violet-700 leading-relaxed">
                              {metrics?.confidenceInterval.upper && metrics.confidenceInterval.lower ? 
                                `Projection confidence range of ±${(((metrics.confidenceInterval.upper - metrics.confidenceInterval.lower) / 2 / (selectedDrillDown?.projected || 1)) * 100).toFixed(0)}% indicates ${((metrics.confidenceInterval.upper - metrics.confidenceInterval.lower) / 2 / (selectedDrillDown?.projected || 1)) * 100 < 15 ? 'high' : 'moderate'} forecast reliability` :
                                'Historical spending patterns suggest strong forecast reliability with minimal variance'
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                    </div>
                    
                    {/* Full Width Actions Section */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <Target className="h-5 w-5 mr-2 text-green-600" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <Button size="sm" variant="outline" className="justify-start hover:bg-green-50 hover:border-green-200 transition-colors">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Export Data
                          </Button>
                          <Button size="sm" variant="outline" className="justify-start hover:bg-orange-50 hover:border-orange-200 transition-colors">
                            <Target className="h-4 w-4 mr-2" />
                            Adjust Forecast
                          </Button>
                          <Button size="sm" variant="outline" className="justify-start hover:bg-purple-50 hover:border-purple-200 transition-colors">
                            <StickyNote className="h-4 w-4 mr-2" />
                            Add Note
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Week-by-Week Breakdown Cards */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <Activity className="h-5 w-5 mr-2 text-green-600" />
                          Week-by-Week Breakdown
                        </CardTitle>
                        <p className="text-sm text-gray-600">Detailed spending analysis across project timeline</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                          {getAllProjectData().map((weekData, index) => {
                            const currentWeekIndex = 11 // Week 12 is current
                            const isCurrentWeek = index === currentWeekIndex
                            const isPastWeek = index < currentWeekIndex
                            const isFutureWeek = index > currentWeekIndex
                            const weekSpend = weekData.actual || weekData.projected || 0
                            const budgetForWeek = weekData.budget || 0
                            const variance = weekSpend - budgetForWeek
                            const variancePercent = budgetForWeek > 0 ? (variance / budgetForWeek) * 100 : 0
                            
                            return (
                              <div key={weekData.week} 
                                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                                  isCurrentWeek ? 'bg-blue-50 border-blue-200 shadow-md' :
                                  isPastWeek ? 'bg-gray-50 border-gray-200' :
                                  'bg-orange-50 border-orange-200'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <div className="font-semibold text-sm flex items-center">
                                      {weekData.week}
                                      {isCurrentWeek && <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded">Current</span>}
                                      {isPastWeek && <CheckCircle className="ml-2 h-3 w-3 text-green-600" />}
                                      {isFutureWeek && <Clock className="ml-2 h-3 w-3 text-orange-600" />}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {isPastWeek ? 'Actual' : isFutureWeek ? 'Projected' : 'Current'}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-sm">£{weekSpend.toLocaleString()}</div>
                                    <div className={`text-xs ${
                                      Math.abs(variancePercent) < 5 ? 'text-gray-600' :
                                      variancePercent > 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {variance > 0 ? '+' : ''}£{variance.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  {/* Budget vs Actual/Projected Bar */}
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>vs Budget</span>
                                      <span>{Math.abs(variancePercent).toFixed(0)}% {variancePercent > 0 ? 'over' : 'under'}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          variancePercent > 10 ? 'bg-red-500' :
                                          variancePercent > 0 ? 'bg-orange-500' :
                                          variancePercent > -10 ? 'bg-green-500' : 'bg-blue-500'
                                        }`}
                                        style={{ width: `${Math.min(100, Math.max(10, (weekSpend / Math.max(budgetForWeek, weekSpend)) * 100))}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  {/* Key Categories */}
                                  <div className="grid grid-cols-3 gap-1 text-xs">
                                    <div className="text-center p-1 bg-blue-100 rounded">
                                      <div className="font-medium">Materials</div>
                                      <div>£{Math.floor(weekSpend * 0.45).toLocaleString()}</div>
                                    </div>
                                    <div className="text-center p-1 bg-green-100 rounded">
                                      <div className="font-medium">Labor</div>
                                      <div>£{Math.floor(weekSpend * 0.35).toLocaleString()}</div>
                                    </div>
                                    <div className="text-center p-1 bg-orange-100 rounded">
                                      <div className="font-medium">Equipment</div>
                                      <div>£{Math.floor(weekSpend * 0.20).toLocaleString()}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Cost Categories Modal */}
                {modalType === 'cost-categories' && (
                  <div className="space-y-6">
                    {/* Cost Categories Analysis Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Cost Categories Analysis</h3>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            size="sm"
                            variant={temporalViewMode === 'cumulative' ? 'default' : 'ghost'}
                            onClick={() => setTemporalViewMode('cumulative')}
                            className={`text-sm px-4 ${
                              temporalViewMode === 'cumulative' 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            Cumulative
                          </Button>
                          <Button
                            size="sm"
                            variant={temporalViewMode === 'weekly' ? 'default' : 'ghost'}
                            onClick={() => setTemporalViewMode('weekly')}
                            className={`text-sm px-4 ${
                              temporalViewMode === 'weekly' 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            Weekly
                          </Button>
                          <Select value={temporalDateRange} onValueChange={(value: string) => value && setTemporalDateRange(value as 'all' | 'last4' | 'last8')}>
                            <SelectTrigger className="w-36 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="last4">Last 4 Weeks</SelectItem>
                              <SelectItem value="last8">Last 8 Weeks</SelectItem>
                              <SelectItem value="all">All Weeks</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Cost Category Trends Chart */}
                    <Card className="shadow-sm">
                      <CardContent className="p-6">
                        
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={getCostCategoryChartData()} margin={{ top: 20, right: 70, left: 70, bottom: 90 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                              <XAxis 
                                dataKey="week" 
                                tick={{ fontSize: 10 }} 
                                angle={-45}
                                textAnchor="end"
                                height={90}
                                interval={temporalViewMode === 'weekly' && temporalDateRange === 'all' ? 1 : 0}
                              />
                              <YAxis 
                                yAxisId="left"
                                tick={{ fontSize: 11 }}
                                tickFormatter={(value) => {
                                  const absValue = Math.abs(value)
                                  if (absValue >= 1000) return `£${(value/1000).toFixed(1)}k`
                                  return `£${value.toLocaleString()}`
                                }}
                                label={{ value: 'Cost Categories (£)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                domain={[0, temporalViewMode === 'cumulative' ? 50000 : temporalDateRange === 'all' ? 6000 : 4000]}
                              />
                              <YAxis 
                                yAxisId="right"
                                orientation="right"
                                tick={{ fontSize: 11 }}
                                tickFormatter={(value) => {
                                  const absValue = Math.abs(value)
                                  if (absValue >= 1000) return `£${(value/1000).toFixed(1)}k`
                                  return `£${value.toLocaleString()}`
                                }}
                                label={{ value: 'Budget Variance (£)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
                                domain={temporalViewMode === 'cumulative' ? [-5000, 5000] : temporalDateRange === 'all' ? [-1500, 1500] : [-1000, 1000]}
                              />
                              <RechartsTooltip 
                                formatter={(value: any, name: string) => [
                                  `£${Number(value || 0).toLocaleString()}`, 
                                  name.charAt(0).toUpperCase() + name.slice(1)
                                ]}
                                labelFormatter={(label) => `${label}`}
                              />
                              <Legend />
                              <Area 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="materials" 
                                stackId="1"
                                stroke="#10b981" 
                                fill="#86efac"
                                name="Materials"
                              />
                              <Area 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="labour" 
                                stackId="1"
                                stroke="#3b82f6" 
                                fill="#93c5fd"
                                name="Labour"
                              />
                              <Area 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="equipment" 
                                stackId="1"
                                stroke="#f59e0b" 
                                fill="#fcd34d"
                                name="Equipment"
                              />
                              <Area 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="other" 
                                stackId="1"
                                stroke="#8b5cf6" 
                                fill="#c4b5fd"
                                name="Other"
                              />
                              <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="variance" 
                                stroke="#ef4444" 
                                strokeWidth={2} 
                                name="TotalVariance"
                                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4, cursor: 'pointer' }}
                                activeDot={{ 
                                  r: 6, 
                                  cursor: 'pointer', 
                                  onClick: (data: any) => handleVariancePointClick(data.payload, 'Total') 
                                }}
                              />
                              
                              {/* Project Phase Markers */}
                              <ReferenceLine x="Week 4" stroke="#6b7280" strokeWidth={2} strokeDasharray="4 4"
                                label={{ value: "Foundation Complete", position: "topLeft", offset: 10, style: { fill: '#374151', fontWeight: 500, fontSize: 10 } }} />
                              <ReferenceLine x="Week 8" stroke="#6b7280" strokeWidth={2} strokeDasharray="4 4"
                                label={{ value: "Installation Phase", position: "topLeft", offset: 10, style: { fill: '#374151', fontWeight: 500, fontSize: 10 } }} />
                              <ReferenceLine x="Week 16" stroke="#6b7280" strokeWidth={2} strokeDasharray="4 4"
                                label={{ value: "Completion Target", position: "topLeft", offset: 10, style: { fill: '#374151', fontWeight: 500, fontSize: 10 } }} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                        
                      </CardContent>
                    </Card>

                    {/* Actionable Variance Breakdown Cards */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Significant Variances Requiring Action</h3>
                        <div className="text-sm text-gray-600">
                          Showing variances ≥{varianceThreshold}% threshold
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getActionableVarianceBreakdown().map((variance: any, index) => (
                          <Card 
                            key={index} 
                            className={`shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                              variance.variancePercent >= 0 ? 'border-l-red-500' : 'border-l-green-500'
                            }`}
                            onClick={() => handleVariancePointClick(variance, variance.category)}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Header */}
                                <div>
                                  <h4 className="font-semibold text-gray-900">{variance.category} Variance</h4>
                                  <p className="text-sm text-gray-500">{variance.week}</p>
                                </div>
                                
                                {/* Amount and Percentage */}
                                <div className="text-right">
                                  <div className={`text-2xl font-bold ${
                                    variance.variancePercent >= 0 ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    £{Math.abs(variance.varianceAmount).toLocaleString()}
                                  </div>
                                  <div className={`text-sm ${
                                    variance.variancePercent >= 0 ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    ({variance.variancePercent >= 0 ? '+' : ''}{variance.variancePercent.toFixed(1)}% variance)
                                  </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {variance.investigation.rootCause}
                                </p>

                                {/* Quick Action Indicators */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {variance.investigation.suppliers.length} contacts
                                  </div>
                                  <div className="flex items-center text-xs text-blue-600">
                                    <Search className="h-3 w-3 mr-1" />
                                    Click to investigate
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        {getActionableVarianceBreakdown().length === 0 && (
                          <Card className="shadow-sm">
                            <CardContent className="p-6 text-center">
                              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                              <h4 className="text-lg font-medium text-gray-900 mb-2">No Significant Variances</h4>
                              <p className="text-gray-600">
                                All cost categories are within ±{varianceThreshold}% threshold. 
                                Adjust the threshold slider above to see smaller variances.
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>

                    {/* Variance Investigation Popup */}
                    <Dialog open={showVarianceInvestigation} onOpenChange={setShowVarianceInvestigation}>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <Search className="h-5 w-5 mr-2 text-blue-600" />
                            Variance Investigation: {selectedVariancePoint?.category} - {selectedVariancePoint?.week}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {selectedVariancePoint && (
                          <div className="space-y-6">
                            {/* Investigation Summary */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <div className="text-2xl font-bold text-red-600">
                                    {selectedVariancePoint.variancePercent >= 0 ? '+' : ''}{selectedVariancePoint.variancePercent?.toFixed(1)}%
                                  </div>
                                  <div className="text-sm text-gray-600">Variance</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-gray-900">
                                    £{Math.abs(selectedVariancePoint.varianceAmount || 0).toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-600">Impact</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-blue-600">
                                    {selectedVariancePoint.date}
                                  </div>
                                  <div className="text-sm text-gray-600">Date</div>
                                </div>
                              </div>
                            </div>

                            {(() => {
                              const investigation = getVarianceInvestigation(selectedVariancePoint.week, selectedVariancePoint.category)
                              return (
                                <div className="space-y-6">
                                  {/* Root Cause Analysis */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center">
                                        <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                                        Root Cause Analysis
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">What Happened:</h4>
                                          <p className="text-gray-700">{investigation.rootCause}</p>
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">Timeline:</h4>
                                          <p className="text-gray-700">{investigation.timeline}</p>
                                        </div>
                                        {investigation.invoices.length > 0 && (
                                          <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Related Documentation:</h4>
                                            <div className="flex flex-wrap gap-2">
                                              {investigation.invoices.map((invoice: string) => (
                                                <span key={invoice} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                  Invoice #{invoice}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Remediation Actions */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center">
                                        <Wrench className="h-5 w-5 mr-2 text-green-600" />
                                        Immediate Actions Required
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        {investigation.suppliers.map((supplier: any, i: number) => (
                                          <div key={i} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                              <div>
                                                <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                                                <p className="text-sm text-gray-600">{supplier.action}</p>
                                              </div>
                                              <div className="flex space-x-2">
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => window.open(`tel:${supplier.contact}`, '_self')}
                                                >
                                                  <Phone className="h-4 w-4 mr-1" />
                                                  Call
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => navigator.clipboard.writeText(supplier.contact)}
                                                >
                                                  Copy Contact
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Scenario Analysis */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center">
                                        <Target className="h-5 w-5 mr-2 text-purple-600" />
                                        Decision Impact Analysis
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                                          <h4 className="font-medium text-green-900 mb-2 flex items-center">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Take Action Now
                                          </h4>
                                          <p className="text-green-800">{investigation.scenarios.immediate}</p>
                                        </div>
                                        <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                                          <h4 className="font-medium text-red-900 mb-2 flex items-center">
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Delay Decision
                                          </h4>
                                          <p className="text-red-800">{investigation.scenarios.delayed}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button variant="outline" onClick={() => setShowVarianceInvestigation(false)}>
                            Close Investigation
                          </Button>
                          <Button>
                            Export Report
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                
                {/* Budget Alerts Modal */}
                {modalType === 'budget-alerts' && (
                  <div className="space-y-6">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">Risk Analysis & Mitigation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
                            <h4 className="font-semibold text-amber-900 mb-2">Risk Details</h4>
                            <p className="text-sm text-amber-800">Detailed risk assessment and confidence intervals will be displayed here.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Transactions Modal */}
                {modalType === 'transactions' && (
                  <div className="space-y-6">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <h4 className="font-semibold text-blue-900 mb-2">Detailed Transactions</h4>
                            <p className="text-sm text-blue-800">Comprehensive transaction breakdown and cost driver analysis will be shown here.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                  </div>
                </div>
              </>
            )
          })()} 
        </DialogContent>
      </Dialog>

      {/* Professional Investigation Modal */}
      {selectedProfessionalAnalysis && (
        <ProfessionalInvestigationModal
          open={showProfessionalModal}
          onOpenChange={setShowProfessionalModal}
          projectName={projectData.name}
          metrics={selectedProfessionalAnalysis.metrics}
          category={selectedProfessionalAnalysis.category}
          varianceAmount={selectedProfessionalAnalysis.varianceAmount}
          investigationData={selectedProfessionalAnalysis.investigationData}
          onSelectOption={(option) => {
            console.log('Selected remediation option:', option.title)
            setShowProfessionalModal(false)
          }}
          onContactSupplier={(supplier) => {
            console.log('Contacting supplier:', supplier.name)
          }}
        />
      )}
    </MainLayout>
  )
}
