
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Book, Camera, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TravelCard from '@/components/TravelCard';

const Index: React.FC = () => {
  // Sample travel packages
  const travelPackages = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      title: "Serene Kashmir Voyage",
      location: "Kashmir, India",
      duration: "6 Days / 5 Nights",
      price: "₹32,999",
      category: "Honeymoon"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
      title: "Goa Beach Adventure",
      location: "Goa, India",
      duration: "4 Days / 3 Nights",
      price: "₹18,499",
      category: "Friends"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
      title: "Rajasthan Heritage Tour",
      location: "Rajasthan, India",
      duration: "8 Days / 7 Nights",
      price: "₹45,999",
      category: "Family"
    }
  ];

  // Cities for Explore India
  const cities = [
    {
      id: 1,
      name: "Delhi",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      description: "Explore the heart of India with its rich history and vibrant culture."
    },
    {
      id: 2,
      name: "Mumbai",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
      description: "The city of dreams where culture meets modernism."
    },
    {
      id: 3,
      name: "Varanasi",
      image: "https://images.unsplash.com/photo-1561361058-c24e021e539f",
      description: "Experience spiritual awakening in one of the oldest cities."
    }
  ];

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
        </div>
        
        <div className="container mx-auto relative z-10 px-4 lg:px-8">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Travel. Capture. <span className="text-raahi-orange">Remember.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Your smart travel companion for creating unforgettable journeys across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-raahi-blue hover:bg-raahi-blue-dark text-white">
                Explore Packages
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/20">
                Create Scrapbook
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <a href="#travel-packages" className="animate-bounce bg-white/20 p-2 w-10 h-10 ring-1 ring-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ArrowRight size={20} className="text-white" />
          </a>
        </div>
      </section>
      
      {/* Travel Packages Section */}
      <section id="travel-packages" className="section-container">
        <h2 className="section-title">Popular Travel Packages</h2>
        <p className="section-subtitle">
          Discover our handcrafted travel packages designed for every type of traveler - from honeymooners to adventure seekers.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {travelPackages.map(pkg => (
            <TravelCard
              key={pkg.id}
              image={pkg.image}
              title={pkg.title}
              location={pkg.location}
              duration={pkg.duration}
              price={pkg.price}
              category={pkg.category}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/travel-packages">
            <Button className="bg-raahi-blue hover:bg-raahi-blue-dark">
              View All Packages
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Explore India Section */}
      <section className="py-16 bg-gray-50">
        <div className="section-container">
          <h2 className="section-title">Explore India</h2>
          <p className="section-subtitle">
            Discover the diverse landscapes, rich heritage, and vibrant cultures across incredible India.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cities.map(city => (
              <div key={city.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center">
                    <MapPin size={20} className="text-raahi-orange mr-2" />
                    <h3 className="text-white font-bold text-xl">{city.name}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-600 mb-4">{city.description}</p>
                  <Link to={`/explore-india/${city.name.toLowerCase()}`} className="text-raahi-blue hover:text-raahi-blue-dark font-medium flex items-center">
                    Explore <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/explore-india">
              <Button className="bg-raahi-blue hover:bg-raahi-blue-dark">
                View All Cities
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section-container">
        <h2 className="section-title">Features That Make Us Special</h2>
        <p className="section-subtitle">
          Raahi offers unique tools to make your travel experience memorable and shareable.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* Digital Scrapbook */}
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-raahi-blue-light rounded-full mb-4">
              <Book size={24} className="text-raahi-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">Digital Scrapbook</h3>
            <p className="text-gray-600 mb-4">
              Create beautiful digital memories of your trips with our easy-to-use scrapbook templates.
            </p>
            <Link to="/scrapbook" className="text-raahi-blue hover:text-raahi-blue-dark font-medium flex items-center justify-center">
              Try Scrapbook <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {/* Social Feed */}
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-raahi-orange-light rounded-full mb-4">
              <Camera size={24} className="text-raahi-orange" />
            </div>
            <h3 className="text-xl font-bold mb-3">Travelgram Feed</h3>
            <p className="text-gray-600 mb-4">
              Share your travel moments, like and comment on others' experiences, and find inspiration.
            </p>
            <Link to="/social-feed" className="text-raahi-blue hover:text-raahi-blue-dark font-medium flex items-center justify-center">
              View Feed <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {/* Live Trip Tracker */}
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-raahi-blue-light rounded-full mb-4">
              <MapPin size={24} className="text-raahi-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">Trip Tracker</h3>
            <p className="text-gray-600 mb-4">
              Track your group's journey in real-time and share your location with friends and family.
            </p>
            <Link to="/trip-tracker" className="text-raahi-blue hover:text-raahi-blue-dark font-medium flex items-center justify-center">
              Try Tracker <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-raahi-blue-light">
        <div className="section-container">
          <h2 className="section-title">What Our Travelers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="User" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">{["Amit Sharma", "Priya Patel", "Raj Singh"][i-1]}</h4>
                    <p className="text-sm text-gray-500">{["Delhi", "Mumbai", "Bangalore"][i-1]}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  {[
                    "Raahi helped me plan my Kashmir trip perfectly. The scrapbook feature is amazing for keeping memories!",
                    "The Travelgram feature connected me with other travelers who gave great recommendations for my Goa trip.",
                    "Trip tracking feature was very helpful during our family trip to keep everyone connected."
                  ][i-1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-container">
        <div className="bg-gradient-to-r from-raahi-blue to-raahi-orange rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who are discovering India's beauty with Raahi as their trusted companion.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-raahi-blue hover:bg-gray-100">
              <Users size={18} className="mr-2" />
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
