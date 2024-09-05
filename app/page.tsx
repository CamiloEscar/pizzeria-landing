"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Pizza } from "../interfaces/pizza";
import { Combo } from "@/interfaces/Combo";
import api from "@/interfaces/api";
import { AnimatePresence } from "framer-motion";

// Components
import Header from "@/components/Main/Header";
import { HeroSection } from "@/components/Main/HeroSection";
import Footer from "@/components/Main/Footer";

import CartDialog from "@/components/Pizzas/CartDialog";
import OrderDialog from "@/components/Pizzas/OrderDialog";
import ArmarPedido from "@/components/Pedidos/ArmarPedido";
import CombosSection from "@/components/Main/ComboSection";
import { PizzaCard } from "@/components/Pizzas/PizzaCard";

// Types
interface OrderData {
  name: string;
  address: string;
  phone: string;
  specialInstructions: string;
  rating: number;
  desiredTime: string;
}

export default function Home() {
  // State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [orderData, setOrderData] = useState<OrderData>({
    name: "",
    address: "",
    phone: "",
    specialInstructions: "",
    rating: 0,
    desiredTime: "",
  });
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedPizzas, fetchedCombos] = await Promise.all([
          api.pizza.list(),
          api.pizza.combos(),
        ]);
        setPizzas(fetchedPizzas);
        setCombos(fetchedCombos);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError(
          "No se pudieron cargar los datos. Por favor, intente de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cart functions
  const addToCart = useCallback((pizza: Pizza) => {
    setCart((prevCart) => ({
      ...prevCart,
      [pizza.id]: (prevCart[pizza.id] || 0) + 1,
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

  const clearCart = useCallback(() => {
    setCart({});
  }, []);


  // Cart calculations
  const getTotalItems = useCallback(() => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  }, [cart]);

  const getTotalPrice = useCallback(() => {
    return Object.entries(cart)
      .reduce((sum, [pizzaId, quantity]) => {
        const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
        return pizza ? sum + pizza.price * quantity : sum;
      }, 0)
      .toFixed(2);
  }, [cart, pizzas]);

  // Form handling
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleWhatsAppClick = useCallback(async (): Promise<{
    success: boolean;
  }> => {
    // Construcción del mensaje
    let cartItems = "";
    let total = 0;

    if (selectedCombo) {
      cartItems = `1x ${selectedCombo.comboName}`;
      total = selectedCombo.specialPrice;
    } else {
      cartItems = Object.entries(cart)
        .map(([pizzaId, quantity]) => {
          const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
          return pizza
            ? `${quantity}x ${pizza.name}`
            : `${quantity}x (Pizza no encontrada)`;
        })
        .join(", ");
      total = parseFloat(getTotalPrice());
    }

    const message = `Hola, me gustaría ordenar:\n${cartItems}\nTotal: $${getTotalPrice()}\nNombre: ${
      orderData.name
    }\nDirección: ${orderData.address}\nTeléfono: ${
      orderData.phone
    }\nHora deseada: ${orderData.desiredTime}`;

    // Envío a WhatsApp
    const whatsappUrl = `https://wa.me/3442475466?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    // Envío a Google Sheets
    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSdFQ42trIlOffF9smenq5oiCfOCLdjc42Q7bAurih4wWl_fhw/formResponse";
    const formData = new FormData();
    formData.append("entry.2020561029", orderData.name);
    formData.append("entry.1741915942", orderData.address);
    formData.append("entry.1517497244", orderData.phone);
    formData.append("entry.1563818822", orderData.specialInstructions);
    formData.append("entry.1020783902", orderData.rating.toString());
    formData.append("entry.195003812", orderData.desiredTime);
    formData.append("entry.1789182107", cartItems);
    formData.append("entry.849798555", getTotalPrice());

    try {
      await fetch(formUrl, { method: "POST", mode: "no-cors", body: formData });
      console.log("Datos enviados a Google Sheets");
    } catch (error) {
      console.error("Error al enviar datos a Google Sheets:", error);
    }

    setIsOrderDialogOpen(false);
    setCart({});
    return { success: true };
  }, [cart, pizzas, orderData, getTotalPrice, selectedCombo]);

  const handleOrderDialogOpen = useCallback(() => {
    setIsOrderDialogOpen(true);
    setIsCartOpen(false);
  }, []);

  const handleOrderConfirm = async () => {
    const result = await handleWhatsAppClick();
    if (result.success) {
      clearCart();
      setIsOrderDialogOpen(false);
    }
  };

  // UI helpers
  const scrollToSection = useCallback((section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (isLoading) return <div>Cargando...</div>;
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
        <section id="inicio">
          <HeroSection />
        </section>
        <section id="productos" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
              Menú de Pizzas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 justify-items-center">
              {pizzas.map((pizza) => (
                <div
                  key={pizza.id}
                  className="flex justify-center items-center"
                >
                  <PizzaCard pizza={pizza} addToCart={addToCart} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="combos">
        <CombosSection combos={combos} clearCart={clearCart} />
        </section>
        <section id="armar-pedido">
          <ArmarPedido
            pizzas={pizzas}
            cart={cart}
            addToCart={(pizzaId: number) =>
              addToCart(pizzas.find((p) => p.id === pizzaId)!)
            }
            removeFromCart={removeFromCart}
            handleConfirmOrder={handleOrderConfirm}
          />
        </section>
        <Footer />
      </main>
      <AnimatePresence>
        {isCartOpen && (
          <CartDialog
            open={isCartOpen}
            onOpenChange={setIsCartOpen}
            cart={cart}
            pizzas={pizzas}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            getTotalPrice={getTotalPrice}
            handleOrderDialogOpen={handleOrderDialogOpen}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOrderDialogOpen && (
          <OrderDialog
            open={isOrderDialogOpen}
            onOpenChange={setIsOrderDialogOpen}
            handleInputChange={handleInputChange}
            handleWhatsAppClick={handleWhatsAppClick}
            orderData={orderData}
            cart={cart}
            pizzas={pizzas}
            clearCart={clearCart}
            handleOrderConfirm={handleOrderConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
