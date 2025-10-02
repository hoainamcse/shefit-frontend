import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

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

const SESSION_COOKIE_NAME = 'shefit_session'

function handleAdminAuthorization(
  role: 'admin' | 'sub_admin' | 'normal_user',
  pathname: string,
  request: NextRequest
): NextResponse | null {
  if (role === 'admin') {
    return null // Allow access
  }

  if (role === 'sub_admin') {
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
    // Get session from cookie
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
    let session = null

    if (sessionCookie?.value) {
      try {
        session = JSON.parse(sessionCookie.value)
      } catch (error) {
        console.error('Failed to parse session cookie:', error)
      }
    }

    // Handle admin route protection
    if (isAdminRoute) {
      if (!session || !session.userId) {
        return NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url))
      }

      const authResult = handleAdminAuthorization(session.role, pathname, request)
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
