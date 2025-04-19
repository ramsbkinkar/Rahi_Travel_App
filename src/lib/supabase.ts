
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
}

export type UserSession = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication Helpers
export const getCurrentUser = async (): Promise<UserSession | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get profile data from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', user.id)
      .single();
    
    return {
      id: user.id,
      email: user.email as string,
      name: profile?.name || user.email?.split('@')[0],
      avatar_url: profile?.avatar_url
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    toast({
      title: 'Welcome back!',
      description: 'Successfully signed in.'
    });
    
    return data.user;
  } catch (error: any) {
    toast({
      title: 'Error signing in',
      description: error.message,
      variant: 'destructive'
    });
    return null;
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    
    // Create a profile record
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          email,
          created_at: new Date().toISOString()
        });
        
      if (profileError) throw profileError;
    }
    
    toast({
      title: 'Account created!',
      description: 'Please check your email for verification.'
    });
    
    return data.user;
  } catch (error: any) {
    toast({
      title: 'Error signing up',
      description: error.message,
      variant: 'destructive'
    });
    return null;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast({
      title: 'Signed out',
      description: 'Successfully signed out of your account.'
    });
    
    window.location.href = '/';
  } catch (error: any) {
    toast({
      title: 'Error signing out',
      description: error.message,
      variant: 'destructive'
    });
  }
};

// Data Fetching Helpers
export const getTravelPackages = async (category = 'all') => {
  try {
    let query = supabase.from('travel_packages').select('*');
    
    if (category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching travel packages:', error);
    return [];
  }
};

export const getCities = async () => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

export const getCityDetails = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching city details:', error);
    return null;
  }
};

export const createScrapbook = async (userId: string, title: string, theme: string) => {
  try {
    const { data, error } = await supabase
      .from('scrapbooks')
      .insert({
        user_id: userId,
        title,
        theme,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating scrapbook:', error);
    return null;
  }
};

export const getUserScrapbooks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('scrapbooks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user scrapbooks:', error);
    return [];
  }
};

export const createScrapbookPage = async (scrapbookId: string, content: any, pageNumber: number) => {
  try {
    const { data, error } = await supabase
      .from('scrapbook_pages')
      .insert({
        scrapbook_id: scrapbookId,
        content,
        page_number: pageNumber,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating scrapbook page:', error);
    return null;
  }
};

export const createSocialPost = async (userId: string, caption: string, location: string, tags: string[], imageUrl: string) => {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .insert({
        user_id: userId,
        caption,
        location,
        tags,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        likes: 0
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating social post:', error);
    return null;
  }
};

export const getSocialPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .select(`
        *,
        profiles:user_id (name, avatar_url)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return [];
  }
};

export const likePost = async (postId: string, userId: string) => {
  try {
    // Check if already liked
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingLike) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      
      // Decrement likes count
      const { error: updateError } = await supabase.rpc('decrement_likes', { post_id: postId });
      if (updateError) throw updateError;
      
      return false; // Unliked
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
      
      // Increment likes count
      const { error: updateError } = await supabase.rpc('increment_likes', { post_id: postId });
      if (updateError) throw updateError;
      
      return true; // Liked
    }
  } catch (error) {
    console.error('Error updating like:', error);
    throw error;
  }
};

export const updateTripLocation = async (userId: string, latitude: number, longitude: number, cityName: string) => {
  try {
    const { error } = await supabase
      .from('trip_locations')
      .upsert({
        user_id: userId,
        latitude,
        longitude,
        city_name: cityName,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating trip location:', error);
    return false;
  }
};

export const getTripLocations = async () => {
  try {
    const { data, error } = await supabase
      .from('trip_locations')
      .select(`
        *,
        profiles:user_id (name, avatar_url)
      `)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching trip locations:', error);
    return [];
  }
};

export const uploadImage = async (file: File, folder: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('raahi-images')
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('raahi-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
