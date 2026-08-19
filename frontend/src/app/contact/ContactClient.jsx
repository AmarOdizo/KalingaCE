"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // SUBMIT FORM
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    // Basic validation
    if (!formData.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your name.",
      });
      return;
    }

    if (!formData.phone.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your phone number.",
      });
      return;
    }

    if (!formData.email.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your email.",
      });
      return;
    }

    if (!formData.subject.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your subject.",
      });
      return;
    }

    if (!formData.description.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your message description.",
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

      if (!res.ok) {
        throw new Error(result.message || "Failed to submit contact form");
      }

      // Success
      setMessage({
        type: "success",
        text: "Your message has been submitted successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        description: "",
      });
    } catch (error) {
      console.error("Contact1 Submit Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        {/* =================================
            HEADER
        ================================= */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-950/40 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
            Contact Us
          </span>

          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Get In Touch
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-slate-400">
            Have a question or need more information? Send us a message and we
            will get back to you.
          </p>
        </div>

        {/* =================================
            FORM CARD
        ================================= */}
        <div className="mx-auto max-w-2xl rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-100 dark:border-slate-800/80 md:p-10">
          {/* MESSAGE */}
          {message.text && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-xl p-4 ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={22} />
              ) : (
                <AlertCircle size={22} />
              )}

              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* =================================
                NAME
            ================================= */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                />

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3.5 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-650 transition focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                />
              </div>
            </div>

            {/* =================================
                PHONE
            ================================= */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                />

                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  maxLength={10}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3.5 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-650 transition focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                />
              </div>
            </div>

            {/* =================================
                EMAIL
            ================================= */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                />

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3.5 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-650 transition focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                />
              </div>
            </div>

            {/* =================================
                SUBJECT
            ================================= */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Subject
              </label>

              <div className="relative">
                <MessageSquare
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                />

                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject of your message"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3.5 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-650 transition focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                />
              </div>
            </div>

            {/* =================================
                DESCRIPTION
            ================================= */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Message Description
              </label>

              <div className="relative">
                <MessageSquare
                  size={20}
                  className="absolute left-4 top-4 text-gray-400 dark:text-slate-500"
                />

                <textarea
                  id="contact-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-3.5 pl-12 pr-4 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-650 transition focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                />
              </div>
            </div>

            {/* =================================
                SUBMIT
            ================================= */}
            <button
              id="contact-submit-btn"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
