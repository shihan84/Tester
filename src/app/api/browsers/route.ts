import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const browsers = await db.browser.findMany({
      where: { isActive: true },
      include: {
        browserDevices: {
          include: {
            device: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Filter out inactive devices manually
    const filteredBrowsers = browsers.map(browser => ({
      ...browser,
      browserDevices: browser.browserDevices.filter(bd => bd.device.isActive)
    }))

    return NextResponse.json(filteredBrowsers)
  } catch (error) {
    console.error('Error fetching browsers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch browsers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, version, engine, isMobile } = body

    const browser = await db.browser.create({
      data: {
        name,
        version,
        engine,
        isMobile: isMobile || false
      }
    })

    return NextResponse.json(browser, { status: 201 })
  } catch (error) {
    console.error('Error creating browser:', error)
    return NextResponse.json(
      { error: 'Failed to create browser' },
      { status: 500 }
    )
  }
}