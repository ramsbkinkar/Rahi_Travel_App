import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TravelCard from '@/components/TravelCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const packages = [
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
  },
  {
    id: "4",
    image_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    title: "Varanasi Spiritual Journey",
    location: "Varanasi, India",
    duration: "5 Days / 4 Nights",
    price: "₹25,999",
    category: "Spiritual"
  },
  {
    id: "5",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    title: "Himalayan Adventure Trek",
    location: "Himachal Pradesh, India",
    duration: "7 Days / 6 Nights",
    price: "₹38,499",
    category: "Adventure"
  }
];

const TravelPackages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');

  const filterPackages = (search: string, category: string) => {
    return packages.filter(pkg => {
      const matchesSearch = 
        pkg.title.toLowerCase().includes(search.toLowerCase()) || 
        pkg.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || pkg.category === category;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredPackages = filterPackages(searchTerm, currentCategory);

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
          </div>
        </div>
      </section>
      
      {/* Packages Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" onValueChange={setCurrentCategory}>
            <TabsList className="mb-8 flex flex-wrap justify-center gap-2">
              <TabsTrigger 
                value="all"
                className="px-6 py-2 rounded-full data-[state=active]:bg-raahi-blue data-[state=active]:text-white"
              >
                All Packages
              </TabsTrigger>
              <TabsTrigger 
                value="Honeymoon"
                className="px-6 py-2 rounded-full data-[state=active]:bg-raahi-blue data-[state=active]:text-white"
              >
                Honeymoon
              </TabsTrigger>
              <TabsTrigger 
                value="Adventure"
                className="px-6 py-2 rounded-full data-[state=active]:bg-raahi-blue data-[state=active]:text-white"
              >
                Adventure
              </TabsTrigger>
              <TabsTrigger 
                value="Spiritual"
                className="px-6 py-2 rounded-full data-[state=active]:bg-raahi-blue data-[state=active]:text-white"
              >
                Spiritual
              </TabsTrigger>
              <TabsTrigger 
                value="Friends"
                className="px-6 py-2 rounded-full data-[state=active]:bg-raahi-blue data-[state=active]:text-white"
              >
                Friends
              </TabsTrigger>
              <TabsTrigger 
                value="Family"
                className="px-6 py-2 rounded-full data-[state=active]:bg-raahi-blue data-[state=active]:text-white"
              >
                Family
              </TabsTrigger>
            </TabsList>

            <TabsContent value={currentCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
                  <TravelCard 
                    key={pkg.id} 
                    image={pkg.image_url} 
                    title={pkg.title} 
                    location={pkg.location} 
                    duration={pkg.duration} 
                    price={pkg.price}
                    category={pkg.category} 
                    id={pkg.id}
                  />
                ))}
              </div>
              
              {filteredPackages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No packages found matching your search.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TravelPackages;
