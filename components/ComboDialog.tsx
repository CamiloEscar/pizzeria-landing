import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import OrderComboDialog from "./OrderComboDialog";

import { Combo } from "@/interfaces/Combo";
import { Pizza } from "@/interfaces/pizza";

interface ComboDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  combo: Combo;
  allPizzas: Pizza[]; // Nueva prop para recibir todas las pizzas
  orderData: {
    name: string;
    address: string;
    phone: string;
    specialInstructions: string;
    rating: number;
    desiredTime: string;
  };
  handleWhatsAppClick: () => Promise<{ success: boolean }>;
  handleOrderConfirm: () => Promise<void>;
  clearCart: () => void;
}

const ComboDialog: React.FC<ComboDialogProps> = ({
  open,
  onOpenChange,
  combo,
  allPizzas,
  orderData,
  handleWhatsAppClick,
  handleOrderConfirm,
  clearCart
}) => {
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const handlePurchase = () => {
    setIsOrderDialogOpen(true);
    onOpenChange(false);
  };

  const handleOrderDialogClose = () => {
    setIsOrderDialogOpen(false);
  };

  const { comboName, specialPrice, pizzaIds } = combo;
  
  // Filtrar las pizzas del combo basándose en los pizzaIds
  const comboPizzas: Pizza[] = allPizzas.filter(pizza => pizzaIds.includes(pizza.id));

  // Calcula el precio original de las pizzas
  const originalPrice = comboPizzas.reduce((total, pizza) => total + pizza.price, 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-800">
              {comboName}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {comboPizzas.map((pizza) => (
              <div
                key={pizza.id}
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
              </div>
            ))}
          </div>
          <div className="mt-4 text-xl font-bold text-red-800">
            Total del combo: ${specialPrice.toFixed(2)}
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={handlePurchase}
            >
              Realizar pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OrderComboDialog
        open={isOrderDialogOpen}
        onOpenChange={handleOrderDialogClose}
        handleInputChange={() => {}}
        handleWhatsAppClick={handleWhatsAppClick}
        orderData={orderData}
        combo={combo}
        clearCart={clearCart}
        handleOrderConfirm={handleOrderConfirm}
      />
    </>
  );
};

export default ComboDialog;