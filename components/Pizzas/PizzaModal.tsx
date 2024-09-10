import React from "react";
import { motion } from "framer-motion";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

interface PizzaModalProps {
  pizza: Pizza | null;
  onClose: () => void;
  addToCart: (pizza: Pizza) => void;
  onNext: () => void;
  onPrevious: () => void;
  children?: React.ReactNode;
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, onClose, addToCart, onNext, onPrevious, children }) => {
  if (!pizza) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    addToCart(pizza);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <motion.div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 flex flex-col md:flex-row overflow-hidden relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        {/* Botón de Navegación Anterior */}
        <button
          onClick={onPrevious}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full p-2 shadow-lg focus:outline-none hover:bg-gray-100 transition"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Botón de Navegación Siguiente */}
        <button
          onClick={onNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full p-2 shadow-lg focus:outline-none hover:bg-gray-100 transition"
        >
          <ChevronRight size={24} />
        </button>

        {/* Sección derecha: Imagen */}
        <div className="w-full md:w-1/2 h-80 md:h-auto relative">
          <Image
            src={pizza.image}
            alt={pizza.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Sección izquierda: Descripción y Receta */}
        <div className="w-full md:w-1/2 p-8 flex flex-col bg-gray-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">{pizza.name}</h3>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">{pizza.description}</p>
          <div className="text-base text-gray-700 mb-6">
            <h4 className="font-semibold mb-2">Receta:</h4>
            <p>{pizza.receta ? pizza.receta.join(", ") : "No disponible"}</p>
          </div>
          <div className="text-base text-gray-700 mb-6">
            <h4 className="font-semibold mb-2">Promoción:</h4>
            {pizza.promotion ? (
              <span className="bg-red-500 text-white px-2 py-1 rounded-lg">{pizza.promotion}</span>
            ) : (
              <span>No hay promociones disponibles</span>
            )}
          </div>
          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold text-gray-800">${formatPrice(pizza.price)}</span>
            <div className="ml-4 flex items-center bg-yellow-400 px-3 py-1 rounded-full">
              <Star className="text-white fill-current" size={20} />
              <span className="ml-2 text-white font-semibold text-lg">{pizza.rating.toFixed(1)}</span>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg transition-all duration-300 flex items-center justify-center"
          >
            <span>Agregar al carrito</span>
            <ShoppingCart size={20} className="ml-2" />
          </Button>
        </div>

        {/* Contenido adicional */}
        {children}
      </motion.div>
    </div>
  );
};

export default PizzaModal;
