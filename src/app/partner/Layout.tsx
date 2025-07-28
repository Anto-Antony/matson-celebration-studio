import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./sidebar/page";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar - Only render if enabled */}
      {sidebarEnabled && (
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} onOutsideClick={handleOutsideClick} />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Navigation Bar */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Sidebar Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebarEnabled}
                className="bg-white/50 shadow-sm border-gray-200 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                {sidebarEnabled ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              
              {sidebarEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="md:hidden bg-white/50 hover:bg-white"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              
              <div className="hidden md:block">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Matson Wedding Partner Portal
                </h2>
              </div>
            </div>

            {/* Right side header content */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64 bg-white/50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative bg-white/50 hover:bg-white"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Avatar */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                  <AvatarImage src="" alt={user.email || "User"} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500">Partner</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content with enhanced styling */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 