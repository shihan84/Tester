'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Calendar, 
  Clock, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  Play,
  Square
} from 'lucide-react'
import { type TestSession } from '@/hooks/use-api'

interface SessionManagementProps {
  sessions: TestSession[]
  onRefresh: () => void
  onStartSession: (id: string) => void
  onStopSession: (id: string) => void
  onDeleteSession: (id: string) => void
}

export function SessionManagement({ 
  sessions, 
  onRefresh, 
  onStartSession, 
  onStopSession, 
  onDeleteSession 
}: SessionManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deviceFilter, setDeviceFilter] = useState<string>('all')

  const formatTimestamp = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleString()
  }

  const formatDuration = (startedAt: Date | string | null | undefined, endedAt: Date | string | null | undefined) => {
    if (!startedAt) return 'Not started'
    const start = new Date(startedAt)
    const end = endedAt ? new Date(endedAt) : new Date()
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000)
    
    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`
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

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'DESKTOP': return Monitor
      case 'MOBILE': return Smartphone
      case 'TABLET': return Tablet
      default: return Monitor
    }
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.appPath?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.browserDevice.device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.browserDevice.browser.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter
    const matchesDevice = deviceFilter === 'all' || session.browserDevice.device.type === deviceFilter

    return matchesSearch && matchesStatus && matchesDevice
  })

  const uniqueDevices = Array.from(new Set(sessions.map(s => s.browserDevice.device.type)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Session Management</CardTitle>
            <CardDescription>Manage and monitor test sessions</CardDescription>
          </div>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="CREATED">Created</SelectItem>
                <SelectItem value="RUNNING">Running</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                {uniqueDevices.map(device => (
                  <SelectItem key={device} value={device}>
                    {device}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Device & Browser</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.browserDevice.device.type)
                  return (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                          <span className="font-mono text-xs">{session.id.slice(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {session.url || session.appPath?.split('/').pop() || 'No URL/App'}
                          {session.appType && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {session.appType.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <DeviceIcon className="w-4 h-4" />
                          <div>
                            <div className="text-sm font-medium">{session.browserDevice.device.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {session.browserDevice.browser.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{session.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(session.startedAt, session.endedAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatTimestamp(session.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const sessionUrl = session.appType 
                                ? `/app-session/${session.id}` 
                                : `/session/${session.id}`
                              window.open(sessionUrl, '_blank')
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {session.status === 'CREATED' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onStartSession(session.id)}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          {session.status === 'RUNNING' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onStopSession(session.id)}
                            >
                              <Square className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteSession(session.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{sessions.length}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sessions.filter(s => s.status === 'RUNNING').length}
            </div>
            <div className="text-sm text-muted-foreground">Running</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sessions.filter(s => s.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {sessions.filter(s => s.status === 'FAILED').length}
            </div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}