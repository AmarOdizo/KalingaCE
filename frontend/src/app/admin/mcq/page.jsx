"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MCQRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams ? searchParams.toString() : "";
    router.replace(`/admin/question-form${query ? `?${query}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 mx-auto" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Redirecting to Question Form...</p>
      </div>
    </div>
  );
}

export default function MCQRedirectPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    }>
      <MCQRedirectInner />
    </Suspense>
  );
}
