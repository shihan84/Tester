'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Monitor, Smartphone, Tablet, Chrome, Play, Settings, History, Loader2, Globe, Compass, Upload, Package } from 'lucide-react'
import { SessionManagement } from '@/components/session-management'
import { useDevices, useBrowsers, useSessions, type Device, type Browser, type TestSession } from '@/hooks/use-api'

export default function Home() {
  const [selectedUrl, setSelectedUrl] = useState('')
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [selectedBrowserId, setSelectedBrowserId] = useState('')
  const [selectedAppFile, setSelectedAppFile] = useState<File | null>(null)
  const [testType, setTestType] = useState<'web' | 'app'>('web')
  const [isCreating, setIsCreating] = useState(false)

  const { devices, loading: devicesLoading } = useDevices()
  const { browsers, loading: browsersLoading } = useBrowsers()
  const { sessions, loading: sessionsLoading, createSession, refetch: refetchSessions } = useSessions()

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'DESKTOP': return Monitor
      case 'MOBILE': return Smartphone
      case 'TABLET': return Tablet
      default: return Monitor
    }
  }

  const getBrowserIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'chrome': return Chrome
      case 'firefox': return Globe
      case 'safari': return Compass
      default: return Globe
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

  const startWebTest = async () => {
    if (!selectedUrl || !selectedDeviceId || !selectedBrowserId) {
      alert('Please fill in all fields')
      return
    }

    setIsCreating(true)
    try {
      // Find the browser device ID that matches the selected device and browser
      const device = devices.find(d => d.id === selectedDeviceId)
      const browser = browsers.find(b => b.id === selectedBrowserId)
      
      if (!device || !browser) {
        alert('Invalid device or browser selection')
        return
      }

      const browserDevice = device.browserDevices.find(bd => bd.browserId === browser.id)
      if (!browserDevice) {
        alert('This browser is not available on the selected device')
        return
      }

      // Create session with demo user ID
      await createSession({
        userId: 'demo-user-id', // In a real app, this would come from authentication
        browserDeviceId: browserDevice.id,
        url: selectedUrl
      })

      // Reset form
      setSelectedUrl('')
      setSelectedDeviceId('')
      setSelectedBrowserId('')
      
      alert('Test session created successfully!')
    } catch (error) {
      console.error('Failed to create session:', error)
      alert('Failed to create test session')
    } finally {
      setIsCreating(false)
    }
  }

  const startAppTest = async () => {
    if (!selectedAppFile || !selectedDeviceId) {
      alert('Please select an app file and device')
      return
    }

    setIsCreating(true)
    try {
      const device = devices.find(d => d.id === selectedDeviceId)
      if (!device) {
        alert('Invalid device selection')
        return
      }

      // Upload app file and create session
      const formData = new FormData()
      formData.append('appFile', selectedAppFile)
      formData.append('deviceId', selectedDeviceId)
      formData.append('userId', 'demo-user-id')

      const response = await fetch('/api/upload-app', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload app')

      const result = await response.json()
      
      // Reset form
      setSelectedAppFile(null)
      setSelectedDeviceId('')
      
      alert('Android app test session created successfully!')
    } catch (error) {
      console.error('Failed to create app test session:', error)
      alert('Failed to create app test session')
    } finally {
      setIsCreating(false)
    }
  }

  const startTest = async () => {
    if (testType === 'web') {
      await startWebTest()
    } else {
      await startAppTest()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if it's an Android app file
      const validTypes = ['application/vnd.android.package-archive', 'application/octet-stream']
      const validExtensions = ['.apk', '.aab']
      
      const isValidType = validTypes.includes(file.type) || 
                         validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      
      if (isValidType) {
        setSelectedAppFile(file)
      } else {
        alert('Please select a valid Android app file (.apk or .aab)')
        event.target.value = ''
      }
    }
  }

  const handleStartSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/start`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to start session')
      refetchSessions()
    } catch (error) {
      console.error('Failed to start session:', error)
      alert('Failed to start session')
    }
  }

  const handleStopSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/stop`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to stop session')
      refetchSessions()
    } catch (error) {
      console.error('Failed to stop session:', error)
      alert('Failed to stop session')
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return
    
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete session')
      refetchSessions()
    } catch (error) {
      console.error('Failed to delete session:', error)
      alert('Failed to delete session')
    }
  }

  const formatTimestamp = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">BrowserTest Pro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="quick-test" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quick-test">Quick Test</TabsTrigger>
            <TabsTrigger value="app-test">App Test</TabsTrigger>
            <TabsTrigger value="devices">Devices & Browsers</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
          </TabsList>

          <TabsContent value="quick-test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Start New Test</CardTitle>
                <CardDescription>Test your website across different devices and browsers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website URL</label>
                  <Input
                    placeholder="https://example.com"
                    value={selectedUrl}
                    onChange={(e) => setSelectedUrl(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Device</label>
                    {devicesLoading ? (
                      <div className="flex items-center justify-center h-10">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a device" />
                        </SelectTrigger>
                        <SelectContent>
                          {devices.map((device) => {
                            const IconComponent = getDeviceIcon(device.type)
                            return (
                              <SelectItem key={device.id} value={device.id}>
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="w-4 h-4" />
                                  <div>
                                    <div className="font-medium">{device.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {device.os} {device.osVersion} • {device.resolution}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Browser</label>
                    {browsersLoading ? (
                      <div className="flex items-center justify-center h-10">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      <Select value={selectedBrowserId} onValueChange={setSelectedBrowserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a browser" />
                        </SelectTrigger>
                        <SelectContent>
                          {browsers.map((browser) => {
                            const IconComponent = getBrowserIcon(browser.name)
                            return (
                              <SelectItem key={browser.id} value={browser.id}>
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="w-4 h-4" />
                                  <div>
                                    <div className="font-medium">{browser.name}</div>
                                    <div className="text-xs text-muted-foreground">Version {browser.version}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={startTest} 
                  className="w-full" 
                  size="lg"
                  disabled={isCreating || devicesLoading || browsersLoading}
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Start Test Session
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Test Sessions</CardTitle>
                <CardDescription>Your latest testing activities</CardDescription>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                          <div>
                            <div className="font-medium">{session.url || session.appPath?.split('/').pop() || 'No URL/App'}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.browserDevice.device.name} • {session.browserDevice.browser.name}
                              {session.appType && (
                                <Badge variant="outline" className="ml-2">
                                  {session.appType.replace('_', ' ')}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{formatTimestamp(session.createdAt)}</div>
                          <div className="flex items-center justify-end space-x-2 mt-1">
                            <Badge variant="outline">{session.status}</Badge>
                            <Button variant="outline" size="sm" onClick={() => {
                              const sessionUrl = session.appType 
                                ? `/app-session/${session.id}` 
                                : `/session/${session.id}`
                              window.open(sessionUrl, '_blank')
                            }}>View</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="app-test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Test Android Application</span>
                </CardTitle>
                <CardDescription>Upload and test your Android app on real devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Android App (.apk or .aab)</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your app file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".apk,.aab"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="app-upload"
                    />
                    <label htmlFor="app-upload">
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        Select File
                      </Button>
                    </label>
                    {selectedAppFile && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span className="text-sm font-medium">{selectedAppFile.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {(selectedAppFile.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Device</label>
                  {devicesLoading ? (
                    <div className="flex items-center justify-center h-10">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a device" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices
                          .filter(device => device.type === 'MOBILE' || device.type === 'TABLET')
                          .map((device) => {
                            const IconComponent = getDeviceIcon(device.type)
                            return (
                              <SelectItem key={device.id} value={device.id}>
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="w-4 h-4" />
                                  <div>
                                    <div className="font-medium">{device.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {device.os} {device.osVersion} • {device.resolution}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <Button 
                  onClick={startAppTest} 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedAppFile || !selectedDeviceId || isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Package className="w-4 h-4 mr-2" />
                  )}
                  Start App Test Session
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Android App Testing Features</CardTitle>
                <CardDescription>What you can do with Android app testing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">App Installation</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically install your APK or AAB file on selected Android devices
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Real Device Testing</h4>
                    <p className="text-sm text-muted-foreground">
                      Test on real Android devices with different OS versions and manufacturers
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Performance Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor app performance, memory usage, and battery consumption
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Crash Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically capture and report app crashes and errors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            {devicesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => {
                  const IconComponent = getDeviceIcon(device.type)
                  return (
                    <Card key={device.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5" />
                          <span>{device.name}</span>
                        </CardTitle>
                        <CardDescription>{device.type.toLowerCase()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div><strong>OS:</strong> {device.os} {device.osVersion}</div>
                          <div><strong>Resolution:</strong> {device.resolution}</div>
                          <div><strong>Available Browsers:</strong> {device.browserDevices.length}</div>
                          <div className="pt-2">
                            <Badge variant="outline">Active</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <SessionManagement
              sessions={sessions}
              onRefresh={refetchSessions}
              onStartSession={handleStartSession}
              onStopSession={handleStopSession}
              onDeleteSession={handleDeleteSession}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}