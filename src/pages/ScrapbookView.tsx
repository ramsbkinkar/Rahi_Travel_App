import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { themes } from '@/utils/themes';
import Layout1 from '@/scrapbookTemplates/Layout1';
import Layout2 from '@/scrapbookTemplates/Layout2';
import { apiClient } from '@/integration/api/client';
import { withApiOrigin } from '@/utils/apiBase';

const ScrapbookView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const resp = await apiClient.getScrapbook(Number(id));
        if (resp.status === 'success' && resp.data) {
          setData(resp.data);
          return;
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const renderBook = () => {
    if (!data) return null;
    const themeKey = (data.theme as keyof typeof themes) || 'beach';
    const slides: Array<{ layout: 'two' | 'three'; images: string[]; captions: string[] }> = [];
    let idx = 0, pageIndex = 0;
    while (idx < data.images.length) {
      const layout: 'two' | 'three' = pageIndex % 2 === 0 ? 'two' : 'three';
      const take = layout === 'two' ? 2 : 3;
      slides.push({
        layout,
        images: data.images.slice(idx, idx + take).map((u: string) => (u.startsWith('http') ? u : (withApiOrigin(u) as string))),
        captions: (data.captions || []).slice(idx, idx + take),
      });
      idx += take;
      pageIndex += 1;
    }
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Swiper
          effect="creative"
          creativeEffect={{
            prev: { shadow: true, translate: ['-120%', 0, -500], rotate: [0, 0, -90] },
            next: { shadow: true, translate: ['120%', 0, -500], rotate: [0, 0, 90] },
          }}
          grabCursor
          modules={[EffectCreative, Pagination, Navigation]}
          className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white shadow"
          pagination={{ clickable: true }}
          navigation
        >
          <SwiperSlide className="bg-white rounded-lg shadow-xl">
            <div className={`w-full h-full flex items-center justify-center ${themes[themeKey].bgColor} ${themes[themeKey].pattern}`}>
              <h2 className={`text-3xl md:text-4xl ${themes[themeKey].textColor} font-display italic`}>
                {data.title}
              </h2>
            </div>
          </SwiperSlide>
          {slides.map((s, i) => {
            const Layout = s.layout === 'two' ? Layout1 : Layout2;
            return (
              <SwiperSlide key={i} className="bg-white rounded-lg shadow-xl">
                <Layout
                  image1={s.images[0]}
                  image2={s.images[1]}
                  // @ts-expect-error Layout2 image3
                  image3={s.layout === 'two' ? undefined : s.images[2]}
                  caption1={s.captions[0]}
                  // @ts-expect-error Layout1 caption2
                  caption2={s.layout === 'two' ? s.captions[1] : undefined}
                  // @ts-expect-error theme accepts ThemeKey
                  theme={themeKey}
                  stickers={[]}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <section className="pt-28 pb-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading scrapbook…</div>
          ) : (
            renderBook()
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ScrapbookView;


