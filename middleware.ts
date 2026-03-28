import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function isValid(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin_token')?.value;
  if (!token || !(await isValid(token))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
