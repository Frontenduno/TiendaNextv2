'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '@/css/usuario.module.css';

interface RecoverAccountFormProps {
  onBack: () => void;
  onClose: () => void;
}

export default function RecoverAccountForm({ onBack, onClose }: RecoverAccountFormProps) {
  const [etapa, setEtapa] = useState<'correo' | 'codigo'>('correo');
  const [codigo, setCodigo] = useState(Array(6).fill(''));

  const manejarCambioCodigo = (valor: string, index: number) => {
    if (!/^\d?$/.test(valor)) return; // Solo permite dígitos
    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = valor;
    setCodigo(nuevoCodigo);

    // Mover el foco al siguiente input automáticamente
    if (valor && index < 5) {
      const nextInput = document.getElementById(`codigoInput-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    } else if (!valor && index > 0) {
      // Mover el foco al input anterior si se borra un dígito
      const prevInput = document.getElementById(`codigoInput-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleCorreoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('correo')?.toString().trim();

    if (!email) {
      alert('Por favor, ingresa tu correo.');
      return;
    }

    // Aquí iría la lógica para enviar el correo al backend
    console.log('Correo enviado:', email);
    setEtapa('codigo');
  };

  const handleCodigoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const codigoCompleto = codigo.join('');

    if (codigoCompleto.length !== 6) {
      alert('Ingresa el código completo (6 dígitos)');
      return;
    }

    // Aquí iría la lógica para verificar el código
    console.log('Código ingresado:', codigoCompleto);
    // Idealmente, aquí se redirigiría a una página de restablecimiento de contraseña
    // o se cerraría el modal, dependiendo del flujo.
    onClose(); // Por ejemplo, cerrar el modal si el código es correcto
  };

  return (
    <div className={styles.loginContainer}>
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
          onClick={onClose}
          type="button" // Siempre especificar el tipo para evitar que actúe como submit por defecto
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="5" x2="5" y2="19" />
            <line x1="5" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      {etapa === 'correo' ? (
        <form onSubmit={handleCorreoSubmit}>
          <h1 className={styles.title}>Recuperar cuenta</h1>

          <div className={styles.inputGroup}>
            <label htmlFor="correoRecuperacion" className={styles.label}>Correo electrónico</label>
            <input
              id="correoRecuperacion"
              name="correo"
              type="email"
              placeholder="Ingresa tu correo"
              className={styles.inputField}
              required
            />
          </div>

          <button type="submit" className={styles.primaryButton}>
            Enviar
          </button>
        </form>
      ) : (
        <form onSubmit={handleCodigoSubmit}>
          <h1 className={styles.title}>Código de recuperación</h1>
          
          <p className={styles.descriptionText}>
            Se envió un código de recuperación a tu correo.
          </p>

          <p className={styles.codeLabel}>
            Código
          </p>

          <div className={styles.codeContainer} role="group" aria-label="Código de recuperación">
            {codigo.map((valor, i) => (
              <input
                key={i}
                id={`codigoInput-${i}`} // Añadir ID para manejar el foco
                maxLength={1}
                value={valor}
                onChange={(e) => manejarCambioCodigo(e.target.value, i)}
                className={styles.codeInput}
                inputMode="numeric"
                pattern="[0-9]*"
                aria-label={`Dígito ${i + 1}`}
                required
              />
            ))}
          </div>

          <button type="submit" className={styles.primaryButton}>
            Verificar
          </button>
        </form>
      )}
    </div>
  );
}