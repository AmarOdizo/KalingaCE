"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  BookOpenCheck,
  Tag,
  HelpCircle,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  AlertCircle,
  FileQuestion,
  RefreshCw,
} from "lucide-react";

import {
  getMCQs,
  createMCQ,
  updateMCQ,
  deleteMCQ,
} from "./data";

export default function MCQAdminPage() {
  // State variables
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMCQ, setEditingMCQ] = useState(null);
  
  // Accordion state (expanded MCQs by ID)
  const [expandedMCQs, setExpandedMCQs] = useState({});

  // Form states
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("A"); // Bound to A/B/C/D
  const [marks, setMarks] = useState(1);
  const [explanation, setExplanation] = useState("");
  const [status, setStatus] = useState("Active");

  // Fetch MCQs
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMCQs();
      setMcqs(data || []);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to load MCQs from server.",
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllData();
  }, [fetchAllData]);

  // Derive subjects with MCQ count
  const subjectsList = useMemo(() => {
    const counts = {};
    mcqs.forEach((item) => {
      const sub = item.subject ? item.subject.trim() : "General";
      counts[sub] = (counts[sub] || 0) + 1;
    });

    const list = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));

    // If there is an active selectedSubject that is NOT in the database list yet (e.g. newly created subject card)
    if (selectedSubject !== "All" && !counts[selectedSubject]) {
      list.push({ name: selectedSubject, count: 0 });
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [mcqs, selectedSubject]);

  // Filtered MCQs
  const filteredMCQs = useMemo(() => {
    return mcqs.filter((item) => {
      // Filter by subject card
      if (
        selectedSubject !== "All" &&
        item.subject?.toLowerCase().trim() !== selectedSubject.toLowerCase().trim()
      ) {
        return false;
      }
      // Filter by status dropdown
      if (statusFilter !== "All" && item.status !== statusFilter) {
        return false;
      }
      // Filter by search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const qMatch = item.question?.toLowerCase().includes(query);
        const sMatch = item.subject?.toLowerCase().includes(query);
        const eMatch = item.explanation?.toLowerCase().includes(query);
        const oMatch = item.options?.some((opt) =>
          opt?.toLowerCase().includes(query)
        );
        return qMatch || sMatch || eMatch || oMatch;
      }
      return true;
    });
  }, [mcqs, selectedSubject, statusFilter, search]);

  // Total metrics
  const stats = useMemo(() => {
    const total = mcqs.length;
    const active = mcqs.filter((m) => m.status === "Active").length;
    const inactive = total - active;
    const uniqueSubjects = subjectsList.length;
    const totalMarks = mcqs.reduce((acc, curr) => acc + (curr.marks || 1), 0);

    return { total, active, inactive, uniqueSubjects, totalMarks };
  }, [mcqs, subjectsList]);

  // Accordion toggle handler
  const toggleAccordion = (id) => {
    setExpandedMCQs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingMCQ(null);
    // If a subject card is selected, use it. Otherwise, leave blank
    setSubject(selectedSubject !== "All" ? selectedSubject : "");
    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectOption("A");
    setMarks(1);
    setExplanation("");
    setStatus("Active");
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (mcq, e) => {
    e.stopPropagation(); // Stop click from triggering accordion toggle
    setEditingMCQ(mcq);
    setSubject(mcq.subject || "");
    setQuestion(mcq.question || "");
    setOptionA(mcq.options[0] || "");
    setOptionB(mcq.options[1] || "");
    setOptionC(mcq.options[2] || "");
    setOptionD(mcq.options[3] || "");
    
    // Find index of correctAnswer to bind to A/B/C/D
    const idx = mcq.options.indexOf(mcq.correctAnswer);
    if (idx === 0) setCorrectOption("A");
    else if (idx === 1) setCorrectOption("B");
    else if (idx === 2) setCorrectOption("C");
    else if (idx === 3) setCorrectOption("D");
    else setCorrectOption("A"); // fallback
    
    setMarks(mcq.marks || 1);
    setExplanation(mcq.explanation || "");
    setStatus(mcq.status || "Active");
    setIsModalOpen(true);
  };

  // Create new subject card
  const handleCreateNewSubject = () => {
    Swal.fire({
      title: "Create New Subject Card",
      text: "Enter the name of the subject:",
      input: "text",
      inputPlaceholder: "e.g., Computer Networks, Physics...",
      showCancelButton: true,
      confirmButtonText: "Create & Select",
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#ef4444",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Subject name cannot be empty!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newSub = result.value.trim();
        setSelectedSubject(newSub);
        Swal.fire({
          title: "Subject Card Created!",
          text: `Subject "${newSub}" is now active. Opening "Add MCQ" form automatically.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Auto launch Add MCQ modal pre-filled with this subject
        setTimeout(() => {
          setEditingMCQ(null);
          setSubject(newSub);
          setQuestion("");
          setOptionA("");
          setOptionB("");
          setOptionC("");
          setOptionD("");
          setCorrectOption("A");
          setMarks(1);
          setExplanation("");
          setStatus("Active");
          setIsModalOpen(true);
        }, 1000);
      }
    });
  };

  // Fast toggle status
  const handleToggleStatus = async (mcq, e) => {
    e.stopPropagation();
    const newStatus = mcq.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await updateMCQ(mcq.id, { status: newStatus });
      if (res.success) {
        setMcqs((prev) =>
          prev.map((item) => (item.id === mcq.id ? { ...item, status: newStatus } : item))
        );
        Swal.fire({
          title: "Updated!",
          text: `Status changed to ${newStatus}`,
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to update status", "error");
    }
  };

  // Delete MCQ
  const handleDeleteMCQ = (id, e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Are you sure?",
      text: "This MCQ will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteMCQ(id);
          if (res.success) {
            setMcqs((prev) => prev.filter((item) => item.id !== id));
            Swal.fire({
              title: "Deleted!",
              text: "The MCQ has been deleted successfully.",
              icon: "success",
              confirmButtonColor: "#3b82f6",
            });
          } else {
            throw new Error(res.message);
          }
        } catch (err) {
          Swal.fire("Error!", err.message || "Failed to delete MCQ.", "error");
        }
      }
    });
  };

  // Handle Form Submit (Create / Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!subject.trim()) {
      Swal.fire("Validation Error", "Subject is required.", "warning");
      return;
    }
    if (!question.trim()) {
      Swal.fire("Validation Error", "Question is required.", "warning");
      return;
    }
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      Swal.fire("Validation Error", "All four options are required.", "warning");
      return;
    }

    // Map correctOption select to option value text
    let targetCorrectAnswer = "";
    if (correctOption === "A") targetCorrectAnswer = optionA.trim();
    else if (correctOption === "B") targetCorrectAnswer = optionB.trim();
    else if (correctOption === "C") targetCorrectAnswer = optionC.trim();
    else if (correctOption === "D") targetCorrectAnswer = optionD.trim();

    const payload = {
      subject: subject.trim(),
      question: question.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctAnswer: targetCorrectAnswer,
      marks: Number(marks) || 1,
      explanation: explanation.trim(),
      status,
    };

    try {
      if (editingMCQ) {
        // Edit mode
        const res = await updateMCQ(editingMCQ.id, payload);
        if (res.success) {
          Swal.fire({
            title: "Updated!",
            text: "MCQ updated successfully.",
            icon: "success",
            confirmButtonColor: "#3b82f6",
          });
          setMcqs((prev) =>
            prev.map((item) => (item.id === editingMCQ.id ? res.data : item))
          );
          setIsModalOpen(false);
        } else {
          throw new Error(res.message);
        }
      } else {
        // Create mode
        const res = await createMCQ(payload);
        if (res.success) {
          Swal.fire({
            title: "Created!",
            text: "MCQ created successfully.",
            icon: "success",
            confirmButtonColor: "#3b82f6",
          });
          setMcqs((prev) => [...prev, res.data]);
          setIsModalOpen(false);
        } else {
          throw new Error(res.message);
        }
      }
    } catch (err) {
      Swal.fire("Error!", err.message || "Operation failed.", "error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <title>Manage MCQs | Admin Panel</title>

      {/* Header section */}
      <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              MCQ Pool Management
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Publish questions, categorize into subject cards, and review answers with explanations.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={fetchAllData}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800 cursor-pointer"
            title="Reload Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
          >
            <Plus size={18} />
            Add New MCQ
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-blue-550 dark:text-blue-450">
            <HelpCircle size={22} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total</span>
          </div>
          <p className="mt-4 text-2xl font-black text-slate-800 dark:text-slate-100">{stats.total}</p>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Questions Pool</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-green-500">
            <CheckCircle2 size={22} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Active</span>
          </div>
          <p className="mt-4 text-2xl font-black text-slate-800 dark:text-slate-100">{stats.active}</p>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Live MCQs</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-red-500">
            <XCircle size={22} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Inactive</span>
          </div>
          <p className="mt-4 text-2xl font-black text-slate-800 dark:text-slate-100">{stats.inactive}</p>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Drafted Questions</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all hover:shadow-md col-span-1">
          <div className="flex items-center justify-between text-purple-500">
            <Layers size={22} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Subjects</span>
          </div>
          <p className="mt-4 text-2xl font-black text-slate-800 dark:text-slate-100">{stats.uniqueSubjects}</p>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Total Categories</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all hover:shadow-md col-span-2 sm:col-span-4 lg:col-span-1">
          <div className="flex items-center justify-between text-amber-500">
            <Sparkles size={22} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Weightage</span>
          </div>
          <p className="mt-4 text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totalMarks}</p>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Cumulative Marks</p>
        </div>
      </div>

      {/* Subject Cards Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Tag size={12} /> Filter by Subject Card
        </h2>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {/* Card: All Subjects */}
          <div
            onClick={() => setSelectedSubject("All")}
            className={`group relative overflow-hidden rounded-2xl border p-5 shadow-xs transition-all duration-300 hover:shadow-md cursor-pointer
              ${
                selectedSubject === "All"
                  ? "border-blue-500 bg-gradient-to-br from-blue-50/40 to-indigo-50/20 shadow-blue-500/10 scale-102 ring-1 ring-blue-500/20 dark:border-blue-500 dark:from-blue-950/20 dark:to-slate-900"
                  : "border-slate-200/80 bg-white hover:border-slate-350 dark:border-slate-850 dark:bg-slate-900/50 dark:hover:border-slate-700"
              }`}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-2.5 transition-colors duration-300
                ${
                  selectedSubject === "All"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 dark:group-hover:bg-blue-900/30"
                }`}>
                <Layers size={18} />
              </div>
              
              {selectedSubject === "All" && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                  <Check size={10} strokeWidth={3} />
                </span>
              )}
            </div>
            
            <p className="mt-4.5 font-bold text-slate-800 dark:text-slate-200 truncate">All Subjects</p>
            <p className="mt-1 text-xs text-slate-400 font-semibold">{mcqs.length} MCQs</p>
          </div>

          {/* Dynamic Subject Cards */}
          {subjectsList.map((sub) => {
            const isActive = selectedSubject.toLowerCase().trim() === sub.name.toLowerCase().trim();
            const initial = sub.name ? sub.name.charAt(0).toUpperCase() : "?";
            
            return (
              <div
                key={sub.name}
                onClick={() => setSelectedSubject(isActive ? "All" : sub.name)}
                className={`group relative overflow-hidden rounded-2xl border p-5 shadow-xs transition-all duration-300 hover:shadow-md cursor-pointer
                  ${
                    isActive
                      ? "border-blue-550 bg-gradient-to-br from-blue-50/40 to-indigo-50/20 shadow-blue-500/10 scale-102 ring-1 ring-blue-500/20 dark:border-blue-500 dark:from-blue-950/20 dark:to-slate-900"
                      : "border-slate-200/80 bg-white hover:border-slate-350 dark:border-slate-850 dark:bg-slate-900/50 dark:hover:border-slate-700"
                  }`}
              >
                <div className="flex items-start justify-between">
                  {/* First letter stylized avatar */}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-black text-sm transition-colors duration-300
                    ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350 group-hover:bg-blue-50 group-hover:text-blue-500 dark:group-hover:bg-blue-900/30"
                    }`}>
                    {initial}
                  </div>
                  
                  {isActive && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                </div>
                
                <p className="mt-4.5 font-bold text-slate-800 dark:text-slate-200 truncate" title={sub.name}>
                  {sub.name}
                </p>
                <p className="mt-1 text-xs text-slate-400 font-semibold">{sub.count} {sub.count === 1 ? "MCQ" : "MCQs"}</p>
              </div>
            );
          })}

          {/* Add New Subject Card */}
          <div
            onClick={handleCreateNewSubject}
            className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-5 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 dark:border-slate-850 dark:hover:border-blue-500 dark:hover:bg-blue-950/15 cursor-pointer"
          >
            <div className="rounded-full bg-slate-100 p-2 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors dark:bg-slate-850 dark:group-hover:bg-blue-500">
              <Plus size={18} />
            </div>
            <p className="mt-3 font-extrabold text-sm text-slate-500 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400">
              Add Subject Card
            </p>
          </div>
        </div>
      </div>

      {/* Action panel (Search, status filters, and counts) */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-850 p-4 rounded-2xl shadow-sm">
        {/* Left side filters */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search questions, options or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-955 dark:text-slate-200 dark:focus:border-blue-500"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-550 whitespace-nowrap">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-650 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350 dark:focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Right side showing current selection descriptor */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-bold text-slate-400">
          <span>
            Showing <strong className="text-slate-700 dark:text-slate-200">{filteredMCQs.length}</strong> of{" "}
            <strong className="text-slate-700 dark:text-slate-200">{mcqs.length}</strong> MCQs
          </span>
          {selectedSubject !== "All" && (
            <button
              onClick={() => setSelectedSubject("All")}
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-extrabold text-blue-600 hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400"
            >
              Clear Filter <span className="text-[9px] font-black">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* MCQs content list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/40"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
          </div>
          <p className="mt-4.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Querying database and fetching MCQ catalog...
          </p>
        </div>
      ) : filteredMCQs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-slate-850 dark:bg-slate-900/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400">
            <BookOpenCheck size={26} />
          </div>
          <h3 className="mt-5 text-lg font-bold text-slate-800 dark:text-slate-200">No Questions Found</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
            {selectedSubject !== "All"
              ? `No MCQs are registered under "${selectedSubject}" subject card matching filters. Add a question to get started.`
              : "No MCQs found matching your current search parameters. Clear filters to see full list."}
          </p>
          
          <button
            onClick={handleOpenCreateModal}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} /> Create First MCQ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMCQs.map((item, index) => {
            const isExpanded = !!expandedMCQs[item.id];
            
            return (
              <div
                key={item.id}
                onClick={() => toggleAccordion(item.id)}
                className={`overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-300 hover:border-slate-350 dark:bg-slate-900/40 cursor-pointer
                  ${
                    isExpanded
                      ? "border-blue-450 dark:border-blue-900 ring-1 ring-blue-500/10 shadow-sm"
                      : "border-slate-100 hover:shadow-sm dark:border-slate-850"
                  }`}
              >
                {/* Accordion header */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    {/* Index badge */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-650 dark:bg-blue-950/60 dark:text-blue-400">
                      #{index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* Subject Badge */}
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <Tag size={10} />
                          {item.subject}
                        </span>
                        
                        {/* Marks Badge */}
                        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-650 dark:bg-indigo-950/50 dark:text-indigo-400">
                          <Sparkles size={10} />
                          {item.marks} {item.marks === 1 ? "Mark" : "Marks"}
                        </span>

                        {/* Status Badge */}
                        <span
                          onClick={(e) => handleToggleStatus(item, e)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-extrabold cursor-pointer transition-colors
                            ${
                              item.status === "Active"
                                ? "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400"
                                : "bg-red-50 text-red-655 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400"
                            }`}
                        >
                          {item.status === "Active" ? (
                            <>
                              <CheckCircle2 size={10} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={10} /> Inactive
                            </>
                          )}
                        </span>
                      </div>
                      
                      {/* Question Content preview */}
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed pr-6">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  {/* Actions buttons & Chevron */}
                  <div className="flex items-center justify-end gap-3.5 border-t border-slate-50 pt-3 sm:border-0 sm:pt-0 shrink-0">
                    <button
                      onClick={(e) => handleOpenEditModal(item, e)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-850 cursor-pointer"
                      title="Edit MCQ"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      onClick={(e) => handleDeleteMCQ(item.id, e)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-xs transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-red-950/30 cursor-pointer"
                      title="Delete MCQ"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="text-slate-400 dark:text-slate-500 pl-1.5 hidden sm:block">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Accordion panel content */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-850 dark:bg-slate-900/20 transition-all duration-300">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5">
                      <FileQuestion size={12} /> Options
                    </h4>

                    {/* Options list */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {item.options?.map((opt, i) => {
                        const optLetter = String.fromCharCode(65 + i); // A, B, C, D
                        const isCorrect = opt === item.correctAnswer;
                        
                        return (
                          <div
                            key={i}
                            className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all
                              ${
                                isCorrect
                                  ? "border-green-500/30 bg-green-500/5 text-green-700 ring-1 ring-green-500/10 dark:border-green-800/30 dark:bg-green-950/20 dark:text-green-455"
                                  : "border-slate-200/50 bg-white text-slate-650 dark:border-slate-850 dark:bg-slate-950"
                              }`}
                          >
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold
                              ${
                                isCorrect
                                  ? "bg-green-500 text-white"
                                  : "bg-slate-100 text-slate-550 dark:bg-slate-850 dark:text-slate-400"
                              }`}>
                              {optLetter}
                            </span>
                            <span className="text-sm font-semibold leading-relaxed break-words">{opt}</span>
                            {isCorrect && (
                              <span className="ml-auto text-green-600 dark:text-green-500">
                                <CheckCircle2 size={16} />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation section */}
                    {item.explanation && (
                      <div className="mt-5 rounded-xl border border-slate-100 bg-amber-500/5 p-4 dark:border-slate-850 dark:bg-amber-950/10">
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                          <AlertCircle size={12} /> Solution Explanation
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                          {item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-2xl transform rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4.5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="text-blue-500" size={18} />
                {editingMCQ ? "Edit MCQ Details" : "Add New MCQ Question"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-850 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {/* Subject Info Pre-filled badge */}
              {selectedSubject !== "All" && !editingMCQ && (
                <div className="rounded-xl bg-blue-50 p-3.5 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
                      Subject Auto-populated
                    </p>
                    <p className="text-[11px] text-blue-600/85 dark:text-blue-300/80 mt-0.5">
                      Because you clicked the <strong>{selectedSubject}</strong> card, this question is automatically linked.
                    </p>
                  </div>
                </div>
              )}

              {/* Subject field */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Subject Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics, Chemistry, React"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={selectedSubject !== "All" && !editingMCQ}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-blue-500
                    ${
                      selectedSubject !== "All" && !editingMCQ
                        ? "border-slate-200 bg-slate-100 font-semibold text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-950 dark:text-slate-450"
                        : "border-slate-200 bg-slate-50/50 focus:bg-white dark:border-slate-800 dark:bg-slate-955 dark:text-slate-200 dark:focus:border-blue-500"
                    }`}
                />
              </div>

              {/* Question Text */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Question Statement
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter your question statement here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500"
                  required
                />
              </div>

              {/* Options fields */}
              <div className="space-y-3.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Multiple Choice Options
                </label>
                
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {/* Option A */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      A
                    </span>
                    <input
                      type="text"
                      placeholder="Option A content"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-12 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                      required
                    />
                  </div>

                  {/* Option B */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      B
                    </span>
                    <input
                      type="text"
                      placeholder="Option B content"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-12 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                      required
                    />
                  </div>

                  {/* Option C */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      C
                    </span>
                    <input
                      type="text"
                      placeholder="Option C content"
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-12 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                      required
                    />
                  </div>

                  {/* Option D */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      D
                    </span>
                    <input
                      type="text"
                      placeholder="Option D content"
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-12 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Correct Answer Selection Radio-grid */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Mark Correct Option
                </label>
                
                <div className="grid grid-cols-4 gap-2">
                  {["A", "B", "C", "D"].map((opt) => {
                    const isSelected = correctOption === opt;
                    let boundText = "";
                    if (opt === "A") boundText = optionA;
                    else if (opt === "B") boundText = optionB;
                    else if (opt === "C") boundText = optionC;
                    else if (opt === "D") boundText = optionD;

                    return (
                      <div
                        key={opt}
                        onClick={() => setCorrectOption(opt)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer select-none
                          ${
                            isSelected
                              ? "border-green-500 bg-green-500/5 text-green-700 dark:bg-green-950/20 dark:text-green-455"
                              : "border-slate-200 bg-slate-55 hover:border-slate-350 dark:border-slate-850 dark:bg-slate-955 dark:hover:border-slate-700"
                          }`}
                      >
                        <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black
                          ${
                            isSelected
                              ? "bg-green-500 text-white"
                              : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}>
                          {opt}
                        </span>
                        
                        <p className="mt-1 text-[10px] font-semibold truncate max-w-full text-slate-400">
                          {boundText.trim() ? boundText : "Empty..."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Marks & Status in row */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Marks */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400">
                    Question Weightage (Marks)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-55 px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-955 dark:text-slate-200"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400">
                    Publishing Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-55 px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Explanation textarea */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Solution Explanation (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why the selected correct option is correct..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-55 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-955 dark:text-slate-200"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4.5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-850 cursor-pointer"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
                >
                  {editingMCQ ? "Save Changes" : "Publish MCQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
