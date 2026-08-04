"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";
import FeaturesInput from "./FeaturesInput";
import TechnologiesInput from "./TechnologiesInput";
import SyllabusInput from "./SyllabusInput";

export default function CourseForm({
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(initialData.image || "");

  const [formData, setFormData] = useState({
    courseName: initialData.courseName || "",
    courseCode: initialData.courseCode || "",
    shortDescription: initialData.shortDescription || "",
    fullDescription: initialData.fullDescription || "",
    duration: initialData.duration || "",
    eligibility: initialData.eligibility || "",
    fees: initialData.fees || "",
    mode: initialData.mode || "Offline",
    certificate: initialData.certificate || "Institute Certificate",
    trainer: initialData.trainer || "",
    rating: initialData.rating || "",
    students: initialData.students || "",
    batchTiming: initialData.batchTiming || "",
    seats: initialData.seats || "",
    status: initialData.status || "Admission Open",
    isActive: initialData.isActive ?? true,
  });

  const [technologies, setTechnologies] = useState(
    initialData.technologies || [""],
  );

  const [features, setFeatures] = useState(initialData.features || [""]);

  const [syllabus, setSyllabus] = useState(initialData.syllabus || [""]);

  // Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  // Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit (Phase 5.3)
  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    if (image) {
      data.append("image", image);
    }

    data.append("courseName", formData.courseName);
    data.append("courseCode", formData.courseCode);
    data.append("shortDescription", formData.shortDescription);
    data.append("fullDescription", formData.fullDescription);
    data.append("duration", formData.duration);
    data.append("eligibility", formData.eligibility);
    data.append("fees", formData.fees);
    data.append("mode", formData.mode);
    data.append("certificate", formData.certificate);
    data.append("trainer", formData.trainer);
    data.append("rating", formData.rating);
    data.append("students", formData.students);
    data.append("batchTiming", formData.batchTiming);
    data.append("seats", formData.seats);
    data.append("status", formData.status);
    data.append("isActive", formData.isActive);

    data.append(
      "technologies",
      JSON.stringify(technologies.filter((item) => item.trim() !== "")),
    );

    data.append(
      "features",
      JSON.stringify(features.filter((item) => item.trim() !== "")),
    );

    data.append(
      "syllabus",
      JSON.stringify(syllabus.filter((item) => item.trim() !== "")),
    );

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header action button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary min-w-[150px] cursor-pointer"
        >
          {loading ? "Saving..." : "Save Course"}
        </button>
      </div>

      {/* Image Upload Area */}
      <div className="space-y-2">
        <ImageUpload preview={preview} onChange={handleImageChange} />
      </div>

      {/* Basic Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Course Name</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            className="premium-input"
            placeholder="e.g. Full Stack Web Development"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Course Code</label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            className="premium-input"
            placeholder="e.g. FS-101"
            required
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Short Description</label>
          <textarea
            rows={2}
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="premium-input"
            placeholder="Provide a concise 1-2 sentence description of the course..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Full Description</label>
          <textarea
            rows={5}
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            className="premium-input"
            placeholder="Provide details about what students will learn, course objectives, and outcomes..."
          />
        </div>
      </div>

      {/* Course Details / Grid of Parameters */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white border-l-4 border-primary-500 pl-3">
          Course Parameters
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="premium-input"
              placeholder="e.g. 12 Months"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Eligibility</label>
            <input
              type="text"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              className="premium-input"
              placeholder="e.g. 10th Pass / Graduate"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Fees (₹)</label>
            <input
              type="number"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              className="premium-input"
              placeholder="e.g. 15000"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Mode</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="premium-input"
            >
              <option value="Offline" className="dark:bg-slate-900 dark:text-white">Offline</option>
              <option value="Online" className="dark:bg-slate-900 dark:text-white">Online</option>
              <option value="Hybrid" className="dark:bg-slate-900 dark:text-white">Hybrid</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Certificate</label>
            <input
              type="text"
              name="certificate"
              value={formData.certificate}
              onChange={handleChange}
              className="premium-input"
              placeholder="e.g. Institute Certificate"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Trainer</label>
            <input
              type="text"
              name="trainer"
              value={formData.trainer}
              onChange={handleChange}
              className="premium-input"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Rating (0 - 5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="premium-input"
              placeholder="e.g. 4.5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Students Count</label>
            <input
              type="number"
              name="students"
              value={formData.students}
              onChange={handleChange}
              className="premium-input"
              placeholder="e.g. 250"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Batch Timing</label>
            <input
              type="text"
              name="batchTiming"
              value={formData.batchTiming}
              onChange={handleChange}
              className="premium-input"
              placeholder="e.g. 10:00 AM - 12:00 PM"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Seats Available</label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              className="premium-input"
              placeholder="e.g. 30"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="premium-input"
            >
              <option value="Admission Open" className="dark:bg-slate-900 dark:text-white">Admission Open</option>
              <option value="Closed" className="dark:bg-slate-900 dark:text-white">Closed</option>
              <option value="Coming Soon" className="dark:bg-slate-900 dark:text-white">Coming Soon</option>
            </select>
          </div>

          <div className="flex items-center gap-3 h-[78px] pt-7">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700 dark:text-slate-350 cursor-pointer select-none">
              Active / Visible to public
            </label>
          </div>
        </div>
      </div>

      {/* Dynamic Sub-inputs */}
      <div className="grid gap-6 md:grid-cols-3 border-t border-slate-100 dark:border-slate-800/40 pt-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <TechnologiesInput
            technologies={technologies}
            setTechnologies={setTechnologies}
          />
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <FeaturesInput features={features} setFeatures={setFeatures} />
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <SyllabusInput syllabus={syllabus} setSyllabus={setSyllabus} />
        </div>
      </div>
    </form>
  );
}
