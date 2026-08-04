"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api/Student";

export default function TopStudents() {
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get(API_URL);

      // Percentage ke hisab se sort
      const topperStudents = res.data.data
        .map((student) => ({
          ...student,
          percentage:
            student.totalMark > 0
              ? ((student.gainMark / student.totalMark) * 100).toFixed(2)
              : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 4);

      setStudents(topperStudents);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/Student/${id}`);

      setSelectedStudent(res.data.data);
      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xl font-semibold">Loading...</div>
    );
  }

  return (
    <section className="bg-gray-100 py-16 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white">
          🏆 Top Students
        </h2>

        <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
          Meet our outstanding learners who achieved excellence.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-xl dark:bg-gray-900"
            >
              <Image
                src={student.image}
                alt={student.name}
                width={100}
                height={100}
                className="mx-auto h-24 w-24 rounded-full border-4 border-blue-500 object-cover"
              />

              <h3 className="mt-4 text-center text-xl font-bold dark:text-white">
                {student.name}
              </h3>

              <p className="text-center text-gray-600 dark:text-gray-300">
                {student.subject}
              </p>

              <p className="mt-2 text-center font-semibold text-green-600">
                {student.percentage}%
              </p>

              <button
                onClick={() => handleViewProfile(student.id)}
                className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
      {open && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            {/* Close Button */}
            <button
              onClick={() => {
                setOpen(false);
                setSelectedStudent(null);
              }}
              className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-red-600"
            >
              ✕
            </button>

            <Image
              src={selectedStudent.image}
              alt={selectedStudent.name}
              width={140}
              height={140}
              className="mx-auto h-36 w-36 rounded-full border-4 border-blue-500 object-cover"
            />

            <h2 className="mt-4 text-center text-2xl font-bold dark:text-white">
              {selectedStudent.name}
            </h2>

            <p className="text-center text-blue-600">
              {selectedStudent.subject}
            </p>

            <div className="mt-6 space-y-3">
              <p>
                <strong>Batch:</strong> {selectedStudent.batch}
              </p>
              <p>
                <strong>Total Mark:</strong> {selectedStudent.totalMark}
              </p>
              <p>
                <strong>Gain Mark:</strong> {selectedStudent.gainMark}
              </p>
              <p>
                <strong>Percentage:</strong>{" "}
                {(
                  (selectedStudent.gainMark / selectedStudent.totalMark) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
