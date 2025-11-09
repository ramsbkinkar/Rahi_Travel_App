import React from 'react';
import type { ThemeKey, RandomSticker } from '@/utils/themes';
import { themes } from '@/utils/themes';

interface Layout3Props {
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  theme: ThemeKey;
  stickers?: RandomSticker[];
}

// 2x2 grid, subtle tilts
const Layout3: React.FC<Layout3Props> = ({ image1, image2, image3, image4, theme, stickers = [] }) => {
  const t = themes[theme];
  return (
    <div className={`relative w-full h-full scrapbook-surface ${t?.bgColor} ${t?.pattern} ${t?.backgroundClass} ${t?.borderClass} p-6 md:p-8`}>
      <div className="pointer-events-none absolute inset-0 scrapbook-center-glow" />
      <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-6 h-full">
        {[image1, image2, image3, image4].map((img, idx) => (
          <div key={idx} className={`relative bg-white rounded-xl shadow-xl p-3 ${idx % 2 === 0 ? 'rotate-[-1.5deg]' : 'rotate-[1.5deg]'}`}>
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {img ? <img src={img} alt={`scrap-${idx}`} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>}
            </div>
          </div>
        ))}
      </div>
      {stickers.map((s, i) => s.type === 'text'
        ? <span key={i} style={s.style as React.CSSProperties}>{s.text}</span>
        : <img key={i} src={s.src} alt="" style={s.style} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      )}
    </div>
  );
};

export default Layout3;


