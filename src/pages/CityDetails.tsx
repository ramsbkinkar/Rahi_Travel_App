
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Clock, Home, Building, Utensils, Bus, Phone, Heart } from "lucide-react";
import { getCityDetails } from '@/lib/supabase';

const CityDetails = () => {
  const { citySlug } = useParams();
  const [city, setCity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCityDetails = async () => {
      if (citySlug) {
        setLoading(true);
        const cityData = await getCityDetails(citySlug);
        setCity(cityData);
        setLoading(false);
      }
    };
    
    fetchCityDetails();
  }, [citySlug]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-raahi-blue" />
      </div>
    );
  }
  
  if (!city) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">City Not Found</h1>
        <p>Sorry, we couldn't find information about this city.</p>
        <Link to="/explore-india" className="text-raahi-blue hover:underline">
          Back to Explore India
        </Link>
      </div>
    );
  }

  // Create info sections from available data
  const infoSections = [
    { id: 'travel', title: 'Travel Information', icon: <Bus className="h-5 w-5" />, content: city.description || 'Information about local transport and getting around.' },
    { id: 'time', title: 'Best Time to Visit', icon: <Calendar className="h-5 w-5" />, content: city.best_time_to_visit || 'Information about the best time to visit.' },
    { id: 'stay', title: 'Where to Stay', icon: <Home className="h-5 w-5" />, content: 'Find accommodation options ranging from budget to luxury.' },
    { id: 'food', title: 'Local Cuisine', icon: <Utensils className="h-5 w-5" />, content: 'Explore the local food and culinary experiences.' },
    { id: 'culture', title: 'Local Culture', icon: <Heart className="h-5 w-5" />, content: 'Learn about the local customs and cultural experiences.' },
    { id: 'emergency', title: 'Emergency Information', icon: <Phone className="h-5 w-5" />, content: 'Important contacts and emergency information.' }
  ];
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/explore-india">Explore India</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>{city.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-raahi-blue mb-2">{city.name}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" /> 
              <span>India</span>
            </div>
            <div className="mb-6">
              <AspectRatio ratio={16/9} className="bg-slate-100 rounded-lg overflow-hidden">
                <img 
                  src={city.image_url || '/placeholder.svg'} 
                  alt={city.name} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700">{city.description}</p>
            </div>
            
            {city.highlights && city.highlights.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {city.highlights.map((highlight: string, index: number) => (
                    <Badge key={index} className="bg-raahi-orange/10 text-raahi-orange border-raahi-orange hover:bg-raahi-orange/20">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Essential Information</h2>
            <Accordion type="single" collapsible className="w-full">
              {infoSections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center">
                      <div className="mr-3 text-raahi-blue">
                        {section.icon}
                      </div>
                      <span>{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-9 text-gray-700">
                      {section.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Weather & Climate</h3>
              <div className="space-y-3">
                {city.best_time_to_visit && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Best Time to Visit</div>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-raahi-blue" />
                      <span>{city.best_time_to_visit}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Explore Nearby</h3>
            <div className="grid grid-cols-1 gap-4">
              {/* This would display nearby cities when available */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center">
                  <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center mr-3">
                    <MapPin className="h-6 w-6 text-raahi-blue" />
                  </div>
                  <div>
                    <div className="font-medium">Explore more destinations</div>
                    <Link to="/explore-india" className="text-sm text-raahi-blue hover:underline">View all cities</Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
