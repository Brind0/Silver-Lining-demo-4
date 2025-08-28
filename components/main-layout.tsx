"use client"

import type React from "react"
import { Sidebar } from "./sidebar"
import { MobileBottomNav } from "./mobile-bottom-nav"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="h-full pt-16 md:pt-0">{children}</div>
        </main>
      </div>
      <MobileBottomNav />
    </>
  )
}
