"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface AuditEntry {
  id: number
  timestamp: string
  user: string
  action: string
  details: string
  type: "override" | "approval" | "status_change"
  project?: string
}

const auditEntries: AuditEntry[] = [
  {
    id: 1,
    timestamp: "2024-02-15 14:32:15",
    user: "Emily (Operations Director)",
    action: "Status Override",
    details: "Weather delay affecting timeline - materials delivery postponed by 3 days due to storm conditions",
    type: "override",
    project: "Henderson Golf Sim",
  },
  {
    id: 2,
    timestamp: "2024-02-15 11:45:22",
    user: "Emily (Operations Director)",
    action: "Expense Approved",
    details: "Approved £2,500 equipment purchase for Henderson Golf Sim project",
    type: "approval",
    project: "Henderson Golf Sim",
  },
  {
    id: 3,
    timestamp: "2024-02-14 16:18:33",
    user: "System",
    action: "Status Change",
    details: "Marchmont Historic automatically changed from AMBER to RED due to budget overrun exceeding 35%",
    type: "status_change",
    project: "Marchmont Historic",
  },
  {
    id: 4,
    timestamp: "2024-02-14 09:12:45",
    user: "Emily (Operations Director)",
    action: "Expense Rejected",
    details: "Rejected £850 miscellaneous expense - insufficient documentation provided",
    type: "approval",
    project: "Tunbridge Restoration",
  },
  {
    id: 5,
    timestamp: "2024-02-13 13:27:18",
    user: "Emily (Operations Director)",
    action: "Status Override",
    details: "Client requested timeline extension - adjusting project schedule accordingly",
    type: "override",
    project: "Wentworth Golf Sim",
  },
]

function getActionIcon(type: string) {
  switch (type) {
    case "override":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    case "approval":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "status_change":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

function getActionBadge(type: string) {
  switch (type) {
    case "override":
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
          Override
        </Badge>
      )
    case "approval":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
          Approval
        </Badge>
      )
    case "status_change":
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
          Auto Change
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function AuditTrail() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Audit Trail
        </CardTitle>
        <CardDescription>Complete record of all system actions and overrides</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {auditEntries.map((entry) => (
            <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
              <div className="flex-shrink-0 mt-1">{getActionIcon(entry.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{entry.action}</span>
                    {getActionBadge(entry.type)}
                  </div>
                  <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                </div>
                {entry.project && <div className="text-xs text-muted-foreground">Project: {entry.project}</div>}
                <p className="text-sm text-muted-foreground">{entry.details}</p>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{entry.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
