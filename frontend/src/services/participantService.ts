import apiClient from '../api/config';
import { Participant, CreateParticipantRequest, Event } from '../api/types';
import eventService from './eventService';

class ParticipantService {
  // Obtener participantes únicos agrupados por nombre y email
  async getUniqueParticipants(): Promise<Array<{
    name: string;
    email: string;
    events: Event[];
    totalEvents: number;
    firstRegistration: string;
    lastEvent: string;
  }>> {
    try {
      const allParticipants = await this.getAllParticipants();
      const participantMap = new Map<string, {
        name: string;
        email: string;
        events: Event[];
        firstRegistration: string;
        lastEvent: string;
      }>();

      // Agrupar por email (clave única)
      allParticipants.forEach(participant => {
        const key = participant.email.toLowerCase();
        
        if (participantMap.has(key)) {
          const existing = participantMap.get(key)!;
          existing.events.push(participant.event);
          
          // Actualizar fecha de primera registración si es más antigua
          if (new Date(participant.created_at) < new Date(existing.firstRegistration)) {
            existing.firstRegistration = participant.created_at;
          }
          
          // Actualizar último evento si es más reciente
          if (new Date(participant.event.date) > new Date(existing.lastEvent)) {
            existing.lastEvent = participant.event.date;
          }
        } else {
          participantMap.set(key, {
            name: participant.name,
            email: participant.email,
            events: [participant.event],
            firstRegistration: participant.created_at,
            lastEvent: participant.event.date
          });
        }
      });

      // Convertir el Map a array y agregar totalEvents
      return Array.from(participantMap.values()).map(participant => ({
        ...participant,
        totalEvents: participant.events.length
      }));
    } catch (error) {
      console.error('Error getting unique participants:', error);
      throw error;
    }
  }

  // Obtener todos los participantes de todos los eventos
  async getAllParticipants(): Promise<Array<Participant & { event: Event }>> {
    try {
      // Primero obtenemos todos los eventos
      const events = await eventService.getEvents();
      const allParticipants: Array<Participant & { event: Event }> = [];

      // Para cada evento, obtenemos sus participantes
      for (const event of events) {
        const participants = await this.getEventParticipants(event.id);
        // Agregamos la información del evento a cada participante
        const participantsWithEvent = participants.map(participant => ({
          ...participant,
          event
        }));
        allParticipants.push(...participantsWithEvent);
      }

      return allParticipants;
    } catch (error) {
      console.error('Error fetching all participants:', error);
      throw error;
    }
  }

  // Obtener todos los participantes de un evento específico
  async getEventParticipants(eventId: number): Promise<Participant[]> {
    try {
      const response = await apiClient.get(`/api/v1/events/${eventId}/participants`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching participants for event ${eventId}:`, error);
      throw error;
    }
  }

  // Registrar un nuevo participante en un evento
  async registerParticipant(eventId: number, participantData: CreateParticipantRequest): Promise<Participant> {
    try {
      const response = await apiClient.post(`/api/v1/events/${eventId}/participants`, participantData);
      return response.data;
    } catch (error) {
      console.error(`Error registering participant for event ${eventId}:`, error);
      throw error;
    }
  }

  // Obtener un participante específico por ID
  async getParticipant(id: number): Promise<Participant> {
    try {
      const response = await apiClient.get(`/api/v1/participants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching participant ${id}:`, error);
      throw error;
    }
  }

  // Cancelar participación de un usuario
  async cancelParticipation(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/participants/${id}`);
    } catch (error) {
      console.error(`Error canceling participation ${id}:`, error);
      throw error;
    }
  }

  // Verificar si un email ya está registrado en un evento
  async isEmailRegistered(eventId: number, email: string): Promise<boolean> {
    try {
      const participants = await this.getEventParticipants(eventId);
      return participants.some(participant => participant.email === email);
    } catch (error) {
      console.error(`Error checking email registration for event ${eventId}:`, error);
      throw error;
    }
  }

  // Obtener estadísticas de participantes por evento
  async getEventParticipantStats(eventId: number): Promise<{ total: number; participants: Participant[] }> {
    try {
      const participants = await this.getEventParticipants(eventId);
      return {
        total: participants.length,
        participants
      };
    } catch (error) {
      console.error(`Error getting participant stats for event ${eventId}:`, error);
      throw error;
    }
  }
}

export default new ParticipantService();

