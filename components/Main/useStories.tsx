import { useState, useEffect, useCallback } from 'react';

export const useStories = () => {
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const storyImages = [
    "/images/story1.jpg",
    "/images/story2.jpg",
    "/images/story3.jpg",
    // Add more story image paths as needed
  ];

  const nextStory = useCallback(() => {
    if (currentStoryIndex < storyImages.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setStoryProgress(0);
    } else {
      setIsStoriesOpen(false);
    }
  }, [currentStoryIndex, storyImages.length]);

  const prevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setStoryProgress(0);
    }
  }, [currentStoryIndex]);

  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStoriesOpen && !isPaused) {
      timer = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isStoriesOpen, isPaused, nextStory]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isStoriesOpen) {
        switch (event.key) {
          case 'ArrowRight':
            nextStory();
            break;
          case 'ArrowLeft':
            prevStory();
            break;
          case 'Escape':
            setIsStoriesOpen(false);
            break;
          case ' ':
            togglePause();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStoriesOpen, nextStory, prevStory, togglePause]);

  return {
    isStoriesOpen,
    setIsStoriesOpen,
    currentStoryIndex,
    storyProgress,
    isPaused,
    nextStory,
    prevStory,
    togglePause,
    storyImages,
  };
};