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

interface CartItem extends Pizza {
  quantity: number;
  isHalf: boolean;
}

type CartType = CartItem[];

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartType;
  pizzas: Pizza[];
  addToCart: (pizza: Pizza, isHalf: boolean) => void;
  removeFromCart: (pizzaId: number, isHalf: boolean) => void;
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
  const renderCartItems = () => {
    return cart.map((item) => renderCartItem(item));
  };

  const handleAddToCart = (item: CartItem) => {
    const pizza = pizzas.find(p => p.id === item.id);
    if (pizza) {
      addToCart(pizza, item.isHalf);
    }
  };

  const renderCartItem = (item: CartItem) => (
    <div
      key={`${item.id}-${item.isHalf ? "half" : "full"}`}
      className="flex flex-col mb-4 bg-gray-100 p-3 rounded-lg"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={item.image}
            alt={item.name}
            width={480}
            height={480}
            className="w-16 h-16 object-cover rounded-md mr-4"
            unoptimized
          />
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">
              ${item.isHalf ? (item.halfPrice || item.price / 2).toFixed(2) : item.price.toFixed(2)}
              {item.isHalf ? " (Media)" : " (Entera)"}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeFromCart(item.id, item.isHalf)}
          >
            <Minus size={16} />
          </Button>
          <span className="mx-2 font-semibold">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddToCart(item)}
          >
            <Plus size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-red-600"
            onClick={() => {
              // Remove all quantities of this item
              for (let i = 0; i < item.quantity; i++) {
                removeFromCart(item.id, item.isHalf);
              }
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-800">
            Tu carrito
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {renderCartItems()}
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