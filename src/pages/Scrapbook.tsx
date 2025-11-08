import React, { useMemo, useRef, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { themes, type ThemeKey, getRandomStickers, type RandomSticker } from '@/utils/themes';
import Layout1 from '@/scrapbookTemplates/Layout1';
import Layout2 from '@/scrapbookTemplates/Layout2';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Pagination, Navigation } from 'swiper/modules';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';
import { FaCamera, FaDownload, FaTrash, FaPalette, FaEdit } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Scrapbook.css';

type SlideSpec = {
  layout: 'two' | 'three';
  images: string[];
  captions: string[];
  stickers: RandomSticker[];
};

const MAX_IMAGES = 12;

const Scrapbook: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('beach');
  const [images, setImages] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const [pageStickers, setPageStickers] = useState<Record<number, RandomSticker[]>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const slides: SlideSpec[] = useMemo(() => {
    const result: SlideSpec[] = [];
    let idx = 0;
    let pageIndex = 0;
    while (idx < images.length) {
      const layout: 'two' | 'three' = pageIndex % 2 === 0 ? 'two' : 'three';
      const take = layout === 'two' ? 2 : 3;
      const imgs = images.slice(idx, idx + take);
      const caps = captions.slice(idx, idx + take);
      const stickers = pageStickers[pageIndex] || [];
      result.push({ layout, images: imgs, captions: caps, stickers });
      idx += take;
      pageIndex += 1;
    }
    return result;
  }, [images, captions, pageStickers]);

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`You can upload up to ${MAX_IMAGES} photos.`);
      return;
    }
    const toProcess = Array.from(files).slice(0, remaining);
    const readers = toProcess.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) resolve(e.target.result as string);
            else reject(new Error('Failed to read file'));
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers)
      .then((base64s) => {
        setImages((prev) => [...prev, ...base64s]);
        setCaptions((prev) => [...prev, ...base64s.map(() => '')]);
        toast.success(`Added ${base64s.length} photo(s)`);
      })
      .catch(() => toast.error('Failed to process images'));
  };

  const updateCaption = (index: number, value: string) => {
    setCaptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const clearAll = () => {
    setImages([]);
    setCaptions([]);
    setPageStickers({});
    setIsEditing(true);
  };

  const createScrapbook = () => {
    if (images.length === 0) {
      toast.error('Please upload at least one photo.');
      return;
    }
    // Pre-generate random stickers for each page
    const stickersByPage: Record<number, RandomSticker[]> = {};
    let pageIndex = 0;
    let idx = 0;
    while (idx < images.length) {
      const layoutIsTwo = pageIndex % 2 === 0;
      const take = layoutIsTwo ? 2 : 3;
      stickersByPage[pageIndex] = getRandomStickers(selectedTheme, layoutIsTwo ? 2 : 3);
      idx += take;
      pageIndex += 1;
    }
    setPageStickers(stickersByPage);
    setIsEditing(false);
    toast.success('Scrapbook created!');
  };

  const reEdit = () => {
    setIsEditing(true);
  };

  const downloadCurrent = async () => {
    if (!containerRef.current) return;
    try {
      const canvas = await html2canvas(containerRef.current, { backgroundColor: null, scale: 2 });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `scrapbook-${selectedTheme}.png`;
      link.click();
    } catch (e) {
      toast.error('Failed to generate image');
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <Toaster />
      <section className="pt-28 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Create Your <span className="text-orange-500">Scrapbook</span>
          </h1>

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Upload + Theme */}
            <Card className="lg:col-span-1">
              <CardContent className="p-5 space-y-5">
                <div className="space-y-2">
                  <Label className="font-medium">Upload Photos (max {MAX_IMAGES})</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCamera />
                    <span>{images.length} selected</span>
                    {images.length > 0 && (
                      <Button variant="ghost" className="text-red-600 ml-auto" onClick={clearAll}>
                        <FaTrash className="mr-2" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FaPalette />
                    <Label className="font-medium">Theme</Label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(Object.keys(themes) as ThemeKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTheme(key)}
                        className={`rounded-md border p-3 text-left transition ${
                          selectedTheme === key ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
                        } ${themes[key].bgColor}`}
                      >
                        <div className="text-sm font-medium">{themes[key].name}</div>
                        <div className={`text-xs ${themes[key].textColor} opacity-80`}>{key}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <Button onClick={createScrapbook} className="w-full">
                      Create Scrapbook
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" onClick={reEdit}>
                        <FaEdit className="mr-2" />
                        Re-edit
                      </Button>
                      <Button className="w-full" onClick={downloadCurrent}>
                        <FaDownload className="mr-2" />
                        Download PNG
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Captions */}
            <Card className="lg:col-span-2">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <img src={img} alt={`img-${i}`} className="w-24 h-24 object-cover rounded-md border" />
                      <div className="flex-1">
                        <Label className="text-sm">Caption</Label>
                        <Input
                          value={captions[i] || ''}
                          placeholder="Write a caption..."
                          onChange={(e) => updateCaption(i, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {images.length === 0 && (
                  <div className="text-gray-500 text-sm">No images yet. Upload to begin.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          {!isEditing && slides.length > 0 && (
            <div ref={containerRef} className="w-full">
              <Swiper
                effect="creative"
                creativeEffect={{
                  prev: { shadow: true, translate: ['-120%', 0, -500], rotate: [0, 0, -90] },
                  next: { shadow: true, translate: ['120%', 0, -500], rotate: [0, 0, 90] },
                }}
                grabCursor
                modules={[EffectCreative, Pagination, Navigation]}
                className="w-full aspect-[3/2] rounded-lg overflow-hidden bg-white shadow"
                pagination={{ clickable: true }}
                navigation
              >
                {/* Cover */}
                <SwiperSlide className="bg-white rounded-lg shadow-xl">
                  <div
                    className={`w-full h-full flex items-center justify-center ${themes[selectedTheme].bgColor} ${themes[selectedTheme].pattern}`}
                  >
                    <h2 className={`text-4xl ${themes[selectedTheme].textColor} font-display italic`}>
                      My Travel Memories
                    </h2>
                  </div>
                </SwiperSlide>

                {/* Pages */}
                {slides.map((slide, pageIndex) => {
                  const isTwo = slide.layout === 'two';
                  const Layout = isTwo ? Layout1 : Layout2;
                  return (
                    <SwiperSlide key={pageIndex} className="bg-white rounded-lg shadow-xl">
                      <Layout
                        image1={slide.images[0]}
                        image2={slide.images[1]}
                        // @ts-expect-error Layout2 accepts image3 optionally
                        image3={isTwo ? undefined : slide.images[2]}
                        caption1={slide.captions[0]}
                        // @ts-expect-error Layout1 accepts caption2 optionally
                        caption2={isTwo ? slide.captions[1] : undefined}
                        theme={selectedTheme}
                        stickers={slide.stickers}
                      />
                    </SwiperSlide>
                  );
                })}

                {/* End slide */}
                <SwiperSlide className="bg-white rounded-lg shadow-xl">
                  <div
                    className={`w-full h-full flex items-center justify-center ${themes[selectedTheme].bgColor} ${themes[selectedTheme].pattern}`}
                  >
                    <h2 className={`text-3xl ${themes[selectedTheme].textColor} font-display italic`}>The End</h2>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Scrapbook;
