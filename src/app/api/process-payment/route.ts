import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { token, amount, currency, description, cartItems, orderId, metodoEnvio, descuento, formaPago } = await req.json();

        if (!token || amount === undefined || amount === null || !currency) {
            console.error('API Route: Faltan parámetros requeridos para Culqi (token, amount, currency).');
            return NextResponse.json({ message: 'Faltan parámetros requeridos para procesar el pago (token, amount, currency).' }, { status: 400 });
        }

        if (typeof amount !== 'number' || !Number.isInteger(amount)) {
            console.error('API Route: El monto debe ser un número entero (en centavos).');
            return NextResponse.json({ message: 'El monto del pago es inválido. Debe ser un número entero en centavos.' }, { status: 400 });
        }

        if (amount < 50) {
            console.error('API Route: El monto es menor al mínimo permitido por Culqi (50 centavos).');
            return NextResponse.json({ message: 'El monto de la compra es menor al mínimo permitido.' }, { status: 400 });
        }

        const culqiSecretKey = process.env.CULQI_SECRET_KEY;

        if (!culqiSecretKey) {
            console.error("API Route: CULQI_SECRET_KEY no está configurada en las variables de entorno.");
            return NextResponse.json({ message: 'Error de configuración del servidor: Clave secreta de pago no disponible.' }, { status: 500 });
        }

        const metadata: { [key: string]: any } = {
            internal_order_id: orderId || 'N/A',
            metodo_envio: metodoEnvio || 'N/A',
            descuento_aplicado: descuento !== undefined && descuento !== null ? descuento.toFixed(2) : '0.00',
            forma_pago: formaPago || 'N/A',
            cart_item_count: cartItems ? cartItems.length.toString() : '0',
        };

        const response = await fetch('https://api.culqi.com/v2/charges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${culqiSecretKey}`,
            },
            body: JSON.stringify({
                amount: amount,
                currency_code: currency,
                email: 'cliente_test@ejemplo.com',
                source_id: token,
                description: description || 'Compra en Trainer Sport',
                metadata: metadata,
            }),
        });

        const culqiResponse = await response.json();

        if (response.ok) {
            return NextResponse.json({ success: true, charge_id: culqiResponse.id }, { status: 200 });
        } else {
            console.error('API Route: Error al crear cargo Culqi:', culqiResponse);
            const errorMessage = culqiResponse.user_message || culqiResponse.merchant_message || culqiResponse.message || 'Error desconocido al procesar el pago.';
            return NextResponse.json({ success: false, message: errorMessage, details: culqiResponse }, { status: response.status });
        }
    } catch (error: any) {
        console.error('API Route: Error interno del servidor al procesar el pago:', error);
        return NextResponse.json({ success: false, message: `Error interno del servidor: ${error.message || 'Error desconocido.'}` }, { status: 500 });
    }
}
