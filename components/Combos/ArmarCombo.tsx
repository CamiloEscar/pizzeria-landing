import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combo } from "@/interfaces/Combo";
import { Pizza } from "@/interfaces/pizza";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ArmarComboProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  combo: Combo;
  allPizzas: Pizza[];
  onOrderConfirm: () => void;
  clearCart: () => void;
}

const ArmarCombo: React.FC<ArmarComboProps> = ({
  open,
  onOpenChange,
  combo,
  allPizzas,
  onOrderConfirm,
  clearCart,
}) => {
  const [orderData, setOrderData] = useState({
    name: "",
    address: "",
    phone: "",
    specialInstructions: "",
    desiredTime: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleWhatsAppClick = async () => {
    const comboPizzas = combo.pizzaIds
      .map((id) => allPizzas.find((pizza) => pizza.id === id))
      .filter((pizza): pizza is Pizza => pizza !== undefined);

    const pizzaNames = comboPizzas.map((pizza) => pizza.name).join(", ");
    const message = `Hola, me gustaría ordenar el combo ${combo.comboName}:\n
Pizzas: ${pizzaNames}\n
Precio: $${combo.specialPrice}\n
Nombre: ${orderData.name}\n
Dirección: ${orderData.address}\n
Teléfono: ${orderData.phone}\n
Hora deseada: ${orderData.desiredTime}\n
Instrucciones especiales: ${orderData.specialInstructions}`;

    const whatsappUrl = `https://wa.me/3442475466?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    return { success: true };
  };

  const handleOrderConfirm = async () => {
    const result = await handleWhatsAppClick();
    if (result.success) {
      clearCart();
      onOrderConfirm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ordenar Combo: {combo.comboName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              value={orderData.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Dirección
            </Label>
            <Input
              id="address"
              name="address"
              value={orderData.address}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Teléfono
            </Label>
            <Input
              id="phone"
              name="phone"
              value={orderData.phone}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="desiredTime" className="text-right">
              Hora deseada
            </Label>
            <Input
              id="desiredTime"
              name="desiredTime"
              type="time"
              value={orderData.desiredTime}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialInstructions" className="text-right">
              Instrucciones especiales
            </Label>
            <Textarea
              id="specialInstructions"
              name="specialInstructions"
              value={orderData.specialInstructions}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleOrderConfirm}>Confirmar Orden</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ArmarCombo;