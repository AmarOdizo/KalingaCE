"use client";

import { useEffect, useState, useMemo } from "react";
import { getNotes } from "./data";
import Loading from "./Loading";
import NoteCard from "./NoteCard";
import NoteModal from "./NoteModal";
import { Search, BookOpen, X, Sparkles } from "lucide-react";

export default function NotesClient() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [open, setOpen] = useState(false);
  
  // Search and Filter states
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  // ===========================
  // Fetch Notes
  // ===========================
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        // Only show Active notes
        const activeNotes = (data || []).filter((item) => item.status === "Active");
        setNotes(activeNotes);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // ===========================
  // Extract Unique Subjects dynamically
  // ===========================
  const subjects = useMemo(() => {
    const list = notes.map((n) => n.subjectName).filter(Boolean);
    return ["All", ...new Set(list)];
  }, [notes]);

  // ===========================
  // Filter Notes based on search & category selection
  // ===========================
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSubject =
        selectedSubject === "All" ||
        note.subjectName?.toLowerCase() === selectedSubject.toLowerCase();
      
      const query = search.toLowerCase();
      const matchesSearch =
        (note.noteTitle || "").toLowerCase().includes(query) ||
        (note.subjectName || "").toLowerCase().includes(query) ||
        (note.description || "").toLowerCase().includes(query) ||
        (note.uploadedBy || "").toLowerCase().includes(query);

      return matchesSubject && matchesSearch;
    });
  }, [notes, search, selectedSubject]);

  // ===========================
  // Open / Close Modal
  // ===========================
  const handleView = (note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedSubject("All");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="bg-slate-50/50 py-16 dark:bg-slate-950/40 min-h-screen relative overflow-hidden transition-colors duration-300">
      {/* Decorative Gradient Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none dark:bg-indigo-500/5"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl pointer-events-none dark:bg-purple-600/5"></div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 mb-4">
            <Sparkles size={12} className="text-blue-500" />
            Premium Resources
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            <span className="gradient-text">Study Notes & IT Library</span>
          </h1>
          <p className="mt-4 text-base text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Enhance your computer education journey with our curated syllabus guides, DCA/PGDCA semester resources, and programming references.
          </p>
        </div>

        {/* Search & Categories Box */}
        <div className="mb-10 p-6 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-premium flex flex-col md:flex-row gap-6 items-center justify-between">
          {/* Categories Pill Selector */}
          <div className="flex flex-wrap gap-2 items-center justify-start w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 border ${
                  selectedSubject === sub
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15"
                    : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                }`}
              >
                {sub === "All" ? "All Subjects" : sub}
              </button>
            ))}
          </div>

          {/* Search Box Input */}
          <div className="relative w-full md:max-w-md shrink-0">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by topic, subject or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-10 outline-none text-xs text-slate-705 dark:border-slate-800 dark:bg-slate-950 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all font-semibold"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Floating Indicator */}
        <div className="mb-6 flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
          <span>Found {filteredNotes.length} resources</span>
          {selectedSubject !== "All" && (
            <span>Filtered by: <span className="text-blue-600 dark:text-blue-400">{selectedSubject}</span></span>
          )}
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
            <div className="rounded-2xl bg-slate-100 p-4 text-slate-400 dark:bg-slate-900">
              <BookOpen size={36} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">No Notes Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              We couldn't find any resources matching your search queries or selected subject. Try clearing your filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-4.5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer shadow-sm active:scale-95"
            >
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteCard key={note._id || note.id} note={note} onView={handleView} />
            ))}
          </div>
        )}

        {/* Modal Detail view */}
        <NoteModal open={open} note={selectedNote} onClose={handleClose} />
      </div>
    </main>
  );
}
