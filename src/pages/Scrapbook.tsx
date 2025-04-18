
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrapbookTemplate from '@/components/ScrapbookTemplate';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Scrapbook: React.FC = () => {
  const themes = [
    {
      id: "friends",
      name: "Friends",
      primaryColor: "blue-100",
      secondaryColor: "blue-400",
      templates: 5
    },
    {
      id: "love",
      name: "Love",
      primaryColor: "pink-100",
      secondaryColor: "pink-400", 
      templates: 5
    },
    {
      id: "beach",
      name: "Beach",
      primaryColor: "cyan-100",
      secondaryColor: "cyan-400",
      templates: 5
    },
    {
      id: "honeymoon",
      name: "Honeymoon",
      primaryColor: "red-100",
      secondaryColor: "red-400",
      templates: 5
    },
    {
      id: "mountains",
      name: "Mountains",
      primaryColor: "green-100",
      secondaryColor: "green-400",
      templates: 5
    }
  ];
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(5);
  
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleAddPage = () => {
    setTotalPages(totalPages + 1);
    setCurrentPage(totalPages);
  };

  const getPlaceholderImages = (themeId: string) => {
    switch (themeId) {
      case 'friends':
        return [
          "https://images.unsplash.com/photo-1543807535-eceef0bc6599",
          "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc",
          "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a",
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
          "", ""
        ];
      case 'love':
        return [
          "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
          "https://images.unsplash.com/photo-1523595876387-1d80c824796f",
          "https://images.unsplash.com/photo-1516589091380-5d8e87df6999",
          "", "", ""
        ];
      case 'beach':
        return [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          "https://images.unsplash.com/photo-1473116763249-2faaef81ccda",
          "https://images.unsplash.com/photo-1520454974749-611b7248ffdb",
          "", "", ""
        ];
      case 'honeymoon':
        return [
          "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
          "https://images.unsplash.com/photo-1470931071862-3e6252957944",
          "https://images.unsplash.com/photo-1566828862655-e65f0f4c56e6",
          "", "", ""
        ];
      case 'mountains':
        return [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
          "https://images.unsplash.com/photo-1486870591958-9b9d0690989f",
          "", "", ""
        ];
      default:
        return ["", "", "", "", "", ""];
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-raahi-blue-light to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Digital Scrapbook
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create beautiful memories of your travels with our easy-to-use digital scrapbook templates.
            </p>
          </div>
        </div>
      </section>
      
      {/* Scrapbook Editor */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="friends" className="space-y-8">
            <div className="flex justify-center">
              <TabsList>
                {themes.map(theme => (
                  <TabsTrigger key={theme.id} value={theme.id}>{theme.name}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {themes.map(theme => (
              <TabsContent key={theme.id} value={theme.id}>
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
                  {/* Page Navigation */}
                  <div className="flex justify-between items-center mb-8">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft size={18} className="mr-1" /> Previous Page
                    </Button>
                    
                    <div className="text-center">
                      <span className="text-lg font-medium">Page {currentPage + 1} of {totalPages}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={handleAddPage}
                      >
                        <Plus size={18} className="mr-1" /> Add Page
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                      >
                        Next Page <ChevronRight size={18} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Scrapbook Content */}
                  <div className="bg-gray-50 rounded-lg p-4 md:p-8">
                    <ScrapbookTemplate
                      theme={theme.name}
                      images={getPlaceholderImages(theme.id)}
                      title={`${theme.name} Adventure - Page ${currentPage + 1}`}
                      subtitle={currentPage === 0 ? "My Travel Memories" : undefined}
                      primaryColor={theme.primaryColor}
                      secondaryColor={theme.secondaryColor}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Scrapbook Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-raahi-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-raahi-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Multiple Themes</h3>
              <p className="text-gray-600">
                Choose from various themes including Friends, Love, Beach, Honeymoon, and Mountains.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-raahi-orange-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-raahi-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Customizable Pages</h3>
              <p className="text-gray-600">
                Add images, text, stickers, and change colors to personalize your scrapbook.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Sharing</h3>
              <p className="text-gray-600">
                Download your scrapbook as PDF or share directly to social media with friends.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Scrapbook;
