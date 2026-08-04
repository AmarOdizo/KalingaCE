"use client";

import { getStatusColor } from "../utils";

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
        status,
      )}`}
    >
      {status}
    </span>
  );
}
