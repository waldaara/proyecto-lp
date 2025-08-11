import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Leaf, Calendar, Users, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participantCount: number;
  category: string;
}

interface FilterOptions {
  search: string;
  date: string;
  category: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    date: "",
    category: "todos",
  });

  // Mock data - en una app real vendría de la API
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Minga de Limpieza del Río Verde",
        description: "Únete a nosotros para limpiar las orillas del Río Verde y proteger nuestro ecosistema local. Actividad familiar con materiales incluidos.",
        date: "2024-08-15",
        location: "Puente del Río Verde, Sector Los Álamos",
        participantCount: 12,
        category: "minga",
      },
      {
        id: "2",
        title: "Sembratón de Árboles Nativos",
        description: "Plantaremos 100 árboles nativos en el Parque Ecológico. Contribuye a la reforestación urbana y aprende sobre especies locales.",
        date: "2024-08-20",
        location: "Parque Ecológico Municipal",
        participantCount: 25,
        category: "sembratón",
      },
      {
        id: "3",
        title: "Taller de Compostaje Doméstico",
        description: "Aprende técnicas prácticas para hacer compost en casa y reducir tus residuos orgánicos de manera sostenible.",
        date: "2024-08-18",
        location: "Centro Comunitario La Esperanza",
        participantCount: 8,
        category: "taller",
      },
      {
        id: "4",
        title: "Limpieza de Playas Locales",
        description: "Jornada de limpieza en las playas cercanas. Incluye separación de residuos y educación sobre contaminación marina.",
        date: "2024-08-25",
        location: "Playa El Mirador",
        participantCount: 18,
        category: "limpieza",
      },
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = events;

    // Filtro de búsqueda
    if (filters.search) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro de fecha
    if (filters.date) {
      filtered = filtered.filter((event) => event.date === filters.date);
    }

    // Filtro de categoría
    if (filters.category && filters.category !== "todos") {
      filtered = filtered.filter((event) => event.category === filters.category);
    }

    setFilteredEvents(filtered);
  }, [filters, events]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/evento/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                <Leaf className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Eventos Comunitarios
              <span className="block text-white/90">Sostenibles</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Únete a iniciativas que transforman tu comunidad. Participa en mingas, sembratones y actividades 
              que cuidan nuestro planeta mientras fortalecen los lazos comunitarios.
            </p>
            <div className="flex justify-center">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/crear-evento")}
                className="bg-white text-primary hover:bg-white/90"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear Evento
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <EventFilters
              onFilterChange={handleFilterChange}
              activeFilters={filters}
            />
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Próximos Eventos
                </h2>
                <p className="text-muted-foreground">
                  {filteredEvents.length} {filteredEvents.length === 1 ? "evento" : "eventos"} disponibles
                </p>
              </div>
              
              <Button
                variant="sustainable"
                onClick={() => navigate("/crear-evento")}
                className="hidden sm:flex"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Evento
              </Button>
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron eventos
                </h3>
                <p className="text-muted-foreground mb-4">
                  No hay eventos que coincidan con tus filtros actuales.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({ search: "", date: "", category: "todos" })}
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    {...event}
                    onClick={() => handleEventClick(event.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">63</div>
              <div className="text-muted-foreground">Eventos Realizados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,247</div>
              <div className="text-muted-foreground">Participantes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">8.5</div>
              <div className="text-muted-foreground">Toneladas Recicladas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">342</div>
              <div className="text-muted-foreground">Árboles Plantados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
