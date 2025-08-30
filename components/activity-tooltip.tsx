"use client"

import React, { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, DollarSign, ArrowRight } from "lucide-react"

interface Activity {
  action: string
  project: string
  time: string
  icon: any
  color: string
  details: string
  user: string
  exactTime: string
  amount: string
  status: string
  nextStep: string
}

interface ActivityTooltipProps {
  activity: Activity
  children: React.ReactNode
}

export function ActivityTooltip({ activity, children }: ActivityTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'attention required':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending review':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const updatePosition = () => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
      let top = targetRect.top - tooltipRect.height - 10

      // Adjust for horizontal viewport boundaries
      if (left < 10) {
        left = 10
      } else if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10
      }

      // Adjust for vertical viewport boundaries  
      if (top < 10) {
        top = targetRect.bottom + 10
      }

      setPosition({ top, left })
    }
  }

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      setTimeout(updatePosition, 0)
    }, 300)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      const handleScroll = () => updatePosition()
      const handleResize = () => updatePosition()
      
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isVisible])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in fade-in duration-200"
          style={{
            top: position.top,
            left: position.left,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{activity.action}</h4>
              <p className="text-xs text-gray-500">{activity.project}</p>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor(activity.status)}`}
            >
              {activity.status}
            </Badge>
          </div>

          {/* Details */}
          <div className="mb-3">
            <p className="text-xs text-gray-700 leading-relaxed">{activity.details}</p>
          </div>

          {/* Meta Information */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-xs text-gray-600">
              <User className="w-3 h-3 mr-2" />
              <span>Performed by {activity.user}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-600">
              <Clock className="w-3 h-3 mr-2" />
              <span>{activity.exactTime}</span>
            </div>

            {activity.amount && activity.amount !== "£0" && (
              <div className="flex items-center text-xs text-gray-600">
                <DollarSign className="w-3 h-3 mr-2" />
                <span className="font-medium">{activity.amount}</span>
              </div>
            )}
          </div>

          {/* Next Step */}
          {activity.nextStep && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-start text-xs text-gray-700">
                <ArrowRight className="w-3 h-3 mr-2 mt-0.5 text-blue-500" />
                <span className="font-medium">Next: {activity.nextStep}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}