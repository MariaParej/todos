import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { db } from '@/db/index'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

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

    const cookieStore = await cookies()
    //JWT
    cookieStore.set('user_session', user.id, {
      httpOnly: true,
      path: '/'
    })
    return NextResponse.json({ message: 'Login correcto' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error interno' }, { status: 500 })
  }
}
