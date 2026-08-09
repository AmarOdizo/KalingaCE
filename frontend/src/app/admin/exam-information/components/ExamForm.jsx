"use client";

import { useEffect, useState } from "react";
import { uploadExamImage } from "../data";
import ImageUpload from "./ImageUpload";

export default function ExamForm({
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    batch: [],
    examName: "",
    course: "",
    image: "",
    examDate: "",
    examTime: "",
    duration: "",
    venue: "",
    description: "",
    status: "Upcoming",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const timer = setTimeout(() => {
        setFormData({
          batch: initialData.batch || [],
          examName: initialData.examName || "",
          course: initialData.course || "",
          image: initialData.image || "",
          examDate: initialData.examDate
            ? initialData.examDate.split("T")[0]
            : "",
          examTime: initialData.examTime || "",
          duration: initialData.duration || "",
          venue: initialData.venue || "",
          description: initialData.description || "",
          status: initialData.status || "Upcoming",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.batch.length === 0) {
      return alert("Please select at least one batch.");
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Batch */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-350">
          Target Batch
        </label>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {batches.map((batch) => {
            const isSelected = formData.batch.includes(batch);
            return (
              <button
                type="button"
                key={batch}
                onClick={() => handleBatchChange(batch)}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 px-4 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-primary-500 bg-primary-50/10 text-primary-600 dark:border-primary-500 dark:bg-primary-500/10 dark:text-primary-400 shadow-sm"
                    : "border-slate-200 bg-white/50 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-405 dark:hover:bg-slate-800/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-primary-600"
                />
                <span>{batch}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Exam Name */}
        <div>
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

        {/* Course */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Course
          </label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="premium-input cursor-pointer"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
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
            type="text"
            name="examTime"
            value={formData.examTime}
            onChange={handleChange}
            placeholder="e.g. 10:00 AM"
            className="premium-input"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 3 Hours"
            className="premium-input"
            required
          />
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

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
          Exam Guidelines & Description
        </label>
        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter detailed guidelines, instructions, or notes for the exam..."
          className="premium-input"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="premium-input cursor-pointer"
            required
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
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
        <button
          type="button"
          onClick={() => {
            if (initialData && Object.keys(initialData).length > 0) {
              setFormData({
                batch: initialData.batch || [],
                examName: initialData.examName || "",
                course: initialData.course || "",
                image: initialData.image || "",
                examDate: initialData.examDate
                  ? initialData.examDate.split("T")[0]
                  : "",
                examTime: initialData.examTime || "",
                duration: initialData.duration || "",
                venue: initialData.venue || "",
                description: initialData.description || "",
                status: initialData.status || "Upcoming",
              });
            } else {
              setFormData({
                batch: [],
                examName: "",
                course: "",
                image: "",
                examDate: "",
                examTime: "",
                duration: "",
                venue: "",
                description: "",
                status: "Upcoming",
              });
            }
          }}
          className="btn-secondary py-3 px-6 text-sm"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading || uploading}
          className="btn-primary py-3 px-8 shadow-md"
        >
          {loading || uploading ? "Saving..." : "Save Exam"}
        </button>
      </div>
    </form>
  );
}
