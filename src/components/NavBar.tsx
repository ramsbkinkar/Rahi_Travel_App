import { useEffect, useState } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiClient } from '@/integration/api/client';
import { withApiOrigin } from '@/utils/apiBase';

const NavBar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const navigationLinks = [
    { to: "/", label: "Home" },
    { to: "/social-feed", label: "Feed" },
    { to: "/travel-packages", label: "Travel Packages" },
    { to: "/explore-india", label: "Explore" },
    { to: "/scrapbook", label: "Scrapbook" },
    { to: "/trip-tracker", label: "Trip Tracker" },
    { to: "/faq", label: "FAQ" }
  ];

  // Load avatar for navbar if logged in
  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setAvatarUrl(undefined);
        return;
      }
      try {
        const resp = await apiClient.getUserProfile(user.id);
        if (resp.status === 'success' && resp.data?.user) {
          const a = resp.data.user.avatar_url;
          if (a) {
            setAvatarUrl(withApiOrigin(a));
          } else {
            setAvatarUrl(undefined);
          }
        }
      } catch {
        // ignore; will fall back to initials/pravatar
        setAvatarUrl(undefined);
      }
    };
    load();
  }, [user?.id]);

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

  const openAuth = (isSigningUp: boolean) => {
    setIsSignUp(isSigningUp);
    setIsAuthOpen(true);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-poppins font-bold text-2xl text-primary">
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
                className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full p-0 w-10 h-10">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={avatarUrl || (user?.id ? `https://i.pravatar.cc/150?u=${user.id}` : undefined)} />
                      <AvatarFallback>
                        {user?.name ? user.name.substring(0, 2).toUpperCase() : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${user.id}`} className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Sheet open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <div className="flex items-center space-x-2">
                    <SheetTrigger asChild>
                      <Button variant="outline" onClick={() => openAuth(false)}>
                        Sign In
                      </Button>
                    </SheetTrigger>
                    <SheetTrigger asChild>
                      <Button variant="default" onClick={() => openAuth(true)}>
                        Sign Up
                      </Button>
                    </SheetTrigger>
                  </div>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Welcome to Raahi</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <LoginSignup
                        isOpen={isAuthOpen}
                        onClose={() => setIsAuthOpen(false)}
                        defaultIsSignUp={isSignUp}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </>
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
                        className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
