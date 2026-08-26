"use client";

import { useEffect, useState, useMemo } from "react";
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
  Clock,
} from "lucide-react";
import AdminAgGrid from "@/components/AdminAgGrid";

const API_URL = "https://kalingace-4.onrender.com/api/Contact1";

export default function Contact1Page() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const columnDefs = useMemo(() => [
    {
      headerName: "Enquiry ID",
      field: "id",
      width: 110,
      valueFormatter: (params) => `#${params.value}`,
      cellClass: "font-bold text-slate-800 dark:text-slate-100 flex items-center",
    },
    {
      headerName: "Sender",
      field: "name",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params) => {
        const name = params.value || "";
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100/50 dark:border-indigo-800/30 text-xs shrink-0">
              {name ? name.charAt(0).toUpperCase() : <User size={14} />}
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              {name}
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Contact details",
      cellRenderer: (params) => {
        const contact = params.data;
        return (
          <div className="flex flex-col justify-center h-full gap-0.5">
            <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-350 font-semibold leading-normal">
              <Phone size={12} className="text-slate-400" />
              {contact.phone}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold leading-normal">
              <Mail size={12} className="text-slate-400" />
              {contact.email}
            </span>
          </div>
        );
      },
      flex: 1.5,
      minWidth: 180,
    },
    {
      headerName: "Subject",
      field: "subject",
      flex: 1.2,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex items-center gap-1.5 h-full">
          <MessageSquare size={13} className="text-indigo-500 shrink-0" />
          <span className="truncate max-w-[150px] font-semibold text-slate-805 dark:text-slate-100">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Message Preview",
      field: "description",
      flex: 2,
      minWidth: 200,
      cellClass: "text-xs text-slate-500 dark:text-slate-405 font-medium flex items-center",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const contact = params.data;
        return (
          <div className="flex items-center justify-center h-full gap-2 w-full">
            <button
              onClick={() => setSelectedContact(contact)}
              title="View Details"
              className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-205 active:scale-95 cursor-pointer flex items-center justify-center border border-transparent"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => setDeleteId(contact.id)}
              title="Delete"
              className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-500/10 dark:text-rose-455 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-205 active:scale-95 cursor-pointer flex items-center justify-center border border-transparent"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      },
      width: 120,
      sortable: false,
      filter: false,
    },
  ], []);

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

  const totalEnquiries = contacts.length;
  const recentEnquiries = contacts.slice(0, 3).length;

  return (
    <div className="w-full p-6 md:p-8 min-h-screen bg-slate-50/50 dark:bg-slate-950/20 transition-colors duration-300">
      <title>Contact Enquiries | Admin Panel</title>

      {/* Header */}
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

      {/* KPI Stats Cards */}
      <div className="mb-8 grid gap-6 grid-cols-1 sm:grid-cols-3">
        <div className="premium-card flex items-center gap-4 bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 shrink-0">
            <Inbox size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Total Enquiries
            </span>
            <span className="text-xl font-black text-slate-905 dark:text-white mt-0.5 block">
              {loading ? "..." : totalEnquiries}
            </span>
          </div>
        </div>

        <div className="premium-card flex items-center gap-4 bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-650 dark:text-violet-405 shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Recent Activity
            </span>
            <span className="text-xl font-black text-slate-905 dark:text-white mt-0.5 block">
              {loading ? "..." : `${recentEnquiries} New`}
            </span>
          </div>
        </div>

        <div className="premium-card flex items-center gap-4 bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Form Status
            </span>
            <span className="text-xs font-bold text-emerald-605 dark:text-emerald-450 mt-1.5 block">
              Active Connection
            </span>
          </div>
        </div>
      </div>

      {/* Search Filter Toolbar */}
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/70 dark:border-slate-800/80 dark:bg-slate-900/50 p-4 shadow-sm backdrop-blur-md">
        <div className="relative">
          <Search
            size={20}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, subject or description..."
            className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:focus:border-indigo-500 dark:focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Ag-Grid Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
        <AdminAgGrid
          rowData={filteredContacts}
          columnDefs={columnDefs}
          quickFilterText={search}
          rowHeight={60}
          loading={loading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455">
              <Trash2 size={20} />
            </div>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Delete enquiry record?</h2>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete this enquiry? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 px-4 py-2.5 text-xs font-bold text-slate-605 dark:text-slate-350 dark:hover:bg-slate-800 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition cursor-pointer disabled:opacity-55"
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 text-slate-905 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div className="mb-6 flex flex-col items-center border-b border-slate-100 dark:border-slate-800/60 pb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-black text-2xl shadow-md border-4 border-white dark:border-slate-900">
                {selectedContact.name ? selectedContact.name.charAt(0).toUpperCase() : <User size={24} />}
              </div>
              <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white leading-tight">
                {selectedContact.name}
              </h3>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-widest mt-1">
                Contact Enquiry
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Mail size={12} /> Email Address
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 break-all select-all">
                  {selectedContact.email}
                </span>
              </div>

              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Phone size={12} /> Phone Number
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 select-all">
                  {selectedContact.phone}
                </span>
              </div>

              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <MessageSquare size={12} /> Subject
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {selectedContact.subject}
                </span>
              </div>

              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  Message Description
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-350 whitespace-pre-wrap leading-relaxed">
                  {selectedContact.description || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedContact(null)}
                className="w-full rounded-xl bg-slate-100 py-3 text-xs font-extrabold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 transition cursor-pointer active:scale-97"
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
