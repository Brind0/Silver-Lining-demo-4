"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Settings } from "lucide-react"

interface ProjectPhase {
  id: string
  name: string
  project: string
  budget: number
  spent: number
  description: string
  assignee: string
}

interface RAGBoardProps {
  onOverrideStatus: (project: any) => void
}

const initialPhases: Record<string, ProjectPhase[]> = {
  GREEN: [
    {
      id: "1",
      name: "Foundation Work",
      project: "Wentworth Golf Sim",
      budget: 15000,
      spent: 12000,
      description: "Concrete foundation and utilities",
      assignee: "Mike Johnson",
    },
    {
      id: "2",
      name: "Interior Design",
      project: "Ascot Entertainment",
      budget: 25000,
      spent: 18000,
      description: "Room layout and fixtures",
      assignee: "Sarah Wilson",
    },
  ],
  AMBER: [
    {
      id: "3",
      name: "Equipment Installation",
      project: "Henderson Golf Sim",
      budget: 20000,
      spent: 22000,
      description: "Golf simulator setup - supplier delay",
      assignee: "Tom Brown",
    },
    {
      id: "4",
      name: "Restoration Phase 2",
      project: "Tunbridge Restoration",
      budget: 35000,
      spent: 38000,
      description: "Historic preservation work",
      assignee: "Emma Davis",
    },
  ],
  RED: [
    {
      id: "5",
      name: "Structural Repairs",
      project: "Marchmont Historic",
      budget: 45000,
      spent: 62000,
      description: "Critical foundation issues discovered",
      assignee: "James Miller",
    },
  ],
}

export function RAGBoard({ onOverrideStatus }: RAGBoardProps) {
  const [phases, setPhases] = useState(initialPhases)
  const [draggedItem, setDraggedItem] = useState<ProjectPhase | null>(null)

  const handleDragStart = (e: React.DragEvent, phase: ProjectPhase) => {
    setDraggedItem(phase)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find source column
    const sourceColumn = Object.keys(phases).find((column) =>
      phases[column].some((phase) => phase.id === draggedItem.id),
    )

    if (!sourceColumn || sourceColumn === targetColumn) {
      setDraggedItem(null)
      return
    }

    // Update phases
    setPhases((prev) => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter((phase) => phase.id !== draggedItem.id),
      [targetColumn]: [...prev[targetColumn], draggedItem],
    }))

    setDraggedItem(null)
  }

  const getColumnIcon = (status: string) => {
    switch (status) {
      case "GREEN":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case "AMBER":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "RED":
        return <AlertTriangle className="h-5 w-5 text-rose-600" />
      default:
        return null
    }
  }

  const getColumnColor = (status: string) => {
    switch (status) {
      case "GREEN":
        return "border-emerald-200 bg-emerald-50/50"
      case "AMBER":
        return "border-amber-200 bg-amber-50/50"
      case "RED":
        return "border-rose-200 bg-rose-50/50"
      default:
        return ""
    }
  }

  const getPhaseCardColor = (status: string) => {
    switch (status) {
      case "GREEN":
        return "border-slate-200 hover:border-emerald-300 hover:shadow-md"
      case "AMBER":
        return "border-slate-200 hover:border-amber-300 hover:shadow-md"
      case "RED":
        return "border-slate-200 hover:border-rose-300 hover:shadow-md"
      default:
        return ""
    }
  }

  const getStatusBadge = (status: string, count: number) => {
    switch (status) {
      case "GREEN":
        return (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-300">
            {count}
          </Badge>
        )
      case "AMBER":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
            {count}
          </Badge>
        )
      case "RED":
        return (
          <Badge variant="secondary" className="bg-rose-100 text-rose-800 border-rose-300">
            {count}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{count}</Badge>
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {Object.entries(phases).map(([status, phaseList]) => (
        <div
          key={status}
          className={`rounded-lg border-2 p-4 min-h-[500px] transition-all duration-200 ${getColumnColor(status)}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {getColumnIcon(status)}
              <h3 className="font-semibold text-lg text-slate-800">{status}</h3>
              {getStatusBadge(status, phaseList.length)}
            </div>
          </div>

          <div className="space-y-3">
            {phaseList.map((phase) => {
              const progressPercentage = Math.min((phase.spent / phase.budget) * 100, 100)
              const isOverBudget = phase.spent > phase.budget

              return (
                <Card
                  key={phase.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, phase)}
                  className={`cursor-move transition-all duration-200 hover:shadow-lg bg-white ${getPhaseCardColor(status)} ${
                    draggedItem?.id === phase.id ? "opacity-50 scale-95" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium text-slate-800">{phase.name}</CardTitle>
                        <p className="text-xs text-slate-600 mt-1">{phase.project}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => onOverrideStatus(phase)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-slate-600 mb-2">{phase.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Budget Progress</span>
                        <span className={isOverBudget ? "text-rose-600 font-medium" : "text-slate-700"}>
                          £{phase.spent.toLocaleString()} / £{phase.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className={`h-2 ${isOverBudget ? "bg-rose-100" : "bg-slate-100"}`}
                      />
                      {isOverBudget && (
                        <p className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded">
                          £{(phase.spent - phase.budget).toLocaleString()} over budget
                        </p>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-600">
                        Assigned to: <span className="font-medium text-slate-800">{phase.assignee}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {phaseList.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No phases in {status}</p>
                <p className="text-xs mt-1">Drag phases here to update status</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
