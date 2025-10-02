'use client'

import { sessionStorage } from '@/lib/session'
import { signOut as serverSignOut } from '@/network/server/auth'

/**
 * Client-side utility functions for authentication
 */

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const session = sessionStorage.get()
  return !!session?.accessToken
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: 'admin' | 'sub_admin' | 'normal_user'): boolean {
  const session = sessionStorage.get()
  return session?.role === role
}

/**
 * Check if user is admin or sub_admin
 */
export function isAdmin(): boolean {
  const session = sessionStorage.get()
  return session?.role === 'admin' || session?.role === 'sub_admin'
}

/**
 * Get current user ID
 */
export function getCurrentUserId(): number | null {
  const session = sessionStorage.get()
  return session?.userId || null
}

/**
 * Get current user role
 */
export function getCurrentUserRole(): 'admin' | 'sub_admin' | 'normal_user' | null {
  const session = sessionStorage.get()
  return session?.role || null
}

/**
 * Logout and redirect to login page
 */
export async function logout(redirectTo?: string): Promise<void> {
  sessionStorage.remove()
  await serverSignOut(redirectTo)
}

/**
 * Get access token for manual API calls
 */
export function getAccessToken(): string | null {
  const session = sessionStorage.get()
  return session?.accessToken || null
}
