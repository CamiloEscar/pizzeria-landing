import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingCart, Facebook, Instagram, Twitter } from 'lucide-react';

interface HeaderProps {
  scrollToSection: (section: string) => void;
  getTotalItems: () => number;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCartOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ scrollToSection, getTotalItems, setIsCartOpen, isCartOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Inicio", section: "inicio" },
    { name: "Menú", section: "productos" },
    { name: "Armar Pedido", section: "armar-pedido" },
    { name: "Nosotros", section: "quienes-somos" },
    { name: "Contacto", section: "contacto" },
  ];

  const socialIcons = [
    { Icon: Facebook, href: "https://facebook.com" },
    { Icon: Instagram, href: "https://instagram.com" },
    { Icon: Twitter, href: "https://twitter.com" },
  ];

  return (
    <header className="bg-white shadow-md py-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 max-w-screen-xl flex items-center justify-between">
        <motion.div 
          className="text-2xl font-bold text-red-600 flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          PIZZERÍA
        </motion.div>
        
        <nav className="hidden md:flex flex-grow justify-center items-center space-x-4">
          {navItems.map((item, index) => (
            <motion.div
              key={item.section}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="text-gray-800 hover:text-red-600 transition duration-300"
                onClick={() => scrollToSection(item.section)}
              >
                {item.name}
              </Button>
            </motion.div>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          {socialIcons.map(({ Icon, href }, index) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-600 transition duration-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </div>
        
        <div className="md:hidden flex items-center space-x-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-red-600 mb-4">PIZZERÍA</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {navItems.map((item) => (
                  <Button
                    key={item.section}
                    variant="ghost"
                    className="w-full justify-start text-lg"
                    onClick={() => {
                      scrollToSection(item.section);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
                <div className="flex justify-start space-x-6 mt-6">
                  {socialIcons.map(({ Icon, href }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-red-600 transition duration-300"
                    >
                      <Icon size={24} />
                    </a>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <motion.div
          className="bg-red-600 text-white rounded-full p-2 cursor-pointer shadow-lg relative ml-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          <ShoppingCart size={24} />
          <AnimatePresence>
            {getTotalItems() > 0 && (
              <motion.span
                key="cart-count"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-red-800 text-xs text-white rounded-full px-2 py-1"
              >
                {getTotalItems()}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
