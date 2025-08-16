import { isIOS } from './platformUtils';

export const setupSwipeGesture = (element: HTMLElement, onSwipeRight: () => void) => {
  if (!isIOS()) return;
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    touchEndX = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (touchEndX - touchStartX > 100) {
      // Swipe right detected
      onSwipeRight();
    }
    touchStartX = 0;
    touchEndX = 0;
  };
  
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchmove', handleTouchMove, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};