"use client";

import { useEffect, useState } from "react";

import { getNotes } from "./data";

import Loading from "./Loading";
import NoteCard from "./NoteCard";
import NoteModal from "./NoteModal";

export default function LearningNotePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedNote, setSelectedNote] = useState(null);
  const [open, setOpen] = useState(false);

  // ===========================
  // Fetch Notes
  // ===========================
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();

        // Sirf Active notes dikhana
        const activeNotes = data.filter((item) => item.status === "Active");

        setNotes(activeNotes);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // ===========================
  // Open Modal
  // ===========================
  const handleView = (note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  // ===========================
  // Close Modal
  // ===========================
  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="bg-gray-50 py-16 dark:bg-gray-950">
      <title>Learning Notes & Study Material | Kalinga Computer Education</title>
      <meta name="description" content="Download high-quality study/course materials, guides, notes, and resource PDFs for Kalinga computer courses." />
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold">📚 Learning Notes</h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Download high-quality study materials and PDFs.
          </p>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No Notes Available
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onView={handleView} />
            ))}
          </div>
        )}

        {/* Modal */}
        <NoteModal open={open} note={selectedNote} onClose={handleClose} />
      </div>
    </main>
  );
}
