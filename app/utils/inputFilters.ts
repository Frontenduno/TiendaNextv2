// utils/inputFilters.ts

/**
 * Filtra la entrada de teclado para permitir solo números o letras
 * @param e - Evento de teclado
 * @param type - Tipo de caracteres permitidos
 * @param max - Longitud máxima opcional
 */
export const filterInput = (
  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  type: "numbers" | "letters",
  max?: number
) => {
  const regex = type === "numbers" ? /[0-9]/ : /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
  const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
  
  if (
    (max && e.currentTarget.value.length >= max && !allowed.includes(e.key)) ||
    (!regex.test(e.key) && !allowed.includes(e.key))
  ) {
    e.preventDefault();
  }
};

/**
 * Filtra el pegado de texto para permitir solo números o letras
 * @param e - Evento de portapapeles
 * @param type - Tipo de caracteres permitidos
 * @param max - Longitud máxima opcional
 */
export const filterPaste = (
  e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  type: "numbers" | "letters",
  max?: number
) => {
  const text = e.clipboardData.getData("text");
  const regex = type === "numbers" ? /^[0-9]+$/ : /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  
  if (!regex.test(text) || (max && text.length > max)) {
    e.preventDefault();
  }
};