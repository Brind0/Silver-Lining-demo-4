"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  FileText, 
  Package, 
  Settings, 
  Shield, 
  TestTube,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  Truck
} from "lucide-react"

interface TechnicalSpecificationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  technicalSpecifications: {
    materials: Array<{
      category: string
      specification: string
      supplier: string
      quantity: string
      unitCost: string
      status: string
    }>
    equipment: Array<{
      category: string
      specification: string
      supplier: string
      quantity: string
      unitCost: string
      status: string
    }>
    safety: Array<{
      requirement: string
      specification: string
      compliance: string
      status: string
    }>
    testing: Array<{
      test: string
      procedure: string
      frequency: string
      lastCompleted: string
      nextDue: string
      status: string
    }>
  }
}

// Status options for different categories
const STATUS_OPTIONS = {
  materials: [
    "Pending",
    "On Order", 
    "Delivered",
    "Installed",
    "Approved"
  ],
  equipment: [
    "Pending",
    "On Order",
    "Delivered", 
    "Installed",
    "Active",
    "In Progress"
  ],
  safety: [
    "Pending",
    "In Progress",
    "In Place",
    "Compliant",
    "Certified"
  ],
  testing: [
    "Pending",
    "Scheduled", 
    "In Progress",
    "Current",
    "Due Soon",
    "Overdue",
    "Completed"
  ]
} as const

function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "delivered":
    case "installed":
    case "certified":
    case "compliant":
    case "current":
    case "approved":
      return "default"
    case "in progress":
    case "active":
    case "scheduled":
    case "due soon":
      return "secondary"
    case "on order":
    case "pending":
      return "outline"
    case "overdue":
    case "critical":
      return "destructive"
    default:
      return "secondary"
  }
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "delivered":
    case "installed":
    case "certified":
    case "compliant":
    case "current":
    case "approved":
      return <CheckCircle className="h-3 w-3 text-green-500" />
    case "in progress":
    case "active":
    case "scheduled":
    case "in place":
      return <Clock className="h-3 w-3 text-blue-500" />
    case "on order":
    case "pending":
      return <Truck className="h-3 w-3 text-amber-500" />
    case "overdue":
    case "critical":
    case "due soon":
      return <AlertTriangle className="h-3 w-3 text-red-500" />
    default:
      return <Clock className="h-3 w-3 text-gray-500" />
  }
}

// Interactive Status Badge Component
interface InteractiveStatusBadgeProps {
  status: string
  category: 'materials' | 'equipment' | 'safety' | 'testing'
  onStatusChange: (newStatus: string) => void
  isLoading?: boolean
}

function InteractiveStatusBadge({ 
  status, 
  category, 
  onStatusChange, 
  isLoading = false 
}: InteractiveStatusBadgeProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  const handleStatusChange = (newStatus: string) => {
    onStatusChange(newStatus)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Select
        value={status}
        onValueChange={handleStatusChange}
        onOpenChange={(open) => !open && setIsEditing(false)}
      >
        <SelectTrigger className="w-fit h-6 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS[category].map((option) => (
            <SelectItem key={option} value={option} className="text-xs">
              <div className="flex items-center gap-1">
                {getStatusIcon(option)}
                {option}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Badge 
      variant={getStatusBadgeVariant(status)}
      className="flex items-center gap-1 w-fit cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => setIsEditing(true)}
    >
      {isLoading ? (
        <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
      ) : (
        getStatusIcon(status)
      )}
      {status}
    </Badge>
  )
}

export function TechnicalSpecificationsModal({
  open,
  onOpenChange,
  projectName,
  technicalSpecifications,
}: TechnicalSpecificationsModalProps) {
  const { toast } = useToast()
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  
  const handleStatusChange = async (
    category: 'materials' | 'equipment' | 'safety' | 'testing',
    index: number,
    newStatus: string
  ) => {
    const itemKey = `${category}-${index}`
    
    // Set loading state
    setLoadingStates(prev => ({ ...prev, [itemKey]: true }))
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Update the status in the data
      // Note: In a real app, this would update the backend and trigger a re-fetch
      const currentItem = technicalSpecifications[category][index]
      
      // Show success toast
      toast({
        title: "Status Updated",
        description: `${category === 'materials' ? 'Material' : 
                      category === 'equipment' ? 'Equipment' :
                      category === 'safety' ? 'Safety requirement' :
                      'Test'} status changed to "${newStatus}"`,
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Update Failed", 
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [itemKey]: false }))
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-full h-[95vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center text-xl">
            <FileText className="h-5 w-5 mr-2" />
            Technical Specifications - {projectName}
          </DialogTitle>
          <DialogDescription>
            Comprehensive technical specifications, materials, equipment, safety requirements, and testing procedures
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="materials" className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="materials" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Materials
                </TabsTrigger>
                <TabsTrigger value="equipment" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Equipment
                </TabsTrigger>
                <TabsTrigger value="safety" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Safety
                </TabsTrigger>
                <TabsTrigger value="testing" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Testing
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 px-6 pb-4">
              <TabsContent value="materials" className="h-full mt-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Materials Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(95vh-250px)]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[15%]">Category</TableHead>
                            <TableHead className="w-[35%]">Specification</TableHead>
                            <TableHead className="w-[20%]">Supplier</TableHead>
                            <TableHead className="w-[12%]">Quantity</TableHead>
                            <TableHead className="w-[12%]">Unit Cost</TableHead>
                            <TableHead className="w-[6%]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {technicalSpecifications.materials.map((material, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{material.category}</TableCell>
                              <TableCell className="max-w-md">
                                <div className="text-sm">{material.specification}</div>
                              </TableCell>
                              <TableCell>{material.supplier}</TableCell>
                              <TableCell>{material.quantity}</TableCell>
                              <TableCell className="font-mono">{material.unitCost}</TableCell>
                              <TableCell>
                                <InteractiveStatusBadge
                                  status={material.status}
                                  category="materials"
                                  onStatusChange={(newStatus) => handleStatusChange('materials', index, newStatus)}
                                  isLoading={loadingStates[`materials-${index}`]}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="equipment" className="h-full mt-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Equipment Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(95vh-250px)]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[15%]">Category</TableHead>
                            <TableHead className="w-[35%]">Specification</TableHead>
                            <TableHead className="w-[20%]">Supplier</TableHead>
                            <TableHead className="w-[12%]">Quantity</TableHead>
                            <TableHead className="w-[12%]">Unit Cost</TableHead>
                            <TableHead className="w-[6%]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {technicalSpecifications.equipment.map((equipment, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{equipment.category}</TableCell>
                              <TableCell className="max-w-md">
                                <div className="text-sm">{equipment.specification}</div>
                              </TableCell>
                              <TableCell>{equipment.supplier}</TableCell>
                              <TableCell>{equipment.quantity}</TableCell>
                              <TableCell className="font-mono">{equipment.unitCost}</TableCell>
                              <TableCell>
                                <InteractiveStatusBadge
                                  status={equipment.status}
                                  category="equipment"
                                  onStatusChange={(newStatus) => handleStatusChange('equipment', index, newStatus)}
                                  isLoading={loadingStates[`equipment-${index}`]}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety" className="h-full mt-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Safety Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(95vh-250px)]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[20%]">Requirement</TableHead>
                            <TableHead className="w-[45%]">Specification</TableHead>
                            <TableHead className="w-[25%]">Compliance Standard</TableHead>
                            <TableHead className="w-[10%]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {technicalSpecifications.safety.map((safety, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{safety.requirement}</TableCell>
                              <TableCell className="max-w-md">
                                <div className="text-sm">{safety.specification}</div>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{safety.compliance}</TableCell>
                              <TableCell>
                                <InteractiveStatusBadge
                                  status={safety.status}
                                  category="safety"
                                  onStatusChange={(newStatus) => handleStatusChange('safety', index, newStatus)}
                                  isLoading={loadingStates[`safety-${index}`]}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="testing" className="h-full mt-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Testing & Quality Assurance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(95vh-250px)]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[18%]">Test</TableHead>
                            <TableHead className="w-[32%]">Procedure</TableHead>
                            <TableHead className="w-[12%]">Frequency</TableHead>
                            <TableHead className="w-[12%]">Last Completed</TableHead>
                            <TableHead className="w-[12%]">Next Due</TableHead>
                            <TableHead className="w-[14%]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {technicalSpecifications.testing.map((test, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{test.test}</TableCell>
                              <TableCell className="max-w-md">
                                <div className="text-sm">{test.procedure}</div>
                              </TableCell>
                              <TableCell>{test.frequency}</TableCell>
                              <TableCell className="text-sm">{new Date(test.lastCompleted).toLocaleDateString()}</TableCell>
                              <TableCell className="text-sm">{new Date(test.nextDue).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <InteractiveStatusBadge
                                  status={test.status}
                                  category="testing"
                                  onStatusChange={(newStatus) => handleStatusChange('testing', index, newStatus)}
                                  isLoading={loadingStates[`testing-${index}`]}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}