"use client";

import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { formatFees, getCourseImage, formatDuration, formatStudents } from "../utils";

export default function CourseDetails({ course }) {
  if (!course) return null;

  return (
    <div className="space-y-8">
      <div className="relative h-48 sm:h-80 w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
        <Image
          src={getCourseImage(course.image)}
          alt={course.courseName}
          width={900}
          height={450}
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/40 pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{course.courseName}</h2>
          <p className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">{course.courseCode}</p>
        </div>

        <StatusBadge status={course.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <InfoCard title="Duration" value={formatDuration(course.duration)} />
        <InfoCard title="Eligibility" value={course.eligibility} />
        <InfoCard title="Fees" value={formatFees(course.fees)} />
        <InfoCard title="Students" value={formatStudents(course.students)} />
        <InfoCard title="Trainer" value={course.trainer} />
        <InfoCard title="Mode" value={course.mode} />
        <InfoCard title="Certificate" value={course.certificate} />
        <InfoCard title="Batch" value={course.batchTiming} />
      </div>

      <div className="grid gap-8 md:grid-cols-2 pt-2">
        <div className="space-y-6">
          <Section title="Short Description" text={course.shortDescription} />
          <Section title="Full Description" text={course.fullDescription} />
        </div>

        <div className="space-y-6">
          <ListSection title="Technologies" items={course.technologies} badgeStyle="bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400" />
          <ListSection title="Features" items={course.features} badgeStyle="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" />
          <ListSection title="Syllabus Topics" items={course.syllabus} badgeStyle="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</p>
      <h3 className="mt-1.5 font-extrabold text-slate-800 dark:text-white text-sm">{value || "-"}</h3>
    </div>
  );
}

function Section({ title, text }) {
  if (!text) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white border-l-4 border-primary-500 pl-3">{title}</h3>
      <p className="leading-relaxed text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line">{text}</p>
    </div>
  );
}

function ListSection({ title, items, badgeStyle }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white border-l-4 border-primary-500 pl-3">{title}</h3>
      <div className="flex flex-wrap gap-2 pt-1">
        {items.map((item, index) => (
          <span
            key={index}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${badgeStyle}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
