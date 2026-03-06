import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcrypt'

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
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ name: name, email: email, password: hashedPassword }])
      .select()

    if (error) {
      return NextResponse.json(
        {
          message: 'Error al guardar en la BBDD'
        },
        { status: 500 }
      )
    }

    // RESPUESTA CON ÉXITO
    return NextResponse.json(
      {
        message: 'Usuario registrado correctamente'
      },
      {
        status: 201
      }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
