import React from 'react';
import ArmarPedido from '@/components/Pedidos/ArmarPedido'; // Ajusta esta ruta según donde esté tu componente ArmarPedido
import { Pizza } from "@/interfaces/pizza";

// Puedes usar getServerSideProps o getStaticProps para obtener los datos necesarios
export async function getServerSideProps() {
  // Aquí deberías obtener los datos de las pizzas y cualquier otra información necesaria
  const pizzas: Pizza[] = []; // Reemplaza esto con tu lógica real para obtener pizzas
  return { props: { pizzas } };
}

const ArmarPedidoPage: React.FC<{ pizzas: Pizza[] }> = ({ pizzas }) => {
  const addToCart = (pizzaId: number) => {
    // Implementa la lógica para agregar al carrito
    console.log('Agregando pizza', pizzaId);
  };

  const removeFromCart = (pizzaId: number) => {
    // Implementa la lógica para remover del carrito
    console.log('Removiendo pizza', pizzaId);
  };

  const handleConfirmOrder = async (
    cart: { [key: number]: number },
    date: string,
    time: string,
    orderDetails: any
  ) => {
    // Implementa la lógica para confirmar el pedido
    console.log('Confirmando pedido', { cart, date, time, orderDetails });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Armar Pedido</h1>
      <ArmarPedido 
        pizzas={pizzas}
        cart={{}}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        handleConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
};

export default ArmarPedidoPage;