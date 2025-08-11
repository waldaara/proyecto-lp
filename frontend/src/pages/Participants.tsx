import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Search, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Participant {
  id: string;
  name: string;
  email: string;
  eventsAttended: number;
  lastEvent: string;
  favoriteCategory: string;
  joinDate: string;
}

const Participants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  useEffect(() => {
    const mockParticipants: Participant[] = [
      {
        id: "1",
        name: "María González",
        email: "maria@email.com",
        eventsAttended: 5,
        lastEvent: "Minga de Limpieza del Río Verde",
        favoriteCategory: "minga",
        joinDate: "2024-01-15",
      },
      {
        id: "2",
        name: "Carlos López",
        email: "carlos@email.com",
        eventsAttended: 3,
        lastEvent: "Sembratón de Árboles Nativos",
        favoriteCategory: "sembratón",
        joinDate: "2024-02-20",
      },
      {
        id: "3",
        name: "Ana Martínez",
        email: "ana@email.com",
        eventsAttended: 7,
        lastEvent: "Taller de Compostaje Doméstico",
        favoriteCategory: "taller",
        joinDate: "2023-11-10",
      },
      {
        id: "4",
        name: "Pedro Rodríguez",
        email: "pedro@email.com",
        eventsAttended: 2,
        lastEvent: "Limpieza de Playas Locales",
        favoriteCategory: "limpieza",
        joinDate: "2024-03-05",
      },
      {
        id: "5",
        name: "Laura Fernández",
        email: "laura@email.com",
        eventsAttended: 4,
        lastEvent: "Minga de Limpieza del Río Verde",
        favoriteCategory: "minga",
        joinDate: "2024-01-30",
      },
    ];

    setParticipants(mockParticipants);
    setFilteredParticipants(mockParticipants);
  }, []);

  // Filtrar participantes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredParticipants(participants);
    } else {
      const filtered = participants.filter(
        (participant) =>
          participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.favoriteCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredParticipants(filtered);
    }
  }, [searchTerm, participants]);

  const getCategoryBadge = (category: string) => {
    const categoryStyles = {
      minga: "bg-accent text-accent-foreground",
      sembratón: "bg-gradient-primary text-primary-foreground",
      taller: "bg-secondary text-secondary-foreground",
      limpieza: "bg-muted text-muted-foreground",
    };

    return categoryStyles[category as keyof typeof categoryStyles] || "bg-muted text-muted-foreground";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const totalEvents = participants.reduce((sum, p) => sum + p.eventsAttended, 0);
  const avgEventsPerParticipant = participants.length > 0 ? (totalEvents / participants.length).toFixed(1) : 0;
  const mostActiveParticipant = participants.reduce((max, p) => p.eventsAttended > max.eventsAttended ? p : max, participants[0]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Participantes de la Comunidad
          </h1>
          <p className="text-muted-foreground text-lg">
            Conoce a los miembros activos de nuestra comunidad sostenible
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft border-0 bg-gradient-subtle">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{participants.length}</p>
                  <p className="text-sm text-muted-foreground">Participantes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0 bg-gradient-subtle">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalEvents}</p>
                  <p className="text-sm text-muted-foreground">Participaciones Totales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0 bg-gradient-subtle">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgEventsPerParticipant}</p>
                  <p className="text-sm text-muted-foreground">Promedio por Persona</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0 bg-gradient-subtle">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xl font-bold text-foreground">{mostActiveParticipant?.eventsAttended || 0}</p>
                  <p className="text-sm text-muted-foreground">Más Activo/a</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Filter */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft border-0 bg-gradient-subtle">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-primary" />
                  <span>Buscar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-medium">
                    Nombre o email
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Buscar participante..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border focus:border-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participants List */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Lista de Participantes
              </h2>
              <p className="text-muted-foreground">
                {filteredParticipants.length} {filteredParticipants.length === 1 ? "participante" : "participantes"} encontrados
              </p>
            </div>

            {filteredParticipants.length === 0 ? (
              <Card className="shadow-soft border-0 bg-background">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No se encontraron participantes
                  </h3>
                  <p className="text-muted-foreground">
                    No hay participantes que coincidan con tu búsqueda.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredParticipants.map((participant) => (
                  <Card
                    key={participant.id}
                    className="shadow-soft border-0 bg-background hover:shadow-card transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                            <User className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {participant.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{participant.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                          <div className="text-center md:text-left">
                            <p className="text-lg font-bold text-primary">
                              {participant.eventsAttended}
                            </p>
                            <p className="text-xs text-muted-foreground">eventos</p>
                          </div>

                          <div className="text-center md:text-left">
                            <Badge className={`${getCategoryBadge(participant.favoriteCategory)} capitalize`}>
                              {participant.favoriteCategory}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">categoría favorita</p>
                          </div>

                          <div className="text-center md:text-left">
                            <p className="text-sm font-medium text-foreground">
                              {formatDate(participant.joinDate)}
                            </p>
                            <p className="text-xs text-muted-foreground">se unió</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Último evento:</span> {participant.lastEvent}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participants;