"use client";

export default function Loading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-xl border bg-white p-4 shadow"
        >
          <div className="h-48 rounded-lg bg-gray-200"></div>

          <div className="mt-4 h-5 w-3/4 rounded bg-gray-200"></div>

          <div className="mt-3 h-4 w-full rounded bg-gray-200"></div>

          <div className="mt-2 h-4 w-5/6 rounded bg-gray-200"></div>

          <div className="mt-6 h-10 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}
