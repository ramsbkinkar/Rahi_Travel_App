// Function to export scrapbook as PDF (simplified implementation)
export const exportScrapbookAsPDF = async (scrapbookData: any) => {
  // In a real implementation, this would use a library like jsPDF or html2pdf
  console.log('Exporting scrapbook:', scrapbookData.title);
  
  // This is a placeholder - in a real app, we would:
  // 1. Capture each page as an image (using html2canvas)
  // 2. Create a PDF document (using jsPDF)
  // 3. Add each captured page to the PDF
  // 4. Save the PDF with the scrapbook title
  
  alert(`Export feature would save "${scrapbookData.title}" as PDF`);
  
  return true;
};

// Function to create placeholder sticker URLs
export const getThemeStickers = (themeId: string): string[] => {
  // These would be real images in a production environment
  switch (themeId) {
    case 'friends':
      return [
        '/stickers/friends/high-five.svg',
        '/stickers/friends/group.svg',
        '/stickers/friends/hearts.svg'
      ];
    case 'love':
      return [
        '/stickers/love/heart.svg',
        '/stickers/love/couple.svg',
        '/stickers/love/flower.svg'
      ];
    case 'beach':
      return [
        '/stickers/beach/sun.svg',
        '/stickers/beach/palm.svg',
        '/stickers/beach/shell.svg'
      ];
    case 'honeymoon':
      return [
        '/stickers/honeymoon/rings.svg',
        '/stickers/honeymoon/hearts.svg',
        '/stickers/honeymoon/champagne.svg'
      ];
    case 'mountains':
      return [
        '/stickers/mountains/peak.svg',
        '/stickers/mountains/tree.svg',
        '/stickers/mountains/tent.svg'
      ];
    default:
      return [];
  }
};

// Function to create a new empty scrapbook page
export const createEmptyScrapbookPage = () => {
  return {
    images: [],
    text: ""
  };
};

// Save scrapbook to local storage
export const saveScrapbookToLocalStorage = (scrapbook: any) => {
  try {
    localStorage.setItem(`scrapbook_${Date.now()}`, JSON.stringify(scrapbook));
    return true;
  } catch (error) {
    console.error("Failed to save scrapbook:", error);
    return false;
  }
};

// Get all saved scrapbooks from local storage
export const getSavedScrapbooks = () => {
  const scrapbooks = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('scrapbook_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '');
        scrapbooks.push({
          id: key,
          ...data
        });
      } catch (error) {
        console.error("Error parsing scrapbook:", error);
      }
    }
  }
  return scrapbooks;
}; 

// User-scoped helpers
export interface SavedScrapbook {
  id: string;
  title: string;
  theme: string;
  createdAt: string;
  pages: number;
  previewDataUrl: string; // PNG data URL
}

export interface FullSavedScrapbook extends SavedScrapbook {
  images?: string[];
  captions?: string[];
}

export const saveScrapbookForUser = (
  userId: number,
  scrapbook: Omit<SavedScrapbook, 'id' | 'createdAt'> & { images?: string[]; captions?: string[] }
) => {
  try {
    const id = `scrapbook_u${userId}_${Date.now()}`;
    const payload: FullSavedScrapbook = {
      id,
      createdAt: new Date().toISOString(),
      ...scrapbook,
    };
    localStorage.setItem(id, JSON.stringify(payload));
    return payload;
  } catch (err) {
    console.error('Failed to save scrapbook for user:', err);
    return null;
  }
};

export const getUserScrapbooks = (userId: number): SavedScrapbook[] => {
  const list: SavedScrapbook[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`scrapbook_u${userId}_`)) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '') as FullSavedScrapbook;
        list.push(data);
      } catch {
        // ignore bad entries
      }
    }
  }
  // newest first
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getScrapbookById = (id: string): FullSavedScrapbook | null => {
  try {
    const raw = localStorage.getItem(id);
    if (!raw) return null;
    return JSON.parse(raw) as FullSavedScrapbook;
  } catch {
    return null;
  }
};