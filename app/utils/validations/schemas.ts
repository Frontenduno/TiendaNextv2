// utils/validations/schemas.ts
import { z } from "zod";

// ============================================================================
// MENSAJES DE ERROR REUTILIZABLES
// ============================================================================

export const errorMessages = {
  required: (field: string) => `${field} es requerido`,
  minLength: (field: string, min: number) => `${field} debe tener al menos ${min} caracteres`,
  maxLength: (field: string, max: number) => `${field} no puede exceder ${max} caracteres`,
  onlyNumbers: (field: string) => `${field} solo puede contener números`,
  onlyLetters: (field: string) => `${field} solo puede contener letras`,
  onlyAlphanumeric: (field: string) => `${field} debe contener solo letras mayúsculas y números`,
  invalidEmail: "Ingresa un correo electrónico válido",
  invalidFormat: (field: string) => `El formato de ${field} no es válido`,
  exactLength: (field: string, length: number) => `${field} debe tener exactamente ${length} dígitos`,
  passwordsNoMatch: "Las contraseñas no coinciden",
  passwordRequirements: {
    minLength: "La contraseña debe tener al menos 8 caracteres",
    uppercase: "Debe contener al menos una mayúscula",
    lowercase: "Debe contener al menos una minúscula",
    number: "Debe contener al menos un número",
  },
};

// ============================================================================
// VALIDACIONES BASE REUTILIZABLES
// ============================================================================

export const documentValidations = {
  dni: z
    .string()
    .min(1, errorMessages.required("El DNI"))
    .regex(/^\d+$/, errorMessages.onlyNumbers("El DNI"))
    .length(8, errorMessages.exactLength("El DNI", 8)),
  
  carnetExtranjeria: z
    .string()
    .min(1, errorMessages.required("El Carnet de Extranjería"))
    .regex(/^[A-Z0-9]+$/, errorMessages.onlyAlphanumeric("El Carnet"))
    .min(9, errorMessages.minLength("El Carnet", 9))
    .max(12, errorMessages.maxLength("El Carnet", 12)),
  
  pasaporte: z
    .string()
    .min(1, errorMessages.required("El Pasaporte"))
    .regex(/^[A-Z0-9]+$/, errorMessages.onlyAlphanumeric("El Pasaporte"))
    .min(6, errorMessages.minLength("El Pasaporte", 6))
    .max(12, errorMessages.maxLength("El Pasaporte", 12)),
};

export const contactValidations = {
  phone: z
    .string()
    .min(1, errorMessages.required("El teléfono"))
    .regex(/^\d+$/, errorMessages.onlyNumbers("El teléfono"))
    .length(9, errorMessages.exactLength("El teléfono", 9)),
  
  email: z
    .string()
    .min(1, errorMessages.required("El correo electrónico"))
    .email(errorMessages.invalidEmail)
    .toLowerCase(),
};

export const textValidations = {
  fullName: z
    .string()
    .min(1, errorMessages.required("El nombre completo"))
    .min(3, errorMessages.minLength("El nombre", 3))
    .max(100, errorMessages.maxLength("El nombre", 100))
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, errorMessages.onlyLetters("El nombre")),
  
  firstName: z
    .string()
    .min(1, errorMessages.required("El nombre"))
    .min(2, errorMessages.minLength("El nombre", 2))
    .max(50, errorMessages.maxLength("El nombre", 50))
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, errorMessages.onlyLetters("El nombre")),

  lastName: z
    .string()
    .min(1, errorMessages.required("El apellido"))
    .min(2, errorMessages.minLength("El apellido", 2))
    .max(50, errorMessages.maxLength("El apellido", 50))
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, errorMessages.onlyLetters("El apellido")),
  
  shortText: (fieldName: string, minLength = 3, maxLength = 200) =>
    z
      .string()
      .min(1, errorMessages.required(fieldName))
      .min(minLength, errorMessages.minLength(fieldName, minLength))
      .max(maxLength, errorMessages.maxLength(fieldName, maxLength)),
  
  longText: (fieldName: string, minLength = 10, maxLength = 1000) =>
    z
      .string()
      .min(1, errorMessages.required(fieldName))
      .min(minLength, errorMessages.minLength(fieldName, minLength))
      .max(maxLength, errorMessages.maxLength(fieldName, maxLength)),
};

export const passwordValidations = {
  basicPassword: z
    .string()
    .min(1, errorMessages.required("La contraseña"))
    .min(6, errorMessages.minLength("La contraseña", 6))
    .max(50, errorMessages.maxLength("La contraseña", 50)),

  strongPassword: z
    .string()
    .min(8, errorMessages.passwordRequirements.minLength)
    .regex(/[A-Z]/, errorMessages.passwordRequirements.uppercase)
    .regex(/[a-z]/, errorMessages.passwordRequirements.lowercase)
    .regex(/[0-9]/, errorMessages.passwordRequirements.number),
};

// ============================================================================
// SCHEMAS DE FORMULARIOS COMPLETOS
// ============================================================================

// LIBRO DE RECLAMACIONES
const libroReclamacionesBaseSchema = z.object({
  documentType: z.enum(["dni", "carnet_extranjeria", "pasaporte"], {
    message: errorMessages.required("El tipo de documento"),
  }),
  documentNumber: z.string().min(1, errorMessages.required("El número de documento")),
  fullName: textValidations.fullName,
  phone: contactValidations.phone,
  email: contactValidations.email,
  complaintDetail: textValidations.longText("La descripción del reclamo", 20, 1000),
  expectedSolution: textValidations.longText("La solución esperada", 10, 500),
});

export const libroReclamacionesSchema = libroReclamacionesBaseSchema.superRefine(
  (data, ctx) => {
    let documentSchema: z.ZodString;
    
    switch (data.documentType) {
      case "dni":
        documentSchema = documentValidations.dni;
        break;
      case "carnet_extranjeria":
        documentSchema = documentValidations.carnetExtranjeria;
        break;
      case "pasaporte":
        documentSchema = documentValidations.pasaporte;
        break;
      default:
        return;
    }

    const result = documentSchema.safeParse(data.documentNumber);
    
    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error.issues[0].message,
        path: ["documentNumber"],
      });
    }
  }
);

export type LibroReclamacionesFormData = z.infer<typeof libroReclamacionesBaseSchema>;

// FORMULARIO DE CONTACTO
export const contactFormSchema = z.object({
  fullName: textValidations.fullName,
  email: contactValidations.email,
  phone: contactValidations.phone,
  subject: textValidations.shortText("El asunto", 5, 100),
  message: textValidations.longText("El mensaje", 20, 1000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// REGISTRO DE USUARIO
const userRegistrationBaseSchema = z.object({
  documentType: z.enum(["dni", "carnet_extranjeria", "pasaporte"]),
  documentNumber: z.string().min(1, errorMessages.required("El número de documento")),
  fullName: textValidations.fullName,
  email: contactValidations.email,
  phone: contactValidations.phone,
  password: passwordValidations.strongPassword,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: errorMessages.passwordsNoMatch,
  path: ["confirmPassword"],
});

export const userRegistrationSchema = userRegistrationBaseSchema.superRefine(
  (data, ctx) => {
    let documentSchema: z.ZodString;

    switch (data.documentType) {
      case "dni":
        documentSchema = documentValidations.dni;
        break;
      case "carnet_extranjeria":
        documentSchema = documentValidations.carnetExtranjeria;
        break;
      case "pasaporte":
        documentSchema = documentValidations.pasaporte;
        break;
      default:
        return;
    }

    const result = documentSchema.safeParse(data.documentNumber);

    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error.issues[0].message,
        path: ["documentNumber"],
      });
    }
  }
);

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

// ============================================================================
// NUEVOS SCHEMAS PARA FORMULARIOS ADICIONALES
// ============================================================================

// UBICACIÓN
export const locationSchema = z.object({
  alias: textValidations.shortText("El nombre de la ubicación", 3, 50),
  direccion: textValidations.shortText("La dirección", 5, 200),
  distrito: textValidations.shortText("El distrito", 3, 50),
  ciudad: z.string().min(1, errorMessages.required("La ciudad")),
  referencia: textValidations.shortText("La referencia", 5, 200),
  nombreContacto: textValidations.fullName,
  telefono: contactValidations.phone,
  esPrincipal: z.boolean(),
});

export type LocationFormData = z.infer<typeof locationSchema>;

// DATOS PERSONALES
export const personalDataSchema = z.object({
  nombre: textValidations.firstName,
  apellido: textValidations.lastName,
  correo: contactValidations.email,
});

export type PersonalDataFormData = z.infer<typeof personalDataSchema>;

// LOGIN
export const loginSchema = z.object({
  email: contactValidations.email,
  password: passwordValidations.basicPassword,
});

export type LoginFormData = z.infer<typeof loginSchema>;

// REGISTRO SIMPLE
export const registerSchema = z
  .object({
    nombre: textValidations.firstName,
    apellido: textValidations.lastName,
    email: contactValidations.email,
    password: passwordValidations.basicPassword,
    confirmPassword: z.string().min(1, errorMessages.required("La confirmación de contraseña")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorMessages.passwordsNoMatch,
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// RECUPERACIÓN DE CONTRASEÑA - PASO 1
export const recoveryEmailSchema = z.object({
  email: contactValidations.email,
});

export type RecoveryEmailFormData = z.infer<typeof recoveryEmailSchema>;

// RECUPERACIÓN DE CONTRASEÑA - PASO 2
export const recoveryCodeSchema = z.object({
  code: z
    .string()
    .min(1, errorMessages.required("El código"))
    .length(6, errorMessages.exactLength("El código", 6))
    .regex(/^\d+$/, errorMessages.onlyNumbers("El código")),
});

export type RecoveryCodeFormData = z.infer<typeof recoveryCodeSchema>;

// RECUPERACIÓN DE CONTRASEÑA - PASO 3
export const recoveryPasswordSchema = z
  .object({
    password: passwordValidations.basicPassword,
    confirmPassword: z.string().min(1, errorMessages.required("La confirmación de contraseña")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorMessages.passwordsNoMatch,
    path: ["confirmPassword"],
  });

export type RecoveryPasswordFormData = z.infer<typeof recoveryPasswordSchema>;