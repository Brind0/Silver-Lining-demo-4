"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, DollarSign, Clock, Zap, Play, Pause } from "lucide-react"

interface LiveUpdate {
  id: number
  type: "expense" | "status_change" | "alert"
  title: string
  description: string
  timestamp: string
  amount?: number
  project?: string
  status?: string
  priority: "low" | "medium" | "high"
}

const mockUpdates: LiveUpdate[] = [
  {
    id: 1,
    type: "expense",
    title: "New Expense Added",
    description: "Equipment rental for Henderson Golf Sim",
    timestamp: new Date().toISOString(),
    amount: 1250,
    project: "Henderson Golf Sim",
    priority: "medium",
  },
  {
    id: 2,
    type: "status_change",
    title: "Project Status Changed",
    description: "Wentworth Golf Sim changed from GREEN to AMBER",
    timestamp: new Date(Date.now() + 5000).toISOString(),
    project: "Wentworth Golf Sim",
    status: "AMBER",
    priority: "high",
  },
  {
    id: 3,
    type: "alert",
    title: "Budget Threshold Alert",
    description: "Tunbridge Restoration approaching 90% budget utilization",
    timestamp: new Date(Date.now() + 10000).toISOString(),
    project: "Tunbridge Restoration",
    priority: "high",
  },
  {
    id: 4,
    type: "expense",
    title: "Receipt Processed",
    description: "OCR processed receipt for materials purchase",
    timestamp: new Date(Date.now() + 15000).toISOString(),
    amount: 850,
    project: "Marchmont Historic",
    priority: "low",
  },
]

export function LiveUpdates() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentUpdates, setCurrentUpdates] = useState<LiveUpdate[]>([])
  const [updateIndex, setUpdateIndex] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      if (updateIndex < mockUpdates.length) {
        const newUpdate = mockUpdates[updateIndex]
        setCurrentUpdates((prev) => [newUpdate, ...prev.slice(0, 4)]) // Keep only 5 most recent
        setUpdateIndex((prev) => prev + 1)

        // Show toast notification
        toast({
          title: newUpdate.title,
          description: `${newUpdate.description}${newUpdate.amount ? ` - £${newUpdate.amount.toLocaleString()}` : ""}`,
        })

        // Play notification sound simulation
        if (newUpdate.priority === "high") {
          console.log("🔊 High priority notification sound")
        }
      } else {
        setIsRunning(false)
        setUpdateIndex(0)
      }
    }, 5000) // New update every 5 seconds

    return () => clearInterval(interval)
  }, [isRunning, updateIndex, toast])

  const startDemo = () => {
    setIsRunning(true)
    setCurrentUpdates([])
    setUpdateIndex(0)
  }

  const stopDemo = () => {
    setIsRunning(false)
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "expense":
        return <DollarSign className="h-4 w-4 text-blue-500" />
      case "status_change":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Live Updates Demo
            </CardTitle>
            <CardDescription>Simulate real-time system notifications</CardDescription>
          </div>
          <div className="flex space-x-2">
            {!isRunning ? (
              <Button onClick={startDemo} size="sm">
                <Play className="h-4 w-4 mr-2" />
                Start Demo
              </Button>
            ) : (
              <Button onClick={stopDemo} size="sm" variant="outline" className="bg-transparent">
                <Pause className="h-4 w-4 mr-2" />
                Stop Demo
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentUpdates.length === 0 && !isRunning && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Click "Start Demo" to see live updates</p>
          </div>
        )}

        {isRunning && currentUpdates.length === 0 && (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Waiting for updates...</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {currentUpdates.map((update, index) => (
            <Alert
              key={update.id}
              className={`animate-in slide-in-from-right duration-500 ${
                update.priority === "high"
                  ? "border-red-300 bg-red-50"
                  : update.priority === "medium"
                    ? "border-amber-300 bg-amber-50"
                    : "border-blue-300 bg-blue-50"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-3">
                {getUpdateIcon(update.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{update.title}</span>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(update.priority)}
                      <span className="text-xs text-muted-foreground">
                        {new Date(update.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <AlertDescription className="text-xs">
                    {update.description}
                    {update.project && <span className="block mt-1">Project: {update.project}</span>}
                    {update.amount && (
                      <span className="block mt-1 font-medium">Amount: £{update.amount.toLocaleString()}</span>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>

        {isRunning && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between text-sm text-blue-800">
              <span>
                Demo running... ({updateIndex}/{mockUpdates.length} updates)
              </span>
              <div className="flex items-center space-x-1">
                <div className="animate-pulse h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Live</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
