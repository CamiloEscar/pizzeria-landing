import React from "react";
import { motion } from "framer-motion";
import { Pizza } from "../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ComboCardProps {
  comboName: string;
  pizzas: Pizza[];
  specialPrice: number;
  originalPrice: number;
  addToCart: (comboName: string, pizzas: Pizza[], specialPrice: number) => void; // Cambia la firma
}

const ComboCard: React.FC<ComboCardProps> = ({
  comboName,
  pizzas,
  specialPrice,
  originalPrice,
  addToCart,
}) => {
  const discount = Math.round(
    ((originalPrice - specialPrice) / originalPrice) * 100
  );

  const backgroundImages = pizzas
    .map((pizza) => `url(${pizza.image})`)
    .join(", ");

  const handleAddToCart = () => {
    addToCart(comboName, pizzas, specialPrice); // Llama a addToCart con los detalles del combo
  };

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden group"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-blend-multiply"
        style={{
          backgroundImage: backgroundImages,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
        <motion.div
          className="absolute top-4 left-4 bg-red-600 text-yellow-300 text-xs font-bold py-1 px-3 rounded-full shadow-md"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.7, 1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {discount}% OFF
          <div className="absolute top-0 left-0 w-0 h-0 border-l-8 border-r-8 border-t-8 border-red-600 border-t-transparent border-l-transparent border-r-transparent transform rotate-45 translate-x-1/2 translate-y-1/2 z-10" />
          <div className="absolute top-0 left-0 w-0 h-0 border-l-8 border-r-8 border-t-8 border-yellow-300 border-t-transparent border-l-transparent border-r-transparent transform rotate-45 translate-x-1/2 translate-y-1/2 -z-10" />
        </motion.div>
      </div>

      <div className="relative p-6 pt-16 pb-16">
        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
          {comboName}
        </h3>

        <ul className="space-y-3 mb-6">
          {pizzas.map((pizza) => (
            <li key={pizza.id} className="flex items-center space-x-3">
              <Image
                src={pizza.image}
                alt={pizza.name}
                width={80}
                height={80}
                className="w-16 h-16 object-cover rounded-full border-2 border-gray-200 shadow-md"
                unoptimized
              />
              <span className="text-white font-medium truncate">
                {pizza.name}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-300 line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <div className="text-xl font-extrabold text-red-500 mt-1">
              ${specialPrice.toFixed(2)}
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full transition-all duration-300 text-sm font-semibold flex items-center justify-center group overflow-hidden relative"
          >
            <span className="group-hover:-translate-y-full transition-transform duration-300">
              Add to Cart
            </span>
            <span className="absolute flex items-center justify-center w-full h-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <ShoppingCart size={20} className="mr-2" />
              Add
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ComboCard;
