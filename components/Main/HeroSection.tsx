import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Phone, MapPin, Clock, X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStories } from "./useStories";

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const {
    isStoriesOpen,
    setIsStoriesOpen,
    currentStoryIndex,
    storyProgress,
    isPaused,
    nextStory,
    prevStory,
    togglePause,
    storyImages,
  } = useStories();

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        id="inicio"
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-white bg-black overflow-hidden min-h-screen"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/La-de-Rucula.webp')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>
        </div>
  
        <div className="relative z-10 text-center p-6 md:p-12 lg:p-16 max-w-4xl mx-auto">
          <div className="mb-8"> {/* Ajusta el margen inferior aquí */}
            <StoriesLogo onOpenStories={() => setIsStoriesOpen(true)} />
          </div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg mt-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Pizzería Donatello
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 lg:mb-16 leading-relaxed drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Las mejores pizzas de la ciudad
          </motion.p>
          <motion.a
            href="#productos"
            className="inline-block bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Ver Menú
          </motion.a>
        </div>
      </section>
  
      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.div 
            className="p-8 bg-white rounded-lg shadow-lg border border-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="space-y-6">
              <InfoItem 
                icon={MapPin} 
                text="Congreso de Tucuman 784, Concepción del Uruguay" 
                label="Dirección"
              />
              <InfoItem 
                icon={Phone} 
                text={
                  <a href="https://wa.me/+543442670573" className="text-red-500 hover:text-red-700">
                    +54 3442 670573
                  </a>
                } 
                label="Teléfono"
              />
              <InfoItem 
                icon={Clock} 
                text="Lunes, miercoles, viernes, sabado y Domingo, 20:00 - 23:30" 
                label="Horario"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Stories
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
        currentStoryIndex={currentStoryIndex}
        storyProgress={storyProgress}
        isPaused={isPaused}
        nextStory={nextStory}
        prevStory={prevStory}
        togglePause={togglePause}
        storyImages={storyImages}
      />
    </>
  );
};

const InfoItem: React.FC<{ icon: React.ElementType; text: React.ReactNode; label: string }> = ({ icon: Icon, text, label }) => (
  <div className="flex flex-col items-center space-y-2">
    <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold">{label}</h3>
    <p className="text-sm sm:text-base lg:text-lg">{text}</p>
  </div>
);

const StoriesLogo: React.FC<{ onOpenStories: () => void }> = ({ onOpenStories }) => {
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="mb-8 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onOpenStories}
    >
      <div className="relative inline-flex items-center justify-center w-40 h-40 cursor-pointer">
        <div
          className="absolute w-44 h-44 rounded-full"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, yellow, red, green, yellow)",
            padding: "4px",
          }}
        >
          <div className="flex items-center justify-center w-full h-full bg-white rounded-full">
            <Image
              src="/images/logo.webp"
              alt="Logo"
              width={160}
              height={160}
              className="object-contain rounded-full"
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow-lg"
          >
            ¡Publicaciones destacadas!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Stories: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentStoryIndex: number;
  storyProgress: number;
  isPaused: boolean;
  nextStory: () => void;
  prevStory: () => void;
  togglePause: () => void;
  storyImages: string[];
}> = ({
  isOpen,
  onClose,
  currentStoryIndex,
  storyProgress,
  isPaused,
  nextStory,
  prevStory,
  togglePause,
  storyImages,
}) => {
  const storyData = [
    {
      username: "donatello.ok",
      timestamp: "2h",
      profilePic: "/images/logo.webp",
    },
    {
      username: "donatello.ok",
      timestamp: "5h",
      profilePic: "/images/logo.webp",
    },
    {
      username: "donatello.ok",
      timestamp: "1d",
      profilePic: "/images/logo.webp",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full h-full max-w-md max-h-[80vh] bg-gray-900 rounded-lg overflow-hidden shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStoryIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-full relative"
              >
                <Image
                  src={storyImages[currentStoryIndex]}
                  alt={`Story ${currentStoryIndex + 1}`}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent h-24 p-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={storyData[currentStoryIndex].profilePic}
                      alt={storyData[currentStoryIndex].username}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-white"
                    />
                    <div>
                      <h3 className="text-white font-semibold">
                        {storyData[currentStoryIndex].username}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {storyData[currentStoryIndex].timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <CloseButton onClose={onClose} />
            <ProgressBar
              storyImages={storyImages}
              currentStoryIndex={currentStoryIndex}
              storyProgress={storyProgress}
            />
            <NavigationButtons prevStory={prevStory} nextStory={nextStory} />
            <PausePlayButton isPaused={isPaused} togglePause={togglePause} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <button
    className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 transition-colors hover:bg-opacity-75 z-10"
    onClick={onClose}
    aria-label="Close stories"
  >
    <X size={24} />
  </button>
);

const ProgressBar: React.FC<{
  storyImages: string[];
  currentStoryIndex: number;
  storyProgress: number;
}> = ({ storyImages, currentStoryIndex, storyProgress }) => (
  <div className="absolute top-0 left-0 right-0 flex justify-center space-x-1 p-2 z-10">
    {storyImages.map((_, index) => (
      <div
        key={index}
        className="h-1 bg-gray-500 flex-grow rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{
            width:
              index === currentStoryIndex
                ? `${storyProgress}%`
                : index < currentStoryIndex
                ? "100%"
                : "0%",
          }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    ))}
  </div>
);

const NavigationButtons: React.FC<{
  prevStory: () => void;
  nextStory: () => void;
}> = ({ prevStory, nextStory }) => (
  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
    <button
      className="text-white bg-black bg-opacity-50 rounded-full p-2 transition-colors hover:bg-opacity-75"
      onClick={(e) => {
        e.stopPropagation();
        prevStory();
      }}
      aria-label="Previous story"
    >
      <ChevronLeft size={24} />
    </button>
    <button
      className="text-white bg-black bg-opacity-50 rounded-full p-2 transition-colors hover:bg-opacity-75"
      onClick={(e) => {
        e.stopPropagation();
        nextStory();
      }}
      aria-label="Next story"
    >
      <ChevronRight size={24} />
    </button>
  </div>
);

const PausePlayButton: React.FC<{
  isPaused: boolean;
  togglePause: () => void;
}> = ({ isPaused, togglePause }) => (
  <button
    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 transition-colors hover:bg-opacity-75"
    onClick={(e) => {
      e.stopPropagation();
      togglePause();
    }}
    aria-label={isPaused ? "Play story" : "Pause story"}
  >
    {isPaused ? <Play size={16} /> : <Pause size={16} />}
  </button>
);