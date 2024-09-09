import React from "react";
import { motion } from "framer-motion";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PizzaModalProps {
  pizza: Pizza | null;
  onClose: () => void;
}

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, onClose }) => {
  if (!pizza) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Cierra la modal solo si el clic es en el overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <motion.div
        className="bg-white rounded-lg overflow-hidden shadow-lg max-w-md mx-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <Image
            src={pizza.image}
            alt={pizza.name}
            width={500}
            height={300}
            className="object-cover w-full h-64"
            unoptimized
          />
          <button
            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-2xl font-bold mb-2">{pizza.name}</h3>
          <p className="text-sm text-gray-700 mb-4">{pizza.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">${pizza.price.toFixed(2)}</span>
            <div className="flex items-center bg-yellow-400 px-2 py-1 rounded-full">
              <span className="text-white font-semibold text-sm">{pizza.rating.toFixed(1)}</span>
            </div>
          </div>
          <Button
            onClick={() => window.open(pizza.image, '_blank')}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-all duration-300"
          >
            Ver imagen en tamaño completo
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PizzaModal;
