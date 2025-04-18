
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Plus } from 'lucide-react';

interface ScrapbookTemplateProps {
  theme: string;
  images: string[];
  title: string;
  subtitle?: string;
  primaryColor: string;
  secondaryColor: string;
}

const ScrapbookTemplate: React.FC<ScrapbookTemplateProps> = ({
  theme,
  images,
  title,
  subtitle,
  primaryColor,
  secondaryColor
}) => {
  return (
    <div className="relative perspective-1000 my-4 mx-auto max-w-lg">
      <Card className={`bg-${primaryColor} rounded-lg overflow-hidden shadow-xl hover:animate-page-flip`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div 
                  className={`absolute inset-0 border-4 border-dashed border-${secondaryColor} rounded-md`}
                ></div>
                {image ? (
                  <img 
                    src={image} 
                    alt={`Scrapbook image ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-md shadow-md transform transition-transform group-hover:scale-105 group-hover:rotate-1"
                  />
                ) : (
                  <div className={`w-full h-32 bg-${secondaryColor}/20 rounded-md flex items-center justify-center`}>
                    <Plus size={24} className="text-gray-400" />
                  </div>
                )}
                <Button 
                  size="icon" 
                  variant="secondary"
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil size={12} />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <div className="border border-gray-300 p-3 rounded-md min-h-24">
              <p className="text-gray-500 italic">Click to add your travel story...</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              {['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400'].map((color, i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded-full ${color} cursor-pointer hover:scale-110 transition-transform`}
                ></div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Add Sticker
              </Button>
              <Button variant="outline" size="sm">
                Add Text
              </Button>
            </div>
          </div>
          
          <div className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded-md">
            Theme: {theme}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapbookTemplate;
