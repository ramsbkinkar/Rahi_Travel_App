
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface TravelCardProps {
  image: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  category: string;
}

const TravelCard: React.FC<TravelCardProps> = ({ 
  image, 
  title, 
  location, 
  duration, 
  price,
  category
}) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-60 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <Badge 
          className="absolute top-3 right-3 bg-raahi-orange hover:bg-raahi-orange-dark"
        >
          {category}
        </Badge>
      </div>
      
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        
        <div className="flex items-center mt-2 text-gray-600">
          <MapPin size={16} className="mr-1 text-raahi-orange" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">{duration}</span>
          <span className="font-semibold text-lg">{price}</span>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 pt-4">
        <button className="text-raahi-blue hover:text-raahi-blue-dark font-medium text-sm w-full text-center transition">
          View Details
        </button>
      </CardFooter>
    </Card>
  );
};

export default TravelCard;
