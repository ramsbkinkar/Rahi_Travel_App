import React from 'react';
import type { ThemeKey, RandomSticker } from '@/utils/themes';
import { themes } from '@/utils/themes';

interface Layout4Props {
  image1?: string;
  image2?: string;
  image3?: string;
  theme: ThemeKey;
  stickers?: RandomSticker[];
}

// Tall left hero, two staggered right images
const Layout4: React.FC<Layout4Props> = ({ image1, image2, image3, theme, stickers = [] }) => {
  const t = themes[theme];
  return (
    <div className={`relative w-full h-full scrapbook-surface ${t?.bgColor} ${t?.pattern} ${t?.backgroundClass} ${t?.borderClass} p-6 md:p-8`}>
      <div className="pointer-events-none absolute inset-0 scrapbook-center-glow" />
      <div className="grid grid-cols-3 gap-4 md:gap-6 h-full">
        <div className="col-span-2">
          <div className="relative h-full bg-white rounded-xl shadow-xl p-3 rotate-[-1deg]">
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {image1 ? <img src={image1} alt="scrap-1" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>}
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-4 md:gap-6">
          <div className="relative flex-1 bg-white rounded-xl shadow-xl p-3 rotate-[2deg]">
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {image2 ? <img src={image2} alt="scrap-2" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>}
            </div>
          </div>
          <div className="relative flex-1 bg-white rounded-xl shadow-xl p-3 rotate-[-3deg] translate-x-2">
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {image3 ? <img src={image3} alt="scrap-3" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>}
            </div>
          </div>
        </div>
      </div>
      {stickers.map((s, i) => s.type === 'text'
        ? <span key={i} style={s.style as React.CSSProperties}>{s.text}</span>
        : <img key={i} src={s.src} alt="" style={s.style} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      )}
    </div>
  );
};

export default Layout4;


