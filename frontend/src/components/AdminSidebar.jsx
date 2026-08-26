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
  LayoutDashboard
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
      name: "Available Notes",
      icon: BookOpen,
      href: "/admin/available-notes",
    },
    {
      name: "Branch Information",
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
      {/* Mobile Header Banner */}
      <div className="absolute top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 shadow-2xs sm:hidden dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-sm shadow-indigo-600/20">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-805 dark:text-white leading-none">
              Admin Portal
            </h2>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Kalinga CE
            </span>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850 transition duration-150"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Overlay Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs sm:hidden"
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-72 flex flex-col justify-between
          bg-white dark:bg-slate-900/95
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
          
          {/* Panel Brand Branding Header */}
          <div className="flex items-center justify-between border-b border-slate-100/60 px-6 py-6 dark:border-slate-800/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 p-2.5 text-indigo-650 dark:text-indigo-400 border border-indigo-100/20 dark:border-indigo-900/20 shadow-2xs">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  Admin Panel
                </h1>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-650 dark:text-indigo-400 mt-1">
                  Kalinga CE
                </p>
              </div>
            </div>

            <button
              className="sm:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Menus List Navigation Container */}
          <nav className="space-y-1 p-4 flex-1">
            {menus.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 font-bold text-xs cursor-pointer group
                    ${
                      active
                        ? "bg-indigo-50/70 text-indigo-655 dark:bg-indigo-950/40 dark:text-indigo-400 border-l-2 border-indigo-600 dark:border-indigo-500 rounded-l-none"
                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-655 hover:translate-x-1 dark:text-slate-350 dark:hover:bg-slate-850/50 dark:hover:text-indigo-400"
                    }`}
                >
                  <Icon size={16} className={`transition duration-200 ${
                    active ? "text-indigo-650 dark:text-indigo-400" : "text-slate-400 group-hover:text-indigo-650 dark:group-hover:text-indigo-400"
                  }`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Panel Footer Log out CTA */}
        <div className="border-t border-slate-100/60 p-4 dark:border-slate-800/60 shrink-0">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-3 text-xs font-black text-white shadow-sm hover:from-rose-600 hover:to-rose-700 transition-all duration-200 active:scale-97 cursor-pointer"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
