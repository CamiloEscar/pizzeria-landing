import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  scrollToSection: (section: string) => void;
  getTotalItems: () => number;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCartOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  scrollToSection,
  getTotalItems,
  setIsCartOpen,
  isCartOpen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Inicio", section: "inicio" },
    { name: "Menú", section: "productos" },
    { name: "Combos", section: "combos" },
    { name: "Armar Pedido", section: "armar-pedido", href: "/armar-pedido" },
    { name: "Contacto", section: "contacto" },
  ];

  const handleNavItemClick = useCallback(
    (section: string, href?: string) => {
      if (href) {
      } else {
        scrollToSection(section);
      }
      setIsMenuOpen(false);
    },
    [scrollToSection]
  );

  return (
    <header className="header bg-white bg-opacity-50 backdrop-blur-lg shadow-md py-1 md:py-2 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-2 md:px-4 max-w-screen-lg flex items-center justify-between">
        <Logo />
        <DesktopNavigation
          navItems={navItems}
          onItemClick={handleNavItemClick}
        />
        <MobileNavigation
          navItems={navItems}
          onItemClick={handleNavItemClick}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        <CartButton
          getTotalItems={getTotalItems}
          setIsCartOpen={setIsCartOpen}
          isCartOpen={isCartOpen}
        />
      </div>
    </header>
  );
};

const Logo: React.FC = () => (
  <Link href="/#inicio" passHref>
    <motion.div
      className="relative flex items-center justify-center w-16 h-16 cursor-pointer"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex items-center justify-center w-16 h-16">
        <div
          className="absolute w-18 h-18 rounded-full p-1"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, yellow, red, green, yellow)",
            padding: "4px",
          }}
        >
          <div className="flex items-center justify-center w-full h-full bg-white rounded-full">
            <Image
              src="/images/logo-header.webp"
              alt="Logo"
              width={76}
              height={76}
              className="object-contain relative z-10"
            />
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

const DesktopNavigation: React.FC<{
  navItems: Array<{ name: string; section: string; href?: string }>;
  onItemClick: (section: string, href?: string) => void;
}> = ({ navItems, onItemClick }) => (
  <nav className="hidden md:flex flex-grow justify-center items-center space-x-4">
    {navItems.map((item, index) => (
      <motion.div
        key={item.section}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {item.href ? (
          <Link href={item.href} passHref>
            <Button
              variant="ghost"
              className="text-gray-800 hover:text-red-600 transition duration-300"
              onClick={() => onItemClick(item.section, item.href)}
            >
              {item.name}
            </Button>
          </Link>
        ) : (
          <Button
            variant="ghost"
            className="text-gray-800 hover:text-red-600 transition duration-300"
            onClick={() => onItemClick(item.section)}
          >
            {item.name}
          </Button>
        )}
      </motion.div>
    ))}
  </nav>
);

const MobileNavigation: React.FC<{
  navItems: Array<{ name: string; section: string; href?: string }>;
  onItemClick: (section: string, href?: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ navItems, onItemClick, isMenuOpen, setIsMenuOpen }) => (
  <div className="md:hidden flex items-center space-x-4">
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-red-600 mb-4">
            PIZZERÍA
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {navItems.map((item) =>
            item.href ? (
              <Link key={item.section} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-lg"
                  onClick={() => onItemClick(item.section, item.href)}
                >
                  {item.name}
                </Button>
              </Link>
            ) : (
              <Button
                key={item.section}
                variant="ghost"
                className="w-full justify-start text-lg"
                onClick={() => onItemClick(item.section)}
              >
                {item.name}
              </Button>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  </div>
);

const CartButton: React.FC<{
  getTotalItems: () => number;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCartOpen: boolean;
}> = ({ getTotalItems, setIsCartOpen, isCartOpen }) => (
  <motion.div
    className="relative bg-red-600 text-white rounded-full p-2 cursor-pointer shadow-lg ml-2 md:ml-4"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => setIsCartOpen(!isCartOpen)}
    aria-label="Cart"
  >
    <ShoppingCart size={24} />
    <AnimatePresence>
      {getTotalItems() > 0 && (
        <motion.span
          key="cart-count"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1 -right-1 bg-red-800 text-xs text-white rounded-full px-2 py-1"
        >
          {getTotalItems()}
        </motion.span>
      )}
    </AnimatePresence>
  </motion.div>
);

export default Header;