import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, Heart, Globe, Gift, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWedding } from '@/app/wedding/contexts/WeddingContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Create a safe hook that won't throw if context is not available
const useSafeWedding = () => {
  try {
    return useWedding();
  } catch (error) {
    // Return default values when outside WeddingProvider
    return {
      user: null,
      isLoggedIn: false,
      logout: async () => {},
      globalIsLoading: false,
    };
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  
  // Use the safe wedding context
  const { user, isLoggedIn, logout, globalIsLoading } = useSafeWedding();
  
  // Add a small delay to prevent flash of incorrect state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Don't render auth-dependent UI until we've had a chance to check auth state
  if (!isMounted || globalIsLoading) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-matson-red">
                Matson Celebration Studio
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '#home' },
    { name: 'About', path: '#about' },
    { name: 'Contact', path: '#contact' },
  ];

  const inviteItems = [
    { name: 'Invitation Card', path: '/gallery' },
    { name: 'Wedding Website', path: '/website' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/index';
    }
    return location.pathname === path;
  };

  const handleNavClick = (item: { name: string; path: string }) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll to section
      setTimeout(() => {
        const target = document.querySelector(item.path);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on home page, just scroll to section
      const target = document.querySelector(item.path);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-6 flex-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="text-sm font-medium transition-all duration-300 hover:text-primary relative text-foreground group py-2 px-3 rounded-lg hover:bg-primary/5"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
              >
                {item.name}
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </a>
            ))}
            
            {/* Invite Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary text-foreground focus:outline-none">
                Invite
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Invitation Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {inviteItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link to={item.path} className="w-full">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Logo - Centered */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center group">
              <img 
                src="/lovable-uploads/dc1e0084-194d-4369-b13d-34b7f7d3629e.png" 
                alt="Matson Cards" 
                className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-200" 
              />
            </Link>
          </div>

          {/* Right Navigation - Login Button */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 justify-end">
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
              <ShoppingCart className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-4">
              {globalIsLoading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.bride_name && user?.groom_name 
                            ? `${user.groom_name} & ${user.bride_name}`
                            : 'Wedding Account'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/wedding/edit')}>
                      Wedding Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                  className="text-foreground hover:text-primary hover:bg-transparent"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              {isLoggedIn && (
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={() => user?.bride_name && user?.groom_name ? 
                    navigate('/wedding/edit') : 
                    navigate('#')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {user?.bride_name && user?.groom_name ? 'My Website' : 'Create Website'}
                </Button>
              )}
            </div>
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
          <div className="lg:hidden border-t border-border py-4 bg-white">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    handleNavClick(item);
                  }}
                  className="text-sm font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:bg-primary/5 hover:text-primary flex items-center space-x-3 text-foreground group hover:shadow-sm"
                >
                  {item.name === 'Home' && <Heart className="w-4 h-4" />}
                  <span>{item.name}</span>
                </a>
              ))}
              
              {/* Mobile Invite Section */}
              <div className="py-2">
                <div className="text-sm font-medium text-foreground px-4 py-2 bg-gray-50 rounded-md">
                  Invite
                </div>
                {inviteItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 px-8 rounded-md transition-colors hover:bg-gray-50 flex items-center space-x-2 ${
                      isActive(item.path) ? 'text-primary bg-primary/10' : 'text-foreground'
                    }`}
                  >
                    {item.name === 'Invitation Card' && <Gift className="w-4 h-4" />}
                    {item.name === 'Wedding Website' && <Globe className="w-4 h-4" />}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="px-4 pt-4 space-y-3 border-t border-border mt-4">
                {isLoggedIn && user ? (
                  <div className="space-y-3">
                    <div className="text-center py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                      <p className="font-medium">
                        {user.bride_name && user.groom_name 
                          ? `${user.bride_name} & ${user.groom_name}`
                          : user.bride_name || user.groom_name || 'User'
                        }
                      </p>
                      <p className="text-xs opacity-90">{user.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          navigate('/wedding/dashboard');
                          setIsOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          navigate('/wedding/edit');
                          setIsOpen(false);
                        }}
                      >
                        Create Website
                      </Button>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
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
                  <Button 
                    className="w-full bg-matson-black hover:bg-matson-black/90 text-white rounded-full flex items-center justify-center space-x-2"
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                )}
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;