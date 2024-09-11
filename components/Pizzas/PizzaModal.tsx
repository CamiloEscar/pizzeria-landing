import React from "react";
import { motion } from "framer-motion";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star, ShoppingCart, ChevronLeft, ChevronRight, X } from "lucide-react";

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
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8"
      onClick={handleOverlayClick}
    >
      <motion.div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        {/* Navigation buttons */}
        <button
          onClick={onPrevious}
          className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full p-1 md:p-2 shadow-lg focus:outline-none hover:bg-gray-100 transition z-10"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={onNext}
          className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full p-1 md:p-2 shadow-lg focus:outline-none hover:bg-gray-100 transition z-10"
        >
          <ChevronRight size={20} />
        </button>

        {/* Image section */}
        <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-auto relative">
          <Image
            src={pizza.image}
            alt={pizza.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Description and Recipe section */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col bg-gray-50">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <X size={24} />
          </button>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">{pizza.name}</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{pizza.description}</p>
          <div className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            <h4 className="font-semibold mb-1 sm:mb-2">Receta:</h4>
            <p>{pizza.receta ? pizza.receta.join(", ") : "No disponible"}</p>
          </div>
          <div className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            <h4 className="font-semibold mb-1 sm:mb-2">Promoción:</h4>
            {pizza.promotion ? (
              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs sm:text-sm">{pizza.promotion}</span>
            ) : (
              <span>No hay promociones disponibles</span>
            )}
          </div>
          <div className="flex items-center mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-gray-800">${formatPrice(pizza.price)}</span>
            <div className="ml-3 sm:ml-4 flex items-center bg-yellow-400 px-2 sm:px-3 py-1 rounded-full">
              <Star className="text-white fill-current" size={16} />
              <span className="ml-1 sm:ml-2 text-white font-semibold text-sm sm:text-lg">{pizza.rating.toFixed(1)}</span>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm sm:text-lg transition-all duration-300 flex items-center justify-center"
          >
            <span>Agregar al carrito</span>
            <ShoppingCart size={18} className="ml-2" />
          </Button>
        </div>

        {/* Additional content */}
        {children}
      </motion.div>
    </div>
  );
};

export default PizzaModal;