# frozen_string_literal: true

require 'rails_helper'

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.openapi_root = Rails.root.join('swagger').to_s

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:swaggerize' rake task, the complete Swagger will
  # be generated at the provided relative path under openapi_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a openapi_spec tag to the
  # the root example_group in your specs, e.g. describe '...', openapi_spec: 'v2/swagger.json'
  config.openapi_specs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'Plataforma de Gestión de Eventos Comunitarios Sostenibles - API',
        version: 'v1',
        description: 'API RESTful para la gestión de eventos comunitarios sostenibles (mingas, sembratones y actividades verdes). Permite crear, gestionar y participar en eventos.',
        contact: {
          name: 'Equipo de Desarrollo',
          email: 'soporte@eventos-comunitarios.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      paths: {},
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor de desarrollo local'
        },
        {
          url: 'https://api.eventos-comunitarios.com',
          description: 'Servidor de producción'
        }
      ],
      components: {
        schemas: {
          Event: {
            type: :object,
            properties: {
              id: { type: :integer, example: 1 },
              title: { type: :string, example: 'Minga de Limpieza del Parque Central' },
              description: { type: :string, example: 'Actividad comunitaria para la limpieza y mantenimiento del parque central de la ciudad.' },
              date: { type: :string, format: 'date-time', example: '2024-02-15T09:00:00Z' },
              location: { type: :string, example: 'Parque Central, Calle Principal #123' },
              participants_count: { type: :integer, example: 25 },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            },
            required: [:title, :description, :date, :location]
          },
          EventWithParticipants: {
            allOf: [
              { '$ref' => '#/components/schemas/Event' },
              {
                type: :object,
                properties: {
                  participants: {
                    type: :array,
                    items: { '$ref' => '#/components/schemas/Participant' }
                  }
                }
              }
            ]
          },
          Participant: {
            type: :object,
            properties: {
              id: { type: :integer, example: 1 },
              name: { type: :string, example: 'María González' },
              email: { type: :string, format: :email, example: 'maria.gonzalez@email.com' },
              event_id: { type: :integer, example: 1 },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            },
            required: [:name, :email]
          },
          ParticipantWithEvent: {
            allOf: [
              { '$ref' => '#/components/schemas/Participant' },
              {
                type: :object,
                properties: {
                  event: {
                    type: :object,
                    properties: {
                      id: { type: :integer },
                      title: { type: :string },
                      date: { type: :string, format: 'date-time' },
                      location: { type: :string }
                    }
                  }
                }
              }
            ]
          },
          Error: {
            type: :object,
            properties: {
              errors: {
                type: :array,
                items: { type: :string }
              }
            }
          }
        }
      }
    }
  }

  # Specify the format of the output Swagger file when running 'rswag:specs:swaggerize'.
  # The openapi_specs configuration option has the filename including format in
  # the key, this may want to be changed to avoid putting yaml in json files.
  # Defaults to json. Accepts ':json' and ':yaml'.
  config.openapi_format = :yaml
end
