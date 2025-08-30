"use client"

import { MainLayout } from "@/components/main-layout"
import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddUserPage() {
  const handleSubmit = (data: any) => {
    console.log("User data:", data)
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
          <Link href="/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add User</h1>
            <p className="text-muted-foreground">Create a new user account with appropriate role and permissions</p>
          </div>
        </div>

        {/* User Form */}
        <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </MainLayout>
  )
}
