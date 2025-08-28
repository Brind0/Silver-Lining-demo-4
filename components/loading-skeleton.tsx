"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse w-32 mb-2"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-40"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse w-32 mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-48"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-20 bg-muted rounded animate-pulse"></div>
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse w-28 mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-36"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-4 border rounded-lg">
          <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
          <div className="h-4 bg-muted rounded animate-pulse flex-1"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
        </div>
      ))}
    </div>
  )
}
