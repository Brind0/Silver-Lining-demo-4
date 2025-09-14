"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  Printer,
  X,
  User,
  Clock,
  Sparkles,
} from "lucide-react"

interface FullscreenDocumentViewerProps {
  document: {
    id: string
    filename: string
    title: string
    generatedAt: string
    projectName: string
    requester: string
    content: DocumentSection[]
  }
  onClose: () => void
  isHighlighted?: boolean
}

interface DocumentSection {
  id: string
  title: string
  content: string | DocumentSubsection[]
  type: 'text' | 'metrics' | 'list' | 'table'
}

interface DocumentSubsection {
  subtitle?: string
  content: string
  type: 'paragraph' | 'bullet' | 'metric' | 'highlight'
}

export function FullscreenDocumentViewer({
  document,
  onClose,
  isHighlighted = false
}: FullscreenDocumentViewerProps) {
  const handleExport = (format: 'pdf' | 'word' | 'print') => {
    console.log(`Exporting document as ${format}`)
    // In real implementation, this would handle the export
  }

  const renderContent = (content: string | DocumentSubsection[]) => {
    if (typeof content === 'string') {
      return <div className="prose max-w-none text-gray-700">{content}</div>
    }

    return content.map((subsection, index) => (
      <div key={index} className="mb-6">
        {subsection.subtitle && (
          <h4 className="font-semibold text-gray-800 mb-3 text-lg">{subsection.subtitle}</h4>
        )}

        {subsection.type === 'bullet' && (
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 text-base leading-relaxed">
            {subsection.content.split('\n').filter(line => line.trim()).map((bullet, i) => (
              <li key={i}>{bullet.replace('•', '').trim()}</li>
            ))}
          </ul>
        )}

        {subsection.type === 'highlight' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-blue-900 font-medium text-base leading-relaxed">{subsection.content}</p>
          </div>
        )}

        {subsection.type === 'metric' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-5">
            <p className="text-green-800 text-base leading-relaxed">{subsection.content}</p>
          </div>
        )}

        {subsection.type === 'paragraph' && (
          <p className="text-gray-700 leading-relaxed text-base mb-4">{subsection.content}</p>
        )}
      </div>
    ))
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header Bar */}
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{document.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Requested by {document.requester}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Generated {new Date(document.generatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {isHighlighted && (
            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
              <Sparkles className="w-3 h-3 mr-1" />
              New
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('print')}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Document Content - Now with proper flex-1 and overflow */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white shadow-sm">
          {/* Document Header */}
          <div className="px-12 py-8 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.title}</h1>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>Generated: {new Date(document.generatedAt).toLocaleString()}</span>
              <span>•</span>
              <span>Requested by: {document.requester}</span>
            </div>
          </div>

          {/* Document Sections */}
          <div className="px-12 py-8 space-y-10">
            {document.content.map((section, index) => (
              <div key={section.id}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                    {section.title}
                  </h2>
                  <div className="pl-2">
                    {renderContent(section.content)}
                  </div>
                </div>

                {index < document.content.length - 1 && (
                  <Separator className="my-8" />
                )}
              </div>
            ))}
          </div>

          {/* Document Footer */}
          <div className="px-12 py-6 border-t bg-gray-50">
            <div className="text-center text-sm text-gray-600">
              Professional briefing document generated by Meeting Prep Assistant
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}