// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import OrderCartDialogCombo from "./OrderDialogCombo";

// import { Combo } from "@/interfaces/Combo";
// import { Pizza } from "@/interfaces/pizza";

// interface CartDialogComboProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   combo: Combo;
//   allPizzas: Pizza[];
//   orderData: {
//     name: string;
//     address: string;
//     phone: string;
//     specialInstructions: string;
//     rating: number;
//     desiredTime: string;
//   };
//   handleWhatsAppClick: () => Promise<{ success: boolean }>;
//   handleOrderConfirm: () => Promise<void>;
//   clearCart: () => void;
// }

// const CartDialogCombo: React.FC<CartDialogComboProps> = ({
//   open,
//   onOpenChange,
//   combo,
//   allPizzas,
//   orderData,
//   handleWhatsAppClick,
//   handleOrderConfirm,
//   clearCart,
// }) => {
//   const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

//   const handlePurchase = () => {
//     setIsOrderDialogOpen(true);
//     onOpenChange(false);
//   };

//   const handleOrderDialogClose = () => {
//     setIsOrderDialogOpen(false);
//   };

//   const { comboName, specialPrice, pizzaIds } = combo;

//   const comboPizzas = React.useMemo(() => {
//     return allPizzas.filter((pizza) => pizzaIds.includes(pizza.id));
//   }, [allPizzas, pizzaIds]);

//   const originalPrice = React.useMemo(() => {
//     return comboPizzas.reduce((total, pizza) => total + pizza.price, 0);
//   }, [comboPizzas]);

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent aria-labelledby="dialog-title" className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle id="dialog-title" className="text-2xl font-bold text-red-800">
//               {comboName}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="mt-4 max-h-[60vh] overflow-y-auto">
//             {comboPizzas.map((pizza) => (
//               <div
//                 key={pizza.id}
//                 className="flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg"
//               >
//                 <div className="flex items-center">
//                   <Image
//                     src={pizza.image}
//                     alt={pizza.name}
//                     width={480}
//                     height={480}
//                     className="w-16 h-16 object-cover rounded-md mr-4"
//                     unoptimized
//                   />
//                   <div>
//                     <h3 className="font-semibold">{pizza.name}</h3>
//                     <p className="text-sm text-gray-600">
//                       ${pizza.price.toFixed(2)} c/u
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="mt-4 text-xl font-bold text-red-800">
//             Total del combo: ${specialPrice.toFixed(2)}
//           </div>
//           <DialogFooter className="mt-4">
//             <Button
//               className="w-full bg-red-600 hover:bg-red-700 text-white"
//               onClick={handlePurchase}
//             >
//               Realizar pedido
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <OrderCartDialogCombo
//         open={isOrderDialogOpen}
//         onOpenChange={handleOrderDialogClose}
//         handleInputChange={() => {}}
//         handleWhatsAppClick={handleWhatsAppClick}
//         orderData={orderData}
//         combo={combo}
//         clearCart={clearCart}
//         handleOrderConfirm={handleOrderConfirm}
//       />
//     </>
//   );
// };

// export default CartDialogCombo;
