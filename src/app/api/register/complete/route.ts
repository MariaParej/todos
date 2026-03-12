import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/db/index'
import { profiles } from '@/db/schema'
import { jwtVerify } from 'jose'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: 'Faltan datos' }, { status: 400 })
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    let payload

    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret)
      payload = verifiedPayload
    } catch (error) {
      return NextResponse.json(
        { message: 'El enlace ha expirado o no es válido' },
        { status: 401 }
      )
    }

    const { email, firstName } = payload as { email: string; firstName: string }

    // ENCRIPTACIÓN
    const saltRound = 10
    const hashedPassword = await bcrypt.hash(password, saltRound)

    // INSERCCIÓN EN TABLA PROFILES DE SUPABASE

    await db
      .insert(profiles)
      .values({ name: firstName, email: email, password: hashedPassword })

    // RESPUESTA CON ÉXITO
    return NextResponse.json(
      { message: 'Usuario registrado correctamente' },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('LOG DEL ERROR EN EL SERVIDOR:', error)

    //si el email ya existe
    // 1. Extraemos la "causa" del error de Drizzle
    const dbError =
      error instanceof Error && 'cause' in error
        ? (error.cause as { code?: string })
        : (error as { code?: string })

    // 2. Comprobamos el código '23505' (Duplicate Key)
    if (dbError && dbError.code === '23505') {
      return NextResponse.json(
        { message: 'Este email ya está registrado' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
