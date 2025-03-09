
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, MessageSquare, Mic, User } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 
      ${isScrolled ? 'glass shadow-sm' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <Bell className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">ElderCare</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : ''}`}
            >
              <span>Home</span>
            </Link>
            <Link 
              to="/reminders" 
              className={`flex items-center space-x-2 transition-colors hover:text-primary ${isActive('/reminders') ? 'text-primary' : ''}`}
            >
              <span>Reminders</span>
            </Link>
            <Link 
              to="/community" 
              className={`flex items-center space-x-2 transition-colors hover:text-primary ${isActive('/community') ? 'text-primary' : ''}`}
            >
              <span>Community</span>
            </Link>
            <Link 
              to="/voice-blog" 
              className={`flex items-center space-x-2 transition-colors hover:text-primary ${isActive('/voice-blog') ? 'text-primary' : ''}`}
            >
              <span>Voice Blog</span>
            </Link>
          </nav>

          {/* Sign In Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate('/sign-in')}
            className="hidden md:flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden flex items-center focus-ring rounded-md p-1"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-background transform ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } transition-all duration-300 ease-in-out pt-24`}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col space-y-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-3 p-2 rounded-md ${isActive('/') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <Bell className="h-5 w-5" />
            <span className="text-lg">Home</span>
          </Link>
          <Link 
            to="/reminders" 
            className={`flex items-center space-x-3 p-2 rounded-md ${isActive('/reminders') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <Bell className="h-5 w-5" />
            <span className="text-lg">Reminders</span>
          </Link>
          <Link 
            to="/community" 
            className={`flex items-center space-x-3 p-2 rounded-md ${isActive('/community') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-lg">Community</span>
          </Link>
          <Link 
            to="/voice-blog" 
            className={`flex items-center space-x-3 p-2 rounded-md ${isActive('/voice-blog') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <Mic className="h-5 w-5" />
            <span className="text-lg">Voice Blog</span>
          </Link>
          <Link 
            to="/sign-in" 
            className={`flex items-center space-x-3 p-2 rounded-md ${isActive('/sign-in') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <User className="h-5 w-5" />
            <span className="text-lg">Sign In</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
