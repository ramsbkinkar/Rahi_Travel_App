import { Router } from 'express';
import { z } from 'zod';
import { saveBase64Image } from '../utils/fileUpload';
import { Request, Response } from 'express';

const router = Router();

// Validation schema for image upload
const uploadImageSchema = z.object({
  image: z.string(),
  folder: z.string().optional()
});

// Upload an image
router.post('/image', async (req: Request, res: Response) => {
  try {
    const { image, folder } = uploadImageSchema.parse(req.body);
    
    const imagePath = saveBase64Image(image, folder);
    
    res.status(201).json({
      status: 'success',
      data: {
        image_url: imagePath
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

export default router; 