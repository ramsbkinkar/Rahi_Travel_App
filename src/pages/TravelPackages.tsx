
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TravelCard from '@/components/TravelCard';
import { Input } from '@/components/ui/input';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';
import { getTravelPackages } from '@/lib/supabase';

const TravelPackages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  
  const { data: packageData = [], isLoading } = useQuery({
    queryKey: ['travelPackages', currentCategory],
    queryFn: () => getTravelPackages(currentCategory),
  });

  const filterPackages = (packages: any[], search: string) => {
    return packages.filter(pkg => 
      pkg.title.toLowerCase().includes(search.toLowerCase()) || 
      pkg.location.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-gradient-to-r from-raahi-blue-light to-raahi-blue/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Travel Package
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore our curated collection of travel packages designed for every type of traveler and budget.
            </p>
          </div>
        </div>
      </section>
      
      {/* Search & Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search packages by name or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-gray-500" />
              <span className="text-gray-500">Filter by:</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Packages Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
            <TabsList className="mb-8 flex flex-wrap justify-center">
              <TabsTrigger value="all">All Packages</TabsTrigger>
              <TabsTrigger value="Honeymoon">Honeymoon</TabsTrigger>
              <TabsTrigger value="Adventure">Adventure</TabsTrigger>
              <TabsTrigger value="Spiritual">Spiritual</TabsTrigger>
              <TabsTrigger value="Friends">Friends</TabsTrigger>
              <TabsTrigger value="Family">Family</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-raahi-blue" />
              </div>
            ) : (
              <TabsContent value={currentCategory}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filterPackages(packageData, searchTerm).map((pkg) => (
                    <TravelCard 
                      key={pkg.id} 
                      image={pkg.image_url} 
                      title={pkg.title} 
                      location={pkg.location} 
                      duration={pkg.duration} 
                      price={pkg.price}
                      category={pkg.category} 
                    />
                  ))}
                </div>
                
                {filterPackages(packageData, searchTerm).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No packages found matching your search.</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TravelPackages;
