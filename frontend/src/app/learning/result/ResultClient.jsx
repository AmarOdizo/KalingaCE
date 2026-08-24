"use client";

import { useState, useEffect } from "react";
import { getAllExamAttempts, getSQAByExam } from "../mcq/data";
import { Search, BookOpen, Award, Phone, Calendar, Trophy } from "lucide-react";

export default function ResultClient() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center text-slate-500 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mb-4" />
        <p className="font-semibold text-sm">Loading MCQ Assessment Hub...</p>
      </div>
    );
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.trim();
    if (!cleanMobile) return;

    if (cleanMobile.length !== 10 || isNaN(cleanMobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      
      const allAttempts = await getAllExamAttempts();
      const filtered = allAttempts.filter(
        (att) => att.mobileNumber === cleanMobile
      );
      
      // Sort attempts by date (newest first)
      filtered.sort((a, b) => {
        const dateA = new Date(a.submittedAt || a.createdAt);
        const dateB = new Date(b.submittedAt || b.createdAt);
        return dateB - dateA;
      });

      setAttempts(filtered);
    } catch (error) {
      console.error("Error searching results:", error);
      alert("Failed to retrieve attempts. Please verify network connection.");
    } finally {
      setLoading(false);
    }
  };

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
          Exam <span className="gradient-text">Results & Performance</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Lookup your score reports, check correct answers, and read teacher feedback for submitted examinations.
        </p>
      </div>

      {/* Search Console Card */}
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-premium dark:border-slate-800 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-300 mb-12">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">
              Registered Phone Number
            </label>
            <div className="relative rounded-2xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-550">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                maxLength={10}
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit mobile number"
                className="block w-full rounded-2xl border border-slate-250 bg-white pl-11 pr-4 py-3.5 text-sm text-slate-850 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 py-3.5 px-4 font-bold text-white shadow-premium transition hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Search size={18} />
            )}
            Search Results
          </button>
        </form>
      </div>

      {/* Guide Banner when not searched yet */}
      {!searched && (
        <div className="mx-auto max-w-xl text-center p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
          <BookOpen className="mx-auto text-indigo-500/80 mb-3.5" size={32} />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-355">Looking for your scores?</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Enter the 10-digit phone number you used during your exam registration. Your detailed exam metrics, MCQ answers, and tutor grades will appear instantly.
          </p>
        </div>
      )}

      {/* Attempts List Section */}
      {searched && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Summary Row */}
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              Attempt History ({attempts.length})
            </h2>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 dark:bg-slate-950 px-4 py-2 border border-slate-200/50 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              Searched Phone: <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{mobileNumber}</span>
            </div>
          </div>

          {attempts.length === 0 ? (
            <div className="max-w-4xl mx-auto rounded-3xl border border-dashed border-slate-200 bg-white/50 py-16 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/20">
              <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="font-semibold text-slate-700 dark:text-slate-355">No exam attempts found</p>
              <p className="text-xs text-slate-400 mt-1">Please verify the mobile number or try again later.</p>
            </div>
          ) : (
            <>
              {/* Desktop View Table */}
              <div className="hidden md:block max-w-4xl mx-auto overflow-x-auto rounded-3xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
                <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-900/80 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4.5">Student Name</th>
                      <th className="py-3 px-4.5">Exam / Subject</th>
                      <th className="py-3 px-4.5">Batch</th>
                      <th className="py-3 px-4.5 text-center">Gain Mark</th>
                      <th className="py-3 px-4.5 text-center">Total Mark</th>
                      <th className="py-3 px-4.5 text-center">Grade</th>
                      <th className="py-3 px-4.5 text-center">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {attempts.map((att) => {
                      const examDateVal = att.submittedAt || att.createdAt;
                      const formattedDate = examDateVal 
                        ? new Date(examDateVal).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })
                        : "-";
                      const percentage = Math.round((att.score / att.totalPossibleScore) * 100) || 0;
                      const grade = calculateGrade(percentage);

                      return (
                        <tr key={att._id || att.id} className="hover:bg-slate-50/40 even:bg-slate-50/[0.15] dark:hover:bg-slate-900/20 dark:even:bg-slate-950/10 transition-colors">
                          <td className="py-3.5 px-4.5 font-bold text-slate-900 dark:text-white">
                            {att.studentName}
                          </td>
                          <td className="py-3.5 px-4.5 font-semibold text-slate-700 dark:text-slate-300">
                            {att.examId?.examName || "Practice Exam"}
                          </td>
                          <td className="py-3.5 px-4.5 text-slate-500 dark:text-slate-405 font-medium">
                            {att.examId?.batch || "-"}
                          </td>
                          <td className="py-3.5 px-4.5 text-center font-extrabold text-indigo-650 dark:text-indigo-400">
                            {att.score}
                          </td>
                          <td className="py-3.5 px-4.5 text-center font-bold text-slate-500 dark:text-slate-400">
                            {att.totalPossibleScore}
                          </td>
                          <td className="py-3.5 px-4.5 text-center">
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
                          <td className="py-3.5 px-4.5 text-center text-slate-450 dark:text-slate-500 text-xs font-semibold">
                            {formattedDate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View (Cards) */}
              <div className="block md:hidden space-y-4">
                {attempts.map((att) => {
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
                            {att.examId?.examName || "Practice Exam"}
                          </h3>
                          <p className="text-xs text-slate-450 mt-1 font-semibold">
                            Student: <strong className="text-slate-700 dark:text-slate-300">{att.studentName}</strong>
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Batch: {att.examId?.batch || "-"}
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
                          <span className="block text-[9px] font-bold text-slate-400 uppercase">Gain Mark</span>
                          <span className="text-sm font-black text-indigo-650 dark:text-indigo-400">{att.score}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase">Total Mark</span>
                          <span className="text-sm font-black text-slate-600 dark:text-slate-355">{att.totalPossibleScore}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase">Score %</span>
                          <span className="text-sm font-black text-slate-600 dark:text-slate-355">{percentage}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-150/65 dark:border-slate-800/60">
                        <span className="text-2xs text-slate-400 font-semibold flex items-center gap-1">
                          <Calendar size={12} /> {formattedDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
