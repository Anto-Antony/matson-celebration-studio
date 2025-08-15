import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Heart, 
  User, 
  LogOut, 
  Menu,
  X,
  Settings,
  FileText,
  Sparkles,
  Bell
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
      path: "/partner/dashboard",
      description: "Main dashboard",
      badge: null
    },
    {
      name: "Wedding Details",
      icon: Heart,
      path: "/partner/wedding-details",
      description: "Manage wedding information",
      badge: "New"
    },
    {
      name: "Client Management",
      icon: User,
      path: "/partner/manage-clients",
      description: "Manage client information",
      badge: null
    },
    {
      name: "Reports",
      icon: FileText,
      path: "/partner/reports",
      description: "View reports and analytics",
      badge: null
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      description: "Account settings",
      badge: null
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onOutsideClick}
        />
      )}

      {/* Desktop overlay for outside click */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 hidden md:block"
          onClick={onOutsideClick}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white/95 backdrop-blur-md shadow-2xl z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:z-auto
        w-72 border-r border-gray-200/50
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Matson Tech
              </h1>
              <p className="text-xs text-gray-500">Partner Portal</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="md:hidden hover:bg-white/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200/50 bg-white/50">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12 border-2 border-white shadow-md">
              <AvatarImage src="" alt={user.email || "User"} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.email}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  Partner
                </Badge>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-gray-100"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
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
                  w-full justify-start space-x-3 h-12 px-4 rounded-xl transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700'
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
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          item.badge === "New" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs opacity-70 mt-0.5">{item.description}</p>
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-slate-50">
          <Button
            variant="outline"
            className="w-full justify-start space-x-3 h-12 text-gray-700 hover:bg-red-50 hover:text-red-600 border-gray-300 hover:border-red-300 transition-all duration-200"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </Button>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Matson Wedding Studio v1.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
