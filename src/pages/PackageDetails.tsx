import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Home, 
  Utensils, 
  Bus, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  Users,
  CalendarDays,
  Star
} from "lucide-react";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

// Mock package data based on IDs from TravelPackages.tsx
const packagesData = {
  "1": {
    id: "1",
    title: "Serene Kashmir Voyage",
    location: "Kashmir, India",
    duration: "6 Days / 5 Nights",
    price: "₹32,999",
    category: "Honeymoon",
    image_url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    description: "Embark on a romantic journey through the breathtaking landscapes of Kashmir. Known as 'Paradise on Earth', Kashmir offers snow-capped mountains, serene lakes, and lush gardens that create the perfect backdrop for couples. This carefully crafted package includes stays at premium houseboats, guided tours of iconic spots, and special romantic experiences.",
    highlights: ["Shikara ride on Dal Lake", "Visit to Mughal Gardens", "Gondola ride in Gulmarg", "Stay in luxury houseboats", "Romantic dinner by the lake"],
    inclusions: [
      "5 nights accommodation in premium hotels and houseboats",
      "Daily breakfast and dinner",
      "All transfers and sightseeing as per itinerary",
      "English speaking guide during sightseeing tours",
      "Welcome drink on arrival",
      "All applicable taxes and service charges"
    ],
    exclusions: [
      "Airfare to/from Srinagar",
      "Personal expenses",
      "Any meal not specified in the inclusions",
      "Optional tours and activities",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Srinagar",
        description: "Arrive at Srinagar Airport and transfer to your houseboat on Dal Lake. Evening Shikara ride on the lake to enjoy the sunset. Overnight stay at the houseboat."
      },
      {
        day: "Day 2",
        title: "Srinagar Sightseeing",
        description: "Visit famous Mughal Gardens - Nishat Bagh, Shalimar Bagh, and Chashme Shahi. Explore local markets and enjoy a traditional Kashmiri dinner. Return to houseboat for overnight stay."
      },
      {
        day: "Day 3",
        title: "Gulmarg Excursion",
        description: "Full day excursion to Gulmarg, known for its scenic beauty. Enjoy a Gondola ride (cable car) for panoramic views of the Himalayas. Return to Srinagar for overnight stay."
      },
      {
        day: "Day 4",
        title: "Pahalgam Visit",
        description: "Drive to Pahalgam, the 'Valley of Shepherds'. Visit Betaab Valley and Chandanwari. Enjoy the natural beauty and take a pony ride (at own expense). Overnight stay in Pahalgam."
      },
      {
        day: "Day 5",
        title: "Pahalgam to Srinagar",
        description: "Morning at leisure in Pahalgam. Return to Srinagar in the afternoon. Evening shopping at local markets. Romantic dinner by the lake. Overnight stay in Srinagar."
      },
      {
        day: "Day 6",
        title: "Departure",
        description: "After breakfast, check-out and transfer to Srinagar Airport for your onward journey."
      }
    ],
    rating: 4.8,
    reviews: 124,
    image_gallery: [
      "https://images.unsplash.com/photo-1566837497312-7be4a47b4304",
      "https://images.unsplash.com/photo-1570143675316-51a19f90a943",
      "https://images.unsplash.com/photo-1619837374214-f5b9eb80876d",
      "https://images.unsplash.com/photo-1611254666500-4bfe1a9ed1fe"
    ]
  },
  "2": {
    id: "2",
    title: "Goa Beach Adventure",
    location: "Goa, India",
    duration: "4 Days / 3 Nights",
    price: "₹18,499",
    category: "Friends",
    image_url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
    description: "Experience the perfect beach getaway with your friends in Goa, India's party paradise. This package offers the perfect balance of relaxation, adventure, and nightlife. Enjoy pristine beaches, water sports, and the vibrant nightlife that makes Goa famous around the world.",
    highlights: ["Stunning beaches", "Water sports", "Vibrant nightlife", "Historic forts", "Delicious Goan cuisine"],
    inclusions: [
      "3 nights accommodation in beachfront resort",
      "Daily breakfast",
      "Airport/railway station transfers",
      "One water sport activity per person",
      "Half-day North Goa sightseeing tour",
      "All applicable taxes"
    ],
    exclusions: [
      "Airfare/train fare",
      "Personal expenses",
      "Meals not mentioned in inclusions",
      "Additional activities and tours",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Goa",
        description: "Arrive at Goa Airport/Railway Station and transfer to your beachfront resort. Rest of the day at leisure to explore the nearby beach. Evening free for nightlife experience."
      },
      {
        day: "Day 2",
        title: "North Goa Exploration",
        description: "Half-day tour of North Goa covering Calangute Beach, Baga Beach, Fort Aguada, and Anjuna Flea Market. Evening free for leisure activities or beach parties."
      },
      {
        day: "Day 3",
        title: "Water Sports Day",
        description: "Enjoy various water sports activities like parasailing, jet skiing, banana boat ride, and more at Calangute Beach. Evening cruise on Mandovi River with live entertainment (optional)."
      },
      {
        day: "Day 4",
        title: "Departure",
        description: "After breakfast, check-out and transfer to Goa Airport/Railway Station for your onward journey."
      }
    ],
    rating: 4.6,
    reviews: 210,
    image_gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      "https://images.unsplash.com/photo-1608555855762-2b657eb1c348",
      "https://images.unsplash.com/photo-1618983652325-538c17995de8",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"
    ]
  },
  "3": {
    id: "3",
    title: "Rajasthan Heritage Tour",
    location: "Rajasthan, India",
    duration: "8 Days / 7 Nights",
    price: "₹45,999",
    category: "Family",
    image_url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    description: "Immerse your family in the royal heritage of Rajasthan with this comprehensive tour. Discover magnificent forts, palaces, and the vibrant culture of this desert state. This family-friendly package includes comfortable accommodations, guided tours, and activities that will appeal to all ages.",
    highlights: ["Majestic forts and palaces", "Desert safari in Jaisalmer", "Cultural performances", "Traditional Rajasthani cuisine", "Historic havelis"],
    inclusions: [
      "7 nights accommodation in heritage hotels",
      "Daily breakfast and dinner",
      "Private air-conditioned vehicle for transfers and sightseeing",
      "English speaking guide during sightseeing tours",
      "Camel safari in Jaisalmer",
      "Cultural show with dinner in Jaipur",
      "Monument entrance fees as per itinerary",
      "All applicable taxes"
    ],
    exclusions: [
      "Airfare",
      "Personal expenses",
      "Lunch and other meals not mentioned",
      "Optional tours and activities",
      "Camera fees at monuments",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Jaipur",
        description: "Arrive at Jaipur Airport and transfer to your hotel. Evening visit to Chokhi Dhani for traditional Rajasthani dinner and cultural show. Overnight in Jaipur."
      },
      {
        day: "Day 2",
        title: "Jaipur Sightseeing",
        description: "Full day sightseeing of Jaipur including Amber Fort, City Palace, Jantar Mantar, and Hawa Mahal. Shopping time in local markets. Overnight in Jaipur."
      },
      {
        day: "Day 3",
        title: "Jaipur to Jodhpur",
        description: "Drive to Jodhpur after breakfast. En route, visit Pushkar. Evening at leisure in Jodhpur. Overnight stay in Jodhpur."
      },
      {
        day: "Day 4",
        title: "Jodhpur Exploration",
        description: "Visit Mehrangarh Fort, Jaswant Thada, and Umaid Bhawan Palace. Explore the local markets of Jodhpur. Overnight in Jodhpur."
      },
      {
        day: "Day 5",
        title: "Jodhpur to Jaisalmer",
        description: "Drive to Jaisalmer after breakfast. Evening at leisure. Overnight in Jaisalmer."
      },
      {
        day: "Day 6",
        title: "Jaisalmer Sightseeing & Desert Safari",
        description: "Visit Jaisalmer Fort, Patwon Ki Haveli, and Gadisar Lake. Evening camel safari in Sam Sand Dunes with cultural program and dinner. Overnight in Jaisalmer."
      },
      {
        day: "Day 7",
        title: "Jaisalmer to Udaipur",
        description: "Long drive to Udaipur after breakfast. Evening boat ride on Lake Pichola (subject to water level). Overnight in Udaipur."
      },
      {
        day: "Day 8",
        title: "Departure from Udaipur",
        description: "Visit City Palace and Saheliyon Ki Bari in the morning. Transfer to Udaipur Airport for departure."
      }
    ],
    rating: 4.9,
    reviews: 178,
    image_gallery: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41",
      "https://images.unsplash.com/photo-1567432234688-b42b4d97ff76",
      "https://images.unsplash.com/photo-1620756236308-65c3ef5d25f3",
      "https://images.unsplash.com/photo-1544124499-58912cbddafc"
    ]
  },
  "4": {
    id: "4",
    title: "Varanasi Spiritual Journey",
    location: "Varanasi, India",
    duration: "5 Days / 4 Nights",
    price: "₹25,999",
    category: "Spiritual",
    image_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    description: "Embark on a spiritual journey to Varanasi, one of the oldest continuously inhabited cities in the world and a significant spiritual center for Hinduism. This package offers a deep dive into the spiritual and cultural essence of Varanasi, with visits to sacred ghats, temples, and nearby Buddhist sites.",
    highlights: ["Morning and evening Ganga Aarti", "Boat ride on the River Ganges", "Visit to Sarnath", "Meditation sessions", "Ancient temples"],
    inclusions: [
      "4 nights accommodation in riverside hotel",
      "Daily breakfast and dinner",
      "Airport transfers",
      "Guided sightseeing tours as per itinerary",
      "Boat rides on the Ganges",
      "Meditation session with a local guru",
      "All applicable taxes"
    ],
    exclusions: [
      "Airfare",
      "Personal expenses",
      "Meals not mentioned in inclusions",
      "Optional activities",
      "Camera fees at religious sites",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Varanasi",
        description: "Arrive at Varanasi Airport and transfer to your hotel. Evening visit to Dashashwamedh Ghat to witness the spectacular Ganga Aarti ceremony. Overnight in Varanasi."
      },
      {
        day: "Day 2",
        title: "Varanasi Temples & Ghats",
        description: "Early morning boat ride on the River Ganges to witness the sunrise and morning rituals. Visit to Kashi Vishwanath Temple, Annapurna Temple, and other important temples. Evening guided walk through the ancient lanes of Varanasi. Overnight in Varanasi."
      },
      {
        day: "Day 3",
        title: "Sarnath Excursion",
        description: "Day trip to Sarnath, where Buddha gave his first sermon. Visit the Dhamek Stupa, Sarnath Museum, and other Buddhist monuments. Return to Varanasi for evening Ganga Aarti. Overnight in Varanasi."
      },
      {
        day: "Day 4",
        title: "Spiritual Experiences",
        description: "Morning yoga and meditation session by the Ganges. Visit to Banaras Hindu University and New Vishwanath Temple. Afternoon boat ride to the other side of the Ganges to experience rural life. Evening at leisure. Overnight in Varanasi."
      },
      {
        day: "Day 5",
        title: "Departure",
        description: "Early morning boat ride on the Ganges if time permits. After breakfast, transfer to Varanasi Airport for your onward journey."
      }
    ],
    rating: 4.7,
    reviews: 156,
    image_gallery: [
      "https://images.unsplash.com/photo-1561361058-c24cecda9170",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      "https://images.unsplash.com/photo-1555952171-cbe1d56600a6",
      "https://images.unsplash.com/photo-1571536802806-30aa823c573d"
    ]
  },
  "5": {
    id: "5",
    title: "Himalayan Adventure Trek",
    location: "Himachal Pradesh, India",
    duration: "7 Days / 6 Nights",
    price: "₹38,499",
    category: "Adventure",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    description: "Challenge yourself with an exhilarating trek through the majestic Himalayas in Himachal Pradesh. This adventure package combines thrilling outdoor activities with breathtaking mountain scenery. Ideal for active travelers, this trek offers the perfect blend of adventure, nature, and local culture.",
    highlights: ["Himalayan trekking", "Camping under the stars", "River rafting", "Mountain villages", "Stunning landscapes"],
    inclusions: [
      "6 nights accommodation (3 in hotels, 3 in camps)",
      "All meals during the trek",
      "Breakfast in hotels",
      "All transportation as per itinerary",
      "Professional trekking guide",
      "Camping equipment",
      "Permits and entry fees",
      "River rafting session",
      "All applicable taxes"
    ],
    exclusions: [
      "Airfare",
      "Personal trekking gear",
      "Personal expenses",
      "Additional activities not mentioned in itinerary",
      "Travel insurance (mandatory for trekking)",
      "Porter charges for personal baggage"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Manali",
        description: "Arrive at Manali and check-in to your hotel. Orientation and briefing session about the trek. Overnight in Manali."
      },
      {
        day: "Day 2",
        title: "Acclimatization in Manali",
        description: "Short acclimatization trek to nearby hills. Visit Hadimba Temple and Old Manali. Gear check and final preparation for the trek. Overnight in Manali."
      },
      {
        day: "Day 3",
        title: "Manali to Solang Valley",
        description: "Drive to Solang Valley and begin the trek to the first campsite. 4-5 hours of moderate trekking. Evening campfire. Overnight in tents."
      },
      {
        day: "Day 4",
        title: "Trek to Dhundi",
        description: "Trek through pine forests and meadows to reach Dhundi. 5-6 hours of trekking. Witness spectacular mountain views. Overnight in tents."
      },
      {
        day: "Day 5",
        title: "Dhundi to Bakarthach",
        description: "The most challenging day of the trek with steep ascents. 6-7 hours of trekking. Reach the highest point of the trek with panoramic views of the Himalayan range. Overnight in tents."
      },
      {
        day: "Day 6",
        title: "Return to Manali",
        description: "Descend back to Solang Valley and drive to Manali. Afternoon river rafting session on Beas River. Farewell dinner. Overnight in Manali."
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "After breakfast, transfer to Manali bus stand/Kullu airport for your onward journey."
      }
    ],
    rating: 4.9,
    reviews: 92,
    image_gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      "https://images.unsplash.com/photo-1580651214613-f4692d6d138f",
      "https://images.unsplash.com/photo-1579683670728-96c9abc7a61b",
      "https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab"
    ]
  },
};

const PackageDetails = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const { toast } = useToast();

  // Get package data based on id
  const packageData = id && packagesData[id as keyof typeof packagesData];

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto py-20">
          <h1 className="text-4xl font-bold mb-4">Package Not Found</h1>
          <p className="text-gray-600 mb-4">Sorry, we couldn't find information about this package.</p>
          <Link to="/travel-packages" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Travel Packages
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBookNow = () => {
    toast({
      title: "Booking Initiated",
      description: "This is a demo feature. In a real application, this would take you to a booking form.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={packageData.image_url} 
          alt={packageData.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Badge 
              className="bg-raahi-orange hover:bg-raahi-orange-dark mb-3"
            >
              {packageData.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{packageData.title}</h1>
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{packageData.location}</span>
              <span className="mx-2">•</span>
              <CalendarDays className="h-5 w-5 mr-2" />
              <span>{packageData.duration}</span>
              <span className="mx-2">•</span>
              <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
              <span>{packageData.rating} ({packageData.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/travel-packages" className="text-gray-500 hover:text-gray-900">Travel Packages</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium">{packageData.title}</span>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <Tabs 
                defaultValue="overview" 
                value={selectedTab} 
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="border-b w-full grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="p-6">
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-semibold mb-4">About This Package</h2>
                    <p className="text-gray-700 mb-6">{packageData.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                      {packageData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Inclusions</h3>
                        <ul className="space-y-2">
                          {packageData.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Exclusions</h3>
                        <ul className="space-y-2">
                          {packageData.exclusions.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Tour Itinerary</h2>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="relative pl-8 pb-8 border-l-2 border-primary/20 last:border-l-0 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                        <div className="mb-2">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {day.day}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{day.title}</h3>
                        <p className="text-gray-700">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Gallery Tab */}
                <TabsContent value="gallery" className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Photo Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageData.image_gallery.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden h-60">
                        <img 
                          src={image} 
                          alt={`${packageData.title} - ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="bg-white shadow-sm sticky top-24">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {packageData.price}
                  <span className="text-base font-normal text-gray-500 ml-1">per person</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-6">*Prices may vary based on the date of travel and number of travelers.</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Group Size</div>
                      <div className="text-sm text-gray-600">Min 2, Max 15 travelers</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CalendarDays className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-sm text-gray-600">{packageData.duration}</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" size="lg" onClick={handleBookNow}>
                  Book Now
                </Button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  No payment required to reserve your spot
                </div>
              </CardContent>
            </Card>

            {/* Need Help Card */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Call us at</div>
                    <div className="font-medium">+91 98765 43210</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Our travel experts are available 24/7 to answer your questions and help with bookings.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PackageDetails; 