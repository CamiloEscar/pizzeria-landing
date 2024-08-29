"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Pizza } from "../interfaces/pizza";
import { PizzaCard } from "@/components/PizzaCard";
import CartDialog from "@/components/CartDialog";
import OrderDialog from "@/components/OrderDialog";
import { AnimatePresence } from "framer-motion";
import api from "@/interfaces/api";
import ArmarPedido from "@/components/ArmarPedido";
import Footer from "@/components/Footer";
import {HeroSection} from "@/components/HeroSection";
import Header from "@/components/Header";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [orderData, setOrderData] = useState({
    name: "",
    address: "",
    phone: "",
    specialInstructions: "",
    rating: 0,
    desiredTime: "",
  });

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setIsLoading(true);
        const fetchedPizzas = await api.pizza.list();
        setPizzas(fetchedPizzas);
      } catch (error) {
        console.error("Error al obtener las pizzas:", error);
        setError(
          "No se pudieron cargar las pizzas. Por favor, intente de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const addToCart = (pizza: Pizza) => {
    setCart((prevCart) => ({
      ...prevCart,
      [pizza.id]: (prevCart[pizza.id] || 0) + 1,
    }));
  };

  const removeFromCart = (pizzaId: number) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[pizzaId] > 1) {
        newCart[pizzaId]--;
      } else {
        delete newCart[pizzaId];
      }
      return newCart;
    });
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleWhatsAppClick = async (): Promise<{ success: boolean }> => {
    const cartItems = Object.entries(cart)
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
    }\nHora deseada: ${orderData.desiredTime}`;

    // Enviar a WhatsApp
    const whatsappUrl = `https://wa.me/3442475466?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    // Enviar a Google Sheets (consider moving this to a server-side function)
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
    formData.append("entry.849798555", getTotalPrice()); // Changed this line

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
      console.log("Datos enviados a Google Sheets");
    } catch (error) {
      console.error("Error al enviar datos a Google Sheets:", error);
    }

    // Cerrar el modal y limpiar el carrito
    setIsModalOpen(false);
    setCart({});
    return { success: true };
  };

  const handleOrderDialogOpen = () => {
    setIsModalOpen(true);
    setIsCartOpen(false);
  };

  const handleOrderConfirm = async () => {
    setIsModalOpen(false);
    setCart({});
  };

  const clearCart = () => {
    setCart({});
  };

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
                <div key={pizza.id} className="flex justify-center items-center">
                  <PizzaCard pizza={pizza} addToCart={addToCart} />
                </div>
              ))}
            </div>
          </div>
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
        {isModalOpen && (
          <OrderDialog
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
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
