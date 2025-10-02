import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken: string
    refreshToken: string
    role: 'admin' | 'sub_admin' | 'normal_user'
    expiresAt: number
    user: {
      id: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    accessToken: string
    refreshToken: string
    role: 'admin' | 'sub_admin' | 'normal_user'
    expiresAt: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId: string
    accessToken: string
    refreshToken: string
    role: 'admin' | 'sub_admin' | 'normal_user'
    expiresAt: number
  }
}
