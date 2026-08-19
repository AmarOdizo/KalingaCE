"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PosterForm from "../../components/PosterForm";
import { getPoster } from "../../data";
import Loading from "../../components/Loading";

export default function EditPosterPage() {
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
            <span className="gradient-text">Edit Poster</span>
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Update the poster image.
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

      <div className="mt-6">
        <PosterForm initialData={poster} isEdit={true} />
      </div>
    </div>
  );
}
