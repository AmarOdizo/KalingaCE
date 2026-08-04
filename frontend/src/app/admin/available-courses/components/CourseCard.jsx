"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2, Users } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatFees, getCourseImage } from "../utils";

export default function CourseCard({ course, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-lg">
      <Image
        src={getCourseImage(course.image)}
        alt={course.courseName}
        width={500}
        height={300}
        className="h-52 w-full object-cover"
      />

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{course.courseName}</h2>

          <StatusBadge status={course.status} />
        </div>

        <p className="text-sm text-gray-500">{course.courseCode}</p>

        <p className="line-clamp-2 text-sm text-gray-600">
          {course.shortDescription}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-blue-600">
            {formatFees(course.fees)}
          </span>

          <span>{course.duration}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          {course.students} Students
        </div>

        <div className="flex gap-2 pt-3">
          <Link
            href={`/available-courses/view/${course.id}`}
            className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
            <Eye size={18} />
          </Link>

          <Link
            href={`/available-courses/edit/${course.id}`}
            className="rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600"
          >
            <Pencil size={18} />
          </Link>

          <button
            onClick={() => onDelete(course)}
            className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
