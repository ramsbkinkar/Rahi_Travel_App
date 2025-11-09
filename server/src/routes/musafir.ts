import { Router } from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MUSAFIR_BASE_SYSTEM, SITE_FACTS } from '../resources/site_facts';

const router = Router();

const PROVIDER = (process.env.MUSAFIR_PROVIDER || 'gemini').toLowerCase();
const MODEL = process.env.MUSAFIR_MODEL || (PROVIDER === 'gemini' ? 'gemini-2.0-flash-lite' : PROVIDER === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini');

// Basic health
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', provider: PROVIDER, model: MODEL });
});

// Simple chat completion (non-streaming for MVP)
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body as { messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> };
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ status: 'error', message: 'messages[] required' });
    }

    // Merge system prompts with site facts for consistent behavior
    const userSys = (messages.find(m => m.role === 'system')?.content || '').trim();
    const combinedSystem = [MUSAFIR_BASE_SYSTEM, SITE_FACTS, userSys].filter(Boolean).join('\n\n');

    if (PROVIDER === 'gemini') {
      const apiKeyGemini = process.env.GEMINI_API_KEY;
      if (!apiKeyGemini) return res.status(500).json({ status: 'error', message: 'Missing GEMINI_API_KEY on server' });

      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const genAI = new GoogleGenerativeAI(apiKeyGemini);
      const tryModels = Array.from(new Set([
        MODEL,                            // env preference
        'gemini-2.0-flash-lite',         // common free/cheap
        'gemini-2.0-flash',              // next best
        'gemini-1.5-flash-8b',           // widely available
        'gemini-1.5-flash',              // fallback
      ]));

      let lastErr: any = null;
      for (const m of tryModels) {
        try {
          const mdl = genAI.getGenerativeModel({ model: m, systemInstruction: combinedSystem });
          const resp = await mdl.generateContent({ contents });
          const text = resp.response.text();
          return res.json({ status: 'success', data: { text, model: m, provider: PROVIDER } });
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr;
    }

    // OpenAI-compatible providers (openai, groq)
    const apiKey = PROVIDER === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    const missingEnv = PROVIDER === 'groq' ? 'GROQ_API_KEY' : 'OPENAI_API_KEY';
    if (!apiKey) return res.status(500).json({ status: 'error', message: `Missing ${missingEnv} on server` });

    const client = new OpenAI({
      apiKey,
      baseURL: PROVIDER === 'groq' ? 'https://api.groq.com/openai/v1' : undefined,
    });
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'system', content: combinedSystem }, ...messages.filter(m => m.role !== 'system')],
      temperature: 0.6,
      max_tokens: 600,
    });
    const text = completion.choices?.[0]?.message?.content ?? '';
    return res.json({ status: 'success', data: { text, model: MODEL, provider: PROVIDER } });
  } catch (err: any) {
    const status = err?.status || err?.response?.status;
    const msg = err?.message || err?.response?.data?.error?.message || 'Chat failed';

    if (status === 429) {
      return res.status(429).json({
        status: 'error',
        code: 'quota_exceeded',
        message: `${PROVIDER.toUpperCase()} quota exceeded. Please add billing to your account or switch provider/model.`,
      });
    }

    if (status === 401) {
      return res.status(401).json({
        status: 'error',
        code: 'unauthorized',
        message: `Invalid or missing API key for provider ${PROVIDER.toUpperCase()}. Check your server .env.`,
      });
    }

    console.error('Musafir chat error:', msg);
    res.status(500).json({ status: 'error', message: msg });
  }
});

export default router;


