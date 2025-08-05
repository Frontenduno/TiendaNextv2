'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/css/usuario.module.css';

interface RegisterFormProps {
  onBack: () => void;
  onClose: () => void;
  onRegister: () => void;
}

export default function RegisterForm({ onBack, onClose, onRegister }: RegisterFormProps) {
  const [showTerms, setShowTerms] = useState(false);
  const [termsText, setTermsText] = useState('');

  useEffect(() => {
    const fetchTerms = async () => {
      const res = await fetch('/TC.txt');
      const text = await res.text();
      setTermsText(text);
    };
    fetchTerms();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      name: formData.get('name'),
      lastname: formData.get('lastname'),
      dni: formData.get('dni'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      acceptTerms: formData.get('acceptTerms') === 'on',
    };

    console.log('Datos enviados:', data);

    if (!data.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    // Si todas las validaciones del formulario (required) pasaron y los términos están aceptados,
    // entonces llamamos a onRegister para cambiar la vista a 'profile' como se configuró en page.tsx
    onRegister();
  };

  return (
    <>
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
            aria-label="Volver"
            type="button"
            onClick={onClose}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="5" x2="5" y2="19" />
              <line x1="5" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        <h1 className={styles.title}>Inicia sesión o regístrate para comprar</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Correo electrónico</label>
          <input id="email" name="email" type="email" placeholder="Correo electrónico" className={styles.inputField} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Nombre</label>
          <input id="name" name="name" type="text" placeholder="Nombre" className={styles.inputField} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="lastname" className={styles.label}>Apellidos</label>
          <input id="lastname" name="lastname" type="text" placeholder="Apellidos" className={styles.inputField} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dni" className={styles.label}>DNI / RUC</label>
          <input id="dni" name="dni" type="text" placeholder="DNI o RUC" className={styles.inputField} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.label}>Celular</label>
          <input id="phone" name="phone" type="tel" placeholder="Celular" className={styles.inputField} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Contraseña</label>
          <input id="password" name="password" type="password" placeholder="Contraseña" className={styles.inputField} required />
        </div>

        <div className={styles.termsContainer}>
          <label htmlFor="acceptTerms" className={styles.termsLabel}>
            <input id="acceptTerms" name="acceptTerms" type="checkbox" required />
            <span>Acepto los términos y condiciones</span>
          </label>

          <div
            onClick={() => setShowTerms(true)}
            title="Ver términos"
            // Removed inline style for cursor and margin-left, relying on CSS module or global styles
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none" className={styles.infoCircleSvg}>
              <circle cx="12" cy="12" r="10" fill="black" />
              <line x1="12" y1="8" x2="12" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="12" x2="12" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <button className={styles.primaryButton} type="submit">
          Registrar
        </button>

        <div className={styles.bottomLinks}>
          <p className={styles.signupText}>
            ¿Ya tienes una cuenta?{' '}
            <span className={styles.linkText} onClick={onBack} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onBack()}>
              Inicia sesión aquí
            </span>
          </p>
        </div>
      </form>

      {showTerms && (
        <div className={styles.modalOverlay} onClick={() => setShowTerms(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Términos y condiciones</h3>
            <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              {termsText}
            </pre>
            <button className={styles.primaryButton} onClick={() => setShowTerms(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}