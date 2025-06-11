import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import TravelCard from '@/components/TravelCard';
import { apiClient } from '@/lib/api-client';
import { Loader2, Search, MapPin, Users, Clock, Share2, Calendar, Phone, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TravelPackage {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  image_url: string;
  category: string;
}

const TripTracker: React.FC = () => {
  const { toast } = useToast();
  const [showShareLink, setShowShareLink] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [email, setEmail] = useState('');

  // Sample travel packages data (fallback data while loading from API)
  const samplePackages: TravelPackage[] = [
    {
      id: "1",
      image_url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      title: "Serene Kashmir Voyage",
      location: "Kashmir, India",
      duration: "6 Days / 5 Nights",
      price: "₹32,999",
      category: "Honeymoon"
    },
    {
      id: "2",
      image_url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
      title: "Goa Beach Adventure",
      location: "Goa, India",
      duration: "4 Days / 3 Nights",
      price: "₹18,499",
      category: "Friends"
    },
    {
      id: "3",
      image_url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
      title: "Rajasthan Heritage Tour",
      location: "Rajasthan, India",
      duration: "8 Days / 7 Nights",
      price: "₹45,999",
      category: "Family"
    }
  ];
  
  const { data: packages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ['travelPackages', currentCategory],
    queryFn: () => apiClient.getPackages({ category: currentCategory !== 'all' ? currentCategory : undefined }),
  });

  // Transform API data to match our TravelPackage interface
  const travelPackages: TravelPackage[] = isLoadingPackages ? samplePackages : packages.map(pkg => ({
    id: pkg.id,
    title: pkg.title,
    location: pkg.location,
    duration: pkg.duration_days ? `${pkg.duration_days} Days` : "Duration not specified",
    price: `₹${pkg.price.toLocaleString()}`,
    image_url: pkg.images?.[0] || "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    category: pkg.category || "All"
  }));

  const filterPackages = (packages: TravelPackage[], search: string) => {
    return packages.filter(pkg => 
      pkg.title.toLowerCase().includes(search.toLowerCase()) || 
      pkg.location.toLowerCase().includes(search.toLowerCase())
    );
  };
  
  const handleShare = () => {
    setShowShareLink(true);
    toast({
      title: "Link Copied!",
      description: "Trip tracking link has been copied to clipboard.",
      duration: 3000,
    });
  };

  const handleNotify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thanks for your interest!",
        description: "We'll notify you when the Trip Tracker feature is available.",
        duration: 3000,
      });
      setEmail('');
    }
  };
  
  const travelersData = [
    {
      id: 1,
      name: "Amit Sharma",
      avatar: "https://i.pravatar.cc/150?img=1",
      location: "New Delhi",
      coordinates: { x: 30, y: 35 },
      lastUpdated: "2 minutes ago"
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "https://i.pravatar.cc/150?img=2",
      location: "Mumbai",
      coordinates: { x: 22, y: 65 },
      lastUpdated: "5 minutes ago"
    },
    {
      id: 3,
      name: "Rahul Singh",
      avatar: "https://i.pravatar.cc/150?img=3",
      location: "Jaipur",
      coordinates: { x: 35, y: 52 },
      lastUpdated: "15 minutes ago"
    },
    {
      id: 4,
      name: "Ananya Gupta",
      avatar: "https://i.pravatar.cc/150?img=4",
      location: "Kolkata",
      coordinates: { x: 70, y: 45 },
      lastUpdated: "30 minutes ago"
    },
    {
      id: 5,
      name: "Vikram Reddy",
      avatar: "https://i.pravatar.cc/150?img=5",
      location: "Bangalore",
      coordinates: { x: 50, y: 80 },
      lastUpdated: "1 hour ago"
    }
  ];

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-[#E6F0FF]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-primary text-white mb-4">Coming Soon</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Group Trip Tracker <span className="text-orange-500">Feature</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Stay connected with your travel companions in real-time across India. Our upcoming Trip Tracker feature will let you see where everyone is throughout your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default"
                onClick={() => {
                  toast({
                    title: "Feature in Development",
                    description: "The Trip Tracker feature is coming soon! We'll notify you when it's ready.",
                    duration: 3000,
                  });
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Get Notified When Available
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Preview Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">How Trip Tracker Will Work</h2>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Our team is working on this exciting new feature to help you stay connected with your travel group in real-time.
            </p>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              {/* Map Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg">Himalayan Trek Group</h2>
                  <p className="text-gray-500 text-sm">Feature Preview</p>
                </div>
                <Badge variant="outline" className="text-xs">In Development</Badge>
              </div>
              
              {/* Preview Image */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                  <div className="bg-white/90 p-4 rounded-lg text-center max-w-md">
                    <h3 className="font-bold text-lg mb-2">Coming Soon</h3>
                    <p className="text-gray-600 mb-4">Be among the first to try our Trip Tracker feature when it launches.</p>
                    <form onSubmit={handleNotify} className="flex gap-2">
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button type="submit">Notify Me</Button>
                    </form>
                  </div>
                </div>
                <img 
                  src="https://miro.medium.com/v2/resize:fit:1400/1*qYUvh-EtES8dtgKiBRiLsA.png" 
                  alt="Trip Tracker Preview" 
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                  Preview Only
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Highlights Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Key Features</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our Trip Tracker will offer these essential features to enhance your group travel experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Real-Time Location</h3>
                <p className="text-gray-600">
                  See your travel companions' locations updated in real-time on an interactive map.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Group Management</h3>
                <p className="text-gray-600">
                  Create custom groups for different trips and invite friends & family to join.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">One-Touch Communication</h3>
                <p className="text-gray-600">
                  Quickly message or call group members directly from the map interface.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Perfect For All Types of Travel</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Trip Tracker will be valuable for many different travel scenarios.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Group Trips & Tours</h3>
                <p className="text-gray-600">
                  Keep track of everyone in your travel group, ensuring no one gets separated during sightseeing tours, shopping trips, or adventure activities.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Family Trips</h3>
                <p className="text-gray-600">
                  Keep an eye on children or elderly family members during vacations, providing peace of mind for everyone.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Adventure Treks</h3>
                <p className="text-gray-600">
                  Track your trekking group's progress and stay together even in remote areas with offline maps support.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Multi-Day Festivals</h3>
                <p className="text-gray-600">
                  Find your friends at large events and festivals when you get separated in crowds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      
      {/* Similar Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Explore Our Other Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Digital Scrapbook</h3>
              <p className="text-gray-600 mb-6">
                Create beautiful digital memories with our easy-to-use scrapbook templates.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/scrapbook'}>
                Try It Now
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Travel Feed</h3>
              <p className="text-gray-600 mb-6">
                Share your travel photos and experiences with other travelers in the community.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/social-feed'}>
                Explore Feed
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Trip Planner</h3>
              <p className="text-gray-600 mb-6">
                Plan your itinerary, book accommodations, and organize activities all in one place.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/trip-planner'}>
                Plan a Trip
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TripTracker;
