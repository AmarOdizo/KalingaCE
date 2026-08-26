"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllExamAttempts, getSQAByExam } from "../mcq/data";
import { Search, BookOpen, Award, Phone, Calendar, Trophy, Eye, X, CheckCircle2, XCircle, Check, Percent, BarChart3, GraduationCap, Filter } from "lucide-react";

export default function ResultClient() {
  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All"); // "All", "Exam", "Practice"
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [sqaDetails, setSqaDetails] = useState(null);
  const [loadingSqa, setLoadingSqa] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const data = await getAllExamAttempts();
        data.sort((a, b) => {
          const dateA = new Date(a.submittedAt || a.createdAt);
          const dateB = new Date(b.submittedAt || b.createdAt);
          return dateB - dateA;
        });
        setAttempts(data || []);
      } catch (error) {
        console.error("Error loading attempts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  useEffect(() => {
    if (!selectedAttempt || !selectedAttempt.examId) {
      setSqaDetails(null);
      return;
    }
    const fetchAttemptSqa = async () => {
      try {
        setLoadingSqa(true);
        const targetExamId = selectedAttempt.examId._id || selectedAttempt.examId;
        const data = await getSQAByExam(targetExamId);
        setSqaDetails(data);
      } catch (err) {
        console.error("Failed to load SQA details for attempt:", err);
      } finally {
        setLoadingSqa(false);
      }
    };
    fetchAttemptSqa();
  }, [selectedAttempt]);

  const totalSqaObtainedScore = useMemo(() => {
    const studentSqaAnswers = sqaDetails?.answers?.filter(
      ans => ans.mobileNumber === selectedAttempt?.mobileNumber
    ) || [];
    return studentSqaAnswers.reduce((acc, ans) => acc + (ans.marks || 0), 0);
  }, [sqaDetails, selectedAttempt]);

  const totalSqaPossibleScore = useMemo(() => {
    if (!sqaDetails || !sqaDetails.questions) return 0;
    const studentSqaAnswers = sqaDetails?.answers?.filter(
      ans => ans.mobileNumber === selectedAttempt?.mobileNumber
    ) || [];
    return studentSqaAnswers.reduce((acc, ans) => {
      const q = sqaDetails.questions.find(quest => quest._id === ans.questionId);
      return acc + (q?.maxMarks || 0);
    }, 0);
  }, [sqaDetails, selectedAttempt]);

  const averagePercent = useMemo(() => {
    if (attempts.length === 0) return 0;
    const totalPct = attempts.reduce((acc, curr) => {
      const pct = curr.totalPossibleScore > 0 ? (curr.score / curr.totalPossibleScore) * 100 : 0;
      return acc + pct;
    }, 0);
    return Math.round(totalPct / attempts.length);
  }, [attempts]);

  const passRate = useMemo(() => {
    if (attempts.length === 0) return 0;
    const passed = attempts.filter(att => {
      const pct = att.totalPossibleScore > 0 ? (att.score / att.totalPossibleScore) * 100 : 0;
      return pct >= 40;
    }).length;
    return Math.round((passed / attempts.length) * 100);
  }, [attempts]);

  const topGradesCount = useMemo(() => {
    return attempts.filter(att => {
      const pct = att.totalPossibleScore > 0 ? (att.score / att.totalPossibleScore) * 100 : 0;
      return pct >= 80;
    }).length;
  }, [attempts]);

  const filteredAttempts = useMemo(() => {
    return attempts.filter((att) => {
      // 1. Only include attempts that are published (or practice quizzes without examId)
      const isPublished = !att.examId || att.examId.resultsPublished === true;
      if (!isPublished) return false;

      // 2. Filter by type
      if (filterType === "Exam" && !att.examId) return false;
      if (filterType === "Practice" && att.examId) return false;

      // 3. Search text
      const student = (att.studentName || "").toLowerCase();
      const mobile = (att.mobileNumber || "").toLowerCase();
      const exam = (att.examId?.examName || "").toLowerCase();
      const query = search.toLowerCase();
      return student.includes(query) || mobile.includes(query) || exam.includes(query);
    });
  }, [attempts, search, filterType]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center text-slate-500 dark:bg-slate-955 flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mb-4" />
        <p className="font-semibold text-sm">Loading MCQ Assessment Hub...</p>
      </div>
    );
  }

  const calculateGrade = (pct) => {
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B+";
    if (pct >= 60) return "B";
    if (pct >= 50) return "C";
    return "F";
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Header Banner */}
      <div className="mx-auto max-w-2xl text-center mb-12 space-y-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border border-indigo-250/20 uppercase tracking-widest">
          Student Assessment Hub
        </span>
        <h1 className="text-3xl font-extrabold sm:text-4xl tracking-tight text-slate-900 dark:text-white leading-tight">
          Exam <span className="gradient-text">Results Dashboard</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Access your score reports, check correct answers, and read teacher feedback for submitted examinations.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-4 mb-10 max-w-6xl mx-auto">
        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md flex items-center gap-4 transition hover:scale-[1.01] hover:shadow-md duration-200">
          <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Attempts</span>
            <span className="text-xl font-black text-slate-805 dark:text-white mt-0.5">{attempts.length}</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md flex items-center gap-4 transition hover:scale-[1.01] hover:shadow-md duration-200">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0">
            <BarChart3 size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-405">Class Average</span>
            <span className="text-xl font-black text-slate-805 dark:text-white mt-0.5">{averagePercent}%</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md flex items-center gap-4 transition hover:scale-[1.01] hover:shadow-md duration-200">
          <div className="rounded-2xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 shrink-0">
            <Percent size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-405">Pass Rate</span>
            <span className="text-xl font-black text-slate-805 dark:text-white mt-0.5">{passRate}%</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md flex items-center gap-4 transition hover:scale-[1.01] hover:shadow-md duration-200">
          <div className="rounded-2xl bg-rose-50 p-3 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-405">Top Performers</span>
            <span className="text-xl font-black text-slate-805 dark:text-white mt-0.5">{topGradesCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mx-auto max-w-4xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, mobile, or exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/70 py-3 pl-11 pr-4 outline-none text-sm text-slate-705 dark:border-slate-800 dark:bg-slate-900/50 placeholder:text-slate-400 focus:border-indigo-500 transition-all shadow-sm focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl dark:bg-slate-900/60 border border-slate-200/35 dark:border-slate-800/60 w-full md:w-auto overflow-x-auto">
          {[
            { id: "All", label: "All Results" },
            { id: "Exam", label: "Official Exams" },
            { id: "Practice", label: "Practice Quizzes" }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterType(item.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterType === item.id
                  ? "bg-white text-indigo-650 shadow-sm dark:bg-slate-950 dark:text-indigo-400 border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-250"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-505 dark:text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mb-4" />
          <p className="font-semibold text-sm">Loading exam attempts...</p>
        </div>
      ) : filteredAttempts.length === 0 ? (
        <div className="max-w-4xl mx-auto rounded-3xl border border-dashed border-slate-200 bg-white/50 py-16 text-center text-slate-505 dark:border-slate-800 dark:bg-slate-900/20">
          <BookOpen size={40} className="mx-auto text-slate-350 mb-4" />
          <p className="font-semibold text-slate-700 dark:text-slate-355">No exam attempts found</p>
          <p className="text-xs text-slate-400 mt-1">Please try refining your search query or filter type.</p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Desktop View Table */}
          <div className="hidden md:block max-w-4xl mx-auto overflow-x-auto rounded-3xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
            <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800/80">
                <tr>
                  <th className="py-3.5 px-6">Student Details</th>
                  <th className="py-3.5 px-6">Exam / Subject</th>
                  <th className="py-3.5 px-6 text-center">Score</th>
                  <th className="py-3.5 px-6 text-center">Grade</th>
                  <th className="py-3.5 px-6 text-center">Date</th>
                  <th className="py-3.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredAttempts.map((att) => {
                  const examDateVal = att.submittedAt || att.createdAt;
                  const formattedDate = examDateVal 
                    ? new Date(examDateVal).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })
                    : "-";
                  const percentage = Math.round((att.score / att.totalPossibleScore) * 100) || 0;
                  const grade = calculateGrade(percentage);

                  return (
                    <tr key={att._id || att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex flex-col">
                          <span>{att.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-normal mt-0.5 flex items-center gap-1">
                            <Phone size={10} /> {att.mobileNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                        {att.examId?.examName || "Practice Quiz"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50/55 px-2.5 py-1 text-xs font-bold text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400">
                          {att.score} / {att.totalPossibleScore}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-black ${
                          grade === "A+" || grade === "A"
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : grade === "B+" || grade === "B"
                              ? "bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                              : grade === "C"
                                ? "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400"
                                : "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400"
                        }`}>
                          {grade} ({percentage}%)
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-slate-450 dark:text-slate-500 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          {formattedDate}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedAttempt(att)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-55 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900 border border-indigo-100/30 dark:border-indigo-850/40 rounded-xl transition duration-200 cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Eye size={13} /> Check Result
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Cards) */}
          <div className="block md:hidden space-y-4">
            {filteredAttempts.map((att) => {
              const examDateVal = att.submittedAt || att.createdAt;
              const formattedDate = examDateVal 
                ? new Date(examDateVal).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })
                : "N/A";
              const percentage = Math.round((att.score / att.totalPossibleScore) * 100) || 0;
              const grade = calculateGrade(percentage);

              return (
                <div
                  key={att._id || att.id}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-premium dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-md space-y-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
                        {att.examId?.examName || "Practice Quiz"}
                      </h3>
                      <p className="text-xs text-slate-450 mt-1 font-semibold">
                        Student: <strong className="text-slate-700 dark:text-slate-300">{att.studentName}</strong>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Batch: {att.examId?.batch || "Practice Hub"}
                      </p>
                    </div>
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-black ${
                      grade === "A+" || grade === "A"
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : grade === "B+" || grade === "B"
                          ? "bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                          : grade === "C"
                            ? "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-455"
                    }`}>
                      {grade}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 text-center bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800/40">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-450 uppercase">Gain Mark</span>
                      <span className="text-sm font-black text-indigo-650 dark:text-indigo-400">{att.score}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-450 uppercase">Total Mark</span>
                      <span className="text-sm font-black text-slate-600 dark:text-slate-355">{att.totalPossibleScore}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-405 uppercase">Score %</span>
                      <span className="text-sm font-black text-slate-600 dark:text-slate-355">{percentage}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-150/65 dark:border-slate-800/60">
                    <span className="text-2xs text-slate-455 font-semibold flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" /> {formattedDate}
                    </span>
                    <button
                      onClick={() => setSelectedAttempt(att)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-2xs font-extrabold text-indigo-655 bg-indigo-50/55 hover:bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900 border border-indigo-200/30 dark:border-indigo-850/40 rounded-xl transition duration-150 cursor-pointer"
                    >
                      <Eye size={10} /> Check Result
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Answer Review Detail Report Modal (Student facing, read-only) */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-650 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Award size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                    Answer Key Detail Report
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Reviewing attempt for <strong className="text-slate-700 dark:text-slate-350">{selectedAttempt.studentName}</strong> (Exam: {selectedAttempt.examId?.examName || "Practice"})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="rounded-xl border border-slate-200 p-2 text-slate-450 hover:bg-slate-50 cursor-pointer dark:border-slate-850 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              
              {/* Score ring and Student Summary Information Card side-by-side */}
              <div className="grid gap-6 md:grid-cols-3">
                
                {/* Circular Score Ring Card */}
                {(() => {
                  const combinedObtained = selectedAttempt.score + totalSqaObtainedScore;
                  const combinedTotal = selectedAttempt.totalPossibleScore + totalSqaPossibleScore;
                  const scorePct = combinedTotal > 0 ? Math.round((combinedObtained / combinedTotal) * 100) : 0;
                  const dashoffset = 251.2 - (251.2 * scorePct) / 100;
                  const combinedGrade = calculateGrade(scorePct);

                  return (
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/80">
                      <div className="relative h-28 w-28">
                        <svg className="h-full w-full -rotate-90">
                          <circle
                            cx="56"
                            cy="56"
                            r="40"
                            className="stroke-slate-100 dark:stroke-slate-800"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="56"
                            cy="56"
                            r="40"
                            className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000 ease-out"
                            strokeWidth="8"
                            strokeDasharray="251.2"
                            strokeDashoffset={dashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{scorePct}%</span>
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">Score</span>
                        </div>
                      </div>
                      <div className="mt-3.5 text-center">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-black ${
                          combinedGrade === "A+" || combinedGrade === "A"
                            ? "bg-emerald-50 text-emerald-805 dark:bg-emerald-500/10 dark:text-emerald-450"
                            : combinedGrade === "B+" || combinedGrade === "B"
                              ? "bg-blue-50 text-blue-805 dark:bg-blue-500/10 dark:text-blue-450"
                              : combinedGrade === "C"
                                ? "bg-amber-50 text-amber-850 dark:bg-amber-500/10 dark:text-amber-450"
                                : "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-455"
                        }`}>
                          Grade {combinedGrade}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Student Details Card */}
                <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/40 via-slate-50/50 to-violet-50/40 p-6 dark:from-slate-900/60 dark:via-slate-950/20 dark:to-indigo-950/15 border border-indigo-100/30 dark:border-indigo-950/10 flex flex-col justify-between">
                  <div className="grid gap-6 grid-cols-2 text-xs">
                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Student Name</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">{selectedAttempt.studentName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Mobile Number</span>
                      <span className="text-sm font-black text-slate-805 dark:text-white">{selectedAttempt.mobileNumber}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 font-bold">Exam Date & Time</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                        {new Date(selectedAttempt.submittedAt || selectedAttempt.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Obtained Score Summary</span>
                      <div className="space-y-1 bg-white/70 dark:bg-slate-900/60 p-2 rounded-xl border border-indigo-100/20 dark:border-indigo-950/20 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-500">MCQ score:</span>
                          <span className="font-black text-indigo-650 dark:text-indigo-400">{selectedAttempt.score} / {selectedAttempt.totalPossibleScore}</span>
                        </div>
                        {sqaDetails && sqaDetails.questions && sqaDetails.questions.length > 0 && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-500">Descriptive SQA:</span>
                              <span className="font-black text-violet-650 dark:text-violet-400">+{totalSqaObtainedScore} / {totalSqaPossibleScore}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Section 1: Multiple Choice Questions */}
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-2xs font-extrabold text-indigo-655 dark:bg-indigo-950 dark:text-indigo-400">MCQ</span> Multiple Choice Responses ({selectedAttempt.answers?.length || 0})
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {(!selectedAttempt.answers || selectedAttempt.answers.length === 0) ? (
                    <p className="col-span-2 text-xs text-slate-400 italic text-center py-6 bg-slate-50 rounded-2xl dark:bg-slate-950/20 border border-dashed border-slate-200">No detailed MCQ answers recorded for this attempt.</p>
                  ) : (
                    selectedAttempt.answers.map((ans, index) => (
                      <div
                        key={ans._id || index}
                        className={`rounded-2xl border p-4.5 transition-colors flex flex-col justify-between ${
                          ans.isCorrect
                            ? "border-emerald-100/60 bg-emerald-500/[0.01] dark:border-emerald-950/20 dark:bg-emerald-955/[0.01]"
                            : "border-rose-100/60 bg-rose-500/[0.01] dark:border-rose-955/20 dark:bg-rose-955/[0.01]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="text-[10px] font-bold text-slate-400">
                              Question {index + 1}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-black tracking-wide uppercase ${
                              ans.isCorrect
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-455"
                            }`}>
                              {ans.isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed mb-3">
                            {ans.questionText}
                          </p>
                        </div>

                        <div className="grid gap-2 grid-cols-2 text-[10px] mt-2">
                          <div className="rounded-xl bg-slate-100/50 p-2.5 dark:bg-slate-800/40 border border-slate-200/10 dark:border-slate-800">
                            <span className="block text-[8px] font-bold text-slate-405 uppercase tracking-wider mb-0.5">Your Answer:</span>
                            <span className={`font-black ${
                              ans.isCorrect ? "text-emerald-650 dark:text-emerald-450" : "text-rose-505 dark:text-rose-455"
                            }`}>{ans.chosenAnswer}</span>
                          </div>
                          <div className="rounded-xl bg-emerald-500/[0.04] p-2.5 border border-emerald-500/10 dark:bg-emerald-950/15">
                            <span className="block text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Correct Answer:</span>
                            <span className="font-black text-emerald-700 dark:text-emerald-400">{ans.correctAnswer}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Section 2: Short Answer (SQA) Responses & Grading Section (Read only for students) */}
              {sqaDetails && sqaDetails.questions && sqaDetails.questions.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="rounded-lg bg-violet-50 px-2 py-0.5 text-2xs font-extrabold text-violet-655 dark:bg-violet-950 dark:text-violet-405">SQA</span> Short Answer (SQA) Evaluations
                  </h3>

                  {(() => {
                    const studentSqaAnswers = sqaDetails.answers?.filter(
                      ans => ans.mobileNumber === selectedAttempt.mobileNumber
                    ) || [];

                    if (studentSqaAnswers.length === 0) {
                      return (
                        <p className="text-xs text-slate-450 italic text-center py-6 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                          No descriptive answers submitted for this attempt.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {studentSqaAnswers.map((answer, index) => {
                          const question = sqaDetails.questions.find(q => q._id === answer.questionId);
                          return (
                            <div
                              key={answer._id}
                              className={`rounded-2xl border p-5 transition-colors ${
                                answer.checked
                                  ? answer.isCorrect
                                    ? "border-emerald-100 bg-emerald-500/[0.01] dark:border-emerald-950/20 dark:bg-emerald-955/[0.01]"
                                    : "border-rose-100 bg-rose-500/[0.01] dark:border-rose-955/20 dark:bg-rose-955/[0.01]"
                                  : "border-amber-100 bg-amber-500/[0.01] dark:border-amber-955/20 dark:bg-amber-955/[0.01]"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4 mb-2.5">
                                <span className="text-xs font-black text-slate-400">
                                  Short Answer {index + 1}
                                </span>
                                <span className={`rounded-full px-2.5 py-0.5 text-2xs font-bold ${
                                  answer.checked
                                    ? answer.isCorrect
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                                      : "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-455"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-450 animate-pulse"
                                }`}>
                                  {answer.checked 
                                    ? answer.isCorrect 
                                      ? `Correct • ${answer.marks}/${question?.maxMarks || 0} marks`
                                      : "Incorrect • 0 marks"
                                    : "Pending Grading"}
                                </span>
                              </div>

                              <p className="text-xs font-bold text-slate-805 dark:text-white leading-relaxed mb-3">
                                {question ? question.question : `Question ID: ${answer.questionId}`}
                              </p>

                              <div className="space-y-3">
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 text-xs">
                                  <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Your typed answer:</span>
                                  <p className="font-semibold text-slate-800 dark:text-white whitespace-pre-wrap leading-relaxed">{answer.studentAnswer}</p>
                                </div>
                                
                                {answer.checked ? (
                                  <div className="rounded-xl bg-emerald-500/5 p-3 border border-emerald-500/10 dark:bg-emerald-955/15 text-xs">
                                    <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider mb-1">Teacher Evaluation:</span>
                                    <p className="font-bold text-emerald-700 dark:text-emerald-405">Marks awarded: {answer.marks} / {question?.maxMarks || 5}</p>
                                  </div>
                                ) : (
                                  <div className="rounded-xl bg-amber-500/5 p-3 border border-amber-500/10 dark:bg-amber-955/15 text-xs">
                                    <p className="font-bold text-amber-705 dark:text-amber-400">Descriptive evaluation is currently pending by the instructor.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 p-6 text-right dark:border-slate-800 shrink-0">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="rounded-xl border border-slate-200 bg-white/50 px-6 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800 transition duration-150 cursor-pointer shadow-sm active:scale-95"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
