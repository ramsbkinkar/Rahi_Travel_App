import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { dbAsync } from '../config/db';

const router = Router();

const createTripSchema = z.object({
  owner_id: z.number(),
  name: z.string().min(2)
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { owner_id, name } = createTripSchema.parse(req.body);
    const invite = crypto.randomBytes(6).toString('hex'); // 12 chars
    const result = await dbAsync.run(
      `INSERT INTO trips (owner_id, name, invite_code) VALUES (?, ?, ?)`,
      [owner_id, name, invite]
    );
    await dbAsync.run(
      `INSERT INTO trip_members (trip_id, user_id, role) VALUES (?, ?, 'owner')`,
      [result.lastID, owner_id]
    );
    const trip = await dbAsync.get(`SELECT * FROM trips WHERE id = ?`, [result.lastID]);
    res.status(201).json({ status: 'success', data: trip });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ status: 'error', message: 'Invalid input', errors: e.errors });
    }
    console.error('Create trip error:', e);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

const joinSchema = z.object({
  user_id: z.number(),
  token: z.string()
});

router.post('/:id/join', async (req: Request, res: Response) => {
  try {
    const tripId = parseInt(req.params.id);
    const { user_id, token } = joinSchema.parse(req.body);
    const trip = await dbAsync.get(`SELECT * FROM trips WHERE id = ?`, [tripId]);
    if (!trip || trip.invite_code !== token) {
      return res.status(403).json({ status: 'error', message: 'Invalid invite' });
    }
    await dbAsync.run(
      `INSERT OR IGNORE INTO trip_members (trip_id, user_id, role) VALUES (?, ?, 'member')`,
      [tripId, user_id]
    );
    res.json({ status: 'success', data: { joined: true } });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ status: 'error', message: 'Invalid input', errors: e.errors });
    }
    console.error('Join trip error:', e);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

const locationSchema = z.object({
  user_id: z.number(),
  lat: z.number(),
  lng: z.number(),
  accuracy: z.number().optional(),
  heading: z.number().optional(),
  speed: z.number().optional()
});

router.post('/:id/locations', async (req: Request, res: Response) => {
  try {
    const tripId = parseInt(req.params.id);
    const { user_id, lat, lng, accuracy, heading, speed } = locationSchema.parse(req.body);
    await dbAsync.run(
      `INSERT INTO locations (trip_id, user_id, lat, lng, accuracy, heading, speed) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tripId, user_id, lat, lng, accuracy, heading, speed]
    );
    res.status(201).json({ status: 'success' });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ status: 'error', message: 'Invalid input', errors: e.errors });
    }
    console.error('Location post error:', e);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

router.get('/:id/locations', async (req: Request, res: Response) => {
  try {
    const tripId = parseInt(req.params.id);
    const since = req.query.since ? new Date(req.query.since as string) : null;
    const rows = since
      ? await dbAsync.all(`SELECT * FROM locations WHERE trip_id = ? AND created_at >= ? ORDER BY created_at ASC`, [tripId, since.toISOString()])
      : await dbAsync.all(`SELECT * FROM locations WHERE trip_id = ? AND created_at >= datetime('now', '-1 hour') ORDER BY created_at ASC`, [tripId]);
    res.json({ status: 'success', data: rows });
  } catch (e) {
    console.error('Get locations error:', e);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

const sosSchema = z.object({
  user_id: z.number(),
  lat: z.number(),
  lng: z.number(),
  note: z.string().optional()
});

router.post('/:id/sos', async (req: Request, res: Response) => {
  try {
    const tripId = parseInt(req.params.id);
    const { user_id, lat, lng, note } = sosSchema.parse(req.body);
    const result = await dbAsync.run(
      `INSERT INTO sos_events (trip_id, user_id, lat, lng, note) VALUES (?, ?, ?, ?, ?)`,
      [tripId, user_id, lat, lng, note || null]
    );
    const sos = await dbAsync.get(`SELECT * FROM sos_events WHERE id = ?`, [result.lastID]);
    res.status(201).json({ status: 'success', data: sos });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ status: 'error', message: 'Invalid input', errors: e.errors });
    }
    console.error('SOS error:', e);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Recent SOS events
router.get('/:id/sos', async (req: Request, res: Response) => {
  try {
    const tripId = parseInt(req.params.id);
    const since = req.query.since ? new Date(req.query.since as string) : null;
    const rows = since
      ? await dbAsync.all(`SELECT * FROM sos_events WHERE trip_id = ? AND created_at >= ? ORDER BY created_at ASC`, [tripId, since.toISOString()])
      : await dbAsync.all(`SELECT * FROM sos_events WHERE trip_id = ? AND created_at >= datetime('now', '-1 hour') ORDER BY created_at ASC`, [tripId]);
    res.json({ status: 'success', data: rows });
  } catch (e) {
    console.error('Get sos error:', e);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

export default router;


