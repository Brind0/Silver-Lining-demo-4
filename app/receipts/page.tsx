"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ReceiptUploadModal } from "@/components/receipt-upload-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
} from "lucide-react"

const receipts = [
  {
    id: 1,
    receiptNumber: "RCP-2024-001",
    submittedBy: "John Smith",
    submitterAvatar: "/placeholder.svg?height=32&width=32",
    date: "2024-02-15",
    vendor: "B&Q Hardware",
    amount: 234.5,
    category: "Materials",
    project: "Kitchen Renovation - Maple Street",
    status: "pending",
    submittedDate: "2024-02-15T10:30:00Z",
    description: "Screws, bolts, and hardware supplies",
    hasImage: true,
    ocrProcessed: true,
    approver: null,
  },
  {
    id: 2,
    receiptNumber: "RCP-2024-002",
    submittedBy: "Sarah Wilson",
    submitterAvatar: "/placeholder.svg?height=32&width=32",
    date: "2024-02-14",
    vendor: "Wickes",
    amount: 1250.0,
    category: "Materials",
    project: "Bathroom Refit - Oak Avenue",
    status: "approved",
    submittedDate: "2024-02-14T14:20:00Z",
    description: "Bathroom tiles and adhesive",
    hasImage: true,
    ocrProcessed: true,
    approver: "Emily Johnson",
    approvedDate: "2024-02-14T16:45:00Z",
  },
  {
    id: 3,
    receiptNumber: "RCP-2024-003",
    submittedBy: "Mike Johnson",
    submitterAvatar: "/placeholder.svg?height=32&width=32",
    date: "2024-02-13",
    vendor: "Electrical Supplies Ltd",
    amount: 89.99,
    category: "Materials",
    project: "Office Refurbishment",
    status: "rejected",
    submittedDate: "2024-02-13T09:15:00Z",
    description: "Electrical cables and connectors",
    hasImage: true,
    ocrProcessed: true,
    approver: "Emily Johnson",
    rejectedDate: "2024-02-13T11:30:00Z",
    rejectionReason: "Receipt unclear, please resubmit with better quality image",
  },
  {
    id: 4,
    receiptNumber: "RCP-2024-004",
    submittedBy: "Emma Davis",
    submitterAvatar: "/placeholder.svg?height=32&width=32",
    date: "2024-02-12",
    vendor: "Tool Station",
    amount: 45.75,
    category: "Equipment",
    project: "Garden Landscaping",
    status: "processing",
    submittedDate: "2024-02-12T16:00:00Z",
    description: "Hand tools and safety equipment",
    hasImage: true,
    ocrProcessed: false,
  },
  {
    id: 5,
    receiptNumber: "RCP-2024-005",
    submittedBy: "Tom Brown",
    submitterAvatar: "/placeholder.svg?height=32&width=32",
    date: "2024-02-11",
    vendor: "Screwfix",
    amount: 156.3,
    category: "Materials",
    project: "Kitchen Renovation - Maple Street",
    status: "approved",
    submittedDate: "2024-02-11T13:45:00Z",
    description: "Plumbing fittings and pipes",
    hasImage: true,
    ocrProcessed: true,
    approver: "John Smith",
    approvedDate: "2024-02-11T15:20:00Z",
  },
]

const receiptStats = {
  total: receipts.length,
  pending: receipts.filter((r) => r.status === "pending").length,
  approved: receipts.filter((r) => r.status === "approved").length,
  rejected: receipts.filter((r) => r.status === "rejected").length,
  processing: receipts.filter((r) => r.status === "processing").length,
  totalValue: receipts.reduce((sum, r) => sum + r.amount, 0),
  pendingValue: receipts.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0),
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    case "processing":
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Processing
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Materials":
      return "text-blue-600"
    case "Labor":
      return "text-green-600"
    case "Equipment":
      return "text-purple-600"
    case "Permits":
      return "text-orange-600"
    case "Other":
      return "text-gray-600"
    default:
      return "text-gray-600"
  }
}

export default function ReceiptsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleUploadSubmit = (data: any) => {
    console.log("Receipt uploaded:", data)
    // TODO: Handle the receipt submission to your backend
    // This could include uploading the file, saving the data, etc.
  }
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Receipt Processing</h1>
            <p className="text-muted-foreground">Manage receipt submissions and approvals with OCR processing</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Receipt
            </Button>
          </div>
        </div>

        {/* Receipt Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Receipts</span>
              </div>
              <div className="text-2xl font-bold mt-2">{receiptStats.total}</div>
              <div className="text-xs text-muted-foreground">£{receiptStats.totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="text-2xl font-bold mt-2">{receiptStats.pending}</div>
              <div className="text-xs text-muted-foreground">£{receiptStats.pendingValue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Approved</span>
              </div>
              <div className="text-2xl font-bold mt-2">{receiptStats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Rejected</span>
              </div>
              <div className="text-2xl font-bold mt-2">{receiptStats.rejected}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Processing</span>
              </div>
              <div className="text-2xl font-bold mt-2">{receiptStats.processing}</div>
            </CardContent>
          </Card>
        </div>

        {/* Receipts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Receipts</CardTitle>
            <CardDescription>All receipt submissions with OCR processing status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>OCR</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={receipt.submitterAvatar || "/placeholder.svg"} alt={receipt.submittedBy} />
                          <AvatarFallback className="text-xs">
                            {receipt.submittedBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{receipt.submittedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(receipt.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm">{receipt.vendor}</TableCell>
                    <TableCell className="font-medium">£{receipt.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`text-sm ${getCategoryColor(receipt.category)}`}>{receipt.category}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {receipt.project}
                    </TableCell>
                    <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                    <TableCell>
                      {receipt.ocrProcessed ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <FileText className="h-3 w-3 mr-1" />
                          Done
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          <Clock className="h-3 w-3 mr-1" />
                          Processing
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
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

        {/* Upload Modal */}
        <ReceiptUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={handleUploadSubmit}
        />
      </div>
    </MainLayout>
  )
}
