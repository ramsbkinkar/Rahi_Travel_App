import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TravelCard from '@/components/TravelCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const packages = [
  // 1
  {
    id: "1",
    image_url: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Serene Kashmir Voyage",
    location: "Kashmir, India",
    duration: "6 Days / 5 Nights",
    price: "₹32,999",
    category: "Honeymoon"
  },
  // 2
  {
    id: "2",
    image_url: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Goa Beach Adventure",
    location: "Goa, India",
    duration: "4 Days / 3 Nights",
    price: "₹19,795",
    category: "Friends"
  },
  // 3
  {
    id: "3",
    image_url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    title: "Rajasthan Heritage Tour",
    location: "Rajasthan, India",
    duration: "8 Days / 7 Nights",
    price: "₹37,730",
    category: "Family"
  },
  // 4
  {
    id: "4",
    image_url: "https://images.unsplash.com/photo-1627938823193-fd13c1c867dd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Varanasi Spiritual Journey",
    location: "Varanasi, India",
    duration: "5 Days / 4 Nights",
    price: "₹50,341",
    category: "Spiritual"
  },
  // 5
  {
    id: "5",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    title: "Himalayan Adventure Trek",
    location: "Himachal Pradesh, India",
    duration: "7 Days / 6 Nights",
    price: "₹34,4766",
    category: "Adventure"
  },
  // 6
  {
    id: "6",
    image_url: "https://media.istockphoto.com/id/520413349/photo/backwaters-of-kerala.jpg?s=612x612&w=0&k=20&c=DbiECQUkS06JDDWZtdH4O3UBTJKOfM0eu0ZgVwNwuoY=",
    title: "Kerala Backwaters Retreat",
    location: "Alleppey & Munnar, India",
    duration: "6 Days / 5 Nights",
    price: "₹34,499",
    category: "Honeymoon"
  },
  // 7
  {
    id: "7",
    image_url: "https://images.unsplash.com/photo-1586053226626-febc8817962f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW5kYW1hbiUyMGFuZCUyMG5pY29iYXIlMjBpc2xhbmRzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    title: "Andaman Island Escape",
    location: "Havelock & Port Blair, India",
    duration: "5 Days / 4 Nights",
    price: "₹39,999",
    category: "Friends"
  },
  // 8
  {
    id: "8",
    image_url: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Leh–Ladakh Road Trip",
    location: "Ladakh, India",
    duration: "7 Days / 6 Nights",
    price: "₹44,999",
    category: "Adventure"
  },
  // 9
  {
    id: "9",
    image_url: "https://images.unsplash.com/photo-1650341259809-9314b0de9268?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmlzaGlrZXNofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    title: "Rishikesh Yoga & Rafting",
    location: "Rishikesh, India",
    duration: "4 Days / 3 Nights",
    price: "₹16,999",
    category: "Spiritual"
  },
  // 10
  {
    id: "10",
    image_url: "https://images.unsplash.com/photo-1638886540342-240980f60d25?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b290eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    title: "Ooty & Kodaikanal Hills",
    location: "Tamil Nadu, India",
    duration: "5 Days / 4 Nights",
    price: "₹23,999",
    category: "Family"
  },
  // 11
  {
    id: "11",
    image_url: "https://images.unsplash.com/photo-1573398643956-2b9e6ade3456?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    title: "Sikkim & Gangtok Discovery",
    location: "Sikkim, India",
    duration: "6 Days / 5 Nights",
    price: "₹36,999",
    category: "Family"
  },
  // 12
  {
    id: "12",
    image_url: "https://images.unsplash.com/photo-1625826415766-001bd75aaf52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVnaGFsYXlhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    title: "Meghalaya Living Roots",
    location: "Shillong & Cherrapunji, India",
    duration: "5 Days / 4 Nights",
    price: "₹27,999",
    category: "Adventure"
  },
  // 13
  {
    id: "13",
    image_url: "https://images.unsplash.com/photo-1710891437634-85ad1b1f0a88?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Coorg Coffee Trails",
    location: "Coorg, Karnataka, India",
    duration: "4 Days / 3 Nights",
    price: "₹19,999",
    category: "Friends"
  },
  // 14
  {
    id: "14",
    image_url: "https://plus.unsplash.com/premium_photo-1697730304904-2bdf66da8f2b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Munnar Tea Garden Sojourn",
    location: "Munnar, Kerala, India",
    duration: "4 Days / 3 Nights",
    price: "₹22,499",
    category: "Honeymoon"
  },
  // 15

  // 16
  {
    id: "16",
    image_url: "https://images.unsplash.com/photo-1641405290606-d406173389dc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amltJTIwY29yYmV0dHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    title: "Jim Corbett Wildlife Safari",
    location: "Uttarakhand, India",
    duration: "3 Days / 2 Nights",
    price: "₹14,999",
    category: "Family"
  },
  // 17
  {
    id: "17",
    image_url: "https://plus.unsplash.com/premium_photo-1697730426305-113c62434f97?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YW1yaXRzYXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    title: "Amritsar Spiritual Sojourn",
    location: "Amritsar, India",
    duration: "3 Days / 2 Nights",
    price: "₹13,999",
    category: "Spiritual"
  },
  // 18
  {
    id: "18",
    image_url: "https://images.unsplash.com/photo-1650638987536-6fbcb9bc6085?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGthdGhtYW5kdXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    title: "Nepal: Kathmandu & Pokhara",
    location: "Nepal",
    duration: "6 Days / 5 Nights",
    price: "₹41,999",
    category: "Family"
  },
  // 19
  {
    id: "19",
    image_url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    title: "Maldives Budget Getaway",
    location: "Maldives",
    duration: "4 Days / 3 Nights",
    price: "₹52,999",
    category: "Honeymoon"
  },
  // 20
  {
    id: "20",
    image_url: "https://images.unsplash.com/flagged/photo-1559717865-a99cac1c95d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    title: "Dubai City Highlights",
    location: "Dubai, UAE",
    duration: "5 Days / 4 Nights",
    price: "₹46,999",
    category: "Friends"
  },
  // 21
  {
    id: "21",
    image_url: "https://images.unsplash.com/photo-1541417904950-b855846fe074",
    title: "Sri Lanka Heritage & Beaches",
    location: "Colombo–Kandy–Bentota",
    duration: "6 Days / 5 Nights",
    price: "₹37,999",
    category: "Family"
  },
];

const TravelPackages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset pagination when search/category changes
  useEffect(() => {
    setVisibleCount(12);
  }, [searchTerm, currentCategory]);

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
      <section className="pt-28 pb-12 bg-gradient-to-r from-[#E6F0FF] to-[#F5F8FF]">
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
            <TabsList className="flex flex-wrap justify-start gap-2 mb-8">
              <TabsTrigger
                value="all"
                className="px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                All Packages
              </TabsTrigger>
              <TabsTrigger
                value="Honeymoon"
                className="px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Honeymoon
              </TabsTrigger>
              <TabsTrigger
                value="Adventure"
                className="px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Adventure
              </TabsTrigger>
              <TabsTrigger
                value="Spiritual"
                className="px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Spiritual
              </TabsTrigger>
              <TabsTrigger
                value="Friends"
                className="px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Friends
              </TabsTrigger>
              <TabsTrigger
                value="Family"
                className="px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Family
              </TabsTrigger>
            </TabsList>

            <TabsContent value={currentCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.slice(0, visibleCount).map((pkg) => (
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

              {filteredPackages.length > visibleCount && (
                <div className="text-center mt-8">
                  <button
                    className="px-6 py-2 rounded-full bg-white border shadow-sm hover:bg-gray-50"
                    onClick={() => setVisibleCount((v) => v + 12)}
                  >
                    Load more
                  </button>
                </div>
              )}

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
