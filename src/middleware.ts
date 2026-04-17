import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/licenses/:path*',
    '/companies/:path*',
    '/products/:path*',
    '/renewals/:path*',
    '/notifications/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/users/:path*',
  ],
}
