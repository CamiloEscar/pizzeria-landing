import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pizza } from "../../interfaces/pizza";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: { [key: number]: number };
  pizzas: Pizza[];
  addToCart: (pizza: Pizza) => void;
  removeFromCart: (pizzaId: number) => void;
  getTotalPrice: () => string;
  handleOrderDialogOpen: () => void;
}

const CartDialog: React.FC<CartDialogProps> = ({
  open,
  onOpenChange,
  cart,
  pizzas,
  addToCart,
  removeFromCart,
  getTotalPrice,
  handleOrderDialogOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="dialog-description" className="sm:max-w-[500px]">
      <p id="dialog-description">Este es el contenido de</p>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-800">
            Tu carrito
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(cart).map(([pizzaId, quantity]) => {
            const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
            if (!pizza) return null; // No muestra nada si la pizza no se encuentra

            return (
              <div
                key={pizzaId}
                className="flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <Image
                    src={pizza.image}
                    alt={pizza.name}
                    width={480}
                    height={480}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                    unoptimized
                  />
                  <div>
                    <h3 className="font-semibold">{pizza.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${pizza.price.toFixed(2)} c/u
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(parseInt(pizzaId))}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="mx-2 font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToCart(pizza)}
                  >
                    <Plus size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-red-600"
                    onClick={() => {
                      // Elimina todas las unidades de la pizza del carrito
                      for (let i = 0; i < quantity; i++) {
                        removeFromCart(parseInt(pizzaId));
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-xl font-bold text-red-800">
          Total: ${getTotalPrice()}
        </div>
        <DialogFooter className="mt-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={handleOrderDialogOpen}
          >
            Realizar pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;
