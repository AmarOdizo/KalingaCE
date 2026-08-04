"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import StatusBadge from "./StatusBadge";
import { formatFees, getCourseImage } from "../utils";

export default function CourseTable({ courses, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Duration</th>
            <th className="p-3 text-left">Fees</th>
            <th className="p-3 text-left">Students</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                <Image
                  src={getCourseImage(course.image)}
                  alt={course.courseName}
                  width={70}
                  height={70}
                  className="rounded-lg object-cover"
                />
              </td>

              <td className="p-3 font-semibold">{course.courseName}</td>

              <td className="p-3">{course.courseCode}</td>

              <td className="p-3">{course.duration}</td>

              <td className="p-3">{formatFees(course.fees)}</td>

              <td className="p-3">{course.students}</td>

              <td className="p-3">
                <StatusBadge status={course.status} />
              </td>

              <td className="p-3">
                <div className="flex justify-center gap-2">
                  <Link
                    href={`/available-courses/view/${course.id}`}
                    className="rounded bg-blue-600 p-2 text-white"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    href={`/available-courses/edit/${course.id}`}
                    className="rounded bg-yellow-500 p-2 text-white"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    onClick={() => onDelete(course)}
                    className="rounded bg-red-600 p-2 text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
