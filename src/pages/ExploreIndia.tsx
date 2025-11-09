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

  // 30+ verified cities with correct images
  const cities = [
    // NORTH INDIA
    {
      id: 1,
      name: "Delhi",
      slug: "delhi",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5", // India Gate, Delhi
      description: "Explore the heart of India with its rich history, monuments, bazaars, and street food.",
      region: "North India"
    },
    {
      id: 2,
      name: "Jaipur",
      slug: "jaipur",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245", // Hawa Mahal, Jaipur
      description: "The Pink City with stunning palaces, forts and vibrant bazaars.",
      region: "North India"
    },
    {
      id: 3,
      name: "Agra",
      slug: "agra",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523", // Taj Mahal, Agra
      description: "Home to the iconic Taj Mahal and other Mughal masterpieces.",
      region: "North India"
    },
    {
      id: 4,
      name: "Varanasi",
      slug: "varanasi",
      image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmFyYW5hc2l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Varanasi ghats
      description: "One of the world’s oldest living cities and a major spiritual centre.",
      region: "North India"
    },
    {
      id: 5,
      name: "Amritsar",
      slug: "amritsar",
      image: "https://images.unsplash.com/photo-1517427677506-ade074eb1432?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YW1yaXRzYXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Golden Temple, Amritsar
      description: "Golden Temple, Wagah Border ceremony and legendary Punjabi cuisine.",
      region: "North India"
    },
    {
      id: 6,
      name: "Shimla",
      slug: "shimla",
      image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpbWxhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Ridge/Christ Church area view (Himachal)
      description: "Colonial charm, pine forests and cool mountain air.",
      region: "North India"
    },
    {
      id: 7,
      name: "Rishikesh",
      slug: "rishikesh",
      image: "https://images.unsplash.com/photo-1650341259809-9314b0de9268?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmlzaGlrZXNofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Lakshman Jhula area
      description: "Yoga capital on the Ganges with rafting and suspension bridges.",
      region: "North India"
    },
    {
      id: 8,
      name: "Leh",
      slug: "leh",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", // Ladakh landscape
      description: "Gateway to Ladakh’s monasteries, high passes and moonlike valleys.",
      region: "North India"
    },

    // WEST INDIA
    {
      id: 9,
      name: "Mumbai",
      slug: "mumbai",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f", // Gateway of India, Mumbai
      description: "Maximum City: sea views, cinema, colonial architecture and street eats.",
      region: "West India"
    },
    {
      id: 10,
      name: "Goa",
      slug: "goa",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", // Goa beach
      description: "Beaches, nightlife and Portuguese-influenced charm.",
      region: "West India"
    },
    {
      id: 11,
      name: "Ahmedabad",
      slug: "ahmedabad",
      image: "https://images.unsplash.com/photo-1515141866783-3222fca27f70?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QWRhbGFqJTIwU3RlcHdlbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Adalaj Stepwell/Ahmedabad vibe
      description: "UNESCO World Heritage city with stepwells, pols and Sabarmati Ashram.",
      region: "West India"
    },
    {
      id: 12,
      name: "Udaipur",
      slug: "udaipur",
      image: "https://images.unsplash.com/photo-1589901164570-f9de6556e1c1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dWRhaXB1cnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", // Lake Pichola, Udaipur
      description: "Lakes, palaces and sunset boat rides in the City of Lakes.",
      region: "West India"
    },
    {
      id: 13,
      name: "Jodhpur",
      slug: "jodhpur",
      image: "https://images.unsplash.com/photo-1566873535350-a3f5d4a804b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8am9kaHB1cnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", // Blue City & Mehrangarh
      description: "The Blue City with the mighty Mehrangarh Fort.",
      region: "West India"
    },
    {
      id: 14,
      name: "Jaisalmer",
      slug: "jaisalmer",
      image: "https://images.unsplash.com/photo-1668342081577-9c568eb1d550?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8amFpc2FsbWVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Jaisalmer Fort / dunes
      description: "Golden fort city and Thar Desert camel safaris.",
      region: "West India"
    },
    {
      id: 15,
      name: "Pune",
      slug: "pune",
      image: "https://media.istockphoto.com/id/2012078203/photo/an-equestrian-statue-of-peshwa-baji-rao-i.webp?a=1&b=1&s=612x612&w=0&k=20&c=LJwpeebxaXktqa_edNrAqxGotJuA2gnjPBbV7rIGzm4=", // Shaniwar Wada/Deccan skyline vibe
      description: "Student city with Maratha history and buzzing cafés.",
      region: "West India"
    },
    {
      id: 16,
      name: "Surat",
      slug: "surat",
      image: "https://images.unsplash.com/photo-1625309242986-aec6b5fd1cca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3VyYXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // River/bridge cityscape vibe (Gujarat)
      description: "Diamond hub on the Tapi with a thriving food scene.",
      region: "West India"
    },

    // SOUTH INDIA
    {
      id: 17,
      name: "Chennai",
      slug: "chennai",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", // Marina Beach / Kapaleeshwarar vibe
      description: "Beaches, Dravidian temples and classical music.",
      region: "South India"
    },
    {
      id: 18,
      name: "Bengaluru",
      slug: "bengaluru",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2", // Bengaluru skyline/UB City view
      description: "Garden City of tech parks, lakes and cafes.",
      region: "South India"
    },
    {
      id: 19,
      name: "Hyderabad",
      slug: "hyderabad",
      image: "https://images.unsplash.com/photo-1657981630164-769503f3a9a8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hhcm1pbmFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Charminar, Hyderabad
      description: "City of pearls, Charminar, biryani and Hi-Tech City.",
      region: "South India"
    },
    {
      id: 20,
      name: "Kochi",
      slug: "kochi",
      image: "https://images.unsplash.com/photo-1590123732197-e7079d2ceb89?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a29jaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Chinese fishing nets, Fort Kochi
      description: "Arabian Sea port with colonial quarters and art cafés.",
      region: "South India"
    },
    {
      id: 21,
      name: "Munnar",
      slug: "munnar",
      image: "https://images.unsplash.com/photo-1663597675816-9b5d68952f42?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bXVubmFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Tea gardens, Munnar
      description: "Endless tea estates and cool misty peaks.",
      region: "South India"
    },
    {
      id: 22,
      name: "Ooty",
      slug: "ooty",
      image: "https://images.unsplash.com/photo-1638886540342-240980f60d25?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b290eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", // Nilgiri hills
      description: "Nilgiri hill station with toy train and lakes.",
      region: "South India"
    },
    {
      id: 23,
      name: "Puducherry",
      slug: "puducherry",
      image: "https://plus.unsplash.com/premium_photo-1694475205503-d6c6a71f03bc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHVkdWNoZXJyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", // White Town promenade vibe
      description: "French Quarter lanes, beaches and boulangeries.",
      region: "South India"
    },
    {
      id: 24,
      name: "Hampi",
      slug: "hampi",
      image: "https://plus.unsplash.com/premium_photo-1697730504977-26847b1f1f91?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFtcGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Hampi ruins & boulders
      description: "UNESCO-listed Vijayanagara ruins and surreal boulder fields.",
      region: "South India"
    },
    {
      id: 25,
      name: "Mysuru",
      slug: "mysuru",
      image: "https://images.unsplash.com/photo-1600112356915-089abb8fc71a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXlzdXJ1fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Mysore Palace
      description: "Palaces, silk and sweets—royal Karnataka.",
      region: "South India"
    },
    {
      id: 26,
      name: "Rameswaram",
      slug: "rameswaram",
      image: "https://images.unsplash.com/photo-1541417904950-b855846fe074", // Pamban Bridge/Tamil Nadu coast vibe
      description: "Sacred island town and the iconic Pamban railway bridge.",
      region: "South India"
    },
    {
      id: 27,
      name: "Kanyakumari",
      slug: "kanyakumari",
      image: "https://images.unsplash.com/photo-1621338613162-569877226e04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGthbnlha3VtYXJpfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Vivekananda Rock, Kanyakumari
      description: "India’s southern tip where three seas meet.",
      region: "South India"
    },

    // EAST INDIA
    {
      id: 28,
      name: "Kolkata",
      slug: "kolkata",
      image: "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28", // Howrah Bridge / Kolkata
      description: "Cultural capital with literature, trams and colonial architecture.",
      region: "East India"
    },
    {
      id: 29,
      name: "Darjeeling",
      slug: "darjeeling",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa", // Tea gardens & Kanchenjunga views
      description: "Toy train, tea gardens and Himalayan panoramas.",
      region: "East India"
    },
    {
      id: 30,
      name: "Shillong",
      slug: "shillong",
      image: "https://images.unsplash.com/photo-1665248919075-246d0ac9a912?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNoaWxsb25nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Umiam Lake/Meghalaya
      description: "Scotland of the East with waterfalls and cafés.",
      region: "East India"
    },
    {
      id: 31,
      name: "Bhubaneswar",
      slug: "bhubaneswar",
      image: "https://images.unsplash.com/photo-1707241934268-5a0c8e206d9c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymh1YmFuZXNod2FyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Lingaraja Temple, Bhubaneswar
      description: "Temple city of Odisha with ancient Kalinga architecture.",
      region: "East India"
    },
    {
      id: 32,
      name: "Puri",
      slug: "puri",
      image: "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFnYW5uYXRoJTIwdGVtcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Puri beach/temple vibe
      description: "Jagannath Temple pilgrim town with wide sandy beaches.",
      region: "East India"
    },

    // EXTRA (CENTRAL mapped to appropriate regions)
    {
      id: 33,
      name: "Bhopal",
      slug: "bhopal",
      image: "https://plus.unsplash.com/premium_photo-1726863214898-0b11a43f4bbe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmhvcGFsfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Upper Lake/Bhopal cityscape
      description: "City of lakes with easy access to Sanchi Stupa and Bhimbetka.",
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
      <section className="pt-28 pb-16 bg-[#E6F0FF]">
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
                      ? "bg-primary text-white rounded-md"
                      : "text-gray-600 hover:text-primary"
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

      <Footer />
    </div>
  );
};

export default ExploreIndia;
