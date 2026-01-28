'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart/cartStore';
import { useDeliveryStore } from '@/store/delivery/deliveryStore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { DeliveryMethodSelector } from '@/components/cart/DeliveryMethodSelector';
import { DeliveryLocationSelector } from '@/components/cart/DeliveryLocationSelector';
import { StoreSelector } from '@/components/cart/StoreSelector';
import { PaymentMethodSelector } from '@/components/cart/PaymentMethodSelector';
import { PaymentSuccessModal } from '@/components/cart/PaymentSuccessModal';
import { ProductCarousel } from '@/feature/carousel-product/ProductCarousel';
import { HeroBanner } from '@/components/shared/HeroBanner';
import { CartRegisterSection } from '@/components/cart/CartRegisterSection';
import { PurchaseTermsSection } from '@/components/cart/PurchaseTermsSection';
import { Toast } from '@/components/toast';
import type { RegisterFormData, InvoiceData } from '@/utils/validations/schemas';

type PaymentMethod = 'card' | 'transfer' | 'wallet';
type VoucherType = 'boleta' | 'factura';

interface OrderData {
  items: ReturnType<typeof useCartStore.getState>['items'];
  deliveryMethod: 'home' | 'store';
  deliveryLocationId: number | null;
  deliveryStoreId: number | null;
  paymentMethod: PaymentMethod;
  voucherType: VoucherType;
  invoiceData: InvoiceData | null;
  registerData: RegisterFormData | null;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { 
    method, 
    selectedLocationId, 
    selectedStoreId,
    setMethod,
    setSelectedLocation,
    setSelectedStore
  } = useDeliveryStore();
  
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  
  // Estados de UI
  const [isVendorExpanded, setIsVendorExpanded] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados de pago
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [isPaymentFormComplete, setIsPaymentFormComplete] = useState(false);
  
  // Estados de registro
  const [isUserRegistered] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterFormData | null>(null);
  const [isRegisterDataValid, setIsRegisterDataValid] = useState(false);
  const [acceptRegisterTerms, setAcceptRegisterTerms] = useState(false);
  
  // Estados de facturación
  const [voucherType, setVoucherType] = useState<VoucherType>('boleta');
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isInvoiceDataValid, setIsInvoiceDataValid] = useState(true);
  const [acceptPurchaseTerms, setAcceptPurchaseTerms] = useState(false);

  // Handlers de pago
  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setIsPaymentFormComplete(false);
    showToast('Método de pago seleccionado', 'info');
  }, [showToast]);

  const handlePaymentFormConfirm = useCallback((isComplete: boolean) => {
    setIsPaymentFormComplete(isComplete);
    if (isComplete) {
      showToast('✓ Datos de pago completados', 'success');
    }
  }, [showToast]);

  // Handlers de registro
  const handleRegisterDataChange = useCallback((data: RegisterFormData | null, isValid: boolean) => {
    setRegisterData(data);
    setIsRegisterDataValid(isValid);
  }, []);

  const handleRegisterTermsChange = useCallback((accepted: boolean) => {
    setAcceptRegisterTerms(accepted);
    if (accepted) {
      showToast('✓ Términos de registro aceptados', 'success');
    }
  }, [showToast]);

  // Handlers de facturación
  const handleVoucherTypeChange = useCallback((type: VoucherType) => {
    setVoucherType(type);
    showToast(`Tipo de comprobante: ${type === 'boleta' ? 'Boleta' : 'Factura'}`, 'info');
  }, [showToast]);

  const handleInvoiceDataChange = useCallback((data: InvoiceData | null, isValid: boolean) => {
    setInvoiceData(data);
    setIsInvoiceDataValid(isValid);
    
    if (data && isValid) {
      showToast('✓ Datos de factura válidos', 'success');
    }
  }, [showToast]);

  const handlePurchaseTermsChange = useCallback((accepted: boolean) => {
    setAcceptPurchaseTerms(accepted);
    if (accepted) {
      showToast('✓ Términos de compra aceptados', 'success');
    }
  }, [showToast]);

  // Handler para actualizar cantidad con notificación
  const handleUpdateQuantity = useCallback((productId: number, quantity: number) => {
    updateQuantity(productId, quantity);
    showToast(`Cantidad actualizada: ${quantity}`, 'info');
  }, [updateQuantity, showToast]);

  // Handler para eliminar item con notificación
  const handleRemoveItem = useCallback((productId: number) => {
    removeItem(productId);
    showToast('Producto eliminado del carrito', 'warning');
  }, [removeItem, showToast]);

  // Validar si se puede proceder con el pago
  const canProceedWithPayment = useMemo(() => {
    const hasDeliveryInfo = (method === 'home' && selectedLocationId !== null) || 
                           (method === 'store' && selectedStoreId !== null);
    const hasValidRegisterData = isUserRegistered || (isRegisterDataValid && acceptRegisterTerms);
    const hasValidInvoiceData = voucherType === 'boleta' || (voucherType === 'factura' && isInvoiceDataValid);
    
    return hasDeliveryInfo && 
           isPaymentFormComplete && 
           hasValidRegisterData && 
           hasValidInvoiceData && 
           acceptPurchaseTerms;
  }, [
    method, 
    selectedLocationId, 
    selectedStoreId, 
    isPaymentFormComplete, 
    isUserRegistered, 
    isRegisterDataValid, 
    acceptRegisterTerms,
    voucherType,
    isInvoiceDataValid,
    acceptPurchaseTerms
  ]);

  const handlePaymentComplete = async () => {
    if (!canProceedWithPayment) {
      // Mostrar mensajes específicos sobre qué falta
      if (method === 'home' && selectedLocationId === null) {
        showToast('⚠️ Selecciona una dirección de entrega', 'warning');
        return;
      }
      if (method === 'store' && selectedStoreId === null) {
        showToast('⚠️ Selecciona una tienda para recoger', 'warning');
        return;
      }
      if (!isPaymentFormComplete) {
        showToast('⚠️ Completa los datos de pago', 'warning');
        return;
      }
      if (!isUserRegistered && !isRegisterDataValid) {
        showToast('⚠️ Completa tus datos de registro', 'warning');
        return;
      }
      if (!isUserRegistered && !acceptRegisterTerms) {
        showToast('⚠️ Acepta los términos de registro', 'warning');
        return;
      }
      if (voucherType === 'factura' && !isInvoiceDataValid) {
        showToast('⚠️ Completa los datos de factura correctamente', 'warning');
        return;
      }
      if (!acceptPurchaseTerms) {
        showToast('⚠️ Acepta los términos y condiciones de compra', 'warning');
        return;
      }
      
      showToast('⚠️ Completa todos los datos requeridos', 'warning');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Registrar usuario si es necesario
      if (!isUserRegistered && registerData) {
        showToast('Registrando usuario...', 'info');
        
        const result = await registerUser(
          registerData.nombre,
          registerData.apellido,
          registerData.email,
          registerData.password
        );

        if (!result.success) {
          // Verificar si el error es por correo duplicado
          if (result.error?.toLowerCase().includes('correo') || 
              result.error?.toLowerCase().includes('email') ||
              result.error?.toLowerCase().includes('ya existe') ||
              result.error?.toLowerCase().includes('registrado')) {
            showToast('❌ Este correo ya está registrado. Por favor usa otro correo o inicia sesión.', 'error');
          } else {
            showToast(`❌ Error al registrarse: ${result.error || 'Intenta de nuevo'}`, 'error');
          }
          setIsProcessing(false);
          return;
        }
        
        showToast('✓ Usuario registrado exitosamente', 'success');
      }

      // Preparar datos de la orden
      const orderData: OrderData = {
        items,
        deliveryMethod: method,
        deliveryLocationId: method === 'home' ? selectedLocationId : null,
        deliveryStoreId: method === 'store' ? selectedStoreId : null,
        paymentMethod: selectedPaymentMethod,
        voucherType,
        invoiceData: voucherType === 'factura' ? invoiceData : null,
        registerData: !isUserRegistered ? registerData : null,
      };

      // TODO: Enviar orden al backend
      console.log('📦 Orden preparada:', orderData);
      
      showToast('Procesando pago...', 'info');
      
      // Simulación de envío al backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('✓ ¡Pago procesado exitosamente!', 'success');
      setShowPaymentSuccess(true);
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      showToast('❌ Error al procesar el pago. Intenta de nuevo.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    setShowPaymentSuccess(false);
    clearCart();
    setIsPaymentFormComplete(false);
    showToast('Carrito limpiado. Redirigiendo a tu perfil...', 'info');
    router.push("/profile/datos-personales");
  };

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <HeroBanner
            title="Tu carrito está vacío"
            subtitle="Agrega productos para comenzar tu compra"
            gradient="from-gray-600 to-gray-800"
            padding="p-12 mb-8"
            className="relative"
          />
          
          <div className="max-w-2xl mx-auto text-center mb-12">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 font-semibold hover:bg-blue-700 transition"
            >
              Ir a comprar
            </Link>
          </div>

          <ProductCarousel 
            titulo="💎 Productos que podrían interesarte"
            filtro="mas-vendidos"
            cardSize="md"
            imageAspect="portrait"
            addToCartBehavior="always"
          />
        </div>
      </div>
    );
  }

  const hasLocationOrStore = (method === 'home' && selectedLocationId !== null) || 
                             (method === 'store' && selectedStoreId !== null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <HeroBanner
          title="Mi Carrito de Compras"
          subtitle={`${items.length} ${items.length === 1 ? 'producto' : 'productos'} en tu carrito`}
          gradient="from-blue-600 to-blue-800"
          padding="p-6 sm:p-8 mb-6"
          titleClassName="text-2xl sm:text-3xl"
          subtitleClassName="text-base sm:text-lg"
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna principal */}
          <div className="flex-1 space-y-6">
            {/* Lista de productos */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setIsVendorExpanded(!isVendorExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">Vendido por</p>
                  <p className="font-semibold text-gray-900">
                    <span className="text-blue-600">JyP</span>
                  </p>
                </div>
                {isVendorExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isVendorExpanded && (
                <div className="border-t border-gray-200">
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.idProducto} className="p-4">
                        <div className="hidden sm:block">
                          <CartItemCard
                            item={item}
                            onUpdateQuantity={(quantity) => handleUpdateQuantity(item.idProducto, quantity)}
                            onRemove={() => handleRemoveItem(item.idProducto)}
                            layout="default"
                          />
                        </div>

                        <div className="sm:hidden">
                          <CartItemCard
                            item={item}
                            onUpdateQuantity={(quantity) => handleUpdateQuantity(item.idProducto, quantity)}
                            onRemove={() => handleRemoveItem(item.idProducto)}
                            layout="compact"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sección de registro (solo si no está registrado) */}
            {!isUserRegistered && (
              <CartRegisterSection 
                onDataChange={handleRegisterDataChange}
                onTermsChange={handleRegisterTermsChange}
              />
            )}

            {/* Método de entrega */}
            <DeliveryMethodSelector
              selectedMethod={method}
              onMethodChange={setMethod}
            />

            {/* Selector de ubicación o tienda */}
            {method === 'home' ? (
              <DeliveryLocationSelector
                selectedLocationId={selectedLocationId}
                onLocationSelect={setSelectedLocation}
              />
            ) : (
              <StoreSelector
                selectedStoreId={selectedStoreId}
                onStoreSelect={setSelectedStore}
              />
            )}

            {/* Método de pago y términos (solo si hay ubicación/tienda seleccionada) */}
            {hasLocationOrStore && (
              <>
                <PaymentMethodSelector 
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={handlePaymentMethodChange}
                  onPaymentConfirm={handlePaymentFormConfirm}
                />
                <PurchaseTermsSection
                  onTermsChange={handlePurchaseTermsChange}
                  onVoucherTypeChange={handleVoucherTypeChange}
                  onInvoiceDataChange={handleInvoiceDataChange}
                />
              </>
            )}
          </div>

          {/* Resumen del carrito - Desktop */}
          <div className="hidden lg:block w-full lg:w-96">
            <CartSummary
              items={items}
              onPaymentComplete={handlePaymentComplete}
              freeShippingThreshold={100}
              deliveryMethod={method}
              hasSelectedLocation={selectedLocationId !== null}
              hasSelectedStore={selectedStoreId !== null}
              selectedPaymentMethod={selectedPaymentMethod}
              hasSelectedPaymentMethod={isPaymentFormComplete}
              isUserRegistered={isUserRegistered}
              hasRegisterData={isRegisterDataValid && (!isUserRegistered ? acceptRegisterTerms : true)}
              hasAcceptedPurchaseTerms={acceptPurchaseTerms}
              hasValidInvoiceData={voucherType === 'boleta' || isInvoiceDataValid}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Resumen del carrito - Mobile (fixed bottom) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <CartSummary
            items={items}
            onPaymentComplete={handlePaymentComplete}
            freeShippingThreshold={100}
            deliveryMethod={method}
            hasSelectedLocation={selectedLocationId !== null}
            hasSelectedStore={selectedStoreId !== null}
            selectedPaymentMethod={selectedPaymentMethod}
            hasSelectedPaymentMethod={isPaymentFormComplete}
            isUserRegistered={isUserRegistered}
            hasRegisterData={isRegisterDataValid && (!isUserRegistered ? acceptRegisterTerms : true)}
            hasAcceptedPurchaseTerms={acceptPurchaseTerms}
            hasValidInvoiceData={voucherType === 'boleta' || isInvoiceDataValid}
            isProcessing={isProcessing}
          />
        </div>

        {/* Carruseles de productos relacionados */}
        <div className="mt-16">
          <ProductCarousel 
            titulo="⚡ Completa tu compra"
            filtro="mas-vendidos"
            layout="horizontal"
            cardSize="sm"
            showColors={false}
            addToCartBehavior="always"
            maxTags={1}
          />
        </div>

        <div className="mt-12 mb-8">
          <ProductCarousel 
            titulo="🔥 Ofertas que no puedes dejar pasar"
            filtro="descuentos"
            cardSize="sm"
            imageAspect="square"
            addToCartBehavior="always"
            maxTags={2}
          />
        </div>

        {/* Espaciador para mobile */}
        <div className="h-32 lg:hidden" />
      </div>

      {/* Modal de éxito */}
      <PaymentSuccessModal
        isOpen={showPaymentSuccess}
        onClose={handleModalClose}
      />

      {/* Toast de notificaciones */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={4000}
        />
      )}
    </div>
  );
}