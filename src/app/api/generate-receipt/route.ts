import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
        }

        // En una aplicación real, aquí buscarías los detalles completos de la orden
        // en tu base de datos usando el orderId.
        // Por ahora, simularemos la recuperación de datos o usaremos los datos de ejemplo del historial.
        // Para simplificar, asumiremos que ya tienes la lógica para obtener el historial de órdenes
        // del localStorage en el frontend, y lo pasaremos aquí si fuera necesario,
        // o generaremos un HTML simple basado en el orderId.

        // ----- IMPORTANTE: ESTA ES UNA SIMULACIÓN DE CONTENIDO HTML -----
        // En una aplicación real, deberías cargar los datos de la orden
        // y generar un HTML dinámico y completo aquí.
        const receiptHtmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Boleta de Compra ${orderId}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; margin: 20mm; font-size: 10pt; color: #333; }
                    .container { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
                    .header { text-align: center; margin-bottom: 30px; }
                    .header h1 { color: #2a2a2a; font-size: 20pt; margin-bottom: 5px; }
                    .header p { color: #666; font-size: 10pt; }
                    .section-title { border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px; margin-bottom: 10px; font-size: 12pt; font-weight: bold; color: #444; }
                    .item-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    .item-table th, .item-table td { border: 1px solid #eee; padding: 8px; text-align: left; }
                    .item-table th { background-color: #f8f8f8; }
                    .total-section { text-align: right; margin-top: 20px; }
                    .total-section p { margin: 2px 0; }
                    .total-section .grand-total { font-size: 14pt; font-weight: bold; color: #000; }
                    .footer { text-align: center; margin-top: 40px; font-size: 9pt; color: #888; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Boleta de Venta</h1>
                        <p>Trainer Sport</p>
                        <p>RUC: 20123456789</p>
                        <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
                        <p>Hora: ${new Date().toLocaleTimeString('es-ES')}</p>
                    </div>

                    <div class="section-title">Información de la Orden</div>
                    <p><strong>ID de Orden:</strong> ${orderId}</p>
                    <p><strong>Cliente:</strong> Cliente de Prueba</p>
                    <p><strong>Email:</strong> cliente@ejemplo.com</p>

                    <div class="section-title">Detalle de Productos</div>
                    <table class="item-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unit.</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Producto Ejemplo 1</td>
                                <td>1</td>
                                <td>S/. 100.00</td>
                                <td>S/. 100.00</td>
                            </tr>
                            <tr>
                                <td>Producto Ejemplo 2</td>
                                <td>2</td>
                                <td>S/. 50.00</td>
                                <td>S/. 100.00</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="total-section">
                        <p>Subtotal: S/. 200.00</p>
                        <p>Envío: S/. 15.00</p>
                        <p>Descuento: S/. 5.00</p>
                        <p class="grand-total">Total Pagado: S/. 210.00</p>
                    </div>

                    <div class="footer">
                        <p>¡Gracias por tu compra!</p>
                        <p>Visítanos en www.trainersport.com</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        // ------------------------------------------------------------------

        const browser = await puppeteer.launch({
            headless: true, // true para producción, 'new' o false para depurar
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necesario para entornos de despliegue como Vercel/Render
        });
        const page = await browser.newPage();

        await page.setContent(receiptHtmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm',
            },
        });

        await browser.close();

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="boleta_compra_${orderId}.pdf"`,
            },
        });

    } catch (error) {
        console.error('API Route: Error al generar PDF:', error);
        return NextResponse.json({ message: 'Error interno del servidor al generar la boleta.' }, { status: 500 });
    }
}