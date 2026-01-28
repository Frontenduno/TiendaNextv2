// types/invoice.types.ts

/**
 * Tipos para el sistema de facturación
 * Estos tipos aseguran type-safety en toda la aplicación
 */

// Tipo de comprobante
export type VoucherType = 'boleta' | 'factura';

// Modo de selección de empresa
export type CompanySelectionMode = 'saved' | 'new';

// Datos de factura (datos mínimos requeridos)
export interface InvoiceData {
  ruc: string;
  razonSocial: string;
  direccionFiscal: string;
}

// Empresa guardada (incluye metadata adicional)
export interface Company extends InvoiceData {
  id: string;
  isDefault: boolean;
  verifiedAt?: string;
  createdAt: string;
}

// Estado de validación de factura
export interface InvoiceValidationState {
  isValid: boolean;
  errors: InvoiceValidationErrors;
}

// Errores de validación de campos de factura
export interface InvoiceValidationErrors {
  ruc?: string;
  razonSocial?: string;
  direccionFiscal?: string;
}

// Campos que pueden estar "tocados" (touched) en el formulario
export interface InvoiceTouchedFields {
  ruc?: boolean;
  razonSocial?: boolean;
  direccionFiscal?: boolean;
}

// Props del componente PurchaseTermsSection
export interface PurchaseTermsSectionProps {
  onTermsChange: (accepted: boolean) => void;
  onVoucherTypeChange?: (type: VoucherType) => void;
  onInvoiceDataChange?: (data: InvoiceData | null, isValid: boolean) => void;
}

// Datos completos de la orden
export interface OrderData {
  items: CartItem[];
  deliveryMethod: 'home' | 'store';
  deliveryLocationId?: number | null;
  deliveryStoreId?: number | null;
  paymentMethod: 'card' | 'transfer' | 'wallet';
  voucherType: VoucherType;
  invoiceData: InvoiceData | null;
  registerData?: RegisterFormData | null;
}

// Item del carrito (ajustar según tu implementación)
export interface CartItem {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  // ... otros campos según tu implementación
}

// Datos de registro (importar desde tus schemas)
export interface RegisterFormData {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Respuesta de la API al crear una orden
export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  invoiceNumber?: string;
  error?: string;
}

// Respuesta de la API al validar RUC
export interface ValidateRucResponse {
  isValid: boolean;
  razonSocial?: string;
  direccion?: string;
  estado?: string;
  condicion?: string;
  error?: string;
}