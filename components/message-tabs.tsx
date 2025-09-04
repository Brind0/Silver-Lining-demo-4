"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Wrench, 
  Settings, 
  Building 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ContactCategory } from "@/lib/types/messages"

interface MessageTabsProps {
  activeTab: ContactCategory | null
  onTabChange: (tab: ContactCategory | null) => void
  tabCounts: Record<ContactCategory, number>
  className?: string
}

const tabConfig = {
  client: {
    label: "Client",
    icon: Users,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    activeColor: "bg-blue-100 text-blue-700 border-blue-300"
  },
  team: {
    label: "Team", 
    icon: Wrench,
    color: "text-green-600 bg-green-50 border-green-200",
    activeColor: "bg-green-100 text-green-700 border-green-300"
  },
  system: {
    label: "System",
    icon: Settings,
    color: "text-purple-600 bg-purple-50 border-purple-200", 
    activeColor: "bg-purple-100 text-purple-700 border-purple-300"
  },
  external: {
    label: "External",
    icon: Building,
    color: "text-orange-600 bg-orange-50 border-orange-200",
    activeColor: "bg-orange-100 text-orange-700 border-orange-300"
  }
}

export function MessageTabs({ activeTab, onTabChange, tabCounts, className }: MessageTabsProps) {
  const handleTabClick = (category: ContactCategory) => {
    // If clicking the active tab, deselect it (show all)
    if (activeTab === category) {
      onTabChange(null)
    } else {
      onTabChange(category)
    }
  }

  return (
    <div className={cn("border-b bg-white", className)}>
      <div className="flex items-center space-x-1 px-6 py-4">
        <div className="flex items-center space-x-4 mr-6">
          <h2 className="text-lg font-semibold">Messages</h2>
          {!activeTab && (
            <Badge variant="outline" className="text-xs">
              All Categories
            </Badge>
          )}
        </div>
        
        {Object.entries(tabConfig).map(([key, config]) => {
          const category = key as ContactCategory
          const IconComponent = config.icon
          const isActive = activeTab === category
          const count = tabCounts[category] || 0
          
          return (
            <Button
              key={category}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabClick(category)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 h-auto rounded-lg border transition-all",
                isActive 
                  ? config.activeColor
                  : cn("hover:bg-muted/50", config.color.replace("bg-", "hover:bg-"))
              )}
            >
              <IconComponent className="h-4 w-4" />
              <span className="font-medium">{config.label}</span>
              {count > 0 && (
                <Badge 
                  variant={isActive ? "secondary" : "outline"}
                  className="ml-1 text-xs min-w-[20px] h-5 flex items-center justify-center"
                >
                  {count}
                </Badge>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}