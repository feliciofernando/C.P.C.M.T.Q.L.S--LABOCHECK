import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Headers para impedir cache de paginas com conteudo sensivel
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Headers anti-cache para paginas protegidas
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('Surrogate-Control', 'no-store');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
