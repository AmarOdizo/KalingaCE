"use client";

import { useEffect, useState } from "react";
import { getSubjects, getMCQsBySubject } from "./data";
import Loading from "./Loading";
import {
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  Search,
} from "lucide-react";

export default function MCQClient() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Quiz State
  const [view, setView] = useState("select"); // "select", "quiz", "result"
  const [selectedSubject, setSelectedSubject] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // tracks { questionId, chosen, correct, isCorrect }

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Load subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load subjects. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Shuffle questions helper
  const prepareQuiz = (questions) => {
    // Shuffle the array of active questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    // Take minimum to maximum 10 questions
    const selected = shuffled.slice(0, 10);
    setQuizQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setUserAnswers([]);
    setSelectedAnswer("");
    setIsAnswered(false);
    setView("quiz");
  };

  // Start quiz for a subject
  const handleStartQuiz = async (subject) => {
    setLoading(true);
    setError("");
    setSelectedSubject(subject);
    try {
      const questions = await getMCQsBySubject(subject);
      if (questions.length === 0) {
        setError(`No active MCQs found for subject: ${subject}`);
        setLoading(false);
        return;
      }
      setAllQuestions(questions);
      prepareQuiz(questions);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch quiz for ${subject}.`);
    } finally {
      setLoading(false);
    }
  };

  // Reset/Restart Quiz
  const handleRestartQuiz = () => {
    prepareQuiz(allQuestions);
  };

  // Handle Option Select
  const handleSelectOption = (option) => {
    if (isAnswered) return; // Prevent changing answer
    setSelectedAnswer(option);
    setIsAnswered(true);

    const currentQuestion = quizQuestions[currentIndex];
    const isCorrect = option.trim() === currentQuestion.correctAnswer.trim();

    if (isCorrect) {
      setScore((prev) => prev + (currentQuestion.marks || 1));
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        options: currentQuestion.options,
        chosen: option,
        correct: currentQuestion.correctAnswer,
        isCorrect,
        explanation: currentQuestion.explanation,
        marks: currentQuestion.marks || 1,
      },
    ]);
  };

  // Go to next question or show results
  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setIsAnswered(false);
    } else {
      setView("result");
    }
  };

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter((subj) =>
    subj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  // Calculate total possible score
  const totalPossibleScore = quizQuestions.reduce(
    (acc, q) => acc + (q.marks || 1),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 py-16 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-6">
        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200/80 bg-red-50/50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={() => setError("")}
              className="ml-auto text-xs font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. SUBJECT SELECTION HUB */}
        {view === "select" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header Banner */}
            <div className="mb-12 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-950/40 dark:text-primary-400">
                <HelpCircle size={12} /> Student Assessment Portal
              </span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
                🎯 MCQ <span className="gradient-text">Practice Hub</span>
              </h2>
              <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto dark:text-slate-400">
                Sharpen your skills, test your core understanding, and master your subjects with custom mock exams. One question at a time, up to 10 questions per run.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-2 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl bg-transparent py-2.5 pl-11 pr-4 outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Subject Grid */}
            {filteredSubjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 py-16 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/20">
                <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="font-semibold">No subjects available right now.</p>
                <p className="text-xs text-slate-400 mt-1">Please check back later or modify your search filter.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredSubjects.map((subject, index) => (
                  <div
                    key={index}
                    onClick={() => handleStartQuiz(subject)}
                    className="premium-card flex flex-col justify-between cursor-pointer border border-slate-200/80 hover:border-primary-500/50 hover:shadow-glow-blue hover:scale-[1.02] duration-300 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="rounded-xl bg-primary-50 p-3 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                          <BookOpen size={20} />
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-2xs font-semibold text-slate-500 uppercase tracking-wider dark:bg-slate-800 dark:text-slate-400">
                          Quiz Mode
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                        {subject}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Take a quick test. Features randomized MCQs, single question focus, and clear instant explanations.
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                      <span className="text-2xs font-semibold text-slate-400">
                        Max 10 questions
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 group-hover:translate-x-1 transition-transform dark:text-primary-400">
                        Start Practice <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. ACTIVE QUIZ PLAYBACK */}
        {view === "quiz" && quizQuestions.length > 0 && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {/* Quiz Navigation Header */}
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to quit the quiz? Your current progress will be lost.")) {
                    setView("select");
                  }
                }}
                className="btn-secondary px-4 py-2 text-xs"
              >
                <ArrowLeft size={14} /> Exit Test
              </button>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Subject:
                </span>
                <span className="block text-sm font-bold text-slate-800 dark:text-white">
                  {selectedSubject}
                </span>
              </div>
            </div>

            {/* Quiz Card */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 overflow-hidden">
              {/* Progress Bar & Indicators */}
              <div className="bg-slate-50/50 p-6 border-b border-slate-100 dark:bg-slate-900/30 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Question {currentIndex + 1} of {quizQuestions.length}
                  </span>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-2xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    Marks: {quizQuestions[currentIndex].marks || 1}
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Question Text */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-relaxed">
                  {quizQuestions[currentIndex].question}
                </h3>

                {/* Grid of Options */}
                <div className="mt-8 flex flex-col gap-3.5">
                  {quizQuestions[currentIndex].options.map((option, idx) => {
                    const isOptionSelected = selectedAnswer === option;
                    const isOptionCorrect = option.trim() === quizQuestions[currentIndex].correctAnswer.trim();

                    // Style configuration depending on selection status
                    let buttonStyle = "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-slate-800/60";

                    if (isAnswered) {
                      if (isOptionCorrect) {
                        buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400";
                      } else if (isOptionSelected) {
                        buttonStyle = "border-red-500 bg-red-50 text-red-800 font-bold dark:border-red-600 dark:bg-red-950/30 dark:text-red-400";
                      } else {
                        buttonStyle = "border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900/10 dark:text-slate-600";
                      }
                    } else {
                      if (isOptionSelected) {
                        buttonStyle = "border-primary-500 bg-primary-50 text-primary-900 dark:border-primary-400 dark:bg-primary-950/30 dark:text-primary-300";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(option)}
                        className={`flex items-start gap-4 rounded-2xl border p-4 text-left text-sm font-semibold transition-all duration-200 ${
                          !isAnswered ? "hover:scale-[1.01] active:scale-[0.99] cursor-pointer" : ""
                        } ${buttonStyle}`}
                      >
                        {/* Option label indicator (A, B, C, D) */}
                        <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          isAnswered && isOptionCorrect
                            ? "bg-emerald-500 text-white"
                            : isAnswered && isOptionSelected
                            ? "bg-red-500 text-white"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{option}</span>

                        {/* Status Checkmark or X icons */}
                        {isAnswered && isOptionCorrect && (
                          <CheckCircle2 size={18} className="ml-auto shrink-0 text-emerald-500 dark:text-emerald-400 mt-0.5" />
                        )}
                        {isAnswered && isOptionSelected && !isOptionCorrect && (
                          <AlertCircle size={18} className="ml-auto shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Explanation Panel */}
                {isAnswered && (
                  <div className="mt-8 rounded-2xl bg-indigo-50/50 p-6 border border-indigo-100/50 dark:bg-indigo-950/10 dark:border-indigo-900/30 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400">
                      <HelpCircle size={18} />
                      <span className="font-bold text-sm">Explanation</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {quizQuestions[currentIndex].explanation ||
                        "No explanation was configured for this question. Make sure to review the correct option highlighted above."}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end p-6 border-t border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                {isAnswered ? (
                  <button
                    onClick={handleNext}
                    className="btn-primary px-7 py-3"
                  >
                    {currentIndex < quizQuestions.length - 1 ? (
                      <>
                        Next Question <ArrowRight size={16} />
                      </>
                    ) : (
                      "Finish Quiz"
                    )}
                  </button>
                ) : (
                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-3">
                    Please select an answer to unlock the Next option.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. SCORING RESULTS DASHBOARD */}
        {view === "result" && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {/* Visual Ring and Score Banner */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-premium text-center dark:border-slate-800 dark:bg-slate-900/60 mb-8">
              <Award size={48} className="mx-auto text-indigo-500 mb-4" />
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                Quiz Completed!
              </h2>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Subject: <span className="font-bold">{selectedSubject}</span>
              </p>

              {/* Big Score Bubble */}
              <div className="my-8 inline-flex flex-col items-center justify-center h-40 w-40 rounded-full border-8 border-primary-500 bg-slate-50 shadow-inner dark:bg-slate-900/80 dark:border-primary-400">
                <span className="text-4xl font-extrabold text-slate-800 dark:text-white">
                  {score}
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                  out of {totalPossibleScore} marks
                </span>
              </div>

              {/* Feedback messages depending on score percentage */}
              {(() => {
                const pct = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;
                let title = "Practice Completed!";
                let description = "Keep playing quizzes to boost your knowledge.";

                if (pct === 100) {
                  title = "🏆 Perfect Score! Excellent Work!";
                  description = "You answered every question flawlessly. You've fully mastered this quiz!";
                } else if (pct >= 70) {
                  title = "🎉 Great Job! You passed!";
                  description = "An excellent score! You show a solid grasp of this subject.";
                } else if (pct >= 40) {
                  title = "👍 Good Effort! Keep practicing!";
                  description = "A fair score. Run through the practice sets again to cover missing concepts.";
                } else {
                  title = "📚 Keep learning and try again!";
                  description = "Review the notes and study guides, and give this quiz another shot.";
                }

                return (
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {description}
                    </p>
                  </div>
                );
              })()}

              {/* Quick Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRestartQuiz}
                  className="btn-primary px-6 py-3 font-bold text-sm"
                >
                  <RefreshCw size={16} /> Retake Test
                </button>

                <button
                  onClick={() => setView("select")}
                  className="btn-secondary px-6 py-3 font-bold text-sm"
                >
                  Choose Another Subject
                </button>
              </div>
            </div>

            {/* Questions Review Accordion */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-premium dark:border-slate-800 dark:bg-slate-900/60">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
                📝 Question Review & Explanations
              </h3>

              <div className="flex flex-col gap-6">
                {userAnswers.map((ans, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border p-5 transition-colors ${
                      ans.isCorrect
                        ? "border-emerald-100 bg-emerald-50/10 dark:border-emerald-950/20 dark:bg-emerald-950/5"
                        : "border-red-100 bg-red-50/10 dark:border-red-950/20 dark:bg-red-950/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="text-xs font-bold text-slate-400">
                        Q{index + 1}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-2xs font-semibold ${
                        ans.isCorrect
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/55 dark:text-emerald-400"
                          : "bg-red-100 text-red-800 dark:bg-red-950/55 dark:text-red-400"
                      }`}>
                        {ans.isCorrect ? "Correct" : "Incorrect"} • {ans.isCorrect ? ans.marks : 0}/{ans.marks} marks
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">
                      {ans.questionText}
                    </p>

                    {/* Show selected & correct answers */}
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2 text-xs">
                      <div className="rounded-xl bg-slate-100/60 p-3 dark:bg-slate-800/40">
                        <span className="block text-slate-400 font-semibold mb-1">Your Answer:</span>
                        <span className={`font-bold ${
                          ans.isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                        }`}>{ans.chosen}</span>
                      </div>
                      <div className="rounded-xl bg-emerald-500/5 p-3 border border-emerald-500/10">
                        <span className="block text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Correct Answer:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">{ans.correct}</span>
                      </div>
                    </div>

                    {/* Review Explanation */}
                    {ans.explanation && (
                      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                        <p className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                          Explanation:
                        </p>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {ans.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
