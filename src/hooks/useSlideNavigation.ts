import { useCallback, useEffect } from 'react';

interface UseSlideNavigationOptions {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
}

export function useSlideNavigation({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
}: UseSlideNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          event.preventDefault();
          if (currentSlide < totalSlides - 1) {
            onNext();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          if (currentSlide > 0) {
            onPrev();
          }
          break;
      }
    },
    [currentSlide, totalSlides, onNext, onPrev],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
