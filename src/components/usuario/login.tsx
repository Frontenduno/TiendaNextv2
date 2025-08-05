'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '@/css/usuario.module.css';

interface LoginFormProps {
  onRegisterClick: () => void;
  onRecoverClick: () => void;
  onClose: () => void;
}

export default function LoginForm({ onRegisterClick, onRecoverClick, onClose }: LoginFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Formulario de login enviado');

    // Aquí iría la validación real de login
    // Por ahora, redirigimos directamente
    router.push('/page/user/profile');
  };

  return (
    <form className={styles.loginContainer} onSubmit={handleSubmit}>
      <div className={styles.headerContainer}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Trainer Sport Logo"
            width={150}
            height={50}
            priority
          />
        </div>
        <button
          className={styles.closeButton}
          aria-label="Cerrar"
          type="button"
          onClick={onClose}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="red"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="5" x2="5" y2="19" />
            <line x1="5" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      <h1 className={styles.title}>Inicia sesión para comprar</h1>

      <div className={styles.inputGroup}>
        <label htmlFor="emailInput" className={styles.label}>Correo electrónico</label>
        <input
          id="emailInput"
          name="email"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          className={styles.inputField}
          autoComplete="email"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="passwordInput" className={styles.label}>Contraseña</label>
        <input
          id="passwordInput"
          name="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          className={styles.inputField}
          autoComplete="current-password"
          required
        />
      </div>

      <button type="submit" className={styles.primaryButton}>
        Ingresar
      </button>

      <div className={styles.bottomLinks}>
        <p className={styles.signupText}>
          ¿No tienes una cuenta?{' '}
          <span
            className={styles.linkText}
            onClick={onRegisterClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onRegisterClick()}
          >
            Regístrate!!
          </span>
        </p>

        <span
          className={styles.recoveryRight}
          onClick={onRecoverClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onRecoverClick()}
        >
          Recuperar cuenta
        </span>
      </div>
    </form>
  );
}