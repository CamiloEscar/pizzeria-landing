import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const Stories: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const storyImages = [
    "/images/story1.jpg",
    "/images/story2.jpg",
    "/images/story3.jpg",
    // Agrega más rutas de imágenes según sea necesario
  ];

  const nextStory = useCallback(() => {
    if (currentStoryIndex < storyImages.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setStoryProgress(0); // Reinicia el progreso al cambiar de historia
    } else {
      onClose();
    }
  }, [currentStoryIndex, onClose, storyImages.length]);

  const prevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setStoryProgress(0); // Reinicia el progreso al cambiar de historia
    }
  }, [currentStoryIndex]);

  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !isPaused) {
      timer = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            nextStory();
            return 0; // Reinicia el progreso después de completar la historia
          }
          return prev + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPaused, nextStory]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen) {
        if (event.key === 'ArrowRight') {
          nextStory();
        } else if (event.key === 'ArrowLeft') {
          prevStory();
        } else if (event.key === 'Escape') {
          onClose();
        } else if (event.key === ' ') {
          togglePause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextStory, prevStory, onClose, togglePause]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div 
            className="relative w-full h-full max-w-lg max-h-[80vh] bg-black bg-opacity-90 rounded-lg overflow-hidden shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStoryIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
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
              </motion.div>
            </AnimatePresence>
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 transition-colors hover:bg-opacity-75"
              onClick={onClose}
              aria-label="Close stories"
            >
              <X size={24} />
            </button>
            <div className="absolute top-0 left-0 right-0 flex justify-center space-x-2 p-2">
              {storyImages.map((_, index) => (
                <div key={index} className="h-1 bg-gray-500 flex-grow rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: index === currentStoryIndex ? `${storyProgress}%` : index < currentStoryIndex ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button
                className="text-white bg-black bg-opacity-50 rounded-full p-3 transition-colors hover:bg-opacity-75"
                onClick={(e) => { e.stopPropagation(); prevStory(); }}
                aria-label="Previous story"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="text-white bg-black bg-opacity-50 rounded-full p-3 transition-colors hover:bg-opacity-75"
                onClick={(e) => { e.stopPropagation(); nextStory(); }}
                aria-label="Next story"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 transition-colors hover:bg-opacity-75"
              onClick={(e) => { e.stopPropagation(); togglePause(); }}
              aria-label={isPaused ? "Play story" : "Pause story"}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Stories;
