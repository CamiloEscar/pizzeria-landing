'use client'

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Pizza } from "../interfaces/pizza"
import { Combo } from "@/interfaces/Combo"
import api from "@/interfaces/api"
import { AnimatePresence, motion } from "framer-motion"
import Header from "@/components/Main/Header"
import { HeroSection } from "@/components/Main/HeroSection"
import Footer from "@/components/Main/Footer"
import CartDialog from "@/components/Pizzas/CartDialog"
import OrderDialog from "@/components/Pizzas/OrderDialog"
import CombosSection from "@/components/Main/ComboSection"
import LoadingState from "@/components/LoadingState"
import PizzaMenu from "@/components/Pizzas/PizzaMenu"
import { ShoppingCart } from "lucide-react"

interface OrderData {
  name: string
  address: string
  phone: string
  envioRetirar: string
  specialInstructions: string
  rating: number
  desiredTime: string
}

interface CartItem extends Pizza {
  quantity: number
  isHalf: boolean
}

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderData, setOrderData] = useState<OrderData>({
    name: "",
    address: "",
    phone: "",
    envioRetirar: "Enviar",
    specialInstructions: "",
    rating: 0,
    desiredTime: "",
  })
  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [combos, setCombos] = useState<Combo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isAddingToCart = useRef(false)
  const [showFloatingCart, setShowFloatingCart] = useState(false)

  const envioRetirar = useCallback((newValue: string) => {
    setOrderData((prevState) => ({ ...prevState, envioRetirar: newValue }))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [fetchedPizzas, fetchedCombos] = await Promise.all([
          api.pizza.list(),
          api.pizza.combos(),
        ])
        setPizzas(fetchedPizzas)
        setCombos(fetchedCombos)
      } catch (error) {
        setError(
          "No se pudieron cargar los datos. Por favor, intente de nuevo más tarde."
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getTotalItems = useCallback(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const addToCart = useCallback((pizza: Pizza, isHalf: boolean) => {
    if (isAddingToCart.current) return
    isAddingToCart.current = true

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === pizza.id && item.isHalf === isHalf
      )
      if (existingItemIndex > -1) {
        const newCart = [...prevCart]
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1,
        }
        return newCart
      } else {
        return [...prevCart, { ...pizza, quantity: 1, isHalf }]
      }
    })

    setShowFloatingCart(true)

    setTimeout(() => {
      isAddingToCart.current = false
    }, 100)
  }, [])

  const removeFromCart = useCallback((pizzaId: number, isHalf: boolean) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === pizzaId && item.isHalf === isHalf
      )
      if (existingItemIndex > -1) {
        const newCart = [...prevCart]
        if (newCart[existingItemIndex].quantity > 1) {
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity - 1,
          }
        } else {
          newCart.splice(existingItemIndex, 1)
        }
        return newCart
      }
      return prevCart
    })

    setShowFloatingCart((prev) => getTotalItems() > 0)
  }, [getTotalItems])

  const clearCart = useCallback(() => setCart([]), [])

  const FloatingCartButton = useCallback(() => (
    <motion.div
      className="fixed z-50 bottom-4 right-4 md:bottom-8 md:right-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        className="relative bg-red-600 text-white rounded-full p-3 md:p-4 cursor-pointer shadow-lg"
        onClick={() => setIsCartOpen(true)}
        aria-label="Floating Cart"
      >
        <ShoppingCart size={28} />
        <AnimatePresence>
          {getTotalItems() > 0 && (
            <motion.span
              key="cart-count"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
            >
              {getTotalItems()}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  ), [getTotalItems])

  const getTotalPrice = useCallback(() => {
    return cart
      .reduce((sum, item) => {
        const price = item.isHalf ? item.halfPrice : item.price
        return sum + price * item.quantity
      }, 0)
      .toFixed(2)
  }, [cart])

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setOrderData((prevState) => ({ ...prevState, [name]: value }))
  }, [])

  const handleWhatsAppClick = useCallback(async (): Promise<{
    success: boolean
  }> => {
    let cartItems = ""
    let total = 0

    if (selectedCombo) {
      cartItems = `1x ${selectedCombo.comboName}`
      total = selectedCombo.specialPrice
    } else {
      cartItems = cart
        .map(
          (item) =>
            `${item.quantity}x ${item.name} ${item.isHalf ? "(Media)" : ""}`
        )
        .join(", ")
      total = parseFloat(getTotalPrice())
    }

    const message = `Hola, me gustaría ordenar:\n${cartItems}\nTotal: $${total.toFixed(
      2
    )}\nNombre: ${orderData.name}\nDirección: ${orderData.address}\nTeléfono: ${
      orderData.phone
    }\nHora deseada: ${orderData.desiredTime}\nPara: ${orderData.envioRetirar}`

    const whatsappUrl = `https://wa.me/3442670573?text=${encodeURIComponent(
      message
    )}`
    window.open(whatsappUrl, "_blank")

    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSdFQ42trIlOffF9smenq5oiCfOCLdjc42Q7bAurih4wWl_fhw/formResponse"
  
    const formData = new FormData()
    formData.append("entry.2020561029", orderData.name)
    formData.append("entry.1741915942", orderData.address)
    formData.append("entry.1517497244", orderData.phone)
    formData.append("entry.1807112285", orderData.envioRetirar)
    formData.append("entry.1563818822", orderData.specialInstructions)
    formData.append("entry.1020783902", orderData.rating.toString())
    formData.append("entry.195003812", orderData.desiredTime)
    formData.append("entry.1789182107", cartItems)
    formData.append("entry.849798555", total.toFixed(2))
  
    try {
      const response = await fetch(formUrl, { method: "POST", body: formData })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al enviar datos a Google Sheets:", error)
    }

    setIsOrderDialogOpen(false)
    setCart([])
    return { success: true }
  }, [cart, orderData, getTotalPrice, selectedCombo])

  const handleOrderDialogOpen = useCallback(() => {
    setIsOrderDialogOpen(true)
    setIsCartOpen(false)
  }, [])

  const handleOrderConfirm = useCallback(async () => {
    const result = await handleWhatsAppClick()
    if (result.success) {
      clearCart()
      setIsOrderDialogOpen(false)
    }
  }, [handleWhatsAppClick, clearCart])

  const scrollToSection = useCallback((section: string) => {
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    setShowFloatingCart(getTotalItems() > 0)
  }, [getTotalItems])

  if (isLoading) {
    return <LoadingState />
  }
  if (error) return <div>{error}</div>

  return (
    <div className="relative min-h-screen scroll-smooth md:scroll-auto">
      <Header
        scrollToSection={scrollToSection}
        getTotalItems={getTotalItems}
        setIsCartOpen={setIsCartOpen}
        isCartOpen={isCartOpen}
      />
      <main className="pt-20">
        <section id="inicio">
          <HeroSection />
        </section>
        <section id="productos" className="py-16 bg-white">
          <PizzaMenu pizzas={pizzas} addToCart={addToCart} />
        </section>
        <section id="combos">
          <CombosSection
            combos={combos}
            clearCart={clearCart}
            envioRetirar={envioRetirar}
          />
        </section>
        <Footer />
      </main>
      <AnimatePresence>
        {showFloatingCart && <FloatingCartButton />}
      </AnimatePresence>
      <AnimatePresence>
        {isCartOpen && (
          <CartDialog
            open={isCartOpen}
            onOpenChange={setIsCartOpen}
            cart={cart}
            pizzas={pizzas}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            getTotalPrice={getTotalPrice}
            handleOrderDialogOpen={handleOrderDialogOpen}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOrderDialogOpen && (
          <OrderDialog
            open={isOrderDialogOpen}
            onOpenChange={setIsOrderDialogOpen}
            handleInputChange={handleInputChange}
            handleWhatsAppClick={handleWhatsAppClick}
            orderData={orderData}
            cart={cart}
            pizzas={pizzas}
            clearCart={clearCart}
            handleOrderConfirm={handleOrderConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  )
}