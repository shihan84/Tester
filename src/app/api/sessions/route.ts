import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const sessions = await db.testSession.findMany({
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
        },
        screenshots: {
          orderBy: { timestamp: 'desc' }
        },
        logs: {
          orderBy: { timestamp: 'desc' }
        },
        networkRequests: {
          orderBy: { timestamp: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, browserDeviceId, url, appPath, appType } = body

    const sessionData: any = {
      userId,
      status: 'CREATED'
    }

    if (browserDeviceId) {
      sessionData.browserDeviceId = browserDeviceId
    }
    if (url) {
      sessionData.url = url
    }
    if (appPath) {
      sessionData.appPath = appPath
    }
    if (appType) {
      sessionData.appType = appType
    }

    const session = await db.testSession.create({
      data: sessionData,
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

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}