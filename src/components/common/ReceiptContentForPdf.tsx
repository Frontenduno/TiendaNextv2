// src/components/common/ReceiptContentForPdf.tsx
'use client';

import React from 'react';
import { Order } from '@/types/order';

interface ReceiptContentForPdfProps {
    order: Order;
}

const ReceiptContentForPdf: React.FC<ReceiptContentForPdfProps> = ({ order }) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Fecha no disponible';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const totalItems = order.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

    return (
        <div style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '25mm',
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            color: '#1f2937',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            lineHeight: '1.6',
            fontSize: '14px',
        }}>
            <h1 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#2563eb',
                marginBottom: '5px',
                textAlign: 'center',
                textTransform: 'uppercase',
            }}>
                Factura Electrónica
            </h1>
            <p style={{
                fontSize: '16px',
                color: '#4b5563',
                marginBottom: '30px',
                textAlign: 'center',
            }}>
                Comprobante de Venta
            </p>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '40px',
            }}>
                <div style={{
                    flex: '1',
                    minWidth: '280px',
                    padding: '15px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                }}>
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '15px',
                    }}>
                        Detalles del Pedido
                    </h2>
                    <p><strong>ID del Pedido:</strong> {order.id}</p>
                    <p><strong>Fecha:</strong> {formatDate(order.date)}</p>
                    <p><strong>Costo Total:</strong> S/. {(order.totalCost ?? 0).toFixed(2)}</p>
                    <p><strong>Artículos Totales:</strong> {totalItems}</p>
                </div>

                <div style={{
                    flex: '1',
                    minWidth: '280px',
                    padding: '15px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                }}>
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '15px',
                    }}>
                        Información de Pago y Envío
                    </h2>
                    <p><strong>Método de Envío:</strong> {order.metodoEnvio}</p>
                    <p><strong>Forma de Pago:</strong> {order.formaPago}</p>
                </div>
            </div>

            <div style={{
                width: '100%',
                marginBottom: '30px',
                padding: '15px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
            }}>
                <h2 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '15px',
                }}>
                    Artículos Comprados
                </h2>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                }}>
                    <thead>
                        <tr style={{
                            backgroundColor: '#e0e7ff',
                            color: '#1f2937',
                        }}>
                            <th style={{ padding: '12px 15px', borderBottom: '1px solid #d1d5db' }}>PRODUCTO</th>
                            <th style={{ padding: '12px 15px', borderBottom: '1px solid #d1d5db', textAlign: 'center' }}>CANTIDAD</th>
                            <th style={{ padding: '12px 15px', borderBottom: '1px solid #d1d5db', textAlign: 'right' }}>PRECIO UNITARIO</th>
                            <th style={{ padding: '12px 15px', borderBottom: '1px solid #d1d5db', textAlign: 'right' }}>SUBTOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '10px 15px' }}>{item.name}</td>
                                <td style={{ padding: '10px 15px', textAlign: 'center' }}>{(item.quantity ?? 0)}</td>
                                <td style={{ padding: '10px 15px', textAlign: 'right' }}>S/. {(item.price ?? 0).toFixed(2)}</td>
                                <td style={{ padding: '10px 15px', textAlign: 'right' }}>S/. {((item.quantity ?? 0) * (item.price ?? 0)).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3} style={{
                                padding: '15px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                color: '#2563eb',
                            }}>
                                Total:
                            </td>
                            <td style={{
                                padding: '15px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                color: '#2563eb',
                            }}>
                                S/. {(order.totalCost ?? 0).toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{
                width: '100%',
                textAlign: 'center',
                marginTop: 'auto',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb',
            }}>
                <p style={{ marginBottom: '10px', fontSize: '15px', color: '#4b5563' }}>
                    ¡Gracias por tu preferencia!
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Para cualquier consulta, contáctenos en <a href="mailto:soporte@tutienda.com" style={{ color: '#2563eb', textDecoration: 'none' }}>soporte@tutienda.com</a>
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>
                    Este es un comprobante de venta electrónico. No es necesario imprimirlo.
                </p>
            </div>
        </div>
    );
};

export default ReceiptContentForPdf;
