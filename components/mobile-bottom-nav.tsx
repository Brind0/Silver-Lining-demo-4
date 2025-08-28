"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderOpen, DollarSign, Receipt, Plus } from "lucide-react"

const bottomNavItems = [
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
    name: "Add",
    href: "/add",
    icon: Plus,
    isAction: true,
  },
  {
    name: "Costs",
    href: "/costs",
    icon: DollarSign,
  },
  {
    name: "Receipts",
    href: "/receipts",
    icon: Receipt,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-h-12 min-w-12 px-2 py-1 rounded-lg transition-colors", // 48px touch targets
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                item.isAction && "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
