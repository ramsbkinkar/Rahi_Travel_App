import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';
import LoginSignup from './LoginSignup';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const NavBar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const navigationLinks = [
    { to: "/", label: "Home" },
    { to: "/feed", label: "Feed" },
    { to: "/travel-packages", label: "Travel Packages" },
    { to: "/explore-india", label: "Explore" },
    { to: "/scrapbook", label: "Scrapbook" },
    { to: "/trip-tracker", label: "Trip Tracker" },
    { to: "/faq", label: "FAQ" }
  ];

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-poppins font-bold text-2xl text-raahi-blue">
                <span className="text-raahi-orange">R</span>aahi
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-raahi-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Sheet open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                <SheetTrigger asChild>
                  <Button variant="default">Sign In</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Welcome to Raahi</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <LoginSignup
                      isOpen={isAuthOpen}
                      onClose={() => setIsAuthOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Mobile Navigation */}
            <div className="flex md:hidden ml-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 flex flex-col space-y-2">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="text-gray-600 hover:text-raahi-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
