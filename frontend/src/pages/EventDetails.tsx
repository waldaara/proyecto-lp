import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  MapPin, 
  Users, 
  UserPlus, 
  ArrowLeft, 
  Clock,
  FileText,
  Mail,
  User,
  Edit,
  Trash2
} from "lucide-react";
import eventService from "@/services/eventService";
import participantService from "@/services/participantService";
import Navbar from "@/components/Navbar";
import { Event as ApiEvent, Participant as ApiParticipant } from "@/api/types";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: Participant[];
}

interface Participant {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
}

interface RegistrationForm {
  name: string;
  email: string;
}

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [backendEvent, setBackendEvent] = useState<ApiEvent | null>(null);
  const [participants, setParticipants] = useState<ApiParticipant[]>([]);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    name: "",
    email: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Cargar datos del evento desde la API
  useEffect(() => {
    const loadEventData = async () => {
      try {
        if (!id) {
          navigate("/");
          return;
        }

        const apiEvent = await eventService.getEvent(parseInt(id));
        setBackendEvent(apiEvent);
        
        // Cargar participantes del evento
        const eventParticipants = await participantService.getEventParticipants(parseInt(id));
        setParticipants(eventParticipants);
        
        // Convertir el evento de la API al formato local
        const eventDate = new Date(apiEvent.date);
        const dateStr = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = eventDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

        const localEvent: Event = {
          id: apiEvent.id.toString(),
          title: apiEvent.title,
          description: apiEvent.description,
          date: dateStr,
          time: timeStr,
          location: apiEvent.location,
          participants: eventParticipants.map(p => ({
            id: p.id.toString(),
            name: p.name,
            email: p.email,
            registeredAt: p.created_at
          })),
        };

        setEvent(localEvent);
        setLoading(false);
      } catch (error) {
        console.error("Error loading event:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del evento.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    loadEventData();
  }, [id, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    if (!registrationForm.name || !registrationForm.email) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      });
      setIsRegistering(false);
      return;
    }

    try {
      if (!backendEvent) {
        throw new Error("No se ha cargado el evento");
      }

      // Registrar participante usando el backend
      const newParticipant = await participantService.registerParticipant(
        backendEvent.id,
        {
          participant: {
            name: registrationForm.name,
            email: registrationForm.email
          }
        }
      );

      // Actualizar la lista de participantes
      setParticipants(prev => [...prev, newParticipant]);

      // Actualizar el evento local con el nuevo participante
      const localParticipant: Participant = {
        id: newParticipant.id.toString(),
        name: newParticipant.name,
        email: newParticipant.email,
        registeredAt: newParticipant.created_at,
      };

      setEvent((prev) => 
        prev ? { ...prev, participants: [...prev.participants, localParticipant] } : null
      );

      setRegistrationForm({ name: "", email: "" });

      toast({
        title: "¡Registro exitoso!",
        description: "Te has registrado correctamente para el evento.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema con el registro. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event || !id) return;

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el evento "${event.title}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await eventService.deleteEvent(parseInt(id));

      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado exitosamente.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el evento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    const participant = participants.find(p => p.id.toString() === participantId);
    if (!participant) return;

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar a ${participant.name} del evento? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await participantService.cancelParticipation(parseInt(participantId));

      // Actualizar la lista de participantes
      setParticipants(prev => prev.filter(p => p.id.toString() !== participantId));

      // Actualizar el evento local
      setEvent(prev => 
        prev ? { 
          ...prev, 
          participants: prev.participants.filter(p => p.id !== participantId) 
        } : null
      );

      toast({
        title: "Participante eliminado",
        description: `${participant.name} ha sido eliminado del evento.`,
      });
    } catch (error) {
      console.error("Error deleting participant:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el participante. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString ? `${timeString} hrs` : "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Evento no encontrado</h1>
          <Button variant="outline" onClick={() => navigate("/")} className="mt-4">
            Volver a eventos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a eventos
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info */}
            <Card className="shadow-card border-0 bg-background">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {event.participants.length} participantes
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/evento/${event.id}/editar`)}
                      className="hover:bg-accent hover:text-accent-foreground"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteEvent}
                      disabled={isDeleting}
                      className="hover:bg-destructive/90"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {event.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Descripción</span>
                </div>
                <p className="text-foreground leading-relaxed">
                  {event.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{formatDate(event.date)}</p>
                      {event.time && (
                        <p className="text-sm text-muted-foreground">{formatTime(event.time)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Ubicación</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants List */}
            <Card className="shadow-card border-0 bg-background">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Participantes Registrados</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {event.participants.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aún no hay participantes registrados. ¡Sé el primero en unirte!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {event.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">{participant.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-xs text-muted-foreground">
                            {new Date(participant.registeredAt).toLocaleDateString("es-ES")}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteParticipant(participant.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-card border-0 bg-background sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  <span>Registro</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Tu nombre completo"
                        value={registrationForm.name}
                        onChange={handleInputChange}
                        className="pl-10 bg-background border-border focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={registrationForm.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-background border-border focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    disabled={isRegistering}
                    className="w-full"
                  >
                    {isRegistering ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Registrarme
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;