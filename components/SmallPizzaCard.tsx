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
      className={`bg-gray-100 rounded-lg shadow-lg overflow-hidden transition-all ${
        isSelected ? "border-2 border-green-500" : "border border-gray-200"
      } hover:shadow-xl flex flex-col h-full text-sm w-full max-w-[400px] md:max-w-[350px]`} // Aumenta el ancho máximo y adapta para pantallas más pequeñas
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-56 md:h-48"> {/* Ajusta la altura para el contenedor de la imagen */}
        <Image
          src={pizza.image}
          alt={pizza.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-4 flex flex-col flex-grow bg-gradient-to-t from-transparent to-black/30"> {/* Fondo con degradado */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {pizza.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{pizza.description}</p>
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-red-600">
              ${pizza.price.toFixed(2)}
            </span>
            <div className="ml-2 flex items-center text-yellow-400">
              <Star size={16} />
              <span className="ml-1 text-sm text-gray-700">
                {pizza.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-2">
          {isSelected ? (
            <div className="flex items-center mb-2 md:mb-0">
              <Button
                onClick={() => removeFromCart(pizza.id)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-1 rounded-l-md"
              >
                <Minus size={16} />
              </Button>
              <span className="px-3 py-1 bg-gray-200">{quantity}</span>
              <Button
                onClick={() => addToCart(pizza.id)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-1 rounded-r-md"
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded-md ml-2"
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
