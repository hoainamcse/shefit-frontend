import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

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
    const session = await auth()

    // Handle admin route protection
    if (isAdminRoute) {
      if (!session || !session.user) {
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
