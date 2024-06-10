import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionOnEdge, shouldByPassMiddleware, redirectToLogin } from '@frontegg/nextjs/edge';

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  if (shouldByPassMiddleware(pathname)) {
    return NextResponse.next();
  }

  const session = await getSessionOnEdge(request);
  if (!session) {
    return redirectToLogin(pathname);
  }
  return NextResponse.next();
};

export const config = {
  matcher: '/(.*)',
};