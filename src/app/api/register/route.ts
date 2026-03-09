import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/db/index'
import { profiles } from '@/db/schema'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        {
          message: 'La contraseña debe tener al menos 6 caracteres.'
        },
        { status: 400 }
      )
    }

    // ENCRIPTACIÓN
    const saltRound = 10
    const hashedPassword = await bcrypt.hash(password, saltRound)

    // INSERCCIÓN EN TABLA PROFILES DE SUPABASE

    const newUser = await db
      .insert(profiles)
      .values({ name, email, password: hashedPassword })
      .returning()

    // RESPUESTA CON ÉXITO
    return NextResponse.json(
      { message: 'Usuario registrado correctamente' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
