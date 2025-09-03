'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

export function ApkUploadDebugger() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadResult(null)
    }
  }

  const testUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      // First, get available devices
      const devicesResponse = await fetch('/api/devices')
      const devicesData = await devicesResponse.json()
      
      if (devicesData.length === 0) {
        throw new Error('No devices available')
      }

      // Use the first mobile device
      const mobileDevice = devicesData.find((d: any) => d.type === 'MOBILE' || d.type === 'TABLET')
      if (!mobileDevice) {
        throw new Error('No mobile/tablet devices found')
      }

      setDeviceInfo(mobileDevice)

      // Test the upload
      const formData = new FormData()
      formData.append('appFile', selectedFile)
      formData.append('deviceId', mobileDevice.id)
      formData.append('userId', 'debug-user')

      console.log('Testing upload with:', {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        deviceId: mobileDevice.id,
        deviceName: mobileDevice.name
      })

      const response = await fetch('/api/upload-app', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      setUploadResult({
        success: response.ok,
        status: response.status,
        result
      })

      if (response.ok) {
        console.log('Upload successful:', result)
      } else {
        console.error('Upload failed:', result)
      }

    } catch (error) {
      console.error('Upload test error:', error)
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileValidation = (file: File) => {
    const issues = []
    
    // Check file extension
    const validExtensions = ['.apk', '.aab']
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!validExtensions.includes(extension)) {
      issues.push(`Invalid file extension: ${extension}`)
    }

    // Check file size
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      issues.push(`File too large: ${formatFileSize(file.size)} (max: 100MB)`)
    }

    // Check MIME type
    const validMimeTypes = [
      'application/vnd.android.package-archive',
      'application/octet-stream',
      'application/x-zip-compressed'
    ]
    if (file.type && !validMimeTypes.includes(file.type)) {
      issues.push(`Unexpected MIME type: ${file.type}`)
    }

    return issues
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>APK Upload Debugger</span>
          </CardTitle>
          <CardDescription>
            Test and debug APK upload functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select APK/AAB File</label>
              <Input
                type="file"
                accept=".apk,.aab"
                onChange={handleFileSelect}
                className="mt-2"
              />
            </div>

            {selectedFile && (
              <div className="space-y-3">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div><strong>File:</strong> {selectedFile.name}</div>
                      <div><strong>Size:</strong> {formatFileSize(selectedFile.size)}</div>
                      <div><strong>Type:</strong> {selectedFile.type || 'Unknown'}</div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* File Validation */}
                {getFileValidation(selectedFile).length > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="font-medium">File Validation Issues:</div>
                        {getFileValidation(selectedFile).map((issue, index) => (
                          <div key={index} className="text-sm">• {issue}</div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {getFileValidation(selectedFile).length === 0 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      File validation passed! This file should work for upload.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          {/* Test Upload Button */}
          <Button 
            onClick={testUpload} 
            disabled={!selectedFile || isUploading || getFileValidation(selectedFile || new File([], '')).length > 0}
            className="w-full"
          >
            {isUploading ? 'Testing Upload...' : 'Test Upload'}
          </Button>

          {/* Device Info */}
          {deviceInfo && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Testing with device: <strong>{deviceInfo.name}</strong> ({deviceInfo.type})
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-4">
              {uploadResult.success ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium text-green-700">Upload Successful!</div>
                      <div>Status: {uploadResult.status}</div>
                      <div>Session ID: {uploadResult.result.session?.id}</div>
                      <div>File Path: {uploadResult.result.filePath}</div>
                      <div>Message: {uploadResult.result.message}</div>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium">Upload Failed</div>
                      <div>Status: {uploadResult.status}</div>
                      <div>Error: {uploadResult.error || uploadResult.result?.error}</div>
                      {uploadResult.result && (
                        <div className="text-sm font-mono bg-muted p-2 rounded">
                          {JSON.stringify(uploadResult.result, null, 2)}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Troubleshooting Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">Common Issues:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• File size exceeds 100MB limit</li>
                  <li>• Invalid file extension (must be .apk or .aab)</li>
                  <li>• No mobile/tablet devices available</li>
                  <li>• Server file permission issues</li>
                  <li>• Network connectivity problems</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Debug Steps:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Check browser console for errors (F12)</li>
                  <li>• Check server logs for detailed errors</li>
                  <li>• Try with a smaller APK file first</li>
                  <li>• Verify file is not corrupted</li>
                  <li>• Check device selection dropdown</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}