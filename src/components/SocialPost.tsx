import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { useSocial } from '@/contexts/SocialContext';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/integration/api/client';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/integration/api/client';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/apiBase';

interface SocialPostProps {
  id: number;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  location: string;
  likes: number;
  comments: number;
  timestamp: string;
  user_id: number;
  tags: string[];
}

const SocialPost: React.FC<SocialPostProps> = ({
  id,
  username,
  avatar,
  image,
  caption,
  location,
  likes: initialLikes,
  comments: commentsCount,
  timestamp,
  user_id,
  tags
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingLikeStatus, setCheckingLikeStatus] = useState(true);
  const commentInputRef = useRef<HTMLInputElement>(null);
  
  const { likePost, getComments, addComment } = useSocial();
  const { user } = useAuth();

  // Follow feature (local, lightweight)
  const getFollowingSet = (): Set<number> => {
    try {
      const raw = localStorage.getItem('followingUserIds');
      if (!raw) return new Set();
      return new Set(JSON.parse(raw) as number[]);
    } catch {
      return new Set();
    }
  };
  const getMap = (key: string): Record<string, number[]> => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    } catch {
      return {};
    }
  };
  const setMap = (key: string, map: Record<string, number[]>) => {
    localStorage.setItem(key, JSON.stringify(map));
  };
  const [isFollowing, setIsFollowing] = useState<boolean>(() => getFollowingSet().has(user_id));
  const toggleFollow = async () => {
    if (!user) return;
    const alreadyFollowing = isFollowing;
    try {
      if (alreadyFollowing) {
        const resp = await apiClient.unfollowUser(user_id);
        if (resp.status !== 'success') throw new Error('Unfollow failed');
      } else {
        const resp = await apiClient.followUser(user_id);
        if (resp.status !== 'success') throw new Error('Follow failed');
      }
      // Local cache updates for counts and filters
      const set = getFollowingSet();
      if (alreadyFollowing) set.delete(user_id); else set.add(user_id);
      setIsFollowing(!alreadyFollowing);
      localStorage.setItem('followingUserIds', JSON.stringify(Array.from(set)));
      const followersByUserId = getMap('followersByUserId');
      const followingByUserId = getMap('followingByUserId');
      const targetKey = String(user_id);
      const meKey = String(user.id);
      const followersArr = new Set<number>(followersByUserId[targetKey] || []);
      const myFollowingArr = new Set<number>(followingByUserId[meKey] || []);
      if (alreadyFollowing) {
        followersArr.delete(user.id);
        myFollowingArr.delete(user_id);
      } else {
        followersArr.add(user.id);
        myFollowingArr.add(user_id);
      }
      followersByUserId[targetKey] = Array.from(followersArr);
      followingByUserId[meKey] = Array.from(myFollowingArr);
      setMap('followersByUserId', followersByUserId);
      setMap('followingByUserId', followingByUserId);
      window.dispatchEvent(new Event('following:changed'));
      window.dispatchEvent(new Event('followers:changed'));
    } catch (e) {
      // No-op on error; keep previous UI state
    }
  };

  // Check if current user has already liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;
      
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${id}/liked`, {
          params: { user_id: user.id }
        });
        
        if (response.data.status === 'success') {
          setLiked(response.data.data.liked);
        }
      } catch (err) {
        console.error('Error checking like status:', err);
      } finally {
        setCheckingLikeStatus(false);
      }
    };
    
    checkLikeStatus();
  }, [id, user]);
  
  const handleLike = async () => {
    if (checkingLikeStatus) return; // Prevent action while checking status
    
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes(prevLikes => newLikedState ? prevLikes + 1 : prevLikes - 1);
    
    // Call the API to update the like status
    try {
      const response = await likePost(id);
      // If we get a response with updated likes count, use that instead
      if (response && response.likes_count !== undefined) {
        setLikes(response.likes_count);
      }
    } catch (err) {
      // Revert on error
      setLiked(!newLikedState);
      setLikes(prevLikes => !newLikedState ? prevLikes + 1 : prevLikes - 1);
      console.error('Error updating like status:', err);
    }
  };
  
  const handleShowComments = async () => {
    if (!showComments) {
      setLoading(true);
      const comments = await getComments(id);
      setCommentsList(comments);
      setLoading(false);
    }
    setShowComments(!showComments);
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    const comment = await addComment(id, newComment);
    if (comment) {
      setCommentsList([comment, ...commentsList]);
      setNewComment('');
    }
  };
  
  const formatTimestamp = (dateString: string): string => {
    try {
      // If it's already a relative time string like "2 hours ago"
      if (dateString.includes('ago')) {
        return dateString;
      }
      
      // Otherwise, format the date
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Card className="mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link to={`/profile/${user_id}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Avatar>
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{username}</div>
            {location && <div className="text-xs text-gray-500">{location}</div>}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {user && user.id !== user_id && (
            <button
              onClick={toggleFollow}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                isFollowing ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary'
              }`}
              title={isFollowing ? 'Unfollow' : 'Follow'}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          <button>
            <MoreHorizontal size={20} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Image */}
      <div className="relative">
        <img src={image} alt="Post" className="w-full" />
      </div>
      
      {/* Actions */}
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button 
              onClick={handleLike}
              className="flex items-center space-x-1"
              disabled={checkingLikeStatus}
            >
              <Heart 
                size={24} 
                className={`${liked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
              />
            </button>
            <button 
              className="flex items-center space-x-1"
              onClick={handleShowComments}
            >
              <MessageSquare size={24} className="text-gray-700" />
            </button>
            <button className="flex items-center space-x-1">
              <Share size={24} className="text-gray-700" />
            </button>
          </div>
          <button onClick={() => setSaved(!saved)}>
            <Bookmark 
              size={24} 
              className={`${saved ? 'fill-raahi-blue text-raahi-blue' : 'text-gray-700'}`}
            />
          </button>
        </div>
        
        {/* Likes count */}
        <div className="mt-2 font-medium">{likes.toLocaleString()} likes</div>
        
        {/* Caption */}
        <div className="mt-1">
          <Link to={`/profile/${user_id}`} className="font-medium mr-2 hover:underline">
            {username}
          </Link>
          <span>{caption}</span>
        </div>
        
        {/* Tags */}
        <div className="mt-1 flex flex-wrap gap-1">
          {tags.map(tag => (
            <span key={tag} className="text-raahi-blue">#{tag} </span>
          ))}
        </div>
        
        {/* Comments */}
        <div 
          className="mt-2 text-gray-500 text-sm cursor-pointer"
          onClick={handleShowComments}
        >
          View all {commentsCount} comments
        </div>
        
        {/* Comment list */}
        {showComments && (
          <div className="mt-2 border-t pt-2">
            {loading ? (
              <div className="text-center py-2 text-sm text-gray-500">Loading comments...</div>
            ) : commentsList.length > 0 ? (
              <div className="max-h-40 overflow-y-auto">
                {commentsList.map(comment => (
                  <div key={comment.id} className="mb-2">
                    <Link to={`/profile/${comment.user_id}`} className="font-medium mr-1 hover:underline">
                      {comment.username}
                    </Link>
                    <span className="text-sm">{comment.content}</span>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatTimestamp(comment.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2 text-sm text-gray-500">No comments yet</div>
            )}
          </div>
        )}
        
        {/* Time */}
        <div className="mt-1 text-gray-400 text-xs uppercase">
          {formatTimestamp(timestamp)}
        </div>
      </CardContent>
      
      {/* Add comment */}
      <CardFooter className="border-t p-4">
        <div className="flex items-center w-full">
          <input 
            ref={commentInputRef}
            type="text" 
            placeholder="Add a comment..." 
            className="flex-1 focus:outline-none text-sm"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddComment();
              }
            }}
          />
          <button 
            className="text-raahi-blue font-semibold text-sm"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SocialPost;
