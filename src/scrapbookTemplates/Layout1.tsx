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
    <div className={`relative w-full h-full ${t?.bgColor} ${t?.pattern} p-6 md:p-8`}>
      <div className="grid grid-cols-2 gap-4 md:gap-6 h-full">
        {/* Left polaroid */}
        <div className="flex flex-col">
          <div className="relative flex-1 bg-white rounded-xl shadow-xl p-2 rotate-[-1.5deg]">
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {image1 ? (
                <img src={image1} alt="scrap-1" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
              )}
            </div>
          </div>
          <div className="mt-2">
            <div className="bg-white rounded-lg shadow px-4 py-2">
              <div className={`text-sm ${t?.textColor} italic`}>{caption1 || 'Add your caption here...'}</div>
            </div>
          </div>
        </div>
        {/* Right polaroid */}
        <div className="flex flex-col">
          <div className="relative flex-1 bg-white rounded-xl shadow-xl p-2 rotate-[1.75deg]">
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {image2 ? (
                <img src={image2} alt="scrap-2" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
              )}
            </div>
          </div>
          <div className="mt-2">
            <div className="bg-white rounded-lg shadow px-4 py-2">
              <div className={`text-sm ${t?.textColor} italic`}>{caption2 || 'Add your caption here...'}</div>
            </div>
          </div>
        </div>
      </div>

      {stickers.map((sticker, i) => (
        <img
          key={i}
          src={sticker.src}
          alt=""
          style={sticker.style}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ))}
    </div>
  );
};

export default Layout1;


