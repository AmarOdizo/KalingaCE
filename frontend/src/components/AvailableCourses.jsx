"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import {
  Code2,
  Globe,
  Database,
  Smartphone,
  Brain,
  ArrowRight,
} from "lucide-react";

const courses = [
  {
    title: "Full Stack Development",
    duration: "6 Months",
    students: "450+ Students",
    icon: Code2,
  },
  {
    title: "Frontend Development",
    duration: "3 Months",
    students: "350+ Students",
    icon: Globe,
  },
  {
    title: "Backend Development",
    duration: "4 Months",
    students: "280+ Students",
    icon: Database,
  },
  {
    title: "Android Development",
    duration: "5 Months",
    students: "210+ Students",
    icon: Smartphone,
  },
  {
    title: "Artificial Intelligence",
    duration: "8 Months",
    students: "170+ Students",
    icon: Brain,
  },
];

export default function AvailableCourses() {
  return (
    <section className="bg-gray-100 py-5 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-8">
        <h2 className="mb-10 text-center text-4xl font-bold text-gray-900 dark:text-white">
          📚 Available Courses
        </h2>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          spaceBetween={25}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {courses.map((course, index) => {
            const Icon = course.icon;

            return (
              <SwiperSlide key={index}>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>

                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    ⏳ {course.duration}
                  </p>

                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    👨‍🎓 {course.students}
                  </p>

                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
                    Enroll Now
                    <ArrowRight size={12} />
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
