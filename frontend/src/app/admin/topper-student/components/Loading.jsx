"use client";

export default function Loading() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

        <p className="font-semibold text-gray-500">Loading Students...</p>
      </div>
    </div>
  );
}
