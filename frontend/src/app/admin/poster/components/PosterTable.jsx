"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../utils";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import { deletePoster } from "../data";

export default function PosterTable({ posters, refreshData }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deletePoster(selectedId);
      setOpenDelete(false);
      refreshData();
      alert("Poster deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/60 dark:divide-slate-800/50">
            <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Poster ID
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 bg-transparent">
              {posters.map((poster) => (
                <tr
                  key={poster.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                >
                  {/* Image */}
                  <td className="px-6 py-4">
                    <div className="h-12 w-20 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative transition-transform duration-300 hover:scale-[1.03]">
                      <img
                        src={poster.image}
                        alt="Poster"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Poster ID */}
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                    #{poster.id}
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-350 text-sm font-semibold">
                    {formatDate(poster.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/poster/view/${poster.id}`}
                        className="rounded-xl bg-sky-50 p-2 text-sky-650 dark:bg-sky-500/10 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-200 active:scale-95"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>

                      <Link
                        href={`/admin/poster/edit/${poster.id}`}
                        className="rounded-xl bg-amber-50 p-2 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-200 active:scale-95"
                        title="Edit Poster"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedId(poster.id);
                          setOpenDelete(true);
                        }}
                        className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                        title="Delete Poster"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={openDelete}
        loading={loading}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
