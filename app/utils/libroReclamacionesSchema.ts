// utils/libroReclamacionesSchema.ts
import { z } from "zod";

export const documentTypes = ["dni", "carnet_extranjeria", "pasaporte"] as const;
export type DocumentType = (typeof documentTypes)[number];

export const libroReclamacionesSchema = z
  .object({
    documentType: z.enum(documentTypes, {
      message: "Selecciona un tipo de documento válido",
    }),
    documentNumber: z.string().min(1, "El número de documento es requerido"),
    fullName: z.string().min(1, "Los apellidos y nombres son requeridos"),
    phone: z
      .string()
      .min(1, "El teléfono es requerido")
      .regex(/^9\d{8}$/, "El teléfono debe tener 9 dígitos y comenzar con 9"),
    email: z
      .string()
      .min(1, "El correo electrónico es requerido")
      .email("El correo electrónico no es válido"),
    complaintDetail: z
      .string()
      .min(1, "El detalle del reclamo es requerido")
      .min(20, "El detalle debe tener al menos 20 caracteres"),
    expectedSolution: z.string().min(1, "La solución esperada es requerida"),
  })
  .superRefine((data, ctx) => {
    // Validación condicional para DNI
    if (data.documentType === "dni" && !/^\d{8}$/.test(data.documentNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El DNI debe tener 8 dígitos",
        path: ["documentNumber"],
      });
    }
  });

export type LibroReclamacionesFormData = z.infer<typeof libroReclamacionesSchema>;

// Función helper para validar y obtener errores formateados
export function validateLibroReclamaciones(data: LibroReclamacionesFormData): {
  success: boolean;
  errors: Partial<Record<keyof LibroReclamacionesFormData, string>>;
} {
  const result = libroReclamacionesSchema.safeParse(data);

  if (result.success) {
    return { success: true, errors: {} };
  }

  const errors: Partial<Record<keyof LibroReclamacionesFormData, string>> = {};
  
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof LibroReclamacionesFormData;
    // Solo guardamos el primer error de cada campo
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { success: false, errors };
}
