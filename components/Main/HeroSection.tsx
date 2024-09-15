import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStories } from "./useStories";


export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
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
      <section
        id="inicio"
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-screen bg-fixed bg-cover bg-center overflow-hidden bg-fixed-mobile"
        style={{
          backgroundImage: `url('/images/La-de-Rucula.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(1.1) contrast(1)",
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center p-6 md:p-8 max-w-6xl mx-auto mt-24">
          <Logo onOpenStories={() => setIsStoriesOpen(true)} isBusinessOpen={isBusinessOpen} />
          <HeroContent />
          <CTAButtons />
          <InfoSection setIsBusinessOpen={setIsBusinessOpen} />
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

interface LogoProps {
  onOpenStories: () => void;
  isBusinessOpen: boolean;
}

const Logo: React.FC<LogoProps> = ({ onOpenStories, isBusinessOpen }) => {
  return (
    <div className="mb-6 relative cursor-pointer" onClick={onOpenStories}>
      <div className="relative inline-flex items-center justify-center w-28 h-28 md:w-36 md:h-36">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 animate-spin-slow"></div>
        <motion.div 
          className="relative w-[90%] h-[90%] rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1.05 }}
        >
          <Image
            src="/images/logo-header.webp"
            alt="Pizzería Donatello Logo"
            width={160}
            height={160}
            className="object-contain relative z-10"
          />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="absolute top-[calc(100% + 10px)] left-1/2 transform -translate-x-1/2 bg-yellow-400 text-red-800 text-sm px-3 py-1 rounded-full shadow-lg font-semibold z-20"
      >
        ¡Novedades!
      </motion.div>
      <AnimatePresence>
        {!isBusinessOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-4 -right-4 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-lg font-bold z-30"
          >
            CERRADO
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroContent: React.FC = () => (
  <motion.div
    className="text-[clamp(3rem,6vw,6rem)] font-bold mb-4 leading-tight tracking-tight bg-gradient-to-br from-red-600 via-red-400 to-yellow-400 text-transparent bg-clip-text drop-shadow-md"
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <Image
      width={440}
      height={440}
      src="/images/nombre.webp"
      alt="Pizzería Donatello"
      className="w-full h-auto object-cover"
    />
  </motion.div>
);

const CTAButtons: React.FC = () => (
  <motion.div
    className="grid grid-cols-2 gap-2 sm:flex sm:flex-row justify-center items-center mb-8"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <a
      href="#productos"
      className="flex items-center justify-center w-full sm:w-auto bg-red-600 text-white 
        p-2 sm:p-3 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:bg-red-700 
        transition duration-300 transform hover:scale-105"
    >
      <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="hidden sm:inline ml-2">Ver Menú</span>
    </a>

    <a
      href="https://wa.me/+543442670573"
      className="flex items-center justify-center w-full sm:w-auto bg-green-600 text-white 
        p-2 sm:p-3 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:bg-green-700 
        transition duration-300 transform hover:scale-105"
    >
      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="hidden sm:inline ml-2">Ordenar Ahora</span>
    </a>
  </motion.div>
);

type OpeningHours = {
  open: { hour: number; minute: number };
  close: { hour: number; minute: number };
};

type WeeklySchedule = {
  [key: number]: OpeningHours | null;
};

interface InfoSectionProps {
  setIsBusinessOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoSection: React.FC<InfoSectionProps> = ({ setIsBusinessOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();

      const openingHours: WeeklySchedule = {
        0: { open: { hour: 20, minute: 0 }, close: { hour: 23, minute: 30 } },
        1: { open: { hour: 20, minute: 0 }, close: { hour: 23, minute: 30 } },
        2: null,
        3: { open: { hour: 20, minute: 0 }, close: { hour: 23, minute: 30 } },
        4: null,
        5: { open: { hour: 20, minute: 0 }, close: { hour: 23, minute: 30 } },
        6: { open: { hour: 20, minute: 0 }, close: { hour: 23, minute: 30 } },
      };

      const todaySchedule = openingHours[day];

      if (todaySchedule) {
        const currentTime = hour * 60 + minute;
        const openTime = todaySchedule.open.hour * 60 + todaySchedule.open.minute;
        const closeTime = todaySchedule.close.hour * 60 + todaySchedule.close.minute;

        const isWithinHours = currentTime >= openTime && currentTime <= closeTime;
        setIsOpen(isWithinHours);
        setIsBusinessOpen(isWithinHours);
      } else {
        setIsOpen(false);
        setIsBusinessOpen(false);
      }
    };

    checkIfOpen();
    const intervalId = setInterval(checkIfOpen, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [setIsBusinessOpen]);

  return (
    <section className="w-full max-w-5xl mx-auto mt-8 px-4">
      <div className="text-center mb-6">
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-lg ${
            isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          } transition duration-300 ease-in-out shadow-md`}
        >
          <p className={`flex items-center gap-2 ${isOpen ? "text-green-800" : "text-red-800"}`}>
            <span className={`w-4 h-4 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`} />
            {isOpen ? "¡Abierto!" : "Cerrado"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        <InfoItem
          icon={MapPin}
          text={
            <a
              href="https://maps.app.goo.gl/jPRCfBXGcUdUMJso7"
              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 ease-in-out"
            >
              Congreso de Tucuman 784
            </a>
          }
          label="Ubicación"
        />
        <InfoItem
          icon={Phone}
          text={
            <a
              href="https://wa.me/+543442670573"
              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 ease-in-out"
            >
              +54 3442 670573
            </a>
          }
          label="Contacto"
        />
        <InfoItem
          icon={Clock}
          text="Lun, Mié, Vie, Sáb y Dom, 20:00 - 23:30"
          label="Horario"
        />
      </div>
    </section>
  );
};

interface InfoItemProps {
  icon: React.ElementType;
  text: React.ReactNode;
  label: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, text, label }) => (
  <motion.div
    className="flex flex-col items-center bg-black/70 backdrop-blur-sm p-4 rounded-xl shadow-md transition duration-300 hover:bg-black/80 w-full max-w-xs"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full mb-2">
      <Icon className="h-6 w-6 text-red-800" />
    </div>
    <div className="text-center">
      <h3 className="text-lg font-semibold text-yellow-400 mb-1">{label}</h3>
      <p className="text-sm text-white">{text}</p>
    </div>
  </motion.div>
);

export default HeroSection;

const StoriesLogo: React.FC<{ onOpenStories: () => void }> = ({
  onOpenStories,
}) => {
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
      <div className="relative inline-flex items-center justify-center w-32 h-32 cursor-pointer">
        <div
          className="absolute w-36 h-36 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, #FFD700, #FF4500, #32CD32, #FFD700)",
            padding: "4px",
          }}
        >
          <div className="flex items-center justify-center w-full h-full bg-white rounded-full">
            <Image
              src="/images/logo.webp"
              alt="Logo"
              width={128}
              height={128}
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
            ¡Novedades!
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
