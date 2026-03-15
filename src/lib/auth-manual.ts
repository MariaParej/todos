import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

export async function getUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value

  if (!token) return null

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET) // CLAVE EN MI .ENV.LOCAL
    const { payload } = await jwtVerify(token, secret) // SE "ABRE EL SOBRE"
    return payload.userId as string // EXTRAE EL ID REAL
  } catch (error) {
    return null
  }
}