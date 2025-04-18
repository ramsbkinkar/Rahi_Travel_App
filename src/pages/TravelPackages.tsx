
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TravelCard from '@/components/TravelCard';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';

const TravelPackages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const packageData = [
    // Honeymoon Packages
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523592121529-f6dde35f079e",
      title: "Romantic Andaman Getaway",
      location: "Andaman & Nicobar Islands",
      duration: "6 Days / 5 Nights",
      price: "₹48,999",
      category: "Honeymoon"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      title: "Dreamy Kerala Backwaters",
      location: "Kerala",
      duration: "5 Days / 4 Nights",
      price: "₹34,999",
      category: "Honeymoon"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
      title: "Udaipur Lake Palace Retreat",
      location: "Rajasthan",
      duration: "4 Days / 3 Nights",
      price: "₹32,499",
      category: "Honeymoon"
    },
    
    // Adventure Packages
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1536349788264-1b816db3cc13",
      title: "Himalayan Trekking Expedition",
      location: "Himachal Pradesh",
      duration: "8 Days / 7 Nights",
      price: "₹29,999",
      category: "Adventure"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      title: "Rishikesh River Rafting",
      location: "Uttarakhand",
      duration: "3 Days / 2 Nights",
      price: "₹12,499",
      category: "Adventure"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1542459281-a6b0b552b93f",
      title: "Goa Scuba Adventure",
      location: "Goa",
      duration: "4 Days / 3 Nights",
      price: "₹18,999",
      category: "Adventure"
    },
    
    // Spiritual Packages
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1619167801419-bfcac4952cfe",
      title: "Varanasi Spiritual Journey",
      location: "Uttar Pradesh",
      duration: "4 Days / 3 Nights",
      price: "₹14,999",
      category: "Spiritual"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1555794840-29f464e9af8b",
      title: "Golden Temple & Amritsar",
      location: "Punjab",
      duration: "3 Days / 2 Nights",
      price: "₹10,999",
      category: "Spiritual"
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1612438214708-f428a707dd4e",
      title: "Tirupati Balaji Darshan",
      location: "Andhra Pradesh",
      duration: "2 Days / 1 Night",
      price: "₹8,499",
      category: "Spiritual"
    },
    
    // Friends Packages
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1565346469019-8a7779dbb448",
      title: "Goa Beach Party",
      location: "Goa",
      duration: "5 Days / 4 Nights",
      price: "₹22,499",
      category: "Friends"
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1547378809-7ae8ad7db58d",
      title: "Manali Snow Adventure",
      location: "Himachal Pradesh",
      duration: "6 Days / 5 Nights",
      price: "₹25,999",
      category: "Friends"
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1577368211130-4bbd0181ddf0",
      title: "Pondicherry Beach Retreat",
      location: "Tamil Nadu",
      duration: "3 Days / 2 Nights",
      price: "₹13,499",
      category: "Friends"
    },
    
    // Family Packages
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1517406038517-97d69c7aaac4",
      title: "Golden Triangle Tour",
      location: "Delhi-Agra-Jaipur",
      duration: "7 Days / 6 Nights",
      price: "₹38,999",
      category: "Family"
    },
    {
      id: 14,
      image: "https://images.unsplash.com/photo-1560117324-a9d8ee74dadd",
      title: "Ooty & Coorg Family Holiday",
      location: "Karnataka & Tamil Nadu",
      duration: "6 Days / 5 Nights",
      price: "₹29,499",
      category: "Family"
    },
    {
      id: 15,
      image: "https://images.unsplash.com/photo-1583265627959-fb7042f5133b",
      title: "Kashmir Family Tour",
      location: "Jammu & Kashmir",
      duration: "8 Days / 7 Nights",
      price: "₹42,999",
      category: "Family"
    },
  ];

  const filterPackages = (packages: typeof packageData, category: string, search: string) => {
    return packages
      .filter(pkg => category === 'all' || pkg.category === category)
      .filter(pkg => 
        pkg.title.toLowerCase().includes(search.toLowerCase()) || 
        pkg.location.toLowerCase().includes(search.toLowerCase())
      );
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
          <Tabs defaultValue="all">
            <TabsList className="mb-8 flex flex-wrap justify-center">
              <TabsTrigger value="all">All Packages</TabsTrigger>
              <TabsTrigger value="Honeymoon">Honeymoon</TabsTrigger>
              <TabsTrigger value="Adventure">Adventure</TabsTrigger>
              <TabsTrigger value="Spiritual">Spiritual</TabsTrigger>
              <TabsTrigger value="Friends">Friends</TabsTrigger>
              <TabsTrigger value="Family">Family</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterPackages(packageData, 'all', searchTerm).map(pkg => (
                  <TravelCard key={pkg.id} {...pkg} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Honeymoon">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterPackages(packageData, 'Honeymoon', searchTerm).map(pkg => (
                  <TravelCard key={pkg.id} {...pkg} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Adventure">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterPackages(packageData, 'Adventure', searchTerm).map(pkg => (
                  <TravelCard key={pkg.id} {...pkg} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Spiritual">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterPackages(packageData, 'Spiritual', searchTerm).map(pkg => (
                  <TravelCard key={pkg.id} {...pkg} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Friends">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterPackages(packageData, 'Friends', searchTerm).map(pkg => (
                  <TravelCard key={pkg.id} {...pkg} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Family">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterPackages(packageData, 'Family', searchTerm).map(pkg => (
                  <TravelCard key={pkg.id} {...pkg} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TravelPackages;
