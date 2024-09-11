import React, { useState, useMemo } from "react";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Search } from "lucide-react";
import PizzaCard from "./PizzaCard";
import MenuView from "./MenuView";

interface PizzaMenuProps {
  pizzas: Pizza[];
  addToCart: (pizza: Pizza) => void;
}

const PizzaMenu: React.FC<PizzaMenuProps> = ({ pizzas, addToCart }) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredPizzas = useMemo(() => {
    return pizzas.filter((pizza) => {
      const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pizza.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === "all" || 
                            (filterType === "promotion" && pizza.promotion) ||
                            (filterType === "no-promotion" && !pizza.promotion);
      return matchesSearch && matchesFilter;
    });
  }, [pizzas, searchTerm, filterType]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
          Menú de Pizzas
        </h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Buscar pizzas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las pizzas</SelectItem>
              <SelectItem value="promotion">Con promoción</SelectItem>
              <SelectItem value="no-promotion">Sin promoción</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "default" : "outline"}
            >
              <Grid size={20} className="mr-2" />
              Grid
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "default" : "outline"}
            >
              <List size={20} className="mr-2" />
              Lista
            </Button>
          </div>
        </div>
      </div>
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPizzas.map((pizza) => (
            <div key={pizza.id} className="flex justify-center items-center">
              <PizzaCard pizza={pizza} addToCart={addToCart} pizzas={pizzas} />
            </div>
          ))}
        </div>
      ) : (
        <MenuView pizzas={filteredPizzas} addToCart={addToCart} />
      )}
    </div>
  );
};

export default PizzaMenu;