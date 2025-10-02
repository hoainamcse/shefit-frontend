import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { decodeJwt } from 'jose'

const baseUrl = process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL

if (!baseUrl) {
  throw new Error('SERVER_URL or NEXT_PUBLIC_SERVER_URL is not set.')
}

export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          let tokens
          const username = credentials.username as string
          const password = credentials.password as string

          // Check if username looks like a JWT token (for token-based auth flow)
          if (username.startsWith('eyJ')) {
            // Token-based authentication (used by signIn after generateToken)
            tokens = {
              access_token: username,
              refresh_token: password,
              expires_in: 3600,
            }
          } else {
            // Username/password authentication
            const response = await fetch(`${baseUrl}/v1/auth/token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                grant_type: 'password',
                username,
                password,
              }),
            })

            if (!response.ok) {
              return null
            }

            tokens = await response.json()
          }

          const jwt = decodeJwt(tokens.access_token)
          const userId = jwt.sub ? Number(jwt.sub) : 0
          const role = Array.isArray(jwt.scopes) && jwt.scopes.length > 0 ? jwt.scopes[0] : 'user'

          return {
            id: userId.toString(),
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            role: role === 'user' ? 'normal_user' : role,
            expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.userId = user.id || ''
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
        token.role = (user as any).role
        token.expiresAt = (user as any).expiresAt
      }

      // Handle Google OAuth
      if (account?.provider === 'google') {
        try {
          const response = await fetch(
            `${baseUrl}/v1/auth/oauth2/google:handleCallback?code=${account.access_token}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '')}`
          )

          if (response.ok) {
            const data = await response.json()
            const jwt = decodeJwt(data.access_token)
            const userId = jwt.sub ? Number(jwt.sub) : 0
            const role = Array.isArray(jwt.scopes) && jwt.scopes.length > 0 ? jwt.scopes[0] : 'user'

            token.userId = userId.toString()
            token.accessToken = data.access_token
            token.refreshToken = data.refresh_token
            token.role = role === 'user' ? 'normal_user' : role
            token.expiresAt = Math.floor(Date.now() / 1000) + data.expires_in
          }
        } catch (error) {
          console.error('Google OAuth callback error:', error)
        }
      }

      // Handle session update from client
      if (trigger === 'update' && session) {
        if (session.accessToken) {
          token.accessToken = session.accessToken
        }
        if (session.refreshToken) {
          token.refreshToken = session.refreshToken
        }
        if (session.expiresAt) {
          token.expiresAt = session.expiresAt
        }
      }

      // Check if token needs refresh
      const now = Math.floor(Date.now() / 1000)
      if (token.expiresAt && typeof token.expiresAt === 'number' && token.expiresAt <= now) {
        try {
          const response = await fetch(`${baseUrl}/v1/auth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              grant_type: 'refresh_token',
              refresh_token: token.refreshToken,
            }),
          })

          if (response.ok) {
            const newTokens = await response.json()
            token.accessToken = newTokens.access_token
            token.refreshToken = newTokens.refresh_token
            token.expiresAt = Math.floor(Date.now() / 1000) + newTokens.expires_in
          } else {
            // Token refresh failed, return token as is
            // The middleware will handle redirect to login
            return null
          }
        } catch (error) {
          console.error('Token refresh error:', error)
          return null
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.role = token.role as 'admin' | 'sub_admin' | 'normal_user'
        session.expiresAt = token.expiresAt as number
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')

      if (isOnAdmin) {
        if (!isLoggedIn) return false
        // Admin authorization is handled in middleware
        return true
      }

      return true
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  trustHost: true,
} satisfies NextAuthConfig
