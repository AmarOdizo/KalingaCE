"use client";

import { Plus, Trash2 } from "lucide-react";

export default function TechnologiesInput({ technologies, setTechnologies }) {
  const addTechnology = () => {
    setTechnologies([...technologies, ""]);
  };

  const updateTechnology = (index, value) => {
    const data = [...technologies];
    data[index] = value;
    setTechnologies(data);
  };

  const removeTechnology = (index) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="font-medium">Technologies</label>

        <button
          type="button"
          onClick={addTechnology}
          className="rounded bg-blue-600 px-3 py-1 text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {technologies.map((item, index) => (
        <div key={index} className="mb-2 flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateTechnology(index, e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Technology"
          />

          <button
            type="button"
            onClick={() => removeTechnology(index)}
            className="rounded bg-red-500 p-2 text-white"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
