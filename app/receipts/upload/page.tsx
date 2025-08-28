"use client"

import { MainLayout } from "@/components/main-layout"
import { ReceiptUpload } from "@/components/receipt-upload"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UploadReceiptPage() {
  const handleSubmit = (data: any) => {
    console.log("Receipt data:", data)
    // Handle form submission here
  }

  const handleCancel = () => {
    // Handle cancel action
    window.history.back()
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/receipts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Receipts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Upload Receipt</h1>
            <p className="text-muted-foreground">
              Upload a receipt image for automatic OCR processing and expense tracking
            </p>
          </div>
        </div>

        {/* Receipt Upload Form */}
        <ReceiptUpload onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </MainLayout>
  )
}
