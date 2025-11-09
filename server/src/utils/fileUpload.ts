import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Save a base64 image to the file system
 * @param base64Data Base64 encoded image data
 * @param folder Subfolder to store in (optional)
 * @returns URL path to the saved image
 */
export const saveBase64Image = (base64Data: string, folder = 'posts'): string => {
  // Validate base64 data
  if (!base64Data || !base64Data.includes('base64')) {
    throw new Error('Invalid base64 image data');
  }
  
  try {
    // Extract mime type and data
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }
    
    const mimeType = matches[1];
    const imageData = matches[2];
    const extension = mimeType.split('/')[1];
    
    // Generate unique filename
    const filename = `${crypto.randomBytes(16).toString('hex')}.${extension}`;
    
    // Create folder if it doesn't exist
    const targetDir = path.join(uploadsDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Check if the image data is valid
    const buffer = Buffer.from(imageData, 'base64');
    if (buffer.length === 0) {
      throw new Error('Empty image data');
    }
    
    // Save file
    const filePath = path.join(targetDir, filename);
    console.log(`Saving image to: ${filePath}`);
    fs.writeFileSync(filePath, buffer);
    console.log(`Image saved successfully, size: ${buffer.length} bytes`);
    
    // Return URL path with timestamp to prevent caching
    const timestamp = Date.now();
    return `/uploads/${folder}/${filename}?t=${timestamp}`;
  } catch (error: any) {
    console.error('Error saving image:', error);
    throw new Error(`Failed to save image: ${error.message}`);
  }
};

/**
 * Delete a file from the uploads directory
 * @param filePath Path to the file to delete
 */
export const deleteFile = (filePath: string): void => {
  // Only allow deleting files from the uploads directory
  if (!filePath.startsWith('/uploads/')) {
    throw new Error('Invalid file path');
  }
  
  // Get absolute path
  const fullPath = path.join(__dirname, '../../public', filePath);
  
  // Check if file exists
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}; 