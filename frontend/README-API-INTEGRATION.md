# Integración de la API - Frontend

Este documento explica cómo usar la integración de la API del backend en el frontend React.

## 📁 Estructura de Archivos

```
frontend/src/
├── api/
│   ├── config.ts          # Configuración de axios y cliente HTTP
│   └── types.ts           # Tipos TypeScript para la API
├── services/
│   ├── eventService.ts    # Servicio para operaciones de eventos
│   ├── participantService.ts # Servicio para operaciones de participantes
│   ├── apiUtils.ts        # Utilidades y manejo de errores
│   └── index.ts           # Exportaciones centralizadas
├── hooks/
│   └── useApi.ts          # Hooks personalizados para manejo de estado
├── config/
│   └── environment.ts     # Configuración de variables de entorno
└── examples/
    └── apiUsage.tsx       # Ejemplos de uso de la API
```

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del frontend:

```bash
# .env
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Plataforma de Eventos Comunitarios
VITE_APP_DESCRIPTION=Gestión de mingas, sembratones y actividades verdes
```

### 2. Dependencias

Asegúrate de tener axios instalado:

```bash
npm install axios
```

## 🔧 Uso de los Servicios

### Servicio de Eventos

```typescript
import { eventService } from "../services";

// Obtener todos los eventos
const events = await eventService.getEvents();

// Obtener eventos futuros
const upcomingEvents = await eventService.getUpcomingEvents();

// Obtener evento específico
const event = await eventService.getEvent(1);

// Crear evento
const newEvent = await eventService.createEvent({
  event: {
    title: "Minga de Reforestación",
    description: "Siembra de árboles nativos",
    date: "2025-09-15T08:00:00Z",
    location: "Microcuenca del Río Verde",
  },
});

// Actualizar evento
const updatedEvent = await eventService.updateEvent(1, {
  event: { title: "Nuevo Título" },
});

// Eliminar evento
await eventService.deleteEvent(1);
```

### Servicio de Participantes

```typescript
import { participantService } from "../services";

// Obtener participantes de un evento
const participants = await participantService.getEventParticipants(1);

// Registrar participante
const newParticipant = await participantService.registerParticipant(1, {
  participant: {
    name: "María Rodríguez",
    email: "maria@example.com",
  },
});

// Cancelar participación
await participantService.cancelParticipation(1);

// Verificar si email está registrado
const isRegistered = await participantService.isEmailRegistered(
  1,
  "maria@example.com"
);
```

## 🎣 Hooks Personalizados

### useApi Hook

Para manejar un solo recurso:

```typescript
import { useApi } from "../hooks/useApi";
import { Event } from "../api/types";

function EventDetails({ eventId }: { eventId: number }) {
  const { data: event, loading, error, execute } = useApi<Event>();

  useEffect(() => {
    execute(() => eventService.getEvent(eventId));
  }, [eventId, execute]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!event) return <div>No encontrado</div>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
    </div>
  );
}
```

### useApiList Hook

Para manejar listas de recursos:

```typescript
import { useApiList } from '../hooks/useApi';

function EventsList() {
  const {
    data: events,
    loading,
    error,
    execute,
    addItem,
    updateItem,
    removeItem
  } = useApiList<Event>();

  useEffect(() => {
    execute(() => eventService.getEvents());
  }, [execute]);

  const handleCreate = async () => {
    try {
      const newEvent = await eventService.createEvent({...});
      addItem(newEvent); // Actualiza la lista automáticamente
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ... resto del componente
}
```

## 🛠️ Utilidades de la API

### Manejo de Errores

```typescript
import { handleApiError, ApiError } from "../services/apiUtils";

try {
  await eventService.createEvent(data);
} catch (error) {
  const apiError = handleApiError(error);
  console.error("Error:", apiError.message);
  console.error("Status:", apiError.status);
}
```

### Formateo de Fechas

```typescript
import { formatApiDate, formatDateForInput } from "../services/apiUtils";

// Formatear fecha para mostrar
const displayDate = formatApiDate(event.date); // "15 de septiembre de 2025, 08:00"

// Formatear fecha para input
const inputDate = formatDateForInput(event.date); // "2025-09-15T08:00"
```

### Validaciones

```typescript
import {
  validateEventData,
  validateParticipantData,
} from "../services/apiUtils";

const eventErrors = validateEventData(eventData);
if (eventErrors.length > 0) {
  console.error("Errores de validación:", eventErrors);
  return;
}

const participantErrors = validateParticipantData(participantData);
if (participantErrors.length > 0) {
  console.error("Errores de validación:", participantErrors);
  return;
}
```

## 🔍 Filtros y Búsquedas

### Filtros de Eventos

```typescript
// Eventos futuros
const upcomingEvents = await eventService.getEvents({ upcoming: true });

// Por rango de fechas
const rangeEvents = await eventService.getEvents({
  from_date: "2025-09-01",
  to_date: "2025-09-30",
});

// Combinar filtros
const filteredEvents = await eventService.getEvents({
  upcoming: true,
  from_date: "2025-09-01",
});
```

### Búsqueda de Texto

```typescript
import { filterEventsByText } from "../services/apiUtils";

const searchResults = filterEventsByText(events, "reforestación");
```

## 📱 Ejemplos de Uso en Componentes

### Lista de Eventos con Filtros

```typescript
function EventsPage() {
  const { data: events, loading, error, execute } = useApiList<Event>();
  const [filters, setFilters] = useState({ upcoming: true });

  useEffect(() => {
    execute(() => eventService.getEvents(filters));
  }, [execute, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <EventFilters filters={filters} onChange={handleFilterChange} />
      <EventsList events={events} loading={loading} error={error} />
    </div>
  );
}
```

### Formulario de Creación de Evento

```typescript
function CreateEventForm() {
  const { execute, loading, error } = useApi<Event>();
  const [formData, setFormData] = useState({...});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateEventData(formData);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    try {
      await execute(() => eventService.createEvent({ event: formData }));
      // Redirigir o mostrar mensaje de éxito
    } catch (error) {
      // El error ya está manejado por el hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Evento'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

## 🚨 Manejo de Errores

### Tipos de Errores

- **Errores de validación (422)**: Datos enviados incorrectos
- **No encontrado (404)**: Recurso inexistente
- **Error del servidor (5xx)**: Problemas internos del backend
- **Errores de red**: Problemas de conexión

### Estrategias de Recuperación

```typescript
// Reintentar automáticamente
const { execute, error } = useApi<Event>();

useEffect(() => {
  if (error && error.status >= 500) {
    // Reintentar después de 5 segundos
    const timer = setTimeout(() => {
      execute(() => eventService.getEvent(eventId));
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [error, execute, eventId]);
```

## 🔄 Optimizaciones

### Cache de Datos

```typescript
// Usar React Query para cache automático
import { useQuery } from "@tanstack/react-query";

function EventDetails({ eventId }) {
  const {
    data: event,
    loading,
    error,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventService.getEvent(eventId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // ... resto del componente
}
```

### Actualización Optimista

```typescript
const { updateItem } = useApiList<Event>();

const handleUpdate = async (id, updates) => {
  // Actualizar UI inmediatamente
  updateItem(id, updates);

  try {
    await eventService.updateEvent(id, { event: updates });
  } catch (error) {
    // Revertir cambios si falla
    updateItem(id, originalData);
  }
};
```

## 📚 Recursos Adicionales

- [Documentación del Backend](../backend/README.md)
- [Swagger API Docs](http://localhost:3000/api-docs)
- [Tipos TypeScript](../src/api/types.ts)
- [Ejemplos de Uso](../src/examples/apiUsage.tsx)

---

¡La integración está lista para usar! Los servicios proporcionan una interfaz limpia y tipada para interactuar con el backend, mientras que los hooks manejan el estado y los errores de manera elegante.

