import React from "react";
import Image from "next/image";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface MenuViewProps {
  pizzas: Pizza[];
  addToCart: (pizza: Pizza) => void;
}

const formatPrice = (price: number): string => {
  return price.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const MenuView: React.FC<MenuViewProps> = ({ pizzas, addToCart }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {pizzas.map((pizza) => (
        <div
          key={pizza.id}
          className="flex flex-col md:flex-row items-start md:items-end border-b border-gray-200 py-6 gap-4"
        >
          {/* Imagen redonda de la pizza */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 self-center md:self-end">
            <Image
              src={pizza.image}
              alt={pizza.name}
              layout="fill"
              objectFit="cover"
              className="rounded-full shadow-md"
              unoptimized
            />
          </div>

          {/* Contenido principal */}
          <div className="flex-grow w-full">
            {/* Título y botón de agregar */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">{pizza.name}</h3>
              <Button
                onClick={() => addToCart(pizza)}
                className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-all duration-300 flex items-center justify-center"
              >
                {/* Mostrar solo el ícono en pantallas pequeñas */}
                <ShoppingCart size={18} className="mr-2 md:mr-0" />
                <span className="hidden md:inline">Agregar</span>
              </Button>
            </div>

            {/* Precio y Promoción */}
            <div className="flex items-center mb-2">
              <span className="text-2xl font-bold text-gray-900">${formatPrice(pizza.price)}</span>
              {pizza.promotion && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pizza.promotion}
                </span>
              )}
            </div>

            {/* Descripción (opcional) */}
            {pizza.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2 md:line-clamp-none">
                {pizza.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuView;
