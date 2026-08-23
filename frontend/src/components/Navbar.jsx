"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sun, Moon, BookOpen, ChevronDown } from "lucide-react";

import Image from "next/image";

import { Menu, X, LogIn } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem("theme");

      const isDark =
        savedTheme === "dark" ||
        (!savedTheme &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.classList.toggle("dark", isDark);
      setDarkMode(isDark);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;

      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");

      return next;
    });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Left Section */}
        <Link href="/">
          <div className="flex items-center gap-3.5 group">
            <div className="h-11 w-11 overflow-hidden rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/klogo.png"
                alt="Logo"
                width={44}
                height={44}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <div>
              <h1 className="text-md font-extrabold tracking-tight text-slate-800 dark:text-white md:text-lg transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
                Kalinga Computer Education
              </h1>

              <p className="hidden text-[10px] font-medium tracking-wider text-slate-400 uppercase sm:block">
                Athagarh • Cuttack • 754029
              </p>
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/courses"
            className="font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors duration-200"
          >
            Courses
          </Link>

          <div className="relative group">
            <button className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors duration-200 cursor-pointer">
              Learning Hub
              <ChevronDown
                size={14}
                className="transition-transform duration-200 group-hover:rotate-180"
              />
            </button>

            <div className="invisible absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white/95 border border-slate-100 p-2 shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:bg-slate-900/95 dark:border-slate-800/80 backdrop-blur-md">
              <Link
                href="/learning/exam-information"
                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-400 transition-colors"
              >
                Exam
              </Link>

              <Link
                href="/learning/notes"
                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-400 transition-colors"
              >
                Notes
              </Link>
            </div>
          </div>
          <Link
            href="/contact"
            className="font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200 cursor-pointer"
          >
            {darkMode ? (
              <Sun className="text-amber-500" size={18} />
            ) : (
              <Moon className="text-slate-700 dark:text-white" size={18} />
            )}
          </button>

          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5.5 py-2.5 font-bold text-sm text-white hover:from-primary-700 hover:to-indigo-700 hover:shadow-glow-blue transition-all duration-300 active:scale-95"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden rounded-xl border border-slate-200/60 p-2.5 text-slate-600 dark:border-slate-800 dark:text-slate-300 cursor-pointer"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white/95 px-6 py-6 dark:border-slate-800 dark:bg-slate-950/95 backdrop-blur-md md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            <Link
              href="/courses"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Courses
            </Link>

            <div className="rounded-xl px-4 py-1">
              <button
                onClick={() => setLearningOpen(!learningOpen)}
                className="flex w-full items-center justify-between font-semibold text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2">
                  Learning Hub
                </div>

                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    learningOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {learningOpen && (
                <div className="mt-2 ml-4 flex flex-col gap-2 border-l border-slate-100 pl-3 dark:border-slate-800">
                  <Link
                    href="/learning/exam-information"
                    className="rounded-lg py-2 text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                    onClick={() => {
                      setMenuOpen(false);
                      setLearningOpen(false);
                    }}
                  >
                    Exam
                  </Link>

                  <Link
                    href="/learning/notes"
                    className="rounded-lg py-2 text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                    onClick={() => {
                      setMenuOpen(false);
                      setLearningOpen(false);
                    }}
                  >
                    Notes
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Contact Us
            </Link>

            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/50 px-4 py-2.5 font-semibold text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
            >
              {darkMode ? (
                <Sun className="text-amber-500" size={16} />
              ) : (
                <Moon size={16} />
              )}
              Change Theme
            </button>

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3 text-center font-bold text-white shadow-md"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
