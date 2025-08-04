class ApiDocsController < ApplicationController
  def index
    swagger_content = File.read(Rails.root.join('swagger', 'v1', 'swagger.yaml'))
    
    render json: {
      message: "Documentación API - Plataforma de Gestión de Eventos Comunitarios Sostenibles",
      version: "v1.0.0",
      description: "API RESTful para la gestión de eventos comunitarios sostenibles",
      endpoints: {
        documentation: {
          swagger_ui: "#{request.base_url}/api-docs",
          raw_spec: "#{request.base_url}/api/docs/raw"
        },
        api_base: "#{request.base_url}/api/v1",
        health_check: "#{request.base_url}/up"
      },
      available_endpoints: [
        {
          method: "GET",
          path: "/api/v1/events",
          description: "Lista todos los eventos con filtros opcionales"
        },
        {
          method: "POST", 
          path: "/api/v1/events",
          description: "Crear un nuevo evento"
        },
        {
          method: "GET",
          path: "/api/v1/events/{id}",
          description: "Obtener detalles de un evento específico"
        },
        {
          method: "PUT",
          path: "/api/v1/events/{id}",
          description: "Actualizar un evento existente"
        },
        {
          method: "DELETE",
          path: "/api/v1/events/{id}",
          description: "Eliminar un evento"
        },
        {
          method: "GET",
          path: "/api/v1/events/{event_id}/participants",
          description: "Lista participantes de un evento"
        },
        {
          method: "POST",
          path: "/api/v1/events/{event_id}/participants",
          description: "Registrar participación en un evento"
        },
        {
          method: "GET",
          path: "/api/v1/participants/{id}",
          description: "Obtener detalles de un participante"
        },
        {
          method: "DELETE",
          path: "/api/v1/participants/{id}",
          description: "Cancelar participación"
        }
      ],
      examples: {
        create_event: {
          method: "POST",
          url: "#{request.base_url}/api/v1/events",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            event: {
              title: "Minga de Limpieza Comunitaria",
              description: "Actividad de limpieza y embellecimiento del barrio",
              date: 2.weeks.from_now.iso8601,
              location: "Plaza Central del Barrio"
            }
          }
        },
        register_participant: {
          method: "POST",
          url: "#{request.base_url}/api/v1/events/1/participants",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            participant: {
              name: "María Rodríguez",
              email: "maria@example.com"
            }
          }
        }
      },
      contact: {
        development_team: "Aragundy Yánez Walter David, Jiménez Jiménez Gabriela De Fátima, Luna Tenecela David Andrés",
        project: "Lenguajes de Programación - Plataforma Web para Gestión de Eventos Comunitarios Sostenibles"
      }
    }
  end

  def raw
    swagger_file = Rails.root.join('swagger', 'v1', 'swagger.yaml')
    
    if File.exist?(swagger_file)
      render plain: File.read(swagger_file), content_type: 'text/yaml'
    else
      render json: { error: "Documentación no encontrada" }, status: :not_found
    end
  end
end