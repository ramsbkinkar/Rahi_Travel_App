import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Camera, 
  BookOpen, 
  Share2, 
  Download, 
  Palette, 
  Heart,
  Users,
  MapPin,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Scrapbook: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-r from-[#E6F0FF] to-[#F5F8FF]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-primary text-white mb-4">Coming Soon</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Digital <span className="text-orange-500">Scrapbook</span> Creator
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Turn your travel memories into beautiful digital scrapbooks with our upcoming feature. Create, customize, and share your travel stories with friends and family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default"
                onClick={() => {
                  toast({
                    title: "Feature in Development",
                    description: "The Digital Scrapbook feature is coming soon! We'll notify you when it's ready.",
                    duration: 3000,
                  });
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Get Notified When Available
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Preview Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">How Digital Scrapbook Will Work</h2>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Our team is developing an intuitive scrapbook creator that will help you preserve and share your travel memories in beautiful formats.
            </p>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="bg-gray-50 p-4 border-b border-gray-100">
                <h3 className="font-bold text-lg">Feature Preview</h3>
                <p className="text-gray-500 text-sm">Digital Scrapbook Creator Interface</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-100 rounded-lg p-6 aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Interactive Scrapbook Editor</p>
                      <p className="text-sm text-gray-400 mt-2">Drag & drop interface coming soon</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">Theme Selection</h4>
                      <p className="text-orange-700 text-sm">Choose from beautiful pre-designed themes</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Photo Management</h4>
                      <p className="text-blue-700 text-sm">Upload and organize your travel photos</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Story Writing</h4>
                      <p className="text-green-700 text-sm">Add captions and stories to your memories</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Key Features</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our Digital Scrapbook will offer these essential features to help you create beautiful travel memories.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Beautiful Themes</h3>
                <p className="text-gray-600">
                  Choose from a variety of professionally designed themes for different travel experiences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Photo Organization</h3>
                <p className="text-gray-600">
                  Easily upload, arrange, and edit your travel photos with our intuitive interface.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Easy Sharing</h3>
                <p className="text-gray-600">
                  Share your completed scrapbooks with friends and family or download as PDF.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Perfect For Every Occasion</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Digital Scrapbook will be perfect for preserving memories from all types of travel experiences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                <Heart className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Honeymoon Memories</h3>
                <p className="text-gray-600">
                  Create romantic scrapbooks to commemorate your special honeymoon trip with beautiful layouts and themes.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Family Vacations</h3>
                <p className="text-gray-600">
                  Document family trips and create lasting memories that can be shared with relatives and future generations.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Adventure Journeys</h3>
                <p className="text-gray-600">
                  Chronicle your trekking, hiking, and adventure experiences with action-packed layouts and designs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                <Download className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Digital & Print Ready</h3>
                <p className="text-gray-600">
                  Export your scrapbooks as high-quality PDFs for printing or share digitally with friends and family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Explore Our Other Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Travel Feed</h3>
              <p className="text-gray-600 mb-6">
                Share your travel photos and experiences with other travelers in the community.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/social-feed'}>
                Explore Feed
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trip Tracker</h3>
              <p className="text-gray-600 mb-6">
                Keep track of your travel companions in real-time during group trips and adventures.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/trip-tracker'}>
                Learn More
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Travel Packages</h3>
              <p className="text-gray-600 mb-6">
                Discover and book amazing travel packages for your next adventure across India.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/travel-packages'}>
                Browse Packages
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Scrapbook;
