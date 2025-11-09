import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { apiClient } from '@/integration/api/client';
import { useAuth } from '@/contexts/AuthContext';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const SYS_PROMPT = `You are Musafir, a concise and friendly travel assistant for Raahi.

When asked for an itinerary, follow this structure unless the user prefers otherwise:
- Ask 1 clarifying question if critical details are missing (e.g., dates, budget, interests). If enough info, skip questions.
- Output a titled plan like "3‑Day Goa Itinerary", then for each day:
  - Morning: ...
  - Afternoon: ...
  - Evening: ...
  - Food: 2–3 local recommendations
  - Budget Tip: short and practical
- Add a short "Alternatives" section (bulleted) and a compact packing or travel tip.

Style rules:
- Keep answers scannable with bullets.
- Prefer local, authentic suggestions; avoid overlong paragraphs.
- If location-sensitive, add neighborhoods/areas so users can cluster visits.
- If unsure, say so briefly and suggest how to find/confirm.

Website awareness:
- Raahi features: Travelgram (social feed), Scrapbook creator, Trip Tracker live map, Travel Packages, and Explore India.
- If asked "how to" for the site, give concrete steps using these features.
`;

const MusafirWidget: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'system', content: SYS_PROMPT }]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const storageKey = useMemo(() => `musafir_chat_${user?.id ?? 'guest'}`, [user?.id]);
  const suggestions = useMemo(() => ([
    'Suggest a 3-day Goa itinerary',
    'Best months to visit Ladakh?',
    'Find budget-friendly treks near Manali',
    'How do I save a scrapbook to my profile?',
  ]), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch { /* ignore */ }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch { /* ignore */ }
  }, [messages, storageKey]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || loading) return;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const resp = await apiClient.musafirChat(newMessages);
      const text = resp?.data?.text || 'Sorry, I could not generate a response.';
      setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : 'Hmm, something went wrong. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {/* Chat window */}
      {open && (
        <div className="w-[340px] sm:w-[380px] h-[440px] bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-semibold">M</span>
              <div className="font-semibold">Musafir</div>
            </div>
            <button className="text-white/90 hover:text-white" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-white">
            {/* Suggestions */}
            {messages.filter(m => m.role !== 'system').length === 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-100"
                    onClick={() => { setInput(s); setTimeout(sendMessage, 10); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.filter(m => m.role !== 'system').length === 0 ? (
              <div className="text-sm text-gray-500 p-3">
                Ask me anything about travel or this site. Try:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Suggest a 3-day Goa itinerary</li>
                  <li>Find budget-friendly treks</li>
                  <li>How do I save a scrapbook?</li>
                </ul>
              </div>
            ) : (
              messages.filter(m => m.role !== 'system').map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-sky-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm px-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Musafir is thinking…
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-white">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage} disabled={loading || input.trim().length === 0}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      {!open && (
        <Button className="rounded-full w-14 h-14 shadow-lg" onClick={() => setOpen(true)}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default MusafirWidget;


