"use client"; // Marca el archivo como un componente de cliente

import { useState, useCallback } from "react";
import { Pizza } from "@/interfaces/pizza";

export function useCart(pizzas: Pizza[]) {
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [orderData, setOrderData] = useState({
    name: "",
    address: "",
    phone: "",
    envioRetirar: "Enviar",
    specialInstructions: "",
    rating: 0,
    desiredTime: "",
  });

  const addToCart = useCallback((pizza: Pizza) => {
    setCart(prevCart => ({
      ...prevCart,
      [pizza.id]: (prevCart[pizza.id] || 0) + 1,
    }));
  }, []);

  const removeFromCart = useCallback((pizzaId: number) => {
    setCart(prevCart => {
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

  const getTotalItems = useCallback(() => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0), [cart]);

  const getTotalPrice = useCallback(() => {
    return Object.entries(cart)
      .reduce((sum, [pizzaId, quantity]) => {
        const pizza = pizzas.find(p => p.id === parseInt(pizzaId));
        return pizza ? sum + pizza.price * quantity : sum;
      }, 0)
      .toFixed(2);
  }, [cart, pizzas]);

  const handleWhatsAppClick = useCallback(async (): Promise<{ success: boolean }> => {
    let cartItems = Object.entries(cart)
      .map(([pizzaId, quantity]) => {
        const pizza = pizzas.find(p => p.id === parseInt(pizzaId));
        return pizza
          ? `${quantity}x ${pizza.name}`
          : `${quantity}x (Pizza no encontrada)`;
      })
      .join(", ");

    const message = `Hola, me gustaría ordenar:\n${cartItems}\nTotal: $${getTotalPrice()}\nNombre: ${orderData.name}\nDirección: ${orderData.address}\nTeléfono: ${orderData.phone}\nHora deseada: ${orderData.desiredTime}\nPara: ${orderData.envioRetirar}`;
    const whatsappUrl = `https://wa.me/3442475466?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdFQ42trIlOffF9smenq5oiCfOCLdjc42Q7bAurih4wWl_fhw/formResponse";
    const formData = new FormData();
    formData.append("entry.2020561029", orderData.name);
    formData.append("entry.1741915942", orderData.address);
    formData.append("entry.1517497244", orderData.phone);
    formData.append("entry.1807112285", orderData.envioRetirar);
    formData.append("entry.1563818822", orderData.specialInstructions);
    formData.append("entry.1020783902", orderData.rating.toString());
    formData.append("entry.195003812", orderData.desiredTime);
    formData.append("entry.1789182107", cartItems);
    formData.append("entry.849798555", getTotalPrice());

    try {
      const response = await fetch(formUrl, { method: "POST", body: formData });
      if (response.ok) {
        console.log("Datos enviados a Google Sheets");
      } else {
        console.error("Error al enviar datos a Google Sheets:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar datos a Google Sheets:", error);
    }

    setCart({});
    return { success: true };
  }, [cart, pizzas, orderData, getTotalPrice]);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    handleWhatsAppClick,
  };
}
