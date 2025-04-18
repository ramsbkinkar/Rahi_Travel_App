
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CityCard from '@/components/CityCard';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

const ExploreIndia: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const cities = [
    {
      id: 1,
      name: "Delhi",
      slug: "delhi",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      description: "Explore the heart of India with its rich history, ancient monuments, and vibrant street food culture.",
      region: "North India"
    },
    {
      id: 2,
      name: "Mumbai",
      slug: "mumbai",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
      description: "The city of dreams where culture meets modernism, featuring iconic landmarks and bustling street life.",
      region: "West India"
    },
    {
      id: 3,
      name: "Kolkata",
      slug: "kolkata",
      image: "https://images.unsplash.com/photo-1558818229-f9233abfb5ae",
      description: "The cultural capital of India known for its colonial architecture, art galleries, and literary heritage.",
      region: "East India"
    },
    {
      id: 4,
      name: "Chennai",
      slug: "chennai",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
      description: "A major cultural and economic hub in South India with beautiful beaches and temples.",
      region: "South India"
    },
    {
      id: 5,
      name: "Jaipur",
      slug: "jaipur",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
      description: "The Pink City known for its stunning palaces, forts, and vibrant bazaars.",
      region: "North India"
    },
    {
      id: 6,
      name: "Varanasi",
      slug: "varanasi",
      image: "https://images.unsplash.com/photo-1561361058-c24e021e539f",
      description: "One of the world's oldest continuously inhabited cities and a major spiritual center for Hinduism.",
      region: "North India"
    },
    {
      id: 7,
      name: "Goa",
      slug: "goa",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      description: "Famous for its beaches, nightlife, and Portuguese-influenced architecture.",
      region: "West India"
    },
    {
      id: 8,
      name: "Bengaluru",
      slug: "bengaluru",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2",
      description: "India's tech hub with pleasant weather, beautiful parks, and a vibrant food scene.",
      region: "South India"
    },
    {
      id: 9,
      name: "Agra",
      slug: "agra",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
      description: "Home to the iconic Taj Mahal and other magnificent Mughal-era monuments.",
      region: "North India"
    }
  ];
  
  const regions = ["All Regions", "North India", "South India", "East India", "West India"];
  const [activeRegion, setActiveRegion] = useState("All Regions");
  
  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = activeRegion === "All Regions" || city.region === activeRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-raahi-blue-light to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Explore Incredible India
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover the rich diversity, culture, and beauty of India's most fascinating cities.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cities..."
                className="pl-10 py-6 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Region Filters */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center overflow-x-auto hide-scrollbar">
            <MapPin size={18} className="text-raahi-orange mr-2 flex-shrink-0" />
            <span className="text-gray-500 mr-4">Filter by region:</span>
            <div className="flex space-x-4">
              {regions.map((region) => (
                <button
                  key={region}
                  className={`px-4 py-2 whitespace-nowrap ${
                    activeRegion === region
                      ? "bg-raahi-blue text-white rounded-md"
                      : "text-gray-600 hover:text-raahi-blue"
                  }`}
                  onClick={() => setActiveRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Cities Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredCities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCities.map(city => (
                <CityCard
                  key={city.id}
                  image={city.image}
                  name={city.name}
                  description={city.description}
                  slug={city.slug}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">No cities found matching your search.</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Discover India's Regions</h2>
            <p className="text-gray-600">
              Click on the map to explore different regions and their unique cultural heritage.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/India-map-en.svg/1200px-India-map-en.svg.png"
                alt="Map of India"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ExploreIndia;
