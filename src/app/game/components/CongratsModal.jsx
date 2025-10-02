"use client";

import { BeatLoader } from "react-spinners";

export default function CongratsModal({
  onClose,
  onNext,
  streak,
  factData,
  onShare,
  loading,
}) {
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[92vw] max-w-md rounded-2xl bg-white shadow-2xl border p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-lg font-bold text-slate-800">
          Good job! Naik Level 🎉
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Kamu berhasil memilah sampah hari ini.
        </p>

        <div className="mt-3 rounded-lg border bg-emerald-50 px-3 py-2 text-emerald-700">
          🔥 Streak: <b>{streak}</b> hari
        </div>

        <div className="mt-3 min-h-[84px]">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <BeatLoader size={10} />
            </div>
          ) : (
            <blockquote className="text-sm italic text-slate-700 border-l-4 border-slate-200 pl-3">
              “{factData.fact}”
              <div className="mt-1 not-italic text-xs text-slate-500">
                — {factData.source}
              </div>
            </blockquote>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={onShare}
            disabled={loading}
            className="rounded-lg border px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Menyiapkan..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}
