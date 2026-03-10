import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('user_session')
    
    return NextResponse.json({message:'Sesión cerrada'}, {status: 200})
  } catch (error) {
    return NextResponse.json({message:'Error al cerrar sesión'}, {status: 500})
  }
}