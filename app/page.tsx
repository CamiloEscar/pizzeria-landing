"use client";

import { useState } from "react";
import { Pizza } from "../interfaces/pizza";
import { PizzaCard } from "@/components/PizzaCard";
import CartDialog from "@/components/CartDialog";
import OrderDialog from "@/components/OrderDialog";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const pizzas: Pizza[] = [
  {
    id: 1,
    name: "Margherita",
    description: "Clásica pizza con salsa de tomate, mozzarella y albahaca.",
    price: 9.99,
    image: "/images/Mozzarella.jpeg",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Pepperoni",
    description: "Pizza con salsa de tomate, mozzarella y pepperoni.",
    price: 11.99,
    image: "/images/Mozzarella.jpeg",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Cuatro Quesos",
    description:
      "Pizza con una mezcla de mozzarella, cheddar, gorgonzola y parmesano.",
    price: 12.99,
    image: "/images/Mozzarella.jpeg",
    rating: 4.3,
  },
  {
    id: 4,
    name: "Vegetariana",
    description:
      "Pizza con salsa de tomate, mozzarella, pimientos, champiñones, cebolla y aceitunas.",
    price: 10.99,
    image: "/images/Mozzarella.jpeg",
    rating: 4.2,
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
    name: "Barbacoa",
    description: "Pizza con salsa barbacoa, pollo, cebolla morada y cilantro.",
    price: 13.49,
    image: "/images/Mozzarella.jpeg",
    rating: 4.6,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-red-800 mb-12">
          Nuestra Deliciosa Pizzería
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

      <OrderDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        handleInputChange={handleInputChange}
        handleWhatsAppClick={handleWhatsAppClick}
        orderData={orderData}
      />
    </div>
  );
}
