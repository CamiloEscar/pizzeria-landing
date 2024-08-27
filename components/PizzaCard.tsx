import React from "react";
import { motion } from "framer-motion";
import { Pizza } from "../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface PizzaCardProps {
  pizza: Pizza;
  addToCart: (pizza: Pizza) => void;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, addToCart }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl shadow-lg w-64 h-96 group m-4"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image */}
      <Image
        src={pizza.image}
        alt={pizza.name}
        fill
        className="object-cover"
        unoptimized
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
          {pizza.name}
        </h3>
        <p className="text-sm text-gray-200 mb-3 line-clamp-3 drop-shadow">
          {pizza.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-white drop-shadow-md">
            ${pizza.price.toFixed(2)}
          </span>
          <div className="flex items-center bg-yellow-400 px-2 py-1 rounded-full">
            <Star className="text-white fill-current" size={14} />
            <span className="ml-1 text-white font-semibold text-sm">
              {pizza.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <Button
          onClick={() => addToCart(pizza)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full transition-all duration-300 text-sm font-semibold flex items-center justify-center group overflow-hidden relative"
        >
          <span className="group-hover:-translate-y-full transition-transform duration-300">
            Añadir al carrito
          </span>
          <span className="absolute flex items-center justify-center w-full h-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <ShoppingCart size={20} className="mr-2" />
            Agregar
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

export default PizzaCard;