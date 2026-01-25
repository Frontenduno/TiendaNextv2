// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import usersData from '@/data/user.json';
import { generateToken } from '@/lib/auth';
import { Usuario } from '@/interfaces/user';
import { RegisterResponse, ErrorResponse, RegisterRequest } from '@/interfaces/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RegisterRequest;
    const { nombre, apellido, correo, contraseña } = body;

    // Validar campos
    if (!nombre || !apellido || !correo || !contraseña) {
      const error: ErrorResponse = { error: 'Todos los campos son requeridos' };
      return NextResponse.json(error, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      const error: ErrorResponse = { error: 'Formato de correo inválido' };
      return NextResponse.json(error, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = usersData.usuarios.find(
      (u) => u.correo === correo
    );

    if (usuarioExistente) {
      const error: ErrorResponse = { error: 'El correo ya está registrado' };
      return NextResponse.json(error, { status: 409 });
    }

    // Crear nuevo usuario
    const nuevoUsuario: Usuario = {
      idUsuario: usersData.usuarios.length + 1,
      correo,
      contraseña, // En producción deberías hashear la contraseña
      nombre,
      apellido,
      estado: 'ACTIVO',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Simular guardado (en producción guardarías en BD)
    usersData.usuarios.push(nuevoUsuario);

    // Generar token
    const token = generateToken(nuevoUsuario);

    // Retornar usuario sin contraseña
    const { contraseña: _, ...usuarioSinPassword } = nuevoUsuario;

    const response: RegisterResponse = {
      success: true,
      token,
      usuario: usuarioSinPassword,
      message: 'Usuario registrado exitosamente'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error en registro:', error);
    const errorResponse: ErrorResponse = { error: 'Error interno del servidor' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}