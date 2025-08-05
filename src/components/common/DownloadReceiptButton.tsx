// src/components/common/DownloadReceiptButton.tsx
'use client';

import React, { useState } from 'react';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { createRoot } from 'react-dom/client';
import { Order } from '@/types/order';
import ReceiptContentForPdf from './ReceiptContentForPdf';

interface DownloadReceiptButtonProps {
    order: Order;
    className?: string;
    buttonText?: string;
}

const DownloadReceiptButton: React.FC<DownloadReceiptButtonProps> = ({ order, className, buttonText = 'Descargar Boleta' }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePdf = async () => {
        setIsGenerating(true);

        const tempDiv = document.createElement('div');
        // Aseguramos que el div temporal tenga dimensiones y sea visible para dom-to-image,
        // aunque esté fuera de la pantalla.
        // TEMPORAL: Para depuración, quita estas líneas para ver el div en pantalla.
        // tempDiv.style.position = 'absolute';
        // tempDiv.style.left = '-9999px';
        // tempDiv.style.top = '-9999px';
        // FIN TEMPORAL

        // Estilos para asegurar que dom-to-image lo vea y capture correctamente
        tempDiv.style.width = '210mm'; // Ancho A4
        tempDiv.style.minHeight = '297mm'; // Altura A4 mínima para A4
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.padding = '32px'; // Margen interno
        tempDiv.style.backgroundColor = '#ffffff'; // Fondo blanco puro
        tempDiv.style.color = '#1f2937'; // Color de texto gris oscuro (equivalente a gray-800)
        tempDiv.style.fontFamily = 'Inter, sans-serif'; // Asegura una fuente compatible
        tempDiv.style.overflow = 'hidden'; // Importante para que no haya scrollbars internos
        tempDiv.style.zoom = '1'; // A veces ayuda con problemas de renderizado en dom-to-image

        // TEMPORAL: Añadir un borde para ver el div durante la depuración
        tempDiv.style.border = '1px solid red';
        // FIN TEMPORAL

        document.body.appendChild(tempDiv);

        const root = createRoot(tempDiv);
        root.render(<ReceiptContentForPdf order={order} />);

        // Esperar un tiempo prudente para asegurar que React haya renderizado el contenido
        // y que todos los estilos y recursos (si los hubiera) se hayan cargado.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Aumentado a 1000ms (1 segundo)

        // --- INICIO DE DEPURACIÓN ---
        console.log("--- Contenido del div temporal antes de la captura ---");
        console.log(tempDiv.innerHTML); // Imprime el HTML renderizado dentro del div
        console.log("--- Estilos calculados del div temporal antes de dom-to-image ---");
        const computedStyle = window.getComputedStyle(tempDiv);
        console.log("Background Color:", computedStyle.backgroundColor);
        console.log("Color:", computedStyle.color);
        console.log("Ancho calculado:", computedStyle.width);
        console.log("Alto calculado:", computedStyle.height);
        console.log("---------------------------------------------------------");
        // --- FIN DE DEPURACIÓN ---

        try {
            const imgData = await domtoimage.toPng(tempDiv, {
                quality: 0.95,
                bgcolor: '#ffffff',
                // Aseguramos que el ancho y alto del elemento a capturar sean los del A4
                width: tempDiv.offsetWidth,
                height: tempDiv.offsetHeight,
            });

            const img = new Image();
            img.src = imgData;
            await new Promise(resolve => img.onload = resolve);

            // --- INICIO DE DEPURACIÓN DE IMAGEN ---
            console.log("--- Dimensiones de la imagen capturada ---");
            console.log("Ancho de la imagen:", img.width);
            console.log("Alto de la imagen:", img.height);
            console.log("Longitud de imgData (base64):", imgData.length); // Si es muy corta, la imagen está vacía.
            console.log("------------------------------------------");
            // --- FIN DE DEPURACIÓN DE IMAGEN ---

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // Ancho A4 en mm
            const pageHeight = 297; // Altura A4 en mm
            // Calculamos la altura de la imagen escalada para que quepa en el ancho A4
            const imgHeight = img.height * imgWidth / img.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Añadir la primera página
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Añadir páginas adicionales si el contenido es más largo que una página
            while (heightLeft > 0) {
                position -= pageHeight; // Mover la posición hacia arriba para mostrar la siguiente sección de la imagen
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`boleta-${order.id}.pdf`);
        } catch (error) {
            console.error("Error al generar el PDF con dom-to-image:", error);
            // Podrías añadir una alerta visual al usuario aquí
        } finally {
            root.unmount();
            document.body.removeChild(tempDiv);
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={generatePdf}
            className={`${className} px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={isGenerating}
        >
            {isGenerating ? 'Generando Boleta...' : buttonText}
        </button>
    );
};

export default DownloadReceiptButton;
