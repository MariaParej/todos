import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// MOSTRAR DATOS
export async function GET() {
  const { data, error } = await supabase.from('todos').select('*')

  if (error) {
    return NextResponse.json(
      { info: 'No se han podido cargar las tareas', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

// MODIFICAR PARCIALMENTE (SÓLO CAMBIAMOS EL ESTADO DONE)
export async function PATCH(request: Request) {
  const { id, done } = await request.json()
  const { data, error } = await supabase
    .from('todos')
    .update({ done })
    .eq('id', id)
    .select()

  if (error) {
    return NextResponse.json(
      { info: 'No se ha podido actualizar la tarea', error: error.message },
      { status: 500 }
    )
  }
  return NextResponse.json(data[0])
}

// AÑADIR TAREA
export async function POST(request: Request) {
  const { task } = await request.json()

  const { data, error } = await supabase
    .from('todos')
    .insert([{ task, done: false }])
    .select()

  if (error) {
    return NextResponse.json(
      { info: 'No se ha podido añadir la tarea', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data[0], { status: 201 })
}

// ELIMINAR TAREA
export async function DELETE(request: Request) {
  const { id } = await request.json()
  const { error } = await supabase.from('todos').delete().eq('id', id)

  if (error) {
    return NextResponse.json(
      { info: 'No se ha podido eliminar la tarea', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Tarea eliminada' })
}
