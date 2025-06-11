import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, Post, User } from '@/integration/api/client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SocialPost from '@/components/SocialPost';
import {
  Calendar,
  Edit,
  Grid,
  Loader,
  MapPin,
  User as UserIcon,
  X,
  Camera,
  Heart,
  MessageCircle,
  Trash2,
  Eye
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [bio, setBio] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const isOwnProfile = currentUser?.id === Number(id);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.getUserProfile(Number(id));
        
        if (response.status === 'success' && response.data) {
          setUser(response.data.user);
          setPosts(response.data.posts);
          setPostCount(response.data.postCount);
          setBio(response.data.user.bio || '');
          setHasMore(response.data.posts.length < response.data.postCount);
          setPage(1);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user profile');
        toast({
          title: 'Error',
          description: 'Failed to load user profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProfile();
    }
  }, [id, toast]);
  
  // Load more posts
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !id) return;
    
    try {
      setLoadingMore(true);
      
      const nextPage = page + 1;
      const response = await apiClient.getUserPosts(Number(id), nextPage);
      
      if (response.status === 'success' && response.data) {
        setPosts(prev => [...prev, ...response.data]);
        setPage(nextPage);
        
        if (response.pagination) {
          setHasMore(response.pagination.page * response.pagination.limit < response.pagination.total);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load more posts',
        variant: 'destructive',
      });
    } finally {
      setLoadingMore(false);
    }
  };
  
  // Update user profile
  const handleUpdateProfile = async () => {
    if (!isOwnProfile || !id) return;
    
    try {
      setIsUpdating(true);
      
      const response = await apiClient.updateUserProfile(Number(id), bio);
      
      if (response.status === 'success' && response.data) {
        setUser(prev => prev ? { ...prev, bio } : null);
        setIsEditDialogOpen(false);
        
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isOwnProfile) return;

    try {
      setIsUploadingAvatar(true);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          
          // Upload the image
          const uploadResponse = await apiClient.uploadAvatar(base64);
          
          if (uploadResponse.status === 'success' && uploadResponse.data) {
            // Update profile with new avatar URL
            const updateResponse = await apiClient.updateUserProfile(Number(id), bio, uploadResponse.data.image_url);
            
            if (updateResponse.status === 'success' && updateResponse.data) {
              setUser(prev => prev ? { ...prev, avatar_url: uploadResponse.data!.image_url } : null);
              
              toast({
                title: 'Success',
                description: 'Profile picture updated successfully',
              });
            }
          }
        } catch (err) {
          toast({
            title: 'Error',
            description: 'Failed to upload profile picture',
            variant: 'destructive',
          });
        } finally {
          setIsUploadingAvatar(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploadingAvatar(false);
      toast({
        title: 'Error',
        description: 'Failed to process image',
        variant: 'destructive',
      });
    }
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    if (!postToDelete || !isOwnProfile) return;

    try {
      const response = await apiClient.deletePost(postToDelete.id);
      
      if (response.status === 'success') {
        setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
        setPostCount(prev => prev - 1);
        setPostToDelete(null);
        
        toast({
          title: 'Success',
          description: 'Post deleted successfully',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  // Open post in detail view
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-32 flex justify-center">
          <Loader size={40} className="animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-32">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md mx-auto">
            <div className="text-red-500 mb-4">
              <X size={48} className="mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the user profile you're looking for."}
            </p>
            <Button onClick={() => navigate('/social-feed')}>
              Return to Feed
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Profile Header */}
      <section className="pt-28 pb-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32">
                  <AvatarImage src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`} />
                  <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                {/* Camera overlay for own profile */}
                {isOwnProfile && (
                  <>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-white shadow-md"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <Camera size={14} />
                      )}
                    </Button>
                  </>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                  <div className="flex items-center text-gray-600">
                    <Grid size={16} className="mr-1" />
                    <span>{postCount} posts</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-1" />
                    <span>Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                
                {/* Bio */}
                <div className="mb-4">
                  {user.bio ? (
                    <p className="text-gray-700">{user.bio}</p>
                  ) : isOwnProfile ? (
                    <p className="text-gray-500 italic">No bio yet. Click edit to add one.</p>
                  ) : (
                    <p className="text-gray-500 italic">No bio available.</p>
                  )}
                </div>
                
                {/* Edit Profile Button (only for own profile) */}
                {isOwnProfile && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Posts Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Posts</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} className="mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Eye size={16} className="mr-1" />
                  List
                </Button>
              </div>
            </div>
            
            {posts.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  /* Instagram-style grid */
                  <div className="grid grid-cols-3 gap-1 md:gap-4">
                    {posts.map(post => (
                      <div
                        key={post.id}
                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => handlePostClick(post)}
                      >
                        <img
                          src={`http://localhost:3000${post.image_url}`}
                          alt={post.caption || 'Post image'}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4 text-white">
                            <div className="flex items-center">
                              <Heart size={20} className="mr-1" />
                              <span className="font-semibold">{post.likes_count}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle size={20} className="mr-1" />
                              <span className="font-semibold">{post.comments_count}</span>
                            </div>
                          </div>
                        </div>

                        {/* Delete button for own posts */}
                        {isOwnProfile && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPostToDelete(post);
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List view */
                  <div className="max-w-lg mx-auto">
                    {posts.map(post => (
                      <div key={post.id} className="relative">
                        <SocialPost 
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
                        
                        {/* Delete button for own posts */}
                        {isOwnProfile && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-4 right-4"
                            onClick={() => setPostToDelete(post)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <Button 
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <Loader size={16} className="mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg text-center shadow-sm">
                <div className="text-gray-400 mb-4">
                  <UserIcon size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                <p className="text-gray-500">
                  {isOwnProfile 
                    ? "You haven't shared any travel memories yet."
                    : `${user.name} hasn't shared any travel memories yet.`
                  }
                </p>
                {isOwnProfile && (
                  <Button 
                    className="mt-4"
                    onClick={() => navigate('/social-feed')}
                  >
                    Share Your First Memory
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Post Detail Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="relative aspect-square">
                <img
                  src={`http://localhost:3000${selectedPost.image_url}`}
                  alt={selectedPost.caption || 'Post image'}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              {/* Post Details */}
              <div className="flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedPost.avatar_url || `https://i.pravatar.cc/150?u=${selectedPost.username}`} />
                      <AvatarFallback>{selectedPost.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{selectedPost.username}</div>
                      <div className="text-sm text-gray-500">{formatDistanceToNow(new Date(selectedPost.created_at), { addSuffix: true })}</div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 mt-4">
                  {selectedPost.location && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={14} className="mr-1" />
                      <span className="text-sm">{selectedPost.location}</span>
                    </div>
                  )}
                  
                  {selectedPost.caption && (
                    <p className="text-gray-800 mb-4">{selectedPost.caption}</p>
                  )}
                  
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {selectedPost.tags.map((tag, index) => (
                        <span key={index} className="text-primary text-sm">#{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <Heart size={18} className="mr-1" />
                      <span>{selectedPost.likes_count} likes</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle size={18} className="mr-1" />
                      <span>{selectedPost.comments_count} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="font-medium mb-2 block">Bio</label>
              <Textarea 
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateProfile}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Post Confirmation */}
      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default UserProfile; 