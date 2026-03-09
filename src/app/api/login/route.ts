import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { db } from '@/db/index'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const data = await db.select()
    .from(profiles)
    .where(eq(profiles.email, email))

    if (data.length === 0) {
      return NextResponse.json({ message: 'Error/No existe' }, { status: 401 })
    }
    const user = data[0] //GUARDA EL PRIMER USUARIO

    const passMatch = await bcrypt.compare(password, user.password)
    if (!passMatch) {
      return NextResponse.json(
        { message: 'Contraseña inválida' },
        { status: 401 }
      )
    }

    //JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const jwt = await new SignJWT({userId: user.id})
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('24h')
    .sign(secret)

    const cookieStore = await cookies()
    
    cookieStore.set('user_session', jwt, {
      httpOnly: true,
      path: '/'
    })
    return NextResponse.json({ message: 'Login correcto' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error interno' }, { status: 500 })
  }
}
