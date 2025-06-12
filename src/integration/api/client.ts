import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api');

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear token on authentication error
      localStorage.removeItem('authToken');
    }
    // Extract the error message from the response
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

interface AuthResponse {
  status: 'success' | 'error';
  data?: {
    user: {
      id: number;
      email: string;
      name: string;
    };
  };
  message?: string;
}

export interface Post {
  id: number;
  caption: string;
  location: string;
  image_url: string;
  likes_count: number;
  created_at: string;
  user_id: number;
  username: string;
  avatar_url: string;
  comments_count: number;
  tags: string[];
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  avatar_url: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserProfile {
  user: User;
  postCount: number;
  posts: Post[];
}

interface PostsResponse {
  status: 'success' | 'error';
  data?: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  message?: string;
}

interface PostResponse {
  status: 'success' | 'error';
  data?: Post;
  message?: string;
}

interface CommentsResponse {
  status: 'success' | 'error';
  data?: Comment[];
  message?: string;
}

interface LikeResponse {
  status: 'success' | 'error';
  data?: {
    action: 'liked' | 'unliked';
    likes_count: number;
  };
  message?: string;
}

interface UserProfileResponse {
  status: 'success' | 'error';
  data?: UserProfile;
  message?: string;
}

interface UserResponse {
  status: 'success' | 'error';
  data?: User;
  message?: string;
}

interface UsersSearchResponse {
  status: 'success' | 'error';
  data?: User[];
  message?: string;
}

class ApiClient {
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/signup', {
        name,
        email,
        password
      });
      if (response.data.status === 'success' && response.data.data?.user) {
        localStorage.setItem('authToken', response.data.data.user.id.toString());
      }
      return response.data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      if (response.data.status === 'success' && response.data.data?.user) {
        localStorage.setItem('authToken', response.data.data.user.id.toString());
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
  }

  // Social feed methods
  async getPosts(page = 1, limit = 10): Promise<PostsResponse> {
    try {
      const response: AxiosResponse<PostsResponse> = await axiosInstance.get('/posts', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  }

  async getPost(postId: number): Promise<PostResponse> {
    try {
      const response: AxiosResponse<PostResponse> = await axiosInstance.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch post ${postId}:`, error);
      throw error;
    }
  }

  async createPost(
    caption: string, 
    location: string,
    imageBase64: string,
    tags: string[]
  ): Promise<PostResponse> {
    try {
      const user_id = parseInt(localStorage.getItem('authToken') || '0');

      // Create the post with base64 image data
      const response: AxiosResponse<PostResponse> = await axiosInstance.post('/posts', {
        caption,
        location,
        imageBase64,
        tags,
        user_id
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }

  async likePost(postId: number): Promise<LikeResponse> {
    try {
      const user_id = parseInt(localStorage.getItem('authToken') || '0');
      const response: AxiosResponse<LikeResponse> = await axiosInstance.post(`/posts/${postId}/like`, { user_id });
      return response.data;
    } catch (error) {
      console.error(`Failed to like/unlike post ${postId}:`, error);
      throw error;
    }
  }

  async getComments(postId: number): Promise<CommentsResponse> {
    try {
      const response: AxiosResponse<CommentsResponse> = await axiosInstance.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      throw error;
    }
  }

  async addComment(postId: number, content: string): Promise<{ status: string; data?: Comment }> {
    try {
      const user_id = parseInt(localStorage.getItem('authToken') || '0');
      const response: AxiosResponse<{ status: string; data?: Comment }> = await axiosInstance.post(
        `/posts/${postId}/comment`, 
        { user_id, content }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to add comment to post ${postId}:`, error);
      throw error;
    }
  }

  async deletePost(postId: number): Promise<{ status: string; message?: string }> {
    try {
      const user_id = parseInt(localStorage.getItem('authToken') || '0');
      const response: AxiosResponse<{ status: string; message?: string }> = await axiosInstance.delete(
        `/posts/${postId}`, 
        { data: { user_id } }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete post ${postId}:`, error);
      throw error;
    }
  }

  // User profile methods
  async getUserProfile(userId: number): Promise<UserProfileResponse> {
    try {
      const response: AxiosResponse<UserProfileResponse> = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user profile ${userId}:`, error);
      throw error;
    }
  }

  async updateUserProfile(userId: number, bio: string, avatarUrl?: string): Promise<UserResponse> {
    try {
      const user_id = parseInt(localStorage.getItem('authToken') || '0');
      
      // Only allow updating own profile
      if (userId !== user_id) {
        throw new Error('You can only update your own profile');
      }
      
      const data: any = { bio, user_id };
      if (avatarUrl) {
        data.avatar_url = avatarUrl;
      }
      
      const response: AxiosResponse<UserResponse> = await axiosInstance.put(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update user profile ${userId}:`, error);
      throw error;
    }
  }

  async getUserPosts(userId: number, page = 1, limit = 10): Promise<PostsResponse> {
    try {
      const response: AxiosResponse<PostsResponse> = await axiosInstance.get(`/users/${userId}/posts`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch posts for user ${userId}:`, error);
      throw error;
    }
  }

  async searchUsers(query: string): Promise<UsersSearchResponse> {
    try {
      const response: AxiosResponse<UsersSearchResponse> = await axiosInstance.get('/users/search/users', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  }

  async uploadAvatar(imageBase64: string): Promise<{ status: string; data?: { image_url: string } }> {
    try {
      const response: AxiosResponse<any> = await axiosInstance.post('/uploads/image', {
        image: imageBase64,
        folder: 'avatars'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;