import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const devices = await db.device.findMany({
      where: { isActive: true },
      include: {
        browserDevices: {
          include: {
            browser: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Filter out inactive browsers manually
    const filteredDevices = devices.map(device => ({
      ...device,
      browserDevices: device.browserDevices.filter(bd => bd.browser.isActive)
    }))

    return NextResponse.json(filteredDevices)
  } catch (error) {
    console.error('Error fetching devices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, manufacturer, model, os, osVersion, resolution, isMobile } = body

    const device = await db.device.create({
      data: {
        name,
        type,
        manufacturer,
        model,
        os,
        osVersion,
        resolution,
        isMobile: isMobile || false
      }
    })

    return NextResponse.json(device, { status: 201 })
  } catch (error) {
    console.error('Error creating device:', error)
    return NextResponse.json(
      { error: 'Failed to create device' },
      { status: 500 }
    )
  }
}