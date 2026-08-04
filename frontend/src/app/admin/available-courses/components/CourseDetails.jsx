"use client";

import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { formatFees, getCourseImage } from "../utils";

export default function CourseDetails({ course }) {
  if (!course) return null;

  return (
    <div className="space-y-8">
      <Image
        src={getCourseImage(course.image)}
        alt={course.courseName}
        width={900}
        height={450}
        className="h-80 w-full rounded-xl object-cover"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">{course.courseName}</h2>

          <p className="text-gray-500">{course.courseCode}</p>
        </div>

        <StatusBadge status={course.status} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard title="Duration" value={course.duration} />
        <InfoCard title="Eligibility" value={course.eligibility} />
        <InfoCard title="Fees" value={formatFees(course.fees)} />
        <InfoCard title="Students" value={course.students} />
        <InfoCard title="Trainer" value={course.trainer} />
        <InfoCard title="Mode" value={course.mode} />
        <InfoCard title="Certificate" value={course.certificate} />
        <InfoCard title="Batch" value={course.batchTiming} />
      </div>

      <Section title="Short Description" text={course.shortDescription} />

      <Section title="Full Description" text={course.fullDescription} />

      <ListSection title="Technologies" items={course.technologies} />

      <ListSection title="Features" items={course.features} />

      <ListSection title="Syllabus" items={course.syllabus} />
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="mt-1 font-semibold">{value || "-"}</h3>
    </div>
  );
}

function Section({ title, text }) {
  return (
    <div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>

      <p className="leading-7 text-gray-700">{text}</p>
    </div>
  );
}

function ListSection({ title, items }) {
  return (
    <div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>

      <div className="flex flex-wrap gap-2">
        {items?.map((item, index) => (
          <span
            key={index}
            className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
