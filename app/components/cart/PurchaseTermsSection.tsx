"use client";

import { useState, useEffect, useMemo } from "react";
import { FileText, Building2, ChevronDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { invoiceDataSchema, type InvoiceData, type Company } from "@/utils/validations/schemas";
import { ZodError } from "zod";
import companiesData from "@/data/companies-mock-data.json";

interface Props {
  onTermsChange: (accepted: boolean) => void;
  onVoucherTypeChange?: (type: 'boleta' | 'factura') => void;
  onInvoiceDataChange?: (data: InvoiceData | null, isValid: boolean) => void;
}

type VoucherType = 'boleta' | 'factura';
type CompanySelectionMode = 'saved' | 'new';

interface ValidationErrors {
  ruc?: string;
  razonSocial?: string;
  direccionFiscal?: string;
}

export function PurchaseTermsSection({ 
  onTermsChange, 
  onVoucherTypeChange,
  onInvoiceDataChange 
}: Props) {
  // Estados principales
  const [voucherType, setVoucherType] = useState<VoucherType>('boleta');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectionMode, setSelectionMode] = useState<CompanySelectionMode>('new');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  
  // Estados del formulario
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    ruc: '',
    razonSocial: '',
    direccionFiscal: ''
  });

  // Estados de validación
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Cargar empresas desde el JSON mockeado
  const savedCompanies = useMemo<Company[]>(() => {
    return companiesData.companies as Company[];
  }, []);

  const hasSavedCompanies = savedCompanies.length > 0;

  // Validar datos de factura en tiempo real
  const validateInvoiceData = (data: InvoiceData): { isValid: boolean; errors: ValidationErrors } => {
    try {
      invoiceDataSchema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: ValidationErrors = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ValidationErrors;
          if (field) {
            validationErrors[field] = issue.message;
          }
        });
        return { isValid: false, errors: validationErrors };
      }
      return { isValid: false, errors: {} };
    }
  };

  // Determinar si los datos de factura son válidos
  const isInvoiceDataValid = useMemo((): boolean => {
    if (voucherType === 'boleta') return true;
    
    if (selectionMode === 'saved' && selectedCompanyId) {
      return true;
    }
    
    const { isValid } = validateInvoiceData(invoiceData);
    return isValid;
  }, [voucherType, selectionMode, selectedCompanyId, invoiceData]);

  // Notificar cambios al componente padre
  useEffect(() => {
    if (voucherType === 'factura' && onInvoiceDataChange) {
      if (selectionMode === 'saved' && selectedCompanyId) {
        const selectedCompany = savedCompanies.find(c => c.id === selectedCompanyId);
        if (selectedCompany) {
          onInvoiceDataChange({
            ruc: selectedCompany.ruc,
            razonSocial: selectedCompany.razonSocial,
            direccionFiscal: selectedCompany.direccionFiscal
          }, true);
        }
      } else if (selectionMode === 'new') {
        const { isValid } = validateInvoiceData(invoiceData);
        onInvoiceDataChange(isValid ? invoiceData : null, isValid);
      }
    } else if (voucherType === 'boleta' && onInvoiceDataChange) {
      onInvoiceDataChange(null, true);
    }
  }, [voucherType, invoiceData, selectionMode, selectedCompanyId, onInvoiceDataChange, savedCompanies]);

  // Handlers
  const handleVoucherChange = (type: VoucherType) => {
    setVoucherType(type);
    onVoucherTypeChange?.(type);
    
    if (type === 'boleta') {
      setInvoiceData({ ruc: '', razonSocial: '', direccionFiscal: '' });
      setErrors({});
      setTouched({});
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked);
    onTermsChange(checked);
  };

  const handleModeChange = (mode: CompanySelectionMode) => {
    setSelectionMode(mode);
    
    if (mode === 'saved') {
      setErrors({});
      setTouched({});
      // Si hay una empresa predeterminada, seleccionarla
      const defaultCompany = savedCompanies.find(c => c.isDefault);
      if (defaultCompany) {
        setSelectedCompanyId(defaultCompany.id);
      }
    } else {
      setSelectedCompanyId('');
    }
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
    const company = savedCompanies.find(c => c.id === companyId);
    if (company) {
      setInvoiceData({
        ruc: company.ruc,
        razonSocial: company.razonSocial,
        direccionFiscal: company.direccionFiscal
      });
    }
  };

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    const newData = { ...invoiceData, [field]: value };
    setInvoiceData(newData);

    // Validar solo el campo que cambió si ya fue tocado
    if (touched[field]) {
      const { errors: newErrors } = validateInvoiceData(newData);
      setErrors(prev => ({
        ...prev,
        [field]: newErrors[field]
      }));
    }
  };

  const handleBlur = (field: keyof InvoiceData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const { errors: newErrors } = validateInvoiceData(invoiceData);
    setErrors(prev => ({
      ...prev,
      [field]: newErrors[field]
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Comprobante de pago</h3>
            <p className="text-sm text-gray-600">Selecciona el tipo de comprobante</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Selector de tipo de comprobante */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleVoucherChange('boleta')}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              voucherType === 'boleta'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
          >
            <div className="font-semibold mb-1">Boleta</div>
            <div className="text-xs text-gray-600">Para personas naturales</div>
          </button>

          <button
            type="button"
            onClick={() => handleVoucherChange('factura')}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              voucherType === 'factura'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
          >
            <div className="font-semibold mb-1">Factura</div>
            <div className="text-xs text-gray-600">Para empresas</div>
          </button>
        </div>

        {/* Formulario de datos de factura */}
        {voucherType === 'factura' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Datos para factura</h4>
            </div>

            {/* Selector: Empresa guardada vs Nueva */}
            {hasSavedCompanies && (
              <div className="space-y-3">
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectionMode === 'saved'}
                      onChange={() => handleModeChange('saved')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-900 font-medium">Usar empresa guardada</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectionMode === 'new'}
                      onChange={() => handleModeChange('new')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-900 font-medium">Nueva empresa</span>
                  </label>
                </div>

                {selectionMode === 'saved' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Selecciona una empresa
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCompanyId}
                        onChange={(e) => handleCompanySelect(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-gray-900"
                      >
                        <option value="" className="text-gray-500">Seleccionar empresa...</option>
                        {savedCompanies.map((company) => (
                          <option key={company.id} value={company.id} className="text-gray-900">
                            {company.razonSocial} - RUC: {company.ruc}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>

                    {selectedCompanyId && (
                      <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg space-y-1">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{invoiceData.razonSocial}</p>
                            <p className="text-gray-600 text-xs mt-1">RUC: {invoiceData.ruc}</p>
                            <p className="text-gray-600 text-xs">{invoiceData.direccionFiscal}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Formulario de nueva empresa */}
            {selectionMode === 'new' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    RUC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={invoiceData.ruc}
                    onChange={(e) => handleInputChange('ruc', e.target.value.replace(/\D/g, '').slice(0, 11))}
                    onBlur={() => handleBlur('ruc')}
                    placeholder="20123456789"
                    maxLength={11}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 ${
                      touched.ruc && errors.ruc
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {touched.ruc && errors.ruc && (
                    <div className="mt-1 flex items-start gap-1">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-600">{errors.ruc}</p>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Ingresa el RUC de 11 dígitos de tu empresa
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Razón Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={invoiceData.razonSocial}
                    onChange={(e) => handleInputChange('razonSocial', e.target.value.toUpperCase())}
                    onBlur={() => handleBlur('razonSocial')}
                    placeholder="EMPRESA SAC"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 ${
                      touched.razonSocial && errors.razonSocial
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {touched.razonSocial && errors.razonSocial && (
                    <div className="mt-1 flex items-start gap-1">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-600">{errors.razonSocial}</p>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Nombre o razón social registrado en SUNAT
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Dirección Fiscal <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={invoiceData.direccionFiscal}
                    onChange={(e) => handleInputChange('direccionFiscal', e.target.value)}
                    onBlur={() => handleBlur('direccionFiscal')}
                    placeholder="Av. Ejemplo 123, Distrito, Lima"
                    rows={2}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none text-gray-900 placeholder-gray-400 ${
                      touched.direccionFiscal && errors.direccionFiscal
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {touched.direccionFiscal && errors.direccionFiscal && (
                    <div className="mt-1 flex items-start gap-1">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-600">{errors.direccionFiscal}</p>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Dirección registrada en SUNAT
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-blue-800">
                    <strong>Nota:</strong> Los datos deben coincidir exactamente con los registrados en SUNAT. 
                    Puedes verificarlos en{" "}
                    <a 
                      href="https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline font-medium hover:text-blue-900"
                    >
                      Consulta RUC SUNAT
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Términos y condiciones */}
        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => handleTermsChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              Acepto los{" "}
              <a 
                href="/footer/legal/terminos-y-condiciones" 
                target="_blank" 
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                términos y condiciones
              </a>{" "}
              de compra
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}