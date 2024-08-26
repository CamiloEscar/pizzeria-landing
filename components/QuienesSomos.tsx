import React from "react";
import Image from "next/image";

const QuienesSomos = () => {
  return (
    <section id="quienes-somos" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-8">Quiénes Somos</h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/images/La-de-Rucula.jpeg"
              alt="Interior de la pizzería"
              className="rounded-lg shadow-lg"
              width={720}
              height={480}
            />
          </div>
          <div className="md:w-1/2 md:pl-8">
            <p className="text-xl text-gray-700 mb-4">
              Somos una pizzería con más de 10 años de experiencia en ofrecer las mejores pizzas artesanales de la ciudad. Nos enorgullecemos de utilizar ingredientes frescos y de alta calidad para brindar una experiencia culinaria inigualable.
            </p>
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-red-800">Ubicación</h3>
              <p className="text-lg text-gray-600 mb-4">Mitre 516, Concepción del Uruguay, Entre Ríos, Argentina</p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.7641201405764!2d-58.23747602458945!3d-32.482614293576154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b72d34bdc2d0d1%3A0x7aee69f6d86f3e8e!2sMitre%20516%2C%20E3260BHW%20Concepci%C3%B3n%20del%20Uruguay%2C%20Entre%20R%C3%ADos%2C%20Argentina!5e0!3m2!1ses!2sus!4v1693274517082!5m2!1ses!2sus"
                width="600"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuienesSomos;
