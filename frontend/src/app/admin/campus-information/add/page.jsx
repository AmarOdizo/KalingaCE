"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CampusForm from "../components/CampusForm";
import { createCampusInformation } from "../data";

export default function AddCampusPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createCampusInformation(formData);

      alert("Campus Information added successfully.");
      router.push("/admin/campus-information");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to create campus information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8 space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/campus-information"
          className="btn-secondary py-2 px-4 text-xs font-semibold self-start"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Add Campus</span>
          </h1>
          <p className="mt-1 text-sm text-slate-505 dark:text-slate-400">
            Fill in the details below to register a new campus.
          </p>
        </div>
      </div>

      {/* Form */}
      <CampusForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
