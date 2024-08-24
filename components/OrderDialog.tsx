import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pizza } from '../interfaces/pizza';

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleWhatsAppClick: () => void;
  orderData: { 
    name: string, 
    address: string, 
    phone: string, 
    specialInstructions: string, 
    rating: number, 
    desiredTime: string 
  };
  cart: { [key: number]: number }; // Asegúrate de que esto sea un objeto
  pizzas: Pizza[]; // Añadido para obtener los nombres de las pizzas
}

const OrderDialog: React.FC<OrderDialogProps> = ({ 
  open, 
  onOpenChange, 
  handleInputChange, 
  handleWhatsAppClick, 
  orderData, 
  cart = {}, // Valor predeterminado para cart
  pizzas
}) => {
  const [isConfirming, setIsConfirming] = useState(false); // Estado para controlar la vista de confirmación

  const getCartItems = () => {
    if (!cart) return ""; // Verifica que cart no sea null o undefined

    return Object.entries(cart)
      .map(([pizzaId, quantity]) => {
        const pizza = pizzas.find(p => p.id === parseInt(pizzaId));
        return pizza ? `${quantity}x ${pizza.name}` : `${quantity}x (Pizza no encontrada)`;
      })
      .join(", ");
  };

  const getTotalPrice = () => {
    if (!cart) return "0.00"; // Verifica que cart no sea null o undefined

    return Object.entries(cart)
      .reduce((sum, [pizzaId, quantity]) => {
        const pizza = pizzas.find(p => p.id === parseInt(pizzaId));
        return pizza ? sum + pizza.price * quantity : sum;
      }, 0)
      .toFixed(2);
  };

  const handleConfirm = () => {
    handleWhatsAppClick(); // Llama a la función para enviar el pedido
    onOpenChange(false); // Cierra el diálogo
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-800">
            {isConfirming ? 'Confirmar pedido' : 'Finalizar pedido'}
          </DialogTitle>
        </DialogHeader>
        {!isConfirming ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  value={orderData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="address"
                  name="address"
                  className="col-span-3"
                  value={orderData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  className="col-span-3"
                  value={orderData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialInstructions" className="text-right">
                  Instrucciones especiales
                </Label>
                <Textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  className="col-span-3"
                  value={orderData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Ej: Sin cebolla, pizza bien cocida, etc."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Puntaje
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  className="col-span-3"
                  value={orderData.rating}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desiredTime" className="text-right">
                  Hora deseada
                </Label>
                <Input
                  id="desiredTime"
                  name="desiredTime"
                  type="time"
                  className="col-span-3"
                  value={orderData.desiredTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="py-4">
              <h2 className="text-lg font-bold">Resumen del pedido</h2>
              <p><strong>Items:</strong> {getCartItems()}</p>
              <p><strong>Total:</strong> ${getTotalPrice()}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsConfirming(true)} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Confirmar pedido
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-4">
            <p className="text-base">¿Estás seguro de que deseas finalizar tu pedido?</p>
            <DialogFooter>
              <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 text-white">
                Confirmar
              </Button>
              <Button onClick={() => setIsConfirming(false)} className="bg-red-600 hover:bg-red-700 text-white ml-2">
                Cancelar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
