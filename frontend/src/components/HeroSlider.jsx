"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const posters = [
  "/posters/poster1.jpg",
  "/posters/poster2.jpg",
  "/posters/poster3.jpg",
  "/posters/poster4.jpg",
  "/posters/poster5.jpg",
];

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="mt-16 md:mt-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-44 sm:h-60 md:h-80 lg:h-[450px] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-10 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          className="overflow-hidden rounded-3xl shadow-premium border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900"
        >
          {posters.map((poster, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-48 sm:h-64 md:h-96 lg:h-[480px] bg-slate-50 dark:bg-slate-900/40">
                <Image
                  src={poster}
                  alt={`Poster ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover transition-transform duration-700 hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
