'use server'

import type { SessionPayload } from '@/models/auth'

import { cache } from 'react'

import { createSession, getSession } from './session'

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
