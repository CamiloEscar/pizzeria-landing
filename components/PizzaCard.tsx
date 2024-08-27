import { motion } from "framer-motion";
import { Pizza } from "../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

interface PizzaCardProps {
  pizza: Pizza;
  addToCart: (pizza: Pizza) => void;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, addToCart }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col w-[250px] h-[300px] transition-transform transform hover:scale-105 mx-auto" // Tamaño fijo y centrado
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-40">
        <Image
          src={pizza.image}
          alt={pizza.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          {pizza.name}
        </h3>
        <p className="text-gray-600 mb-2 flex-grow text-xs line-clamp-2">
          {pizza.description}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-red-600">
            ${pizza.price.toFixed(2)}
          </span>
          <div className="flex items-center">
            <Star className="text-yellow-400 fill-current" size={14} />
            <span className="ml-1 text-gray-700 text-xs">
              {pizza.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      <Button
        onClick={() => addToCart(pizza)}
        className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition-colors text-xs"
      >
        Añadir al carrito
      </Button>
    </motion.div>
  );
};
