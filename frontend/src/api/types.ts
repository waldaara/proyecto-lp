// Tipos para la API del backend

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // ISO 8601 string
  location: string;
  created_at: string;
  updated_at: string;
  participants_count?: number; // Campo adicional para contar participantes
}

export interface CreateEventRequest {
  event: {
    title: string;
    description: string;
    date: string;
    location: string;
  };
}

export interface UpdateEventRequest {
  event: {
    title?: string;
    description?: string;
    date?: string;
    location?: string;
  };
}

export interface Participant {
  id: number;
  name: string;
  email: string;
  event_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateParticipantRequest {
  participant: {
    name: string;
    email: string;
  };
}

// Filtros para eventos
export interface EventFilters {
  upcoming?: boolean;
  from_date?: string;
  to_date?: string;
}

// Respuestas de la API
export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}

