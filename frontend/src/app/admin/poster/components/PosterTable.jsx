"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../utils";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import { deletePoster } from "../data";
import AdminAgGrid from "@/components/AdminAgGrid";

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

  const columnDefs = [
    {
      headerName: "Image",
      field: "image",
      width: 120,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <div className="h-12 w-20 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative transition-transform duration-300 hover:scale-[1.03]">
            <img
              src={params.value}
              alt="Poster"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ),
      sortable: false,
      filter: false,
    },
    {
      headerName: "Poster ID",
      field: "id",
      flex: 1,
      valueFormatter: (params) => `#${params.value}`,
      cellClass: "font-bold text-slate-800 dark:text-slate-100 flex items-center",
    },
    {
      headerName: "Created",
      field: "createdAt",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
      cellClass: "text-slate-650 dark:text-slate-305 text-sm font-semibold flex items-center",
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full gap-2">
          <Link
            href={`/admin/poster/view/${params.data.id}`}
            className="rounded-xl bg-sky-50 p-2 text-sky-655 dark:bg-sky-500/10 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-200 active:scale-95"
            title="View Details"
          >
            <Eye size={16} />
          </Link>

          <Link
            href={`/admin/poster/edit/${params.data.id}`}
            className="rounded-xl bg-amber-50 p-2 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-200 active:scale-95"
            title="Edit Poster"
          >
            <Pencil size={16} />
          </Link>

          <button
            onClick={() => {
              setSelectedId(params.data.id);
              setOpenDelete(true);
            }}
            className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
            title="Delete Poster"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: 150,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
        <AdminAgGrid
          rowData={posters}
          columnDefs={columnDefs}
          rowHeight={64}
        />
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
