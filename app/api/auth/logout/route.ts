// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { LogoutResponse, ErrorResponse } from '@/interfaces/auth';

export async function POST() {
  try {
    // En este caso, el logout se maneja en el cliente eliminando la cookie
    // Pero podríamos invalidar el token en una lista negra si usáramos una BD
    
    const response: LogoutResponse = {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error en logout:', error);
    const errorResponse: ErrorResponse = { error: 'Error interno del servidor' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}