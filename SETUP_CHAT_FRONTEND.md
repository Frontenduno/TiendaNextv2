# Integración Chat Frontend + Backend

## 📁 Estructura de Carpetas

```
app/
├── components/
│   └── BackendMessageDisplay.tsx      ✓ Componente de visualización
├── hooks/
│   └── useChat.ts                      ✓ Hook para lógica de chat
├── services/
│   └── chatService.ts                  ✓ Servicio API tipado
├── types/
│   └── api/
│       └── chat.ts                     ✓ Tipos seguros (SIN any)
└── features/
    └── chat-widget/
        ├── ChatWidget.tsx              ✓ Componente principal
        ├── ChatWidget.module.css       ✓ Estilos
        ├── index.ts                    ✓ Exportaciones
        └── README.md
```

## ⚙️ Setup Paso a Paso

### 1. Verificar Estructura
```bash
tree app/ -I 'node_modules'
```

Debe verse así:
```
app/
├── components/BackendMessageDisplay.*
├── hooks/useChat.ts
├── services/chatService.ts
├── types/api/chat.ts
├── features/chat-widget/ChatWidget.*
└── ...
```

### 2. Variables de Entorno
```bash
cp .env.example .env.local
```

Verificar `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

O ajustar según tu backend:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Verificar Tipos
```bash
npm run lint
```

Esperado: ✓ Sin errores `no-explicit-any`

### 4. Build
```bash
npm run build
```

Esperado: ✓ Compila sin errores

### 5. Desarrollo
```bash
npm run dev
```

Abre: http://localhost:3000

## 💬 Usar el ChatWidget

### En una Página
```tsx
import { ChatWidget } from '@/app/features/chat-widget';

export default function HomePage() {
  return (
    <main>
      <ChatWidget />
    </main>
  );
}
```

### En un Layout
```tsx
import { ChatWidget } from '@/app/features/chat-widget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
```

## 🔗 APIs Esperadas del Backend

### Endpoint: POST /api/chat

**Request:**
```json
{
  "message": "¿Cuál es tu política de devoluciones?",
  "conversationId": "conv-1710868000000",
  "userId": "user-456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Con gusto te proporciono...",
  "status": "success",
  "data": {
    "topic": "Returns Policy"
  }
}
```

El backend debe enviar respuestas exactamente con esta estructura.
Ver [BACKEND_API.md](../../features/chat-widget/BACKEND_API.md) para especificación completa.

## 🧪 Testing

### 1. Test Local
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Hola?"}'
```

### 2. Test en la App
1. Abre http://localhost:3000
2. Click en el botón del chat (esquina inferior derecha)
3. Escribe un mensaje
4. Verifica que la respuesta se muestre correctamente

## ✅ Tipos Correctos

Todo está **100% typesafe** (sin `any`):

```tsx
import { ChatResponse, ChatRequest } from '@/app/types/api/chat';

const request: ChatRequest = {
  message: 'Tu pregunta',
  conversationId: 'conv-123',
};

const response: ChatResponse = {...};
```

## 📚 Archivos Relacionados

- 📄 [Chat Types](./app/types/api/chat.ts)
- 🪝 [useChat Hook](./app/hooks/useChat.ts)
- 🔌 [ChatService](./app/services/chatService.ts)
- 🎨 [BackendMessageDisplay](./app/components/BackendMessageDisplay.tsx)
- 💬 [ChatWidget](./app/features/chat-widget/ChatWidget.tsx)

## 🚀 Comandos Útiles

```bash
# Development
npm run dev

# Build
npm run build

# Lint (verificar tipos)
npm run lint

# Type check
npx tsc --noEmit

# Lint específico para 'any'
npm run lint -- --rule "no-explicit-any"
```

## ❌ Si Algo No Funciona

### "Cannot find module"
```bash
npm install
npm run build
```

### "API returns 404"
Verificar que el backend está corriendo en `NEXT_PUBLIC_API_URL`

### "TypeScript error"
```bash
rm -rf .next
npm run build
```

### "El chat no muestra mensajes"
1. Abrir DevTools (F12)
2. Verificar Network → XHR → /api/chat
3. Ver respuesta en Response tab
4. Debe tener `success`, `message`, `status`

## 📝 Notas

- ✅ Código limpio sin comentarios innecesarios
- ✅ Tipos TypeScript estrictos (no hay `any`)
- ✅ Errores bien manejados
- ✅ Integración limpia con BackendMessageDisplay
- ✅ Hook useChat reutilizable
