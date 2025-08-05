'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/css/usuario.module.css';
import ChangePasswordModal from '@/components/Change-Password/ChangePasswordModal';
import { Order } from '@/types/order';
import Modal from '@/components/cart/Shipping/Modal';
import PurchaseDetailModal from '@/components/usuario/PurchaseDetailModal';

export interface ProfilePageProps {
    onLogout: () => void;
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
    const [activeSection, setActiveSection] = useState('datosPersonales');
    const [purchaseHistory, setPurchaseHistory] = useState<Order[]>([]);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [personalData, setPersonalData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        celular: '',
    });

    const [shippingAddress, setShippingAddress] = useState({
        departamento: '',
        provincia: '',
        distrito: '',
        referencia: '',
    });

    useEffect(() => {
        if (activeSection === 'historialCompras' && typeof window !== 'undefined') {
            const loadPurchaseHistory = () => {
                const storedHistory = localStorage.getItem('purchaseHistory');
                if (storedHistory) {
                    try {
                        const parsedHistory: Order[] = JSON.parse(storedHistory);
                        setPurchaseHistory(parsedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                    } catch (error) {
                        console.error("Error parsing purchase history from localStorage", error);
                        setPurchaseHistory([]);
                    }
                } else {
                    setPurchaseHistory([]);
                }
                setHistoryLoaded(true);
            };

            const timer = setTimeout(loadPurchaseHistory, 500);
            return () => clearTimeout(timer);
        } else if (activeSection !== 'historialCompras') {
            setHistoryLoaded(false);
        }
    }, [activeSection]);

    const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPersonalData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handlePersonalDataSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Datos personales actualizados:', personalData);
        alert('Datos personales guardados!');
    };

    const handleShippingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setShippingAddress(prevAddress => ({
            ...prevAddress,
            [id]: value,
        }));
    };

    const handleShippingAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Dirección de envío actualizada:', shippingAddress);
        alert('Dirección de envío guardada!');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const mockUserData = {
                nombres: 'Juan',
                apellidos: 'Pérez',
                email: 'juan.perez@example.com',
                celular: '987654321',
            };
            setPersonalData(mockUserData);

            const mockShippingData = {
                departamento: 'Lima',
                provincia: 'Lima',
                distrito: 'Miraflores',
                referencia: 'Cerca del Parque Kennedy',
            };
            setShippingAddress(mockShippingData);
        };

        fetchUserData();
    }, []);

    const openPasswordModal = () => setShowPasswordModal(true);
    const closePasswordModal = () => setShowPasswordModal(false);
    const handlePasswordChangeSuccess = () => console.log("Contraseña cambiada con éxito desde el modal.");

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const handleViewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div className={styles.profileContainer}>
            <nav className={styles.profileNav}>
                <button
                    className={`${styles.navButton} ${activeSection === 'datosPersonales' ? styles.activeNavButton : ''}`}
                    onClick={() => setActiveSection('datosPersonales')}
                >
                    Datos personales
                </button>
                <button
                    className={`${styles.navButton} ${activeSection === 'historialCompras' ? styles.activeNavButton : ''}`}
                    onClick={() => setActiveSection('historialCompras')}
                >
                    Historial de compras
                </button>
                <button
                    className={`${styles.navButton} ${activeSection === 'direccionEnvio' ? styles.activeNavButton : ''}`}
                    onClick={() => setActiveSection('direccionEnvio')}
                >
                    Dirección de envío
                </button>
                <button className={styles.logoutButton} onClick={onLogout}>
                    Cerrar Sesión
                </button>
            </nav>

            <div className={styles.profileContent}>
                {activeSection === 'datosPersonales' && (
                    <form className={styles.personalDataSection} onSubmit={handlePersonalDataSubmit}>
                        <h2 className={styles.contentTitle}>Datos Personales</h2>

                        <div className={styles.inputGroupProfile}>
                            <label htmlFor="nombres" className={styles.labelProfile}>Nombres</label>
                            <input id="nombres" type="text" className={styles.inputFieldProfile} value={personalData.nombres} onChange={handlePersonalDataChange} required />
                        </div>

                        <div className={styles.inputGroupProfile}>
                            <label htmlFor="apellidos" className={styles.labelProfile}>Apellidos</label>
                            <input id="apellidos" type="text" className={styles.inputFieldProfile} value={personalData.apellidos} onChange={handlePersonalDataChange} required />
                        </div>

                        <div className={styles.inputGroupProfile}>
                            <label htmlFor="email" className={styles.labelProfile}>Email</label>
                            <input id="email" type="email" className={styles.inputFieldProfile} value={personalData.email} onChange={handlePersonalDataChange} required />
                        </div>

                        <div className={styles.inputGroupProfile}>
                            <label htmlFor="celular" className={styles.labelProfile}>Celular</label>
                            <input id="celular" type="tel" className={styles.inputFieldProfile} value={personalData.celular} onChange={handlePersonalDataChange} required />
                        </div>

                        <button className={styles.changePasswordButton} type="button" onClick={openPasswordModal}>Cambiar contraseña</button>
                        <button className={styles.primaryButton} type="submit">Guardar cambios</button>
                    </form>
                )}

                {activeSection === 'historialCompras' && (
                    <div className={styles.purchaseHistorySection}>
                        <h2 className={styles.contentTitle}>Historial de compras</h2>
                        <div id="purchaseHistoryCardsContainer">
                            {!historyLoaded ? (
                                <p>Cargando historial de compras...</p>
                            ) : purchaseHistory.length === 0 ? (
                                <p>No tienes compras en tu historial.</p>
                            ) : (
                                purchaseHistory.map(purchase => (
                                    <div key={purchase.id} className={styles.purchaseCard}>
                                        <div className={styles.purchaseCardTopRow}>
                                            <div className={styles.productThumbnails}>
                                                {purchase.items.map((item, index) => (
                                                    <Image
                                                        key={index}
                                                        src={item.image || 'https://placehold.co/80x80/cccccc/000000?text=No+Image'}
                                                        alt={item.name}
                                                        className={styles.thumbnail}
                                                        width={80}
                                                        height={80}
                                                    />
                                                ))}
                                            </div>
                                            <div className={styles.separator}></div>
                                            <div className={styles.purchaseDetails}>
                                                <p>Fecha: {formatDate(purchase.date)}</p>
                                                <p>Costo: S/. {purchase.totalCost.toFixed(2)}</p>
                                                <p>Artículos: {purchase.totalItems}</p>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center mt-4">
                                            <button
                                                className={styles.viewDetailsButton}
                                                onClick={() => handleViewOrderDetails(purchase)}
                                            >
                                                Ver Detalle
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'direccionEnvio' && (
                    <form className={styles.shippingAddressSection} onSubmit={handleShippingAddressSubmit}>
                        <h2 className={styles.contentTitle}>Dirección de envío</h2>

                        <div className={styles.inputGroupProfile}>
                            <label htmlFor="departamento" className={styles.labelProfile}>Departamento</label>
                            <input id="departamento" type="text" className={styles.inputFieldProfile} value={shippingAddress.departamento} onChange={handleShippingAddressChange} required />
                        </div>

                        <div className={styles.inputGroupProfile}>
                            <label htmlFor="provincia" className={styles.labelProfile}>Provincia</label>
                            <input id="provincia" type="text" className={styles.inputFieldProfile} value={shippingAddress.provincia} onChange={handleShippingAddressChange} required />
                        </div>

                        <div className={styles.inputGroupProfile}>
                            <label htmlFor="distrito" className={styles.labelProfile}>Distrito</label>
                            <input id="distrito" type="text" className={styles.inputFieldProfile} value={shippingAddress.distrito} onChange={handleShippingAddressChange} required />
                        </div>

                        <div className={styles.inputGroupProfile}>
                            <label htmlFor="referencia" className={styles.labelProfile}>Referencia</label>
                            <input id="referencia" type="text" className={styles.inputFieldProfile} value={shippingAddress.referencia} onChange={handleShippingAddressChange} required />
                        </div>

                        <button className={styles.primaryButton} type="submit">Guardar cambios</button>
                    </form>
                )}
            </div>

            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={closePasswordModal}
                    onPasswordChangeSuccess={handlePasswordChangeSuccess}
                />
            )}

            <Modal visible={isDetailModalOpen} onClose={handleCloseDetailModal}>
                {selectedOrder && (
                    <PurchaseDetailModal
                        order={selectedOrder}
                        onClose={handleCloseDetailModal}
                    />
                )}
            </Modal>
        </div>
    );
}
