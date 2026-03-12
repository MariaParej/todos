import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SignJWT } from 'jose'
import EmailTemplate from '@/components/EmailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json()

    if (!email || !firstName) {
      return NextResponse.json({ message: 'Faltan datos' }, { status: 400 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({ email, firstName }) // token con el email
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m') // token con expiración de 15min
      .sign(secret)

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000' // en mi local
    const confirmLink = `${baseUrl}/register-completed?token=${token}`

    //envío de correo
    const { data, error } = await resend.emails.send({
      from: 'Registro ToDos <onboarding@resend.dev>',
      to: 'maria.pareja.pinos@students.thepower.education',
      subject: 'Confirma tu registro en ToDos',
      react: EmailTemplate({ firstName, confirmLink })
    })

    if (error) {
      return NextResponse.json(
        { message: 'Error en el envío de correo de confirmación' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Correo enviado con éxito' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error en email de confirmación' },
      { status: 500 }
    )
  }
}
