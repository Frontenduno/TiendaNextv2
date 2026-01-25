// interfaces/auth.ts
import { Usuario } from '@/interfaces/user';

// Usuario sin contraseña pero con todos los demás campos
export type UserWithoutPassword = Omit<Usuario, 'contraseña'>;

export interface LoginResponse {
  success: boolean;
  token: string;
  usuario: UserWithoutPassword;
}

export interface RegisterResponse {
  success: boolean;
  token: string;
  usuario: UserWithoutPassword;
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export interface MeResponse {
  success: boolean;
  usuario: UserWithoutPassword;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface AuthResult {
  success: boolean;
  usuario?: UserWithoutPassword;
  error?: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  timestamp: number;
}

// Interfaces para requests
export interface LoginRequest {
  correo: string;
  contraseña: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
}