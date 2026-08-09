"use client";

import { useState } from "react";
import { Upload, Save, ArrowLeft } from "lucide-react";
import { uploadPoster, createPoster, updatePoster } from "../data";
import { useRouter } from "next/navigation";

export default function PosterForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [image, setImage] = useState(initialData?.image || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================
  // Image Select
  // ==========================
  const handleImage = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setImage(URL.createObjectURL(selected));
  };

  // ==========================
  // Submit
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image && !file) {
      alert("Please select poster image");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = initialData?.image || "";

      // Upload New Image
      if (file) {
        imageUrl = await uploadPoster(file);
      }

      const payload = {
        image: imageUrl,
      };

      if (isEdit) {
        await updatePoster(initialData.id, payload);
      } else {
        await createPoster(payload);
      }

      alert(
        isEdit ? "Poster Updated Successfully" : "Poster Added Successfully",
      );

      router.push("/admin/poster");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        {isEdit ? "Edit Poster" : "Add Poster"}
      </h2>

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
          Poster Image
        </label>

        <label
          htmlFor="image"
          className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-primary-500 dark:border-slate-800 dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:hover:border-primary-500 transition-all duration-300 relative group overflow-hidden"
        >
          {image ? (
            <div className="relative h-full w-full p-2 flex items-center justify-center">
              <img
                src={image}
                alt="Poster"
                className="h-full w-full rounded-xl object-contain"
              />
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 rounded-2xl">
                <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-md">
                  Change Image
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4 rounded-2xl bg-primary-50 p-4 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">
                <Upload size={32} />
              </div>

              <p className="font-semibold text-slate-700 dark:text-slate-200">
                Click to Upload Poster
              </p>
              <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                Supports PNG, JPG, JPEG, WEBP (Max 5MB)
              </p>
            </div>
          )}
        </label>

        <input
          id="image"
          type="file"
          accept="image/*"
          hidden
          onChange={handleImage}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary flex-1 sm:flex-initial py-3 text-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 sm:flex-initial py-3 text-sm cursor-pointer disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "Saving..." : isEdit ? "Update Poster" : "Save Poster"}
        </button>
      </div>
    </form>
  );
}
