'use client';

import React, { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { logClientError } from '@/lib/logger';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logClientError(error, { digest: error.digest, boundary: 'app' });
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F8FA] px-6">
      <section role="alert" className="max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">!</div>
        <h1 className="text-lg font-bold text-slate-900">5days needs a refresh</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">The workspace hit an unexpected error. Your saved building data is not changed.</p>
        <button onClick={reset} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
      </section>
    </main>
  );
}
