"use client"
import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { SwipeablePanel } from "@/components/swipeable-panel"
import { MiniProjectOverview } from "@/components/mini-project-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OverrideStatusModal } from "@/components/override-status-modal"
import { AnimatedCounter } from "@/components/animated-counter"
import { ActivityTooltip } from "@/components/activity-tooltip"
import { MeetingPrepAssistant } from "@/components/meeting-prep-assistant"
import { toast } from "sonner"
import {
  DollarSign,
  FolderOpen,
  TrendingUp,
  TrendingDown,
  Building,
  Gamepad2,
  Users,
  FileText,
  UserPlus,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  X,
  MessageCircle,
  Calendar,
} from "lucide-react"

export default function DashboardPage() {
  const [showOverrideModal, setShowOverrideModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [showCriticalAlert, setShowCriticalAlert] = useState(false)
  const [showMeetingPrepNotification, setShowMeetingPrepNotification] = useState(false)
  const [meetingPrepData, setMeetingPrepData] = useState<any>(null)
  const [showMeetingPrepModal, setShowMeetingPrepModal] = useState(false)
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Henderson Golf Sim",
      type: "Golf Simulator",
      status: "AMBER" as const,
      budget: 45000,
      spent: 38000,
      progress: 75,
      daysRemaining: 12,
      keyMetric: "6% over budget",
      icon: Gamepad2,
    },
    {
      id: 2,
      name: "Marchmont Historic",
      type: "Heritage Restoration",
      status: "RED" as const,
      budget: 120000,
      spent: 165000,
      progress: 85,
      daysRemaining: -5,
      keyMetric: "37.5% over budget",
      icon: Building,
    },
    {
      id: 3,
      name: "Wentworth Golf Sim",
      type: "Golf Simulator",
      status: "GREEN" as const,
      budget: 65000,
      spent: 22000,
      progress: 40,
      daysRemaining: 28,
      keyMetric: "On track",
      icon: Gamepad2,
    },
    {
      id: 4,
      name: "Tunbridge Restoration",
      type: "Heritage Restoration",
      status: "AMBER" as const,
      budget: 78000,
      spent: 71000,
      progress: 90,
      daysRemaining: 8,
      keyMetric: "9% over budget",
      icon: Building,
    },
    {
      id: 5,
      name: "Ascot Entertainment",
      type: "Golf Simulator",
      status: "GREEN" as const,
      budget: 92000,
      spent: 28000,
      progress: 35,
      daysRemaining: 42,
      keyMetric: "Under budget",
      icon: Gamepad2,
    },
  ])

  const recentActivity = [
    {
      action: "Receipt approved",
      project: "Henderson Golf Sim",
      time: "2 min ago",
      icon: FileText,
      color: "text-blue-600",
      details: "Receipt #INV-2024-0892 for materials cost approved and processed for payment",
      user: "Emily Rodriguez",
      exactTime: "2024-08-27 20:15:23",
      amount: "£2,450",
      status: "Approved",
      nextStep: "Payment scheduled for tomorrow morning"
    },
    {
      action: "Budget alert triggered",
      project: "Marchmont Historic",
      time: "15 min ago",
      icon: AlertTriangle,
      color: "text-amber-600",
      details: "Project has exceeded 80% budget threshold requiring immediate review and approval",
      user: "System Alert",
      exactTime: "2024-08-27 20:02:15",
      amount: "£45,000 over",
      status: "Attention Required",
      nextStep: "Budget revision meeting scheduled"
    },
    {
      action: "Phase completed",
      project: "Wentworth Golf Sim",
      time: "1 hour ago",
      icon: CheckCircle,
      color: "text-emerald-600",
      details: "Installation phase completed successfully with quality inspection passed",
      user: "James Mitchell",
      exactTime: "2024-08-27 19:17:42",
      amount: "£0",
      status: "Completed",
      nextStep: "Final testing and commissioning phase"
    },
    {
      action: "Invoice submitted",
      project: "Tunbridge Restoration",
      time: "2 hours ago",
      icon: FileText,
      color: "text-blue-600",
      details: "Invoice #TUN-2024-156 submitted for heritage restoration materials and specialist labor",
      user: "Sarah Thompson",
      exactTime: "2024-08-27 18:22:11",
      amount: "£8,750",
      status: "Pending Review",
      nextStep: "Awaiting finance team approval"
    },
    {
      action: "Team member assigned",
      project: "Ascot Entertainment",
      time: "3 hours ago",
      icon: UserPlus,
      color: "text-blue-600",
      details: "Senior project manager David Wilson assigned to oversee final delivery phase",
      user: "Emily Rodriguez",
      exactTime: "2024-08-27 17:45:33",
      amount: "£0",
      status: "Active",
      nextStep: "Handover meeting scheduled for Thursday"
    },
    {
      action: "Payment processed",
      project: "Henderson Golf Sim",
      time: "4 hours ago",
      icon: CreditCard,
      color: "text-emerald-600",
      details: "Payment processed for simulator equipment and installation services",
      user: "Finance System",
      exactTime: "2024-08-27 16:58:07",
      amount: "£15,200",
      status: "Completed",
      nextStep: "Equipment delivery confirmed for Friday"
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCriticalAlert(true)
    }, 2000)

    // Listen for meeting prep trigger events from sidebar
    const handleMeetingPrepTrigger = (event: CustomEvent) => {
      console.log('Meeting prep event received:', event.detail)
      setMeetingPrepData(event.detail)
      setShowMeetingPrepNotification(true)
    }

    window.addEventListener('trigger-meeting-prep', handleMeetingPrepTrigger as EventListener)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('trigger-meeting-prep', handleMeetingPrepTrigger as EventListener)
    }
  }, [])

  const handleOverrideStatus = (project: any) => {
    setSelectedProject(project)
    setShowOverrideModal(true)
  }

  const handleOverrideSubmit = (reason: string) => {
    console.log(`Status override for ${selectedProject?.name}: ${reason}`)
    toast.success("Status Override Saved", {
      description: `Override reason recorded for ${selectedProject?.name}`,
    })
  }

  const handleProjectMove = (projectId: number, newStatus: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus as "GREEN" | "AMBER" | "RED" } : p)),
      )
      toast.success("Project Status Updated", {
        description: `${project.name} moved to ${
          newStatus === "GREEN" ? "On Track" : newStatus === "AMBER" ? "At Risk" : "Critical"
        }`,
      })
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Emily. Here's your business overview</p>
          </div>
          <div className="relative">
            {/* Meeting Prep Notification */}
            {showMeetingPrepNotification && (
              <div className="absolute -top-8 right-0 w-96 animate-in slide-in-from-right-2 fade-in duration-300 z-50">
                <div className="bg-blue-50 border border-blue-300 rounded-md shadow-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1 min-w-0">
                      <MessageCircle className="w-4 h-4 text-blue-500 animate-pulse flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-800">{meetingPrepData?.message}</p>
                        <p className="text-xs text-blue-600 mt-1">Hover for preview</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                      <button
                        onClick={() => {
                          setShowMeetingPrepModal(true)
                          setShowMeetingPrepNotification(false)
                        }}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors duration-200"
                      >
                        Prepare Meeting Brief
                      </button>
                      <button
                        onClick={() => setShowMeetingPrepNotification(false)}
                        className="p-1 rounded hover:bg-blue-100 transition-colors group"
                        title="Dismiss notification"
                      >
                        <X className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Urgent Popup - Top Bar Alert */}
            {showCriticalAlert && (
              <div className={`absolute right-0 w-96 animate-in slide-in-from-right-2 fade-in duration-300 z-40 ${
                showMeetingPrepNotification ? 'top-8' : '-top-8'
              }`}>
                <div className="bg-red-50 border border-red-300 rounded-md shadow-lg p-3">
                  {/* Header and Content */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-red-800">Marchmont Historic: £45,000 over budget - requires immediate attention</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                      <button
                        onClick={() => console.log("Navigate to project")}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors duration-200"
                      >
                        View Project
                      </button>
                      <button
                        onClick={() => setShowCriticalAlert(false)}
                        className="p-1 rounded hover:bg-red-100 transition-colors group"
                        title="Dismiss alert"
                      >
                        <X className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border border-primary-900 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium text-gray-600">Total Project Value</CardTitle>
                <DollarSign className="h-3 w-3 text-primary-900" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-lg font-bold text-primary-900">
                  <AnimatedCounter end={487000} prefix="£" />
                </div>
                <p className="text-xs text-gray-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" />
                  +12.5%
                </p>
              </CardContent>
          </Card>

          <Card className="border border-primary-900 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium text-gray-600">Active Projects</CardTitle>
                <FolderOpen className="h-3 w-3 text-primary-900" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-lg font-bold text-primary-900">
                  <AnimatedCounter end={5} />
                </div>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                </div>
              </CardContent>
          </Card>

          <Card className="border border-primary-900 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium text-gray-600">Cost Variance</CardTitle>
                <TrendingDown className="h-3 w-3 text-primary-900" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-lg font-bold text-red-600">
                  <AnimatedCounter end={8.2} suffix="%" prefix="+" />
                </div>
                <p className="text-xs text-gray-500">Above planned</p>
              </CardContent>
          </Card>

          <Card className="border border-primary-900 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium text-gray-600">Team Members</CardTitle>
                <Users className="h-3 w-3 text-primary-900" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-lg font-bold text-primary-900">
                  <AnimatedCounter end={12} />
                </div>
                <p className="text-xs text-gray-500">Across projects</p>
              </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-full">
            <SwipeablePanel
              projects={projects}
              onProjectMove={handleProjectMove}
              onOverrideStatus={handleOverrideStatus}
            />
          </div>

          <div className="col-span-1">
            <Card className="border border-gray-200 bg-white shadow-sm flex flex-col gap-2 h-[550px]">
              <CardHeader className="border-gray-200 mb-0 leading-4 border-b-0 py-1">
                <CardTitle className="text-lg font-bold text-primary-900 mb-0">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1 px-3.5 overflow-y-auto">
                <div className="space-y-1">
                    {recentActivity.map((activity, index) => {
                      const IconComponent = activity.icon
                      return (
                        <ActivityTooltip key={index} activity={activity}>
                          <div
                            className={`py-2 px-2 -mx-2 border-b border-gray-100 last:border-b-0 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm hover:scale-[1.02] ${index === 0 ? "mt-0" : ""}`}
                            onClick={() => console.log(`Navigate to: ${activity.project} - ${activity.action}`)}
                          >
                            <div className="flex items-center space-x-2">
                              <IconComponent className={`w-3 h-3 ${activity.color} transition-colors duration-200`} />
                              <p className="text-sm text-primary-900 font-medium transition-colors duration-200 group-hover:text-primary-800">{activity.action}</p>
                            </div>
                            <p className="text-xs text-gray-600 ml-5 transition-colors duration-200">{activity.project}</p>
                            <span className="text-xs text-gray-500 ml-5 transition-colors duration-200">{activity.time}</span>
                          </div>
                        </ActivityTooltip>
                      )
                    })}
                </div>
              </CardContent>
          </Card>
          </div>
        </div>
      </div>

      <OverrideStatusModal
        open={showOverrideModal}
        onOpenChange={setShowOverrideModal}
        projectName={selectedProject?.name || ""}
        currentStatus={selectedProject?.status || ""}
        onOverride={handleOverrideSubmit}
      />

      <MeetingPrepAssistant
        open={showMeetingPrepModal}
        onOpenChange={setShowMeetingPrepModal}
        projectName={meetingPrepData?.project || ""}
        requester={meetingPrepData?.requester || ""}
      />
    </MainLayout>
  )
}
