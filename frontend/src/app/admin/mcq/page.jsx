"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  Plus,
  ArrowLeft,
  Search,
  Trash2,
  Pencil,
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

import { getMCQs, createMCQ, updateMCQ, deleteMCQ, createBulkMCQs } from "./data";
import { getExamInformation } from "../exam-information/data";

function MCQAdminPageInner() {
  const router = useRouter();
  const [mcqs, setMcqs] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingMCQ, setEditingMCQ] = useState(null);

  // Accordion state (expanded MCQs by ID)
  const [expandedMCQs, setExpandedMCQs] = useState({});

  // Form fields
  const [examId, setExamId] = useState("");
  const [subject, setSubject] = useState("");
  
  // Unified list of questions in the form
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctOption: "A", marks: 1, explanation: "" }
  ]);

  const searchParams = useSearchParams();
  const paramExamId = searchParams ? (searchParams.get("examId") || searchParams.get("courseId")) : "";
  const paramLaunchCreate = searchParams ? searchParams.get("launchCreate") : "";

  // Fetch MCQs and Exam Info
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [mcqData, examData] = await Promise.all([
        getMCQs(),
        getExamInformation().catch((err) => {
          console.error("Failed to load exams", err);
          return [];
        })
      ]);
      setMcqs(mcqData || []);
      setExams(examData || []);
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
    fetchAllData();
  }, [fetchAllData]);

  // Handle URL query parameters to auto-launch MCQ form
  useEffect(() => {
    if (paramLaunchCreate === "true" && paramExamId && exams.length > 0) {
      setExamId(paramExamId);
      // Pre-fill subject if matching exam is found
      const matchedExam = exams.find((e) => e._id === paramExamId);
      if (matchedExam) {
        setSubject("");
      }
      setQuestions([
        { question: "", options: ["", "", "", ""], correctOption: "A", marks: 1, explanation: "" }
      ]);
      setShowForm(true);
    }
  }, [paramLaunchCreate, paramExamId, exams]);

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
        item.subject?.toLowerCase().trim() !==
          selectedSubject.toLowerCase().trim()
      ) {
        return false;
      }
      // Filter by search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const qMatch = item.question?.toLowerCase().includes(query);
        const sMatch = item.subject?.toLowerCase().includes(query);
        const eMatch = item.explanation?.toLowerCase().includes(query);
        const examMatch = item.examId?.examName?.toLowerCase().includes(query);
        const oMatch = item.options?.some((opt) =>
          opt?.toLowerCase().includes(query),
        );
        return qMatch || sMatch || eMatch || oMatch || examMatch;
      }
      return true;
    });
  }, [mcqs, selectedSubject, search]);

  // Total metrics
  const stats = useMemo(() => {
    const total = mcqs.length;
    const uniqueSubjects = subjectsList.length;
    const totalMarks = mcqs.reduce((acc, curr) => acc + (curr.marks || 1), 0);

    return { total, uniqueSubjects, totalMarks };
  }, [mcqs, subjectsList]);

  // Accordion toggle handler
  const toggleAccordion = (id) => {
    setExpandedMCQs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Open form for Create
  const handleOpenCreateModal = () => {
    setEditingMCQ(null);
    setExamId("");
    setSubject(selectedSubject !== "All" ? selectedSubject : "");
    setQuestions([
      { question: "", options: ["", "", "", ""], correctOption: "A", marks: 1, explanation: "" }
    ]);
    setShowForm(true);
  };

  // Open form for Edit
  const handleOpenEditModal = (mcq, e) => {
    e.stopPropagation();
    setEditingMCQ(mcq);
    setExamId(mcq.examId?._id || mcq.examId || "");
    setSubject(mcq.subject || "");

    const idx = mcq.options.indexOf(mcq.correctAnswer);
    let correctLetter = "A";
    if (idx === 1) correctLetter = "B";
    else if (idx === 2) correctLetter = "C";
    else if (idx === 3) correctLetter = "D";

    setQuestions([
      {
        question: mcq.question || "",
        options: [
          mcq.options[0] || "",
          mcq.options[1] || "",
          mcq.options[2] || "",
          mcq.options[3] || ""
        ],
        correctOption: correctLetter,
        marks: mcq.marks || 1,
        explanation: mcq.explanation || ""
      }
    ]);
    setShowForm(true);
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

        setTimeout(() => {
          setEditingMCQ(null);
          setExamId("");
          setSubject(newSub);
          setQuestions([
            { question: "", options: ["", "", "", ""], correctOption: "A", marks: 1, explanation: "" }
          ]);
          setShowForm(true);
        }, 1000);
      }
    });
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
          setLoading(true);
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
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Submit single or bulk MCQ form
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!examId) {
      Swal.fire("Validation Error", "Exam Schedule is required.", "warning");
      return;
    }
    if (!subject.trim()) {
      Swal.fire("Validation Error", "Subject Category is required.", "warning");
      return;
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        Swal.fire("Validation Error", `Question #${i + 1} Statement is required.`, "warning");
        return;
      }
      if (!q.options[0].trim() || !q.options[1].trim() || !q.options[2].trim() || !q.options[3].trim()) {
        Swal.fire("Validation Error", `Question #${i + 1} requires all 4 options.`, "warning");
        return;
      }
    }

    // Format all questions
    const formattedQuestions = questions.map((q) => {
      let targetCorrectAnswer = "";
      const optionsTrimmed = q.options.map(o => o.trim());
      if (q.correctOption === "A") targetCorrectAnswer = optionsTrimmed[0];
      else if (q.correctOption === "B") targetCorrectAnswer = optionsTrimmed[1];
      else if (q.correctOption === "C") targetCorrectAnswer = optionsTrimmed[2];
      else if (q.correctOption === "D") targetCorrectAnswer = optionsTrimmed[3];

      return {
        examId,
        subject: subject.trim(),
        question: q.question.trim(),
        options: optionsTrimmed,
        correctAnswer: targetCorrectAnswer,
        marks: Number(q.marks) || 1,
        explanation: q.explanation.trim(),
      };
    });

    try {
      setLoading(true);
      if (editingMCQ) {
        // Edit mode (always single question update)
        const res = await updateMCQ(editingMCQ.id, formattedQuestions[0]);
        if (res.success) {
          Swal.fire({
            title: "Updated!",
            text: "MCQ updated successfully.",
            icon: "success",
            confirmButtonColor: "#3b82f6",
          });
          fetchAllData();
          setShowForm(false);
        } else {
          throw new Error(res.message);
        }
      } else {
        // Create mode (can be single or bulk based on length)
        if (formattedQuestions.length === 1) {
          const res = await createMCQ(formattedQuestions[0]);
          if (res.success) {
            Swal.fire({
              title: "Created!",
              text: "MCQ created successfully.",
              icon: "success",
              confirmButtonColor: "#3b82f6",
            });
            fetchAllData();
            setShowForm(false);
            router.push("/admin/exam-information");
          } else {
            throw new Error(res.message);
          }
        } else {
          // Bulk questions create
          const res = await createBulkMCQs(formattedQuestions);
          if (res.success) {
            fetchAllData();
            Swal.fire({
              title: "Success!",
              text: `${res.data?.length || formattedQuestions.length} MCQs published successfully.`,
              icon: "success",
              confirmButtonColor: "#3b82f6",
            });
            setShowForm(false);
            router.push("/admin/exam-information");
          } else {
            throw new Error(res.message);
          }
        }
      }
    } catch (err) {
      Swal.fire("Error!", err.message || "Operation failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <title>Manage MCQs | Admin Panel</title>

      {!showForm ? (
        <>
          {/* Header section */}
          <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                  MCQ Pool Management
                </span>
              </h1>
              <p className="mt-2 text-sm text-slate-555 dark:text-slate-400">
                Publish questions, categorize into subject cards, and review answers
                with explanations.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <Link
                href="/admin/exam-information"
                className="btn-secondary py-2.5 px-4 text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                Back
              </Link>

              <button
                onClick={fetchAllData}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-855 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800 cursor-pointer"
                title="Reload Data"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>

              <button
                onClick={handleOpenCreateModal}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <Plus size={18} />
                Add MCQ
              </button>
            </div>
          </div>

          {/* Stats Cards Section */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all hover:shadow-md">
              <div className="flex items-center justify-between text-blue-500 dark:text-blue-400">
                <HelpCircle size={22} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Total
                </span>
              </div>
              <p className="mt-4 text-2xl font-black text-slate-800 dark:text-slate-100">
                {stats.total}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Questions Pool
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all hover:shadow-md">
              <div className="flex items-center justify-between text-green-500">
                <CheckCircle2 size={22} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Unique Cards
                </span>
              </div>
              <p className="mt-4 text-2xl font-black text-slate-800 dark:text-slate-100">
                {stats.uniqueSubjects}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Subject Categories
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all hover:shadow-md">
              <div className="flex items-center justify-between text-indigo-500">
                <Sparkles size={22} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Total Weight
                </span>
              </div>
              <p className="mt-4 text-2xl font-black text-slate-800 dark:text-slate-100">
                {stats.totalMarks}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Cumulative Marks
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search MCQs by statement, subject or exam..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200/80 bg-white py-3 pl-12 pr-4 text-xs text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Subjects Navigation Tabs */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-100 pb-4 dark:border-slate-800/85">
            <button
              onClick={() => setSelectedSubject("All")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedSubject === "All"
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-955"
                  : "bg-slate-50 text-slate-555 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              All Subjects ({mcqs.length})
            </button>

            {subjectsList.map((sub) => (
              <button
                key={sub.name}
                onClick={() => setSelectedSubject(sub.name)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedSubject === sub.name
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10"
                    : "bg-slate-50 text-slate-555 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <Tag size={12} />
                {sub.name} ({sub.count})
              </button>
            ))}

            <button
              onClick={handleCreateNewSubject}
              className="rounded-xl border border-dashed border-slate-300 px-4 py-2 text-xs font-bold text-slate-455 hover:border-slate-400 hover:text-slate-655 dark:border-slate-800 dark:text-slate-500 dark:hover:text-slate-400 transition-all cursor-pointer flex items-center gap-1.5"
            >
              + Create Card
            </button>
          </div>

          {/* MCQs Listing Block */}
          {filteredMCQs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200/80 bg-white py-14 text-center dark:border-slate-855 dark:bg-slate-900/40 transition-colors duration-300">
              <HelpCircle className="mx-auto text-slate-300 dark:text-slate-700" size={48} />
              <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-205">
                No MCQs Found
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                Try refining your search keyword, select another subject tab, or create a new question.
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
              >
                Add First MCQ Card
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMCQs.map((item, index) => {
                const isExpanded = !!expandedMCQs[item.id];
                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300"
                  >
                    {/* Accordion Header */}
                    <div
                      onClick={() => toggleAccordion(item.id)}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer select-none"
                    >
                      <div className="flex flex-1 items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-[11px] font-bold text-primary-655 dark:bg-primary-950/40 dark:text-primary-400">
                          #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-655 dark:bg-slate-800 dark:text-slate-300">
                              <Tag size={9} /> {item.subject}
                            </span>

                            {/* Exam Badge */}
                            {item.examId && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900/55 dark:text-blue-400">
                                <BookOpenCheck size={10} />
                                {item.examId.examName || "Exam"}
                              </span>
                            )}

                            {/* Marks Badge */}
                            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                              <Sparkles size={10} />
                              {item.marks} {item.marks === 1 ? "Mark" : "Marks"}
                            </span>
                          </div>

                          {/* Question Content preview */}
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed pr-6">
                            {item.question}
                          </h3>
                        </div>
                      </div>

                      {/* Action buttons panel */}
                      <div className="flex items-center justify-end gap-2 shrink-0 border-t border-slate-50/50 pt-2 sm:border-0 sm:pt-0">
                        <button
                          onClick={(e) => handleOpenEditModal(item, e)}
                          className="rounded-lg bg-amber-50 p-2 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                          title="Edit MCQ"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteMCQ(item.id, e)}
                          className="rounded-lg bg-rose-50 p-2 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                          title="Delete MCQ"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="text-slate-400 dark:text-slate-50 p-1">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {/* Accordion Expandable Options Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/20 px-6 py-5.5 dark:border-slate-800/80 dark:bg-slate-900/20">
                        <div className="grid gap-3 sm:grid-cols-2">
                          {item.options.map((opt, optIdx) => {
                            const optLetter = ["A", "B", "C", "D"][optIdx];
                            const isCorrect = opt === item.correctAnswer;
                            return (
                              <div
                                key={optIdx}
                                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold transition-all ${
                                  isCorrect
                                    ? "border-green-500/50 bg-green-500/5 text-green-700 dark:border-green-500/30 dark:bg-green-950/10 dark:text-green-400"
                                    : "border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350"
                                }`}
                              >
                                <span
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-black ${
                                    isCorrect
                                      ? "bg-green-500 text-white"
                                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                  }`}
                                >
                                  {optLetter}
                                </span>
                                <span className="truncate flex-1 pr-2">{opt}</span>
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
                          <div className="mt-5 rounded-xl border border-slate-100 bg-amber-500/5 p-4 dark:border-slate-855 dark:bg-amber-900/10">
                            <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                              <AlertCircle size={12} /> Solution Explanation
                            </h4>
                            <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-semibold">
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
        </>
      ) : (
        <div className="mx-auto max-w-4xl p-6 md:p-10 rounded-3xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-955 dark:text-white">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                  {editingMCQ ? "Edit MCQ Details" : "Add New MCQ Question"}
                </span>
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                {editingMCQ
                  ? "Update question configurations, choices and explanation."
                  : "Create new test questions for online schedules."}
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Subject Info Pre-filled badge */}
            {selectedSubject !== "All" && !editingMCQ && (
              <div className="rounded-xl bg-blue-55 p-3.5 dark:bg-blue-900/35 border border-blue-100 dark:border-blue-900/30 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-blue-555 mt-0.5" />
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

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-555 dark:text-slate-400">
                Exam Schedule
              </label>
              <select
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                required
              >
                <option value="">Select Exam Schedule</option>
                {exams.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.examName} ({ex.venue})
                  </option>
                ))}
              </select>
            </div>

            {/* Subject field */}
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-555 dark:text-slate-400">
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
                      ? "border-slate-200 bg-slate-100 font-semibold text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                      : "border-slate-200 bg-slate-50/50 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-500"
                  }`}
                required
              />
            </div>

            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 space-y-5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-405 animate-pulse">
                      Question #{qIdx + 1}
                    </span>
                    {questions.length > 1 && !editingMCQ && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuestions(prev => prev.filter((_, idx) => idx !== qIdx));
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  {/* Question Statement */}
                  <div>
                    <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-slate-555 dark:text-slate-400">
                      Question Statement
                    </label>
                    <textarea
                      id={`questionStatementInput-${qIdx}`}
                      rows={3}
                      placeholder="Type the question content here..."
                      value={q.question}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions(prev => prev.map((item, idx) => idx === qIdx ? { ...item, question: val } : item));
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                      required
                    />
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-3.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-555 dark:text-slate-400">
                      Multiple Choice Options
                    </label>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      {["A", "B", "C", "D"].map((optLetter, optIdx) => (
                        <div key={optLetter} className="relative">
                          <span className="absolute left-3.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {optLetter}
                          </span>
                          <input
                            type="text"
                            placeholder={`Option ${optLetter} content`}
                            value={q.options[optIdx]}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQuestions(prev => prev.map((item, idx) => {
                                if (idx === qIdx) {
                                  const newOpts = [...item.options];
                                  newOpts[optIdx] = val;
                                  return { ...item, options: newOpts };
                                }
                                return item;
                              }));
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-12 pr-4 text-sm text-slate-705 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correct Option Marking */}
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-555 dark:text-slate-400">
                      Mark Correct Option
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["A", "B", "C", "D"].map((opt) => {
                        const isSelected = q.correctOption === opt;
                        let boundText = q.options[["A", "B", "C", "D"].indexOf(opt)] || "";

                        return (
                          <div
                            key={opt}
                            onClick={() => {
                              setQuestions(prev => prev.map((item, idx) => idx === qIdx ? { ...item, correctOption: opt } : item));
                            }}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer select-none ${
                              isSelected
                                ? "border-green-500 bg-green-500/5 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                                : "border-slate-200 bg-slate-50 hover:border-slate-350 dark:border-slate-800 dark:bg-slate-900"
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-black ${
                                isSelected ? "bg-green-500 text-white" : "bg-slate-200 text-slate-655 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                            >
                              {opt}
                            </span>
                            <p className="mt-1.5 text-[10px] font-semibold truncate max-w-full text-slate-400">
                              {boundText.trim() ? boundText : "Empty..."}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Marks */}
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-555 dark:text-slate-400">
                      Question Weightage (Marks)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={q.marks}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 1;
                        setQuestions(prev => prev.map((item, idx) => idx === qIdx ? { ...item, marks: val } : item));
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-205"
                      required
                    />
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-555 dark:text-slate-400">
                      Explanation (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Provide detail on why the selected answer is correct..."
                      value={q.explanation}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions(prev => prev.map((item, idx) => idx === qIdx ? { ...item, explanation: val } : item));
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    />
                  </div>
                </div>
              ))}

              {/* (+) Add Next Question fields button (only in create mode) */}
              {!editingMCQ && (
                <button
                  type="button"
                  onClick={() => {
                    setQuestions(prev => [
                      ...prev,
                      { question: "", options: ["", "", "", ""], correctOption: "A", marks: 1, explanation: "" }
                    ]);
                  }}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-slate-250 hover:border-blue-500 text-xs font-bold text-slate-500 hover:text-blue-500 dark:border-slate-800 dark:hover:border-blue-500 transition-all cursor-pointer bg-slate-50/30 dark:bg-slate-900/20 flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  Click here to add next question field
                </button>
              )}
            </div>

            {/* Submit panel */}
            <div className="flex items-center justify-end gap-3.5 border-t border-slate-100 pt-4 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-555 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
              >
                {editingMCQ
                  ? "Save Changes"
                  : questions.length > 1
                  ? `Publish ${questions.length} MCQs`
                  : "Publish MCQ"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function MCQAdminPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/40"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
        </div>
        <p className="mt-4.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Loading MCQ Dashboard...
        </p>
      </div>
    }>
      <MCQAdminPageInner />
    </Suspense>
  );
}
