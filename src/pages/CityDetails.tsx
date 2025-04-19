
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCityDetails } from '@/lib/supabase';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Loader2, MapPin, Plane, Train, Utensils, Camera, Home, Building, Info, PhoneCall, CalendarDays, Bus } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CityDetails: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  
  const { data: city, isLoading, error } = useQuery({
    queryKey: ['cityDetails', citySlug],
    queryFn: () => getCityDetails(citySlug as string),
    enabled: !!citySlug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-raahi-blue" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-4">City not found</h2>
          <p>We couldn't find details for this city. Please try another one.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const sections = [
    { id: 'airport', icon: <Plane className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Airport Info', content: city.airport_info },
    { id: 'railway', icon: <Train className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Railway Station', content: city.railway_info },
    { id: 'food', icon: <Utensils className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Local Food', content: city.local_food },
    { id: 'places', icon: <Camera className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Places to Visit', content: city.places_to_visit },
    { id: 'budget', icon: <Home className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Budget Stay', content: city.budget_stay },
    { id: 'luxury', icon: <Building className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Luxury Stay', content: city.luxury_stay },
    { id: 'culture', icon: <Info className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Local Culture', content: city.local_culture },
    { id: 'emergency', icon: <PhoneCall className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Emergency Numbers', content: city.emergency_numbers },
    { id: 'besttime', icon: <CalendarDays className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Best Time to Visit', content: city.best_time },
    { id: 'transport', icon: <Bus className="text-raahi-blue h-5 w-5 mr-2" />, title: 'Local Transport', content: city.local_transport }
  ];

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${city.banner_image})` }}>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative container mx-auto px-4 z-10 text-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-2">
              <MapPin className="h-5 w-5 mr-2 text-raahi-orange" />
              <span>Explore India</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{city.name}</h1>
            <p className="text-xl mb-6">{city.description}</p>
          </div>
        </div>
      </section>
      
      {/* City Details */}
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border rounded-lg shadow-sm bg-white">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center">
                    {section.icon}
                    <span>{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CityDetails;
