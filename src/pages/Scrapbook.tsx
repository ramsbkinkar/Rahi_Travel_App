import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Download, Share2, Save, Trash2, AlertCircle } from 'lucide-react';
import ScrapbookEditor from '@/components/ScrapbookEditor';
import ScrapbookViewer from '@/components/ScrapbookViewer';
import ScrapbookThemePicker, { ThemeOption } from '@/components/ScrapbookThemePicker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Scrapbook: React.FC = () => {
  // Theme options
  const themes: ThemeOption[] = [
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
  
  // States for scrapbook creation
  const [selectedThemeId, setSelectedThemeId] = useState<string>("beach");
  const [scrapbookTitle, setScrapbookTitle] = useState<string>("My Travel Memories");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [creationStep, setCreationStep] = useState<number>(1);
  const [userImages, setUserImages] = useState<string[][]>([[]]);
  const [pageTexts, setPageTexts] = useState<string[]>(['']);
  const [generatedScrapbook, setGeneratedScrapbook] = useState<any>(null);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    setSelectedThemeId(themeId);
    setCreationError(null);
  };
  
  // Handle user images update
  const handleImagesChange = (images: string[][]) => {
    setUserImages(images);
    setCreationError(null);
  };

  // Handle text updates
  const handleTextChange = (texts: string[]) => {
    setPageTexts(texts);
  };
  
  // Handle adding a new page
  const handleAddPage = () => {
    setUserImages([...userImages, []]);
    setPageTexts([...pageTexts, ""]);
    setCreationError(null);
  };
  
  // Handle updating page content
  const handleUpdatePage = (pageIndex: number, data: { text?: string; images?: string[] }) => {
    if (data.text !== undefined) {
      const newPageTexts = [...pageTexts];
      newPageTexts[pageIndex] = data.text;
      setPageTexts(newPageTexts);
    }
    
    if (data.images) {
      const newUserImages = [...userImages];
      newUserImages[pageIndex] = data.images;
      setUserImages(newUserImages);
    }
  };

  // Delete current scrapbook
  const deleteScrapbook = () => {
    try {
      localStorage.removeItem('current_scrapbook');
      setGeneratedScrapbook(null);
      resetScrapbookState();
      setShowDeleteDialog(false);
    } catch (err) {
      console.error("Failed to delete scrapbook:", err);
    }
  };

  // Reset all scrapbook state to defaults
  const resetScrapbookState = () => {
    setSelectedThemeId("beach");
    setScrapbookTitle("My Travel Memories");
    setUserImages([[]]);
    setPageTexts(['']);
    setCreationError(null);
  };
  
  // Generate scrapbook
  const generateScrapbook = () => {
    try {
      // Validate that we have at least something to generate
      if (userImages.flat().length === 0) {
        setCreationError("Please add at least one image to your scrapbook");
        return;
      }

      const selectedTheme = themes.find(theme => theme.id === selectedThemeId);
      if (!selectedTheme) {
        setCreationError("Please select a valid theme");
        return;
      }
      
      // Create the scrapbook data structure
      const newScrapbook = {
        title: scrapbookTitle || "My Travel Memories",
        theme: selectedTheme,
        pages: userImages.map((images, index) => ({
          images,
          text: pageTexts[index] || ""
        }))
      };
      
      setGeneratedScrapbook(newScrapbook);
      setIsCreating(false);
      setCreationError(null);
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('current_scrapbook', JSON.stringify(newScrapbook));
      } catch (err) {
        console.error("Failed to save scrapbook to localStorage:", err);
      }
    } catch (error) {
      console.error("Error generating scrapbook:", error);
      setCreationError("There was an error creating your scrapbook. Please try again.");
    }
  };
  
  // Try to load existing scrapbook from localStorage on initial load
  useEffect(() => {
    try {
      const savedScrapbook = localStorage.getItem('current_scrapbook');
      if (savedScrapbook) {
        const parsed = JSON.parse(savedScrapbook);
        setGeneratedScrapbook(parsed);
        
        // Also initialize state with the saved data
        if (parsed.theme?.id) {
          setSelectedThemeId(parsed.theme.id);
        }
        if (parsed.title) {
          setScrapbookTitle(parsed.title);
        }
        if (parsed.pages) {
          setUserImages(parsed.pages.map((p: any) => p.images || []));
          setPageTexts(parsed.pages.map((p: any) => p.text || ''));
        }
      }
    } catch (err) {
      console.error("Failed to load saved scrapbook:", err);
    }
  }, []);
  
  // Start creating a new scrapbook
  const startCreatingScrapbook = () => {
    setIsCreating(true);
    setCreationStep(1);
    setCreationError(null);
  };
  
  // Create a brand new scrapbook (clearing all previous data)
  const createBrandNewScrapbook = () => {
    resetScrapbookState();
    setIsCreating(true);
    setCreationStep(1);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-[#E6F0FF]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Digital Scrapbook
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create beautiful memories of your travels with our easy-to-use digital scrapbook templates.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={startCreatingScrapbook}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {generatedScrapbook ? "Edit Scrapbook" : "Create New Scrapbook"}
              </Button>
              
              {generatedScrapbook && (
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={createBrandNewScrapbook}
                >
                  Create Brand New Scrapbook
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Scrapbook Creator/Viewer */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isCreating ? (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              {/* Creation Steps */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${creationStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${creationStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${creationStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <div className={`w-16 h-1 ${creationStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${creationStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                </div>
              </div>
              
              {/* Step Content */}
              {creationStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center mb-6">Choose a Theme</h2>
                  <ScrapbookThemePicker
                    themes={themes}
                    selectedThemeId={selectedThemeId}
                    onThemeSelect={handleThemeSelect}
                  />
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => setCreationStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {creationStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center mb-6">Name Your Scrapbook</h2>
                  <div className="max-w-md mx-auto">
                    <Label htmlFor="title">Scrapbook Title</Label>
                    <Input
                      id="title"
                      value={scrapbookTitle}
                      onChange={(e) => setScrapbookTitle(e.target.value)}
                      className="mb-4"
                      placeholder="My Travel Memories"
                    />
                    <p className="text-sm text-gray-500 mb-8">
                      This will be displayed on the cover page of your scrapbook.
                    </p>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setCreationStep(1)}>
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCreationStep(3)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {creationStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center mb-6">Add Photos</h2>
                  <div className="bg-gray-50 rounded-lg p-4 md:p-8">
                    <ScrapbookEditor 
                      theme={themes.find(theme => theme.id === selectedThemeId) || themes[0]}
                      onThemeChange={handleThemeSelect}
                      onImagesChange={handleImagesChange}
                      onTextChange={handleTextChange}
                      initialImages={userImages}
                      initialTexts={pageTexts}
                    />
                  </div>
                  {creationError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md mt-4">
                      {creationError}
                    </div>
                  )}
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setCreationStep(2)}>
                      Back
                    </Button>
                    <Button 
                      onClick={generateScrapbook}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Create Scrapbook
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : generatedScrapbook ? (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{generatedScrapbook.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={startCreatingScrapbook}>
                    Edit Scrapbook
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      alert(`Export feature: This would save "${generatedScrapbook.title}" as PDF`);
                    }}
                  >
                    <Download size={16} className="mr-2" /> Save as PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      alert("Share feature: This would open sharing options");
                    }}
                  >
                    <Share2 size={16} className="mr-2" /> Share
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 md:p-8">
                {generatedScrapbook && generatedScrapbook.pages && generatedScrapbook.theme ? (
                  <ScrapbookViewer
                    scrapbookData={generatedScrapbook}
                    onAddPage={handleAddPage}
                    onUpdatePage={handleUpdatePage}
                  />
                ) : (
                  <div className="text-center p-10">
                    <p className="text-gray-500">There was an issue displaying your scrapbook.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={startCreatingScrapbook}
                    >
                      Start Over
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">No Scrapbook Created Yet</h2>
              <p className="text-gray-600 mb-8">
                Create your first digital scrapbook to preserve your travel memories.
              </p>
              <Button 
                onClick={startCreatingScrapbook}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create New Scrapbook
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Scrapbook</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scrapbook? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={deleteScrapbook}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Scrapbook Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Multiple Themes</h3>
              <p className="text-gray-600">
                Choose from various themes including Friends, Love, Beach, Honeymoon, and Mountains.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
