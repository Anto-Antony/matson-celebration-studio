import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Heart, 
  User, 
  LogOut, 
  Menu,
  X,
  Settings,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOutsideClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onOutsideClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message || "Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const navigationItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/wedding-details",
      description: "Main dashboard"
    },
    {
      name: "Wedding Details",
      icon: Heart,
      path: "/wedding-details",
      description: "Manage wedding information"
    },
    {
      name: "Client Management",
      icon: User,
      path: "/clients",
      description: "Manage client information"
    },
    {
      name: "Reports",
      icon: FileText,
      path: "/reports",
      description: "View reports and analytics"
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      description: "Account settings"
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user) {
    return null; // Don't render sidebar if user is not logged in
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onOutsideClick}
        />
      )}

      {/* Desktop overlay for outside click */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 hidden md:block"
          onClick={onOutsideClick}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:z-auto
        w-64 border-r border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#6B2D3C] rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-[#6B2D3C]">Matson Tech</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="md:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#F9E4E6] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#6B2D3C]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500">Partner</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`
                  w-full justify-start space-x-3 h-12
                  ${isActive(item.path) 
                    ? 'bg-[#6B2D3C] text-white hover:bg-[#4A1F2A]' 
                    : 'text-gray-700 hover:bg-[#F9E4E6] hover:text-[#6B2D3C]'
                  }
                `}
                onClick={() => {
                  navigate(item.path);
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 768) {
                    onToggle();
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full justify-start space-x-3 h-12 text-gray-700 hover:bg-red-50 hover:text-red-600 border-gray-300"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
