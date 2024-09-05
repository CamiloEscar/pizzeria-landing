import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Phone, MapPin, Clock } from 'lucide-react';

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative h-screen flex flex-col items-center justify-center text-white bg-black overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/La-de-Rucula.jpeg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>
      </div>

      <div className="relative z-10 text-center p-6 md:p-12 lg:p-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg animate-fadeIn">
          Pizzería Donatello
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl mb-12 md:mb-16 lg:mb-20 leading-relaxed drop-shadow-md animate-slideIn">
          Las mejores pizzas de la ciudad
        </p>
        <a
          href="#productos"
          className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 animate-bounceIn"
        >
          Ver Menú
        </a>
      </div>

      <div className="relative z-10 text-center mt-16 md:mt-24 lg:mt-32 space-y-4 animate-fadeInSlow">
        <div className="flex flex-col md:flex-row md:space-x-6 md:space-y-0 space-y-4 items-center">
          <div className="flex items-center space-x-4">
            <MapPin className="h-8 w-8 text-red-600 animate-fadeInUp" />
            <p className="text-lg md:text-xl lg:text-2xl animate-fadeInUp">
              Mitre 516, Concepción del Uruguay
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="h-8 w-8 text-red-600 animate-fadeInUp" />
            <p className="text-lg md:text-xl lg:text-2xl animate-fadeInUp">
              Teléfono: <a href="https://wa.me/543444123456" className="text-red-500 hover:text-red-700">+54 3444 123456</a>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-red-600 animate-fadeInUp" />
            <p className="text-lg md:text-xl lg:text-2xl animate-fadeInUp">
              Horario: Lunes a Sábado, 18:00 - 23:00
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-fadeInSlow lg:bottom-12 md:bottom-8">
        <Image
          src="/images/logo.jpeg"
          alt="Pizzería"
          width={120}
          height={120}
          className="rounded-full border-4 border-white shadow-lg"
        />
      </div>
    </section>
  );
};
