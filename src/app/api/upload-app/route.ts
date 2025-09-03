import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const appFile = formData.get('appFile') as File
    const deviceId = formData.get('deviceId') as string
    const userId = formData.get('userId') as string

    if (!appFile || !deviceId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: appFile, deviceId, and userId are required' },
        { status: 400 }
      )
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024 // 100MB in bytes
    if (appFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 100MB' },
        { status: 400 }
      )
    }

    // Validate file type
    const validExtensions = ['.apk', '.aab']
    const validMimeTypes = [
      'application/vnd.android.package-archive',
      'application/octet-stream',
      'application/vnd.android.package-archive',
      'application/x-zip-compressed'
    ]
    
    const fileExtension = appFile.name.substring(appFile.name.lastIndexOf('.')).toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only .apk and .aab files are supported' },
        { status: 400 }
      )
    }

    if (!validMimeTypes.includes(appFile.type) && appFile.type !== '') {
      console.warn(`Unexpected MIME type: ${appFile.type} for file: ${appFile.name}`)
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'apps')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.error('Error creating uploads directory:', error)
      // Continue even if directory creation fails - it might already exist
    }

    // Generate unique filename
    const fileName = `${uuidv4()}${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Save the file
    try {
      const bytes = await appFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)
      console.log(`File saved successfully: ${filePath}`)
    } catch (fileError) {
      console.error('Error saving file:', fileError)
      return NextResponse.json(
        { error: 'Failed to save file to disk' },
        { status: 500 }
      )
    }

    // Determine app type
    const appType = fileExtension === '.apk' ? 'ANDROID_APK' : 'ANDROID_AAB'

    // Find the device to get browser device info
    const device = await db.device.findUnique({
      where: { id: deviceId },
      include: {
        browserDevices: {
          include: {
            browser: true
          }
        }
      }
    })

    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      )
    }

    // Use the first available browser device for mobile devices
    const browserDevice = device.browserDevices[0]
    if (!browserDevice) {
      return NextResponse.json(
        { error: 'No browser available for this device' },
        { status: 400 }
      )
    }

    // Create test session
    const session = await db.testSession.create({
      data: {
        userId,
        browserDeviceId: browserDevice.id,
        appPath: `/uploads/apps/${fileName}`,
        appType,
        status: 'CREATED'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        browserDevice: {
          include: {
            device: true,
            browser: true
          }
        }
      }
    })

    console.log(`Session created successfully: ${session.id}`)

    return NextResponse.json({
      session,
      filePath: `/uploads/apps/${fileName}`,
      message: 'Android app uploaded successfully'
    })

  } catch (error) {
    console.error('Error uploading app:', error)
    return NextResponse.json(
      { error: `Failed to upload app: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}