"use client"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Calendar, Users, DollarSign, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

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
    team: ["John Smith", "Sarah Wilson"],
    phase: "Installation",
    business: "golf-sim",
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
    team: ["Mike Johnson", "Emma Davis", "Tom Brown"],
    phase: "Restoration",
    business: "listed-buildings",
  },
  {
    id: 3,
    name: "Wentworth Golf Sim",
    budget: 65000,
    spent: 22000,
    status: "GREEN",
    statusPhrase: "On track",
    progress: 34,
    client: "Wentworth Club",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    team: ["Alice Cooper", "David Lee"],
    phase: "Planning",
    business: "golf-sim",
  },
  {
    id: 4,
    name: "Tunbridge Restoration",
    budget: 78000,
    spent: 71000,
    status: "AMBER",
    statusPhrase: "Over budget",
    overrunPercentage: 9,
    progress: 91,
    client: "Tunbridge Wells Council",
    startDate: "2023-10-15",
    endDate: "2024-03-31",
    team: ["Robert Taylor", "Lisa Johnson"],
    phase: "Final Touches",
    business: "listed-buildings",
  },
  {
    id: 5,
    name: "Ascot Entertainment",
    budget: 92000,
    spent: 28000,
    status: "GREEN",
    statusPhrase: "All clear",
    progress: 30,
    client: "Ascot Racecourse",
    startDate: "2024-03-01",
    endDate: "2024-08-15",
    team: ["James Wilson", "Kate Brown"],
    phase: "Design",
    business: "golf-sim",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "GREEN":
      return "bg-green-500"
    case "AMBER":
      return "bg-amber-500"
    case "RED":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
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
      return <CheckCircle className="h-4 w-4 text-gray-500" />
  }
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <Badge
                variant={project.status === "RED" ? "destructive" : "secondary"}
                className={
                  project.status === "AMBER"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : project.status === "GREEN"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : ""
                }
              >
                {project.status}
              </Badge>
            </div>
            <CardDescription className="font-medium text-sm">
              {project.statusPhrase}
              {project.overrunPercentage && <span className="ml-2 text-xs">({project.overrunPercentage}% over)</span>}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1">{getStatusIcon(project.status)}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Budget Progress</span>
            <span className="font-medium">
              £{project.spent.toLocaleString()} / £{project.budget.toLocaleString()}
            </span>
          </div>
          <Progress
            value={(project.spent / project.budget) * 100}
            className={`h-2 ${
              project.status === "RED"
                ? "[&>div]:bg-red-500"
                : project.status === "AMBER"
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-green-500"
            }`}
          />
        </div>

        {/* Project Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Project Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Client & Phase */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Client</span>
          <span className="font-medium">{project.client}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Phase</span>
          <span className="font-medium">{project.phase}</span>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Timeline</span>
          </div>
          <span className="font-medium text-xs">
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </span>
        </div>

        {/* Team */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Team</span>
          </div>
          <span className="font-medium">{project.team.length} members</span>
        </div>

        <div className="pt-2">
          <Link href={`/projects/${project.id}`}>
            <div className="w-full px-3 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border-2 border-gray-300 shadow-sm text-center hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center">
              <Eye className="h-3 w-3 mr-2" />
              VIEW PROJECT DETAILS
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProjectsPage() {
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  
  const filteredProjects = selectedBusiness 
    ? projects.filter(p => p.business === selectedBusiness)
    : projects
    
  const greenProjects = filteredProjects.filter((p) => p.status === "GREEN")
  const amberProjects = filteredProjects.filter((p) => p.status === "AMBER")
  const redProjects = filteredProjects.filter((p) => p.status === "RED")
  
  const businesses = [
    {
      id: 'golf-sim',
      name: 'Silver Linings Golf Sim',
      description: 'Premium golf simulators for luxury estates and private clubs',
      icon: 'SG',
      color: 'green',
      projects: projects.filter(p => p.business === 'golf-sim'),
      revenue: '175K'
    },
    {
      id: 'listed-buildings',
      name: 'Silver Linings Listed Buildings',
      description: 'Heritage restoration and conservation for historic properties',
      icon: 'LB',
      color: 'amber',
      projects: projects.filter(p => p.business === 'listed-buildings'),
      revenue: '285K'
    },
    {
      id: 'walpole-properties',
      name: 'Walpole Properties',
      description: 'Premium property development and luxury estate management',
      icon: 'WP',
      color: 'blue',
      projects: projects.filter(p => p.business === 'walpole-properties'),
      revenue: '0'
    }
  ]

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">Luxury property management with RAG status monitoring</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Business Units */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businesses.map((business) => {
            const isActive = selectedBusiness === business.id
            
            return (
              <Card 
                key={business.id}
                className={`hover:shadow-lg transition-all duration-300 cursor-pointer group relative ${
                  isActive 
                    ? 'ring-2 ring-black' 
                    : ''
                }`}
                onClick={() => setSelectedBusiness(isActive ? null : business.id)}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border-2 border-gray-300 shadow-sm">
                    ACTIVE
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{business.icon}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Active Projects</div>
                      <div className="text-2xl font-bold">{business.projects.length}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-700 transition-colors">
                    {business.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {business.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Revenue YTD</span>
                    <span className="font-semibold text-gray-800">£{business.revenue}</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-800 h-2 rounded-full" 
                      style={{width: business.projects.length > 0 ? '70%' : '0%'}}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        

        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-3 mb-6">
            <button 
              onClick={() => setActiveTab("all")}
              className={`flex flex-col items-center p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
                activeTab === "all" 
                  ? "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 shadow-md" 
                  : "bg-gradient-to-br from-white to-gray-50/50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <span className="text-sm font-semibold text-gray-800">All Projects</span>
              </div>
              <span className="text-2xl font-bold text-primary-900">{filteredProjects.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab("red")}
              className={`flex flex-col items-center p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
                activeTab === "red" 
                  ? "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 shadow-md" 
                  : "bg-gradient-to-br from-white to-red-50/30 border-red-100 hover:border-red-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-sm font-semibold text-gray-800">Critical</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{redProjects.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab("amber")}
              className={`flex flex-col items-center p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
                activeTab === "amber" 
                  ? "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 shadow-md" 
                  : "bg-gradient-to-br from-white to-amber-50/30 border-amber-100 hover:border-amber-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-sm font-semibold text-gray-800">At Risk</span>
              </div>
              <span className="text-2xl font-bold text-amber-600">{amberProjects.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab("green")}
              className={`flex flex-col items-center p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
                activeTab === "green" 
                  ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 shadow-md" 
                  : "bg-gradient-to-br from-white to-emerald-50/30 border-emerald-100 hover:border-emerald-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-semibold text-gray-800">On Track</span>
              </div>
              <span className="text-2xl font-bold text-emerald-600">{greenProjects.length}</span>
            </button>
          </div>

          {activeTab === "all" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "red" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {redProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "amber" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {amberProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "green" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {greenProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
