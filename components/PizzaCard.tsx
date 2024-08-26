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
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={pizza.image}
        alt={pizza.name}
        width={480}
        height={480}
        className="w-full h-48 object-cover"
        unoptimized
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {pizza.name}
        </h3>
        <p className="text-gray-600 mb-4">{pizza.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-red-600">
            ${pizza.price.toFixed(2)}
          </span>
          <div className="flex items-center">
            <Star className="text-yellow-400 fill-current" size={20} />
            <span className="ml-1 text-gray-700">
              {pizza.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <Button
          onClick={() => addToCart(pizza)}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Añadir al carrito
        </Button>
      </div>
    </motion.div>
  );
};
