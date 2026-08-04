"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getNote, updateNote } from "../../data";
import NoteForm from "../../notecomponents/NoteForm";
import LoadingSpinner from "../../notecomponents/LoadingSpinner";

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    subjectName: "",
    noteTitle: "",
    description: "",
    thumbnail: {
      url: "",
      fileId: "",
    },
    pdf: {
      url: "",
      fileId: "",
    },
    uploadedBy: "",
    status: "Active",
  });

  const loadNote = async () => {
    try {
      setLoading(true);
      const data = await getNote(params.id);

      setFormData({
        subjectName: data.subjectName || "",
        noteTitle: data.noteTitle || "",
        description: data.description || "",
        thumbnail: {
          url: data.thumbnail?.url || "",
          fileId: data.thumbnail?.fileId || "",
        },
        pdf: {
          url: data.pdf?.url || "",
          fileId: data.pdf?.fileId || "",
        },
        uploadedBy: data.uploadedBy || "",
        status: data.status || "Active",
      });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailUpload = (data) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: {
        url: data.url,
        fileId: data.fileId,
      },
    }));
  };

  const handlePdfUpload = (data) => {
    setFormData((prev) => ({
      ...prev,
      pdf: {
        url: data.url,
        fileId: data.fileId,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateNote(params.id, formData);
      alert("Note Updated Successfully");
      router.push("/admin/available-notes");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Edit Note
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Update existing note features and content uploads.
            </p>
          </div>

          <Link
            href="/admin/available-notes"
            className="btn-secondary py-2.5 px-4 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-premium dark:border-slate-800 dark:bg-slate-900/60">
          <NoteForm
            formData={formData}
            loading={saving}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleThumbnailUpload={handleThumbnailUpload}
            handlePdfUpload={handlePdfUpload}
          />
        </div>
      </div>
    </div>
  );
}
