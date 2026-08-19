"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Search,
  X,
  Phone,
  Mail,
  User,
  BookOpen,
  Eye,
  Calendar,
  Layers,
  GraduationCap,
} from "lucide-react";
import Swal from "sweetalert2";

const API_URL = "https://kalingace-4.onrender.com/api/EnrolledStudent";

export default function EnrolledStudentsAdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // =====================================
  // FETCH ALL ENROLLED STUDENTS
  // =====================================
  const fetchStudents = async () => {
    try {
      await Promise.resolve();
      setLoading(true);
      const res = await fetch(API_URL, {
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch enrolled students");
      }

      setStudents(result.data || []);
    } catch (error) {
      console.error("Fetch Enrolled Students Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // =====================================
  // DELETE ENROLLED STUDENT
  // =====================================
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Student?",
      text: "Are you sure you want to delete this student enquiry? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        popup: "rounded-3xl font-sans",
        confirmButton: "rounded-xl px-5 py-2.5 text-sm font-bold bg-red-600 text-white shadow-md border-0",
        cancelButton: "rounded-xl px-5 py-2.5 text-sm font-bold bg-slate-500 text-white shadow-md border-0"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
          });

          const resData = await res.json();

          if (!res.ok) {
            throw new Error(resData.message || "Delete failed");
          }

          setStudents((prev) => prev.filter((student) => student.id !== id));
          
          Swal.fire({
            title: "Deleted!",
            text: "Student enquiry details have been removed.",
            icon: "success",
            confirmButtonColor: "#4f46e5",
            customClass: {
              popup: "rounded-3xl font-sans",
              confirmButton: "rounded-xl px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white"
            }
          });
        } catch (error) {
          console.error("Delete Student Error:", error);
          Swal.fire({
            title: "Error",
            text: error.message || "Could not delete student enquiry.",
            icon: "error",
            confirmButtonColor: "#4f46e5"
          });
        }
      }
    });
  };

  // =====================================
  // SEARCH / FILTER LOGIC
  // =====================================
  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase();
    const courseName = student.courseName?.courseName || "";
    const courseCode = student.courseName?.courseCode || "";

    return (
      student.name?.toLowerCase().includes(keyword) ||
      student.email?.toLowerCase().includes(keyword) ||
      student.phone?.toLowerCase().includes(keyword) ||
      courseName.toLowerCase().includes(keyword) ||
      courseCode.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      <title>Enrolled Students | Admin Panel</title>
      {/* =================================
          HEADER
      ================================= */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            🎓 Enrolled Students
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage course enquiries and student enrollments
          </p>
        </div>
      </div>

      {/* =================================
          STATS PANELS (UI/UX)
      ================================= */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Total Enquiries
              </p>
              <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                {loading ? "..." : students.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Unique Courses
              </p>
              <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                {loading
                  ? "..."
                  : new Set(students.map((s) => s.courseName?.courseName).filter(Boolean))
                      .size}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Recent Added
              </p>
              <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                {loading ? "..." : filteredStudents.length > 0 ? "Active" : "None"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* =================================
          SEARCH PANEL
      ================================= */}
      <div className="mb-6 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, phone, or course..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {/* =================================
          DATA TABLE
      ================================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Student Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Course Enquired
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mb-2" />
                    <p className="font-semibold">Loading student records...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-semibold">
                    No student enquiries found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id || student._id}
                    className="transition hover:bg-slate-50/50 dark:hover:bg-slate-950/20"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350">
                      #{student.id}
                    </td>

                    {/* Student Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-500/20">
                          {student.name ? student.name.charAt(0).toUpperCase() : <User size={16} />}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-350 text-sm">
                        <Mail size={15} className="text-slate-400 shrink-0" />
                        <span>{student.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-350 text-sm">
                        <Phone size={15} className="text-slate-400 shrink-0" />
                        <span>{student.phone}</span>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-500/10 max-w-xs truncate">
                          {student.courseName?.courseName || "Unknown Course"}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedStudent(student)}
                          title="View Details"
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 cursor-pointer"
                        >
                          <Eye size={17} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(student.id)}
                          title="Delete"
                          className="rounded-xl border border-red-200/50 bg-red-50/30 p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 size={17} />
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
          DETAIL MODAL
      ================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="mb-6 flex flex-col items-center border-b border-slate-100 dark:border-slate-800/60 pb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-extrabold text-2xl shadow-md border-4 border-white dark:border-slate-900">
                {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : <User size={24} />}
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                {selectedStudent.name}
              </h3>
              <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider mt-1">
                Student Enquiry Details
              </p>
            </div>

            <div className="space-y-4">
              {/* Enquiry ID */}
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs font-bold text-slate-400 uppercase">Enquiry ID</span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">#{selectedStudent.id}</span>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Mail size={13} /> Email Address
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 break-all select-all">
                  {selectedStudent.email}
                </span>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Phone size={13} /> Phone Number
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 select-all">
                  {selectedStudent.phone}
                </span>
              </div>

              {/* Course */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <BookOpen size={13} /> Course Enquired
                </span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedStudent.courseName?.courseName || "Unknown Course"}
                </span>
                {selectedStudent.courseName?.courseCode && (
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    Code: {selectedStudent.courseName.courseCode}
                  </span>
                )}
              </div>

            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
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
