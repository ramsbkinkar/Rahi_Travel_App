import React from 'react';
import type { ThemeKey, RandomSticker } from '@/utils/themes';
import { themes } from '@/utils/themes';

interface Layout2Props {
  image1?: string;
  image2?: string;
  image3?: string;
  caption1?: string;
  theme: ThemeKey;
  stickers?: RandomSticker[];
}

const Layout2: React.FC<Layout2Props> = ({ image1, image2, image3, caption1, theme, stickers = [] }) => {
  const t = themes[theme];

  return (
    <div className={`relative w-full h-full ${t?.bgColor} ${t?.pattern} p-8`}>
      <div className="grid grid-cols-3 gap-4 h-full">
        <div className="relative rounded-lg overflow-hidden bg-white/70 shadow">
          {image1 ? (
            <img src={image1} alt="scrap-1" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
          )}
        </div>
        <div className="relative rounded-lg overflow-hidden bg-white/70 shadow">
          {image2 ? (
            <img src={image2} alt="scrap-2" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
          )}
        </div>
        <div className="relative rounded-lg overflow-hidden bg-white/70 shadow">
          {image3 ? (
            <img src={image3} alt="scrap-3" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
          )}
        </div>
      </div>

      <div className={`mt-4 text-sm ${t?.textColor} italic`}>{caption1}</div>

      {stickers.map((sticker, i) => (
        <img key={i} src={sticker.src} alt="" style={sticker.style} />
      ))}
    </div>
  );
};

export default Layout2;


