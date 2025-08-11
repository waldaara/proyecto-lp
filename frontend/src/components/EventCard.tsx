import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  id: number; // Cambiado de string a number para coincidir con el backend
  title: string;
  description: string;
  date: string;
  location: string;
  participantCount: number;
  category: string;
  onClick: () => void;
}

const EventCard = ({
  title,
  description,
  date,
  location,
  participantCount,
  category,
  onClick,
}: EventCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString; // Fallback si la fecha no es válida
    }
  };

  // Determinar si el evento es futuro
  const isUpcoming = () => {
    try {
      const eventDate = new Date(date);
      const now = new Date();
      return eventDate > now;
    } catch {
      return false;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryStyles = {
      minga: "bg-accent text-accent-foreground",
      sembratón: "bg-gradient-primary text-primary-foreground",
      taller: "bg-secondary text-secondary-foreground",
      limpieza: "bg-muted text-muted-foreground",
      upcoming: "bg-green-100 text-green-800", // Tag para eventos futuros
    };

    return (
      categoryStyles[category as keyof typeof categoryStyles] ||
      "bg-muted text-muted-foreground"
    );
  };

  // Determinar qué tag mostrar
  const getDisplayTag = () => {
    if (isUpcoming()) {
      return { text: "Próximo", category: "upcoming" };
    }
    return { text: "Evento", category: "evento" };
  };

  const displayTag = getDisplayTag();

  return (
    <Card className="group hover:shadow-card transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border-0 shadow-soft bg-gradient-subtle">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge
            className={`${getCategoryBadge(
              displayTag.category
            )} capitalize px-3 py-1 text-sm font-medium`}
          >
            {displayTag.text}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {/* Título truncado a una sola línea */}
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descripción truncada a una sola línea */}
        <p className="text-muted-foreground line-clamp-1 leading-relaxed">
          {description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">{formatDate(date)}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium truncate">{location}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {participantCount}{" "}
              {participantCount === 1 ? "participante" : "participantes"}
            </span>
          </div>
        </div>

        {/* Botón siempre al final */}
        <Button onClick={onClick} variant="sustainable" className="w-full mt-4">
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
