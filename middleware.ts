import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Cookies
const ONBOARD_COOKIE = 'fizy_onboarded';
const AUTH_COOKIE = 'fizy_token';

// Rotas explicitamente públicas (após onboarding). Onboarding tem tratamento próprio.
const PUBLIC_AFTER_ONBOARD = new Set(['/login', '/signup']);

function isAssetOrApi(pathname: string) {
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/favicon')) return true;
  if (pathname.startsWith('/images')) return true;
  if (pathname.startsWith('/api')) return true; // Não interceptar API; frontend decide.
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isAssetOrApi(pathname)) return NextResponse.next();

  const hasOnboarded = !!req.cookies.get(ONBOARD_COOKIE);
  const isAuthenticated = !!req.cookies.get(AUTH_COOKIE);

  // 1) Se ainda não fez onboarding, qualquer rota (exceto /onboarding) redireciona para onboarding.
  if (!hasOnboarded && pathname !== '/onboarding') {
    const url = req.nextUrl.clone();
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  // 2) Se está em /onboarding mas já fez (cookie presente) podemos permitir (revisitar) ou redirecionar.
  // Manteremos permitido: apenas cair fora aqui.
  if (pathname === '/onboarding') return NextResponse.next();

  // 3) Rotas públicas após onboarding: /login e /signup.
  if (PUBLIC_AFTER_ONBOARD.has(pathname)) {
    // Se autenticado, não faz sentido ficar em login/signup => manda para home
    if (isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    // Se não autenticado, pode continuar (onboarding já foi validado antes)
    return NextResponse.next();
  }

  // 4) Demais rotas (privadas) exigem autenticação.
  if (!isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
