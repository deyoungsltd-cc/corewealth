'use client';

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-[#7C3AED] mb-2">Something went wrong</h2>
        <p className="text-gray-400 text-sm mb-6">We encountered an error loading this page.</p>
        <button onClick={reset} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
}
