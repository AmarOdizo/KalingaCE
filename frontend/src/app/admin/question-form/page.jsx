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
  Save,
  Type,
  FileText
} from "lucide-react";

import {
  getMCQs,
  getMCQsByExam,
  createMCQ,
  createBulkMCQs,
  updateMCQ,
  deleteMCQ,
  getSQAs,
  getSQAByExamId,
  createSQA,
  updateSQA,
  deleteSQA
} from "./data";
import { getExamInformation } from "../exam-information/data";

function QuestionFormPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramExamId = searchParams ? (searchParams.get("examId") || searchParams.get("courseId")) : "";
  const paramLaunchCreate = searchParams ? searchParams.get("launchCreate") : "";

  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState("");
  const [selectedExamInfo, setSelectedExamInfo] = useState(null);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Unified Google-Form style questions list
  const [questions, setQuestions] = useState([
    {
      type: "mcq", // "mcq" | "sqa"
      question: "",
      options: ["", "", "", ""],
      correctOption: "A",
      marks: 1,
      required: true,
      explanation: ""
    }
  ]);

  // Original fetched questions for diffing on save
  const [originalMcqs, setOriginalMcqs] = useState([]);
  const [originalSqaDoc, setOriginalSqaDoc] = useState(null);
  
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const moveQuestionUp = (index) => {
    if (index === 0) return;
    setQuestions((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
    setActiveCardIndex(index - 1);
  };

  const moveQuestionDown = (index) => {
    if (index === questions.length - 1) return;
    setQuestions((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
    setActiveCardIndex(index + 1);
  };

  // Load Exam Information and existing questions
  const loadExamAndQuestions = useCallback(async (targetExamId) => {
    if (!targetExamId) return;
    try {
      setLoading(true);
      
      // Fetch Exam lists and single exam info
      const examList = await getExamInformation().catch(() => []);
      setExams(examList);
      
      const matchedExam = examList.find((e) => e._id === targetExamId);
      if (matchedExam) {
        setSelectedExamInfo(matchedExam);
        setSubject(matchedExam.examName || "");
      }

      // Fetch MCQs and SQAs for this specific exam
      const [fetchedMcqs, fetchedSqa] = await Promise.all([
        getMCQsByExam(targetExamId).catch(() => []),
        getSQAByExamId(targetExamId).catch(() => null)
      ]);

      setOriginalMcqs(fetchedMcqs || []);
      setOriginalSqaDoc(fetchedSqa || null);

      // Merge into unified list of questions
      const merged = [];
      
      // 1. Add MCQs
      if (fetchedMcqs && fetchedMcqs.length > 0) {
        fetchedMcqs.forEach((m) => {
          // Find correct option index/letter
          let correctLetter = "A";
          if (m.correctAnswer === m.options[1]) correctLetter = "B";
          else if (m.correctAnswer === m.options[2]) correctLetter = "C";
          else if (m.correctAnswer === m.options[3]) correctLetter = "D";

          merged.push({
            _id: m._id,
            id: m.id, // Custom counter id
            type: "mcq",
            question: m.question,
            options: [...m.options],
            correctOption: correctLetter,
            marks: m.marks || 1,
            required: true,
            explanation: m.explanation || ""
          });
        });
      }

      // 2. Add SQAs
      if (fetchedSqa && fetchedSqa.questions && fetchedSqa.questions.length > 0) {
        fetchedSqa.questions.forEach((q) => {
          merged.push({
            _id: q._id,
            type: "sqa",
            question: q.question,
            options: ["", "", "", ""],
            correctOption: "A",
            marks: q.maxMarks || 5,
            required: q.required ?? true,
            explanation: ""
          });
        });
      }

      // If no questions exist, default to one question block
      if (merged.length === 0) {
        setQuestions([
          {
            type: "mcq",
            question: "",
            options: ["", "", "", ""],
            correctOption: "A",
            marks: 1,
            required: true,
            explanation: ""
          }
        ]);
      } else {
        setQuestions(merged);
      }

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to load questions for this exam.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (paramExamId) {
        setExamId(paramExamId);
        loadExamAndQuestions(paramExamId);
      } else {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [paramExamId, loadExamAndQuestions]);

  // Handle Exam Selection Change
  const handleExamChange = (id) => {
    setExamId(id);
    router.push(`/admin/question-form?examId=${id}`);
  };

  // Add Question row
  const addQuestion = (type = "mcq") => {
    setQuestions((prev) => [
      ...prev,
      {
        type,
        question: "",
        options: ["", "", "", ""],
        correctOption: "A",
        marks: type === "mcq" ? 1 : 5,
        required: true,
        explanation: ""
      }
    ]);
  };

  // Remove Question row
  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Update question field
  const updateQuestionField = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  // Update specific MCQ option text
  const updateOptionText = (qIndex, optIndex, text) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const updatedOptions = [...updated[qIndex].options];
      updatedOptions[optIndex] = text;
      updated[qIndex] = {
        ...updated[qIndex],
        options: updatedOptions
      };
      return updated;
    });
  };

  // Submit/Publish Questions
  const handlePublish = async (e) => {
    e.preventDefault();

    if (!examId) {
      Swal.fire("Error", "Please select an Exam Schedule first.", "warning");
      return;
    }

    if (!subject.trim()) {
      Swal.fire("Error", "Please enter a Subject Name.", "warning");
      return;
    }

    // Validation
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        Swal.fire("Validation Error", `Question #${i + 1} Statement is required.`, "warning");
        return;
      }
      if (q.type === "mcq") {
        if (!q.options[0].trim() || !q.options[1].trim() || !q.options[2].trim() || !q.options[3].trim()) {
          Swal.fire("Validation Error", `Question #${i + 1} (MCQ) requires all 4 options.`, "warning");
          return;
        }
      }
    }

    try {
      setActionLoading(true);

      // Separate MCQ and SQA
      const formMcqs = questions.filter((q) => q.type === "mcq");
      const formSqas = questions.filter((q) => q.type === "sqa");

      // 1. SAVE MCQ QUESTIONS
      // Diffing: Identify deleted, updated, and new MCQs
      const formMcqIds = formMcqs.map((q) => q._id).filter(Boolean);
      const deletedMcqs = originalMcqs.filter((om) => !formMcqIds.includes(om._id));

      // Delete removed MCQs
      for (const dm of deletedMcqs) {
        await deleteMCQ(dm.id).catch(console.error);
      }

      // Update or Create MCQs
      for (const q of formMcqs) {
        let correctText = "";
        const opts = q.options.map((o) => o.trim());
        if (q.correctOption === "A") correctText = opts[0];
        else if (q.correctOption === "B") correctText = opts[1];
        else if (q.correctOption === "C") correctText = opts[2];
        else if (q.correctOption === "D") correctText = opts[3];

        const mcqData = {
          examId,
          subject: subject.trim(),
          question: q.question.trim(),
          options: opts,
          correctAnswer: correctText,
          marks: Number(q.marks) || 1,
          explanation: q.explanation.trim()
        };

        if (q._id) {
          // Update existing
          await updateMCQ(q.id, mcqData);
        } else {
          // Create new
          await createMCQ(mcqData);
        }
      }

      // 2. SAVE SQA (Short Answer Questions)
      const sqaQuestionsFormatted = formSqas.map((q) => ({
        question: q.question.trim(),
        type: "short-answer",
        required: q.required ?? true,
        maxMarks: Number(q.marks) || 5
      }));

      if (sqaQuestionsFormatted.length > 0) {
        const sqaData = {
          title: (selectedExamInfo?.examName || subject) + " Descriptive Questions",
          examId,
          questions: sqaQuestionsFormatted
        };

        if (originalSqaDoc && originalSqaDoc._id) {
          // Update existing SQA Document
          await updateSQA(originalSqaDoc._id, sqaData);
        } else {
          // Create new SQA Document
          await createSQA(sqaData);
        }
      } else {
        // If all SQA questions were removed, delete SQA document if it existed
        if (originalSqaDoc && originalSqaDoc._id) {
          await deleteSQA(originalSqaDoc._id).catch(console.error);
        }
      }

      await Swal.fire({
        title: "Success!",
        text: "All exam questions published successfully.",
        icon: "success",
        confirmButtonColor: "#3b82f6"
      });

      router.push("/admin/exam-information");

    } catch (error) {
      console.error(error);
      Swal.fire("Error!", error.message || "Failed to publish questions.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-semibold text-slate-500">Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <title>Exam Question Form Builder | Admin Panel</title>

      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/exam-information"
            className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition shadow-xs text-slate-600 dark:text-slate-350 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              <span className="gradient-text">Unified Question Form Builder</span>
            </h1>
            <p className="text-xs text-slate-400 font-semibold">
              {selectedExamInfo ? `Exam: ${selectedExamInfo.examName}` : "Create descriptive & multiple-choice questions together"}
            </p>
          </div>
        </div>

        {/* Exam Selector if not preset */}
        {!paramExamId && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Exam:</span>
            <select
              value={examId}
              onChange={(e) => handleExamChange(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 dark:text-slate-200"
            >
              <option value="">Select Exam Schedule</option>
              {exams.map((ex) => (
                <option key={ex._id} value={ex._id}>
                  {ex.examName} ({ex.batch})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        {/* Subject Card Config */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3.5 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Subject Info
          </h2>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">
              Subject / Topic Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Fundamentals, DCA Semester-1"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Dynamic Questions Builder List with Floating Toolbar */}
        <div className="relative">
          <div className="space-y-6">
          {questions.map((q, qIndex) => {
            const isActive = activeCardIndex === qIndex;
            return (
              <div
                key={qIndex}
                onClick={() => setActiveCardIndex(qIndex)}
                className={`p-6 bg-white dark:bg-slate-900 border rounded-2xl space-y-5 relative group transition-all duration-300 ${
                  isActive
                    ? "border-blue-500 shadow-lg ring-2 ring-blue-500/10 dark:border-blue-400 dark:ring-blue-400/15"
                    : "border-slate-200 dark:border-slate-800 shadow-sm"
                }`}
              >
                {/* Floating indices, reorder, delete */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    }`}>
                      {qIndex + 1}
                    </span>

                    {/* Reorder Buttons */}
                    <div className="flex items-center bg-slate-50 dark:bg-slate-950 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveQuestionUp(qIndex); }}
                        disabled={qIndex === 0}
                        className="p-1 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:hover:text-inherit rounded transition cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveQuestionDown(qIndex); }}
                        disabled={qIndex === questions.length - 1}
                        className="p-1 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:hover:text-inherit rounded transition cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Question Type Selector */}
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestionField(qIndex, "type", e.target.value)}
                      className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <option value="mcq">Multiple Choice (MCQ)</option>
                      <option value="sqa">Short Answer (SQA)</option>
                    </select>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeQuestion(qIndex); }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                        title="Remove Question"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

              {/* Question Statement */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">
                  Question Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is the full form of CPU?"
                  value={q.question}
                  onChange={(e) => updateQuestionField(qIndex, "question", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                />
              </div>

              {/* CONDITION: Multiple Choice (MCQ) fields */}
              {q.type === "mcq" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["A", "B", "C", "D"].map((optLetter, optIdx) => {
                      const isCorrect = q.correctOption === optLetter;
                      return (
                        <div key={optIdx} className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                            <span className={`flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold transition-all ${
                              isCorrect 
                                ? 'bg-green-500 text-white shadow-sm' 
                                : 'bg-slate-100 dark:bg-slate-850 text-slate-555'
                            }`}>
                              {optLetter}
                            </span>
                            Option {optLetter} <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              required={q.type === "mcq"}
                              placeholder={`Option ${optLetter} text`}
                              value={q.options[optIdx]}
                              onChange={(e) => updateOptionText(qIndex, optIdx, e.target.value)}
                              className={`w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white transition-all ${
                                isCorrect 
                                  ? "border-green-500/50 bg-green-500/5 dark:border-green-500/20" 
                                  : "border-slate-200 dark:border-slate-800"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); updateQuestionField(qIndex, "correctOption", optLetter); }}
                              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                isCorrect
                                  ? "bg-green-500 border-green-600 text-white shadow-sm"
                                  : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-550"
                              }`}
                              title="Mark as correct option"
                            >
                              <Check size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Marks */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">
                        Marks Allocated
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={q.marks}
                        onChange={(e) => updateQuestionField(qIndex, "marks", Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">
                      Answer Explanation (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Why is this answer correct? Provide explanations."
                      value={q.explanation}
                      onChange={(e) => updateQuestionField(qIndex, "explanation", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
              )}

              {/* CONDITION: Short Answer / SQA fields */}
              {q.type === "sqa" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Max Marks */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">
                        Max Evaluation Score
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={q.marks}
                        onChange={(e) => updateQuestionField(qIndex, "marks", Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-bold"
                      />
                    </div>

                    {/* SQA toggles */}
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) => updateQuestionField(qIndex, "required", e.target.checked)}
                          className="rounded border-slate-350 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Required Response</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            );
          })}
          </div>

          {/* Floating Right Sidebar Toolbar (Google Forms style) */}
          <div className="fixed bottom-24 right-6 md:right-10 md:top-1/2 md:-translate-y-1/2 flex md:flex-col gap-3 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-2xl z-40 w-fit shrink-0 transition-all">
            <button
              type="button"
              onClick={() => addQuestion("mcq")}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
              title="Add Question"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Submission Panel */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/admin/exam-information"
            className="px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={actionLoading}
            className="btn-primary py-2.5 px-6 shadow-md shadow-blue-500/10 flex items-center gap-2 cursor-pointer font-bold text-xs"
          >
            <Save size={14} />
            {actionLoading ? "Publishing..." : "Publish Questions"}
          </button>
        </div>
      </form>
    </div>
  );
}

function QuestionFormPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    }>
      <QuestionFormPageInner />
    </Suspense>
  );
}

export default QuestionFormPage;
