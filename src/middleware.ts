import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rotas que requerem autenticacao
const PROTECTED_PATHS = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se e uma rota protegida
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'cpcmtqls-secret-key-lunda-sul-2025',
    });

    // Se nao tem token valido, redireccionar para a pagina inicial
    if (!token) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('login', 'required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Headers para impedir cache de paginas com conteudo sensivel
  const response = NextResponse.next();

  if (isProtected) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
