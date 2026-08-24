"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";

import { getNotes, deleteNote } from "./data";

import NoteTable from "./notecomponents/NoteTable";
import SearchFilter from "./notecomponents/SearchFilter";
import LoadingSpinner from "./notecomponents/LoadingSpinner";
import EmptyState from "./notecomponents/EmptyState";

export default function AvailableNotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotes();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredNotes = useMemo(() => {
    if (!search.trim()) {
      return notes;
    }

    const value = search.toLowerCase();
    return notes.filter(
      (note) =>
        note.subjectName?.toLowerCase().includes(value) ||
        note.noteTitle?.toLowerCase().includes(value),
    );
  }, [search, notes]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmDelete) return;

    try {
      await deleteNote(id);
      loadNotes();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!mounted || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 dark:bg-slate-950 transition-colors duration-300">
      <title>Manage Notes | Admin Panel</title>
      <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-850 dark:hover:text-blue-400 text-slate-600 dark:text-slate-350 cursor-pointer transition-all duration-200 shrink-0"
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Available Notes
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 font-semibold text-sm">
              Upload, remove, and manage student learning notes and study documents.
            </p>
          </div>
        </div>

        <Link
          href="/admin/available-notes/add"
          className="btn-primary py-3 px-6 shadow-md"
        >
          <Plus size={18} />
          Add Note
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchFilter search={search} setSearch={setSearch} />
      </div>

      {/* Content */}
      <div className="rounded-2xl">
        {filteredNotes.length === 0 ? (
          <EmptyState />
        ) : (
          <NoteTable notes={filteredNotes} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
