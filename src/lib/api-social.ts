const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  avatar_url?: string;
}

export interface Post {
  id: number;
  user_id: number;
  username: string;
  avatar_url?: string;
  caption?: string;
  location?: string;
  image_url: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  tags: string[];
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  username: string;
  avatar_url?: string;
  content: string;
  created_at: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export class SocialApiClient {
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  private getAuthHeader() {
    const user = localStorage.getItem('user');
    return user ? { 'user-id': JSON.parse(user).id.toString() } : {};
  }

  private getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }

  async getPosts(page = 1, limit = 10): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${limit}`, {
        headers: {
          ...this.getAuthHeader(),
        }
      });

      const data = await this.handleResponse<Post[]>(response);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  async getPost(postId: number): Promise<Post | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        headers: {
          ...this.getAuthHeader(),
        }
      });

      const data = await this.handleResponse<Post>(response);
      return data.data || null;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        headers: {
          ...this.getAuthHeader(),
        }
      });

      const data = await this.handleResponse<Comment[]>(response);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  async createPost(caption: string, location: string, imageUrl: string, tags: string[]): Promise<Post | null> {
    const userId = this.getUserId();
    if (!userId) {
      // Create a demo user ID if not authenticated - for development only
      console.log('No user ID found, using demo user ID 1');
      try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': '1', // Use demo user ID
          },
          body: JSON.stringify({
            caption,
            location,
            image_url: imageUrl,
            tags,
            user_id: 1
          })
        });

        console.log('Create post response status:', response.status);
        const data = await this.handleResponse<Post>(response);
        console.log('Create post response data:', data);
        return data.data || null;
      } catch (error) {
        console.error('Error creating post with demo user:', error);
        throw error;
      }
    }

    try {
      console.log('Creating post with user ID:', userId);
      console.log('Post data:', { caption, location, imageUrl, tags });
      
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({
          caption,
          location,
          image_url: imageUrl,
          tags,
          user_id: userId
        })
      });

      console.log('Create post response status:', response.status);
      const data = await this.handleResponse<Post>(response);
      console.log('Create post response data:', data);
      return data.data || null;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async likePost(postId: number): Promise<{ action: string; likes_count: number }> {
    const userId = this.getUserId();
    if (!userId) {
      // Use demo user for development
      console.log('No user ID found, using demo user ID 1 for liking post');
      try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': '1',
          },
          body: JSON.stringify({
            user_id: 1
          })
        });

        const data = await this.handleResponse<{ action: string; likes_count: number }>(response);
        return data.data || { action: 'error', likes_count: 0 };
      } catch (error) {
        console.error('Error liking post with demo user:', error);
        throw error;
      }
    }

    try {
      console.log('Liking post with user ID:', userId);
      
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({
          user_id: userId
        })
      });

      const data = await this.handleResponse<{ action: string; likes_count: number }>(response);
      console.log('Like post response:', data);
      return data.data || { action: 'error', likes_count: 0 };
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  async commentOnPost(postId: number, content: string): Promise<Comment | null> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({
          user_id: userId,
          content
        })
      });

      const data = await this.handleResponse<Comment>(response);
      return data.data || null;
    } catch (error) {
      console.error('Error commenting on post:', error);
      throw error;
    }
  }

  async uploadImage(imageData: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({
          image: imageData,
          folder: 'posts'
        })
      });

      const data = await this.handleResponse<{ image_url: string }>(response);
      return data.data?.image_url || '';
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

export const socialApiClient = new SocialApiClient(); 