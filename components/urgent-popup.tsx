"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"

interface UrgentPopupProps {
  isVisible: boolean
  onDismiss: () => void
  title?: string
  message: string
  actionLabel?: string
  onAction?: () => void
  duration?: number
}

export function UrgentPopup({
  isVisible,
  onDismiss,
  title = "Critical Project Alert",
  message,
  actionLabel = "View Project", 
  onAction,
  duration = 15000
}: UrgentPopupProps) {
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
    <div className="fixed top-4 right-4 z-50 w-80 animate-in slide-in-from-top-2 fade-in duration-300">
      <div 
        className="bg-white border-2 border-red-500 rounded-lg shadow-xl p-4 cursor-pointer hover:shadow-2xl transition-shadow duration-200"
        onClick={() => onAction && onAction()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1">
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDismiss()
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors group flex-shrink-0"
            title="Dismiss alert"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Message */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Action Button */}
        {onAction && (
          <div className="flex justify-end">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onAction()
              }}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
            >
              {actionLabel}
            </Button>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 rounded-full animate-pulse"
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}