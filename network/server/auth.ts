'use server'

import type { PasswordGrant, Register, TokenResponse } from '@/models/auth'
import type { ApiResponse } from '@/models/response'

import { decodeJwt } from 'jose'
import { signIn as authSignIn, signOut as authSignOut } from '@/auth'

import { fetchDataServer } from '../helpers/fetch-data-server'

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

export const handleGoogleCallback = async (params: string): Promise<any> => {
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

export async function signIn(data: any) {
  const jwt = decodeJwt(data.access_token)
  const userId = jwt.sub ? Number(jwt.sub) : 0
  const role = Array.isArray(jwt.scopes) && jwt.scopes.length > 0 ? jwt.scopes[0] : 'user'

  // Use Auth.js signIn with credentials provider
  // We pass the tokens as username/password for the authorize function to handle
  await authSignIn('credentials', {
    username: data.access_token,
    password: data.refresh_token,
    redirect: false,
  })

  return { userId, scope: role }
}

export async function signInWithGoogle() {
  await authSignIn('google')
}

export async function signOut(redirectTo = '') {
  await authSignOut({
    redirectTo: `/auth/login${redirectTo ? `?redirect=${redirectTo}` : ''}`,
  })
}
