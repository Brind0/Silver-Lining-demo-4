"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, Upload, X, Camera, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const categories = ["Materials", "Labor", "Equipment", "Permits", "Other"]

const projects = [
  "Kitchen Renovation - Maple Street",
  "Bathroom Refit - Oak Avenue",
  "Garden Landscaping - Pine Road",
  "Office Refurbishment - Business Park",
]

interface ReceiptUploadProps {
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

export function ReceiptUpload({ onSubmit, onCancel }: ReceiptUploadProps) {
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    vendor: "",
    amount: "",
    category: "",
    project: "",
    description: "",
    notes: "",
  })
  const [receipt, setReceipt] = useState<File | null>(null)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [ocrComplete, setOcrComplete] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<any>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      date,
      receipt,
      amount: Number.parseFloat(formData.amount),
      extractedData,
    }
    onSubmit?.(data)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceipt(file)
      processOCR(file)
    }
  }

  const processOCR = async (file: File) => {
    setOcrProcessing(true)
    setOcrProgress(0)

    // Simulate OCR processing
    const interval = setInterval(() => {
      setOcrProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setOcrProcessing(false)
          setOcrComplete(true)
          // Simulate extracted data
          setExtractedData({
            vendor: "B&Q Hardware Store",
            amount: "234.50",
            date: "2024-02-15",
            items: ["Screws - Pack of 100", "Bolts - M8 x 50mm", "Wall Plugs - Pack of 50"],
            total: "234.50",
            vat: "39.08",
            confidence: 0.95,
          })
          // Auto-fill form with extracted data
          setFormData((prev) => ({
            ...prev,
            vendor: "B&Q Hardware Store",
            amount: "234.50",
            description: "Hardware supplies - screws, bolts, wall plugs",
          }))
          setDate(new Date("2024-02-15"))
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const removeReceipt = () => {
    setReceipt(null)
    setOcrComplete(false)
    setOcrProgress(0)
    setExtractedData(null)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Receipt</CardTitle>
        <CardDescription>Upload a receipt image for automatic OCR processing and expense tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Receipt Upload */}
          <div className="space-y-4">
            <Label>Receipt Image</Label>
            {receipt ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{receipt.name}</p>
                      <p className="text-xs text-muted-foreground">{(receipt.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={removeReceipt}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* OCR Processing */}
                {ocrProcessing && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Processing receipt with OCR...</span>
                    </div>
                    <Progress value={ocrProgress} className="h-2" />
                  </div>
                )}

                {/* OCR Complete */}
                {ocrComplete && extractedData && (
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">OCR Processing Complete</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {Math.round(extractedData.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Vendor:</span>
                        <span className="ml-2 font-medium">{extractedData.vendor}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="ml-2 font-medium">£{extractedData.amount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <span className="ml-2 font-medium">{extractedData.date}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">VAT:</span>
                        <span className="ml-2 font-medium">£{extractedData.vat}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-4">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="receipt-upload" className="cursor-pointer">
                      <span className="text-lg font-medium text-primary hover:underline">Click to upload receipt</span>
                      <span className="text-sm text-muted-foreground block mt-1">or drag and drop</span>
                    </Label>
                    <Input
                      id="receipt-upload"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, PDF up to 10MB
                    <br />
                    OCR will automatically extract receipt details
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor/Supplier</Label>
              <Input
                id="vendor"
                placeholder="Enter vendor name"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (£)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Receipt Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the purchase"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this receipt"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!receipt || ocrProcessing}>
              Submit Receipt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
