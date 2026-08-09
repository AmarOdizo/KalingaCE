"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PosterForm from "../components/PosterForm";

export default function AddPosterPage() {
  return (
    <div className="mx-auto max-w-7xl p-6 md:p-8 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Add Poster</span>
          </h1>

          <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
            Upload a new poster to be displayed on the website.
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

      {/* Form */}
      <div className="mt-6">
        <PosterForm />
      </div>
    </div>
  );
}
