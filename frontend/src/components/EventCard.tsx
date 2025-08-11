import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  id: string;
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
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  return (
    <Card className="group hover:shadow-card transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border-0 shadow-soft bg-gradient-subtle">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge className={`${getCategoryBadge(category)} capitalize px-3 py-1 text-sm font-medium`}>
            {category}
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
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2 leading-relaxed">
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
              {participantCount} {participantCount === 1 ? "participante" : "participantes"}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={onClick}
          variant="sustainable"
          className="w-full mt-4"
        >
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;