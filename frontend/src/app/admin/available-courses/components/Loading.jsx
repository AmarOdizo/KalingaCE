"use client";

export default function Loading() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/60 dark:divide-slate-800/60">
          <thead className="bg-slate-50/70 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
            <tr>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500/50 dark:text-slate-400/50">Image</th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500/50 dark:text-slate-400/50">Course</th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500/50 dark:text-slate-400/50 hidden sm:table-cell">Code</th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500/50 dark:text-slate-400/50 hidden sm:table-cell">Duration</th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500/50 dark:text-slate-400/50">Fees</th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500/50 dark:text-slate-400/50 hidden md:table-cell">Students</th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500/50 dark:text-slate-400/50">Status</th>
              <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider text-slate-500/50 dark:text-slate-400/50">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 bg-transparent">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800/70"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800/70"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800/70"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800/70"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800/70"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800/70"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800/70"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800/70"></div>
                    <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800/70"></div>
                    <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800/70"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
