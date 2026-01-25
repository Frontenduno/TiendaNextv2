// hooks/useAuth.ts
"use client";

import { useState, useEffect } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/auth';
import { UserWithoutPassword, MeResponse, LoginResponse, RegisterResponse, AuthResult } from '@/interfaces/auth';

export function useAuth() {
  const [user, setUser] = useState<UserWithoutPassword | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async (): Promise<void> => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Obtener datos del usuario
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json() as MeResponse;
        setUser(data.usuario);
        setIsAuthenticated(true);
      } else {
        // Token inválido o expirado
        removeAuthToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar autenticación al montar y escuchar cambios
  useEffect(() => {
    checkAuth();

    // Escuchar eventos personalizados de auth
    const handleAuthChange = () => {
      checkAuth();
    };

    // Escuchar cambios en localStorage entre pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuth();
      }
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (correo: string, contraseña: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await response.json() as LoginResponse;

      if (!response.ok) {
        throw new Error('error' in data ? (data as unknown as { error: string }).error : 'Error en el login');
      }

      // Guardar token en cookie
      setAuthToken(data.token);
      setUser(data.usuario);
      setIsAuthenticated(true);

      // Disparar evento para actualizar otros componentes
      window.dispatchEvent(new Event('authStateChanged'));

      return { success: true, usuario: data.usuario };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    nombre: string, 
    apellido: string, 
    correo: string, 
    contraseña: string
  ): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellido, correo, contraseña }),
      });

      const data = await response.json() as RegisterResponse;

      if (!response.ok) {
        throw new Error('error' in data ? (data as unknown as { error: string }).error : 'Error en el registro');
      }

      // Guardar token en cookie
      setAuthToken(data.token);
      setUser(data.usuario);
      setIsAuthenticated(true);

      // Disparar evento para actualizar otros componentes
      window.dispatchEvent(new Event('authStateChanged'));

      return { success: true, usuario: data.usuario };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);

      // Disparar evento para actualizar otros componentes
      window.dispatchEvent(new Event('authStateChanged'));
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  };
}