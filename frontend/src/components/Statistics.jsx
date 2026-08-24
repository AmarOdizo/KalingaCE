"use client";

import { useEffect, useState, useMemo } from "react";
import { CalendarDays, GraduationCap, Users, Building2 } from "lucide-react";
import dynamic from "next/dynamic";



export default function Statistics() {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dark Mode detection observer
  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains("dark"));
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
        const url = isLocal
          ? "http://localhost:5000/api/CampusInformation"
          : "https://kalingace-4.onrender.com/api/CampusInformation";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch statistics");
        const json = await res.json();
        const dataList = json.data || [];
        setCampuses(dataList);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const activeCampuses = useMemo(() => {
    return campuses.filter((c) => c.status === "Active");
  }, [campuses]);

  const statsData = useMemo(() => {
    let earliestDate = null;
    let totalPassedOut = 0;
    let totalAvailable = 0;
    let totalFaculty = 0;

    activeCampuses.forEach((c) => {
      if (c.OpeningDate) {
        const d = new Date(c.OpeningDate);
        if (!isNaN(d.getTime())) {
          if (!earliestDate || d < earliestDate) {
            earliestDate = d;
          }
        }
      }

      const passed = Array.isArray(c.TotalPassedOutStudent)
        ? c.TotalPassedOutStudent[0]
        : c.TotalPassedOutStudent;
      totalPassedOut += Number(passed) || 0;

      const avail = Array.isArray(c.TotalAvailableStudent)
        ? c.TotalAvailableStudent[0]
        : c.TotalAvailableStudent;
      totalAvailable += Number(avail) || 0;

      const fac = Array.isArray(c.Totalfaculty)
        ? c.Totalfaculty[0]
        : c.Totalfaculty;
      totalFaculty += Number(fac) || 0;
    });

    const formattedDate = earliestDate
      ? earliestDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "15 Jan 2024";

    return {
      openingDate: formattedDate,
      totalPassedOut,
      totalAvailable,
      totalFaculty,
    };
  }, [activeCampuses]);

  const stats = [
    {
      title: "Opening Date",
      value: statsData.openingDate,
      desc: "Delivering educational excellence",
      icon: CalendarDays,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Total Passout Students",
      value: loading ? null : `${statsData.totalPassedOut.toLocaleString()}+`,
      desc: "Graduated alumni community",
      icon: GraduationCap,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Available Students",
      value: loading ? null : `${statsData.totalAvailable.toLocaleString()}+`,
      desc: "Active students enrolled",
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      title: "Total Faculty",
      value: loading ? null : `${statsData.totalFaculty.toLocaleString()}+`,
      desc: "Dedicated mentors & staff",
      icon: Building2,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section className="relative py-12 overflow-hidden bg-slate-50/60 dark:bg-slate-950/40 border-y border-slate-200/50 dark:border-slate-800/80 transition-colors duration-300">
      {/* Subtle Background Accent Blobs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Compact Header Title */}
        <div className="mx-auto max-w-2xl text-center mb-10 space-y-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200/30 dark:border-primary-800/30 uppercase tracking-widest">
            Kalinga at a glance
          </span>
          <h2 className="text-2xl font-extrabold sm:text-3xl tracking-tight text-slate-900 dark:text-white">
            Kalinga Computer Education
            <span className="gradient-text"> By The Numbers</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-505 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Dynamic metrics showcasing our academic environment, alumni
            achievements, and faculty structure.
          </p>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="premium-card group relative p-5 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/85 hover:border-primary-500/50 dark:hover:border-primary-500/40 rounded-2xl transition-all duration-350 hover:shadow-premium-hover hover:-translate-y-1"
              >
                {/* Thin Top border highlight (fades on hover) */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] rounded-b-full bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-350`}
                />

                <div className="flex items-center justify-between">
                  <div
                    className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-105`}
                  >
                    <Icon size={18} className={item.color} />
                  </div>

                  {/* Subtle dot */}
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-350 group-hover:bg-primary-500" />
                </div>

                <h3 className="mt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {item.title}
                </h3>

                {item.value === null ? (
                  <div className="h-7 w-20 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse mt-1" />
                ) : (
                  <p className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-sans">
                    {item.value}
                  </p>
                )}

                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 transition-all duration-300 leading-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
