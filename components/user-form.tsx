"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User } from "lucide-react"

const roles = [
  {
    value: "Administrator",
    label: "Administrator",
    description: "Full access to all features and settings",
    permissions: ["full_access"],
  },
  {
    value: "Project Manager",
    label: "Project Manager",
    description: "Manage projects, costs, and team members",
    permissions: ["project_management", "cost_tracking", "team_management", "receipt_processing"],
  },
  {
    value: "Worker",
    label: "Worker",
    description: "Access to assigned tasks and receipt submission",
    permissions: ["task_management", "receipt_submission"],
  },
  {
    value: "Client",
    label: "Client",
    description: "View project progress and costs",
    permissions: ["project_view"],
  },
]

const allPermissions = [
  { id: "full_access", label: "Full Access", description: "Complete system access" },
  { id: "project_management", label: "Project Management", description: "Create and manage projects" },
  { id: "cost_tracking", label: "Cost Tracking", description: "View and manage expenses" },
  { id: "team_management", label: "Team Management", description: "Manage team members" },
  { id: "receipt_processing", label: "Receipt Processing", description: "Process and approve receipts" },
  { id: "task_management", label: "Task Management", description: "View and update assigned tasks" },
  { id: "receipt_submission", label: "Receipt Submission", description: "Submit receipts for approval" },
  { id: "project_view", label: "Project View", description: "View project progress and costs" },
]

interface UserFormProps {
  user?: any
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    status: user?.status || "active",
  })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user?.permissions || [])
  const [avatar, setAvatar] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      permissions: selectedPermissions,
      avatar,
    }
    onSubmit?.(data)
  }

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role })
    const selectedRole = roles.find((r) => r.value === role)
    if (selectedRole) {
      setSelectedPermissions(selectedRole.permissions)
    }
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permissionId))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
    }
  }

  const selectedRole = roles.find((r) => r.value === formData.role)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{user ? "Edit User" : "Add New User"}</CardTitle>
        <CardDescription>
          {user
            ? "Update user information and permissions"
            : "Create a new user account with appropriate role and permissions"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={formData.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </span>
                </Button>
              </Label>
              <Input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-xs text-muted-foreground">{role.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole && <p className="text-sm text-muted-foreground">{selectedRole.description}</p>}
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPermissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                    disabled={formData.role === "Administrator" && permission.id === "full_access"}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{user ? "Update User" : "Create User"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
