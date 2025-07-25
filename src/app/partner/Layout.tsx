import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./sidebar/page";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarEnabled, setSidebarEnabled] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarEnabled = () => {
    setSidebarEnabled(!sidebarEnabled);
    if (sidebarEnabled) {
      setSidebarOpen(false);
    }
  };

  const handleOutsideClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // If user is not logged in, render children without sidebar
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Only render if enabled */}
      {sidebarEnabled && (
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} onOutsideClick={handleOutsideClick} />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Sidebar Toggle Button - Moved to header */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebarEnabled}
                className="bg-white shadow-md border-[#D4AF37] text-[#6B2D3C] hover:bg-[#F9E4E6]"
              >
                {sidebarEnabled ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              
              {sidebarEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="md:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                Matson Wedding Partner Portal
              </h2>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 