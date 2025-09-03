'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Bug, 
  Zap, 
  Wifi, 
  WifiOff, 
  Filter,
  Search,
  Download,
  Trash2,
  Pause,
  Play
} from 'lucide-react'

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

interface PerformanceMetrics {
  loadTime?: number
  domContentLoaded?: number
  firstPaint?: number
  memoryUsage?: number
  cpuUsage?: number
}

interface DebugToolsProps {
  logs: TestLog[]
  networkRequests: NetworkRequest[]
  onClearLogs: () => void
  onClearNetwork: () => void
  isRunning: boolean
}

export function DebugTools({ 
  logs, 
  networkRequests, 
  onClearLogs, 
  onClearNetwork, 
  isRunning 
}: DebugToolsProps) {
  const [logFilter, setLogFilter] = useState<string>('all')
  const [logSearch, setLogSearch] = useState('')
  const [networkFilter, setNetworkFilter] = useState<string>('all')
  const [networkSearch, setNetworkSearch] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({})

  // Simulate performance metrics
  useEffect(() => {
    if (isRunning && !isPaused) {
      const interval = setInterval(() => {
        setPerformanceMetrics({
          loadTime: Math.random() * 1000 + 500,
          domContentLoaded: Math.random() * 800 + 200,
          firstPaint: Math.random() * 600 + 100,
          memoryUsage: Math.random() * 100 + 50,
          cpuUsage: Math.random() * 30 + 10
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isRunning, isPaused])

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'WARN': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'INFO': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'DEBUG': return <Clock className="w-4 h-4 text-gray-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600'
    if (status >= 400 && status < 500) return 'text-yellow-600'
    if (status >= 500) return 'text-red-600'
    return 'text-gray-600'
  }

  const filteredLogs = logs.filter(log => {
    const matchesFilter = logFilter === 'all' || log.level === logFilter
    const matchesSearch = log.message.toLowerCase().includes(logSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filteredNetworkRequests = networkRequests.filter(request => {
    const matchesFilter = networkFilter === 'all' || 
      (networkFilter === 'success' && request.status && request.status >= 200 && request.status < 300) ||
      (networkFilter === 'error' && request.status && request.status >= 400)
    
    const matchesSearch = request.url.toLowerCase().includes(networkSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const exportLogs = () => {
    const data = JSON.stringify(logs, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportNetwork = () => {
    const data = JSON.stringify(networkRequests, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `network-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Performance Metrics */}
      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Performance Metrics</span>
            </CardTitle>
            <CardDescription>Real-time performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {performanceMetrics.loadTime?.toFixed(0) || 0}ms
                </div>
                <div className="text-xs text-muted-foreground">Load Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {performanceMetrics.domContentLoaded?.toFixed(0) || 0}ms
                </div>
                <div className="text-xs text-muted-foreground">DOM Ready</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {performanceMetrics.memoryUsage?.toFixed(0) || 0}MB
                </div>
                <div className="text-xs text-muted-foreground">Memory</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {performanceMetrics.cpuUsage?.toFixed(0) || 0}%
                </div>
                <div className="text-xs text-muted-foreground">CPU Usage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="console" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="console">Console Logs</TabsTrigger>
          <TabsTrigger value="network">Network Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="console" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Bug className="w-5 h-5" />
                    <span>Console Logs</span>
                  </CardTitle>
                  <CardDescription>Application logs and debugging information</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPaused(!isPaused)}
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportLogs}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={onClearLogs}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Log Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search logs..."
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={logFilter} onValueChange={setLogFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="ERROR">Errors</SelectItem>
                    <SelectItem value="WARN">Warnings</SelectItem>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="DEBUG">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Logs List */}
              <ScrollArea className="h-96 border rounded-lg">
                <div className="p-4 space-y-2">
                  {filteredLogs.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Bug className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No logs found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  ) : (
                    filteredLogs.map((log) => (
                      <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                        {getLogIcon(log.level)}
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm break-all">{log.message}</div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <Badge variant="outline" className="text-xs">
                              {log.level}
                            </Badge>
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

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {isRunning ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-gray-500" />}
                    <span>Network Requests</span>
                  </CardTitle>
                  <CardDescription>HTTP requests and network activity</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={exportNetwork}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={onClearNetwork}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Network Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search requests..."
                      value={networkSearch}
                      onChange={(e) => setNetworkSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={networkFilter} onValueChange={setNetworkFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="success">Success (2xx)</SelectItem>
                    <SelectItem value="error">Errors (4xx, 5xx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Network Requests List */}
              <ScrollArea className="h-96 border rounded-lg">
                <div className="p-4 space-y-2">
                  {filteredNetworkRequests.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <WifiOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No network requests found</p>
                      <p className="text-sm">Network activity will appear here</p>
                    </div>
                  ) : (
                    filteredNetworkRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm font-medium">{request.method}</span>
                            {request.status && (
                              <span className={`font-mono text-xs ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground truncate max-w-md">
                            {request.url}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          {request.duration && (
                            <span>{request.duration}ms</span>
                          )}
                          {request.responseSize && (
                            <span>{(request.responseSize / 1024).toFixed(1)}KB</span>
                          )}
                          <span>{new Date(request.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}