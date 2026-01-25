// lib/auth.ts
import { Usuario } from '@/interfaces/user';
import { TokenPayload } from '@/interfaces/auth';

const TOKEN_NAME = 'auth_token';

// Generar un token simple (en producción usarías JWT)
export function generateToken(usuario: Usuario): string {
  const payload: TokenPayload = {
    id: usuario.idUsuario,
    email: usuario.correo,
    timestamp: Date.now()
  };
  return btoa(JSON.stringify(payload));
}

// Decodificar token
export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = JSON.parse(atob(token)) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

// Guardar token en cookie
export function setAuthToken(token: string) {
  const maxAge = 7 * 24 * 60 * 60; // 7 días en segundos
  document.cookie = `${TOKEN_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Strict; Secure`;
}

// Obtener token de cookie
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith(`${TOKEN_NAME}=`));
  
  if (!tokenCookie) return null;
  
  return tokenCookie.split('=')[1];
}

// Eliminar token de cookie
export function removeAuthToken() {
  document.cookie = `${TOKEN_NAME}=; path=/; max-age=0; SameSite=Strict; Secure`;
}

// Verificar si hay sesión activa
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

// ===== SIMULACIÓN DE REGISTRO =====
// Simular registro automático de usuario anónimo
export function simulateAutoRegister(): TokenPayload {
  const randomId = Math.floor(Math.random() * 10000);
  const randomEmail = `usuario_${randomId}@mitienda.com`;
  
  const payload: TokenPayload = {
    id: randomId,
    email: randomEmail,
    timestamp: Date.now()
  };
  
  return payload;
}