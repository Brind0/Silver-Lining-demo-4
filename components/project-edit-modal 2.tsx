"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Calendar, DollarSign, Users, FileText } from "lucide-react"

interface ProjectEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectData: {
    id: number
    name: string
    client: string
    budget: number
    spent: number
    progress: number
    status: string
    startDate: string
    endDate: string
    description: string
    team: Array<{ name: string; role: string }>
  }
  onProjectUpdate: (updates: Record<string, any>) => void
}

export function ProjectEditModal({ 
  open, 
  onOpenChange, 
  projectData, 
  onProjectUpdate 
}: ProjectEditModalProps) {
  const [formData, setFormData] = useState({
    name: projectData.name,
    client: projectData.client,
    budget: projectData.budget.toString(),
    progress: projectData.progress.toString(),
    status: projectData.status,
    startDate: projectData.startDate,
    endDate: projectData.endDate,
    description: projectData.description
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const updates = {
      name: formData.name,
      client: formData.client,
      budget: parseInt(formData.budget),
      progress: parseInt(formData.progress),
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description
    }
    
    onProjectUpdate(updates)
    setIsSaving(false)
    onOpenChange(false)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Edit Project - Manual Mode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Input 
                    value={formData.client}
                    onChange={(e) => updateFormData('client', e.target.value)}
                    placeholder="Enter client name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Project Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Status & Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Status & Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GREEN">On Progress</SelectItem>
                      <SelectItem value="AMBER">At Risk</SelectItem>
                      <SelectItem value="RED">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Progress (%)</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => updateFormData('progress', e.target.value)}
                    placeholder="0-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Budget (£)</Label>
                <Input 
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateFormData('budget', e.target.value)}
                  placeholder="Enter budget amount"
                />
                <p className="text-xs text-muted-foreground">
                  Current spending: £{projectData.spent.toLocaleString()}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input 
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projectData.team.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm font-medium">{member.name}</span>
                    <span className="text-xs text-muted-foreground">{member.role}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Team management features coming soon. Use the Assistant mode for team changes.
              </p>
            </CardContent>
          </Card>
        </div>

        <hr className="border-gray-200" />
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}