"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getCourses, deleteCourse } from "./data";

import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import Loading from "./components/Loading";
import EmptyState from "./components/EmptyState";
import CourseTable from "./components/CourseTable";
import DeleteModal from "./components/DeleteModal";
import CourseModal from "./components/CourseModal";
import Pagination from "./components/Pagination";

export default function AvailableCourses() {
  // ==========================
  // States
  // ==========================

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);

  const [courseToDelete, setCourseToDelete] = useState(null);

  // ==========================
  // Fetch Courses
  // ==========================

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getCourses();

      setCourses(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  // ==========================
  // Search + Filter
  // ==========================

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        (course.courseName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (course.courseCode?.toLowerCase() || "").includes(search.toLowerCase());

      const matchStatus = status === "All" || course.status === status;

      return matchSearch && matchStatus;
    });
  }, [courses, search, status]);

  // ==========================
  // Pagination
  // ==========================

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );



  // ==========================
  // Delete Course
  // ==========================

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;

    try {
      setDeleteLoading(true);

      await deleteCourse(courseToDelete.id);

      await fetchCourses();

      setDeleteModal(false);

      setCourseToDelete(null);
    } catch (error) {
      console.error(error);
      alert("Failed to delete course.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================
  // View Modal
  // ==========================

  const handleView = (course) => {
    setSelectedCourse(course);
    setOpenModal(true);
  };

  // ==========================
  // UI
  // ==========================
  return (
    <div className="w-full p-6 md:p-8 transition-colors duration-300">
      <title>Manage Courses | Admin Panel</title>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Available Courses</span>
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create, manage, and view student course offerings.
          </p>
        </div>

        <Link
          href="/admin/available-courses/add"
          className="btn-primary"
        >
          <Plus size={18} />
          Add Course
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="glass-panel mb-8 flex flex-col gap-4 rounded-2xl p-5 shadow-premium md:flex-row md:items-center">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
          />
        </div>

        <FilterBar
          value={status}
          onChange={(val) => {
            setStatus(val);
            setCurrentPage(1);
          }}
        />
      </div>
      {/* Content */}

      {loading ? (
        <Loading />
      ) : filteredCourses.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Table View */}
          <CourseTable
            courses={paginatedCourses}
            onView={handleView}
            onDelete={handleDeleteClick}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      {/* View Course Modal */}
      <CourseModal
        open={openModal}
        course={selectedCourse}
        onClose={() => {
          setOpenModal(false);
          setSelectedCourse(null);
        }}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModal}
        loading={deleteLoading}
        onClose={() => {
          setDeleteModal(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

