import { db } from '@/db/index'
import { todos } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'

// MOSTRAR DATOS
export async function GET() {
  const userId = await getUserId()

  if (!userId) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }

  try {
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
  const userId = await getUserId()

  if (!userId) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }
  const { id, done } = await request.json()

  try {
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
  const userId = await getUserId()

  if (!userId) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }
  const { task } = await request.json()

  try {
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
  const userId = await getUserId()

  if (!userId) {
    return NextResponse.json({ message: 'No logueado' }, { status: 401 })
  }
  const { id } = await request.json()
  try {
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
