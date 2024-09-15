import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pizza } from "../../interfaces/pizza";
import { motion } from "framer-motion";

interface CartItem extends Pizza {
  quantity: number;
  isHalf: boolean;
}

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
  cart: CartItem[];
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

  const getTotalPrice = () => {
    return cart
      .reduce((sum, item) => {
        const price = item.isHalf ? item.halfPrice || item.price / 2 : item.price;
        return sum + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleConfirmOrder = async () => {
    if (!orderData.name || !orderData.phone || (deliveryOption === "Enviar" && !orderData.address)) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    setIsLoading(true);
  
    if (handleOrderConfirm) {
      await handleOrderConfirm();
    }
    
    setIsLoading(false);
  };

  const OrderSummary = () => (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <h3 className="text-lg font-bold mb-2">Resumen del pedido</h3>
      <div className="max-h-40 overflow-y-auto mb-2">
        {cart.map((item, index) => (
          <div key={`${item.id}-${item.isHalf}-${index}`} className="flex justify-between items-center mb-2">
            <span className="flex items-center">
              <span className="font-medium">{item.quantity}x</span>
              <span className="ml-2">{item.name}</span>
              {item.isHalf && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Media
                </span>
              )}
            </span>
            <span>${((item.isHalf ? (item.halfPrice || item.price / 2) : item.price) * item.quantity).toFixed(2)}</span>
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
            aria-label="Nombre"
          />
          
          <Input
            placeholder="Teléfono"
            name="phone"
            value={orderData.phone}
            onChange={handleInputChange}
            aria-label="Teléfono"
          />
          
          {deliveryOption === "Enviar" && (
            <Input
              placeholder="Dirección"
              name="address"
              value={orderData.address}
              onChange={handleInputChange}
              aria-label="Dirección"
            />
          )}
          
          <Textarea
            placeholder="Instrucciones especiales"
            name="specialInstructions"
            value={orderData.specialInstructions}
            onChange={handleInputChange}
            aria-label="Instrucciones especiales"
          />
          
          <Input
            type="time"
            name="desiredTime"
            value={orderData.desiredTime}
            onChange={handleInputChange}
            placeholder="Hora deseada"
            aria-label="Hora deseada"
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