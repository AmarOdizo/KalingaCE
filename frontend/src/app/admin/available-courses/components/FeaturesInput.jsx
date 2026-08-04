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
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="font-medium">Features</label>

        <button
          type="button"
          onClick={addFeature}
          className="rounded bg-blue-600 px-3 py-1 text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {features.map((item, index) => (
        <div key={index} className="mb-2 flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateFeature(index, e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Feature"
          />

          <button
            type="button"
            onClick={() => removeFeature(index)}
            className="rounded bg-red-500 p-2 text-white"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
