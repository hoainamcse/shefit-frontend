import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, decodeJwt, jwtVerify } from 'jose'

import type { SessionPayload } from '@/models/auth'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

function getRefreshTokenExpiresIn(refreshToken: string): Date {
  const jwt = decodeJwt(refreshToken)
  return jwt.exp ? new Date(jwt.exp * 1000) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
}

export async function encrypt(payload: SessionPayload) {
  const refreshTokenExpiresIn = getRefreshTokenExpiresIn(payload.refreshToken)
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(refreshTokenExpiresIn)
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

  const refreshTokenExpiresIn = getRefreshTokenExpiresIn(payload.refreshToken)

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: refreshTokenExpiresIn,
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
