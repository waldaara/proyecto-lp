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
  Edit
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
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
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    name: "",
    email: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - en una app real vendría de la API
  useEffect(() => {
    const mockEvent: Event = {
      id: id || "1",
      title: "Minga de Limpieza del Río Verde",
      description: "Únete a nosotros en esta importante actividad comunitaria para limpiar las orillas del Río Verde. Traeremos todos los materiales necesarios como bolsas, guantes y herramientas de limpieza. Es una excelente oportunidad para contribuir al cuidado del medio ambiente mientras nos conectamos con la comunidad. Al finalizar, compartiremos un refrigerio saludable preparado con productos locales.",
      date: "2024-08-15",
      time: "08:00",
      location: "Puente del Río Verde, Sector Los Álamos",
      category: "minga",
      participants: [
        {
          id: "1",
          name: "María González",
          email: "maria@email.com",
          registeredAt: "2024-08-10T10:00:00Z",
        },
        {
          id: "2",
          name: "Carlos López",
          email: "carlos@email.com",
          registeredAt: "2024-08-11T14:30:00Z",
        },
        {
          id: "3",
          name: "Ana Martínez",
          email: "ana@email.com",
          registeredAt: "2024-08-12T09:15:00Z",
        },
      ],
    };

    setTimeout(() => {
      setEvent(mockEvent);
      setLoading(false);
    }, 500);
  }, [id]);

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
      // Simular registro
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newParticipant: Participant = {
        id: Date.now().toString(),
        name: registrationForm.name,
        email: registrationForm.email,
        registeredAt: new Date().toISOString(),
      };

      setEvent((prev) => 
        prev ? { ...prev, participants: [...prev.participants, newParticipant] } : null
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

  const getCategoryBadge = (category: string) => {
    const categoryStyles = {
      minga: "bg-accent text-accent-foreground",
      sembratón: "bg-gradient-primary text-primary-foreground",
      taller: "bg-secondary text-secondary-foreground",
      limpieza: "bg-muted text-muted-foreground",
    };

    return categoryStyles[category as keyof typeof categoryStyles] || "bg-muted text-muted-foreground";
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
                  <Badge className={`${getCategoryBadge(event.category)} capitalize px-3 py-1 text-sm font-medium`}>
                    {event.category}
                  </Badge>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {event.participants.length} participantes
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/evento/${event.id}/editar`)}
                      className="hover:bg-accent hover:text-accent-foreground"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
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
                        <div className="text-xs text-muted-foreground">
                          {new Date(participant.registeredAt).toLocaleDateString("es-ES")}
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