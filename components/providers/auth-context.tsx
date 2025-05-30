'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { login as loginApi } from '@/network/server/auth'
import { getUserById } from '@/network/server/user'

type Role = 'normal_user' | 'sub_admin' | 'admin'

interface AuthContextType {
  userId: string | null
  role: Role | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: (redirectPath?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    // on mount, see if token + user_id in localStorage
    const access = localStorage.getItem('access_token')
    const uid = localStorage.getItem('user_id')
    if (access && uid) {
      setUserId(uid)
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

  return <AuthContext.Provider value={{ userId, role, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
