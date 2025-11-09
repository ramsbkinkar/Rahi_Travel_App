import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
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

// Details for every id used on the listing page
const packagesData: Record<string, {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  category: "Honeymoon" | "Adventure" | "Spiritual" | "Friends" | "Family";
  image_url: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: string; title: string; description: string }[];
  rating: number;
  reviews: number;
  image_gallery: string[];
}> = {
  "1": {
    id: "1",
    title: "Serene Kashmir Voyage",
    location: "Kashmir, India",
    duration: "6 Days / 5 Nights",
    price: "₹37,403",
    category: "Honeymoon",
    image_url: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    description: "Romantic houseboats on Dal Lake, Mughal gardens, and alpine meadows—Kashmir is perfect for couples seeking calm scenery and gentle adventure.",
    highlights: ["Shikara ride on Dal Lake", "Mughal Gardens", "Gulmarg Gondola", "Pahalgam valleys", "Sunset dinner by the lake"],
    inclusions: ["5 nights accommodation (hotel + houseboat)", "Daily breakfast & dinner", "Private transfers & sightseeing", "English-speaking guide", "All taxes"],
    exclusions: ["Flights", "Personal expenses", "Lunches", "Optional activities", "Travel insurance"],
    itinerary: [
      { day: "Day 1", title: "Srinagar Arrival", description: "Check-in to houseboat, evening shikara ride." },
      { day: "Day 2", title: "Mughal Gardens", description: "Nishat, Shalimar & Chashme Shahi; local market walk." },
      { day: "Day 3", title: "Gulmarg", description: "Gondola to Kongdoori (weather permitting)." },
      { day: "Day 4", title: "Pahalgam", description: "Betaab Valley & Aru, optional pony ride." },
      { day: "Day 5", title: "Leisure & Shopping", description: "Crafts, saffron farms (seasonal), romantic dinner." },
      { day: "Day 6", title: "Departure", description: "Airport drop." }
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
    price: "₹19,795",
    category: "Friends",
    image_url: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    description: "Chill by the sea, try water sports, and explore forts & nightlife—classic Goa with a tidy plan for friends.",
    highlights: ["Calangute & Baga beaches", "Fort Aguada", "Water sports", "Nightlife & cafés", "Mandovi cruise (optional)"],
    inclusions: ["3 nights resort stay", "Breakfast", "Airport transfers", "North Goa sightseeing", "Taxes"],
    exclusions: ["Flights", "Lunch/Dinner", "Extra activities", "Travel insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive & Beach Time", description: "Relax at the resort; sunset on the beach." },
      { day: "Day 2", title: "North Goa Tour", description: "Fort Aguada, Baga, Calangute & Anjuna market." },
      { day: "Day 3", title: "Water Sports", description: "Parasailing / Jet ski; evening free or cruise." },
      { day: "Day 4", title: "Departure", description: "Transfer to airport." }
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
    price: "₹37,730",
    category: "Family",
    image_url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    description: "Jaipur–Jodhpur–Jaisalmer–Udaipur with forts, palaces, desert safari & lake cruises—an easy-paced royal circuit for families.",
    highlights: ["Amber & Mehrangarh Forts", "Jaisalmer desert safari", "Havelis & bazaars", "Lake Pichola boat ride", "Cultural show & dinner"],
    inclusions: ["7 nights heritage hotels", "Breakfast & dinner", "AC private vehicle", "Guide & monument fees", "Camel ride at dunes"],
    exclusions: ["Flights", "Lunch", "Personal expenses", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Jaipur Arrival", description: "Evening at Chokhi Dhani." },
      { day: "Day 2", title: "Pink City", description: "Amber, City Palace, Jantar Mantar, Hawa Mahal." },
      { day: "Day 3", title: "To Jodhpur", description: "En route Pushkar." },
      { day: "Day 4", title: "Blue City", description: "Mehrangarh, Jaswant Thada, old markets." },
      { day: "Day 5", title: "To Jaisalmer", description: "Evening leisure." },
      { day: "Day 6", title: "Golden City", description: "Fort, Patwon ki Haveli; dunes with cultural program." },
      { day: "Day 7", title: "To Udaipur", description: "Evening boat ride." },
      { day: "Day 8", title: "Udaipur & Depart", description: "City Palace, Saheliyon-ki-Bari; airport drop." }
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
    price: "₹50,341",
    category: "Spiritual",
    image_url: "https://images.unsplash.com/photo-1627938823193-fd13c1c867dd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    description: "A soulful immersion—sunrise boat rides, evening Ganga Aarti, temple walks, and Sarnath.",
    highlights: ["Morning & evening Aarti", "Sunrise boat ride", "Kashi Vishwanath Temple", "Sarnath visit", "Yoga/meditation by Ganga"],
    inclusions: ["4 nights riverside hotel", "Breakfast & dinner", "Airport transfers", "Guided tours", "Boat rides", "Taxes"],
    exclusions: ["Flights", "Lunch", "Camera fees", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive & Evening Aarti", description: "Dashashwamedh Ghat ceremony." },
      { day: "Day 2", title: "Ghats & Temples", description: "Sunrise boat, Kashi Vishwanath & lanes walk." },
      { day: "Day 3", title: "Sarnath", description: "Dhamek Stupa & museum." },
      { day: "Day 4", title: "Yoga & BHU", description: "Meditation; campus sights; leisure." },
      { day: "Day 5", title: "Departure", description: "Airport drop." }
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
    price: "₹34,4766",
    category: "Adventure",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    description: "Moderate trek through Solang–Dhundi–Bakarthach with camping, starlit nights and river rafting.",
    highlights: ["Alpine meadows", "Camping under stars", "Rafting on Beas", "High-altitude vistas", "Local Himachali flavours"],
    inclusions: ["Hotels & camps (6N)", "All trek meals", "Guide & permits", "Transfers per itinerary", "Rafting session", "Camping gear"],
    exclusions: ["Flights", "Personal gear", "Insurance (mandatory)", "Tips & personal expenses"],
    itinerary: [
      { day: "Day 1", title: "Manali Arrival", description: "Briefing & acclimatization." },
      { day: "Day 2", title: "Local Walk", description: "Hadimba & Old Manali; gear check." },
      { day: "Day 3", title: "Solang → Camp 1", description: "4–5 hr trek; campfire." },
      { day: "Day 4", title: "To Dhundi", description: "Forests & meadows; views." },
      { day: "Day 5", title: "To Bakarthach", description: "Steep sections; highest point." },
      { day: "Day 6", title: "Back to Manali", description: "Descend; afternoon rafting." },
      { day: "Day 7", title: "Depart", description: "Onward travel." }
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
  "6": {
    id: "6",
    title: "Kerala Backwaters Retreat",
    location: "Alleppey & Munnar, India",
    duration: "6 Days / 5 Nights",
    price: "₹34,499",
    category: "Honeymoon",
    image_url: "https://media.istockphoto.com/id/520413349/photo/backwaters-of-kerala.jpg?s=612x612&w=0&k=20&c=DbiECQUkS06JDDWZtdH4O3UBTJKOfM0eu0ZgVwNwuoY=",
    description: "Tea-garden mornings in Munnar and a private houseboat over serene backwaters in Alleppey.",
    highlights: ["Private houseboat", "Tea gardens & Eravikulam", "Echo Point & Top Station", "Kathakali show", "Spice plantation"],
    inclusions: ["Hotels 4N + Houseboat 1N", "Breakfast daily", "All transfers & sightseeing", "Driver cum guide", "Taxes"],
    exclusions: ["Flights", "Lunch/Dinner (except houseboat)", "Optional shows", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Cochin → Munnar", description: "Waterfalls en route; evening leisure." },
      { day: "Day 2", title: "Munnar Tour", description: "Tea museum, Top Station, Echo Point." },
      { day: "Day 3", title: "Eravikulam NP", description: "Morning park visit; drive to Alleppey." },
      { day: "Day 4", title: "Houseboat Stay", description: "Cruise with onboard meals." },
      { day: "Day 5", title: "Cochin City", description: "Fort Kochi & Chinese nets." },
      { day: "Day 6", title: "Departure", description: "Airport drop." }
    ],
    rating: 4.8,
    reviews: 132,
    image_gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      "https://images.unsplash.com/photo-1560347876-aeef00ee58a1",
      "https://images.unsplash.com/photo-1543351611-58f05f8b8f3b",
      "https://images.unsplash.com/photo-1541417904950-b855846fe074"
    ]
  },
  "7": {
    id: "7",
    title: "Andaman Island Escape",
    location: "Havelock & Port Blair, India",
    duration: "5 Days / 4 Nights",
    price: "₹39,999",
    category: "Friends",
    image_url: "https://images.unsplash.com/photo-1586053226626-febc8817962f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5kYW1hbiUyMGFuZCUyMG5pY29iYXIlMjBpc2xhbmRzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    description: "White-sand beaches, snorkelling at Elephant Beach and sunsets at Radhanagar.",
    highlights: ["Radhanagar Beach", "Elephant Beach snorkel", "Cellular Jail light show", "Coral reefs", "Seafood cafés"],
    inclusions: ["4 nights hotels", "Breakfast", "Airport & jetty transfers", "Ferry tickets", "Sightseeing tours"],
    exclusions: ["Flights", "Lunch/Dinner", "Water sports fees", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Port Blair", description: "Cellular Jail & light show." },
      { day: "Day 2", title: "To Havelock", description: "Radhanagar Beach sunset." },
      { day: "Day 3", title: "Elephant Beach", description: "Snorkel / water sports." },
      { day: "Day 4", title: "Leisure", description: "Optional scuba or Kalapathar." },
      { day: "Day 5", title: "Back & Depart", description: "Return to Port Blair & fly out." }
    ],
    rating: 4.7,
    reviews: 118,
    image_gallery: [
      "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fit=crop&w=1200&q=80"
    ]
  },
  "8": {
    id: "8",
    title: "Leh–Ladakh Road Trip",
    location: "Ladakh, India",
    duration: "7 Days / 6 Nights",
    price: "₹44,999",
    category: "Adventure",
    image_url: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    description: "High-pass drives, Pangong Tso blues and monasteries—quintessential Ladakh circuit.",
    highlights: ["Khardung La", "Pangong Tso", "Nubra Valley dunes", "Thiksey & Hemis", "Stargazing"],
    inclusions: ["6 nights hotels/camps", "Breakfast & dinner", "Innova/Scorpio transport", "Permits & oxygen cylinder on request", "Airport transfers"],
    exclusions: ["Flights", "Lunch", "Camel/ATV rides", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Leh Arrival", description: "Acclimatization & Shanti Stupa." },
      { day: "Day 2", title: "Monasteries", description: "Thiksey, Hemis & Leh market." },
      { day: "Day 3", title: "Nubra via Khardung La", description: "Sand dunes & Bactrian camels." },
      { day: "Day 4", title: "To Pangong", description: "Lakeside camp night." },
      { day: "Day 5", title: "Back to Leh", description: "Scenic drive & cafés." },
      { day: "Day 6", title: "Leisure Day", description: "Optional rafting / Turtuk trip." },
      { day: "Day 7", title: "Depart", description: "Airport drop." }
    ],
    rating: 4.8,
    reviews: 164,
    image_gallery: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1544739313-6fadff2bdc01",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b"
    ]
  },
  "9": {
    id: "9",
    title: "Rishikesh Yoga & Rafting",
    location: "Rishikesh, India",
    duration: "4 Days / 3 Nights",
    price: "₹16,999",
    category: "Spiritual",
    image_url: "https://images.unsplash.com/photo-1650341259809-9314b0de9268?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmlzaGlrZXNofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    description: "Daily yoga by the Ganges, Ganga Aarti, and Grade II–III rafting—mindful yet thrilling.",
    highlights: ["Morning yoga", "Parmarth Aarti", "Rafting stretch", "Beatles Ashram", "Lakshman Jhula"],
    inclusions: ["3 nights ashram/resort", "Breakfast", "Rafting with gear", "Local transfers", "Instructor & guide"],
    exclusions: ["Flights/train", "Lunch/Dinner", "Personal expenses", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive & Aarti", description: "Evening ceremony by the Ganges." },
      { day: "Day 2", title: "Yoga & Local Sights", description: "Beatles Ashram & cafés." },
      { day: "Day 3", title: "Rafting Day", description: "Shivpuri to Rishikesh run." },
      { day: "Day 4", title: "Departure", description: "Leisure & checkout." }
    ],
    rating: 4.6,
    reviews: 96,
    image_gallery: [
      "https://images.unsplash.com/photo-1541417904950-b855846fe074",
      "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17",
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38"
    ]
  },
  "10": {
    id: "10",
    title: "Ooty & Kodaikanal Hills",
    location: "Tamil Nadu, India",
    duration: "5 Days / 4 Nights",
    price: "₹23,999",
    category: "Family",
    image_url: "https://images.unsplash.com/photo-1650341259809-9314b0de9268?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmlzaGlrZXNofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    description: "Nilgiri toy-train vibes, lakes, botanical gardens and misty viewpoints for families.",
    highlights: ["Toy train (subject to tickets)", "Ooty Lake boating", "Botanical Garden", "Coaker’s Walk", "Pillar Rocks"],
    inclusions: ["4 nights hotel", "Breakfast", "Private transfers", "Sightseeing as per plan", "Taxes"],
    exclusions: ["Flights", "Entry tickets", "Lunch/Dinner", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Coimbatore → Ooty", description: "Evening lake walk." },
      { day: "Day 2", title: "Ooty Tour", description: "Gardens & viewpoints; optional toy train." },
      { day: "Day 3", title: "To Kodaikanal", description: "Scenic drive & leisure." },
      { day: "Day 4", title: "Kodaikanal Tour", description: "Coaker’s Walk, Bryant Park & boating." },
      { day: "Day 5", title: "Depart", description: "Return to Coimbatore/Madurai." }
    ],
    rating: 4.5,
    reviews: 88,
    image_gallery: [
      "https://images.unsplash.com/photo-1571407970349-bc81e8d4b2e1",
      "https://images.unsplash.com/photo-1560347876-aeef00ee58a1",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      "https://images.unsplash.com/photo-1558981852-426c6c22a254"
    ]
  },
  "11": {
    id: "11",
    title: "Sikkim & Gangtok Discovery",
    location: "Sikkim, India",
    duration: "6 Days / 5 Nights",
    price: "₹36,999",
    category: "Family",
    image_url: "https://images.unsplash.com/photo-1573398643956-2b9e6ade3456?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    description: "Monasteries, ropeways and snow-kissed Tsomgo Lake—Sikkim at a family-friendly pace.",
    highlights: ["Tsomgo Lake & Baba Mandir", "MG Marg", "Rumtek Monastery", "Pelling Skywalk (optional)", "Teesta valley views"],
    inclusions: ["5 nights hotels", "Breakfast & dinner", "Permits & transfers", "Sightseeing tours", "Taxes"],
    exclusions: ["Flights", "Lunch", "Cable car tickets", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Bagdogra → Gangtok", description: "Evening at MG Marg." },
      { day: "Day 2", title: "Tsomgo & Baba Mandir", description: "High-altitude lake trip." },
      { day: "Day 3", title: "Gangtok City", description: "Monasteries & ropeway." },
      { day: "Day 4", title: "To Pelling", description: "Valley views en route." },
      { day: "Day 5", title: "Pelling Tour", description: "Skywalk & Rabdentse ruins." },
      { day: "Day 6", title: "Depart", description: "Drive back to IXB." }
    ],
    rating: 4.7,
    reviews: 121,
    image_gallery: [
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
      "https://images.unsplash.com/photo-1563371351-e53ebb744a1b"
    ]
  },
  "12": {
    id: "12",
    title: "Meghalaya Living Roots",
    location: "Shillong & Cherrapunji, India",
    duration: "5 Days / 4 Nights",
    price: "₹27,999",
    category: "Adventure",
    image_url: "https://images.unsplash.com/photo-1625826415766-001bd75aaf52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVnaGFsYXlhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    description: "Emerald valleys, waterfalls and the famed double-decker living root bridge.",
    highlights: ["Umiam Lake", "Nohkalikai Falls", "Mawsmai Caves", "Double-decker bridge trek", "Dawki crystal river"],
    inclusions: ["4 nights hotels", "Breakfast", "Private transfers", "Guide for bridge trek", "Permits & taxes"],
    exclusions: ["Flights", "Lunch/Dinner", "Adventure fees", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Guwahati → Shillong", description: "Umiam Lake stop." },
      { day: "Day 2", title: "Cherrapunji Circuit", description: "Falls & caves." },
      { day: "Day 3", title: "Root Bridge Trek", description: "Nongriat hike day." },
      { day: "Day 4", title: "Dawki & Mawlynnong", description: "Crystal river & cleanest village." },
      { day: "Day 5", title: "Depart", description: "Return to Guwahati." }
    ],
    rating: 4.8,
    reviews: 109,
    image_gallery: [
      "https://images.unsplash.com/photo-1541417904950-b855846fe074",
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
      "https://images.unsplash.com/photo-1563371351-e53ebb744a1b",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38"
    ]
  },
  "13": {
    id: "13",
    title: "Coorg Coffee Trails",
    location: "Coorg, Karnataka, India",
    duration: "4 Days / 3 Nights",
    price: "₹19,999",
    category: "Friends",
    image_url: "https://images.unsplash.com/photo-1625826415766-001bd75aaf52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVnaGFsYXlhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    description: "Plantation walks, Abbey Falls and homestay vibes amidst rolling coffee estates.",
    highlights: ["Coffee estate tour", "Abbey Falls", "Raja’s Seat sunset", "Dubare Elephant Camp", "Local Kodava cuisine"],
    inclusions: ["3 nights homestay/resort", "Breakfast", "Private cab", "Estate tour", "Taxes"],
    exclusions: ["Flights", "Lunch/Dinner", "Entry fees", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive & Unwind", description: "Estate walk & bonfire." },
      { day: "Day 2", title: "Coorg Sights", description: "Abbey Falls, Raja’s Seat." },
      { day: "Day 3", title: "Dubare & Leisure", description: "Elephant interactions, cafés." },
      { day: "Day 4", title: "Departure", description: "Drive back to Mysuru/Bengaluru." }
    ],
    rating: 4.5,
    reviews: 74,
    image_gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1545249390-6bdfa2860321",
      "https://images.unsplash.com/photo-1541417904950-b855846fe074"
    ]
  },
  "14": {
    id: "14",
    title: "Munnar Tea Garden Sojourn",
    location: "Munnar, Kerala, India",
    duration: "4 Days / 3 Nights",
    price: "₹22,499",
    category: "Honeymoon",
    image_url: "https://plus.unsplash.com/premium_photo-1697730304904-2bdf66da8f2b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    description: "Mist-draped hills and endless green—classic Munnar for couples.",
    highlights: ["Tea Museum", "Top Station", "Eravikulam NP", "Photo Point", "Spice market"],
    inclusions: ["3 nights resort", "Breakfast", "Private transfers", "Sightseeing", "Taxes"],
    exclusions: ["Flights", "Lunch/Dinner", "Entry fees", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Cochin → Munnar", description: "Waterfalls en route." },
      { day: "Day 2", title: "Tea & Peaks", description: "Museums & viewpoints." },
      { day: "Day 3", title: "Eravikulam", description: "Nilgiri tahr habitat." },
      { day: "Day 4", title: "Departure", description: "Back to Cochin." }
    ],
    rating: 4.6,
    reviews: 102,
    image_gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      "https://images.unsplash.com/photo-1543351611-58f05f8b8f3b",
      "https://images.unsplash.com/photo-1544986581-efac024faf62",
      "https://images.unsplash.com/photo-1541417904950-b855846fe074"
    ]
  },
  "15": {
    id: "15",
    title: "Golden Triangle Highlights",
    location: "Delhi–Agra–Jaipur, India",
    duration: "5 Days / 4 Nights",
    price: "₹24,999",
    category: "Family",
    image_url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
    description: "India’s most popular circuit—Taj Mahal sunrise, Pink City forts and Old Delhi lanes.",
    highlights: ["Taj Mahal & Agra Fort", "Amber Fort & City Palace", "Qutub Minar & Humayun’s Tomb", "Old Delhi rickshaw", "Local bazaars"],
    inclusions: ["4 nights hotels", "Breakfast", "Private AC vehicle", "Guide & monument fees (major)", "Taxes"],
    exclusions: ["Flights", "Lunch/Dinner", "Personal expenses", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive Delhi", description: "Old Delhi tour & food trail." },
      { day: "Day 2", title: "Delhi → Agra", description: "Mehtab Bagh sunset." },
      { day: "Day 3", title: "Taj & Jaipur", description: "Sunrise Taj, drive to Jaipur." },
      { day: "Day 4", title: "Jaipur Highlights", description: "Amber, City Palace, Jantar Mantar." },
      { day: "Day 5", title: "Depart", description: "Fly out from Jaipur/Delhi." }
    ],
    rating: 4.7,
    reviews: 198,
    image_gallery: [
      "https://images.unsplash.com/photo-1548013146-72479768bada",
      "https://images.unsplash.com/photo-1549890762-0a3f8933bcf3",
      "https://images.unsplash.com/photo-1544739313-6fadff2bdc01",
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b"
    ]
  },
  "16": {
    id: "16",
    title: "Jim Corbett Wildlife Safari",
    location: "Uttarakhand, India",
    duration: "3 Days / 2 Nights",
    price: "₹14,999",
    category: "Family",
    image_url: "https://images.unsplash.com/photo-1641405290606-d406173389dc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amltJTIwY29yYmV0dHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    description: "Jeep safaris inside Corbett Tiger Reserve with a cozy riverside stay.",
    highlights: ["Morning & evening safaris", "Garjia Temple", "Kosi riverside walk", "Wildlife museum", "Bonfire (seasonal)"],
    inclusions: ["2 nights resort", "Breakfast & dinner", "1 core-zone safari", "Transfers from Ramnagar", "Taxes"],
    exclusions: ["Flights/train", "Extra safaris", "Lunch", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive Corbett", description: "Riverside leisure." },
      { day: "Day 2", title: "Safari Day", description: "Morning safari & local sightseeing." },
      { day: "Day 3", title: "Departure", description: "Return to Ramnagar." }
    ],
    rating: 4.4,
    reviews: 67,
    image_gallery: [
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
      "https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a",
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9"
    ]
  },
  "17": {
    id: "17",
    title: "Amritsar Spiritual Sojourn",
    location: "Amritsar, India",
    duration: "3 Days / 2 Nights",
    price: "₹13,999",
    category: "Spiritual",
    image_url: "https://plus.unsplash.com/premium_photo-1697730304904-2bdf66da8f2b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    description: "Golden Temple at dawn, Wagah Border ceremony and hearty Punjabi food.",
    highlights: ["Golden Temple & Langar", "Wagah Border", "Jallianwala Bagh", "Old city food walk", "Partition Museum"],
    inclusions: ["2 nights hotel", "Breakfast", "Airport/rail transfers", "Sightseeing", "Taxes"],
    exclusions: ["Flights/train", "Lunch/Dinner", "Tickets to Wagah stands", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive & Temple", description: "Evening at Harmandir Sahib." },
      { day: "Day 2", title: "City & Wagah", description: "Museum, bazaar & border ceremony." },
      { day: "Day 3", title: "Departure", description: "Last early darshan optional." }
    ],
    rating: 4.6,
    reviews: 82,
    image_gallery: [
      "https://images.unsplash.com/photo-1548013146-72479768bada",
      "https://images.unsplash.com/photo-1549890762-0a3f8933bcf3",
      "https://images.unsplash.com/photo-1558981852-426c6c22a254",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38"
    ]
  },
  "18": {
    id: "18",
    title: "Nepal: Kathmandu & Pokhara",
    location: "Nepal",
    duration: "6 Days / 5 Nights",
    price: "₹41,999",
    category: "Family",
    image_url: "https://images.unsplash.com/photo-1650638987536-6fbcb9bc6085?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGthdGhtYW5kdXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    description: "Temples & stupas of Kathmandu with serene lakes and Annapurna views from Pokhara.",
    highlights: ["Pashupatinath & Boudhanath", "Swayambhunath", "Phewa Lake boating", "World Peace Pagoda", "Sarangkot sunrise"],
    inclusions: ["5 nights hotels", "Breakfast", "Airport & intercity transfers", "Sightseeing tours", "Taxes"],
    exclusions: ["Flights", "Entry visas", "Cable cars/boating", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive Kathmandu", description: "Evening Thamel walk." },
      { day: "Day 2", title: "City Temples", description: "Pashupatinath, Boudha & Swayambhu." },
      { day: "Day 3", title: "Drive to Pokhara", description: "Free evening by the lake." },
      { day: "Day 4", title: "Pokhara Sights", description: "Sarangkot sunrise & Peace Pagoda." },
      { day: "Day 5", title: "Leisure & Boating", description: "Cafés and lakeside." },
      { day: "Day 6", title: "Depart", description: "Fly/drive back." }
    ],
    rating: 4.7,
    reviews: 91,
    image_gallery: [
      "https://images.unsplash.com/photo-1544739313-6fadff2bdc01",
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523"
    ]
  },
  "19": {
    id: "19",
    title: "Maldives Budget Getaway",
    location: "Maldives",
    duration: "4 Days / 3 Nights",
    price: "₹52,999",
    category: "Honeymoon",
    image_url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    description: "Pocket-friendly island stay with blue lagoons, house-reef snorkelling and sunset cruises.",
    highlights: ["Sandbank trip", "Snorkelling with reef fish", "Sunset cruise", "Local island tour", "Beach dinners"],
    inclusions: ["3 nights guesthouse/resort", "Breakfast", "Airport speedboat transfers", "Excursion combo (as per plan)", "Taxes & green fee"],
    exclusions: ["International flights", "Lunch/Dinner", "Optional dives", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive & Relax", description: "Beach time & sunset." },
      { day: "Day 2", title: "Reef & Sandbank", description: "Guided snorkel trip." },
      { day: "Day 3", title: "Leisure / Cruise", description: "Optional sunset cruise/dolphins." },
      { day: "Day 4", title: "Departure", description: "Boat to airport." }
    ],
    rating: 4.8,
    reviews: 135,
    image_gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6",
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
    ]
  },
  "20": {
    id: "20",
    title: "Dubai City Highlights",
    location: "Dubai, UAE",
    duration: "5 Days / 4 Nights",
    price: "₹46,999",
    category: "Friends",
    image_url: "https://images.unsplash.com/flagged/photo-1559717865-a99cac1c95d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    description: "Skylines, desert safaris and record-breaking attractions with time for shopping & beaches.",
    highlights: ["Burj Khalifa (124/125F)", "Desert safari & BBQ", "Dubai Marina cruise", "Old Dubai & souks", "Ain Dubai view (optional)"],
    inclusions: ["4 nights hotel", "Breakfast", "Airport transfers", "City tour + safari + cruise", "Visa assistance (optional)"],
    exclusions: ["Flights", "Dinners (except safari/cruise)", "Top-deck upgrades", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive & Marina", description: "Evening dhow cruise." },
      { day: "Day 2", title: "Old & New Dubai", description: "Souks, Jumeirah & Burj photo ops." },
      { day: "Day 3", title: "Desert Safari", description: "Dune bashing & BBQ show." },
      { day: "Day 4", title: "Burj Khalifa", description: "At the Top; shopping at Dubai Mall." },
      { day: "Day 5", title: "Departure", description: "Airport drop." }
    ],
    rating: 4.6,
    reviews: 142,
    image_gallery: [
      "https://images.unsplash.com/photo-1504270997636-07ddfbd48945",
      "https://images.unsplash.com/photo-1506976785307-8732e854ad77",
      "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d"
    ]
  },
  "21": {
    id: "21",
    title: "Sri Lanka Heritage & Beaches",
    location: "Colombo–Kandy–Bentota",
    duration: "6 Days / 5 Nights",
    price: "₹37,999",
    category: "Family",
    image_url: "https://images.unsplash.com/photo-1541417904950-b855846fe074",
    description: "Sigiriya’s sky-fortress, Kandy’s Temple of the Tooth and lazy beach days at Bentota.",
    highlights: ["Sigiriya Rock Fortress", "Temple of the Tooth", "Pinnawala (ethical timing)", "Galle Fort walk", "Bentota water sports"],
    inclusions: ["5 nights hotels", "Breakfast", "Private AC transfers", "Sightseeing as per itinerary", "Taxes"],
    exclusions: ["Flights", "Lunch/Dinner", "Water sports fees", "Insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive Colombo → Kandy", description: "Evening cultural show." },
      { day: "Day 2", title: "Sigiriya Excursion", description: "Rock fortress & village tour." },
      { day: "Day 3", title: "To Bentota", description: "Beach leisure." },
      { day: "Day 4", title: "Galle Day Trip", description: "UNESCO Fort & cafés." },
      { day: "Day 5", title: "Water Sports", description: "Bentota river & beaches." },
      { day: "Day 6", title: "Departure", description: "Drive to Colombo airport." }
    ],
    rating: 4.7,
    reviews: 99,
    image_gallery: [
      "https://images.unsplash.com/photo-1541417904950-b855846fe074",
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
      "https://images.unsplash.com/photo-1544739313-6fadff2bdc01",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38"
    ]
  }
};

const PackageDetails = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const { toast } = useToast();

  const packageData = id && packagesData[id as keyof typeof packagesData];

  // External booking links mapping (open in new tab). Unknown ids fall back to generic.
  const bookingLinks: Record<string, string> = {
    "1": "https://holidayz.makemytrip.com/holidays/india/package?dest=Kashmir&id=58623&listingClassId=2519&depDate=2026-01-11&fromCity=New%20Delhi&variantId=FLIGHT_CAR_10311A9E&pkgType=FIT",
    "2": "https://holidayz.makemytrip.com/holidays/india/package?dest=Goa&id=62249&listingClassId=12&depDate=2025-12-14&fromCity=New%20Delhi&variantId=NO_MAJOR_COMMUTE_CCCDEC54&pkgType=FIT",
    "3": "https://holidayz.makemytrip.com/holidays/india/package?id=59888&fromCity=New%20Delhi&pkgType=FIT&listingClassId=4298&depDate=2026-01-07&variantId=NO_MAJOR_COMMUTE_D776C1E",
    "4": "https://holidayz.makemytrip.com/holidays/india/package?fromSearchWidget=true&searchDep=Varanasi&dest=Varanasi&destValue=Varanasi&depCity=Nagpur&initd=searchwidget_landing_Varanasi_notheme&dateSearched=15%2F11%2F2025&glp=true&pdo=true&rooms=1%2C0%2C0%2C0%2C%2C%2C&affiliate=MMT&id=56445&depDate=2025-11-15&fromCity=Nagpur&variantId=FLIGHT_CAR_FE63A63D&room=1%2C0%2C0%2C0%2C%2C%2C&searchDate=2025-11-15&pkgType=FIT",
    "5": "https://holidayz.makemytrip.com/holidays/india/package?id=24452&fromCity=New%20Delhi&pkgType=FIT&listingClassId=8&depDate=2025-11-14&searchDate=2025-11-14&glp=true&room=1%2C0%2C0%2C0%2C%2C%2C&variantId=CAR_BF030480"
  };
  const defaultBooking = "https://www.makemytrip.com/holidays-india/";

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
    const targetId = id || "";
    const url = bookingLinks[targetId] || defaultBooking;
    // Open in a new tab and show a small toast
    window.open(url, '_blank', 'noopener,noreferrer');
    toast({ title: "Opening booking partner…", description: "The package page will open in a new tab." });
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
            <Badge className="bg-raahi-orange hover:bg-raahi-orange-dark mb-3">
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

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/travel-packages" className="text-gray-500 hover:text-primary transition-colors">Travel Packages</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{packageData.title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="border-b w-full grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6">
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-semibold mb-4">About This Package</h2>
                    <p className="text-gray-700 mb-6">{packageData.description}</p>

                    <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                      {packageData.highlights.map((h, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Inclusions</h3>
                        <ul className="space-y-2">
                          {packageData.inclusions.map((x, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Exclusions</h3>
                        <ul className="space-y-2">
                          {packageData.exclusions.map((x, i) => (
                            <li key={i} className="flex items-start">
                              <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Tour Itinerary</h2>
                  <div className="space-y-6">
                    {packageData.itinerary.map((d, i) => (
                      <div key={i} className="relative pl-8 pb-8 border-l-2 border-primary/20 last:border-l-0 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                        <div className="mb-2">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{d.day}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{d.title}</h3>
                        <p className="text-gray-700">{d.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Photo Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageData.image_gallery.map((img, i) => (
                      <div key={i} className="rounded-lg overflow-hidden h-60">
                        <img
                          src={img}
                          alt={`${packageData.title} - ${i + 1}`}
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
            <Card className="bg-white shadow-sm sticky top-24">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {packageData.price}
                  <span className="text-base font-normal text-gray-500 ml-1">per person</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">
                  *Prices may vary based on the date of travel and number of travelers.
                </p>

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
