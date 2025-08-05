'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RecoverAccountForm from '@/components/usuario/recover-account';

export default function RecoverAccountPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/page/user/login');
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <RecoverAccountForm
      onBack={handleBack}
      onClose={handleClose}
    />
  );
}
