"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
  Phone,
  Mail,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/Contact";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedContact, setSelectedContact] = useState(null);
  const [editContact, setEditContact] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ============================
  // GET CONTACTS & COURSES
  // ============================
  const fetchContacts = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch contacts");
      }

      setContacts(result.data || []);
    } catch (error) {
      console.error("Fetch Contacts Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API_URL, {
          cache: "no-store",
        });
        const result = await res.json();
        if (res.ok) {
          setContacts(result.data || []);
        }
      } catch (error) {
        console.error("Fetch Contacts Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/Course", {
          cache: "no-store",
        });
        const result = await res.json();
        if (res.ok) {
          setCourses(result.data || []);
        }
      } catch (err) {
        console.error("Fetch Courses Error:", err);
      }
    };

    load();
    fetchCourses();
  }, []);

  // ============================
  // DELETE CONTACT
  // ============================
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Delete failed");
      }

      setContacts((prev) => prev.filter((contact) => contact.id !== deleteId));

      setDeleteId(null);
    } catch (error) {
      console.error("Delete Contact Error:", error);
      alert(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ============================
  // FILTER
  // ============================
  const filteredContacts = contacts.filter((contact) => {
    const keyword = search.toLowerCase();

    const courseName =
      typeof contact.courseName === "object"
        ? contact.courseName?.courseName
        : contact.courseName;

    return (
      contact.name?.toLowerCase().includes(keyword) ||
      contact.email?.toLowerCase().includes(keyword) ||
      contact.phone?.toLowerCase().includes(keyword) ||
      courseName?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 p-6 md:p-8 dark:from-slate-950 dark:to-slate-900/50 transition-colors duration-300 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Contact Enquiries</span>
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage all contact requests and enquiries submitted by users.
          </p>
        </div>

        <button
          onClick={() => {
            window.location.href = "/admin/contact/add";
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Plus size={18} />
          Add Contact
        </button>
      </div>

      {/* SEARCH */}
      <div className="glass-panel mb-8 rounded-2xl p-4 shadow-premium border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />

          <input
            type="text"
            placeholder="Search by name, email, phone or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-950 dark:focus:ring-primary-500/20"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Image
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Course
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white/30 dark:bg-slate-900/10"
                  >
                    Loading enquiries...
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white/30 dark:bg-slate-900/10"
                  >
                    No contact enquiries found
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => {
                  const courseName =
                    typeof contact.courseName === "object"
                      ? contact.courseName?.courseName
                      : contact.courseName;

                  return (
                    <tr
                      key={contact.id}
                      className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                        #{contact.id}
                      </td>

                      {/* IMAGE */}
                      <td className="px-6 py-4">
                        {contact.image ? (
                          <img
                            src={contact.image}
                            alt={contact.name}
                            className="h-11 w-11 rounded-xl border border-slate-200 dark:border-slate-800 object-cover shadow-sm"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 border border-slate-100 dark:border-slate-805">
                            <span className="text-md font-bold uppercase">
                              {contact.name?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* NAME */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                          {contact.name}
                        </p>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                          <Mail size={14} className="text-primary-500" />
                          {contact.email}
                        </div>
                      </td>

                      {/* PHONE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                          <Phone size={14} className="text-indigo-500" />
                          {contact.phone}
                        </div>
                      </td>

                      {/* COURSE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-emerald-500" />

                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {courseName || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2.5">
                          {/* VIEW */}
                          <button
                            onClick={() => setSelectedContact(contact)}
                            title="View Details"
                            className="flex items-center justify-center rounded-xl bg-blue-50/50 p-2.5 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-all duration-200 cursor-pointer active:scale-90 border border-blue-100/50 dark:border-blue-900/30"
                          >
                            <Eye size={16} />
                          </button>

                          {/* EDIT */}
                          <button
                            onClick={() => setEditContact(contact)}
                            title="Edit"
                            className="flex items-center justify-center rounded-xl bg-amber-50/50 p-2.5 text-amber-600 hover:bg-amber-100 dark:bg-amber-955/30 dark:text-amber-400 dark:hover:bg-amber-900/50 transition-all duration-200 cursor-pointer active:scale-90 border border-amber-100/50 dark:border-amber-900/30"
                          >
                            <Pencil size={16} />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => setDeleteId(contact.id)}
                            title="Delete"
                            className="flex items-center justify-center rounded-xl bg-red-50/50 p-2.5 text-red-600 hover:bg-red-100 dark:bg-red-955/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-all duration-200 cursor-pointer active:scale-90 border border-red-100/50 dark:border-red-900/30"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================
          VIEW DETAILS MODAL
      ============================ */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 dark:bg-slate-950 dark:border-slate-800/80 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div className="mb-6 pr-8">
              <span className="inline-block rounded-full bg-primary-50 dark:bg-primary-500/10 px-3 py-1 text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                Enquiry Details
              </span>
              <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {selectedContact.name}
              </h3>
            </div>

            {/* Image Section */}
            <div className="mb-6 flex justify-center">
              {selectedContact.image ? (
                <img
                  src={selectedContact.image}
                  alt={selectedContact.name}
                  className="h-28 w-28 rounded-full border-4 border-slate-100 dark:border-slate-800 object-cover shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-3xl font-extrabold text-slate-400 dark:bg-slate-900 dark:text-slate-600 border-4 border-slate-100 dark:border-slate-800">
                  {selectedContact.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Content Details Grid */}
            <div className="space-y-4 text-slate-900 dark:text-slate-100">
              <Detail label="ID" value={`#${selectedContact.id}`} />

              <Detail label="Full Name" value={selectedContact.name} />

              <Detail label="Email Address" value={selectedContact.email} />

              <Detail label="Phone Number" value={selectedContact.phone} />

              <Detail
                label="Enquired Course"
                value={
                  typeof selectedContact.courseName === "object"
                    ? selectedContact.courseName?.courseName
                    : selectedContact.courseName
                }
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-5 flex items-center justify-end gap-3.5">
              <button
                onClick={() => setSelectedContact(null)}
                className="rounded-xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60 px-5 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft size={16} />
                Back to List
              </button>

              <button
                onClick={() => setSelectedContact(null)}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================
          EDIT MODAL
      ============================ */}
      {editContact && (
        <EditModal
          contact={editContact}
          courses={courses}
          onClose={() => setEditContact(null)}
          onUpdated={(updatedContact) => {
            setContacts((prev) =>
              prev.map((item) =>
                item.id === updatedContact.id ? updatedContact : item,
              ),
            );

            setEditContact(null);
          }}
        />
      )}

      {/* ============================
          DELETE CONFIRMATION MODAL
      ============================ */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
              <Trash2 className="text-red-600 dark:text-red-400" size={22} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Delete Contact?
            </h2>

            <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
              Are you sure you want to delete this contact? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
                className="rounded-xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:from-red-700 hover:to-rose-700 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================
// DETAIL COMPONENT
// ============================
function Detail({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100/50 dark:bg-slate-900/40 dark:border-slate-800/40">
      <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
        {label}
      </p>

      <p className="mt-1.5 font-extrabold text-slate-800 dark:text-slate-100 text-sm">
        {value || "N/A"}
      </p>
    </div>
  );
}

// ============================
// EDIT MODAL
// ============================
function EditModal({ contact, courses, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: contact.name || "",
    email: contact.email || "",
    phone: contact.phone || "",
    image: contact.image || "",
    courseName:
      typeof contact.courseName === "object"
        ? contact.courseName?._id
        : contact.courseName || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/${contact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Update failed");
      }

      onUpdated(result.data);
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 dark:bg-slate-950 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <h2 className="text-xl font-bold">Edit Contact Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-650 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full rounded-xl border border-slate-200 bg-white/50 p-3 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-xl border border-slate-200 bg-white/50 p-3 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full rounded-xl border border-slate-200 bg-white/50 p-3 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Enquired Course
            </label>
            <div className="relative">
              <select
                name="courseName"
                value={form.courseName}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white/50 p-3 pr-10 outline-none transition-all duration-200 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20 cursor-pointer"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option
                    key={course._id}
                    value={course._id}
                    className="dark:bg-slate-900 dark:text-slate-350"
                  >
                    {course.courseName}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Image URL
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full rounded-xl border border-slate-200 bg-white/50 p-3 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60 px-5 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              Back to List
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
