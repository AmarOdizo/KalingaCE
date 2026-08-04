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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Student Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Student Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="premium-input"
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Subject
          </label>

          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="premium-input"
            required
          />
        </div>

        {/* Batch */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Batch
          </label>

          <input
            type="text"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="premium-input"
            required
          />
        </div>

        {/* Total Mark */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Total Mark
          </label>

          <input
            type="number"
            value={totalMark}
            onChange={(e) => setTotalMark(e.target.value)}
            className="premium-input"
            required
          />
        </div>

        {/* Gain Mark */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Gain Mark
          </label>

          <input
            type="number"
            value={gainMark}
            onChange={(e) => setGainMark(e.target.value)}
            className="premium-input"
            required
          />
        </div>

        {/* Percentage */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Percentage
          </label>

          <input
            type="text"
            value={`${percentage}%`}
            readOnly
            className="premium-input bg-slate-50/50 text-slate-500 cursor-not-allowed dark:bg-slate-900/20 dark:text-slate-400"
          />
        </div>
      </div>

      {/* Image */}
      <div className="pt-2">
        <ImageUpload
          preview={preview}
          setPreview={setPreview}
          setImage={setImage}
        />
      </div>

      {/* Button */}
      <div className="pt-4 flex justify-end">
        <button
          disabled={loading}
          className="btn-primary py-3 px-8 shadow-md"
        >
          {loading ? "Saving..." : "Save Student"}
        </button>
      </div>
    </form>
  );
}
