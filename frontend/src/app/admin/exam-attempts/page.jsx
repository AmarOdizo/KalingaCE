"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { Search, Eye, X, BookOpen, AlertCircle, Phone, Award } from "lucide-react";
import { getAllExamAttempts } from "../../learning/mcq/data";
import Loading from "../exam-information/components/Loading";

export default function ExamAttemptsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExamAttemptsContent />
    </Suspense>
  );
}

function ExamAttemptsContent() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const data = await getAllExamAttempts();
        setAttempts(data || []);
      } catch (err) {
        console.error("Failed to load attempts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const filteredAttempts = useMemo(() => {
    return attempts.filter((att) => {
      const student = (att.studentName || "").toLowerCase();
      const mobile = (att.mobileNumber || "").toLowerCase();
      const exam = (att.examId?.examName || "").toLowerCase();
      const query = search.toLowerCase();
      return student.includes(query) || mobile.includes(query) || exam.includes(query);
    });
  }, [attempts, search]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full p-6 md:p-8 transition-colors duration-300">
      <title>Exam Attempts & Results | Admin Panel</title>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
          <span className="gradient-text">Exam Attempts</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Monitor student quiz participation, verify registration info, and view full submission scores.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, mobile, or exam name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/70 py-2.5 pl-11 pr-4 outline-none text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 placeholder:text-slate-400 focus:border-primary-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-555 dark:text-slate-400 shrink-0">
          Showing {filteredAttempts.length} of {attempts.length} attempts
        </div>
      </div>

      {/* Attempts Table */}
      {filteredAttempts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 py-16 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/20">
          <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No exam attempts found</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting search filters or verify backend submissions.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60">
          <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
              <tr>
                <th className="py-4.5 px-6">Student Details</th>
                <th className="py-4.5 px-6">Exam Name</th>
                <th className="py-4.5 px-6">Score</th>
                <th className="py-4.5 px-6">Submitted Time</th>
                <th className="py-4.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAttempts.map((att) => (
                <tr
                  key={att._id || att.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="py-4.5 px-6 font-semibold text-slate-800 dark:text-white">
                    <div className="flex flex-col">
                      <span>{att.studentName}</span>
                      <span className="text-2xs font-normal text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {att.mobileNumber}
                      </span>
                    </div>
                  </td>
                  <td className="py-4.5 px-6">
                    {att.examId?.examName || <span className="text-slate-400 italic">Unknown Exam</span>}
                  </td>
                  <td className="py-4.5 px-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                      {att.score} / {att.totalPossibleScore}
                    </span>
                  </td>
                  <td className="py-4.5 px-6 text-slate-500 dark:text-slate-405">
                    <div className="flex flex-col">
                      <span>{new Date(att.submittedAt || att.createdAt).toLocaleDateString()}</span>
                      <span className="text-2xs font-normal text-slate-400 mt-0.5">
                        {new Date(att.submittedAt || att.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4.5 px-6 text-center">
                    <button
                      onClick={() => setSelectedAttempt(att)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-xs hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400 dark:hover:bg-slate-800"
                    >
                      <Eye size={12} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Answer Review Detail Report Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-premium dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Award size={20} className="text-indigo-600" /> Answer Key Detail Report
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Reviewing attempt for <strong>{selectedAttempt.studentName}</strong> (Exam: {selectedAttempt.examId?.examName || "Practice"})
                </p>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1">
              <div className="grid gap-3.5 sm:grid-cols-3 text-xs bg-slate-50 p-4 rounded-2xl dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="block text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Student Name:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedAttempt.studentName}</span>
                </div>
                <div>
                  <span className="block text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Mobile Number:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedAttempt.mobileNumber}</span>
                </div>
                <div>
                  <span className="block text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Obtained Score:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedAttempt.score} / {selectedAttempt.totalPossibleScore} Marks</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 dark:text-white mt-6 mb-3">
                📝 Response & Answer Review ({selectedAttempt.answers?.length || 0} questions)
              </h3>

              <div className="space-y-4">
                {(!selectedAttempt.answers || selectedAttempt.answers.length === 0) ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">No detailed answers recorded for this attempt.</p>
                ) : (
                  selectedAttempt.answers.map((ans, index) => (
                    <div
                      key={ans._id || index}
                      className={`rounded-2xl border p-4.5 transition-colors ${
                        ans.isCorrect
                          ? "border-emerald-100 bg-emerald-50/10 dark:border-emerald-950/20 dark:bg-emerald-950/5"
                          : "border-red-100 bg-red-50/10 dark:border-red-950/20 dark:bg-red-950/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <span className="text-xs font-bold text-slate-400">
                          Question {index + 1}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-2xs font-semibold ${
                          ans.isCorrect
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/55 dark:text-emerald-400"
                            : "bg-red-100 text-red-800 dark:bg-red-950/55 dark:text-red-400"
                        }`}>
                          {ans.isCorrect ? "Correct" : "Incorrect"} • {ans.isCorrect ? ans.marks : 0}/{ans.marks} marks
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">
                        {ans.questionText}
                      </p>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                        <div className="rounded-xl bg-slate-100/60 p-2.5 dark:bg-slate-800/40">
                          <span className="block text-slate-400 font-semibold mb-0.5">Chosen:</span>
                          <span className={`font-bold ${
                            ans.isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                          }`}>{ans.chosenAnswer}</span>
                        </div>
                        <div className="rounded-xl bg-emerald-500/5 p-2.5 border border-emerald-500/10">
                          <span className="block text-emerald-600 dark:text-emerald-400 font-semibold mb-0.5">Correct:</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">{ans.correctAnswer}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 pt-4 text-right dark:border-slate-800 shrink-0">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="btn-secondary px-5 py-2.5 text-sm cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
