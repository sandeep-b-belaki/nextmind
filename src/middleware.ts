import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/kannada/')) {
    const target = pathname.replace(/^\/kannada/, '') + req.nextUrl.search;
    const res = NextResponse.rewrite(new URL(target, req.url));
    res.cookies.set('nm_lang', 'kn', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/kannada/:path*'],
};
