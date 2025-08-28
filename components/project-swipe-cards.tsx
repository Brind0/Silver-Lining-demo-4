"use client"

import type React from "react"

import { Card } from "@/components/ui/card"

type ProjectStatus = "GREEN" | "AMBER" | "RED"

export type SwipeProject = {
  id: number
  name: string
  status: ProjectStatus
  budget: number
  spent: number
  daysRemaining: number
  keyMetric: string
}

function getStatusDotClass(status: ProjectStatus): string {
  switch (status) {
    case "GREEN":
      return "bg-emerald-500"
    case "AMBER":
      return "bg-amber-500"
    case "RED":
      return "bg-red-500"
    default:
      return "bg-gray-400"
  }
}

export function ProjectSwipeCards({ projects }: { projects: SwipeProject[] }) {
  return (
    <div className="-mx-2">
      <div className="flex gap-4 overflow-x-auto py-3 px-2 [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.300)_theme(colors.gray.100)]">
        {projects.map((p) => {
          const percentOver = Math.max(0, Math.round(((p.spent - p.budget) / Math.max(1, p.budget)) * 100))
          const budgetStatus = p.spent > p.budget ? `${percentOver}% over budget` : p.keyMetric || "On track"
          const daysText = p.daysRemaining < 0 ? `${Math.abs(p.daysRemaining)}d over` : `${p.daysRemaining}d`
          return (
            <Card
              key={p.id}
              className="w-[280px] h-[140px] bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-grab select-none flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-[16px] leading-snug text-gray-800 line-clamp-2 pr-2">{p.name}</h3>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDotClass(p.status)}`} />
              </div>

              <div className="flex items-end justify-between mt-auto">
                <div className="flex flex-col gap-1">
                  <span className="text-[18px] font-bold text-gray-800">£{p.spent.toLocaleString()}</span>
                  <span className="text-[12px] text-gray-500">{budgetStatus}</span>
                </div>
                <span className="text-[12px] text-gray-400 font-medium">{daysText}</span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectSwipeCards


