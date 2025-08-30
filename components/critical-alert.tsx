"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"

interface CriticalAlertProps {
  isVisible: boolean
  onDismiss: () => void
  title?: string
  message: string
  actionLabel?: string
  onAction?: () => void
  duration?: number
}

export function CriticalAlert({
  isVisible,
  onDismiss,
  title = "Critical Project Alert",
  message,
  actionLabel = "View Project", 
  onAction,
  duration = 15000
}: CriticalAlertProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onDismiss])

  if (!isVisible) return null

  return (
    <div className="bg-gray-800 border border-red-600 px-6 py-3 animate-in slide-in-from-top duration-300">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Alert Icon with Pulse */}
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          
          {/* Alert Content */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className="text-white font-semibold text-sm">{title}:</span>
            <span className="text-gray-100 text-sm truncate">{message}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
          {onAction && (
            <Button
              onClick={onAction}
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors"
            >
              {actionLabel}
            </Button>
          )}
          
          <button
            onClick={onDismiss}
            className="p-1 rounded hover:bg-gray-700 transition-colors group"
            title="Dismiss alert"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}