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
    <>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Course"}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image */}
        <ImageUpload preview={preview} onChange={handleImageChange} />

        {/* Basic Information */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">Course Name</label>

            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Course Code</label>

            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium">Short Description</label>

          <textarea
            rows={3}
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Full Description</label>

          {/* Course Details */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Duration</label>

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="12 Months"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Eligibility</label>

              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="10th Pass"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Fees</label>

              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Mode</label>

              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option>Offline</option>
                <option>Online</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">Certificate</label>

              <input
                type="text"
                name="certificate"
                value={formData.certificate}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Trainer</label>

              <input
                type="text"
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Rating</label>

              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Students</label>

              <input
                type="number"
                name="students"
                value={formData.students}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Batch Timing</label>

              <input
                type="text"
                name="batchTiming"
                value={formData.batchTiming}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="10:00 AM - 12:00 PM"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Seats</label>

              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option>Admission Open</option>
                <option>Closed</option>
                <option>Coming Soon</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-9">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5"
              />

              <label className="font-medium">Active</label>
            </div>
          </div>

          {/* Technologies */}
          <TechnologiesInput
            technologies={technologies}
            setTechnologies={setTechnologies}
          />

          {/* Features */}
          <FeaturesInput features={features} setFeatures={setFeatures} />

          {/* Syllabus */}
          <SyllabusInput syllabus={syllabus} setSyllabus={setSyllabus} />

          <textarea
            rows={5}
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>
      </form>
    </>
  );
}
