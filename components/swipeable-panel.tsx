"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, Calendar, DollarSign, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react"
import { MiniProjectOverview } from "./mini-project-overview"

interface Project {
  id: number
  name: string
  type: string
  status: "GREEN" | "AMBER" | "RED"
  budget: number
  spent: number
  progress: number
  daysRemaining: number
  keyMetric: string
  icon: any
}

interface SwipeablePanelProps {
  projects: Project[]
  onProjectMove: (projectId: number, newStatus: string) => void
  onOverrideStatus: (project: Project) => void
}

export const SwipeablePanel: React.FC<SwipeablePanelProps> = ({ projects, onProjectMove, onOverrideStatus }) => {
  const [currentPanel, setCurrentPanel] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [draggedProject, setDraggedProject] = useState<Project | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const SWIPE_THRESHOLD = 50

  const onTrackProjects = projects.filter((p) => p.status === "GREEN")
  const atRiskProjects = projects.filter((p) => p.status === "AMBER")
  const criticalProjects = projects.filter((p) => p.status === "RED")

  const upcomingDeadlines = [
    { project: "Henderson Golf Sim", task: "Final inspection", date: "Dec 15", daysLeft: 3, priority: "high" },
    { project: "Tunbridge Restoration", task: "Heritage approval", date: "Dec 17", daysLeft: 5, priority: "medium" },
    { project: "Wentworth Golf Sim", task: "Equipment delivery", date: "Dec 20", daysLeft: 8, priority: "low" },
    { project: "Ascot Entertainment", task: "Site preparation", date: "Dec 24", daysLeft: 12, priority: "low" },
    { project: "Marchmont Historic", task: "Budget review", date: "Dec 13", daysLeft: 1, priority: "critical" },
  ]

  const quarterlyFinancials = {
    portfolioValue: 2450000,
    potentialIncome: {
      monthly: 145000,
      quarterly: 435000
    },
    currentIncome: {
      monthly: 128000,
      realizationRate: 88.3
    },
    monthlyExpenses: {
      properties: 35000,
      payroll: 42000,
      office: 18000,
      equipment: 12000,
      total: 107000
    },
    labourCosts: {
      monthly: 28000,
      breakdown: [
        { project: "Henderson Golf Sim", cost: 8500 },
        { project: "Marchmont Historic", cost: 12000 },
        { project: "Tunbridge Restoration", cost: 4500 },
        { project: "Wentworth Golf Sim", cost: 3000 }
      ]
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > SWIPE_THRESHOLD
    const isRightSwipe = distance < -SWIPE_THRESHOLD

    if (isLeftSwipe && currentPanel < 2) {
      setCurrentPanel((prev) => prev + 1)
    }
    if (isRightSwipe && currentPanel > 0) {
      setCurrentPanel((prev) => prev - 1)
    }
  }

  const handleDragStart = (e: React.DragEvent, project: Project) => {
    setDraggedProject(project)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedProject && draggedProject.status !== newStatus) {
      onProjectMove(draggedProject.id, newStatus)
    }
    setDraggedProject(null)
  }

  // Executive Tasks for enhanced Panel 1
  const [executiveTasks, setExecutiveTasks] = useState({
    critical: [
      { id: 'c1', title: 'Budget Review Overdue', project: 'Marchmont Historic', urgency: '5 days overdue', type: 'financial' },
      { id: 'c2', title: 'Client Approval Pending', project: 'Henderson Golf Sim', urgency: 'Due today', type: 'approval' },
      { id: 'c3', title: 'Compliance Deadline', project: 'Multiple Projects', urgency: '2 days left', type: 'regulatory' }
    ],
    atRisk: [
      { id: 'a1', title: 'Equipment Delivery Delayed', project: 'Wentworth Golf Sim', urgency: '1 week behind', type: 'logistics' },
      { id: 'a2', title: 'Heritage Approval Pending', project: 'Tunbridge Restoration', urgency: '3 days remaining', type: 'approval' },
      { id: 'a3', title: 'Resource Shortage Risk', project: 'Ascot Entertainment', urgency: 'Monitor closely', type: 'resource' },
      { id: 'a4', title: 'Permit Renewal Due', project: 'Marchmont Historic', urgency: '1 week left', type: 'regulatory' }
    ],
    onTrack: [
      { id: 'o1', title: 'Site Preparation Scheduled', project: 'Ascot Entertainment', urgency: 'On schedule', type: 'execution' },
      { id: 'o2', title: 'Final Inspection Planned', project: 'Henderson Golf Sim', urgency: 'Next week', type: 'quality' },
      { id: 'o3', title: 'Monthly Reports Submitted', project: 'All Projects', urgency: 'Completed', type: 'reporting' },
      { id: 'o4', title: 'Team Assignments Complete', project: 'Wentworth Golf Sim', urgency: 'On track', type: 'resource' }
    ]
  })

  const [isDragging, setIsDragging] = useState(false)
  const [draggedTask, setDraggedTask] = useState<any>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent, task: any, sourceColumn: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setDraggedTask({ ...task, sourceColumn })
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = (e: React.MouseEvent, targetColumn?: string) => {
    if (isDragging && draggedTask) {
      if (targetColumn && draggedTask.sourceColumn !== targetColumn) {
        const sourceColumn = draggedTask.sourceColumn as keyof typeof executiveTasks
        const targetCol = targetColumn as keyof typeof executiveTasks
        
        const taskToMove = {
          id: draggedTask.id,
          title: draggedTask.title,
          project: draggedTask.project,
          urgency: draggedTask.urgency,
          type: draggedTask.type
        }
        
        setExecutiveTasks(prev => ({
          ...prev,
          [sourceColumn]: prev[sourceColumn].filter(task => task.id !== draggedTask.id),
          [targetCol]: [...prev[targetCol], taskToMove]
        }))
      }
    }
    setIsDragging(false)
    setDraggedTask(null)
  }

  const TaskCard = ({ task, column }: { task: any, column: string }) => (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-move transition-all duration-200 hover:shadow-md hover:border-gray-300 group select-none ${
        isDragging && draggedTask?.id === task.id ? 'opacity-50' : ''
      }`}
      onMouseDown={(e) => handleMouseDown(e, task, column)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">{task.title}</h4>
          <p className="text-xs text-gray-600 mb-1">{task.project}</p>
          <p className="text-xs text-gray-500">{task.urgency}</p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="19" cy="12" r="2"/>
              <circle cx="5" cy="5" r="2"/>
              <circle cx="12" cy="5" r="2"/>
              <circle cx="19" cy="5" r="2"/>
              <circle cx="5" cy="19" r="2"/>
              <circle cx="12" cy="19" r="2"/>
              <circle cx="19" cy="19" r="2"/>
            </svg>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            column === 'critical' ? 'bg-red-500' : 
            column === 'atRisk' ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
        </div>
      </div>
    </div>
  )

  const ProjectCard = ({ project }: { project: Project }) => {
    const IconComponent = project.icon
    return (
      <Card
        className="bg-white border border-gray-200 cursor-move transition-all duration-200 hover:shadow-sm"
        draggable
        onDragStart={(e) => handleDragStart(e, project)}
        onClick={() => onOverrideStatus(project)}
      >
        <CardContent className="p-2">
          <div className="flex items-center space-x-2 mb-1">
            <IconComponent className="h-3 w-3 text-primary-700" />
            <h4 className="font-medium text-primary-900 text-xs truncate">{project.name}</h4>
          </div>
          <p className="text-xs text-gray-500 mb-1">{project.keyMetric}</p>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">£{project.spent.toLocaleString()}</span>
            <span className={project.daysRemaining < 0 ? "text-red-600" : "text-gray-500"}>
              {project.daysRemaining < 0 ? `${Math.abs(project.daysRemaining)}d over` : `${project.daysRemaining}d`}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ProjectHealthPanel = () => (
    <div 
      className="h-full p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={() => handleMouseUp({} as React.MouseEvent)}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary-900 mb-2 flex items-center">
          <div className="flex space-x-2 mr-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          Executive Overview
        </h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3 h-[420px] relative">
        {/* Critical Column */}
        <div 
          className="bg-red-50/50 rounded-lg p-3 border border-red-100 min-h-[400px]"
          onMouseUp={(e) => handleMouseUp(e, 'critical')}
        >
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            <h4 className="text-sm font-semibold text-gray-800">Critical</h4>
            <span className="ml-auto text-xs text-gray-500">{executiveTasks.critical.length}</span>
          </div>
          <div className="space-y-1 overflow-y-auto h-[350px]">
            {executiveTasks.critical.map((task) => (
              <TaskCard key={task.id} task={task} column="critical" />
            ))}
          </div>
        </div>

        {/* At Risk Column */}
        <div 
          className="bg-amber-50/50 rounded-lg p-3 border border-amber-100 min-h-[400px]"
          onMouseUp={(e) => handleMouseUp(e, 'atRisk')}
        >
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
            <h4 className="text-sm font-semibold text-gray-800">At Risk</h4>
            <span className="ml-auto text-xs text-gray-500">{executiveTasks.atRisk.length}</span>
          </div>
          <div className="space-y-1 overflow-y-auto h-[350px]">
            {executiveTasks.atRisk.map((task) => (
              <TaskCard key={task.id} task={task} column="atRisk" />
            ))}
          </div>
        </div>

        {/* On Track Column */}
        <div 
          className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 min-h-[400px]"
          onMouseUp={(e) => handleMouseUp(e, 'onTrack')}
        >
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
            <h4 className="text-sm font-semibold text-gray-800">On Track</h4>
            <span className="ml-auto text-xs text-gray-500">{executiveTasks.onTrack.length}</span>
          </div>
          <div className="space-y-1 overflow-y-auto h-[350px]">
            {executiveTasks.onTrack.map((task) => (
              <TaskCard key={task.id} task={task} column="onTrack" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const UpcomingDeadlinesPanel = () => (
    <div className="h-full p-4">
      <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-primary-700" />
        Upcoming Deadlines
      </h3>
      <div className="space-y-3 overflow-y-auto h-[calc(100%-4rem)]">
        {upcomingDeadlines.map((deadline, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <div className="flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full ${
                  deadline.priority === "critical"
                    ? "bg-red-500"
                    : deadline.priority === "high"
                      ? "bg-amber-500"
                      : deadline.priority === "medium"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary-900 truncate">{deadline.task}</p>
              <p className="text-xs text-gray-600">{deadline.project}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-gray-500">{deadline.date}</p>
              <p
                className={`text-xs font-medium ${
                  deadline.priority === "critical"
                    ? "text-red-700"
                    : deadline.priority === "high"
                      ? "text-amber-700"
                      : "text-gray-600"
                }`}
              >
                {deadline.daysLeft}d
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const FinancialOverviewPanel = () => (
    <div className="h-full p-6">
      <h3 className="text-lg font-semibold text-primary-900 mb-3 flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-primary-700" />
        Current Earnings Forecast
      </h3>
      
      <div className="space-y-3">
        {/* Monthly Overview */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 p-3 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-sm font-semibold text-primary-900 mb-3">Monthly Overview</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded bg-emerald-50/50 border border-emerald-100">
              <span className="text-sm font-medium text-gray-700">Current Income</span>
              <span className="text-base font-bold text-emerald-700">£{quarterlyFinancials.currentIncome.monthly.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-red-50/50 border border-red-100">
              <span className="text-sm font-medium text-gray-700">Total Expenses</span>
              <span className="text-base font-bold text-red-700">£{quarterlyFinancials.monthlyExpenses.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
              <span className="text-sm font-bold text-white">Net Profit</span>
              <span className="text-lg font-bold text-white">
                £{(quarterlyFinancials.currentIncome.monthly - quarterlyFinancials.monthlyExpenses.total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 p-3 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-sm font-semibold text-primary-900 mb-3">Monthly Expenses Breakdown</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between items-center py-1.5 px-2 rounded bg-gray-50 border border-gray-100">
              <span className="text-xs font-medium text-gray-700">Properties</span>
              <span className="text-sm font-bold text-primary-900">£{quarterlyFinancials.monthlyExpenses.properties.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 px-2 rounded bg-gray-50 border border-gray-100">
              <span className="text-xs font-medium text-gray-700">Payroll</span>
              <span className="text-sm font-bold text-primary-900">£{quarterlyFinancials.monthlyExpenses.payroll.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 px-2 rounded bg-gray-50 border border-gray-100">
              <span className="text-xs font-medium text-gray-700">Office</span>
              <span className="text-sm font-bold text-primary-900">£{quarterlyFinancials.monthlyExpenses.office.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 px-2 rounded bg-gray-50 border border-gray-100">
              <span className="text-xs font-medium text-gray-700">Equipment</span>
              <span className="text-sm font-bold text-primary-900">£{quarterlyFinancials.monthlyExpenses.equipment.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const panels = [
    { id: "executive", title: "Executive Overview", content: <ProjectHealthPanel /> },
    { id: "deadlines", title: "Upcoming Deadlines", content: <UpcomingDeadlinesPanel /> },
    { id: "financial", title: "Current Earnings Forecast", content: <FinancialOverviewPanel /> },
  ]

  return (
    <div 
      className="relative h-[550px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove} 
      onTouchEnd={handleTouchEnd}
      ref={panelRef}
      title={`${panels[currentPanel].title} view - Swipe or click arrows to navigate`}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${currentPanel * 100}%)`,
        }}
      >
        {panels.map((panel, index) => (
          <div key={panel.id} className="min-w-full h-full">
            {panel.content}
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      {currentPanel > 0 && (
        <button
          onClick={() => setCurrentPanel(prev => prev - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white/90 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          title="Previous panel"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>
      )}

      {/* Right Arrow */}
      {currentPanel < panels.length - 1 && (
        <button
          onClick={() => setCurrentPanel(prev => prev + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white/90 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          title="Next panel"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
      )}

      {/* Panel Navigation Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {panels.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPanel(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentPanel ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
            }`}
            title={panels[index].title}
          />
        ))}
      </div>
    </div>
  )
}
