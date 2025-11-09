import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, X, Save, ImageIcon, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Define sticker paths by theme
const THEME_STICKERS: Record<string, string[]> = {
  friends: [
    '/stickers/friends/high-five.svg',
    '/stickers/friends/group.svg',
    '/stickers/friends/hearts.svg'
  ],
  love: [
    '/stickers/love/heart.svg',
    '/stickers/love/couple.svg',
    '/stickers/love/flower.svg'
  ],
  beach: [
    '/stickers/beach/sun.svg',
    '/stickers/beach/palm.svg',
    '/stickers/beach/shell.svg'
  ],
  honeymoon: [
    '/stickers/honeymoon/rings.svg',
    '/stickers/honeymoon/hearts.svg',
    '/stickers/honeymoon/champagne.svg'
  ],
  mountains: [
    '/stickers/mountains/peak.svg',
    '/stickers/mountains/tree.svg',
    '/stickers/mountains/tent.svg'
  ],
};

// Define fonts by theme
const THEME_FONTS: Record<string, string> = {
  friends: 'font-comic',
  love: 'font-script',
  beach: 'font-sans',
  honeymoon: 'font-serif',
  mountains: 'font-mono',
};

// Emoji stickers for each theme
const THEME_EMOJIS: Record<string, string[]> = {
  friends: ['👫', '🤝', '🎉', '🎊', '🎭', '🍕', '🎡', '🎪'],
  love: ['❤️', '💕', '💘', '🌹', '💍', '💑', '🥂', '✨'],
  beach: ['🏖️', '🌊', '🏝️', '🌴', '🐚', '🐠', '🐬', '🍹'],
  honeymoon: ['💒', '💐', '💝', '🤵', '👰', '✈️', '🛌', '🏨'],
  mountains: ['⛰️', '🏔️', '🌲', '🏕️', '🥾', '🔥', '☕', '🌄']
};

interface Sticker {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface ScrapbookPageProps {
  theme: {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
  };
  pageNumber: number;
  totalPages: number;
  userImages?: string[];
  pageText?: string;
  onTextChange?: (text: string) => void;
  isEditing?: boolean;
}

const ScrapbookPage: React.FC<ScrapbookPageProps> = ({
  theme,
  pageNumber,
  totalPages,
  userImages = [],
  pageText = '',
  onTextChange,
  isEditing: externalEditing = false
}) => {
  const [isEditing, setIsEditing] = useState(externalEditing);
  const [text, setText] = useState(pageText);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [isAddingSticker, setIsAddingSticker] = useState(false);
  const [draggedSticker, setDraggedSticker] = useState<number | null>(null);
  const [initialDragPos, setInitialDragPos] = useState({ x: 0, y: 0 });
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Update local text when props change
  useEffect(() => {
    setText(pageText);
  }, [pageText]);

  // Update editing state based on prop changes
  useEffect(() => {
    setIsEditing(externalEditing);
  }, [externalEditing]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  // Sticker dragging handlers
  const handleStickerDragStart = (e: React.MouseEvent, stickerId: number, x: number, y: number) => {
    e.preventDefault();
    setDraggedSticker(stickerId);
    setInitialDragPos({ x: e.clientX - x, y: e.clientY - y });
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (draggedSticker !== null && pageRef.current) {
        const rect = pageRef.current.getBoundingClientRect();
        const newStickers = stickers.map(sticker => {
          if (sticker.id === stickerId) {
            // Calculate position relative to container
            const relativeX = ((moveEvent.clientX - initialDragPos.x) / rect.width) * 100;
            const relativeY = ((moveEvent.clientY - initialDragPos.y) / rect.height) * 100;
            
            // Clamp values to keep sticker inside container
            const clampedX = Math.max(0, Math.min(relativeX, 95));
            const clampedY = Math.max(0, Math.min(relativeY, 95));
            
            return { ...sticker, x: clampedX, y: clampedY };
          }
          return sticker;
        });
        setStickers(newStickers);
      }
    };
    
    const handleMouseUp = () => {
      setDraggedSticker(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const addSticker = (emoji: string) => {
    // Add sticker in a random position within the page
    const newSticker: Sticker = {
      id: Date.now(),
      src: emoji,
      x: 20 + Math.random() * 60, // % of container width (centered area)
      y: 40 + Math.random() * 40, // % of container height (bottom half)
      rotation: Math.random() * 20 - 10, // Random rotation between -10 and +10 degrees
      scale: 0.8 + Math.random() * 0.4 // Random scale between 0.8 and 1.2
    };
    
    setStickers([...stickers, newSticker]);
    setIsAddingSticker(false);
  };

  const removeSticker = (id: number) => {
    setStickers(stickers.filter(sticker => sticker.id !== id));
  };
  
  // Create a visually appealing collage layout based on number of images
  const getCollageLayout = () => {
    const count = userImages.length;
    
    if (count === 0) {
      return (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Array(4).fill(0).map((_, index) => (
            <div 
              key={index} 
              className="aspect-[4/3] rounded-md flex items-center justify-center bg-white/50 border-2 border-dashed border-gray-300"
            >
              <ImageIcon size={24} className="text-gray-400" />
            </div>
          ))}
        </div>
      );
    }
    
    if (count === 1) {
      return (
        <div className="mb-6">
          <div className="aspect-video relative rounded-md overflow-hidden shadow-md mb-4 mx-auto max-w-xl">
            <img 
              src={userImages[0]} 
              alt="Scrapbook hero image" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );
    }
    
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {userImages.map((image, index) => (
            <div key={index} className="aspect-[4/3] relative group overflow-hidden rounded-md shadow-md">
              <img 
                src={image} 
                alt={`Scrapbook image ${index + 1}`} 
                className={cn(
                  "w-full h-full object-cover",
                  "transition-transform group-hover:scale-105 duration-500",
                  index % 2 === 0 ? "rotate-1" : "-rotate-1"
                )}
              />
            </div>
          ))}
        </div>
      );
    }
    
    if (count === 3) {
      return (
        <div className="mb-6">
          <div className="aspect-video relative rounded-md overflow-hidden shadow-md mb-4">
            <img 
              src={userImages[0]} 
              alt="Scrapbook main image" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {userImages.slice(1).map((image, index) => (
              <div key={index} className="aspect-[4/3] relative group overflow-hidden rounded-md shadow-md">
                <img 
                  src={image} 
                  alt={`Scrapbook image ${index + 2}`} 
                  className={cn(
                    "w-full h-full object-cover",
                    "transition-transform group-hover:scale-105 duration-500",
                    index % 2 === 0 ? "rotate-1" : "-rotate-1"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (count === 4) {
      return (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {userImages.map((image, index) => (
            <div key={index} className="aspect-[4/3] relative group overflow-hidden rounded-md shadow-md">
              <img 
                src={image} 
                alt={`Scrapbook image ${index + 1}`} 
                className={cn(
                  "w-full h-full object-cover",
                  "transition-transform group-hover:scale-105 duration-500",
                  "shadow-md",
                  index % 2 === 0 ? "rotate-1" : "-rotate-1"
                )}
              />
            </div>
          ))}
        </div>
      );
    }
    
    // For 5+ images, create a more complex layout
    return (
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {userImages.slice(0, 3).map((image, index) => (
            <div key={index} className="aspect-square relative group overflow-hidden rounded-md shadow-md">
              <img 
                src={image} 
                alt={`Scrapbook image ${index + 1}`} 
                className={cn(
                  "w-full h-full object-cover",
                  "transition-transform group-hover:scale-105 duration-500",
                  index % 2 === 0 ? "rotate-1" : "-rotate-1"
                )}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {userImages.slice(3, 5).map((image, index) => (
            <div key={index + 3} className="aspect-[4/3] relative group overflow-hidden rounded-md shadow-md">
              <img 
                src={image} 
                alt={`Scrapbook image ${index + 4}`}
                className={cn(
                  "w-full h-full object-cover",
                  "transition-transform group-hover:scale-105 duration-500",
                  index % 2 === 0 ? "rotate-1" : "-rotate-1"
                )}
              />
            </div>
          ))}
        </div>
        {userImages.length > 5 && (
          <div className="aspect-video relative rounded-md overflow-hidden shadow-md">
            <img 
              src={userImages[5]} 
              alt="Scrapbook additional image"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    );
  };

  // Get available stickers for current theme
  const themeEmojis = THEME_EMOJIS[theme.id] || THEME_EMOJIS.beach;
  const themeFont = THEME_FONTS[theme.id] || 'font-sans';

  // Use a safe background color that exists in Tailwind
  const bgColorClass = theme.primaryColor === 'blue-100' ? 'bg-blue-100' : 
                        theme.primaryColor === 'pink-100' ? 'bg-pink-100' :
                        theme.primaryColor === 'cyan-100' ? 'bg-cyan-100' :
                        theme.primaryColor === 'red-100' ? 'bg-red-100' :
                        theme.primaryColor === 'green-100' ? 'bg-green-100' : 'bg-gray-100';

  return (
    <div 
      ref={pageRef}
      className={cn(
        "relative min-h-[600px] perspective-1000",
        pageNumber % 2 === 0 ? "page-right" : "page-left"
      )}
    >
      <Card 
        className={cn(
          bgColorClass,
          "rounded-lg overflow-hidden shadow-xl",
          "hover:shadow-2xl transition-all duration-500",
          "border-4 border-white"
        )}
      >
        <CardContent className="p-6 relative">
          {/* Book binding edge effect */}
          <div className={cn(
            "absolute top-0 bottom-0 w-12 z-10 opacity-20",
            pageNumber % 2 === 0 ? "left-0 bg-gradient-to-r from-gray-900 to-transparent" : "right-0 bg-gradient-to-l from-gray-900 to-transparent"
          )}></div>
          
          {/* Page number indicator */}
          <div className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded-md">
            Page {pageNumber + 1} of {totalPages}
          </div>
          
          {/* Page title */}
          <div className={cn("text-center mb-6", themeFont)}>
            <h3 className="text-2xl font-bold text-gray-800">
              {pageNumber === 0 ? `${theme.name} Adventures` : `Travel Memories`}
            </h3>
          </div>
          
          {/* Photo collage */}
          {getCollageLayout()}
          
          {/* Text area */}
          <div className="mt-4">
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Write your travel memories here..."
                  className="min-h-24 p-3"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    <X size={14} className="mr-1" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setIsEditing(false)}
                  >
                    <Save size={14} className="mr-1" /> Save
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className={cn(
                  "border border-gray-300 p-3 rounded-md min-h-24 relative bg-white/80",
                  "hover:border-gray-400 transition-colors",
                  themeFont
                )}
                onClick={() => setIsEditing(true)}
              >
                {text ? (
                  <p className="text-gray-800 whitespace-pre-wrap">{text}</p>
                ) : (
                  <p className="text-gray-500 italic">Click to add your travel story...</p>
                )}
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="absolute bottom-2 right-2 w-6 h-6 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <Pencil size={12} />
                </Button>
              </div>
            )}
          </div>
          
          {/* Stickers */}
          {stickers.map(sticker => (
            <div 
              key={sticker.id}
              className={cn(
                "absolute w-16 h-16 cursor-move group select-none",
                draggedSticker === sticker.id ? "z-50" : "z-10"
              )}
              style={{
                top: `${sticker.y}%`,
                left: `${sticker.x}%`,
                transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                cursor: draggedSticker === sticker.id ? 'grabbing' : 'grab'
              }}
              onMouseDown={(e) => handleStickerDragStart(e, sticker.id, sticker.x, sticker.y)}
            >
              <div className="flex items-center justify-center w-full h-full text-4xl">
                {sticker.src}
              </div>
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSticker(sticker.id);
                }}
              >
                <Trash2 size={10} />
              </Button>
            </div>
          ))}
          
          {/* Theme actions */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              {['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400'].map((color, i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded-full ${color} cursor-pointer hover:scale-110 transition-transform shadow-sm`}
                ></div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/80 border-gray-300 hover:bg-white"
                onClick={() => setIsAddingSticker(!isAddingSticker)}
              >
                Add Sticker
              </Button>
            </div>
          </div>
          
          {/* Sticker picker */}
          {isAddingSticker && (
            <div className="absolute bottom-20 right-4 bg-white p-3 rounded-md shadow-lg z-10">
              <h4 className="text-sm font-medium mb-2">Choose a sticker</h4>
              <div className="grid grid-cols-4 gap-2">
                {themeEmojis.map((emoji, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    size="icon"
                    className="w-10 h-10 p-1 text-xl hover:bg-gray-100"
                    onClick={() => addSticker(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Decorative elements based on theme */}
          {theme.id === 'beach' && (
            <div className="absolute bottom-2 left-2 text-4xl opacity-20 rotate-12">🌴</div>
          )}
          {theme.id === 'mountains' && (
            <div className="absolute bottom-2 left-2 text-4xl opacity-20 rotate-12">⛰️</div>
          )}
          {theme.id === 'love' && (
            <div className="absolute bottom-2 left-2 text-4xl opacity-20 rotate-12">❤️</div>
          )}
          {theme.id === 'friends' && (
            <div className="absolute bottom-2 left-2 text-4xl opacity-20 rotate-12">👫</div>
          )}
          {theme.id === 'honeymoon' && (
            <div className="absolute bottom-2 left-2 text-4xl opacity-20 rotate-12">💍</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapbookPage; 