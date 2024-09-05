import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combo } from "../interfaces/Combo";
import { Pizza } from "../interfaces/pizza";
import { motion, AnimatePresence } from "framer-motion";

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
    rating: number;
    desiredTime: string;
  };
  combo?: Combo | null;
  pizzas?: Pizza[];
  clearCart: () => void;
  handleOrderConfirm: () => Promise<void>;
}

const OrderDialog: React.FC<OrderDialogProps> = ({
  open,
  onOpenChange,
  handleInputChange,
  handleWhatsAppClick,
  orderData,
  combo,
  pizzas,
  clearCart,
  handleOrderConfirm,
}) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getTotalPrice = () => combo ? combo.specialPrice.toFixed(2) : pizzas?.reduce((total, pizza) => total + pizza.price, 0).toFixed(2) || "0.00";

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      if (handleOrderConfirm) {
        await handleOrderConfirm();
      }
      setCurrentStage(3);
    } catch (error) {
      alert("Hubo un problema al confirmar el pedido. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await handleWhatsAppClick();
      if (result.success) {
        setCurrentStage(4);
        clearCart();
      } else {
        alert("Hubo un problema al enviar el mensaje de WhatsApp. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      alert("Hubo un problema al enviar el mensaje de WhatsApp. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const OrderSummary = () => (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <h3 className="text-lg font-bold mb-2">Resumen de la orden</h3>
      <div className="flex justify-between items-center mb-2">
        <span>{combo ? combo.comboName : pizzas?.map(pizza => pizza.name).join(', ')}</span>
        <span>${getTotalPrice()}</span>
      </div>
      <div className="border-t border-gray-300 mt-2 pt-2 font-bold flex justify-between">
        <span>Total:</span>
        <span>${getTotalPrice()}</span>
      </div>
    </div>
  );

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DialogHeader>
              <DialogTitle id="dialog-title" className="text-2xl font-bold text-red-800">
                Detalles del pedido
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  value={orderData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  className="col-span-3"
                  value={orderData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  className="col-span-3"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialInstructions" className="text-right">Instrucciones especiales</Label>
                <Textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  className="col-span-3"
                  value={orderData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Ej: Sin cebolla, pizza bien cocida, etc."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desiredTime" className="text-right">Hora deseada</Label>
                <Input
                  id="desiredTime"
                  name="desiredTime"
                  type="time"
                  className="col-span-3"
                  value={orderData.desiredTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <OrderSummary />
            <DialogFooter>
              <Button
                onClick={() => setCurrentStage(2)}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
              >
                Revisar pedido
              </Button>
            </DialogFooter>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DialogHeader>
              <DialogTitle id="dialog-title" className="text-2xl font-bold text-red-800">
                Resumen del pedido
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <h2 className="text-lg font-bold">Detalles del pedido</h2>
              <p><strong>Nombre:</strong> {orderData.name}</p>
              <p><strong>Dirección:</strong> {orderData.address}</p>
              <p><strong>Teléfono:</strong> {orderData.phone}</p>
              <p><strong>Instrucciones especiales:</strong> {orderData.specialInstructions || 'Ninguna'}</p>
              <p><strong>Hora deseada:</strong> {orderData.desiredTime || 'No especificada'}</p>
            </div>
            <OrderSummary />
            <DialogFooter>
              <Button
                onClick={handleConfirmOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : 'Confirmar pedido'}
              </Button>
              <Button
                onClick={() => setCurrentStage(1)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 mt-2"
              >
                Volver
              </Button>
            </DialogFooter>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DialogHeader>
              <DialogTitle id="dialog-title" className="text-2xl font-bold text-green-600">
                ¡Pedido confirmado!
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Tu pedido ha sido realizado exitosamente.</p>
              <OrderSummary />
              <p className="mt-4">¿Deseas recibir los detalles por WhatsApp?</p>
            </div>
            <DialogFooter>
              <Button
                onClick={handleWhatsAppConfirm}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar por WhatsApp'}
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 mt-2"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DialogHeader>
              <DialogTitle id="dialog-title" className="text-2xl font-bold text-green-600">
                ¡Listo!
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Los detalles de tu pedido han sido enviados por WhatsApp.</p>
              <OrderSummary />
              <p className="mt-4">Gracias por tu compra. ¡Buen provecho!</p>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  setCurrentStage(1);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
              >
                Finalizar
              </Button>
            </DialogFooter>
          </motion.div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-labelledby="dialog-title" className="sm:max-w-[500px]">
        <AnimatePresence mode="wait">
          {renderStage()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
