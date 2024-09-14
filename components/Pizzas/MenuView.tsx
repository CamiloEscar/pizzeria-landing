import React, { useState } from "react";
import Image from "next/image";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { ShoppingCart, PizzaIcon, Star } from "lucide-react";

interface MenuViewProps {
  pizzas: Pizza[];
  addToCart: (pizza: Pizza, isHalf: boolean) => void;
}

const formatPrice = (price: number): string => {
  return price.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const MenuView: React.FC<MenuViewProps> = ({ pizzas, addToCart }) => {
  const [selectedPizzas, setSelectedPizzas] = useState<{ [key: number]: boolean }>({});

  const togglePizzaType = (pizzaId: number) => {
    setSelectedPizzas(prev => ({
      ...prev,
      [pizzaId]: !prev[pizzaId]
    }));
  };

  const handleAddToCart = (pizza: Pizza) => {
    addToCart(pizza, selectedPizzas[pizza.id] || false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {pizzas.map((pizza) => (
        <div
          key={pizza.id}
          className="flex flex-row items-start border border-gray-200 rounded-lg p-4 md:p-6 gap-4 mb-6 hover:shadow-lg transition-shadow duration-300 bg-white"
        >
          {/* Imagen cuadrada redondeada */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 self-center">
            <Image
              src={pizza.image}
              alt={pizza.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-md"
              unoptimized
            />
            {pizza.promotion && (
              <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br-lg">
                {pizza.promotion}
              </div>
            )}
          </div>

          {/* Contenido principal */}
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                  {pizza.name}
                </h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= pizza.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      } mr-1`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">{pizza.rating.toFixed(1)}</span>
                </div>
              </div>
              <Button
                onClick={() => handleAddToCart(pizza)}
                className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-all duration-300 flex items-center justify-center"
              >
                <ShoppingCart size={18} className="mr-2 ml-2" />
                <span className="hidden md:inline">Agregar</span>
              </Button>
            </div>

            {/* Precios */}
            <div className="flex items-center mb-2">
              <span className="text-2xl font-bold text-gray-900 mr-2">
                ${formatPrice(selectedPizzas[pizza.id] ? pizza.halfPrice : pizza.price)}
              </span>
              <div className="flex items-center text-sm text-gray-600">
                <PizzaIcon size={16} className="text-yellow-500 mr-1" />
                <span>Media: ${formatPrice(pizza.halfPrice)}</span>
              </div>
            </div>

            {/* Descripción */}
            {pizza.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {pizza.description}
              </p>
            )}

            {/* Botones para cambiar entre pizza entera y media pizza */}
            <div className="flex space-x-2">
              <Button
                onClick={() => togglePizzaType(pizza.id)}
                variant={selectedPizzas[pizza.id] ? "outline" : "default"}
                className="flex-1 py-1 px-2 text-xs md:text-sm"
              >
                Pizza Completa
              </Button>
              <Button
                onClick={() => togglePizzaType(pizza.id)}
                variant={selectedPizzas[pizza.id] ? "default" : "outline"}
                className="flex-1 py-1 px-2 text-xs md:text-sm"
              >
                Media Pizza
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuView;