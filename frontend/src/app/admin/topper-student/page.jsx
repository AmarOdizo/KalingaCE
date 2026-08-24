"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";

import { getStudents, deleteStudent } from "./data";
import { searchStudents } from "./utils";

import StudentTable from "./components/StudentTable";
import SearchFilter from "./components/SearchFilter";
import DeleteModal from "./components/DeleteModal";
import Loading from "./components/Loading";
import EmptyState from "./components/EmptyState";
import ExportCSV from "./components/ExportCSV";

export default function TopperStudent() {
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
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Topper Students</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View, search, and manage student topper certificates and grades.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <ExportCSV students={filteredStudents} />
          <Link
            href="/admin/topper-student/add"
            className="btn-primary"
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
