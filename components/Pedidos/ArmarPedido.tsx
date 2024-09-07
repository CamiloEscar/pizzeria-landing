import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pizza } from "@/interfaces/pizza";
import SmallPizzaCard from "@/components/Pedidos/SmallPizzaCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ShoppingCart, Minus, Plus, Trash } from "lucide-react";

interface ArmarPedidoProps {
  pizzas: Pizza[];
  cart: { [key: number]: number };
  addToCart: (pizzaId: number) => void;
  removeFromCart: (pizzaId: number) => void;
  handleConfirmOrder: (
    cart: { [key: number]: number },
    date: string,
    time: string
  ) => Promise<void>;
}

const ArmarPedido: React.FC<ArmarPedidoProps> = ({
  pizzas,
  cart,
  addToCart,
  removeFromCart,
  handleConfirmOrder,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [armarPedidoCart, setArmarPedidoCart] = useState<{ [key: number]: number }>({});
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("3442475466");

  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const whatsappNumberRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleSpecialInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSpecialInstructions(e.target.value);
  };

  const handleWhatsappNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsappNumber(e.target.value);
  };

  const addToArmarPedidoCart = (pizzaId: number) => {
    setArmarPedidoCart(prevCart => ({
      ...prevCart,
      [pizzaId]: (prevCart[pizzaId] || 0) + 1,
    }));
  };

  const removeFromArmarPedidoCart = (pizzaId: number) => {
    setArmarPedidoCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[pizzaId] > 1) {
        newCart[pizzaId]--;
      } else {
        delete newCart[pizzaId];
      }
      return newCart;
    });
  };

  const getTotalPrice = () => {
    return Object.entries(armarPedidoCart)
      .map(([pizzaId, quantity]) => {
        const pizza = pizzas.find(p => p.id === parseInt(pizzaId));
        return pizza ? pizza.price * quantity : 0;
      })
      .reduce((sum, price) => sum + price, 0)
      .toFixed(2);
  };

  const submitFormToGoogleSheets = async () => {
    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdFQ42trIlOffF9smenq5oiCfOCLdjc42Q7bAurih4wWl_fhw/formResponse";

    const cartItems = Object.entries(armarPedidoCart)
      .map(([pizzaId, quantity]) => {
        const pizza = pizzas.find(p => p.id === parseInt(pizzaId));
        return pizza ? `${quantity}x ${pizza.name}` : `${quantity}x (Pizza no encontrada)`;
      })
      .join(", ");

    const formData = new FormData();
    formData.append("entry.2020561029", name);
    formData.append("entry.1741915942", address);
    formData.append("entry.1517497244", phone);
    formData.append("entry.1563818822", specialInstructions);
    formData.append("entry.13111002", selectedDate);
    formData.append("entry.195003812", selectedTime);
    formData.append("entry.1789182107", cartItems);
    formData.append("entry.849798555", getTotalPrice());

    try {
      const response = await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
      console.log("Datos enviados a Google Sheets");
      return { success: true };
    } catch (error) {
      console.error("Error al enviar datos a Google Sheets:", error);
      return { success: false };
    }
  };

  const sendWhatsAppMessage = () => {
    const whatsappMessage = `Hola, me gustaría ordenar:\n${Object.entries(armarPedidoCart)
      .map(([pizzaId, quantity]) => {
        const pizza = pizzas.find(p => p.id === parseInt(pizzaId));
        return pizza ? `${quantity}x ${pizza.name}` : `${quantity}x (Pizza no encontrada)`;
      })
      .join(", ")}\nTotal: $${getTotalPrice()}\nNombre: ${name}\nDirección: ${address}\nTeléfono: ${phone}\nHora deseada: ${selectedTime}\nInstrucciones especiales: ${specialInstructions}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleConfirmOrderClick = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await submitFormToGoogleSheets();
      if (result.success) {
        sendWhatsAppMessage();
        await handleConfirmOrder(armarPedidoCart, selectedDate, selectedTime);
        setArmarPedidoCart({});
        console.log("Pedido confirmado y WhatsApp enviado");
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al procesar el pedido. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!name || !address || !phone || !selectedDate || !selectedTime) {
      for (const ref of [nameRef, addressRef, phoneRef, dateRef, timeRef]) {
        if (ref.current && !ref.current.value) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
          return false;
        }
      }
    }
    return true;
  };

  return (
    <Card className="p-4 md:p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          Armar tu Pedido para Otro Día
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Formulario */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold mb-2">Detalles del Pedido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nombre:</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  ref={nameRef}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Dirección:</Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  ref={addressRef}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Teléfono:</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  ref={phoneRef}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialInstructions" className="text-sm font-medium">Descripción:</Label>
                <Textarea
                  id="specialInstructions"
                  value={specialInstructions}
                  onChange={handleSpecialInstructionsChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">Fecha de entrega:</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  ref={dateRef}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">Hora deseada:</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  ref={timeRef}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-semibold">Total: ${getTotalPrice()}</span>
              <Button onClick={handleConfirmOrderClick} disabled={loading}>
                {loading ? "Procesando..." : "Confirmar Pedido"}
              </Button>
            </div>
          </div>

          {/* Tarjetas de pizza en cuadrícula */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {pizzas.map(pizza => (
              <SmallPizzaCard
                key={pizza.id}
                pizza={pizza}
                addToCart={() => addToArmarPedidoCart(pizza.id)}
                removeFromCart={() => removeFromArmarPedidoCart(pizza.id)}
                quantity={armarPedidoCart[pizza.id] || 0}
                isSelected={armarPedidoCart[pizza.id] > 0}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArmarPedido;
