import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/dal'

const SUB_ADMIN_ALLOWED_ROUTES = [
  '/courses',
  '/exercises',
  '/muscle-groups-equipments',
  '/diets-calories',
  '/dishes',
  '/meal-plans',
  '/subscriptions',
  '/users',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    try {
      const session = await verifySession()

      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      const userRole = session.role

      if (userRole === 'admin') {
        return NextResponse.next()
      }

      if (userRole === 'sub_admin') {
        const isAllowedRoute =
          SUB_ADMIN_ALLOWED_ROUTES.some((route) => pathname.startsWith('/admin' + route)) || pathname === '/admin'

        if (isAllowedRoute) {
          return NextResponse.next()
        } else {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }

      return NextResponse.redirect(new URL('/unauthorized', request.url))
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
