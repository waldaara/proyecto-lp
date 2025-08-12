import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, FileText, ArrowLeft, Save, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import eventService from "@/services/eventService";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar datos del evento
  useEffect(() => {
    const loadEventData = async () => {
      try {
        if (!id) {
          navigate("/");
          return;
        }

        const event = await eventService.getEvent(parseInt(id));
        
        // Convertir la fecha del backend al formato del formulario
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = eventDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

        const formData: EventFormData = {
          title: event.title,
          description: event.description,
          date: dateStr,
          time: timeStr,
          location: event.location,
        };

        setFormData(formData);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación básica
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (!id) {
        throw new Error("ID del evento no encontrado");
      }

      // Combinar fecha y hora en formato ISO para el backend
      const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      const eventData = {
        event: {
          title: formData.title,
          description: formData.description,
          date: dateTime,
          location: formData.location,
        }
      };

      await eventService.updateEvent(parseInt(id), eventData);

      toast({
        title: "¡Evento actualizado exitosamente!",
        description: "Los cambios han sido guardados.",
      });

      navigate(`/evento/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el evento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el evento "${formData.title}"? Esta acción no se puede deshacer.`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/evento/${id}`)}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al evento
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Editar Evento
            </h1>
            <p className="text-muted-foreground text-lg">
              Actualiza la información de tu evento sostenible
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-card border-0 bg-background">
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Información del Evento</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Título del evento *
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ej: Minga de Limpieza del Río"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Descripción *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe los objetivos, actividades y lo que necesitan llevar los participantes..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-background border-border focus:border-primary min-h-[120px] resize-none"
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    Fecha *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="pl-10 bg-background border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">
                    Hora
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="bg-background border-border focus:border-primary"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Ubicación *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Ej: Parque Central, Calle Principal #123"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10 bg-background border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteEvent}
                  disabled={isDeleting || isSubmitting}
                  className="px-6"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive-foreground mr-2" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Evento
                    </>
                  )}
                </Button>
                
                <Button
                  type="submit"
                  variant="hero"
                  disabled={isSubmitting || isDeleting}
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Actualizando evento...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Actualizar Evento
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditEvent;