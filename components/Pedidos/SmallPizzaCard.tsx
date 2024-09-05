import { motion } from "framer-motion";
import { Pizza } from "../../interfaces/pizza";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Minus, Plus, Trash } from "lucide-react";
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
      className="relative overflow-hidden rounded-xl shadow-lg w-full max-w-sm h-[400px] group m-4 flex flex-col"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image */}
      <div className="relative w-full h-3/4">
        <Image
          src={pizza.image}
          alt={pizza.name}
          fill
          className="object-cover"
          unoptimized
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Selection Badge */}
        {isSelected && (
          <div className="absolute top-0 left-0 flex items-center justify-center p-4">
            <motion.div
              className="bg-green-600 text-white px-4 py-2 text-xs font-bold rounded-lg relative"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.7, 1, 0.7, 1] }} // Parpadeo
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="block whitespace-nowrap">Selected</span>
              <div className="absolute top-0 left-0 w-0 h-0 border-l-8 border-r-8 border-t-8 border-green-600 border-t-transparent border-l-transparent border-r-transparent transform rotate-45 translate-x-1/2 translate-y-1/2 z-10" />
              <div className="absolute top-0 left-0 w-0 h-0 border-l-8 border-r-8 border-t-8 border-white border-t-transparent border-l-transparent border-r-transparent transform rotate-45 translate-x-1/2 translate-y-1/2 -z-10" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 bg-black bg-opacity-70 rounded-b-xl">
        <div className="flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
            {pizza.name}
          </h3>
          <p className="text-sm text-gray-200 line-clamp-2 drop-shadow">
            {pizza.description}
          </p>
          <div className="flex justify-between items-center mt-auto mb-4">
            <span className="text-2xl font-bold text-white drop-shadow-md">
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
        
        {/* Selector Section */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-2">
          {isSelected ? (
            <div className="flex items-center">
              <Button
                onClick={() => removeFromCart(pizza.id)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-l-md"
              >
                <Minus size={20} />
              </Button>
              <span className="px-4 py-2 bg-gray-200">{quantity}</span>
              <Button
                onClick={() => addToCart(pizza.id)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-r-md"
              >
                <Plus size={20} />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => addToCart(pizza.id)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full text-sm transition-all duration-300 flex items-center justify-center"
            >
              <span className="group-hover:-translate-y-full transition-transform duration-300">
                Add to Cart
              </span>
              <span className="absolute flex items-center justify-center w-full h-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <ShoppingCart size={20} className="mr-2" />
                Add
              </span>
            </Button>
          )}
          {isSelected && (
            <Button
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  removeFromCart(pizza.id);
                }
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-md ml-2"
            >
              <Trash size={20} />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SmallPizzaCard;
