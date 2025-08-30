import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Users, Shield, UserCheck, UserX, Mail, Phone, Filter, Search } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Emily Johnson",
    email: "emily@silverlining.com",
    phone: "+44 7700 900123",
    role: "Administrator",
    status: "active",
    lastLogin: "2024-02-15T10:30:00Z",
    joinDate: "2023-01-15",
    projects: 12,
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["full_access"],
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@silverlining.com",
    phone: "+44 7700 900124",
    role: "Project Manager",
    status: "active",
    lastLogin: "2024-02-15T09:15:00Z",
    joinDate: "2023-03-01",
    projects: 8,
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["project_management", "cost_tracking", "team_management"],
  },
  {
    id: 3,
    name: "Sarah Wilson",
    email: "sarah.wilson@silverlining.com",
    phone: "+44 7700 900125",
    role: "Project Manager",
    status: "active",
    lastLogin: "2024-02-14T16:45:00Z",
    joinDate: "2023-04-15",
    projects: 6,
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["project_management", "cost_tracking", "team_management"],
  },
  {
    id: 4,
    name: "Mike Johnson",
    email: "mike.johnson@silverlining.com",
    phone: "+44 7700 900126",
    role: "Worker",
    status: "active",
    lastLogin: "2024-02-15T08:00:00Z",
    joinDate: "2023-06-01",
    projects: 4,
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["task_management", "receipt_submission"],
  },
  {
    id: 5,
    name: "Emma Davis",
    email: "emma.davis@silverlining.com",
    phone: "+44 7700 900127",
    role: "Worker",
    status: "active",
    lastLogin: "2024-02-14T17:30:00Z",
    joinDate: "2023-07-15",
    projects: 3,
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["task_management", "receipt_submission"],
  },
  {
    id: 6,
    name: "Tom Brown",
    email: "tom.brown@silverlining.com",
    phone: "+44 7700 900128",
    role: "Worker",
    status: "inactive",
    lastLogin: "2024-02-10T12:00:00Z",
    joinDate: "2023-09-01",
    projects: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["task_management", "receipt_submission"],
  },
  {
    id: 7,
    name: "David Johnson",
    email: "david@johnsonfamily.com",
    phone: "+44 7700 900129",
    role: "Client",
    status: "active",
    lastLogin: "2024-02-13T14:20:00Z",
    joinDate: "2024-01-15",
    projects: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["project_view"],
  },
]

const roleStats = {
  total: users.length,
  active: users.filter((u) => u.status === "active").length,
  administrators: users.filter((u) => u.role === "Administrator").length,
  projectManagers: users.filter((u) => u.role === "Project Manager").length,
  workers: users.filter((u) => u.role === "Worker").length,
  clients: users.filter((u) => u.role === "Client").length,
}

function getRoleBadge(role: string) {
  switch (role) {
    case "Administrator":
      return <Badge className="bg-purple-100 text-purple-800">Administrator</Badge>
    case "Project Manager":
      return <Badge className="bg-blue-100 text-blue-800">Project Manager</Badge>
    case "Worker":
      return <Badge className="bg-green-100 text-green-800">Worker</Badge>
    case "Client":
      return <Badge className="bg-gray-100 text-gray-800">Client</Badge>
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Inactive
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function UsersPage() {
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage team members, roles, and permissions</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Users</span>
              </div>
              <div className="text-2xl font-bold mt-2">{roleStats.total}</div>
              <div className="text-xs text-muted-foreground">{roleStats.active} active</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Administrators</span>
              </div>
              <div className="text-2xl font-bold mt-2">{roleStats.administrators}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Project Managers</span>
              </div>
              <div className="text-2xl font-bold mt-2">{roleStats.projectManagers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Workers</span>
              </div>
              <div className="text-2xl font-bold mt-2">{roleStats.workers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserX className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Clients</span>
              </div>
              <div className="text-2xl font-bold mt-2">{roleStats.clients}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="font-medium">{user.projects}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Phone className="h-4 w-4" />
                        </Button>
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
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
