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
      className="relative overflow-hidden rounded-xl shadow-lg w-full max-w-sm h-[400px] group m-4 flex flex-col mx-auto"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* Fondo con imagen */}
      <div className="relative w-full h-full">
        <Image
          src={pizza.image}
          alt={pizza.name}
          fill
          className="object-cover"
          unoptimized
        />

        {/* Degradado en el centro */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

        {/* Indicador de selección */}
        {isSelected && (
          <div className="absolute top-2 left-2 flex items-center justify-center p-2">
            <motion.div
              className="bg-green-600 text-white px-3 py-1 text-xs font-bold rounded-md"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.7, 1, 0.7, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span>Seleccionado</span>
            </motion.div>
          </div>
        )}

        {/* Contenido (posición absoluta para estar dentro del fondo) */}
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

          {/* Sección del selector */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-2">
            {isSelected ? (
              <div className="flex items-center">
                <Button
                  onClick={() => removeFromCart(pizza.id)}
                  className="p-2 bg-gradient-to-t from-black via-black/50 to-transparent text-white rounded-l-md"
                >
                  <Minus size={20} />
                </Button>
                <span className="px-4 py-2 bg-black bg-opacity-50 text-white">{quantity}</span>
                <Button
                  onClick={() => addToCart(pizza.id)}
                  className="p-2 bg-gradient-to-t from-black via-black/50 to-transparent text-white rounded-r-md"
                >
                  <Plus size={20} />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => addToCart(pizza.id)}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-all duration-300"
              >
                <span>Agregar pedido</span>
                <ShoppingCart size={20} className="ml-2" />
              </Button>
            )}
            {isSelected && (
              <Button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    removeFromCart(pizza.id);
                  }
                }}
                className="p-2 bg-gradient-to-t from-black via-black/50 to-transparent text-white rounded-md ml-2"
              >
                <Trash size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SmallPizzaCard;
