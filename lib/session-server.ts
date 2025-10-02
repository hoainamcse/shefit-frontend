'use server'

import type { SessionPayload } from '@/models/auth'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'shefit_session'

/**
 * Server-side session management (for Server Components)
 */
export async function getServerSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (!sessionCookie?.value) return null

    return JSON.parse(sessionCookie.value)
  } catch (error) {
    console.error('Error reading session from cookies:', error)
    return null
  }
}
