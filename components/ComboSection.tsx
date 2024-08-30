import React, { useEffect, useState } from "react";
import api from "../interfaces/api";
import ComboCard from "./ComboCard";
import { Combo } from "@/interfaces/Combo";
import { Pizza } from "@/interfaces/pizza";
import ComboDialog from "@/components/ComboDialog";

interface CombosSectionProps {
  addToCart: (comboName: string, pizzas: Pizza[], specialPrice: number) => void;
  clearCart: () => void;
}

const CombosSection: React.FC<CombosSectionProps> = ({ addToCart, clearCart }) => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [isComboDialogOpen, setIsComboDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const combosData: Combo[] = await api.pizza.combos();
        setCombos(combosData);
      } catch (error) {
        console.error("Error fetching combos:", error);
      }
    };

    const fetchPizzas = async () => {
      try {
        const pizzasData: Pizza[] = await api.pizza.list();
        setPizzas(pizzasData);
      } catch (error) {
        console.error("Error fetching pizzas:", error);
      }
    };

    fetchCombos();
    fetchPizzas();
  }, []);

  const handleComboDialogOpen = (combo: Combo) => {
    setSelectedCombo(combo);
    setIsComboDialogOpen(true);
  };

  const handleComboDialogClose = () => {
    setIsComboDialogOpen(false);
  };

  const addToCartCombo = (comboName: string, pizzas: Pizza[], specialPrice: number) => {
    addToCart(comboName, pizzas, specialPrice);
    handleComboDialogClose();
  };

  // Placeholder functions for ComboDialog props
  const handleWhatsAppClick = async () => ({ success: true });
  const handleOrderConfirm = async () => {};

  return (
    <section id="combos" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-8">Combos Especiales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combos.length > 0 ? (
            combos.map((combo) => {
              const comboPizzas = combo.pizzaIds
                .map(id => pizzas.find(pizza => pizza.id === id))
                .filter((pizza): pizza is Pizza => pizza !== undefined);

              const originalPrice = comboPizzas.reduce((total, pizza) => total + pizza.price, 0);

              return (
                <div key={combo.comboName} onClick={() => handleComboDialogOpen(combo)}>
                  <ComboCard
                    comboName={combo.comboName}
                    pizzas={comboPizzas}
                    specialPrice={combo.specialPrice}
                    originalPrice={originalPrice}
                    addToCart={addToCartCombo}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-700">Cargando combos...</p>
          )}
        </div>
      </div>

      {selectedCombo && (
  <ComboDialog
    open={isComboDialogOpen}
    onOpenChange={setIsComboDialogOpen}
    combo={selectedCombo}
    allPizzas={pizzas} // Pasar todas las pizzas aquí
    orderData={{
      name: "",
      address: "",
      phone: "",
      specialInstructions: "",
      rating: 0,
      desiredTime: "",
    }}
    handleWhatsAppClick={handleWhatsAppClick}
    handleOrderConfirm={handleOrderConfirm}
    clearCart={clearCart}
  />
)}
    </section>
  );
};

export default CombosSection;