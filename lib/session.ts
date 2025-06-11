import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

import type { SessionPayload } from '@/models/auth'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey)
}

export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}

export async function createSession(payload: SessionPayload) {
  const session = await encrypt(payload)
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: payload.expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession() {
  const cookie = (await cookies()).get('session')?.value
  if (!cookie) {
    return undefined
  }
  const session = await decrypt(cookie)
  return session as SessionPayload | undefined
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
