'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

import CartItemComponent from '@/components/cart/CartItemComponent';
import CartSummary from '@/components/cart/card/CartSummary';
import Modal from '@/components/cart/Shipping/Modal';
import ShippingMethods from '@/components/cart/Shipping/ShippingMethods';
import PaymentMethods from '@/components/cart/card/PaymentMethods';
import AddressEditForm from '@/components/cart/Shipping/AddressEditForm';
import PurchaseConfirmation from '@/components/cart/PurchaseConfirmation';

import { useCart } from '@/context/CartContext';
import { DisplayedCartItem } from '@/types/cart';
import { Order, OrderItem } from '@/types/order';

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

export default function CartView() {
  const {
    displayedCart,
    totalItems,
    subtotal,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const router = useRouter();

  const [viewState, setViewState] = useState<'cart' | 'summary' | 'payment' | 'card-form' | 'confirmation'>('cart');
  const [metodoEnvio, setMetodoEnvio] = useState<'retiro' | 'envio'>('retiro');
  const [formaPago, setFormaPago] = useState<string | undefined>(undefined);

  const [mostrarModalEnvio, setMostrarModalEnvio] = useState(false);
  const [mostrarModalDireccion, setMostrarModalDireccion] = useState(false);

  const [culqiLoaded, setCulqiLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingCulqi, setLoadingCulqi] = useState(false);

  const culqiPublicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

  const [confirmedPurchaseData, setConfirmedPurchaseData] = useState<{
    cart: DisplayedCartItem[];
    totalItems: number;
    total: number;
    descuento: number;
    metodoEnvio: 'retiro' | 'envio';
    formaPago?: string;
    transactionId?: string;
    transactionDate?: string;
    transactionTime?: string;
    orderId?: string;
  } | null>(null);

  const handleIncrement = useCallback((itemToUpdate: DisplayedCartItem) => {
    incrementQuantity(itemToUpdate.id);
  }, [incrementQuantity]);

  const handleDecrement = useCallback((itemToUpdate: DisplayedCartItem) => {
    decrementQuantity(itemToUpdate.id);
  }, [decrementQuantity]);

  const handleRemove = useCallback((productId: number) => {
    removeItem(productId);
  }, [removeItem]);

  const descuento = useMemo(() => {
    return totalItems >= 5 ? subtotal * 0.1 : 0;
  }, [totalItems, subtotal]);

  const saveOrderToHistory = useCallback((orderToSave: Order) => {
    if (typeof window !== 'undefined') {
      const existingOrdersString = localStorage.getItem('purchaseHistory');
      const existingOrders: Order[] = existingOrdersString ? JSON.parse(existingOrdersString) : [];

      const updatedOrders = [orderToSave, ...existingOrders];
      localStorage.setItem('purchaseHistory', JSON.stringify(updatedOrders));
    }
  }, []);

  const handleSelectPaymentMethod = useCallback((metodo: string) => {
    setFormaPago(metodo);
    if (metodo === 'credito' || metodo === 'debito') {
      setViewState('card-form');
    } else {
      const currentOrderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newOrder: Order = {
        id: currentOrderId,
        date: new Date().toISOString(),
        totalCost: subtotal - descuento,
        totalItems: totalItems,
        items: displayedCart.map(item => {
          const orderItem: OrderItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColorId: item.selectedColorId,
            image: item.image,
          };
          return orderItem;
        }),
        metodoEnvio: metodoEnvio,
        formaPago: metodo || 'No especificado',
      };

      saveOrderToHistory(newOrder);

      setConfirmedPurchaseData({
        cart: displayedCart,
        totalItems: totalItems,
        total: subtotal - descuento,
        descuento: descuento,
        metodoEnvio: metodoEnvio,
        formaPago: metodo,
        transactionId: 'N/A (Otro método de pago)',
        transactionDate: new Date().toLocaleDateString('es-PE'),
        transactionTime: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        orderId: currentOrderId,
      });
      clearCart();
      setViewState('confirmation');
    }
  }, [displayedCart, subtotal, descuento, totalItems, metodoEnvio, saveOrderToHistory, clearCart]);


  useEffect(() => {
    if (culqiLoaded && window.Culqi) {
      if (!culqiPublicKey) {
        console.error('NEXT_PUBLIC_CULQI_PUBLIC_KEY no está definida. Asegúrate de configurarla en .env.local');
        setErrorMessage('Error de configuración: Llave pública de Culqi no encontrada.');
        return;
      }
      window.Culqi.publicKey = culqiPublicKey;

      window.Culqi.options({
        lang: "auto",
        installments: false,
        paymentMethods: {
          tarjeta: true,
          yape: false,
          bancaMovil: false,
          agente: false,
          billetera: false,
          cuotealo: false,
        },
        style: {
        }
      });

      window.culqi = async () => {
        setLoadingCulqi(true);

        if (window.Culqi.token) {
          const token = window.Culqi.token;
          try {
            const currentOrderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

            const response = await fetch('/api/process-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: token.id,
                amount: Math.round(subtotal * 100),
                currency: 'USD',
                description: 'Compra en Mi Tienda Online',
                cartItems: displayedCart.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  selectedSize: item.selectedSize,
                  selectedColorId: item.selectedColorId,
                  image: item.image,
                })),
                orderId: currentOrderId,
                metodoEnvio: metodoEnvio,
                descuento: descuento,
                formaPago: formaPago,
              }),
            });

            const data = await response.json();
            if (response.ok) {
              window.Culqi.close();

              const newOrder: Order = {
                id: currentOrderId,
                date: new Date().toISOString(),
                totalCost: subtotal - descuento,
                totalItems: totalItems,
                items: displayedCart.map(item => {
                  const orderItem: OrderItem = {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    selectedSize: item.selectedSize,
                    selectedColorId: item.selectedColorId,
                    image: item.image,
                  };
                  return orderItem;
                }),
                metodoEnvio: metodoEnvio,
                formaPago: formaPago || 'No especificado',
              };
              saveOrderToHistory(newOrder);

              setConfirmedPurchaseData({
                cart: displayedCart,
                totalItems: totalItems,
                total: subtotal,
                descuento: descuento,
                metodoEnvio: metodoEnvio,
                formaPago: formaPago,
                transactionId: data.charge_id || 'N/A',
                transactionDate: new Date().toLocaleDateString('es-PE'),
                transactionTime: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
                orderId: currentOrderId,
              });
              clearCart();
              setViewState('confirmation');
            } else {
              setErrorMessage(data.message || 'Error al procesar el pago. Por favor, intente de nuevo.');
            }
          } catch (error) {
            setErrorMessage('Error de conexión al procesar el pago. Verifique su conexión.');
          } finally {
            setLoadingCulqi(false);
          }
        } else if (window.Culqi.error) {
            const error = window.Culqi.error;
            setErrorMessage(error.user_message || "Error al generar el token de pago. Código: " + error.code);
            setLoadingCulqi(false);
        } else {
            setErrorMessage('Error: Culqi no pudo procesar la operación. Intente de nuevo.');
            setLoadingCulqi(false);
        }
      };

    }
  }, [culqiLoaded, culqiPublicKey, subtotal, displayedCart, metodoEnvio, descuento, formaPago, saveOrderToHistory, clearCart, totalItems]);

  const handleCulqiLoad = () => {
    setCulqiLoaded(true);
  };

  const createCulqiToken = async () => {
    setLoadingCulqi(true);
    setErrorMessage(null);

    if (!culqiLoaded || !window.Culqi) {
      setErrorMessage("El SDK de Culqi no está cargado o inicializado correctamente. Por favor, espere un momento o recargue la página.");
      setLoadingCulqi(false);
      return;
    }
    if (subtotal <= 0.50) {
        setErrorMessage("El monto de la compra debe ser mayor a S/ 0.50 para procesar el pago.");
        setLoadingCulqi(false);
        return;
    }

    const culqiConfig = {
        amount: Math.round(subtotal * 100),
        currency: 'USD',
        description: 'Compra en Mi Tienda Online',
        order_id: `order-${Date.now()}`,
        buttonText: 'Pagar',
    };
    window.Culqi.settings(culqiConfig);

    window.Culqi.open();
  };


  const handleContinueAction = () => {
    switch (viewState) {
      case 'cart':
        if (displayedCart.length === 0) {
          setErrorMessage('Tu carrito está vacío. Añade productos para continuar.');
          return;
        }
        setViewState('summary');
        break;
      case 'summary':
        setViewState('payment');
        break;
      case 'payment':
        if (formaPago) {
            if (formaPago === 'credito' || formaPago === 'debito') {
                setViewState('card-form');
            }
        } else {
            setErrorMessage('Por favor, selecciona un método de pago para continuar.');
        }
        break;
      case 'card-form':
        break;
      case 'confirmation':
        router.push('/');
        break;
    }
  };

  const handleBackAction = () => {
    switch (viewState) {
      case 'summary':
        setViewState('cart');
        break;
      case 'payment':
        setViewState('summary');
        break;
      case 'card-form':
        setViewState('payment');
        setErrorMessage(null);
        setLoadingCulqi(false);
        break;
      case 'confirmation':
        router.push('/');
        break;
    }
  };

  const renderContent = () => {
    return (
      <>
        {viewState === 'cart' && (
          <div className="lg:w-2/3 space-y-4">
            <h2 className="text-xl font-semibold text-black mb-4">Mi Carrito</h2>
            {displayedCart.length === 0 ? (
              <p className="text-gray-600 text-center">Tu carrito está vacío.</p>
            ) : (
              displayedCart.map(item => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onIncrementAction={handleIncrement}
                  onDecrementAction={handleDecrement}
                  onRemoveAction={handleRemove}
                />
              ))
            )}
            {displayedCart.length > 0 && (
                <button
                    onClick={clearCart}
                    className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition"
                >
                    Vaciar Carrito
                </button>
            )}
          </div>
        )}

        {viewState === 'summary' && (
          <div className="lg:w-2/3 space-y-4">
            <h2 className="text-xl font-semibold text-black mb-4">Resumen de la compra</h2>
            {displayedCart.map(item => (
              <div key={item.id} className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
                <div className="w-20 h-20 relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-black">{item.name}</p>
                  <p className="text-black">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 text-sm">S/. {item.price.toFixed(2)}</p>
                  <p className="text-red-500 font-semibold text-lg">S/. {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => setMostrarModalEnvio(true)}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition cursor-pointer"
            >
              Cambiar método de envío
            </button>
          </div>
        )}

        {viewState === 'payment' && (
          <div className="lg:w-2/3">
            <PaymentMethods
              formaPago={formaPago}
              onSeleccionarFormaPago={handleSelectPaymentMethod}
            />
          </div>
        )}

        {viewState === 'card-form' && (
          <div className="lg:w-2/3 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-center text-black">Pago con Tarjeta</h2>
            <Script
              src="https://checkout.culqi.com/js/v4"
              strategy="afterInteractive"
              onLoad={handleCulqiLoad}
              onError={() => {
                setErrorMessage('Error al cargar el script de Culqi. Verifique su conexión a internet o intente recargar la página.');
                setLoadingCulqi(false);
              }}
            />

            <p className="text-center text-lg mb-6">Total a Pagar: S/ {subtotal.toFixed(2)}</p>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {errorMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={createCulqiToken}
              disabled={!culqiLoaded || loadingCulqi || subtotal <= 0.50}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold transition duration-300
                ${!culqiLoaded || loadingCulqi || subtotal <= 0.50 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loadingCulqi ? 'Procesando Pago...' : 'Pagar con Culqi'}
            </button>

            {!culqiLoaded && (
              <p className="text-sm text-gray-500 mt-2 text-center">Cargando Culqi...</p>
            )}
            {culqiLoaded && subtotal <= 0.50 && (
              <p className="text-sm text-gray-500 mt-2 text-center">El monto mínimo para pago es S/ 0.50.</p>
            )}
          </div>
        )}

        {viewState === 'confirmation' && confirmedPurchaseData && (
          <div className="lg:w-full">
            <PurchaseConfirmation
              cart={confirmedPurchaseData.cart}
              totalItems={confirmedPurchaseData.totalItems}
              total={confirmedPurchaseData.total}
              descuento={confirmedPurchaseData.descuento}
              metodoEnvio={confirmedPurchaseData.metodoEnvio}
              formaPago={confirmedPurchaseData.formaPago}
              transactionId={confirmedPurchaseData.transactionId}
              transactionDate={confirmedPurchaseData.transactionDate}
              transactionTime={confirmedPurchaseData.transactionTime}
              orderId={confirmedPurchaseData.orderId}
            />
          </div>
        )}
        {viewState === 'confirmation' && !confirmedPurchaseData && (
          <p className="text-red-500 text-center lg:w-full">Error: Datos de confirmación no disponibles.</p>
        )}
      </>
    );
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">
            {viewState === 'cart' && 'Tu Carrito'}
            {viewState === 'summary' && 'Resumen de Compra'}
            {viewState === 'payment' && 'Método de Pago'}
            {viewState === 'card-form' && 'Detalles de Tarjeta'}
            {viewState === 'confirmation' && 'Confirmación de Compra'}
          </h1>
          {viewState !== 'cart' && viewState !== 'confirmation' && (
            <button
              onClick={handleBackAction}
              className="text-blue-600 flex items-center gap-1 text-lg cursor-pointer group"
            >
              <span className="text-2xl">←</span>
              <span className="group-hover:underline">Volver</span>
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {renderContent()}
          {(viewState === 'cart' || viewState === 'summary' || viewState === 'payment' || viewState === 'card-form') && (
            <div className="lg:w-1/3">
              <CartSummary
                totalItems={totalItems}
                total={subtotal}
                descuento={descuento}
                viewState={viewState}
                formaPago={formaPago}
                onContinueAction={handleContinueAction}
                culqiLoaded={culqiLoaded}
                loadingCulqi={loadingCulqi}
              />
            </div>
          )}
        </div>
      </div>

      <Modal visible={mostrarModalEnvio} onClose={() => setMostrarModalEnvio(false)}>
        <ShippingMethods
          metodoEnvio={metodoEnvio}
          onMetodoChange={metodo => {
            setMetodoEnvio(metodo);
            setMostrarModalEnvio(false);
          }}
          onEditAddress={() => {
            setMostrarModalEnvio(false);
            setMostrarModalDireccion(true);
          }}
        />
      </Modal>

      <Modal visible={mostrarModalDireccion} onClose={() => setMostrarModalDireccion(false)}>
        <AddressEditForm
          onCancel={() => {
            setMostrarModalDireccion(false);
            setMostrarModalEnvio(true);
          }}
          onSave={e => {
            e.preventDefault();
            setMostrarModalDireccion(false);
            setMostrarModalEnvio(true);
          }}
        />
      </Modal>
    </main>
  );
}
