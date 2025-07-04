'use server'

import type { SessionPayload } from '@/models/auth'

import { cache } from 'react'

import { createSession, getSession, deleteSession } from './session'

export const verifySession = cache(async () => {
  const session = await getSession()
  return session || null
})

export async function updateSession(payload: Partial<SessionPayload>) {
  const session = await getSession()
  if (!session) {
    throw new Error('No session found to update')
  }
  const updatedSession = { ...session, ...payload }
  await createSession(updatedSession)
}

export async function clearSession() {
  await deleteSession()
}

export async function getRefreshedTokens(refreshToken: string): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const { refreshToken: refreshTokenFn } = await import('@/network/server/auth')
    const newTokens = await refreshTokenFn(refreshToken)
    return newTokens
  } catch (error) {
    console.error('Failed to refresh tokens:', error)
    return null
  }
}

export async function refreshSessionTokens(refreshToken: string): Promise<SessionPayload | null> {
  try {
    const newTokens = await getRefreshedTokens(refreshToken)
    if (!newTokens) {
      return null
    }

    const currentSession = await getSession()
    if (!currentSession) {
      return null
    }

    const updatedSession: SessionPayload = {
      ...currentSession,
      accessToken: newTokens.access_token,
      refreshToken: newTokens.refresh_token,
    }

    await createSession(updatedSession)
    return updatedSession
  } catch (error) {
    console.error('Failed to refresh session tokens:', error)
    return null
  }
}
