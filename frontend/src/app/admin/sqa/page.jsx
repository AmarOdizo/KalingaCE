"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AdminAgGrid from "@/components/AdminAgGrid";
import {
  Plus,
  Search,
  ArrowLeft,
  Check,
  X,
  Edit,
  Trash2,
  Eye,
  Award,
  FileQuestion,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  ChevronRight
} from "lucide-react";

import {
  getSQAs,
  getSQAById,
  createSQA,
  updateSQA,
  deleteSQA,
  checkAnswer
} from "./data";

export default function SQAAdminPage() {
  const [sqas, setSqas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation / View states: 'list' | 'create' | 'edit' | 'grade'
  const [view, setView] = useState("list");
  const [selectedSqa, setSelectedSqa] = useState(null);

  // Form states (Create / Edit)
  const [formData, setFormData] = useState({
    title: "",
    questions: []
  });

  // Grading states
  const [gradingAnswer, setGradingAnswer] = useState(null);
  const [gradeInput, setGradeInput] = useState({
    isCorrect: null,
    marks: 0
  });

  // Action loading states
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all SQAs
  const fetchSQAs = async () => {
    try {
      setLoading(true);
      const data = await getSQAs();
      setSqas(data || []);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to load SQAs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSQAs();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Filter SQAs by title
  const filteredSqas = useMemo(() => {
    return sqas.filter((sqa) =>
      sqa.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sqas, searchQuery]);

  const columnDefs = useMemo(() => [
    {
      headerName: "Assessment Title",
      field: "title",
      flex: 1.5,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full">
          <span className="text-slate-900 dark:text-white font-bold">{params.value}</span>
          <span className="text-xs text-slate-400 font-normal">
            Created: {new Date(params.data.createdAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      headerName: "Total Questions",
      field: "questions",
      flex: 1,
      valueFormatter: (params) => `${params.value?.length || 0} Questions`,
      cellClass: "text-slate-700 dark:text-slate-300 font-semibold flex items-center",
    },
    {
      headerName: "Student Submissions",
      field: "answers",
      flex: 1,
      cellRenderer: (params) => {
        const totalAnswers = params.value?.length || 0;
        return (
          <div className="flex items-center h-full">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              {totalAnswers} Answers
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Pending Review",
      field: "answers",
      flex: 1,
      cellRenderer: (params) => {
        const pendingCount = params.value?.filter((a) => !a.checked).length || 0;
        return (
          <div className="flex items-center h-full">
            {pendingCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                {pendingCount} Pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/40 px-2.5 py-0.5 text-xs font-bold text-green-600 dark:text-green-400">
                All Evaluated
              </span>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const sqa = params.data;
        return (
          <div className="flex items-center justify-end h-full gap-2 w-full pr-4">
            <button
              onClick={() => handleOpenGrading(sqa._id)}
              className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-105 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Award size={14} />
              Grade
            </button>
            <button
              onClick={() => handleOpenEdit(sqa)}
              className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Edit SQA"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteSQA(sqa._id)}
              disabled={actionLoading}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Delete SQA"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
      width: 180,
      sortable: false,
      filter: false,
    },
  ], [actionLoading]);

  // Handle opening SQA for grading
  const handleOpenGrading = async (sqaId) => {
    try {
      setLoading(true);
      const data = await getSQAById(sqaId);
      setSelectedSqa(data);
      setView("grade");
    } catch (error) {
      alert(error.message || "Failed to fetch SQA details");
    } finally {
      setLoading(false);
    }
  };

  // Initialize Create Form
  const handleOpenCreate = () => {
    setFormData({
      title: "",
      questions: [
        { question: "", type: "short-answer", required: true, maxMarks: 5 }
      ]
    });
    setView("create");
  };

  // Initialize Edit Form
  const handleOpenEdit = (sqa) => {
    setSelectedSqa(sqa);
    setFormData({
      title: sqa.title,
      questions: sqa.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        type: q.type || "short-answer",
        required: q.required ?? true,
        maxMarks: q.maxMarks || 5
      }))
    });
    setView("edit");
  };

  // Delete SQA
  const handleDeleteSQA = async (id) => {
    if (!window.confirm("Are you sure you want to delete this SQA? All questions and student answers will be permanently deleted.")) {
      return;
    }
    try {
      setActionLoading(true);
      await deleteSQA(id);
      setSqas((prev) => prev.filter((item) => item._id !== id));
      alert("SQA deleted successfully!");
    } catch (error) {
      alert(error.message || "Failed to delete SQA");
    } finally {
      setActionLoading(false);
    }
  };

  // Add Question Row in Form
  const handleAddQuestionRow = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", type: "short-answer", required: true, maxMarks: 5 }
      ]
    }));
  };

  // Remove Question Row in Form
  const handleRemoveQuestionRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  // Update Question Field in Form
  const handleQuestionFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value
      };
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Submit Create SQA
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (formData.questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    const emptyQuestion = formData.questions.some((q) => !q.question.trim());
    if (emptyQuestion) {
      alert("Please fill in all question descriptions");
      return;
    }

    try {
      setActionLoading(true);
      await createSQA(formData);
      alert("SQA created successfully!");
      fetchSQAs();
      setView("list");
    } catch (error) {
      alert(error.message || "Failed to create SQA");
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Update SQA
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (formData.questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    const emptyQuestion = formData.questions.some((q) => !q.question.trim());
    if (emptyQuestion) {
      alert("Please fill in all question descriptions");
      return;
    }

    try {
      setActionLoading(true);
      await updateSQA(selectedSqa._id, formData);
      alert("SQA updated successfully!");
      fetchSQAs();
      setView("list");
    } catch (error) {
      alert(error.message || "Failed to update SQA");
    } finally {
      setActionLoading(false);
    }
  };

  // Start checking a specific answer
  const handleStartGrading = (answer) => {
    setGradingAnswer(answer);
    const question = selectedSqa.questions.find((q) => q._id === answer.questionId);
    setGradeInput({
      isCorrect: answer.isCorrect ?? true,
      marks: answer.marks || (question ? question.maxMarks : 5)
    });
  };

  // Submit Answer Evaluation
  const handleCheckAnswerSubmit = async (answerId) => {
    try {
      setActionLoading(true);
      await checkAnswer(selectedSqa._id, answerId, {
        isCorrect: gradeInput.isCorrect,
        marks: gradeInput.isCorrect ? Number(gradeInput.marks) : 0
      });

      // Refresh SQA details to show updated answers
      const updatedSqa = await getSQAById(selectedSqa._id);
      setSelectedSqa(updatedSqa);
      setGradingAnswer(null);

      // Also refresh main list
      const allSqas = await getSQAs();
      setSqas(allSqas || []);

      alert("Grade submitted successfully!");
    } catch (error) {
      alert(error.message || "Failed to submit grade");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && view === "list") {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading SQA assessment lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 dark:bg-slate-950 transition-colors duration-300">
      <title>Manage SQA | Admin Panel</title>

      {/* VIEW 1: LIST SQA ASSESSMENT TESTS */}
      {view === "list" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                <span className="gradient-text">Short Answer Questions (SQA)</span>
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400 font-semibold text-sm">
                Create subject assessments, evaluate student descriptive responses, and award marks.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="btn-primary py-3 px-6 shadow-md shadow-primary-500/10 flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus size={18} />
              Create SQA Test
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search SQA tests by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/40"
              />
            </div>
          </div>

          {/* SQA Tables */}
          {filteredSqas.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <FileQuestion className="h-12 w-12 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No SQA tests found</h3>
              <p className="text-sm text-slate-500 max-w-md">Create your first descriptive short-answer test so students can practice typing answers.</p>
              <button onClick={handleOpenCreate} className="btn-primary py-2 px-4 text-xs font-bold mt-2">
                Create SQA
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200/85 dark:border-slate-800/60 bg-white dark:bg-slate-900">
              <AdminAgGrid
                rowData={sqas}
                columnDefs={columnDefs}
                quickFilterText={searchQuery}
                rowHeight={56}
              />
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CREATE / EDIT SQA ASSESSMENT */}
      {(view === "create" || view === "edit") && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("list")}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {view === "create" ? "Create SQA Assessment" : "Edit SQA Assessment"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {view === "create" ? "Set up descriptive exam questions for students" : "Update SQA questions and max marks"}
              </p>
            </div>
          </div>

          <form
            onSubmit={view === "create" ? handleCreateSubmit : handleUpdateSubmit}
            className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs"
          >
            {/* Title field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-350">
                Assessment Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. DCA Semester-1 Short Questions, MS Word Basics Test"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/40 text-slate-900 dark:text-white"
              />
            </div>

            {/* Questions Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="text-primary-500 h-5 w-5" />
                  Questions ({formData.questions.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddQuestionRow}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  Add Question
                </button>
              </div>

              {formData.questions.map((questionObj, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 rounded-xl space-y-4 relative group transition-all"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q#{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestionRow(index)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Remove Question"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-10">
                    {/* Question Text */}
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Question Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={questionObj.question}
                        onChange={(e) => handleQuestionFieldChange(index, "question", e.target.value)}
                        placeholder="e.g. What is the difference between compiler and interpreter?"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/25 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Max Marks */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Max Marks
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={questionObj.maxMarks}
                        onChange={(e) => handleQuestionFieldChange(index, "maxMarks", Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/25 text-slate-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Required Toggler & Question Type Info */}
                  <div className="flex items-center gap-6 text-xs text-slate-500">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={questionObj.required}
                        onChange={(e) => handleQuestionFieldChange(index, "required", e.target.checked)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="font-bold text-slate-600 dark:text-slate-400">Required Field</span>
                    </label>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span>Type:</span>
                      <span className="font-bold capitalize bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded-md text-[10px]">
                        {questionObj.type || "short-answer"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-4 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="btn-primary py-2.5 px-6 shadow-md flex items-center gap-2"
              >
                <Save size={16} />
                {actionLoading ? "Saving..." : "Save Assessment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: GRADE ANSWERS */}
      {view === "grade" && selectedSqa && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView("list")}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Evaluate: <span className="gradient-text">{selectedSqa.title}</span>
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Review student answers, declare correctness, and assign custom scores.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of answers submitted */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="text-primary-500 h-5 w-5" />
                Submitted Answers ({selectedSqa.answers?.length || 0})
              </h3>

              {(!selectedSqa.answers || selectedSqa.answers.length === 0) ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-sm font-semibold">
                  No student answers have been submitted for this test yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedSqa.answers.map((answer, idx) => {
                    const question = selectedSqa.questions.find((q) => q._id === answer.questionId);
                    const isGradingThis = gradingAnswer?._id === answer._id;

                    return (
                      <div
                        key={answer._id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isGradingThis
                            ? "bg-primary-50/20 border-primary-500 dark:bg-primary-950/10 dark:border-primary-500"
                            : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                        } space-y-3.5`}
                      >
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {answer.studentName || `Response #${idx + 1}`}
                            </span>
                            {answer.mobileNumber && (
                              <span className="text-[10px] text-slate-400 font-semibold">
                                Phone: {answer.mobileNumber}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {answer.checked ? (
                              answer.isCorrect ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950/40 px-2.5 py-0.5 text-xs font-bold text-green-600 dark:text-green-400">
                                  <CheckCircle2 size={12} /> Correct ({answer.marks}/{question?.maxMarks || 0} Marks)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                                  <XCircle size={12} /> Incorrect (0 Marks)
                                </span>
                              )
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                                <AlertCircle size={12} /> Pending Grading
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Question Reference */}
                        <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Question:</p>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                            {question ? question.question : <em className="text-red-500">Removed Question (ID: {answer.questionId})</em>}
                          </p>
                          {question && (
                            <p className="text-[11px] font-bold text-slate-400">Max Score possible: {question.maxMarks} Marks</p>
                          )}
                        </div>

                        {/* Student Answer */}
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Response:</p>
                          <div className="p-3.5 bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-800/80 rounded-xl text-sm font-medium text-slate-900 dark:text-white whitespace-pre-wrap">
                            {answer.studentAnswer}
                          </div>
                        </div>

                        {/* Grade Actions trigger */}
                        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-850">
                          <button
                            onClick={() => handleStartGrading(answer)}
                            className="btn-primary py-1.5 px-3 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                          >
                            <Award size={14} />
                            {answer.checked ? "Re-evaluate Grade" : "Evaluate & Score"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grading panel right sidebar */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="text-primary-500 h-5 w-5" />
                Evaluation Deck
              </h3>

              {gradingAnswer ? (
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 sticky top-6">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Grading Answer</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Evaluate the correctness and score the descriptive answer.</p>
                  </div>

                  {/* Correctness Toggle buttons */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
                      Assessment
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGradeInput((prev) => ({ ...prev, isCorrect: true }))}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          gradeInput.isCorrect === true
                            ? "bg-green-500 border-green-600 text-white shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <Check size={14} />
                        Correct
                      </button>

                      <button
                        type="button"
                        onClick={() => setGradeInput((prev) => ({ ...prev, isCorrect: false }))}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          gradeInput.isCorrect === false
                            ? "bg-red-500 border-red-655 text-white shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <X size={14} />
                        Incorrect
                      </button>
                    </div>
                  </div>

                  {/* Custom Marks Input */}
                  {gradeInput.isCorrect === true && (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
                          Award Marks
                        </label>
                        <span className="text-xs font-bold text-slate-400">
                          Max: {selectedSqa.questions.find((q) => q._id === gradingAnswer.questionId)?.maxMarks || 5}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={selectedSqa.questions.find((q) => q._id === gradingAnswer.questionId)?.maxMarks || 5}
                        value={gradeInput.marks}
                        onChange={(e) => setGradeInput((prev) => ({ ...prev, marks: Number(e.target.value) }))}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/25 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleCheckAnswerSubmit(gradingAnswer._id)}
                      className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 size={14} />
                      {actionLoading ? "Submitting..." : "Submit Grading"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setGradingAnswer(null)}
                      className="w-full py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      Dismiss Deck
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-400 space-y-2 text-sm font-semibold">
                  <Award className="mx-auto h-8 w-8 text-slate-300" />
                  <p>No active grading deck selected.</p>
                  <p className="text-xs text-slate-400 font-normal">{"Click \"Evaluate & Score\" on any response on the left to start checking."}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
