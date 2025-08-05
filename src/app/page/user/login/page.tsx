'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/usuario/login';

export default function LoginPage() {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/page/user/register');
  };

  const handleRecover = () => {
    router.push('/page/user/recover-account');
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <LoginForm
      onRegisterClick={handleRegister}
      onRecoverClick={handleRecover}
      onClose={handleClose}
    />
  );
}
