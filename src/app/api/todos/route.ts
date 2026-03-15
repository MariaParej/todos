import { db } from '@/db/index'
import { todos } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse, NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// obtener la sesión
async function getAuthSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return session
}

// mostrar datos
export async function GET() {
  const session = await getAuthSession()

  if (!session) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }

  try {
    const data = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, session.user.id))

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ message: 'Error en BBDD' }, { status: 500 })
  }
}

// modifica parcialmente (sólo modificamos es estado del done)
export async function PATCH(request: NextRequest) {
  const session = await getAuthSession()

  if (!session) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }
  const { id, done } = await request.json()

  try {
    const data = await db
      .update(todos)
      .set({ done })
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
      .returning()

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json(
      { message: 'No se puedo actualizar' },
      { status: 500 }
    )
  }
}

// añadir tarea
export async function POST(request: NextRequest) {
  const session = await getAuthSession()

  if (!session) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }
  const { task } = await request.json()

  if (!task || task.trim().length === 0) {
    return NextResponse.json(
      { message: 'La tarea no puede estar vacía' },
      { status: 400 }
    )
  }

  try {
    const data = await db
      .insert(todos)
      .values({ task, done: false, userId: session.user.id })
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
export async function DELETE(request: NextRequest) {
  const session = await getAuthSession()

  if (!session) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }
  const { id } = await request.json()
  try {
    const data = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
      .returning()

    return NextResponse.json({ message: 'Tarea eliminada' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al eliminar la tarea' },
      { status: 500 }
    )
  }
}
