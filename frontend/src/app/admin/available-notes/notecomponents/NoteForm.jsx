"use client";

import UploadThumbnail from "./UploadThumbnail";
import UploadPDF from "./UploadPDF";

export default function NoteForm({
  formData,
  loading,
  handleChange,
  handleSubmit,
  handleThumbnailUpload,
  handlePdfUpload,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 sm:p-6 lg:p-8"
    >
      {/* Form Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Subject Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Subject Name
          </label>

          <input
            type="text"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            placeholder="Enter Subject Name"
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-900"
          />
        </div>

        {/* Note Title */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Note Title
          </label>

          <input
            type="text"
            name="noteTitle"
            value={formData.noteTitle}
            onChange={handleChange}
            placeholder="Enter Note Title"
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-900"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Description
          </label>

          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-900"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Thumbnail
          </label>

          <UploadThumbnail
            value={formData.thumbnail}
            onUpload={handleThumbnailUpload}
          />
        </div>

        {/* PDF */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            PDF File
          </label>

          <UploadPDF value={formData.pdf} onUpload={handlePdfUpload} />
        </div>

        {/* Uploaded By */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Uploaded By
          </label>

          <input
            type="text"
            name="uploadedBy"
            value={formData.uploadedBy}
            onChange={handleChange}
            placeholder="Enter Uploaded By"
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-900"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Saving..." : "Save Note"}
        </button>
      </div>
    </form>
  );
}
