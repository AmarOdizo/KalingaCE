"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSlider() {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    async function fetchPosters() {
      try {
        const res = await fetch("https://kalingace-4.onrender.com/api/Poster", {
          cache: "no-store",
        });
        if (res.ok) {
          const result = await res.json();
          // Filter to ensure only posters with valid image URL exist
          const activePosters =
            result.data?.map((p) => p.image).filter(Boolean) || [];
          setPosters(activePosters);
        }
      } catch (error) {
        console.error("Failed to fetch posters:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosters();

    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch or handle loading skeleton
  if (!mounted || loading) {
    return (
      <section className="py-6 md:py-10 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="w-full aspect-[16/9] md:aspect-[2.5/1] xl:aspect-[2.8/1] rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse flex items-center justify-center border border-slate-100 dark:border-slate-800/60 shadow-premium">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent dark:border-primary-400 dark:border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (posters.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-10 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50 group/section">
      <div className="mx-auto w-full max-w-7xl px-6 relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect={"fade"}
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop={posters.length > 1}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: ".hero-swiper-next",
            prevEl: ".hero-swiper-prev",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="overflow-hidden rounded-3xl shadow-premium border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900"
        >
          {posters.map((poster, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full aspect-[16/9] md:aspect-[2.5/1] xl:aspect-[2.8/1] overflow-hidden bg-slate-100 dark:bg-slate-950/20 select-none group">
                {/* Main Foreground Poster Image */}
                <img
                  src={poster}
                  alt={`Poster Slide ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out scale-100 group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay to give it a premium cinema feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-slate-950/5 to-transparent pointer-events-none z-10" />

                {/* Glowing decorative border overlay */}
                <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none z-20" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons (Visible on hover of the section) */}
        <button
          className="hero-swiper-prev absolute left-10 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-slate-850 dark:bg-slate-900/90 dark:text-slate-100 border border-slate-200/50 dark:border-slate-800/60 shadow-lg backdrop-blur-sm opacity-0 group-hover/section:opacity-100 translate-x-2 group-hover/section:translate-x-0 transition-all duration-300 hover:bg-white dark:hover:bg-slate-900 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          className="hero-swiper-next absolute right-10 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-slate-850 dark:bg-slate-900/90 dark:text-slate-100 border border-slate-200/50 dark:border-slate-800/60 shadow-lg backdrop-blur-sm opacity-0 group-hover/section:opacity-100 -translate-x-2 group-hover/section:translate-x-0 transition-all duration-300 hover:bg-white dark:hover:bg-slate-900 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Styled custom bullets */}
      <style>{`
        .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #cbd5e1 !important;
          opacity: 0.7 !important;
          transition: all 0.3s ease !important;
        }
        .dark .swiper-pagination-bullet {
          background: #475569 !important;
        }
        .swiper-pagination-bullet-active {
          width: 24px !important;
          border-radius: 4px !important;
          background: #2563eb !important;
          opacity: 1 !important;
        }
        .dark .swiper-pagination-bullet-active {
          background: #60a5fa !important;
        }
        .swiper-pagination {
          bottom: 16px !important;
        }
      `}</style>
    </section>
  );
}
