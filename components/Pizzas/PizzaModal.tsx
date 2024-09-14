import React from "react";
import { motion } from "framer-motion";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star, ShoppingCart, ChevronLeft, ChevronRight, X } from "lucide-react";

interface PizzaModalProps {
  pizza: Pizza | null;
  onClose: () => void;
  addToCart: (pizza: Pizza, isHalf: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  isHalf: boolean;
  children?: React.ReactNode;
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, onClose, addToCart, onNext, onPrevious, isHalf, children }) => {
  if (!pizza) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    addToCart(pizza, isHalf);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8"
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative flex flex-col md:flex-row"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image section */}
        <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto relative">
          <Image
            src={pizza.image}
            alt={pizza.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-200 focus:outline-none bg-black/30 rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col bg-white">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{pizza.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{pizza.description}</p>
          
          <div className="text-sm text-gray-700 mb-4">
            <h4 className="font-semibold mb-1">Ingredientes:</h4>
            <p className="text-gray-600">{pizza.receta ? pizza.receta.join(", ") : "No disponible"}</p>
          </div>
          
          {pizza.promotion && (
            <div className="mb-4">
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pizza.promotion}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-3xl font-bold text-gray-800">${formatPrice(pizza.price)}</span>
            <div className="flex items-center bg-yellow-400 px-2 py-1 rounded-full">
              <Star className="text-white fill-current" size={16} />
              <span className="ml-1 text-white font-semibold">{pizza.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-all duration-300 flex items-center justify-center"
          >
            <span>Agregar al carrito</span>
            <ShoppingCart size={18} className="ml-2" />
          </Button>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={onPrevious}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-1 shadow-lg focus:outline-none transition z-10"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={onNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-1 shadow-lg focus:outline-none transition z-10"
        >
          <ChevronRight size={20} />
        </button>

        {/* Additional content */}
        {children}
      </motion.div>
    </motion.div>
  );
};

export default PizzaModal;