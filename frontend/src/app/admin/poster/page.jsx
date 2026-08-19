"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getPosters } from "./data";
import PosterTable from "./components/PosterTable";
import Loading from "./components/Loading";
import EmptyState from "./components/EmptyState";

export default function PosterPage() {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPosters();
      setPosters(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full p-6 md:p-8 transition-colors duration-300">
      <title>Poster Slides | Admin Panel</title>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Poster Management</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Upload, preview, and manage active banners and posters.
          </p>
        </div>

        <Link
          href="/admin/poster/add"
          className="btn-primary py-2.5 px-4 text-sm shrink-0 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Poster
        </Link>
      </div>

      {/* Content */}
      {posters.length === 0 ? (
        <EmptyState />
      ) : (
        <PosterTable posters={posters} refreshData={fetchData} />
      )}
    </div>
  );
}
