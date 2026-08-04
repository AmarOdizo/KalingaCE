"use client";

import Image from "next/image";
import { Camera, UploadCloud, X } from "lucide-react";

export default function ImageUpload({ preview, setPreview, setImage }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const imageURL = URL.createObjectURL(file);

    setPreview(imageURL);
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Student Image
      </label>

      <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-blue-500 hover:bg-blue-50">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="studentImage"
        />

        {!preview ? (
          <label
            htmlFor="studentImage"
            className="flex cursor-pointer flex-col items-center justify-center gap-3"
          >
            <UploadCloud size={45} className="text-blue-600" />

            <p className="font-semibold text-gray-700">Click to Upload Image</p>

            <p className="text-sm text-gray-500">JPG, PNG, JPEG</p>
          </label>
        ) : (
          <div className="relative mx-auto h-60 w-60">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="rounded-2xl border object-cover shadow"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute -right-2 -top-2 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-700"
            >
              <X size={18} />
            </button>

            <label
              htmlFor="studentImage"
              className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
            >
              <Camera size={18} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
