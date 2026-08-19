"use client";

import { Plus, Trash2 } from "lucide-react";

export default function FeaturesInput({ features, setFeatures }) {
  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const updateFeature = (index, value) => {
    const data = [...features];
    data[index] = value;
    setFeatures(data);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-extrabold text-slate-700 dark:text-slate-350">Features</label>

        <button
          type="button"
          onClick={addFeature}
          className="flex items-center justify-center rounded-xl bg-primary-600 p-2 text-white hover:bg-primary-700 active:scale-95 shadow-md shadow-primary-500/15 cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {features.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateFeature(index, e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:focus:border-primary-500 dark:focus:bg-slate-900"
              placeholder="e.g. 100% Placement Assistance"
            />

            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="flex items-center justify-center rounded-xl bg-rose-50 p-2.5 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white transition-all cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
