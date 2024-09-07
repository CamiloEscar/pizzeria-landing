import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingCart, X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Image from 'next/image';
import { useStories } from './useStories'; // Custom hook for Stories logic

interface HeaderProps {
  scrollToSection: (section: string) => void;
  getTotalItems: () => number;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCartOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ scrollToSection, getTotalItems, setIsCartOpen, isCartOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    isStoriesOpen, 
    setIsStoriesOpen, 
    currentStoryIndex, 
    storyProgress, 
    isPaused, 
    nextStory, 
    prevStory, 
    togglePause,
    storyImages
  } = useStories();

  const navItems = [
    { name: "Inicio", section: "inicio" },
    { name: "Menú", section: "productos" },
    { name: "Combos", section: "combos" },
    { name: "Armar Pedido", section: "armar-pedido" },
    { name: "Contacto", section: "contacto" },
  ];

  const handleNavItemClick = useCallback((section: string) => {
    scrollToSection(section);
    setIsMenuOpen(false);
  }, [scrollToSection]);

  return (
    <>
      <header className="bg-white bg-opacity-50 backdrop-blur-lg shadow-md py-2 md:py-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-2 md:px-4 max-w-screen-lg flex items-center justify-between">
          <Logo onOpenStories={() => setIsStoriesOpen(true)} />
          <DesktopNavigation navItems={navItems} onItemClick={handleNavItemClick} />
          <MobileNavigation navItems={navItems} onItemClick={handleNavItemClick} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <CartButton getTotalItems={getTotalItems} setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen} />
        </div>
      </header>

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

const Logo: React.FC<{ onOpenStories: () => void }> = ({ onOpenStories }) => (
  <motion.div 
    className="relative flex items-center justify-center w-16 h-16 cursor-pointer"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    onClick={onOpenStories}
  >
    <div className="relative flex items-center justify-center w-16 h-16">
      <div 
        className="absolute w-18 h-18 rounded-full p-1"
        style={{ 
          background: 'conic-gradient(from 0deg at 50% 50%, yellow, red, green, yellow)', 
          padding: '4px'
        }}
      >
        <div className="flex items-center justify-center w-full h-full bg-white rounded-full">
          <Image src="/images/logo-header.png" alt="Logo" width={76} height={76} className="object-contain relative z-10" />
        </div>
      </div>
    </div>
  </motion.div>
);

const DesktopNavigation: React.FC<{ navItems: Array<{ name: string, section: string }>, onItemClick: (section: string) => void }> = ({ navItems, onItemClick }) => (
  <nav className="hidden md:flex flex-grow justify-center items-center space-x-4">
    {navItems.map((item, index) => (
      <motion.div
        key={item.section}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Button
          variant="ghost"
          className="text-gray-800 hover:text-red-600 transition duration-300"
          onClick={() => onItemClick(item.section)}
        >
          {item.name}
        </Button>
      </motion.div>
    ))}
  </nav>
);

const MobileNavigation: React.FC<{ 
  navItems: Array<{ name: string, section: string }>, 
  onItemClick: (section: string) => void,
  isMenuOpen: boolean,
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ navItems, onItemClick, isMenuOpen, setIsMenuOpen }) => (
  <div className="md:hidden flex items-center space-x-4">
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-red-600 mb-4">PIZZERÍA</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {navItems.map((item) => (
            <Button
              key={item.section}
              variant="ghost"
              className="w-full justify-start text-lg"
              onClick={() => onItemClick(item.section)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  </div>
);

const CartButton: React.FC<{ 
  getTotalItems: () => number, 
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>, 
  isCartOpen: boolean 
}> = ({ getTotalItems, setIsCartOpen, isCartOpen }) => (
  <motion.div
    className="relative bg-red-600 text-white rounded-full p-2 cursor-pointer shadow-lg ml-2 md:ml-4"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => setIsCartOpen(!isCartOpen)}
    aria-label="Cart"
  >
    <ShoppingCart size={24} />
    <AnimatePresence>
      {getTotalItems() > 0 && (
        <motion.span
          key="cart-count"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1 -right-1 bg-red-800 text-xs text-white rounded-full px-2 py-1"
        >
          {getTotalItems()}
        </motion.span>
      )}
    </AnimatePresence>
  </motion.div>
);

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
  storyImages 
}) => {
  const storyData = [
    { username: "donatello.ok", timestamp: "2h", profilePic: "/images/logo.jpeg" },
    { username: "donatello.ok", timestamp: "5h", profilePic: "/images/logo.jpeg" },
    { username: "donatello.ok", timestamp: "1d", profilePic: "/images/logo.jpeg" },
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
                      <h3 className="text-white font-semibold">{storyData[currentStoryIndex].username}</h3>
                      <p className="text-gray-300 text-sm">{storyData[currentStoryIndex].timestamp}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <CloseButton onClose={onClose} />
            <ProgressBar storyImages={storyImages} currentStoryIndex={currentStoryIndex} storyProgress={storyProgress} />
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
  storyImages: string[], 
  currentStoryIndex: number, 
  storyProgress: number 
}> = ({ storyImages, currentStoryIndex, storyProgress }) => (
  <div className="absolute top-0 left-0 right-0 flex justify-center space-x-1 p-2 z-10">
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
);

const NavigationButtons: React.FC<{ prevStory: () => void, nextStory: () => void }> = ({ prevStory, nextStory }) => (
  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
    <button
      className="text-white bg-black bg-opacity-50 rounded-full p-2 transition-colors hover:bg-opacity-75"
      onClick={(e) => { e.stopPropagation(); prevStory(); }}
      aria-label="Previous story"
    >
      <ChevronLeft size={24} />
    </button>
    <button
      className="text-white bg-black bg-opacity-50 rounded-full p-2 transition-colors hover:bg-opacity-75"
      onClick={(e) => { e.stopPropagation(); nextStory(); }}
      aria-label="Next story"
    >
      <ChevronRight size={24} />
    </button>
  </div>
);

const PausePlayButton: React.FC<{ isPaused: boolean, togglePause: () => void }> = ({ isPaused, togglePause }) => (
  <button
    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 transition-colors hover:bg-opacity-75"
    onClick={(e) => { e.stopPropagation(); togglePause(); }}
    aria-label={isPaused ? "Play story" : "Pause story"}
  >
    {isPaused ? <Play size={16} /> : <Pause size={16} />}
  </button>
);

export default Header;