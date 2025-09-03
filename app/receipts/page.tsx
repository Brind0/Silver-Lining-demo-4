"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
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
import { toast } from "sonner"

interface Receipt {
  id: string;
  receiptNumber: string;
  submittedBy: string;
  submitterAvatar?: string;
  date: string;
  vendor: string;
  amount: number;
  category: string;
  project: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  submittedDate: string;
  description: string;
  hasImage: boolean;
  ocrProcessed: boolean;
  approver?: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
}

interface ReceiptStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  processing: number;
  totalValue: number;
  pendingValue: number;
}

function calculateStats(receipts: Receipt[]): ReceiptStats {
  return {
    total: receipts.length,
    pending: receipts.filter((r) => r.status === "pending").length,
    approved: receipts.filter((r) => r.status === "approved").length,
    rejected: receipts.filter((r) => r.status === "rejected").length,
    processing: receipts.filter((r) => r.status === "processing").length,
    totalValue: receipts.reduce((sum, r) => sum + r.amount, 0),
    pendingValue: receipts.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0),
  };
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
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [stats, setStats] = useState<ReceiptStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    processing: 0,
    totalValue: 0,
    pendingValue: 0,
  })
  const [isConnected, setIsConnected] = useState(false)
  const [newReceiptIds, setNewReceiptIds] = useState<Set<string>>(new Set())

  // Fetch initial receipts
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch('/api/receipts?stats=true')
        const data = await response.json()
        setReceipts(data.receipts)
        setStats(data.stats)
      } catch (error) {
        console.error('Failed to fetch receipts:', error)
      }
    }
    
    fetchReceipts()
  }, [])

  // WebSocket connection for real-time updates
  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      setIsConnected(false)
    })

    socket.on('new-receipt', (newReceipt: Receipt) => {
      console.log('New receipt received:', newReceipt)
      setReceipts(prev => {
        const updated = [newReceipt, ...prev]
        setStats(calculateStats(updated))
        return updated
      })
      
      // Show enhanced toast notification
      toast.success(`📱 New receipt from ${newReceipt.submittedBy}`, {
        description: `${newReceipt.vendor} - £${newReceipt.amount.toLocaleString()} | ${newReceipt.project}`,
        duration: 5000,
        action: {
          label: "View",
          onClick: () => window.location.reload()
        }
      })
      
      // Highlight new receipt temporarily
      setNewReceiptIds(prev => new Set([...prev, newReceipt.id]))
      setTimeout(() => {
        setNewReceiptIds(prev => {
          const updated = new Set(prev)
          updated.delete(newReceipt.id)
          return updated
        })
      }, 3000)
    })

    socket.on('receipt-processed', (updatedReceipt: Receipt) => {
      console.log('Receipt processed:', updatedReceipt)
      setReceipts(prev => {
        const updated = prev.map(r => 
          r.receiptNumber === updatedReceipt.receiptNumber ? updatedReceipt : r
        )
        setStats(calculateStats(updated))
        return updated
      })
      
      toast.success(`✅ Receipt processed: ${updatedReceipt.vendor}`, {
        description: `£${updatedReceipt.amount.toLocaleString()} - Ready for approval | ${updatedReceipt.project}`,
        duration: 5000,
        action: {
          label: "Approve",
          onClick: () => console.log("Quick approve:", updatedReceipt.id)
        }
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

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
              <div className="text-2xl font-bold mt-2">{stats.total}</div>
              <div className="text-xs text-muted-foreground">£{stats.totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="text-2xl font-bold mt-2">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">£{stats.pendingValue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Approved</span>
              </div>
              <div className="text-2xl font-bold mt-2">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Rejected</span>
              </div>
              <div className="text-2xl font-bold mt-2">{stats.rejected}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Processing</span>
              </div>
              <div className="text-2xl font-bold mt-2">{stats.processing}</div>
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
                {receipts.map((receipt) => {
                  const isNew = newReceiptIds.has(receipt.id)
                  return (
                  <TableRow 
                    key={receipt.id} 
                    className={isNew ? "bg-green-50 dark:bg-green-950/20 transition-all duration-1000 animate-pulse" : "hover:bg-muted/50 transition-colors"}
                  >
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
                )
                })}
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
