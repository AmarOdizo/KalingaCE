"use client";

import { useState, useEffect } from "react";
import { Save, Check, MapPin, Mail, Phone, Clock, Globe } from "lucide-react";

export default function CampusInformationPage() {
  const [campusData, setCampusData] = useState({
    name: "Kalinga Computer Education",
    address: "Athagarh, Cuttack, Odisha - 754029",
    phone: "+91 9876543210",
    email: "info@kalingacomputer.com",
    hours: "Mon - Sat: 7:00 AM - 8:00 PM, Sun: Closed",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("campus_info");
    if (savedData) {
      try {
        setCampusData(JSON.parse(savedData));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (key, value) => {
    setCampusData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      localStorage.setItem("campus_info", JSON.stringify(campusData));
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Campus Information
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage center address details, operating hours, email, phone numbers, and social handles.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid gap-8 lg:grid-cols-3">
        {/* Left Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-premium dark:border-slate-800 dark:bg-slate-900/60 space-y-5">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Core Information</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Institution Name</label>
                <input
                  type="text"
                  value={campusData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="premium-input"
                  required
                />
              </div>
              
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  value={campusData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="premium-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={campusData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="premium-input"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Physical Address</label>
              <input
                type="text"
                value={campusData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="premium-input"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Operating Hours</label>
              <input
                type="text"
                value={campusData.hours}
                onChange={(e) => handleChange("hours", e.target.value)}
                className="premium-input"
                required
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-premium dark:border-slate-800 dark:bg-slate-900/60 space-y-5">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Social Channels</h2>
            
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Facebook Page Link</label>
              <input
                type="url"
                value={campusData.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                className="premium-input"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Instagram Profile Link</label>
              <input
                type="url"
                value={campusData.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                className="premium-input"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">YouTube Channel Link</label>
              <input
                type="url"
                value={campusData.youtube}
                onChange={(e) => handleChange("youtube", e.target.value)}
                className="premium-input"
              />
            </div>
          </div>
        </div>

        {/* Right Details/Save Panel */}
        <div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium dark:border-slate-800 dark:bg-slate-900/60 sticky top-8">
            <h3 className="text-md font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Settings Preview</h3>
            
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
              <div className="flex gap-2.5 items-start">
                <MapPin className="text-primary-500 mt-0.5 shrink-0" size={16} />
                <span>{campusData.address}</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone className="text-emerald-500 shrink-0" size={16} />
                <span>{campusData.phone}</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="text-rose-500 shrink-0" size={16} />
                <span>{campusData.email}</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Clock className="text-amber-500 shrink-0" size={16} />
                <span>{campusData.hours}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-sm text-white shadow transition-all duration-300 active:scale-98 cursor-pointer
                ${
                  saved
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700"
                }`}
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : saved ? (
                <>
                  <Check size={18} />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
