// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import usersData from '@/data/user.json';
import { decodeToken } from '@/lib/auth';
import { MeResponse, ErrorResponse } from '@/interfaces/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error: ErrorResponse = { error: 'Token no proporcionado' };
      return NextResponse.json(error, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = decodeToken(token);

    if (!decoded) {
      const error: ErrorResponse = { error: 'Token inválido' };
      return NextResponse.json(error, { status: 401 });
    }

    const usuario = usersData.usuarios.find(
      (u) => u.idUsuario === decoded.id
    );

    if (!usuario) {
      const error: ErrorResponse = { error: 'Usuario no encontrado' };
      return NextResponse.json(error, { status: 404 });
    }

    if (usuario.estado !== 'ACTIVO') {
      const error: ErrorResponse = { error: 'Usuario inactivo' };
      return NextResponse.json(error, { status: 403 });
    }

    const { contraseña: _, ...usuarioSinPassword } = usuario;

    const response: MeResponse = {
      success: true,
      usuario: usuarioSinPassword
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    const errorResponse: ErrorResponse = { error: 'Error interno del servidor' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}