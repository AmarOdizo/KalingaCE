"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Users,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function OurBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
        const url = isLocal
          ? "http://localhost:5000/api/CampusInformation"
          : "https://kalingace-4.onrender.com/api/CampusInformation";

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch branch details");
        const json = await res.json();
        const dataList = json.data || [];
        // Filter only Active branches
        const activeList = dataList.filter((b) => b.status === "Active");
        // Sort: Main branch first
        activeList.sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
        setBranches(activeList);
      } catch (err) {
        console.error("Error loading branches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const getStatValue = (val) => {
    if (Array.isArray(val)) {
      return val[0] || 0;
    }
    return Number(val) || 0;
  };

  if (loading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mx-auto mb-4"></div>
          <div className="h-10 w-64 bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse mx-auto mb-10"></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (branches.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300 border-t border-slate-200/50 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-5 relative z-10">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/20 dark:border-indigo-800/20 uppercase tracking-wider">
            Our Network
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight text-slate-900 dark:text-white">
            Our Educational <span className="gradient-text">Branches</span>
          </h2>
          <p className="text-sm text-slate-505 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Visit any of our active centers for premium technical computer education and certified training program advisement.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <div
              key={b._id}
              className={`premium-card group relative p-6 bg-white dark:bg-slate-900/60 border ${
                b.isMain
                  ? "border-indigo-500/50 dark:border-indigo-500/40 shadow-glow-blue"
                  : "border-slate-200/80 dark:border-slate-800/80"
              } rounded-3xl shadow-premium transition-all duration-350 hover:shadow-premium-hover hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              {/* Main Branch Highlight Ribbon */}
              {b.isMain && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md animate-pulse">
                  <Sparkles size={10} />
                  Main Branch
                </div>
              )}

              <div>
                {/* Branch Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`p-3 rounded-2xl ${
                    b.isMain 
                      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}>
                    <Building2 size={22} />
                  </div>
                  <div className="pr-20">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {b.campusName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{b.city}, {b.state}</p>
                  </div>
                </div>

                {/* Branch Details */}
                <div className="space-y-3.5 text-sm text-slate-505 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <div className="flex items-start gap-3 leading-relaxed">
                    <MapPin size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                    <span>{b.address}, {b.city}, {b.state} - {b.pincode}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-emerald-500 shrink-0" />
                    <a href={`tel:${b.phone}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                      {b.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-sky-500 shrink-0" />
                    <a href={`mailto:${b.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors break-all">
                      {b.email}
                    </a>
                  </div>

                  {b.OpratingHours && (
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-amber-500 shrink-0" />
                      <span>{b.OpratingHours}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Branch Stats Block */}
              <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4 grid grid-cols-3 gap-2 text-center bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Faculty
                  </span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {getStatValue(b.Totalfaculty)}
                  </span>
                </div>

                <div className="border-x border-slate-200/60 dark:border-slate-800/60">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Students
                  </span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {getStatValue(b.TotalAvailableStudent)}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Alumni
                  </span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {getStatValue(b.TotalPassedOutStudent)}+
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
