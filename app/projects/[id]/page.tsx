"use client"

import { useState, use } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  Bell,
  User,
  TrendingUp,
  Shield,
  Wrench,
  MessageCircle,
  Package,
  Dot,
  Search,
  ChevronDown,
  Bot,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { TechnicalSpecificationsModal } from "@/components/technical-specifications-modal"
import { DocumentCreationModal } from "@/components/document-creation-modal"
import { AssistantEditModal } from "@/components/assistant-edit-modal"
import { ProjectEditModal } from "@/components/project-edit-modal"

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
    technicalSpecifications: {
      materials: [
        { category: "Flooring", specification: "Commercial-grade synthetic turf", supplier: "TurfTech Pro", quantity: "200 sq ft", unitCost: "£45/sq ft", status: "Approved" },
        { category: "Projection System", specification: "4K Ultra HD Projector - Epson Pro L25000U", supplier: "AV Solutions Ltd", quantity: "1 unit", unitCost: "£12,000", status: "Delivered" },
        { category: "Screen Material", specification: "Impact-resistant projection screen 12x9ft", supplier: "AV Solutions Ltd", quantity: "1 unit", unitCost: "£3,500", status: "Delivered" },
        { category: "Lighting", specification: "LED Track Lighting System - Philips Hue Pro", supplier: "Smart Lighting Co", quantity: "8 units", unitCost: "£150/unit", status: "Installed" },
        { category: "Hitting Mat", specification: "Premium Launch Monitor Compatible Mat", supplier: "Golf Tech Systems", quantity: "2 units", unitCost: "£850/unit", status: "Delivered" },
      ],
      equipment: [
        { category: "Launch Monitor", specification: "TrackMan 4 Golf Simulator", supplier: "TrackMan Golf", quantity: "1 unit", unitCost: "£18,000", status: "Delivered" },
        { category: "Control System", specification: "Integrated iPad Pro Control Station", supplier: "Tech Integration", quantity: "1 unit", unitCost: "£2,200", status: "Installed" },
        { category: "Audio System", specification: "Surround Sound 5.1 System", supplier: "Audio Pro", quantity: "1 system", unitCost: "£1,800", status: "Installed" },
        { category: "Climate Control", specification: "Smart HVAC Integration", supplier: "Climate Solutions", quantity: "1 system", unitCost: "£3,200", status: "In Progress" },
      ],
      safety: [
        { requirement: "Impact Protection", specification: "Safety netting around hitting area", compliance: "BS EN 1263-1:2002", status: "Installed" },
        { requirement: "Electrical Safety", specification: "RCD protection for all circuits", compliance: "BS 7671:2018", status: "Certified" },
        { requirement: "Ventilation", specification: "Minimum 6 air changes per hour", compliance: "Building Regulations Part F", status: "Compliant" },
        { requirement: "Emergency Lighting", specification: "LED emergency exit lighting", compliance: "BS 5266-1:2016", status: "Installed" },
      ],
      testing: [
        { test: "Launch Monitor Calibration", procedure: "Full system calibration with certified golf balls", frequency: "Weekly", lastCompleted: "2024-02-10", nextDue: "2024-02-17", status: "Current" },
        { test: "Projection Alignment", procedure: "Screen alignment and image geometry check", frequency: "Bi-weekly", lastCompleted: "2024-02-08", nextDue: "2024-02-22", status: "Current" },
        { test: "Audio System Check", procedure: "Full frequency response test", frequency: "Monthly", lastCompleted: "2024-02-01", nextDue: "2024-03-01", status: "Due Soon" },
        { test: "Safety Systems Test", procedure: "Emergency procedures and equipment check", frequency: "Monthly", lastCompleted: "2024-01-15", nextDue: "2024-02-15", status: "Overdue" },
      ],
    },
    recentActivity: [
      { 
        type: "status_update", 
        message: "Equipment delivery status changed to 'Delivered'", 
        timestamp: "2024-02-15T10:30:00Z", 
        actor: "Sarah Wilson", 
        priority: "info",
        category: "Equipment"
      },
      { 
        type: "budget_alert", 
        message: "Climate Control equipment cost exceeded budget by £200", 
        timestamp: "2024-02-15T09:15:00Z", 
        actor: "System", 
        priority: "warning",
        category: "Budget"
      },
      { 
        type: "schedule_alert", 
        message: "Safety Systems Test overdue by 2 days", 
        timestamp: "2024-02-15T08:45:00Z", 
        actor: "System", 
        priority: "urgent",
        category: "Testing"
      },
      { 
        type: "team_update", 
        message: "Site preparation completed ahead of schedule", 
        timestamp: "2024-02-14T16:20:00Z", 
        actor: "Mike Johnson", 
        priority: "success",
        category: "Progress"
      },
      { 
        type: "client_communication", 
        message: "Client approved additional LED lighting specifications", 
        timestamp: "2024-02-14T14:10:00Z", 
        actor: "Henderson Estate", 
        priority: "info",
        category: "Client"
      },
      { 
        type: "compliance_notification", 
        message: "Electrical safety inspection scheduled for February 18th", 
        timestamp: "2024-02-13T11:30:00Z", 
        actor: "Building Control", 
        priority: "info",
        category: "Compliance"
      },
    ],
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
    technicalSpecifications: {
      materials: [
        { category: "Stone", specification: "Reclaimed Yorkshire sandstone - Grade A", supplier: "Heritage Stone Co", quantity: "45 tonnes", unitCost: "£185/tonne", status: "Delivered" },
        { category: "Timber", specification: "Seasoned English Oak - FSC Certified", supplier: "Traditional Timber Ltd", quantity: "12 cubic meters", unitCost: "£1,200/m³", status: "On Order" },
        { category: "Mortar", specification: "Lime mortar NHL 2 - Historic England approved", supplier: "Lime Technology", quantity: "500kg", unitCost: "£3.50/kg", status: "Delivered" },
        { category: "Roofing", specification: "Welsh slate - salvaged period appropriate", supplier: "Welsh Slate Heritage", quantity: "2,500 units", unitCost: "£8.50/unit", status: "Delivered" },
        { category: "Windows", specification: "Hardwood casement windows - sash restoration", supplier: "Period Windows Ltd", quantity: "18 units", unitCost: "£850/unit", status: "In Progress" },
      ],
      equipment: [
        { category: "Scaffolding", specification: "Heritage-approved lightweight system", supplier: "Heritage Access", quantity: "Complete system", unitCost: "£15,000", status: "Installed" },
        { category: "Lifting Equipment", specification: "Mobile crane - 25 tonne capacity", supplier: "Crane Services", quantity: "Weekly hire", unitCost: "£2,200/week", status: "Active" },
        { category: "Dehumidifiers", specification: "Industrial dehumidification system", supplier: "Drying Solutions", quantity: "4 units", unitCost: "£450/unit", status: "Installed" },
        { category: "Monitoring", specification: "Environmental monitoring sensors", supplier: "Building Analytics", quantity: "12 sensors", unitCost: "£125/sensor", status: "Installed" },
      ],
      safety: [
        { requirement: "Heritage Protection", specification: "Protective coverings for sensitive areas", compliance: "Historic England Guidelines", status: "In Place" },
        { requirement: "Structural Safety", specification: "Temporary structural support systems", compliance: "BS 5975:2008", status: "Certified" },
        { requirement: "Environmental Controls", specification: "Dust and debris containment", compliance: "HSE Construction Regulations", status: "Compliant" },
        { requirement: "Access Safety", specification: "Fall protection and safe access routes", compliance: "Work at Height Regulations 2005", status: "Compliant" },
      ],
      testing: [
        { test: "Moisture Content Analysis", procedure: "Regular moisture readings in walls and timbers", frequency: "Weekly", lastCompleted: "2024-02-12", nextDue: "2024-02-19", status: "Current" },
        { test: "Structural Movement", procedure: "Crack monitoring and structural assessment", frequency: "Bi-weekly", lastCompleted: "2024-02-05", nextDue: "2024-02-19", status: "Current" },
        { test: "Lime Mortar Cure Test", procedure: "Carbonation testing of lime mortar joints", frequency: "Monthly", lastCompleted: "2024-01-20", nextDue: "2024-02-20", status: "Due Soon" },
        { test: "Heritage Compliance Audit", procedure: "Conservation officer inspection", frequency: "Quarterly", lastCompleted: "2024-01-10", nextDue: "2024-04-10", status: "Scheduled" },
      ],
    },
    recentActivity: [
      { 
        type: "budget_alert", 
        message: "Material costs exceeded budget by £30,000 - Client approval required", 
        timestamp: "2024-02-15T11:45:00Z", 
        actor: "System", 
        priority: "urgent",
        category: "Budget"
      },
      { 
        type: "status_update", 
        message: "Yorkshire sandstone delivery completed successfully", 
        timestamp: "2024-02-15T09:30:00Z", 
        actor: "Tom Brown", 
        priority: "success",
        category: "Materials"
      },
      { 
        type: "compliance_notification", 
        message: "Historic England conservation officer inspection next week", 
        timestamp: "2024-02-14T15:20:00Z", 
        actor: "Historic England", 
        priority: "warning",
        category: "Compliance"
      },
      { 
        type: "team_update", 
        message: "Lime mortar cure testing shows excellent progress", 
        timestamp: "2024-02-14T12:15:00Z", 
        actor: "Emma Davis", 
        priority: "success",
        category: "Testing"
      },
      { 
        type: "schedule_alert", 
        message: "English Oak timber delivery delayed by 5 days", 
        timestamp: "2024-02-13T16:40:00Z", 
        actor: "Traditional Timber Ltd", 
        priority: "warning",
        category: "Materials"
      },
      { 
        type: "client_communication", 
        message: "Marchmont Trust approved additional window restoration work", 
        timestamp: "2024-02-12T14:25:00Z", 
        actor: "Marchmont Trust", 
        priority: "info",
        category: "Client"
      },
    ],
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

function getActivityIcon(type: string, priority: string) {
  const baseClasses = "h-4 w-4"
  const colorClass = 
    priority === "urgent" ? "text-red-500" :
    priority === "warning" ? "text-amber-500" : 
    priority === "success" ? "text-green-500" :
    "text-blue-500"

  const iconClasses = `${baseClasses} ${colorClass}`

  switch (type) {
    case "status_update":
      return <TrendingUp className={iconClasses} />
    case "budget_alert":
      return <DollarSign className={iconClasses} />
    case "schedule_alert":
      return <Clock className={iconClasses} />
    case "team_update":
      return <User className={iconClasses} />
    case "client_communication":
      return <MessageCircle className={iconClasses} />
    case "compliance_notification":
      return <Shield className={iconClasses} />
    default:
      return <Bell className={iconClasses} />
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "urgent":
      return "text-red-600 bg-red-50 border-red-200"
    case "warning":
      return "text-amber-600 bg-amber-50 border-amber-200"
    case "success":
      return "text-green-600 bg-green-50 border-green-200"
    case "info":
    default:
      return "text-blue-600 bg-blue-50 border-blue-200"
  }
}

function getTimeGroup(timestamp: string) {
  const now = new Date()
  const activityDate = new Date(timestamp)
  const diffInHours = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return "Today"
  } else if (diffInHours < 48) {
    return "Yesterday"
  } else if (diffInHours < 168) { // 7 days
    return "This Week"
  } else {
    return "Earlier"
  }
}

function formatTimeAgo(timestamp: string) {
  const now = new Date()
  const activityDate = new Date(timestamp)
  const diffInMinutes = (now.getTime() - activityDate.getTime()) / (1000 * 60)
  
  if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m ago`
  } else if (diffInMinutes < 1440) { // 24 hours
    return `${Math.floor(diffInMinutes / 60)}h ago`
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const projectData = getProjectData(id)
  const [activeTab, setActiveTab] = useState("overview")
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAssistantModal, setShowAssistantModal] = useState(false)
  const [createdDocuments, setCreatedDocuments] = useState<Array<{name: string, type: string, uploadDate: string}>>([])

  // Handle document creation
  const handleDocumentCreated = (document: { name: string; type: string; content?: string }) => {
    const newDoc = {
      name: document.name,
      type: document.type,
      uploadDate: new Date().toISOString()
    }
    setCreatedDocuments(prev => [newDoc, ...prev])
  }

  // Handle project updates
  const handleProjectUpdate = (updates: Record<string, any>) => {
    // In a real app, this would make an API call to update the database
    console.log('Project updates:', updates)
    // For demo purposes, we would merge these updates with the project data
    // The UI would re-render with the new values
  }
  
  // Combine documents and photos for searching
  const allFiles = [
    ...projectData.documents.map(doc => ({ ...doc, type: 'document' as const })),
    ...projectData.photos.map(photo => ({ ...photo, type: 'photo' as const })),
    ...createdDocuments.map(doc => ({ ...doc, type: 'document' as const }))
  ]
  
  // Filter files based on search term
  const filteredFiles = allFiles.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              {getStatusText(projectData.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manual Edit
                  <span className="ml-auto text-xs text-muted-foreground">Traditional form</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAssistantModal(true)}>
                  <Bot className="h-4 w-4 mr-2" />
                  Work with Assistant
                  <span className="ml-auto text-xs text-muted-foreground">AI-powered</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

          <TabsContent value="overview" className="space-y-6">
            {/* Top Row: Project Essentials */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
              {/* Left Column: Project Description (Now Larger) */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{projectData.description}</p>
                </CardContent>
              </Card>

              {/* Right Column: Technical Specifications + Project Phases */}
              <div className="flex flex-col space-y-4">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-2 hover:border-solid" 
                  onClick={() => setShowTechnicalSpecs(true)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Technical Specifications
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click to view comprehensive technical specifications, materials, equipment requirements, and compliance standards.
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex-1">
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
            </div>

            {/* Bottom Row: Full-width Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="space-y-3">
                    {projectData.recentActivity.slice(0, 8).map((activity, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-3 py-2 px-2 rounded hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="flex-shrink-0">
                              {getActivityIcon(activity.type, activity.priority)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {activity.message}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="hidden sm:inline">{activity.actor}</span>
                              <span>{formatTimeAgo(activity.timestamp)}</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-medium">{activity.message}</p>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">By:</span>
                                <span>{activity.actor}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Category:</span>
                                <span>{activity.category}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Time:</span>
                                <span>{new Date(activity.timestamp).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Priority:</span>
                                <span className="capitalize">{activity.priority}</span>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
                {projectData.recentActivity.length > 8 && (
                  <Button variant="ghost" size="sm" className="w-full text-xs mt-4">
                    View All Activity
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card
              className={`border-2 ${
                projectData.status === "RED"
                  ? "border-red-500"
                  : projectData.status === "AMBER"
                    ? "border-amber-500"
                    : "border-green-500"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Emily's Tasks - {projectData.name}</CardTitle>
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
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectData.status === "AMBER" && (
                  <Alert className="border-amber-300 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <div className="space-y-2">
                        <p className="font-medium">Action Required:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Approve £2,500 receipt for equipment</li>
                          <li>• Review {projectData.overrunPercentage}% budget variance</li>
                          <li>• Schedule supplier meeting for delayed materials</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {projectData.status === "RED" && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Critical Issues:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Budget overrun: £{(projectData.spent - projectData.budget).toLocaleString()}</li>
                          <li>• Immediate cost control measures required</li>
                          <li>• Client notification and approval needed</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Take Action
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Review
                  </Button>
                </div>
              </CardContent>
            </Card>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Breakdown</CardTitle>
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
            
            {/* Search and Create Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search for documents or photos..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setShowCreateModal(true)}>
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Results or File Lists */}
            {searchTerm.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredFiles.length > 0 ? (
                    <div className="space-y-2">
                      {filteredFiles.map((file, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                          {file.type === 'document' ? (
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.type === 'document' ? 'Document' : 'Photo'} • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        No documents or photos found matching "{searchTerm}"
                      </p>
                      <Button onClick={() => setShowCreateModal(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Document
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[...createdDocuments, ...projectData.documents].map((doc, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {index < createdDocuments.length ? (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Created {new Date(doc.uploadDate).toLocaleDateString()}
                              </span>
                            ) : (
                              <>Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</>
                            )}
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
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TechnicalSpecificationsModal
        open={showTechnicalSpecs}
        onOpenChange={setShowTechnicalSpecs}
        projectName={projectData.name}
        technicalSpecifications={projectData.technicalSpecifications}
      />

      <DocumentCreationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onDocumentCreated={handleDocumentCreated}
        projectContext={{
          name: projectData.name,
          client: projectData.client,
          budget: projectData.budget,
          description: projectData.description,
          phases: projectData.phases,
          team: projectData.team
        }}
      />

      <ProjectEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onProjectUpdate={handleProjectUpdate}
        projectData={{
          id: projectData.id,
          name: projectData.name,
          client: projectData.client,
          budget: projectData.budget,
          spent: projectData.spent,
          progress: projectData.progress,
          status: projectData.status,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          description: projectData.description,
          team: projectData.team
        }}
      />

      <AssistantEditModal
        open={showAssistantModal}
        onOpenChange={setShowAssistantModal}
        onProjectUpdate={handleProjectUpdate}
        projectData={{
          id: projectData.id,
          name: projectData.name,
          client: projectData.client,
          budget: projectData.budget,
          spent: projectData.spent,
          progress: projectData.progress,
          status: projectData.status,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          team: projectData.team
        }}
      />
    </MainLayout>
  )
}
