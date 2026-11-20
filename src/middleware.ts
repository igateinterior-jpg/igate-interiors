import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { comingSoonRewrite, isComingSoonEnabled } from './lib/site-mode';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  if (isComingSoonEnabled(process.env.COMING_SOON_MODE)) {
    const target = comingSoonRewrite(request.nextUrl.pathname);
    if (target) return NextResponse.rewrite(new URL(target, request.url));
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|ar)/:path*'],
};
