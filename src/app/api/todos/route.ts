import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// MOSTRAR DATOS
export async function GET() {
  const cookieStore = await cookies()
  const profiles_id = cookieStore.get('user_session')?.value

  if(!profiles_id){
    return NextResponse.json({message:'No logueado'}, {status: 401})
  }
  const { data, error } = await supabase.from('todos').select('*').eq('profiles_id', profiles_id)

  if (error) {
    return NextResponse.json(
      { info: 'No se han podido cargar las tareas' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

// MODIFICAR PARCIALMENTE (SÓLO CAMBIAMOS EL ESTADO DONE)
export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const profiles_id = cookieStore.get('user_session')?.value

  if(!profiles_id){
    return NextResponse.json({message: 'No logueado'}, {status: 401})
  }
  const { id, done } = await request.json()
  const { data, error } = await supabase
    .from('todos')
    .update({ done })
    .eq('id', id)
    .eq('profiles_id', profiles_id)
    .select()

  if (error) {
    return NextResponse.json(
      { info: 'No se ha podido actualizar la tarea' },
      { status: 500 }
    )
  }
  return NextResponse.json(data[0])
}

// AÑADIR TAREA
export async function POST(request: Request) {
  const cookieStore = await cookies()
  const profiles_id = cookieStore.get('user_session')?.value

  if(!profiles_id){
    return NextResponse.json({message: 'No logueado'}, {status: 401})
  }
  const { task } = await request.json()

  const { data, error } = await supabase
    .from('todos')
    .insert([{ task, done: false, profiles_id: profiles_id }])
    .select()

  if (error) {
    return NextResponse.json(
      { info: 'No se ha podido añadir la tarea' },
      { status: 500 }
    )
  }

  return NextResponse.json(data[0], { status: 201 })
}

// ELIMINAR TAREA
export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const profiles_id = cookieStore.get('user_session')?.value

  if(!profiles_id){
    return NextResponse.json({message:'No logueado'}, {status: 401})
  }
  const { id } = await request.json()
  const { error } = await supabase.from('todos').delete().eq('id', id).eq('profiles_id', profiles_id)

  if (error) {
    return NextResponse.json(
      { info: 'No se ha podido eliminar la tarea' },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Tarea eliminada' })
}
