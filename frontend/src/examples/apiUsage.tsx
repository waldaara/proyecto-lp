import React from "react";
import { useApi, useApiList } from "../hooks/useApi";
import { eventService, participantService } from "../services";
import { Event, Participant } from "../api/types";

// Ejemplo de uso del hook useApi para un solo evento
export function EventDetailsExample({ eventId }: { eventId: number }) {
  const { data: event, loading, error, execute } = useApi<Event>();

  React.useEffect(() => {
    execute(() => eventService.getEvent(eventId));
  }, [eventId, execute]);

  if (loading) return <div>Cargando evento...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!event) return <div>No se encontró el evento</div>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>Fecha: {event.date}</p>
      <p>Ubicación: {event.location}</p>
    </div>
  );
}

// Ejemplo de uso del hook useApiList para lista de eventos
export function EventsListExample() {
  const {
    data: events,
    loading,
    error,
    execute,
    addItem,
    updateItem,
    removeItem,
  } = useApiList<Event>();

  React.useEffect(() => {
    execute(() => eventService.getEvents());
  }, [execute]);

  const handleCreateEvent = async () => {
    try {
      const newEvent = await eventService.createEvent({
        event: {
          title: "Nuevo Evento",
          description: "Descripción del evento",
          date: new Date().toISOString(),
          location: "Ubicación del evento",
        },
      });
      addItem(newEvent);
    } catch (error) {
      console.error("Error creando evento:", error);
    }
  };

  const handleUpdateEvent = async (id: number) => {
    try {
      const updatedEvent = await eventService.updateEvent(id, {
        event: { title: "Título Actualizado" },
      });
      updateItem(id, updatedEvent);
    } catch (error) {
      console.error("Error actualizando evento:", error);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await eventService.deleteEvent(id);
      removeItem(id);
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  if (loading) return <div>Cargando eventos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleCreateEvent}>Crear Nuevo Evento</button>

      {events.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <button onClick={() => handleUpdateEvent(event.id)}>
            Actualizar
          </button>
          <button onClick={() => handleDeleteEvent(event.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}

// Ejemplo de uso para participantes
export function ParticipantsExample({ eventId }: { eventId: number }) {
  const {
    data: participants,
    loading,
    error,
    execute,
    addItem,
  } = useApiList<Participant>();

  React.useEffect(() => {
    execute(() => participantService.getEventParticipants(eventId));
  }, [eventId, execute]);

  const handleRegisterParticipant = async (name: string, email: string) => {
    try {
      const newParticipant = await participantService.registerParticipant(
        eventId,
        {
          participant: { name, email },
        }
      );
      addItem(newParticipant);
    } catch (error) {
      console.error("Error registrando participante:", error);
    }
  };

  if (loading) return <div>Cargando participantes...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Participantes ({participants.length})</h3>

      {participants.map((participant) => (
        <div key={participant.id}>
          <p>
            {participant.name} - {participant.email}
          </p>
        </div>
      ))}
    </div>
  );
}

// Ejemplo de uso con filtros
export function FilteredEventsExample() {
  const { data: events, loading, error, execute } = useApiList<Event>();
  const [filters, setFilters] = React.useState({
    upcoming: true,
    from_date: "",
    to_date: "",
  });

  const loadEvents = React.useCallback(() => {
    execute(() => eventService.getEvents(filters));
  }, [execute, filters]);

  React.useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (loading) return <div>Cargando eventos filtrados...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={filters.upcoming}
            onChange={(e) =>
              handleFilterChange({ ...filters, upcoming: e.target.checked })
            }
          />
          Solo eventos futuros
        </label>

        <input
          type="date"
          value={filters.from_date}
          onChange={(e) =>
            handleFilterChange({ ...filters, from_date: e.target.value })
          }
          placeholder="Desde fecha"
        />

        <input
          type="date"
          value={filters.to_date}
          onChange={(e) =>
            handleFilterChange({ ...filters, to_date: e.target.value })
          }
          placeholder="Hasta fecha"
        />
      </div>

      {events.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>Fecha: {event.date}</p>
        </div>
      ))}
    </div>
  );
}

