import { Event, Participant } from '../api/types';

// Utilidades para manejo de errores de la API
export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Función para manejar errores de respuesta HTTP
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Error del servidor con respuesta
    const { status, data } = error.response;
    let message = 'Error del servidor';
    
    if (data?.message) {
      message = data.message;
    } else if (data?.error) {
      message = data.error;
    } else if (status === 404) {
      message = 'Recurso no encontrado';
    } else if (status === 422) {
      message = 'Datos inválidos';
    } else if (status >= 500) {
      message = 'Error interno del servidor';
    }
    
    return new ApiError(message, status, data);
  } else if (error.request) {
    // Error de red
    return new ApiError('Error de conexión. Verifica tu conexión a internet.', 0);
  } else {
    // Otro tipo de error
    return new ApiError(error.message || 'Error desconocido', 0);
  }
};

// Función para formatear fechas de la API
export const formatApiDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

// Función para formatear fechas para inputs de fecha
export const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:MM
  } catch {
    return dateString;
  }
};

// Función para validar si un evento es futuro
export const isEventUpcoming = (event: Event): boolean => {
  const eventDate = new Date(event.date);
  const now = new Date();
  return eventDate > now;
};

// Función para obtener el estado de un evento
export const getEventStatus = (event: Event): 'upcoming' | 'ongoing' | 'past' => {
  const eventDate = new Date(event.date);
  const now = new Date();
  const eventEnd = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // +2 horas para eventos

  if (eventDate > now) {
    return 'upcoming';
  } else if (now < eventEnd) {
    return 'ongoing';
  } else {
    return 'past';
  }
};

// Función para ordenar eventos por fecha
export const sortEventsByDate = (events: Event[], ascending: boolean = true): Event[] => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Función para filtrar eventos por texto de búsqueda
export const filterEventsByText = (events: Event[], searchText: string): Event[] => {
  if (!searchText.trim()) return events;
  
  const lowerSearchText = searchText.toLowerCase();
  return events.filter(event => 
    event.title.toLowerCase().includes(lowerSearchText) ||
    event.description.toLowerCase().includes(lowerSearchText) ||
    event.location.toLowerCase().includes(lowerSearchText)
  );
};

// Función para validar datos de evento antes de enviar
export const validateEventData = (eventData: Partial<Event>): string[] => {
  const errors: string[] = [];
  
  if (!eventData.title?.trim()) {
    errors.push('El título es requerido');
  }
  
  if (!eventData.description?.trim()) {
    errors.push('La descripción es requerida');
  }
  
  if (!eventData.date) {
    errors.push('La fecha es requerida');
  } else {
    const eventDate = new Date(eventData.date);
    if (isNaN(eventDate.getTime())) {
      errors.push('La fecha no es válida');
    }
  }
  
  if (!eventData.location?.trim()) {
    errors.push('La ubicación es requerida');
  }
  
  return errors;
};

// Función para validar datos de participante
export const validateParticipantData = (participantData: Partial<Participant>): string[] => {
  const errors: string[] = [];
  
  if (!participantData.name?.trim()) {
    errors.push('El nombre es requerido');
  }
  
  if (!participantData.email?.trim()) {
    errors.push('El email es requerido');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(participantData.email)) {
      errors.push('El formato del email no es válido');
    }
  }
  
  return errors;
};

