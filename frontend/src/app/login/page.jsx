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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-5 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* Theme Button */}
      <button
        onClick={toggleTheme}
        className="absolute right-6 top-6 rounded-full bg-white p-3 shadow-lg dark:bg-gray-800"
      >
        {darkMode ? (
          <Sun className="text-yellow-400" size={22} />
        ) : (
          <Moon className="text-gray-700" size={22} />
        )}
      </button>

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Login
        </h1>

        {/* Role Selection */}

        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`rounded-xl border p-4 transition ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            }`}
          >
            <User className="mx-auto mb-2 h-7 w-7" />
            Student
          </button>

          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`rounded-xl border p-4 transition ${
              role === "admin"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            }`}
          >
            <ShieldCheck className="mx-auto mb-2 h-7 w-7" />
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full rounded-xl py-3 font-semibold text-white transition ${
              role === "admin"
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Login as {role === "admin" ? "Admin" : "Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
