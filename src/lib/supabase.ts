import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

export const supabase = supabaseClient;

export type UserSession = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};

export const getCurrentUser = async (): Promise<UserSession | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
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
    console.error('Error signing in:', error);
    toast({
      title: 'Error signing in',
      description: error.message,
      variant: 'destructive'
    });
    throw error;
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });
    
    if (error) throw error;
    
    if (data.user) {
      console.log("User created successfully, creating profile:", data.user);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          email,
          created_at: new Date().toISOString()
        });
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }
    }
    
    toast({
      title: 'Account created!',
      description: 'Your account has been successfully created.'
    });
    
    return data.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    toast({
      title: 'Error signing up',
      description: error.message,
      variant: 'destructive'
    });
    throw error;
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

export const createSocialPost = async (userId: string, caption: string, location: string, tags: string[], image: File) => {
  try {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `social/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('raahi-images')
      .upload(filePath, image);
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('raahi-images')
      .getPublicUrl(filePath);
    
    const { data, error } = await supabase
      .from('social_posts')
      .insert({
        user_id: userId,
        caption,
        location,
        tags,
        image_url: publicUrl,
        created_at: new Date().toISOString(),
        likes: 0
      })
      .select('*, profiles:user_id(*)')
      .single();
    
    if (error) throw error;
    
    toast({
      title: 'Post created!',
      description: 'Your travel memory has been shared.'
    });
    
    return data;
  } catch (error: any) {
    console.error('Error creating social post:', error);
    toast({
      title: 'Error creating post',
      description: error.message,
      variant: 'destructive'
    });
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
    
    toast({
      title: 'Scrapbook created!',
      description: 'You can now start adding pages to your scrapbook.'
    });
    
    return data;
  } catch (error: any) {
    console.error('Error creating scrapbook:', error);
    toast({
      title: 'Error creating scrapbook',
      description: error.message,
      variant: 'destructive'
    });
    return null;
  }
};

export const createScrapbookPage = async (scrapbookId: string, content: any, pageNumber: number) => {
  try {
    if (content.images?.length) {
      const uploadPromises = content.images.map(async (image: File) => {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `scrapbook/${fileName}`;
        
        await supabase.storage
          .from('raahi-images')
          .upload(filePath, image);
          
        const { data: { publicUrl } } = supabase.storage
          .from('raahi-images')
          .getPublicUrl(filePath);
          
        return publicUrl;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      content.images = uploadedUrls;
    }
    
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
    
    toast({
      title: 'Location updated',
      description: `Your location in ${cityName} has been updated.`
    });
    
    return true;
  } catch (error: any) {
    console.error('Error updating trip location:', error);
    toast({
      title: 'Error updating location',
      description: error.message,
      variant: 'destructive'
    });
    return false;
  }
};

export const toggleLike = async (postId: string, userId: string) => {
  try {
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      
      await supabase.rpc('decrement_likes', { post_id: postId });
      return false;
    } else {
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
      
      await supabase.rpc('increment_likes', { post_id: postId });
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

export const subscribeToTrips = (onUpdate: (payload: any) => void) => {
  return supabase
    .channel('trip_locations')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trip_locations'
      },
      onUpdate
    )
    .subscribe();
};

export const subscribeToSocialPosts = (onUpdate: (payload: any) => void) => {
  return supabase
    .channel('social_posts')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'social_posts'
      },
      onUpdate
    )
    .subscribe();
};
