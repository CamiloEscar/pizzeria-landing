import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pizza } from "../../interfaces/pizza";
import { motion } from "framer-motion";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleWhatsAppClick: () => Promise<{ success: boolean }>;
  orderData: {
    name: string;
    address: string;
    phone: string;
    specialInstructions: string;
    desiredTime: string;
  };
  cart: { [key: number]: { quantity: number; isHalf: boolean } };
  pizzas: Pizza[];
  clearCart: () => void;
  handleOrderConfirm?: () => Promise<void>;
}

const OrderDialog: React.FC<OrderDialogProps> = ({
  open,
  onOpenChange,
  handleInputChange,
  handleWhatsAppClick,
  orderData,
  cart,
  pizzas,
  clearCart,
  handleOrderConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("Enviar");

  const getCartItems = () => {
    return Object.entries(cart).map(([pizzaId, { quantity, isHalf }]) => {
      const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
      return pizza ? { pizza, quantity, isHalf } : null;
    }).filter(Boolean) as { pizza: Pizza; quantity: number; isHalf: boolean }[];
  };

  const getTotalPrice = () => {
    return getCartItems().reduce((sum, { pizza, quantity, isHalf }) => 
      sum + pizza.price * quantity * (isHalf ? 0.5 : 1), 0
    ).toFixed(2);
  };

  const handleConfirmOrder = async () => {
    if (!orderData.name || !orderData.phone || (deliveryOption === "Enviar" && !orderData.address)) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    setIsLoading(true);
    if (handleOrderConfirm) await handleOrderConfirm();
    const result = await handleWhatsAppClick();
    setIsLoading(false);
    if (result.success) {
      clearCart();
      onOpenChange(false);
    } else {
      alert("Hubo un problema al enviar el pedido. Por favor, inténtalo de nuevo.");
    }
  };

  const OrderSummary = () => (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <h3 className="text-lg font-bold mb-2">Resumen de la orden</h3>
      <div className="max-h-40 overflow-y-auto mb-2">
        {getCartItems().map(({ pizza, quantity, isHalf }) => (
          <div key={`${pizza.id}-${isHalf}`} className="flex justify-between items-center mb-2">
            <span className="flex items-center">
              <span className="font-medium">{quantity}x</span>
              <span className="ml-2">{pizza.name}</span>
              {isHalf && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Media
                </span>
              )}
            </span>
            <span>${(quantity * pizza.price * (isHalf ? 0.5 : 1)).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-300 mt-2 pt-2 font-bold flex justify-between">
        <span>Total:</span>
        <span>${getTotalPrice()}</span>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-800">Finalizar pedido</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div className="flex space-x-4">
            <Button
              variant={deliveryOption === "Enviar" ? "default" : "outline"}
              onClick={() => setDeliveryOption("Enviar")}
              className="flex-1"
            >
              Enviar
            </Button>
            <Button
              variant={deliveryOption === "Retirar" ? "default" : "outline"}
              onClick={() => setDeliveryOption("Retirar")}
              className="flex-1"
            >
              Retirar
            </Button>
          </div>
          
          <Input
            placeholder="Nombre"
            name="name"
            value={orderData.name}
            onChange={handleInputChange}
            required
          />
          
          <Input
            placeholder="Teléfono"
            name="phone"
            value={orderData.phone}
            onChange={handleInputChange}
            required
          />
          
          {deliveryOption === "Enviar" && (
            <Input
              placeholder="Dirección"
              name="address"
              value={orderData.address}
              onChange={handleInputChange}
              required
            />
          )}
          
          <Textarea
            placeholder="Instrucciones especiales"
            name="specialInstructions"
            value={orderData.specialInstructions}
            onChange={handleInputChange}
          />
          
          <Input
            type="time"
            name="desiredTime"
            value={orderData.desiredTime}
            onChange={handleInputChange}
            placeholder="Hora deseada"
          />

          <OrderSummary />
        </motion.div>
        <DialogFooter>
          <Button
            onClick={handleConfirmOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Confirmar y enviar por WhatsApp"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;