"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/main-layout"
import { toast } from "sonner"
import { Copy, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"

interface WebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
}

export default function SetupPage() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    checkWebhookStatus()
  }, [])

  const checkWebhookStatus = async () => {
    try {
      const response = await fetch('/api/setup-telegram')
      const data = await response.json()
      setIsConfigured(data.configured)
      if (data.webhook) {
        setWebhookInfo(data.webhook)
        setWebhookUrl(data.webhook.url || '')
      }
    } catch (error) {
      console.error('Error checking webhook status:', error)
    }
  }

  const setupWebhook = async () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/setup-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webhookUrl })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Webhook configured successfully!')
        await checkWebhookStatus()
      } else {
        toast.error(`Failed to setup webhook: ${result.error}`)
      }
    } catch (error) {
      console.error('Error setting up webhook:', error)
      toast.error('Failed to setup webhook')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const ngrokUrl = `https://your-ngrok-url.ngrok.io/api/webhooks/telegram`

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Telegram Bot Setup</h1>
          <p className="text-muted-foreground">
            Configure your Telegram bot to receive receipts from your phone
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Setup Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>
                Follow these steps to connect your Telegram bot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium">Create Telegram Bot</h4>
                    <p className="text-sm text-muted-foreground">
                      Message <code>@BotFather</code> on Telegram:
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
                        /newbot
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
                        Silver Lining Receipt Bot
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
                        silverlining_receipts_bot
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium">Add Bot Token to Environment</h4>
                    <p className="text-sm text-muted-foreground">
                      Copy the token from BotFather and add to <code>.env.local</code>:
                    </p>
                    <div className="mt-2">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
                        TELEGRAM_BOT_TOKEN=your_token_here
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium">Start ngrok</h4>
                    <p className="text-sm text-muted-foreground">Run in a new terminal:</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono flex-1">
                        ngrok http 3000
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard('ngrok http 3000')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">4</div>
                  <div>
                    <h4 className="font-medium">Configure Webhook</h4>
                    <p className="text-sm text-muted-foreground">
                      Copy your ngrok URL and configure the webhook below
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Set up the webhook URL for your Telegram bot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="webhookUrl"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-ngrok-url.ngrok.io/api/webhooks/telegram"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard('/api/webhooks/telegram')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Replace "your-ngrok-url" with your actual ngrok URL
                </p>
              </div>

              <Button onClick={setupWebhook} disabled={isLoading} className="w-full">
                {isLoading ? "Setting up..." : "Configure Webhook"}
              </Button>

              {/* Status */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  {isConfigured ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Configured
                    </Badge>
                  )}
                </div>

                {webhookInfo && (
                  <div className="text-sm space-y-1">
                    <div className="text-muted-foreground">
                      Current webhook: <span className="font-mono">{webhookInfo.url}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Pending updates: {webhookInfo.pending_update_count}
                    </div>
                    {webhookInfo.last_error_message && (
                      <div className="text-red-600 text-xs">
                        Last error: {webhookInfo.last_error_message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Useful links for testing and monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" asChild>
                <a href="/receipts" className="flex items-center space-x-2">
                  <span>Receipts Dashboard</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/test-telegram" className="flex items-center space-x-2">
                  <span>Test Webhook</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>

              <Button variant="outline" asChild>
                <a href="https://core.telegram.org/bots/api" target="_blank" className="flex items-center space-x-2">
                  <span>Telegram Bot API</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              Required configuration in your .env.local file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm font-mono space-y-1">
              <div># Telegram Bot</div>
              <div>TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather</div>
              <div></div>
              <div># Optional: Google Vision API for real OCR</div>
              <div>GOOGLE_VISION_API_KEY=your_google_vision_key</div>
              <div></div>
              <div># Demo Mode (uses mock OCR)</div>
              <div>DEMO_MODE=true</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}