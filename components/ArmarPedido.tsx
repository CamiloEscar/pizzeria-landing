import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pizza } from "@/interfaces/pizza";
import SmallPizzaCard from "@/components/SmallPizzaCard";

interface ArmarPedidoProps {
  pizzas: Pizza[];
  cart: { [key: number]: number };
  addToCart: (pizzaId: number) => void;
  removeFromCart: (pizzaId: number) => void;
  handleConfirmOrder: (cart: { [key: number]: number }, date: string, time: string) => Promise<void>;
}

const ArmarPedido: React.FC<ArmarPedidoProps> = ({
  pizzas,
  cart,
  addToCart,
  removeFromCart,
  handleConfirmOrder
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [armarPedidoCart, setArmarPedidoCart] = useState<{ [key: number]: number }>({});

  // Referencias para los campos de fecha y hora
  const dateRef = useRef<HTMLInputElement | null>(null);
  const timeRef = useRef<HTMLInputElement | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setDateError(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    setTimeError(false);
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
      .map(([pizzaId, quantity]) => {
        const pizza = pizzas.find((p) => p.id === parseInt(pizzaId));
        return pizza ? pizza.price * quantity : 0;
      })
      .reduce((sum, price) => sum + price, 0)
      .toFixed(2);
  };

  const handleConfirmOrderClick = async () => {
    if (!selectedDate) {
      setDateError(true);
      // Desplazar la vista al campo de fecha
      dateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!selectedTime) {
      setTimeError(true);
      // Desplazar la vista al campo de hora
      timeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      await handleConfirmOrder(armarPedidoCart, selectedDate, selectedTime);
      setArmarPedidoCart({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 md:p-10 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center">
          Armar tu Pedido para Otro Día
        </h2>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium text-center">Selecciona el día:</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            ref={dateRef} // Asignar referencia aquí
            className={`w-full md:w-1/2 mx-auto ${dateError ? "border-red-500" : ""} border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {dateError && (
            <p className="text-red-500 text-sm mt-1 text-center">
              Por favor, selecciona un día.
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium text-center">Selecciona la hora:</label>
          <Input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            ref={timeRef} // Asignar referencia aquí
            className={`w-full md:w-1/2 mx-auto ${timeError ? "border-red-500" : ""} border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {timeError && (
            <p className="text-red-500 text-sm mt-1 text-center">
              Por favor, selecciona una hora.
            </p>
          )}
        </div>
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 text-center">
            Selecciona tus pizzas:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pizzas.map((pizza) => (
              <div key={pizza.id} className="flex justify-center">
                <SmallPizzaCard
                  pizza={pizza}
                  addToCart={() => addToArmarPedidoCart(pizza.id)}
                  removeFromCart={() => removeFromArmarPedidoCart(pizza.id)}
                  quantity={armarPedidoCart[pizza.id] || 0}
                  isSelected={armarPedidoCart[pizza.id] > 0}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 text-2xl font-bold text-red-700 text-center">
          Total: ${getTotalPrice()}
        </div>
        <Button
          onClick={handleConfirmOrderClick}
          className="w-full md:w-auto mt-6 bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors mx-auto"
          disabled={loading || Object.keys(armarPedidoCart).length === 0}
        >
          {loading ? "Enviando..." : "Confirmar Pedido para Otro Día"}
        </Button>
      </div>
    </section>
  );
};

export default ArmarPedido;
