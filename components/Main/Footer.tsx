import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Phone } from "lucide-react";

const Footer: React.FC = () => {
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const whatsappMessage = `Hola, soy ${name}. Mi correo es ${tel}. ${message}`;
    const whatsappNumber = "+543442670573"; // Cambia este número por el número de tu WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");

    setLoading(false);
  };

  return (
    <>
      {/* Sección de Contacto y Mapa */}
      <section id="contacto" className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row">
          {/* Formulario de contacto */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-red-800 mb-8">
              Contáctanos
            </h2>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-2"
                >
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
                <label
                  htmlFor="tel"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Dirección:
                </label>
                <Input
                  id="address"
                  type="text"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="Dirección"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-semibold mb-2"
                >
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

          {/* Mapa de ubicación y más información */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-red-800 mb-8 text-center md:text-left">
              Dónde nos encontramos
            </h2>
            <div className="w-full h-64 bg-gray-200 mb-8 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2739.8226435199044!2d-58.23241568414325!3d-32.484892251667095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95afda5201c4a74b%3A0xb1a91d198efeeecd!2sCongreso%20de%20Tucum%C3%A1n%20784%2C%20E3260BAP%20Concepci%C3%B3n%20del%20Uruguay%2C%20Entre%20R%C3%ADos!5e0!3m2!1ses-419!2sar!4v1693439123280!5m2!1ses-419!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p className="text-lg text-gray-700 mb-4 text-center md:text-left">
              Congreso de Tucumán 784, Concepción del Uruguay
            </p>
            <p className="text-gray-600 text-center md:text-left">
              Visítanos para disfrutar de las mejores pizzas artesanales. ¡Te
              esperamos!
            </p>
          </div>
        </div>
      </section>

      {/* Sección del Pie de Página */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Pizzería Donatello</h3>
              <p className="text-gray-400">
                Las mejores pizzas artesanales de la ciudad.
              </p>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              {/* <a
                href="https://www.facebook.com/tuPagina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-600 transition-colors"
              >
                <Facebook size={24} />
              </a> */}
              <a
                href="https://www.instagram.com/donatello.ok"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-600 transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://wa.me/+543442670573"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-green-600 transition-colors"
              >
                <Phone size={24} />
              </a>
              {/* <a
                href="https://www.twitter.com/tuPagina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-600 transition-colors"
              >
                <Twitter size={24} />
              </a> */}
            </div>
            <div className="text-center md:text-right text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} | Contacto:{" "}
                <a
                  href="mailto:camiloescar1995@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  camiloescar1995@gmail.com
                </a>
                {" | "}
                <a
                  href="https://wa.me/+543442475466"
                  className="text-gray-400 hover:text-green-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
