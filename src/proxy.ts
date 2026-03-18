import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Buscamos la cookie de sesión oficial de Better Auth por defecto se llama 'better-auth.session_token'
  const sessionToken =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token')

  const { pathname } = request.nextUrl

  // Rutas que queremos proteger
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register'
  const isTodoPage = pathname.startsWith('/todos') || pathname === '/'

  // Si el usuario no tiene token e intenta entrar a la home
  if (isTodoPage && !sessionToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Si el usuario tiene token e intenta ir a login/register
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Dónde actúa
export const config = {
  matcher: ['/', '/todos/:path*', '/auth/login', '/auth/register']
}
