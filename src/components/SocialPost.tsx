
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share, Bookmark, MoreHorizontal } from 'lucide-react';

interface SocialPostProps {
  username: string;
  avatar: string;
  image: string;
  caption: string;
  location: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

const SocialPost: React.FC<SocialPostProps> = ({
  username,
  avatar,
  image,
  caption,
  location,
  likes: initialLikes,
  comments,
  timestamp,
  tags
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [saved, setSaved] = useState(false);
  
  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };
  
  return (
    <Card className="mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{username}</div>
            {location && <div className="text-xs text-gray-500">{location}</div>}
          </div>
        </div>
        <button>
          <MoreHorizontal size={20} className="text-gray-500" />
        </button>
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
            >
              <Heart 
                size={24} 
                className={`${liked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
              />
            </button>
            <button className="flex items-center space-x-1">
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
          <span className="font-medium mr-2">{username}</span>
          <span>{caption}</span>
        </div>
        
        {/* Tags */}
        <div className="mt-1 flex flex-wrap gap-1">
          {tags.map(tag => (
            <span key={tag} className="text-raahi-blue">#{tag} </span>
          ))}
        </div>
        
        {/* Comments */}
        <div className="mt-2 text-gray-500 text-sm">
          View all {comments} comments
        </div>
        
        {/* Time */}
        <div className="mt-1 text-gray-400 text-xs uppercase">
          {timestamp}
        </div>
      </CardContent>
      
      {/* Add comment */}
      <CardFooter className="border-t p-4">
        <div className="flex items-center w-full">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="flex-1 focus:outline-none text-sm"
          />
          <button className="text-raahi-blue font-semibold text-sm">
            Post
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SocialPost;
