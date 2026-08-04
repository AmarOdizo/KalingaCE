"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, ExternalLink } from "lucide-react";

const INITIAL_POSTERS = [
  "/posters/poster1.jpg",
  "/posters/poster2.jpg",
  "/posters/poster3.jpg",
  "/posters/poster4.jpg",
  "/posters/poster5.jpg",
];

export default function PostersPage() {
  const [posters, setPosters] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("homepage_posters");
    if (saved) {
      try {
        setPosters(JSON.parse(saved));
      } catch (e) {
        setPosters(INITIAL_POSTERS);
      }
    } else {
      setPosters(INITIAL_POSTERS);
    }
  }, []);

  const savePosters = (list) => {
    setPosters(list);
    localStorage.setItem("homepage_posters", JSON.stringify(list));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setAdding(true);
    setTimeout(() => {
      const updated = [...posters, newUrl.trim()];
      savePosters(updated);
      setNewUrl("");
      setAdding(false);
    }, 600);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to remove this banner poster?")) {
      const updated = posters.filter((_, idx) => idx !== index);
      savePosters(updated);
    }
  };

  const loadDefaults = () => {
    if (window.confirm("Reset all poster images to defaults?")) {
      savePosters(INITIAL_POSTERS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Banner Posters
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Configure images to display in the homepage hero slider widget.
          </p>
        </div>
        <button
          onClick={loadDefaults}
          className="btn-secondary py-2.5 px-4 text-sm font-semibold"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left - Add Poster */}
        <div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium dark:border-slate-800 dark:bg-slate-900/60 sticky top-8">
            <h2 className="text-md font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus size={18} />
              Add Banner URL
            </h2>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Poster Image Link</label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://example.com/poster.jpg"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="premium-input pl-10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full btn-primary py-3.5 text-sm font-bold shadow-md cursor-pointer"
              >
                {adding ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Add to Slider"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right - Poster List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Active Slides ({posters.length})</h2>
          
          {posters.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <ImageIcon size={44} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-md font-bold text-slate-700 dark:text-slate-300">No posters configured</h3>
              <p className="text-sm text-slate-500 mt-1">Add custom banner images using the left panel.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {posters.map((poster, index) => (
                <div
                  key={index}
                  className="group premium-card p-4 flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 mb-4 shadow-sm">
                    <img
                      src={poster}
                      alt={`Banner Slide ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slide #{index + 1}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{poster}</p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <a
                        href={poster}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                        title="View Full Image"
                      >
                        <ExternalLink size={14} />
                      </a>
                      
                      <button
                        onClick={() => handleDelete(index)}
                        className="rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white cursor-pointer"
                        title="Remove Slide"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
