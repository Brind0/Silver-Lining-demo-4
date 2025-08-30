"use client"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Receipt, Calendar, Download, Filter } from "lucide-react"

const monthlyData = [
  { month: "Jan", revenue: 32000, costs: 18000, receipts: 45 },
  { month: "Feb", revenue: 28000, costs: 16000, receipts: 52 },
  { month: "Mar", revenue: 35000, costs: 19000, receipts: 38 },
  { month: "Apr", revenue: 42000, costs: 22000, receipts: 61 },
  { month: "May", revenue: 38000, costs: 20000, receipts: 47 },
  { month: "Jun", revenue: 45000, costs: 23000, receipts: 55 },
]

const projectPerformanceData = [
  { name: "Kitchen Renovation", budget: 25000, spent: 18750, efficiency: 92 },
  { name: "Bathroom Refit", budget: 15000, spent: 8200, efficiency: 88 },
  { name: "Garden Landscaping", budget: 12000, spent: 3500, efficiency: 65 },
  { name: "Office Refurbishment", budget: 45000, spent: 42000, efficiency: 95 },
]

const receiptProcessingData = [
  { status: "Approved", count: 156, color: "hsl(var(--chart-4))" },
  { status: "Pending", count: 23, color: "hsl(var(--chart-5))" },
  { status: "Rejected", count: 8, color: "hsl(var(--chart-3))" },
  { status: "Processing", count: 12, color: "hsl(var(--chart-1))" },
]

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£45,000</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +18.4% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Project Efficiency</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +5.2% improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receipt Processing</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">199</div>
              <p className="text-xs text-muted-foreground">23 pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Variance</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-3.2%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                Under budget
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Costs Trend</CardTitle>
              <CardDescription>Monthly financial performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  costs: {
                    label: "Costs",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <AreaChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-sm" style={{ color: entry.color }}>
                                {entry.dataKey === "revenue" ? "Revenue" : "Costs"}: £{entry.value?.toLocaleString()}
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="costs"
                    stackId="2"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receipt Processing Status</CardTitle>
              <CardDescription>Current status of all receipt submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  Approved: {
                    label: "Approved",
                    color: "hsl(var(--chart-4))",
                  },
                  Pending: {
                    label: "Pending",
                    color: "hsl(var(--chart-5))",
                  },
                  Rejected: {
                    label: "Rejected",
                    color: "hsl(var(--chart-3))",
                  },
                  Processing: {
                    label: "Processing",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={receiptProcessingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                  >
                    {receiptProcessingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{data.status}</p>
                            <p className="text-sm text-muted-foreground">Count: {data.count}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ChartContainer>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {receiptProcessingData.map((item) => (
                  <div key={item.status} className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.status}</span>
                    <span className="text-sm text-muted-foreground">({item.count})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Performance Analysis</CardTitle>
            <CardDescription>Budget utilization and efficiency across active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                budget: {
                  label: "Budget",
                  color: "hsl(var(--chart-1))",
                },
                spent: {
                  label: "Spent",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={projectPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.dataKey === "budget" ? "Budget" : "Spent"}: £{entry.value?.toLocaleString()}
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="budget" fill="hsl(var(--chart-1))" />
                <Bar dataKey="spent" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
