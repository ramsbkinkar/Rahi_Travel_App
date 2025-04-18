
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const TripTracker: React.FC = () => {
  const { toast } = useToast();
  const [showShareLink, setShowShareLink] = useState(false);
  
  const handleShare = () => {
    setShowShareLink(true);
    toast({
      title: "Link Copied!",
      description: "Trip tracking link has been copied to clipboard.",
      duration: 3000,
    });
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
      
      {/* Header Section */}
      <section className="pt-28 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Live Group Trip Tracker</h1>
            <p className="text-lg text-gray-600 mb-8">
              Keep track of your travel companions in real-time across India. See where everyone is and stay connected throughout your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-raahi-blue hover:bg-raahi-blue-dark"
                onClick={() => {
                  toast({
                    title: "Location Updated",
                    description: "Your current location has been updated.",
                    duration: 3000,
                  });
                }}
              >
                Update My Location
              </Button>
              <Button 
                variant="outline" 
                className="border-raahi-blue text-raahi-blue hover:bg-raahi-blue-light/30"
                onClick={handleShare}
              >
                Share Trip Link
              </Button>
            </div>
            
            {showShareLink && (
              <div className="mt-4 p-3 bg-gray-50 border rounded-md flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate">
                  https://raahi.travel/trip/TRIP123456
                </span>
                <button 
                  className="text-raahi-blue text-sm font-medium"
                  onClick={() => {
                    toast({
                      title: "Link Copied Again!",
                      description: "Trip tracking link has been copied to clipboard.",
                      duration: 3000,
                    });
                  }}
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Map Container */}
            <div className="relative h-[500px] bg-gray-100">
              {/* India Map Image */}
              <div className="absolute inset-0">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e4/India_topo_big.jpg" 
                  alt="Map of India" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Traveler Pins */}
              <TooltipProvider>
                {travelersData.map(traveler => (
                  <Tooltip key={traveler.id}>
                    <TooltipTrigger asChild>
                      <div 
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-bounce"
                        style={{ left: `${traveler.coordinates.x}%`, top: `${traveler.coordinates.y}%` }}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                            <AvatarImage src={traveler.avatar} alt={traveler.name} />
                            <AvatarFallback>{traveler.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2">
                        <p className="font-semibold">{traveler.name}</p>
                        <p className="text-sm text-gray-500">{traveler.location}</p>
                        <p className="text-xs text-gray-400">Updated {traveler.lastUpdated}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            
            {/* Legend & Controls */}
            <div className="p-4 border-t">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Offline</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">Zoom In</Button>
                  <Button variant="outline" size="sm">Zoom Out</Button>
                  <Button variant="outline" size="sm">Center Map</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Travelers List */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Your Travel Companions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelersData.map(traveler => (
              <div key={traveler.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={traveler.avatar} alt={traveler.name} />
                  <AvatarFallback>{traveler.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-medium">{traveler.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>{traveler.location}</span>
                  </div>
                  <p className="text-xs text-gray-400">Updated {traveler.lastUpdated}</p>
                </div>
                
                <Button variant="ghost" size="sm">Message</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TripTracker;
