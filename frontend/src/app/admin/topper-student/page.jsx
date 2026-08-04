"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  // =============================
  // Load Students
  // =============================

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await getStudents();

      setStudents(response.data || []);

      setFilteredStudents(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // =============================
  // Search
  // =============================

  useEffect(() => {
    setFilteredStudents(searchStudents(students, search));
  }, [search, students]);

  // =============================
  // Delete
  // =============================

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

  // =============================
  // Loading
  // =============================

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}

      <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Topper Student</h1>

          <p className="mt-2 text-slate-500">Manage topper students.</p>
        </div>
        <ExportCSV students={filteredStudents} />
        <Link
          href="/admin/topper-student/add"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Student
        </Link>
      </div>

      {/* Search */}

      <SearchFilter search={search} setSearch={setSearch} />

      {/* Table */}

      {filteredStudents.length === 0 ? (
        <EmptyState />
      ) : (
        <StudentTable
          students={filteredStudents}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete */}

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        student={selectedStudent}
      />
    </div>
  );
}
