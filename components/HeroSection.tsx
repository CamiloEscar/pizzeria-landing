// Componente para la sección de héroe
export const HeroSection = () => (
    <section
      id="#inicio"
      className="relative h-screen flex items-center justify-center text-white"
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Pizzería Deliciosa
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Las mejores pizzas artesanales de la ciudad
        </p>
        <a
          href="#productos"
          className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition duration-300"
        >
          Ver Menú
        </a>
      </div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/La-de-Rucula.jpeg')" }}
      ></div>
    </section>
  );
