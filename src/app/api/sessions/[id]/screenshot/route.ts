import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Generate a unique filename for the screenshot
    const filename = `screenshot-${uuidv4()}.png`
    const path = `/screenshots/${filename}`
    
    // Create screenshot record
    const screenshot = await db.screenshot.create({
      data: {
        sessionId: params.id,
        filename,
        path,
        thumbnail: path // In a real implementation, you'd generate a thumbnail
      }
    })

    return NextResponse.json(screenshot)
  } catch (error) {
    console.error('Error taking screenshot:', error)
    return NextResponse.json(
      { error: 'Failed to take screenshot' },
      { status: 500 }
    )
  }
}