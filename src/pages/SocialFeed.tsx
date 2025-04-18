
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SocialPost from '@/components/SocialPost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  MapPin, 
  Hash, 
  Upload,
  Camera
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const SocialFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const posts = [
    {
      id: 1,
      username: "mountain_lover",
      avatar: "https://i.pravatar.cc/150?img=1",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      caption: "Found paradise in the Himalayas! The views are absolutely breathtaking 😍 #mountains #himalayas #travel",
      location: "Manali, Himachal Pradesh",
      likes: 243,
      comments: 42,
      timestamp: "2 hours ago",
      tags: ["mountains", "himalayas", "travel"]
    },
    {
      id: 2,
      username: "beach_bum",
      avatar: "https://i.pravatar.cc/150?img=2",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      caption: "Crystal clear waters and white sandy beaches. Goa never disappoints! 🏖️ #goa #beachlife #vacation",
      location: "Calangute Beach, Goa",
      likes: 587,
      comments: 73,
      timestamp: "5 hours ago",
      tags: ["goa", "beachlife", "vacation"]
    },
    {
      id: 3,
      username: "culture_vulture",
      avatar: "https://i.pravatar.cc/150?img=3",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
      caption: "Exploring the ancient temples of Hampi. The architecture is simply magnificent! 🏯 #hampi #heritage #explore",
      location: "Hampi, Karnataka",
      likes: 321,
      comments: 29,
      timestamp: "1 day ago",
      tags: ["hampi", "heritage", "explore"]
    },
    {
      id: 4,
      username: "food_explorer",
      avatar: "https://i.pravatar.cc/150?img=4",
      image: "https://images.unsplash.com/photo-1567337710282-00832b415979",
      caption: "Trying the famous street food in Delhi. So many flavors! 🍽️ #streetfood #delhi #foodie",
      location: "Chandni Chowk, Delhi",
      likes: 432,
      comments: 56,
      timestamp: "2 days ago",
      tags: ["streetfood", "delhi", "foodie"]
    }
  ];

  const filteredPosts = posts.filter(post => {
    return (
      post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const handlePostUpload = () => {
    toast({
      title: "Post uploaded successfully!",
      description: "Your travel memory is now shared with the community.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header Section */}
      <section className="pt-28 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold">Travelgram</h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search posts, locations, hashtags..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-raahi-orange hover:bg-raahi-orange-dark">
                    <Upload size={16} className="mr-2" /> New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">
                      Share Your Travel Memory
                    </DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="upload" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="upload">Upload Image</TabsTrigger>
                      <TabsTrigger value="capture">Capture Now</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 mb-4">Drag and drop your image here, or click to browse</p>
                        <Input id="picture" type="file" className="hidden" />
                        <Button asChild>
                          <label htmlFor="picture">Select Image</label>
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="capture">
                      <div className="border-2 border-gray-300 rounded-lg p-12 text-center bg-black">
                        <div className="aspect-w-4 aspect-h-3 bg-gray-800 rounded-lg flex items-center justify-center">
                          <Camera size={64} className="text-gray-500" />
                        </div>
                        <Button className="mt-4">
                          Capture Photo
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <MapPin size={16} className="text-raahi-orange mr-2" />
                        <span className="font-medium">Add Location</span>
                      </div>
                      <Input placeholder="e.g., Taj Mahal, Agra" />
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Hash size={16} className="text-raahi-blue mr-2" />
                        <span className="font-medium">Add Hashtags</span>
                      </div>
                      <Input placeholder="e.g., travel, india, wanderlust (comma separated)" />
                    </div>
                    
                    <div>
                      <label className="font-medium mb-2 block">Caption</label>
                      <Textarea 
                        placeholder="Share your travel story..." 
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      className="bg-raahi-blue hover:bg-raahi-blue-dark"
                      onClick={handlePostUpload}
                    >
                      Post
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feed Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            {/* Filter Bar */}
            <div className="bg-white p-4 mb-6 rounded-lg shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <Filter size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">Filter by:</span>
              </div>
              <div className="flex space-x-4">
                <button className="text-raahi-blue font-medium">Latest</button>
                <button className="text-gray-500 hover:text-raahi-blue">Popular</button>
                <button className="text-gray-500 hover:text-raahi-blue">Following</button>
              </div>
            </div>
            
            {/* Posts */}
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <SocialPost key={post.id} {...post} />
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg text-center shadow-sm">
                <p className="text-gray-600 mb-2">No posts found matching your search.</p>
                <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
              </div>
            )}
            
            {/* Load More */}
            {filteredPosts.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SocialFeed;
