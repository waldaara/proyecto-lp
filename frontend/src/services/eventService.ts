import apiClient from '../api/config';
import { Event, CreateEventRequest, UpdateEventRequest, EventFilters } from '../api/types';

class EventService {
  // Obtener todos los eventos con filtros opcionales
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.upcoming) {
        params.append('upcoming', 'true');
      }
      if (filters?.from_date) {
        params.append('from_date', filters.from_date);
      }
      if (filters?.to_date) {
        params.append('to_date', filters.to_date);
      }

      const response = await apiClient.get(`/api/v1/events?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Obtener un evento específico por ID
  async getEvent(id: number): Promise<Event> {
    try {
      const response = await apiClient.get(`/api/v1/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  }

  // Crear un nuevo evento
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    try {
      const response = await apiClient.post('/api/v1/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Actualizar un evento existente
  async updateEvent(id: number, eventData: UpdateEventRequest): Promise<Event> {
    try {
      const response = await apiClient.put(`/api/v1/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un evento
  async deleteEvent(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/events/${id}`);
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  }

  // Obtener eventos futuros (método de conveniencia)
  async getUpcomingEvents(): Promise<Event[]> {
    return this.getEvents({ upcoming: true });
  }

  // Obtener eventos por rango de fechas
  async getEventsByDateRange(fromDate: string, toDate: string): Promise<Event[]> {
    return this.getEvents({ from_date: fromDate, to_date: toDate });
  }
}

export default new EventService();

