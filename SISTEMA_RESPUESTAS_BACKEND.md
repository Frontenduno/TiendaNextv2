# Sistema de Respuestas del Backend - Guía Completa

## Resumen Ejecutivo

El sistema garantiza que **respuestas del backend se muestren de forma profesional, accesible y consistente** en toda la aplicación.

- ✅ Backend genera respuestas con estructura clara
- ✅ Frontend respeta espacios y saltos de línea
- ✅ Componente React reutilizable y accesible
- ✅ Soporta múltiples tipos de mensajes (éxito, error, advertencia, info)
- ✅ Compatible con temas claro/oscuro

---

## Estructura de Respuestas del Backend

El backend **SIEMPRE** genera respuestas con este formato:

```
[SALUDO]

[SECCIÓN 1 - EN MAYÚSCULAS]
- Punto 1
- Punto 2
- Punto 3

[SECCIÓN 2 - EN MAYÚSCULAS]
- Item A
- Item B

[PÁRRAFO EXPLICATIVO]

[PREGUNTA DE CIERRE / LLAMADA A ACCIÓN]
```

### Ejemplo Real

```
Con gusto te proporciono la información:

POLÍTICAS DE DEVOLUCIÓN
- Plazo: 30 días desde la compra
- Condición: Sin usar, con empaque original
- Proceso: Contacta a soporte con número de orden

REQUISITOS ESPECIALES
- Factura original
- Embalaje en perfecto estado
- Fotos si es requerido

El reembolso se procesa en 5-7 días hábiles.

¿Necesitas ayuda con algo más?
```

---

## Cómo Usar el Componente

### Instalación Rápida

El componente ya está creado en:
```
app/components/BackendMessageDisplay.tsx
app/components/BackendMessageDisplay.module.css
```

### Uso Básico

```jsx
import { BackendMessageDisplay } from '@/app/components/BackendMessageDisplay';

export default function MiComponente() {
  const [respuesta, setRespuesta] = useState('');

  return (
    <div>
      <BackendMessageDisplay 
        message={respuesta}
        type="success"
      />
    </div>
  );
}
```

### Con Hook (Recomendado)

```jsx
import { useBackendMessage, BackendMessageDisplay } from '@/app/components/BackendMessageDisplay';

export default function Chat() {
  const { message, type, isVisible, displayMessage } = useBackendMessage();

  const handleFetch = async () => {
    try {
      const res = await fetch('/api/info');
      const data = await res.json();
      
      // ✅ Mostrar respuesta por 5 segundos
      displayMessage(data.message, 'success', 5000);
    } catch (error) {
      displayMessage('Error al cargar', 'error', 5000);
    }
  };

  return (
    <>
      <button onClick={handleFetch}>Obtener Información</button>
      
      {isVisible && (
        <BackendMessageDisplay message={message} type={type} />
      )}
    </>
  );
}
```

---

## Tipos de Mensaje

### Success (Verde)
```jsx
<BackendMessageDisplay 
  message="Tu pedido fue confirmado exitosamente..."
  type="success"
/>
```
**Uso:** Operaciones completadas, confirmaciones, búsquedas exitosas

### Error (Rojo)
```jsx
<BackendMessageDisplay 
  message="No se pudo procesar el pago..."
  type="error"
/>
```
**Uso:** Fallos, errores, operaciones rechazadas

### Warning (Amarillo)
```jsx
<BackendMessageDisplay 
  message="Este producto tiene poco stock..."
  type="warning"
/>
```
**Uso:** Advertencias, información importante, confirmar antes de actuar

### Info (Azul) - DEFAULT
```jsx
<BackendMessageDisplay 
  message="Aquí está la información que solicitaste..."
  type="info"
/>
```
**Uso:** Información general, respuestas de búsqueda, detalles

---

## Ejemplos de Integración

### 1. En Chat Widget

```jsx
// ChatWidget.tsx
import { BackendMessageDisplay, useBackendMessage } from '@/app/components/BackendMessageDisplay';

export function ChatWidget() {
  const { message, type, isVisible, displayMessage, clearMessage } = useBackendMessage();
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    
    // Determinar tipo según la respuesta
    const messageType = data.success ? 'success' : data.error ? 'error' : 'info';
    displayMessage(data.response, messageType, 8000);
    setInput('');
  };

  return (
    <div className="chat-container">
      <form onSubmit={handleSubmit}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
        />
        <button type="submit">Enviar</button>
      </form>

      {isVisible && (
        <BackendMessageDisplay 
          message={message} 
          type={type}
          onDisplay={() => console.log(`Mensaje ${type} mostrado`)}
        />
      )}
    </div>
  );
}
```

### 2. En Página de Órdenes

```jsx
// app/(shop)/orders/page.tsx
import { BackendMessageDisplay } from '@/app/components/BackendMessageDisplay';

export default async function OrdersPage() {
  const response = await fetch('/api/orders', { 
    next: { revalidate: 60 } 
  });
  
  const data = await response.json();

  if (!data.success) {
    return (
      <BackendMessageDisplay 
        message={data.error || 'No se pudo cargar las órdenes'}
        type="error"
      />
    );
  }

  return (
    <div>
      <BackendMessageDisplay 
        message={data.message}
        type="info"
      />
      {/* Contenido de órdenes */}
    </div>
  );
}
```

### 3. Con Toast Notification

```jsx
import { useBackendMessage, BackendMessageDisplay } from '@/app/components/BackendMessageDisplay';
import { useToast } from '@/hooks/useToast';

export function Checkout() {
  const { displayMessage } = useBackendMessage();
  const { addToast } = useToast();

  const handlePayment = async () => {
    try {
      const res = await fetch('/api/payment', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        // Toast rápido en la esquina + Mensaje detallado
        addToast('Pago procesado', 'success');
        displayMessage(data.details, 'success', 5000);
      }
    } catch (error) {
      displayMessage('Error en el pago', 'error', 5000);
    }
  };

  return <button onClick={handlePayment}>Pagar</button>;
}
```

---

## Reglas Fundamentales

### ✅ QUÉ HACER

1. **Respeta espacios y saltos de línea**
   ```jsx
   // ✓ CORRECTO - Preserva la estructura
   <div style={{ whiteSpace: 'pre-wrap' }}>
     {message}
   </div>
   ```

2. **Usa el componente `BackendMessageDisplay`**
   ```jsx
   <BackendMessageDisplay message={msg} type="success" />
   ```

3. **Determina tipo según respuesta del backend**
   ```jsx
   const type = data.success ? 'success' : 'error';
   ```

4. **Renderiza messages tan pronto como llegan**
   ```jsx
   displayMessage(response.data, 'info', 5000);
   ```

### ❌ NO HACER

1. **No uses `replace(/\n/g, '<br/>')`**
   ❌ Eso rompe el formato
   ```jsx
   // ✗ MALO
   const formatted = message.replace(/\n/g, '<br/>');
   ```

2. **No apliques Markdown**
   ```jsx
   // ✗ MALO - El backend ya formatea
   <ReactMarkdown>{message}</ReactMarkdown>
   ```

3. **No modifiques el contenido del mensaje**
   ```jsx
   // ✗ MALO - Cambia la intención
   const edited = message.toUpperCase();
   ```

4. **No uses `dangerouslySetInnerHTML`**
   ```jsx
   // ✗ MALO - Riesgo de seguridad
   <div dangerouslySetInnerHTML={{ __html: message }} />
   ```

---

## Verificación de Implementación

### Checklist para Componentes

- [ ] El componente renderiza el mensaje tal como viene del backend
- [ ] Los saltos de línea aparecen en la interfaz
- [ ] Las viñetas (-) están correctamente alineadas
- [ ] Los títulos en MAYÚSCULAS se ven destacados
- [ ] **No hay asteriscos o símbolos extras** en el texto
- [ ] El tipo de mensaje (success/error/warning/info) se asigna correctamente
- [ ] El componente es accesible (ARIA labels, roles)
- [ ] Funciona en temas claro y oscuro

### Test en Consola

```javascript
// En DevTools, verifica que el mensaje preserve espacios:
const msg = document.querySelector('.message');
console.log(msg.style.whiteSpace); // Debe ser "pre-wrap"
console.assert(msg.textContent.includes('\n'), 'Saltos de línea presentes');
```

---

## Propiedades del Componente

```typescript
interface BackendMessageDisplayProps {
  /** Mensaje del backend - preserva espacios y caracteres */
  message: string;
  
  /** Tipo: 'success' | 'error' | 'warning' | 'info' */
  type?: 'success' | 'error' | 'warning' | 'info';
  
  /** Muestra borde izquierdo (default: true) */
  showBorder?: boolean;
  
  /** Clase CSS adicional */
  className?: string;
  
  /** Callback cuando se monta el componente */
  onDisplay?: () => void;
}
```

---

## Hook: useBackendMessage

Simplifica manejo de estado de mensajes:

```typescript
const {
  message,        // Texto actual
  type,          // Tipo actual
  isVisible,     // ¿Se muestra?
  displayMessage, // (text, type, duration?) => void
  clearMessage,  // () => void
} = useBackendMessage();
```

### Ejemplo Completo

```jsx
const { isVisible, displayMessage } = useBackendMessage();

const handleSearch = async (query) => {
  try {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    
    // Mostrar por 4 segundos
    displayMessage(data.results, 'info', 4000);
  } catch {
    displayMessage('Error en búsqueda', 'error', 5000);
  }
};
```

---

## Soporte Dark Mode

El componente **automáticamente**:
- ✅ Detecta preferencia del usuario (`prefers-color-scheme`)
- ✅ Ajusta colores para legibilidad
- ✅ Mantiene contraste accesible

No requiere configuración adicional.

---

## Accesibilidad

El componente incluye:
- `role="region"` para lectores de pantalla
- `aria-live="polite"` para anunciar cambios
- `aria-label` descriptivo del tipo
- Soporta `prefers-reduced-motion`
- Contraste WCAG AA

---

## Troubleshooting

### "Los saltos de línea no se ven"
```jsx
// ✓ Indica que necesita white-space: pre-wrap
// El componente ya lo tiene, verifica que estés usando BackendMessageDisplay
<BackendMessageDisplay message={msg} /> {/* ✓ Correcto */}
```

### "El texto se ve diferente en mobile"
```css
/* El CSS ya tiene media queries - verifica en DevTools:
 * Menú > DevTools > Toggle device toolbar
 */
```

### "Dark mode no funciona"
```css
/* Verifica que tu navegador soporte prefers-color-scheme:
 * Windows: Configuración > Personalización > Colores > Modo oscuro
 * macOS: System Preferences > General > Appearance
 */
```

---

## Archivos Relacionados

- 📄 [BackendMessageDisplay.tsx](app/components/BackendMessageDisplay.tsx)
- 🎨 [BackendMessageDisplay.module.css](app/components/BackendMessageDisplay.module.css)
- 📝 PROMPT_FRONTEND.md (instrucciones system para IA)
- 📋 GUIA_FRONTEND_RESPUESTAS.md (guía rápida anterior)

---

## Migrando desde Sistema Anterior

Si tienes componentes usando el sistema anterior:

### Antes
```jsx
<div style={{ whiteSpace: 'pre-wrap' }}>
  {respuesta}
</div>
```

### Después
```jsx
<BackendMessageDisplay message={respuesta} />
```

**Beneficios:**
- ✅ Componente centralizado
- ✅ Estilos consistentes
- ✅ Tipos de mensaje
- ✅ Accesibilidad mejorada
- ✅ Dark mode automático

---

## Preguntas Frecuentes

**P: ¿Debo usar el componente en todo lado?**
R: Sí, para mantener consistencia. Usa el hook `useBackendMessage` para estado reutilizable.

**P: ¿Y si necesito estilos personalizados?**
R: Usa la prop `className` o `showBorder={false}` para ajustes menores.

**P: ¿Debo cambiar el mensaje del backend?**
R: No. El mensaje ya viene perfó formateado. Solo renderiza como es.

**P: ¿Soporta imágenes/links en el mensaje?**
R: No (por diseño). Mantén los mensajes como texto. Los links van fuera del mensaje.

---

## Resumen

| Aspecto | Solución |
|---------|----------|
| Renderizar respuestas | `<BackendMessageDisplay />` |
| Manejar estado | `useBackendMessage()` |
| Diferentes tipos | `type="success\|error\|warning\|info"` |
| Dark mode | Automático ✓ |
| Accesibilidad | Incluida ✓ |
| Mobile | Responsive ✓ |

**Máxima regla: Respeta el mensaje del backend tal como viene. El componente hace el resto.**
