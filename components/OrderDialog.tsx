import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface OrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleWhatsAppClick: () => void
  orderData: { 
    name: string, 
    address: string, 
    phone: string, 
    specialInstructions: string, 
    rating: number, 
    desiredTime: string 
  }
}

const OrderDialog: React.FC<OrderDialogProps> = ({ 
  open, 
  onOpenChange, 
  handleInputChange, 
  handleWhatsAppClick, 
  orderData 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-800">Finalizar pedido</DialogTitle>
        </DialogHeader>
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
        <DialogFooter>
          <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Enviar pedido por WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OrderDialog
