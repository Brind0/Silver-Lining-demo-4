"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 32000, costs: 18000 },
  { month: "Feb", revenue: 28000, costs: 16000 },
  { month: "Mar", revenue: 35000, costs: 19000 },
  { month: "Apr", revenue: 42000, costs: 22000 },
  { month: "May", revenue: 38000, costs: 20000 },
  { month: "Jun", revenue: 45000, costs: 23000 },
]

const projectStatusData = [
  { name: "Completed", value: 45, color: "hsl(var(--chart-4))" },
  { name: "In Progress", value: 30, color: "hsl(var(--chart-1))" },
  { name: "Planning", value: 15, color: "hsl(var(--chart-5))" },
  { name: "On Hold", value: 10, color: "hsl(var(--chart-3))" },
]

const teamPerformanceData = [
  { name: "John Smith", projects: 8, efficiency: 92 },
  { name: "Sarah Johnson", projects: 6, efficiency: 88 },
  { name: "Mike Wilson", projects: 7, efficiency: 85 },
  { name: "Emma Davis", projects: 5, efficiency: 95 },
]

const costBredownData = [
  { category: "Materials", amount: 15000, color: "hsl(var(--chart-1))" },
  { category: "Labor", amount: 12000, color: "hsl(var(--chart-2))" },
  { category: "Equipment", amount: 8000, color: "hsl(var(--chart-3))" },
  { category: "Permits", amount: 3000, color: "hsl(var(--chart-4))" },
  { category: "Other", amount: 2000, color: "hsl(var(--chart-5))" },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Costs</CardTitle>
        <CardDescription>Monthly comparison over the last 6 months</CardDescription>
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
          <AreaChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="font-medium mb-2">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-sm">
                            {entry.dataKey === "revenue" ? "Revenue" : "Costs"}: £{entry.value?.toLocaleString()}
                          </span>
                        </div>
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
  )
}

export function ProjectStatusChart() {
  console.log("[v0] ProjectStatusChart rendering with data:", projectStatusData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status Distribution</CardTitle>
        <CardDescription>Current status of all projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Completed: {
              label: "Completed",
              color: "hsl(var(--chart-4))",
            },
            "In Progress": {
              label: "In Progress",
              color: "hsl(var(--chart-1))",
            },
            Planning: {
              label: "Planning",
              color: "hsl(var(--chart-5))",
            },
            "On Hold": {
              label: "On Hold",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <PieChart>
            <Pie
              data={projectStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {projectStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              content={({ active, payload }) => {
                console.log("[v0] ProjectStatusChart tooltip payload:", payload)
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-2">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm text-muted-foreground">{data.value}%</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {projectStatusData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm text-muted-foreground">({item.value}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TeamPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>Project completion and efficiency rates</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            projects: {
              label: "Projects",
              color: "hsl(var(--chart-1))",
            },
            efficiency: {
              label: "Efficiency %",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={teamPerformanceData}>
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="font-medium mb-2">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-sm">Projects: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="projects" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function CostBreakdownChart() {
  console.log("[v0] CostBreakdownChart rendering with data:", costBredownData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>Expense distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Materials: {
              label: "Materials",
              color: "hsl(var(--chart-1))",
            },
            Labor: {
              label: "Labor",
              color: "hsl(var(--chart-2))",
            },
            Equipment: {
              label: "Equipment",
              color: "hsl(var(--chart-3))",
            },
            Permits: {
              label: "Permits",
              color: "hsl(var(--chart-4))",
            },
            Other: {
              label: "Other",
              color: "hsl(var(--chart-5))",
            },
          }}
          className="h-[300px]"
        >
          <PieChart>
            <Pie
              data={costBredownData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="amount"
              nameKey="category"
              label={({ name, value }) => `${name}: £${value.toLocaleString()}`}
            >
              {costBredownData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              content={({ active, payload }) => {
                console.log("[v0] CostBreakdownChart tooltip payload:", payload)
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-2">
                      <p className="font-medium">{data.category}</p>
                      <p className="text-sm text-muted-foreground">£{data.amount.toLocaleString()}</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
