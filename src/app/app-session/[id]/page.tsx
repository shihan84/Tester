'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ScreenshotGallery } from '@/components/screenshot-gallery'
import { 
  Play, 
  Square, 
  Camera, 
  RotateCcw, 
  Settings, 
  Smartphone, 
  Tablet,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Battery,
  MemoryStick,
  Wifi,
  Signal,
  Bug,
  BarChart3,
  Package
} from 'lucide-react'
import { useSessions, type TestSession } from '@/hooks/use-api'

interface AppLog {
  id: string
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
  message: string
  timestamp: Date
  tag?: string
}

interface PerformanceMetrics {
  cpu: number
  memory: number
  battery: number
  network: number
  timestamp: Date
}

interface CrashReport {
  id: string
  message: string
  stackTrace?: string
  timestamp: Date
  isFatal: boolean
}

export default function AppTestSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  
  const [session, setSession] = useState<TestSession | null>(null)
  const [logs, setLogs] = useState<AppLog[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([])
  const [crashReports, setCrashReports] = useState<CrashReport[]>([])
  const [isRunning, setIsRunning] = useState(false)
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
      setIsRunning(data.status === 'RUNNING')
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
      fetchSession()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const installApp = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/install-app`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to install app')
      alert('App installed successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
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
              <h1 className="text-xl font-semibold">App Test Session</h1>
              <Badge variant="outline">{session.status}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Preview */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {session.browserDevice.device.type === 'MOBILE' && <Smartphone className="w-5 h-5" />}
                      {session.browserDevice.device.type === 'TABLET' && <Tablet className="w-5 h-5" />}
                      <span>{session.browserDevice.device.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {session.browserDevice.device.os} {session.browserDevice.device.osVersion}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isRunning ? (
                      <Button onClick={startSession} size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Start Session
                      </Button>
                    ) : (
                      <Button onClick={stopSession} variant="destructive" size="sm">
                        <Square className="w-4 h-4 mr-2" />
                        Stop Session
                      </Button>
                    )}
                    <Button onClick={installApp} variant="outline" size="sm" disabled={!isRunning}>
                      <Settings className="w-4 h-4 mr-2" />
                      Install App
                    </Button>
                    <Button onClick={takeScreenshot} variant="outline" size="sm" disabled={!isRunning}>
                      <Camera className="w-4 h-4 mr-2" />
                      Screenshot
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Device Preview Area */}
                  <div className="border rounded-lg bg-gray-900" style={{ height: '600px' }}>
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Android Device Preview</p>
                        <p className="text-sm">Start the session to begin testing</p>
                        {session.appPath && (
                          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                            <p className="text-xs">App: {session.appPath.split('/').pop()}</p>
                            <Badge variant="outline" className="mt-1">
                              {session.appType}
                            </Badge>
                          </div>
                        )}
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
                    <strong>App Type:</strong> {session.appType}
                  </div>
                  <div>
                    <strong>Status:</strong> {session.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Tabs defaultValue="logs" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="crashes">Crashes</TabsTrigger>
                <TabsTrigger value="screenshots">Shots</TabsTrigger>
              </TabsList>

              <TabsContent value="logs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">App Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {logs.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            No app logs yet
                          </div>
                        ) : (
                          logs.map((log) => (
                            <div key={log.id} className="flex items-start space-x-2 text-sm">
                              {getLogIcon(log.level)}
                              <div className="flex-1">
                                <div className="font-mono text-xs">{log.message}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                  {log.tag && <span className="ml-2">[{log.tag}]</span>}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <div>
                            <div className="text-xs text-muted-foreground">CPU</div>
                            <div className="font-medium">45%</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MemoryStick className="w-4 h-4 text-green-500" />
                          <div>
                            <div className="text-xs text-muted-foreground">Memory</div>
                            <div className="font-medium">128 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Battery className="w-4 h-4 text-yellow-500" />
                          <div>
                            <div className="text-xs text-muted-foreground">Battery</div>
                            <div className="font-medium">87%</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wifi className="w-4 h-4 text-purple-500" />
                          <div>
                            <div className="text-xs text-muted-foreground">Network</div>
                            <div className="font-medium">Good</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <BarChart3 className="w-4 h-4" />
                          <span className="text-sm font-medium">Performance Chart</span>
                        </div>
                        <div className="h-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          Performance metrics visualization
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="crashes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Crash Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {crashReports.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            <Bug className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No crashes detected</p>
                            <p className="text-sm">App is running smoothly</p>
                          </div>
                        ) : (
                          crashReports.map((crash) => (
                            <div key={crash.id} className="border rounded p-3 text-sm">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                  <span className="font-medium">
                                    {crash.isFatal ? 'Fatal Crash' : 'ANR'}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(crash.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-xs font-mono bg-muted p-2 rounded">
                                {crash.message}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="screenshots" className="space-y-4">
                <ScreenshotGallery
                  screenshots={session.screenshots || []}
                  onTakeScreenshot={takeScreenshot}
                  isRunning={isRunning}
                />
              </TabsContent>
            </Tabs>

            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div><strong>Session ID:</strong> {session.id}</div>
                <div><strong>App:</strong> {session.appPath?.split('/').pop() || 'No app'}</div>
                <div><strong>App Type:</strong> {session.appType}</div>
                <div><strong>Status:</strong> {session.status}</div>
                <div><strong>Started:</strong> {session.startedAt ? new Date(session.startedAt).toLocaleString() : 'Not started'}</div>
                <div><strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}