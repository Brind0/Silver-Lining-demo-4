"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  Printer,
  Share2,
  Eye,
  Calendar,
  User,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react"

interface DocumentViewerProps {
  document: {
    id: string
    filename: string
    title: string
    generatedAt: string
    projectName: string
    requester: string
    content: DocumentSection[]
  }
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

export function DocumentViewer({ document, isHighlighted = false }: DocumentViewerProps) {
  const [isExpanded, setIsExpanded] = useState(isHighlighted)

  const handleExport = (format: 'pdf' | 'word' | 'print') => {
    console.log(`Exporting document as ${format}`)
    // In real implementation, this would handle the export
  }

  const renderContent = (content: string | DocumentSubsection[]) => {
    if (typeof content === 'string') {
      return <div className="prose max-w-none">{content}</div>
    }

    return content.map((subsection, index) => (
      <div key={index} className="mb-4">
        {subsection.subtitle && (
          <h4 className="font-semibold text-gray-800 mb-2">{subsection.subtitle}</h4>
        )}

        {subsection.type === 'bullet' && (
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {subsection.content.split('\n').filter(line => line.trim()).map((bullet, i) => (
              <li key={i}>{bullet.replace('•', '').trim()}</li>
            ))}
          </ul>
        )}

        {subsection.type === 'highlight' && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <p className="text-blue-900 font-medium">{subsection.content}</p>
          </div>
        )}

        {subsection.type === 'metric' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
            <p className="text-green-800">{subsection.content}</p>
          </div>
        )}

        {subsection.type === 'paragraph' && (
          <p className="text-gray-700 leading-relaxed">{subsection.content}</p>
        )}
      </div>
    ))
  }

  if (!isExpanded) {
    return (
      <Card className={`border transition-all duration-300 cursor-pointer hover:shadow-md ${
        isHighlighted ? 'border-indigo-300 bg-indigo-50 shadow-md ring-2 ring-indigo-200' : 'border-gray-200'
      }`}>
        <CardContent className="p-4" onClick={() => setIsExpanded(true)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`mt-1 p-2 rounded-lg ${
                isHighlighted ? 'bg-indigo-100' : 'bg-gray-100'
              }`}>
                <FileText className={`w-5 h-5 ${
                  isHighlighted ? 'text-indigo-600' : 'text-gray-600'
                }`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{document.filename}</h3>
                  {isHighlighted && (
                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{document.requester}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(document.generatedAt).toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Executive briefing document • Click to view full content
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="ml-2">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 shadow-lg">
      <CardHeader className="border-b bg-gray-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              <CardTitle className="text-xl text-gray-900">{document.title}</CardTitle>
              {isHighlighted && (
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  New
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
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

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('print')}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(false)}>
              Collapse
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="max-h-96 overflow-y-auto">
        <div className="space-y-8 py-6">
          {document.content.map((section, index) => (
            <div key={section.id}>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  {section.title}
                </h2>
                <div className="pl-4">
                  {renderContent(section.content)}
                </div>
              </div>

              {index < document.content.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}
        </div>
      </CardContent>

      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Professional briefing document generated by Meeting Prep Assistant
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-1" />
              Schedule Review
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}