"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Project = {
  id: number
  name: string
  status: "GREEN" | "AMBER" | "RED"
  budget: number
  spent: number
  daysRemaining: number
  keyMetric: string
}

export function RAGSystemCard({ projects }: { projects: Project[] }) {
  const onTrack = projects.filter((p) => p.status === "GREEN")
  const atRisk = projects.filter((p) => p.status === "AMBER")
  const critical = projects.filter((p) => p.status === "RED")

  return (
    <Card className="w-full h-[400px] bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-transform duration-200 overflow-hidden cursor-grab active:cursor-grabbing">
      <div className="flex flex-col gap-3 h-full">
        <div className="flex-1 rounded-lg bg-emerald-50/90 flex items-center px-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
          <span className="text-emerald-900 text-[14px] font-medium">On Track</span>
          <Badge variant="outline" className="ml-auto bg-emerald-100 text-emerald-800 border-emerald-200">
            {onTrack.length}
          </Badge>
        </div>

        <div className="flex-1 rounded-lg bg-amber-50/90 flex items-center px-4">
          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
          <span className="text-amber-900 text-[14px] font-medium">At Risk</span>
          <Badge variant="outline" className="ml-auto bg-amber-100 text-amber-800 border-amber-200">
            {atRisk.length}
          </Badge>
        </div>

        <div className="flex-1 rounded-lg bg-red-50/90 flex items-center px-4">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
          <span className="text-red-900 text-[14px] font-medium">Critical</span>
          <Badge variant="outline" className="ml-auto bg-red-100 text-red-800 border-red-200">
            {critical.length}
          </Badge>
        </div>
      </div>
    </Card>
  )
}

export default RAGSystemCard


