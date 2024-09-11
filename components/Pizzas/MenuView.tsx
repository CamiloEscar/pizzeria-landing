import React from "react";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface MenuViewProps {
  pizzas: Pizza[];
  addToCart: (pizza: Pizza) => void;
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const MenuView: React.FC<MenuViewProps> = ({ pizzas, addToCart }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {pizzas.map((pizza) => (
        <div key={pizza.id} className="flex flex-col md:flex-row items-center border-b border-gray-200 py-6 gap-4">
          <div className="flex-shrink-0 w-full md:w-32 h-32 mb-4 md:mb-0">
            <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover rounded-lg shadow-md" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-800">{pizza.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{pizza.description}</p>
            <div className="mt-2 flex items-center">
              <span className="text-2xl font-bold text-gray-900">${formatPrice(pizza.price)}</span>
              {pizza.promotion && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pizza.promotion}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 mt-4 md:mt-0">
            <Button
              onClick={() => addToCart(pizza)}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-all duration-300 flex items-center justify-center"
            >
              <ShoppingCart size={18} className="mr-2" />
              <span>Agregar al carrito</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuView;