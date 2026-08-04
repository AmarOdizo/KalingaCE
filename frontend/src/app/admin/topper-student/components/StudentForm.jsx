"use client";

import { useEffect, useState } from "react";
import { getImagePreview, calculatePercentage } from "../utils";
import ImageUpload from "./ImageUpload";
import { uploadImage } from "../data";

export default function StudentForm({ initialData = {}, onSubmit, loading }) {
  //
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [batch, setBatch] = useState("");
  const [totalMark, setTotalMark] = useState("");
  const [gainMark, setGainMark] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSubject(initialData.subject || "");
      setBatch(initialData.batch || "");
      setTotalMark(initialData.totalMark || "");
      setGainMark(initialData.gainMark || "");

      // Existing image
      setPreview(initialData.image || "");
    }
  }, [initialData]);

  const percentage =
    totalMark && gainMark ? calculatePercentage(gainMark, totalMark) : 0;

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(getImagePreview(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = preview;

    // Upload only if new image selected
    if (image) {
      const uploadResponse = await uploadImage(image);

      imageUrl = uploadResponse.data.url; // ✅
    }

    const formData = {
      name,
      subject,
      batch,
      totalMark,
      gainMark,
      image: imageUrl,
    };

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-8 shadow-lg"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Student Name */}
        <div>
          <label className="mb-2 block font-semibold">Student Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:border-blue-600"
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label className="mb-2 block font-semibold">Subject</label>

          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:border-blue-600"
            required
          />
        </div>

        {/* Batch */}
        <div>
          <label className="mb-2 block font-semibold">Batch</label>

          <input
            type="text"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:border-blue-600"
            required
          />
        </div>

        {/* Total Mark */}
        <div>
          <label className="mb-2 block font-semibold">Total Mark</label>

          <input
            type="number"
            value={totalMark}
            onChange={(e) => setTotalMark(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:border-blue-600"
            required
          />
        </div>

        {/* Gain Mark */}
        <div>
          <label className="mb-2 block font-semibold">Gain Mark</label>

          <input
            type="number"
            value={gainMark}
            onChange={(e) => setGainMark(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:border-blue-600"
            required
          />
        </div>

        {/* Percentage */}
        <div>
          <label className="mb-2 block font-semibold">Percentage</label>

          <input
            type="text"
            value={`${percentage}%`}
            readOnly
            className="w-full rounded-xl border bg-gray-100 p-3"
          />
        </div>
      </div>

      {/* Image */}
      <ImageUpload
        preview={preview}
        setPreview={setPreview}
        setImage={setImage}
      />

      {/* Button */}
      <button
        disabled={loading}
        className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Student"}
      </button>
    </form>
  );
}
