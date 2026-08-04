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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Left */}
        <Link href="/">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-xl shadow-lg">
              <Image
                src="/klogo.png"
                alt="Logo"
                width={48}
                height={48}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-white md:text-xl">
                Kalinga Computer Education
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Athagarh • Cuttack • 754029
              </p>
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-10 md:flex">
          <Link
            href="/"
            className="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200"
          >
            Home
          </Link>

          <Link
            href="/contact"
            className="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200"
          >
            Contact
          </Link>

          <div className="relative group">
            <button className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200">
              <BookOpen size={18} />
              Learning Hub
              <ChevronDown size={16} />
            </button>

            <div className="invisible absolute left-0 top-full mt-2 w-56 rounded-xl bg-white shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:bg-gray-800">
              <Link
                href="/learning/exam-information"
                className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                📘 Exam Information
              </Link>

              <Link
                href="/learning/notes"
                className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                📝 Notes
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleTheme}
            className="rounded-full bg-gray-100 p-3 dark:bg-gray-800"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-700 dark:text-white" size={20} />
            )}
          </button>

          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? (
            <X size={28} className="dark:text-white" />
          ) : (
            <Menu size={28} className="dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t bg-white px-6 py-5 dark:border-gray-700 dark:bg-gray-900 md:hidden">
          <div className="flex flex-col gap-5">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>

            <div>
              <button
                onClick={() => setLearningOpen(!learningOpen)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  Learning Hub
                </div>

                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    learningOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {learningOpen && (
                <div className="mt-3 ml-6 flex flex-col gap-3">
                  <Link
                    href="/learning/exam-information"
                    onClick={() => {
                      setMenuOpen(false);
                      setLearningOpen(false);
                    }}
                  >
                    📘 Exam Information
                  </Link>

                  <Link
                    href="/learning/notes"
                    onClick={() => {
                      setMenuOpen(false);
                      setLearningOpen(false);
                    }}
                  >
                    📝 Notes
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              Change Theme
            </button>

            <Link
              href="/login"
              className="rounded-lg bg-blue-600 py-3 text-center font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
