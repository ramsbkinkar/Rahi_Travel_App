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
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

const NavBar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const navigationLinks = [
    { to: "/", label: "Home" },
    { to: "/travel-packages", label: "Travel Packages" },
    { to: "/explore-india", label: "Explore" },
    { to: "/scrapbook", label: "Scrapbook" },
    { to: "/trip-tracker", label: "Trip Tracker" },
    { to: "/faq", label: "FAQ" }
  ];

  const handleSignOut = async () => {
    try {
      await apiClient.signOut();
      window.location.reload();
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">Raahi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 flex-1">
          {navigationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 md:flex-none items-center justify-end space-x-2">
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-6">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
