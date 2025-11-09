import React, { useMemo, useRef, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { themes, type ThemeKey, getRandomStickers, type RandomSticker, type DecorIntensity } from '@/utils/themes';
import Layout1 from '@/scrapbookTemplates/Layout1';
import Layout2 from '@/scrapbookTemplates/Layout2';
import Layout3 from '@/scrapbookTemplates/Layout3';
import Layout4 from '@/scrapbookTemplates/Layout4';
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
import './ScrapbookBackgrounds.css';
import { useAuth } from '@/contexts/AuthContext';
import { saveScrapbookForUser } from '@/lib/scrapbookUtils';
import { useEffect } from 'react';
import { apiClient } from '@/integration/api/client';

type SlideSpec = {
  layout: number; // number of images expected on this page
  images: string[];
  stickers: RandomSticker[];
};

const MAX_IMAGES = 12;

const Scrapbook: React.FC = () => {
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('beach');
  const [title, setTitle] = useState<string>('My Travel Memories');
  const [images, setImages] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const [pageStickers, setPageStickers] = useState<Record<number, RandomSticker[]>>({});
  const [decorIntensity, setDecorIntensity] = useState<DecorIntensity>('decorative');
  const containerRef = useRef<HTMLDivElement>(null);
  const draftKey = user ? `scrapbook_draft_${user.id}` : null;

  const slides: SlideSpec[] = useMemo(() => {
    const result: SlideSpec[] = [];
    let idx = 0;
    let pageIndex = 0;
    const cycle = [2, 3, 4, 3]; // L1, L2, L3, L4
    while (idx < images.length) {
      const take = cycle[pageIndex % cycle.length];
      const imgs = images.slice(idx, idx + take);
      const stickers = pageStickers[pageIndex] || [];
      result.push({ layout: take, images: imgs, stickers });
      idx += take;
      pageIndex += 1;
    }
    return result;
  }, [images, pageStickers]);

  const compressDataUrl = (dataUrl: string, maxDim = 1400, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        const targetW = Math.max(1, Math.round(width * scale));
        const targetH = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);
        ctx.drawImage(img, 0, 0, targetW, targetH);
        try {
          const out = canvas.toDataURL('image/jpeg', quality);
          resolve(out || dataUrl);
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Load draft on mount for the current user
  useEffect(() => {
    if (!user || !draftKey) return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.images)) setImages(data.images);
        if (Array.isArray(data.captions)) setCaptions(data.captions);
        if (data.theme) setSelectedTheme(data.theme);
        if (data.pageStickers) setPageStickers(data.pageStickers);
        if (typeof data.isEditing === 'boolean') setIsEditing(data.isEditing);
      }
    } catch {
      // ignore malformed drafts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Persist draft automatically when editing changes
  useEffect(() => {
    if (!user || !draftKey) return;
    const payload = JSON.stringify({
      captions, // keep captions only to reduce storage footprint
      theme: selectedTheme,
      isEditing,
      title,
    });
    try {
      localStorage.setItem(draftKey, payload);
    } catch {
      // ignore storage quota errors
    }
  }, [images, captions, selectedTheme, pageStickers, isEditing, draftKey, user]);

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
      const mod = pageIndex % 4;
      const take = mod === 0 ? 2 : mod === 1 ? 3 : mod === 2 ? 4 : 3;
      const imgs = images.slice(idx, idx + take);
      const base = getRandomStickers(selectedTheme, Math.min(3, imgs.length), decorIntensity);
      stickersByPage[pageIndex] = base;
      idx += take;
      pageIndex += 1;
    }
    setPageStickers(stickersByPage);
    setIsEditing(false);
    toast.success('Scrapbook created!');
    // Auto-save a thumbnail to profile as a draft preview
    setTimeout(async () => {
      if (!user || !containerRef.current) return;
      try {
        const canvas = await html2canvas(containerRef.current, { backgroundColor: null, scale: 1.25 });
        const dataUrl = canvas.toDataURL('image/png');
        const compressedImages = await Promise.all(images.map((i) => compressDataUrl(i)));
        const saved = saveScrapbookForUser(user.id, {
          title: title || 'My Travel Memories',
          theme: selectedTheme,
          pages: slides.length,
          previewDataUrl: dataUrl,
          images: compressedImages,
          captions,
        });
        if (saved) {
          window.dispatchEvent(new CustomEvent('scrapbook:saved', { detail: saved }));
        }
      } catch {
        // ignore preview failures
      }
    }, 0);
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

  const saveToProfile = async () => {
    if (!user) {
      toast.error('Please sign in to save to your profile.');
      return;
    }
    if (!containerRef.current) return;
    try {
      const canvas = await html2canvas(containerRef.current, { backgroundColor: null, scale: 1.5 });
      const dataUrl = canvas.toDataURL('image/png');
      const slidesCount = slides.length;
      const compressedImages = await Promise.all(images.map((i) => compressDataUrl(i)));
      // Persist to backend
      let remoteOk = false;
      try {
        const resp = await apiClient.createScrapbook({
          title: title || 'My Travel Memories',
          theme: selectedTheme,
          images: compressedImages,
          captions,
        });
        if (resp?.status === 'success') remoteOk = true;
      } catch (e) {
        console.error('Backend scrapbook save failed, will fallback to local storage.', e);
      }
      // Fallback local save for offline support and instant UI
      const saved = saveScrapbookForUser(user.id, {
        title: title || 'My Travel Memories',
        theme: selectedTheme,
        pages: slidesCount,
        previewDataUrl: dataUrl,
        images: compressedImages,
        captions,
      });
      if (remoteOk || saved) {
        toast.success('Saved to your profile!');
        window.dispatchEvent(new CustomEvent('scrapbook:saved', { detail: saved }));
      } else {
        toast.error('Failed to save scrapbook.');
      }
    } catch {
      toast.error('Failed to capture scrapbook.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-white bg-dots">
      <NavBar />
      <Toaster />
      <section className="pt-24 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Create Your <span className="text-orange-500">Scrapbook</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Upload photos, pick a theme, and flip through animated pages.
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
            {/* Upload + Theme */}
            <Card className="lg:col-span-1">
              <CardContent className="p-5 space-y-5">
                <div className="space-y-2">
                  <Label className="font-medium">Scrapbook Title</Label>
                  <Input
                    type="text"
                    placeholder="Enter a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

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

                {/* Decoration intensity */}
                <div className="space-y-2">
                  <Label className="font-medium">Background Style</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['minimal','decorative','bold'] as DecorIntensity[]).map(mode => (
                      <Button
                        key={mode}
                        variant={decorIntensity === mode ? 'default' : 'outline'}
                        onClick={() => setDecorIntensity(mode)}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button onClick={createScrapbook} className="w-full">
                        Create Scrapbook
                      </Button>
                      <Button variant="outline" className="w-full" onClick={saveToProfile} disabled={images.length === 0}>
                        Save to Profile
                      </Button>
                    </>
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
                      <Button variant="outline" className="w-full" onClick={saveToProfile}>
                        Save to Profile
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Preview (always visible on the right) */}
            <Card className="lg:col-span-2">
              <CardContent className="p-4">
                {slides.length > 0 ? (
                  <div ref={containerRef} className="w-full">
                    <Swiper
                      effect="creative"
                      creativeEffect={{
                        prev: { shadow: true, translate: ['-120%', 0, -500], rotate: [0, 0, -90] },
                        next: { shadow: true, translate: ['120%', 0, -500], rotate: [0, 0, 90] },
                      }}
                      grabCursor
                      modules={[EffectCreative, Pagination, Navigation]}
                      className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-lg"
                      pagination={{ clickable: true }}
                      navigation
                    >
                      {/* Cover */}
                      <SwiperSlide className="bg-white rounded-lg shadow-xl">
                        <div
                          className={`w-full h-full flex items-center justify-center ${themes[selectedTheme].bgColor} ${themes[selectedTheme].pattern}`}
                        >
                          <h2 className={`text-4xl ${themes[selectedTheme].textColor} font-display italic`}>
                            {title || 'My Travel Memories'}
                          </h2>
                        </div>
                      </SwiperSlide>

                      {/* Pages */}
                      {slides.map((slide, pageIndex) => {
                        const mod = pageIndex % 4;
                        const Layout = mod === 0 ? Layout1 : mod === 1 ? Layout2 : mod === 2 ? Layout3 : Layout4;
                        return (
                          <SwiperSlide key={pageIndex} className="bg-white rounded-lg shadow-xl">
                            <Layout
                              image1={slide.images[0]}
                              image2={slide.images[1]}
                              // @ts-expect-error layouts accept optional image3/image4
                              image3={slide.images[2]}
                              // @ts-expect-error layout3 accepts image4
                              image4={slide.images[3]}
                              theme={selectedTheme}
                              stickers={[...slide.stickers]}
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
                ) : (
                  <div className="w-full aspect-[4/3] rounded-xl bg-white grid place-items-center text-gray-400">
                    Add photos and click “Create Scrapbook” to see the preview.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Scrapbook;
