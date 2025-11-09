import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Clock, Home, Building, Utensils, Bus, Phone, Heart, ChevronRight, ArrowLeft, Sun } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

// Local fallback: verified images + concise info for 30+ cities
const localCityData: Record<string, {
  name: string;
  image_url: string;
  description: string;
  best_time_to_visit: string;
  highlights: string[];
}> = {
  // NORTH
  delhi: {
    name: "Delhi",
    image_url: "https://images.unsplash.com/photo-1587474260584-136574528ed5", // India Gate
    description: "India’s capital blends Mughal monuments, leafy boulevards, museums and modern malls. Old Delhi’s bazaars and New Delhi’s wide avenues make a striking contrast.",
    best_time_to_visit: "October to March",
    highlights: ["Red Fort", "Qutub Minar", "India Gate", "Humayun’s Tomb", "Lotus Temple"]
  },
  jaipur: {
    name: "Jaipur",
    image_url: "https://images.unsplash.com/photo-1477587458883-47145ed94245", // Hawa Mahal
    description: "The Pink City dazzles with ornate palaces, astronomical observatories and bustling bazaars famous for jewels, textiles and crafts.",
    best_time_to_visit: "October to March",
    highlights: ["Hawa Mahal", "Amber Fort", "City Palace", "Jantar Mantar", "Nahargarh Fort"]
  },
  agra: {
    name: "Agra",
    image_url: "https://images.unsplash.com/photo-1564507592333-c60657eea523", // Taj Mahal
    description: "Home to the Taj Mahal—an eternal symbol of love—plus mighty Agra Fort and Mughal gardens along the Yamuna.",
    best_time_to_visit: "October to March",
    highlights: ["Taj Mahal", "Agra Fort", "Mehtab Bagh", "Fatehpur Sikri", "Itimad-ud-Daulah"]
  },
  varanasi: {
    name: "Varanasi",
    image_url: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmFyYW5hc2l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Ghats
    description: "Sacred ghats on the Ganges, dawn boat rides and evening Ganga Aarti make Kashi India’s spiritual heart.",
    best_time_to_visit: "October to March",
    highlights: ["Dashashwamedh Ghat", "Kashi Vishwanath", "Sarnath", "Manikarnika Ghat", "Assi Ghat"]
  },
  amritsar: {
    name: "Amritsar",
    image_url: "https://images.unsplash.com/photo-1517427677506-ade074eb1432?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YW1yaXRzYXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Golden Temple
    description: "Golden Temple’s shimmering sarovar, Wagah ceremony and Punjabi flavours define this hospitable city.",
    best_time_to_visit: "October to March",
    highlights: ["Golden Temple", "Wagah Border", "Jallianwala Bagh", "Hall Bazaar", "Partition Museum"]
  },
  shimla: {
    name: "Shimla",
    image_url: "https://images.unsplash.com/photo-1597074866923-dc0589150358?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpbWxhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Ridge/Christ Church
    description: "Colonial hill station with cedar forests, toy trains and panoramic ridges.",
    best_time_to_visit: "March to June & October to December",
    highlights: ["The Ridge", "Mall Road", "Jakhoo Temple", "Kalka–Shimla Toy Train", "Kufri"]
  },
  rishikesh: {
    name: "Rishikesh",
    image_url: "https://images.unsplash.com/photo-1650341259809-9314b0de9268?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmlzaGlrZXNofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Lakshman Jhula/Ganges
    description: "Yoga capital on the Ganges: ashrams, suspension bridges and river rafting surrounded by forested hills.",
    best_time_to_visit: "February to April & September to November",
    highlights: ["Parmarth Aarti", "Lakshman Jhula", "Beatles Ashram", "Rafting", "Neer Garh Waterfall"]
  },
  leh: {
    name: "Leh",
    image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", // Ladakh
    description: "High-altitude town in Ladakh with gompas, stupas and day trips to Nubra and Pangong.",
    best_time_to_visit: "June to September",
    highlights: ["Shanti Stupa", "Thiksey Monastery", "Khardung La", "Nubra Valley", "Pangong Tso"]
  },

  // WEST
  mumbai: {
    name: "Mumbai",
    image_url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f", // Gateway of India
    description: "Island city of Art Deco, sea promenades and cinematic energy—India’s finance & film capital.",
    best_time_to_visit: "November to February",
    highlights: ["Gateway of India", "Marine Drive", "Colaba", "Bandra–Worli Sea Link", "Elephanta Caves"]
  },
  goa: {
    name: "Goa",
    image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", // Goa beach
    description: "Sandy shores, spice plantations and Indo-Portuguese churches with a laid-back vibe.",
    best_time_to_visit: "November to February",
    highlights: ["Calangute & Baga", "Fort Aguada", "Basilica of Bom Jesus", "Palolem", "Anjuna Flea Market"]
  },
  ahmedabad: {
    name: "Ahmedabad",
    image_url: "https://images.unsplash.com/photo-1515141866783-3222fca27f70?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QWRhbGFqJTIwU3RlcHdlbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Adalaj Stepwell
    description: "UNESCO World Heritage city with intricately carved stepwells and pol houses.",
    best_time_to_visit: "November to February",
    highlights: ["Sabarmati Ashram", "Adalaj Vav", "Sidi Saiyyed Jali", "Manek Chowk", "Kankaria Lake"]
  },
  udaipur: {
    name: "Udaipur",
    image_url: "https://images.unsplash.com/photo-1589901164570-f9de6556e1c1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dWRhaXB1cnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", // City Palace/Lake
    description: "Romantic lake city with marble palaces and sunset boat rides.",
    best_time_to_visit: "October to March",
    highlights: ["City Palace", "Lake Pichola", "Jag Mandir", "Bagore Ki Haveli", "Sajjangarh"]
  },
  jodhpur: {
    name: "Jodhpur",
    image_url: "https://images.unsplash.com/photo-1566873535350-a3f5d4a804b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8am9kaHB1cnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", // Blue city
    description: "Blue houses under the watch of Mehrangarh—Rajasthan’s photogenic desert city.",
    best_time_to_visit: "October to March",
    highlights: ["Mehrangarh Fort", "Jaswant Thada", "Clock Tower", "Toorji Ka Jhalra", "Umaid Bhawan Museum"]
  },
  jaisalmer: {
    name: "Jaisalmer",
    image_url: "https://images.unsplash.com/photo-1668342081577-9c568eb1d550?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8amFpc2FsbWVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Jaisalmer Fort
    description: "Golden citadel and surrounding Thar dunes with camel safaris and desert camps.",
    best_time_to_visit: "October to March",
    highlights: ["Jaisalmer Fort", "Patwon Ki Haveli", "Sam Sand Dunes", "Gadisar Lake", "Kuldhara"]
  },
  pune: {
    name: "Pune",
    image_url: "https://media.istockphoto.com/id/2012078203/photo/an-equestrian-statue-of-peshwa-baji-rao-i.webp?a=1&b=1&s=612x612&w=0&k=20&c=LJwpeebxaXktqa_edNrAqxGotJuA2gnjPBbV7rIGzm4=", // Shaniwar Wada area
    description: "Student city of forts, cafés and a pleasant climate with quick escapes to the Sahyadris.",
    best_time_to_visit: "October to February",
    highlights: ["Shaniwar Wada", "Aga Khan Palace", "Pataleshwar Caves", "Sinhagad Fort", "FC Road cafés"]
  },
  surat: {
    name: "Surat",
    image_url: "https://images.unsplash.com/photo-1625309242986-aec6b5fd1cca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3VyYXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // City river/bridge
    description: "Diamond & textile powerhouse with a growing waterfront and famed street food.",
    best_time_to_visit: "November to February",
    highlights: ["Gopi Talav", "Sarthana Nature Park", "VR Surat", "Dumas Beach", "Surat Castle"]
  },

  // SOUTH
  chennai: {
    name: "Chennai",
    image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", // Marina Beach / Kapaleeshwarar area
    description: "Gateway to South India with beaches, Dravidian temples and Carnatic music.",
    best_time_to_visit: "November to February",
    highlights: ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "Santhome Basilica", "Mahabalipuram (nearby)"]
  },
  bengaluru: {
    name: "Bengaluru",
    image_url: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2", // UB City/skyline
    description: "Pleasant ‘Garden City’ known for parks, lakes, cafés and a thriving tech scene.",
    best_time_to_visit: "October to February",
    highlights: ["Cubbon Park", "Lalbagh", "Vidhana Soudha", "Church Street", "Nandi Hills (nearby)"]
  },
  hyderabad: {
    name: "Hyderabad",
    image_url: "https://images.unsplash.com/photo-1657981630164-769503f3a9a8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hhcm1pbmFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Charminar
    description: "Pearls, Charminar and biryani meet the modern skyline of HITEC City.",
    best_time_to_visit: "October to February",
    highlights: ["Charminar", "Golconda Fort", "Chowmahalla", "Salar Jung Museum", "Hussain Sagar"]
  },
  kochi: {
    name: "Kochi",
    image_url: "https://images.unsplash.com/photo-1590123732197-e7079d2ceb89?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a29jaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Chinese fishing nets
    description: "Fort Kochi’s artsy lanes, spice markets and sea-breezy promenades.",
    best_time_to_visit: "November to February",
    highlights: ["Chinese Nets", "St. Francis Church", "Jew Town & Synagogue", "Mattancherry", "Cherai Beach"]
  },
  munnar: {
    name: "Munnar",
    image_url: "https://images.unsplash.com/photo-1663597675816-9b5d68952f42?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bXVubmFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Tea estates
    description: "Lush tea gardens and misty peaks of the Western Ghats.",
    best_time_to_visit: "September to March",
    highlights: ["Eravikulam NP", "Tea Museum", "Top Station", "Echo Point", "Photo Point"]
  },
  ooty: {
    name: "Ooty",
    image_url: "https://images.unsplash.com/photo-1638886540342-240980f60d25?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b290eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", // Nilgiris
    description: "Nilgiri hill station famed for lakes, gardens and the toy train.",
    best_time_to_visit: "March to June & September to November",
    highlights: ["Ooty Lake", "Botanical Garden", "Doddabetta", "Toy Train", "Pykara Falls"]
  },
  puducherry: {
    name: "Puducherry",
    image_url: "https://plus.unsplash.com/premium_photo-1694475205503-d6c6a71f03bc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHVkdWNoZXJyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600", // White Town sea-front
    description: "French Quarter, beaches and boulangeries give this seaside town a European feel.",
    best_time_to_visit: "October to March",
    highlights: ["White Town", "Promenade Beach", "Aurobindo Ashram", "Auroville", "Paradise Beach"]
  },
  hampi: {
    name: "Hampi",
    image_url: "https://plus.unsplash.com/premium_photo-1697730504977-26847b1f1f91?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFtcGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600", // Hampi ruins
    description: "Otherworldly boulders and stone-carved ruins of the Vijayanagara empire.",
    best_time_to_visit: "October to February",
    highlights: ["Vittala Temple", "Stone Chariot", "Hemakuta Hills", "Virupaksha Temple", "Sunset viewpoints"]
  },
  mysuru: {
    name: "Mysuru",
    image_url: "https://images.unsplash.com/photo-1600112356915-089abb8fc71a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXlzdXJ1fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Mysore Palace
    description: "Royal heritage, sandalwood, silk and a grand illuminated palace.",
    best_time_to_visit: "October to March",
    highlights: ["Mysore Palace", "Chamundi Hills", "Brindavan Gardens", "Devaraja Market", "Rail Museum"]
  },
  rameswaram: {
    name: "Rameswaram",
    image_url: "https://images.unsplash.com/photo-1541417904950-b855846fe074", // Pamban Bridge coast
    description: "Pilgrim isle with the sweeping Pamban Bridge and Ramanathaswamy Temple.",
    best_time_to_visit: "October to March",
    highlights: ["Ramanathaswamy Temple", "Pamban Bridge", "Dhanushkodi", "Agni Theertham", "APJ Kalam Memorial"]
  },
  kanyakumari: {
    name: "Kanyakumari",
    image_url: "https://images.unsplash.com/photo-1621338613162-569877226e04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGthbnlha3VtYXJpfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Vivekananda Rock
    description: "Southern tip of India with dual sunrise-sunset viewpoints and sea confluence.",
    best_time_to_visit: "October to March",
    highlights: ["Vivekananda Rock", "Thiruvalluvar Statue", "Sunrise Point", "Suchindram", "Kanyakumari Beach"]
  },

  // EAST
  kolkata: {
    name: "Kolkata",
    image_url: "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28", // Howrah Bridge
    description: "Trams, bookshops and grand colonial buildings: culture runs deep here.",
    best_time_to_visit: "November to February",
    highlights: ["Victoria Memorial", "Howrah Bridge", "College Street", "Dakshineswar", "Kumartuli"]
  },
  darjeeling: {
    name: "Darjeeling",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa", // Tea gardens
    description: "Mist, tea and the UNESCO toy train with Kanchenjunga views.",
    best_time_to_visit: "March to May & October to December",
    highlights: ["Tiger Hill", "Batasia Loop", "Tea Gardens", "HMI & Zoo", "Toy Train"]
  },
  shillong: {
    name: "Shillong",
    image_url: "https://images.unsplash.com/photo-1665248919075-246d0ac9a912?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNoaWxsb25nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Umiam Lake
    description: "Waterfalls, cafés and music scene in the ‘Scotland of the East’.",
    best_time_to_visit: "October to May",
    highlights: ["Umiam Lake", "Elephant Falls", "Shillong Peak", "Police Bazar", "Laitlum Canyons"]
  },
  bhubaneswar: {
    name: "Bhubaneswar",
    image_url: "https://images.unsplash.com/photo-1707241934268-5a0c8e206d9c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymh1YmFuZXNod2FyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Lingaraja Temple
    description: "Temple city of Odisha with classic Kalinga architecture and museums.",
    best_time_to_visit: "November to February",
    highlights: ["Lingaraja Temple", "Udayagiri & Khandagiri", "Dhauli", "Odisha State Museum", "Ekamra Walks"]
  },
  puri: {
    name: "Puri",
    image_url: "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFnYW5uYXRoJTIwdGVtcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Puri beach/temple vibe
    description: "Sea breezes and sacred Rath Yatra—Puri balances beach and devotion.",
    best_time_to_visit: "November to February",
    highlights: ["Jagannath Temple", "Puri Beach", "Konark (nearby)", "Chilika Lake", "Swargadwar"]
  },

  // CENTRAL mapped under north filter on Explore page
  bhopal: {
    name: "Bhopal",
    image_url: "https://plus.unsplash.com/premium_photo-1726863214898-0b11a43f4bbe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmhvcGFsfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600", // Upper Lake
    description: "Lakeside promenades with easy access to UNESCO Sanchi and prehistoric Bhimbetka caves.",
    best_time_to_visit: "October to March",
    highlights: ["Upper Lake", "Taj-ul-Masajid", "Sanchi (nearby)", "Bhimbetka (nearby)", "MP Tribal Museum"]
  }
};

const CityDetails = () => {
  const { citySlug } = useParams();
  const location = useLocation() as any;

  // Normalize slug to avoid case/space mismatches
  const normalizedSlug = (citySlug || '').toString().trim().toLowerCase();

  const { data: city, isLoading } = useQuery({
    queryKey: ['city', normalizedSlug],
    queryFn: () => apiClient.getCityDetails(normalizedSlug),
    enabled: !!normalizedSlug
  });

  // Use API result only if it looks valid; otherwise fall back to local dataset, otherwise use link state fallback
  const fromLink = location?.state?.cityFallback || null;
  const apiLooksValid =
    city &&
    city.name &&
    city.name !== 'City Not Found' &&
    Array.isArray(city.highlights) &&
    city.highlights.length > 0;
  const local = normalizedSlug ? localCityData[normalizedSlug] : null;
  const resolvedCity = (apiLooksValid ? city : (local || fromLink));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!resolvedCity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto py-20">
          <h1 className="text-4xl font-bold mb-4">City Not Found</h1>
          <p className="text-gray-600 mb-4">Sorry, we couldn't find information about this city.</p>
          <Link to="/explore-india" className="text-primary hover:underline inline-flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" />
            Back to Explore India
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Create info sections from available data (keeping your structure)
  const infoSections = [
    {
      id: 'travel',
      title: 'Travel Information',
      icon: <Bus className="h-5 w-5" />,
      content: `Getting around ${resolvedCity.name} is easy with local taxis/ride-hailing and public transport where available. For short hops, auto-rickshaws are convenient; for full-day sightseeing, hire a cab.`
    },
    {
      id: 'time',
      title: 'Best Time to Visit',
      icon: <Calendar className="h-5 w-5" />,
      content: `The best time to visit ${resolvedCity.name} is ${resolvedCity.best_time_to_visit}. Expect pleasant weather and clearer skies for sightseeing and outdoor plans.`
    },
    {
      id: 'stay',
      title: 'Where to Stay',
      icon: <Home className="h-5 w-5" />,
      content: `Choose central neighborhoods for easy access to sights. Upscale areas offer boutique hotels, while old quarters provide heritage stays and homestays.`
    },
    {
      id: 'food',
      title: 'Local Cuisine',
      icon: <Utensils className="h-5 w-5" />,
      content: `Sample local specialties and street food classics—ask your hotel for trusted stalls, or book a guided food walk to taste safely and widely.`
    },
    {
      id: 'culture',
      title: 'Local Culture',
      icon: <Heart className="h-5 w-5" />,
      content: `Festivals and evening performances offer a window into ${resolvedCity.name}'s traditions. Dress modestly at religious sites and follow photography rules.`
    },
    {
      id: 'emergency',
      title: 'Emergency Information',
      icon: <Phone className="h-5 w-5" />,
      content: 'Police: 100, Ambulance: 102, Fire: 101. Save your hotel’s number and nearest hospital on your phone.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={resolvedCity.image_url}
          alt={resolvedCity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold text-white mb-2">{resolvedCity.name}</h1>
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
              <p className="text-lg text-gray-700 leading-relaxed">{resolvedCity.description}</p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {resolvedCity.highlights.map((h, i) => (
                  <Badge
                    key={i}
                    className="bg-raahi-orange/10 text-raahi-orange border-raahi-orange hover:bg-raahi-orange/20 px-4 py-2 text-sm"
                  >
                    {h}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Essential Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Essential Information</h2>
              <Accordion type="single" collapsible className="w-full">
                {infoSections.map((s) => (
                  <AccordionItem key={s.id} value={s.id} className="border rounded-lg mb-2 bg-white">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center">
                        <div className="mr-3 text-primary">{s.icon}</div>
                        <span className="font-medium">{s.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="pl-8 text-gray-700 text-[15px] leading-relaxed">
                        {s.content}
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
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-gray-700">{resolvedCity.best_time_to_visit}</span>
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
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Explore more destinations</div>
                    <div className="text-sm text-primary">View all cities</div>
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
