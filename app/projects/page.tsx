"use client"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Eye, Calendar, Users, DollarSign, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
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
    team: ["John Smith", "Sarah Wilson"],
    phase: "Installation",
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

function getStatusBorderClass(status: string) {
  switch (status) {
    case "GREEN":
      return "border-l-green-500"
    case "AMBER":
      return "border-l-amber-500"
    case "RED":
      return "border-l-red-500"
    default:
      return "border-l-gray-500"
  }
}

function getStatusBackgroundClass(status: string) {
  switch (status) {
    case "GREEN":
      return "bg-green-50"
    case "AMBER":
      return "bg-amber-50"
    case "RED":
      return "bg-red-50"
    default:
      return "bg-gray-50"
  }
}

function getStatusBadgeText(status: string) {
  switch (status) {
    case "GREEN":
      return "On Track"
    case "AMBER":
      return "At Risk"
    case "RED":
      return "Critical"
    default:
      return status
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "GREEN":
      return "bg-green-100 text-green-800"
    case "AMBER":
      return "bg-amber-100 text-amber-800"
    case "RED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
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
    <Card className={`hover:shadow-md transition-shadow border-l-4 ${getStatusBorderClass(project.status)} ${getStatusBackgroundClass(project.status)}`}>
      <CardHeader className="pb-3 relative">
        <div className="absolute top-4 right-4">
          <Badge className={`text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
            {getStatusBadgeText(project.status)}
          </Badge>
        </div>
        <div className="pr-20">
          <div className="space-y-2">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="font-medium text-sm">
              {project.statusPhrase}
              {project.overrunPercentage && <span className="ml-2 text-xs">({project.overrunPercentage}% over)</span>}
            </CardDescription>
          </div>
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
          <Progress
            value={project.progress}
            className={`h-2 ${
              project.status === "RED"
                ? "[&>div]:bg-red-500"
                : project.status === "AMBER"
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-green-500"
            }`}
          />
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
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Project Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProjectsPage() {
  const greenProjects = projects.filter((p) => p.status === "GREEN")
  const amberProjects = projects.filter((p) => p.status === "AMBER")
  const redProjects = projects.filter((p) => p.status === "RED")

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

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">On Track</span>
              </div>
              <div className="text-2xl font-bold mt-2">{greenProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium">At Risk</span>
              </div>
              <div className="text-2xl font-bold mt-2">{amberProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium">Critical</span>
              </div>
              <div className="text-2xl font-bold mt-2">{redProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Budget</span>
              </div>
              <div className="text-2xl font-bold mt-2">£400K</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="green" className="text-green-700">
              On Track ({greenProjects.length})
            </TabsTrigger>
            <TabsTrigger value="amber" className="text-amber-700">
              At Risk ({amberProjects.length})
            </TabsTrigger>
            <TabsTrigger value="red" className="text-red-700">
              Critical ({redProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="green" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {greenProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="amber" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {amberProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="red" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {redProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
