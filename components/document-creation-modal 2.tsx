"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, Wand2, Sparkles } from "lucide-react"

interface DocumentCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDocumentCreated: (document: { name: string; type: string; content?: string }) => void
  projectContext: {
    name: string
    client: string
    budget: number
    description: string
    phases: any[]
    team: any[]
  }
}

const documentTypes = [
  { value: "contract", label: "Contract Agreement" },
  { value: "proposal", label: "Project Proposal" },
  { value: "specification", label: "Technical Specification" },
  { value: "report", label: "Progress Report" },
  { value: "invoice", label: "Invoice" },
  { value: "safety", label: "Safety Guidelines" },
  { value: "checklist", label: "Quality Checklist" },
  { value: "manual", label: "User Manual" },
  { value: "other", label: "Other Document" }
]

export function DocumentCreationModal({ 
  open, 
  onOpenChange, 
  onDocumentCreated, 
  projectContext 
}: DocumentCreationModalProps) {
  const [documentType, setDocumentType] = useState("")
  const [documentTitle, setDocumentTitle] = useState("")
  const [requirements, setRequirements] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState("")

  const handleGenerate = async () => {
    if (!documentType || !documentTitle) return

    setIsGenerating(true)
    setGenerationStep("Analyzing project context...")

    try {
      // Simulate AI generation process with realistic steps
      const steps = [
        "Analyzing project context...",
        "Reviewing technical specifications...",
        "Consulting industry standards...", 
        "Generating document structure...",
        "Creating content with Manus AI...",
        "Finalizing document..."
      ]

      for (let i = 0; i < steps.length; i++) {
        setGenerationStep(steps[i])
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      // Simulate document creation
      const newDocument = {
        name: `${documentTitle}.pdf`,
        type: documentType,
        content: generateDocumentContent(documentType, documentTitle, requirements, projectContext)
      }

      onDocumentCreated(newDocument)
      
      // Reset form
      setDocumentType("")
      setDocumentTitle("")
      setRequirements("")
      onOpenChange(false)
      
    } catch (error) {
      console.error("Document generation failed:", error)
    } finally {
      setIsGenerating(false)
      setGenerationStep("")
    }
  }

  const generateDocumentContent = (type: string, title: string, reqs: string, context: any) => {
    // Simulate AI-generated content based on context
    return `AI-generated ${type} document for ${context.name} project with ${context.client}. Requirements: ${reqs}`
  }

  const getDocumentTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      contract: "Legal agreement outlining terms and conditions",
      proposal: "Detailed project proposal with scope and pricing", 
      specification: "Technical requirements and implementation details",
      report: "Progress update with milestones and metrics",
      invoice: "Billing document with itemized costs",
      safety: "Safety protocols and compliance guidelines",
      checklist: "Quality assurance and inspection checklist",
      manual: "User guide and operational instructions",
      other: "Custom document based on your requirements"
    }
    return descriptions[type] || ""
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-blue-500" />
            Create Document with Manus AI
          </DialogTitle>
        </DialogHeader>

        {!isGenerating ? (
          <div className="space-y-6">
            {/* Project Context Display */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Project Context</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium">Project:</span> {projectContext.name}</p>
                <p><span className="font-medium">Client:</span> {projectContext.client}</p>
                <p><span className="font-medium">Budget:</span> £{projectContext.budget.toLocaleString()}</p>
                <p><span className="font-medium">Team:</span> {projectContext.team.length} members</p>
              </div>
            </div>

            {/* Document Type Selection */}
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {documentType && (
                <p className="text-xs text-muted-foreground">
                  {getDocumentTypeDescription(documentType)}
                </p>
              )}
            </div>

            {/* Document Title */}
            <div className="space-y-2">
              <Label>Document Title</Label>
              <Input 
                placeholder="Enter document title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label>Additional Requirements</Label>
              <Textarea
                placeholder="Describe any specific requirements, sections, or details to include..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
              />
            </div>

            {/* AI Features Badge */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700">
                Manus AI will use your project data, industry standards, and requirements to generate a professional document
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={!documentType || !documentTitle}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
            </div>
          </div>
        ) : (
          /* Generation Progress */
          <div className="text-center py-8">
            <div className="relative mb-6">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
              <FileText className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Creating Your Document</h3>
            <p className="text-muted-foreground mb-4">{generationStep}</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Manus AI is analyzing your project and generating a professional document...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}