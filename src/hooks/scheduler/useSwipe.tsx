import { useEffect, useRef } from "react";

export type SwipeDirection = "left" | "right";

interface SwipeOptions {
  elementSelector: string; // Örneğin: ".rbc-calendar"
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number; // Varsayılan: 40px
  lockDuration?: number; // Varsayılan: 600ms
}

/**
 * Tekerlek veya dokunmatik swipe hareketi algılar ve yön fonksiyonlarını çalıştırır.
 */
export default function useSwipe({
  elementSelector,
  onSwipeLeft,
  onSwipeRight,
  threshold = 40,
  lockDuration = 600,
}: SwipeOptions) {
  const gestureState = useRef({
    totalDX: 0,
    gestureActive: false,
    locked: false,
    lockTimer: 0,
    startX: 0,
  });

  // Güncel fonksiyonları ref ile sakla (render'da değişse bile hep güncel olur)
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);

  useEffect(() => {
    onSwipeLeftRef.current = onSwipeLeft;
    onSwipeRightRef.current = onSwipeRight;
  }, [onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    const el = document.querySelector(elementSelector);
    if (!el) return;

    const ORIENT_RATIO = 1.2;

    const resetGesture = () => {
      gestureState.current.totalDX = 0;
      gestureState.current.gestureActive = false;
    };

    const unlock = () => {
      gestureState.current.locked = false;
      resetGesture();
    };

    const handleWheel = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      const { deltaX, deltaY } = wheelEvent;

      if (Math.abs(deltaX) < Math.abs(deltaY) * ORIENT_RATIO) return;

      wheelEvent.preventDefault();
      gestureState.current.totalDX += deltaX;
      gestureState.current.gestureActive = true;

      if (
        !gestureState.current.locked &&
        Math.abs(gestureState.current.totalDX) > threshold
      ) {
        deltaX > 0 ? onSwipeLeftRef.current() : onSwipeRightRef.current();

        gestureState.current.locked = true;
        gestureState.current.totalDX = 0;

        clearTimeout(gestureState.current.lockTimer);
        gestureState.current.lockTimer = window.setTimeout(
          unlock,
          lockDuration
        );
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      gestureState.current.startX = t.clientX;
      resetGesture();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gestureState.current.locked) return;

      const dx = e.touches[0].clientX - gestureState.current.startX;

      if (Math.abs(dx) > threshold) {
        e.preventDefault();
        dx < 0 ? onSwipeLeftRef.current() : onSwipeRightRef.current();

        gestureState.current.locked = true;
        gestureState.current.lockTimer = window.setTimeout(
          unlock,
          lockDuration
        );
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart as EventListener, {
      passive: true,
    });
    el.addEventListener("touchmove", handleTouchMove as EventListener, {
      passive: false,
    });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart as EventListener);
      el.removeEventListener("touchmove", handleTouchMove as EventListener);
      clearTimeout(gestureState.current.lockTimer);
    };
  }, [elementSelector]);
}
