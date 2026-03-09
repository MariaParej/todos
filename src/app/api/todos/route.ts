import { db } from '@/db/index'
import { todos } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

// MOSTRAR DATOS
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value

  if (!token) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET) // CLAVE EN MI .ENV.LOCAL
    const { payload } = await jwtVerify(token, secret) // SE "ABRE EL SOBRE"
    const userId = payload.userId as string // EXTRAE EL ID REAL

    const data = await db
      .select()
      .from(todos)
      .where(eq(todos.profilesId, userId))

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ message: 'Error en BBDD' }, { status: 500 })
  }
}

// MODIFICAR PARCIALMENTE (SÓLO CAMBIAMOS EL ESTADO DONE)
export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value

  if (!token) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }
  const { id, done } = await request.json()

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET) // CLAVE EN MI .ENV.LOCAL
    const { payload } = await jwtVerify(token, secret) // SE "ABRE EL SOBRE"
    const userId = payload.userId as string // EXTRAE EL ID REAL

    const data = await db
      .update(todos)
      .set({ done })
      .where(and(eq(todos.id, id), eq(todos.profilesId, userId)))
      .returning()

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json(
      { message: 'No se puedo actualizar' },
      { status: 500 }
    )
  }
}

// AÑADIR TAREA
export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value

  if (!token) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }
  const { task } = await request.json()

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET) // CLAVE EN MI .ENV.LOCAL
    const { payload } = await jwtVerify(token, secret) // SE "ABRE EL SOBRE"
    const userId = payload.userId as string // EXTRAE EL ID REAL

    const data = await db
      .insert(todos)
      .values({ task, done: false, profilesId: userId })
      .returning()

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'No se pudo añadir la tarea' },
      { status: 500 }
    )
  }
}

// ELIMINAR TAREA
export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value

  if (!token) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }
  const { id } = await request.json()
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET) // CLAVE EN MI .ENV.LOCAL
    const { payload } = await jwtVerify(token, secret) // SE "ABRE EL SOBRE"
    const userId = payload.userId as string // EXTRAE EL ID REAL
    const data = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.profilesId, userId)))
      .returning()

    return NextResponse.json({ message: 'Tarea eliminada' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al eliminar la tarea' },
      { status: 500 }
    )
  }
}
