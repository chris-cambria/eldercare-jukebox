
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, MessageSquare, LogIn, Mic, MicOff, Phone, AlertTriangle, LogOut } from 'lucide-react';
import { useVoiceNavigation } from '../providers/VoiceNavigationProvider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  onLogout?: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isListening, toggleVoiceControl, isSupported } = useVoiceNavigation();

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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/signup');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 
      ${isScrolled ? 'glass shadow-sm' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <Bell className="h-10 w-10 text-primary" />
            <span className="text-2xl font-semibold">ஆறாவெல்</span>
          </Link>

          {/* Voice control button - Made larger with blue background */}
          {isSupported && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={toggleVoiceControl}
                    className="mr-2 md:mr-4 h-14 w-14 rounded-full bg-primary hover:bg-primary/90"
                    size="icon"
                  >
                    {isListening ? (
                      <Mic className="h-8 w-8 text-white" />
                    ) : (
                      <MicOff className="h-8 w-8 text-white" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-lg">
                  <p>{isListening ? 'குரல் கட்டுப்பாட்டை நிறுத்து' : 'குரல் கட்டுப்பாட்டை செயல்படுத்து'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 transition-colors hover:text-primary text-xl ${isActive('/') ? 'text-primary' : ''}`}
            >
              <span>முகப்பு</span>
            </Link>
            <Link 
              to="/reminders" 
              className={`flex items-center space-x-2 transition-colors hover:text-primary text-xl ${isActive('/reminders') ? 'text-primary' : ''}`}
            >
              <span>நினைவூட்டல்கள்</span>
            </Link>
            <Link 
              to="/community" 
              className={`flex items-center space-x-2 transition-colors hover:text-primary text-xl ${isActive('/community') ? 'text-primary' : ''}`}
            >
              <span>சமூகம்</span>
            </Link>
            <Link 
              to="/voice-blog" 
              className={`flex items-center space-x-2 transition-colors hover:text-primary text-xl ${isActive('/voice-blog') ? 'text-primary' : ''}`}
            >
              <span>குரல் வலைப்பதிவு</span>
            </Link>
            <Link 
              to="/helpline" 
              className={`flex items-center space-x-2 transition-colors hover:text-primary text-xl ${isActive('/helpline') ? 'text-primary' : ''}`}
            >
              <Phone className="h-6 w-6" />
              <span>உதவி எண்</span>
            </Link>
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="flex items-center space-x-2 transition-colors hover:text-primary text-xl"
            >
              <LogOut className="h-6 w-6" />
              <span>வெளியேறு</span>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden flex items-center focus-ring rounded-md p-1"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Menu className="h-8 w-8" />
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
            className={`flex items-center space-x-3 p-2 rounded-md text-2xl ${isActive('/') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <Bell className="h-7 w-7" />
            <span>முகப்பு</span>
          </Link>
          <Link 
            to="/reminders" 
            className={`flex items-center space-x-3 p-2 rounded-md text-2xl ${isActive('/reminders') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <Bell className="h-7 w-7" />
            <span>நினைவூட்டல்கள்</span>
          </Link>
          <Link 
            to="/community" 
            className={`flex items-center space-x-3 p-2 rounded-md text-2xl ${isActive('/community') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <MessageSquare className="h-7 w-7" />
            <span>சமூகம்</span>
          </Link>
          <Link 
            to="/voice-blog" 
            className={`flex items-center space-x-3 p-2 rounded-md text-2xl ${isActive('/voice-blog') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <MessageSquare className="h-7 w-7" />
            <span>குரல் வலைப்பதிவு</span>
          </Link>
          <Link 
            to="/helpline" 
            className={`flex items-center space-x-3 p-2 rounded-md text-2xl ${isActive('/helpline') ? 'bg-primary/10 text-primary' : ''}`}
            onClick={closeMenu}
          >
            <Phone className="h-7 w-7" />
            <span>உதவி எண்</span>
          </Link>
          <Button 
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            variant="ghost"
            className="flex items-center justify-start space-x-3 p-2 w-full text-2xl"
          >
            <LogOut className="h-7 w-7" />
            <span>வெளியேறு</span>
          </Button>
          
          {/* Voice control in mobile menu */}
          {isSupported && (
            <Button 
              onClick={() => {
                toggleVoiceControl();
                closeMenu();
              }}
              variant="outline"
              className="flex items-center justify-start space-x-3 p-2 w-full text-2xl"
            >
              {isListening ? (
                <>
                  <Mic className="h-7 w-7 text-primary" />
                  <span>குரல் கட்டுப்பாட்டை நிறுத்து</span>
                </>
              ) : (
                <>
                  <MicOff className="h-7 w-7" />
                  <span>குரல் கட்டுப்பாட்டை செயல்படுத்து</span>
                </>
              )}
            </Button>
          )}
          
          {/* Emergency button in mobile menu */}
          <Link 
            to="#" 
            className="flex items-center space-x-3 p-2 rounded-md bg-red-100 text-red-600 text-2xl"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              window.open('tel:112', '_self');
            }}
          >
            <AlertTriangle className="h-7 w-7" />
            <span>அவசர உதவி</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
