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
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Nuestro Menú de Pizzas
        </h2>
        <p className="text-xl text-gray-600">
          Descubre nuestra deliciosa selección de pizzas artesanales
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow w-full md:w-1/3">
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
            <SelectTrigger className="w-full md:w-[200px]">
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
              className="w-24"
            >
              <Grid size={20} className="mr-2" />
              Grid
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "default" : "outline"}
              className="w-24"
            >
              <List size={20} className="mr-2" />
              Lista
            </Button>
          </div>
        </div>
      </div>
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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