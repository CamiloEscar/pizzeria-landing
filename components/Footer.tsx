import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const whatsappMessage = `Hola, soy ${name}. Mi correo es ${tel}. ${message}`;
    const whatsappNumber = "+543444123456"; // Cambia este número por el número de tu WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, "_blank");

    setLoading(false);
  };

  return (
    <>
      {/* Sección de Contacto */}
      <section id="contacto" className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-red-800 mb-8">
            Contáctanos
          </h2>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Nombre:
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="tel" className="block text-gray-700 font-semibold mb-2">
                Telefono:
              </label>
              <Input
                id="tel"
                type="text"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="Telefono"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                Mensaje:
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tu mensaje"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Mensaje"}
            </Button>
          </form>
        </div>
      </section>

      {/* Sección del Pie de Página */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Pizzería Donatello</h3>
              <p className="text-gray-400">Las mejores pizzas artesanales de la ciudad.</p>
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
                <Instagram size={24} />
              </Button>
            </div>
            <div className="text-center md:text-right text-gray-400">
              <p>&copy; {new Date().getFullYear()} Camilo Escar. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
