import { NextRequest, NextResponse } from 'next/server'
import { getSession, deleteSession, createSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(null, { status: 401 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Failed to get session:', error)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await deleteSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete session:', error)
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { accessToken, refreshToken } = body

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 })
    }

    const currentSession = await getSession()
    if (!currentSession) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 })
    }

    // Update session with new tokens
    const updatedSession = {
      ...currentSession,
      accessToken,
      refreshToken,
    }

    await createSession(updatedSession)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update session:', error)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}
