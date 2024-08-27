import { motion } from "framer-motion";
import { Pizza } from "../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { Star, Trash, Plus, Minus } from "lucide-react";
import Image from "next/image";

interface SmallPizzaCardProps {
  pizza: Pizza;
  addToCart: (pizzaId: number) => void;
  removeFromCart: (pizzaId: number) => void;
  quantity: number;
  isSelected: boolean;
}

const SmallPizzaCard: React.FC<SmallPizzaCardProps> = ({
  pizza,
  addToCart,
  removeFromCart,
  quantity,
  isSelected,
}) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
        isSelected ? "border-2 border-green-500" : "border border-gray-200"
      } hover:shadow-lg flex flex-col h-full text-sm w-full max-w-[250px]`} // Tamaño fijo
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-full h-40"> {/* Ajusta la altura para el contenedor de la imagen */}
        <Image
          src={pizza.image}
          alt={pizza.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {pizza.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{pizza.description}</p>
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-red-600">
              ${pizza.price.toFixed(2)}
            </span>
            <div className="ml-2 flex items-center text-yellow-400">
              <Star size={14} />
              <span className="ml-1 text-xs text-gray-700">
                {pizza.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          {isSelected ? (
            <div className="flex items-center">
              <Button
                onClick={() => removeFromCart(pizza.id)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-1 rounded-l-md"
              >
                <Minus size={16} />
              </Button>
              <span className="px-3 py-1 bg-gray-100">{quantity}</span>
              <Button
                onClick={() => addToCart(pizza.id)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-1 rounded-r-md"
              >
                <Plus size={16} />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => addToCart(pizza.id)}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-xs transition-colors"
            >
              Añadir
            </Button>
          )}
          {isSelected && (
            <Button
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  removeFromCart(pizza.id);
                }
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1 rounded-md ml-2"
            >
              <Trash size={16} />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SmallPizzaCard;
