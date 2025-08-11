import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, Filter, X } from "lucide-react";

interface EventFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

interface FilterOptions {
  search: string;
  date: string;
  category: string;
}

const EventFilters = ({ onFilterChange, activeFilters }: EventFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters);

  const categories = ["todos", "minga", "sembratón", "taller", "limpieza"];

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { search: "", date: "", category: "todos" };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = 
    localFilters.search || 
    localFilters.date || 
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
            <Input
              id="date"
              type="date"
              value={localFilters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="pl-10 bg-background border-border focus:border-primary transition-colors duration-300"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Categoría</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={localFilters.category === category ? "default" : "secondary"}
                className={`cursor-pointer transition-all duration-300 hover:shadow-soft capitalize px-3 py-2 ${
                  localFilters.category === category
                    ? "bg-gradient-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleFilterChange("category", category)}
              >
                {category === "todos" ? "Todos" : category}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventFilters;