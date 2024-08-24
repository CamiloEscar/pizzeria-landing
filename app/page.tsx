"use client";

// https://www.milamarket.ar/productos/

import { useState, useEffect } from "react";
import { Pizza } from "../interfaces/pizza";
import { PizzaCard } from "@/components/PizzaCard";
import CartDialog from "@/components/CartDialog";
import OrderDialog from "@/components/OrderDialog";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const pizzas: Pizza[] = [
  {
    id: 1,
    name: "La de Rúcula",
    description: "Salsa de tomate, queso mozzarella, queso provolone, rúcula fresca, con un toque de aceite de oliva opcional.",
    price: 9.800,
    image: "/images/La-de-Rucula.jpeg",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Roquefort",
    description:"Salsa de tomate, queso mozzarella, queso azul.",
    price: 10.100,
    image: "/images/Mozzarella.jpeg",
    rating: 4.3,
  },
  {
    id: 3,
    name: "Fugazzeta",
    description: "Queso mozzarella, aji, cebolla curada.",
    price: 11.99,
    image: "/images/Mozzarella.jpeg",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Cuatro Quesos",
    description:
      "Pizza con una mezcla de mozzarella, cheddar, gorgonzola y parmesano.",
    price: 12.99,
    image: "/images/Mozzarella.jpeg",
    rating: 4.3,
  },
  {
    id: 5,
    name: "Hawaiana",
    description: "Pizza con salsa de tomate, mozzarella, jamón y piña.",
    price: 11.49,
    image: "/images/Mozzarella.jpeg",
    rating: 4.0,
  },
  {
    id: 6,
    name: "Mozzarella",
    description: "Pizza con salsa de tomate, mozzarella y pepperoni.",
    price: 11.99,
    image: "/images/Mozzarella.jpeg",
    rating: 4.7,
  },
];

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
    setOrderData((prevData) => ({
      ...prevData,
      [name]: name === "rating" ? parseFloat(value) : value,
    }));
  };

  const handleWhatsAppClick = async () => {
    const cartItems = Object.entries(cart)
      .map(([pizzaId, quantity]) => {
        const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
        return pizza
          ? `${quantity}x ${pizza.name}`
          : `${quantity}x (Pizza no encontrada)`;
      })
      .join(", ");

    const message = `Hola, me gustaría ordenar:
  ${cartItems}
  Total: $${getTotalPrice()}
  Nombre: ${orderData.name}
  Dirección: ${orderData.address}
  Teléfono: ${orderData.phone}
  Puntaje: ${orderData.rating}
  Hora deseada: ${orderData.desiredTime}`;

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
    formData.append("entry.1234567890", cartItems); // Asegúrate de que este entry ID sea correcto
    formData.append("entry.0987654321", getTotalPrice()); // Asegúrate de que este entry ID sea correcto

    try {
      const response = await fetch(formUrl, {
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
  };

  const handleOrderDialogOpen = () => {
    setIsModalOpen(true);
  };

  const [currentSection, setCurrentSection] = useState("Inicio");

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(
              entry.target.getAttribute("data-section") || "Inicio"
            );
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      sectionObserver.observe(section);
    });

    return () => sectionObserver.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Imagen de fondo */}
      <div className="background-image"></div>
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 py-12 px-4 sm:px-6 lg:px-8">
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto grid grid-cols-3 items-center px-4">
            <div className="flex justify-center col-start-1 col-end-2">
              <div className="text-2xl font-bold text-red-600 transform transition-transform hover:scale-105">
                LOGO
              </div>
            </div>
            <nav className="flex justify-center col-start-2 col-end-3 space-x-6">
              <a
                href="#inicio"
                className="text-gray-800 hover:text-red-600 transition-transform duration-300"
              >
                Inicio
              </a>
              <a
                href="#productos"
                className="text-gray-800 hover:text-red-600 transition-transform duration-300"
              >
                Productos
              </a>
              <a
                href="#contacto"
                className="text-gray-800 hover:text-red-600 transition-transform duration-300"
              >
                Contacto
              </a>
              <a
                href="#calidad"
                className="text-gray-800 hover:text-red-600 transition-transform duration-300"
              >
                Nuestra Calidad
              </a>
              <a
                href="#tips"
                className="text-gray-800 hover:text-red-600 transition-transform duration-300"
              >
                Tips
              </a>
            </nav>
            <div className="flex justify-center col-start-3 col-end-4">
              <div className="relative flex items-center">
                <div className="bg-red-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-transform transform hover:scale-110">
                  <ShoppingCart size={28} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <div className="ml-4 text-gray-800">
                  <p className="font-bold">Total Gastado:</p>
                  <p>${getTotalPrice()}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-lg shadow-md mt-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center text-red-800 mb-8 transition-transform duration-300">
              {currentSection === "Inicio"
                ? "Nuestra Deliciosa Pizzería"
                : currentSection}
            </h1>
            <p className="text-xl text-center text-gray-700 mb-12">
              Disfruta de nuestras pizzas artesanales, hechas con los mejores
              ingredientes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pizzas.map((pizza) => (
                <PizzaCard key={pizza.id} pizza={pizza} addToCart={addToCart} />
              ))}
            </div>
          </div>
        </main>

        <motion.div
          className="fixed bottom-8 right-8 bg-red-600 text-white rounded-full p-4 cursor-pointer shadow-lg transition-transform transform hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart size={28} />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {getTotalItems()}
            </span>
          )}
        </motion.div>
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
          />
        )}

        {/* <main className="container mx-auto mt-6 px-4">
        <section id="inicio" data-section="Inicio">
          <h1 className="text-4xl font-bold text-center text-red-600 mb-6">Bienvenido a nuestra pizzería</h1>
        </section>
        <section id="productos" data-section="Productos">
          <h2 className="text-3xl font-semibold text-center text-red-600 mb-6">Nuestros Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza}  addToCart={addToCart} />
            ))}
          </div>
        </section>
        <section id="contacto" data-section="Contacto">
          <h2 className="text-3xl font-semibold text-center text-red-600 mb-6">Contacto</h2>
          <p className="text-center text-gray-800">Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </section>
        <section id="calidad" data-section="Nuestra Calidad">
          <h2 className="text-3xl font-semibold text-center text-red-600 mb-6">Nuestra Calidad</h2>
          <p className="text-center text-gray-800">En nuestra pizzería, nos enorgullecemos de utilizar los mejores ingredientes para ofrecerte una experiencia culinaria excepcional.</p>
        </section>
        <section id="tips" data-section="Tips">
          <h2 className="text-3xl font-semibold text-center text-red-600 mb-6">Tips para Disfrutar al Máximo</h2>
          <p className="text-center text-gray-800">Aquí encontrarás algunos consejos para disfrutar al máximo de nuestras pizzas y mejorar tu experiencia.</p>
        </section>
      </main> */}

        <footer className="bg-white shadow-md py-4">
          <div className="container mx-auto text-center text-gray-800">
            <p>&copy; 2024 | Ejemplo..</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
