# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Api::V1::Participants', type: :request do
  path '/api/v1/events/{event_id}/participants' do
    parameter name: :event_id, in: :path, type: :integer, description: 'ID del evento'

    get 'Lista participantes de un evento' do
      tags 'Participantes'
      summary 'Obtener participantes de un evento'
      description 'Retorna la lista de todos los participantes inscritos en un evento específico'
      produces 'application/json'

      response '200', 'Lista de participantes' do
        schema type: :array, items: { '$ref' => '#/components/schemas/Participant' }
        
        example 'application/json', :participantes_evento, [
          {
            id: 1,
            name: 'María González',
            email: 'maria.gonzalez@email.com',
            event_id: 1,
            created_at: '2024-01-16T10:00:00Z',
            updated_at: '2024-01-16T10:00:00Z'
          },
          {
            id: 2,
            name: 'Carlos Pérez',
            email: 'carlos.perez@email.com',
            event_id: 1,
            created_at: '2024-01-17T15:30:00Z',
            updated_at: '2024-01-17T15:30:00Z'
          }
        ]
        
        run_test!
      end

      response '404', 'Evento no encontrado' do
        schema '$ref' => '#/components/schemas/Error'
        run_test!
      end
    end

    post 'Registrar participación en evento' do
      tags 'Participantes'
      summary 'Inscribirse a un evento'
      description 'Registra a una persona como participante en un evento específico'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :participant, in: :body, schema: {
        type: :object,
        properties: {
          participant: {
            type: :object,
            properties: {
              name: { 
                type: :string, 
                example: 'Ana Rodríguez',
                description: 'Nombre completo del participante'
              },
              email: { 
                type: :string, 
                format: :email, 
                example: 'ana.rodriguez@email.com',
                description: 'Correo electrónico del participante'
              }
            },
            required: [:name, :email]
          }
        }
      }

      response '201', 'Participación registrada exitosamente' do
        schema '$ref' => '#/components/schemas/Participant'
        
        example 'application/json', :participante_creado, {
          id: 3,
          name: 'Ana Rodríguez',
          email: 'ana.rodriguez@email.com',
          event_id: 1,
          created_at: '2024-01-18T09:15:00Z',
          updated_at: '2024-01-18T09:15:00Z'
        }
        
        run_test!
      end

      response '404', 'Evento no encontrado' do
        schema '$ref' => '#/components/schemas/Error'
        run_test!
      end

      response '422', 'Errores de validación' do
        schema '$ref' => '#/components/schemas/Error'
        
        example 'application/json', :errores_validacion, {
          errors: [
            'Email ya está registrado para este evento',
            'Name no puede estar en blanco'
          ]
        }
        
        run_test!
      end
    end
  end

  path '/api/v1/participants/{id}' do
    parameter name: :id, in: :path, type: :integer, description: 'ID del participante'

    get 'Obtener detalles de un participante' do
      tags 'Participantes'
      summary 'Mostrar participante específico'
      description 'Retorna los detalles de un participante específico, incluyendo información del evento'
      produces 'application/json'

      response '200', 'Detalles del participante' do
        schema '$ref' => '#/components/schemas/ParticipantWithEvent'
        
        example 'application/json', :participante_con_evento, {
          id: 1,
          name: 'María González',
          email: 'maria.gonzalez@email.com',
          event_id: 1,
          created_at: '2024-01-16T10:00:00Z',
          updated_at: '2024-01-16T10:00:00Z',
          event: {
            id: 1,
            title: 'Minga de Limpieza del Parque Central',
            date: '2024-02-15T09:00:00Z',
            location: 'Parque Central, Calle Principal #123'
          }
        }
        
        run_test!
      end

      response '404', 'Participante no encontrado' do
        schema '$ref' => '#/components/schemas/Error'
        run_test!
      end
    end

    delete 'Cancelar participación' do
      tags 'Participantes'
      summary 'Cancelar inscripción'
      description 'Cancela la inscripción de un participante, eliminándolo del evento'
      produces 'application/json'

      response '204', 'Participación cancelada exitosamente' do
        description 'La inscripción fue cancelada y el participante fue eliminado del evento'
        run_test!
      end

      response '404', 'Participante no encontrado' do
        schema '$ref' => '#/components/schemas/Error'
        run_test!
      end
    end
  end
end