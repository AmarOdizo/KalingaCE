"use client";

import { useEffect, useState } from "react";
import { uploadExamImage } from "../data";
import ImageUpload from "./ImageUpload";

const validateDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return true;
  try {
    const selectedDate = new Date(dateStr);
    const [hours, minutes] = timeStr.split(":").map(Number);
    const selectedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes,
      0
    );
    return selectedDateTime.getTime() >= (Date.now() - 60000);
  } catch (e) {
    return false;
  }
};

export default function ExamForm({
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const isEdit = !!(initialData && Object.keys(initialData).length > 0);
  const [formData, setFormData] = useState({
    batch: "",
    examName: "",
    mode: "Offline",
    image: "",
    examDate: "",
    examTime: "",
    duration: "",
    venue: "",
  });

  const [uploading, setUploading] = useState(false);
  const [dateTimeError, setDateTimeError] = useState("");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const timer = setTimeout(() => {
        setFormData({
          batch: initialData.batch || "",
          examName: initialData.examName || "",
          mode:
            initialData.mode && initialData.mode.toLowerCase() === "online"
              ? "Online"
              : "Offline",
          image: initialData.image || "",
          examDate: initialData.examDate
            ? initialData.examDate.split("T")[0]
            : "",
          examTime: initialData.examTime || "",
          duration: initialData.duration || "",
          venue: initialData.venue || "",
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialData]);

  const batches = ["2022-23", "2023-24", "2024-25", "2025-26", "2026-27"];

  const courses = [
    "DCA",
    "PGDCA",
    "ADCA",
    "Tally",
    "C",
    "C++",
    "Java",
    "Python",
    "Web Development",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (updated.examDate && updated.examTime) {
        if (!validateDateTime(updated.examDate, updated.examTime)) {
          setDateTimeError("The selected date and time is in the past!");
        } else {
          setDateTimeError("");
        }
      }
      return updated;
    });
  };

  const handleBatchChange = (batch) => {
    setFormData((prev) => ({
      ...prev,
      batch: prev.batch.includes(batch)
        ? prev.batch.filter((b) => b !== batch)
        : [...prev.batch, batch],
    }));
  };

  const handleFileSelect = async (file) => {
    try {
      setUploading(true);
      const res = await uploadExamImage(file);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          image: res.data.url,
        }));
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const [submitAction, setSubmitAction] = useState("save"); // "save" or "mcq"

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.batch || !formData.batch.trim()) {
      return alert("Please enter target batch.");
    }
    if (formData.examDate && formData.examTime && !validateDateTime(formData.examDate, formData.examTime)) {
      alert("Error: Cannot save. The selected exam date and time is in the past. Please select a valid current or future date and time.");
      return;
    }
    onSubmit(formData, submitAction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Batch */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-350">
          Target Batch
        </label>
        <input
          type="text"
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          className="premium-input"
          placeholder="e.g. 2024-25"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Exam Name */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Exam Name
          </label>
          <input
            type="text"
            name="examName"
            value={formData.examName}
            onChange={handleChange}
            className="premium-input"
            placeholder="e.g. Term End Examination 2026"
            required
          />
        </div>

        {/* Exam Date */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Exam Date
          </label>
          <input
            type="date"
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
            className="premium-input"
            required
          />
        </div>

        {/* Exam Time */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Exam Time
          </label>
          <input
            type="time"
            name="examTime"
            value={formData.examTime}
            onChange={handleChange}
            className="premium-input cursor-pointer"
            required
          />
          {dateTimeError && (
            <p className="mt-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 animate-pulse">
              ⚠️ {dateTimeError}
            </p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Duration
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="premium-input cursor-pointer"
            required
          >
            <option value="">Select Duration</option>
            <option value="5 Minutes">5 Minutes</option>
            <option value="10 Minutes">10 Minutes</option>
            <option value="20 Minutes">20 Minutes</option>
            <option value="30 Minutes">30 Minutes</option>
            <option value="45 Minutes">45 Minutes</option>
            <option value="1 Hour">1 Hour</option>
            <option value="1.5 Hours">1.5 Hours</option>
            <option value="2 Hours">2 Hours</option>
            <option value="2.5 Hours">2.5 Hours</option>
            <option value="3 Hours">3 Hours</option>
            <option value="3.5 Hours">3.5 Hours</option>
            <option value="4 Hours">4 Hours</option>
          </select>
        </div>

        {/* Venue */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Venue
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="e.g. Room No. 204, Block-A"
            className="premium-input"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Mode */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Exam Mode
          </label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="premium-input cursor-pointer"
            required
          >
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
          </select>
          {formData.mode === "Offline" && (
            <p className="mt-1.5 text-[11px] text-amber-605 dark:text-amber-500 font-bold leading-normal">
              Offline mode: Only institute students can take this exam at the
              institute venue.
            </p>
          )}
        </div>

        {/* Image Upload */}
        <ImageUpload
          preview={formData.image}
          uploading={uploading}
          onFileSelect={handleFileSelect}
          onRemove={handleRemoveImage}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {(formData.mode !== "Online" || isEdit) && (
          <button
            type="submit"
            onClick={() => setSubmitAction("save")}
            disabled={loading || uploading}
            className="btn-primary py-3 px-8 shadow-md"
          >
            {loading || uploading ? "Saving..." : "Save Exam"}
          </button>
        )}

        {formData.mode === "Online" && (
          <button
            type="submit"
            onClick={() => setSubmitAction("mcq")}
            disabled={loading || uploading}
            className="rounded-xl border border-indigo-200 bg-indigo-50/20 px-6 py-3 font-bold text-sm text-indigo-700 hover:bg-indigo-600 hover:text-white dark:border-indigo-900/40 dark:bg-indigo-950/10 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
          >
            Add & Save Question
          </button>
        )}
      </div>
    </form>
  );
}
