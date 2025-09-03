'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowsPointingOut, Eye, Calendar } from 'lucide-react'
import Image from 'next/image'

interface Screenshot {
  id: string
  filename: string
  path: string
  thumbnail?: string
  timestamp: Date
  createdAt: Date
}

interface ScreenshotComparisonProps {
  screenshots: Screenshot[]
}

export function ScreenshotComparison({ screenshots }: ScreenshotComparisonProps) {
  const [selected1, setSelected1] = useState<string>('')
  const [selected2, setSelected2] = useState<string>('')

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const getScreenshot = (id: string) => {
    return screenshots.find(s => s.id === id)
  }

  const canCompare = selected1 && selected2 && selected1 !== selected2

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowsPointingOut className="w-5 h-5" />
          <span>Screenshot Comparison</span>
        </CardTitle>
        <CardDescription>Compare two screenshots side by side</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Screenshot</label>
            <Select value={selected1} onValueChange={setSelected1}>
              <SelectTrigger>
                <SelectValue placeholder="Select first screenshot" />
              </SelectTrigger>
              <SelectContent>
                {screenshots.map((screenshot) => (
                  <SelectItem key={screenshot.id} value={screenshot.id}>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(screenshot.timestamp).toLocaleString()}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Second Screenshot</label>
            <Select value={selected2} onValueChange={setSelected2}>
              <SelectTrigger>
                <SelectValue placeholder="Select second screenshot" />
              </SelectTrigger>
              <SelectContent>
                {screenshots.map((screenshot) => (
                  <SelectItem key={screenshot.id} value={screenshot.id}>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(screenshot.timestamp).toLocaleString()}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {canCompare && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <ArrowsPointingOut className="w-4 h-4 mr-2" />
                Compare Screenshots
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>Screenshot Comparison</DialogTitle>
                <DialogDescription>
                  Compare two screenshots side by side
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Screenshot 1</h3>
                      <Badge variant="outline">
                        {getScreenshot(selected1)?.filename}
                      </Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Eye className="w-16 h-16 text-muted-foreground" />
                        <span className="ml-2">Screenshot 1 Preview</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Captured:</strong> {formatTimestamp(getScreenshot(selected1)?.timestamp)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Screenshot 2</h3>
                      <Badge variant="outline">
                        {getScreenshot(selected2)?.filename}
                      </Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Eye className="w-16 h-16 text-muted-foreground" />
                        <span className="ml-2">Screenshot 2 Preview</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Captured:</strong> {formatTimestamp(getScreenshot(selected2)?.timestamp)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Time difference: {Math.abs(
                      new Date(getScreenshot(selected2)?.timestamp).getTime() - 
                      new Date(getScreenshot(selected1)?.timestamp).getTime()
                    ) / 1000} seconds
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Differences
                    </Button>
                    <Button variant="outline">
                      Download Both
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {screenshots.length < 2 && (
          <div className="text-center text-muted-foreground py-8">
            <ArrowsPointingOut className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Need at least 2 screenshots to compare</p>
            <p className="text-sm">Capture more screenshots to enable comparison</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}