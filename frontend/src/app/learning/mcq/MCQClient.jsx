"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { getSubjects, getMCQsBySubject, getExamById, getMCQsByExam, checkExamAttempt, submitExamAttempt, getSQAByExam, submitSQAAnswer } from "./data";
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

// Helper to parse start date & time into local date object
const parseExamStart = (examDate, examTime) => {
  try {
    const d = new Date(examDate);
    const timeStr = examTime || "00:00";
    let hours = 0;
    let minutes = 0;
    
    if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) {
      const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
      if (match) {
        hours = Number(match[1]);
        minutes = Number(match[2]);
        const ampm = match[3].toLowerCase();
        if (ampm === "pm" && hours < 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
      }
    } else {
      const parts = timeStr.split(":");
      hours = Number(parts[0]) || 0;
      minutes = Number(parts[1]) || 0;
    }
    
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes, 0);
  } catch (err) {
    console.error("Error parsing start time", err);
    return new Date();
  }
};

// Helper to parse duration string into total minutes
const parseDurationMinutes = (durationStr) => {
  try {
    const str = (durationStr || "").toLowerCase();
    const num = parseFloat(str) || 0;
    if (str.includes("minute")) {
      return num;
    }
    if (str.includes("hour")) {
      return num * 60;
    }
    return 60;
  } catch (err) {
    console.error("Error parsing duration", err);
    return 60;
  }
};

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function MCQClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams ? searchParams.get("examId") : null;

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


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

  const [isScheduledExam, setIsScheduledExam] = useState(false);
  const [examDetails, setExamDetails] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds

  // Student registration states
  const [studentName, setStudentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [checkingAttempt, setCheckingAttempt] = useState(false);
  const [alreadyAttemptedData, setAlreadyAttemptedData] = useState(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Check if results have been published by the admin (for scheduled exams)
  const is5MinutesPassed = useMemo(() => {
    if (!isScheduledExam) return true; // practice hub always displays results
    return examDetails?.resultsPublished || false;
  }, [isScheduledExam, examDetails]);

  // Auto-submit quiz when duration completes
  const handleAutoSubmit = async () => {
    // Fill in remaining questions as unanswered
    let finalAnswers = [];
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      
      setQuizQuestions((questions) => {
        questions.forEach((q) => {
          const alreadyAnswered = updatedAnswers.some(ans => ans.questionText === q.question);
          if (!alreadyAnswered) {
            const isMcq = q.type === "mcq" || !q.type;
            updatedAnswers.push({
              questionId: q.id || q._id,
              questionText: q.question,
              options: q.options || [],
              chosen: "Unanswered",
              correct: isMcq ? q.correctAnswer : "",
              isCorrect: isMcq ? false : null,
              explanation: q.explanation || "",
              marks: q.marks || 1,
              type: q.type || "mcq",
              sqaId: q.sqaId || null
            });
          }
        });
        return questions;
      });
      
      finalAnswers = updatedAnswers;
      return updatedAnswers;
    });

    if (isScheduledExam) {
      try {
        const mcqAnswers = finalAnswers.filter(ans => ans.type === "mcq" || !ans.type);
        const totalMcqPossible = quizQuestions.filter(q => q.type === "mcq" || !q.type).reduce((acc, q) => acc + (q.marks || 1), 0);
        const totalSqaPossible = quizQuestions.filter(q => q.type === "sqa").reduce((acc, q) => acc + (q.marks || q.maxMarks || 5), 0);
        const attemptData = {
          studentName,
          mobileNumber,
          examId,
          score,
          totalPossibleScore: totalMcqPossible + totalSqaPossible,
          answers: mcqAnswers.map(ans => ({
            questionId: ans.questionId,
            questionText: ans.questionText,
            chosenAnswer: ans.chosen,
            correctAnswer: ans.correct,
            isCorrect: ans.isCorrect,
            marks: ans.marks,
          })),
        };
        await submitExamAttempt(attemptData);

        // Submit SQA Answers
        const sqaAnswers = finalAnswers.filter(ans => ans.type === "sqa");
        if (sqaAnswers.length > 0) {
          await Promise.all(sqaAnswers.map(async (ans) => {
            if (ans.sqaId && ans.chosen && ans.chosen !== "Unanswered") {
              await submitSQAAnswer(ans.sqaId, ans.questionId, ans.chosen, studentName, mobileNumber).catch(e => {
                console.error("Failed to submit SQA answer", e);
              });
            }
          }));
        }

        // Clear exam storage upon auto-submit
        localStorage.removeItem(`exam_questions_${mobileNumber.trim()}_${examId}`);
        localStorage.removeItem(`exam_progress_answers_${mobileNumber.trim()}_${examId}`);
        localStorage.removeItem(`exam_progress_index_${mobileNumber.trim()}_${examId}`);
        localStorage.removeItem(`exam_progress_score_${mobileNumber.trim()}_${examId}`);
        localStorage.removeItem(`exam_student_name_${examId}`);
        localStorage.removeItem(`exam_student_mobile_${examId}`);
      } catch (err) {
        console.error("Failed to save auto-submitted attempt:", err);
      }
    }
    
    setView("result");
    Swal.fire({
      title: "Time is Up!",
      text: "The exam duration has ended. Your responses have been submitted automatically.",
      icon: "warning",
      confirmButtonColor: "#3b82f6",
    });
  };

  // Copy prevention & assessment page lock effect
  useEffect(() => {
    if (view !== "quiz") return;

    const preventDefault = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+C, Ctrl+V
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
        (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 67 || e.keyCode === 86)) ||
        (e.metaKey && (e.keyCode === 85 || e.keyCode === 67 || e.keyCode === 86))
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("keydown", handleKeyDown);

    // Apply select-none to body during exam
    document.body.classList.add("select-none");

    return () => {
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("cut", preventDefault);
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("select-none");
    };
  }, [view]);

  // Countdown Timer Effect
  useEffect(() => {
    if (!isScheduledExam || timeRemaining <= 0 || view !== "quiz") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isScheduledExam, timeRemaining, view]);

  // Load scheduled exam if examId is in URL
  useEffect(() => {
    if (!examId) return;

    const loadScheduledExam = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch exam info
        const exam = await getExamById(examId);
        setExamDetails(exam);

        const savedName = localStorage.getItem(`exam_student_name_${examId}`);
        const savedMobile = localStorage.getItem(`exam_student_mobile_${examId}`);
        if (savedName && savedMobile) {
          setStudentName(savedName);
          setMobileNumber(savedMobile);
        }

        if (exam.status === "Inactive") {
          setError("This exam is currently inactive.");
          setLoading(false);
          return;
        }

        // 2. Validate date and time
        const startDateTime = parseExamStart(exam.examDate, exam.examTime);
        const durationMinutes = parseDurationMinutes(exam.duration);
        const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);

        const now = new Date();

        if (now < startDateTime) {
          setError("This exam has not started yet.");
          setLoading(false);
          return;
        }

        if (now > endDateTime) {
          setError("This exam has already expired/completed.");
          setLoading(false);
          return;
        }

        // 3. Load MCQs & SQAs for this exam
        const [mcqs, sqaDoc] = await Promise.all([
          getMCQsByExam(examId).catch(() => []),
          getSQAByExam(examId).catch(() => null)
        ]);

        const mcqQuestions = mcqs.map(q => ({ ...q, type: "mcq" }));
        const sqaQuestions = (sqaDoc && sqaDoc.questions) ? sqaDoc.questions.map(q => ({
          ...q,
          type: "sqa",
          options: [],
          correctAnswer: "",
          marks: q.maxMarks || 5,
          sqaId: sqaDoc._id
        })) : [];

        const combinedQuestions = [...mcqQuestions, ...sqaQuestions];

        if (combinedQuestions.length === 0) {
          setError("No questions found for this exam. Please contact the administrator.");
          setLoading(false);
          return;
        }

        // 4. Initialize exam state
        setAllQuestions(combinedQuestions);
        setQuizQuestions(combinedQuestions); // Show all questions for the actual exam
        setIsScheduledExam(true);
        setCurrentIndex(0);
        setScore(0);
        setUserAnswers([]);
        setSelectedAnswer("");
        setIsAnswered(false);

        // Calculate remaining seconds
        const remainingSecs = Math.floor((endDateTime - now) / 1000);
        setTimeRemaining(remainingSecs);

        // Show registration instead of jumping directly to quiz
        setShowRegistration(true);
      } catch (err) {
        console.error(err);
        setError("Failed to load exam details. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    loadScheduledExam();
  }, [examId]);


  const handleRegisterExam = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !mobileNumber.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter your name and mobile number.",
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    if (mobileNumber.trim().length < 10) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter a valid mobile number.",
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    try {
      setCheckingAttempt(true);
      const checkRes = await checkExamAttempt(examId, mobileNumber.trim());
      if (checkRes.hasAttempted) {
        Swal.fire({
          title: "Exam Already Attempted",
          text: "This mobile number has already attempted this exam. You cannot retake it. However, you can view your previous result directly.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "View My Result",
          cancelButtonText: "Close",
          confirmButtonColor: "#3b82f6",
        }).then((result) => {
          if (result.isConfirmed) {
            const prevAttempt = checkRes.attempt;
            setAlreadyAttemptedData(prevAttempt);
            setStudentName(prevAttempt.studentName);
            setMobileNumber(prevAttempt.mobileNumber);
            setScore(prevAttempt.score);
            const reconstructed = prevAttempt.answers.map(ans => ({
              questionId: ans.questionId,
              questionText: ans.questionText,
              options: [],
              chosen: ans.chosenAnswer,
              correct: ans.correctAnswer,
              isCorrect: ans.isCorrect,
              explanation: "",
              marks: ans.marks,
            }));
            setUserAnswers(reconstructed);
            setShowRegistration(false);
            setView("result");
          }
        });
      } else {
        // Save registration details
        localStorage.setItem(`exam_student_name_${examId}`, studentName);
        localStorage.setItem(`exam_student_mobile_${examId}`, mobileNumber.trim());

        const storageKey = `exam_questions_${mobileNumber.trim()}_${examId}`;
        const cachedQuestions = localStorage.getItem(storageKey);
        
        let randomized;
        if (cachedQuestions) {
          try {
            randomized = JSON.parse(cachedQuestions);
          } catch (e) {
            console.error("Failed to parse cached questions", e);
          }
        }

        if (!randomized || !Array.isArray(randomized) || randomized.length === 0) {
          // Shuffle question order
          const shuffledQuestions = shuffleArray(allQuestions);
          // Shuffle options for each question
          randomized = shuffledQuestions.map(q => {
            if ((q.type === "mcq" || !q.type) && q.options && q.options.length > 0) {
              return {
                ...q,
                options: shuffleArray(q.options)
              };
            }
            return q;
          });
          localStorage.setItem(storageKey, JSON.stringify(randomized));
        }

        // Restore progress if any exists
        const progressAnswers = localStorage.getItem(`exam_progress_answers_${mobileNumber.trim()}_${examId}`);
        const progressIndex = localStorage.getItem(`exam_progress_index_${mobileNumber.trim()}_${examId}`);
        const progressScore = localStorage.getItem(`exam_progress_score_${mobileNumber.trim()}_${examId}`);
        
        if (progressAnswers) {
          try {
            setUserAnswers(JSON.parse(progressAnswers));
          } catch(e) {}
        } else {
          setUserAnswers([]);
        }
        
        if (progressIndex) {
          setCurrentIndex(Number(progressIndex) || 0);
        } else {
          setCurrentIndex(0);
        }

        if (progressScore) {
          setScore(Number(progressScore) || 0);
        } else {
          setScore(0);
        }

        setQuizQuestions(randomized);
        setSelectedAnswer("");
        setIsAnswered(false);
        setShowRegistration(false);
        setView("quiz");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to verify exam attempt. Please try again.",
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setCheckingAttempt(false);
    }
  };

  // Load subjects on mount (only for practice hub mode)
  useEffect(() => {
    if (examId) return;

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
  }, [examId]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center text-slate-500 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mb-4" />
        <p className="font-semibold text-sm">Loading MCQ Assessment Hub...</p>
      </div>
    );
  }

  // Shuffle questions helper
  const prepareQuiz = (questions) => {
    // Shuffle the array of active questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    // Take minimum to maximum 10 questions
    const selected = shuffled.slice(0, 10);
    const selectedWithShuffledOptions = selected.map(q => {
      if ((q.type === "mcq" || !q.type) && q.options && q.options.length > 0) {
        return {
          ...q,
          options: shuffleArray(q.options)
        };
      }
      return q;
    });
    setQuizQuestions(selectedWithShuffledOptions);
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
    if (isScheduledExam) {
      setSelectedAnswer(option);
    } else {
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
    }
  };

  const saveProgress = (index, answers, currentScore) => {
    if (!isScheduledExam || !mobileNumber) return;
    localStorage.setItem(`exam_progress_index_${mobileNumber.trim()}_${examId}`, index.toString());
    localStorage.setItem(`exam_progress_answers_${mobileNumber.trim()}_${examId}`, JSON.stringify(answers));
    localStorage.setItem(`exam_progress_score_${mobileNumber.trim()}_${examId}`, currentScore.toString());
  };

  // Go to next question or show results
  const handleNext = async () => {
    let updatedAnswers = [...userAnswers];

    if (isScheduledExam) {
      const currentQuestion = quizQuestions[currentIndex];
      const isMcq = currentQuestion.type === "mcq" || !currentQuestion.type;
      const isCorrect = isMcq ? (selectedAnswer.trim() === currentQuestion.correctAnswer.trim()) : null;
      const currentAnswerObj = {
        questionId: currentQuestion.id || currentQuestion._id,
        questionText: currentQuestion.question,
        options: currentQuestion.options || [],
        chosen: selectedAnswer || "Unanswered",
        correct: isMcq ? currentQuestion.correctAnswer : "",
        isCorrect,
        explanation: currentQuestion.explanation || "",
        marks: currentQuestion.marks || 1,
        type: currentQuestion.type || "mcq",
        sqaId: currentQuestion.sqaId || null
      };
      updatedAnswers.push(currentAnswerObj);
      setUserAnswers(updatedAnswers);
    }

    if (currentIndex < quizQuestions.length - 1) {
      let finalScore = score;
      if (isScheduledExam) {
        const currentQuestion = quizQuestions[currentIndex];
        const isMcq = currentQuestion.type === "mcq" || !currentQuestion.type;
        if (isMcq) {
          const isCorrect = selectedAnswer.trim() === currentQuestion.correctAnswer.trim();
          if (isCorrect) {
            finalScore = score + (currentQuestion.marks || 1);
            setScore(finalScore);
          }
        }
      }
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer("");
      setIsAnswered(false);
      
      // Save progress to local storage
      saveProgress(nextIndex, updatedAnswers, finalScore);
    } else {
      if (isScheduledExam) {
        try {
          setLoading(true);
          const mcqAnswers = updatedAnswers.filter(ans => ans.type === "mcq" || !ans.type);
          const totalMcqPossible = quizQuestions.filter(q => q.type === "mcq" || !q.type).reduce((acc, q) => acc + (q.marks || 1), 0);
          const totalSqaPossible = quizQuestions.filter(q => q.type === "sqa").reduce((acc, q) => acc + (q.marks || q.maxMarks || 5), 0);
          
          const lastQuestion = quizQuestions[currentIndex];
          const isLastMcq = lastQuestion.type === "mcq" || !lastQuestion.type;
          const lastCorrect = isLastMcq ? (selectedAnswer.trim() === lastQuestion.correctAnswer.trim()) : false;
          const finalScore = lastCorrect ? (score + (lastQuestion.marks || 1)) : score;

          const attemptData = {
            studentName,
            mobileNumber,
            examId,
            score: finalScore,
            totalPossibleScore: totalMcqPossible + totalSqaPossible,
            answers: mcqAnswers.map(ans => ({
              questionId: ans.questionId,
              questionText: ans.questionText,
              chosenAnswer: ans.chosen,
              correctAnswer: ans.correct,
              isCorrect: ans.isCorrect,
              marks: ans.marks,
            })),
          };
          await submitExamAttempt(attemptData);

          // Submit SQA Answers
          const sqaAnswers = updatedAnswers.filter(ans => ans.type === "sqa");
          if (sqaAnswers.length > 0) {
            await Promise.all(sqaAnswers.map(async (ans) => {
              if (ans.sqaId && ans.chosen && ans.chosen !== "Unanswered") {
                await submitSQAAnswer(ans.sqaId, ans.questionId, ans.chosen, studentName, mobileNumber).catch(e => {
                  console.error("Failed to submit SQA answer", e);
                });
              }
            }));
          }

          // Clear exam storage upon successful submission
          localStorage.removeItem(`exam_questions_${mobileNumber.trim()}_${examId}`);
          localStorage.removeItem(`exam_progress_answers_${mobileNumber.trim()}_${examId}`);
          localStorage.removeItem(`exam_progress_index_${mobileNumber.trim()}_${examId}`);
          localStorage.removeItem(`exam_progress_score_${mobileNumber.trim()}_${examId}`);
          localStorage.removeItem(`exam_student_name_${examId}`);
          localStorage.removeItem(`exam_student_mobile_${examId}`);
        } catch (err) {
          console.error("Failed to save attempt:", err);
        } finally {
          setLoading(false);
        }
      }
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

        {showRegistration ? (
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300 animate-in fade-in zoom-in-95">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-950/40 dark:text-primary-400">
                Assessment Verification
              </span>
              <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
                Enter Exam Credentials
              </h2>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Please provide your credentials to begin the exam <strong>{examDetails?.examName}</strong>.
              </p>
            </div>

            <form onSubmit={handleRegisterExam} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 outline-none text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 placeholder:text-slate-400 transition hover:border-slate-300 focus:border-primary-500 focus:shadow-glow-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 outline-none text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 placeholder:text-slate-400 transition hover:border-slate-300 focus:border-primary-500 focus:shadow-glow-blue"
                />
              </div>

              <button
                type="submit"
                disabled={checkingAttempt}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 px-4 font-bold text-white shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {checkingAttempt ? "Verifying..." : "Verify & Start Exam"}
              </button>
            </form>
          </div>
        ) : (
          <>
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
              <div className="animate-in fade-in zoom-in-95 duration-200 select-none">
                {/* Quiz Navigation Header */}
                <div className="mb-8 flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      const msg = isScheduledExam
                        ? "Are you sure you want to exit the exam? You can only take it during the scheduled duration."
                        : "Are you sure you want to quit the quiz? Your current progress will be lost.";
                      if (confirm(msg)) {
                        if (isScheduledExam) {
                          router.push("/learning/exam-information");
                        } else {
                          setView("select");
                        }
                      }
                    }}
                    className="btn-secondary px-4 py-2 text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Exit Test
                  </button>

                  {isScheduledExam && (
                    <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl text-rose-700 font-bold border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30">
                      <span className="animate-pulse">⏳ Time Remaining: {(() => {
                        const mins = Math.floor(timeRemaining / 60);
                        const secs = timeRemaining % 60;
                        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
                      })()}</span>
                    </div>
                  )}

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {isScheduledExam ? "Exam:" : "Subject:"}
                    </span>
                    <span className="block text-sm font-bold text-slate-800 dark:text-white">
                      {isScheduledExam ? examDetails?.examName : selectedSubject}
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
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-relaxed flex items-center gap-2">
                      {quizQuestions[currentIndex].question}
                      {quizQuestions[currentIndex].type === "sqa" && (
                        <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          Short Answer
                        </span>
                      )}
                    </h3>

                    {/* CONDITION: MCQ options or SQA textarea */}
                    {(quizQuestions[currentIndex].type === "mcq" || !quizQuestions[currentIndex].type) ? (
                      <div className="mt-8 grid gap-4">
                        {quizQuestions[currentIndex].options.map((option, idx) => {
                          const isOptionSelected = selectedAnswer.trim() === option.trim();
                          const isOptionCorrect = option.trim() === quizQuestions[currentIndex].correctAnswer.trim();

                          let buttonStyle = "border-slate-200 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/55 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80";
                          if (isAnswered) {
                            if (isOptionCorrect) {
                              buttonStyle = "border-emerald-500 bg-emerald-50/20 text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold";
                            } else if (isOptionSelected) {
                              buttonStyle = "border-red-500 bg-red-50/20 text-red-800 dark:border-red-500/50 dark:bg-red-950/20 dark:text-red-400 font-bold";
                            } else {
                              buttonStyle = "border-slate-100 bg-white/40 text-slate-400 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-600 opacity-60";
                            }
                          } else if (isOptionSelected) {
                            buttonStyle = "border-primary-500 bg-primary-50/30 text-primary-900 dark:border-primary-500/80 dark:bg-primary-950/20 dark:text-primary-350 font-bold ring-2 ring-primary-500/20 shadow-sm";
                          }

                          return (
                            <button
                              key={idx}
                              disabled={isAnswered}
                              onClick={() => handleSelectOption(option)}
                              className={`flex items-start gap-4 rounded-2xl border p-4.5 text-left text-sm transition-all duration-200 active:scale-[0.99] select-none ${
                                !isAnswered ? "cursor-pointer" : "cursor-default"
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
                    ) : (
                      <div className="mt-8 space-y-2">
                        <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">
                          Your Short Answer Response
                        </label>
                        <textarea
                          rows={4}
                          value={selectedAnswer}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          placeholder="Type your descriptive answer response here..."
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4.5 outline-none text-sm text-slate-800 focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950 transition-all shadow-inner"
                        />
                      </div>
                    )}

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
                    {(isAnswered || isScheduledExam) ? (
                      <button
                        onClick={handleNext}
                        className="btn-primary px-7 py-3 cursor-pointer flex items-center gap-1.5"
                      >
                        {currentIndex < quizQuestions.length - 1 ? (
                          <>
                            Next Question <ArrowRight size={16} />
                          </>
                        ) : (
                          "Finish Exam"
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
              isScheduledExam && !is5MinutesPassed ? (
                <div className="mx-auto max-w-xl text-center rounded-3xl border border-slate-200 bg-white p-8 shadow-premium dark:border-slate-800 dark:bg-slate-900/60 animate-in fade-in zoom-in-95">
                  <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4 animate-bounce" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Exam Submitted Successfully!
                  </h2>
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Thank you, <strong>{studentName}</strong>. Your responses for the exam <strong>{examDetails?.examName}</strong> have been securely recorded.
                  </p>
                  <div className="my-6 rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100/50 text-indigo-700 text-xs font-semibold dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-400">
                    🔒 Results and detailed scorecards will be released once published by the Administrator.
                  </div>
                  <button
                    onClick={() => router.push("/learning/exam-information")}
                    className="btn-primary px-6 py-3 font-bold text-sm cursor-pointer mx-auto flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft size={16} /> Back to Exam Information
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  {/* Visual Ring and Score Banner */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-premium text-center dark:border-slate-800 dark:bg-slate-900/60 mb-8">
                    <Award size={48} className="mx-auto text-indigo-500 mb-4" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                      {isScheduledExam ? "Exam Completed!" : "Quiz Completed!"}
                    </h2>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-1 items-center justify-center">
                      {isScheduledExam ? (
                        <>
                          <p>Exam: <span className="font-bold text-indigo-600 dark:text-indigo-400">{examDetails?.examName}</span></p>
                          <p className="text-xs text-slate-400">Student: <span className="font-bold">{studentName}</span> ({mobileNumber})</p>
                        </>
                      ) : (
                        <p>Subject: <span className="font-bold">{selectedSubject}</span></p>
                      )}
                    </div>

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
                      let title = isScheduledExam ? "Exam Finished!" : "Practice Completed!";
                      let description = isScheduledExam 
                        ? "Your answers have been securely recorded. You may now safely exit." 
                        : "Keep playing quizzes to boost your knowledge.";

                      if (pct === 100) {
                        title = "🏆 Perfect Score! Excellent Work!";
                        description = isScheduledExam
                          ? "Fantastic! You answered every exam question perfectly. Your score has been submitted."
                          : "You answered every question flawlessly. You've fully mastered this quiz!";
                      } else if (pct >= 70) {
                        title = "🎉 Great Job! You passed!";
                        description = "An excellent score! You show a solid grasp of this subject.";
                      } else if (pct >= 40) {
                        title = "👍 Good Effort! Keep practicing!";
                        description = isScheduledExam
                          ? "You have completed the exam. Good effort!"
                          : "A fair score. Run through the practice sets again to cover missing concepts.";
                      } else {
                        title = isScheduledExam ? "Exam Completed" : "📚 Keep learning and try again!";
                        description = isScheduledExam
                          ? "Your exam responses have been saved."
                          : "Review the notes and study guides, and give this quiz another shot.";
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
                      {isScheduledExam ? (
                        <button
                          onClick={() => router.push("/learning/exam-information")}
                          className="btn-primary px-6 py-3 font-bold text-sm cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ArrowLeft size={16} /> Back to Exam Information
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleRestartQuiz}
                            className="btn-primary px-6 py-3 font-bold text-sm cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <RefreshCw size={16} /> Retake Test
                          </button>

                          <button
                            onClick={() => setView("select")}
                            className="btn-secondary px-6 py-3 font-bold text-sm cursor-pointer"
                          >
                            Choose Another Subject
                          </button>
                        </>
                      )}
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
              )
            )}
          </>
        )}
      </div>
    </main>
  );
}
