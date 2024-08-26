"use client";

import { useState, useEffect } from "react";
import { Pizza } from "../interfaces/pizza";
import { PizzaCard } from "@/components/PizzaCard";
import CartDialog from "@/components/CartDialog";
import OrderDialog from "@/components/OrderDialog";
import { ShoppingCart, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/interfaces/api";
import Image from "next/image";
import QuienesSomos from "@/components/QuienesSomos";
import ArmarPedido from "@/components/ArmaTuPedido";
import Footer from "@/components/Footer";
import Contacto from "@/components/Contacto";

// Componente para la sección de héroe
const HeroSection = () => (
  <section
    id="#inicio"
    className="relative h-screen flex items-center justify-center text-white"
  >
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="z-10 text-center">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        Pizzería Deliciosa
      </h1>
      <p className="text-xl md:text-2xl mb-8">
        Las mejores pizzas artesanales de la ciudad
      </p>
      <a
        href="#productos"
        className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition duration-300"
      >
        Ver Menú
      </a>
    </div>
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/La-de-Rucula.jpeg')" }}
    ></div>
  </section>
);

// Componente principal
export default function Home() {
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const fetchedPizzas = await api.pizza.list();
        setPizzas(fetchedPizzas);
      } catch (error) {
        console.error("Error al obtener las pizzas:", error);
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

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart)
      .reduce((sum, [pizzaId, quantity]) => {
        const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
        return pizza ? sum + pizza.price * quantity : sum;
      }, 0)
      .toFixed(2);
  };

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

    // Enviar a Google Sheets
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
    await handleWhatsAppClick();
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

  return (
    <div className="relative min-h-screen scroll-smooth md:scroll-auto">
      <header className="bg-white shadow-md py-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-red-600">LOGO</div>
          <nav className="hidden md:flex space-x-6">
            {["inicio", "productos", "quienes-somos", "contacto"].map(
              (section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className="text-gray-800 hover:text-red-600 transition duration-300"
                  onClick={() => scrollToSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              )
            )}
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center">
            <motion.div
              className="bg-red-600 text-white rounded-full p-2 cursor-pointer shadow-lg relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingCart size={24} />
              <span className="absolute top-0 right-0 bg-red-800 text-xs text-white rounded-full px-2 py-1">
                {getTotalItems()}
              </span>
            </motion.div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white shadow-md py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <nav className="space-y-4">
                {["inicio", "productos", "quienes-somos", "contacto"].map(
                  (section) => (
                    <a
                      key={section}
                      href={`#${section}`}
                      className="text-gray-800 hover:text-red-600 transition duration-300 block text-center"
                      onClick={() => {
                        scrollToSection(section);
                        setIsMenuOpen(false);
                      }}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </a>
                  )
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="pt-20">
        <section id="inicio">
          <HeroSection />
        </section>
        <section id="productos" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-red-800 mb-8">
              Menú de Pizzas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pizzas.map((pizza) => (
                <PizzaCard key={pizza.id} pizza={pizza} addToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>
        <ArmarPedido />
        <QuienesSomos />
        <Contacto />
        <Footer />
      </main>
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
    </div>
  );
}
