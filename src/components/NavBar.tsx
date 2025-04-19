
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import LoginSignup from './LoginSignup';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/supabase';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="font-poppins font-bold text-2xl text-raahi-blue">
                  <span className="text-raahi-orange">R</span>aahi
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="font-medium text-gray-600 hover:text-raahi-blue transition">Home</Link>
              <Link to="/travel-packages" className="font-medium text-gray-600 hover:text-raahi-blue transition">Travel Packages</Link>
              <Link to="/explore-india" className="font-medium text-gray-600 hover:text-raahi-blue transition">Explore India</Link>
              <Link to="/scrapbook" className="font-medium text-gray-600 hover:text-raahi-blue transition">Scrapbook</Link>
              <Link to="/social-feed" className="font-medium text-gray-600 hover:text-raahi-blue transition">Travelgram</Link>
              <Link to="/trip-tracker" className="font-medium text-gray-600 hover:text-raahi-blue transition">Trip Tracker</Link>
              <Link to="/faq" className="font-medium text-gray-600 hover:text-raahi-blue transition">FAQ</Link>
            </div>
            
            <div className="hidden md:flex">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 cursor-pointer">
                      <AvatarImage src={user?.avatar_url || ''} alt={user?.name || ''} />
                      <AvatarFallback className="bg-raahi-blue text-white">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">
                      {user?.name || user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost" 
                  className="text-raahi-blue hover:text-raahi-blue-dark hover:bg-raahi-blue-light/30"
                  onClick={() => setLoginModalOpen(true)}
                >
                  Login / Signup
                </Button>
              )}
            </div>
            
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-gray-600 hover:text-raahi-blue transition"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-xl">
              <Link 
                to="/" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-raahi-blue-light hover:text-raahi-blue transition"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/travel-packages" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-raahi-blue-light hover:text-raahi-blue transition"
                onClick={() => setIsOpen(false)}
              >
                Travel Packages
              </Link>
              <Link 
                to="/explore-india" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-raahi-blue-light hover:text-raahi-blue transition"
                onClick={() => setIsOpen(false)}
              >
                Explore India
              </Link>
              <Link 
                to="/scrapbook" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-raahi-blue-light hover:text-raahi-blue transition"
                onClick={() => setIsOpen(false)}
              >
                Scrapbook
              </Link>
              <Link 
                to="/social-feed" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-raahi-blue-light hover:text-raahi-blue transition"
                onClick={() => setIsOpen(false)}
              >
                Travelgram
              </Link>
              <Link 
                to="/trip-tracker" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-raahi-blue-light hover:text-raahi-blue transition"
                onClick={() => setIsOpen(false)}
              >
                Trip Tracker
              </Link>
              <Link 
                to="/faq" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-raahi-blue-light hover:text-raahi-blue transition"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </Link>
              
              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url || ''} />
                      <AvatarFallback className="bg-raahi-blue text-white">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user?.name || user?.email}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-3 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-3 text-raahi-blue hover:bg-raahi-blue-light/30"
                  onClick={() => {
                    setIsOpen(false);
                    setLoginModalOpen(true);
                  }}
                >
                  Login / Signup
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginSignup isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default NavBar;
