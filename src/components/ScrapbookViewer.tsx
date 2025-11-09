import React, { useState, useEffect, useRef } from 'react';
import ScrapbookPage from './ScrapbookPage';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrapbookData {
  title: string;
  theme: {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
  };
  pages: {
    images: string[];
    text: string;
  }[];
}

interface ScrapbookViewerProps {
  scrapbookData: ScrapbookData;
  onAddPage?: () => void;
  onUpdatePage?: (pageIndex: number, data: { text?: string; images?: string[] }) => void;
}

const ScrapbookViewer: React.FC<ScrapbookViewerProps> = ({
  scrapbookData,
  onAddPage,
  onUpdatePage
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [totalPages, setTotalPages] = useState(1);
  const [animationClass, setAnimationClass] = useState('');
  const bookRef = useRef<HTMLDivElement>(null);
  
  // Safely get the total number of pages
  useEffect(() => {
    if (scrapbookData && Array.isArray(scrapbookData.pages)) {
      setTotalPages(scrapbookData.pages.length);
    } else {
      setTotalPages(1);
    }
  }, [scrapbookData]);

  // Handle text change on the current page
  const handleTextChange = (text: string) => {
    if (onUpdatePage && currentPage >= 0 && currentPage < totalPages) {
      onUpdatePage(currentPage, { text });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      flipPage('next');
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      flipPage('prev');
    }
  };
  
  // Enhanced page flipping animation
  const flipPage = (direction: 'next' | 'prev') => {
    setFlipDirection(direction);
    setIsFlipping(true);
    
    // Set the appropriate animation class
    if (direction === 'next') {
      setAnimationClass('animate-flip-out-right');
    } else {
      setAnimationClass('animate-flip-out-left');
    }
    
    // Wait for animation to complete
    setTimeout(() => {
      // Update page number
      setCurrentPage(prev => direction === 'next' ? prev + 1 : prev - 1);
      
      // Change animation for flipping in
      setAnimationClass(direction === 'next' ? 'animate-flip-in-left' : 'animate-flip-in-right');
      
      // Reset after animation completes
      setTimeout(() => {
        setIsFlipping(false);
        setAnimationClass('');
      }, 500);
    }, 500);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrevPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isFlipping]);

  // Safety checks
  if (!scrapbookData || !scrapbookData.theme || !Array.isArray(scrapbookData.pages) || scrapbookData.pages.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-md shadow">
        <p className="text-gray-500">No scrapbook data available</p>
      </div>
    );
  }

  const currentPageData = scrapbookData.pages[currentPage] || { images: [], text: '' };
  
  // Determine background image/pattern based on theme
  const getBackgroundStyle = () => {
    const themeId = scrapbookData.theme.id;
    
    if (themeId === 'beach') {
      return 'bg-gradient-to-b from-cyan-50 to-blue-100';
    } else if (themeId === 'mountains') {
      return 'bg-gradient-to-b from-green-50 to-emerald-100';
    } else if (themeId === 'love') {
      return 'bg-gradient-to-b from-pink-50 to-rose-100';
    } else if (themeId === 'honeymoon') {
      return 'bg-gradient-to-b from-red-50 to-amber-100';
    } else if (themeId === 'friends') {
      return 'bg-gradient-to-b from-blue-50 to-indigo-100';
    }
    
    return 'bg-gray-100';
  };

  return (
    <div className="relative py-4">
      {/* Book title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{scrapbookData.title}</h2>
        <p className="text-sm text-gray-500 mt-1">Theme: {scrapbookData.theme.name}</p>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={handlePrevPage}
          disabled={currentPage === 0 || isFlipping}
          className="z-10"
        >
          <ChevronLeft size={18} className="mr-1" /> Previous Page
        </Button>
        
        <div className="flex items-center">
          <span className="text-sm font-medium px-3 py-1 bg-white rounded-full shadow-sm">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {onAddPage && (
            <Button 
              variant="outline" 
              onClick={onAddPage}
              disabled={isFlipping}
            >
              <Plus size={18} className="mr-1" /> Add Page
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
          >
            Next Page <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
      </div>
      
      {/* Instruction tooltip */}
      <div className="text-center text-xs text-gray-500 mb-4">
        Use arrow keys ← → to navigate between pages
      </div>
      
      {/* Book container with perspective */}
      <div 
        ref={bookRef}
        className={cn(
          "relative mx-auto max-w-4xl perspective-1000 min-h-[700px] rounded-lg p-4 shadow-inner",
          getBackgroundStyle()
        )}
        style={{ perspective: '2000px' }}
      >
        {/* Decorative corner fold */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gray-200 z-10">
          <div 
            className="absolute inset-0 bg-white" 
            style={{ 
              clipPath: 'polygon(0 0, 100% 100%, 100% 0)',
              boxShadow: 'inset -2px 2px 5px rgba(0,0,0,0.1)'
            }}
          ></div>
        </div>
        
        {/* Book binding */}
        <div className="absolute left-1/2 top-0 bottom-0 w-4 -ml-2 bg-gradient-to-r from-gray-400 to-gray-300 shadow-lg z-10"></div>
        
        {/* Book cover shadow effect */}
        <div className="absolute inset-0 shadow-inner pointer-events-none rounded-lg"></div>
        
        {/* Current page */}
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-500",
            animationClass
          )}
          style={{ 
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          }}
        >
          <ScrapbookPage
            theme={scrapbookData.theme}
            pageNumber={currentPage}
            totalPages={totalPages}
            userImages={currentPageData.images || []}
            pageText={currentPageData.text || ''}
            onTextChange={handleTextChange}
          />
        </div>
        
        {/* Page turning click areas */}
        {!isFlipping && (
          <>
            {currentPage < totalPages - 1 && (
              <div 
                className="absolute top-0 right-0 w-1/4 bottom-0 cursor-pointer z-0"
                onClick={handleNextPage}
              />
            )}
            {currentPage > 0 && (
              <div 
                className="absolute top-0 left-0 w-1/4 bottom-0 cursor-pointer z-0"
                onClick={handlePrevPage}
              />
            )}
          </>
        )}
        
        {/* Page number dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1 z-20">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentPage 
                  ? "bg-blue-500 w-3 h-3" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => {
                if (!isFlipping && index !== currentPage) {
                  // Determine direction
                  const direction = index > currentPage ? 'next' : 'prev';
                  setCurrentPage(index);
                  setFlipDirection(direction);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrapbookViewer; 