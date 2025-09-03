"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MainLayout } from "@/components/main-layout"
import { toast } from "sonner"

export default function TestTelegramPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    submittedBy: "Andre Johnson",
    vendor: "B&Q",
    amount: "127.43",
    description: "Paint supplies for Henderson project", 
    project: "Henderson Kitchen Renovation",
    category: "Materials"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/webhooks/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Receipt submitted successfully!', {
          description: `${result.receiptNumber} - Processing started`,
          duration: 4000
        })
      } else {
        toast.error('Failed to submit receipt')
      }
    } catch (error) {
      console.error('Error submitting receipt:', error)
      toast.error('Failed to submit receipt')
    } finally {
      setIsLoading(false)
    }
  }

  const quickTests = [
    {
      name: "Andre - B&Q Receipt",
      data: {
        submittedBy: "Andre Johnson",
        vendor: "B&Q",
        amount: "127.43",
        description: "Paint supplies for Henderson project",
        project: "Henderson Kitchen Renovation",
        category: "Materials"
      }
    },
    {
      name: "Sarah - Wickes Receipt", 
      data: {
        submittedBy: "Sarah Wilson",
        vendor: "Wickes",
        amount: "89.50",
        description: "Bathroom tiles and grout",
        project: "Bathroom Refit - Oak Avenue", 
        category: "Materials"
      }
    },
    {
      name: "Mike - Screwfix Receipt",
      data: {
        submittedBy: "Mike Johnson", 
        vendor: "Screwfix",
        amount: "45.99",
        description: "Power tools and drill bits",
        project: "Office Refurbishment",
        category: "Equipment"
      }
    }
  ]

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Telegram Webhook Tester</h1>
          <p className="text-muted-foreground">
            Simulate receipt submissions to test real-time updates on the receipts page
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manual Form */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Receipt Submission</CardTitle>
              <CardDescription>
                Fill out the form to simulate a Telegram receipt submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="submittedBy">Submitted By</Label>
                  <Input
                    id="submittedBy"
                    value={formData.submittedBy}
                    onChange={(e) => setFormData(prev => ({ ...prev, submittedBy: e.target.value }))}
                    placeholder="Name of person submitting"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendor">Vendor</Label>
                    <Input
                      id="vendor"
                      value={formData.vendor}
                      onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                      placeholder="Store name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount (£)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="127.43"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="project">Project</Label>
                  <Input
                    id="project"
                    value={formData.project}
                    onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                    placeholder="Project name"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Materials, Equipment, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What was purchased"
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Submitting..." : "Submit Receipt"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Test Receipts</CardTitle>
              <CardDescription>
                Click these buttons to quickly test different receipt scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickTests.map((test, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setFormData(test.data)}
                >
                  <div className="text-left">
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {test.data.vendor} - £{test.data.amount}
                    </div>
                  </div>
                </Button>
              ))}
              
              <div className="pt-4 space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Demo Instructions:</div>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open the receipts page in another tab</li>
                  <li>Click one of the quick test buttons above</li>
                  <li>Click "Submit Receipt"</li>
                  <li>Watch the receipt appear on the receipts page!</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}