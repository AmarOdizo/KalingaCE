"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createNote } from "../data";
import NoteForm from "../notecomponents/NoteForm";

export default function AddNotePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      await createNote(formData);

      alert("Note Added Successfully");

      router.push("/admin/available-notes");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Add New Note
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create a new study note.
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
          <NoteForm
            formData={formData}
            loading={loading}
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
