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
    <div className={`relative w-full h-full ${t?.bgColor} ${t?.pattern} p-6 md:p-8 pb-10`}>
      {/* Creative mosaic: large left, two stacked on right */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 h-full">
        <div className="col-span-2">
          <div className="relative h-full bg-white rounded-xl shadow-xl p-3 md:p-4 rotate-[-1.25deg]">
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {image1 ? (
                <img src={image1} alt="scrap-1" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-4 md:gap-6">
          <div className="relative flex-1 bg-white rounded-xl shadow-xl p-3 md:p-4 rotate-[1.25deg]">
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {image2 ? (
                <img src={image2} alt="scrap-2" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
              )}
            </div>
          </div>
          <div className="relative flex-1 bg-white rounded-xl shadow-xl p-3 md:p-4 rotate-[-1.25deg]">
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {image3 ? (
                <img src={image3} alt="scrap-3" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400">Add photo</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="bg-white rounded-lg shadow px-4 py-2 inline-block">
          <div className={`text-sm ${t?.textColor} italic`}>{caption1 || 'Add your caption here...'}</div>
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

export default Layout2;


