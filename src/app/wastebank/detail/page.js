"use client";

import dynamic from "next/dynamic";
import DetailWasteBank from "../components/DetailWasteBank";
import MaterialSection from "../components/MaterialSection";

const GridMotionBg = dynamic(() => import("../components/GridMotionBg"), {
  ssr: false,
});

export default function DetailPage() {
  return (
    <main className="relative min-h-dvh">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden md:block"
      >
        <GridMotionBg className="h-full w-full" />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      </div>

      {/* MOBILE */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 md:hidden bg-gradient-to-b from-slate-100 to-white"
      />

      {/* CARD WRAPPER */}
      <section className="w-full md:py-30 md:px-30 ">
        <div className="mx-auto max-w-3xl">
          <div className="md:rounded-2xl md:border md:border-slate-200 bg-white shadow-xl overflow-hidden">
            {/* HEADER */}
            <div className="px-5 md:px-8 py-6 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Lokasi Pembuangan Sampah
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Pilih lokasi kamu, atur radius, lalu cari TPA/Bank Sampah
                terdekat.
              </p>
            </div>

            <div className="px-5 md:px-8 py-6 space-y-8">
              {/* SECTION: MAP */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-800">
                  Peta Lokasi
                </div>
                <DetailWasteBank />
                <hr className="border-slate-200" />
                <MaterialSection />
              </div>

              <div className="px-5 md:px-8 py-4 border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500">
                  Tips: geser pin di peta untuk mengatur titik, lalu klik “Cari
                  TPA”.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
