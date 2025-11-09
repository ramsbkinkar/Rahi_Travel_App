import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, Post, Comment } from '@/integration/api/client';
import { useAuth } from './AuthContext';

interface LikeResponse {
  action: 'liked' | 'unliked';
  likes_count: number;
}

interface SocialContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  totalPosts: number;
  fetchPosts: (page?: number) => Promise<void>;
  createPost: (caption: string, location: string, imageBase64: string, tags: string[]) => Promise<void>;
  likePost: (postId: number) => Promise<LikeResponse | undefined>;
  getComments: (postId: number) => Promise<Comment[]>;
  addComment: (postId: number, content: string) => Promise<Comment | undefined>;
  searchPosts: (term: string) => void;
  filteredPosts: Post[];
  filterOption: 'latest' | 'popular' | 'following';
  setFilterOption: (option: 'latest' | 'popular' | 'following') => void;
  resetFilters: () => void;
}

const SocialContext = createContext<SocialContextType>({
  posts: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: false,
  totalPosts: 0,
  fetchPosts: async () => {},
  createPost: async () => {},
  likePost: async () => undefined,
  getComments: async () => [],
  addComment: async () => undefined,
  searchPosts: () => {},
  filteredPosts: [],
  filterOption: 'latest',
  setFilterOption: () => {},
  resetFilters: () => {},
});

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState<'latest' | 'popular' | 'following'>('latest');
  const [followingVersion, setFollowingVersion] = useState(0);
  const getFollowingSet = (): Set<number> => {
    try {
      const raw = localStorage.getItem('followingUserIds');
      if (!raw) return new Set();
      const arr = JSON.parse(raw) as number[];
      return new Set(arr);
    } catch {
      return new Set();
    }
  };

  
  const { isAuthenticated } = useAuth();

  // Function to fetch posts from the API
  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getPosts(pageNum, 10);
      
      if (response.status === 'success' && response.data) {
        if (pageNum === 1) {
          // Replace posts if it's the first page
          setPosts(response.data);
        } else {
          // Append posts if loading more
          setPosts(prev => [...prev, ...response.data!]);
        }
        
        // Update pagination state
        if (response.pagination) {
          setPage(response.pagination.page);
          setHasMore(response.pagination.page * response.pagination.limit < response.pagination.total);
          setTotalPosts(response.pagination.total);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (caption: string, location: string, imageBase64: string, tags: string[]) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.createPost(caption, location, imageBase64, tags);
      
      if (response.status === 'success' && response.data) {
        // Add the new post to the top of the list
        setPosts(prev => [response.data!, ...prev]);
        // Increment total count
        setTotalPosts(prev => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Like/unlike a post
  const likePost = async (postId: number): Promise<LikeResponse | undefined> => {
    if (!isAuthenticated) return undefined;
    
    try {
      const response = await apiClient.likePost(postId);
      
      if (response.status === 'success' && response.data) {
        // Update the post in the list
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { ...post, likes_count: response.data!.likes_count } 
              : post
          )
        );
        
        // Return the updated likes data
        return response.data;
      }
    } catch (err) {
      console.error('Error liking/unliking post:', err);
      throw err;
    }
  };

  // Get comments for a post
  const getComments = async (postId: number): Promise<Comment[]> => {
    try {
      const response = await apiClient.getComments(postId);
      
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      return [];
    } catch (err) {
      console.error('Error fetching comments:', err);
      return [];
    }
  };

  // Add a comment to a post
  const addComment = async (postId: number, content: string): Promise<Comment | undefined> => {
    if (!isAuthenticated) return undefined;
    
    try {
      const response = await apiClient.addComment(postId, content);
      
      if (response.status === 'success' && response.data) {
        // Update the comments count for the post
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { ...post, comments_count: post.comments_count + 1 } 
              : post
          )
        );
        
        return response.data;
      }
      return undefined;
    } catch (err) {
      console.error('Error adding comment:', err);
      return undefined;
    }
  };

  // Search posts
  const searchPosts = (term: string) => {
    setSearchTerm(term);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterOption('latest');
  };

  // Filter posts based on search term and filter option
  const getFilteredPosts = (): Post[] => {
    let result = [...posts];
    
    // Apply search filter if there's a search term
    if (searchTerm) {
      result = result.filter(post => 
        post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sort based on filter option
    switch(filterOption) {
      case 'latest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.likes_count - a.likes_count);
        break;
      case 'following':
        const following = getFollowingSet();
        result = result.filter(p => following.has(p.user_id));
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    
    return result;
  };

  // Fetch initial posts when authenticated
  useEffect(() => {
    // Always fetch public feed; create/like/comment still require auth
    fetchPosts(1);
  }, [isAuthenticated]);

  // Re-filter when following set changes elsewhere
  useEffect(() => {
    const handler = () => setFollowingVersion(v => v + 1);
    window.addEventListener('following:changed', handler as EventListener);
    return () => window.removeEventListener('following:changed', handler as EventListener);
  }, []);

  return (
    <SocialContext.Provider
      value={{
        posts,
        loading,
        error,
        page,
        hasMore,
        totalPosts,
        fetchPosts,
        createPost,
        likePost,
        getComments,
        addComment,
        searchPosts,
        filteredPosts: getFilteredPosts(),
        filterOption,
        setFilterOption,
        resetFilters,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}; 