// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import usersData from '@/data/user.json';
import { generateToken } from '@/lib/auth';
import { LoginResponse, ErrorResponse, LoginRequest } from '@/interfaces/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LoginRequest;
    const { correo, contraseña } = body;

    if (!correo || !contraseña) {
      const error: ErrorResponse = { error: 'Correo y contraseña son requeridos' };
      return NextResponse.json(error, { status: 400 });
    }

    const usuario = usersData.usuarios.find(
      (u) => u.correo === correo && u.contraseña === contraseña
    );

    if (!usuario) {
      const error: ErrorResponse = { error: 'Credenciales incorrectas' };
      return NextResponse.json(error, { status: 401 });
    }

    if (usuario.estado !== 'ACTIVO') {
      const error: ErrorResponse = { error: 'Usuario inactivo o suspendido' };
      return NextResponse.json(error, { status: 403 });
    }

    const token = generateToken(usuario);
    const { contraseña: _, ...usuarioSinPassword } = usuario;

    const response: LoginResponse = {
      success: true,
      token,
      usuario: usuarioSinPassword
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error en login:', error);
    const errorResponse: ErrorResponse = { error: 'Error interno del servidor' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}