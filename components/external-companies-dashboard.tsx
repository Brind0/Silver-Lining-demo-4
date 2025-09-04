"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ExternalCompanyMetrics } from "@/lib/types/messages"

interface ExternalCompaniesDashboardProps {
  className?: string
}

// Mock data for external company metrics
const mockCompanyMetrics: ExternalCompanyMetrics[] = [
  {
    contactId: 'contact-4',
    contact: {
      id: 'contact-4',
      name: 'Thames Water Utilities',
      email: 'permits@thameswater.co.uk',
      company: 'Thames Water',
      avatar: '/placeholder.svg?height=40&width=40',
      category: 'external',
      reliabilityScore: 6,
      avgResponseTime: 2.3,
      isVip: false,
      created_at: '',
      updated_at: ''
    },
    totalMessages: 45,
    averageResponseTime: 2.3,
    reliabilityScore: 6,
    pendingResponses: 3,
    overdueResponses: 1,
    lastChaseDate: '2024-02-12T10:00:00Z',
    nextChaseDate: '2024-02-16T09:00:00Z',
    communicationTrend: 'declining'
  },
  {
    contactId: 'contact-5',
    contact: {
      id: 'contact-5',
      name: 'British Gas Business',
      email: 'business@britishgas.co.uk',
      company: 'British Gas',
      avatar: '/placeholder.svg?height=40&width=40',
      category: 'external',
      reliabilityScore: 8,
      avgResponseTime: 1.1,
      isVip: false,
      created_at: '',
      updated_at: ''
    },
    totalMessages: 23,
    averageResponseTime: 1.1,
    reliabilityScore: 8,
    pendingResponses: 1,
    overdueResponses: 0,
    communicationTrend: 'stable'
  },
  {
    contactId: 'contact-6',
    contact: {
      id: 'contact-6',
      name: 'Electrical Supplies Ltd',
      email: 'orders@electricalsupplies.co.uk',
      company: 'Electrical Supplies Ltd',
      avatar: '/placeholder.svg?height=40&width=40',
      category: 'external',
      reliabilityScore: 9,
      avgResponseTime: 0.8,
      isVip: false,
      created_at: '',
      updated_at: ''
    },
    totalMessages: 67,
    averageResponseTime: 0.8,
    reliabilityScore: 9,
    pendingResponses: 0,
    overdueResponses: 0,
    communicationTrend: 'improving'
  },
  {
    contactId: 'contact-7',
    contact: {
      id: 'contact-7',
      name: 'Heritage Consultants',
      email: 'info@heritageconsultants.co.uk',
      company: 'Heritage Consultants',
      avatar: '/placeholder.svg?height=40&width=40',
      category: 'external',
      reliabilityScore: 7,
      avgResponseTime: 1.9,
      isVip: false,
      created_at: '',
      updated_at: ''
    },
    totalMessages: 31,
    averageResponseTime: 1.9,
    reliabilityScore: 7,
    pendingResponses: 2,
    overdueResponses: 0,
    communicationTrend: 'stable'
  }
]

export function ExternalCompaniesDashboard({ className }: ExternalCompaniesDashboardProps) {
  const [metrics, setMetrics] = useState<ExternalCompanyMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'reliability' | 'response_time' | 'pending'>('reliability')

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // In real app, this would fetch from API
        // const response = await fetch('/api/external-companies')
        // const data = await response.json()
        // setMetrics(data.metrics)
        
        // Using mock data for now
        setMetrics(mockCompanyMetrics)
      } catch (error) {
        console.error('Error fetching company metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const sortedMetrics = [...metrics].sort((a, b) => {
    switch (sortBy) {
      case 'reliability':
        return a.reliabilityScore - b.reliabilityScore // Ascending (worst first)
      case 'response_time':
        return b.averageResponseTime - a.averageResponseTime // Descending (slowest first)
      case 'pending':
        return b.pendingResponses - a.pendingResponses // Descending (most pending first)
      default:
        return 0
    }
  })

  const getReliabilityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getReliabilityLabel = (score: number) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Average'
    return 'Poor'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDaysAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  const getNextAction = (metric: ExternalCompanyMetrics) => {
    if (metric.overdueResponses > 0) return { action: 'Escalate Now', urgent: true }
    if (metric.pendingResponses > 2) return { action: 'Follow Up', urgent: true }
    if (metric.nextChaseDate) {
      const nextChase = new Date(metric.nextChaseDate)
      const now = new Date()
      if (nextChase <= now) return { action: 'Chase Due', urgent: true }
      if (nextChase.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) return { action: 'Chase Tomorrow', urgent: false }
    }
    return { action: 'Monitor', urgent: false }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            External Company Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              External Company Dashboard
            </CardTitle>
            <CardDescription>
              Track communication performance and follow-up requirements
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === 'reliability' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('reliability')}
            >
              Reliability
            </Button>
            <Button
              variant={sortBy === 'response_time' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('response_time')}
            >
              Speed
            </Button>
            <Button
              variant={sortBy === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('pending')}
            >
              Pending
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending">Pending Actions</TabsTrigger>
            <TabsTrigger value="schedule">Chase Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {sortedMetrics.map((metric) => {
                  const nextAction = getNextAction(metric)
                  return (
                    <Card key={metric.contactId} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={metric.contact.avatar} />
                            <AvatarFallback>
                              {metric.contact.company?.charAt(0) || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-sm truncate">
                                {metric.contact.company}
                              </h3>
                              <div className="flex items-center space-x-2">
                                {getTrendIcon(metric.communicationTrend)}
                                <Badge
                                  variant="outline"
                                  className={cn("text-xs", getReliabilityColor(metric.reliabilityScore))}
                                >
                                  {getReliabilityLabel(metric.reliabilityScore)}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Response Time</div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    {metric.averageResponseTime} days
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Messages</div>
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm font-medium">{metric.totalMessages}</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Pending</div>
                                <div className="flex items-center space-x-1">
                                  {metric.pendingResponses > 0 ? (
                                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                                  ) : (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  )}
                                  <span className="text-sm font-medium">{metric.pendingResponses}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {metric.lastChaseDate && (
                                  <span>Last chase: {formatDaysAgo(metric.lastChaseDate)}</span>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={nextAction.urgent ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {nextAction.action}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  <Phone className="h-3 w-3 mr-1" />
                                  Call
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4">
              {sortedMetrics
                .filter(m => m.pendingResponses > 0 || m.overdueResponses > 0)
                .map((metric) => (
                  <Card key={metric.contactId} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{metric.contact.company}</h4>
                          <p className="text-sm text-muted-foreground">
                            {metric.pendingResponses} pending, {metric.overdueResponses} overdue
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Follow Up
                          </Button>
                          <Button size="sm" variant="destructive">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Escalate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {sortedMetrics.filter(m => m.pendingResponses > 0 || m.overdueResponses > 0).length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    All caught up!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No pending responses from external companies.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-3">
              {sortedMetrics
                .filter(m => m.nextChaseDate)
                .sort((a, b) => new Date(a.nextChaseDate!).getTime() - new Date(b.nextChaseDate!).getTime())
                .map((metric) => (
                  <Card key={metric.contactId}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={metric.contact.avatar} />
                            <AvatarFallback>{metric.contact.company?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{metric.contact.company}</h4>
                            <p className="text-xs text-muted-foreground">
                              Auto-chase scheduled
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {new Date(metric.nextChaseDate!).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(metric.nextChaseDate!).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                          
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}