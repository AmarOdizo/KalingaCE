"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const timer = setTimeout(() => {
      setDarkMode(isDark);
    }, 0);
    document.documentElement.classList.toggle("dark", isDark);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;

    setDarkMode(next);

    document.documentElement.classList.toggle("dark", next);

    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://kalingace-4.onrender.com/api/Admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: email,
          password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Invalid credentials");
      }

      localStorage.setItem("role", "admin");
      localStorage.setItem("adminUser", JSON.stringify(result.data));
      router.push("/admin/contact");
    } catch (err) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary-500/10 blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[80px]" />

      {/* Theme Button */}
      <button
        id="theme-toggle-btn"
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
            Admin Portal
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1.5">
            Log in to access your Kalinga workspace
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Email or Phone Number
            </label>

            <input
              id="login-username"
              type="text"
              placeholder="Enter email or phone number"
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
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 text-sm font-bold shadow-md cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}
