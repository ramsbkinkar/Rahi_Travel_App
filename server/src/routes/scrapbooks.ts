import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { dbAsync } from '../config/db';
import { saveBase64Image } from '../utils/fileUpload';

const router = Router();

const createSchema = z.object({
  user_id: z.number(),
  title: z.string().min(1),
  theme: z.string().min(1),
  images: z.array(z.string()).min(1), // base64 or http(s) url; if base64 we'll store to disk
  captions: z.array(z.string()).optional().default([])
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, title, theme, images, captions } = createSchema.parse(req.body);

    // Save images that are base64 and return URL paths
    const urls: string[] = [];
    for (const img of images) {
      if (img.startsWith('data:image')) {
        const path = saveBase64Image(img, `scrapbooks/${user_id}`);
        urls.push(path);
      } else {
        urls.push(img);
      }
    }

    const pagesCount = Math.ceil(urls.length / 2); // alternates 2/3 per page; rough count not essential
    const preview = urls[0] || null;
    const imagesJson = JSON.stringify(urls);
    const captionsJson = JSON.stringify(captions || []);

    const result = await dbAsync.run(
      `INSERT INTO scrapbooks (user_id, title, theme, pages_count, preview_image_url, images_json, captions_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, title, theme, pagesCount, preview, imagesJson, captionsJson]
    );

    const created = await dbAsync.get(`SELECT * FROM scrapbooks WHERE id = ?`, [result.lastID]);
    return res.status(201).json({ status: 'success', data: created });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input',
        errors: error.errors
      });
    }
    console.error('Create scrapbook error:', error);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const list = await dbAsync.all(
      `SELECT id, title, theme, created_at, preview_image_url FROM scrapbooks WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return res.json({ status: 'success', data: list });
  } catch (error) {
    console.error('List scrapbooks error:', error);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

router.get('/id/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const row = await dbAsync.get(`SELECT * FROM scrapbooks WHERE id = ?`, [id]);
    if (!row) {
      return res.status(404).json({ status: 'error', message: 'Scrapbook not found' });
    }
    // Parse arrays
    row.images = JSON.parse(row.images_json || '[]');
    row.captions = JSON.parse(row.captions_json || '[]');
    delete row.images_json;
    delete row.captions_json;
    return res.json({ status: 'success', data: row });
  } catch (error) {
    console.error('Get scrapbook error:', error);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

export default router;


