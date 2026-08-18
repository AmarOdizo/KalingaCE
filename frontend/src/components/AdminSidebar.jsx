"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Trophy,
  FileText,
  BookOpen,
  GraduationCap,
  LogOut,
  BookMarked,
  GalleryHorizontal,
  Menu,
  X,
  Contact,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menus = [
    {
      name: "Contact Us",
      icon: Contact,
      href: "/admin/contact",
    },
    {
      name: "Topper Student",
      icon: Trophy,
      href: "/admin/topper-student",
    },
    {
      name: "Exam Information",
      icon: FileText,
      href: "/admin/exam-information",
    },
    {
      name: "Exam Attempts",
      icon: Trophy,
      href: "/admin/exam-attempts",
    },
    {
      name: "Available Notes",
      icon: BookOpen,
      href: "/admin/available-notes",
    },
    {
      name: "Campus Information",
      icon: GraduationCap,
      href: "/admin/campus-information",
    },
    {
      name: "Available Courses",
      icon: BookMarked,
      href: "/admin/available-courses",
    },
    {
      name: "Posters",
      icon: GalleryHorizontal,
      href: "/admin/poster",
    },
    {
      name: "Enrolled Students",
      icon: Contact,
      href: "/admin/enrolled-student",
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="absolute top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 shadow-sm sm:hidden dark:border-slate-800/80 dark:bg-slate-900/95 backdrop-blur-md">
        <h2 className="text-md font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
          Admin Dashboard
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-slate-200/60 p-2 text-slate-600 dark:border-slate-800 dark:text-slate-300 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs sm:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-72 flex flex-col justify-between
          bg-white dark:bg-slate-900/90
          border-r border-slate-200/80 dark:border-slate-800/80
          shadow-lg backdrop-blur-md
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0
          sm:sticky sm:top-0
          sm:h-screen
          sm:w-56
          md:w-60
          lg:w-64
          xl:w-72
          2xl:w-80
        `}
      >
        <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
          {/* Logo / Title */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5.5 dark:border-slate-800/60 shrink-0">
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-500">
                Kalinga Computer
              </p>
            </div>

            <button
              className="sm:hidden text-slate-400 hover:text-slate-655"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu */}
          <div className="space-y-1.5 p-4 flex-1">
            {menus.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 font-semibold text-sm cursor-pointer
                    ${
                      active
                        ? "bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-500/15"
                        : "text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-primary-400"
                    }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <div className="border-t border-slate-100 p-4 dark:border-slate-800/60 shrink-0">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:from-rose-600 hover:to-red-600 transition-all duration-300 active:scale-98 cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
