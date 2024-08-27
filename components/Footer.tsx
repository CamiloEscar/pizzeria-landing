import React from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram } from "lucide-react"; // Importar los iconos específicos

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Pizza App</h3>
            <p className="text-gray-400">Deliciosas pizzas al alcance de tu mano.</p>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-red-600 transition-colors"
            >
              <Facebook size={24} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-red-600 transition-colors"
            >
              <Twitter size={24} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-red-600 transition-colors"
            >
              <Instagram size={24} />
            </Button>
          </div>
          <div className="text-center md:text-right text-gray-400">
            <p>&copy; {new Date().getFullYear()} Pizza App. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
