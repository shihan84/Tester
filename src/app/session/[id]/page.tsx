'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ScreenshotGallery } from '@/components/screenshot-gallery'
import { ScreenshotComparison } from '@/components/screenshot-comparison'
import { DebugTools } from '@/components/debug-tools'
import { ResponsiveTest } from '@/components/responsive-test'
import { 
  Play, 
  Pause, 
  Square, 
  Camera, 
  RotateCcw, 
  Settings, 
  Monitor, 
  Smartphone, 
  Tablet,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Compass
} from 'lucide-react'
import { useSessions, type TestSession } from '@/hooks/use-api'

interface TestLog {
  id: string
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
  message: string
  timestamp: Date
  metadata?: string
}

interface NetworkRequest {
  id: string
  method: string
  url: string
  status?: number
  timestamp: Date
  duration?: number
  requestSize?: number
  responseSize?: number
}

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  
  const [session, setSession] = useState<TestSession | null>(null)
  const [logs, setLogs] = useState<TestLog[]>([])
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([])
  const [screenshots, setScreenshots] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSession()
  }, [sessionId])

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`)
      if (!response.ok) throw new Error('Failed to fetch session')
      const data = await response.json()
      setSession(data)
      setCurrentUrl(data.url || '')
      setIsRunning(data.status === 'RUNNING')
      setScreenshots(data.screenshots || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const startSession = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/start`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to start session')
      setIsRunning(true)
      fetchSession()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const stopSession = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/stop`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to stop session')
      setIsRunning(false)
      fetchSession()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const takeScreenshot = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/screenshot`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to take screenshot')
      const newScreenshot = await response.json()
      setScreenshots(prev => [newScreenshot, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const refreshPage = () => {
    // Simulate page refresh
    console.log('Refreshing page:', currentUrl)
  }

  const clearLogs = () => {
    setLogs([])
  }

  const clearNetwork = () => {
    setNetworkRequests([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500'
      case 'RUNNING': return 'bg-blue-500'
      case 'FAILED': return 'bg-red-500'
      case 'CREATED': return 'bg-yellow-500'
      case 'CANCELLED': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'WARN': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'INFO': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'DEBUG': return <Clock className="w-4 h-4 text-gray-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600'
    if (status >= 400 && status < 500) return 'text-yellow-600'
    if (status >= 500) return 'text-red-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error || 'Session not found'}</p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
              <h1 className="text-xl font-semibold">Test Session</h1>
              <Badge variant="outline">{session.status}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={refreshPage}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Browser Preview */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {session.browserDevice.device.type === 'DESKTOP' && <Monitor className="w-5 h-5" />}
                      {session.browserDevice.device.type === 'MOBILE' && <Smartphone className="w-5 h-5" />}
                      {session.browserDevice.device.type === 'TABLET' && <Tablet className="w-5 h-5" />}
                      <span>{session.browserDevice.device.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {session.browserDevice.browser.name} {session.browserDevice.browser.version}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isRunning ? (
                      <Button onClick={startSession} size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={stopSession} variant="destructive" size="sm">
                        <Square className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    )}
                    <Button onClick={takeScreenshot} variant="outline" size="sm" disabled={!isRunning}>
                      <Camera className="w-4 h-4 mr-2" />
                      Screenshot
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      placeholder="Enter URL to test"
                      disabled={!isRunning}
                    />
                    <Button onClick={refreshPage} variant="outline" disabled={!isRunning}>
                      Go
                    </Button>
                  </div>
                  
                  {/* Browser Preview Area */}
                  <div className="border rounded-lg bg-white" style={{ height: '600px' }}>
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Browser preview will appear here</p>
                        <p className="text-sm mt-2">Start the session to begin testing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Info */}
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Device:</strong> {session.browserDevice.device.name}
                  </div>
                  <div>
                    <strong>Type:</strong> {session.browserDevice.device.type.toLowerCase()}
                  </div>
                  <div>
                    <strong>OS:</strong> {session.browserDevice.device.os} {session.browserDevice.device.osVersion}
                  </div>
                  <div>
                    <strong>Resolution:</strong> {session.browserDevice.device.resolution}
                  </div>
                  <div>
                    <strong>Browser:</strong> {session.browserDevice.browser.name}
                  </div>
                  <div>
                    <strong>Version:</strong> {session.browserDevice.browser.version}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Tabs defaultValue="debug" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="debug">Debug Tools</TabsTrigger>
                <TabsTrigger value="responsive">Responsive</TabsTrigger>
                <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                <TabsTrigger value="info">Session Info</TabsTrigger>
              </TabsList>

              <TabsContent value="debug" className="space-y-4">
                <DebugTools
                  logs={logs}
                  networkRequests={networkRequests}
                  onClearLogs={clearLogs}
                  onClearNetwork={clearNetwork}
                  isRunning={isRunning}
                />
              </TabsContent>

              <TabsContent value="responsive" className="space-y-4">
                <ResponsiveTest
                  url={currentUrl}
                  onUrlChange={setCurrentUrl}
                  isRunning={isRunning}
                />
              </TabsContent>

              <TabsContent value="screenshots" className="space-y-4">
                <ScreenshotGallery
                  screenshots={screenshots}
                  onTakeScreenshot={takeScreenshot}
                  isRunning={isRunning}
                />
                <ScreenshotComparison screenshots={screenshots} />
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Session Information</CardTitle>
                    <CardDescription>Details about this test session</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Session ID:</strong>
                        <div className="font-mono text-xs text-muted-foreground mt-1">
                          {session.id}
                        </div>
                      </div>
                      <div>
                        <strong>Status:</strong>
                        <div className="mt-1">
                          <Badge variant="outline">{session.status}</Badge>
                        </div>
                      </div>
                      <div>
                        <strong>URL:</strong>
                        <div className="text-muted-foreground mt-1">
                          {session.url || 'Not set'}
                        </div>
                      </div>
                      <div>
                        <strong>Started:</strong>
                        <div className="text-muted-foreground mt-1">
                          {session.startedAt ? new Date(session.startedAt).toLocaleString() : 'Not started'}
                        </div>
                      </div>
                      <div>
                        <strong>Ended:</strong>
                        <div className="text-muted-foreground mt-1">
                          {session.endedAt ? new Date(session.endedAt).toLocaleString() : 'Running'}
                        </div>
                      </div>
                      <div>
                        <strong>Created:</strong>
                        <div className="text-muted-foreground mt-1">
                          {new Date(session.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Device Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Device:</strong> {session.browserDevice.device.name}
                      </div>
                      <div>
                        <strong>Type:</strong> {session.browserDevice.device.type.toLowerCase()}
                      </div>
                      <div>
                        <strong>OS:</strong> {session.browserDevice.device.os} {session.browserDevice.device.osVersion}
                      </div>
                      <div>
                        <strong>Resolution:</strong> {session.browserDevice.device.resolution}
                      </div>
                      <div>
                        <strong>Browser:</strong> {session.browserDevice.browser.name}
                      </div>
                      <div>
                        <strong>Version:</strong> {session.browserDevice.browser.version}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Session Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{screenshots.length}</div>
                        <div className="text-sm text-muted-foreground">Screenshots</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{logs.length}</div>
                        <div className="text-sm text-muted-foreground">Log Entries</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{networkRequests.length}</div>
                        <div className="text-sm text-muted-foreground">Network Requests</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {session.startedAt && session.endedAt 
                            ? Math.floor((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000)
                            : 0
                          }s
                        </div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}