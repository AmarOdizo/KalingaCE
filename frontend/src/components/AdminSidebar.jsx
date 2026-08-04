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
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const menus = [
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
      href: "/admin/posters",
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow md:hidden dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-white" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed top-0 left-0 z-50
    h-screen w-72
    bg-white dark:bg-gray-900
    border-r border-gray-200 dark:border-gray-700
    shadow-xl
    transition-transform duration-300

    ${open ? "translate-x-0" : "-translate-x-full"}

    md:translate-x-0
    md:static
    md:w-64
  `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div>
            <h1 className="text-xl font-bold dark:text-white">Admin Panel</h1>

            <p className="text-xs text-gray-500">Kalinga Computer Education</p>
          </div>

          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 space-y-2 p-4 overflow-y-auto">
          {menus.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                      : "hover:bg-blue-50 dark:hover:bg-gray-800"
                  }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 font-semibold text-white"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
