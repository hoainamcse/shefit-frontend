import type { NextRequest } from 'next/server'
import type { SessionPayload } from '@/models/auth'

import { decodeJwt } from 'jose'
import { NextResponse } from 'next/server'
import { verifySession, refreshSessionTokens } from '@/lib/dal'

const SUB_ADMIN_ALLOWED_ROUTES = [
  '/courses',
  '/exercises',
  '/muscle-groups-equipments',
  '/diets-calories',
  '/dishes',
  '/meal-plans',
  '/subscriptions',
  '/users',
  '/images',
]

async function handleTokenRefresh(session: SessionPayload, isAdminRoute: boolean): Promise<SessionPayload | null> {
  try {
    const accessTokenDecoded = decodeJwt(session.accessToken)
    const now = Math.floor(Date.now() / 1000)

    if (accessTokenDecoded.exp && accessTokenDecoded.exp <= now) {
      const refreshedSession = await refreshSessionTokens(session.refreshToken)

      if (!refreshedSession && isAdminRoute) {
        return null
      }

      return refreshedSession || session
    }

    return session
  } catch (error) {
    console.error('Token validation/refresh error:', error)
    return isAdminRoute ? null : session
  }
}

function handleAdminAuthorization(
  session: SessionPayload,
  pathname: string,
  request: NextRequest
): NextResponse | null {
  const userRole = session.role

  if (userRole === 'admin') {
    return null // Allow access
  }

  if (userRole === 'sub_admin') {
    const isAllowedRoute =
      SUB_ADMIN_ALLOWED_ROUTES.some((route) => pathname.startsWith('/admin' + route)) || pathname === '/admin'

    return isAllowedRoute ? null : NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.redirect(new URL('/unauthorized', request.url))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')

  try {
    const session = await verifySession()

    // Handle token refresh for all routes
    if (session) {
      const updatedSession = await handleTokenRefresh(session, isAdminRoute)

      if (!updatedSession && isAdminRoute) {
        return NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url))
      }
    }

    // Handle admin route protection
    if (isAdminRoute) {
      if (!session) {
        return NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url))
      }

      const authResult = handleAdminAuthorization(session, pathname, request)
      if (authResult) {
        return authResult
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return isAdminRoute
      ? NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url))
      : NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
