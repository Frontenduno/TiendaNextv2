'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/usuario/register';

export default function RegisterPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/page/user/login'); // Redirige a login
  };

  const handleClose = () => {
    router.push('/'); // Puedes cambiar esto si quieres cerrar como modal
  };

  const handleRegister = () => {
    router.push('/page/user/profile'); // Redirige al perfil después del registro
  };

  return (
    <main>
      <RegisterForm
        onBack={handleGoBack}
        onClose={handleClose}
        onRegister={handleRegister}
      />
    </main>
  );
}
