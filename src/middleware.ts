import { NextRequest, NextResponse } from 'next/server';

// const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];
// const ADMIN_PATHS = ['/admin'];
// const USER_PATHS = ['/dashboard', '/reports', '/map', '/notifications', '/settings'];

export function middleware(request: NextRequest) {
  // Biarkan semua request lewat — proteksi handled di AuthGuard (client side)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};