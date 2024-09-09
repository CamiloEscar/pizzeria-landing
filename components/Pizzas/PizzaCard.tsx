import React from "react";
import { motion } from "framer-motion";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface PizzaCardProps {
  pizza: Pizza;
  addToCart: (pizza: Pizza) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, addToCart }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl shadow-lg w-full max-w-lg h-[400px] group flex flex-col mx-auto my-6"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full">
        <Image
          src={pizza.image}
          alt={pizza.name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-transparent to-transparent">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">
              {pizza.name}
            </h3>
            <p className="text-sm text-gray-200 line-clamp-2">
              {pizza.description}
            </p>
            <div className="flex justify-between items-center mt-auto mb-4">
              <span className="text-2xl font-bold text-white">
                ${pizza.price.toFixed(2)}
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
  );
};

export default PizzaCard;
