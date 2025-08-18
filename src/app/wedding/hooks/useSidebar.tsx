"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface SidebarContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Add display name for better debugging
SidebarContext.displayName = 'SidebarContext';

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  
  const toggleSidebar = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  // Close sidebar on small screen route change
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768) setOpen(false);
    };
    
    window.addEventListener('routechange', handleRouteChange);
    return () => window.removeEventListener('routechange', handleRouteChange);
  }, []);

  // Close sidebar on window resize for mobile
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };
    
    onResize(); // Set initial state
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Memoize context value
  const contextValue = {
    open,
    setOpen,
    toggleSidebar
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
