# Plataforma Web para Gestión de Eventos Comunitarios Sostenibles - Frontend

## Descripción del Proyecto

Aplicación web desarrollada con React + TypeScript y Vite que consume la API del backend para gestionar eventos comunitarios sostenibles (mingas, sembratones y actividades verdes). Permite navegar, crear, editar y participar en eventos con una interfaz moderna y responsiva.

## Integrantes del Grupo

- Aragundy Yánez Walter David
- Jiménez Jiménez Gabriela De Fátima
- Luna Tenecela David Andrés

## Tecnologías Utilizadas

- Frontend: React 18 + TypeScript + Vite
- UI/Estilos: Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons
- Estado de datos: TanStack React Query
- Routing: React Router v6
- HTTP: Axios
- Validación/Formularios: React Hook Form, Zod
- Utilidades: date-fns, clsx, class-variance-authority

## Funcionalidades Implementadas

### ✅ Requerimientos Cumplidos

1. Listar eventos con filtros por fecha (hoy, semana, mes, próximos)
2. Búsqueda de texto local por título/descripcion
3. Ver detalles de evento
4. Crear evento con validaciones básicas y feedback de UI
5. Editar evento existente
6. Eliminar evento
7. Listar participantes por evento
8. Registrar participación y cancelar participación
9. Estados de carga y manejo de errores amigable (toasts)

### 🔧 Funcionalidades Adicionales

- Hooks para consumo de API (`useApi`, `useApiList`)
- Servicios tipados para eventos y participantes
- Interceptor Axios con manejo centralizado de errores
- Diseño responsive y componentes reutilizables (Card, Button, Dialog, etc.)

## Instalación y Configuración

### Prerrequisitos

- Node.js 18+ (recomendado 20+)
- npm 9+ (o pnpm/yarn si prefieres)

### Variables de Entorno

Crea un archivo `.env` en la carpeta `frontend/`:

```bash
# .env
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Plataforma de Eventos Comunitarios
VITE_APP_DESCRIPTION=Gestión de mingas, sembratones y actividades verdes
```

### Instalación

```bash
cd frontend
npm install
```

### Ejecutar en Desarrollo

```bash
npm run dev
# Abre http://localhost:5173
```

### Build y Preview de Producción

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Rutas Principales (UI)

- `/` Inicio: listado y filtros de eventos
- `/crear-evento` Crear nuevo evento
- `/evento/:id` Detalle de evento
- `/evento/:id/editar` Editar evento
- `/participantes` Panel de participantes
- `*` Página 404

Definidas en `src/App.tsx` con React Router.

## Integración con la API

- Configuración del cliente HTTP: `src/api/config.ts`
- Variables de entorno y configuración: `src/config/environment.ts`
- Servicios de dominio: `src/services/eventService.ts`, `src/services/participantService.ts`
- Tipos de la API: `src/api/types.ts`
- Utilidades: `src/services/apiUtils.ts`

Consulta ejemplos detallados en `README-API-INTEGRATION.md` y la documentación Swagger del backend (`http://localhost:3000/api-docs`).

### Ejemplos Rápidos

```ts
import { eventService, participantService } from "@/services";

// Eventos
const events = await eventService.getEvents({ upcoming: true });
const event = await eventService.getEvent(1);
await eventService.createEvent({
  event: { title, description, date, location },
});

// Participantes
const list = await participantService.getEventParticipants(1);
await participantService.registerParticipant(1, {
  participant: { name, email },
});
```

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/
│   │   ├── config.ts
│   │   └── types.ts
│   ├── components/
│   │   ├── EventCard.tsx
│   │   ├── EventFilters.tsx
│   │   └── ui/ (shadcn/ui)
│   ├── hooks/
│   │   └── useApi.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── CreateEvent.tsx
│   │   ├── EditEvent.tsx
│   │   ├── EventDetails.tsx
│   │   └── Participants.tsx
│   ├── services/
│   │   ├── eventService.ts
│   │   ├── participantService.ts
│   │   └── apiUtils.ts
│   └── config/
│       └── environment.ts
├── README-API-INTEGRATION.md
└── vite.config.ts
```

## Personalización y Temas

- Tailwind configurado en `tailwind.config.ts` y `src/index.css`
- Componentes base en `src/components/ui/*` (shadcn/ui)

## Recursos

- Documentación del Backend: `../backend/README.md`
- Swagger API Docs: `http://localhost:3000/api-docs`

---
