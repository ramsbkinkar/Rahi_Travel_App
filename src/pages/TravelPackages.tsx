import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TravelCard from '@/components/TravelCard';

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
      
      {/* Packages Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
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
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TravelPackages;
