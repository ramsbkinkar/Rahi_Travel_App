
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface CityCardProps {
  image: string;
  name: string;
  description: string;
  slug: string;
}

const CityCard: React.FC<CityCardProps> = ({ image, name, description, slug }) => {
  return (
    <Link to={`/explore-india/${slug}`}>
      <Card className="overflow-hidden card-hover h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">{name}</h3>
        </div>
        
        <CardContent className="pt-4">
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CityCard;
