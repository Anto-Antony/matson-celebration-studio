import { useState, useEffect, useRef, useCallback } from 'react';

export const useResizableSidebar = (initialWidth: number = 320) => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const handleMouseMoveRef = useRef<(e: MouseEvent) => void>();
  const stopResizingRef = useRef<() => void>();

  // Create stable event handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newWidth = startWidthRef.current + e.clientX - startXRef.current;
    const minWidth = 250;
    const maxWidth = 600;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    if (handleMouseMoveRef.current) {
      document.removeEventListener('mousemove', handleMouseMoveRef.current);
    }
    if (stopResizingRef.current) {
      document.removeEventListener('mouseup', stopResizingRef.current);
    }
  }, []);

  // Update refs when handlers change
  useEffect(() => {
    handleMouseMoveRef.current = handleMouseMove;
    stopResizingRef.current = stopResizing;
  }, [handleMouseMove, stopResizing]);

  // Handle mouse down for resizing
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarRef.current?.offsetWidth || sidebarWidth;
    if (handleMouseMoveRef.current) {
      document.addEventListener('mousemove', handleMouseMoveRef.current, { passive: false });
    }
    if (stopResizingRef.current) {
      document.addEventListener('mouseup', stopResizingRef.current, { passive: true });
    }
  }, [sidebarWidth]);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      if (handleMouseMoveRef.current) {
        document.removeEventListener('mousemove', handleMouseMoveRef.current);
      }
      if (stopResizingRef.current) {
        document.removeEventListener('mouseup', stopResizingRef.current);
      }
    };
  }, []);

  return {
    isResizing,
    sidebarRef,
    sidebarWidth,
    startResizing
  };
};