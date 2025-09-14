"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void
  autoCollapseOnMessage: boolean
  setAutoCollapseOnMessage: (autoCollapse: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [autoCollapseOnMessage, setAutoCollapseOnMessage] = useState(true)

  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed)
  }, [])

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  return (
    <SidebarContext.Provider value={{
      isCollapsed,
      setCollapsed,
      toggleCollapsed,
      autoCollapseOnMessage,
      setAutoCollapseOnMessage
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}