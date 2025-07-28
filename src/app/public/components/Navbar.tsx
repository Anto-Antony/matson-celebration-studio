import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, Heart, Globe, Gift, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('wedding_user');
    const storedIsLoggedIn = localStorage.getItem('wedding_isLoggedIn');
    
    if (storedUser && storedIsLoggedIn === 'true') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (e) {
        // Clear invalid data
        localStorage.removeItem('wedding_user');
        localStorage.removeItem('wedding_isLoggedIn');
        localStorage.removeItem('wedding_userId');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('wedding_user');
    localStorage.removeItem('wedding_isLoggedIn');
    localStorage.removeItem('wedding_userId');
    setUser(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'Wedding Websites', path: '/website' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/index';
    }
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary relative ${
                  isActive(item.path) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Logo - Centered */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/lovable-uploads/dc1e0084-194d-4369-b13d-34b7f7d3629e.png" 
              alt="Matson Cards" 
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-200" 
            />
          </Link>

          {/* Right Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.slice(4).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary relative ${
                  isActive(item.path) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}
            
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
                <ShoppingCart className="w-4 h-4" />
              </Button>
              
              {isLoggedIn && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>{user.bride_name || user.groom_name || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.bride_name && user.groom_name 
                            ? `${user.bride_name} & ${user.groom_name}`
                            : user.bride_name || user.groom_name || 'User'
                          }
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/wedding/dashboard')}>
                      Wedding Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/website')}>
                      Wedding Website
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  size="sm" 
                  className="bg-matson-black hover:bg-matson-black/90 text-white rounded-full px-6 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
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
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium py-3 px-4 rounded-md transition-colors hover:bg-gray-50 flex items-center space-x-2 ${
                    isActive(item.path) ? 'text-primary bg-primary/10' : 'text-foreground'
                  }`}
                >
                  {item.name === 'Home' && <Heart className="w-4 h-4" />}
                  {item.name === 'Services' && <Gift className="w-4 h-4" />}
                  {item.name === 'Wedding Websites' && <Globe className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              ))}
              
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
                          navigate('/website');
                          setIsOpen(false);
                        }}
                      >
                        Website
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