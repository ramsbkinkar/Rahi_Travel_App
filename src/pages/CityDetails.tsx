import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Clock, Home, Building, Utensils, Bus, Phone, Heart, ChevronRight } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const CityDetails = () => {
  const { citySlug } = useParams();
  
  const { data: city, isLoading } = useQuery({
    queryKey: ['city', citySlug],
    queryFn: () => apiClient.getCityDetails(citySlug || ''),
    enabled: !!citySlug
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-raahi-blue" />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto py-20">
          <h1 className="text-4xl font-bold mb-4">City Not Found</h1>
          <p className="text-gray-600 mb-4">Sorry, we couldn't find information about this city.</p>
          <Link to="/explore-india" className="text-raahi-blue hover:underline inline-flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" />
            Back to Explore India
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Create info sections from available data
  const infoSections = [
    { 
      id: 'travel', 
      title: 'Travel Information', 
      icon: <Bus className="h-5 w-5" />, 
      content: 'Getting around Delhi is convenient with its extensive metro network, bus services, and auto-rickshaws. The Delhi Metro is particularly efficient for covering longer distances. Auto-rickshaws and cycle-rickshaws are good for short distances. Ride-hailing apps like Uber and Ola are also widely available.'
    },
    { 
      id: 'time', 
      title: 'Best Time to Visit', 
      icon: <Calendar className="h-5 w-5" />, 
      content: `The best time to visit ${city.name} is from ${city.best_time_to_visit}. During these months, the weather is pleasant with moderate temperatures, making it ideal for sightseeing and outdoor activities.` 
    },
    { 
      id: 'stay', 
      title: 'Where to Stay', 
      icon: <Home className="h-5 w-5" />, 
      content: 'Find accommodation options ranging from luxury hotels in central Delhi to boutique stays in South Delhi. Popular areas include Connaught Place for business travelers, Paharganj for budget stays, and Aerocity for airport proximity.' 
    },
    { 
      id: 'food', 
      title: 'Local Cuisine', 
      icon: <Utensils className="h-5 w-5" />, 
      content: 'Experience the rich flavors of local street food in Chandni Chowk, fine dining in Hauz Khas, and authentic North Indian cuisine throughout the city. Must-tries include butter chicken, kebabs, and the famous Delhi chaat.' 
    },
    { 
      id: 'culture', 
      title: 'Local Culture', 
      icon: <Heart className="h-5 w-5" />, 
      content: 'Immerse yourself in the vibrant culture through local festivals, art galleries, and cultural performances. Visit during festivals like Diwali or Holi for a truly memorable experience.' 
    },
    { 
      id: 'emergency', 
      title: 'Emergency Information', 
      icon: <Phone className="h-5 w-5" />, 
      content: 'Police: 100, Ambulance: 102, Fire: 101. Major hospitals include AIIMS (All India Institute of Medical Sciences) and Safdarjung Hospital.' 
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={city.image_url} 
          alt={city.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Breadcrumb className="mb-4 text-white/80">
              <BreadcrumbItem>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <Link to="/explore-india" className="hover:text-white transition-colors">Explore India</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <span className="text-white">{city.name}</span>
              </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-5xl font-bold text-white mb-2">{city.name}</h1>
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-2" />
              <span>India</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">{city.description}</p>
            </div>
            
            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {city.highlights.map((highlight, index) => (
                  <Badge 
                    key={index} 
                    className="bg-raahi-orange/10 text-raahi-orange border-raahi-orange hover:bg-raahi-orange/20 px-4 py-2 text-sm"
                  >
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Essential Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Essential Information</h2>
              <Accordion type="single" collapsible className="w-full">
                {infoSections.map((section) => (
                  <AccordionItem key={section.id} value={section.id} className="border rounded-lg mb-2 bg-white">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center">
                        <div className="mr-3 text-raahi-blue">
                          {section.icon}
                        </div>
                        <span className="font-medium">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="pl-8 text-gray-700">
                        {section.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Weather & Climate</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Best Time to Visit</div>
                    <div className="flex items-center mt-2">
                      <Calendar className="h-5 w-5 mr-2 text-raahi-blue" />
                      <span className="text-gray-700">{city.best_time_to_visit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Explore Nearby</h3>
                <Link 
                  to="/explore-india" 
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-md bg-raahi-blue/10 flex items-center justify-center mr-3">
                    <MapPin className="h-6 w-6 text-raahi-blue" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Explore more destinations</div>
                    <div className="text-sm text-raahi-blue">View all cities</div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CityDetails;
