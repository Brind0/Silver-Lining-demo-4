"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Save, Clock } from "lucide-react"

interface OverrideStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  currentStatus: string
  onOverride: (reason: string) => void
}

export function OverrideStatusModal({
  open,
  onOpenChange,
  projectName,
  currentStatus,
  onOverride,
}: OverrideStatusModalProps) {
  const [reason, setReason] = useState(
    "Weather delay affecting timeline - materials delivery postponed by 3 days due to storm conditions",
  )
  const { toast } = useToast()

  const handleSave = () => {
    onOverride(reason)
    toast({
      title: "Status Override Recorded",
      description: `${projectName} status override saved to audit trail with timestamp.`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 max-w-[calc(100vw-2rem)]">
        {" "}
        {/* Mobile responsive width */}
        <DialogHeader>
          <DialogTitle className="flex items-center text-base">
            {" "}
            {/* Smaller title on mobile */}
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            Override Project Status
          </DialogTitle>
          <DialogDescription className="text-sm">
            Override the current status for <strong>{projectName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge
              variant={currentStatus === "RED" ? "destructive" : "secondary"}
              className={
                currentStatus === "AMBER"
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : currentStatus === "GREEN"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : ""
              }
            >
              {currentStatus}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Override Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for status override..."
              className="min-h-20 text-sm" // Smaller text on mobile
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2 text-sm text-blue-800">
              {" "}
              {/* Changed to items-start for mobile */}
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>This override will be recorded in the audit trail with timestamp and user details.</span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {" "}
          {/* Stack buttons on mobile */}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent h-10 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-10 w-full sm:w-auto">
            {" "}
            {/* Full width on mobile */}
            <Save className="h-4 w-4 mr-2" />
            Save Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
