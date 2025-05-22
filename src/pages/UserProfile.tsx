import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
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
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`} />
                <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
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
          <div className="max-w-lg mx-auto">
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-bold">Posts</h2>
              <Separator className="flex-1 ml-4" />
            </div>
            
            {posts.length > 0 ? (
              <>
                {posts.map(post => (
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
                ))}
                
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
      
      <Footer />
    </div>
  );
};

export default UserProfile; 