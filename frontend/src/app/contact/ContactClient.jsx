"use client";

import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  HelpCircle
} from "lucide-react";
import Swal from "sweetalert2";

const API_URL = "https://kalingace-4.onrender.com/api/Contact1";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
        const url = isLocal
          ? "http://localhost:5000/api/CampusInformation"
          : "https://kalingace-4.onrender.com/api/CampusInformation";
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setCampuses(json.data || []);
        }
      } catch (err) {
        console.error("Failed to load campuses for contact page:", err);
      }
    };
    fetchCampuses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.description.trim()) {
      setMessage({
        type: "error",
        text: "Please fill out all required fields.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit contact form");

      Swal.fire({
        title: "Message Sent!",
        text: "Your message has been sent successfully. We will get back to you soon.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#4f46e5",
        background: "#ffffff",
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-xl px-6 py-3 font-bold"
        }
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        description: "",
      });
    } catch (error) {
      console.error("Contact Submit Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 px-6 py-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-16 text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/25 uppercase tracking-widest">
            Get In Touch
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Contact Our <span className="gradient-text">Support Hub</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Have a question or need admissions assistance? Drop us a line and our representatives will reach out to you shortly.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid gap-12 lg:grid-cols-5 items-start">
          
          {/* Column 1: Contact Details & Campus Branches */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Contact Info Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle size={16} className="text-indigo-600 dark:text-indigo-400" />
                Contact Info
              </h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-slate-600 dark:text-slate-350">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 dark:bg-indigo-955/40 p-2 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Mail size={14} />
                  </div>
                  <a href="mailto:info@kalingacomputer.com" className="hover:underline">info@kalingacomputer.com</a>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-2 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Phone size={14} />
                  </div>
                  <a href="tel:+919876543210" className="hover:underline">+91 9876543210</a>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-955/40 p-2 text-amber-600 dark:text-amber-400 shrink-0">
                    <Clock size={14} />
                  </div>
                  <span>Mon - Sat: 8:00 AM - 7:00 PM</span>
                </div>
              </div>
            </div>

            {/* Dynamic Campus Branches Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
                Our Locations
              </h3>

              {campuses.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center text-xs font-semibold text-slate-450 dark:border-slate-800 dark:bg-slate-900/20">
                  <MapPin size={24} className="mx-auto text-slate-300 mb-2" />
                  <p>Athagarh Head Office</p>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">Athagarh, Cuttack, Odisha - 754029</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  {campuses.map((campus) => (
                    <div
                      key={campus._id || campus.id}
                      className="rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 p-4 dark:bg-slate-950/20 transition hover:border-indigo-100 dark:hover:border-indigo-950"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-extrabold text-slate-805 dark:text-white text-xs">
                          {campus.campusName}
                        </h4>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0 ${
                          campus.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-400"
                        }`}>
                          {campus.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {campus.address}, {campus.city}, {campus.state} - {campus.pincode}
                      </p>
                      {campus.phone && (
                        <p className="text-[9px] text-slate-400 font-bold mt-1.5 flex items-center gap-1">
                          <Phone size={10} /> {campus.phone}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Column 2: Interactive Contact Inquiry Form */}
          <div className="lg:col-span-3 rounded-3xl bg-white dark:bg-slate-900/60 p-6 md:p-8 shadow-premium border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            
            {message.text && (
              <div
                className={`mb-6 flex items-center gap-3 rounded-2xl p-4 ${
                  message.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-200/30"
                    : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-200/30"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle size={18} className="shrink-0" />
                ) : (
                  <AlertCircle size={18} className="shrink-0" />
                )}
                <p className="text-xs font-semibold">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-405 dark:text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 py-3 pl-11 pr-4 outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-405 dark:text-slate-500">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    maxLength={10}
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 py-3 pl-11 pr-4 outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-405 dark:text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 py-3 pl-11 pr-4 outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-405 dark:text-slate-500">
                  Subject
                </label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter enquiry subject"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 py-3 pl-11 pr-4 outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-405 dark:text-slate-500">
                  Message Description
                </label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-4 top-3 text-slate-400" />
                  <textarea
                    id="contact-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Type your query description..."
                    rows={5}
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/20 py-3 pl-11 pr-4 outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="contact-submit-btn"
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-xs font-extrabold text-white shadow-md hover:from-indigo-700 hover:to-indigo-800 transition duration-150 active:scale-97 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Message
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </main>
  );
}
