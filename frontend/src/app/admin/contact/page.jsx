"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Search,
  Phone,
  Mail,
  User,
  MessageSquare,
  Eye,
  X,
  FileText,
  Inbox,
  AlertCircle,
  Clock,
} from "lucide-react";

const API_URL = "https://kalingace-4.onrender.com/api/Contact1";

export default function Contact1Page() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // =====================================
  // GET ALL CONTACTS
  // =====================================
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
      console.error("Fetch Contact1 Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // =====================================
  // DELETE CONTACT
  // =====================================
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
      console.error("Delete Contact1 Error:", error);
      alert(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // =====================================
  // SEARCH / FILTER
  // =====================================
  const filteredContacts = contacts.filter((contact) => {
    const keyword = search.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(keyword) ||
      contact.email?.toLowerCase().includes(keyword) ||
      contact.phone?.toLowerCase().includes(keyword) ||
      contact.subject?.toLowerCase().includes(keyword) ||
      contact.description?.toLowerCase().includes(keyword)
    );
  });

  // Calculate statistics
  const totalEnquiries = contacts.length;
  const recentEnquiries = contacts.slice(0, 3).length; // Mock count or based on recent IDs

  return (
    <div className="w-full p-6 md:p-8 min-h-screen bg-slate-50/50 dark:bg-slate-950/20 transition-colors duration-300">
      <title>Contact Enquiries | Admin Panel</title>

      {/* =================================
          HEADER
      ================================= */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Contact Enquiries</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View and manage all queries submitted through the student and visitor contact forms.
          </p>
        </div>
      </div>

      {/* =================================
          KPI STATS CARDS
      ================================= */}
      <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Total Card */}
        <div className="premium-card flex items-center gap-4 bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-inner">
            <Inbox size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Total Enquiries
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              {loading ? "..." : totalEnquiries}
            </span>
          </div>
        </div>

        {/* Recent Card */}
        <div className="premium-card flex items-center gap-4 bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-inner">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Recent Activity
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              {loading ? "..." : `${recentEnquiries} New`}
            </span>
          </div>
        </div>

        {/* Subjects Card */}
        <div className="premium-card flex items-center gap-4 bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shadow-inner">
            <FileText size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Form Status
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 block">
              Active Connection
            </span>
          </div>
        </div>
      </div>

      {/* =================================
          SEARCH
      ================================= */}
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/70 dark:border-slate-800/80 dark:bg-slate-900/50 p-4 shadow-sm backdrop-blur-md">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, subject or description..."
            className="w-full rounded-xl border border-slate-200 bg-white/50 py-3.5 pl-12 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:focus:border-primary-500 dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-500/20"
          />
        </div>
      </div>

      {/* =================================
          TABLE CONTAINER
      ================================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/60 dark:divide-slate-800/50">
            <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Enquiry ID
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Contact details
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Message Preview
                </th>
                <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                      Loading contact entries...
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-550 dark:text-slate-400 font-semibold">
                    No matching enquiries found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                  >
                    {/* ID */}
                    <td className="px-6 py-4.5 font-bold text-slate-800 dark:text-slate-100">
                      #{contact.id}
                    </td>

                    {/* NAME */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold border border-blue-100/50 dark:border-blue-800/30">
                          {contact.name ? contact.name.charAt(0).toUpperCase() : <User size={16} />}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {contact.name}
                        </span>
                      </div>
                    </td>

                    {/* CONTACT DETAILS */}
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-350 font-semibold">
                          <Phone size={13} className="text-slate-400" />
                          {contact.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-650 dark:text-slate-400 font-semibold">
                          <Mail size={13} className="text-slate-400" />
                          {contact.email}
                        </span>
                      </div>
                    </td>

                    {/* SUBJECT */}
                    <td className="px-6 py-4.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={14} className="text-primary-500 shrink-0" />
                        <span className="truncate max-w-[150px]">{contact.subject}</span>
                      </div>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-6 py-4.5 max-w-[240px] truncate text-xs text-slate-500 dark:text-slate-400 font-medium" title={contact.description}>
                      {contact.description || "N/A"}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center gap-2">
                        {/* VIEW DETAILS */}
                        <button
                          onClick={() => setSelectedContact(contact)}
                          title="View Details"
                          className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => setDeleteId(contact.id)}
                          title="Delete"
                          className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-500/10 dark:text-rose-450 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================
          DELETE CONFIRMATION MODAL
      ================================= */}
      {deleteId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Trash2 size={22} />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete enquiry record?</h2>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete this enquiry? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 dark:hover:bg-slate-850 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-xl bg-red-650 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition cursor-pointer disabled:opacity-55"
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================
          DETAIL MODAL
      ================================= */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="mb-6 flex flex-col items-center border-b border-slate-100 dark:border-slate-800/60 pb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-extrabold text-2xl shadow-md border-4 border-white dark:border-slate-900">
                {selectedContact.name ? selectedContact.name.charAt(0).toUpperCase() : <User size={24} />}
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                {selectedContact.name}
              </h3>
              <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mt-1">
                Contact Enquiry Details
              </p>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Mail size={13} /> Email Address
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 break-all select-all">
                  {selectedContact.email}
                </span>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Phone size={13} /> Phone Number
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 select-all">
                  {selectedContact.phone}
                </span>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <MessageSquare size={13} /> Subject
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {selectedContact.subject}
                </span>
              </div>

              {/* Description Message */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Message Description
                </span>
                <p className="text-sm text-slate-650 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedContact.description || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedContact(null)}
                className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
