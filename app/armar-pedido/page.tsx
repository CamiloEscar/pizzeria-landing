"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Pizza } from "@/interfaces/pizza";
import api from "@/interfaces/api";
import Header from "@/components/Main/Header";
import Footer from "@/components/Main/Footer";
import LoadingState from "@/components/LoadingState";
import ArmarPedido from "@/components/Pedidos/ArmarPedido";

interface OrderData {
  name: string;
  address: string;
  phone: string;
  envioRetirar: "Enviar" | "retira";
  specialInstructions: string;
  rating: number;
  desiredTime: string;
}

export default function ArmarPedidoPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [orderData, setOrderData] = useState<OrderData>({
    name: "",
    address: "",
    phone: "",
    envioRetirar: "Enviar",
    specialInstructions: "",
    rating: 0,
    desiredTime: "",
  });
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedPizzas = await api.pizza.list();
        setPizzas(fetchedPizzas);
      } catch (error) {
        setError(
          "No se pudieron cargar los datos. Por favor, intente de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = useCallback((pizzaId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [pizzaId]: (prevCart[pizzaId] || 0) + 1,
    }));
  }, []);

  const removeFromCart = useCallback((pizzaId: number) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[pizzaId] > 1) {
        newCart[pizzaId]--;
      } else {
        delete newCart[pizzaId];
      }
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const getTotalItems = useCallback(
    () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),
    [cart]
  );

  const getTotalPrice = useCallback(() => {
    return Object.entries(cart)
      .reduce((sum, [pizzaId, quantity]) => {
        const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
        return pizza ? sum + pizza.price * quantity : sum;
      }, 0)
      .toFixed(2);
  }, [cart, pizzas]);

  const handleOrderDataChange = (newOrderData: Partial<OrderData>) => {
    setOrderData((prevState) => ({ ...prevState, ...newOrderData }));
  };

  const handleWhatsAppClick = useCallback(async (): Promise<{
    success: boolean;
  }> => {
    let cartItems = Object.entries(cart)
      .map(([pizzaId, quantity]) => {
        const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
        return pizza
          ? `${quantity}x ${pizza.name}`
          : `${quantity}x (Pizza no encontrada)`;
      })
      .join(", ");

    const message = `Hola, me gustaría ordenar:\n${cartItems}\nTotal: $${getTotalPrice()}\nNombre: ${
      orderData.name
    }\nDirección: ${orderData.address}\nTeléfono: ${
      orderData.phone
    }\nHora deseada: ${orderData.desiredTime}\nPara: ${
      orderData.envioRetirar === "Enviar" ? "Enviar" : "Retirar"
    }`;
    const whatsappUrl = `https://wa.me/3442670573?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSdFQ42trIlOffF9smenq5oiCfOCLdjc42Q7bAurih4wWl_fhw/formResponse";
    const formData = new FormData();
    formData.append("entry.2020561029", orderData.name);
    formData.append("entry.1741915942", orderData.address);
    formData.append("entry.1517497244", orderData.phone);
    formData.append(
      "entry.1807112285",
      orderData.envioRetirar === "Enviar" ? "Enviar" : "Retirar"
    );
    formData.append("entry.1563818822", orderData.specialInstructions);
    formData.append("entry.1020783902", orderData.rating.toString());
    formData.append("entry.195003812", orderData.desiredTime);
    formData.append("entry.1789182107", cartItems);
    formData.append("entry.849798555", getTotalPrice());

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
  }, [cart, pizzas, orderData, getTotalPrice]);

  const handleOrderConfirm = async (
    newCart: { [key: number]: number },
    date: string,
    time: string,
    newOrderDetails: Partial<OrderData>
  ) => {
    setCart(newCart);
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      ...newOrderDetails,
      desiredTime: `${date} ${time}`,
    }));

    const result = await handleWhatsAppClick();
    if (result.success) {
      clearCart();
    }
  };

  const scrollToSection = useCallback((section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }
  if (error) return <div>{error}</div>;

  return (
    <div className="relative min-h-screen scroll-smooth md:scroll-auto">
      <Header
        scrollToSection={scrollToSection}
        getTotalItems={getTotalItems}
        setIsCartOpen={setIsCartOpen}
        isCartOpen={isCartOpen}
      />
      <main className="pt-20">
        <section id="armar-pedido" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <ArmarPedido
              pizzas={pizzas}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
