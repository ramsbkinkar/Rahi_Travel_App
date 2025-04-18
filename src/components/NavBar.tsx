
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginSignup from './LoginSignup';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
              <Button 
                variant="ghost" 
                className="text-raahi-blue hover:text-raahi-blue-dark hover:bg-raahi-blue-light/30"
                onClick={() => setLoginModalOpen(true)}
              >
                Login / Signup
              </Button>
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
            </div>
          </div>
        )}
      </nav>

      <LoginSignup isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default NavBar;
