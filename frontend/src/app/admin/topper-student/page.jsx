"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, ArrowLeft } from "lucide-react";

import { getStudents, deleteStudent } from "./data";
import { searchStudents } from "./utils";

import StudentTable from "./components/StudentTable";
import SearchFilter from "./components/SearchFilter";
import DeleteModal from "./components/DeleteModal";
import Loading from "./components/Loading";
import EmptyState from "./components/EmptyState";
import ExportCSV from "./components/ExportCSV";

export default function TopperStudent() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      setStudents(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    loadStudents();
  }, [loadStudents, mounted]);

  const filteredStudents = useMemo(() => {
    return searchStudents(students, search);
  }, [students, search]);

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteStudent(selectedStudent.id);
      setDeleteOpen(false);
      loadStudents();
    } catch (error) {
      console.log(error);
    }
  };

  if (!mounted || loading) {
    return <Loading />;
  }

  return (
    <div className="w-full p-6 md:p-8 transition-colors duration-300">
      <title>Top Students | Admin Panel</title>
      <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-850 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-350 cursor-pointer transition-all duration-200 shrink-0"
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
              <span className="gradient-text">Topper Students</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              View, search, and manage student topper certificates and grades.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <Link
            href="/admin/topper-student/add"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:from-indigo-700 hover:to-indigo-800 transition active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            Add Topper
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchFilter search={search} setSearch={setSearch} />
      </div>

      {/* Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState />
      ) : (
        <StudentTable
          students={filteredStudents}
          onDelete={handleDeleteClick}
          refreshData={loadStudents}
        />
      )}

      {/* Delete Confirmation */}
      {deleteOpen && selectedStudent && (
        <DeleteModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
          student={selectedStudent}
        />
      )}
    </div>
  );
}
