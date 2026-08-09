"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CampusForm from "../../components/CampusForm";
import { getCampusInformation, updateCampusInformation } from "../../data";
import Loading from "../../components/Loading";

export default function EditCampusPage() {
  const { id } = useParams();
  const router = useRouter();

  const [campus, setCampus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // ===========================
  // Update Campus
  // ===========================
  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await updateCampusInformation(id, formData);

      alert("Campus information updated successfully.");
      router.push("/admin/campus-information");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update campus information.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
        <Loading />
      </div>
    );
  }

  if (!campus) {
    return (
      <div className="mx-auto max-w-md mt-12 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-premium">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Campus Information Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-405">
          We couldn&apos;t retrieve details for this campus ID.
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
            <span className="gradient-text">Edit Campus</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Modify details for <span className="font-semibold text-slate-700 dark:text-slate-200">{campus.campusName}</span>.
          </p>
        </div>
      </div>

      {/* Form */}
      <CampusForm
        initialData={campus}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
