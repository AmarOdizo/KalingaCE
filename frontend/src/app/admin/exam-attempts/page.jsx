"use client";

import { useEffect, useState, useMemo, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Eye, X, BookOpen, AlertCircle, Phone, Award, CheckCircle2, XCircle, Check, Trophy, Send } from "lucide-react";
import { getAllExamAttempts, updateExamAttemptScore } from "../../learning/mcq/data";
import { getSQAByExamId, checkAnswer } from "../sqa/data";
import Loading from "../exam-information/components/Loading";
import AdminAgGrid from "@/components/AdminAgGrid";
import { togglePublishResults } from "../exam-information/data";

export default function ExamAttemptsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExamAttemptsContent />
    </Suspense>
  );
}

function ExamAttemptsContent() {
  const searchParams = useSearchParams();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const columnDefs = useMemo(() => [
    {
      headerName: "Student Details",
      field: "studentName",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params) => {
        const att = params.data;
        return (
          <div className="flex flex-col justify-center h-full">
            <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{att.studentName}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Phone size={10} /> {att.mobileNumber}
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Exam Name",
      field: "examId.examName",
      flex: 1.5,
      minWidth: 180,
      cellRenderer: (params) => {
        const att = params.data;
        const examName = att.examId?.examName || "Unknown Exam";
        const isPublished = att.examId?.resultsPublished || false;
        return (
          <div className="flex flex-col justify-center h-full">
            <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{examName}</span>
            {att.examId && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-0.5 ${
                isPublished ? "text-emerald-650 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-slate-350 dark:bg-slate-600"}`}></span>
                {isPublished ? "Published" : "Draft / Unreleased"}
              </span>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Score",
      field: "score",
      width: 120,
      minWidth: 100,
      cellRenderer: (params) => {
        const att = params.data;
        return (
          <div className="flex items-center h-full">
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-750 dark:bg-indigo-500/10 dark:text-indigo-400">
              {att.score} / {att.totalPossibleScore}
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Submitted Time",
      field: "submittedAt",
      flex: 1.2,
      minWidth: 130,
      cellRenderer: (params) => {
        const dateVal = params.value || params.data.createdAt;
        if (!dateVal) return <span className="flex items-center h-full">-</span>;
        const dateObj = new Date(dateVal);
        return (
          <div className="flex flex-col justify-center h-full gap-0.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {dateObj.toLocaleDateString()}
            </span>
            <span className="text-2xs text-slate-450 dark:text-slate-500">
              {dateObj.toLocaleTimeString()}
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Action",
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full w-full">
          <button
            onClick={() => setSelectedAttempt(params.data)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-indigo-655 hover:bg-indigo-50 hover:text-indigo-750 dark:border-slate-800 dark:bg-slate-950 dark:text-indigo-400 dark:hover:bg-slate-900 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <Eye size={12} /> View Details
          </button>
        </div>
      ),
      width: 150,
      minWidth: 130,
      sortable: false,
      filter: false,
    },
  ], []);

  const [sqaDetails, setSqaDetails] = useState(null);
  const [loadingSqa, setLoadingSqa] = useState(false);
  const [gradingMarksMap, setGradingMarksMap] = useState({});

  const selectedAttemptId = selectedAttempt?._id;
  const selectedExamId = selectedAttempt?.examId?._id || selectedAttempt?.examId;
  const selectedMobileNumber = selectedAttempt?.mobileNumber;

  useEffect(() => {
    if (!selectedAttemptId || !selectedExamId) {
      setTimeout(() => {
        setSqaDetails(null);
        setGradingMarksMap({});
      }, 0);
      return;
    }
    const fetchAttemptSqa = async () => {
      try {
        setLoadingSqa(true);
        const data = await getSQAByExamId(selectedExamId);
        setSqaDetails(data);
        
        if (data && data.answers) {
          const initialMarks = {};
          data.answers.forEach(ans => {
            if (ans.mobileNumber === selectedMobileNumber) {
              initialMarks[ans._id] = ans.marks || 0;
            }
          });
          setGradingMarksMap(initialMarks);
        }
      } catch (err) {
        console.error("Failed to load SQA details for attempt:", err);
      } finally {
        setLoadingSqa(false);
      }
    };
    fetchAttemptSqa();
  }, [selectedAttemptId, selectedExamId, selectedMobileNumber]);

  const handleGradeSqaAnswer = async (answerId, isCorrect) => {
    if (!sqaDetails) return;
    try {
      setLoadingSqa(true);
      const marks = gradingMarksMap[answerId] || 0;
      await checkAnswer(sqaDetails._id, answerId, { isCorrect, marks });
      
      const targetExamId = selectedAttempt.examId._id || selectedAttempt.examId;
      const updatedSqa = await getSQAByExamId(targetExamId);
      setSqaDetails(updatedSqa);

      // Calculate new total SQA score
      const studentSqaAnswers = updatedSqa.answers?.filter(
        ans => ans.mobileNumber === selectedAttempt.mobileNumber
      ) || [];
      const sqaScoreSum = studentSqaAnswers.reduce((acc, ans) => acc + (ans.marks || 0), 0);
      
      // Calculate MCQ score dynamically to avoid double counting
      const mcqObtainedScore = selectedAttempt.answers?.reduce((acc, ans) => acc + (ans.isCorrect ? (ans.marks || 0) : 0), 0) || 0;
      
      // Update ExamAttempt score in backend
      const newTotalScore = mcqObtainedScore + sqaScoreSum;
      await updateExamAttemptScore(selectedAttempt._id, newTotalScore);
      
      // Refetch attempts list and update selectedAttempt to update modal scores in real-time without full page loader
      const data = await getAllExamAttempts();
      setAttempts(data || []);
      const freshAttempt = data?.find(att => att._id === selectedAttempt._id);
      if (freshAttempt) {
        setSelectedAttempt(freshAttempt);
      }
    } catch (err) {
      console.error("Failed to grade SQA response:", err);
      alert("Failed to grade SQA response: " + err.message);
    } finally {
      setLoadingSqa(false);
    }
  };

  const handlePublishToggle = async (examId) => {
    try {
      await togglePublishResults(examId);
      setAttempts(prevAttempts => 
        prevAttempts.map(att => {
          if (att.examId && (att.examId._id === examId || att.examId === examId)) {
            return {
              ...att,
              examId: {
                ...att.examId,
                resultsPublished: !att.examId.resultsPublished
              }
            };
          }
          return att;
        })
      );
      setSelectedAttempt(prev => {
        if (prev && prev.examId && (prev.examId._id === examId || prev.examId === examId)) {
          return {
            ...prev,
            examId: {
              ...prev.examId,
              resultsPublished: !prev.examId.resultsPublished
            }
          };
        }
        return prev;
      });
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
      alert("Failed to toggle publish status: " + error.message);
    }
  };

  const mcqObtainedScore = useMemo(() => {
    return selectedAttempt?.answers?.reduce((acc, ans) => acc + (ans.isCorrect ? (ans.marks || 0) : 0), 0) || 0;
  }, [selectedAttempt]);

  const mcqPossibleScore = useMemo(() => {
    return selectedAttempt?.answers?.reduce((acc, ans) => acc + (ans.marks || 0), 0) || 0;
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

  const fetchAttempts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await getAllExamAttempts();
      setAttempts(data || []);
    } catch (err) {
      console.error("Failed to load attempts:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

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

      {/* Stats Summary Panel */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 flex items-center gap-4.5">
          <div className="rounded-2xl bg-indigo-50 p-3.5 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400">
            <BookOpen size={24} />
          </div>
          <div>
            <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400">Total Attempts</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white">{attempts.length}</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 flex items-center gap-4.5">
          <div className="rounded-2xl bg-emerald-50 p-3.5 text-emerald-650 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Award size={24} />
          </div>
          <div>
            <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400">Average Performance</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {attempts.length > 0
                ? Math.round(
                    (attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                      attempts.reduce((acc, curr) => acc + (curr.totalPossibleScore || 1), 0)) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 flex items-center gap-4.5">
          <div className="rounded-2xl bg-amber-50 p-3.5 text-amber-650 dark:bg-amber-950/40 dark:text-amber-400">
            <Trophy size={24} />
          </div>
          <div>
            <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400">Top Scorers (≥90%)</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {attempts.filter(att => att.totalPossibleScore > 0 && (att.score / att.totalPossibleScore) >= 0.9).length}
            </span>
          </div>
        </div>
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
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60">
        <AdminAgGrid
          rowData={attempts}
          columnDefs={columnDefs}
          quickFilterText={search}
          rowHeight={56}
        />
      </div>

      {/* Answer Review Detail Report Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-350 ease-out">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800 shrink-0 flex-wrap gap-4">
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
              <div className="flex items-center gap-2">
                {selectedAttempt.examId && (
                  <button
                    type="button"
                    onClick={() => handlePublishToggle(selectedAttempt.examId._id || selectedAttempt.examId)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm cursor-pointer border ${
                      selectedAttempt.examId.resultsPublished
                        ? "bg-emerald-50 border-emerald-250 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100/50"
                        : "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    <Send size={12} />
                    {selectedAttempt.examId.resultsPublished ? "Unpublish Results" : "Publish Results"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:hover:bg-slate-850 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {/* Student Summary Information Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-violet-50/70 p-6 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/15 border border-indigo-100/50 dark:border-indigo-950/20">
                <div className="grid gap-6 sm:grid-cols-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1">Student Name</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">{selectedAttempt.studentName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1">Mobile Number</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">{selectedAttempt.mobileNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1 font-bold">Obtained Score Summary</span>
                    <div className="mt-1 space-y-1 bg-white/70 dark:bg-slate-900/50 p-2.5 rounded-2xl border border-indigo-100/30 dark:border-indigo-950/20">
                      <div className="flex items-center justify-between text-2xs">
                        <span className="font-semibold text-slate-500">MCQ marks:</span>
                        <span className="font-extrabold text-indigo-655 dark:text-indigo-400">{mcqObtainedScore} / {mcqPossibleScore}</span>
                      </div>
                      {sqaDetails && sqaDetails.questions && sqaDetails.questions.length > 0 && (
                        <>
                          <div className="flex items-center justify-between text-2xs">
                            <span className="font-semibold text-slate-500">Descriptive:</span>
                            <span className="font-extrabold text-violet-650 dark:text-violet-400">+{totalSqaObtainedScore} / {totalSqaPossibleScore}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800 font-black">
                            <span className="text-slate-800 dark:text-slate-200">Combined:</span>
                            <span className="text-indigo-605 dark:text-indigo-400">{mcqObtainedScore + totalSqaObtainedScore} / {mcqPossibleScore + totalSqaPossibleScore}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: Multiple Choice Questions */}
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-2xs font-extrabold text-indigo-655 dark:bg-indigo-950 dark:text-indigo-400">MCQ</span> Multiple Choice Responses ({selectedAttempt.answers?.length || 0})
                </h3>

                <div className="space-y-4">
                  {(!selectedAttempt.answers || selectedAttempt.answers.length === 0) ? (
                    <p className="text-xs text-slate-400 italic text-center py-6 bg-slate-50 rounded-2xl dark:bg-slate-950/20">No detailed MCQ answers recorded for this attempt.</p>
                  ) : (
                    selectedAttempt.answers.map((ans, index) => (
                      <div
                        key={ans._id || index}
                        className={`rounded-2xl border p-4.5 transition-colors ${
                          ans.isCorrect
                            ? "border-emerald-100 bg-emerald-500/[0.02] dark:border-emerald-950/20 dark:bg-emerald-950/[0.02]"
                            : "border-rose-100 bg-rose-500/[0.02] dark:border-rose-950/20 dark:bg-rose-950/[0.02]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-2.5">
                          <span className="text-xs font-black text-slate-400">
                            Question {index + 1}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-2xs font-bold ${
                            ans.isCorrect
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-450"
                          }`}>
                            {ans.isCorrect ? "Correct" : "Incorrect"} • {ans.isCorrect ? ans.marks : 0}/{ans.marks} marks
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed mb-3">
                          {ans.questionText}
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2 text-xs">
                          <div className="rounded-xl bg-slate-100/60 p-3 dark:bg-slate-800/40 border border-slate-200/20 dark:border-slate-800">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Student Answer:</span>
                            <span className={`font-black ${
                              ans.isCorrect ? "text-emerald-650 dark:text-emerald-455" : "text-rose-505 dark:text-rose-455"
                            }`}>{ans.chosenAnswer}</span>
                          </div>
                          <div className="rounded-xl bg-emerald-500/5 p-3 border border-emerald-500/10 dark:bg-emerald-950/15">
                            <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Correct Answer:</span>
                            <span className="font-black text-emerald-700 dark:text-emerald-400">{ans.correctAnswer}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Section 2: Short Answer (SQA) Responses & Grading Section */}
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
                        <p className="text-xs text-slate-400 italic text-center py-6 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
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
                              className={`rounded-2xl border p-4.5 transition-colors ${
                                answer.checked
                                  ? answer.isCorrect
                                    ? "border-emerald-100 bg-emerald-500/[0.02] dark:border-emerald-950/20 dark:bg-emerald-950/[0.02]"
                                    : "border-rose-100 bg-rose-500/[0.02] dark:border-rose-950/20 dark:bg-rose-950/[0.02]"
                                  : "border-amber-100 bg-amber-500/[0.01] dark:border-amber-950/20 dark:bg-amber-950/[0.01]"
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

                              <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed mb-3">
                                {question ? question.question : `Question ID: ${answer.questionId}`}
                              </p>

                              <div className="space-y-3">
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 text-xs">
                                  <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Student typed answer:</span>
                                  <p className="font-semibold text-slate-800 dark:text-white whitespace-pre-wrap leading-relaxed">{answer.studentAnswer}</p>
                                </div>

                                {/* Grading Deck Controls */}
                                <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex-wrap justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500">Marks:</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max={question?.maxMarks || 5}
                                      value={gradingMarksMap[answer._id] !== undefined ? gradingMarksMap[answer._id] : (answer.marks || 0)}
                                      onChange={(e) => {
                                        const val = Math.min(Number(e.target.value), question?.maxMarks || 5);
                                        setGradingMarksMap(prev => ({
                                          ...prev,
                                          [answer._id]: val
                                        }));
                                      }}
                                      className="w-16 px-2.5 py-1 text-xs border border-slate-250 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <span className="text-2xs text-slate-400 font-semibold">/ {question?.maxMarks || 5} Max</span>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleGradeSqaAnswer(answer._id, true)}
                                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                                        answer.checked && answer.isCorrect
                                          ? "bg-green-600 border-green-600 text-white shadow-sm"
                                          : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350"
                                      }`}
                                    >
                                      <Check size={12} /> Correct
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleGradeSqaAnswer(answer._id, false)}
                                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                                        answer.checked && !answer.isCorrect
                                          ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                                          : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350"
                                      }`}
                                    >
                                      <X size={12} /> Incorrect
                                    </button>
                                  </div>
                                </div>
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
                className="btn-secondary px-6 py-2.5 text-sm cursor-pointer"
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
