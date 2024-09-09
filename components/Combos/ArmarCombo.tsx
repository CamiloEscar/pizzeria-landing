import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  envioRetirar: () => void;
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
    envioRetirar: "",
    specialInstructions: "",
    desiredTime: "",
    deliveryMethod: "Enviar", // Nueva opción para seleccionar
  });
  const [errors, setErrors] = useState({
    name: false,
    address: false,
    phone: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const validateForm = () => {
    const newErrors = {
      name: !orderData.name,
      address: orderData.deliveryMethod === "Enviar" && !orderData.address, // Solo validar dirección si es "Enviar"
      phone: !orderData.phone,
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.address && !newErrors.phone;
  };

  const handleWhatsAppClick = async () => {
    const comboPizzas = combo.pizzaIds
      .map((id) => allPizzas.find((pizza) => pizza.id === id))
      .filter((pizza): pizza is Pizza => pizza !== undefined);

    const pizzaNames = comboPizzas.map((pizza) => pizza.name).join(", ");
    const message = `Hola, me gustaría ordenar el combo ${combo.comboName}:
    \nPizzas: ${pizzaNames}
    \nPrecio: $${combo.specialPrice}
    \nNombre: ${orderData.name}
    \n${
      orderData.deliveryMethod === "Enviar"
        ? `Dirección: ${orderData.address}\n`
        : ""
    }
    \nTeléfono: ${orderData.phone}
    \nHora deseada: ${orderData.desiredTime}
    \nInstrucciones especiales: ${orderData.specialInstructions}
    \nMétodo de entrega: ${orderData.deliveryMethod}`;

    const whatsappUrl = `https://wa.me/3442475466?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSdFQ42trIlOffF9smenq5oiCfOCLdjc42Q7bAurih4wWl_fhw/formResponse";
    const formData = new FormData();
    formData.append("entry.2020561029", orderData.name);
    formData.append("entry.1741915942", orderData.address);
    formData.append("entry.1517497244", orderData.phone);
    formData.append("entry.1807112285", orderData.deliveryMethod);
    formData.append("entry.1563818822", orderData.specialInstructions);
    formData.append("entry.195003812", orderData.desiredTime);
    formData.append("entry.1789182107", combo.comboName);
    // formData.append("entry.849798555", combo.specialPrice());

    console.log("Form Data Entries:");
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response = await fetch(formUrl, { method: "POST", body: formData });
      if (response.ok) {
        console.log("Datos enviados a Google Sheets");
      } else {
        console.error(
          "Error al enviar datos a Google Sheets:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al enviar datos a Google Sheets:", error);
    }

    return { success: true };
  };

  const handleOrderConfirm = async () => {
    if (validateForm()) {
      const result = await handleWhatsAppClick();
      if (result.success) {
        clearCart();
        onOrderConfirm();
        onOpenChange(false);
      }
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
              className={`col-span-3 ${errors.name ? "border-red-500" : ""}`}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deliveryMethod" className="text-right">
              Método de entrega
            </Label>
            <select
              id="deliveryMethod"
              name="deliveryMethod"
              value={orderData.deliveryMethod}
              onChange={handleInputChange}
              className="col-span-3 border p-2 rounded"
            >
              <option value="Enviar">Enviar</option>
              <option value="Retirar">Retirar</option>
            </select>
          </div>
          {orderData.deliveryMethod === "Enviar" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Dirección
              </Label>
              <Input
                id="address"
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
                className={`col-span-3 ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Teléfono
            </Label>
            <Input
              id="phone"
              name="phone"
              value={orderData.phone}
              onChange={handleInputChange}
              className={`col-span-3 ${errors.phone ? "border-red-500" : ""}`}
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
        <Button
          onClick={handleOrderConfirm}
          className="mt-4 w-full bg-green-600 hover:bg-green-700"
        >
          Confirmar Orden
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ArmarCombo;
