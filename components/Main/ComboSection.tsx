import React, { useEffect, useState } from "react";
import api from "../../interfaces/api";
import ComboCard from "../Combos/ComboCard";
import { Combo } from "@/interfaces/Combo";
import { Pizza } from "@/interfaces/pizza";
import ArmarCombo from "../Combos/ArmarCombo";

interface CombosSectionProps {
  combos: Combo[];
  clearCart: () => void;
  envioRetirar: () => void;
}

const CombosSection: React.FC<CombosSectionProps> = ({ combos, clearCart, envioRetirar }) => { 
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [isArmarComboOpen, setIsArmarComboOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const pizzasData: Pizza[] = await api.pizza.list();
        setPizzas(pizzasData);
      } catch (error) {
        setError("Error fetching pizzas");
        console.error("Error fetching pizzas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const handleComboSelect = (combo: Combo) => {
    setSelectedCombo(combo);
    setIsArmarComboOpen(true);
  };

  const handleArmarComboClose = () => {
    setIsArmarComboOpen(false);
    setSelectedCombo(null);
  };

  return (
    <section id="combos" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-8">Combos Especiales</h2>
        {loading ? (
          <p className="text-center text-gray-700">Cargando combos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combos.length > 0 ? (
              combos.map((combo) => {
                const comboPizzas = combo.pizzaIds
                  .map(id => pizzas.find(pizza => pizza.id === id))
                  .filter((pizza): pizza is Pizza => pizza !== undefined);

                const originalPrice = comboPizzas.reduce((total, pizza) => total + pizza.price, 0);

                return (
                  <div key={combo.comboName} onClick={() => handleComboSelect(combo)}>
                    <ComboCard
                      comboName={combo.comboName}
                      pizzas={comboPizzas}
                      specialPrice={combo.specialPrice}
                      originalPrice={originalPrice}
                    />
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-700">No hay combos disponibles.</p>
            )}
          </div>
        )}
      </div>

      {selectedCombo && (
        <ArmarCombo
          open={isArmarComboOpen}
          onOpenChange={setIsArmarComboOpen}
          combo={selectedCombo}
          allPizzas={pizzas}
          onOrderConfirm={handleArmarComboClose}
          clearCart={clearCart}
          envioRetirar={envioRetirar} 
        />
      )}
    </section>
  );
};

export default CombosSection;
