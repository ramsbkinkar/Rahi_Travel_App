export type ThemeKey = 'beach' | 'friends' | 'honeymoon' | 'love' | 'mountains';

export interface ThemeConfig {
  name: string;
  bgColor: string;
  textColor: string;
  pattern: string;
  stickerPath: string;
}

export const themes: Record<ThemeKey, ThemeConfig> = {
  beach: {
    name: 'Beach Vibes',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    pattern:
      'bg-[url(\"data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2393c5fd\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")]',
    stickerPath: 'stickers/beach',
  },
  friends: {
    name: 'Friends Trip',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-800',
    pattern:
      'bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.15)_1px,_transparent_0)] bg-[length:20px_20px]',
    stickerPath: 'stickers/friends',
  },
  honeymoon: {
    name: 'Honeymoon',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-800',
    pattern:
      'bg-[radial-gradient(circle,_rgba(244,63,94,0.12)_2px,_transparent_2px)] bg-[length:24px_24px]',
    stickerPath: 'stickers/honeymoon',
  },
  love: {
    name: 'Love Story',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-800',
    pattern:
      'bg-[linear-gradient(45deg,_rgba(236,72,153,0.08)_25%,_transparent_25%),linear-gradient(-45deg,_rgba(236,72,153,0.08)_25%,_transparent_25%),linear-gradient(45deg,_transparent_75%,_rgba(236,72,153,0.08)_75%),linear-gradient(-45deg,_transparent_75%,_rgba(236,72,153,0.08)_75%)] bg-[length:20px_20px]',
    stickerPath: 'stickers/love',
  },
  mountains: {
    name: 'Mountains',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    pattern:
      'bg-[linear-gradient(0deg,_rgba(16,185,129,0.08)_1px,_transparent_1px)] bg-[length:100%_18px]',
    stickerPath: 'stickers/mountains',
  },
};

export interface RandomSticker {
  src: string;
  style: React.CSSProperties;
}

export function getRandomStickers(theme: ThemeKey, count: number = 3): RandomSticker[] {
  // Assume assets /public/stickers/<theme>/{1..5}.png; fallback to empty if not present
  const maxIndex = 5;
  const picks = Array.from({ length: count }).map(() => {
    const idx = Math.floor(Math.random() * maxIndex) + 1;
    const left = 10 + Math.random() * 70;
    const top = 10 + Math.random() * 70;
    const rotate = Math.random() * 30 - 15;
    const scale = 0.7 + Math.random() * 0.6;
    return {
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


