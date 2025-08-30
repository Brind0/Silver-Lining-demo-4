"use client"

import { MainLayout } from "@/components/main-layout"
import { ExpenseForm } from "@/components/expense-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddExpensePage() {
  const handleSubmit = (data: any) => {
    console.log("Expense data:", data)
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
          <Link href="/costs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Costs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add Expense</h1>
            <p className="text-muted-foreground">Record a new expense for tracking and budget management</p>
          </div>
        </div>

        {/* Expense Form */}
        <ExpenseForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </MainLayout>
  )
}
