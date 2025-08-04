# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Api::V1::Events', type: :request do
  path '/api/v1/events' do
    get 'Lista todos los eventos' do
      tags 'Eventos'
      summary 'Obtener lista de eventos'
      description 'Retorna una lista de todos los eventos disponibles, con filtros opcionales por fecha'
      produces 'application/json'
      
      parameter name: :from_date, in: :query, type: :string, format: :date, 
                description: 'Filtrar eventos desde esta fecha (YYYY-MM-DD)', required: false
      parameter name: :to_date, in: :query, type: :string, format: :date, 
                description: 'Filtrar eventos hasta esta fecha (YYYY-MM-DD)', required: false
      parameter name: :upcoming, in: :query, type: :boolean, 
                description: 'Si es true, solo muestra eventos futuros', required: false

      response '200', 'Lista de eventos' do
        schema type: :array, items: { '$ref' => '#/components/schemas/Event' }
        
        example 'application/json', :eventos_ejemplo, [
          {
            id: 1,
            title: 'Minga de Limpieza del Parque Central',
            description: 'Actividad comunitaria para la limpieza y mantenimiento del parque central.',
            date: '2024-02-15T09:00:00Z',
            location: 'Parque Central, Calle Principal #123',
            participants_count: 15,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            title: 'Sembratón de Árboles Nativos',
            description: 'Jornada de siembra de especies nativas en la zona rural.',
            date: '2024-02-20T08:00:00Z',
            location: 'Sector La Esperanza, km 15 vía rural',
            participants_count: 8,
            created_at: '2024-01-20T14:30:00Z',
            updated_at: '2024-01-20T14:30:00Z'
          }
        ]
        
        run_test!
      end
    end

    post 'Crear un nuevo evento' do
      tags 'Eventos'
      summary 'Crear evento'
      description 'Crea un nuevo evento comunitario'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :event, in: :body, schema: {
        type: :object,
        properties: {
          event: {
            type: :object,
            properties: {
              title: { type: :string, example: 'Minga de Reforestación' },
              description: { type: :string, example: 'Actividad de reforestación en la microcuenca del río.' },
              date: { type: :string, format: 'date-time', example: '2024-03-10T08:00:00Z' },
              location: { type: :string, example: 'Microcuenca del Río Verde, sector norte' }
            },
            required: [:title, :description, :date, :location]
          }
        }
      }

      response '201', 'Evento creado exitosamente' do
        schema '$ref' => '#/components/schemas/Event'
        run_test!
      end

      response '422', 'Errores de validación' do
        schema '$ref' => '#/components/schemas/Error'
        run_test!
      end
    end
  end

  path '/api/v1/events/{id}' do
    parameter name: :id, in: :path, type: :integer, description: 'ID del evento'

    get 'Obtener detalles de un evento' do
      tags 'Eventos'
      summary 'Mostrar evento específico'
      description 'Retorna los detalles completos de un evento, incluyendo la lista de participantes'
      produces 'application/json'

      response '200', 'Detalles del evento' do
        schema '$ref' => '#/components/schemas/EventWithParticipants'
        
        example 'application/json', :evento_con_participantes, {
          id: 1,
          title: 'Minga de Limpieza del Parque Central',
          description: 'Actividad comunitaria para la limpieza y mantenimiento del parque central.',
          date: '2024-02-15T09:00:00Z',
          location: 'Parque Central, Calle Principal #123',
          participants_count: 2,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          participants: [
            {
              id: 1,
              name: 'María González',
              email: 'maria@email.com',
              created_at: '2024-01-16T10:00:00Z'
            },
            {
              id: 2,
              name: 'Carlos Pérez',
              email: 'carlos@email.com',
              created_at: '2024-01-17T15:30:00Z'
            }
          ]
        }
        
        run_test!
      end

      response '404', 'Evento no encontrado' do
        schema '$ref' => '#/components/schemas/Error'
        run_test!
      end
    end

    put 'Actualizar un evento' do
      tags 'Eventos'
      summary 'Actualizar evento'
      description 'Actualiza los datos de un evento existente'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :event, in: :body, schema: {
        type: :object,
        properties: {
          event: {
            type: :object,
            properties: {
              title: { type: :string },
              description: { type: :string },
              date: { type: :string, format: 'date-time' },
              location: { type: :string }
            }
          }
        }
      }

      response '200', 'Evento actualizado exitosamente' do
        schema '$ref' => '#/components/schemas/Event'
        run_test!
      end

      response '404', 'Evento no encontrado' do
        schema '$ref' => '#/components/schemas/Error'
        run_test!
      end

      response '422', 'Errores de validación' do
        schema '$ref' => '#/components/schemas/Error'
        run_test!
      end
    end

    delete 'Eliminar un evento' do
      tags 'Eventos'
      summary 'Eliminar evento'
      description 'Elimina un evento y todas sus inscripciones asociadas'
      produces 'application/json'

      response '204', 'Evento eliminado exitosamente' do
        run_test!
      end

      response '404', 'Evento no encontrado' do
        schema '$ref' => '#/components/schemas/Error'
        run_test!
      end
    end
  end
end