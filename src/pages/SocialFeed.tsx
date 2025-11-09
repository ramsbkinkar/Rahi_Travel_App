import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SocialPost from '@/components/SocialPost';
import UserSearch from '@/components/UserSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  MapPin, 
  Hash, 
  Upload,
  Camera,
  Loader,
  Users
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSocial } from '@/contexts/SocialContext';
import { useAuth } from '@/contexts/AuthContext';
import './SocialFeed.css';

const SocialFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    filteredPosts, 
    loading, 
    error, 
    page, 
    hasMore, 
    searchPosts, 
    fetchPosts,
    createPost,
    filterOption,
    setFilterOption
  } = useSocial();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchPosts(term);
  };

  const handleViewProfile = () => {
    if (user) {
      navigate(`/profile/${user.id}`);
    }
  };

  const handleFilterClick = (filter: 'latest' | 'popular' | 'following') => {
    setFilterOption(filter);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Here you would normally handle the webcam stream
      // For simplicity, we'll just show an alert
      toast({
        title: "Camera access granted",
        description: "This feature is not fully implemented in this demo.",
        duration: 3000,
      });
      // Clean up
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setImageFile(null);
    setCaption('');
    setLocation('');
    setHashtags('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePostUpload = async () => {
    if (!imagePreview) {
      toast({
        title: "Image required",
        description: "Please select an image to upload.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert hashtags string to array
      const tagsArray = hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Create the post
      await createPost(caption, location, imagePreview, tagsArray);
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Post uploaded successfully!",
        description: "Your travel memory is now shared with the community.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading your post.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-white bg-dots">
      <NavBar />
      
      {/* Header Section */}
      <section className="pt-24 pb-6 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-5">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Travelgram</h1>
              <p className="mt-2 text-gray-600">Share and discover travel moments from the community.</p>
            </div>

            {/* Top bar: search + actions (compact) */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search posts, users, locations, hashtags..."
                  className="pl-10 pr-4 h-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex items-center gap-2 md:ml-auto">
                <Button 
                  variant="outline"
                  className="h-10"
                  onClick={() => setIsSearchModalOpen(true)}
                >
                  <Users size={16} className="mr-2" />
                  Find Users
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="h-10">
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
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-64 object-cover rounded-lg" 
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="absolute top-2 right-2 bg-white"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                          <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500 mb-4">Drag and drop your image here, or click to browse</p>
                          <Input 
                            id="picture" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                          <Button asChild>
                            <label htmlFor="picture">Select Image</label>
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="capture">
                      <div className="border-2 border-gray-300 rounded-lg p-12 text-center bg-black">
                        <div className="aspect-w-4 aspect-h-3 bg-gray-800 rounded-lg flex items-center justify-center">
                          <Camera size={64} className="text-gray-500" />
                        </div>
                        <Button 
                          className="mt-4"
                          onClick={handleCapturePhoto}
                        >
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
                      <Input 
                        placeholder="e.g., Taj Mahal, Agra" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Hash size={16} className="text-primary mr-2" />
                        <span className="font-medium">Add Hashtags</span>
                      </div>
                      <Input 
                        placeholder="e.g., travel, india, wanderlust (comma separated)" 
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="font-medium mb-2 block">Caption</label>
                      <Textarea 
                        placeholder="Share your travel story..." 
                        rows={4}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="default"
                      onClick={handlePostUpload}
                      disabled={isSubmitting || !imagePreview}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={16} className="mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        'Post'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feed Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl md:max-w-2xl mx-auto">
            {/* Filter Bar */}
            <div className="bg-white p-3 md:p-4 mb-6 rounded-full shadow-sm flex items-center justify-between">
              <div className="hidden md:flex items-center">
                <Filter size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">Filter</span>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-center">
                <button 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${filterOption === 'latest' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => handleFilterClick('latest')}
                >
                  Latest
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${filterOption === 'popular' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => handleFilterClick('popular')}
                >
                  Popular
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${filterOption === 'following' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => handleFilterClick('following')}
                >
                  Following
                </button>
              </div>
            </div>
            
            {/* Loading state */}
            {loading && page === 1 && (
              <div className="flex justify-center items-center py-10">
                <Loader size={32} className="animate-spin text-primary" />
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="bg-white p-8 rounded-lg text-center shadow-sm">
                <p className="text-red-600 mb-2">Error: {error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => fetchPosts(1)}
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {/* Posts */}
            {!loading && !error && filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <SocialPost 
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  user_id={post.user_id}
                  avatar={post.avatar_url || `https://i.pravatar.cc/150?u=${post.username}`}
                  image={`http://localhost:3000${post.image_url}`}
                  caption={post.caption || ''}
                  location={post.location || ''}
                  likes={post.likes_count}
                  comments={post.comments_count}
                  timestamp={post.created_at}
                  tags={post.tags || []}
                />
              ))
            ) : !loading && !error ? (
              <div className="bg-white p-8 rounded-lg text-center shadow-sm">
                <p className="text-gray-600 mb-2">No posts found matching your search.</p>
                <p className="text-sm text-gray-500">Try adjusting your search terms or filters.</p>
              </div>
            ) : null}
            
            {/* Loading more */}
            {loading && page > 1 && (
              <div className="text-center mt-4">
                <Loader size={24} className="animate-spin text-primary mx-auto" />
              </div>
            )}
            
            {/* Load More */}
            {!loading && hasMore && filteredPosts.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline"
                  onClick={handleLoadMore}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* User Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Find Travelers</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <UserSearch placeholder="Search by username..." />
            <p className="text-xs text-gray-500 mt-2">
              Type at least 2 characters to search for users
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default SocialFeed;
