'use server'

import type { PasswordGrant, Register, TokenResponse } from '@/models/auth'
import type { ApiResponse } from '@/models/response'
import type { SessionPayload } from '@/models/auth'

import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { fetchDataServer } from '../helpers/fetch-data-server'

const SESSION_COOKIE_NAME = 'shefit_session'

export const generateToken = async (data: Omit<PasswordGrant, 'grant_type'>): Promise<TokenResponse> => {
  const response = await fetchDataServer('/v1/auth/token', {
    method: 'POST',
    body: JSON.stringify({ grant_type: 'password', ...data }),
  })
  return response.json()
}

export async function refreshToken(token: string): Promise<TokenResponse> {
  const response = await fetchDataServer('/v1/auth/token', {
    method: 'POST',
    body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: token }),
  })
  return response.json()
}

export const register = async (data: Register) => {
  const response = await fetchDataServer('/v1/auth:signUp', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export const getOauth2AuthUrl = async (redirect_uri: string): Promise<ApiResponse<{ url: string }>> => {
  const response = await fetchDataServer(`/v1/auth/oauth2/google/auth-url?redirect_uri=${redirect_uri}`)
  return response.json()
}

export const handleGoogleCallback = async (params: string): Promise<TokenResponse> => {
  const response = await fetchDataServer(`/v1/auth/oauth2/google:handleCallback${params}`)
  return response.json()
}

export const changePassword = async (data: any): Promise<any> => {
  const response = await fetchDataServer('/v1/auth:changePassword', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function signIn(data: TokenResponse) {
  const jwt = decodeJwt(data.access_token)
  const userId = jwt.sub ? Number(jwt.sub) : 0
  const role = Array.isArray(jwt.scopes) && jwt.scopes.length > 0 ? jwt.scopes[0] : 'user'

  const session: SessionPayload = {
    userId,
    role: role === 'user' ? 'normal_user' : (role as 'admin' | 'sub_admin' | 'normal_user'),
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3 * 24 * 60 * 60, // 3 days
    path: '/',
  })

  return { userId, scope: role }
}

export async function signInWithGoogle() {
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`)
  const response = await getOauth2AuthUrl(redirectUri)
  redirect(response.data.url)
}

export async function signOut(redirectTo = '') {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)

  redirect(`/auth/login${redirectTo ? `?redirect=${redirectTo}` : ''}`)
}
