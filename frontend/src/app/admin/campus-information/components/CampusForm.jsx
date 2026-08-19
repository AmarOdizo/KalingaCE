"use client";

import { useState, useEffect } from "react";
import { Info, MapPin, Calendar, Users } from "lucide-react";

const initialState = {
  campusName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  website: [],
  Totalfaculty: "",
  TotalAvailableStudent: "",
  TotalPassedOutStudent: "",
  OpeningDate: "",
  OpratingHours: "",
  mapLocation: "",
  status: "Active",
};

export default function CampusForm({
  initialData = null,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialState);
  const [socialType, setSocialType] = useState("Website");
  const [socialLink, setSocialLink] = useState("");

  const formatInitialDate = (dateVal) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().substring(0, 10);
    } catch (err) {
      return "";
    }
  };

  useEffect(() => {
    if (initialData) {
      const timer = setTimeout(() => {
        setFormData({
          campusName: initialData.campusName || "",
          address: initialData.address || "",
          city: initialData.city || "",
          state: initialData.state || "",
          pincode: initialData.pincode || "",
          phone: initialData.phone || "",
          email: initialData.email || "",
          website: Array.isArray(initialData.website)
            ? initialData.website
            : [],
          Totalfaculty: Array.isArray(initialData.Totalfaculty)
            ? initialData.Totalfaculty[0]
            : initialData.Totalfaculty || "",
          TotalAvailableStudent: Array.isArray(initialData.TotalAvailableStudent)
            ? initialData.TotalAvailableStudent[0]
            : initialData.TotalAvailableStudent || "",
          TotalPassedOutStudent: Array.isArray(initialData.TotalPassedOutStudent)
            ? initialData.TotalPassedOutStudent[0]
            : initialData.TotalPassedOutStudent || "",
          OpeningDate: formatInitialDate(initialData.OpeningDate),
          OpratingHours: initialData.OpratingHours || "",
          mapLocation: initialData.mapLocation || "",
          status: initialData.status || "Active",
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      website: formData.website || [],

      Totalfaculty:
        formData.Totalfaculty !== "" ? [Number(formData.Totalfaculty)] : [],
      TotalAvailableStudent:
        formData.TotalAvailableStudent !== ""
          ? [Number(formData.TotalAvailableStudent)]
          : [],
      TotalPassedOutStudent:
        formData.TotalPassedOutStudent !== ""
          ? [Number(formData.TotalPassedOutStudent)]
          : [],
    });
  };

  const addWebsiteLink = () => {
    if (!socialLink.trim()) return;

    setFormData((prev) => ({
      ...prev,
      website: [
        ...(prev.website || []),
        {
          type: socialType,
          link: socialLink,
        },
      ],
    }));

    setSocialLink("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-premium space-y-8"
    >
      {/* SECTION 1: General Info */}
      <div>
        <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 dark:border-slate-800/80">
          <Info size={18} className="text-primary-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Basic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Campus Name"
            name="campusName"
            value={formData.campusName}
            onChange={handleChange}
            required
            placeholder="e.g. Kalinga University Main Campus"
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="e.g. +91 98765 43210"
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="e.g. info@kalinga.edu"
          />

          <Input
            label="Websites (Comma Separated)"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="e.g. https://kalinga.edu, http://campus.kalinga.edu"
          />
        </div>
      </div>

      {/* SECTION 2: Address & Location */}
      <div>
        <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 dark:border-slate-800/80">
          <MapPin size={18} className="text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Location details
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Full Address
            </label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter building number, street name, locality..."
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all duration-200 placeholder:text-slate-405 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20 text-sm"
            />
          </div>

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="e.g. Bhubaneswar"
          />

          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            placeholder="e.g. Odisha"
          />

          <Input
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            placeholder="e.g. 751024"
          />

          <div className="md:col-span-2">
            <Input
              label="Google Map URL"
              name="mapLocation"
              value={formData.mapLocation}
              onChange={handleChange}
              placeholder="e.g. https://maps.google.com/..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-405 uppercase tracking-wider mb-2">
              Website / Social Links
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={socialType}
                onChange={(e) => setSocialType(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all duration-200 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20 text-sm text-slate-700 dark:text-slate-205"
              >
                <option value="Website">Website</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter / X</option>
                <option value="YouTube">YouTube</option>
              </select>

              <input
                type="text"
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                placeholder="Enter link URL (e.g. facebook.com/kalinga)"
                className="premium-input text-sm flex-1"
              />

              <button
                type="button"
                onClick={addWebsiteLink}
                className="btn-primary py-2.5 px-6 text-sm shrink-0"
              >
                Add Link
              </button>
            </div>

            {/* Added Links */}
            <div className="mt-4 space-y-2">
              {Array.isArray(formData.website) &&
                formData.website.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 text-sm"
                  >
                    <div>
                      <span className="font-semibold text-xs text-primary-500 uppercase tracking-wider">
                        {item.type}
                      </span>
                      <p className="text-sm font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                        {item.link}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          website: (prev.website || []).filter((_, i) => i !== index),
                        }));
                      }}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Operations & Stats */}
      <div>
        <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 dark:border-slate-800/80">
          <Calendar size={18} className="text-cyan-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Operations & Capacity
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Opening Date"
            type="date"
            name="OpeningDate"
            value={formData.OpeningDate}
            onChange={handleChange}
          />

          <Input
            label="Operating Hours"
            name="OpratingHours"
            value={formData.OpratingHours}
            onChange={handleChange}
            placeholder="e.g. 9:00 AM - 5:00 PM"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 outline-none transition-all duration-200 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20 text-sm text-slate-700 dark:text-slate-200"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <Input
            label="Total Faculty"
            type="number"
            name="Totalfaculty"
            value={formData.Totalfaculty}
            onChange={handleChange}
            placeholder="0"
          />

          <Input
            label="Available Students"
            type="number"
            name="TotalAvailableStudent"
            value={formData.TotalAvailableStudent}
            onChange={handleChange}
            placeholder="0"
          />

          <Input
            label="Passed Out Students"
            type="number"
            name="TotalPassedOutStudent"
            value={formData.TotalPassedOutStudent}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary py-2.5 px-6 text-sm"
        >
          {loading ? "Saving..." : "Save Campus Information"}
        </button>
      </div>
    </form>
  );
}

function Input({ label, type = "text", name, value, onChange, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="premium-input text-sm"
        {...props}
      />
    </div>
  );
}
