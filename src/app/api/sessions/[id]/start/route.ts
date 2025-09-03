import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await db.testSession.update({
      where: { id: params.id },
      data: {
        status: 'RUNNING',
        startedAt: new Date()
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

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error starting session:', error)
    return NextResponse.json(
      { error: 'Failed to start session' },
      { status: 500 }
    )
  }
}