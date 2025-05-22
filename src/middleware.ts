import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export { auth as authMiddleware } from '@/auth';

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}

export const config = {
  matcher: ['/about/:path*'],
};