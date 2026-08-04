"use client";

import { Plus, Trash2 } from "lucide-react";

export default function SyllabusInput({ syllabus, setSyllabus }) {
  const addSyllabus = () => {
    setSyllabus([...syllabus, ""]);
  };

  const updateSyllabus = (index, value) => {
    const data = [...syllabus];
    data[index] = value;
    setSyllabus(data);
  };

  const removeSyllabus = (index) => {
    setSyllabus(syllabus.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="font-medium">Syllabus</label>

        <button
          type="button"
          onClick={addSyllabus}
          className="rounded bg-blue-600 px-3 py-1 text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {syllabus.map((item, index) => (
        <div key={index} className="mb-2 flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateSyllabus(index, e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Syllabus"
          />

          <button
            type="button"
            onClick={() => removeSyllabus(index)}
            className="rounded bg-red-500 p-2 text-white"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
