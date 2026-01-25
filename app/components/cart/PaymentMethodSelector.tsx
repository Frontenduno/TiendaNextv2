// components/cart/PaymentMethodSelector.tsx
'use client';

import React, { useState } from 'react';
import { CreditCard, Building2, Wallet, Upload, CheckCircle2 } from 'lucide-react';

type PaymentMethod = 'card' | 'transfer' | 'wallet';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  onPaymentConfirm?: (isConfirmed: boolean) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  onPaymentConfirm
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  const [selectedWallet, setSelectedWallet] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [proofUploaded, setProofUploaded] = useState(false);

  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      title: 'Tarjeta de crédito/débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'transfer' as PaymentMethod,
      title: 'Transferencia bancaria',
      icon: Building2,
      description: 'BCP, Interbank, BBVA'
    },
    {
      id: 'wallet' as PaymentMethod,
      title: 'Billetera digital',
      icon: Wallet,
      description: 'Yape, Plin, Tunki'
    }
  ];

  const banks = ['BCP', 'Interbank', 'BBVA', 'Scotiabank', 'Banco Pichincha'];
  const wallets = ['Yape', 'Plin', 'Tunki'];

  // Verificar si el formulario está completo
  const isCardFormComplete: boolean = !!(cardNumber.length === 16 && cardName && expiryDate && cvv);
  const isTransferFormComplete: boolean = !!(selectedBank && accountNumber);
  const isWalletFormComplete: boolean = !!(selectedWallet && phoneNumber && proofUploaded);

  React.useEffect(() => {
    if (onPaymentConfirm) {
      let isComplete = false;
      
      if (selectedMethod === 'card') {
        isComplete = isCardFormComplete;
      } else if (selectedMethod === 'transfer') {
        isComplete = isTransferFormComplete;
      } else if (selectedMethod === 'wallet') {
        isComplete = isWalletFormComplete;
      }
      
      onPaymentConfirm(isComplete);
    }
  }, [selectedMethod, isCardFormComplete, isTransferFormComplete, isWalletFormComplete, onPaymentConfirm]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofUploaded(true);
    }
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 16);
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Método de pago</h2>

        {/* Métodos de pago */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;

            return (
              <button
                key={method.id}
                onClick={() => onMethodChange(method.id)}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all
                  ${isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2.5 rounded-lg
                    ${isSelected ? 'bg-blue-600' : 'bg-gray-100'}
                  `}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>

                  <div className="flex-1">
                    <h3 className={`
                      font-semibold mb-0.5
                      ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                    `}>
                      {method.title}
                    </h3>
                    <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                      {method.description}
                    </p>
                  </div>

                  {/* Radio indicator */}
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'border-blue-600' : 'border-gray-300'}
                  `}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Formularios según método seleccionado */}
        <div className="mt-6">
          {/* Formulario de tarjeta */}
          {selectedMethod === 'card' && (
            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Datos de la tarjeta</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                  maxLength={16}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre del titular
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="JUAN PEREZ"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Fecha de vencimiento
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/AA"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Formulario de transferencia */}
          {selectedMethod === 'transfer' && (
            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Datos de transferencia</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Banco
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="">Selecciona un banco</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Número de cuenta destino
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="19412345678901"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Realiza la transferencia a la cuenta proporcionada y adjunta el comprobante.
                </p>
              </div>
            </div>
          )}

          {/* Formulario de billetera digital */}
          {selectedMethod === 'wallet' && (
            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Datos de billetera digital</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Billetera
                </label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="">Selecciona una billetera</option>
                  {wallets.map((wallet) => (
                    <option key={wallet} value={wallet}>{wallet}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Número de teléfono
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="987654321"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                  maxLength={9}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Comprobante de pago
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="proof-upload"
                  />
                  <label
                    htmlFor="proof-upload"
                    className={`
                      flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                      ${proofUploaded 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-300 hover:border-gray-400 bg-white text-gray-600'
                      }
                    `}
                  >
                    {proofUploaded ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Comprobante cargado</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Subir comprobante</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Envía el pago al número proporcionado y sube una captura del comprobante.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};