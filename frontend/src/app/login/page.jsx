"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;

    setDarkMode(next);

    document.documentElement.classList.toggle("dark", next);

    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    localStorage.setItem("role", role);

    if (role === "admin") {
      router.push("/admin/topper-student");
    } else {
      router.push("/student/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary-500/10 blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[80px]" />

      {/* Theme Button */}
      <button
        onClick={toggleTheme}
        className="absolute right-6 top-6 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 shadow-md dark:border-slate-800 dark:bg-slate-900/80 transition-all hover:scale-105 cursor-pointer text-slate-700 dark:text-slate-200"
      >
        {darkMode ? (
          <Sun className="text-amber-500" size={20} />
        ) : (
          <Moon size={20} />
        )}
      </button>

      <div className="w-full max-w-md rounded-3xl bg-white p-8 border border-slate-100 shadow-2xl dark:bg-slate-900 dark:border-slate-800/85 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1.5">
            Log in to access your Kalinga workspace
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`rounded-2xl border p-4 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
              role === "student"
                ? "bg-gradient-to-br from-primary-600 to-indigo-600 border-primary-500 text-white shadow-md shadow-primary-500/15"
                : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/50 dark:bg-slate-950/20 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-950/50"
            }`}
          >
            <User className="mb-2 h-6 w-6" />
            <span className="text-sm font-bold">Student</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`rounded-2xl border p-4 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
              role === "admin"
                ? "bg-gradient-to-br from-primary-600 to-indigo-600 border-primary-500 text-white shadow-md shadow-primary-500/15"
                : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/50 dark:bg-slate-950/20 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-950/50"
            }`}
          >
            <ShieldCheck className="mb-2 h-6 w-6" />
            <span className="text-sm font-bold">Admin</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3.5 text-sm font-bold shadow-md cursor-pointer mt-2"
          >
            Login as {role === "admin" ? "Admin" : "Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
