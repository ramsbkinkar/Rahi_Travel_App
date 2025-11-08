import React from 'react';
import type { ThemeKey, RandomSticker } from '@/utils/themes';
import { themes } from '@/utils/themes';

interface Layout1Props {
  image1?: string;
  image2?: string;
  caption1?: string;
  caption2?: string;
  theme: ThemeKey;
  stickers?: RandomSticker[];
}

const Layout1: React.FC<Layout1Props> = ({ image1, image2, caption1, caption2, theme, stickers = [] }) => {
  const t = themes[theme];

  return (
    <div className={`relative w-full h-full ${t?.bgColor} ${t?.pattern} p-8`}>
      <div className="grid grid-cols-2 gap-6 h-full">
        <div className="flex flex-col">
          <div className="relative flex-1 rounded-lg overflow-hidden bg-white/70 shadow">
            {image1 ? (
              <img src={image1} alt="scrap-1" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
            )}
          </div>
          <div className={`mt-3 text-sm ${t?.textColor} italic`}>{caption1}</div>
        </div>
        <div className="flex flex-col">
          <div className="relative flex-1 rounded-lg overflow-hidden bg-white/70 shadow">
            {image2 ? (
              <img src={image2} alt="scrap-2" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
            )}
          </div>
          <div className={`mt-3 text-sm ${t?.textColor} italic`}>{caption2}</div>
        </div>
      </div>

      {stickers.map((sticker, i) => (
        <img key={i} src={sticker.src} alt="" style={sticker.style} />
      ))}
    </div>
  );
};

export default Layout1;


