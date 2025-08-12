import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, FileText, ArrowLeft, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import eventService from "@/services/eventService";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

const CreateEvent = () => {
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

      await eventService.createEvent(eventData);

      toast({
        title: "¡Evento creado exitosamente!",
        description: "Tu evento sostenible ha sido publicado.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al crear el evento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
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
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Crear Nuevo Evento
            </h1>
            <p className="text-muted-foreground text-lg">
              Organiza actividades sostenibles para tu comunidad
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

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="hero"
                  disabled={isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Creando evento...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Evento
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

export default CreateEvent;