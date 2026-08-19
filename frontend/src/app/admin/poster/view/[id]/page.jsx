"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPoster } from "../../data";
import Loading from "../../components/Loading";

export default function ViewPosterPage() {
  const { id } = useParams();

  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoster() {
      try {
        const data = await getPoster(id);
        setPoster(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPoster();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!poster) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 transition-colors duration-300">
        <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
          Poster not found.
        </p>
        <Link href="/admin/poster" className="btn-secondary text-sm py-2 px-4">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-8 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Poster Details</span>
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View full details and preview of the poster.
          </p>
        </div>

        <Link
          href="/admin/poster"
          className="btn-secondary py-2.5 px-4 text-sm cursor-pointer shrink-0"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      {/* Grid Container */}
      <div className="grid gap-8 lg:grid-cols-12 rounded-3xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300 max-w-5xl mx-auto">
        {/* Image Column */}
        <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950 flex items-center justify-center p-2 min-h-[300px]">
          <img
            src={poster.image}
            alt="Poster Full Preview"
            className="max-h-[500px] w-full object-contain rounded-xl hover:scale-[1.01] transition-transform duration-300"
          />
        </div>

        {/* Details Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Poster ID
              </p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                #{poster.id}
              </h3>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Created At
              </p>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {new Date(poster.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </h3>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Last Updated
              </p>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {new Date(poster.updatedAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </h3>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex gap-3">
            <Link
              href={`/admin/poster/edit/${poster.id}`}
              className="btn-primary flex-1 py-3 text-sm text-center font-semibold"
            >
              Edit Poster
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
