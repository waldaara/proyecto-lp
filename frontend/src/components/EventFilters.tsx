import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, Filter, X, Clock } from "lucide-react";

interface EventFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  search: string;
  date: string;
  category: string;
}

const EventFilters = ({ filters, onFilterChange }: EventFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { search: "", date: "todos", category: "todos" };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.search ||
    (localFilters.date && localFilters.date !== "todos") ||
    (localFilters.category && localFilters.category !== "todos");

  return (
    <Card className="shadow-soft border-0 bg-gradient-subtle">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Filtros</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Buscar eventos
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Título, descripción o ubicación..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 bg-background border-border focus:border-primary transition-colors duration-300"
            />
          </div>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">
            Fecha
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              id="date"
              value={localFilters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:border-primary focus:outline-none transition-colors duration-300"
            >
              <option value="todos">Todos los eventos</option>
              <option value="upcoming">Solo eventos futuros</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
          </div>
        </div>

        {/* Category Filter - Mantenido por compatibilidad pero no usado en el backend */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Categoría
          </Label>
          <div className="flex flex-wrap gap-2">
            {["todos", "minga", "sembratón", "taller", "limpieza"].map(
              (category) => (
                <Badge
                  key={category}
                  variant={
                    localFilters.category === category ? "default" : "secondary"
                  }
                  className={`cursor-pointer transition-colors duration-200 ${
                    localFilters.category === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  onClick={() => handleFilterChange("category", category)}
                >
                  {category === "todos" ? "Todas" : category}
                </Badge>
              )
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Acciones rápidas</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange("date", "upcoming")}
              className="text-xs"
            >
              <Clock className="h-3 w-3 mr-1" />
              Próximos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange("date", "today")}
              className="text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Hoy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventFilters;
