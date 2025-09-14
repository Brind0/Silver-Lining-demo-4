import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "@/contexts/sidebar-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Silver Lining & Walpole Properties",
  description: "Business Management Platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-sans">
        <SidebarProvider>
          {children}
          <Toaster position="top-right" />
        </SidebarProvider>
      </body>
    </html>
  )
}
