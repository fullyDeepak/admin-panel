import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req: req });
  const url = req.nextUrl;
  if (
    token &&
    (url.pathname.startsWith('/login') || url.pathname.startsWith('/register'))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (
    !token &&
    !(url.pathname.startsWith('/login') || url.pathname.startsWith('/register'))
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
