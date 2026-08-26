"use client";

import { useEffect, useState, useMemo } from "react";
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
import AdminAgGrid from "@/components/AdminAgGrid";

const API_URL = "https://kalingace-4.onrender.com/api/EnrolledStudent";

export default function EnrolledStudentsAdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const columnDefs = useMemo(() => [
    {
      headerName: "ID",
      field: "id",
      width: 90,
      valueFormatter: (params) => `#${params.value}`,
      cellClass: "font-semibold text-slate-800 dark:text-slate-300 flex items-center",
    },
    {
      headerName: "Student Name",
      field: "name",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params) => {
        const name = params.value || "";
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-500/20">
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
      headerName: "Email",
      field: "email",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs">
          <Mail size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Phone",
      field: "phone",
      flex: 1,
      minWidth: 120,
      cellRenderer: (params) => (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs">
          <Phone size={13} className="text-slate-400 shrink-0" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Course Enquired",
      valueGetter: (params) => params.data.courseName?.courseName || "Unknown Course",
      flex: 1.5,
      minWidth: 160,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-400 border border-indigo-200/35 dark:border-indigo-500/15 max-w-xs truncate">
            {params.value}
          </div>
        </div>
      ),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const student = params.data;
        return (
          <div className="flex items-center justify-center h-full gap-2 w-full">
            <button
              onClick={() => setSelectedStudent(student)}
              title="View Details"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 cursor-pointer"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => handleDelete(student.id)}
              title="Delete"
              className="rounded-xl border border-red-200/50 bg-red-50/30 p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
      width: 130,
      sortable: false,
      filter: false,
    },
  ], []);

  const fetchStudents = async () => {
    try {
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
    fetchStudents();
  }, []);

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

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
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
  }, [students, search]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 p-6 transition-colors duration-300">
      <title>Enrolled Students | Admin Panel</title>
      
      {/* Header */}
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

      {/* Stats Deck */}
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-205 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shrink-0 font-bold">
              <GraduationCap size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Total Enquiries
              </p>
              <h3 className="mt-0.5 text-xl font-black text-slate-900 dark:text-white">
                {loading ? "..." : students.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-205 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0 font-bold">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Unique Courses
              </p>
              <h3 className="mt-0.5 text-xl font-black text-slate-900 dark:text-white">
                {loading
                  ? "..."
                  : new Set(students.map((s) => s.courseName?.courseName).filter(Boolean))
                      .size}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-205 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 shrink-0 font-bold">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Recent Added
              </p>
              <h3 className="mt-0.5 text-xl font-black text-slate-900 dark:text-white">
                {loading ? "..." : filteredStudents.length > 0 ? "Active" : "None"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter Toolbar */}
      <div className="mb-6 rounded-2xl border border-slate-205 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Ag-Grid Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
        <AdminAgGrid
          rowData={filteredStudents}
          columnDefs={columnDefs}
          quickFilterText={search}
          rowHeight={56}
          loading={loading}
        />
      </div>

      {/* Details View Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div className="mb-6 flex flex-col items-center border-b border-slate-100 dark:border-slate-800/60 pb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-black text-2xl shadow-md border-4 border-white dark:border-slate-900">
                {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : <User size={24} />}
              </div>
              <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white leading-tight">
                {selectedStudent.name}
              </h3>
              <p className="text-[10px] text-indigo-650 dark:text-indigo-400 font-extrabold uppercase tracking-widest mt-1">
                Student Enquiry
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Enquiry ID</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">#{selectedStudent.id}</span>
              </div>

              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Mail size={12} /> Email Address
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 break-all select-all">
                  {selectedStudent.email}
                </span>
              </div>

              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Phone size={12} /> Phone Number
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 select-all">
                  {selectedStudent.phone}
                </span>
              </div>

              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <BookOpen size={12} /> Course Enquired
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedStudent.courseName?.courseName || "Unknown Course"}
                </span>
                {selectedStudent.courseName?.courseCode && (
                  <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    Code: {selectedStudent.courseName.courseCode}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedStudent(null)}
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
