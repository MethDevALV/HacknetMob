
import { useState, useRef, useCallback } from 'react';

interface GestureState {
  isGesturing: boolean;
  startPosition: { x: number; y: number } | null;
  currentPosition: { x: number; y: number } | null;
  gestureType: 'swipe' | 'tap' | 'hold' | null;
}

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

export const useGestureHandler = (handlers: GestureHandlers) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isGesturing: false,
    startPosition: null,
    currentPosition: null,
    gestureType: null
  });

  const touchStartTime = useRef<number>(0);
  const lastTapTime = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const position = { x: touch.clientX, y: touch.clientY };
    
    touchStartTime.current = Date.now();
    
    setGestureState({
      isGesturing: true,
      startPosition: position,
      currentPosition: position,
      gestureType: null
    });

    // Start long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    longPressTimer.current = setTimeout(() => {
      handlers.onLongPress?.();
      setGestureState(prev => ({ ...prev, gestureType: 'hold' }));
    }, 500);
  }, [handlers]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!gestureState.isGesturing || !gestureState.startPosition) return;
    
    const touch = e.touches[0];
    const currentPosition = { x: touch.clientX, y: touch.clientY };
    
    setGestureState(prev => ({
      ...prev,
      currentPosition,
      gestureType: 'swipe'
    }));

    // Cancel long press if moving
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, [gestureState.isGesturing, gestureState.startPosition]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!gestureState.startPosition || !gestureState.currentPosition) return;

    const deltaX = gestureState.currentPosition.x - gestureState.startPosition.x;
    const deltaY = gestureState.currentPosition.y - gestureState.startPosition.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const touchDuration = Date.now() - touchStartTime.current;

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Handle different gesture types
    if (distance < 10 && touchDuration < 300) {
      // Tap gesture
      const currentTime = Date.now();
      const timeSinceLastTap = currentTime - lastTapTime.current;
      
      if (timeSinceLastTap < 300) {
        // Double tap
        handlers.onDoubleTap?.();
      } else {
        // Single tap
        handlers.onTap?.();
      }
      
      lastTapTime.current = currentTime;
    } else if (distance > 50) {
      // Swipe gesture
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    }

    setGestureState({
      isGesturing: false,
      startPosition: null,
      currentPosition: null,
      gestureType: null
    });
  }, [gestureState, handlers]);

  return {
    gestureState,
    gestureHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
};
