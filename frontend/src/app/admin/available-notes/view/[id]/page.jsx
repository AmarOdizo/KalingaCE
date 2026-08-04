"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getNote } from "../../data";

import LoadingSpinner from "../../notecomponents/LoadingSpinner";
import NoteCard from "../../notecomponents/NoteCard";
import PDFViewer from "../../notecomponents/PDFViewer";

export default function ViewNotePage() {
  const params = useParams();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadNote = async () => {
    try {
      setLoading(true);
      const data = await getNote(params.id);
      setNote(data);
    } catch (error) {
      console.log(error);
      alert(error.message);
      router.push("/admin/available-notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadNote();
    }
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!note) {
    return (
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-bold text-red-600">Note Not Found</h2>
          <button
            onClick={() => router.push("/admin/available-notes")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow hover:from-primary-700 hover:to-indigo-700 transition"
          >
            <ArrowLeft size={16} />
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              View Note
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Read uploaded PDF document and subject notes details.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="btn-secondary py-2.5 px-4 text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8">
          {/* Left */}
          <div>
            <NoteCard note={note} />
          </div>

          {/* Right */}
          <div>
            <PDFViewer pdf={note.pdf} />
          </div>
        </div>
      </div>
    </div>
  );
}
