import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, LogOut, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeddingAuth } from '../templates/[slag]/contexts/WeddingAuthContext';
import { useToast } from '@/hooks/use-toast';

const WeddingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user, logout } = useWeddingAuth();

  const navItems = [
    { name: 'About Us', path: '/about' },
    { name: 'Browse Cards', path: '/gallery' },
    { name: 'Browse Website', path: '/website' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your wedding account",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  const handleWeddingLogin = () => {
    navigate('/wedding/login');
  };

  const handleWeddingDashboard = () => {
    if (user) {
      navigate(`/wedding/${user.id}`);
    }
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Logo - Centered */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/lovable-uploads/dc1e0084-194d-4369-b13d-34b7f7d3629e.png" 
              alt="Matson Cards" 
              className="h-24 w-auto object-contain group-hover:scale-105 transition-smooth" 
            />
          </Link>

          {/* Right Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            
            {/* Wedding Authentication Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full flex items-center space-x-2"
                  onClick={handleWeddingDashboard}
                >
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span>My Wedding</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full flex items-center space-x-2"
                onClick={handleWeddingLogin}
              >
                <Heart className="w-4 h-4 text-purple-600" />
                <span>Wedding Login</span>
              </Button>
            )}
            
            <Button size="sm" className="bg-matson-black hover:bg-matson-black/90 text-white rounded-full px-6">
              Get started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium py-2 px-4 rounded-md transition-colors hover:bg-muted ${
                    isActive(item.path) ? 'text-primary bg-muted' : 'text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Wedding Authentication */}
              {isLoggedIn ? (
                <div className="px-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full flex items-center justify-center space-x-2"
                    onClick={() => {
                      handleWeddingDashboard();
                      setIsOpen(false);
                    }}
                  >
                    <Heart className="w-4 h-4 text-purple-600" />
                    <span>My Wedding</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full rounded-full"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="px-4">
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full flex items-center justify-center space-x-2"
                    onClick={() => {
                      handleWeddingLogin();
                      setIsOpen(false);
                    }}
                  >
                    <Heart className="w-4 h-4 text-purple-600" />
                    <span>Wedding Login</span>
                  </Button>
                </div>
              )}
              
              <div className="px-4 pt-4">
                <Button className="w-full bg-matson-black hover:bg-matson-black/90 text-white rounded-full">
                  Get started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default WeddingNavbar; 