import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Leaf, Calendar, Users, Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import { useApiList } from "@/hooks/useApi";
import { eventService } from "@/services";
import { Event, EventFilters as ApiEventFilters } from "@/api/types";
import { filterEventsByText } from "@/services/apiUtils";

interface FilterOptions {
  search: string;
  date: string;
}

const Index = () => {
  const navigate = useNavigate();

  // Hook de la API para eventos
  const { data: events = [], loading, error, execute } = useApiList<Event>();

  // Estado local para filtros
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    date: "todos",
  });

  // Eventos filtrados localmente (solo búsqueda de texto)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Cargar eventos al montar el componente
  useEffect(() => {
    execute(() => eventService.getEvents());
  }, [execute]);

  // Aplicar filtros locales (solo búsqueda de texto)
  useEffect(() => {
    let filtered = events;

    // Solo filtro de búsqueda de texto (local)
    if (filters.search) {
      filtered = filterEventsByText(events, filters.search);
    }

    setFilteredEvents(filtered);
  }, [events, filters.search]);

  // Aplicar filtros del backend (más eficiente)
  const handleFilterChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters);

    // Preparar filtros para la API
    const apiFilters: ApiEventFilters = {};

    if (newFilters.date === "upcoming") {
      apiFilters.upcoming = true;
    } else if (newFilters.date === "today") {
      // Filtrar eventos de hoy usando el backend
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

      apiFilters.from_date = startOfDay.toISOString();
      apiFilters.to_date = endOfDay.toISOString();
    } else if (newFilters.date === "week") {
      // Filtrar eventos de esta semana usando el backend
      const today = new Date();
      const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
      const endOfWeek = new Date(
        startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1
      );

      apiFilters.from_date = startOfWeek.toISOString();
      apiFilters.to_date = endOfWeek.toISOString();
    } else if (newFilters.date === "month") {
      // Filtrar eventos de este mes usando el backend
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      apiFilters.from_date = startOfMonth.toISOString();
      apiFilters.to_date = endOfMonth.toISOString();
    }

    try {
      // Usar el filtro del backend en lugar de filtrar localmente
      await execute(() => eventService.getEvents(apiFilters));
    } catch (error) {
      console.error("Error aplicando filtros:", error);
    }
  };

  // Calcular contadores basados en eventos mostrados
  const getActiveEventsCount = () => {
    const currentDate = new Date();
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate < currentDate;
    }).length;
  };

  const getUpcomingEventsCount = () => {
    const currentDate = new Date();
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= currentDate;
    }).length;
  };

  const handleEventClick = (eventId: number) => {
    navigate(`/evento/${eventId}`);
  };

  const handleCreateEvent = () => {
    navigate("/crear-evento");
  };

  // Renderizar estado de carga
  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Cargando eventos...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar estado de error
  if (error && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Error al cargar eventos
              </h2>
              <p className="text-red-600 mb-4">{error.message}</p>
              <Button
                onClick={() => execute(() => eventService.getEvents())}
                variant="outline"
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">
              Eventos Sostenibles
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre y participa en actividades comunitarias que promueven la
            sostenibilidad y el cuidado del medio ambiente
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {getActiveEventsCount()}
            </p>
            <p className="text-muted-foreground">Eventos Activos</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {filteredEvents.reduce(
                (total, event) => total + (event.participants_count || 0),
                0
              )}
            </p>
            <p className="text-muted-foreground">Total Participantes</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {getUpcomingEventsCount()}
            </p>
            <p className="text-muted-foreground">Eventos Futuros</p>
          </div>
        </div>

        {/* Layout principal: Filtros a la izquierda, Eventos a la derecha */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de filtros - Lado izquierdo */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <EventFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              {/* Botón Crear Evento debajo de los filtros */}
              <div className="mt-6">
                <Button
                  onClick={handleCreateEvent}
                  size="lg"
                  className="w-full"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Crear Evento
                </Button>
              </div>
            </div>
          </div>

          {/* Panel de eventos - Lado derecho */}
          <div className="flex-1">
            {/* Header de eventos */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {filters.date === "upcoming"
                  ? "Próximos Eventos"
                  : filters.date === "today"
                  ? "Eventos de Hoy"
                  : filters.date === "week"
                  ? "Eventos de Esta Semana"
                  : filters.date === "month"
                  ? "Eventos de Este Mes"
                  : "Todos los Eventos"}
              </h2>
              <p className="text-muted-foreground">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "evento" : "eventos"} disponibles
                {filters.date !== "todos" && ` (filtrado por ${filters.date})`}
              </p>
            </div>

            {/* Estado de carga durante filtros */}
            {loading && events.length > 0 && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Aplicando filtros...</p>
              </div>
            )}

            {/* Lista de eventos */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    location={event.location}
                    participantCount={event.participants_count || 0}
                    onClick={() => handleEventClick(event.id)}
                  />
                ))}
              </div>
            ) : !loading ? (
              <div className="text-center py-16">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-white/20">
                  <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No se encontraron eventos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {filters.search
                      ? `No hay eventos que coincidan con "${filters.search}"`
                      : filters.date !== "todos"
                      ? `No hay eventos para el filtro "${filters.date}"`
                      : "No hay eventos disponibles en este momento"}
                  </p>
                  {(filters.search || filters.date !== "todos") && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        setFilters({
                          search: "",
                          date: "todos",
                        })
                      }
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </div>
            ) : null}

            {/* Indicador de carga al final */}
            {loading && events.length > 0 && (
              <div className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
