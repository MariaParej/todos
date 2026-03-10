import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('user_session') // OBTENCIÓN DE LA COOKIE

  // RUTAS A PROTEGER
  const todoPage = request.nextUrl.pathname.startsWith('/todos')
  const authPage =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/register'

  // USUARIO SIN LOGUEAR
  if (todoPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url)) // DE VUELTA AL LOGIN
  }

  // USUARIO LOGUEADO
  if (authPage && token) {
    return NextResponse.redirect(new URL('/todos', request.url)) // PUEDE VER SUS TAREAS
  }

  return NextResponse.next()
}
// RUTAS QUE EJECUTA MIDDLEWARE
export const config = {
  matcher: ['/', '/todos', '/login', '/register']
}

// AL HACER ESTO, SI LO SIMULO SIN COOKIES, NO ME DEJA VER EL STATUS, LO IMPIDE TOTALMENTE
