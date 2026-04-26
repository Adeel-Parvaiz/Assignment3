import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path  = req.nextUrl.pathname;
    const role  = token?.role as string;

    // if agent, block access to admin routes
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/agent', req.url));
    }

    //Not allow to access non authorized routes
    if (path.startsWith('/agent') && !['admin', 'agent'].includes(role)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only allow access if token exists (user is logged in)
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/agent/:path*'],
};