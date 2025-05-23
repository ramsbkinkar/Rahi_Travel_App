import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Upload, 
  Download, 
  Share2,
  Trash2 
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import ScrapbookPage from './ScrapbookPage';

interface ScrapbookEditorProps {
  theme: {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    templates: number;
  };
  onThemeChange?: (themeId: string) => void;
  onImagesChange?: (images: string[][]) => void;
  onTextChange?: (texts: string[]) => void;
  initialImages?: string[][];
  initialTexts?: string[];
}

const ScrapbookEditor: React.FC<ScrapbookEditorProps> = ({ 
  theme, 
  onThemeChange,
  onImagesChange,
  onTextChange,
  initialImages = [[]],
  initialTexts = [""]
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(initialImages.length || 1);
  const [userImages, setUserImages] = useState<string[][]>(initialImages);
  const [pageTexts, setPageTexts] = useState<string[]>(initialTexts);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when initialImages or initialTexts change
  useEffect(() => {
    setUserImages(initialImages);
    setTotalPages(initialImages.length || 1);
    // Reset current page if we're now on an invalid page
    if (currentPage >= initialImages.length) {
      setCurrentPage(0);
    }
  }, [initialImages]);

  useEffect(() => {
    setPageTexts(initialTexts);
  }, [initialTexts]);

  // Update parent component when images or texts change
  useEffect(() => {
    if (onImagesChange) {
      onImagesChange(userImages);
    }
  }, [userImages, onImagesChange]);

  useEffect(() => {
    if (onTextChange) {
      onTextChange(pageTexts);
    }
  }, [pageTexts, onTextChange]);

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleAddPage = () => {
    const newTotalPages = totalPages + 1;
    setTotalPages(newTotalPages);
    
    // Initialize new page with empty images and text
    const newUserImages = [...userImages];
    newUserImages[totalPages] = [];
    setUserImages(newUserImages);
    
    const newPageTexts = [...pageTexts];
    newPageTexts[totalPages] = '';
    setPageTexts(newPageTexts);
    
    setCurrentPage(totalPages);
  };

  // Handle removing images from the current page
  const handleRemoveImage = (imageIndex: number) => {
    const updatedPageImages = [...(userImages[currentPage] || [])];
    updatedPageImages.splice(imageIndex, 1);
    
    const updatedUserImages = [...userImages];
    updatedUserImages[currentPage] = updatedPageImages;
    setUserImages(updatedUserImages);
  };

  // Handle clearing all images from the current page
  const handleClearPageImages = () => {
    const updatedUserImages = [...userImages];
    updatedUserImages[currentPage] = [];
    setUserImages(updatedUserImages);
  };

  // Handle image upload
  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const newPageImages = [...(userImages[currentPage] || [])];
    let processedCount = 0;
    
    // Process each file
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPageImages.push(e.target.result.toString());
          
          // Update images for current page
          const updatedUserImages = [...userImages];
          updatedUserImages[currentPage] = newPageImages;
          setUserImages(updatedUserImages);
          
          processedCount++;
          if (processedCount === files.length) {
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle text change
  const handleTextChange = (text: string) => {
    const updatedPageTexts = [...pageTexts];
    updatedPageTexts[currentPage] = text;
    setPageTexts(updatedPageTexts);
  };

  return (
    <div className="space-y-6">
      {/* Page Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrevPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={18} className="mr-1" /> Previous Page
        </Button>
        
        <div className="text-center">
          <span className="text-lg font-medium">Page {currentPage + 1} of {totalPages}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleAddPage}
          >
            <Plus size={18} className="mr-1" /> Add Page
          </Button>
          <Button 
            variant="outline" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next Page <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
      </div>
      
      {/* Current Page Preview */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <ScrapbookPage
          theme={theme}
          pageNumber={currentPage}
          totalPages={totalPages}
          userImages={userImages[currentPage] || []}
          pageText={pageTexts[currentPage] || ''}
          onTextChange={handleTextChange}
          isEditing={true}
        />
      </div>
      
      {/* Upload and Image Controls */}
      <div className="flex flex-col gap-4">
        {/* Upload Images Button */}
        <div className="flex justify-center gap-3">
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files)}
          />
          <Button 
            variant="secondary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload size={18} className="mr-2" /> 
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </Button>
          
          {userImages[currentPage]?.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearPageImages}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <Trash2 size={18} className="mr-2" /> 
              Clear Page Photos
            </Button>
          )}
        </div>
        
        {/* Thumbnail Preview of Current Images */}
        {userImages[currentPage]?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Photos:</h3>
            <div className="flex flex-wrap gap-2">
              {userImages[currentPage].map((image, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={image} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <span className="text-xs">×</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapbookEditor; 