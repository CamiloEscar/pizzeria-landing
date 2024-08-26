import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pizza } from "@/interfaces/pizza"; // Asegúrate de importar o definir tu tipo de Pizza

const ArmarPedido = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPizzas, setSelectedPizzas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    address: "",
    phone: "",
    specialInstructions: "",
    rating: 0,
    desiredTime: selectedTime,
  });

  useEffect(() => {
    // Función para obtener las pizzas desde la API
    const fetchPizzas = async () => {
      try {
        const response = await fetch("/api/pizzas"); // Ajusta esta URL según tu configuración
        const fetchedPizzas = await response.json();
        setPizzas(fetchedPizzas);
      } catch (error) {
        console.error("Error al obtener las pizzas:", error);
      }
    };

    fetchPizzas();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setOrderData((prevState) => ({ ...prevState, desiredTime: e.target.value }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    setOrderData((prevState) => ({ ...prevState, desiredTime: e.target.value }));
  };

  const handlePizzaSelect = (pizzaId: number) => {
    setSelectedPizzas((prev) =>
      prev.includes(pizzaId) ? prev.filter((id) => id !== pizzaId) : [...prev, pizzaId]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({ ...prevState, [name]: value }));
  };

  const getTotalPrice = () => {
    return selectedPizzas
      .map((pizzaId) => {
        const pizza = pizzas.find((p) => p.id === pizzaId);
        return pizza ? pizza.price : 0;
      })
      .reduce((sum, price) => sum + price, 0)
      .toFixed(2);
  };

  const handlePedidoSubmit = async () => {
    if (!selectedDate || !selectedTime || selectedPizzas.length === 0) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const cartItems = selectedPizzas
        .map((pizzaId) => {
          const pizza = pizzas.find((p) => p.id === pizzaId);
          return pizza ? `${pizza.name}` : "Pizza no encontrada";
        })
        .join(", ");

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

      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      alert("Pedido enviado con éxito.");
    } catch (error) {
      alert("Hubo un error al enviar el pedido.");
      console.error(error);
    } finally {
      setLoading(false);
      setSelectedPizzas([]);
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  return (
    <section className="armar-pedido p-8 bg-white">
      <h2 className="text-3xl font-bold mb-4">Armar tu Pedido</h2>
      <div className="mb-4">
        <label className="block mb-2">Selecciona el día:</label>
        <Input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Selecciona la hora:</label>
        <Input
          type="time"
          value={selectedTime}
          onChange={handleTimeChange}
        />
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Selecciona tus pizzas:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pizzas.map((pizza) => (
            <div
              key={pizza.id}
              className={`card p-4 border rounded-lg shadow-md ${selectedPizzas.includes(pizza.id) ? 'border-green-500' : 'border-gray-300'}`}
              onClick={() => handlePizzaSelect(pizza.id)}
            >
              <img
                src={pizza.image}
                alt={pizza.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h4 className="text-xl font-semibold mb-1">{pizza.name}</h4>
              <p className="text-gray-600">{pizza.description}</p>
              <Button className="mt-2 bg-green-600 text-white">
                {selectedPizzas.includes(pizza.id) ? 'Seleccionada' : 'Seleccionar'}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={handlePedidoSubmit} className="bg-green-600 text-white" disabled={loading}>
        {loading ? 'Enviando...' : 'Confirmar Pedido'}
      </Button>
    </section>
  );
};

export default ArmarPedido;
