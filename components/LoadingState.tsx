import { motion } from "framer-motion";
import Image from "next/image";

const LoadingState = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden px-4">
      {/* Spinner (Pizza giratoria) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="flex items-center justify-center opacity-80"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Image
            src="/images/logo-header.webp" // Usa una imagen de pizza en tu carpeta de assets
            alt="Pizza Spinner"
            width={100}
            height={100}
            className="w-24 h-24 md:w-32 md:h-32"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingState;
