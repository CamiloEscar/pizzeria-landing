// ConfirmationDialog.tsx
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onOpenChange, onConfirm }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Confirmar pedido</DialogTitle>
        </DialogHeader>
        <p className="text-base">¿Estás seguro de que deseas finalizar tu pedido?</p>
        <DialogFooter>
          <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700 text-white">
            Confirmar
          </Button>
          <Button onClick={() => onOpenChange(false)} className="bg-red-600 hover:bg-red-700 text-white ml-2">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
