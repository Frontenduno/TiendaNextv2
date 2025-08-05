'use client';

import React, { useState } from 'react';
import styles from '@/css/usuario.module.css'; // ¡Importa los estilos CSS Modules!

interface ChangePasswordModalProps {
  onClose: () => void; // Función para cerrar el modal
  onPasswordChangeSuccess: () => void; // Función para llamar después de cambiar la contraseña
}

export default function ChangePasswordModal({ onClose, onPasswordChangeSuccess }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    setSuccessMessage(''); // Limpiar mensajes de éxito previos

    if (newPassword !== confirmNewPassword) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 6) { // Ejemplo de validación simple
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    console.log('Intentando cambiar contraseña:', {
      currentPassword,
      newPassword,
    });

    // Simulación de éxito inmediato (si no tienes backend aún)
    setSuccessMessage('Contraseña cambiada con éxito!');
    onPasswordChangeSuccess(); // Notifica al componente padre
    setTimeout(onClose, 1500); // Cierra el modal después de 1.5 segundos
  };

  return (
    // Ya no usamos <style jsx>, ahora usamos las clases de styles.
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Encabezado del modal con botón "Cancelar" y título */}
        <div className={styles.headerContainerModal}>
          <button className={styles.cancelButtonHeader} onClick={onClose} aria-label="Cancelar">
            Cancelar
            {/* Ícono SVG de flecha de salida como en la imagen */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M17 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
          <h2 className={styles.contentTitleModal}>Cambiar contraseña</h2>
        </div>

        {/* Formulario de cambio de contraseña */}
        <form onSubmit={handleSubmit} className={styles.modalFormInline}>
          <div className={styles.formRow}>
            <label htmlFor="currentPassword" className={styles.labelInline}>Contraseña Actual</label>
            <input
              id="currentPassword"
              type="password"
              className={styles.inputFieldInline}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="newPassword" className={styles.labelInline}>Nueva contraseña</label>
            <input
              id="newPassword"
              type="password"
              className={styles.inputFieldInline}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="confirmNewPassword" className={styles.labelInline}>Confirmar nueva contraseña</label>
            <input
              id="confirmNewPassword"
              type="password"
              className={styles.inputFieldInline}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

          {/* El botón "Guardar cambios" ahora está centrado directamente en el formulario */}
          <button type="submit" className={styles.saveChangesButton}>
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
