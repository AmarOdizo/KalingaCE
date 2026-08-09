"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  GraduationCap,
  Clock,
  Calendar,
  Pencil,
  ExternalLink,
} from "lucide-react";

import { getCampusInformation } from "../../data";
import Loading from "../../components/Loading";

export default function ViewCampusPage() {
  const { id } = useParams();
  const router = useRouter();

  const [campus, setCampus] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===========================
  // Fetch Campus Details
  // ===========================
  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const data = await getCampusInformation(id);
        setCampus(data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampus();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-4 sm:p-6 md:p-8">
        <Loading />
      </div>
    );
  }

  if (!campus) {
    return (
      <div className="mx-auto max-w-md mt-12 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-premium">
        <h2 className="text-2xl font-bold text-red-650 dark:text-red-400">Campus Not Found</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The campus information you are trying to view does not exist.
        </p>
        <Link
          href="/admin/campus-information"
          className="mt-6 btn-secondary inline-flex py-2.5 px-5 text-sm"
        >
          <ArrowLeft size={16} />
          Back to List
        </Link>
      </div>
    );
  }

  // Parse Stats
  const facultyCount = Array.isArray(campus.Totalfaculty)
    ? campus.Totalfaculty[0]
    : campus.Totalfaculty;
  const availableStudentCount = Array.isArray(campus.TotalAvailableStudent)
    ? campus.TotalAvailableStudent[0]
    : campus.TotalAvailableStudent;
  const passedOutStudentCount = Array.isArray(campus.TotalPassedOutStudent)
    ? campus.TotalPassedOutStudent[0]
    : campus.TotalPassedOutStudent;

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 md:p-8 space-y-6 transition-colors duration-300">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/campus-information"
          className="btn-secondary py-2 px-4 text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <Link
          href={`/admin/campus-information/edit/${campus._id}`}
          className="btn-primary py-2 px-4 text-xs font-semibold"
        >
          <Pencil size={14} />
          Edit Campus
        </Link>
      </div>

      {/* Main Banner Card */}
      <div className="premium-card border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 mb-3 ${
                campus.status === "Active"
                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                  : "bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {campus.status}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {campus.campusName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-slate-400" />
                {campus.city}, {campus.state}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} className="text-slate-400" />
                {campus.OpratingHours || "N/A Hours"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Faculty KPI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Faculty
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {facultyCount || 0}
            </h3>
          </div>
        </div>

        {/* Active Students KPI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Active Students
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {availableStudentCount || 0}
            </h3>
          </div>
        </div>

        {/* Passed Out Students KPI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Alumni / Passed Out
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {passedOutStudentCount || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Contact Channels
          </h2>

          <div className="space-y-4">
            <DetailItem
              icon={<Phone size={18} />}
              label="Phone Number"
              value={campus.phone}
              type="tel"
            />
            <DetailItem
              icon={<Mail size={18} />}
              label="Email Address"
              value={campus.email}
              type="email"
            />
            {Array.isArray(campus.website) && campus.website.length > 0 && (
              <div className="flex gap-4">
                <div className="text-primary-500 dark:text-primary-400 mt-1 shrink-0">
                  <Globe size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Website / Social Channels
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {campus.website.map((item, idx) => {
                      const cleaned = item.link ? item.link.trim() : "";
                      if (!cleaned) return null;
                      const href = cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
                      return (
                        <a
                          key={idx}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition"
                        >
                          <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500">
                            {item.type}:
                          </span>
                          {cleaned}
                          <ExternalLink size={10} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location & Operations Info Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Location & Operations
          </h2>

          <div className="space-y-4">
            <DetailItem
              icon={<MapPin size={18} />}
              label="Campus Address"
              value={`${campus.address}, ${campus.city}, ${campus.state} - ${campus.pincode}`}
            />
            <DetailItem
              icon={<Clock size={18} />}
              label="Operating Hours"
              value={campus.OpratingHours}
            />
            <DetailItem
              icon={<Calendar size={18} />}
              label="Establishment / Opening Date"
              value={
                campus.OpeningDate
                  ? new Date(campus.OpeningDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"
              }
            />
          </div>
        </div>
      </div>

      {/* Map Section */}
      {campus.mapLocation && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Map Directory
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-850 dark:text-slate-200 text-sm">
                  Google Maps Location Link
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-md">
                  {campus.mapLocation}
                </p>
              </div>
            </div>
            <a
              href={campus.mapLocation}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary py-2 px-4 text-xs font-semibold shrink-0"
            >
              Open Google Maps
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value, type, isUrl }) {
  if (!value) return null;

  return (
    <div className="flex gap-4">
      <div className="text-primary-500 dark:text-primary-400 mt-1 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {label}
        </h4>
        <div className="mt-1 text-slate-700 dark:text-slate-300 text-sm font-medium">
          {isUrl ? (
            <div className="flex flex-wrap gap-2">
              {value.split(",").map((urlStr, idx) => {
                const cleaned = urlStr.trim();
                const href = cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
                return (
                  <a
                    key={idx}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {cleaned}
                    <ExternalLink size={12} />
                  </a>
                );
              })}
            </div>
          ) : type === "tel" ? (
            <a href={`tel:${value}`} className="hover:underline">
              {value}
            </a>
          ) : type === "email" ? (
            <a href={`mailto:${value}`} className="hover:underline">
              {value}
            </a>
          ) : (
            <span className="whitespace-pre-line">{value}</span>
          )}
        </div>
      </div>
    </div>
  );
}
