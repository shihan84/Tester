'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Layout,
  Grid,
  Columns,
  Settings,
  Plus,
  X
} from 'lucide-react'

interface ViewportPreset {
  name: string
  width: number
  height: number
  icon: React.ComponentType<{ className?: string }>
  type: 'mobile' | 'tablet' | 'desktop'
}

interface ResponsiveTestProps {
  url: string
  onUrlChange: (url: string) => void
  isRunning: boolean
}

export function ResponsiveTest({ url, onUrlChange, isRunning }: ResponsiveTestProps) {
  const [viewports, setViewports] = useState<ViewportPreset[]>([
    { name: 'iPhone 15', width: 390, height: 844, icon: Smartphone, type: 'mobile' },
    { name: 'iPad', width: 820, height: 1180, icon: Tablet, type: 'tablet' },
    { name: 'Desktop', width: 1920, height: 1080, icon: Monitor, type: 'desktop' }
  ])
  const [customViewports, setCustomViewports] = useState<ViewportPreset[]>([])
  const [layout, setLayout] = useState<'grid' | 'horizontal' | 'vertical'>('grid')
  const [showControls, setShowControls] = useState(true)
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [customName, setCustomName] = useState('')

  const viewportPresets: ViewportPreset[] = [
    { name: 'iPhone SE', width: 375, height: 667, icon: Smartphone, type: 'mobile' },
    { name: 'iPhone 15', width: 390, height: 844, icon: Smartphone, type: 'mobile' },
    { name: 'Pixel 8', width: 412, height: 892, icon: Smartphone, type: 'mobile' },
    { name: 'iPad Mini', width: 744, height: 1133, icon: Tablet, type: 'tablet' },
    { name: 'iPad', width: 820, height: 1180, icon: Tablet, type: 'tablet' },
    { name: 'Surface Pro', width: 1368, height: 912, icon: Tablet, type: 'tablet' },
    { name: 'Laptop', width: 1366, height: 768, icon: Monitor, type: 'desktop' },
    { name: 'Desktop HD', width: 1920, height: 1080, icon: Monitor, type: 'desktop' },
    { name: 'Desktop 4K', width: 3840, height: 2160, icon: Monitor, type: 'desktop' }
  ]

  const addViewport = (preset: ViewportPreset) => {
    if (!viewports.find(v => v.name === preset.name)) {
      setViewports([...viewports, preset])
    }
  }

  const removeViewport = (name: string) => {
    setViewports(viewports.filter(v => v.name !== name))
  }

  const addCustomViewport = () => {
    if (customName && customWidth && customHeight) {
      const newViewport: ViewportPreset = {
        name: customName,
        width: parseInt(customWidth),
        height: parseInt(customHeight),
        icon: Monitor,
        type: 'desktop'
      }
      setCustomViewports([...customViewports, newViewport])
      setCustomName('')
      setCustomWidth('')
      setCustomHeight('')
    }
  }

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row space-x-4 overflow-x-auto'
      case 'vertical':
        return 'flex flex-col space-y-4 overflow-y-auto'
      case 'grid':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    }
  }

  const getViewportSizeClasses = (viewport: ViewportPreset) => {
    if (layout === 'horizontal') {
      return `flex-shrink-0 w-[${viewport.width}px] h-[${viewport.height}px]`
    }
    return ''
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Layout className="w-5 h-5" />
                <span>Responsive Design Testing</span>
              </CardTitle>
              <CardDescription>Test your website across different screen sizes</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowControls(!showControls)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        {showControls && (
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter URL to test..."
                  value={url}
                  onChange={(e) => onUrlChange(e.target.value)}
                  disabled={!isRunning}
                />
              </div>
              <Select value={layout} onValueChange={(value: any) => setLayout(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">
                    <div className="flex items-center space-x-2">
                      <Grid className="w-4 h-4" />
                      <span>Grid</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="horizontal">
                    <div className="flex items-center space-x-2">
                      <Columns className="w-4 h-4" />
                      <span>Horizontal</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="vertical">
                    <div className="flex items-center space-x-2">
                      <Maximize className="w-4 h-4" />
                      <span>Vertical</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="presets" className="w-full">
              <TabsList>
                <TabsTrigger value="presets">Device Presets</TabsTrigger>
                <TabsTrigger value="custom">Custom Viewports</TabsTrigger>
              </TabsList>

              <TabsContent value="presets" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {viewportPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant={viewports.find(v => v.name === preset.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => addViewport(preset)}
                      className="justify-start"
                    >
                      <preset.icon className="w-4 h-4 mr-2" />
                      <span className="truncate">{preset.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {preset.width}×{preset.height}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                  <Input
                    placeholder="Width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                  />
                  <Input
                    placeholder="Height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                  />
                  <Button onClick={addCustomViewport} disabled={!customName || !customWidth || !customHeight}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {customViewports.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Custom Viewports</h4>
                    <div className="flex flex-wrap gap-2">
                      {customViewports.map((viewport) => (
                        <Badge key={viewport.name} variant="outline" className="px-3 py-1">
                          {viewport.name} ({viewport.width}×{viewport.height})
                          <button
                            onClick={() => setCustomViewports(customViewports.filter(v => v.name !== viewport.name))}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>

      {/* Active Viewports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Viewports ({viewports.length})</h3>
          <Button variant="outline" size="sm" onClick={() => setViewports([])}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className={getLayoutClasses()}>
          {viewports.map((viewport) => {
            const IconComponent = viewport.icon
            return (
              <Card key={viewport.name} className="flex-shrink-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{viewport.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {viewport.width}×{viewport.height}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeViewport(viewport.name)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border rounded-lg overflow-hidden bg-white" style={{ 
                    width: viewport.width, 
                    height: viewport.height,
                    maxWidth: '100%'
                  }}>
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center p-4">
                        <IconComponent className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{viewport.width} × {viewport.height}</p>
                        <p className="text-xs mt-1">
                          {viewport.type === 'mobile' && 'Mobile View'}
                          {viewport.type === 'tablet' && 'Tablet View'}
                          {viewport.type === 'desktop' && 'Desktop View'}
                        </p>
                        {url && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs font-mono truncate">
                            {url}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {viewports.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Layout className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Viewports Selected</h3>
              <p className="text-muted-foreground mb-4">
                Add device presets or custom viewports to start testing responsive design
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Breakpoints Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Common Breakpoints</CardTitle>
          <CardDescription>Standard responsive design breakpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="font-medium">Mobile</div>
              <div className="text-sm text-muted-foreground">320px - 768px</div>
              <div className="text-xs text-muted-foreground">Smartphones</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Tablet</div>
              <div className="text-sm text-muted-foreground">768px - 1024px</div>
              <div className="text-xs text-muted-foreground">iPads, Tablets</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Desktop</div>
              <div className="text-sm text-muted-foreground">1024px - 1440px</div>
              <div className="text-xs text-muted-foreground">Laptops, Desktops</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Large Desktop</div>
              <div className="text-sm text-muted-foreground">1440px+</div>
              <div className="text-xs text-muted-foreground">4K, Large Screens</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}