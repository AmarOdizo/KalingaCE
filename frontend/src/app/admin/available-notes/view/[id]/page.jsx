"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getNote } from "../../data";

import LoadingSpinner from "../../notecomponents/LoadingSpinner";
import NoteCard from "../../notecomponents/NoteCard";
import PDFViewer from "../../notecomponents/PDFViewer";

export default function ViewNotePage() {
  const params = useParams();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Load Note
  // ==========================
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
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Note Not Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                View Note
              </h1>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                Complete Note Information
              </p>
            </div>

            <button
              onClick={() => router.back()}
              className="w-full rounded-xl bg-gray-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 sm:w-auto"
            >
              ← Back
            </button>
          </div>
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
