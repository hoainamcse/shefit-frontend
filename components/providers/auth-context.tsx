'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { login as loginApi, refreshToken as refreshApi } from '@/network/server/auth'
import { getUserById } from '@/network/server/user'

type Role = 'normal_user' | 'sub_admin' | 'admin'

interface AuthContextType {
  userId: string | null
  accessToken: string | null
  role: Role | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: (redirectPath?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    // on mount, see if token + user_id in localStorage
    const access = localStorage.getItem('access_token')
    const uid = localStorage.getItem('user_id')
    if (access && uid) {
      setUserId(uid)
      setAccessToken(access)
      void (async () => {
        const res = await getUserById(uid)
        setRole(res.data.role as Role)
        setLoading(false)
      })()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    const resp = await loginApi({ username, password, grant_type: 'password' })
    localStorage.setItem('access_token', resp.access_token)
    localStorage.setItem('refresh_token', resp.refresh_token)
    const payload = JSON.parse(atob(resp.access_token.split('.')[1]))
    localStorage.setItem('user_id', payload.sub)
    setUserId(payload.sub)
    const userRes = await getUserById(payload.sub)
    setRole(userRes.data.role as Role)
    setLoading(false)
    // redirect based on role
    if (userRes.data.role === 'normal_user') router.push('/')
    else router.push('/admin')
  }

  const logout = (redirectPath?: string) => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_id')
    setUserId(null)
    setRole(null)
    router.push(redirectPath || '/auth/login')
  }

  // Refresh access token before it expires
  const refreshAuthToken = async () => {
    const token = localStorage.getItem('refresh_token')
    if (!token) {
      logout()
      return
    }
    try {
      const resp = await refreshApi(token)
      localStorage.setItem('access_token', resp.access_token)
      localStorage.setItem('refresh_token', resp.refresh_token)
      setAccessToken(resp.access_token)
      console.log('Access token refreshed')
    } catch (error) {
      console.error('Failed to refresh token', error)
      logout()
    }
  }

  useEffect(() => {
    if (!accessToken) return
    let payload
    try {
      payload = JSON.parse(atob(accessToken.split('.')[1]))
    } catch (error) {
      console.error('Error parsing access token', error)
      logout()
      return
    }
    const exp = (payload as { exp: number }).exp
    const now = Math.floor(Date.now() / 1000)
    const msUntilExpiry = (exp - now - 60) * 1000 // refresh 1 minute before expiry
    if (msUntilExpiry <= 0) {
      refreshAuthToken()
    } else {
      const timeoutId = setTimeout(refreshAuthToken, msUntilExpiry)
      return () => clearTimeout(timeoutId)
    }
  }, [accessToken])

  return (
    <AuthContext.Provider value={{ userId, role, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
