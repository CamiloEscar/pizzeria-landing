import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import PizzaModal from "./PizzaModal"; // Asegúrate de importar el modal

interface PizzaCardProps {
  pizza: Pizza;
  addToCart: (pizza: Pizza) => void;
  pizzas: Pizza[]; // Lista de todas las pizzas para navegar en el modal
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, addToCart, pizzas }) => {
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [currentPizza, setCurrentPizza] = useState(pizza); // Pizza actual en el modal

  // Función para navegar entre las pizzas
  const handleNavigatePizza = (direction: "prev" | "next") => {
    const currentIndex = pizzas.findIndex(p => p.id === currentPizza.id);
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % pizzas.length
        : (currentIndex - 1 + pizzas.length) % pizzas.length;
    setCurrentPizza(pizzas[newIndex]);
  };

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-xl shadow-lg w-full max-w-lg h-[400px] group flex flex-col mx-auto my-6"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full h-full cursor-pointer" onClick={() => setShowModal(true)}>
          <Image
            src={pizza.image}
            alt={pizza.name}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Promotion Badge */}
          {pizza.promotion && (
            <div className="absolute top-0 left-0 flex items-center justify-center p-4">
              <motion.div
                className="bg-red-600 text-yellow-300 px-4 py-2 text-xs font-bold rounded-lg relative"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.7, 1, 0.7, 1] }} // Parpadeo
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="block whitespace-nowrap">{pizza.promotion}</span>
              </motion.div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
          <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-transparent to-transparent">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">{pizza.name}</h3>
              <p className="text-sm text-gray-200 line-clamp-2">{pizza.description}</p>
              <div className="flex justify-between items-center mt-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  ${formatPrice(pizza.price)}
                </span>
                <div className="flex items-center bg-yellow-400 px-2 py-1 rounded-full">
                  <Star className="text-white fill-current" size={16} />
                  <span className="ml-1 text-white font-semibold text-sm">
                    {pizza.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => addToCart(pizza)}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-all duration-300 flex items-center justify-center"
            >
              <span>Agregar al carrito</span>
              <ShoppingCart size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Modal para la pizza */}
      {showModal && (
        <PizzaModal
          pizza={currentPizza}
          onClose={() => setShowModal(false)}
          addToCart={addToCart}
          onNext={() => handleNavigatePizza("next")}
          onPrevious={() => handleNavigatePizza("prev")}
        >
          <div className="absolute inset-y-0 left-0 flex items-center p-4">
            <button
              onClick={() => handleNavigatePizza("prev")}
              className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center p-4">
            <button
              onClick={() => handleNavigatePizza("next")}
              className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </PizzaModal>
      )}
    </>
  );
};

export default PizzaCard;
