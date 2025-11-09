import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ThemeOption {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  templates: number;
  previewImage?: string;
}

interface ScrapbookThemePickerProps {
  themes: ThemeOption[];
  selectedThemeId: string;
  onThemeSelect: (themeId: string) => void;
}

const ScrapbookThemePicker: React.FC<ScrapbookThemePickerProps> = ({
  themes,
  selectedThemeId,
  onThemeSelect
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select a Theme</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {themes.map((theme) => {
          const isSelected = theme.id === selectedThemeId;
          
          return (
            <Card
              key={theme.id}
              className={cn(
                "relative cursor-pointer transition-all overflow-hidden",
                "hover:shadow-md hover:scale-105",
                isSelected && "ring-2 ring-offset-2",
                isSelected ? `ring-${theme.secondaryColor}` : ""
              )}
              onClick={() => onThemeSelect(theme.id)}
            >
              {/* Preview image or color swatch */}
              <div 
                className={`bg-${theme.primaryColor} h-24 w-full`}
                style={{
                  backgroundImage: theme.previewImage ? `url(${theme.previewImage})` : undefined,
                  backgroundSize: 'cover'
                }}
              >
                {/* Theme pattern or decoration */}
                <div className={`bg-${theme.secondaryColor} h-8 w-full opacity-50`}></div>
              </div>
              
              {/* Theme name */}
              <div className="p-2 text-center">
                <p className="text-sm font-medium">{theme.name}</p>
              </div>
              
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow-sm">
                  <Check size={16} className={`text-${theme.secondaryColor}`} />
                </div>
              )}
            </Card>
          );
        })}
      </div>
      
      {/* Theme description */}
      {themes.find(t => t.id === selectedThemeId) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
          <p><strong>{themes.find(t => t.id === selectedThemeId)?.name} Theme:</strong> Perfect for {selectedThemeId === 'love' ? 'romantic getaways and couples travel' : selectedThemeId === 'friends' ? 'group trips and adventures with friends' : selectedThemeId === 'beach' ? 'coastal vacations and island hopping' : selectedThemeId === 'honeymoon' ? 'newlywed travels and romantic escapes' : 'hiking trips and outdoor adventures'}.</p>
        </div>
      )}
    </div>
  );
};

export default ScrapbookThemePicker; 