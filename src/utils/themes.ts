export type ThemeKey = 'beach' | 'friends' | 'honeymoon' | 'love' | 'mountains';

export interface ThemeConfig {
  name: string;
  bgColor: string;
  textColor: string;
  pattern: string;
  stickerPath: string;
  backgroundClass?: string;
  borderClass?: string;
}

export const themes: Record<ThemeKey, ThemeConfig> = {
  beach: {
    name: 'Beach Vibes',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    pattern:
      'bg-[url(\"data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2393c5fd\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")]',
    stickerPath: 'stickers/beach',
    backgroundClass: 'bg-scrapbook-beach',
    borderClass: 'border-scrapbook-rope',
  },
  friends: {
    name: 'Friends Trip',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-800',
    pattern:
      'bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.15)_1px,_transparent_0)] bg-[length:20px_20px]',
    stickerPath: 'stickers/friends',
    backgroundClass: 'bg-scrapbook-friends',
    borderClass: 'border-scrapbook-film',
  },
  honeymoon: {
    name: 'Honeymoon',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-800',
    pattern:
      'bg-[radial-gradient(circle,_rgba(244,63,94,0.12)_2px,_transparent_2px)] bg-[length:24px_24px]',
    stickerPath: 'stickers/honeymoon',
    backgroundClass: 'bg-scrapbook-honeymoon',
    borderClass: 'border-scrapbook-floral',
  },
  love: {
    name: 'Love Story',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-800',
    pattern:
      'bg-[linear-gradient(45deg,_rgba(236,72,153,0.08)_25%,_transparent_25%),linear-gradient(-45deg,_rgba(236,72,153,0.08)_25%,_transparent_25%),linear-gradient(45deg,_transparent_75%,_rgba(236,72,153,0.08)_75%),linear-gradient(-45deg,_transparent_75%,_rgba(236,72,153,0.08)_75%)] bg-[length:20px_20px]',
    stickerPath: 'stickers/love',
    backgroundClass: 'bg-scrapbook-love',
    borderClass: 'border-scrapbook-floral',
  },
  mountains: {
    name: 'Mountains',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    pattern:
      'bg-[linear-gradient(0deg,_rgba(16,185,129,0.08)_1px,_transparent_1px)] bg-[length:100%_18px]',
    stickerPath: 'stickers/mountains',
    backgroundClass: 'bg-scrapbook-mountain',
    borderClass: 'border-scrapbook-rope',
  },
};

export type StickerKind = 'img' | 'text';
export interface RandomSticker {
  type?: StickerKind; // default 'img'
  src?: string;
  text?: string;
  style: React.CSSProperties;
}

export type DecorIntensity = 'minimal' | 'decorative' | 'bold';

export function getRandomStickers(theme: ThemeKey, count: number = 3, intensity: DecorIntensity = 'decorative'): RandomSticker[] {
  // Assume assets /public/stickers/<theme>/{1..5}.png; fallback to empty if not present
  const maxIndex = 5;
  const extra = intensity === 'bold' ? 3 : intensity === 'decorative' ? 1 : 0;
  const total = count + extra;
  const picks: RandomSticker[] = Array.from({ length: total }).map(() => {
    const idx = Math.floor(Math.random() * maxIndex) + 1;
    const left = 10 + Math.random() * 70;
    const top = 10 + Math.random() * 70;
    const rotate = Math.random() * 30 - 15;
    const scale = 0.7 + Math.random() * 0.6;
    return {
      type: 'img',
      src: `/${themes[theme].stickerPath}/${idx}.png`,
      style: {
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        pointerEvents: 'none',
        opacity: 0.9,
      } as React.CSSProperties,
    };
  });

  return picks;
}

export function generateCaption(theme: ThemeKey, index: number): string {
  const t = themes[theme];
  const base = {
    beach: ['Salt in the air, sand in my hair', 'Chasing waves and warm rays', 'Postcard from paradise'],
    friends: ['Memories with my people', 'Laugh lines and good times', 'Snapshots of pure joy'],
    honeymoon: ['Us against the world', 'Sunsets and new chapters', 'Love on the itinerary'],
    love: ['Hearts full, hands held', 'You + me = everything', 'Little moments, big love'],
    mountains: ['Where the air feels new', 'Trails, tales, and tall peaks', 'Find me where the wild is'],
  } as Record<ThemeKey, string[]>;
  const choices = base[theme];
  const phrase = choices[index % choices.length];
  return phrase;
}

// Random text overlays placed between/around photos
export function getRandomTextStickers(theme: ThemeKey, intensity: DecorIntensity = 'decorative'): RandomSticker[] {
  const palettes: Record<ThemeKey, string[]> = {
    beach: ['#0ea5e9','#22d3ee','#f59e0b','#10b981'],
    friends: ['#4f46e5','#06b6d4','#f97316','#f43f5e'],
    honeymoon: ['#f43f5e','#a78bfa','#60a5fa','#f472b6'],
    love: ['#ec4899','#ef4444','#fb7185','#fbbf24'],
    mountains: ['#10b981','#059669','#22c55e','#38bdf8'],
  };
  const fonts = [
    "'Poppins', sans-serif",
    "'Inter', sans-serif",
    "'Dancing Script', cursive",
    "'Caveat', cursive",
    "'Comic Neue', cursive",
  ];
  const phrases = {
    beach: ['Sun, Sand & Stories', 'Chasing Waves', 'Saltwater Memories'],
    friends: ['Good Vibes Only', 'Dialogues with the World', 'Laugh. Click. Repeat.'],
    honeymoon: ['Our Little Escape', 'Love in the Air', 'Sunsets for Two'],
    love: ['Let’s Go, Together', 'Heart Full', 'Forever Moments'],
    mountains: ['Let’s Go Travel', 'Find Your Peak', 'Into the Wild'],
  } as Record<ThemeKey, string[]>;

  const count = intensity === 'bold' ? 3 : intensity === 'decorative' ? 2 : 1;
  const list: RandomSticker[] = [];
  for (let i = 0; i < count; i++) {
    const text = phrases[theme][i % phrases[theme].length];
    const left = 8 + Math.random() * 70;
    const top = 15 + Math.random() * 65;
    list.push({
      type: 'text',
      text,
      style: {
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        color: palettes[theme][i % palettes[theme].length],
        fontFamily: fonts[i % fonts.length],
        fontWeight: 700,
        letterSpacing: '0.5px',
        textShadow: '0 1px 1px rgba(0,0,0,0.1)',
        fontSize: intensity === 'bold' ? '28px' : '22px',
        transform: `rotate(${(Math.random()*8-4).toFixed(1)}deg)`,
        pointerEvents: 'none',
      }
    });
  }
  return list;
}


