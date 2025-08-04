# Plataforma Web para Gestión de Eventos Comunitarios Sostenibles - Backend API

## Descripción del Proyecto

API RESTful desarrollada en Ruby on Rails para la gestión de eventos comunitarios sostenibles (mingas, sembratones y actividades verdes). Permite crear, gestionar y participar en eventos de manera centralizada.

## Integrantes del Grupo
- Aragundy Yánez Walter David
- Jiménez Jiménez Gabriela De Fátima  
- Luna Tenecela David Andrés

## Tecnologías Utilizadas

- **Backend**: Ruby on Rails 8.0.2 (modo API)
- **Base de datos**: SQLite
- **Documentación**: Swagger/OpenAPI 3.0.1
- **CORS**: Configurado para peticiones desde frontend
- **Testing**: RSpec (configurado)

## Funcionalidades Implementadas

### ✅ Requerimientos Cumplidos

1. **Crear evento** - Permite definir eventos con título, descripción, fecha y ubicación
2. **Listar eventos** - Muestra eventos activos con filtro por fecha  
3. **Registrar participación** - Permite a usuarios inscribirse en eventos
4. **Gestionar participantes** - Muestra lista de inscritos por evento
5. **Editar evento** - Permite modificar detalles de eventos existentes
6. **Ver detalles de evento** - Muestra información completa de un evento específico

### 🔧 Funcionalidades Adicionales

- **Filtros avanzados**: Eventos futuros, por rango de fechas
- **Validaciones**: Email único por evento, campos requeridos
- **Relaciones**: Eventos con participantes (1:N)
- **Documentación completa**: API autodocumentada con Swagger
- **Datos de prueba**: Seeds con eventos y participantes realistas

## Instalación y Configuración

### Prerrequisitos
- Ruby 3.4.5+
- Rails 8.0.2+
- SQLite

### Pasos de instalación

1. **Clonar e instalar dependencias**:
```bash
cd /path/to/backend
bundle install
```

2. **Configurar base de datos**:
```bash
./bin/rails db:migrate
./bin/rails db:seed
```

3. **Iniciar el servidor**:
```bash
./bin/rails server --binding=0.0.0.0 --port=3000
```

## Documentación de la API

### 📋 Endpoints Principales

**Acceso a documentación**:
- **Documentación interactiva**: `http://localhost:3000/api-docs`
- **Documentación JSON**: `http://localhost:3000/`
- **Especificación YAML**: `http://localhost:3000/api/docs/raw`

### 🎯 Eventos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/events` | Lista todos los eventos |
| `POST` | `/api/v1/events` | Crear nuevo evento |
| `GET` | `/api/v1/events/{id}` | Obtener evento específico |
| `PUT` | `/api/v1/events/{id}` | Actualizar evento |
| `DELETE` | `/api/v1/events/{id}` | Eliminar evento |

**Filtros disponibles en GET `/api/v1/events`**:
- `?upcoming=true` - Solo eventos futuros
- `?from_date=YYYY-MM-DD` - Desde fecha específica
- `?to_date=YYYY-MM-DD` - Hasta fecha específica

### 👥 Participantes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/events/{event_id}/participants` | Lista participantes de un evento |
| `POST` | `/api/v1/events/{event_id}/participants` | Registrar participación |
| `GET` | `/api/v1/participants/{id}` | Obtener participante específico |
| `DELETE` | `/api/v1/participants/{id}` | Cancelar participación |

## Ejemplos de Uso

### Crear un evento
```bash
curl -X POST "http://localhost:3000/api/v1/events" \
  -H "Content-Type: application/json" \
  -d '{
    "event": {
      "title": "Minga de Reforestación",
      "description": "Siembra de árboles nativos en la microcuenca",
      "date": "2025-09-15T08:00:00Z",
      "location": "Microcuenca del Río Verde"
    }
  }'
```

### Registrar participante
```bash
curl -X POST "http://localhost:3000/api/v1/events/1/participants" \
  -H "Content-Type: application/json" \
  -d '{
    "participant": {
      "name": "María Rodríguez",
      "email": "maria@example.com"
    }
  }'
```

### Obtener eventos futuros
```bash
curl "http://localhost:3000/api/v1/events?upcoming=true"
```

## Estructura del Proyecto

```
backend/
├── app/
│   ├── controllers/
│   │   ├── api/v1/
│   │   │   ├── events_controller.rb
│   │   │   └── participants_controller.rb
│   │   └── api_docs_controller.rb
│   └── models/
│       ├── event.rb
│       └── participant.rb
├── config/
│   ├── routes.rb
│   └── initializers/cors.rb
├── db/
│   ├── migrate/
│   └── seeds.rb
├── swagger/v1/
│   └── swagger.yaml
└── spec/
    ├── rails_helper.rb
    └── requests/api/v1/
```

## Modelos de Datos

### Event
- `title`: string (requerido, máx 255 caracteres)
- `description`: text (requerido)
- `date`: datetime (requerido)
- `location`: string (requerido, máx 255 caracteres)

### Participant  
- `name`: string (requerido, máx 100 caracteres)
- `email`: string (requerido, formato email)
- `event_id`: integer (foreign key)

**Validaciones**:
- Email único por evento
- Todos los campos requeridos con validaciones
- Relación `Event has_many :participants`

## Estados de Respuesta

| Código | Descripción |
|--------|-------------|
| `200` | Éxito - Datos obtenidos |
| `201` | Creado - Recurso creado exitosamente |
| `204` | Sin contenido - Eliminación exitosa |
| `404` | No encontrado - Recurso inexistente |
| `422` | Error de validación - Datos inválidos |

## Datos de Prueba

El sistema incluye datos de prueba realistas:
- **5 eventos**: 4 futuros, 1 pasado
- **13 participantes** distribuidos en los eventos
- Eventos temáticos: mingas, sembratones, huertos comunitarios

Para cargar los datos de prueba:
```bash
./bin/rails db:seed
```

## Configuración CORS

La API está configurada para aceptar peticiones desde cualquier origen en desarrollo:
```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## Health Check

Para verificar el estado del servidor:
```bash
curl http://localhost:3000/up
```

## Testing

El proyecto incluye configuración completa de RSpec:
```bash
# Ejecutar tests (cuando se implementen)
bundle exec rspec
```

---

## ✅ Estado del Proyecto

**Backend API**: ✅ Completamente funcional  
**Todos los requerimientos**: ✅ Implementados  
**Documentación**: ✅ Completa con Swagger  
**Datos de prueba**: ✅ Cargados  
**CORS**: ✅ Configurado  
**Validaciones**: ✅ Implementadas  

El backend está listo para ser consumido por el frontend TypeScript + React.