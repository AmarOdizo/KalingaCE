"use client";

export default function PDFViewer({ pdf }) {
  if (!pdf?.url) {
    return (
      <div className="flex min-h-[250px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="text-base font-medium text-gray-500 dark:text-gray-400">
          PDF Not Available
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          PDF Preview
        </h2>

        <a
          href={pdf.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
        >
          Open PDF
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="overflow-hidden rounded-b-none border-y border-gray-200 dark:border-gray-700">
        <iframe
          src={pdf.url}
          title="PDF Preview"
          className="h-[350px] w-full sm:h-[500px] lg:h-[700px]"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-center p-4 sm:justify-end sm:p-6">
        <a
          href={pdf.url}
          download
          className="w-full rounded-xl bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
