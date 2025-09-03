import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Camera, Download, Eye, Calendar } from 'lucide-react'
import Image from 'next/image'

interface Screenshot {
  id: string
  filename: string
  path: string
  thumbnail?: string
  timestamp: Date
  createdAt: Date
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[]
  onTakeScreenshot: () => void
  isRunning: boolean
}

export function ScreenshotGallery({ screenshots, onTakeScreenshot, isRunning }: ScreenshotGalleryProps) {
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Screenshots</CardTitle>
            <CardDescription>Captured during testing</CardDescription>
          </div>
          <Button 
            onClick={onTakeScreenshot} 
            size="sm" 
            disabled={!isRunning}
          >
            <Camera className="w-4 h-4 mr-2" />
            Capture
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {screenshots.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No screenshots yet</p>
              <p className="text-sm">Start the session and capture screenshots</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {screenshots.map((screenshot) => (
                <Dialog key={screenshot.id}>
                  <DialogTrigger asChild>
                    <div className="border rounded-lg p-2 cursor-pointer hover:bg-accent transition-colors">
                      <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium truncate">
                            {screenshot.filename}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(screenshot.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{screenshot.filename}</DialogTitle>
                      <DialogDescription>
                        Captured on {formatTimestamp(screenshot.timestamp)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <Camera className="w-16 h-16 text-muted-foreground" />
                          <span className="ml-2">Screenshot Preview</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <strong>File:</strong> {screenshot.filename}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Size
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}