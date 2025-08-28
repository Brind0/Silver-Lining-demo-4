"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PulseBadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
  pulse?: boolean
  pulseColor?: "red" | "amber" | "green"
}

export function PulseBadge({
  children,
  variant = "default",
  className,
  pulse = false,
  pulseColor = "red",
}: PulseBadgeProps) {
  return (
    <div className="relative">
      <Badge variant={variant} className={className}>
        {children}
      </Badge>
      {pulse && (
        <div
          className={cn(
            "absolute -inset-1 rounded-full animate-ping opacity-75",
            pulseColor === "red" && "bg-red-400",
            pulseColor === "amber" && "bg-amber-400",
            pulseColor === "green" && "bg-green-400",
          )}
        />
      )}
    </div>
  )
}
