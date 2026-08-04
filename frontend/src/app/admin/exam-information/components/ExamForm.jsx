"use client";

import { useState } from "react";
import { uploadExamImage } from "../data";

export default function ExamForm({
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    batch: initialData.batch || [],
    examName: initialData.examName || "",
    course: initialData.course || "",
    image: initialData.image || "",
    examDate: initialData.examDate ? initialData.examDate.split("T")[0] : "",
    examTime: initialData.examTime || "",
    duration: initialData.duration || "",
    venue: initialData.venue || "",
    description: initialData.description || "",
    status: initialData.status || "Upcoming",
  });

  const [uploading, setUploading] = useState(false);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.batch.length === 0) {
      return alert("Please select at least one batch.");
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Batch */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Batch</label>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {batches.map((batch) => (
            <label
              key={batch}
              className="flex items-center gap-2 rounded-lg border p-2"
            >
              <input
                type="checkbox"
                checked={formData.batch.includes(batch)}
                onChange={() => handleBatchChange(batch)}
              />

              <span>{batch}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Exam Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Exam Name</label>

        <input
          type="text"
          name="examName"
          value={formData.examName}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          placeholder="Enter Exam Name"
        />
      </div>

      {/* Course */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Course</label>

        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Select Course</option>

          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Image */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full rounded-lg border p-3"
        />

        {uploading && (
          <p className="mt-2 text-sm text-blue-600">Uploading...</p>
        )}

        {formData.image && (
          <img
            src={
              formData.image instanceof File
                ? URL.createObjectURL(formData.image)
                : formData.image
            }
            className="h-40 w-40 rounded-lg object-cover"
            alt="Preview"
          />
        )}
      </div>

      {/* Date + Time */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">Exam Date</label>

          <input
            type="date"
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Exam Time</label>

          <input
            type="text"
            name="examTime"
            value={formData.examTime}
            onChange={handleChange}
            placeholder="10:00 AM"
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      {/* Duration + Venue */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">Duration</label>

          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="3 Hours"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Venue</label>

          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Room No. 101"
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Description</label>

        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter Description"
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* Status */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Status</label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        >
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="reset"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading || uploading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading || uploading ? "Saving..." : "Save Exam"}
        </button>
      </div>
    </form>
  );
}
