"use client";

import { useEffect, useState, useMemo } from "react";
import { CalendarDays, GraduationCap, Users, Building2 } from "lucide-react";
import dynamic from "next/dynamic";

const AgCharts = dynamic(
  () => import("ag-charts-react").then((mod) => mod.AgCharts),
  { ssr: false }
);

export default function Statistics() {
  const [data, setData] = useState({
    openingDate: "15 Jan 2024",
    totalPassedOut: 0,
    totalAvailable: 0,
    totalFaculty: 0,
  });
  const [campusData, setCampusData] = useState([]);
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
        const res = await fetch("https://kalingace-4.onrender.com/api/CampusInformation");
        if (!res.ok) throw new Error("Failed to fetch statistics");
        const json = await res.json();
        const campuses = json.data || [];

        if (campuses.length > 0) {
          let earliestDate = null;
          let totalPassedOut = 0;
          let totalAvailable = 0;
          let totalFaculty = 0;

          const chartData = campuses.map((c) => {
            // Opening Date
            if (c.OpeningDate) {
              const d = new Date(c.OpeningDate);
              if (!isNaN(d.getTime())) {
                if (!earliestDate || d < earliestDate) {
                  earliestDate = d;
                }
              }
            }

            // Passed Out Students
            const passed = Array.isArray(c.TotalPassedOutStudent)
              ? c.TotalPassedOutStudent[0]
              : c.TotalPassedOutStudent;
            const numPassed = Number(passed) || 0;
            totalPassedOut += numPassed;

            // Available Students
            const avail = Array.isArray(c.TotalAvailableStudent)
              ? c.TotalAvailableStudent[0]
              : c.TotalAvailableStudent;
            const numAvail = Number(avail) || 0;
            totalAvailable += numAvail;

            // Faculty
            const fac = Array.isArray(c.Totalfaculty)
              ? c.Totalfaculty[0]
              : c.Totalfaculty;
            const numFac = Number(fac) || 0;
            totalFaculty += numFac;

            return {
              campusName: c.campusName || "Unknown",
              activeStudents: numAvail,
              passedOutStudents: numPassed,
              faculty: numFac,
            };
          });

          const formattedDate = earliestDate
            ? earliestDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "15 Jan 2024";

          setData({
            openingDate: formattedDate,
            totalPassedOut,
            totalAvailable,
            totalFaculty,
          });
          setCampusData(chartData);
        }
      } catch (err) {
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Opening Date",
      value: data.openingDate,
      desc: "Delivering educational excellence",
      icon: CalendarDays,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Total Passout Students",
      value: loading ? null : `${data.totalPassedOut.toLocaleString()}+`,
      desc: "Graduated alumni community",
      icon: GraduationCap,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Available Students",
      value: loading ? null : `${data.totalAvailable.toLocaleString()}+`,
      desc: "Active students enrolled",
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      title: "Total Faculty",
      value: loading ? null : `${data.totalFaculty.toLocaleString()}+`,
      desc: "Dedicated mentors & staff",
      icon: Building2,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  // AG Charts layout options
  const chartOptions = useMemo(() => {
    return {
      data: campusData,
      theme: isDark ? "ag-default-dark" : "ag-default",
      background: {
        fill: "transparent",
      },
      series: [
        {
          type: "bar",
          xKey: "campusName",
          yKey: "activeStudents",
          yName: "Active Students",
          fill: "#6366f1", // Indigo 500
          stroke: "#6366f1",
        },
        {
          type: "bar",
          xKey: "campusName",
          yKey: "passedOutStudents",
          yName: "Passed Out Students",
          fill: "#10b981", // Emerald 500
          stroke: "#10b981",
        },
        {
          type: "line",
          xKey: "campusName",
          yKey: "faculty",
          yName: "Faculty",
          stroke: "#f59e0b", // Amber 500
          marker: {
            fill: "#f59e0b",
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            fontFamily: "var(--font-sans), sans-serif",
          },
        },
        {
          type: "number",
          position: "left",
          label: {
            fontFamily: "var(--font-sans), sans-serif",
          },
          title: {
            text: "Number of People",
            fontFamily: "var(--font-sans), sans-serif",
          },
        },
      ],
      legend: {
        position: "bottom",
        item: {
          label: {
            fontFamily: "var(--font-sans), sans-serif",
          },
        },
      },
    };
  }, [campusData, isDark]);

  return (
    <section className="relative py-12 overflow-hidden bg-slate-50/60 dark:bg-slate-950/40 border-y border-slate-200/50 dark:border-slate-800/80 transition-colors duration-300">
      {/* Subtle Background Accent Blobs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Compact Header Title */}
        <div className="mx-auto max-w-2xl text-center mb-10 space-y-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200/30 dark:border-primary-800/30 uppercase tracking-widest">
            Kalinga at a glance
          </span>
          <h2 className="text-2xl font-extrabold sm:text-3xl tracking-tight text-slate-900 dark:text-white">
            Kalinga Computer Education
            <span className="gradient-text"> By The Numbers</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
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

        {/* AG Charts Container */}
        {campusData.length > 0 && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-premium dark:border-slate-800/85 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Campus Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual breakdown of active students, passout alumni, and faculty sizes across campus locations.
              </p>
            </div>
            {!mounted || loading ? (
              <div className="h-96 w-full flex items-center justify-center text-slate-400">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              </div>
            ) : (
              <div style={{ height: "400px", width: "100%" }}>
                <AgCharts options={chartOptions} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
