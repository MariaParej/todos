import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single() // DEVULEVE UN OBJETO {} EN VEZ DE UN ARRAY [{}]

    if (error || !data) {
      return NextResponse.json({ message: 'Error/No existe' }, { status: 401 })
    }

    const passMatch = await bcrypt.compare(password, data.password)
    if (!passMatch) {
      return NextResponse.json({ message: 'Contraseña inválida' }, {status: 401})
    }

    const cookieStore = await cookies()

    cookieStore.set('user_session', data.id, {
      httpOnly: true,
      path: '/'
    })
    return NextResponse.json({ message: 'Login correcto' }, {status: 200})
  } catch (error) {
    return NextResponse.json({ message: 'Error interno' }, {status: 500})
  }
}
