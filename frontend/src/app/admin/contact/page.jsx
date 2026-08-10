"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Search,
  Phone,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/Contact1";

export default function Contact1Page() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =====================================
  // GET ALL CONTACTS
  // =====================================
  const fetchContacts = async () => {
    try {
      await Promise.resolve();
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
    const timer = setTimeout(() => {
      fetchContacts();
    }, 0);
    return () => clearTimeout(timer);
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
  // SEARCH
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* =================================
          HEADER
      ================================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Enquiries</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage contact form submissions
        </p>
      </div>

      {/* =================================
          SEARCH
      ================================= */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, subject or description..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* =================================
          TABLE
      ================================= */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  Subject
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>

                <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    Loading contacts...
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No contacts found
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="transition hover:bg-gray-50">
                    {/* ID */}
                    <td className="px-5 py-4 font-semibold text-gray-700">
                      #{contact.id}
                    </td>

                    {/* NAME */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <User size={18} />
                        </div>

                        <span className="font-semibold text-gray-900">
                          {contact.name}
                        </span>
                      </div>
                    </td>

                    {/* PHONE */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        {contact.phone}
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} />
                        {contact.email}
                      </div>
                    </td>

                    {/* SUBJECT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-blue-600" />

                        <span className="font-medium text-gray-700">
                          {contact.subject}
                        </span>
                      </div>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-5 py-4 max-w-[200px] truncate" title={contact.description}>
                      <span className="font-medium text-gray-500">
                        {contact.description || "N/A"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        {/* DELETE */}
                        <button
                          onClick={() => setDeleteId(contact.id)}
                          title="Delete"
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 size={18} />
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
          DELETE MODAL
      ================================= */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={22} className="text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900">Delete Contact?</h2>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this contact? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
                className="rounded-xl border px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"
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
