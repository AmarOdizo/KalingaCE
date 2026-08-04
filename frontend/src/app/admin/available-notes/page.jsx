"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getNotes, deleteNote } from "./data";

import NoteTable from "./notecomponents/NoteTable";
import SearchFilter from "./notecomponents/SearchFilter";
import LoadingSpinner from "./notecomponents/LoadingSpinner";
import EmptyState from "./notecomponents/EmptyState";

export default function AvailableNotesPage() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ==============================
  // Load Notes
  // ==============================
  const loadNotes = async () => {
    try {
      setLoading(true);

      const data = await getNotes();

      setNotes(data || []);
      setFilteredNotes(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // ==============================
  // Search
  // ==============================
  useEffect(() => {
    if (!search.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const value = search.toLowerCase();

    const filtered = notes.filter(
      (note) =>
        note.subjectName?.toLowerCase().includes(value) ||
        note.noteTitle?.toLowerCase().includes(value),
    );

    setFilteredNotes(filtered);
  }, [search, notes]);

  // ==============================
  // Delete
  // ==============================
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

  // ==============================
  // Loading
  // ==============================
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                Available Notes
              </h1>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                Manage all study notes
              </p>
            </div>

            <Link
              href="/admin/available-notes/add"
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg sm:w-auto"
            >
              + Add Note
            </Link>
          </div>
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
    </div>
  );
}
