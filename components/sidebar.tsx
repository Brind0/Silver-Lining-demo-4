"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  FolderOpen,
  Receipt,
  DollarSign,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  Menu,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    name: "Cost Tracking",
    href: "/costs",
    icon: DollarSign,
  },
  {
    name: "Receipts",
    href: "/receipts",
    icon: Receipt,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-4 border-b border-blue-900">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-blue-900">Silver Lining</span>
              <span className="text-xs text-blue-700">& Walpole Properties</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} onClick={onNavigate}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-3 text-blue-800 hover:text-blue-900 hover:bg-blue-50",
                    collapsed ? "px-2" : "px-3",
                    isActive && "bg-blue-900 text-white hover:bg-blue-800",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      {!collapsed && (
        <div className="border-t border-blue-900 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center">
              <span className="text-white font-medium text-sm">E</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900 truncate">Emily</p>
              <p className="text-xs text-blue-700 truncate">Operations Director</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="fixed top-4 left-4 z-50 h-12 w-12 p-0 bg-background border shadow-md md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-white">
            <div className="flex h-full flex-col">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div
        className={cn(
          "hidden md:flex h-full flex-col bg-white border-r border-blue-900 transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          className,
        )}
      >
        <SidebarContent collapsed={collapsed} />

        {/* Collapse button - desktop only */}
        <div className="absolute top-20 -right-3 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-6 w-6 p-0 bg-background border shadow-sm"
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </>
  )
}
