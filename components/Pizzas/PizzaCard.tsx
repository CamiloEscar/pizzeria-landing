import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ShoppingCart, PizzaIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PizzaModal from "./PizzaModal";
import { Pizza } from "../../interfaces/pizza";

interface PizzaCardProps {
  pizza: Pizza;
  addToCart: (pizza: Pizza, isHalf: boolean) => void;
  pizzas: Pizza[];
}

const formatPrice = (price: number): string => {
  return price.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function PizzaCard({
  pizza,
  addToCart,
  pizzas,
}: PizzaCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentPizza, setCurrentPizza] = useState(pizza);
  const [isHalfPizza, setIsHalfPizza] = useState(false);
  const addToCartRef = useRef<(pizza: Pizza, isHalf: boolean) => void>(addToCart);

  // Update the ref when addToCart changes
  React.useEffect(() => {
    addToCartRef.current = addToCart;
  }, [addToCart]);

  const handleNavigatePizza = useCallback((direction: "prev" | "next") => {
    const currentIndex = pizzas.findIndex((p) => p.id === currentPizza.id);
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % pizzas.length
        : (currentIndex - 1 + pizzas.length) % pizzas.length;
    setCurrentPizza(pizzas[newIndex]);
  }, [pizzas, currentPizza]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("PizzaCard handleAddToCart:", currentPizza, isHalfPizza);
    addToCartRef.current(currentPizza, isHalfPizza);
  }, [currentPizza, isHalfPizza]);

  const handlePizzaTypeChange = useCallback((isHalf: boolean) => {
    setIsHalfPizza(isHalf);
  }, []);
  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-xl shadow-lg w-full max-w-sm h-[400px] group flex flex-col mx-auto my-4"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <Image
            src={pizza.image}
            alt={pizza.name}
            fill
            className="object-cover"
            unoptimized
          />
          {pizza.promotion && (
            <div className="absolute top-0 left-0 flex items-center justify-center p-4">
              <motion.div
                className="bg-red-600 text-yellow-300 px-4 py-2 text-xs font-bold rounded-lg relative"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.7, 1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="block whitespace-nowrap">
                  {pizza.promotion}
                </span>
              </motion.div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
          <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-transparent to-transparent">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-white mb-1">
                {pizza.name}
              </h3>
              <p className="text-sm text-gray-200 line-clamp-2">
                {pizza.description}
              </p>
              <div className="flex justify-between items-center mt-2 mb-1">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">
                    ${formatPrice(isHalfPizza ? pizza.halfPrice : pizza.price)}
                  </span>
                  <div className="flex items-center">
                    <PizzaIcon size={16} className="text-yellow-400 mr-1" />
                    <span className="text-sm text-yellow-400 font-semibold">
                      Media: ${formatPrice(pizza.halfPrice)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center bg-yellow-400 px-2 py-1 rounded-full">
                  <Star className="text-white fill-current" size={14} />
                  <span className="ml-1 text-white font-semibold text-xs">
                    {pizza.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePizzaTypeChange(false);
                }}
                className={`flex-1 py-2 px-4 ${
                  !isHalfPizza
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white rounded-full text-sm transition-all duration-300`}
              >
                Pizza Completa
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePizzaTypeChange(true);
                }}
                className={`flex-1 py-2 px-4 ${
                  isHalfPizza
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white rounded-full text-sm transition-all duration-300`}
              >
                Media Pizza
              </Button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full mt-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition-all duration-300 flex items-center justify-center"
            >
              <span>Agregar al carrito</span>
              <ShoppingCart size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <PizzaModal
          pizza={currentPizza}
          onClose={() => setShowModal(false)}
          addToCart={(pizza) => addToCartRef.current(pizza, isHalfPizza)}
          onNext={() => handleNavigatePizza("next")}
          onPrevious={() => handleNavigatePizza("prev")}
          isHalf={isHalfPizza}
        />
      )}
    </>
  );
}