import apiClient from '../api/config';
import { Participant, CreateParticipantRequest } from '../api/types';

class ParticipantService {
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

