"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

  // ==========================
  // Load Note Data
  // ==========================
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

  // ==========================
  // Input Change
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // ==========================
  // Thumbnail Update
  // ==========================
  const handleThumbnailUpload = (data) => {
    setFormData((prev) => ({
      ...prev,

      thumbnail: {
        url: data.url,

        fileId: data.fileId,
      },
    }));
  };

  // ==========================
  // PDF Update
  // ==========================
  const handlePdfUpload = (data) => {
    setFormData((prev) => ({
      ...prev,

      pdf: {
        url: data.url,

        fileId: data.fileId,
      },
    }));
  };

  // ==========================
  // Update Submit
  // ==========================
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
    <div className="min-h-screen bg-gray-100 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
            Edit Note
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Update existing note details
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-6 lg:p-8">
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
