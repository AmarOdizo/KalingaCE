"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, School, Users, GraduationCap, Building2 } from "lucide-react";

import { getCampusInformations, deleteCampusInformation } from "./data";

import CampusTable from "./components/CampusTable";
import DeleteModal from "./components/DeleteModal";
import Loading from "./components/Loading";

export default function CampusInformationPage() {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedCampus, setSelectedCampus] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ==========================
  // Fetch Campus Data
  // ==========================
  const fetchCampuses = async () => {
    try {
      setLoading(true);
      const data = await getCampusInformations();
      setCampuses(data || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampuses();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ==========================
  // Delete Modal
  // ==========================
  const handleDeleteClick = (campus) => {
    setSelectedCampus(campus);
    setOpenDeleteModal(true);
  };

  // ==========================
  // Confirm Delete
  // ==========================
  const handleDelete = async () => {
    if (!selectedCampus) return;

    try {
      setDeleteLoading(true);
      await deleteCampusInformation(selectedCampus._id);

      setCampuses((prev) =>
        prev.filter((item) => item._id !== selectedCampus._id),
      );

      setOpenDeleteModal(false);
      setSelectedCampus(null);

      alert("Campus deleted successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================
  // Statistics Calculations
  // ==========================
  const totalCampuses = campuses.length;
  const totalStudents = campuses.reduce((sum, c) => {
    const val = Array.isArray(c.TotalAvailableStudent) ? c.TotalAvailableStudent[0] : c.TotalAvailableStudent;
    return sum + (Number(val) || 0);
  }, 0);
  const totalFaculty = campuses.reduce((sum, c) => {
    const val = Array.isArray(c.Totalfaculty) ? c.Totalfaculty[0] : c.Totalfaculty;
    return sum + (Number(val) || 0);
  }, 0);
  const activeCampuses = campuses.filter(c => c.status === "Active").length;

  // ==========================
  // Filtering Logic
  // ==========================
  const filteredCampuses = campuses.filter((campus) => {
    const matchesSearch =
      campus.campusName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campus.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campus.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "All" || campus.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6 md:p-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 space-y-8 transition-colors duration-300">
      <title>Campus Information | Admin Panel</title>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Campus Information</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your educational campuses, check faculty counts, student distribution, and contact details.
          </p>
        </div>

        <Link
          href="/admin/campus-information/add"
          className="btn-primary py-2.5 px-5 text-sm shrink-0 self-start sm:self-auto"
        >
          <Plus size={18} />
          Add Campus
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Campuses */}
        <div className="premium-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Campuses
            </p>
            <h3 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {totalCampuses}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <School size={24} />
          </div>
        </div>

        {/* Card 2: Active Campuses */}
        <div className="premium-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Campuses
            </p>
            <h3 className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
              {activeCampuses}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
            <Building2 size={24} />
          </div>
        </div>

        {/* Card 3: Total Students */}
        <div className="premium-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Students
            </p>
            <h3 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {totalStudents.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <GraduationCap size={24} />
          </div>
        </div>

        {/* Card 4: Total Faculty */}
        <div className="premium-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Faculty
            </p>
            <h3 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {totalFaculty.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search campuses by name, city, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/40 text-slate-700 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <CampusTable
        campuses={filteredCampuses}
        onDelete={handleDeleteClick}
        deleting={deleteLoading}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setSelectedCampus(null);
        }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        campusName={selectedCampus?.campusName}
      />
    </div>
  );
}
