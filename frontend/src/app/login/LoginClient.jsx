"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sun, Moon, User, Lock, ArrowRight } from "lucide-react";

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


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      
      {/* Dynamic Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[90px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-violet-500/10 blur-[90px]" />


      {/* Login Card */}
      <div className="w-full max-w-md rounded-3xl bg-white p-8 border border-slate-200/85 shadow-premium dark:bg-slate-900 dark:border-slate-805 relative z-10">
        
        {/* Logo Container */}
        <div className="mb-6 flex flex-col items-center">
          <div className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm shrink-0 mb-4">
            <Image
              src="/klogo.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-lg object-contain"
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Admin Portal
          </h1>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Kalinga Computer Education
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/35 p-4 text-xs font-semibold text-rose-700 dark:text-rose-455">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Identity/Username */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Email or Phone Number
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="login-username"
                type="text"
                placeholder="Enter email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 py-3 pl-11 pr-4 outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 focus:bg-white dark:focus:bg-slate-900"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 py-3 pl-11 pr-4 outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 focus:bg-white dark:focus:bg-slate-900"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-xs font-extrabold text-white shadow-md hover:from-indigo-700 hover:to-indigo-800 transition duration-150 active:scale-97 cursor-pointer disabled:opacity-50 mt-6"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Logging in...
              </>
            ) : (
              <>
                Login as Admin
                <ArrowRight size={14} />
              </>
            )}
          </button>

        </form>
      </div>
    </main>
  );
}
