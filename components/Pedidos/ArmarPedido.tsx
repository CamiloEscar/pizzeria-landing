import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pizza } from "@/interfaces/pizza";
import SmallPizzaCard from "../../components/Pedidos/SmallPizzaCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ArmarPedidoProps {
  pizzas: Pizza[];
  cart: { [key: number]: number };
  addToCart: (pizzaId: number) => void;
  removeFromCart: (pizzaId: number) => void;
}

interface OrderDetails {
  name: string;
  address: string;
  phone: string;
  specialInstructions: string;
  deliveryMethod: "Enviar" | "retira";
  diaReserva: string;
}

const ArmarPedido: React.FC<ArmarPedidoProps> = ({
  pizzas,
  cart,
  addToCart,
  removeFromCart,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [armarPedidoCart, setArmarPedidoCart] = useState<{
    [key: number]: number;
  }>({});
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    name: "",
    address: "",
    phone: "",
    specialInstructions: "",
    deliveryMethod: "Enviar",
    diaReserva: "",
  });
  const [error, setError] = useState<string | null>(null);

  const formRefs = {
    name: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    time: useRef<HTMLInputElement>(null),
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryMethodChange = (value: "Enviar" | "retira") => {
    setOrderDetails((prev) => ({ ...prev, deliveryMethod: value }));
  };

  const addToArmarPedidoCart = (pizzaId: number) => {
    setArmarPedidoCart((prevCart) => ({
      ...prevCart,
      [pizzaId]: (prevCart[pizzaId] || 0) + 1,
    }));
  };

  const removeFromArmarPedidoCart = (pizzaId: number) => {
    setArmarPedidoCart((prevCart) => {
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
      .reduce((sum, [pizzaId, quantity]) => {
        const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
        return sum + (pizza ? pizza.price * quantity : 0);
      }, 0)
      .toFixed(2);
  };

  const validateForm = () => {
    const requiredFields = ["name", "phone"];
    if (orderDetails.deliveryMethod === "Enviar") {
      requiredFields.push("address");
    }

    for (const field of requiredFields) {
      if (
        !orderDetails[field as keyof OrderDetails] &&
        formRefs[field as keyof typeof formRefs]?.current
      ) {
        formRefs[field as keyof typeof formRefs].current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setError(`Por favor completa el campo: ${field}`);
        return false;
      }
    }

    if (!selectedTime) {
      formRefs.time.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setError("Por favor selecciona una hora de entrega");
      return false;
    }

    setError(null);
    return true;
  };

  const handleConfirmOrderClick = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        cart: armarPedidoCart,
        diaReserva: selectedDate,
        time: selectedTime,
        name: orderDetails.name,
        address: orderDetails.address,
        phone: orderDetails.phone,
        specialInstructions: orderDetails.specialInstructions,
        deliveryMethod: orderDetails.deliveryMethod,
        total: getTotalPrice(),
      };

      const cartItems = Object.entries(orderData.cart)
        .map(([pizzaId, quantity]) => {
          const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
          return pizza ? `${pizza.name} x${quantity}` : "";
        })
        .filter((item) => item)
        .join(", ");

      const message =
        `Hola, quisiera realizar el siguiente pedido:\nNombre: ${orderData.name} ` +
        `\nTeléfono: ${orderData.phone} ` +
        `\nDirección: ${orderData.address} ` +
        `\nFecha: ${orderData.diaReserva} ` +
        `\nHora: ${orderData.time} ` +
        `\nMétodo de entrega: ${orderData.deliveryMethod} ` +
        `\nInstrucciones especiales: ${orderData.specialInstructions}  ` +
        `\nDetalles del pedido: ${cartItems} ` +
        `\nTotal: $${orderData.total}`;

      const whatsappUrl = `https://wa.me/3442670573?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");

      // Enviar datos a Google Sheets
      const formUrl =
        "https://docs.google.com/forms/d/e/1FAIpQLSdFQ42trIlOffF9smenq5oiCfOCLdjc42Q7bAurih4wWl_fhw/formResponse";
      const formData = new FormData();
      formData.append("entry.2020561029", orderData.name);
      formData.append("entry.1741915942", orderData.address);
      formData.append("entry.1517497244", orderData.phone);
      formData.append("entry.1807112285", orderData.deliveryMethod);
      formData.append("entry.1563818822", orderData.specialInstructions);
      formData.append("entry.13111002", orderData.diaReserva);
      formData.append("entry.195003812", orderData.time);
      formData.append("entry.1789182107", cartItems);
      formData.append("entry.849798555", orderData.total);

      await fetch(formUrl, {
        method: "POST",
        body: formData,
      });

      setArmarPedidoCart({});
      alert("Pedido enviado a WhatsApp exitosamente");
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un problema al enviar el pedido. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          Arma tu pedido para el dia que quieras!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 text-center">
            <p>Estamos trabajando. Por favor, espera...</p>
          </div> */}
          {/* Formulario */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Detalles del Pedido
            </h3>
            {error && (
              <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nombre:
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={orderDetails.name}
                  onChange={handleInputChange}
                  ref={formRefs.name}
                  className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Teléfono:
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={orderDetails.phone}
                  onChange={handleInputChange}
                  ref={formRefs.phone}
                  className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium">
                  Método de entrega:
                </Label>
                <RadioGroup
                  defaultValue="Enviar"
                  onValueChange={handleDeliveryMethodChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Enviar" id="Enviar" />
                    <Label htmlFor="Enviar">Entrega a domicilio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="retira" id="retira" />
                    <Label htmlFor="retira">Retirar en local</Label>
                  </div>
                </RadioGroup>
              </div>
              {orderDetails.deliveryMethod === "Enviar" && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Dirección:
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={orderDetails.address}
                    onChange={handleInputChange}
                    ref={formRefs.address}
                    className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Fecha de entrega:
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={today}
                  className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  Hora deseada:
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  ref={formRefs.time}
                  className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="specialInstructions"
                  className="text-sm font-medium"
                >
                  Instrucciones especiales:
                </Label>
                <Textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={orderDetails.specialInstructions}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-semibold text-gray-800">
                Total: ${getTotalPrice()}
              </span>
              <Button
                onClick={handleConfirmOrderClick}
                disabled={loading}
                className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2 transition"
              >
                {loading ? "Procesando..." : "Confirmar Pedido"}
              </Button>
            </div>
          </div>

          {/* Tarjetas de pizza en cuadrícula */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-6">
            {pizzas.map((pizza) => (
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
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-semibold text-gray-800">
              Total: ${getTotalPrice()}
            </span>
            <Button
              onClick={handleConfirmOrderClick}
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2 transition"
            >
              {loading ? "Procesando..." : "Confirmar Pedido"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArmarPedido;
