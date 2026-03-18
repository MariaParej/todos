import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 1. Buscamos la cookie de sesión oficial de Better Auth
  // Por defecto se llama 'better-auth.session_token'
  const sessionToken =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token')

  const { pathname } = request.nextUrl

  // 2. Definimos qué rutas queremos proteger
  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isTodoPage = pathname.startsWith('/todos') || pathname === '/'

  // CASO A: Si el usuario NO tiene token e intenta entrar a tareas o la home
  if (isTodoPage && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // CASO B: Si el usuario YA tiene token e intenta ir a login/register
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// 3. El Matcher: Aquí decides dónde actúa este "filtro"
export const config = {
  matcher: ['/', '/todos/:path*', '/login', '/register']
}
